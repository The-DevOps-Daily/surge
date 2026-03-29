import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Analytics } from "@/components/analytics";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#10b981",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://your-app.com"),
  title: "SaaS App",
  description: "Production-ready SaaS starter kit with Next.js, Stripe, and auth",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SaaS App",
  },
  openGraph: {
    title: "SaaS App",
    description: "Production-ready SaaS starter kit with Next.js, Stripe, and auth",
    siteName: "SaaS App",
    type: "website",
    images: [{ url: "/og/landing.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS App",
    description: "Production-ready SaaS starter kit with Next.js, Stripe, and auth",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.className} antialiased bg-[#0a0a0f]`}>
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
