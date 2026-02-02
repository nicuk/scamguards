"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, X, Globe, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTranslateHint, setShowTranslateHint] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/search", label: t("search") },
    { href: "/submit", label: t("reportScam") },
    { href: "/how-it-works", label: t("howItWorks") },
  ];

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ms" : "en";
    setLang(newLang);
    
    // Show translation hint when switching away from English
    if (newLang !== "en") {
      setShowTranslateHint(true);
      setTimeout(() => setShowTranslateHint(false), 5000);
    }
  };

  // Auto-hide translate hint
  useEffect(() => {
    if (showTranslateHint) {
      const timer = setTimeout(() => setShowTranslateHint(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showTranslateHint]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">ScamGuard</span>
            <span className="hidden sm:inline text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {t("malaysiaTag")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA + Language Toggle */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border hover:bg-muted transition-colors"
              title={t("selectLanguage")}
            >
              <Globe className="h-4 w-4" />
              <span>{lang === "en" ? "EN" : "BM"}</span>
            </button>
            <Button asChild variant="outline" size="sm">
              <Link href="/search">{t("checkNow")}</Link>
            </Button>
          </div>

          {/* Mobile: Language + Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === "en" ? "EN" : "BM"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild size="sm" className="w-full">
                <Link href="/search">{t("checkNow")}</Link>
              </Button>
            </div>
          </nav>
        )}

        {/* Translation Hint Banner */}
        {showTranslateHint && (
          <div className="absolute top-full left-0 right-0 bg-primary/10 border-b px-4 py-2 text-center animate-in slide-in-from-top duration-300">
            <p className="text-sm flex items-center justify-center gap-2">
              <Languages className="h-4 w-4" />
              <span>
                {lang === "ms" 
                  ? "Untuk terjemahan penuh, guna ciri terjemah pelayar anda (klik kanan → Translate)" 
                  : "For full translation, use your browser's translate feature (right-click → Translate)"}
              </span>
              <button 
                onClick={() => setShowTranslateHint(false)}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
