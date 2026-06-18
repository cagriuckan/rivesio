import Link from "next/link";
import LogoutButton from "./LogoutButton";

const NAV = [
  { href: "/", label: "Panel" },
  { href: "/feedbacks", label: "Geri bildirimler" },
  { href: "/sites", label: "Siteler" },
  { href: "/projects", label: "Widget'lar" },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
          <span className="text-sm font-bold tracking-tight text-brand">
            Kanews Feedback
          </span>
          <nav className="flex items-center gap-1 text-sm">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
