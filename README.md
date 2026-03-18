# ScamGuards

[![Live](https://img.shields.io/badge/Live-scamguards.app-0066ff)](https://scamguards.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14_(App_Router)-black)](https://nextjs.org/)

AI-powered fraud detection platform. Users paste any identifier — phone number, email, bank account — and get a confidence-scored risk assessment in under 2 seconds. Reports are submitted as unstructured narratives; the NLP pipeline extracts entities, resolves multi-scammer contexts, and feeds a compounding confidence model.

**Live:** [scamguards.app](https://scamguards.app)

---

## The Problem

Peer-to-peer fraud in emerging markets generates billions in losses annually. Victims have no fast, free way to verify a counterparty before transferring money. Police databases are slow, fragmented, and not publicly searchable.

ScamGuards solves this with a zero-friction search-and-report model: paste an identifier, get an instant risk signal. No account required. Currently deployed for the Southeast Asian market with a region-agnostic architecture.

---

## AI Pipeline

The system converts unstructured human narratives into structured, queryable fraud intelligence through a three-stage pipeline with full graceful degradation — every stage falls back to regex-based extraction if the LLM is unavailable.

### Stage 1: Entity Extraction

```
INPUT:  "I paid RM500 to 012-3456789 (Maybank 1234567890) for a card
         but he blocked me on @scammer_tg"

                    ▼

NLP EXTRACTION (Qwen-Plus)
├── Phone:    012-3456789      confidence: 95
├── Bank:     1234567890        confidence: 90
├── Telegram: @scammer_tg      confidence: 85
├── Amount:   RM500             
└── Scam type: collectibles     confidence: 80

                    ▼

NORMALIZATION LAYER (type-aware)
├── Phone  → strip formatting, add country code (60123456789)
├── Bank   → strip separators (1234567890)
├── Email  → lowercase
├── Name   → collapse whitespace, lowercase
└── Crypto → lowercase, trim
```

Each identifier type has its own normalization function. This is what makes fuzzy search work — queries match regardless of how users format their input.

**Fallback:** If the LLM is unavailable, regex extractors handle Malaysian phone formats, emails, bank account patterns, URLs, Telegram handles, and crypto wallet addresses. The system degrades gracefully, never fails completely.

### Stage 2: Multi-Scammer Context Splitting

This is the hardest problem the pipeline solves. A single victim narrative often describes multiple distinct scammers:

```
INPUT:  "I lost money to John (012-111-1111, Maybank 1111111111).
         My friend also got scammed by someone called Ali at 012-222-2222"

                    ▼

CONTEXT ANALYSIS (Qwen-Plus, max 8000 tokens)
├── Scammer 1: "John"
│   ├── phone: 012-111-1111
│   ├── bank_account: 1111111111
│   └── scamType: collectibles_scam
│
└── Scammer 2: "Ali"
    ├── phone: 012-222-2222
    └── scamType: collectibles_scam

                    ▼

EACH ENTITY → independent report with own data points,
              scam type classification, and confidence scores
```

The model is prompted to distinguish between multiple contact methods for ONE person vs. genuinely different scammer entities. Each decomposed entity gets a UUID, a primary identifier for display, and independent per-field confidence scores.

### Stage 3: Risk Assessment & Confidence Scoring

```
SEARCH QUERY: "012-3456789"

                    ▼

SEARCH CASCADE (3 stages)
┌─────────────┐     ┌────────────────────┐     ┌──────────────────┐
│ Exact Match  │────▶│ Fuzzy Match         │────▶│ Full-Text Search  │
│ (normalized) │ miss│ (pg_trgm + GIN)     │ miss│ (tsvector + GIN)  │
│ O(1) lookup  │     │ trigram similarity   │     │ ranked ts_rank    │
└─────────────┘     └────────────────────┘     └──────────────────┘

                    ▼

CONFIDENCE SCORING
├── Base score: 50
├── + 10 per unique corroborating report
├── + 15 for verified reports (evidence uploaded)
├── + 10 for multi-type identifier match
├── − 10 for disputed reports
├── Cap: min(100, computed_score)
│
├── Heat levels:
│   ├── CRITICAL ≥ 80  (10+ reports)
│   ├── HIGH     ≥ 60  (5+ reports)
│   ├── MEDIUM   ≥ 40  (3+ reports)
│   └── LOW      < 40
│
└── AI LAYER (Qwen-Turbo) — generates human-readable
    risk narrative from matched reports, dates, and factors

    FALLBACK: Rule-based scoring if LLM unavailable
              (same formula, no narrative generation)
```

**Dual-model cost strategy:** Search analysis uses `qwen-turbo` (~$0.001/query) because the task is constrained — summarize existing data. Entity extraction uses `qwen-plus` (~$0.005/query) because it requires stronger reasoning for context splitting and entity resolution. This keeps average cost under $0.003/request while maintaining extraction quality.

### Report Count Propagation

When a new report matches existing data points, the system doesn't just prevent duplicates — it propagates `report_count` across ALL matching normalized identifiers:

```
Report #1: phone 60123456789 → report_count: 1
Report #2: phone 60123456789 + bank 1234567890 → both data points: report_count: 2
Report #3: phone 60123456789 → all matching entries: report_count: 3

Confidence score rises with each corroborating report.
The database gets smarter with every submission.
```

---

## Security Model

Four layers, defense in depth:

| Layer | Mechanism | Design Rationale |
|-------|-----------|-----------------|
| **Edge Middleware** | IP rate limiting (hashed), per-endpoint cooldowns (60s between submissions), progressive auto-ban (threshold → 24hr ban) | Runs in Vercel edge runtime — sub-1ms overhead, no external dependency. In-memory state resets on cold start, which is acceptable for spam prevention. A WAF would add latency, cost, and config complexity for a threat model that's primarily bot-spam. Cleanup runs on request (no `setInterval` — edge runtime constraint) with 5-minute debounce. |
| **API Routes** | Input sanitization, strict type validation, length bounds (5KB–15KB per input), error boundaries | Standard hardening. No raw user input reaches the database or LLM without validation. |
| **Database** | RLS on all tables, `SECURITY DEFINER` with `search_path` hardening, prepared statements, audit logging | Even a compromised API layer can't bypass row-level access control. Every search and submission is logged with hashed IP. |
| **Privacy** | Type-aware masking (phone: first/last 4, email: mask local, bank: last 4 only, name: initials only), IP hashing (never stored raw) | Different PII types require different masking strategies. Designed for compliance with local data protection requirements. |

---

## Technical Decisions

| Decision | Chosen | Alternatives Considered | Reasoning |
|----------|--------|------------------------|-----------|
| AI extraction | Qwen-Plus (DashScope) | GPT-4, Claude, Gemini | Entity extraction is structured and constrained. Qwen-Plus handles it at ~1/4th GPT-4 cost with comparable accuracy on NER tasks. For a free platform, inference cost is the binding constraint. |
| AI search analysis | Qwen-Turbo | Same model for everything | Search analysis summarizes existing data — easier task. Turbo is 5x cheaper than Plus. Splitting models by task complexity saves ~60% on AI costs. |
| Graceful degradation | Regex fallbacks on all AI functions | Fail hard, retry queues | Users should never see a broken page because an API is down. Every AI function has a regex-based fallback that extracts the same data types with lower confidence scores. System degrades, never breaks. |
| Search | `pg_trgm` + `tsvector` (PostgreSQL) | Elasticsearch, Typesense | Dataset is <100K rows. A dedicated search engine is over-engineering. PostgreSQL's built-in trigram + full-text search delivers sub-100ms with zero additional infrastructure. |
| Database | Supabase (PostgreSQL 15) | PlanetScale, raw Postgres | RLS is critical for a public-facing app with anonymous writes. Supabase provides RLS + auth + storage + `pg_trgm` out of the box. |
| Rendering | SSG + edge API routes | Full SSR, SPA | Content pages are static (34 pages SSG, CDN-served). Only search/submit need dynamic behavior — those hit edge API routes. |
| i18n | Client-side context | next-intl, route-based | Two languages only. Route-based i18n doubles page count and complicates routing for marginal benefit at this scale. |
| Rate limiting | Edge middleware (in-memory) | Upstash Redis, WAF | No external dependency. State resets on cold start — acceptable for spam prevention, not suitable for hard billing limits. |
| Evidence handling | Supabase Storage + auto-verify | S3, Cloudinary | Evidence upload auto-marks reports as verified (higher confidence weight). Supabase Storage is already in the stack — zero additional infra. |

---

## Scaling Path

The architecture is designed with clear scaling boundaries:

| Current Approach | Scaling Trigger | Evolution |
|-----------------|----------------|-----------|
| PostgreSQL `pg_trgm` search | >1M rows | Add Typesense/Meilisearch as read-optimized layer, Postgres stays source of truth |
| Synchronous AI extraction | >100 submissions/hour | Background job queue (BullMQ/Inngest) with webhook status updates |
| Client-side i18n (2 languages) | >5 locales | Route-based i18n (`/en/`, `/ms/`) to double indexable surface |
| Single-region Supabase | Multi-region data residency | Federated Supabase instances per region, shared AI layer, edge routing proxy |
| In-memory rate limiting | Multi-instance deployment | Upstash Redis for shared state across edge instances |

Each decision is correct at the current scale. The scaling triggers are defined, not hypothetical.

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) — SSG, ISR, edge runtime |
| Language | TypeScript (strict mode) |
| UI | Tailwind CSS + shadcn/ui |
| Database | Supabase PostgreSQL 15 — RLS, `pg_trgm`, `tsvector`, materialized views |
| AI/NLP | Qwen-Turbo + Qwen-Plus via DashScope (dual-model by task complexity) |
| Hosting | Vercel (edge functions, CDN) |
| Payments | Stripe Payment Links (zero server-side code) |

---

## Content & SEO Engineering

34 statically generated pages with 8 JSON-LD schema types (Organization, WebSite, SearchAction, FAQPage, HowTo, Article, BreadcrumbList, HowToStep). FAQ schema targets "People Also Ask" surfaces across 8+ pages. Auto-generated OG images via Next.js `ImageResponse` at the edge — no external image service.

Content pages include definitive answer blocks (first-paragraph direct answers) optimized for AI citation, with external authority source links for credibility signals.

Dynamic sitemap (18 URLs) with `lastmod`, `changefreq`, and `priority` per route.

---

## Localization Architecture

Currently deployed for Southeast Asia. Adding a new region requires configuration, not code changes:

- **Identifier validation** — Phone format regex, bank name enum, e-wallet detection: all config-driven per locale
- **Scam taxonomy** — Fraud categories map to region-specific naming conventions
- **Content** — Government statistics and regulatory citations parameterized per region
- **Privacy masking** — Strategies adapted to local data protection requirements
- **Currency** — Locale-aware formatting

---

## Running Locally

```bash
git clone https://github.com/nicuk/scamguards.git
cd scamguards
npm install
cp .env.example .env.local
npm run dev
```

Requires Node 18+, a Supabase project, and a DashScope API key. See `.env.example` for the full configuration reference.

---

## License

[Elastic License 2.0](LICENSE) — Free to use, modify, and self-host. Commercial SaaS use requires a separate license.
