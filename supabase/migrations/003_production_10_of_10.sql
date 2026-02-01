-- ScamGuard Malaysia - 10/10 Production Schema
-- Final hardening for enterprise-grade deployment

-- ============================================
-- 1. TABLE PARTITIONING PREPARATION
-- ============================================

-- For reports table - partition by created_at (monthly)
-- Note: This requires recreating the table. For existing data, 
-- we prepare the structure for future partitioning.

-- Create partitioned reports table structure (for new deployments)
-- Uncomment and run on fresh database:
/*
CREATE TABLE reports_partitioned (
  id UUID DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scam_type TEXT NOT NULL,
  description TEXT,
  platform TEXT,
  evidence_url TEXT,
  amount_lost DECIMAL(12,2),
  currency TEXT DEFAULT 'MYR',
  reporter_hash TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_disputed BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE reports_y2024m01 PARTITION OF reports_partitioned
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE reports_y2024m02 PARTITION OF reports_partitioned
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
-- ... add more as needed
*/

-- For now, add optimized indexes for time-based queries
CREATE INDEX IF NOT EXISTS idx_reports_created_at_desc 
  ON reports(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reports_composite 
  ON reports(status, created_at DESC) 
  WHERE status = 'active';

-- ============================================
-- 2. ADVANCED RATE LIMITING
-- ============================================

-- Enhanced rate limits table with sliding window support
DROP TABLE IF EXISTS rate_limits CASCADE;

CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL,           -- IP hash, user ID, etc.
  identifier_type TEXT NOT NULL,      -- 'ip', 'fingerprint', 'user'
  action TEXT NOT NULL,               -- 'search', 'submit', 'dispute'
  requests INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  window_end TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 hour',
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier, identifier_type, action, window_start)
);

-- Indexes for fast lookups
CREATE INDEX idx_rate_limits_lookup 
  ON rate_limits(identifier, identifier_type, action, window_start DESC);

CREATE INDEX idx_rate_limits_blocked 
  ON rate_limits(identifier, blocked_until) 
  WHERE blocked_until IS NOT NULL;

-- RLS
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all rate limit operations" ON rate_limits
  FOR ALL USING (true) WITH CHECK (true);

