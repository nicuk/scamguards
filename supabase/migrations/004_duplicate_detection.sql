-- ============================================
-- MIGRATION 004: Smart Duplicate Detection & Scammer Profiles
-- ============================================
-- Run this in Supabase SQL Editor
-- Safe to re-run (idempotent)
--
-- Features:
-- 1. Tracks how many times each data point has been reported
-- 2. Calculates confidence scores based on report volume
-- 3. Links related reports together
-- 4. Prevents spam while allowing legitimate corroborating reports
-- 5. Security hardened (SECURITY DEFINER + search_path)

-- ============================================
-- 1. ENHANCE DATA_POINTS TABLE
-- ============================================

-- Add report tracking columns to data_points
ALTER TABLE public.data_points 
ADD COLUMN IF NOT EXISTS report_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS first_reported_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_reported_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS confidence_score INTEGER DEFAULT 50;

-- Create index for fast lookups on normalized values
CREATE INDEX IF NOT EXISTS idx_data_points_normalized_lookup 
ON public.data_points(normalized_value, type);

-- ============================================
-- 2. SCAMMER PROFILES VIEW
-- ============================================
-- Aggregates data points into unified scammer profiles

DROP VIEW IF EXISTS public.scammer_profiles;
CREATE VIEW public.scammer_profiles 
WITH (security_invoker = true) AS
SELECT 
  normalized_value,
  type,
  COUNT(DISTINCT report_id) as total_reports,
  MIN(created_at) as first_reported,
  MAX(created_at) as last_reported,
  ARRAY_AGG(DISTINCT value) as aliases,
  LEAST(100, 50 + (COUNT(DISTINCT report_id) * 10)) as confidence_score,
  CASE 
    WHEN COUNT(DISTINCT report_id) >= 10 THEN 'CRITICAL'
    WHEN COUNT(DISTINCT report_id) >= 5 THEN 'HIGH'
    WHEN COUNT(DISTINCT report_id) >= 3 THEN 'MEDIUM'
    ELSE 'LOW'
  END as heat_level
FROM public.data_points
WHERE normalized_value IS NOT NULL AND normalized_value != ''
GROUP BY normalized_value, type;

-- ============================================
-- 3. DUPLICATE CHECK FUNCTION
-- ============================================

DROP FUNCTION IF EXISTS public.check_duplicate_data_point(TEXT, TEXT);
CREATE FUNCTION public.check_duplicate_data_point(
  p_type TEXT,
  p_normalized_value TEXT
)
RETURNS TABLE(
  is_duplicate BOOLEAN,
  existing_report_count INTEGER,
  first_reported TIMESTAMPTZ,
  last_reported TIMESTAMPTZ,
  confidence INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TRUE as is_duplicate,
    COUNT(DISTINCT dp.report_id)::INTEGER as existing_report_count,
    MIN(dp.created_at) as first_reported,
    MAX(dp.created_at) as last_reported,
    LEAST(100, 50 + (COUNT(DISTINCT dp.report_id) * 10))::INTEGER as confidence
  FROM public.data_points dp
  WHERE dp.type = p_type 
    AND dp.normalized_value = p_normalized_value
  HAVING COUNT(*) > 0;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, NULL::TIMESTAMPTZ, NULL::TIMESTAMPTZ, 50;
  END IF;
END;
$$;

-- ============================================
-- 4. SMART UPSERT FUNCTION
-- ============================================

DROP FUNCTION IF EXISTS public.upsert_data_point(UUID, TEXT, TEXT, TEXT);
CREATE FUNCTION public.upsert_data_point(
  p_report_id UUID,
  p_type TEXT,
  p_value TEXT,
  p_normalized_value TEXT
)
RETURNS TABLE(
  data_point_id UUID,
  is_new BOOLEAN,
  total_reports INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_existing_id UUID;
  v_report_count INTEGER;
  v_first_reported TIMESTAMPTZ;
  v_new_id UUID;
BEGIN
  -- Check if this exact normalized value already exists for this type
  SELECT id, report_count, first_reported_at 
  INTO v_existing_id, v_report_count, v_first_reported
  FROM public.data_points
  WHERE type = p_type AND normalized_value = p_normalized_value
  LIMIT 1;
  
  IF v_existing_id IS NOT NULL THEN
    -- Data point exists - create new one with inherited tracking
    INSERT INTO public.data_points (
      report_id, type, value, normalized_value, 
      report_count, first_reported_at, last_reported_at, confidence_score
    )
    VALUES (
      p_report_id, p_type, p_value, p_normalized_value, 
      v_report_count + 1, v_first_reported, NOW(),
      LEAST(100, 50 + ((v_report_count + 1) * 10))
    )
    RETURNING id INTO v_new_id;
    
    -- Update report_count on ALL matching data points
    UPDATE public.data_points
    SET report_count = v_report_count + 1,
        last_reported_at = NOW(),
        confidence_score = LEAST(100, 50 + ((v_report_count + 1) * 10))
    WHERE type = p_type AND normalized_value = p_normalized_value;
    
    RETURN QUERY SELECT v_new_id, FALSE, v_report_count + 1;
  ELSE
    -- New data point
    INSERT INTO public.data_points (
      report_id, type, value, normalized_value,
      report_count, first_reported_at, last_reported_at, confidence_score
    )
    VALUES (
      p_report_id, p_type, p_value, p_normalized_value, 
      1, NOW(), NOW(), 60
    )
    RETURNING id INTO v_new_id;
    
    RETURN QUERY SELECT v_new_id, TRUE, 1;
  END IF;
END;
$$;

-- ============================================
-- 5. GET SCAMMER STATS FUNCTION
-- ============================================

DROP FUNCTION IF EXISTS public.get_scammer_stats(TEXT);
CREATE FUNCTION public.get_scammer_stats(p_normalized_value TEXT)
RETURNS TABLE(
  total_reports INTEGER,
  first_reported TIMESTAMPTZ,
  last_reported TIMESTAMPTZ,
  confidence_score INTEGER,
  heat_level TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT dp.report_id)::INTEGER,
    MIN(dp.created_at),
    MAX(dp.created_at),
    LEAST(100, 50 + (COUNT(DISTINCT dp.report_id) * 10))::INTEGER,
    CASE 
      WHEN COUNT(DISTINCT dp.report_id) >= 10 THEN 'CRITICAL'
      WHEN COUNT(DISTINCT dp.report_id) >= 5 THEN 'HIGH'
      WHEN COUNT(DISTINCT dp.report_id) >= 3 THEN 'MEDIUM'
      ELSE 'LOW'
    END
  FROM public.data_points dp
  WHERE dp.normalized_value = p_normalized_value;
END;
$$;

-- ============================================
-- 6. SPAM PREVENTION TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.report_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash TEXT NOT NULL,
  normalized_value TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ip_hash, normalized_value)
);

