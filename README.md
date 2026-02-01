# ScamGuard Malaysia 🛡️

> **Check before you trust.** Community-powered scam detection platform helping Malaysians identify potential fraud.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nicuk/scamguard)
[![License: Elastic-2.0](https://img.shields.io/badge/License-Elastic--2.0-blue.svg)](LICENSE)

ScamGuard allows users to search phone numbers, emails, bank accounts, and other identifiers against a community database of reported scam incidents. Our AI analyzes patterns and provides confidence-based risk assessments.

**🇲🇾 Built for Malaysia** — Localized for Malaysian phone formats, banks, e-wallets, and common local scam types (Macau scam, love scam, parcel scam, etc.).

## Features

- **Search**: Check phone numbers, emails, bank accounts, and more against community reports
- **AI Analysis**: Get confidence scores and risk assessments powered by Qwen AI
- **Report**: Submit scam reports to help protect the community
- **Dispute**: Challenge incorrect reports through a fair dispute process
- **Malaysia-focused**: Localized for Malaysian scam types, phone formats, and platforms

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Qwen via DashScope API (Alibaba Cloud)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- DashScope API key (Alibaba Cloud)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/scamguard.git
cd scamguard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DASHSCOPE_API_KEY=your_dashscope_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up the database:
   - Go to your Supabase project
   - Open SQL Editor
   - Run the contents of `supabase/migrations/001_initial_schema.sql`
   - (Optional) Run `supabase/seed.sql` for demo data

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
scamguard/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── search/            # Search page
│   ├── results/           # Results page
│   ├── submit/            # Report submission
│   ├── dispute/           # Dispute form
│   ├── how-it-works/      # Information page
│   └── disclaimer/        # Legal disclaimer
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Header, Footer
│   ├── search/           # Search-related
│   └── results/          # Results-related
├── lib/                   # Utilities and config
│   ├── supabase/         # Database client
│   ├── ai/               # AI analysis
│   ├── utils/            # Helpers
│   └── constants.ts      # App constants
└── supabase/             # Database migrations
```

## Scam Types Supported

- Macau Scam (Phone Impersonation)
- Love/Romance Scam
- Parcel/Delivery Scam
- Job Scam
- Investment Scam (Forex/Crypto)
- Loan Scam
- Gold/Silver Scam
- E-commerce Scam
- Collectibles Scam (TCG/Figurines)
- Money Mule Recruitment
- Phishing/Fake Website

## Data Point Types

- Phone Number (Malaysian format)
- Email Address
- Bank Account
- WhatsApp Number
- Telegram Username
- E-Wallet Account
- Social Media Profile
- Website/URL
- Crypto Wallet
- Name/Alias
- Company Name

## API Endpoints

- `POST /api/search` - Search for reports matching given data points
- `POST /api/submit` - Submit a new scam report
- `POST /api/dispute` - Submit a dispute for a report

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `DASHSCOPE_API_KEY` | Alibaba Cloud DashScope API key |
| `NEXT_PUBLIC_APP_URL` | Application URL |

## Getting API Keys

### Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings > API
3. Copy the Project URL and anon/public key

### DashScope (Qwen AI)
1. Sign up at [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com)
2. Create an API key
3. Free tier includes 1M tokens/month

## Legal Disclaimer

ScamGuard provides community-submitted information for informational purposes only. Results should not be treated as definitive proof of fraud. Always verify through official channels.

## License

MIT License

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting a PR.
