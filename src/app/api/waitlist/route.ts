import { NextResponse } from "next/server";
import { ensureDatabaseSchema, getDatabase } from "@/lib/database";
import { escapeHtml, sendEmail } from "@/lib/email";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WaitlistRequest = {
  email?: unknown;
  source?: unknown;
};

const welcomeFrom = () =>
  process.env.WAITLIST_FROM_EMAIL || "Plucia <support@plucia.com>";

async function sendPendingWelcome(email: string) {
  const sql = getDatabase();
  const claimed = await sql`
    WITH candidate AS (
      SELECT id
      FROM waitlist_subscribers
      WHERE email = ${email}
        AND welcome_sent_at IS NULL
        AND (
          welcome_processing_at IS NULL
          OR welcome_processing_at < NOW() - INTERVAL '10 minutes'
        )
      FOR UPDATE SKIP LOCKED
    )
    UPDATE waitlist_subscribers AS subscribers
    SET welcome_processing_at = NOW()
    FROM candidate
    WHERE subscribers.id = candidate.id
    RETURNING subscribers.id
  `;

  if (!claimed[0]) return;

  const subscriberId = String(claimed[0].id);

  try {
    await sendEmail({
      from: welcomeFrom(),
      to: [email],
      subject: "Welcome to Plucia — you're on the list",
      idempotencyKey: `waitlist-welcome-${subscriberId}`,
      html: `
        <div style="background:#f6f6f6;padding:40px 20px;font-family:Arial,sans-serif;color:#202020">
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:36px">
            <p style="font-size:20px;font-weight:700;margin:0 0 24px">Plucia</p>
            <p style="font-size:17px;line-height:1.65;margin:0 0 18px">Hi there,</p>
            <p style="font-size:17px;line-height:1.65;margin:0 0 18px">
              Thanks for joining us. We're building Plucia to take the busywork out of sales—bringing conversations, follow-ups, and opportunities into one intelligent inbox.
            </p>
            <p style="font-size:17px;line-height:1.65;margin:0 0 18px">
              We're keeping the first release focused and thoughtful. As soon as it's ready, you'll be among the first to know.
            </p>
            <p style="font-size:17px;line-height:1.65;margin:28px 0 0">
              Warmly,<br />The Plucia team
            </p>
          </div>
        </div>
      `,
      text: [
        "Hi there,",
        "",
        "Thanks for joining us. We're building Plucia to take the busywork out of sales—bringing conversations, follow-ups, and opportunities into one intelligent inbox.",
        "",
        "We're keeping the first release focused and thoughtful. As soon as it's ready, you'll be among the first to know.",
        "",
        "Warmly,",
        "The Plucia team",
      ].join("\n"),
    });

    await sql`
      UPDATE waitlist_subscribers
      SET welcome_sent_at = NOW(), welcome_processing_at = NULL
      WHERE id = ${subscriberId}
    `;
  } catch (error) {
    await sql`
      UPDATE waitlist_subscribers
      SET welcome_processing_at = NULL
      WHERE id = ${subscriberId}
    `;
    throw error;
  }
}

