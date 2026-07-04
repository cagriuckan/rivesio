"use client";

import { useEffect } from "react";

/** Registers the root-scope service worker (push + installability). */
export default function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("[pwa] service worker registration failed", err);
      });
    }
  }, []);
  return null;
}
