import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  emailLayout,
  emailButton,
  emailHeading,
  emailParagraph,
} from "@/lib/email-layout";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limiter = rateLimit(`forgot-password:${ip}`, {
    maxAttempts: 5,
    windowMs: 60 * 60_000,
  });
  if (!limiter.success) {
    return NextResponse.json({ success: true });
  }

  const { email } = await req.json();

  // Always return success to avoid revealing whether an account exists
  if (!email) {
    return NextResponse.json({ success: true });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const token = randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "https://example.com";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    const html = emailLayout(
      [
        emailHeading("Reset your password"),
        emailParagraph(
          "Someone requested a password reset for your account. Click the button below to choose a new password. This link expires in 1 hour.",
        ),
        `<div style="margin:24px 0;">${emailButton(resetUrl, "Reset password")}</div>`,
        emailParagraph(
          "If you didn't request this, you can safely ignore this email — your password won't change.",
        ),
      ].join(""),
      {
        preheader: "Reset your SaaS App password.",
        appName: "SaaS App",
      },
    );

    // sendEmail short-circuits when SMTPFAST_API_KEY is unset; we still want to
    // burn the reset token / set expiry above so the token table doesn't grow.
    await sendEmail({ to: email, subject: "Reset your password", html });
  }

  return NextResponse.json({ success: true });
}
