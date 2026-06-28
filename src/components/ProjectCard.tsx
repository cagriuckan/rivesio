"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";

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
  const [busy, setBusy] = useState(false);

  const scriptUrl = `${baseUrl}/api/widget/${widgetKey}.js`;
  const snippet = `<script src="${scriptUrl}" async></script>`;

  async function copy(text: string, kind: "key" | "snippet") {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1800);
  }

  async function rotate() {
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
          <span className="text-2xs text-subtle">{project.themeSlug}</span>
        </div>
        <Link
          href={`/?w=${project.id}`}
          className="flex items-center gap-1 text-xs font-medium text-accent-text hover:underline"
        >
          {t("panel")} <Icon.chevronRight className="h-3 w-3" />
        </Link>
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
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-md border border-line bg-inset px-2.5 py-2 text-2xs text-secondary">
              {widgetKey}
            </code>
            <Button size="sm" variant="secondary" onClick={() => copy(widgetKey, "key")}>
              {copied === "key" ? <Icon.check className="h-3.5 w-3.5 text-success-text" /> : <Icon.copy className="h-3.5 w-3.5" />}
              {copied === "key" ? tc("copied") : tc("copy")}
            </Button>
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

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/projects/${project.id}/settings`}
            className="inline-flex h-8 items-center gap-2 rounded-md border border-line bg-transparent px-3 text-xs font-semibold text-secondary transition-all hover:bg-raised hover:text-primary hover:border-line-strong"
          >
            <Icon.code className="h-3.5 w-3.5" />
            {t("settings")}
          </Link>
          <Button size="sm" variant="outline" onClick={rotate} disabled={busy}>
            <Icon.refresh className="h-3.5 w-3.5" />
            {t("rotateKey")}
          </Button>
          <Button size="sm" variant="danger" className="ml-auto" onClick={remove} disabled={busy}>
            <Icon.trash className="h-3.5 w-3.5" />
            {tc("delete")}
          </Button>
        </div>
      </div>
    </Card>
  );
}
