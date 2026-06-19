"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProject() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [themeSlug, setThemeSlug] = useState("");
  const [accentColor, setAccentColor] = useState("#6366f1");
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
        setError(data.error === "slug_taken" ? "Bu slug zaten kullanımda." : "Geçersiz bilgi.");
        return;
      }
      setOpen(false);
      setName("");
      setSlug("");
      setThemeSlug("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="ds-btn-primary"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Yeni widget
      </button>
    );
  }

  return (
    <div
      className="mb-6 rounded-xl p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <h3
        className="mb-4 text-sm font-semibold"
        style={{ color: "var(--color-strong)" }}
      >
        Yeni widget / tema
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ad" value={name} onChange={setName} placeholder="Kanews" />
        <Field label="Slug (a-z0-9-)" value={slug} onChange={setSlug} placeholder="kanews" />
        <Field label="Tema slug" value={themeSlug} onChange={setThemeSlug} placeholder="kanews" />
        <div>
          <label
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-subtle)" }}
          >
            Vurgu rengi
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-9 w-14 cursor-pointer rounded-lg border"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-elevated)" }}
            />
            <code
              className="text-xs"
              style={{ color: "var(--color-secondary)", fontFamily: "var(--font-mono)" }}
            >
              {accentColor}
            </code>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm" style={{ color: "var(--color-danger-text)" }}>{error}</p>
      )}

      <div className="mt-5 flex gap-2">
        <button
          onClick={create}
          disabled={busy || !name || !slug || !themeSlug}
          className="ds-btn-primary"
        >
          {busy ? "Oluşturuluyor…" : "Oluştur"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="ds-btn-ghost"
        >
          Vazgeç
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <label className="block">
      <span
        className="mb-1.5 block text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--color-subtle)" }}
      >
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: "100%",
          backgroundColor: "var(--color-elevated)",
          border: `1px solid ${focused ? "var(--color-accent)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-md)",
          padding: "8px 12px",
          fontSize: "13px",
          color: "var(--color-primary)",
          fontFamily: "var(--font-sans)",
          boxShadow: focused ? "0 0 0 3px var(--color-accent-muted)" : "none",
          outline: "none",
          transition: "border-color .15s, box-shadow .15s",
        }}
      />
    </label>
  );
}
