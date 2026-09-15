-- ============================================
-- MIGRATION 010: IndexNow submission history
-- ============================================
-- Run this in Supabase SQL Editor
-- Safe to re-run (idempotent)
--
-- /api/cron/indexnow pings Bing and the other IndexNow engines once a day with
-- URLs they have not been told about. This table is its memory: one row per
-- URL that an engine accepted, and the version it was sent at (a blog post's
-- updatedAt, otherwise "1"). A changed version is sent again.
--
-- Written only by the service role. RLS is on with no policies, so anon and
-- authenticated clients can neither read nor write it.

CREATE TABLE IF NOT EXISTS public.indexnow_submissions (
  url TEXT PRIMARY KEY,
  version TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.indexnow_submissions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.indexnow_submissions FROM anon, authenticated;
