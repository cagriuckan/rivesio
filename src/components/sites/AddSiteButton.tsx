"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icons";

export default function AddSiteButton({
  projects,
  triggerSize = "md",
}: {
  projects: { id: string; name: string }[];
  triggerSize?: "sm" | "md";
}) {
  const t = useTranslations("sites");
  const tc = useTranslations("common");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [domain, setDomain] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addManualSite() {
    if (!projectId || !domain.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, domain: domain.trim() }),
      });
      if (res.ok) {
        setOpen(false);
        setDomain("");
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d?.error === "site_exists" ? t("addExists") : t("addError"));
      }
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <Button
        type="button"
        variant="primary"
        size={triggerSize}
        onClick={() => { setError(null); setOpen(true); }}
        disabled={projects.length === 0}
      >
        <Icon.plus className="h-4 w-4" />
        {t("addSite")}
      </Button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        onClick={() => setOpen(false)}
      >
        <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-4 shadow-pop" onClick={(e) => e.stopPropagation()}>
          <h3 className="mb-3 text-sm font-semibold text-primary">{t("addSite")}</h3>
          <div className="space-y-3">
            <div>
              <Label>{t("colWidget")}</Label>
              <Select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>{t("colDomain")}</Label>
              <Input
                autoFocus
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                onKeyDown={(e) => { if (e.key === "Enter") addManualSite(); }}
                className="h-9 rounded-lg text-sm"
              />
            </div>
            {error && <p className="text-xs text-danger-text">{error}</p>}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)} className="rounded-lg">
              {tc("cancel")}
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={addManualSite} disabled={busy || !domain.trim()} className="rounded-lg">
              {busy ? tc("saving") : tc("save")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
