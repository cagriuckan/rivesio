import { NextResponse } from "next/server";
import { getConversationContext } from "@/lib/guard";
import { getAttachmentById } from "@/lib/admin-repo";
import { readAttachment } from "@/lib/storage";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

// Token-scoped attachment streaming: the image is only served if it belongs to
// the conversation the token unlocks.
export async function GET(
  req: Request,
  ctx: { params: Promise<{ token: string; aid: string }> },
) {
  if (!rateLimit(`conv-att-get:${clientIp(req)}`, 240, 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const { token, aid } = await ctx.params;
  const result = await getConversationContext(token);
  if (!result.ok || !result.config.allowConversation) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const att = await getAttachmentById(aid);
  if (!att || att.feedback_id !== result.feedback.id) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const buf = await readAttachment(att.file_path);
  if (!buf) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": att.mime,
      "Cache-Control": "private, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
