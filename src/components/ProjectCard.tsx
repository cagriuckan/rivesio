"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface ProjectView {
  id: string;
  name: string;
  slug: string;
  themeSlug: string;
  widgetKey: string;
  accentColor: string;
}

export default function ProjectCard({ project, baseUrl }: { project: ProjectView; baseUrl: string }) {
  const router = useRouter();
  const [widgetKey, setWidgetKey] = useState(project.widgetKey);
  const [copied, setCopied] = useState<"key" | "snippet" | null>(null);
  const [busy, setBusy] = useState(false);

  const scriptUrl = `${baseUrl}/api/widget/${widgetKey}.js`;
  const snippet = `<script src="${scriptUrl}" async></script>`;

  async function copy(text: string, kind: "key" | "snippet") {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1800);
  }

  async function rotate() {
    if (!confirm("Anahtarı yenilemek mevcut gömülü kodları bozar. Devam edilsin mi?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rotateKey: true }),
      });
      const data = await res.json();
      if (res.ok) { setWidgetKey(data.widget_key); router.refresh(); }
    } finally { setBusy(false); }
  }

  async function remove() {
    if (!confirm(`"${project.name}" widget'ı ve tüm geri bildirimleri silinecek. Devam edilsin mi?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally { setBusy(false); }
  }

  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div
          className="h-4 w-4 shrink-0 rounded-full"
          style={{ background: project.accentColor, boxShadow: `0 0 8px ${project.accentColor}60` }}
        />
        <h3
          className="flex-1 text-sm font-semibold truncate"
          style={{ color: "var(--color-strong)" }}
        >
          {project.name}
        </h3>
        <code
          className="rounded px-1.5 py-0.5 text-xs"
          style={{ backgroundColor: "var(--color-elevated)", color: "var(--color-subtle)", fontFamily: "var(--font-mono)" }}
        >
          {project.themeSlug}
        </code>
      </div>

      {/* Widget key */}
      <div className="mb-4">
        <div
          className="mb-1.5 text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-subtle)" }}
        >
          Widget anahtarı
        </div>
        <div className="flex items-center gap-2">
          <code
            className="flex-1 truncate rounded-lg px-3 py-2 text-xs"
            style={{ backgroundColor: "var(--color-elevated)", color: "var(--color-tertiary)", fontFamily: "var(--font-mono)", border: "1px solid var(--color-border)" }}
          >
            {widgetKey}
          </code>
          <button
            onClick={() => copy(widgetKey, "key")}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors"
            style={{ backgroundColor: "var(--color-elevated)", color: copied === "key" ? "var(--color-ok-text)" : "var(--color-secondary)", border: "1px solid var(--color-border)" }}
          >
            {copied === "key" ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3"><polyline points="20 6 9 17 4 12" /></svg>
                Kopyalandı
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                Kopyala
              </>
            )}
          </button>
        </div>
      </div>

      {/* Script snippet */}
      <div className="mb-5">
        <div className="mb-1.5 flex items-center justify-between">
          <div
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-subtle)" }}
          >
            Script
          </div>
          <button
            onClick={() => copy(snippet, "snippet")}
            className="flex items-center gap-1 text-xs font-medium transition-colors"
            style={{ color: copied === "snippet" ? "var(--color-ok-text)" : "var(--color-accent-text)" }}
          >
            {copied === "snippet" ? "✓ Kopyalandı" : "Kopyala"}
          </button>
        </div>
        <pre
          className="overflow-x-auto rounded-lg px-3 py-3 text-xs leading-relaxed"
          style={{ backgroundColor: "var(--color-base)", color: "var(--color-tertiary)", border: "1px solid var(--color-border)", fontFamily: "var(--font-mono)" }}
        >
          {snippet}
        </pre>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={rotate}
          disabled={busy}
          className="ds-btn-ghost text-xs"
          style={{ padding: "6px 12px" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
            <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Anahtarı yenile
        </button>
        <button
          onClick={remove}
          disabled={busy}
          className="ml-auto rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
          style={{ backgroundColor: "var(--color-danger-muted)", color: "var(--color-danger-text)" }}
        >
          Sil
        </button>
      </div>
    </div>
  );
}
