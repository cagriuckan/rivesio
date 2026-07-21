import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";
import HeroBackground from "@/components/landing/HeroBackground";
import FeatureBento from "@/components/landing/FeatureBento";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

/**
 * Public landing page ("/" for signed-out visitors).
 * Design language follows the Aceternity "AI SaaS" template: near-black
 * canvas, a hero anchored by a product preview, an uneven bento grid, and
 * soft violet glows throughout. Always dark, independent of the app theme.
 */

const c = {
  bg: "#060609",
  card: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(255,255,255,0.09)",
  glow: "radial-gradient(60% 55% at 50% 0%, rgba(124,92,246,0.28) 0%, rgba(59,130,246,0.08) 42%, transparent 72%)",
  gradText: "linear-gradient(100deg, #c4b5fd 0%, #a5b4fc 45%, #93c5fd 100%)",
  gradHead: "linear-gradient(180deg, #ffffff 30%, #cbb9ff 100%)",
};

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl backdrop-blur-sm ${className}`}
      style={{ background: c.card, border: `1px solid ${c.cardBorder}` }}
    >
      {children}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide text-violet-200"
      style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)" }}
    >
      {children}
    </span>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[15px] text-white/70">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{ background: "rgba(139,92,246,0.18)" }}
      >
        <Icon.check className="h-3 w-3 text-violet-300" />
      </span>
      {children}
    </li>
  );
}

export default async function LandingPage() {
  const t = await getTranslations("landing");
  const year = new Date().getFullYear();

  const steps = [
    { key: "step1", icon: Icon.code },
    { key: "step2", icon: Icon.feedback },
    { key: "step3", icon: Icon.checkCircle },
  ] as const;

  return (
    <div className="min-h-screen overflow-x-hidden text-white antialiased" style={{ background: c.bg }}>
      {/* ── Floating nav ── */}
      <header className="fixed inset-x-0 top-4 z-50 px-4">
        <div
          className="mx-auto flex h-14 max-w-4xl items-center justify-between rounded-full px-5 backdrop-blur-xl"
          style={{ background: "rgba(13,13,24,0.7)", border: `1px solid ${c.cardBorder}` }}
        >
          <Link href="/" className="shrink-0">
            <Image src="/logo-dark.png" alt="Rivesio" width={104} height={28} priority />
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-white/65 md:flex">
            <a href="#features" className="transition hover:text-white">{t("nav.features")}</a>
            <a href="#how" className="transition hover:text-white">{t("nav.howItWorks")}</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher variant="dark" />
            <Link href="/login" className="hidden px-3 py-1.5 text-sm text-white/65 transition hover:text-white sm:block">
              {t("nav.signIn")}
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition hover:bg-white/85"
            >
              {t("nav.getStarted")}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative px-4 pt-36 pb-20 text-center sm:pt-44">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: c.glow }} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(65% 55% at 50% 0%, black, transparent)",
          }}
        />
        {/* antigravity particle field */}
        <div className="absolute inset-0 z-0">
          <HeroBackground />
        </div>

        <div className="pointer-events-none relative z-10 mx-auto max-w-3xl">
          <Badge>
            <Icon.sparkles className="h-3.5 w-3.5" />
            {t("hero.badge")}
          </Badge>
          <h1
            className="mt-6 bg-clip-text text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-transparent sm:text-6xl lg:text-7xl"
            style={{ backgroundImage: c.gradHead }}
          >
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60">{t("hero.subtitle")}</p>
          <div className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-base font-semibold text-black transition hover:bg-white/85"
            >
              {t("hero.ctaPrimary")}
              <Icon.arrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-full px-7 py-3 text-base font-medium text-white/80 transition hover:text-white"
              style={{ border: `1px solid ${c.cardBorder}`, background: c.card }}
            >
              {t("hero.ctaSecondary")}
            </Link>
          </div>
        </div>

        {/* product preview */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-16 -top-16 bottom-0 blur-3xl"
            style={{ background: "radial-gradient(50% 50% at 50% 0%, rgba(124,92,246,0.28), transparent 70%)" }}
          />
          <div
            className="relative rounded-[1.5rem] p-[1px] shadow-2xl"
            style={{ background: "linear-gradient(180deg, rgba(139,92,246,0.6), rgba(255,255,255,0.06) 35%, transparent 80%)" }}
          >
            <div className="overflow-hidden rounded-[1.4rem]">
              <Image
                src="/dashboard-preview.png"
                alt="Rivesio dashboard"
                width={2880}
                height={1800}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
          {/* bottom fade into page */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-1 h-32"
            style={{ background: `linear-gradient(to top, ${c.bg}, transparent)` }}
          />
        </div>
      </section>

      {/* ── Feature bento ── */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">{t("features.title")}</h2>
          <p className="mt-4 text-lg text-white/55">{t("features.subtitle")}</p>
        </div>
        <div className="mt-12">
          <FeatureBento />
        </div>
      </section>

      {/* ── Highlight 1 — widget (text | visual) ── */}
      <section id="collect" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Badge>{t("highlight1.badge")}</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">{t("highlight1.title")}</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/55">{t("highlight1.desc")}</p>
            <ul className="mt-7 space-y-3.5">
              <CheckItem>{t("highlight1.point1")}</CheckItem>
              <CheckItem>{t("highlight1.point2")}</CheckItem>
              <CheckItem>{t("highlight1.point3")}</CheckItem>
            </ul>
          </div>
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 rounded-[2rem] blur-3xl"
              style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(139,92,246,0.14), transparent 70%)" }}
            />
            <Card className="relative mx-auto max-w-sm p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/85">
                <Icon.feedback className="h-4 w-4 text-violet-300" />
                {t("highlight1.mockTitle")}
              </div>
              <div
                className="rounded-xl px-4 py-3 text-sm text-white/45"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {t("highlight1.mockPlaceholder")}
              </div>
              <div
                className="mt-3 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs text-white/55"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.15)" }}
              >
                <Icon.image className="h-4 w-4 text-violet-300" />
                {t("highlight1.mockAttach")}
              </div>
              <button
                type="button"
                tabIndex={-1}
                className="pointer-events-none mt-4 w-full rounded-xl py-2.5 text-sm font-semibold text-white"
                style={{ background: "linear-gradient(120deg, #7c5cf6 0%, #5b7cfa 100%)" }}
              >
                {t("highlight1.mockSend")}
              </button>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Highlight 2 — inbox (visual | text, reversed) ── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="lg:order-2">
            <Badge>{t("highlight2.badge")}</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">{t("highlight2.title")}</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/55">{t("highlight2.desc")}</p>
            <ul className="mt-7 space-y-3.5">
              <CheckItem>{t("highlight2.point1")}</CheckItem>
              <CheckItem>{t("highlight2.point2")}</CheckItem>
              <CheckItem>{t("highlight2.point3")}</CheckItem>
            </ul>
          </div>
          <div className="relative lg:order-1">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 rounded-[2rem] blur-3xl"
              style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(93,124,250,0.14), transparent 70%)" }}
            />
            <Card className="relative p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/85">
                <Icon.inbox className="h-4 w-4 text-violet-300" />
                {t("hero.mockInbox")}
              </div>
              {([
                ["mockFeedback1", "mockStatusOpen", "#f87171"],
                ["mockFeedback2", "mockStatusInProgress", "#fbbf24"],
                ["mockFeedback3", "mockStatusResolved", "#34d399"],
              ] as const).map(([msg, status, dot]) => (
                <div
                  key={msg}
                  className="mb-2 flex items-center justify-between gap-3 rounded-xl px-4 py-3.5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span className="truncate text-sm text-white/75">{t(`hero.${msg}`)}</span>
                  <span className="flex shrink-0 items-center gap-2 text-xs font-medium text-white/55">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
                    {t(`hero.${status}`)}
                  </span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </section>

      {/* ── Highlight 3 — reply / two-way chat (text | visual) ── */}
      <section id="reply" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Badge>{t("highlight3.badge")}</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">{t("highlight3.title")}</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/55">{t("highlight3.desc")}</p>
            <ul className="mt-7 space-y-3.5">
              <CheckItem>{t("highlight3.point1")}</CheckItem>
              <CheckItem>{t("highlight3.point2")}</CheckItem>
              <CheckItem>{t("highlight3.point3")}</CheckItem>
            </ul>
          </div>
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 rounded-[2rem] blur-3xl"
              style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(139,92,246,0.16), transparent 70%)" }}
            />
            <Card className="relative p-5">
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-white/50">
                  <Icon.user className="h-3.5 w-3.5" />
                  {t("highlight3.mockUser")}
                </div>
                <p className="text-sm text-white/75">{t("highlight3.mockUserText")}</p>
                <div className="mt-3 flex gap-2 text-xs font-medium">
                  <span className="rounded-full px-2.5 py-1 text-red-300" style={{ background: "rgba(248,113,113,0.12)" }}>
                    {t("highlight3.mockTagBug")}
                  </span>
                  <span className="rounded-full px-2.5 py-1 text-amber-300" style={{ background: "rgba(251,191,36,0.12)" }}>
                    {t("highlight3.mockTagHigh")}
                  </span>
                </div>
              </div>
              <div
                className="mt-3 rounded-xl p-4"
                style={{ background: "rgba(139,92,246,0.09)", border: "1px solid rgba(139,92,246,0.25)" }}
              >
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-violet-200">
                  <Icon.feedback className="h-3.5 w-3.5" />
                  {t("highlight3.mockYou")}
                </div>
                <p className="text-sm text-white/75">{t("highlight3.mockYouText")}</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">{t("how.title")}</h2>
          <p className="mt-4 text-lg text-white/55">{t("how.subtitle")}</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map(({ key, icon: StepIcon }, i) => (
            <div key={key} className="relative">
              {i < steps.length - 1 && (
                <div aria-hidden className="absolute left-[calc(50%+2rem)] right-[-1.5rem] top-6 hidden h-px md:block" style={{ background: "linear-gradient(to right, rgba(139,92,246,0.4), transparent)" }} />
              )}
              <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-violet-200"
                    style={{ background: "rgba(139,92,246,0.14)", border: "1px solid rgba(139,92,246,0.3)" }}
                  >
                    <StepIcon className="h-5 w-5" />
                  </span>
                  <span className="text-4xl font-bold text-white/10">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white/90">{t(`how.${key}.title`)}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/55">{t(`how.${key}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-16 sm:px-6">
        <div
          className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] px-6 py-20 text-center"
          style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${c.cardBorder}` }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(70% 90% at 50% 100%, rgba(139,92,246,0.22), transparent 65%)" }}
          />
          <div className="relative">
            <h2
              className="mx-auto max-w-2xl bg-clip-text text-4xl font-bold tracking-[-0.02em] text-transparent sm:text-5xl"
              style={{ backgroundImage: c.gradText }}
            >
              {t("cta.title")}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/55">{t("cta.subtitle")}</p>
            <div className="mt-9 flex flex-col items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-black transition hover:bg-white/85"
              >
                {t("cta.button")}
                <Icon.arrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="text-sm text-white/50 transition hover:text-white">
                {t("cta.secondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${c.cardBorder}` }}>
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Image src="/logo-dark.png" alt="Rivesio" width={104} height={28} />
            <p className="mt-4 text-sm text-white/50">{t("footer.tagline")}</p>
          </div>
          <div className="flex gap-16 text-sm">
            <div>
              <div className="font-semibold text-white/85">{t("footer.product")}</div>
              <ul className="mt-4 space-y-2.5 text-white/50">
                <li><a href="#features" className="transition hover:text-white">{t("footer.featuresLink")}</a></li>
                <li><a href="#how" className="transition hover:text-white">{t("footer.howLink")}</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-white/85">{t("footer.account")}</div>
              <ul className="mt-4 space-y-2.5 text-white/50">
                <li><Link href="/login" className="transition hover:text-white">{t("footer.signIn")}</Link></li>
                <li><Link href="/signup" className="transition hover:text-white">{t("footer.signUp")}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="py-6 text-center text-xs text-white/35" style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}>
          © {year} Rivesio. {t("footer.rights")}
        </div>
      </footer>
    </div>
  );
}
