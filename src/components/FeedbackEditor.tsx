"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FEEDBACK_STATUS_LABEL, PRIORITY_LABEL } from "@/lib/labels";
import { FEEDBACK_STATUSES, PRIORITIES } from "@/lib/types";
import type { FeedbackStatus, Priority } from "@/lib/types";

export default function FeedbackEditor(props: {
  id: string;
  status: FeedbackStatus;
  priority: Priority;
  note: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<FeedbackStatus>(props.status);
  const [priority, setPriority] = useState<Priority>(props.priority);
  const [note, setNote] = useState(props.note);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/feedbacks/${props.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, priority, admin_note: note }),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-700">Planlama</h3>

      <label className="mb-1 block text-xs font-medium text-slate-500">Durum</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as FeedbackStatus)}
        className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      >
        {FEEDBACK_STATUSES.map((s) => (
          <option key={s} value={s}>
            {FEEDBACK_STATUS_LABEL[s]}
          </option>
        ))}
      </select>

      <label className="mb-1 block text-xs font-medium text-slate-500">Öncelik</label>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {PRIORITY_LABEL[p]}
          </option>
        ))}
      </select>

      <label className="mb-1 block text-xs font-medium text-slate-500">Çözüm notu</label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={5}
        placeholder="Çözüm planı, ilgili kişi, sürüm…"
        className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {saved && <span className="text-sm text-emerald-600">Kaydedildi</span>}
      </div>
    </div>
  );
}
