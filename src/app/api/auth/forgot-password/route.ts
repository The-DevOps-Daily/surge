import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

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

  if (user && process.env.RESEND_API_KEY) {
    const token = randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "https://example.com";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "Surge <noreply@example.com>",
        to: [email],
        subject: "Reset your password",
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; background: #10b981; border-radius: 12px; width: 48px; height: 48px; line-height: 48px; color: white; font-weight: bold; font-size: 22px;">W</div>
            </div>
            <h1 style="font-size: 24px; color: #111; margin-bottom: 12px;">Reset your password</h1>
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 24px;">
              Someone requested a password reset for your Surge account. Click the button below to set a new password. This link expires in 1 hour.
            </p>
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${resetUrl}" style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 15px;">Reset Password</a>
            </div>
            <p style="font-size: 13px; color: #999; text-align: center;">
              If you did not request this, you can safely ignore this email.
            </p>
          </div>
        `,
      }),
    }).catch((err) => console.error("[forgot-password] Failed to send email:", err));
  }

  return NextResponse.json({ success: true });
}
