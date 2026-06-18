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

export default function ProjectCard({
  project,
  baseUrl,
}: {
  project: ProjectView;
  baseUrl: string;
}) {
  const router = useRouter();
  const [widgetKey, setWidgetKey] = useState(project.widgetKey);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const scriptUrl = `${baseUrl}/api/widget/${widgetKey}.js`;
  const snippet = `<script>
  window.KanewsFeedback = {
    license: "LISANS_ANAHTARINIZ",
    theme: "${project.themeSlug}",
    domain: location.host
  };
</script>
<script src="${scriptUrl}" async></script>`;

  async function copy() {
    await navigator.clipboard.writeText(snippet);
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
      if (res.ok) {
        setWidgetKey(data.widget_key);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center gap-3">
        <span
          className="inline-block h-4 w-4 rounded-full"
          style={{ background: project.accentColor }}
        />
        <h3 className="text-base font-semibold text-slate-900">{project.name}</h3>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
          tema: {project.themeSlug}
        </span>
      </div>

      <label className="mb-1 block text-xs font-medium text-slate-500">Widget anahtarı</label>
      <code className="mb-3 block break-all rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
        {widgetKey}
      </code>

      <label className="mb-1 block text-xs font-medium text-slate-500">
        Gömme kodu (WordPress dışı siteler için)
      </label>
      <pre className="mb-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-100">
        {snippet}
      </pre>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={copy}
          className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark"
        >
          {copied ? "Kopyalandı" : "Kodu kopyala"}
        </button>
        <button
          onClick={rotate}
          disabled={busy}
          className="rounded-md bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-300 disabled:opacity-50"
        >
          Anahtarı yenile
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Kanews teması bu widget'ı yöneticiler için otomatik yükler; lisans anahtarı
        tema ayarlarındaki sipariş anahtarından alınır.
      </p>
    </div>
  );
}
