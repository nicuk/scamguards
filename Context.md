# ScamGuard Malaysia - Product Specification

## Overview

**ScamGuard** is a community-driven scam detection platform for Malaysia. Users can search identifiers (phone, email, bank account, etc.) to check if they've been reported in scam incidents, and submit reports to help protect others.

**Target Market:** Malaysia (first)  
**Duration:** 3 days to production-ready (9/10)

---

## Core Value Proposition

> "Check if suspicious details have been reported before. Help protect the community by sharing your experience."

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (evidence) |
| AI | OpenAI GPT-4o-mini |
| Deployment | Vercel |

---

## User Flows

### Flow 1: Search

```
User inputs data (phone, email, etc.)
         │
         ▼
System normalizes & searches database
         │
         ▼
LLM analyzes matches & calculates confidence
         │
         ▼
Display result: SUSPICIOUS (78%) / NO INFO / CLEAR
```

### Flow 2: Submit Report

```
User selects scam type
         │
         ▼
User adds data points (phone, email, bank, etc.)
         │
         ▼
User describes incident (optional)
         │
         ▼
User uploads evidence (optional)
         │
         ▼
User confirms accuracy
         │
         ▼
Report saved to database
```

### Flow 3: Dispute

```
Falsely flagged person finds report
         │
         ▼
Submits dispute with reason & contact
         │
         ▼
Report marked as "disputed"
         │
         ▼
Results show disputed status
```

---

## Pages

### 1. Landing (/)
- Hero with clear value proposition
- Primary CTAs: Search, Submit Report
- 3-step "How it works" summary
- Platform stats (reports, searches)
- Trust indicators

### 2. Search (/search)
- Data point type selector (phone, email, bank, etc.)
- Value input with Malaysian format validation
- Add multiple data points
- Disclaimer: "Results show reported information, not confirmed fraud"

### 3. Results (/results)
- Status indicator: SUSPICIOUS / NO KNOWN INFO / CLEAR
- Confidence percentage with breakdown
- Matched data points (masked appropriately)
- Report count and date range
- Disputed status if applicable
- Actions: Search again, Submit report, Dispute

### 4. Submit Report (/submit)
- Scam type selector (Malaysia-specific categories)
- Platform selector (Shopee, Carousell, WhatsApp, etc.)
- Data points input (multiple)
- Description textarea
- Evidence upload (images)
- Accuracy confirmation checkbox

### 5. Dispute (/dispute)
- Report reference input
- Reason for dispute
- Contact email
- Submit button

### 6. How It Works (/how-it-works)
- Step-by-step explanation
- What we do / don't do
- Privacy information
- FAQ

### 7. Disclaimer (/disclaimer)
- Legal disclaimer
- PDPA compliance notice
- User-submitted data notice
- Takedown request process

---

## Scam Types (Malaysia-Focused)

| Code | Display Name |
|------|--------------|
| macau_scam | Macau Scam (Phone Impersonation) |
| love_scam | Love/Romance Scam |
| parcel_scam | Parcel/Delivery Scam |
| job_scam | Job Scam |
| investment_scam | Investment Scam (Forex/Crypto) |
| loan_scam | Loan Scam |
| precious_metals_scam | Gold/Silver Scam |
| ecommerce_scam | E-commerce Scam |
| collectibles_scam | Collectibles Scam (TCG/Figurines) |
| mule_recruitment | Money Mule Recruitment |
| phishing | Phishing/Fake Website |
| other | Other |

---

## Data Point Types

| Code | Display Name | Validation |
|------|--------------|------------|
| phone | Phone Number | Malaysian format (+60) |
| email | Email Address | Email format |
| bank_account | Bank Account | Number + bank name |
| whatsapp | WhatsApp Number | Phone format |
| telegram | Telegram Username | @username |
| ewallet | E-Wallet Account | TNG, GrabPay, Boost |
| social_media | Social Media Profile | URL or username |
| website | Website/URL | URL format |
| crypto_wallet | Crypto Wallet | Wallet address |
| name | Name/Alias | Text |
| company | Company Name | Text |

---

## AI Analysis

The LLM receives:
1. User's input data points
2. Database matches found

The LLM outputs:
```json
{
  "status": "suspicious | no_known_info | clear",
  "confidence": 0-100,
  "summary": "Factual explanation",
  "matched_fields": ["phone", "email"],
  "factors": [
    {"factor": "Phone appeared in 3 reports", "impact": "negative"},
    {"factor": "No verified reports", "impact": "neutral"}
  ]
}
```

---

## Design Principles

### Visual
- Neutral colors (gray/slate/white)
- Red/amber only for risk indicators
- Green for clear status
- Card-based layout
- Clean typography
- Simple icons (Lucide)

### UX
- Assume users are stressed or cautious
- Avoid alarmist language
- Non-accusatory tone throughout
- Clear explanations
- Trustworthy and neutral feel

### Language Guidelines
- "Reported" not "Scammer"
- "Suspicious activity" not "Fraud confirmed"
- "No known reports" not "Safe"
- "Information suggests caution" not "This is a scam"

---

## Trust & Safety Features

### Report Verification
- Optional evidence upload
- Verified badge for reports with evidence
- Verified reports weighted higher in analysis

### Dispute Mechanism
- Anyone can dispute a report
- Disputed reports show badge
- Contact email for resolution

### Data Transparency
- Show report count
- Show date range of reports
- Show scam type distribution
- Explain why result was shown

### Legal Protection
- Clear disclaimers on all results
- PDPA compliance language
- Takedown request process
- Audit trail for investigations

---

## Abuse Prevention

- IP-based rate limiting (no auth required)
- CAPTCHA on submit (optional, add if needed)
- Input validation and sanitization
- Audit logging

---

## Malaysian Localization

### Phone Validation
- Country code: +60
- Mobile: 01X-XXX XXXX
- Normalize: strip spaces, dashes, +60 prefix

### Banks
- Maybank, CIMB, Public Bank, RHB, Hong Leong, AmBank, etc.

### Platforms
- Shopee, Lazada, Carousell, Mudah.my
- WhatsApp, Telegram, Facebook, Instagram
- Touch 'n Go, GrabPay, Boost

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Search response time | <3 seconds |
| Pages functional | 100% |
| Mobile usability | Responsive |
| Legal coverage | Disclaimers + Disputes |
| Architecture score | 9/10 |

---

## 3-Day Roadmap

### Day 1: Core MVP
- Project setup
- All pages functional
- Database integration
- LLM analysis working
- Basic search & submit

### Day 2: Trust Layer
- Evidence upload
- Dispute mechanism
- Search normalization
- Source transparency
- Audit trail

### Day 3: Polish
- Enhanced search (fuzzy, phonetic)
- Confidence breakdown UI
- Seed data
- Mobile optimization
- Performance & edge cases
