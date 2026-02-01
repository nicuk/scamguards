import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LanguageProvider } from "@/lib/language-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScamGuard Malaysia - Community Scam Detection",
  description:
    "Check if suspicious details have been reported. Help protect the Malaysian community from scams.",
  keywords: [
    "scam",
    "fraud",
    "malaysia",
    "scam check",
    "phone scam",
    "online scam",
    "tcg scam",
    "one piece cards",
    "gold scam",
    "silver scam",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
