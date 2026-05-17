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
  const appUrl = process.env.NEXTAUTH_URL || "https://example.com";
  return `<!DOCTYPE html>
<html lang="en"><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Unsubscribe</title>
</head>
<body style="margin:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#18181b;-webkit-font-smoothing:antialiased;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;">
  <div style="width:100%;max-width:440px;background:#ffffff;border:1px solid #e9e9eb;border-radius:18px;padding:36px;text-align:center;">
    <div style="display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;background:#f4f4f5;border:1px solid #e9e9eb;margin-bottom:18px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
    </div>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#3f3f46;">${message}</p>
    <a href="${appUrl}" style="display:inline-block;margin-top:24px;padding:10px 20px;border-radius:12px;background:#18181b;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">Go to SaaS App</a>
  </div>
</body></html>`;
}
