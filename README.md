# ScamGuards Malaysia 🛡️

[![Live Site](https://img.shields.io/badge/Live-scamguards.app-blue)](https://scamguards.app)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nicuk/scamguards)
[![License: Elastic-2.0](https://img.shields.io/badge/License-Elastic--2.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

> **Malaysians lost RM2.77 billion to scams in 2025.** ScamGuards is a free, AI-powered platform that lets anyone check if a phone number, email, or bank account has been reported as a scam — in 10 seconds.

**🔗 Live:** [scamguards.app](https://scamguards.app)

---

## Why This Exists

I got scammed. I was buying in a WhatsApp group called "COZ on One Piece" — a community for One Piece TCG card collectors. I thought the group was safe because they claimed to filter out scammers. Turns out, they don't. I paid. Nothing arrived. The seller vanished.

So I built ScamGuards — so no one else has to learn the hard way.

---

## What It Does

| For Buyers | For Victims |
|------------|-------------|
| Paste a phone number, email, or bank account | Report the scammer's details |
| AI checks thousands of community reports | AI extracts identifiers from your story |
| Get a risk level + confidence score in seconds | Your report warns the next person |

**100% free. No sign-up. No ads.**

---

## Features

### Core Platform
- **AI-Powered Search** — Paste any identifier, AI searches reports and returns risk assessment with confidence score
- **Smart Report** — Paste your whole scam story, AI extracts phone numbers, bank accounts, emails automatically
- **Multi-Scammer Detection** — AI identifies multiple scammers in a single narrative and creates separate reports
- **Duplicate Detection** — Smart merge prevents duplicate entries while incrementing report counts
- **Dispute System** — Anyone incorrectly reported can submit a dispute

### Content & SEO
- **6 Scam Type Pages** — Macau scam, love scam, investment scam, TCG scam, e-commerce scam, gold scam — each with real CCID/PDRM 2024 statistics
- **3 Blog Guides** — "How to Spot a TCG Scam", "What to Do If Scammed on WhatsApp", "10 Rules to Stay Safe"
- **Structured Data** — JSON-LD schemas: Organization, WebSite, SearchAction, FAQ, HowTo, Article, Breadcrumb
- **Bilingual UI** — English + Bahasa Malaysia with browser auto-detect

### Donations
- **Stripe Payment Link** — Users can support the project with any amount (min RM5)
- No server-side payment code — Stripe handles everything

### SEO / AEO / GEO
- **SEO (8.5/10)** — Per-page meta, canonical URLs, OpenGraph, Twitter cards, auto-generated OG images, comprehensive sitemap (18 URLs)
- **AEO (7.5/10)** — FAQ schema on 8+ pages, HowTo schema, SearchAction schema, conversational content
- **GEO (8/10)** — Real PDRM/CCID statistics with source citations, definitive answer blocks, external authority links
- **Malaysia-specific (9/10)** — geo.region, hreflang en-MY + ms-MY, Malaysian bank names, local scam types, MYR amounts

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  Search │ Report │ Dispute │ Admin │ Blog │ Scam Pages │ Donate │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE (Edge)                            │
│  Rate Limiting • IP Cooldowns • Auto-Ban • Request Validation    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                 │
│  /search │ /submit │ /dispute │ /extract │ /analyze-report       │
│  /stats  │ /admin/check-access                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────────────┐
│   SUPABASE (PostgreSQL) │   │   AI LAYER (Qwen / DashScope)   │
│  • Reports + Data Points│   │  • Search Detective (extraction) │
│  • RLS on all tables    │   │  • Report Analyst (multi-scam)   │
│  • Materialized Views   │   │  • Smart Paste (auto-parse)      │
│  • Full-text + Fuzzy    │   │  • Confidence scoring            │
└─────────────────────────┘   └─────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | Next.js 14 (App Router) | SSG for content pages, edge-ready API |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS + shadcn/ui | Rapid, consistent UI |
| Database | Supabase (PostgreSQL) | RLS, full-text search, storage |
| AI | Qwen via DashScope | Cost-effective, fast inference |
| Analytics | Google Analytics 4 | Traffic tracking |
| Payments | Stripe Payment Links | Zero server-side code |
| Deployment | Vercel | Edge functions, auto-scaling |

---

## Project Structure

```
scamguard/
├── app/
│   ├── api/
│   │   ├── search/            # Fuzzy + exact + full-text search
│   │   ├── submit/            # Report submission with duplicate detection
│   │   ├── dispute/           # Challenge reports
│   │   ├── extract/           # AI data point extraction
│   │   ├── analyze-report/    # Multi-scammer AI analysis
│   │   ├── stats/             # Platform statistics
│   │   └── admin/             # Protected admin endpoints
│   ├── admin/                 # Login + dashboard
│   ├── blog/                  # Blog listing + [slug] articles
│   ├── scams/                 # Scam types listing + [slug] pages
│   ├── donate/                # Donation page + thank-you
│   ├── search/                # Search interface
│   ├── submit/                # Smart Report paste
│   ├── results/               # Search results display
│   ├── how-it-works/          # Dual-path how it works
│   ├── disclaimer/            # Legal
│   ├── dispute/               # Dispute form
│   ├── sitemap.ts             # Dynamic sitemap (18 URLs)
│   └── robots.ts              # Robots.txt
├── components/
│   ├── home/                  # Hero, HowItWorks, FounderStory, ScamTypes, Trust, CTA
│   ├── layout/                # Header + Footer (with donate link)
│   ├── search/                # SmartSearchPaste
│   ├── stats/                 # Platform stats display
│   ├── ui/                    # shadcn/ui components
│   └── analytics.tsx          # Google Analytics
├── lib/
│   ├── ai/                    # AI analysis (search + report)
│   ├── supabase/              # Client (browser + server)
│   ├── blog-data.ts           # Blog content (3 articles)
│   ├── scam-data.ts           # Scam type content (6 types + stats)
│   ├── seo-config.ts          # Centralized SEO config + JSON-LD generators
│   ├── i18n.ts                # English + Malay translations
│   └── language-context.tsx   # Client-side language switching
├── middleware.ts              # Rate limiting, abuse prevention
└── public/
    └── manifest.json          # PWA manifest
```

---

## Security

```
Layer 1: Middleware (Edge)
├── IP-based rate limiting (60/hr search, 5/hr submit)
├── Submission cooldowns (60s between reports)
├── Auto-ban after threshold (20 submissions → 24hr ban)
└── Request validation

Layer 2: API Routes
├── Input sanitization
├── Type validation
└── Error boundary handling

Layer 3: Database (Supabase)
├── Row Level Security (RLS) on all tables
├── Function search_path hardening
├── Prepared statements (no SQL injection)
└── Audit logging

Layer 4: Admin Access
├── Supabase Auth (email/password)
├── Environment-based whitelist
└── Session management
```

---

## Malaysia-Specific

- **Phone formats:** `01X-XXXXXXX` with carrier detection
- **Banks:** Maybank, CIMB, Public Bank, RHB, Hong Leong, Bank Islam, AmBank
- **E-Wallets:** Touch 'n Go, GrabPay, Boost, ShopeePay
- **Scam types:** Macau scam, love scam, TCG/collectibles, gold/silver, investment, e-commerce
- **Statistics:** Real CCID/PDRM 2024 data on every scam page
- **Currency:** MYR with RM formatting
- **Languages:** English + Bahasa Malaysia
- **Compliance:** PDPA 2010

---

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- DashScope API key (Alibaba Cloud)

### Quick Start

```bash
git clone https://github.com/nicuk/scamguards.git
cd scamguards
npm install
cp .env.example .env.local
# Edit .env.local with your keys
npm run dev
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `DASHSCOPE_API_KEY` | Yes | Alibaba Cloud DashScope key |
| `ADMIN_EMAILS` | Yes | Comma-separated admin emails |
| `NEXT_PUBLIC_SITE_URL` | Yes | Production URL (https://scamguards.app) |
| `NEXT_PUBLIC_STRIPE_DONATE_LINK` | No | Stripe Payment Link for donations |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 4 measurement ID |
| `GOOGLE_SITE_VERIFICATION` | No | Google Search Console verification |
| `BING_SITE_VERIFICATION` | No | Bing Webmaster Tools verification |

### Database Setup

Run the SQL migrations in order in the Supabase SQL Editor:

1. `supabase/FULL_SCHEMA.sql`
2. `supabase/migrations/004_duplicate_detection.sql`
3. Create storage bucket: `evidence` (public)

---

## National Scam Statistics

Data displayed on the site, sourced from PDRM/CCID and the Home Ministry:

| Year | Cases | Losses | Source |
|------|-------|--------|--------|
| 2023 | — | RM1.28 billion | Home Ministry |
| 2024 | 67,735 | RM1.57 billion | CCID |
| 2025 | — | RM2.77 billion (+76%) | Home Ministry |
| **3-year total** | — | **RM5.62 billion** | — |

Top scam types by losses (2024): Investment (RM1.37B), Telecom/Macau (RM715.7M), E-finance (RM458.1M), E-commerce (RM123.7M), Love (RM43.7M).

---

## Support

ScamGuards is a free passion project. If it helped you, consider:

- **Donating:** [scamguards.app/donate](https://scamguards.app/donate)
- **Reporting:** Share scammer details to protect others
- **Sharing:** Tell someone about ScamGuards before they pay a stranger

---

## License

[Elastic License 2.0](LICENSE) — Free to use, modify, and self-host. Commercial SaaS requires separate license.

---

<p align="center">
  <strong>Protecting Malaysians from scams, one check at a time.</strong><br>
  <a href="https://scamguards.app">scamguards.app</a>
</p>
