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
    <div className="flex justify-end gap-2">
      {status !== "approved" && (
        <button
          onClick={() => set("approved")}
          disabled={busy}
          className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          Onayla
        </button>
      )}
      {status !== "blocked" && (
        <button
          onClick={() => set("blocked")}
          disabled={busy}
          className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          Engelle
        </button>
      )}
      {status === "blocked" && (
        <button
          onClick={() => set("pending")}
          disabled={busy}
          className="rounded-md bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300 disabled:opacity-50"
        >
          Engeli kaldır
        </button>
      )}
    </div>
  );
}
