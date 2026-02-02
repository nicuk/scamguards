// Simple i18n for English/Malay
export type Language = "en" | "ms";

export const translations = {
  en: {
    // Header
    home: "Home",
    search: "Search",
    reportScam: "Report Scam",
    howItWorks: "How It Works",
    checkNow: "Check Now (Free)",
    
    // Hero
    tagline: "AI-Powered Scam Detection",
    heroTitle: "Is This a Scammer?",
    heroDescription: "Paste any phone number, email, or bank account. Our AI instantly checks if it's been reported as a scam.",
    
    // Buttons
    reportNow: "Report a Scammer",
    submitReport: "Submit Report",
    searchButton: "Check with AI",
    
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
    howItWorksDesc: "3 simple steps to check if someone is a scammer",
    step1Title: "Paste",
    step1Desc: "Copy & paste the phone number, email, or bank account you want to check.",
    step2Title: "AI Scans",
    step2Desc: "Our AI searches thousands of scam reports and analyzes patterns instantly.",
    step3Title: "Get Answer",
    step3Desc: "See if it's suspicious, safe, or unknown — with a confidence score.",
    
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
    checkNow: "Semak Sekarang (Percuma)",
    
    // Hero
    tagline: "Pengesanan Penipuan AI",
    heroTitle: "Ini Penipu Ke?",
    heroDescription: "Tampal nombor telefon, emel, atau akaun bank. AI kami semak serta-merta jika ia pernah dilaporkan sebagai penipuan.",
    
    // Buttons
    reportNow: "Lapor Penipu",
    submitReport: "Hantar Laporan",
    searchButton: "Semak dengan AI",
    
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
    howItWorksDesc: "3 langkah mudah untuk semak jika seseorang itu penipu",
    step1Title: "Tampal",
    step1Desc: "Salin & tampal nombor telefon, emel, atau akaun bank yang ingin disemak.",
    step2Title: "AI Imbas",
    step2Desc: "AI kami mencari ribuan laporan penipuan dan analisis corak serta-merta.",
    step3Title: "Dapat Jawapan",
    step3Desc: "Lihat jika ia mencurigakan, selamat, atau tidak diketahui — dengan skor keyakinan.",
    
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
