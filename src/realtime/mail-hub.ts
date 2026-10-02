import { DurableObject } from "cloudflare:workers";
import { EMAIL_RE } from "../lib/rules";
import { MAX_SAVED_MAILBOXES } from "../lib/config";
import { readUserId } from "../lib/session-cookie";
import { getDb } from "../db";
import { sharedMailboxWhere } from "../lib/mail-queries";
import { HUB, MAX_LIVE_SHARES, shareTag, userTag } from "./notify";

export { broadcast, shareTag, userTag } from "./notify";

export const LIVE_PATH = "/api/live";

export class MailHub extends DurableObject<CloudflareEnv> {
  constructor(ctx: DurableObjectState, env: CloudflareEnv) {
    super(ctx, env);
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping", "pong"));
  }

  async fetch(request: Request) {
    const tags = new URL(request.url).searchParams.getAll("tag");
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server, tags);
    return new Response(null, { status: 101, webSocket: client });
  }

  notify(tag: string, payload: string) {
    for (const socket of this.ctx.getWebSockets(tag)) {
      try {
        socket.send(payload);
      } catch {}
    }
  }

  disconnect(tag: string) {
    for (const socket of this.ctx.getWebSockets(tag)) {
      try {
        socket.close(4001, "access changed");
      } catch {}
    }
  }

  webSocketClose(socket: WebSocket) {
    try {
      socket.close(1000);
    } catch {}
  }
}

type AddressAccess = { owner: string | null; member: boolean };

async function mailboxAccess(env: CloudflareEnv, addresses: string[], userId: string | null) {
  if (!addresses.length) return new Map<string, AddressAccess>();
  const { results } = await env.DB.prepare(
    `select m.address, m.owner_id, exists (select 1 from mailbox_member mm where mm.mailbox_id = m.id and mm.user_id = ? and mm.status = 'active' and (mm.expires_at is null or mm.expires_at > ?)) as member from mailbox m where m.address in (${addresses.map(() => "?").join(",")})`,
  )
    .bind(userId ?? "", Date.now(), ...addresses)
    .all<{ address: string; owner_id: string | null; member: number }>();
  return new Map(results.map((r) => [r.address, { owner: r.owner_id, member: !!r.member }]));
}

function allowedAddresses(addresses: string[], access: Map<string, AddressAccess>, userId: string | null) {
  return addresses.filter((a) => {
    const found = access.get(a);
    return !found?.owner || found.owner === userId || found.member;
  });
}

export async function liveShares(env: CloudflareEnv, tokens: string[]) {
  const wanted = [...new Set(tokens.filter((t) => /^[\w-]{8,64}$/.test(t)))].slice(0, MAX_LIVE_SHARES);
  if (!wanted.length) return [];
  const db = getDb(env.DB);
  const found = await Promise.all(wanted.map((token) => db.query.mailbox.findFirst({ columns: { id: true }, where: sharedMailboxWhere(token) })));
  return wanted.filter((_, i) => found[i]);
}

export async function connectLive(request: Request, env: CloudflareEnv) {
  if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { status: 426 });
  }
  const url = new URL(request.url);
  const requested = [...new Set(url.searchParams.getAll("address").map((a) => a.trim().toLowerCase()))]
    .filter((a) => a.length <= 254 && EMAIL_RE.test(a))
    .slice(0, MAX_SAVED_MAILBOXES);
  const userId = await readUserId(request.headers.get("Cookie"), env.SESSION_SECRET, env.DB);
  const access = await mailboxAccess(env, requested, userId);
  const addresses = allowedAddresses(requested, access, userId).slice(0, userId ? MAX_SAVED_MAILBOXES - 1 : MAX_SAVED_MAILBOXES);
  const shares = await liveShares(env, url.searchParams.getAll("share"));
  const tags = [...(userId ? [userTag(userId)] : []), ...addresses, ...shares.map(shareTag)];
  if (!tags.length) return new Response("No address", { status: 400 });
  url.search = new URLSearchParams(tags.map((t) => ["tag", t])).toString();
  return env.MAIL_HUB.getByName(HUB).fetch(new Request(url, request));
}
