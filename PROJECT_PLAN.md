# ScamGuard Malaysia - Project Plan

## Project Overview

**Goal:** Build a community-driven scam detection platform for Malaysia  
**Duration:** 3 days  
**Target Score:** 9/10 production-ready

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        SCAMGUARD                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   SEARCH     │  │   SUBMIT     │  │   DISPUTE    │          │
│  │   Flow       │  │   Flow       │  │   Flow       │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         ▼                 ▼                 ▼                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    API LAYER                            │   │
│  │  /api/search  │  /api/submit  │  /api/dispute           │   │
│  └─────────────────────────┬───────────────────────────────┘   │
│                            │                                    │
│         ┌──────────────────┼──────────────────┐                │
│         ▼                  ▼                  ▼                │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐           │
│  │  SUPABASE  │    │  OPENAI    │    │  STORAGE   │           │
│  │  Database  │    │  Analysis  │    │  Evidence  │           │
│  └────────────┘    └────────────┘    └────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| AI | OpenAI GPT-4o-mini |
| Deployment | Vercel |

---

## Database Schema

```sql
-- reports: User-submitted scam reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scam_type TEXT NOT NULL,
  description TEXT,
  platform TEXT,
  evidence_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_disputed BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' -- 'active', 'under_review', 'removed'
);

-- data_points: Searchable identifiers linked to reports
CREATE TABLE data_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'phone', 'email', 'bank_account', etc.
  value TEXT NOT NULL,
  normalized_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- disputes: Challenges to reports
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' -- 'pending', 'resolved', 'rejected'
);

-- audit_logs: Action tracking
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action TEXT NOT NULL, -- 'search', 'submit', 'dispute'
  ip_hash TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Indexes for search performance
CREATE INDEX idx_data_points_normalized ON data_points(normalized_value);
CREATE INDEX idx_data_points_type ON data_points(type);
CREATE INDEX idx_reports_scam_type ON reports(scam_type);
CREATE INDEX idx_reports_status ON reports(status);
```

---

## Scam Types (Malaysia-Focused)

```typescript
export const SCAM_TYPES = {
  macau_scam: 'Macau Scam (Phone Impersonation)',
  love_scam: 'Love/Romance Scam',
  parcel_scam: 'Parcel/Delivery Scam',
  job_scam: 'Job Scam',
  investment_scam: 'Investment Scam (Forex/Crypto)',
  loan_scam: 'Loan Scam',
  precious_metals_scam: 'Gold/Silver Scam',
  ecommerce_scam: 'E-commerce Scam',
  collectibles_scam: 'Collectibles Scam (TCG/Figurines)',
  mule_recruitment: 'Money Mule Recruitment',
  phishing: 'Phishing/Fake Website',
  other: 'Other'
} as const;
```

---

## Data Point Types

```typescript
export const DATA_POINT_TYPES = {
  phone: 'Phone Number',
  email: 'Email Address',
  bank_account: 'Bank Account',
  whatsapp: 'WhatsApp Number',
  telegram: 'Telegram Username',
  ewallet: 'E-Wallet Account',
  social_media: 'Social Media Profile',
  website: 'Website/URL',
  crypto_wallet: 'Crypto Wallet',
  name: 'Name/Alias',
  company: 'Company Name'
} as const;
```

---

## Folder Structure

```
scamguard/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── search/
│   │   └── page.tsx            # Search form
│   ├── results/
│   │   └── page.tsx            # Results display
│   ├── submit/
│   │   └── page.tsx            # Report submission
│   ├── dispute/
│   │   └── page.tsx            # Dispute form
│   ├── how-it-works/
│   │   └── page.tsx            # Explanation page
│   ├── disclaimer/
│   │   └── page.tsx            # Legal disclaimer
│   └── api/
│       ├── search/
│       │   └── route.ts        # Search endpoint
│       ├── submit/
│       │   └── route.ts        # Submit endpoint
│       └── dispute/
│           └── route.ts        # Dispute endpoint
├── components/
│   ├── ui/                     # shadcn components
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── page-wrapper.tsx
│   ├── search/
│   │   ├── search-form.tsx
│   │   └── data-point-input.tsx
│   ├── results/
│   │   ├── result-card.tsx
│   │   ├── confidence-indicator.tsx
│   │   └── match-list.tsx
│   └── submit/
│       ├── report-form.tsx
│       ├── scam-type-select.tsx
│       └── evidence-upload.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── types.ts            # Database types
│   ├── openai/
│   │   └── analyze.ts          # LLM analysis
│   ├── utils/
│   │   ├── normalize.ts        # Data normalization
│   │   └── validation.ts       # Input validation
│   └── constants.ts            # Scam types, data types
├── public/
│   └── images/
├── .env.local                  # Environment variables
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

# TASK TREE

## DAY 1: Core MVP

### 1.0 Project Setup
```
1.0 Project Setup
├── 1.1 Initialize Next.js project
│   ├── [1.1.1] Create Next.js app with TypeScript
│   ├── [1.1.2] Configure Tailwind CSS
│   └── [1.1.3] Install dependencies
├── 1.2 Setup shadcn/ui
│   ├── [1.2.1] Initialize shadcn
│   └── [1.2.2] Add core components (Button, Input, Card, etc.)
├── 1.3 Setup Supabase
│   ├── [1.3.1] Create Supabase project
│   ├── [1.3.2] Create database tables
│   ├── [1.3.3] Setup client configuration
│   └── [1.3.4] Add environment variables
└── 1.4 Setup OpenAI
    ├── [1.4.1] Add OpenAI package
    └── [1.4.2] Create analysis function
