"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";

export interface ProjectView {
  id: string;
  name: string;
  slug: string;
  widgetKey: string;
  accentColor: string;
}

export default function ProjectCard({
  project,
  baseUrl,
  stats,
}: {
  project: ProjectView;
  baseUrl: string;
  stats: { feedbacks: number; sites: number };
}) {
  const t = useTranslations("projects");
  const tc = useTranslations("common");
  const router = useRouter();
  const [widgetKey, setWidgetKey] = useState(project.widgetKey);
  const [copied, setCopied] = useState<"key" | "snippet" | null>(null);
  const [actionOpen, setActionOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const scriptUrl = `${baseUrl}/api/widget/${widgetKey}.js`;
  const snippet = `<script src="${scriptUrl}" async></script>`;

  async function copy(text: string, kind: "key" | "snippet") {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1800);
  }

  async function rotate() {
    setActionOpen(false);
    if (!confirm(t("confirmRotate"))) return;
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
    setActionOpen(false);
    if (!confirm(t("confirmDelete", { name: project.name }))) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally { setBusy(false); }
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ background: project.accentColor }}
        >
          {project.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-strong">{project.name}</h3>
          <span className="text-2xs text-subtle">{project.slug}</span>
        </div>
        <div className="relative flex items-center gap-1.5">
          <Link
            href={`/projects/${project.id}/settings`}
            className="inline-flex h-8 items-center gap-2 rounded-md border border-line bg-transparent px-3 text-xs font-semibold text-secondary transition-all hover:border-line-strong hover:bg-raised hover:text-primary"
          >
            <Icon.settings className="h-3.5 w-3.5" />
            {t("settings")}
          </Link>
          <button
            type="button"
            onClick={() => setActionOpen((v) => !v)}
            aria-label="Widget actions"
            aria-expanded={actionOpen}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line bg-transparent text-subtle transition-all hover:border-line-strong hover:bg-raised hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Icon.dots className="h-4 w-4" />
          </button>

          {actionOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] z-20 w-40 rounded-xl border border-line bg-surface p-1.5 shadow-lg">
              <Link
                href={`/?w=${project.id}`}
                onClick={() => setActionOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-secondary transition-colors hover:bg-raised hover:text-primary"
              >
                <Icon.dashboard className="h-3.5 w-3.5" />
                {t("panel")}
              </Link>
              <button
                type="button"
                onClick={rotate}
                disabled={busy}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-secondary transition-colors hover:bg-raised hover:text-primary disabled:opacity-50"
              >
                <Icon.refresh className="h-3.5 w-3.5" />
                {t("rotateKey")}
              </button>
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-danger-text transition-colors hover:bg-danger-soft disabled:opacity-50"
              >
                <Icon.trash className="h-3.5 w-3.5" />
                {tc("delete")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 divide-x divide-line border-b border-line">
        <div className="px-5 py-3">
          <div className="text-lg font-bold text-strong tnum">{stats.feedbacks}</div>
          <div className="text-2xs text-subtle">{t("feedbackStat")}</div>
        </div>
        <div className="px-5 py-3">
          <div className="text-lg font-bold text-strong tnum">{stats.sites}</div>
          <div className="text-2xs text-subtle">{t("siteStat")}</div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {/* Widget key */}
        <div>
          <div className="mb-1.5 text-2xs font-semibold uppercase tracking-wider text-faint">{t("widgetKey")}</div>
          <div className="relative">
            <code className="block truncate rounded-md border border-line bg-inset py-2 pl-2.5 pr-20 text-2xs text-secondary">
              {widgetKey}
            </code>
            <button
              type="button"
              onClick={() => copy(widgetKey, "key")}
              className="absolute right-1.5 top-1/2 inline-flex h-6 -translate-y-1/2 items-center gap-1 rounded px-2 text-2xs font-semibold text-secondary transition-colors hover:bg-surface hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {copied === "key" ? <Icon.check className="h-3 w-3 text-success-text" /> : <Icon.copy className="h-3 w-3" />}
              {copied === "key" ? tc("copied") : tc("copy")}
            </button>
          </div>
        </div>

        {/* Snippet */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-2xs font-semibold uppercase tracking-wider text-faint">{t("embedCode")}</span>
            <button
              onClick={() => copy(snippet, "snippet")}
              className={cn("text-2xs font-medium transition-colors", copied === "snippet" ? "text-success-text" : "text-accent-text hover:underline")}
            >
              {copied === "snippet" ? `✓ ${tc("copied")}` : tc("copy")}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-md border border-line bg-inset px-2.5 py-2.5 text-2xs leading-relaxed text-secondary">
            {snippet}
          </pre>
        </div>
      </div>
    </Card>
  );
}
