import { Resend } from "resend";
import { getUnsubscribeUrl } from "@/app/api/unsubscribe/route";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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
  data: MonthlyReportData
) {
  if (!resend) {
    console.log("RESEND_API_KEY not configured, skipping email send");
    return null;
  }

  const changePrefix = data.change >= 0 ? "+" : "";
  const fmt = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: data.currency || "EUR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formattedNetWorth = fmt(data.netWorth);
  const formattedChange = fmt(Math.abs(data.change));
  const unsubscribeUrl = getUnsubscribeUrl(data.userId);

  const { error } = await resend.emails.send({
    from: "Surge <noreply@example.com>",
    to: email,
    subject: `Your Monthly Net Worth Report - ${formattedNetWorth}`,
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0f; color: #f3f4f6;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display:inline-block;background:#10b981;border-radius:12px;width:40px;height:40px;line-height:40px;color:white;font-weight:bold;font-size:18px;margin-bottom:12px;">W</div>
          <h1 style="font-size: 24px; font-weight: bold; margin: 0;">Monthly Net Worth Report</h1>
          <p style="color: #9ca3af; margin-top: 8px;">Here is your financial summary for last month</p>
        </div>
        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0 0 8px;">Net Worth</p>
          <p style="font-size: 36px; font-weight: bold; color: #10b981; margin: 0;">${formattedNetWorth}</p>
          <p style="font-size: 14px; color: ${data.change >= 0 ? "#10b981" : "#ef4444"}; margin-top: 8px;">
            ${changePrefix}${formattedChange} from last month
          </p>
        </div>
        <div style="display: flex; gap: 16px;">
          <div style="flex: 1; background: rgba(255,255,255,0.04); border-radius: 12px; padding: 16px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Total Assets</p>
            <p style="font-size: 20px; font-weight: 600; color: #10b981; margin: 4px 0 0;">${fmt(data.assets)}</p>
          </div>
          <div style="flex: 1; background: rgba(255,255,255,0.04); border-radius: 12px; padding: 16px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Total Liabilities</p>
            <p style="font-size: 20px; font-weight: 600; color: #ef4444; margin: 4px 0 0;">${fmt(data.liabilities)}</p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 32px;">
          <a href="${process.env.NEXTAUTH_URL || "https://example.com"}/dashboard" style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 10px 24px; border-radius: 10px; font-weight: 600; font-size: 14px;">View Dashboard</a>
        </div>
        <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06);">
          <p style="color: #6b7280; font-size: 11px; margin: 0;">
            You are receiving this because you enabled monthly reports in your Surge settings.
          </p>
          <p style="margin-top: 8px;">
            <a href="${unsubscribeUrl}" style="color: #6b7280; font-size: 11px; text-decoration: underline;">Unsubscribe from monthly reports</a>
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("Failed to send monthly report email:", error);
    throw error;
  }

  return { success: true };
}
