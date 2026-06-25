"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import type { SiteStatus } from "@/lib/types";

export default function SiteActions({ id, status }: { id: string; status: SiteStatus }) {
  const t = useTranslations("sites");
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
          {t("approve")}
        </Button>
      )}
      {status !== "blocked" && (
        <Button size="sm" variant="danger" onClick={() => set("blocked")} disabled={busy}>
          {t("block")}
        </Button>
      )}
      {status === "blocked" && (
        <Button size="sm" variant="outline" onClick={() => set("pending")} disabled={busy}>
          {t("unblock")}
        </Button>
      )}
    </div>
  );
}
