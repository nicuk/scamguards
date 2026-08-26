-- ============================================
-- MIGRATION 005: Sponsored Slots (bids, clicks, enquiries)
-- ============================================
-- Run this in Supabase SQL Editor
-- Safe to re-run (idempotent)
--
-- Features:
-- 1. Sponsor slots ranked by bid amount
-- 2. Public click counter (incremented via SECURITY DEFINER RPC)
-- 3. Sponsorship enquiry inbox (write-only for the public)

-- ============================================
-- 1. SPONSORS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  url TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_path TEXT NOT NULL,
  bid_amount NUMERIC(10, 2) NOT NULL DEFAULT 20,
  click_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Slots are ordered by bid (highest first), then by who bid earliest
CREATE INDEX IF NOT EXISTS idx_sponsors_ranking
  ON public.sponsors (bid_amount DESC, created_at ASC)
  WHERE is_active = TRUE;

-- ============================================
-- 2. SPONSOR ENQUIRIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.sponsor_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  bid_amount NUMERIC(10, 2),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'contacted', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sponsor_enquiries_status
  ON public.sponsor_enquiries (status, created_at DESC);

-- ============================================
-- 3. CLICK COUNTER RPC
-- ============================================
-- SECURITY DEFINER so the public can increment the counter
-- without holding UPDATE rights on the sponsors table.

CREATE OR REPLACE FUNCTION public.increment_sponsor_click(p_slug TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE public.sponsors
     SET click_count = click_count + 1,
         updated_at  = NOW()
   WHERE slug = p_slug
     AND is_active = TRUE
  RETURNING click_count INTO v_count;

  RETURN COALESCE(v_count, 0);
END;
$$;

REVOKE ALL ON FUNCTION public.increment_sponsor_click(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_sponsor_click(TEXT) TO anon, authenticated;

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_enquiries ENABLE ROW LEVEL SECURITY;

-- Anyone may read active sponsor slots
DROP POLICY IF EXISTS "Active sponsors are publicly readable" ON public.sponsors;
CREATE POLICY "Active sponsors are publicly readable"
  ON public.sponsors FOR SELECT
  USING (is_active = TRUE);

-- Anyone may submit a sponsorship enquiry, nobody public may read them back
DROP POLICY IF EXISTS "Anyone can submit a sponsorship enquiry" ON public.sponsor_enquiries;
CREATE POLICY "Anyone can submit a sponsorship enquiry"
  ON public.sponsor_enquiries FOR INSERT
  WITH CHECK (TRUE);

-- ============================================
-- 5. SEED THE CURRENT SLOTS
-- ============================================
-- Click counts intentionally start at 0.
-- ON CONFLICT keeps live bid/click values intact when re-running.

INSERT INTO public.sponsors
  (slug, name, domain, url, tagline, description, logo_path, bid_amount)
VALUES
  (
    'aeorival',
    'AEORival',
    'aeorival.com',
    'https://aeorival.com',
    'AI Visibility',
    'See how ChatGPT and Perplexity answer questions about your brand.',
    '/sponsors/aeorival.png',
    22
  ),
  (
    'tcgintel',
    'TCGIntel',
    'tcgintel.app',
    'https://tcgintel.app',
    'Card Prices',
    'Check what a trading card is really worth before you pay a seller.',
    '/sponsors/tcgintel.png',
    21
  ),
  (
    'systemaudit',
    'SystemAudit',
    'systemaudit.dev',
    'https://systemaudit.dev',
    'Site Audits',
    'Automated site and codebase audits — speed, security, SEO, accessibility.',
    '/sponsors/systemaudit.png',
    20
  )
ON CONFLICT (slug) DO UPDATE
  SET name        = EXCLUDED.name,
      domain      = EXCLUDED.domain,
      url         = EXCLUDED.url,
      tagline     = EXCLUDED.tagline,
      description = EXCLUDED.description,
      logo_path   = EXCLUDED.logo_path,
      updated_at  = NOW();
