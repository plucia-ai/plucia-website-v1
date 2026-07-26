import { NextResponse } from "next/server";
import { escapeHtml, sendEmail } from "@/lib/email";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactRequest = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  message?: unknown;
};

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactRequest;
    const name = text(body.name, 120);
    const phone = text(body.phone, 50);
    const email = text(body.email, 320).toLowerCase();
    const message = text(body.message, 5000);

    if (!name || !EMAIL_PATTERN.test(email) || !message) {
      return NextResponse.json(
        { error: "Please complete the required fields." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    const to = process.env.CONTACT_TO_EMAIL || "anas@plucia.com";

    if (!apiKey || !from) {
      console.error("RESEND_API_KEY or RESEND_FROM_EMAIL is not configured.");
      return NextResponse.json(
        { error: "Email delivery is not configured yet." },
        { status: 503 }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "Not provided");
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");
    const subjectName = name.replace(/[\r\n]+/g, " ");

    await sendEmail({
      from,
      to: [to],
      replyTo: [email],
      subject: `Plucia website message from ${subjectName}`,
      html: `
        <h2>New Plucia website message</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
      text: [
        "New Plucia website message",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        "",
        message,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact submission failed:", error);
    return NextResponse.json(
      { error: "We couldn't send your message. Please try again." },
      { status: 500 }
    );
  }
}
