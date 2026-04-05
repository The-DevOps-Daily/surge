import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHmac } from "crypto";

function generateToken(userId: string): string {
  const secret = process.env.NEXTAUTH_SECRET || "fallback";
  return createHmac("sha256", secret).update(userId).digest("hex").slice(0, 32);
}

export function getUnsubscribeUrl(userId: string): string {
  const token = generateToken(userId);
  const baseUrl = process.env.NEXTAUTH_URL || "https://example.com";
  return `${baseUrl}/api/unsubscribe?id=${userId}&token=${token}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");
  const token = searchParams.get("token");

  if (!userId || !token) {
    return new Response(html("Invalid unsubscribe link."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const expectedToken = generateToken(userId);
  if (token !== expectedToken) {
    return new Response(html("Invalid or expired link."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { emailReports: false },
  });

  return new Response(
    html("You have been unsubscribed from monthly reports. You can re-enable them anytime in Settings."),
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}

function html(message: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Unsubscribe - Surge</title></head>
<body style="font-family:system-ui,sans-serif;max-width:500px;margin:60px auto;padding:20px;text-align:center;background:#0a0a0f;color:#f3f4f6;min-height:100vh;">
  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:40px;">
    <div style="display:inline-block;background:#10b981;border-radius:12px;width:48px;height:48px;line-height:48px;color:white;font-weight:bold;font-size:22px;margin-bottom:20px;">W</div>
    <p style="font-size:16px;line-height:1.6;color:#d1d5db;">${message}</p>
    <a href="https://example.com" style="display:inline-block;margin-top:20px;color:#10b981;text-decoration:none;font-size:14px;">Go to Surge</a>
  </div>
</body></html>`;
}
