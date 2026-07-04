import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/components/ui/cn";

/** Placeholder rows for the conversation list while it loads. */
export function ConversationListSkeleton({ rows = 7 }: { rows?: number }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-line p-3">
        <Skeleton className="h-9 w-full rounded-lg" />
        <div className="mt-2.5 flex items-center gap-1.5">
          <Skeleton className="h-7 w-14 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 border-b border-line/60 px-3 py-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-3.5 rounded" style={{ width: `${45 + ((i * 13) % 30)}%` }} />
                <Skeleton className="h-2.5 w-8 rounded" />
              </div>
              <Skeleton className="mt-2 h-3 rounded" style={{ width: `${60 + ((i * 17) % 30)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Alternating message bubbles shown while a conversation thread loads. */
export function ChatThreadSkeleton() {
  const bubbles: { mine: boolean; w: string }[] = [
    { mine: false, w: "62%" },
    { mine: false, w: "40%" },
    { mine: true, w: "55%" },
    { mine: false, w: "70%" },
    { mine: true, w: "48%" },
  ];
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 py-2">
      <div className="my-2 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <Skeleton className="h-5 w-28 rounded-full" />
        <span className="h-px flex-1 bg-line" />
      </div>
      {bubbles.map((b, i) => (
        <div key={i} className={cn("flex flex-col gap-1", b.mine ? "items-end" : "items-start")}>
          <Skeleton
            className={cn("h-12 rounded-2xl", b.mine ? "rounded-br-md" : "rounded-bl-md")}
            style={{ width: b.w }}
          />
          <Skeleton className="h-2.5 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

/** Full three-pane inbox placeholder for the route-level loading state. */
export function InboxSkeleton() {
  return (
    <div className="flex h-full min-h-0 bg-canvas">
      <div className="w-full shrink-0 border-r border-line bg-base lg:block lg:w-80 xl:w-96">
        <ConversationListSkeleton />
      </div>
      <div className="hidden min-w-0 flex-1 flex-col lg:flex">
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-base px-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-3.5 w-40 rounded" />
            <Skeleton className="mt-1.5 h-2.5 w-24 rounded" />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden px-4 py-4">
          <ChatThreadSkeleton />
        </div>
      </div>
    </div>
  );
}
