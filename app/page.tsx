"use client";

import Link from "next/link";
import {
  Shield,
  Search,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Gem,
} from "lucide-react";
import { PlatformStats } from "@/components/stats/platform-stats";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

export default function HomePage() {
  const { t, lang } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              {t("tagline")}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {t("heroTitle")}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("heroDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/search">
                  <Search className="mr-2 h-5 w-5" />
                  {t("checkNow")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link href="/submit">
                  <FileText className="mr-2 h-5 w-5" />
                  {t("reportScam")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-12 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <PlatformStats />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("howItWorksTitle")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("howItWorksDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative">
              <div className="absolute -top-4 left-6 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  {t("step1Title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("step1Desc")}
                </p>
              </CardContent>
            </Card>

            <Card className="relative">
              <div className="absolute -top-4 left-6 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {t("step2Title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("step2Desc")}
                </p>
              </CardContent>
            </Card>

            <Card className="relative">
              <div className="absolute -top-4 left-6 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  {t("step3Title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("step3Desc")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Common Scam Types - TCG & Precious Metals FIRST */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t("commonScamsTitle")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("commonScamsDescription")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* TCG & Collectibles - PRIORITY #1 */}
            <Card className="bg-background border-2 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl">
                Hot
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {t("collectiblesScam")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("collectiblesDesc")}</CardDescription>
              </CardContent>
            </Card>

            {/* Gold & Silver - PRIORITY #2 */}
            <Card className="bg-background border-2 border-amber-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs px-2 py-1 rounded-bl">
                Hot
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gem className="h-4 w-4 text-amber-500" />
                  {t("preciousMetalsScam")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("preciousMetalsDesc")}</CardDescription>
              </CardContent>
            </Card>

            {/* E-commerce */}
            <Card className="bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  {t("ecommerceScam")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("ecommerceDesc")}</CardDescription>
              </CardContent>
            </Card>

            {/* Macau Scam */}
            <Card className="bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  {t("macauScam")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("macauDesc")}</CardDescription>
              </CardContent>
            </Card>

            {/* Love Scam */}
            <Card className="bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  {t("loveScam")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("loveDesc")}</CardDescription>
              </CardContent>
            </Card>

            {/* Investment Scam */}
            <Card className="bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  {t("investmentScam")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("investmentDesc")}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Community-Powered Protection
                </h2>
                <p className="text-muted-foreground mb-6">
                  ScamGuard relies on reports from the community. When someone
                  encounters a scam, they can share the details to help protect
                  others.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <span>
                      Neutral, fact-based assessments — not accusations
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <span>
                      Dispute mechanism for those incorrectly reported
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <span>
                      Privacy-focused — sensitive data is masked
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Users className="h-12 w-12 text-primary" />
                  <div>
                    <p className="text-3xl font-bold">Community</p>
                    <p className="text-muted-foreground">Driven Platform</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Together, we can create a safer environment for all Malaysians
                  by sharing information about suspicious activities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {lang === "ms" ? "Jumpa Sesuatu Mencurigakan?" : "Encountered Something Suspicious?"}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {lang === "ms" 
              ? "Laporan anda boleh membantu orang lain dari menjadi mangsa. Kongsi pengalaman anda untuk melindungi masyarakat."
              : "Your report could help prevent someone else from becoming a victim. Share your experience to protect the community."}
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/submit">
              {t("reportNow")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
