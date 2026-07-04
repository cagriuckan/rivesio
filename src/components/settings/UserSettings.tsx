"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import { useThemePref } from "@/hooks/useThemePref";
import type { ThemePref } from "@/lib/theme";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import {
  DEFAULT_NOTIFICATION_PREFS,
  type NotificationChannelPrefs,
  type NotificationPrefs,
} from "@/lib/types";
import {
  OptionCards,
  SettingsFooter,
  SettingsRow,
  SettingsSectionHeader,
  SettingsTabs,
  Toggle,
} from "./SettingsLayout";

type Tab = "profile" | "appearance" | "notifications" | "security";

const MAX_AVATAR_BYTES = 512 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp"];

export interface UserSettingsInitial {
  name: string;
  email: string;
  image: string | null;
  role: string;
}

export default function UserSettings({ initial }: { initial: UserSettingsInitial }) {
  const t = useTranslations("settings");
  const [tab, setTab] = useState<Tab>("profile");

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: t("tabProfile") },
    { key: "appearance", label: t("tabAppearance") },
    { key: "notifications", label: t("tabNotifications") },
    { key: "security", label: t("tabSecurity") },
  ];

  return (
    <div>
      <SettingsTabs tabs={tabs} value={tab} onChange={setTab} />
      {tab === "profile" && <ProfileTab initial={initial} />}
      {tab === "appearance" && <AppearanceTab />}
      {tab === "notifications" && <NotificationsTab />}
      {tab === "security" && <SecurityTab />}
    </div>
  );
}

// ── Profile ──────────────────────────────────────────────────────────
function ProfileTab({ initial }: { initial: UserSettingsInitial }) {
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [image, setImage] = useState(initial.image);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const dirty = name !== initial.name;

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await authClient.updateUser({ name: name.trim() });
      if (!res.error) {
        setSaved(true);
        initial.name = name.trim();
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatar(file: File) {
    setAvatarError(null);
    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      setAvatarError(t("fieldAvatarErrorType"));
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError(t("fieldAvatarErrorSize"));
      return;
    }
    setAvatarBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/user/avatar", { method: "POST", body });
      const data = (await res.json().catch(() => null)) as { imageUrl?: string } | null;
      if (res.ok && data?.imageUrl) {
        setImage(data.imageUrl);
        initial.image = data.imageUrl;
        router.refresh();
      } else {
        setAvatarError(t("fieldAvatarErrorUpload"));
      }
    } catch {
      setAvatarError(t("fieldAvatarErrorUpload"));
    } finally {
      setAvatarBusy(false);
    }
  }

  async function removeAvatar() {
    setAvatarBusy(true);
    setAvatarError(null);
    try {
      const res = await fetch("/api/admin/user/avatar", { method: "DELETE" });
      if (res.ok) {
        setImage(null);
        initial.image = null;
        router.refresh();
      } else {
        setAvatarError(t("fieldAvatarErrorUpload"));
      }
    } catch {
      setAvatarError(t("fieldAvatarErrorUpload"));
    } finally {
      setAvatarBusy(false);
    }
  }

  return (
    <div>
      <SettingsSectionHeader title={t("profileTitle")} description={t("profileDesc")} />
      <SettingsRow label={t("fieldName")} description={t("fieldNameHint")}>
        <Input value={name} onChange={(e) => setName(e.target.value)} className="max-w-md" />
      </SettingsRow>
      <SettingsRow label={t("fieldEmail")} description={t("fieldEmailHint")}>
        <Input value={initial.email} disabled className="max-w-md" />
      </SettingsRow>
      <SettingsRow label={t("fieldAvatar")} description={t("fieldAvatarHint")} align="start">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="h-14 w-14 rounded-full object-cover ring-1 ring-line" />
            ) : (
              <Avatar name={name || initial.email} size="lg" />
            )}
            <label
              className={cn(
                "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-xs font-semibold text-secondary shadow-xs transition-colors hover:border-line-strong hover:bg-raised hover:text-primary",
                avatarBusy && "pointer-events-none opacity-50",
              )}
            >
              <Icon.upload className="h-3.5 w-3.5" />
              {image ? t("fieldAvatarReplace") : t("fieldAvatarUpload")}
              <input
                type="file"
                accept={ALLOWED_AVATAR_TYPES.join(",")}
                className="hidden"
                disabled={avatarBusy}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadAvatar(f);
                  e.target.value = "";
                }}
              />
            </label>
            {image && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-lg"
                disabled={avatarBusy}
                onClick={() => void removeAvatar()}
              >
                {tc("delete")}
              </Button>
            )}
          </div>
          {avatarError ? (
            <p className="text-xs text-danger-text">{avatarError}</p>
          ) : (
            <p className="text-xs text-subtle">{t("fieldAvatarConstraints")}</p>
          )}
        </div>
      </SettingsRow>
      <SettingsFooter
        dirty={dirty}
        saving={saving}
        saved={saved}
        onCancel={() => {
          setName(initial.name);
          setSaved(false);
        }}
        onSave={save}
        cancelLabel={tc("cancel")}
        saveLabel={t("saveChanges")}
        savingLabel={tc("saving")}
        savedLabel={t("saved")}
      />
    </div>
  );
}

