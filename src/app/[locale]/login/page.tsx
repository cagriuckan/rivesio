"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";
import AuthShell, { AuthError } from "@/components/auth/AuthShell";
import SocialButtons from "@/components/auth/SocialButtons";
import AuthDivider from "@/components/auth/AuthDivider";

function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export default function LoginPage() {
  const t = useTranslations("login");
  const tc = useTranslations("common");
  const ta = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authClient.signIn.email({ email, password });
      if (res.error) {
        setError(res.error.status === 429 ? t("tooManyAttempts") : t("invalidCredentials"));
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError(tc("connectionError"));
    } finally {
      setLoading(false);
    }
  }

  const signupHref = next !== "/" ? `/signup?next=${encodeURIComponent(next)}` : "/signup";

  return (
    <AuthShell title={t("welcome")} subtitle={t("subtitle")}>
      <SocialButtons />
      <AuthDivider label={ta("orContinueWithEmail")} />
      <form onSubmit={submit}>
        <div className="space-y-4">
          <Field label={t("email")}>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus autoComplete="email" required />
          </Field>
          <Field label={t("password")}>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </Field>
        </div>

        {error && <AuthError message={error} />}

        <Button type="submit" variant="primary" disabled={loading} className="mt-6 h-10 w-full">
          {loading ? (
            <>
              <Spinner /> {t("signingIn")}
            </>
          ) : (
            t("signIn")
          )}
        </Button>

        <p className="mt-5 text-center text-sm text-subtle">
          {t("noAccount")}{" "}
          <Link href={signupHref} className="font-semibold text-accent hover:underline">
            {t("signUpLink")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
