import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { env } from "./env";
import { generateId, generateWidgetKey } from "./ids";

type DB = Database.Database;

declare global {
  // Reuse the connection across Next.js hot reloads in development.
  // eslint-disable-next-line no-var
  var __kanewsFeedbackDb: DB | undefined;
}

const DEFAULT_CATEGORIES = ["Öneri", "Hata", "Tasarım", "Diğer"];

function migrate(db: DB): void {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id           TEXT PRIMARY KEY,
      slug         TEXT NOT NULL UNIQUE,
      name         TEXT NOT NULL,
      theme_slug   TEXT NOT NULL,
      widget_key   TEXT NOT NULL UNIQUE,
      settings_json TEXT NOT NULL DEFAULT '{}',
      created_at   INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sites (
      id          TEXT PRIMARY KEY,
      project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      domain      TEXT NOT NULL,
      license_key TEXT,
      status      TEXT NOT NULL DEFAULT 'pending',
      meta_json   TEXT NOT NULL DEFAULT '{}',
      first_seen  INTEGER NOT NULL,
      last_seen   INTEGER NOT NULL,
      UNIQUE (project_id, domain)
    );

    CREATE TABLE IF NOT EXISTS feedbacks (
      id          TEXT PRIMARY KEY,
      project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      site_id     TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
      category    TEXT NOT NULL DEFAULT 'Öneri',
      message     TEXT NOT NULL,
      page_url    TEXT,
      user_agent  TEXT,
      viewport    TEXT,
      wp_user     TEXT,
      status      TEXT NOT NULL DEFAULT 'new',
      priority    TEXT NOT NULL DEFAULT 'normal',
      admin_note  TEXT,
      created_at  INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attachments (
      id          TEXT PRIMARY KEY,
      feedback_id TEXT NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
      kind        TEXT NOT NULL DEFAULT 'upload',
      file_path   TEXT NOT NULL,
      mime        TEXT NOT NULL,
      size        INTEGER NOT NULL,
      created_at  INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_feedbacks_project ON feedbacks(project_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON feedbacks(status);
    CREATE INDEX IF NOT EXISTS idx_sites_project ON sites(project_id);
    CREATE INDEX IF NOT EXISTS idx_attachments_feedback ON attachments(feedback_id);
  `);

  // Seed the default Kanews project on first run so the panel is usable immediately.
  const count = db.prepare("SELECT COUNT(*) AS c FROM projects").get() as { c: number };
  if (count.c === 0) {
    db.prepare(
      `INSERT INTO projects (id, slug, name, theme_slug, widget_key, settings_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
      generateId(),
      "kanews",
      "Kanews",
      "kanews",
      generateWidgetKey(),
      JSON.stringify({
        accentColor: "#4f46e5",
        position: "bottom-right",
        categories: DEFAULT_CATEGORIES,
      }),
      Date.now()
    );
  }
}

function open(): DB {
  fs.mkdirSync(path.dirname(env.dbPath), { recursive: true });
  fs.mkdirSync(env.uploadDir, { recursive: true });
  const db = new Database(env.dbPath);
  migrate(db);
  return db;
}

export function getDb(): DB {
  if (!global.__kanewsFeedbackDb) {
    global.__kanewsFeedbackDb = open();
  }
  return global.__kanewsFeedbackDb;
}

export const DEFAULT_PROJECT_CATEGORIES = DEFAULT_CATEGORIES;
