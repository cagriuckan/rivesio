import { NextResponse } from "next/server";
import { z } from "zod";
import { bulkUpdateStatus } from "@/lib/admin-repo";

const schema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(500),
  status: z.enum(["new", "planned", "in_progress", "resolved", "wontfix"]),
});

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await bulkUpdateStatus(parsed.data.ids, parsed.data.status);
  return NextResponse.json({ ok: true, count: parsed.data.ids.length });
}
