import { Skeleton } from "@/components/ui/Skeleton";
import PageContent from "@/components/layout/PageContent";

/** Shared header placeholder matching PageHeader geometry. */
export function PageHeaderSkeleton({ actions = true }: { actions?: boolean }) {
  return (
    <div className="mb-6 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
      <div className="flex min-w-0 items-center gap-3">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
        <div className="min-w-0">
          <Skeleton className="h-4 w-36 rounded lg:w-44" />
          <Skeleton className="mt-1.5 h-3 w-24 rounded lg:w-32" />
        </div>
      </div>
      {actions && (
        <div className="ml-auto flex items-center gap-3">
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="hidden h-9 w-9 rounded-full md:block" />
        </div>
      )}
    </div>
  );
}

/** Overview / dashboard body. */
export function DashboardSkeleton() {
  return (
    <PageContent>
      <div className="mb-6 flex shrink-0 flex-wrap items-center gap-x-4 gap-y-3 border-b border-line pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="min-w-0">
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="mt-1.5 h-3 w-36 rounded" />
          </div>
        </div>
        <Skeleton className="order-last h-10 w-full rounded-lg md:order-none md:mx-auto md:max-w-md md:flex-1" />
        <div className="ml-auto flex items-center gap-3">
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="hidden h-9 w-9 rounded-full md:block" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,0.9fr)]">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Skeleton className="h-56 rounded-2xl xl:col-span-2" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      </div>
    </PageContent>
  );
}

/** Sites list page. */
export function SitesSkeleton() {
  return (
    <PageContent>
      <PageHeaderSkeleton />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="border-b border-line px-4 py-3">
          <Skeleton className="h-9 max-w-sm rounded-lg" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-line/60 px-4 py-3.5 last:border-b-0">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-3.5 rounded" style={{ width: `${40 + (i % 4) * 10}%` }} />
              <Skeleton className="mt-1.5 h-2.5 w-24 rounded" />
            </div>
            <Skeleton className="hidden h-8 w-8 rounded-full sm:block" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </PageContent>
  );
}

/** Projects / widgets grid. */
export function ProjectsSkeleton() {
  return (
    <PageContent>
      <PageHeaderSkeleton />
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-3.5 w-32 rounded" />
                <Skeleton className="mt-1.5 h-2.5 w-20 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-line border-b border-line">
              <div className="px-5 py-3">
                <Skeleton className="h-5 w-10 rounded" />
                <Skeleton className="mt-1.5 h-2.5 w-16 rounded" />
              </div>
              <div className="px-5 py-3">
                <Skeleton className="h-5 w-8 rounded" />
                <Skeleton className="mt-1.5 h-2.5 w-14 rounded" />
              </div>
            </div>
            <div className="space-y-3 p-5">
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </PageContent>
  );
}

/** Settings / nested settings forms. */
export function SettingsSkeleton() {
  return (
    <PageContent>
      <PageHeaderSkeleton actions={false} />
      <div className="max-w-4xl space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start justify-between gap-6 border-b border-line py-4">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-3.5 w-28 rounded" />
              <Skeleton className="mt-2 h-3 w-48 rounded" />
            </div>
            <Skeleton className="h-9 w-48 rounded-lg" />
          </div>
        ))}
      </div>
    </PageContent>
  );
}
