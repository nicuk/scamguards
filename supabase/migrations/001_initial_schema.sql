-- ScamGuard Malaysia - Initial Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Reports table: User-submitted scam reports
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

-- Data Points table: Searchable identifiers linked to reports
CREATE TABLE IF NOT EXISTS data_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  normalized_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disputes table: Challenges to reports
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'rejected'))
);

-- Audit Logs table: Action tracking
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action TEXT NOT NULL,
  ip_hash TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for search performance
CREATE INDEX IF NOT EXISTS idx_data_points_normalized ON data_points(normalized_value);
CREATE INDEX IF NOT EXISTS idx_data_points_type ON data_points(type);
CREATE INDEX IF NOT EXISTS idx_data_points_report_id ON data_points(report_id);
CREATE INDEX IF NOT EXISTS idx_reports_scam_type ON reports(scam_type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_disputes_report_id ON disputes(report_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);

-- Enable Row Level Security (RLS)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow anonymous read/insert for public use
-- Reports: Anyone can read active reports, anyone can insert
CREATE POLICY "Allow public read of active reports" ON reports
  FOR SELECT USING (status = 'active');

CREATE POLICY "Allow public insert of reports" ON reports
  FOR INSERT WITH CHECK (true);

-- Data Points: Anyone can read, anyone can insert
CREATE POLICY "Allow public read of data_points" ON data_points
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert of data_points" ON data_points
  FOR INSERT WITH CHECK (true);

-- Disputes: Anyone can insert (for submitting disputes)
CREATE POLICY "Allow public insert of disputes" ON disputes
  FOR INSERT WITH CHECK (true);

-- Audit Logs: Only insert allowed (no read for public)
CREATE POLICY "Allow public insert of audit_logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Grant permissions to anon role
GRANT SELECT, INSERT ON reports TO anon;
GRANT SELECT, INSERT ON data_points TO anon;
GRANT INSERT ON disputes TO anon;
GRANT INSERT ON audit_logs TO anon;
GRANT UPDATE ON reports TO anon;

-- Function to update report disputed status when dispute is created
CREATE OR REPLACE FUNCTION update_report_disputed_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE reports SET is_disputed = TRUE WHERE id = NEW.report_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update disputed status
CREATE TRIGGER on_dispute_created
  AFTER INSERT ON disputes
  FOR EACH ROW
  EXECUTE FUNCTION update_report_disputed_status();

-- Storage bucket for evidence files
-- Note: Run this in Supabase Dashboard > Storage > Create bucket
-- Bucket name: evidence
-- Public: Yes (for displaying images in results)
-- Or run via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('evidence', 'evidence', true);

-- Storage policy to allow uploads
-- CREATE POLICY "Allow public uploads" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'evidence');

-- CREATE POLICY "Allow public reads" ON storage.objects
--   FOR SELECT USING (bucket_id = 'evidence');
