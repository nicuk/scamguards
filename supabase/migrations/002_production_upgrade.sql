-- ScamGuard Malaysia - Production Schema Upgrade
-- Run this AFTER 001_initial_schema.sql
-- Upgrades schema from 6/10 to 8/10

-- ============================================
-- 1. FUZZY SEARCH CAPABILITY
-- ============================================

-- Enable trigram extension for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add trigram index for fuzzy search on normalized values
CREATE INDEX IF NOT EXISTS idx_data_points_trgm 
  ON data_points USING gin (normalized_value gin_trgm_ops);

-- Add trigram index on names specifically
CREATE INDEX IF NOT EXISTS idx_data_points_value_trgm 
  ON data_points USING gin (value gin_trgm_ops);

-- ============================================
-- 2. TIMESTAMPS & TRACKING
-- ============================================

-- Add updated_at to reports
ALTER TABLE reports 
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Auto-update updated_at on changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_reports_updated_at ON reports;
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add reporter tracking (hashed for privacy)
ALTER TABLE reports 
  ADD COLUMN IF NOT EXISTS reporter_hash TEXT;

-- ============================================
-- 3. FINANCIAL IMPACT TRACKING
-- ============================================

-- Track how much money was lost
ALTER TABLE reports 
  ADD COLUMN IF NOT EXISTS amount_lost DECIMAL(12,2);

ALTER TABLE reports 
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'MYR';

-- ============================================
-- 4. DATA VALIDATION CONSTRAINTS
-- ============================================

-- Valid scam types
DO $$ 
BEGIN
  ALTER TABLE reports DROP CONSTRAINT IF EXISTS valid_scam_type;
  ALTER TABLE reports ADD CONSTRAINT valid_scam_type 
    CHECK (scam_type IN (
      'macau_scam', 'love_scam', 'parcel_scam', 'job_scam', 
      'investment_scam', 'loan_scam', 'precious_metals_scam', 
      'ecommerce_scam', 'collectibles_scam', 'mule_recruitment', 
      'phishing', 'other'
    ));
EXCEPTION WHEN others THEN NULL;
END $$;

-- Valid data point types
DO $$ 
BEGIN
  ALTER TABLE data_points DROP CONSTRAINT IF EXISTS valid_data_point_type;
  ALTER TABLE data_points ADD CONSTRAINT valid_data_point_type 
    CHECK (type IN (
      'phone', 'email', 'bank_account', 'whatsapp', 'telegram', 
      'ewallet', 'social_media', 'website', 'crypto_wallet', 
      'name', 'company'
    ));
EXCEPTION WHEN others THEN NULL;
END $$;

-- Valid currencies
DO $$ 
BEGIN
  ALTER TABLE reports DROP CONSTRAINT IF EXISTS valid_currency;
  ALTER TABLE reports ADD CONSTRAINT valid_currency 
    CHECK (currency IS NULL OR currency IN ('MYR', 'USD', 'SGD', 'CNY', 'USDT', 'BTC', 'ETH'));
EXCEPTION WHEN others THEN NULL;
END $$;

-- ============================================
-- 5. FULL-TEXT SEARCH ON DESCRIPTIONS
-- ============================================

-- Add generated tsvector column for full-text search
ALTER TABLE reports 
  ADD COLUMN IF NOT EXISTS description_tsv tsvector 
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(description, ''))) STORED;

-- Index for full-text search
CREATE INDEX IF NOT EXISTS idx_reports_description_fts 
  ON reports USING gin(description_tsv);

-- ============================================
-- 6. BETTER AUDIT LOGGING
-- ============================================

-- Add structured fields to audit logs
ALTER TABLE audit_logs 
  ADD COLUMN IF NOT EXISTS user_agent TEXT;

ALTER TABLE audit_logs 
  ADD COLUMN IF NOT EXISTS country_code TEXT;

ALTER TABLE audit_logs 
  ADD COLUMN IF NOT EXISTS success BOOLEAN DEFAULT TRUE;

