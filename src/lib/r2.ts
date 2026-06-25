import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

let client: S3Client | null = null;

/** Lazily builds a single S3 client pointed at the Cloudflare R2 endpoint. */
export function r2Client(): S3Client {
  if (client) return client;
  const endpoint =
    env.r2.endpoint || `https://${env.r2.accountId}.r2.cloudflarestorage.com`;
  client = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId: env.r2.accessKeyId,
      secretAccessKey: env.r2.secretAccessKey,
    },
  });
  return client;
}
