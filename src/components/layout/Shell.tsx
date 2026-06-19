import { Suspense } from "react";
import { listProjects, parseSettings } from "@/lib/repo";
import { env } from "@/lib/env";
import Sidebar from "./Sidebar";
import type { WidgetOption } from "./WidgetSwitcher";

/** App frame: data-aware sidebar (server-gathered) + scrollable main area. */
export default function Shell({ children }: { children: React.ReactNode }) {
  const widgets: WidgetOption[] = listProjects().map((p) => ({
    id: p.id,
    name: p.name,
    themeSlug: p.theme_slug,
    accentColor: parseSettings(p).accentColor,
  }));

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Suspense fallback={<div className="w-[248px] shrink-0 border-r border-line bg-base" />}>
        <Sidebar widgets={widgets} user={env.adminUser || "admin"} />
      </Suspense>
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1180px] px-8 py-7">{children}</div>
      </main>
    </div>
  );
}