-- Index for querying audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================
-- 7. PLATFORM STATISTICS VIEW
-- ============================================

-- Materialized view for fast stats (refresh periodically)
DROP MATERIALIZED VIEW IF EXISTS platform_stats;
CREATE MATERIALIZED VIEW platform_stats AS
SELECT 
  COUNT(*) as total_reports,
  COUNT(*) FILTER (WHERE is_verified) as verified_reports,
  COUNT(*) FILTER (WHERE is_disputed) as disputed_reports,
  COUNT(DISTINCT id) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as reports_last_30_days,
  COALESCE(SUM(amount_lost), 0) as total_amount_lost,
  (SELECT COUNT(*) FROM data_points) as total_data_points,
  (SELECT COUNT(*) FROM disputes) as total_disputes,
  (SELECT COUNT(*) FROM audit_logs WHERE action = 'search') as total_searches
FROM reports
WHERE status = 'active';

-- Index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_platform_stats ON platform_stats (total_reports);

-- Function to refresh stats (call periodically or on-demand)
CREATE OR REPLACE FUNCTION refresh_platform_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY platform_stats;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. SCAM TYPE STATISTICS VIEW
-- ============================================

DROP MATERIALIZED VIEW IF EXISTS scam_type_stats;
CREATE MATERIALIZED VIEW scam_type_stats AS
SELECT 
  scam_type,
  COUNT(*) as report_count,
  COUNT(*) FILTER (WHERE is_verified) as verified_count,
  COALESCE(SUM(amount_lost), 0) as total_lost,
  MAX(created_at) as latest_report
FROM reports
WHERE status = 'active'
GROUP BY scam_type
ORDER BY report_count DESC;

-- ============================================
-- 9. RATE LIMITING SUPPORT
-- ============================================

-- Table for tracking rate limits
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_hash TEXT NOT NULL,
  action TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ip_hash, action, window_start)
);

-- Index for rate limit lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup 
  ON rate_limits(ip_hash, action, window_start);

-- Auto-cleanup old rate limit records (older than 1 hour)
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- RLS for rate limits
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow rate limit operations" ON rate_limits
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 10. STORAGE SECURITY IMPROVEMENTS
-- ============================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Allow public uploads to evidence" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from evidence" ON storage.objects;

-- More restrictive upload policy (only images, size checked in app)
CREATE POLICY "Allow image uploads to evidence" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'evidence' 
    AND (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp'))
  );

-- Public read is fine
CREATE POLICY "Allow public read from evidence" ON storage.objects
  FOR SELECT USING (bucket_id = 'evidence');

-- ============================================
-- 11. HELPER FUNCTIONS
-- ============================================

-- Function for fuzzy phone search (handles format variations)
CREATE OR REPLACE FUNCTION normalize_phone(phone TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Remove all non-digits
  RETURN regexp_replace(phone, '[^0-9]', '', 'g');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function for similarity search
CREATE OR REPLACE FUNCTION search_similar(search_term TEXT, threshold FLOAT DEFAULT 0.3)
RETURNS TABLE(
  report_id UUID,
  data_point_type TEXT,
  data_point_value TEXT,
  similarity_score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dp.report_id,
    dp.type,
    dp.value,
    similarity(dp.normalized_value, lower(search_term)) as score
  FROM data_points dp
  JOIN reports r ON r.id = dp.report_id
  WHERE 
    r.status = 'active'
    AND similarity(dp.normalized_value, lower(search_term)) > threshold
  ORDER BY score DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INITIAL STATS REFRESH
-- ============================================

-- Refresh the materialized views
REFRESH MATERIALIZED VIEW platform_stats;
REFRESH MATERIALIZED VIEW scam_type_stats;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT SELECT ON platform_stats TO anon;
GRANT SELECT ON scam_type_stats TO anon;
GRANT ALL ON rate_limits TO anon;