CREATE INDEX IF NOT EXISTS idx_report_submissions_lookup 
ON public.report_submissions(ip_hash, normalized_value);

CREATE INDEX IF NOT EXISTS idx_report_submissions_cleanup
ON public.report_submissions(submitted_at);

-- Enable RLS
ALTER TABLE public.report_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policy - allow all for rate limiting
DROP POLICY IF EXISTS "Allow all report_submissions" ON public.report_submissions;
CREATE POLICY "Allow all report_submissions" ON public.report_submissions
  FOR ALL USING (true) WITH CHECK (true);

-- Cleanup function
DROP FUNCTION IF EXISTS public.cleanup_old_submissions();
CREATE FUNCTION public.cleanup_old_submissions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.report_submissions 
  WHERE submitted_at < NOW() - INTERVAL '30 days';
END;
$$;

-- ============================================
-- 7. MATERIALIZED VIEW FOR SEARCH
-- ============================================

DROP MATERIALIZED VIEW IF EXISTS public.scammer_search_stats;
CREATE MATERIALIZED VIEW public.scammer_search_stats AS
SELECT 
  dp.normalized_value,
  dp.type,
  COUNT(DISTINCT dp.report_id) as report_count,
  MIN(r.created_at) as first_reported,
  MAX(r.created_at) as last_reported,
  BOOL_OR(r.is_verified) as has_verified_report,
  LEAST(100, 50 + (COUNT(DISTINCT dp.report_id) * 10)) as confidence_score,
  CASE 
    WHEN COUNT(DISTINCT dp.report_id) >= 10 THEN 'CRITICAL'
    WHEN COUNT(DISTINCT dp.report_id) >= 5 THEN 'HIGH'
    WHEN COUNT(DISTINCT dp.report_id) >= 3 THEN 'MEDIUM'
    ELSE 'LOW'
  END as heat_level,
  MODE() WITHIN GROUP (ORDER BY r.scam_type) as common_scam_type
FROM public.data_points dp
JOIN public.reports r ON r.id = dp.report_id
WHERE dp.normalized_value IS NOT NULL AND dp.normalized_value != ''
GROUP BY dp.normalized_value, dp.type;

CREATE UNIQUE INDEX IF NOT EXISTS idx_scammer_search_stats_lookup 
ON public.scammer_search_stats(normalized_value, type);

-- Refresh function
DROP FUNCTION IF EXISTS public.refresh_scammer_search_stats();
CREATE FUNCTION public.refresh_scammer_search_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.scammer_search_stats;
END;
$$;

