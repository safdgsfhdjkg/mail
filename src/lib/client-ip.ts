export const clientIp = (request: Request) => request.headers.get("cf-connecting-ip") ?? "local";
