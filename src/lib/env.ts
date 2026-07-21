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
  authSecret: required("BETTER_AUTH_SECRET", "dev-insecure-secret-change-me"),
  publicBaseUrl: (process.env.PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  uploadDir: resolvePath(process.env.UPLOAD_DIR ?? "./data/uploads"),
  databaseUrl: required(
    "DATABASE_URL",
    "postgres://postgres:postgres@127.0.0.1:5432/rivesio",
  ),
  autoApproveSites: process.env.AUTO_APPROVE_SITES === "1",
  email: {
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    from: process.env.EMAIL_FROM ?? "Rivesio <onboarding@resend.dev>",
  },
  vapid: {
    publicKey: process.env.VAPID_PUBLIC_KEY ?? "",
    privateKey: process.env.VAPID_PRIVATE_KEY ?? "",
    subject: process.env.VAPID_SUBJECT ?? "mailto:admin@localhost",
  },
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

/** True when a real Resend key is configured; otherwise emails are logged, not sent. */
export const emailEnabled = !!env.email.resendApiKey;

/** True when web-push VAPID keys are configured. */
export const pushEnabled = !!env.vapid.publicKey && !!env.vapid.privateKey;

/** Limits applied to public submissions. */
export const limits = {
  maxAttachments: 4,
  maxAttachmentBytes: 5 * 1024 * 1024, // 5 MB per image
  maxMessageLength: 5000,
  maxReplyLength: 5000,
  allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
};

/** Limits for widget logo uploads. Tighter than attachments and email-safe. */
export const logoLimits = {
  maxBytes: 512 * 1024, // 512 KB
  // GIF/SVG excluded: poor email-client support and SVG is an injection risk.
  allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
};
