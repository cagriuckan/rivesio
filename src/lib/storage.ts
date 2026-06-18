import fs from "node:fs";
import path from "node:path";
import { env } from "./env";

const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** Persists an attachment to disk and returns the path relative to UPLOAD_DIR. */
export function saveAttachment(feedbackId: string, fileId: string, mime: string, buf: Buffer): string {
  const ext = EXT_BY_MIME[mime] ?? "bin";
  const dir = path.join(env.uploadDir, feedbackId);
  fs.mkdirSync(dir, { recursive: true });
  const abs = path.join(dir, `${fileId}.${ext}`);
  fs.writeFileSync(abs, buf);
  return path.relative(env.uploadDir, abs);
}

/** Resolves a stored relative path back to an absolute path, guarding against traversal. */
export function resolveAttachment(relPath: string): string | null {
  const abs = path.resolve(env.uploadDir, relPath);
  const root = path.resolve(env.uploadDir);
  if (!abs.startsWith(root + path.sep)) return null;
  if (!fs.existsSync(abs)) return null;
  return abs;
}
