"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/components/ui/cn";

/** Compact EN/TR toggle. Switches locale while preserving the current path. */
export default function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function switchTo(next: string) {
    if (next === locale) return;
    // Preserve the current route and its dynamic params under the new locale.
    router.replace(
      // @ts-expect-error -- pathname is a known internal route
      { pathname, params },
      { locale: next },
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border border-line bg-raised p-0.5",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-pressed={l === locale}
          className={cn(
            "rounded px-2 py-0.5 text-2xs font-semibold uppercase transition-colors",
            l === locale ? "bg-surface text-primary" : "text-subtle hover:text-primary",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
