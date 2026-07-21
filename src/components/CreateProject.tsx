"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Field, FieldHint, Input, Label } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icons";

const ACCENTS = ["#6e79d6", "#3ecf8e", "#f5a623", "#f5535b", "#4aa8ff", "#a78bfa"];
type SlugStatus = "idle" | "checking" | "available" | "taken" | "invalid";

function slugify(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function slugIsValid(value: string): boolean {
  return /^[a-z0-9-]+$/.test(value) && value.length >= 1 && value.length <= 60;
}

function checkSlug(slug: string, signal: AbortSignal): Promise<{ valid?: boolean; available?: boolean } | null> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/admin/projects?slug=${encodeURIComponent(slug)}`, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Accept", "application/json");

    const cleanup = () => signal.removeEventListener("abort", abort);
    const abort = () => {
      xhr.abort();
      cleanup();
      resolve(null);
    };

    signal.addEventListener("abort", abort, { once: true });
    xhr.onload = () => {
      cleanup();
      if (xhr.status < 200 || xhr.status >= 300) {
        resolve(null);
        return;
      }
      try {
        resolve(JSON.parse(xhr.responseText));
      } catch {
        resolve(null);
      }
    };
    xhr.onerror = () => {
      cleanup();
      resolve(null);
    };
    xhr.onabort = () => {
      cleanup();
      resolve(null);
    };
    xhr.send();
  });
}

export default function CreateProject({
  initialOpen = false,
  triggerSize = "md",
}: {
  initialOpen?: boolean;
  triggerSize?: "sm" | "md";
}) {
  const t = useTranslations("projects");
  const tc = useTranslations("common");
  const router = useRouter();
  const [open, setOpen] = useState(initialOpen);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
  const [accentColor, setAccentColor] = useState(ACCENTS[0]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const canCreate =
    Boolean(name.trim()) &&
    slugIsValid(slug) &&
    slugStatus !== "checking" &&
    slugStatus !== "taken" &&
    slugStatus !== "invalid";

  useEffect(() => {
    if (!open) return;
    if (!slug) {
      setSlugStatus("idle");
      return;
    }
    if (!slugIsValid(slug)) {
      setSlugStatus("invalid");
      return;
    }

    const controller = new AbortController();
    setSlugStatus("checking");
    const timeout = window.setTimeout(async () => {
      const data = await checkSlug(slug, controller.signal);
      if (controller.signal.aborted) return;
      if (!data) setSlugStatus("idle");
      else if (data.valid === false) setSlugStatus("invalid");
      else if (data.available === false) setSlugStatus("taken");
      else if (data.available === true) setSlugStatus("available");
      else setSlugStatus("idle");
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [open, slug]);

  function updateName(value: string) {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  function updateSlug(value: string) {
    setSlugEdited(true);
    setSlug(slugify(value));
  }

  async function create() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, accentColor }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "slug_taken") setSlugStatus("taken");
        setError(data.error === "slug_taken" ? t("slugTaken") : tc("invalidInput"));
        return;
      }
      setOpen(false);
      setName(""); setSlug(""); setSlugEdited(false); setSlugStatus("idle");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <Button variant="primary" size={triggerSize} onClick={() => setOpen(true)}>
        <Icon.plus className={triggerSize === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
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
          <div className="grid gap-4">
            <Field label={t("fieldName")}>
              <Input value={name} onChange={(e) => updateName(e.target.value)} placeholder="Rivesio" autoFocus />
            </Field>
            <Field label={t("fieldSlug")}>
              <Input value={slug} onChange={(e) => updateSlug(e.target.value)} placeholder="rivesio" />
              <FieldHint tone={slugStatus === "available" ? "success" : slugStatus === "taken" || slugStatus === "invalid" ? "danger" : "neutral"}>
                {slugStatus === "checking" && t("slugChecking")}
                {slugStatus === "available" && t("slugAvailable")}
                {slugStatus === "taken" && t("slugTaken")}
                {slugStatus === "invalid" && t("slugInvalid")}
                {slugStatus === "idle" && t("slugHelp")}
              </FieldHint>
            </Field>
          </div>

          <div>
            <Label>{t("accentColor")}</Label>
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
          <Button variant="primary" onClick={create} disabled={busy || !canCreate}>
            {busy ? tc("creating") : tc("create")}
          </Button>
        </div>
      </div>
    </>
  );
}
