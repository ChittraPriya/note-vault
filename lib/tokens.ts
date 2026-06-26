import crypto from "crypto";

/**
 * Generates a URL-safe, high-entropy share token.
 * 16 random bytes -> ~128 bits of entropy, base64url encoded (no padding/slashes).
 */
export function generateShareToken(): string {
  return crypto.randomBytes(16).toString("base64url");
}

/**
 * Generates a human-typeable access key for password-protected links.
 * Format: XXXX-XXXX using an unambiguous character set (no 0/O, 1/I/L confusion).
 */
const SAFE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateAccessKey(): string {
  const part = () =>
    Array.from({ length: 4 }, () => SAFE_CHARS[crypto.randomInt(0, SAFE_CHARS.length)]).join("");
  return `${part()}-${part()}`;
}

export function normalizeKey(input: string): string {
  return input.trim().toUpperCase();
}
