import { createHash } from "node:crypto";

/**
 * Stable, privacy-preserving identifier for a widget visitor. Used to enforce
 * per-visitor daily submission limits without storing the raw IP.
 */
export function visitorHash(ip: string | null, userAgent: string | null): string {
  return createHash("sha256")
    .update(`${ip ?? "unknown"}|${userAgent ?? ""}`)
    .digest("hex");
}

/** UTC start-of-day epoch-ms for "today" — the window for daily limits. */
export function startOfUtcDay(now = Date.now()): number {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}
