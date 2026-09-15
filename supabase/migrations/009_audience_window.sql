-- ============================================
-- MIGRATION 009: Trailing-30-day audience figures
-- ============================================
-- Run this in Supabase SQL Editor
-- Safe to re-run (idempotent)
--
-- Replaces 008's single running counter with the TCGIntel sponsor-board model:
-- "N visitors / D days · N search impressions / 30 days".
--
-- 1. site_visit_days: ONE ROW PER DAY, not a running total. The label promises
--    a trailing window, so days have to be able to age out.
--    What the number means: distinct browsers per day (deduped on an httpOnly
--    cookie by /api/visit), summed over the window. No IP, no user agent, no
--    per-visitor row — the table can only say how many browsers arrived on a
--    date.
--
-- 2. site_search_stats: the one figure we cannot count ourselves, Google search
--    impressions over 30 days, written daily by /api/cron/site-stats from
--    Search Console. captured_at lets the UI hide a figure that has gone stale.
--
-- 3. Drops 008's site_counter and "last hour" presence objects, which the
--    board no longer shows.

-- ============================================
-- 1. VISITORS PER DAY
-- ============================================

CREATE TABLE IF NOT EXISTS public.site_visit_days (
  day DATE PRIMARY KEY,
  visitors INTEGER NOT NULL DEFAULT 0 CHECK (visitors >= 0)
);

ALTER TABLE public.site_visit_days ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Visit days are publicly readable" ON public.site_visit_days;
CREATE POLICY "Visit days are publicly readable"
  ON public.site_visit_days FOR SELECT
  USING (TRUE);

-- Bump today, return the trailing-30-day total. Service-role only: the visitor
-- figure is the headline claim a sponsor bids against, so it must not be
-- incrementable by anyone who can reach the database.
CREATE OR REPLACE FUNCTION public.record_visit()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  total BIGINT;
BEGIN
  INSERT INTO public.site_visit_days (day, visitors)
       VALUES (CURRENT_DATE, 1)
  ON CONFLICT (day) DO UPDATE
          SET visitors = public.site_visit_days.visitors + 1;

  -- Self-pruning hygiene: nothing reads past 30 days
  DELETE FROM public.site_visit_days WHERE day < CURRENT_DATE - 400;

  SELECT COALESCE(SUM(v.visitors), 0)
    INTO total
    FROM public.site_visit_days v
   WHERE v.day > CURRENT_DATE - 30;

  RETURN total;
END;
$$;

REVOKE ALL ON FUNCTION public.record_visit() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_visit() TO service_role;

-- ============================================
-- 2. SEARCH IMPRESSIONS (Search Console)
-- ============================================

CREATE TABLE IF NOT EXISTS public.site_search_stats (
  id TEXT PRIMARY KEY DEFAULT 'site' CHECK (id = 'site'),
  impressions_30d INTEGER CHECK (impressions_30d >= 0),
  impressions_captured_at TIMESTAMPTZ
);

INSERT INTO public.site_search_stats (id) VALUES ('site') ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.site_search_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Search stats are publicly readable" ON public.site_search_stats;
CREATE POLICY "Search stats are publicly readable"
  ON public.site_search_stats FOR SELECT
  USING (TRUE);
-- No write policy: the cron writes with the service role.

-- ============================================
-- 3. RETIRE 008 OBJECTS
-- ============================================

DROP FUNCTION IF EXISTS public.record_presence(UUID);
DROP FUNCTION IF EXISTS public.active_last_hour();
DROP TABLE IF EXISTS public.site_presence;
DROP TABLE IF EXISTS public.site_counter;

-- ============================================
-- 4. BACKFILL FROM VERCEL WEB ANALYTICS
-- ============================================
-- First-party counting starts on 2026-09-14. Rather than open at "a handful of
-- visitors / 1 day", the window is filled with the REAL per-day visitor
-- figures Vercel Web Analytics recorded for scamguards.app, exported
-- 2026-09-14 (UTC day buckets). These are measured numbers, not an invented
-- shape. 2026-09-14 itself is not backfilled — it is counted first-party from
-- here, so today reads low rather than double-counted.

INSERT INTO public.site_visit_days (day, visitors) VALUES
  ('2026-08-16', 11), ('2026-08-17', 15), ('2026-08-18', 32), ('2026-08-19', 14),
  ('2026-08-20', 15), ('2026-08-21', 33), ('2026-08-22', 9),  ('2026-08-23', 13),
  ('2026-08-24', 25), ('2026-08-25', 47), ('2026-08-26', 12), ('2026-08-27', 18),
  ('2026-08-28', 16), ('2026-08-29', 5),  ('2026-08-30', 5),  ('2026-08-31', 12),
  ('2026-09-01', 17), ('2026-09-02', 59), ('2026-09-03', 32), ('2026-09-04', 21),
  ('2026-09-05', 11), ('2026-09-06', 9),  ('2026-09-07', 10), ('2026-09-08', 13),
  ('2026-09-09', 29), ('2026-09-10', 18), ('2026-09-11', 26), ('2026-09-12', 11),
  ('2026-09-13', 10)
ON CONFLICT (day) DO UPDATE SET visitors = EXCLUDED.visitors;