// ── Appearance ───────────────────────────────────────────────────────
function AppearanceTab() {
  const t = useTranslations("settings");
  const { theme, setTheme } = useThemePref();

  const previews: Record<ThemePref, React.ReactNode> = {
    light: <ThemePreview bg="#f0f1f5" card="#ffffff" bar="#6366f1" line="#e5e7eb" text="#1f2937" />,
    dark: <ThemePreview bg="#0a0a0c" card="#161619" bar="#7c7ff5" line="#26262b" text="#e5e7eb" />,
    system: <ThemePreview split bg="#f0f1f5" card="#ffffff" bar="#6366f1" line="#e5e7eb" text="#1f2937" />,
  };

  return (
    <div>
      <SettingsSectionHeader title={t("appearanceTitle")} description={t("appearanceDesc")} />
      <SettingsRow label={t("theme")} description={t("themeHint")} align="start">
        <OptionCards
          value={theme}
          onChange={(v) => setTheme(v)}
          options={[
            { value: "light", title: t("themeLight"), preview: previews.light },
            { value: "dark", title: t("themeDark"), preview: previews.dark },
            { value: "system", title: t("themeSystem"), preview: previews.system },
          ]}
        />
      </SettingsRow>
      <SettingsRow label={t("language")} description={t("languageHint")}>
        <LanguageSwitcher className="w-40" />
      </SettingsRow>
    </div>
  );
}

function ThemePreview({
  bg,
  card,
  bar,
  line,
  text,
  split,
}: {
  bg: string;
  card: string;
  bar: string;
  line: string;
  text: string;
  split?: boolean;
}) {
  return (
    <div className="relative h-full w-full" style={{ background: bg }}>
      {split && (
        <div
          className="absolute inset-y-0 right-0 w-1/2"
          style={{ background: "#0a0a0c" }}
        />
      )}
      <div className="relative flex h-full items-center justify-center gap-2 p-3">
        <div
          className="flex h-full w-14 flex-col gap-1 rounded-md p-1.5"
          style={{ background: card, border: `1px solid ${line}` }}
        >
          <div className="h-1.5 w-8 rounded-full" style={{ background: bar }} />
          <div className="h-1 w-full rounded-full" style={{ background: line }} />
          <div className="h-1 w-3/4 rounded-full" style={{ background: line }} />
        </div>
        <div
          className="flex h-full flex-1 flex-col gap-1 rounded-md p-1.5"
          style={{ background: card, border: `1px solid ${line}` }}
        >
          <div className="h-1.5 w-1/2 rounded-full" style={{ background: text, opacity: 0.6 }} />
          <div className="mt-auto h-4 rounded" style={{ background: `${bar}22`, border: `1px solid ${bar}55` }} />
        </div>
      </div>
    </div>
  );
}

// ── Notifications ────────────────────────────────────────────────────
const EVENTS: { key: keyof NotificationPrefs; labelKey: string; descKey: string }[] = [
  { key: "feedbackNew", labelKey: "eventFeedbackNew", descKey: "eventFeedbackNewDesc" },
  { key: "replyUser", labelKey: "eventReplyUser", descKey: "eventReplyUserDesc" },
  { key: "statusChange", labelKey: "eventStatusChange", descKey: "eventStatusChangeDesc" },
];
const CHANNELS: { key: keyof NotificationChannelPrefs; labelKey: string }[] = [
  { key: "inApp", labelKey: "channelInApp" },
  { key: "email", labelKey: "channelEmail" },
  { key: "push", labelKey: "channelPush" },
];

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

