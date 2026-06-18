"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProject() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [themeSlug, setThemeSlug] = useState("");
  const [accentColor, setAccentColor] = useState("#4f46e5");
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
        className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
      >
        + Yeni widget
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-700">Yeni widget / tema</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Ad" value={name} onChange={setName} placeholder="Kanews" />
        <Field label="Slug (a-z0-9-)" value={slug} onChange={setSlug} placeholder="kanews" />
        <Field label="Tema slug" value={themeSlug} onChange={setThemeSlug} placeholder="kanews" />
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Vurgu rengi</label>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="h-9 w-16 rounded border border-slate-300"
          />
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-4 flex gap-2">
        <button
          onClick={create}
          disabled={busy || !name || !slug || !themeSlug}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
        >
          Oluştur
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-lg px-4 py-2 text-sm text-slate-500 hover:bg-slate-100"
        >
          Vazgeç
        </button>
      </div>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">{props.label}</label>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