```

### 2.0 Design System & Layout
```
2.0 Design System
├── 2.1 Configure theme
│   ├── [2.1.1] Define color palette (neutral, trust-focused)
│   └── [2.1.2] Configure typography
├── 2.2 Create layout components
│   ├── [2.2.1] Header with navigation
│   ├── [2.2.2] Footer with links
│   └── [2.2.3] Page wrapper component
└── 2.3 Create root layout
    └── [2.3.1] Apply layout to app
```

### 3.0 Landing Page
```
3.0 Landing Page (/)
├── [3.0.1] Hero section with value proposition
├── [3.0.2] Primary CTAs (Search, Report)
├── [3.0.3] How it works summary (3 steps)
├── [3.0.4] Trust indicators
└── [3.0.5] Responsive styling
```

### 4.0 Search Page
```
4.0 Search Page (/search)
├── 4.1 Search form component
│   ├── [4.1.1] Data point type selector
│   ├── [4.1.2] Value input with validation
│   ├── [4.1.3] Add multiple data points
│   ├── [4.1.4] Malaysian phone format validation
│   └── [4.1.5] Form submission handler
├── 4.2 Search API route
│   ├── [4.2.1] Normalize input values
│   ├── [4.2.2] Query database for matches
│   ├── [4.2.3] Call LLM for analysis
│   └── [4.2.4] Return structured result
└── 4.3 Page layout
    ├── [4.3.1] Instructions text
    └── [4.3.2] Disclaimer note
```

### 5.0 Results Page
```
5.0 Results Page (/results)
├── 5.1 Results display
│   ├── [5.1.1] Status indicator (Suspicious/Clear/No Info)
│   ├── [5.1.2] Confidence percentage display
│   ├── [5.1.3] Confidence breakdown (why this score)
│   ├── [5.1.4] Matched data points list
│   └── [5.1.5] Source transparency (X reports since Y)
├── 5.2 Actions
│   ├── [5.2.1] Search again button
│   ├── [5.2.2] Submit report CTA
│   └── [5.2.3] Dispute link (if suspicious)
└── 5.3 Styling
    ├── [5.3.1] Color coding for status
    └── [5.3.2] Card-based layout
```

### 6.0 Submit Report Page
```
6.0 Submit Report Page (/submit)
├── 6.1 Report form
│   ├── [6.1.1] Scam type selector (Malaysia categories)
│   ├── [6.1.2] Platform selector (optional)
│   ├── [6.1.3] Description textarea
│   ├── [6.1.4] Data points input (multiple)
│   └── [6.1.5] Confirmation checkbox
├── 6.2 Submit API route
│   ├── [6.2.1] Validate input
│   ├── [6.2.2] Normalize data points
│   ├── [6.2.3] Save to database
│   └── [6.2.4] Log to audit trail
├── 6.3 Confirmation state
│   ├── [6.3.1] Success message
│   └── [6.3.2] Next actions
└── 6.4 Page layout
    └── [6.4.1] Guidance text
```

### 7.0 Info Pages
```
7.0 Info Pages
├── 7.1 How It Works (/how-it-works)
│   ├── [7.1.1] Step-by-step explanation
│   ├── [7.1.2] What we do / don't do
│   ├── [7.1.3] Privacy section
│   └── [7.1.4] FAQ section
└── 7.2 Disclaimer (/disclaimer)
    ├── [7.2.1] Legal disclaimer
    ├── [7.2.2] PDPA compliance notice
    ├── [7.2.3] User-submitted data notice
    └── [7.2.4] Takedown request info
