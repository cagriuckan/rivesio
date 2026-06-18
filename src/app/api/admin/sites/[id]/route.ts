import { NextResponse } from "next/server";
import { z } from "zod";
import { setSiteStatus } from "@/lib/admin-repo";

const schema = z.object({ status: z.enum(["pending", "approved", "blocked"]) });

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  setSiteStatus(id, parsed.data.status);
  return NextResponse.json({ ok: true });
}
