// Scam types specific to Malaysia
// TCG and Precious Metals are prioritized first
export const SCAM_TYPES = {
  collectibles_scam: "Collectibles Scam (TCG/Figurines/One Piece/Pokemon)",
  precious_metals_scam: "Gold/Silver/Precious Metals Scam",
  ecommerce_scam: "E-commerce Scam",
  macau_scam: "Macau Scam (Phone Impersonation)",
  love_scam: "Love/Romance Scam",
  investment_scam: "Investment Scam (Forex/Crypto)",
  parcel_scam: "Parcel/Delivery Scam",
  job_scam: "Job Scam",
  loan_scam: "Loan Scam",
  mule_recruitment: "Money Mule Recruitment",
  phishing: "Phishing/Fake Website",
  other: "Other",
} as const;

export type ScamType = keyof typeof SCAM_TYPES;

// Data point types that can be searched/reported
export const DATA_POINT_TYPES = {
  phone: "Phone Number",
  email: "Email Address",
  bank_account: "Bank Account",
  whatsapp: "WhatsApp Number",
  telegram: "Telegram Username",
  ewallet: "E-Wallet Account",
  social_media: "Social Media Profile",
  website: "Website/URL",
  crypto_wallet: "Crypto Wallet",
  name: "Name/Alias",
  company: "Company Name",
} as const;

export type DataPointType = keyof typeof DATA_POINT_TYPES;

// Malaysian banks for bank account reports
export const MALAYSIAN_BANKS = [
  "Maybank",
  "CIMB Bank",
  "Public Bank",
  "RHB Bank",
  "Hong Leong Bank",
  "AmBank",
  "Bank Islam",
  "Bank Rakyat",
  "Affin Bank",
  "Alliance Bank",
  "OCBC Bank",
  "UOB Bank",
  "HSBC Bank",
  "Standard Chartered",
  "Citibank",
  "Other",
] as const;

// Platforms where scams commonly occur
export const PLATFORMS = [
  "WhatsApp",
  "Telegram",
  "Facebook",
  "Instagram",
  "TikTok",
  "Shopee",
  "Lazada",
  "Carousell",
  "Mudah.my",
  "Phone Call",
  "SMS",
  "Email",
  "Website",
  "Other",
] as const;

// E-wallet providers in Malaysia
export const EWALLETS = [
  "Touch 'n Go eWallet",
  "GrabPay",
  "Boost",
  "ShopeePay",
  "BigPay",
  "MAE by Maybank",
  "Other",
] as const;

// Result status types
export const RESULT_STATUS = {
  suspicious: {
    label: "Suspicious",
    description: "Matching reports found in our database",
    color: "destructive",
  },
  no_known_info: {
    label: "No Known Information",
    description: "No matching reports found",
    color: "muted",
  },
  clear: {
    label: "Clear",
    description: "No suspicious patterns detected",
    color: "success",
  },
} as const;

export type ResultStatus = keyof typeof RESULT_STATUS;
