export function isAdminRequest(headers: Headers) {
  const expectedToken = process.env.NAGRIKSETU_ADMIN_TOKEN;
  if (!expectedToken) return false;

  const authorization = headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length).trim() : "";
  return token.length > 0 && token === expectedToken;
}
