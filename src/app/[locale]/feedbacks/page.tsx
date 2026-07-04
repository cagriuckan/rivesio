import Shell from "@/components/layout/Shell";
import PageContent from "@/components/layout/PageContent";
import Inbox from "@/components/feedbacks/Inbox";
import { listFeedbacks } from "@/lib/admin-repo";
import { getAccessibleProject } from "@/lib/agent-repo";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ w?: string; f?: string }>;

export default async function FeedbacksPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const project = sp.w ? await getAccessibleProject(user.id, sp.w) : undefined;
  const feedbacks = await listFeedbacks(user.id, { projectId: project?.id });
  const initialSelectedId = sp.f && feedbacks.some((f) => f.id === sp.f) ? sp.f : null;

  return (
    <Shell>
      <PageContent className="flex h-full max-w-none flex-col !px-0 !py-0">
        <Inbox initialItems={feedbacks} initialSelectedId={initialSelectedId} projectId={project?.id} />
      </PageContent>
    </Shell>
  );
}
