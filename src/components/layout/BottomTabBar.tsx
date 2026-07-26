"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import type { WidgetOption } from "./WidgetSwitcher";

const ALL_TABS = [
  { href: "/", key: "overviewShort", icon: Icon.dashboard },
  { href: "/feedbacks", key: "feedbacksShort", icon: Icon.feedback },
  { href: "/sites", key: "sites", icon: Icon.globe },
  { href: "/projects", key: "widgets", icon: Icon.code },
] as const;

function hapticTick() {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(8);
    }
  } catch {
    // Ignore unsupported / blocked vibration.
  }
}

/**
 * Web port of the expo-glass-tabs interaction model:
 * floating liquid-glass pill, minimize-on-scroll, sliding highlight, finger scrubbing.
 * (Native UIGlassEffect / Reanimated aren't available in Next — CSS + pointer events.)
 */
export default function BottomTabBar({
  widgets: _widgets,
  hasOwnedProjects = true,
  scrollParentRef,
}: {
  widgets: WidgetOption[];
  hasOwnedProjects?: boolean;
  scrollParentRef?: RefObject<HTMLElement | null>;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const w = params.get("w");
  const withWidget = (href: string) => (w ? `${href}?w=${w}` : href);

  const TABS = hasOwnedProjects
    ? ALL_TABS
    : ALL_TABS.filter((tab) => tab.key === "overviewShort" || tab.key === "feedbacksShort");

  const routeIndex = Math.max(
    0,
    TABS.findIndex((tab) => (tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href))),
  );

  const [minimized, setMinimized] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(routeIndex);
  const [scrubbing, setScrubbing] = useState(false);

  const barRef = useRef<HTMLDivElement>(null);
  const pointerActive = useRef(false);
  const didScrub = useRef(false);
  const suppressNextClick = useRef(false);
  const startX = useRef(0);
  const lastHapticIndex = useRef(routeIndex);
  const lastScrollY = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!scrubbing) setHighlightIndex(routeIndex);
  }, [routeIndex, scrubbing]);

  // Minimize on scroll (Revolut-style: shrink pill + hide labels, icons stay).
  useEffect(() => {
    const el = scrollParentRef?.current;
    if (!el) return;

    const onScroll = () => {
      const y = el.scrollTop;
      const dy = y - lastScrollY.current;
      lastScrollY.current = y;
      if (Math.abs(dy) < 2) return;

      if (dy > 4 && y > 24) setMinimized(true);
      else if (dy < -4) setMinimized(false);

      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (el.scrollTop < 16) setMinimized(false);
      }, 900);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [scrollParentRef]);

  function indexFromClientX(clientX: number): number {
    const bar = barRef.current;
    if (!bar) return routeIndex;
    const rect = bar.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width - 1);
    return Math.min(TABS.length - 1, Math.floor((x / rect.width) * TABS.length));
  }

  function onPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    pointerActive.current = true;
    didScrub.current = false;
    startX.current = e.clientX;
    lastHapticIndex.current = highlightIndex;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!pointerActive.current) return;
    if (!didScrub.current && Math.abs(e.clientX - startX.current) < 10) return;

    if (!didScrub.current) {
      didScrub.current = true;
      setScrubbing(true);
      setMinimized(false);
    }

    const idx = indexFromClientX(e.clientX);
    setHighlightIndex(idx);
    if (idx !== lastHapticIndex.current) {
      lastHapticIndex.current = idx;
      hapticTick();
    }
  }

  function endPointer(e: React.PointerEvent, cancelled = false) {
    const wasScrub = didScrub.current;
    const idx = indexFromClientX(e.clientX);
    pointerActive.current = false;
    didScrub.current = false;
    setScrubbing(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Already released.
    }

    if (cancelled) {
      setHighlightIndex(routeIndex);
      return;
    }

    // Scrub release navigates; plain tap lets the Link handle it.
    if (wasScrub) {
      suppressNextClick.current = true;
      setHighlightIndex(idx);
      const href = withWidget(TABS[idx].href);
      if (idx !== routeIndex) router.push(href);
    }
  }

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 md:hidden"
      aria-label={t("bottomNav")}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 10px)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-(image:--tabbar-edge-blur)"
      />

      <div className="pointer-events-auto relative px-5">
        <div
          ref={barRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(e) => endPointer(e)}
          onPointerCancel={(e) => endPointer(e, true)}
          className={cn(
            "relative mx-auto flex max-w-[22rem] touch-none select-none items-center overflow-hidden",
            "backdrop-blur-2xl backdrop-saturate-150",
            "bg-(--tabbar-glass-bg) shadow-(--tabbar-glass-shadow)",
            "transition-[max-width,padding,border-radius,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            minimized
              ? "max-w-[16.5rem] scale-[0.98] rounded-[1.35rem] px-1 py-1"
              : "rounded-[1.75rem] p-1.5",
          )}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-(image:--tabbar-glass-shine)" />
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-(--tabbar-glass-border)" />

          <div
            className={cn(
              "pointer-events-none absolute top-1.5 bottom-1.5 left-1.5 rounded-full",
              "bg-(image:--tabbar-bubble-bg) shadow-(--tabbar-bubble-shadow)",
              scrubbing
                ? "transition-none"
                : "duration-420 transition-transform ease-[cubic-bezier(0.34,1.45,0.64,1)]",
              minimized && "top-1! bottom-1! left-1!",
            )}
            style={{
              width: `calc((100% - ${minimized ? "0.5rem" : "0.75rem"}) / ${TABS.length})`,
              transform: `translateX(${highlightIndex * 100}%)`,
            }}
          />

          {TABS.map((tab, i) => {
            const active = i === highlightIndex;
            const TabIcon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={withWidget(tab.href)}
                aria-current={i === routeIndex ? "page" : undefined}
                onClick={(e) => {
                  if (suppressNextClick.current) {
                    e.preventDefault();
                    suppressNextClick.current = false;
                  }
                }}
                className={cn(
                  "relative z-10 flex min-w-0 flex-1 flex-col items-center justify-center rounded-full",
                  "font-semibold transition-colors duration-200",
                  minimized ? "gap-0 px-1.5 py-2" : "gap-0.5 px-2 py-1.5",
                  active ? "text-(--tabbar-active-tint)" : "text-(--tabbar-inactive-tint)",
                )}
              >
                <TabIcon
                  className={cn(
                    "transition-transform duration-300",
                    minimized ? "h-[17px] w-[17px]" : "h-[18px] w-[18px]",
                    active && "scale-110",
                  )}
                />
                <span
                  className={cn(
                    "max-w-full truncate text-[10px] leading-none transition-[opacity,height,margin,transform] duration-250",
                    minimized
                      ? "pointer-events-none m-0 h-0 scale-75 opacity-0"
                      : "h-auto scale-100 opacity-100",
                  )}
                >
                  {t(tab.key)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