```

### 8.0 Rate Limiting
```
8.0 Rate Limiting
├── [8.0.1] Add rate limiting middleware
└── [8.0.2] Apply to API routes
```

---

## DAY 2: Trust & Quality Layer

### 9.0 Search Normalization
```
9.0 Search Normalization
├── [9.0.1] Phone number normalization (strip formatting)
├── [9.0.2] Email normalization (lowercase, trim)
├── [9.0.3] Apply on data insert
└── [9.0.4] Apply on search query
```

### 10.0 Source Transparency
```
10.0 Source Transparency
├── [10.0.1] Add report count to results
├── [10.0.2] Show date range of reports
├── [10.0.3] Show scam types distribution
└── [10.0.4] Update results UI
```

### 11.0 Evidence Upload
```
11.0 Evidence Upload
├── [11.0.1] Setup Supabase Storage bucket
├── [11.0.2] Create upload component
├── [11.0.3] Handle file upload in submit API
├── [11.0.4] Link evidence URL to report
└── [11.0.5] Display verification badge on results
```

### 12.0 Dispute Mechanism
```
12.0 Dispute Mechanism
├── 12.1 Dispute page (/dispute)
│   ├── [12.1.1] Report ID input
│   ├── [12.1.2] Reason textarea
│   ├── [12.1.3] Contact email input
│   └── [12.1.4] Submit button
├── 12.2 Dispute API route
│   ├── [12.2.1] Validate input
│   ├── [12.2.2] Create dispute record
│   ├── [12.2.3] Update report is_disputed flag
│   └── [12.2.4] Log to audit trail
└── 12.3 Results update
    └── [12.3.1] Show "Disputed" badge if applicable
```

### 13.0 Audit Trail
```
13.0 Audit Trail
├── [13.0.1] Log search actions
├── [13.0.2] Log submit actions
├── [13.0.3] Log dispute actions
└── [13.0.4] Hash IP addresses for privacy
```

### 14.0 Legal Language Polish
```
14.0 Legal Language
├── [14.0.1] Review all user-facing text
├── [14.0.2] Ensure neutral, non-accusatory language
├── [14.0.3] Add PDPA compliance language
└── [14.0.4] Add disclaimer to results page
```

---

## DAY 3: Polish to 9/10

### 15.0 Enhanced Search
```
15.0 Enhanced Search
├── [15.0.1] Add fuzzy matching for names
├── [15.0.2] Add phonetic matching (Soundex)
└── [15.0.3] Partial match scoring
```

### 16.0 Confidence Breakdown
```
16.0 Confidence Breakdown
├── [16.0.1] Show contributing factors
├── [16.0.2] Weight verified reports higher
├── [16.0.3] Visual factor breakdown
└── [16.0.4] Update LLM prompt
```

### 17.0 Platform Stats
```
17.0 Platform Stats
├── [17.0.1] Total reports count
├── [17.0.2] Total searches count
├── [17.0.3] Display on landing page
└── [17.0.4] Real-time or cached
```

### 18.0 Seed Data
```
18.0 Seed Data
├── [18.0.1] Create realistic Malaysian scam examples
├── [18.0.2] Include TCG/collectibles examples
├── [18.0.3] Include gold/silver examples
├── [18.0.4] Include Macau scam examples
└── [18.0.5] Seed database
```

### 19.0 Mobile Optimization
```
19.0 Mobile Optimization
├── [19.0.1] Test all pages on mobile
├── [19.0.2] Fix responsive issues
├── [19.0.3] Optimize touch targets
└── [19.0.4] Test forms on mobile
```

### 20.0 Polish & Edge Cases
```
20.0 Polish
├── [20.0.1] Loading states for all actions
├── [20.0.2] Error handling and messages
├── [20.0.3] Empty states
├── [20.0.4] Form validation feedback
└── [20.0.5] Performance optimization
```

---

## Task Status Legend

- [ ] Not started
- [~] In progress
- [x] Complete
- [-] Skipped

---

## Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## LLM Analysis Prompt

```
You are a fraud risk analyst for ScamGuard Malaysia. Analyze the search results and provide a risk assessment.

USER INPUT:
{{user_input}}

DATABASE MATCHES:
{{matches}}

INSTRUCTIONS:
1. Analyze how many reports contain matching data points
2. Consider the types of scams reported
3. Weight verified reports higher than unverified
4. Consider if disputed reports exist
5. Provide a clear, factual assessment

Respond in JSON format only:
{
  "status": "suspicious" | "no_known_info" | "clear",
  "confidence": 0-100,
  "summary": "1-2 sentence factual explanation",
  "matched_fields": ["list of matched data types"],
  "factors": [
    {"factor": "description", "impact": "positive" | "negative" | "neutral"}
  ]
}

IMPORTANT:
- Use neutral, non-accusatory language
- State facts, not accusations
- "Suspicious" means matching reports exist, not confirmed fraud
- Always include factors that influenced the score
```

---

## Quality Checklist (Day 3)

- [ ] All pages render correctly
- [ ] Search returns accurate results
- [ ] Submit creates records in database
- [ ] Dispute updates report status
- [ ] Evidence upload works
- [ ] Mobile responsive
- [ ] Loading states present
- [ ] Error handling works
- [ ] Rate limiting active
- [ ] Disclaimers visible
- [ ] PDPA language included
- [ ] Neutral language throughout
- [ ] Seed data populated
- [ ] Performance acceptable (<2s page load)

---

## Success Criteria

| Metric | Target |
|--------|--------|
| All pages functional | 100% |
| Search accuracy | >90% |
| Mobile usability | Good |
| Legal protection | Disclaimers + Disputes |
| Trust indicators | Transparency + Verification |
| Architecture score | 9/10 |
