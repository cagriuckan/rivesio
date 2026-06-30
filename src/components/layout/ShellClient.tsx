"use client";

import { useState, useEffect, Suspense } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomTabBar from "./BottomTabBar";
import type { WidgetOption } from "./WidgetSwitcher";
import { UserProvider } from "@/contexts/UserContext";

export type NavCounts = { feedbacks?: number; sites?: number };

export default function ShellClient({
  widgets,
  user,
  navCounts,
  children,
}: {
  widgets: WidgetOption[];
  user: string;
  navCounts?: NavCounts;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("sidebar_collapsed") === "1") {
      setSidebarCollapsed(true);
    }
  }, []);

  function toggleCollapse() {
    setSidebarCollapsed((v) => {
      const next = !v;
      localStorage.setItem("sidebar_collapsed", next ? "1" : "0");
      return next;
    });
  }

  /* Close sidebar on route change */
  useEffect(() => {
    setSidebarOpen(false);
  }, [children]);

  /* Close on Escape */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <UserProvider value={user}>
    <div className="flex h-screen flex-col overflow-hidden bg-canvas">
      {/* Mobile-only header */}
      <Header
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar — always visible */}
        <div className="hidden shrink-0 overflow-hidden md:flex">
          <Suspense>
            <Sidebar widgets={widgets} user={user} navCounts={navCounts} collapsed={sidebarCollapsed} onToggleCollapse={toggleCollapse} />
          </Suspense>
        </div>

        {/* Mobile sidebar — drawer overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              aria-hidden
              onClick={() => setSidebarOpen(false)}
            />
            <div
              className="ds-slide-right fixed inset-y-0 left-0 z-50 md:hidden"
            >
              <Suspense>
                <Sidebar widgets={widgets} user={user} navCounts={navCounts} onClose={() => setSidebarOpen(false)} />
              </Suspense>
            </div>
          </>
        )}

        <main className="min-w-0 flex-1 overflow-hidden bg-canvas p-3 pb-16 md:pb-3">
          <div className="h-full overflow-y-auto rounded-xl border border-line bg-surface">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <Suspense>
        <BottomTabBar widgets={widgets} />
      </Suspense>
    </div>
    </UserProvider>
  );
}
