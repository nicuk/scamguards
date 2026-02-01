-- ================================================
-- ScamGuard Malaysia - COMPLETE SCHEMA
-- Run this entire file in Supabase SQL Editor
-- ================================================

-- ============================================
-- MIGRATION 001: INITIAL SCHEMA
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scam_type TEXT NOT NULL,
  description TEXT,
  platform TEXT,
  evidence_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_disputed BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'under_review', 'removed'))
);

CREATE TABLE IF NOT EXISTS data_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  normalized_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'rejected'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action TEXT NOT NULL,
  ip_hash TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_data_points_normalized ON data_points(normalized_value);
CREATE INDEX IF NOT EXISTS idx_data_points_type ON data_points(type);
CREATE INDEX IF NOT EXISTS idx_data_points_report_id ON data_points(report_id);
CREATE INDEX IF NOT EXISTS idx_reports_scam_type ON reports(scam_type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_disputes_report_id ON disputes(report_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read of active reports" ON reports
  FOR SELECT USING (status = 'active');

CREATE POLICY "Allow public insert of reports" ON reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read of data_points" ON data_points
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert of data_points" ON data_points
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert of disputes" ON disputes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert of audit_logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Grants
GRANT SELECT, INSERT ON reports TO anon;
GRANT SELECT, INSERT ON data_points TO anon;
GRANT INSERT ON disputes TO anon;
GRANT INSERT ON audit_logs TO anon;
GRANT UPDATE ON reports TO anon;

-- Trigger for disputes
CREATE OR REPLACE FUNCTION update_report_disputed_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE reports SET is_disputed = TRUE WHERE id = NEW.report_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_dispute_created
  AFTER INSERT ON disputes
  FOR EACH ROW
  EXECUTE FUNCTION update_report_disputed_status();

-- ============================================
-- MIGRATION 002: PRODUCTION UPGRADE
-- ============================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_data_points_trgm 
  ON data_points USING gin (normalized_value gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_data_points_value_trgm 
  ON data_points USING gin (value gin_trgm_ops);

ALTER TABLE reports ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

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

ALTER TABLE reports ADD COLUMN IF NOT EXISTS reporter_hash TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS amount_lost DECIMAL(12,2);
ALTER TABLE reports ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'MYR';

-- Add tsvector column for full-text search
ALTER TABLE reports 
  ADD COLUMN IF NOT EXISTS description_tsv tsvector 
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(description, ''))) STORED;

CREATE INDEX IF NOT EXISTS idx_reports_description_fts ON reports USING gin(description_tsv);

-- Audit log improvements
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS country_code TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS success BOOLEAN DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Platform stats view
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

CREATE UNIQUE INDEX IF NOT EXISTS idx_platform_stats ON platform_stats (total_reports);

CREATE OR REPLACE FUNCTION refresh_platform_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY platform_stats;
END;
$$ LANGUAGE plpgsql;

-- Scam type stats
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

-- Helper functions
CREATE OR REPLACE FUNCTION normalize_phone(phone TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN regexp_replace(phone, '[^0-9]', '', 'g');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

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

GRANT SELECT ON platform_stats TO anon;
GRANT SELECT ON scam_type_stats TO anon;

-- ============================================
-- MIGRATION 003: 10/10 PRODUCTION
-- ============================================

CREATE INDEX IF NOT EXISTS idx_reports_created_at_desc ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_composite ON reports(status, created_at DESC) WHERE status = 'active';

-- Rate limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL,
  identifier_type TEXT NOT NULL,
  action TEXT NOT NULL,
  requests INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  window_end TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 hour',
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier, identifier_type, action, window_start)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup_v2 
  ON rate_limits(identifier, identifier_type, action, window_start DESC);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all rate limit operations" ON rate_limits
  FOR ALL USING (true) WITH CHECK (true);

-- Moderation queue
CREATE TABLE IF NOT EXISTS moderation_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  priority INTEGER DEFAULT 5,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  moderator_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_moderation_queue_status ON moderation_queue(status, priority, created_at);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_report ON moderation_queue(report_id);

ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow moderation inserts" ON moderation_queue
  FOR INSERT WITH CHECK (true);

-- Reporter reputation
CREATE TABLE IF NOT EXISTS reporter_reputation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_hash TEXT UNIQUE NOT NULL,
  total_reports INTEGER DEFAULT 0,
  verified_reports INTEGER DEFAULT 0,
  disputed_reports INTEGER DEFAULT 0,
  reports_removed INTEGER DEFAULT 0,
  reputation_score DECIMAL(5,2) DEFAULT 50.00,
  first_report_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_report_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_trusted BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_reporter_reputation_hash ON reporter_reputation(reporter_hash);
CREATE INDEX IF NOT EXISTS idx_reporter_reputation_score ON reporter_reputation(reputation_score DESC);

ALTER TABLE reporter_reputation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow reputation operations" ON reporter_reputation
  FOR ALL USING (true) WITH CHECK (true);

-- Auto-flag function
CREATE OR REPLACE FUNCTION auto_flag_suspicious_report()
RETURNS TRIGGER AS $$
DECLARE
  v_reporter_recent_count INTEGER;
BEGIN
  IF NEW.reporter_hash IS NOT NULL THEN
    SELECT COUNT(*) INTO v_reporter_recent_count
    FROM reports
    WHERE reporter_hash = NEW.reporter_hash
      AND created_at > NOW() - INTERVAL '1 hour';
    
    IF v_reporter_recent_count > 5 THEN
      INSERT INTO moderation_queue (report_id, reason, priority)
      VALUES (NEW.id, 'high_volume_reporter', 3);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_flag_report ON reports;
CREATE TRIGGER auto_flag_report
  AFTER INSERT ON reports
  FOR EACH ROW
  EXECUTE FUNCTION auto_flag_suspicious_report();

-- Update reputation function
CREATE OR REPLACE FUNCTION update_reporter_reputation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO reporter_reputation (reporter_hash, total_reports, last_report_at)
  VALUES (NEW.reporter_hash, 1, NOW())
  ON CONFLICT (reporter_hash) DO UPDATE SET
    total_reports = reporter_reputation.total_reports + 1,
    verified_reports = reporter_reputation.verified_reports + 
      CASE WHEN NEW.is_verified THEN 1 ELSE 0 END,
    last_report_at = NOW();
  
  UPDATE reporter_reputation SET
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
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_reputation_on_report ON reports;
CREATE TRIGGER update_reputation_on_report
  AFTER INSERT ON reports
  FOR EACH ROW
  WHEN (NEW.reporter_hash IS NOT NULL)
  EXECUTE FUNCTION update_reporter_reputation();

-- Analytics views
DROP MATERIALIZED VIEW IF EXISTS daily_stats;
CREATE MATERIALIZED VIEW daily_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as reports,
  COUNT(*) FILTER (WHERE is_verified) as verified,
  COUNT(*) FILTER (WHERE is_disputed) as disputed,
  COALESCE(SUM(amount_lost), 0) as total_lost,
  COUNT(DISTINCT reporter_hash) as unique_reporters
FROM reports
WHERE status = 'active'
  AND created_at > NOW() - INTERVAL '90 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);

DROP MATERIALIZED VIEW IF EXISTS scam_trends;
CREATE MATERIALIZED VIEW scam_trends AS
SELECT 
  scam_type,
  DATE_TRUNC('week', created_at) as week,
  COUNT(*) as count,
  COALESCE(SUM(amount_lost), 0) as amount_lost
FROM reports
WHERE status = 'active'
  AND created_at > NOW() - INTERVAL '52 weeks'
GROUP BY scam_type, DATE_TRUNC('week', created_at)
ORDER BY week DESC, count DESC;

DROP MATERIALIZED VIEW IF EXISTS platform_breakdown;
CREATE MATERIALIZED VIEW platform_breakdown AS
SELECT 
  COALESCE(platform, 'Unknown') as platform,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE is_verified) as verified,
  COALESCE(SUM(amount_lost), 0) as total_lost
FROM reports
WHERE status = 'active'
GROUP BY platform
ORDER BY count DESC;

-- Search indexes
CREATE INDEX IF NOT EXISTS idx_data_points_search ON data_points(type, normalized_value, report_id);
CREATE INDEX IF NOT EXISTS idx_audit_metadata ON audit_logs USING gin(metadata);

-- Grants
GRANT SELECT ON daily_stats TO anon;
GRANT SELECT ON scam_trends TO anon;
GRANT SELECT ON platform_breakdown TO anon;
GRANT SELECT ON moderation_queue TO anon;
GRANT SELECT ON reporter_reputation TO anon;
GRANT ALL ON rate_limits TO anon;

-- ============================================
-- REFRESH VIEWS (run at the end)
-- ============================================

REFRESH MATERIALIZED VIEW platform_stats;
REFRESH MATERIALIZED VIEW scam_type_stats;
REFRESH MATERIALIZED VIEW daily_stats;
REFRESH MATERIALIZED VIEW scam_trends;
REFRESH MATERIALIZED VIEW platform_breakdown;

-- ================================================
-- DONE! Now create the storage bucket manually:
-- Go to: Storage → New Bucket
-- Name: evidence
-- Public: YES
-- ================================================
