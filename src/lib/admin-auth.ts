import { timingSafeEqual } from "node:crypto";

export function isAdminRequest(headers: Headers) {
  const expectedToken = process.env.NAGRIKSETU_ADMIN_TOKEN;
  if (!expectedToken) return false;

  const authorization = headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length).trim() : "";
  if (!token || token.length !== expectedToken.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken));
}
