import path from "node:path";

/** Reads an env var, throwing in production when a required value is missing. */
function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    return "";
  }
  return value;
}

function resolvePath(value: string): string {
  return path.isAbsolute(value) ? value : path.join(process.cwd(), value);
}

export const env = {
  adminUser: required("ADMIN_USER", "admin"),
  adminPasswordHash: required("ADMIN_PASSWORD_HASH"),
  jwtSecret: required("JWT_SECRET", "dev-insecure-secret-change-me"),
  publicBaseUrl: (process.env.PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  dbPath: resolvePath(process.env.DB_PATH ?? "./data/feedback.db"),
  uploadDir: resolvePath(process.env.UPLOAD_DIR ?? "./data/uploads"),
  autoApproveSites: process.env.AUTO_APPROVE_SITES === "1",
  r2: {
    accountId: process.env.R2_ACCOUNT_ID ?? "",
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
    bucket: process.env.R2_BUCKET ?? "",
    // Optional explicit endpoint; defaults to the account's S3 API endpoint.
    endpoint: process.env.R2_ENDPOINT ?? "",
  },
};

/** True when all R2 credentials are present; otherwise attachments fall back to local disk. */
export const r2Enabled =
  !!env.r2.accountId && !!env.r2.accessKeyId && !!env.r2.secretAccessKey && !!env.r2.bucket;

/** Limits applied to public submissions. */
export const limits = {
  maxAttachments: 4,
  maxAttachmentBytes: 5 * 1024 * 1024, // 5 MB per image
  maxMessageLength: 5000,
  allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
};
