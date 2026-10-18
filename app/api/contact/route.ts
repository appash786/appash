import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, message, website } = await req.json();

  // honeypot: bots fill this hidden field
  if (website) return NextResponse.json({ ok: true });

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>", // use your own domain later
    to: "you@youremail.com",
    replyTo: email,
    subject: `New enquiry from ${name}`,
    text: message,
  });

  if (error) return NextResponse.json({ error: "Send failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}