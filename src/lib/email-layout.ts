// Light-friendly transactional email scaffold. Email clients vary wildly in
// dark-mode handling, so we render on a neutral light surface that reads well
// in both modes (Gmail/Apple Mail invert reliably, Outlook does not).
//
// All inline styles — no <style> tags, no class names — because email rendering
// is the worst place to assume CSS works.

export interface EmailLayoutOptions {
  preheader?: string; // hidden preview text shown after the subject in inboxes
  appName?: string;
  appUrl?: string;
  footer?: string;
  unsubscribeUrl?: string;
}

export function emailLayout(
  bodyHtml: string,
  {
    preheader = "",
    appName = "SaaS App",
    appUrl = process.env.NEXTAUTH_URL || "https://example.com",
    footer,
    unsubscribeUrl,
  }: EmailLayoutOptions = {},
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${appName}</title>
</head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#18181b;-webkit-font-smoothing:antialiased;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#fafafa;">${preheader}</div>` : ""}
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fafafa;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;">
          <tr>
            <td style="padding:0 0 24px 0;">
              <a href="${appUrl}" style="display:inline-flex;align-items:center;gap:10px;text-decoration:none;color:#18181b;">
                <span style="display:inline-block;width:32px;height:32px;border-radius:10px;background:#18181b;color:#ffffff;text-align:center;line-height:32px;font-weight:600;font-size:14px;font-family:-apple-system,sans-serif;">${appName.charAt(0).toUpperCase()}</span>
                <span style="font-size:15px;font-weight:600;letter-spacing:-0.005em;">${appName}</span>
              </a>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border:1px solid #e9e9eb;border-radius:18px;padding:32px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 8px 0 8px;text-align:center;color:#71717a;font-size:12px;line-height:18px;">
              ${footer ? `<div style="margin-bottom:10px;">${footer}</div>` : ""}
              <div>
                <a href="${appUrl}" style="color:#71717a;text-decoration:none;">${appUrl.replace(/^https?:\/\//, "")}</a>
                ${unsubscribeUrl ? ` · <a href="${unsubscribeUrl}" style="color:#71717a;text-decoration:underline;">Unsubscribe</a>` : ""}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr><td align="center" style="border-radius:12px;background:#18181b;">
    <a href="${href}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${label}</a>
  </td></tr></table>`;
}

export function emailHeading(text: string): string {
  return `<h1 style="margin:0 0 16px 0;font-size:22px;font-weight:600;letter-spacing:-0.01em;color:#18181b;line-height:1.3;">${text}</h1>`;
}

export function emailParagraph(text: string): string {
  return `<p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#3f3f46;">${text}</p>`;
}
