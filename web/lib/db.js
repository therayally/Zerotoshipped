// Neon Postgres access. Tables are created on first use (idempotent), so a fresh database needs no setup step.
import { neon } from '@neondatabase/serverless';

let client;
let ready;

function sql() {
  if (!process.env.DATABASE_URL) throw new Error('Server is missing DATABASE_URL (connect Neon in Vercel → Storage).');
  client ??= neon(process.env.DATABASE_URL);
  return client;
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    is_secret BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    source TEXT NOT NULL,
    external_id TEXT UNIQUE,
    amount_cents INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'completed',
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_logins INTEGER NOT NULL DEFAULT 0',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ',
  'CREATE INDEX IF NOT EXISTS donations_email ON donations(email)',
  `CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    device_id TEXT,
    device_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  'CREATE INDEX IF NOT EXISTS sessions_email ON sessions(email)',
  `CREATE TABLE IF NOT EXISTS codes (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    purpose TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    expires_at BIGINT NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at BIGINT NOT NULL
  )`,
  'CREATE INDEX IF NOT EXISTS codes_email ON codes(email, purpose)',
  `CREATE TABLE IF NOT EXISTS trusted_devices (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    device_name TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  'CREATE INDEX IF NOT EXISTS trusted_devices_email ON trusted_devices(email)',
  `CREATE TABLE IF NOT EXISTS progress (
    email TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    done_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (email, lesson_id)
  )`,
  `CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    track INTEGER NOT NULL,
    lessons INTEGER NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (email, track)
  )`,
  `CREATE TABLE IF NOT EXISTS rate_limits (
    key TEXT NOT NULL,
    window_start BIGINT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (key, window_start)
  )`,
  `CREATE TABLE IF NOT EXISTS admins (
    email TEXT PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    detail TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
];

async function ensureSchema() {
  ready ??= (async () => {
    for (const stmt of SCHEMA) await sql().query(stmt);
  })().catch((e) => { ready = undefined; throw e; });
  return ready;
}

// Parameterized queries only: values are always passed separately from the SQL text.
export async function q(text, params = []) {
  await ensureSchema();
  return sql().query(text, params);
}

export async function one(text, params = []) {
  const rows = await q(text, params);
  return rows[0] || null;
}
