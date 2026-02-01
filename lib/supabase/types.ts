export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      reports: {
        Row: {
          id: string;
          created_at: string;
          scam_type: string;
          description: string | null;
          platform: string | null;
          evidence_url: string | null;
          is_verified: boolean;
          is_disputed: boolean;
          status: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          scam_type: string;
          description?: string | null;
          platform?: string | null;
          evidence_url?: string | null;
          is_verified?: boolean;
          is_disputed?: boolean;
          status?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          scam_type?: string;
          description?: string | null;
          platform?: string | null;
          evidence_url?: string | null;
          is_verified?: boolean;
          is_disputed?: boolean;
          status?: string;
        };
      };
      data_points: {
        Row: {
          id: string;
          report_id: string;
          type: string;
          value: string;
          normalized_value: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          type: string;
          value: string;
          normalized_value: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          type?: string;
          value?: string;
          normalized_value?: string;
          created_at?: string;
        };
      };
      disputes: {
        Row: {
          id: string;
          report_id: string;
          created_at: string;
          reason: string;
          contact_email: string;
          status: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          created_at?: string;
          reason: string;
          contact_email: string;
          status?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          created_at?: string;
          reason?: string;
          contact_email?: string;
          status?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          created_at: string;
          action: string;
          ip_hash: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          action: string;
          ip_hash?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          action?: string;
          ip_hash?: string | null;
          metadata?: Json;
        };
      };
    };
  };
}

// Helper types
export type Report = Database["public"]["Tables"]["reports"]["Row"];
export type DataPoint = Database["public"]["Tables"]["data_points"]["Row"];
export type Dispute = Database["public"]["Tables"]["disputes"]["Row"];
export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
