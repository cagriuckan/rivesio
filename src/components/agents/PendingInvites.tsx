"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useLiveEvents } from "@/hooks/useLiveEvents";

interface PendingInvite {
  id: string;
  project_id: string;
  project_name: string;
  inviter_name: string;
  categories: string[] | null;
  invited_at: number;
}

/** Shows outstanding agent invites for the signed-in user (accept / decline). */
export default function PendingInvites() {
  const t = useTranslations("agents");
  const router = useRouter();
  const [items, setItems] = useState<PendingInvite[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/agents/invites").catch(() => null);
    if (!res?.ok) {
      setItems([]);
      return;
    }
    const data = await res.json();
    setItems(data.items ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useLiveEvents((type) => {
    if (type === "notification.created" || type === "reconnected") load();
  });

  async function act(id: string, action: "accept" | "reject") {
    setBusyId(id);
    try {
      const res = await fetch("/api/agents/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membership_id: id, action }),
      });
      if (!res.ok) return;
      if (action === "accept") {
        const data = await res.json();
        router.push(`/feedbacks?w=${data.project_id}`);
        router.refresh();
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  }

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-6 rounded-2xl border border-accent/25 bg-accent-soft/40 p-4">
      <h3 className="text-sm font-semibold text-strong">{t("pendingTitle")}</h3>
      <p className="mt-0.5 text-xs text-subtle">{t("pendingSubtitle")}</p>
      <ul className="mt-3 space-y-2">
        {items.map((inv) => (
          <li
            key={inv.id}
            className="flex flex-col gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-primary">{inv.project_name}</div>
              <div className="truncate text-xs text-subtle">
                {t("pendingFrom", { name: inv.inviter_name })}
                {inv.categories?.length ? ` · ${inv.categories.join(", ")}` : ""}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="primary"
                disabled={busyId === inv.id}
                onClick={() => act(inv.id, "accept")}
                className="h-8 rounded-lg px-3 text-xs"
              >
                {busyId === inv.id ? <Spinner /> : t("acceptButton")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={busyId === inv.id}
                onClick={() => act(inv.id, "reject")}
                className="h-8 rounded-lg px-3 text-xs"
              >
                {t("rejectButton")}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
