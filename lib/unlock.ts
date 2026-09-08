/** Shared by the middleware and the unlock route, so neither imports the other. */
export const COOKIE = "case_unlock";

/**
 * SHA-256 of the password, so the password itself isn't in the repo.
 *
 * This lives in the code rather than an environment variable so the gate works
 * from a plain GitHub deploy, with nothing to configure in a dashboard. The
 * trade is that a public repo publishes the hash, and a short password can be
 * cracked from a hash offline — so this keeps casual visitors out, and isn't a
 * lock on anything that would actually hurt to leak. Make the repo private if
 * that matters. To change the password, replace this with the SHA-256 of
 * `arena-club:<new password>`.
 */
export const PASSWORD_HASH =
  "4835c6d261b4175e78bbf4cab53dcc84b8e7e0707a1189eb47ff721aab026aa0";

/** SHA-256 via WebCrypto — the only digest the middleware runtime offers. */
export async function hash(value: string) {
  const bytes = new TextEncoder().encode(`arena-club:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
