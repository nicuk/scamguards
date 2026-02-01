-- ScamGuard Malaysia - Seed Data
-- Run this after the initial schema to add demo data

-- Sample Reports (Malaysian scam examples)

-- 1. Macau Scam
INSERT INTO reports (id, scam_type, description, platform, is_verified, status)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'macau_scam',
  'Received call claiming to be from Polis DiRaja Malaysia. Said my IC was used for illegal activities and demanded RM 5,000 to "clear my name".',
  'Phone Call',
  true,
  'active'
);

INSERT INTO data_points (report_id, type, value, normalized_value)
VALUES 
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'phone', '+60 12-345 6789', '60123456789'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'name', 'Sergeant Ahmad', 'sergeant ahmad');

-- 2. Love Scam
INSERT INTO reports (id, scam_type, description, platform, is_verified, status)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'love_scam',
  'Met on dating app. After 2 months claimed to be stuck overseas and needed RM 15,000 for medical emergency. Blocked me after transfer.',
  'WhatsApp',
  false,
  'active'
);

INSERT INTO data_points (report_id, type, value, normalized_value)
VALUES 
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'whatsapp', '+60 17-987 6543', '60179876543'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'name', 'Michael Wong', 'michael wong'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'bank_account', 'Maybank 1234567890', '1234567890');

-- 3. E-commerce Scam (One Piece TCG)
INSERT INTO reports (id, scam_type, description, platform, is_verified, status)
VALUES (
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'collectibles_scam',
  'Sold fake One Piece TCG cards on Carousell. Claimed to be original OP-01 booster box but received Chinese counterfeits. Seller disappeared after payment.',
  'Carousell',
  true,
  'active'
);

INSERT INTO data_points (report_id, type, value, normalized_value)
VALUES 
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'phone', '011-2233 4455', '601122334455'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'social_media', 'carousell.com/u/tcg_collector_my', 'carousell.com/u/tcg_collector_my'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'bank_account', 'CIMB 7654321098', '7654321098');

-- 4. Investment Scam
INSERT INTO reports (id, scam_type, description, platform, is_verified, status)
VALUES (
  'd4e5f6a7-b8c9-0123-defa-234567890123',
  'investment_scam',
  'Promised 30% monthly returns on forex trading. Initially allowed small withdrawals, then locked account when tried to withdraw larger amount.',
  'Telegram',
  false,
  'active'
);

INSERT INTO data_points (report_id, type, value, normalized_value)
VALUES 
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'telegram', '@forexking_my', 'forexking_my'),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'website', 'https://forexpro-invest.com', 'forexpro-invest.com'),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'crypto_wallet', '0x1234567890abcdef1234567890abcdef12345678', '0x1234567890abcdef1234567890abcdef12345678');

-- 5. Gold/Precious Metals Scam
INSERT INTO reports (id, scam_type, description, platform, is_verified, status)
VALUES (
  'e5f6a7b8-c9d0-1234-efab-345678901234',
  'precious_metals_scam',
  'Gold investment scheme promising 15% annual returns. Company stopped responding after collecting RM 50,000. Office address was fake.',
  'Facebook',
  true,
  'active'
);

INSERT INTO data_points (report_id, type, value, normalized_value)
VALUES 
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'phone', '03-8765 4321', '6087654321'),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'company', 'Golden Trust Investment Sdn Bhd', 'golden trust investment sdn bhd'),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'email', 'invest@goldentrust-my.com', 'invest@goldentrust-my.com'),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'bank_account', 'Public Bank 3456789012', '3456789012');

-- 6. Parcel Scam
INSERT INTO reports (id, scam_type, description, platform, is_verified, status)
VALUES (
  'f6a7b8c9-d0e1-2345-fabc-456789012345',
  'parcel_scam',
  'Received SMS claiming parcel held at customs. Link led to fake website asking for RM 200 customs fee and credit card details.',
  'SMS',
  false,
  'active'
);

INSERT INTO data_points (report_id, type, value, normalized_value)
VALUES 
  ('f6a7b8c9-d0e1-2345-fabc-456789012345', 'phone', '+60 16-555 7777', '60165557777'),
  ('f6a7b8c9-d0e1-2345-fabc-456789012345', 'website', 'http://pos-laju-my.com/track', 'pos-laju-my.com/track');

-- 7. Job Scam  
INSERT INTO reports (id, scam_type, description, platform, is_verified, status)
VALUES (
  'a7b8c9d0-e1f2-3456-abcd-567890123456',
  'job_scam',
  'Fake job offer requiring RM 500 registration fee for "guaranteed" data entry work from home. Company does not exist.',
  'WhatsApp',
  false,
  'active'
);

INSERT INTO data_points (report_id, type, value, normalized_value)
VALUES 
  ('a7b8c9d0-e1f2-3456-abcd-567890123456', 'phone', '019-888 9999', '60198889999'),
  ('a7b8c9d0-e1f2-3456-abcd-567890123456', 'email', 'hr@digitalwork-my.com', 'hr@digitalwork-my.com'),
  ('a7b8c9d0-e1f2-3456-abcd-567890123456', 'company', 'Digital Work Solutions', 'digital work solutions');
