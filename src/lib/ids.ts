import { randomBytes, randomUUID } from "node:crypto";

/** Public, URL-safe widget key handed to embedding sites (not a secret). */
export function generateWidgetKey(): string {
  return "wk_" + randomBytes(18).toString("base64url");
}

/** Generic unique id for rows. */
export function generateId(): string {
  return randomUUID();
}
