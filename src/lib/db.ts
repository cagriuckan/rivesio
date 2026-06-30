import mysql from "mysql2/promise";
import { env } from "./env";

declare global {
  // Reuse the pool + migration promise across Next.js hot reloads in development.
  // eslint-disable-next-line no-var
  var __revistoPool: mysql.Pool | undefined;
  // eslint-disable-next-line no-var
  var __revistoReady: Promise<void> | undefined;
}

const DEFAULT_CATEGORIES = ["Öneri", "Hata", "Tasarım", "Diğer"];

function createPool(): mysql.Pool {
  return mysql.createPool({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
    waitForConnections: true,
    connectionLimit: 10,
    charset: "utf8mb4_unicode_ci",
    // Return DATE/DATETIME as strings so trend buckets stay 'YYYY-MM-DD'.
    dateStrings: true,
  });
}

function pool(): mysql.Pool {
  if (!global.__revistoPool) global.__revistoPool = createPool();
  return global.__revistoPool;
}

async function migrate(p: mysql.Pool): Promise<void> {
  // Schema. TEXT/BLOB columns can't carry DEFAULTs in MySQL, so callers always
  // insert those values explicitly. Indexes live inline to stay idempotent.
  await p.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id            VARCHAR(64) PRIMARY KEY,
      slug          VARCHAR(191) NOT NULL UNIQUE,
      name          VARCHAR(255) NOT NULL,
      widget_key    VARCHAR(191) NOT NULL UNIQUE,
      settings_json TEXT NOT NULL,
      created_at    BIGINT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  try {
    await p.query("ALTER TABLE projects DROP COLUMN theme_slug");
  } catch {
    // Column already removed or does not exist on fresh installs.
  }

  await p.query(`
    CREATE TABLE IF NOT EXISTS sites (
      id          VARCHAR(64) PRIMARY KEY,
      project_id  VARCHAR(64) NOT NULL,
      domain      VARCHAR(255) NOT NULL,
      license_key VARCHAR(255),
      status      VARCHAR(32) NOT NULL DEFAULT 'pending',
      meta_json   TEXT NOT NULL,
      first_seen  BIGINT NOT NULL,
      last_seen   BIGINT NOT NULL,
      UNIQUE KEY uniq_site (project_id, domain),
      KEY idx_sites_project (project_id),
      CONSTRAINT fk_sites_project FOREIGN KEY (project_id)
        REFERENCES projects(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id          VARCHAR(64) PRIMARY KEY,
      project_id  VARCHAR(64) NOT NULL,
      site_id     VARCHAR(64) NOT NULL,
      category    VARCHAR(100) NOT NULL DEFAULT 'Öneri',
      message     TEXT NOT NULL,
      page_url    VARCHAR(2000),
      user_agent  VARCHAR(500),
      viewport    VARCHAR(50),
      wp_user     VARCHAR(300),
      status      VARCHAR(32) NOT NULL DEFAULT 'new',
      priority    VARCHAR(32) NOT NULL DEFAULT 'normal',
      admin_note  TEXT,
      custom_fields_json TEXT,
      created_at  BIGINT NOT NULL,
      KEY idx_feedbacks_project (project_id, created_at),
      KEY idx_feedbacks_status (status),
      CONSTRAINT fk_feedbacks_project FOREIGN KEY (project_id)
        REFERENCES projects(id) ON DELETE CASCADE,
      CONSTRAINT fk_feedbacks_site FOREIGN KEY (site_id)
        REFERENCES sites(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS attachments (
      id          VARCHAR(64) PRIMARY KEY,
      feedback_id VARCHAR(64) NOT NULL,
      kind        VARCHAR(32) NOT NULL DEFAULT 'upload',
      file_path   VARCHAR(500) NOT NULL,
      mime        VARCHAR(100) NOT NULL,
      size        BIGINT NOT NULL,
      created_at  BIGINT NOT NULL,
      KEY idx_attachments_feedback (feedback_id),
      CONSTRAINT fk_attachments_feedback FOREIGN KEY (feedback_id)
        REFERENCES feedbacks(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS feedback_replies (
      id          VARCHAR(64) PRIMARY KEY,
      feedback_id VARCHAR(64) NOT NULL,
      author      VARCHAR(32) NOT NULL DEFAULT 'admin',
      message     TEXT NOT NULL,
      created_at  BIGINT NOT NULL,
      KEY idx_feedback_replies_feedback (feedback_id, created_at),
      CONSTRAINT fk_feedback_replies_feedback FOREIGN KEY (feedback_id)
        REFERENCES feedbacks(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Idempotent column additions for tables that predate them.
  await addColumnIfMissing(p, "feedbacks", "custom_fields_json", "TEXT");
  await addColumnIfMissing(p, "sites", "is_favorite", "TINYINT(1) NOT NULL DEFAULT 0");
  await addColumnIfMissing(p, "sites", "label", "VARCHAR(255)");
  await addColumnIfMissing(p, "feedbacks", "is_favorite", "TINYINT(1) NOT NULL DEFAULT 0");

  // No default project is seeded; projects are created explicitly from the panel.
}

/** Adds a column only if it isn't already present (ALTER ... ADD COLUMN is not idempotent in MySQL). */
async function addColumnIfMissing(
  p: mysql.Pool,
  table: string,
  column: string,
  definition: string,
): Promise<void> {
  const [rows] = await p.query(
    `SELECT COUNT(*) AS c FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
    [table, column],
  );
  const exists = (rows as { c: number }[])[0]?.c > 0;
  if (!exists) {
    await p.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
  }
}

/** Returns a ready pool, running migrations exactly once per process. */
async function ready(): Promise<mysql.Pool> {
  const p = pool();
  if (!global.__revistoReady) global.__revistoReady = migrate(p);
  await global.__revistoReady;
  return p;
}

/** Runs a query and returns all rows typed as T[]. */
export async function queryAll<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const p = await ready();
  const [rows] = await p.query(sql, params);
  return rows as T[];
}

/** Runs a query and returns the first row, or undefined. */
export async function queryOne<T>(sql: string, params: unknown[] = []): Promise<T | undefined> {
  const rows = await queryAll<T>(sql, params);
  return rows[0];
}

/** Runs an INSERT/UPDATE/DELETE statement. */
export async function execute(sql: string, params: unknown[] = []): Promise<void> {
  const p = await ready();
  await p.query(sql, params);
}

export const DEFAULT_PROJECT_CATEGORIES = DEFAULT_CATEGORIES;
