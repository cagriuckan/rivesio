import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { bulkUpdateStatus, listFeedbacks } from "@/lib/admin-repo";
import type { FeedbackStatus } from "@/lib/types";
import { FEEDBACK_STATUSES } from "@/lib/types";

export async function GET(req: Request) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const items = await listFeedbacks(user.id, {
    projectId: searchParams.get("w") ?? undefined,
    status: (FEEDBACK_STATUSES as string[]).includes(status ?? "") ? (status as FeedbackStatus) : undefined,
    q: searchParams.get("q")?.trim() || undefined,
  });
  return NextResponse.json({ ok: true, items });
}

const schema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(500),
  status: z.enum(["new", "planned", "in_progress", "resolved", "wontfix"]),
});

export async function PATCH(req: Request) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await bulkUpdateStatus(user.id, parsed.data.ids, parsed.data.status);
  return NextResponse.json({ ok: true, count: parsed.data.ids.length });
}