async function sendPendingBatchReport() {
  const sql = getDatabase();

  await sql`
    INSERT INTO waitlist_notification_batches (batch_number)
    SELECT batch_number
    FROM generate_series(
      1::BIGINT,
      (SELECT FLOOR(COUNT(*) / 15.0)::BIGINT FROM waitlist_subscribers)
    ) AS batches(batch_number)
    ON CONFLICT (batch_number) DO NOTHING
  `;

  const claimed = await sql`
    WITH candidate AS (
      SELECT batch_number
      FROM waitlist_notification_batches
      WHERE sent_at IS NULL
        AND (
          processing_at IS NULL
          OR processing_at < NOW() - INTERVAL '10 minutes'
        )
      ORDER BY batch_number
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    UPDATE waitlist_notification_batches AS batches
    SET processing_at = NOW()
    FROM candidate
    WHERE batches.batch_number = candidate.batch_number
    RETURNING batches.batch_number
  `;

  if (!claimed[0]) return;

  const batchNumber = Number(claimed[0].batch_number);
  const offset = (batchNumber - 1) * 15;
  const subscribers = await sql`
    SELECT email, source, created_at
    FROM waitlist_subscribers
    ORDER BY created_at ASC, id ASC
    OFFSET ${offset}
    LIMIT 15
  `;

  if (subscribers.length !== 15) {
    await sql`
      UPDATE waitlist_notification_batches
      SET processing_at = NULL
      WHERE batch_number = ${batchNumber}
    `;
    return;
  }

  const reportTo =
    process.env.WAITLIST_REPORT_TO_EMAIL ||
    process.env.CONTACT_TO_EMAIL ||
    "anas@plucia.com";
  const startNumber = offset + 1;
  const endNumber = offset + subscribers.length;
  const rows = subscribers
    .map((subscriber, index) => {
      const email = escapeHtml(String(subscriber.email));
      const source = escapeHtml(String(subscriber.source));
      const joined = new Date(String(subscriber.created_at)).toLocaleString(
        "en-US",
        { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }
      );
      return `<tr>
        <td style="padding:10px;border-bottom:1px solid #e8e8e8">${startNumber + index}</td>
        <td style="padding:10px;border-bottom:1px solid #e8e8e8">${email}</td>
        <td style="padding:10px;border-bottom:1px solid #e8e8e8">${source}</td>
        <td style="padding:10px;border-bottom:1px solid #e8e8e8">${joined} UTC</td>
      </tr>`;
    })
    .join("");
  const plainList = subscribers
    .map(
      (subscriber, index) =>
        `${startNumber + index}. ${String(subscriber.email)} (${String(subscriber.source)})`
    )
    .join("\n");

  try {
    await sendEmail({
      from: welcomeFrom(),
      to: [reportTo],
      subject: `Plucia waitlist reached ${endNumber} subscribers`,
      idempotencyKey: `waitlist-report-${batchNumber}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#202020;max-width:760px;margin:0 auto">
          <h2>15 new people joined the Plucia waitlist</h2>
          <p>The waitlist now has ${endNumber} unique subscribers. Here are subscribers ${startNumber}–${endNumber}.</p>
          <table style="width:100%;border-collapse:collapse;margin-top:24px">
            <thead>
              <tr style="text-align:left;background:#f4f4f4">
                <th style="padding:10px">#</th>
                <th style="padding:10px">Email</th>
                <th style="padding:10px">Source</th>
                <th style="padding:10px">Joined</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `,
      text: [
        "15 new people joined the Plucia waitlist.",
        `The waitlist now has ${endNumber} unique subscribers.`,
        "",
        plainList,
      ].join("\n"),
    });

    await sql`
      UPDATE waitlist_notification_batches
      SET sent_at = NOW(), processing_at = NULL
      WHERE batch_number = ${batchNumber}
    `;
  } catch (error) {
    await sql`
      UPDATE waitlist_notification_batches
      SET processing_at = NULL
      WHERE batch_number = ${batchNumber}
    `;
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WaitlistRequest;
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const source =
      typeof body.source === "string" && body.source.trim()
        ? body.source.trim().slice(0, 100)
        : "website";

    if (!EMAIL_PATTERN.test(email) || email.length > 320) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await ensureDatabaseSchema();
    const sql = getDatabase();
    const inserted = await sql`
      INSERT INTO waitlist_subscribers (email, source)
      VALUES (${email}, ${source})
      ON CONFLICT (email)
      DO NOTHING
      RETURNING id
    `;

    const deliveries = await Promise.allSettled([
      sendPendingWelcome(email),
      sendPendingBatchReport(),
    ]);
    deliveries.forEach((delivery) => {
      if (delivery.status === "rejected") {
        console.error("Waitlist email delivery failed:", delivery.reason);
      }
    });

    return NextResponse.json({
      ok: true,
      alreadySubscribed: inserted.length === 0,
    });
  } catch (error) {
    console.error("Waitlist submission failed:", error);
    return NextResponse.json(
      { error: "We couldn't save your email. Please try again." },
      { status: 500 }
    );
  }
}
