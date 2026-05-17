import { getUnsubscribeUrl } from "@/app/api/unsubscribe/route";
import {
  emailLayout,
  emailButton,
  emailHeading,
  emailParagraph,
} from "@/lib/email-layout";

const SMTPFAST_BASE_URL = (
  process.env.SMTPFAST_API_URL || "https://smtpfa.st"
).replace(/\/$/, "");

interface SendEmailArgs {
  to: string | string[];
  subject: string;
  html: string;
  headers?: Record<string, string>;
}

/**
 * Single send entry point. Wraps three things every caller would otherwise
 * have to repeat:
 *   1. Short-circuits when SMTPFAST_API_KEY is unset (local dev / tests).
 *   2. Posts to smtpfa.st's REST API (no SDK dep — keeps the bundle lean).
 *   3. Catches and logs so an email failure never 500s the request that
 *      triggered it. Transactional email is fire-and-forget for the caller.
 *
 * To use a different provider, replace this function. Every send in the kit
 * goes through it.
 *
 * Returns { sent: boolean } so callers can branch on success when they care
 * (most don't).
 */
export async function sendEmail({
  to,
  subject,
  html,
  headers,
}: SendEmailArgs): Promise<{ sent: boolean }> {
  const apiKey = process.env.SMTPFAST_API_KEY;
  if (!apiKey) {
    console.log("[email] SMTPFAST_API_KEY not set, skipping send");
    return { sent: false };
  }
  try {
    const res = await fetch(`${SMTPFAST_BASE_URL}/api/v1/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from:
          process.env.SMTPFAST_FROM_EMAIL ||
          "SaaS App <noreply@example.com>",
        to,
        subject,
        html,
        ...(headers ? { headers } : {}),
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(
        `[email] smtpfa.st send failed: ${res.status} ${res.statusText} ${body.slice(0, 200)}`,
      );
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.error("[email] send threw:", err);
    return { sent: false };
  }
}

interface MonthlyReportData {
  userId: string;
  netWorth: number;
  change: number;
  assets: number;
  liabilities: number;
  currency: string;
}

export async function sendMonthlyReport(
  email: string,
  data: MonthlyReportData,
) {
  const positive = data.change >= 0;
  const changePrefix = positive ? "+" : "";
  const fmt = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: data.currency || "EUR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formattedNetWorth = fmt(data.netWorth);
  const formattedChange = fmt(Math.abs(data.change));
  const unsubscribeUrl = getUnsubscribeUrl(data.userId);
  const dashboardUrl = `${process.env.NEXTAUTH_URL || "https://example.com"}/dashboard`;

  const changeColor = positive ? "#16a34a" : "#dc2626";
  const changeBg = positive
    ? "rgba(22,163,74,0.10)"
    : "rgba(220,38,38,0.08)";

  const body = [
    emailHeading("Your monthly summary"),
    emailParagraph(
      "Here's where your finances landed at the end of the month.",
    ),
    `<div style="margin:24px 0;padding:20px;border:1px solid #e9e9eb;border-radius:14px;background:#fafafa;">
      <div style="font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#71717a;font-weight:500;">Net worth</div>
      <div style="margin-top:8px;font-size:36px;font-weight:600;letter-spacing:-0.02em;color:#18181b;line-height:1.1;">${formattedNetWorth}</div>
      <div style="margin-top:10px;display:inline-block;padding:4px 10px;border-radius:9999px;background:${changeBg};font-size:13px;font-weight:600;color:${changeColor};">${changePrefix}${formattedChange} vs last month</div>
    </div>`,
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 24px 0;">
      <tr>
        <td style="width:50%;padding-right:6px;vertical-align:top;">
          <div style="border:1px solid #e9e9eb;border-radius:12px;padding:14px 16px;">
            <div style="font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#71717a;font-weight:500;">Assets</div>
            <div style="margin-top:6px;font-size:18px;font-weight:600;color:#18181b;">${fmt(data.assets)}</div>
          </div>
        </td>
        <td style="width:50%;padding-left:6px;vertical-align:top;">
          <div style="border:1px solid #e9e9eb;border-radius:12px;padding:14px 16px;">
            <div style="font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#71717a;font-weight:500;">Liabilities</div>
            <div style="margin-top:6px;font-size:18px;font-weight:600;color:#18181b;">${fmt(data.liabilities)}</div>
          </div>
        </td>
      </tr>
    </table>`,
    `<div style="margin-top:8px;">${emailButton(dashboardUrl, "Open dashboard")}</div>`,
  ].join("");

  const result = await sendEmail({
    to: email,
    subject: `Monthly summary · ${formattedNetWorth}`,
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
    html: emailLayout(body, {
      preheader: `Net worth: ${formattedNetWorth} (${changePrefix}${formattedChange})`,
      appName: "SaaS App",
      footer:
        "You're receiving this because monthly reports are on in settings.",
      unsubscribeUrl,
    }),
  });

  return result.sent ? { success: true } : null;
}
