import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const OG_BLOG_DIR = path.join(process.cwd(), "public/og/blog");
const OG_DIR = path.join(process.cwd(), "public/og");

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length > maxCharsPerLine) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + " " + word : word;
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

function generateOGSVG(title: string, subtitle: string, footer: string = "networthtracker.app"): string {
  const titleLines = wrapText(title, 35);
  const titleY = titleLines.length === 1 ? 280 : 240;

  const titleElements = titleLines
    .map(
      (line, i) =>
        `<text x="100" y="${titleY + i * 60}" fill="#ffffff" font-size="48" font-family="system-ui, -apple-system, sans-serif" font-weight="bold">${escapeXml(line)}</text>`
    )
    .join("\n    ");

  const subtitleY = titleY + titleLines.length * 60 + 20;

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0a0a0f"/>
        <stop offset="100%" style="stop-color:#111118"/>
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#10b981"/>
        <stop offset="100%" style="stop-color:#14b8a6"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect x="0" y="0" width="6" height="630" fill="url(#accent)"/>
    <rect x="100" y="${subtitleY + 40}" width="80" height="3" fill="#10b981" rx="1.5"/>
    ${titleElements}
    <text x="100" y="${subtitleY}" fill="#10b981" font-size="22" font-family="system-ui, -apple-system, sans-serif">${escapeXml(subtitle)}</text>
    <rect x="80" y="540" width="40" height="40" rx="8" fill="#10b981"/>
    <text x="92" y="567" fill="white" font-size="16" font-family="system-ui, -apple-system, sans-serif" font-weight="bold">N</text>
    <text x="132" y="565" fill="#6b7280" font-size="18" font-family="system-ui, -apple-system, sans-serif">${escapeXml(footer)}</text>
  </svg>`;
}

// Ensure directories exist
if (!fs.existsSync(OG_BLOG_DIR)) {
  fs.mkdirSync(OG_BLOG_DIR, { recursive: true });
}

// Generate blog post OG images
if (fs.existsSync(BLOG_DIR)) {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  for (const filename of files) {
    const slug = filename.replace(/\.md$/, "");
    const filePath = path.join(BLOG_DIR, filename);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContents);

    const svg = generateOGSVG(
      data.title || slug,
      data.author || "Net Worth Tracker Team",
      "networthtracker.app/blog"
    );

    fs.writeFileSync(path.join(OG_BLOG_DIR, `${slug}.svg`), svg);
    console.log(`Generated: public/og/blog/${slug}.svg`);
  }
}

// Generate marketing OG images
const landingSVG = generateOGSVG(
  "Track Your Wealth, Not Your Worries",
  "The smart way to monitor your net worth and financial independence journey."
);
fs.writeFileSync(path.join(OG_DIR, "landing.svg"), landingSVG);
console.log("Generated: public/og/landing.svg");

const pricingSVG = generateOGSVG(
  "Simple Pricing for Everyone",
  "Start free, upgrade when you are ready. No hidden fees."
);
fs.writeFileSync(path.join(OG_DIR, "pricing.svg"), pricingSVG);
console.log("Generated: public/og/pricing.svg");

console.log("\nDone! All OG images generated as SVG files.");
