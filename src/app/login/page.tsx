"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icons";
import { Spinner } from "@/components/ui/Spinner";

export default function LoginPage() {
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
        setError(res.status === 429 ? "Çok fazla deneme. Biraz bekle." : "Giriş bilgileri hatalı.");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4">
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />

      <form
        onSubmit={submit}
        className="relative w-full max-w-[380px] rounded-2xl border border-line bg-surface p-8 shadow-lg"
      >
        {/* Brand */}
        <div className="mb-7">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet shadow-accent">
              <Icon.feedback className="h-4 w-4 text-white" strokeWidth={2.25} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-strong">Kanews</div>
              <div className="text-2xs font-medium text-subtle">Feedback</div>
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-strong">Tekrar hoş geldin</h1>
          <p className="mt-1 text-sm text-subtle">Yönetim paneline erişmek için giriş yap.</p>
        </div>

        <div className="space-y-4">
          <Field label="Kullanıcı adı">
            <Input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus autoComplete="username" />
          </Field>
          <Field label="Parola">
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
          {loading ? <><Spinner /> Giriş yapılıyor…</> : "Giriş yap"}
        </Button>
      </form>
    </div>
  );
}
