import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

function getDatabaseUrl(): string {
  let url = process.env.DATABASE_URL;
  if (!url) {
    for (const envFile of [".env.local", ".env", ".env.example"]) {
      const envPath = path.resolve(process.cwd(), envFile);
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf-8");
        const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
        if (match && match[1]) {
          url = match[1];
          break;
        }
      }
    }
  }

  if (!url) {
    console.error("❌ Error: DATABASE_URL is not configured in environment or .env files.");
    process.exit(1);
  }
  return url;
}

const databaseUrl = getDatabaseUrl();


const maskedUrl = databaseUrl.replace(/:[^:@]+@/, ":****@");
console.log(`Connecting to database: ${maskedUrl}`);

const sql = neon(databaseUrl);

async function runMigrations() {
  console.log("🚀 Starting database migrations...");

  try {
    console.log("1. Creating 'waitlist_subscribers' table if not exists...");
    await sql`
      CREATE TABLE IF NOT EXISTS waitlist_subscribers (
        id BIGSERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        source TEXT NOT NULL DEFAULT 'website',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        welcome_sent_at TIMESTAMPTZ,
        welcome_processing_at TIMESTAMPTZ
      );
    `;

    console.log("2. Applying column migrations on 'waitlist_subscribers'...");
    await sql`
      ALTER TABLE waitlist_subscribers
        ADD COLUMN IF NOT EXISTS welcome_sent_at TIMESTAMPTZ;
    `;

    await sql`
      ALTER TABLE waitlist_subscribers
        ADD COLUMN IF NOT EXISTS welcome_processing_at TIMESTAMPTZ;
    `;

    console.log("3. Creating index 'waitlist_subscribers_created_at_idx'...");
    await sql`
      CREATE INDEX IF NOT EXISTS waitlist_subscribers_created_at_idx
        ON waitlist_subscribers (created_at DESC);
    `;

    console.log("4. Creating 'waitlist_notification_batches' table if not exists...");
    await sql`
      CREATE TABLE IF NOT EXISTS waitlist_notification_batches (
        batch_number BIGINT PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        processing_at TIMESTAMPTZ,
        sent_at TIMESTAMPTZ
      );
    `;

    console.log("✅ All migrations applied successfully!\n");

    // Verification
    console.log("🔍 Verifying database schema...");
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    console.log("Tables created:", tables.map((t: any) => t.table_name));

    const columns = await sql`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `;
    console.log("\nTable details:");
    console.table(columns);

    const indexes = await sql`
      SELECT tablename, indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = 'public';
    `;
    console.log("\nIndexes:");
    console.table(indexes);

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigrations();
