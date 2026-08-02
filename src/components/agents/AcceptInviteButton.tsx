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
  const [busy, setBusy] = useState<"accept" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function accept() {
    setBusy("accept");
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
      setBusy(null);
    }
  }

  async function reject() {
    setBusy("reject");
    setError(null);
    try {
      // Resolve membership via accept peek path: reject by creating a decline through token accept flow.
      // Use invites API after resolving membership from a lightweight preview isn't available client-side;
      // call accept API's sibling: POST reject with token.
      const res = await fetch("/api/agents/accept", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        setError(t("rejectError"));
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError(tc("connectionError"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-5">
      {error && <AuthError message={error} />}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Button type="button" variant="primary" disabled={!!busy} onClick={accept} className="h-10 flex-1">
          {busy === "accept" ? (
            <>
              <Spinner /> {t("acceptButtonLoading")}
            </>
          ) : (
            t("acceptButton")
          )}
        </Button>
        <Button type="button" variant="secondary" disabled={!!busy} onClick={reject} className="h-10 flex-1">
          {busy === "reject" ? <Spinner /> : t("rejectButton")}
        </Button>
      </div>
    </div>
  );
}
