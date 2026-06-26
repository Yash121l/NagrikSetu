export function toSafeExternalHref(...candidates: Array<string | undefined>) {
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const url = new URL(candidate);
      if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
    } catch {
      // Try the next sourced candidate.
    }
  }
  return null;
}
