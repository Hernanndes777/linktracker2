import { neon } from "@neondatabase/serverless";

export function getDb() {
  const sql = neon(process.env.DATABASE_URL);
  return sql;
}

export async function setupSchema() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS links (
      id          SERIAL PRIMARY KEY,
      slug        TEXT UNIQUE NOT NULL,
      destination TEXT NOT NULL,
      campaign    TEXT,
      adset       TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id         SERIAL PRIMARY KEY,
      click_id   TEXT NOT NULL,
      slug       TEXT NOT NULL,
      event_type TEXT NOT NULL,  -- 'pageview' | 'whatsapp'
      ip         TEXT,
      ua         TEXT,
      ref        TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_events_slug       ON events(slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_events_click_id   ON events(click_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type)`;

  return true;
}
