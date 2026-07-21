"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import createGlobe from "cobe";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

/**
 * Feature bento grid for the landing page — an uneven 4-tile grid with
 * live micro-interactions, in the spirit of the Aceternity "AI SaaS"
 * template (features-section-demo-3). Client component: the notification
 * globe (cobe) and hover animations need the browser.
 */

function Tile({
  className,
  title,
  desc,
  children,
}: {
  className?: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("group relative flex flex-col overflow-hidden p-7 sm:p-8", className)}>
      <h3 className="text-lg font-semibold tracking-tight text-white/90">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/50">{desc}</p>
      <div className="relative mt-6 flex-1">{children}</div>
    </div>
  );
}

/* ── Tile 1: multi-site inbox — a live-rotating ticker across sites ── */
const INBOX_SITES = [
  { domain: "shop.example.com", initial: "S", color: "#f59e0b" },
  { domain: "app.example.com", initial: "A", color: "#8b5cf6" },
  { domain: "docs.example.com", initial: "D", color: "#38bdf8" },
] as const;

function InboxViz() {
  const t = useTranslations("landing");
  const events = useMemo(
    () => [
      { msg: t("hero.mockFeedback1"), status: t("hero.mockStatusOpen"), dot: "#f87171" },
      { msg: t("hero.mockFeedback2"), status: t("hero.mockStatusInProgress"), dot: "#fbbf24" },
      { msg: t("hero.mockFeedback3"), status: t("hero.mockStatusResolved"), dot: "#34d399" },
    ],
    [t]
  );

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const rows = events.map((e, i) => ({ ...e, site: INBOX_SITES[(tick + i) % INBOX_SITES.length] }));

  return (
    <div>
      <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-medium text-emerald-300/80">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        {t("bento.liveFeed")}
      </div>
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <div
            key={`${r.site.domain}-${tick}`}
            className="lp-row-in flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
              style={{ background: `${r.site.color}26`, color: r.site.color }}
            >
              {r.site.initial}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[10px] font-medium text-white/35">{r.site.domain}</div>
              <div className="truncate text-sm text-white/80">{r.msg}</div>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-white/50">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.dot }} />
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Tile 2: screenshots & annotations — annotations continuously
   "draw in" over two regions of a faux page, on an infinite loop ── */
function ScreenshotViz() {
  const t = useTranslations("landing");
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[260px] overflow-hidden rounded-xl border border-white/10 bg-[#0d0d18]">
      {/* faux page skeleton */}
      <div className="space-y-2 p-4">
        <div className="h-2.5 w-1/2 rounded-full bg-white/10" />
        <div className="h-2 w-3/4 rounded-full bg-white/[0.06]" />
        <div className="h-2 w-2/3 rounded-full bg-white/[0.06]" />
        <div className="mt-4 h-16 rounded-lg bg-white/[0.04]" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        {/* annotation A — draws over the heading lines */}
        <div className="lp-ann-box absolute left-4 right-6 top-3 h-11 rounded-md border-2 border-dashed border-violet-400/80">
          <span className="absolute left-1.5 top-1.5 h-2 w-2 animate-ping rounded-full bg-violet-300" />
        </div>
        <span
          className="lp-ann-label absolute left-4 top-16 rounded-md px-2 py-1 text-[11px] font-semibold text-white shadow-lg"
          style={{ background: "linear-gradient(120deg,#7c5cf6,#5b7cfa)" }}
        >
          {t("bento.annotation")}
        </span>

        {/* annotation B — draws over the image block, half a cycle later */}
        <div
          className="lp-ann-box absolute inset-x-4 bottom-4 h-16 rounded-md border-2 border-dashed border-sky-400/70"
          style={{ animationDelay: "3.5s" }}
        >
          <span className="absolute left-1.5 top-1.5 h-2 w-2 animate-ping rounded-full bg-sky-300" />
        </div>
        <span
          className="lp-ann-label absolute bottom-1 left-4 rounded-md px-2 py-1 text-[11px] font-semibold text-white shadow-lg"
          style={{ background: "linear-gradient(120deg,#38bdf8,#5b7cfa)", animationDelay: "3.5s" }}
        >
          {t("bento.annotation2")}
        </span>
      </div>
    </div>
  );
}

/* ── Tile 3: drop-in widget (code) ── */
function CodeViz() {
  const t = useTranslations("landing");
  return (
    <div className="relative">
      <pre className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0b14] p-4 font-mono text-[12px] leading-relaxed">
        <code>
          <span className="text-white/35">{"<!-- "}{t("bento.codeComment")}{" </body> -->"}</span>
          {"\n"}
          <span className="text-violet-300">{"<script"}</span>
          {"\n  "}
          <span className="text-sky-300">src</span>
          <span className="text-white/50">=</span>
          <span className="text-emerald-300">{'"cdn.rivesio.io/w.js"'}</span>
          {"\n  "}
          <span className="text-sky-300">data-key</span>
          <span className="text-white/50">=</span>
          <span className="text-emerald-300">{'"wk_live_a1b2"'}</span>
          {"\n  "}
          <span className="text-sky-300">defer</span>
          {"\n"}
          <span className="text-violet-300">{"></script>"}</span>
        </code>
      </pre>
      {/* floating launcher */}
      <div className="absolute -bottom-3 -right-1 flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-white shadow-xl transition-transform duration-300 group-hover:-translate-y-1"
        style={{ background: "linear-gradient(120deg,#7c5cf6,#5b7cfa)" }}
      >
        <Icon.feedback className="h-4 w-4" />
        {t("bento.launcher")}
      </div>
    </div>
  );
}

/* ── Tile 4: real-time notifications (globe) ── */
function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    let phi = 0;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 440 * 2,
      height: 440 * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 12000,
      mapBrightness: 5,
      baseColor: [0.28, 0.24, 0.42],
      markerColor: [0.55, 0.42, 0.98],
      glowColor: [0.32, 0.26, 0.5],
      markers: [
        { location: [37.7595, -122.4367], size: 0.05 },
        { location: [40.7128, -74.006], size: 0.06 },
        { location: [51.5072, -0.1276], size: 0.05 },
        { location: [41.0082, 28.9784], size: 0.06 },
        { location: [1.3521, 103.8198], size: 0.05 },
      ],
    });
    let raf = requestAnimationFrame(function spin() {
      phi += 0.006;
      globe.update({ phi });
      raf = requestAnimationFrame(spin);
    });
    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ width: 440, height: 440, maxWidth: "100%", aspectRatio: 1 }}
      className="absolute -bottom-24 left-1/2 -translate-x-1/2 opacity-90"
    />
  );
}

