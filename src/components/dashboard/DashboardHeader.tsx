"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";
import ContentActions from "@/components/layout/ContentActions";

export default function DashboardHeader({
  title,
  subtitle,
  image,
  days,
  projectId,
}: {
  title: string;
  subtitle: string;
  image?: string | null;
  days: number;
  projectId?: string;
}) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (projectId) p.set("w", projectId);
    if (q.trim()) p.set("q", q.trim());
    router.push(`/feedbacks?${p}`);
  }

  const buildPeriodHref = (d: number) => {
    const p = new URLSearchParams();
    if (projectId) p.set("w", projectId);
    p.set("period", String(d));
    return `/?${p}`;
  };

  return (
    <div className="mb-6 shrink-0 border-b border-line pb-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        {/* Left: identity */}
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-raised ring-1 ring-line">
            <Image
              src={image || "/icon-512.png"}
              alt=""
              width={40}
              height={40}
              className={image ? "h-10 w-10 rounded-full object-cover" : "h-6 w-6"}
            />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-md font-semibold leading-tight text-strong lg:text-lg">{title}</h1>
            <p className="mt-0.5 truncate text-xs text-subtle lg:text-sm">{subtitle}</p>
          </div>
        </div>

        {/* Center: search */}
        <form
          action={`/${locale}/feedbacks`}
          onSubmit={submit}
          role="search"
          className="order-last w-full md:order-none md:mx-auto md:w-auto md:min-w-0 md:max-w-md md:flex-1"
        >
          <div className="group relative">
            <Icon.search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint transition-colors group-focus-within:text-accent" />
            {projectId && <input type="hidden" name="w" value={projectId} />}
            <input
              ref={inputRef}
              name="q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchLabel")}
              className="h-10 w-full rounded-lg border border-line pl-10 pr-16 text-sm text-primary placeholder:text-faint outline-none transition-colors hover:border-line-strong focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
            <kbd className="pointer-events-none absolute right-3.5 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-surface px-1.5 py-0.5 text-[10px] font-medium text-faint md:inline-block">
              {isMac ? "⌘ + K" : "Ctrl + K"}
            </kbd>
          </div>
        </form>

        {/* Right: period switcher + global actions */}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-0.5 rounded-full border border-line p-0.5">
            {[7, 30, 90].map((d) => (
              <Link
                key={d}
                href={buildPeriodHref(d)}
                className={`rounded-full px-3 py-2 text-xs font-medium transition-colors ${
                  days === d ? "bg-accent text-white" : "text-subtle hover:bg-accent hover:text-white"
                }`}
              >
                {d}g
              </Link>
            ))}
          </div>
          <div className="hidden md:block">
            <Suspense>
              <ContentActions />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
