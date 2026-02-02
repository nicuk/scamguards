-- ============================================
-- MIGRATION 004: Smart Duplicate Detection & Scammer Profiles
-- ============================================
-- This creates a unified scammer tracking system that:
-- 1. Tracks how many times each data point has been reported
-- 2. Calculates confidence scores based on report volume
-- 3. Links related reports together
-- 4. Prevents spam while allowing legitimate corroborating reports

-- ============================================
-- 1. ENHANCE DATA_POINTS TABLE
-- ============================================

-- Add report tracking columns to data_points
ALTER TABLE data_points 
ADD COLUMN IF NOT EXISTS report_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS first_reported_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_reported_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS confidence_score INTEGER DEFAULT 50;

-- Create index for fast lookups on normalized values
CREATE INDEX IF NOT EXISTS idx_data_points_normalized_lookup 
ON data_points(normalized_value, type);

-- ============================================
-- 2. SCAMMER PROFILES VIEW
-- ============================================
-- Aggregates data points into unified scammer profiles

CREATE OR REPLACE VIEW scammer_profiles AS
SELECT 
  normalized_value,
  type,
  COUNT(DISTINCT report_id) as total_reports,
  MIN(created_at) as first_reported,
  MAX(created_at) as last_reported,
  ARRAY_AGG(DISTINCT value) as aliases,
  -- Confidence calculation: base 50 + 10 per report (max 100)
  LEAST(100, 50 + (COUNT(DISTINCT report_id) * 10)) as confidence_score,
  -- Heat level based on report count
  CASE 
    WHEN COUNT(DISTINCT report_id) >= 10 THEN 'CRITICAL'
    WHEN COUNT(DISTINCT report_id) >= 5 THEN 'HIGH'
    WHEN COUNT(DISTINCT report_id) >= 3 THEN 'MEDIUM'
    ELSE 'LOW'
  END as heat_level
FROM data_points
WHERE normalized_value IS NOT NULL AND normalized_value != ''
GROUP BY normalized_value, type;

-- ============================================
-- 3. DUPLICATE CHECK FUNCTION
-- ============================================
-- Called before insert to check if data point already exists

CREATE OR REPLACE FUNCTION check_duplicate_data_point(
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
  
  -- If no rows returned, return "not duplicate" row
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, NULL::TIMESTAMPTZ, NULL::TIMESTAMPTZ, 50;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. SMART MERGE FUNCTION
-- ============================================
-- When inserting a data point that already exists (same normalized_value),
-- this updates the existing tracking instead of just creating a duplicate

CREATE OR REPLACE FUNCTION upsert_data_point(
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
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_existing_id UUID;
  v_report_count INTEGER;
BEGIN
  -- Check if this exact normalized value already exists for this type
  SELECT id, report_count INTO v_existing_id, v_report_count
  FROM public.data_points
  WHERE type = p_type AND normalized_value = p_normalized_value
  LIMIT 1;
  
  IF v_existing_id IS NOT NULL THEN
    -- Data point exists - create new one but track the relationship
    INSERT INTO public.data_points (report_id, type, value, normalized_value, report_count, first_reported_at, last_reported_at)
    VALUES (p_report_id, p_type, p_value, p_normalized_value, v_report_count + 1, 
            (SELECT first_reported_at FROM public.data_points WHERE id = v_existing_id),
            NOW())
    RETURNING id INTO v_existing_id;
    
    -- Update report_count on ALL matching data points
    UPDATE public.data_points
    SET report_count = report_count + 1,
        last_reported_at = NOW()
    WHERE type = p_type AND normalized_value = p_normalized_value;
    
    RETURN QUERY SELECT v_existing_id, FALSE, v_report_count + 1;
  ELSE
    -- New data point
    INSERT INTO public.data_points (report_id, type, value, normalized_value, report_count, first_reported_at, last_reported_at)
    VALUES (p_report_id, p_type, p_value, p_normalized_value, 1, NOW(), NOW())
    RETURNING id INTO v_existing_id;
    
    RETURN QUERY SELECT v_existing_id, TRUE, 1;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. GET SCAMMER REPORT COUNT FUNCTION
-- ============================================
-- Used to display "Reported X times" in UI

CREATE OR REPLACE FUNCTION get_scammer_stats(p_normalized_value TEXT)
RETURNS TABLE(
  total_reports INTEGER,
  first_reported TIMESTAMPTZ,
  last_reported TIMESTAMPTZ,
  confidence_score INTEGER,
  heat_level TEXT
)
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
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. SPAM PREVENTION - RATE LIMIT BY DATA POINT
-- ============================================
-- Prevent the same IP from reporting the same scammer multiple times

CREATE TABLE IF NOT EXISTS report_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash TEXT NOT NULL,
  normalized_value TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ip_hash, normalized_value)
);

CREATE INDEX IF NOT EXISTS idx_report_submissions_lookup 
ON report_submissions(ip_hash, normalized_value);

-- Auto-cleanup old entries (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_submissions()
RETURNS void
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.report_submissions 
  WHERE submitted_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. MATERIALIZED VIEW FOR SEARCH ENHANCEMENT
-- ============================================
-- Pre-computed scammer stats for fast search results

CREATE MATERIALIZED VIEW IF NOT EXISTS scammer_search_stats AS
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
FROM data_points dp
JOIN reports r ON r.id = dp.report_id
WHERE dp.normalized_value IS NOT NULL AND dp.normalized_value != ''
GROUP BY dp.normalized_value, dp.type;

CREATE UNIQUE INDEX IF NOT EXISTS idx_scammer_search_stats_lookup 
ON scammer_search_stats(normalized_value, type);

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_scammer_search_stats()
RETURNS void
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.scammer_search_stats;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. GRANTS
-- ============================================
GRANT SELECT ON scammer_profiles TO anon;
GRANT SELECT ON scammer_search_stats TO anon;
GRANT ALL ON report_submissions TO anon;
GRANT EXECUTE ON FUNCTION check_duplicate_data_point TO anon;
GRANT EXECUTE ON FUNCTION get_scammer_stats TO anon;
