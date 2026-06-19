import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getProjectByWidgetKey, parseSettings } from "@/lib/repo";

export const runtime = "nodejs";

let cachedBundle: string | null = null;

function loadBundle(): string {
  if (cachedBundle !== null) return cachedBundle;
  const file = path.join(process.cwd(), "public", "widget.bundle.js");
  try {
    cachedBundle = fs.readFileSync(file, "utf8");
  } catch {
    cachedBundle = "";
  }
  return cachedBundle;
}

function js(body: string, status = 200): NextResponse {
  return new NextResponse(body, {
    status,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function GET(_req: Request, ctx: { params: Promise<{ key: string }> }) {
  const raw = (await ctx.params).key;
  const key = raw.replace(/\.js$/i, "");

  const project = getProjectByWidgetKey(key);
  if (!project) {
    // Unknown key: serve a no-op so a stale embed never throws on the host page.
    return js("/* revisto: unknown widget key */", 404);
  }

  const settings = parseSettings(project);
  const config = {
    base: env.publicBaseUrl,
    widgetKey: project.widget_key,
    project: {
      name: project.name,
      accentColor: settings.accentColor,
      position: settings.position,
      categories: settings.categories,
    },
  };

  const bundle = loadBundle();
  const out = `window.__KF_CONFIG__=${JSON.stringify(config)};\n${bundle}`;
  return js(out);
}
