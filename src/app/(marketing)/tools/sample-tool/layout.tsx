import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Growth Calculator - Free Tool | SaaS App",
  description:
    "Calculate projected growth with our free interactive tool. Visualize compound growth over time.",
  openGraph: {
    title: "Growth Calculator - Free Tool | SaaS App",
    description:
      "Calculate projected growth with our free interactive tool.",
  },
};

export default function SampleToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
