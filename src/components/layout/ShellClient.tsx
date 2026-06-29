"use client";

import { useState, useEffect, Suspense } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomTabBar from "./BottomTabBar";
import type { WidgetOption } from "./WidgetSwitcher";

export default function ShellClient({
  widgets,
  user,
  children,
}: {
  widgets: WidgetOption[];
  user: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="flex h-screen flex-col overflow-hidden bg-canvas">
      <Header
        user={user}
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar — always visible */}
        <div className="hidden md:flex">
          <Suspense>
            <Sidebar widgets={widgets} />
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
              style={{ top: "var(--header-h)" }}
            >
              <Suspense>
                <Sidebar widgets={widgets} onClose={() => setSidebarOpen(false)} />
              </Suspense>
            </div>
          </>
        )}

        <main className="min-w-0 flex-1 overflow-y-auto bg-panel pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <Suspense>
        <BottomTabBar widgets={widgets} />
      </Suspense>
    </div>
  );
}
