"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";

export default function LoginPage() {
  const t = useTranslations("login");
  const tc = useTranslations("common");
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError(res.status === 429 ? t("tooManyAttempts") : t("invalidCredentials"));
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError(tc("connectionError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-[380px] rounded-xl border border-line bg-surface p-8"
      >
        {/* Brand */}
        <div className="mb-7">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg shadow-sm" aria-hidden>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-full w-full">
                <defs>
                  <linearGradient id="loginBrandG" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <rect width="100" height="100" rx="24" fill="url(#loginBrandG)" />
                <rect x="17" y="23" width="66" height="46" rx="13" fill="white" />
                <path d="M27 69 L19 86 L45 69 Z" fill="white" />
                <polyline points="30,47 42,59 70,31" fill="none" stroke="url(#loginBrandG)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="leading-tight">
              <div className="text-sm font-bold text-strong">{tc("brand")}</div>
              <div className="text-2xs font-medium text-subtle">Feedback</div>
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-strong">{t("welcome")}</h1>
          <p className="mt-1 text-sm text-subtle">{t("subtitle")}</p>
        </div>

        <div className="space-y-4">
          <Field label={t("username")}>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus autoComplete="username" />
          </Field>
          <Field label={t("password")}>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </Field>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-md border border-danger/20 bg-danger-soft px-3 py-2.5 text-sm text-danger-text" role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <Button type="submit" variant="primary" disabled={loading} className="mt-6 h-10 w-full">
          {loading ? <><Spinner /> {t("signingIn")}</> : t("signIn")}
        </Button>
      </form>
    </div>
  );
}
