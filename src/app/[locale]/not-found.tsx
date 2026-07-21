import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("notFoundTitle"),
    description: t("notFoundDescription"),
    robots: { index: false, follow: true },
  };
}

export default async function NotFound() {
  const t = await getTranslations("metadata");
  const tc = await getTranslations("common");
  const tl = await getTranslations("landing.nav");

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="text-sm font-medium text-[var(--muted)]">{tc("brand")}</p>
      <h1 className="text-2xl font-semibold tracking-tight">{t("notFoundTitle")}</h1>
      <p className="text-[var(--muted)]">{t("notFoundDescription")}</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
        >
          {tc("brand")}
        </Link>
        <Link href="/login" className="text-sm text-[var(--muted)] underline-offset-4 hover:underline">
          {tl("signIn")}
        </Link>
        <Link href="/signup" className="text-sm text-[var(--muted)] underline-offset-4 hover:underline">
          {tl("getStarted")}
        </Link>
      </div>
    </main>
  );
}
