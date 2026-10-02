import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { user } from "@/db/schema";
import { accountSummary } from "@/lib/account";
import { burnPasswordCheck, getUserSession, startSession, verifyPassword } from "@/lib/auth";
import { limitAuth } from "@/lib/auth-server";
import { getServer, jsonError } from "@/lib/server";
import { loginSchema, readJson } from "@/lib/validation";

const INVALID = "用户名或密码错误";

export async function POST(request: Request) {
  const session = await getUserSession();
  if (!session) return jsonError("登录功能未启用", 503);
  const limited = await limitAuth(request);
  if (limited) return limited;

  const parsed = loginSchema.safeParse(await readJson(request));
  if (!parsed.success) return jsonError(INVALID, 400);
  const { username, password } = parsed.data;

  const { db } = await getServer();
  const found = await db.query.user.findFirst({ where: eq(user.username, username) });
  if (!found) {
    await burnPasswordCheck(password);
    return jsonError(INVALID, 401);
  }
  if (!(await verifyPassword(password, found.passwordHash, found.passwordSalt))) return jsonError(INVALID, 401);
  if (found.disabled) return jsonError("这个账号已被停用", 403);

  await startSession(session, found);
  return NextResponse.json({ user: await accountSummary(db, found.id, found.username) });
}
