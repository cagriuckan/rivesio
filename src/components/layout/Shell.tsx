import { Suspense } from "react";
import { parseSettings } from "@/lib/repo";
import { getStats, listOwnedProjects } from "@/lib/admin-repo";
import { listAccessibleProjects } from "@/lib/agent-repo";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ShellClient from "./ShellClient";
import type { WidgetOption } from "./WidgetSwitcher";

export default async function Shell({ children }: { children: React.ReactNode }) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect("/login");
  const [projects, ownedProjects, stats] = await Promise.all([
    listAccessibleProjects(sessionUser.id),
    listOwnedProjects(sessionUser.id),
    getStats(sessionUser.id),
  ]);

  const widgets: WidgetOption[] = projects.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    accentColor: parseSettings(p).accentColor,
  }));

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
