import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SaaS App - Your Tagline Here",
  description:
    "A brief description of what your SaaS app does. Beautiful, private, and built for people who care.",
  openGraph: {
    title: "SaaS App - Your Tagline Here",
    description:
      "A brief description of what your SaaS app does. Beautiful, private, and built for people who care.",
    siteName: "SaaS App",
    type: "website",
    images: [{ url: "/og/landing.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS App - Your Tagline Here",
    description:
      "A brief description of what your SaaS app does. Beautiful, private, and built for people who care.",
    images: ["/og/landing.svg"],
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
