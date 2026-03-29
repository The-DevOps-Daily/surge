import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface MonthlyReportData {
  summary: string;
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

  // TODO: Update the from address and email template for your app
  const { error } = await resend.emails.send({
    from: "SaaS App <noreply@your-domain.com>",
    to: email,
    subject: "Your Monthly Report",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0f; color: #f3f4f6;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: bold; margin: 0;">Monthly Report</h1>
          <p style="color: #9ca3af; margin-top: 8px;">Here is your summary for last month</p>
        </div>
        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <p style="color: #f3f4f6;">${data.summary}</p>
        </div>
        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06);">
          <p style="color: #6b7280; font-size: 12px;">You are receiving this because you enabled monthly reports in your settings.</p>
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
