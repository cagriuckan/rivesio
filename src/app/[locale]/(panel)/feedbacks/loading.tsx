import PageContent from "@/components/layout/PageContent";
import { InboxSkeleton } from "@/components/feedbacks/InboxSkeleton";

export default function FeedbacksLoading() {
  return (
    <PageContent className="flex h-full max-w-none flex-col !px-0 !py-0">
      <InboxSkeleton />
    </PageContent>
  );
}
