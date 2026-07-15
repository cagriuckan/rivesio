import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Shell from "@/components/layout/Shell";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icons";
import UserSettings from "@/components/settings/UserSettings";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const t = await getTranslations("settings");
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <Shell>
      <PageContent>
        <PageHeader icon={Icon.settings} title={t("title")} subtitle={t("subtitle")} />
        <div className="max-w-4xl">
          <UserSettings
            initial={{ name: user.name, email: user.email, image: user.image, role: user.role }}
          />
        </div>
      </PageContent>
    </Shell>
  );
}
