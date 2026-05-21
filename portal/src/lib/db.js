import { neon } from '@neondatabase/serverless';

let _sql = null;

export function getDb() {
  if (!_sql) {
    const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!url) throw new Error('No database URL found. Set POSTGRES_URL.');
    _sql = neon(url);
  }
  return _sql;
}

export async function initDb() {
  const sql = getDb();

  // ── Faculty ──────────────────────────────────────────────────────────────
  // Core columns only — old columns (bio, research_interests, phone, office,
  // google_scholar, publications, password_hash) were from a previous
  // faculty-login design and are no longer read or written.
  await sql`
    CREATE TABLE IF NOT EXISTS faculty (
      id            TEXT PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      name          TEXT        DEFAULT '',
      department    TEXT        DEFAULT '',
      designation   TEXT        DEFAULT '',
      is_principal  BOOLEAN     DEFAULT FALSE,
      is_hod        BOOLEAN     DEFAULT FALSE,
      photo_url     TEXT        DEFAULT '',
      title         TEXT        DEFAULT '',
      linkedin      TEXT        DEFAULT '',
      x_handle      TEXT        DEFAULT '',
      google_plus   TEXT        DEFAULT '',
      subjects      JSONB       DEFAULT '[]',
      rank          TEXT        DEFAULT '',
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      last_updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Migration: add columns that may be missing on older DBs
  const migrations = [
    sql`ALTER TABLE faculty ADD COLUMN IF NOT EXISTS x_handle    TEXT DEFAULT ''`,
    sql`ALTER TABLE faculty ADD COLUMN IF NOT EXISTS google_plus TEXT DEFAULT ''`,
    sql`ALTER TABLE faculty ADD COLUMN IF NOT EXISTS subjects    JSONB DEFAULT '[]'`,
    sql`ALTER TABLE faculty ADD COLUMN IF NOT EXISTS title       TEXT DEFAULT ''`,
    sql`ALTER TABLE faculty ADD COLUMN IF NOT EXISTS rank        TEXT DEFAULT ''`,
    // Make password_hash optional for existing rows (column may still exist on old DBs)
    sql`ALTER TABLE faculty ALTER COLUMN password_hash DROP NOT NULL`.catch(() => null),
    sql`ALTER TABLE faculty ALTER COLUMN password_hash SET DEFAULT ''`.catch(() => null),
  ];
  await Promise.all(migrations);

  // ── Department order ─────────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS dept_order (
      id     INTEGER PRIMARY KEY DEFAULT 1,
      orders TEXT[]  DEFAULT '{}'
    )
  `;
  await sql`
    INSERT INTO dept_order (id, orders) VALUES (1, '{}')
    ON CONFLICT (id) DO NOTHING
  `;

  // ── Admin credentials (DB override for env-var password) ────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS admin_credentials (
      email       TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // ── Password reset OTPs ───────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS password_reset_otps (
      id         TEXT        PRIMARY KEY,
      email      TEXT        NOT NULL,
      otp_hash   TEXT        NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used       BOOLEAN     DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // ── Events ───────────────────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id          TEXT        PRIMARY KEY,
      title       TEXT        DEFAULT '',
      description TEXT        DEFAULT '',
      department  TEXT        DEFAULT '',
      event_date  DATE,
      image_url   TEXT        DEFAULT '',
      link        TEXT        DEFAULT '',
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
