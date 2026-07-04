"use client";

import { useEffect, useRef } from "react";

export type LiveEventType =
  | "feedback.created"
  | "reply.created"
  | "feedback.updated"
  | "feedback.assigned"
  | "notification.created"
  | "reconnected";

export type LiveEventHandler = (type: LiveEventType, payload: Record<string, unknown>) => void;

const EVENT_TYPES: LiveEventType[] = [
  "feedback.created",
  "reply.created",
  "feedback.updated",
  "feedback.assigned",
  "notification.created",
];

/**
 * Subscribes to the admin SSE stream. EventSource reconnects automatically;
 * after a drop the handler receives a synthetic "reconnected" event so lists
 * can refetch anything they missed.
 */
export function useLiveEvents(onEvent: LiveEventHandler): void {
  const handlerRef = useRef(onEvent);
  handlerRef.current = onEvent;

  useEffect(() => {
    const source = new EventSource("/api/admin/events");
    let dropped = false;

    source.onopen = () => {
      if (dropped) {
        dropped = false;
        handlerRef.current("reconnected", {});
      }
    };
    source.onerror = () => {
      dropped = true;
    };

    for (const type of EVENT_TYPES) {
      source.addEventListener(type, (e: MessageEvent) => {
        let payload: Record<string, unknown> = {};
        try {
          payload = JSON.parse(e.data);
        } catch {
          // Ignore malformed frames.
        }
        handlerRef.current(type, payload);
      });
    }

    return () => source.close();
  }, []);
}
