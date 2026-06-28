"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icons";

const ACCENTS = ["#6e79d6", "#3ecf8e", "#f5a623", "#f5535b", "#4aa8ff", "#a78bfa"];

export default function CreateProject() {
  const t = useTranslations("projects");
  const tc = useTranslations("common");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [themeSlug, setThemeSlug] = useState("");
  const [accentColor, setAccentColor] = useState(ACCENTS[0]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function create() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, themeSlug, accentColor }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === "slug_taken" ? t("slugTaken") : tc("invalidInput"));
        return;
      }
      setOpen(false);
      setName(""); setSlug(""); setThemeSlug("");
      // Open the new widget's settings so text/fields/categories can be set up right away.
      router.push(`/projects/${data.id}/settings`);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <Button variant="primary" onClick={() => setOpen(true)}>
        <Icon.plus className="h-4 w-4" />
        {t("newWidget")}
      </Button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-[440px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="text-sm font-semibold text-strong">{t("modalTitle")}</h3>
          <button
            onClick={() => setOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-subtle transition-colors hover:bg-raised hover:text-primary"
            aria-label={tc("close")}
          >
            <Icon.close className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("fieldName")}>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Revisto" autoFocus />
            </Field>
            <Field label={t("fieldSlug")}>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="revisto" />
            </Field>
          </div>

          <Field label={t("fieldThemeSlug")}>
            <Input value={themeSlug} onChange={(e) => setThemeSlug(e.target.value)} placeholder="revisto" />
          </Field>

          <div>
            <div className="mb-1.5 text-2xs font-semibold uppercase tracking-wider text-subtle">{t("accentColor")}</div>
            <div className="flex items-center gap-2">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  onClick={() => setAccentColor(c)}
                  className="h-7 w-7 rounded-lg transition-transform hover:scale-110"
                  style={{
                    background: c,
                    boxShadow: accentColor === c ? `0 0 0 2px var(--color-surface), 0 0 0 4px ${c}` : "none",
                  }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md bg-danger-soft px-3 py-2 text-xs text-danger-text">
              <Icon.close className="h-3.5 w-3.5" />
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>{tc("cancel")}</Button>
          <Button variant="primary" onClick={create} disabled={busy || !name || !slug || !themeSlug}>
            {busy ? tc("creating") : tc("create")}
          </Button>
        </div>
      </div>
    </>
  );
}
