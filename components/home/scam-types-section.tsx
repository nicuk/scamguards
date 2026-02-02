"use client";

import { AlertTriangle, Sparkles, Gem } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

export function ScamTypesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("commonScamsTitle")}</h2>
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
  );
}
