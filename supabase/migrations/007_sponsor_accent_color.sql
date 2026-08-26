-- ============================================
-- MIGRATION 007: Per-sponsor accent colour
-- ============================================
-- Run this in Supabase SQL Editor
-- Safe to re-run (idempotent)
--
-- Each accent is sampled from the dominant colour of that sponsor's own logo,
-- so the highlight on the bid board is the sponsor's brand rather than
-- arbitrary decoration. Used for the pointer-tracking glow, the hover ring,
-- and the resting tint behind the logo.

ALTER TABLE public.sponsors
  ADD COLUMN IF NOT EXISTS accent_color TEXT NOT NULL DEFAULT '#2662d9';

ALTER TABLE public.sponsors
  DROP CONSTRAINT IF EXISTS sponsors_accent_color_hex;

ALTER TABLE public.sponsors
  ADD CONSTRAINT sponsors_accent_color_hex
  CHECK (accent_color ~* '^#[0-9a-f]{6}$');

UPDATE public.sponsors SET accent_color = '#6d20f0' WHERE slug = 'aeorival';
UPDATE public.sponsors SET accent_color = '#c9a227' WHERE slug = 'tcgintel';
UPDATE public.sponsors SET accent_color = '#c026a5' WHERE slug = 'systemaudit';
