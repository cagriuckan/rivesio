import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Script from "next/script";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";
import HeroBackground from "@/components/landing/HeroBackground";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

const colors = {
  background: "#060609",
  border: "rgba(255,255,255,0.09)",
  glow: "radial-gradient(60% 55% at 50% 0%, rgba(124,92,246,0.28) 0%, rgba(59,130,246,0.08) 42%, transparent 72%)",
};

const featureCards = [
  { key: "capture", icon: Icon.feedback, className: "md:col-span-2" },
  { key: "screenshots", icon: Icon.image, className: "" },
  { key: "inbox", icon: Icon.inbox, className: "" },
  { key: "chat", icon: Icon.control, className: "md:col-span-2" },
  { key: "organize", icon: Icon.layers, className: "md:col-span-2" },
  { key: "notifications", icon: Icon.bell, className: "" },
] as const;

type FeatureKey = (typeof featureCards)[number]["key"];

function FeatureVisual({
  feature,
  labels,
}: {
  feature: FeatureKey;
  labels: {
    feedback: string;
    captured: string;
    chatUser: string;
    chatReply: string;
    open: string;
    inProgress: string;
    resolved: string;
    notifTitle: string;
    notifBody: string;
  };
}) {
  if (feature === "capture") {
    return (
      <div className="mt-7 rounded-2xl border border-white/10 bg-black/25 p-4">
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>rivesio.com</span>
          <span className="rounded-full bg-violet-400/10 px-2 py-1 text-violet-200">{labels.feedback}</span>
        </div>
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <div className="h-2.5 w-28 rounded-full bg-white/15" />
          <div className="mt-3 h-2 w-full rounded-full bg-white/[0.07]" />
          <div className="mt-2 h-2 w-[80%] rounded-full bg-white/[0.07]" />
        </div>
      </div>
    );
  }

  if (feature === "screenshots") {
    return (
      <div className="relative mt-7 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
        <div className="absolute inset-4 rounded-lg border border-dashed border-violet-300/40" />
        <div className="absolute left-[28%] top-[32%] h-10 w-16 rounded-lg border-2 border-violet-300" />
        <div className="absolute left-[45%] top-[55%] h-px w-20 rotate-12 bg-violet-300" />
        <span className="absolute bottom-3 right-3 rounded-full bg-violet-500 px-3 py-1 text-[11px] text-white">
          {labels.captured}
        </span>
      </div>
    );
  }

  if (feature === "inbox") {
    return (
      <div className="mt-7 space-y-2">
        {[labels.open, labels.inProgress, labels.resolved].map((status, index) => (
          <div
            key={status}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5"
          >
            <div className="h-2 w-[55%] rounded-full bg-white/10" />
            <span className="flex items-center gap-1.5 text-[10px] text-white/45">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  index === 0 ? "bg-red-400" : index === 1 ? "bg-amber-400" : "bg-emerald-400"
                }`}
              />
              {status}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (feature === "chat") {
    return (
      <div className="mt-7 space-y-3">
        <div className="max-w-[78%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white/65">
          {labels.chatUser}
        </div>
        <div className="ml-auto max-w-[78%] rounded-2xl rounded-br-md border border-violet-300/20 bg-violet-400/10 px-4 py-3 text-sm text-violet-100">
          {labels.chatReply}
        </div>
      </div>
    );
  }

  if (feature === "organize") {
    return (
      <div className="mt-7 grid grid-cols-3 gap-2">
        {[labels.open, labels.inProgress, labels.resolved].map((label, index) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
            <span
              className={`mb-6 block h-1.5 w-1.5 rounded-full ${
                index === 0 ? "bg-red-400" : index === 1 ? "bg-amber-400" : "bg-emerald-400"
              }`}
            />
            <p className="text-[11px] text-white/45">{label}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-400/15 text-violet-200">
          <Icon.bell className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/80">{labels.notifTitle}</p>
          <p className="mt-1 text-xs leading-relaxed text-white/40">{labels.notifBody}</p>
        </div>
      </div>
    </div>
  );
}

function BetaBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-violet-300/25 bg-violet-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-200">
      {label}
    </span>
  );
}

export default async function LandingPage() {
  const t = await getTranslations("landing");
  const year = new Date().getFullYear();
  const visualLabels = {
    feedback: t("visual.feedback"),
    captured: t("visual.captured"),
    chatUser: t("visual.chatUser"),
    chatReply: t("visual.chatReply"),
    open: t("visual.open"),
    inProgress: t("visual.inProgress"),
    resolved: t("visual.resolved"),
    notifTitle: t("visual.notifTitle"),
    notifBody: t("visual.notifBody"),
  };

  return (
    <>
    <div className="min-h-screen overflow-x-hidden text-white antialiased" style={{ background: colors.background }}>
      <header className="fixed inset-x-0 top-4 z-50 px-4">
        <div
          className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 rounded-full px-4 backdrop-blur-xl sm:px-5"
          style={{ background: "rgba(13,13,24,0.78)", border: `1px solid ${colors.border}` }}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <Link href="/" className="shrink-0">
              <Image src="/logo-dark.png" alt="Rivesio" width={104} height={28} priority />
            </Link>
            <BetaBadge label={t("nav.beta")} />
          </div>

          <nav className="hidden items-center gap-6 text-sm text-white/60 md:flex" aria-label={t("nav.label")}>
            <a href="#features" className="transition hover:text-white">
              {t("nav.features")}
            </a>
            <a href="#faq" className="transition hover:text-white">
              {t("nav.faq")}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="dark" />
            <Link
              href="/login"
              className="hidden px-2 py-1.5 text-sm text-white/60 transition hover:text-white lg:block"
            >
              {t("nav.signIn")}
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-black transition hover:bg-white/85"
            >
              {t("nav.getStarted")}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative px-4 pb-16 pt-36 text-center sm:pt-44">
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: colors.glow }} />
          <div className="absolute inset-0 z-0">
            <HeroBackground />
          </div>

          <div className="pointer-events-none relative z-10 mx-auto max-w-4xl">
            <p className="text-sm font-medium text-violet-200">{t("hero.eyebrow")}</p>
            <h1 className="mt-5 bg-gradient-to-b from-white via-white to-violet-200 bg-clip-text text-5xl font-bold leading-[1.04] tracking-[-0.04em] text-transparent sm:text-6xl lg:text-7xl">
              {t("hero.title")}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
              {t("hero.subtitle")}
            </p>
            <div className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-base font-semibold text-black transition hover:bg-white/85"
              >
                {t("hero.ctaPrimary")}
                <Icon.arrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="rounded-full border border-white/10 bg-white/[0.04] px-7 py-3 text-base font-medium text-white/75 transition hover:bg-white/[0.08] hover:text-white"
              >
                {t("hero.ctaSecondary")}
              </a>
            </div>
            <p className="mt-4 text-xs text-white/35">{t("hero.note")}</p>
          </div>

          <div className="relative mx-auto mt-16 max-w-5xl">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-20 -top-16 bottom-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(124,92,246,0.24),transparent_70%)] blur-3xl"
            />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-1 shadow-2xl">
              <Image
                src="/dashboard-preview.png"
                alt={t("hero.previewAlt")}
                width={2880}
                height={1800}
                priority
                className="h-auto w-full rounded-[1.2rem]"
              />
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-300">
              {t("features.eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-5xl">{t("features.title")}</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/55">{t("features.subtitle")}</p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {featureCards.map(({ key, icon: FeatureIcon, className }) => (
              <article
                key={key}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-violet-300/20 hover:bg-white/[0.05] sm:p-7 ${className}`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-200">
                  <FeatureIcon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-white">
                  {t(`features.${key}.title`)}
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/50">{t(`features.${key}.desc`)}</p>
                <FeatureVisual feature={key} labels={visualLabels} />
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-24 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-300">{t("faq.eyebrow")}</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">{t("faq.title")}</h2>
            <p className="mt-4 text-white/50">{t("faq.subtitle")}</p>
          </div>

          <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {(["one", "two", "three", "four", "five"] as const).map((key) => (
              <details key={key} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-medium text-white/85">
                  {t(`faq.${key}.question`)}
                  <Icon.plus className="h-4 w-4 shrink-0 text-white/40 transition group-open:rotate-45" />
                </summary>
                <p className="max-w-2xl pt-3 text-sm leading-7 text-white/50">{t(`faq.${key}.answer`)}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] px-6 py-20 text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_50%_100%,rgba(139,92,246,0.24),transparent_65%)]"
            />
            <div className="relative">
              <BetaBadge label={t("cta.badge")} />
              <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                {t("cta.title")}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-white/55">{t("cta.subtitle")}</p>
              <Link
                href="/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-black transition hover:bg-white/85"
              >
                {t("cta.button")}
                <Icon.arrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/logo-dark.png" alt="Rivesio" width={104} height={28} />
              <BetaBadge label={t("nav.beta")} />
            </div>
            <p className="mt-3 max-w-sm text-sm text-white/40">{t("footer.tagline")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/50">
            <a href="#features" className="transition hover:text-white">
              {t("nav.features")}
            </a>
            <a href="#faq" className="transition hover:text-white">
              {t("nav.faq")}
            </a>
            <Link href="/login" className="transition hover:text-white">
              {t("nav.signIn")}
            </Link>
            <Link href="/signup" className="transition hover:text-white">
              {t("footer.signUp")}
            </Link>
          </div>
        </div>
        <div className="border-t border-white/[0.06] py-5 text-center text-xs text-white/30">
          © {year} Rivesio. {t("footer.rights")}
        </div>
      </footer>
    </div>
    <Script
      src="https://rivesio.com/api/widget/wk_9M0Uw9noVWCAPE-s8yiYBPMk.js"
      strategy="afterInteractive"
    />
    </>
  );
}
