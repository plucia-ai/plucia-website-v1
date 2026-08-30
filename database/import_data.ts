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


const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function cleanEmail(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let e = raw.trim().toLowerCase();
  // Strip BOM, zero-width spaces, surrounding quotes, brackets
  e = e.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
  e = e.replace(/^["'<(\[]+|["'>)\]]+$/g, "").trim();
  if (!e || ["null", "undefined", "n/a", "none", "nil", "na", "-", "#n/a", "unavailable"].includes(e)) {
    return null;
  }
  if (EMAIL_PATTERN.test(e) && e.length <= 320) {
    return e;
  }
  return null;
}

// Split multiple emails if a cell contains e.g. "a@b.com, c@d.com" or "a@b.com / c@d.com"
function extractEmailsFromCell(cell: string | undefined | null): string[] {
  if (!cell) return [];
  const parts = cell.split(/[,;\/\s|]+/).map(cleanEmail).filter((e): e is string => Boolean(e));
  return parts;
}

// Robust CSV parser supporting quotes, escaped quotes, multiline values
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField.trim());
      if (currentRow.some(f => f.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = "";
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(f => f.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

// HTML table parser for .xls files
function parseHtmlTable(html: string): { headers: string[]; rows: string[][] } {
  const thMatches = [...html.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)];
  const headers = thMatches.map(m => m[1].replace(/<[^>]+>/g, "").trim());

  const rows: string[][] = [];
  const trMatches = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  
  for (const tr of trMatches) {
    const trContent = tr[1];
    if (trContent.includes("<th")) continue; // Skip header row
    const tdMatches = [...trContent.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    if (tdMatches.length > 0) {
      const row = tdMatches.map(td => td[1].replace(/<[^>]+>/g, "").trim());
      rows.push(row);
    }
  }

  return { headers, rows };
}

interface ExtractedRecord {
  email: string;
  source: string;
  file: string;
}

function processCsvFile(filePath: string, defaultSource: string): ExtractedRecord[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const rows = parseCSV(content);
  if (rows.length === 0) return [];

  const headers = rows[0].map(h => h.toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, "").trim());
  let emailColIdx = headers.findIndex(h => h.includes("email"));
  if (emailColIdx === -1) {
    emailColIdx = 0; // Default to first column
  }

  const results: ExtractedRecord[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rawEmail = row[emailColIdx];
    const emails = extractEmailsFromCell(rawEmail);
    for (const email of emails) {
      results.push({ email, source: defaultSource, file: path.basename(filePath) });
    }
  }

  return results;
}

function processHtmlXlsFile(filePath: string, defaultSource: string): ExtractedRecord[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const { headers, rows } = parseHtmlTable(content);

  const cleanHeaders = headers.map(h => h.toLowerCase().trim());
  let emailColIdx = cleanHeaders.findIndex(h => h.includes("email"));
  if (emailColIdx === -1) {
    emailColIdx = 3;
  }

  const results: ExtractedRecord[] = [];
  for (const row of rows) {
    const rawEmail = row[emailColIdx];
    const emails = extractEmailsFromCell(rawEmail);
    for (const email of emails) {
      results.push({ email, source: defaultSource, file: path.basename(filePath) });
    }
  }

  return results;
}

async function main() {
  console.log("=================================================");
  console.log("  PLUCIA DATABASE DATA EXTRACTION & IMPORT TOOL  ");
  console.log("=================================================\n");

  // Prioritize domain-specific sources first so meaningful source labels are assigned
  const filesConfig = [
    { file: "real-estate-agents.csv", source: "real_estate_agents", type: "csv" as const },
    { file: "approved_developers.xls", source: "approved_developers", type: "xls" as const },
    { file: "Brokers List.xls", source: "brokers_list", type: "xls" as const },
    { file: "Cavehubs Email Scrapping  15-03-2024 - Data Clean official.csv", source: "cavehubs_scraping", type: "csv" as const },
    { file: "5,000 Emails Mail Chimp - Sheet1.csv", source: "mailchimp_5k", type: "csv" as const },
    { file: "15,000 Emails Mailjet  - Sheet1.csv", source: "mailjet_15k", type: "csv" as const },
    { file: "15,000 - 22k Emails Mailjet  - Sheet1.csv", source: "mailjet_15k_22k", type: "csv" as const },
    { file: "_22k- 24k Emails Mailjet  - Sheet1.csv", source: "mailjet_22k_24k", type: "csv" as const },
  ];

  const allRecords: ExtractedRecord[] = [];

  console.log("📂 Step 1: Extracting and cleaning data from all files...");

  for (const cfg of filesConfig) {
    const fullPath = path.resolve(process.cwd(), cfg.file);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ Warning: File not found: ${cfg.file}`);
      continue;
    }

    let records: ExtractedRecord[] = [];
    if (cfg.type === "csv") {
      records = processCsvFile(fullPath, cfg.source);
    } else {
      records = processHtmlXlsFile(fullPath, cfg.source);
    }

    allRecords.push(...records);
    console.log(`  ✓ ${cfg.file.padEnd(58)}: ${records.length.toLocaleString().padStart(6)} valid emails (source: '${cfg.source}')`);
  }

  console.log(`\n📊 Extraction Summary:`);
  console.log(`  Total extracted raw emails: ${allRecords.length.toLocaleString()}`);

  // Deduplicate emails across all files while preserving the prioritized source
  const uniqueMap = new Map<string, ExtractedRecord>();
  for (const rec of allRecords) {
    if (!uniqueMap.has(rec.email)) {
      uniqueMap.set(rec.email, rec);
    }
  }

  const uniqueRecords = Array.from(uniqueMap.values());
  console.log(`  Unique valid emails       : ${uniqueRecords.length.toLocaleString()}`);
  console.log(`  Duplicate entries removed : ${(allRecords.length - uniqueRecords.length).toLocaleString()}\n`);

  // Source breakdown
  const sourceBreakdown: Record<string, number> = {};
  for (const r of uniqueRecords) {
    sourceBreakdown[r.source] = (sourceBreakdown[r.source] || 0) + 1;
  }
  console.log("📈 Unique Emails by Source:");
  for (const [src, count] of Object.entries(sourceBreakdown)) {
    console.log(`  • ${src.padEnd(25)}: ${count.toLocaleString().padStart(8)} emails`);
  }

  console.log("\n-------------------------------------------------");
  console.log("💾 Step 2: Batch importing into Neon database...");
  console.log(`Connecting: ${databaseUrl.replace(/:[^:@]+@/, ":****@")}`);

  const sql = neon(databaseUrl);

  // Ensure table schema exists
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

  await sql`
    CREATE TABLE IF NOT EXISTS waitlist_notification_batches (
      batch_number BIGINT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      processing_at TIMESTAMPTZ,
      sent_at TIMESTAMPTZ
    );
  `;

  const initialCountRes = await sql`SELECT COUNT(*)::BIGINT AS count FROM waitlist_subscribers;`;
  const initialCount = Number(initialCountRes[0].count);
  console.log(`Current subscribers in database: ${initialCount.toLocaleString()}`);

  // Batch insert using UNNEST for optimal throughput and safety
  const BATCH_SIZE = 2500;
  const totalBatches = Math.ceil(uniqueRecords.length / BATCH_SIZE);
  let totalInserted = 0;
  const startTime = Date.now();

  console.log(`\nImporting in ${totalBatches} batches (${BATCH_SIZE.toLocaleString()} records/batch)...\n`);

  for (let i = 0; i < totalBatches; i++) {
    const startIdx = i * BATCH_SIZE;
    const batch = uniqueRecords.slice(startIdx, startIdx + BATCH_SIZE);

    const emails = batch.map(b => b.email);
    const sources = batch.map(b => b.source);

    const insertedRows = await sql.query(`
      INSERT INTO waitlist_subscribers (email, source)
      SELECT * FROM UNNEST($1::text[], $2::text[]) AS t(email, source)
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `, [emails, sources]);

    totalInserted += insertedRows.length;

    const progress = (((i + 1) / totalBatches) * 100).toFixed(1);
    const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
    const rate = Math.round(((i + 1) * BATCH_SIZE) / (Number(elapsedSec) || 1));
    process.stdout.write(`\r  → Progress: Batch ${i + 1}/${totalBatches} (${progress}%) | Inserted: ${totalInserted.toLocaleString()} new | Speed: ${rate.toLocaleString()} rows/sec | Time: ${elapsedSec}s`);
  }

  console.log("\n\n✅ Batch insertion completed successfully!");

  // Populate existing batch notifications so historical imports don't trigger batch emails
  console.log("\n⚙️  Syncing batch notification checkpoints...");
  await sql`
    INSERT INTO waitlist_notification_batches (batch_number, sent_at)
    SELECT batch_number, NOW()
    FROM generate_series(
      1::BIGINT,
      (SELECT FLOOR(COUNT(*) / 15.0)::BIGINT FROM waitlist_subscribers)
    ) AS batches(batch_number)
    ON CONFLICT (batch_number) DO NOTHING;
  `;
  console.log("  ✓ Batch notification checkpoints updated.");

  // Step 3: Verify and report
  console.log("\n-------------------------------------------------");
  console.log("🔍 Step 3: Verifying final database state...");

  const finalCountRes = await sql`SELECT COUNT(*)::BIGINT AS count FROM waitlist_subscribers;`;
  const finalCount = Number(finalCountRes[0].count);

  const dbSourceCounts = await sql`
    SELECT source, COUNT(*)::BIGINT AS count
    FROM waitlist_subscribers
    GROUP BY source
    ORDER BY count DESC;
  `;

  console.log(`\n📊 Final Database Summary:`);
  console.log(`  Initial count : ${initialCount.toLocaleString()}`);
  console.log(`  Newly inserted: ${totalInserted.toLocaleString()}`);
  console.log(`  Total in DB   : ${finalCount.toLocaleString()}\n`);

  console.log("📋 Database Breakdown by Source:");
  for (const row of dbSourceCounts) {
    console.log(`  • ${String(row.source).padEnd(25)}: ${Number(row.count).toLocaleString().padStart(8)} subscribers`);
  }

  const sampleRows = await sql`
    SELECT id, email, source, created_at
    FROM waitlist_subscribers
    ORDER BY id DESC
    LIMIT 5;
  `;

  console.log("\n🔎 Latest 5 records in database:");
  console.table(sampleRows);
}

main().catch(err => {
  console.error("\n❌ Import error:", err);
  process.exit(1);
});
