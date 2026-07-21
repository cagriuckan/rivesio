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
  const path = "/signup";
  return {
    title: t("signupTitle"),
    description: t("description"),
    robots: { index: false, follow: false },
    alternates: {
      canonical: localePath(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: { url: localePath(locale, path) },
  };
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
