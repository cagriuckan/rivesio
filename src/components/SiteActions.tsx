"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteStatus } from "@/lib/types";

export default function SiteActions({ id, status }: { id: string; status: SiteStatus }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function set(next: SiteStatus) {
    setBusy(true);
    try {
      await fetch(`/api/admin/sites/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex justify-end gap-1.5">
      {status !== "approved" && (
        <button
          onClick={() => set("approved")}
          disabled={busy}
          className="rounded-md px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50"
          style={{ backgroundColor: "var(--color-ok-muted)", color: "var(--color-ok-text)" }}
        >
          Onayla
        </button>
      )}
      {status !== "blocked" && (
        <button
          onClick={() => set("blocked")}
          disabled={busy}
          className="rounded-md px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50"
          style={{ backgroundColor: "var(--color-danger-muted)", color: "var(--color-danger-text)" }}
        >
          Engelle
        </button>
      )}
      {status === "blocked" && (
        <button
          onClick={() => set("pending")}
          disabled={busy}
          className="rounded-md px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50"
          style={{ backgroundColor: "var(--color-elevated)", color: "var(--color-secondary)", border: "1px solid var(--color-border)" }}
        >
          Engeli kaldır
        </button>
      )}
    </div>
  );
}
