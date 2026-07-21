"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";

export function AuthError({ message }: { message: string }) {
  return (
    <div className="mt-4 flex items-center gap-2 rounded-md border border-danger/20 bg-danger-soft px-3 py-2.5 text-sm text-danger-text" role="alert">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </div>
  );
}

/** Tilted browser-chrome mockup framing the real dashboard screenshot. */
function BrowserPreview() {
  return (
    <div
      className="w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-white shadow-2xl"
      style={{ transform: "rotate(-2.5deg)" }}
    >
      <div className="flex items-center gap-2.5 border-b border-line bg-raised px-3.5 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
        <div className="mx-auto flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] text-subtle ring-1 ring-line">
          <Icon.lock className="h-3 w-3" />
          app.rivesio.io
        </div>
      </div>
      {/* crop to the header + metric cards + chart — the most legible, colorful part at this size */}
      <div className="relative h-52 w-full">
        <Image src="/dashboard-preview.png" alt="Rivesio dashboard" fill priority className="object-cover object-top" />
      </div>
    </div>
  );
}

/**
 * Auth layout: a soft "sky" backdrop with a top bar (logo + tagline), and a
 * large split card — product preview mockup on one side, form on the other.
 * Fixed light palette, independent of the app's dark/light theme toggle.
 */
export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("auth");
  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, #eef0fb 0%, #f5f4fa 45%, #f2f3f5 100%)" }}
    >
      {/* decorative "sky" blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-violet-soft blur-3xl" />
        <div className="absolute -top-16 right-0 h-80 w-80 rounded-full bg-accent-soft blur-3xl" />
        <div className="absolute bottom-0 -left-16 h-72 w-72 rounded-full bg-[#c7d2fe]/40 blur-3xl" />
      </div>

      {/* top bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7 sm:px-8">
        <div>
          <Image src="/logo-light.png" alt="Rivesio" width={130} height={36} className="h-8 w-auto" priority />
          <p className="mt-1.5 text-sm text-subtle">{t("tagline")}</p>
        </div>
        <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-subtle transition hover:text-primary">
          <Icon.chevronLeft className="h-4 w-4" />
          {t("backToHome")}
        </Link>
      </header>

      {/* main card */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-4 pb-12 sm:px-6">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-line lg:grid-cols-2">
          {/* left: product preview */}
          <div
            className="relative hidden items-center justify-center overflow-hidden p-12 lg:flex"
            style={{ background: "linear-gradient(160deg, #f2effc 0%, #eef1fd 100%)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                backgroundImage: "radial-gradient(rgba(11,20,55,0.08) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
                maskImage: "radial-gradient(65% 60% at 50% 50%, black, transparent)",
              }}
            />
            <BrowserPreview />
          </div>

          {/* right: form */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
            <div className="mx-auto w-full max-w-sm">
              <h1 className="text-2xl font-bold tracking-tight text-strong">{title}</h1>
              <p className="mt-1.5 text-sm text-subtle">{subtitle}</p>
              <div className="mt-7">{children}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
