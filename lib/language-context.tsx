"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, detectLanguage, setLanguage as saveLanguage, translations } from "./i18n";

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const detectedLang = detectLanguage();
    setLangState(detectedLang);
    setMounted(true);
    
    // Update HTML lang attribute for browser translation support
    document.documentElement.lang = detectedLang === "ms" ? "ms-MY" : "en-MY";
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    saveLanguage(newLang);
    
    // Update HTML lang attribute - this triggers browser to offer translation
    document.documentElement.lang = newLang === "ms" ? "ms-MY" : "en-MY";
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[lang][key] || translations.en[key] || key;
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ lang: "en", setLang, t: (key) => translations.en[key] || key }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
