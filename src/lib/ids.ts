import { randomBytes, randomUUID } from "node:crypto";

/** Public, URL-safe widget key handed to embedding sites (not a secret). */
export function generateWidgetKey(): string {
  return "wk_" + randomBytes(18).toString("base64url");
}

/** Generic unique id for rows. */
export function generateId(): string {
  return randomUUID();
}

/**
 * Unguessable capability token for a conversation. Returned to the end user on
 * submit; whoever holds it can view and reply to that one conversation.
 */
export function generateConversationToken(): string {
  return randomBytes(24).toString("base64url");
}
