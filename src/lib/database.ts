import {
  neon,
  type NeonQueryFunction,
} from "@neondatabase/serverless";

let sqlClient: NeonQueryFunction<false, false> | null = null;
let schemaReady: Promise<void> | null = null;

export function getDatabase(): NeonQueryFunction<false, false> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!sqlClient) {
    sqlClient = neon(databaseUrl);
  }

  return sqlClient;
}

export function ensureDatabaseSchema() {
  if (!schemaReady) {
    const sql = getDatabase();
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS waitlist_subscribers (
          id BIGSERIAL PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          source TEXT NOT NULL DEFAULT 'website',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          welcome_sent_at TIMESTAMPTZ,
          welcome_processing_at TIMESTAMPTZ
        )
      `;
      await sql`
        ALTER TABLE waitlist_subscribers
        ADD COLUMN IF NOT EXISTS welcome_sent_at TIMESTAMPTZ
      `;
      await sql`
        ALTER TABLE waitlist_subscribers
        ADD COLUMN IF NOT EXISTS welcome_processing_at TIMESTAMPTZ
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS waitlist_subscribers_created_at_idx
        ON waitlist_subscribers (created_at DESC)
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS waitlist_notification_batches (
          batch_number BIGINT PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          processing_at TIMESTAMPTZ,
          sent_at TIMESTAMPTZ
        )
      `;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }

  return schemaReady;
}