function NotificationsTab() {
  const t = useTranslations("settings");
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_NOTIFICATION_PREFS);
  const [vapidKey, setVapidKey] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [pushState, setPushState] = useState<"unsupported" | "off" | "on" | "denied" | "busy">("off");

  useEffect(() => {
    fetch("/api/admin/preferences")
      .then((r) => r.json())
      .then((d) => {
        if (d.prefs) setPrefs(d.prefs);
        setVapidKey(d.vapidPublicKey ?? "");
        setLoaded(true);
      })
      .catch(() => setLoaded(true));

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPushState("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setPushState("denied");
      return;
    }
    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      setPushState(sub ? "on" : "off");
    });
  }, []);

  function toggle(event: keyof NotificationPrefs, channel: keyof NotificationChannelPrefs) {
    const next = { ...prefs, [event]: { ...prefs[event], [channel]: !prefs[event][channel] } };
    setPrefs(next);
    fetch("/api/admin/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    }).catch(() => {});
  }

  async function enablePush() {
    if (!vapidKey) return;
    setPushState("busy");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setPushState(permission === "denied" ? "denied" : "off");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey).buffer as ArrayBuffer,
      });
      await fetch("/api/admin/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      setPushState("on");
    } catch {
      setPushState("off");
    }
  }

  async function disablePush() {
    setPushState("busy");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/admin/push", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setPushState("off");
    } catch {
      setPushState("on");
    }
  }

  return (
    <div>
      <SettingsSectionHeader title={t("notificationsTitle")} description={t("notificationsDesc")} />

      {/* Channel legend */}
      <div className="hidden grid-cols-[minmax(0,1fr)_repeat(3,64px)] gap-2 border-t border-line pb-2 pt-5 lg:grid">
        <span />
        {CHANNELS.map((c) => (
          <span key={c.key} className="text-center text-xs font-semibold uppercase tracking-wide text-faint">
            {t(c.labelKey)}
          </span>
        ))}
      </div>

      {EVENTS.map((ev) => (
        <div
          key={ev.key}
          className="grid grid-cols-2 gap-y-3 border-t border-line py-4 lg:grid-cols-[minmax(0,1fr)_repeat(3,64px)] lg:items-center lg:border-t-0"
        >
          <div className="col-span-2 min-w-0 lg:col-span-1">
            <div className="text-sm font-semibold text-strong">{t(ev.labelKey)}</div>
            <p className="mt-0.5 text-sm text-subtle">{t(ev.descKey)}</p>
          </div>
          {CHANNELS.map((c) => (
            <div key={c.key} className="flex items-center gap-2 lg:justify-center">
              <span className="text-xs text-subtle lg:hidden">{t(c.labelKey)}</span>
              <Toggle
                checked={prefs[ev.key][c.key]}
                disabled={!loaded}
                onChange={() => toggle(ev.key, c.key)}
                label={`${t(ev.labelKey)} · ${t(c.labelKey)}`}
              />
            </div>
          ))}
        </div>
      ))}

      <SettingsRow label={t("pushDevice")} description={t("pushDeviceHint")}>
        {pushState === "unsupported" ? (
          <span className="text-sm text-subtle">{t("pushUnsupported")}</span>
        ) : pushState === "denied" ? (
          <span className="text-sm text-warning-text">{t("pushDenied")}</span>
        ) : !vapidKey ? (
          <span className="text-sm text-subtle">{t("pushNotConfigured")}</span>
        ) : (
          <Button
            variant={pushState === "on" ? "outline" : "primary"}
            onClick={pushState === "on" ? disablePush : enablePush}
            disabled={pushState === "busy"}
            className="rounded-lg"
          >
            {pushState === "on" ? t("pushDisable") : t("pushEnable")}
          </Button>
        )}
      </SettingsRow>
    </div>
  );
}

// ── Security ─────────────────────────────────────────────────────────
function SecurityTab() {
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const dirty = current.length > 0 || next.length > 0 || confirm.length > 0;

  async function changePassword() {
    setMsg(null);
    if (next.length < 8) {
      setMsg({ kind: "err", text: t("passwordTooShort") });
      return;
    }
    if (next !== confirm) {
      setMsg({ kind: "err", text: t("passwordMismatch") });
      return;
    }
    setSaving(true);
    try {
      const res = await authClient.changePassword({
        currentPassword: current,
        newPassword: next,
        revokeOtherSessions: true,
      });
      if (res.error) {
        setMsg({ kind: "err", text: t("passwordWrong") });
        return;
      }
      setMsg({ kind: "ok", text: t("passwordChanged") });
      setCurrent("");
      setNext("");
      setConfirm("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <SettingsSectionHeader title={t("securityTitle")} description={t("securityDesc")} />
      <SettingsRow label={t("currentPassword")} description={t("currentPasswordHint")}>
        <Input
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="max-w-md"
        />
      </SettingsRow>
      <SettingsRow label={t("newPassword")} description={t("newPasswordHint")}>
        <Input
          type="password"
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className="max-w-md"
        />
      </SettingsRow>
      <SettingsRow label={t("confirmPassword")}>
        <Input
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="max-w-md"
        />
      </SettingsRow>
      <div className="flex items-center gap-3 border-t border-line py-5">
        {msg && (
          <span
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium",
              msg.kind === "ok" ? "text-success-text" : "text-danger-text",
            )}
          >
            <Icon.check className="h-4 w-4" />
            {msg.text}
          </span>
        )}
        <Button
          variant="primary"
          onClick={changePassword}
          disabled={saving || !dirty}
          className="ml-auto rounded-lg"
        >
          {saving ? tc("saving") : t("updatePassword")}
        </Button>
      </div>
    </div>
  );
}
