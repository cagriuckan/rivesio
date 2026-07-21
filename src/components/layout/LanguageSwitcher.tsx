"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/components/ui/cn";

type Variant = "default" | "dark";

/** Compact EN/TR toggle. Switches locale while preserving the current path. */
export default function LanguageSwitcher({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: Variant;
}) {
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

  const dark = variant === "dark";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 p-0.5",
        dark
          ? "rounded-full border border-white/15 bg-white/[0.04]"
          : "rounded-md border border-line bg-raised",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            aria-pressed={active}
            className={cn(
              "text-xs font-semibold uppercase transition-colors",
              dark
                ? cn(
                    "rounded-full px-2.5 py-1",
                    active ? "bg-white text-black" : "text-white/55 hover:text-white",
                  )
                : cn(
                    "rounded px-2 py-0.5 flex-auto",
                    active ? "bg-surface text-primary" : "text-subtle hover:text-primary",
                  ),
            )}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
