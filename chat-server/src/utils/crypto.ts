// file: src/utils/crypto.ts

/**
 * Generates a short request id without external dependencies.
 * This is not used for security decisions.
 */
export function cryptoRandomId(): string {
  // Node 20+ supports global crypto. This produces a 16-byte hex string.
  return crypto
    .getRandomValues(new Uint8Array(16))
    .reduce((acc, b) => acc + b.toString(16).padStart(2, "0"), "");
}
