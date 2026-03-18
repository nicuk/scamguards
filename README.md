# ScamGuards

[![Live](https://img.shields.io/badge/Live-scamguards.app-0066ff)](https://scamguards.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14_(App_Router)-black)](https://nextjs.org/)

AI-powered fraud detection platform. Users paste any identifier — phone number, email, bank account — and get a confidence-scored risk assessment in under 2 seconds, powered by NLP extraction over a crowdsourced scam report database.

**Live:** [scamguards.app](https://scamguards.app)

---

## The Problem

Peer-to-peer fraud in emerging markets generates billions in losses annually. Victims have no fast, free way to verify a counterparty before transferring money. Police databases are slow, fragmented, and not publicly searchable. Existing platforms require sign-ups and have poor coverage.

ScamGuards solves this with a zero-friction search-and-report model: paste an identifier, get an instant risk signal. No account required.

---

## System Design

### AI / NLP Pipeline

This is the core differentiator. The system converts unstructured human narratives into structured, queryable fraud intelligence.

```
┌──────────────────────────────────────────────────────────────────────┐
│  USER INPUT                                                          │
│  "I paid RM500 to 012-3456789 (Maybank 1234567890) for a card       │
│   but he blocked me. My friend also lost money to the same guy       │
│   at 011-9876543"                                                    │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│  NLP EXTRACTION (Qwen LLM)                                          │
│  • Identifies 2 distinct scammer entities from a single narrative    │
│  • Extracts: phone numbers, bank accounts, names, amounts           │
│  • Normalizes identifiers (strip formatting, validate checksums)     │
│  • Assigns per-field confidence scores                               │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│  DEDUPLICATION ENGINE                                                │
│  • Fuzzy match against existing reports (Levenshtein on normalized   │
│    identifiers)                                                      │
│  • Merge vs. create decision based on similarity threshold           │
│  • Increment report count on merge (strengthens confidence score)    │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│  RISK SCORING                                                        │
│  • Confidence = min(100, base_score + (unique_reports × weight))     │
│  • Heat level: CRITICAL (80+) / HIGH (60+) / MEDIUM (40+) / LOW     │
│  • Corroborating identifiers across reports boost confidence         │
└──────────────────────────────────────────────────────────────────────┘
```

**Why Qwen (DashScope) over GPT-4 / Claude:**
The extraction task is structured and constrained — we're pulling phone numbers, bank accounts, and names from conversational text, not generating creative output. Qwen-Turbo handles this at ~1/20th the cost of GPT-4 with comparable accuracy on entity extraction benchmarks. For a free platform with no revenue model, inference cost is the binding constraint. The prompt engineering is also simpler: strict JSON schema output with fallback parsing.

### Search Architecture

```
Query: "012-345 6789"
         │
         ▼
   ┌─────────────┐     ┌────────────────────┐     ┌─────────────────┐
   │ Exact Match  │────▶│ Fuzzy Match         │────▶│ Full-Text Search │
   │ (normalized) │ miss│ (pg_trgm + GIN)     │ miss│ (tsvector + GIN) │
   │ O(1) lookup  │     │ trigram similarity   │     │ ranked by ts_rank │
   └─────────────┘     └────────────────────┘     └─────────────────┘
         hit                    hit                        hit
         │                      │                          │
         ▼                      ▼                          ▼
   ┌──────────────────────────────────────────────────────────┐
   │  Unified results: deduplicated, ranked by confidence      │
   └──────────────────────────────────────────────────────────┘
```

Three-stage cascade. Exact match short-circuits when possible (most queries). Fuzzy match catches formatting variations (spaces, dashes, country codes). Full-text search is the fallback for partial matches and description searches. All three use GIN indexes on normalized data — worst-case query time stays under 100ms on the current dataset.

### Security Model

Four layers, defense in depth:

| Layer | Mechanism | Why |
|-------|-----------|-----|
| **Edge** | IP rate limiting (SHA-256 hashed), cooldowns, progressive auto-ban | Abuse prevention without blocking legitimate users. Runs at edge — zero cold start. |
| **API** | Input sanitization, strict type validation, error boundaries | Standard hardening. No raw user input reaches the database. |
| **Database** | RLS on all tables, `SECURITY DEFINER` with `search_path` hardening, prepared statements | Even a compromised API layer can't bypass row-level access control. |
| **Admin** | Email whitelist + Supabase Auth session management | No role-based complexity needed at current scale. Simple and auditable. |

**Trade-off:** Edge-based rate limiting via middleware (not a WAF) was a deliberate choice. Vercel's edge runtime gives sub-1ms overhead with no external dependency. A WAF (Cloudflare, AWS WAF) would add latency, cost, and config complexity for a threat model that's primarily bot-spam, not sophisticated attacks.

---

## Technical Decisions

| Decision | Chosen | Considered | Reasoning |
|----------|--------|------------|-----------|
| AI provider | Qwen (DashScope) | GPT-4, Claude, Gemini | Extraction task is constrained. Qwen-Turbo at ~$0.001/query vs. ~$0.02/query for GPT-4. 20x cost reduction for equivalent accuracy on structured extraction. |
| Database | Supabase (PostgreSQL) | PlanetScale, raw Postgres on Railway | RLS is critical for a public-facing app with anonymous writes. Supabase provides RLS + auth + storage + `pg_trgm` out of the box without ops overhead. |
| Search | `pg_trgm` + `tsvector` | Elasticsearch, Typesense, Algolia | Dataset is <100K rows. A dedicated search engine is over-engineering. PostgreSQL's built-in trigram + full-text search delivers sub-100ms with zero additional infrastructure. Would revisit at 1M+ rows. |
| Rendering | SSG + edge API routes | Full SSR, SPA + separate API | Content pages are static (scam types, blog, how-it-works). SSG gives zero-cost CDN delivery. Only search/submit need dynamic behavior — those hit edge API routes. Best of both worlds. |
| i18n | Client-side context | next-intl, route-based locales | Two languages only. Route-based i18n (`/en/`, `/ms/`) would double the page count and complicate routing for marginal SEO benefit. Client-side switching with browser auto-detect is the pragmatic choice. Would switch to route-based if adding 5+ locales. |
| Payments | Stripe Payment Links | Stripe Checkout API, custom integration | Zero server-side payment code. No PCI surface. A redirect link is the right tool for optional donations on a free platform. |
| Rate limiting | Edge middleware | Upstash Redis, external WAF | No external dependency. Middleware runs in the same Vercel edge network. In-memory state resets on cold start — acceptable for spam prevention, not suitable for hard billing limits. |

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) — SSG, ISR, edge runtime |
| Language | TypeScript (strict mode) |
| UI | Tailwind CSS + shadcn/ui |
| Database | Supabase PostgreSQL 15 — RLS, `pg_trgm`, `tsvector`, materialized views |
| AI | Qwen-Turbo via DashScope API |
| Hosting | Vercel (edge functions, CDN) |
| Analytics | Google Analytics 4 |
| Payments | Stripe Payment Links |

---

## SEO / AEO / GEO Engineering

Rather than self-assigning scores, here's what's implemented and what's missing:

**Implemented:**
- Per-page `<title>`, `<meta description>`, canonical URLs, OpenGraph + Twitter cards
- Auto-generated OG images via Next.js `ImageResponse` (edge-rendered, zero external service)
- 8 JSON-LD schema types across 34 pages: Organization, WebSite, SearchAction, FAQPage, HowTo, Article, BreadcrumbList, plus nested `HowToStep`
- Dynamic sitemap (18 URLs) with proper `lastmod` + `changefreq` + `priority`
- FAQ schema on 8+ pages targeting "People Also Ask" surfaces
- Definitive answer blocks (first-paragraph direct answers) optimized for AI citation
- External authority source links on every content page

**Not yet implemented:**
- Automated Lighthouse CI in build pipeline
- Server-side rendering for localized content (currently client-side, invisible to crawlers)
- Backlink acquisition strategy
- Core Web Vitals monitoring (no RUM setup yet)

---

## What I'd Do Differently at Scale

1. **Move to route-based i18n** — Client-side language switching means crawlers only see the default language. At scale, `/en/` and `/ms/` routes with `hreflang` would double indexable surface.

2. **Dedicated search infrastructure** — PostgreSQL `pg_trgm` works beautifully under 100K rows. Beyond 1M reports, I'd introduce Typesense or Meilisearch as a read-optimized search layer, keeping Postgres as the source of truth.

3. **Queue-based AI processing** — Currently, NLP extraction is synchronous in the API route. At high submission volume, I'd move extraction to a background job queue (BullMQ or Inngest) with webhook-based status updates to the client.

4. **Federated deployment** — The localization architecture is config-driven. Multi-region expansion would mean separate Supabase instances per region (data residency) with a shared AI layer and a routing proxy at the edge.

5. **Observability** — Add structured logging (Axiom or Datadog), error tracking (Sentry), and uptime monitoring. Currently relying on Vercel's built-in analytics, which is insufficient for production SLA.

---

## Localization Architecture

Currently deployed for the Southeast Asian market. The system is designed for multi-region expansion through configuration:

- **Identifier validation** — Phone format regex, bank name enum, and e-wallet detection are config-driven per locale
- **Scam taxonomy** — Fraud categories map to region-specific naming conventions
- **Content pipeline** — Government statistics and regulatory citations are parameterized per region
- **Currency** — Locale-aware formatting
- **Privacy** — Masking patterns adapted to local data protection requirements

Adding a new region requires configuration changes, not architectural changes.

---

## Running Locally

```bash
git clone https://github.com/nicuk/scamguards.git
cd scamguards
npm install
cp .env.example .env.local   # fill in your keys — see .env.example for details
npm run dev
```

Requires: Node 18+, a Supabase project, and a DashScope API key. See `.env.example` for the full configuration reference.

---

## License

[Elastic License 2.0](LICENSE) — Free to use, modify, and self-host. Commercial SaaS use requires a separate license.
