"use client";

import { ClipboardPaste, Sparkles, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

export function HowItWorksSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("howItWorksTitle")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("howItWorksDesc")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Step 1: Paste */}
          <Card className="relative">
            <div className="absolute -top-4 left-6 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardPaste className="h-5 w-5 text-primary" />
                {t("step1Title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t("step1Desc")}</p>
            </CardContent>
          </Card>

          {/* Step 2: AI Scans - Highlighted */}
          <Card className="relative border-2 border-blue-500/30 bg-gradient-to-b from-blue-500/5 to-transparent">
            <div className="absolute -top-4 left-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                {t("step2Title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t("step2Desc")}</p>
            </CardContent>
          </Card>

          {/* Step 3: Get Answer */}
          <Card className="relative">
            <div className="absolute -top-4 left-6 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                {t("step3Title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t("step3Desc")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
