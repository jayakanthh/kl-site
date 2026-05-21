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
  await sql`
    CREATE TABLE IF NOT EXISTS faculty (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT DEFAULT '',
      department TEXT DEFAULT '',
      designation TEXT DEFAULT '',
      is_principal BOOLEAN DEFAULT FALSE,
      is_hod BOOLEAN DEFAULT FALSE,
      photo_url TEXT DEFAULT '',
      bio TEXT DEFAULT '',
      research_interests TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      office TEXT DEFAULT '',
      linkedin TEXT DEFAULT '',
      google_scholar TEXT DEFAULT '',
      publications JSONB DEFAULT '[]',
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      last_updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS dept_order (
      id INTEGER PRIMARY KEY DEFAULT 1,
      orders TEXT[] DEFAULT '{}'
    )
  `;
  // Ensure the single dept_order row exists
  await sql`
    INSERT INTO dept_order (id, orders) VALUES (1, '{}')
    ON CONFLICT (id) DO NOTHING
  `;
  // Migrate: add new columns if they don't exist yet
  await sql`ALTER TABLE faculty ADD COLUMN IF NOT EXISTS x_handle TEXT DEFAULT ''`;
  await sql`ALTER TABLE faculty ADD COLUMN IF NOT EXISTS google_plus TEXT DEFAULT ''`;
  await sql`ALTER TABLE faculty ADD COLUMN IF NOT EXISTS subjects JSONB DEFAULT '[]'`;
  await sql`ALTER TABLE faculty ADD COLUMN IF NOT EXISTS title TEXT DEFAULT ''`;
  // Faculty no longer log in — make password_hash optional
  await sql`ALTER TABLE faculty ALTER COLUMN password_hash DROP NOT NULL`.catch(() => null);
  await sql`ALTER TABLE faculty ALTER COLUMN password_hash SET DEFAULT ''`.catch(() => null);
  // Academic rank: Professor / Associate Professor / Assistant Professor
  await sql`ALTER TABLE faculty ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT ''`.catch(() => null);

  // Events table
  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id          TEXT PRIMARY KEY,
      title       TEXT DEFAULT '',
      description TEXT DEFAULT '',
      department  TEXT DEFAULT '',
      event_date  DATE,
      image_url   TEXT DEFAULT '',
      link        TEXT DEFAULT '',
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
