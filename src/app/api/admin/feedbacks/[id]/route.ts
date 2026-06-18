import { NextResponse } from "next/server";
import { z } from "zod";
import { updateFeedback } from "@/lib/admin-repo";

const schema = z.object({
  status: z.enum(["new", "planned", "in_progress", "resolved", "wontfix"]).optional(),
  priority: z.enum(["low", "normal", "high"]).optional(),
  admin_note: z.string().max(5000).optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  updateFeedback(id, parsed.data);
  return NextResponse.json({ ok: true });
}
