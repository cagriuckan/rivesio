import fs from "node:fs";
import path from "node:path";
import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { env, r2Enabled } from "./env";
import { r2Client } from "./r2";

const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** Object key / relative path under which a feedback's attachment is stored. */
function attachmentKey(feedbackId: string, fileId: string, mime: string): string {
  const ext = EXT_BY_MIME[mime] ?? "bin";
  return `${feedbackId}/${fileId}.${ext}`;
}

/** File extension for a stored key, used to derive its content type on read. */
export function extToMime(key: string): string {
  const ext = key.slice(key.lastIndexOf(".") + 1).toLowerCase();
  for (const [mime, e] of Object.entries(EXT_BY_MIME)) if (e === ext) return mime;
  return "application/octet-stream";
}

/** Writes a buffer to R2 (when configured) or the local UPLOAD_DIR. */
async function putObject(key: string, mime: string, buf: Buffer): Promise<void> {
  if (r2Enabled) {
    await r2Client().send(
      new PutObjectCommand({ Bucket: env.r2.bucket, Key: key, Body: buf, ContentType: mime }),
    );
    return;
  }
  const abs = path.join(env.uploadDir, key);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, buf);
}

/**
 * Persists an attachment and returns its storage key (relative path).
 * Uploads to Cloudflare R2 when configured, otherwise writes to UPLOAD_DIR.
 */
export async function saveAttachment(
  feedbackId: string,
  fileId: string,
  mime: string,
  buf: Buffer,
): Promise<string> {
  const key = attachmentKey(feedbackId, fileId, mime);
  await putObject(key, mime, buf);
  return key;
}

/**
 * Persists a project's widget logo and returns its storage key. Each project
 * keeps at most one logo — callers clear the previous one via deleteLogoDir.
 */
export async function saveLogo(
  projectId: string,
  fileId: string,
  mime: string,
  buf: Buffer,
): Promise<string> {
  const ext = EXT_BY_MIME[mime] ?? "bin";
  const key = `logos/${projectId}/${fileId}.${ext}`;
  await putObject(key, mime, buf);
  return key;
}

/** Removes all logo objects for a project (everything under its prefix). */
export async function deleteLogoDir(projectId: string): Promise<void> {
  await deletePrefix(`logos/${projectId}/`, path.join(env.uploadDir, "logos", projectId));
}

/**
 * Persists a user's avatar and returns its storage key. Each user keeps at
 * most one avatar — callers clear the previous one via deleteAvatarDir.
 */
export async function saveAvatar(
  userId: string,
  fileId: string,
  mime: string,
  buf: Buffer,
): Promise<string> {
  const ext = EXT_BY_MIME[mime] ?? "bin";
  const key = `avatars/${userId}/${fileId}.${ext}`;
  await putObject(key, mime, buf);
  return key;
}

/** Removes all avatar objects for a user (everything under its prefix). */
export async function deleteAvatarDir(userId: string): Promise<void> {
  await deletePrefix(`avatars/${userId}/`, path.join(env.uploadDir, "avatars", userId));
}

/** Deletes every object under a storage prefix (R2) or a local directory. */
async function deletePrefix(prefix: string, localDir: string): Promise<void> {
  if (r2Enabled) {
    const client = r2Client();
    const listed = await client.send(
      new ListObjectsV2Command({ Bucket: env.r2.bucket, Prefix: prefix }),
    );
    const objects = (listed.Contents ?? [])
      .map((o) => o.Key)
      .filter((k): k is string => !!k);
    if (objects.length > 0) {
      await client.send(
        new DeleteObjectsCommand({
          Bucket: env.r2.bucket,
          Delete: { Objects: objects.map((Key) => ({ Key })) },
        }),
      );
    }
    return;
  }
  fs.rmSync(localDir, { recursive: true, force: true });
}

/** Deletes all attachment objects for a feedback (everything under its prefix). */
export async function deleteAttachmentDir(feedbackId: string): Promise<void> {
  await deletePrefix(`${feedbackId}/`, path.join(env.uploadDir, feedbackId));
}

/** Reads a stored attachment by its key, or null if it does not exist. */
export async function readAttachment(key: string): Promise<Buffer | null> {
  if (r2Enabled) {
    try {
      const res = await r2Client().send(
        new GetObjectCommand({ Bucket: env.r2.bucket, Key: key }),
      );
      const bytes = await res.Body?.transformToByteArray();
      return bytes ? Buffer.from(bytes) : null;
    } catch {
      return null;
    }
  }
  const abs = path.resolve(env.uploadDir, key);
  const root = path.resolve(env.uploadDir);
  if (!abs.startsWith(root + path.sep)) return null;
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs);
}
