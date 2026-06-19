import { Suspense } from "react";
import { listProjects, parseSettings } from "@/lib/repo";
import { env } from "@/lib/env";
import ShellClient from "./ShellClient";
import type { WidgetOption } from "./WidgetSwitcher";

export default function Shell({ children }: { children: React.ReactNode }) {
  const widgets: WidgetOption[] = listProjects().map((p) => ({
    id: p.id,
    name: p.name,
    themeSlug: p.theme_slug,
    accentColor: parseSettings(p).accentColor,
  }));

  const user = env.adminUser || "admin";

  return (
    <Suspense fallback={
      <div className="flex h-screen flex-col bg-canvas">
        <div className="h-12 shrink-0 border-b border-line bg-base" />
      </div>
    }>
      <ShellClient widgets={widgets} user={user}>
        {children}
      </ShellClient>
    </Suspense>
  );
}
