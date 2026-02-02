-- ================================================
-- ScamGuard - Fix Supabase Linter Warnings
-- ================================================

-- ============================================
-- 1. FIX: Function Search Path (Security)
-- Add SET search_path = '' to all functions
-- ============================================

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

-- ============================================
-- 2. INTENTIONAL - NO FIX NEEDED
-- ============================================

-- materialized_view_in_api: INTENTIONAL
-- We WANT platform_stats, scam_type_stats, daily_stats, scam_trends, 
-- platform_breakdown to be publicly accessible for the stats API.
-- This is by design for a public scam prevention platform.

-- rls_policy_always_true for INSERT: INTENTIONAL  
-- This is a PUBLIC platform where anyone can:
-- - Submit reports (reports table)
-- - Add data points (data_points table)
-- - Submit disputes (disputes table)
-- - Log actions (audit_logs table)
-- Open INSERT is the core functionality.

-- extension_in_public (pg_trgm): LOW PRIORITY
-- This is a minor warning. Moving extensions requires more complex migration.
-- Can be addressed later if needed.

-- ================================================
-- DONE! Function search paths are now secure.
-- Other warnings are intentional for public platform.
-- ================================================
