import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { addAttachment, countAttachments } from "@/lib/repo";
import { getFeedbackWithMeta } from "@/lib/admin-repo";
import { saveAttachment } from "@/lib/storage";
import { limits } from "@/lib/env";
import { generateId } from "@/lib/ids";

export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { id } = await ctx.params;
  const feedback = await getFeedbackWithMeta(user.id, id);
  if (!feedback) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if ((await countAttachments(id)) >= limits.maxAttachments) {
    return NextResponse.json({ error: "too_many_attachments" }, { status: 400 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "no_file" }, { status: 400 });
  if (!limits.allowedMimeTypes.includes(file.type)) {
    return NextResponse.json({ error: "unsupported_type" }, { status: 400 });
  }
  if (file.size > limits.maxAttachmentBytes) {
    return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const fileId = generateId();
  const relPath = await saveAttachment(id, fileId, file.type, buf);
  const row = await addAttachment({
    feedbackId: id,
    kind: "upload",
    filePath: relPath,
    mime: file.type,
    size: buf.length,
  });

  return NextResponse.json({ ok: true, attachment_id: row.id });
}
