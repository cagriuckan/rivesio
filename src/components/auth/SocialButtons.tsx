"use client";

import { IconBrandGoogle, IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

const PROVIDERS = [
  { key: "google", label: "Google", icon: IconBrandGoogle },
  { key: "github", label: "GitHub", icon: IconBrandGithub },
  { key: "x", label: "X", icon: IconBrandX },
] as const;

/**
 * Social sign-in/sign-up buttons. Not wired to a provider yet — `type="button"`
 * keeps them inert inside the surrounding email/password <form>.
 */
export default function SocialButtons() {
  const t = useTranslations("auth");
  return (
    <div className="space-y-2.5">
      {PROVIDERS.map(({ key, label, icon: ProviderIcon }) => (
        <Button key={key} type="button" variant="outline" size="lg" className="w-full gap-2.5">
          <ProviderIcon className="h-4 w-4" stroke={1.75} />
          {t("continueWith", { provider: label })}
        </Button>
      ))}
    </div>
  );
}
