import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "Support ScamGuards - Donate | ScamGuards Malaysia",
  description:
    "Support ScamGuards Malaysia with a donation. 100% goes to AI costs, hosting, and development. Keep scam protection free for all Malaysians.",
  keywords: ["support scamguards", "donate scamguards", "sumbang scamguards"],
  alternates: {
    canonical: `${SITE_URL}/donate`,
  },
  openGraph: {
    title: "Support ScamGuards Malaysia",
    description:
      "Your donation keeps ScamGuards free for all Malaysians. 100% goes to running costs.",
    url: `${SITE_URL}/donate`,
    type: "website",
  },
};

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