-- Function to check and increment rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier TEXT,
  p_identifier_type TEXT,
  p_action TEXT,
  p_limit INTEGER,
  p_window_minutes INTEGER DEFAULT 60
) RETURNS TABLE(
  allowed BOOLEAN,
  current_count INTEGER,
  reset_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  v_window_start TIMESTAMP WITH TIME ZONE;
  v_current_count INTEGER;
  v_blocked_until TIMESTAMP WITH TIME ZONE;
BEGIN
  v_window_start := date_trunc('hour', NOW());
  
  -- Check if blocked
  SELECT rl.blocked_until INTO v_blocked_until
  FROM rate_limits rl
  WHERE rl.identifier = p_identifier
    AND rl.identifier_type = p_identifier_type
    AND rl.blocked_until > NOW()
  LIMIT 1;
  
  IF v_blocked_until IS NOT NULL THEN
    RETURN QUERY SELECT FALSE, p_limit, v_blocked_until;
    RETURN;
  END IF;
  
  -- Upsert rate limit record
  INSERT INTO rate_limits (identifier, identifier_type, action, requests, window_start)
  VALUES (p_identifier, p_identifier_type, p_action, 1, v_window_start)
  ON CONFLICT (identifier, identifier_type, action, window_start)
  DO UPDATE SET requests = rate_limits.requests + 1
  RETURNING requests INTO v_current_count;
  
  -- Check if over limit
  IF v_current_count > p_limit THEN
    -- Block for escalating time based on violations
    UPDATE rate_limits
    SET blocked_until = NOW() + (INTERVAL '1 minute' * LEAST(v_current_count - p_limit, 60))
    WHERE identifier = p_identifier
      AND identifier_type = p_identifier_type
      AND action = p_action
      AND window_start = v_window_start;
    
    RETURN QUERY SELECT FALSE, v_current_count, v_window_start + INTERVAL '1 hour';
  END IF;
  
  RETURN QUERY SELECT TRUE, v_current_count, v_window_start + INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Cleanup function for old rate limit records
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits 
  WHERE window_end < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 3. MODERATION SYSTEM
-- ============================================

-- Moderation queue for flagged reports
CREATE TABLE IF NOT EXISTS moderation_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,               -- 'auto_flagged', 'user_reported', 'duplicate', 'spam'
  priority INTEGER DEFAULT 5,         -- 1 (highest) to 10 (lowest)
  status TEXT DEFAULT 'pending',      -- 'pending', 'approved', 'rejected', 'escalated'
  notes TEXT,
  moderator_id TEXT,                  -- Future: link to admin users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_moderation_queue_status ON moderation_queue(status, priority, created_at);
CREATE INDEX idx_moderation_queue_report ON moderation_queue(report_id);

-- RLS for moderation (restrict to authenticated users in future)
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;

-- For now, allow inserts (auto-flagging)
CREATE POLICY "Allow moderation inserts" ON moderation_queue
  FOR INSERT WITH CHECK (true);

-- Auto-flag suspicious reports
CREATE OR REPLACE FUNCTION auto_flag_suspicious_report()
RETURNS TRIGGER AS $$
DECLARE
  v_similar_count INTEGER;
  v_reporter_recent_count INTEGER;
BEGIN
  -- Flag if reporter has submitted many reports recently
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
  
  -- Flag if similar data points exist in many reports (potential spam)
  -- This will be checked after data points are inserted
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_flag_report ON reports;
CREATE TRIGGER auto_flag_report
  AFTER INSERT ON reports
  FOR EACH ROW
  EXECUTE FUNCTION auto_flag_suspicious_report();

-- ============================================
-- 4. REPORTER REPUTATION SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS reporter_reputation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_hash TEXT UNIQUE NOT NULL,
  total_reports INTEGER DEFAULT 0,
  verified_reports INTEGER DEFAULT 0,
  disputed_reports INTEGER DEFAULT 0,
  reports_removed INTEGER DEFAULT 0,
  reputation_score DECIMAL(5,2) DEFAULT 50.00,  -- 0-100 scale
  first_report_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_report_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_trusted BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_reporter_reputation_hash ON reporter_reputation(reporter_hash);
CREATE INDEX idx_reporter_reputation_score ON reporter_reputation(reputation_score DESC);

-- RLS
ALTER TABLE reporter_reputation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow reputation operations" ON reporter_reputation
  FOR ALL USING (true) WITH CHECK (true);

-- Function to update reporter reputation
CREATE OR REPLACE FUNCTION update_reporter_reputation()
RETURNS TRIGGER AS $$
DECLARE
  v_reputation DECIMAL(5,2);
BEGIN
  -- Insert or update reporter record
  INSERT INTO reporter_reputation (reporter_hash, total_reports, last_report_at)
  VALUES (NEW.reporter_hash, 1, NOW())
  ON CONFLICT (reporter_hash) DO UPDATE SET
    total_reports = reporter_reputation.total_reports + 1,
    verified_reports = reporter_reputation.verified_reports + 
      CASE WHEN NEW.is_verified THEN 1 ELSE 0 END,
    last_report_at = NOW();
  
  -- Calculate reputation score
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

-- ============================================
-- 5. DUPLICATE DETECTION
-- ============================================

-- Function to find potential duplicate reports
CREATE OR REPLACE FUNCTION find_duplicate_reports(p_report_id UUID)
RETURNS TABLE(
  duplicate_report_id UUID,
  similarity_score DECIMAL(5,2),
  matching_points INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH report_points AS (
    SELECT normalized_value, type
    FROM data_points
    WHERE report_id = p_report_id
  ),
  other_reports AS (
    SELECT 
      dp.report_id,
      COUNT(*) as matching,
      COUNT(*) * 100.0 / GREATEST(
        (SELECT COUNT(*) FROM report_points),
        (SELECT COUNT(*) FROM data_points dp2 WHERE dp2.report_id = dp.report_id)
      ) as score
    FROM data_points dp
    JOIN report_points rp ON dp.normalized_value = rp.normalized_value AND dp.type = rp.type
    WHERE dp.report_id != p_report_id
    GROUP BY dp.report_id
    HAVING COUNT(*) >= 2
  )
  SELECT 
    or_.report_id,
    or_.score::DECIMAL(5,2),
    or_.matching::INTEGER
  FROM other_reports or_
  WHERE or_.score > 50
  ORDER BY or_.score DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. ANALYTICS VIEWS
-- ============================================

-- Daily stats view
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

CREATE UNIQUE INDEX idx_daily_stats_date ON daily_stats(date);

-- Scam trends view
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

-- Platform breakdown
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

-- ============================================
-- 7. DATA INTEGRITY CONSTRAINTS
-- ============================================

-- Ensure amount_lost is positive
ALTER TABLE reports DROP CONSTRAINT IF EXISTS positive_amount;
ALTER TABLE reports ADD CONSTRAINT positive_amount 
  CHECK (amount_lost IS NULL OR amount_lost >= 0);

-- Ensure dates are reasonable
ALTER TABLE reports DROP CONSTRAINT IF EXISTS valid_dates;
ALTER TABLE reports ADD CONSTRAINT valid_dates 
  CHECK (created_at <= NOW() + INTERVAL '1 day');

-- Ensure normalized values are actually normalized
ALTER TABLE data_points DROP CONSTRAINT IF EXISTS normalized_format;
ALTER TABLE data_points ADD CONSTRAINT normalized_format 
  CHECK (normalized_value = lower(trim(normalized_value)));

-- ============================================
-- 8. SEARCH OPTIMIZATION
-- ============================================

-- Composite index for common search pattern
CREATE INDEX IF NOT EXISTS idx_data_points_search 
  ON data_points(type, normalized_value, report_id);

-- Partial index for active reports only
CREATE INDEX IF NOT EXISTS idx_data_points_active 
  ON data_points(normalized_value, type)
  WHERE report_id IN (SELECT id FROM reports WHERE status = 'active');

-- GIN index for array operations (future use)
CREATE INDEX IF NOT EXISTS idx_audit_metadata 
  ON audit_logs USING gin(metadata);

-- ============================================
-- 9. SCHEDULED MAINTENANCE FUNCTIONS
-- ============================================

-- Master cleanup function (call daily via cron/pg_cron)
CREATE OR REPLACE FUNCTION daily_maintenance()
RETURNS void AS $$
BEGIN
  -- Cleanup old rate limits
  PERFORM cleanup_old_rate_limits();
  
  -- Refresh materialized views
  REFRESH MATERIALIZED VIEW CONCURRENTLY platform_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY scam_type_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY daily_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY scam_trends;
  REFRESH MATERIALIZED VIEW CONCURRENTLY platform_breakdown;
  
  -- Archive old audit logs (keep 90 days)
  DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Update statistics
  ANALYZE reports;
  ANALYZE data_points;
  ANALYZE audit_logs;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 10. API HELPER FUNCTIONS
-- ============================================

-- Get report with all related data
CREATE OR REPLACE FUNCTION get_report_details(p_report_id UUID)
RETURNS TABLE(
  report JSONB,
  data_points JSONB,
  disputes JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_jsonb(r.*) as report,
    COALESCE(
      (SELECT jsonb_agg(to_jsonb(dp.*)) FROM data_points dp WHERE dp.report_id = r.id),
      '[]'::jsonb
    ) as data_points,
    COALESCE(
      (SELECT jsonb_agg(to_jsonb(d.*)) FROM disputes d WHERE d.report_id = r.id),
      '[]'::jsonb
    ) as disputes
  FROM reports r
  WHERE r.id = p_report_id;
END;
$$ LANGUAGE plpgsql;

-- Search with ranking
CREATE OR REPLACE FUNCTION search_reports(
  p_search_value TEXT,
  p_search_type TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE(
  report_id UUID,
  scam_type TEXT,
  platform TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  is_verified BOOLEAN,
  is_disputed BOOLEAN,
  match_type TEXT,
  match_value TEXT,
  relevance_score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (r.id)
    r.id,
    r.scam_type,
    r.platform,
    r.created_at,
    r.is_verified,
    r.is_disputed,
    dp.type,
    dp.value,
    CASE 
      WHEN dp.normalized_value = lower(p_search_value) THEN 1.0
      WHEN dp.normalized_value ILIKE '%' || p_search_value || '%' THEN 0.8
      ELSE similarity(dp.normalized_value, lower(p_search_value))
    END as score
  FROM reports r
  JOIN data_points dp ON dp.report_id = r.id
  WHERE r.status = 'active'
    AND (p_search_type IS NULL OR dp.type = p_search_type)
    AND (
      dp.normalized_value = lower(p_search_value)
      OR dp.normalized_value ILIKE '%' || p_search_value || '%'
      OR similarity(dp.normalized_value, lower(p_search_value)) > 0.3
    )
  ORDER BY r.id, score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT SELECT ON daily_stats TO anon;
GRANT SELECT ON scam_trends TO anon;
GRANT SELECT ON platform_breakdown TO anon;
GRANT SELECT ON moderation_queue TO anon;
GRANT SELECT ON reporter_reputation TO anon;
GRANT EXECUTE ON FUNCTION check_rate_limit TO anon;
GRANT EXECUTE ON FUNCTION search_reports TO anon;

-- ============================================
-- INITIAL REFRESH
-- ============================================

-- Refresh all materialized views
SELECT daily_maintenance();
