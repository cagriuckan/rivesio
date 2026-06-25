import { NextResponse } from "next/server";
import { getAttachmentById } from "@/lib/admin-repo";
import { readAttachment } from "@/lib/storage";

// Attachments live outside the public dir (and off the public bucket); they are
// only served to authenticated admins (the /api/admin/* matcher in middleware
// enforces the session).
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const att = getAttachmentById(id);
  if (!att) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const buf = await readAttachment(att.file_path);
  if (!buf) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": att.mime,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
