import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { subscribe } from "@/lib/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEARTBEAT_MS = 25_000;

/** SSE stream of the signed-in user's live events. */
export async function GET(req: Request) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const send = (chunk: string) => {
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          // Stream already closed.
        }
      };

      send(`: connected\n\n`);

      const unsubscribe = subscribe((event) => {
        if (event.userId !== user.id) return;
        send(`id: ${event.ts}\nevent: ${event.type}\ndata: ${JSON.stringify(event.payload)}\n\n`);
      });

      const heartbeat = setInterval(() => send(`: ping\n\n`), HEARTBEAT_MS);

      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // Already closed.
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
