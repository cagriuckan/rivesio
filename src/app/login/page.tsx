"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userFocused, setUserFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

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

  const fieldStyle = (focused: boolean): React.CSSProperties => ({
    width: "100%",
    backgroundColor: "var(--color-elevated)",
    border: `1px solid ${focused ? "var(--color-accent)" : "var(--color-border)"}`,
    borderRadius: "var(--radius-md)",
    padding: "10px 14px",
    fontSize: "14px",
    color: "var(--color-primary)",
    fontFamily: "var(--font-sans)",
    boxShadow: focused ? "0 0 0 3px var(--color-accent-muted)" : "none",
    outline: "none",
    transition: "border-color .15s, box-shadow .15s",
  });

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-base)" }}
    >
      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 8%, transparent) 0%, transparent 70%)" }}
        />
      </div>

      <form
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-2xl p-8"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-panel)",
        }}
      >
        {/* Header */}
        <div className="mb-7">
          <div className="mb-4 flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-xs font-bold tracking-tight" style={{ color: "var(--color-accent-text)" }}>
              Kanews Feedback
            </span>
          </div>
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--color-strong)", letterSpacing: "-0.025em" }}
          >
            Giriş yap
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-subtle)" }}>
            Yönetim paneline erişmek için giriş yapın.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span
              className="mb-1.5 block text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-subtle)" }}
            >
              Kullanıcı adı
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setUserFocused(true)}
              onBlur={() => setUserFocused(false)}
              style={fieldStyle(userFocused)}
              autoFocus
              autoComplete="username"
            />
          </label>

          <label className="block">
            <span
              className="mb-1.5 block text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-subtle)" }}
            >
              Parola
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
              style={fieldStyle(passFocused)}
              autoComplete="current-password"
            />
          </label>
        </div>

        {error && (
          <div
            className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm"
            style={{ backgroundColor: "var(--color-danger-muted)", color: "var(--color-danger-text)", border: "1px solid color-mix(in srgb, var(--color-danger) 20%, transparent)" }}
            role="alert"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="ds-btn-primary mt-6 w-full py-2.5 text-sm"
          style={{ width: "100%", justifyContent: "center" }}
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="45" strokeLinecap="round" />
              </svg>
              Giriş yapılıyor…
            </>
          ) : (
            "Giriş yap"
          )}
        </button>
      </form>
    </div>
  );
}
