export const HUB = "hub";

export const userTag = (userId: string) => `user:${userId}`;

export const shareTag = (token: string) => `share:${token}`;

export const MAX_LIVE_SHARES = 3;

export function broadcast(env: CloudflareEnv, tag: string, payload: unknown) {
  return env.MAIL_HUB.getByName(HUB).notify(tag, JSON.stringify(payload));
}

export type ShareLiveEvent = { type: "share"; address: string };

export async function notifyShare(env: CloudflareEnv, userIds: string[], address: string, reconnect = false) {
  const hub = env.MAIL_HUB.getByName(HUB);
  const payload = JSON.stringify({ type: "share", address } satisfies ShareLiveEvent);
  await Promise.all(
    [...new Set(userIds)].map(async (id) => {
      await hub.notify(userTag(id), payload);
      if (reconnect) await hub.disconnect(userTag(id));
    }),
  );
}
