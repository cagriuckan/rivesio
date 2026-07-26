import { getSessionUser } from "@/lib/auth";
import { DashboardSkeleton } from "@/components/layout/PageSkeleton";

/** Only show chrome for signed-in users — guests hitting `/` should not flash a dashboard skeleton over the landing page. */
export default async function PanelLoading() {
  const user = await getSessionUser();
  if (!user) return null;
  return <DashboardSkeleton />;
}
