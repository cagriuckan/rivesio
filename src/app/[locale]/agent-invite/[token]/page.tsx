import { getTranslations } from "next-intl/server";
import AuthShell, { AuthError } from "@/components/auth/AuthShell";
import AcceptInviteButton from "@/components/agents/AcceptInviteButton";
import { Link } from "@/i18n/navigation";
import { previewAgentInvite } from "@/lib/agent-repo";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AgentInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const t = await getTranslations("agents");
  const invite = await previewAgentInvite(token);
  const sessionUser = await getSessionUser();

  if (!invite || invite.status === "revoked") {
    return (
      <AuthShell title={t("acceptInvalidTitle")} subtitle={t("acceptInvalidBody")}>
        <Link href="/" className="text-sm font-semibold text-accent hover:underline">
          {t("acceptBackHome")}
        </Link>
      </AuthShell>
    );
  }

  if (invite.status === "active") {
    return (
      <AuthShell title={t("acceptAlreadyTitle")} subtitle={t("acceptAlreadyBody", { project: invite.projectName })}>
        <Link href="/feedbacks" className="text-sm font-semibold text-accent hover:underline">
          {t("acceptGoToInbox")}
        </Link>
      </AuthShell>
    );
  }

  const categoriesLabel = invite.categories?.length ? invite.categories.join(", ") : t("acceptAllCategories");

  if (!sessionUser) {
    const next = encodeURIComponent(`/agent-invite/${token}`);
    return (
      <AuthShell title={t("acceptTitle")} subtitle={t("acceptSubtitle", { inviter: invite.inviterName, project: invite.projectName })}>
        <p className="text-sm text-subtle">{t("acceptNotLoggedInBody", { email: invite.email })}</p>
        <div className="mt-5 flex gap-2">
          <Link
            href={`/login?next=${next}`}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-full bg-accent px-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            {t("acceptSignIn")}
          </Link>
          <Link
            href={`/signup?next=${next}`}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-full border border-line-strong bg-surface px-3.5 text-sm font-semibold text-secondary transition-colors hover:bg-raised"
          >
            {t("acceptSignUp")}
          </Link>
        </div>
      </AuthShell>
    );
  }

  if (sessionUser.email.toLowerCase() !== invite.email.toLowerCase()) {
    return (
      <AuthShell title={t("acceptMismatchTitle")} subtitle={t("acceptMismatchBody", { invited: invite.email, current: sessionUser.email })}>
        <AuthError message={t("acceptMismatchHint")} />
      </AuthShell>
    );
  }

  return (
    <AuthShell title={t("acceptTitle")} subtitle={t("acceptSubtitle", { inviter: invite.inviterName, project: invite.projectName })}>
      <div className="rounded-lg border border-line bg-raised/40 px-3.5 py-3 text-sm text-secondary">
        <div className="text-[11px] font-medium uppercase tracking-wider text-faint">{t("acceptCategoriesLabel")}</div>
        <div className="mt-1 font-medium text-primary">{categoriesLabel}</div>
      </div>
      <AcceptInviteButton token={token} projectId={invite.projectId} />
    </AuthShell>
  );
}
