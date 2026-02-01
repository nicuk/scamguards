// Simple i18n for English/Malay
export type Language = "en" | "ms";

export const translations = {
  en: {
    // Header
    home: "Home",
    search: "Search",
    reportScam: "Report Scam",
    howItWorks: "How It Works",
    checkNow: "Check Now",
    
    // Hero
    tagline: "Protecting Malaysians from Scams",
    heroTitle: "Check Before You Trust",
    heroDescription: "Search phone numbers, emails, and other details to see if they've been reported in scam incidents. Help protect the community by sharing your experience.",
    
    // Buttons
    reportNow: "Report Now",
    submitReport: "Submit Report",
    searchButton: "Search",
    
    // Common Scams Section
    commonScamsTitle: "Common Scams in Malaysia",
    commonScamsDescription: "Be aware of these common fraud schemes targeting Malaysians",
    
    // Scam Types
    collectiblesScam: "TCG & Collectibles Scam",
    collectiblesDesc: "Fake sellers of One Piece, Pokemon cards, figurines on Carousell/Facebook",
    preciousMetalsScam: "Gold & Silver Scam",
    preciousMetalsDesc: "Fake precious metals dealers, investment schemes, non-delivery",
    macauScam: "Macau Scam",
    macauDesc: "Phone calls impersonating police, bank officers, or court officials",
    loveScam: "Love Scam",
    loveDesc: "Fake romantic relationships to manipulate victims for money",
    investmentScam: "Investment Scam",
    investmentDesc: "Forex, crypto, or other schemes promising unrealistic returns",
    ecommerceScam: "E-commerce Scam",
    ecommerceDesc: "Fake sellers on platforms like Shopee, Lazada, or Carousell",
    
    // How It Works
    howItWorksTitle: "How It Works",
    howItWorksDesc: "ScamGuard helps you make informed decisions by checking community reports",
    step1Title: "Search",
    step1Desc: "Enter a phone number, email, bank account, or other details you want to verify.",
    step2Title: "Analyze",
    step2Desc: "Our system checks community reports and analyzes patterns to assess risk.",
    step3Title: "Decide",
    step3Desc: "Get a clear assessment with confidence level to help you make an informed decision.",
    
    // Submit Page
    submitTitle: "Report a Scam",
    submitDescription: "Help protect others by sharing details about suspicious activity",
    scamType: "Scam Type",
    platform: "Platform",
    description: "Description",
    amountLost: "Amount Lost",
    evidence: "Evidence",
    
    // Results
    suspicious: "Suspicious",
    noKnownInfo: "No Known Information",
    clear: "Clear",
    
    // Footer
    disclaimer: "Disclaimer",
    privacy: "Privacy",
    
    // Misc
    selectLanguage: "Language",
    malaysiaTag: "Malaysia",
  },
  ms: {
    // Header
    home: "Utama",
    search: "Cari",
    reportScam: "Lapor Penipuan",
    howItWorks: "Cara Ia Berfungsi",
    checkNow: "Semak Sekarang",
    
    // Hero
    tagline: "Melindungi Rakyat Malaysia dari Penipuan",
    heroTitle: "Semak Sebelum Percaya",
    heroDescription: "Cari nombor telefon, emel, dan butiran lain untuk melihat jika ia dilaporkan dalam insiden penipuan. Bantu lindungi masyarakat dengan berkongsi pengalaman anda.",
    
    // Buttons
    reportNow: "Lapor Sekarang",
    submitReport: "Hantar Laporan",
    searchButton: "Cari",
    
    // Common Scams Section
    commonScamsTitle: "Penipuan Biasa di Malaysia",
    commonScamsDescription: "Berhati-hati dengan skim penipuan biasa yang menyasarkan rakyat Malaysia",
    
    // Scam Types
    collectiblesScam: "Penipuan TCG & Koleksi",
    collectiblesDesc: "Penjual palsu One Piece, kad Pokemon, figurin di Carousell/Facebook",
    preciousMetalsScam: "Penipuan Emas & Perak",
    preciousMetalsDesc: "Peniaga logam berharga palsu, skim pelaburan, tidak hantar barang",
    macauScam: "Macau Scam",
    macauDesc: "Panggilan telefon menyamar sebagai polis, pegawai bank, atau mahkamah",
    loveScam: "Love Scam",
    loveDesc: "Hubungan romantik palsu untuk manipulasi mangsa untuk wang",
    investmentScam: "Penipuan Pelaburan",
    investmentDesc: "Forex, crypto, atau skim yang menjanjikan pulangan tidak realistik",
    ecommerceScam: "Penipuan E-dagang",
    ecommerceDesc: "Penjual palsu di platform seperti Shopee, Lazada, atau Carousell",
    
    // How It Works
    howItWorksTitle: "Cara Ia Berfungsi",
    howItWorksDesc: "ScamGuard membantu anda membuat keputusan berdasarkan laporan komuniti",
    step1Title: "Cari",
    step1Desc: "Masukkan nombor telefon, emel, akaun bank, atau butiran lain yang ingin disahkan.",
    step2Title: "Analisis",
    step2Desc: "Sistem kami menyemak laporan komuniti dan menganalisis corak untuk menilai risiko.",
    step3Title: "Keputusan",
    step3Desc: "Dapatkan penilaian jelas dengan tahap keyakinan untuk membantu keputusan anda.",
    
    // Submit Page
    submitTitle: "Lapor Penipuan",
    submitDescription: "Bantu lindungi orang lain dengan berkongsi butiran aktiviti mencurigakan",
    scamType: "Jenis Penipuan",
    platform: "Platform",
    description: "Penerangan",
    amountLost: "Jumlah Kerugian",
    evidence: "Bukti",
    
    // Results
    suspicious: "Mencurigakan",
    noKnownInfo: "Tiada Maklumat",
    clear: "Selamat",
    
    // Footer
    disclaimer: "Penafian",
    privacy: "Privasi",
    
    // Misc
    selectLanguage: "Bahasa",
    malaysiaTag: "Malaysia",
  },
} as const;

// Detect user's preferred language
export function detectLanguage(): Language {
  if (typeof window === "undefined") return "en";
  
  // Check localStorage first
  const stored = localStorage.getItem("scamguard-lang");
  if (stored === "en" || stored === "ms") return stored;
  
  // Check browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith("ms") || browserLang.startsWith("my")) {
    return "ms";
  }
  
  return "en";
}

// Save language preference
export function setLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("scamguard-lang", lang);
}

// Get translation
export function t(lang: Language, key: keyof typeof translations.en): string {
  return translations[lang][key] || translations.en[key] || key;
}
