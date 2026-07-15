"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { AuthError } from "@/components/auth/AuthShell";

export default function AcceptInviteButton({ token, projectId }: { token: string; projectId: string }) {
  const t = useTranslations("agents");
  const tc = useTranslations("common");
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function accept() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/agents/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        setError(t("acceptError"));
        return;
      }
      router.replace(`/feedbacks?w=${projectId}`);
      router.refresh();
    } catch {
      setError(tc("connectionError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-5">
      {error && <AuthError message={error} />}
      <Button type="button" variant="primary" disabled={busy} onClick={accept} className="mt-3 h-10 w-full">
        {busy ? <><Spinner /> {t("acceptButtonLoading")}</> : t("acceptButton")}
      </Button>
    </div>
  );
}
