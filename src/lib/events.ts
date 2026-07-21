// In-process pub/sub for live updates (SSE) and notification fan-out.
// Single-process only; a multi-instance deploy would need Postgres LISTEN/NOTIFY.

export type AppEventType =
  | "feedback.created"
  | "reply.created"
  | "feedback.updated"
  | "feedback.assigned"
  | "notification.created";

export interface AppEvent {
  type: AppEventType;
  /** Target account — events are only delivered to this user's SSE streams. */
  userId: string;
  payload: Record<string, unknown>;
  ts: number;
}

type Listener = (event: AppEvent) => void;

declare global {
  // Survives Next.js dev hot reloads (module re-evaluation).
  // eslint-disable-next-line no-var
  var __rivesioEventListeners: Set<Listener> | undefined;
}

function listeners(): Set<Listener> {
  return (globalThis.__rivesioEventListeners ??= new Set());
}

export function publish(event: Omit<AppEvent, "ts">): void {
  const full: AppEvent = { ...event, ts: Date.now() };
  for (const listener of listeners()) {
    try {
      listener(full);
    } catch (err) {
      console.error("[events] listener failed", err);
    }
  }
}

export function subscribe(listener: Listener): () => void {
  listeners().add(listener);
  return () => listeners().delete(listener);
}
