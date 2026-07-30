import { Suspense } from "react";
import { cookies } from "next/headers";
import { parseSettings } from "@/lib/repo";
import { getStats, listOwnedProjects } from "@/lib/admin-repo";
import { listAccessibleProjects } from "@/lib/agent-repo";
import { getSessionUser } from "@/lib/auth";
import { WIDGET_SCOPE_COOKIE } from "@/lib/widget-scope";
import { redirect } from "next/navigation";
import ShellClient from "./ShellClient";
import type { WidgetOption } from "./WidgetSwitcher";

export default async function Shell({ children }: { children: React.ReactNode }) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect("/login");
  // Layouts can't read searchParams; middleware mirrors `?w=` into this cookie
  // so sidebar badges stay scoped to the active widget.
  const cookieWidgetId = (await cookies()).get(WIDGET_SCOPE_COOKIE)?.value || undefined;
  const [projects, ownedProjects] = await Promise.all([
    listAccessibleProjects(sessionUser.id),
    listOwnedProjects(sessionUser.id),
  ]);

  const widgets: WidgetOption[] = projects.map((p) => {
    const settings = parseSettings(p);
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      accentColor: settings.accentColor,
      logoUrl: settings.logoUrl ?? null,
      isActive: p.is_active,
    };
  });

  const widgetId =
    cookieWidgetId && widgets.some((w) => w.id === cookieWidgetId) ? cookieWidgetId : undefined;
  const stats = await getStats(sessionUser.id, widgetId);

  const navCounts = {
    feedbacks: stats.newFeedbacks,
    sites: stats.pendingSites,
  };

  const user = sessionUser.name || sessionUser.email;
  const userInfo = { name: sessionUser.name, email: sessionUser.email, image: sessionUser.image };
  // Users who only agent on others' widgets (no owned projects) don't get
  // site/widget-management nav — those stay owner-only surfaces.
  const hasOwnedProjects = ownedProjects.length > 0;

  return (
    <Suspense fallback={
      <div className="flex h-screen flex-col bg-canvas">
        <div className="h-12 shrink-0 border-b border-line bg-base" />
      </div>
    }>
      <ShellClient widgets={widgets} user={user} userInfo={userInfo} navCounts={navCounts} hasOwnedProjects={hasOwnedProjects}>
        {children}
      </ShellClient>
    </Suspense>
  );
}