function GlobeViz() {
  const t = useTranslations("landing");
  return (
    <div className="relative h-44 overflow-hidden">
      <div
        className="absolute right-0 top-0 z-10 flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#12121f]/90 px-3 py-2.5 shadow-xl backdrop-blur transition-all duration-500 group-hover:-translate-y-1"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "rgba(139,92,246,0.18)" }}>
          <Icon.bell className="h-3.5 w-3.5 text-violet-300" />
        </span>
        <div className="leading-tight">
          <div className="text-xs font-semibold text-white/85">{t("bento.notifTitle")}</div>
          <div className="text-[11px] text-white/45">{t("hero.mockNew")}</div>
        </div>
      </div>
      <Globe />
    </div>
  );
}

export default function FeatureBento() {
  const t = useTranslations("landing");
  return (
    <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] lg:grid-cols-6">
      <Tile
        className="border-b border-white/10 lg:col-span-4 lg:border-r"
        title={t("features.inbox.title")}
        desc={t("features.inbox.desc")}
      >
        <InboxViz />
      </Tile>
      <Tile
        className="border-b border-white/10 lg:col-span-2"
        title={t("features.screenshots.title")}
        desc={t("features.screenshots.desc")}
      >
        <ScreenshotViz />
      </Tile>
      <Tile
        className="border-b border-white/10 lg:col-span-3 lg:border-r lg:border-b-0"
        title={t("features.widget.title")}
        desc={t("features.widget.desc")}
      >
        <CodeViz />
      </Tile>
      <Tile
        className="lg:col-span-3"
        title={t("features.agents.title")}
        desc={t("features.agents.desc")}
      >
        <GlobeViz />
      </Tile>
    </div>
  );
}
