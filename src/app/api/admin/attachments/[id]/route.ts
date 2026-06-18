import fs from "node:fs";
import { NextResponse } from "next/server";
import { getAttachmentById } from "@/lib/admin-repo";
import { resolveAttachment } from "@/lib/storage";

// Attachments live outside the public dir; they are only served to authenticated
// admins (the /api/admin/* matcher in middleware enforces the session).
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const att = getAttachmentById(id);
  if (!att) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const abs = resolveAttachment(att.file_path);
  if (!abs) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const buf = fs.readFileSync(abs);
  return new NextResponse(buf, {
    headers: {
      "Content-Type": att.mime,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
