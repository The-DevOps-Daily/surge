import LandingPage from "./landing/page";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Ship Your SaaS in Days, Not Months",
  description:
    "Production-ready SaaS starter kit with auth, payments, admin, blog, and more. Built with Next.js, Stripe, and love.",
  path: "/",
});

export default function RootPage() {
  return <LandingPage />;
}
