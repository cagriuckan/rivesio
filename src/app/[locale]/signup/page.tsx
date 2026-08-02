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

export default function SignupPage() {
  const t = useTranslations("signup");
  const tc = useTranslations("common");
  const ta = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError(t("passwordTooShort"));
      return;
    }
    setLoading(true);
    try {
      const res = await authClient.signUp.email({ name, email, password });
      if (res.error) {
        setError(res.error.code === "USER_ALREADY_EXISTS" ? t("emailTaken") : t("failed"));
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

  const loginHref = next !== "/" ? `/login?next=${encodeURIComponent(next)}` : "/login";

  return (
    <AuthShell title={t("title")} subtitle={t("subtitle")}>
      <SocialButtons />
      <AuthDivider label={ta("orContinueWithEmail")} />
      <form onSubmit={submit}>
        <div className="space-y-4">
          <Field label={t("name")}>
            <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus autoComplete="name" required />
          </Field>
          <Field label={t("email")}>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </Field>
          <Field label={t("password")}>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
          </Field>
        </div>

        {error && <AuthError message={error} />}

        <Button type="submit" variant="primary" disabled={loading} className="mt-6 h-10 w-full">
          {loading ? (
            <>
              <Spinner /> {t("signingUp")}
            </>
          ) : (
            t("signUp")
          )}
        </Button>

        <p className="mt-5 text-center text-sm text-subtle">
          {t("haveAccount")}{" "}
          <Link href={loginHref} className="font-semibold text-accent hover:underline">
            {t("signInLink")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
