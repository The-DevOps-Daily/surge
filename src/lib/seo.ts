import type { Metadata } from "next";

export const SITE_NAME = "Your SaaS App";
export const SITE_URL = process.env.NEXTAUTH_URL || "https://your-app.com";
export const SITE_DESCRIPTION = "Your SaaS description here";

interface SeoOptions {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
}

export function seo(options: SeoOptions): Metadata {
  const {
    title,
    description = SITE_DESCRIPTION,
    path = "",
    ogImage,
    noIndex,
    type = "website",
    publishedTime,
    tags,
  } = options;

  const url = `${SITE_URL}${path}`;
  const image =
    ogImage || `${SITE_URL}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title: `${title} - ${SITE_NAME}`,
    description,
    ...(noIndex && { robots: { index: false, follow: false } }),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: image, width: 1200, height: 630 }],
      ...(publishedTime && { publishedTime }),
      ...(tags && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

// JSON-LD: Organization
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
  };
}

// JSON-LD: Article
export function articleJsonLd(
  title: string,
  description: string,
  date: string,
  author: string,
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: date,
    author: { "@type": "Person", name: author },
    publisher: { "@type": "Organization", name: SITE_NAME },
    url,
  };
}

// JSON-LD: FAQ
export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// JSON-LD: Software Application
export function softwareJsonLd(
  name: string,
  description: string,
  price: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "USD",
    },
  };
}
