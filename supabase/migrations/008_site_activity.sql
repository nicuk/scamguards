-- ============================================
-- MIGRATION 008: Site activity (visitors + people in the last hour)
-- ============================================
-- Run this in Supabase SQL Editor
-- Safe to re-run (idempotent)
--
-- Mirrors the AEORival live pill. Both numbers are measured, never seeded:
--
-- 1. site_counter: one persistent total, incremented at most once per browser
--    per 24h by /api/visit (deduped on an httpOnly cookie). It means "daily
--    unique browsers, summed since counting began", never pageviews.
--    counting_since is shown next to the number, because ScamGuards was live
--    long before this counter existed and "since launch" would be false.
--
-- 2. site_presence: a random UUID per browser (httpOnly cookie), refreshed by a
--    heartbeat while a tab is visible. No IP, no fingerprint, nothing joinable
--    to a person, and the table prunes itself to ~2 hours on every write, so it
--    is a sliding window and never a visitor history.
--
-- Writes go through SECURITY DEFINER functions callable only by service_role;
-- the public can read the total and a bare count, nothing else.

-- ============================================
-- 1. VISITOR COUNTER
-- ============================================

CREATE TABLE IF NOT EXISTS public.site_counter (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  visits BIGINT NOT NULL DEFAULT 0,
  counting_since TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT site_counter_singleton CHECK (id)
);

INSERT INTO public.site_counter (id) VALUES (TRUE) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.site_counter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Site counter is publicly readable" ON public.site_counter;
CREATE POLICY "Site counter is publicly readable"
  ON public.site_counter FOR SELECT
  USING (TRUE);

CREATE OR REPLACE FUNCTION public.record_visit()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v BIGINT;
BEGIN
  UPDATE public.site_counter
     SET visits = visits + 1,
         updated_at = NOW()
   WHERE id
  RETURNING visits INTO v;
  RETURN v;
END;
$$;

REVOKE ALL ON FUNCTION public.record_visit() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_visit() TO service_role;

-- ============================================
-- 2. PEOPLE IN THE LAST HOUR
-- ============================================

CREATE TABLE IF NOT EXISTS public.site_presence (
  browser_key UUID PRIMARY KEY,
  seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_presence_seen_at
  ON public.site_presence (seen_at DESC);

-- No policies on purpose: raw browser keys are never readable by the public.
ALTER TABLE public.site_presence ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.record_presence(p_key UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  n INTEGER;
BEGIN
  DELETE FROM public.site_presence WHERE seen_at < NOW() - INTERVAL '2 hours';

  INSERT INTO public.site_presence (browser_key, seen_at)
  VALUES (p_key, NOW())
  ON CONFLICT (browser_key) DO UPDATE SET seen_at = NOW();

  SELECT COUNT(*) INTO n
    FROM public.site_presence
   WHERE seen_at > NOW() - INTERVAL '1 hour';

  RETURN n;
END;
$$;

REVOKE ALL ON FUNCTION public.record_presence(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_presence(UUID) TO service_role;

-- Read-only count for server renders. Returns an integer and nothing else.
CREATE OR REPLACE FUNCTION public.active_last_hour()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COUNT(*)::INTEGER
    FROM public.site_presence
   WHERE seen_at > NOW() - INTERVAL '1 hour';
$$;

REVOKE ALL ON FUNCTION public.active_last_hour() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.active_last_hour() TO anon, authenticated, service_role;
