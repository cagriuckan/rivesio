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

// One shared EventSource for the whole Shell — Inbox + NotificationBell both
// subscribe without opening duplicate SSE connections on soft navigations.
let sharedSource: EventSource | null = null;
let sharedRefCount = 0;
let sharedDropped = false;
const sharedHandlers = new Set<LiveEventHandler>();

function ensureSharedSource() {
  if (sharedSource) return;
  const source = new EventSource("/api/admin/events");
  sharedSource = source;
  sharedDropped = false;

  source.onopen = () => {
    if (sharedDropped) {
      sharedDropped = false;
      for (const h of sharedHandlers) h("reconnected", {});
    }
  };
  source.onerror = () => {
    sharedDropped = true;
  };

  for (const type of EVENT_TYPES) {
    source.addEventListener(type, (e: MessageEvent) => {
      let payload: Record<string, unknown> = {};
      try {
        payload = JSON.parse(e.data);
      } catch {
        // Ignore malformed frames.
      }
      for (const h of sharedHandlers) h(type, payload);
    });
  }
}

function releaseSharedSource() {
  sharedRefCount = Math.max(0, sharedRefCount - 1);
  if (sharedRefCount === 0 && sharedSource) {
    sharedSource.close();
    sharedSource = null;
    sharedDropped = false;
  }
}

/**
 * Subscribes to the admin SSE stream. EventSource reconnects automatically;
 * after a drop the handler receives a synthetic "reconnected" event so lists
 * can refetch anything they missed.
 */
export function useLiveEvents(onEvent: LiveEventHandler): void {
  const handlerRef = useRef(onEvent);
  handlerRef.current = onEvent;

  useEffect(() => {
    const stable: LiveEventHandler = (type, payload) => handlerRef.current(type, payload);
    sharedHandlers.add(stable);
    sharedRefCount += 1;
    ensureSharedSource();
    return () => {
      sharedHandlers.delete(stable);
      releaseSharedSource();
    };
  }, []);
}
