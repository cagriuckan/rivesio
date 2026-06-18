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
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const scriptUrl = `${baseUrl}/api/widget/${widgetKey}.js`;
  const snippet = `<script src="${scriptUrl}" async></script>`;

  async function copy() {
    await navigator.clipboard.writeText(widgetKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-3 w-3 rounded-full ring-2 ring-gray-700" style={{ background: project.accentColor }} />
        <h3 className="text-base font-semibold text-gray-100">{project.name}</h3>
        <span className="rounded-md bg-gray-800 px-2 py-0.5 text-xs text-gray-500">
          {project.themeSlug}
        </span>
      </div>

      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">
        Widget anahtarı
      </label>
      <div className="mb-4 flex items-center gap-2">
        <code className="flex-1 truncate rounded-lg bg-gray-800 px-3 py-2 text-xs text-gray-300">
          {widgetKey}
        </code>
        <button
          onClick={copy}
          className="rounded-lg bg-gray-800 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-gray-700 transition-colors"
        >
          {copied ? "✓ Kopyalandı" : "Kopyala"}
        </button>
      </div>

      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">
        Script URL
      </label>
      <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-950 p-3 text-xs leading-relaxed text-gray-400">
        {snippet}
      </pre>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={rotate}
          disabled={busy}
          className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          Anahtarı yenile
        </button>
        <button
          onClick={remove}
          disabled={busy}
          className="ml-auto rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
        >
          Sil
        </button>
      </div>
    </div>
  );
}