-- ============================================
-- 8. SECURITY FIXES FOR EXISTING FUNCTIONS
-- ============================================
-- Apply search_path hardening to functions from earlier migrations

-- Fix search_similar
CREATE OR REPLACE FUNCTION public.search_similar(search_term TEXT, threshold FLOAT DEFAULT 0.3)
RETURNS TABLE(
  report_id UUID,
  data_point_type TEXT,
  data_point_value TEXT,
  similarity_score FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dp.report_id,
    dp.type,
    dp.value,
    similarity(dp.normalized_value, lower(search_term)) as score
  FROM public.data_points dp
  JOIN public.reports r ON r.id = dp.report_id
  WHERE 
    r.status = 'active'
    AND similarity(dp.normalized_value, lower(search_term)) > threshold
  ORDER BY score DESC
  LIMIT 50;
END;
$$;

-- Fix normalize_phone
CREATE OR REPLACE FUNCTION public.normalize_phone(phone TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  RETURN regexp_replace(phone, '[^0-9]', '', 'g');
END;
$$;

-- Fix refresh_platform_stats
CREATE OR REPLACE FUNCTION public.refresh_platform_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.platform_stats;
END;
$$;

-- Fix update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix update_report_disputed_status
CREATE OR REPLACE FUNCTION public.update_report_disputed_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.reports SET is_disputed = TRUE WHERE id = NEW.report_id;
  RETURN NEW;
END;
$$;

-- Fix auto_flag_suspicious_report
CREATE OR REPLACE FUNCTION public.auto_flag_suspicious_report()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_reporter_recent_count INTEGER;
BEGIN
  IF NEW.reporter_hash IS NOT NULL THEN
    SELECT COUNT(*) INTO v_reporter_recent_count
    FROM public.reports
    WHERE reporter_hash = NEW.reporter_hash
      AND created_at > NOW() - INTERVAL '1 hour';
    
    IF v_reporter_recent_count > 5 THEN
      INSERT INTO public.moderation_queue (report_id, reason, priority)
      VALUES (NEW.id, 'high_volume_reporter', 3);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fix update_reporter_reputation
CREATE OR REPLACE FUNCTION public.update_reporter_reputation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.reporter_reputation (reporter_hash, total_reports, last_report_at)
  VALUES (NEW.reporter_hash, 1, NOW())
  ON CONFLICT (reporter_hash) DO UPDATE SET
    total_reports = public.reporter_reputation.total_reports + 1,
    verified_reports = public.reporter_reputation.verified_reports + 
      CASE WHEN NEW.is_verified THEN 1 ELSE 0 END,
    last_report_at = NOW();
  
  UPDATE public.reporter_reputation SET
    reputation_score = LEAST(100, GREATEST(0,
      50 + 
      (verified_reports * 5) - 
      (disputed_reports * 10) - 
      (reports_removed * 20) +
      CASE WHEN total_reports > 10 THEN 10 ELSE 0 END
    )),
    is_trusted = (verified_reports >= 5 AND disputed_reports = 0)
  WHERE reporter_hash = NEW.reporter_hash;
  
  RETURN NEW;
END;
$$;

-- ============================================
-- 9. GRANTS
-- ============================================
GRANT SELECT ON public.scammer_profiles TO anon;
GRANT SELECT ON public.scammer_search_stats TO anon;
GRANT ALL ON public.report_submissions TO anon;
GRANT EXECUTE ON FUNCTION public.check_duplicate_data_point(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.upsert_data_point(UUID, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_scammer_stats(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.cleanup_old_submissions() TO anon;
GRANT EXECUTE ON FUNCTION public.refresh_scammer_search_stats() TO anon;
GRANT EXECUTE ON FUNCTION public.search_similar(TEXT, FLOAT) TO anon;
GRANT EXECUTE ON FUNCTION public.normalize_phone(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.refresh_platform_stats() TO anon;

-- ============================================
-- 10. ADD COUNTRY FIELD
-- ============================================
-- Regional support: Malaysia-first but covers SEA region

ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'MY';

CREATE INDEX IF NOT EXISTS idx_reports_country ON public.reports(country);

-- Add comment for documentation
COMMENT ON COLUMN public.reports.country IS 'ISO 3166-1 alpha-2 country code (MY, SG, ID, BN, PH, TH, OTHER)';

-- ============================================
-- 11. REFRESH MATERIALIZED VIEWS
-- ============================================
REFRESH MATERIALIZED VIEW public.scammer_search_stats;

-- Also refresh existing views
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'platform_stats') THEN
    REFRESH MATERIALIZED VIEW public.platform_stats;
  END IF;
END $$;

-- ============================================
-- DONE! Migration 004 complete.
-- ============================================
