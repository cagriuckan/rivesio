import PageContent from "@/components/layout/PageContent";
import Inbox from "@/components/feedbacks/Inbox";
import { listFeedbacks } from "@/lib/admin-repo";
import { getAccessibleProject } from "@/lib/agent-repo";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

type SearchParams = Promise<{ w?: string; f?: string; q?: string; category?: string }>;

export default async function FeedbacksPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const project = sp.w ? await getAccessibleProject(user.id, sp.w) : undefined;
  const feedbacks = await listFeedbacks(user.id, { projectId: project?.id });
  const initialSelectedId = sp.f && feedbacks.some((f) => f.id === sp.f) ? sp.f : null;
  const categoryOptions = Array.from(new Set(feedbacks.map((f) => f.category).filter(Boolean)));
  const initialCategory =
    sp.category && categoryOptions.includes(sp.category) ? sp.category : undefined;

  return (
    <PageContent className="flex h-full max-w-none flex-col !px-0 !py-0">
      <Inbox
        initialItems={feedbacks}
        initialSelectedId={initialSelectedId}
        projectId={project?.id}
        initialQuery={sp.q}
        initialCategory={initialCategory}
      />
    </PageContent>
  );
}
