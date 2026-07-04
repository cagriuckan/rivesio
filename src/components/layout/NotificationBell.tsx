"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import { Dropdown, DropdownSeparator } from "@/components/ui/Dropdown";
import { useLiveEvents } from "@/hooks/useLiveEvents";
import type { NotificationRow } from "@/lib/types";

function timeAgo(ts: number, locale: string): string {
  const diff = Date.now() - ts;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const minutes = Math.round(diff / 60_000);
  if (minutes < 60) return rtf.format(-minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (hours < 24) return rtf.format(-hours, "hour");
  return rtf.format(-Math.round(hours / 24), "day");
}

export default function NotificationBell() {
  const t = useTranslations("notifications");
  const router = useRouter();
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [unread, setUnread] = useState(0);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.items ?? []);
      setUnread(data.unread ?? 0);
    } catch {
      // Network hiccup — next event/reconnect refetches.
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useLiveEvents((type, payload) => {
    if (type === "notification.created") {
      setItems((prev) => [payload as unknown as NotificationRow, ...prev].slice(0, 30));
      setUnread((c) => c + 1);
    } else if (type === "reconnected") {
      refetch();
    }
  });

  async function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? Date.now() })));
    setUnread(0);
    await fetch("/api/admin/notifications", { method: "PATCH" }).catch(() => {});
  }

  async function open(n: NotificationRow, close: () => void) {
    if (!n.read_at) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read_at: Date.now() } : x)));
      setUnread((c) => Math.max(0, c - 1));
      fetch(`/api/admin/notifications/${n.id}`, { method: "PATCH" }).catch(() => {});
    }
    close();
    if (n.link) router.push(n.link);
  }

  return (
    <Dropdown
      align="right"
      panelClassName="w-80"
      trigger={({ open: isOpen, triggerProps }) => (
        <button
          {...triggerProps}
          aria-label={t("label")}
          className={cn(
            "relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-subtle transition-colors hover:border-line-strong hover:bg-raised hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent",
            isOpen && "bg-raised text-primary",
          )}
        >
          <Icon.bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white ring-2 ring-base">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-sm font-semibold text-strong">{t("title")}</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-accent hover:underline"
              >
                {t("markAllRead")}
              </button>
            )}
          </div>
          <DropdownSeparator />
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-subtle">{t("empty")}</div>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => open(n, close)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-raised",
                    !n.read_at && "bg-accent-soft/40",
                  )}
                >
                  <span className="relative mt-0.5 h-8 w-8 shrink-0">
                    {n.icon_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={n.icon_url}
                        alt=""
                        className="h-8 w-8 rounded-lg object-cover ring-1 ring-line"
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-raised text-subtle ring-1 ring-line">
                        <Icon.bell className="h-4 w-4" />
                      </span>
                    )}
                    {!n.read_at && (
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-base" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-strong">{n.title}</span>
                    <span className="block truncate text-xs text-subtle">{n.body}</span>
                    <span className="mt-0.5 block text-[11px] text-faint">
                      {timeAgo(n.created_at, typeof navigator !== "undefined" ? navigator.language : "en")}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </Dropdown>
  );
}
