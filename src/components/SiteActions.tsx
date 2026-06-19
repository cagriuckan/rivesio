"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
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
        <Button size="sm" variant="secondary" onClick={() => set("approved")} disabled={busy}>
          Onayla
        </Button>
      )}
      {status !== "blocked" && (
        <Button size="sm" variant="danger" onClick={() => set("blocked")} disabled={busy}>
          Engelle
        </Button>
      )}
      {status === "blocked" && (
        <Button size="sm" variant="outline" onClick={() => set("pending")} disabled={busy}>
          Engeli kaldır
        </Button>
      )}
    </div>
  );
}
