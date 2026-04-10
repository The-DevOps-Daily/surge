import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "SaaS App - Your Tagline Here",
  description:
    "A brief description of what your SaaS app does. Beautiful, private, and built for people who care.",
  path: "/landing",
});

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
