import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  emailLayout,
  emailButton,
  emailHeading,
  emailParagraph,
} from "@/lib/email-layout";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    // Rate limiting: 5 attempts per minute per IP
    const ip = getClientIp(req);
    const limiter = rateLimit(`register:${ip}`, { maxAttempts: 5, windowMs: 60_000 });
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    if (process.env.REGISTRATION_ENABLED !== "true") {
      return NextResponse.json(
        { error: "Registration is currently disabled" },
        { status: 403 }
      );
    }

    const { email, password, name } = await req.json();

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Validate password
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Validate name (optional)
    if (name !== undefined && name !== null) {
      if (typeof name !== "string") {
        return NextResponse.json({ error: "Name must be a string" }, { status: 400 });
      }
      if (name.length > 100) {
        return NextResponse.json({ error: "Name must be 100 characters or less" }, { status: 400 });
      }
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    // Welcome email. Fire-and-forget — sendEmail() short-circuits when
    // SMTPFAST_API_KEY is unset and swallows failures so registration succeeds
    // regardless.
    const displayName = name || "there";
    const dashboardUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login`;
    const welcomeHtml = emailLayout(
      [
        emailHeading(`Welcome, ${displayName}.`),
        emailParagraph(
          "Thanks for joining SaaS App. You can start using your account right away.",
        ),
        emailParagraph("If you ever get stuck, just reply to this email."),
        `<div style="margin-top:24px;">${emailButton(dashboardUrl, "Go to dashboard")}</div>`,
      ].join(""),
      {
        preheader: "Welcome to SaaS App — your account is ready.",
        appName: "SaaS App",
      },
    );
    void sendEmail({
      to: email,
      subject: "Welcome to SaaS App",
      html: welcomeHtml,
    });

    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
