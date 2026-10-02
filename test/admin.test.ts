import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it } from "vitest";
import { mailbox, message, session, user } from "@/db/schema";
import { adminPassword } from "@/lib/admin-session";
import { call, createMailbox, createUser, db, testEnv, unique } from "./helpers";

type Page<K extends string, T> = Record<K, T[]> & { nextCursor: string | null };
type ListedMessage = { id: string; toAddress: string; subject: string };

let admin = "";

beforeAll(async () => {
  await db();
  const login = await loginAdmin(adminPassword(testEnv)!);
  admin = login.cookie;
});

async function loginAdmin(password: string) {
  const request = new Request("https://mail.test/api/admin/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const { handleEdge } = await import("@/edge");
  const response = (await handleEdge(request, testEnv, { waitUntil: () => {} }))!;
  const setCookie = response.headers.get("set-cookie") ?? "";
  return { status: response.status, cookie: setCookie.split(";")[0] };
}

async function catchAllMailbox() {
  const d = await db();
  const [box] = await d
    .insert(mailbox)
    .values({ address: `${unique("ca")}@example.com`, catchAll: true, expiresAt: new Date(Date.now() + 86_400_000) })
    .returning();
  const [msg] = await d.insert(message).values({ mailboxId: box.id, fromAddress: "spam@x.y", subject: "catch me" }).returning();
  return { box, msg };
}

describe("管理员登录", () => {
  it("密码错误时拒绝", async () => {
    const { status, cookie } = await loginAdmin("wrong-password");
    expect(status).toBe(401);
    expect(cookie).toBe("");
  });

  it("未登录访问管理接口返回 401，普通用户的会话也不行", async () => {
    const someone = await createUser("plain");
    expect((await call("GET", "/api/admin/users")).status).toBe(401);
    expect((await call("GET", "/api/admin/users", { as: someone })).status).toBe(401);
    expect((await call("GET", "/api/admin/messages?scope=catchAll", { cookie: "admin_session=forged" })).status).toBe(401);
  });

  it("会话状态反映登录情况", async () => {
    expect((await call("GET", "/api/admin/session")).body).toEqual({ enabled: true, admin: false });
    expect((await call("GET", "/api/admin/session", { cookie: admin })).body).toEqual({ enabled: true, admin: true });
  });

  it("没配置 ADMIN_PASSWORD 时整个后台关闭", async () => {
    const { handleEdge } = await import("@/edge");
    const env = { ...testEnv, ADMIN_PASSWORD: "" } as CloudflareEnv;
    const request = new Request("https://mail.test/api/admin/users", { headers: { cookie: admin } });
    const response = (await handleEdge(request, env, { waitUntil: () => {} }))!;
    expect(response.status).toBe(401);
  });
});

describe("用户管理", () => {
  it("按用户名搜索和按状态筛选", async () => {
    const active = await createUser("find");
    const disabled = await createUser("find", { disabled: true });
    const all = await call<Page<"users", { id: string }>>("GET", `/api/admin/users?q=${active.username}`, { cookie: admin });
    expect(all.body.users.map((u) => u.id)).toEqual([active.id]);
    const off = await call<Page<"users", { id: string; disabled: boolean }>>("GET", "/api/admin/users?status=disabled", { cookie: admin });
    expect(off.body.users.map((u) => u.id)).toContain(disabled.id);
    expect(off.body.users.every((u) => u.disabled)).toBe(true);
  });

  it("详情包含用户的邮箱和邮件数", async () => {
    const owner = await createUser("det");
    const { box } = await createMailbox(owner.id);
    const res = await call<{ user: { username: string; mailboxes: { address: string; total: number }[] } }>("GET", `/api/admin/users/${owner.id}`, {
      cookie: admin,
    });
    expect(res.body.user.username).toBe(owner.username);
    expect(res.body.user.mailboxes).toEqual([expect.objectContaining({ address: box.address, total: 1 })]);
  });

  it("停用后用户立即被登出，恢复后可以重新登录", async () => {
    const target = await createUser("off");
    expect((await call<{ user: unknown }>("GET", "/api/auth/session", { as: target })).body.user).not.toBeNull();
    const res = await call("PATCH", `/api/admin/users/${target.id}`, { cookie: admin, body: { disabled: true } });
    expect(res.status).toBe(200);
    const d = await db();
    expect(await d.select().from(session).where(eq(session.userId, target.id))).toEqual([]);
    expect((await d.select({ disabled: user.disabled }).from(user).where(eq(user.id, target.id)))[0].disabled).toBe(true);
    expect((await call<{ user: unknown }>("GET", "/api/auth/session", { as: target })).body.user).toBeNull();
    await call("PATCH", `/api/admin/users/${target.id}`, { cookie: admin, body: { disabled: false } });
    expect((await d.select({ disabled: user.disabled }).from(user).where(eq(user.id, target.id)))[0].disabled).toBe(false);
  });

  it("删除用户会连带删除邮箱和邮件", async () => {
    const target = await createUser("del");
    const { box, msg } = await createMailbox(target.id);
    expect((await call("DELETE", `/api/admin/users/${target.id}`, { cookie: admin })).status).toBe(204);
    const d = await db();
    expect(await d.select().from(user).where(eq(user.id, target.id))).toEqual([]);
    expect(await d.select().from(mailbox).where(eq(mailbox.id, box.id))).toEqual([]);
    expect(await d.select().from(message).where(eq(message.id, msg.id))).toEqual([]);
    expect((await call("DELETE", `/api/admin/users/${target.id}`, { cookie: admin })).status).toBe(404);
  });
});

describe("邮件查看", () => {
  it("列出某个用户所有邮箱里的邮件，可以按邮箱筛选", async () => {
    const owner = await createUser("mail");
    const a = await createMailbox(owner.id);
    const b = await createMailbox(owner.id);
    const other = await createMailbox(null);
    const all = await call<Page<"messages", ListedMessage>>("GET", `/api/admin/messages?userId=${owner.id}`, { cookie: admin });
    expect(all.body.messages.map((m) => m.id).sort()).toEqual([a.msg.id, b.msg.id].sort());
    expect(all.body.messages.map((m) => m.id)).not.toContain(other.msg.id);
    const one = await call<Page<"messages", ListedMessage>>("GET", `/api/admin/messages?userId=${owner.id}&address=${encodeURIComponent(a.box.address)}`, {
      cookie: admin,
    });
    expect(one.body.messages).toEqual([expect.objectContaining({ id: a.msg.id, toAddress: a.box.address })]);
  });

  it("Catch-all 列表只有没人创建的地址收到的邮件", async () => {
    const { box, msg } = await catchAllMailbox();
    const normal = await createMailbox(null);
    const res = await call<Page<"messages", ListedMessage>>("GET", "/api/admin/messages?scope=catchAll", { cookie: admin });
    const ids = res.body.messages.map((m) => m.id);
    expect(ids).toContain(msg.id);
    expect(ids).not.toContain(normal.msg.id);
    const found = await call<Page<"messages", ListedMessage>>("GET", `/api/admin/messages?scope=catchAll&q=${box.address.slice(0, 8)}`, { cookie: admin });
    expect(found.body.messages.map((m) => m.id)).toEqual([msg.id]);
  });

  it("没有范围参数时拒绝列出全部邮件", async () => {
    expect((await call("GET", "/api/admin/messages", { cookie: admin })).status).toBe(400);
  });

  it("分页不重复也不遗漏", async () => {
    const owner = await createUser("page");
    const { box } = await createMailbox(owner.id);
    const d = await db();
    const base = Date.now();
    for (let chunk = 0; chunk < 60; chunk += 10) {
      await d.insert(message).values(
        Array.from({ length: 10 }, (_, i) => ({ mailboxId: box.id, fromAddress: "a@b.c", receivedAt: new Date(base - (chunk + i) * 1000) })),
      );
    }
    const first = await call<Page<"messages", ListedMessage>>("GET", `/api/admin/messages?userId=${owner.id}`, { cookie: admin });
    expect(first.body.messages).toHaveLength(50);
    const second = await call<Page<"messages", ListedMessage>>(
      "GET",
      `/api/admin/messages?userId=${owner.id}&cursor=${encodeURIComponent(first.body.nextCursor!)}`,
      { cookie: admin },
    );
    expect(second.body.nextCursor).toBeNull();
    const ids = [...first.body.messages, ...second.body.messages].map((m) => m.id);
    expect(new Set(ids).size).toBe(61);
  });

  it("管理员能看 Catch-all 邮件正文并删除，普通访问拿不到", async () => {
    const { box, msg } = await catchAllMailbox();
    const detail = await call<{ message: { subject: string; toAddress: string; catchAll: boolean } }>("GET", `/api/admin/messages/${msg.id}`, { cookie: admin });
    expect(detail.body.message).toEqual(expect.objectContaining({ subject: "catch me", toAddress: box.address, catchAll: true }));
    expect((await call("GET", `/api/messages/${msg.id}`)).status).toBe(404);
    expect((await call("GET", `/api/mailboxes/${encodeURIComponent(box.address)}/messages`)).status).toBe(404);
    expect((await call("DELETE", `/api/admin/messages/${msg.id}`, { cookie: admin })).status).toBe(204);
    expect((await call("GET", `/api/admin/messages/${msg.id}`, { cookie: admin })).status).toBe(404);
  });
});
