import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { languageAlternates, localePath } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const path = "/login";
  return {
    title: t("loginTitle"),
    description: t("loginDescription"),
    robots: { index: false, follow: false },
    alternates: {
      canonical: localePath(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: {
      url: localePath(locale, path),
      title: t("loginTitle"),
      description: t("loginDescription"),
    },
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
