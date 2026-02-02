"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Search,
  ExternalLink,
  RefreshCw,
  Trash2,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SCAM_TYPES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

interface Report {
  id: string;
  scam_type: string;
  platform: string;
  description: string;
  status: string;
  is_verified: boolean;
  created_at: string;
  evidence_urls: string[];
  amount_lost: number | null;
  currency: string;
  data_points: {
    id: string;
    type: string;
    value: string;
  }[];
}

interface Stats {
  totalReports: number;
  verifiedReports: number;
  totalSearches: number;
  pendingModeration: number;
}

interface AdminUser {
  email: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser?.email) {
          router.push("/admin/login");
          return;
        }

        // Verify admin whitelist
        const response = await fetch("/api/admin/check-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: authUser.email }),
        });

        if (!response.ok) {
          await supabase.auth.signOut();
          router.push("/admin/login");
          return;
        }

        setUser({ email: authUser.email });
        setAuthorized(true);

        // Fetch data
        await fetchData();
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const fetchData = async () => {
    try {
      const supabase = createClient();
      
      // Fetch reports with data points
      const { data: reportsData, error: reportsError } = await supabase
        .from("reports")
        .select(`
          id,
          scam_type,
          platform,
          description,
          status,
          is_verified,
          created_at,
          evidence_urls,
          amount_lost,
          currency,
          data_points (
            id,
            type,
            value
          )
        `)
        .order("created_at", { ascending: false });

      if (!reportsError && reportsData) {
        setReports(reportsData as Report[]);
      }

      // Fetch stats
      const { count: totalReports } = await supabase
        .from("reports")
        .select("*", { count: "exact", head: true });

      const { count: verifiedReports } = await supabase
        .from("reports")
        .select("*", { count: "exact", head: true })
        .eq("is_verified", true);

      const { count: totalSearches } = await supabase
        .from("audit_logs")
        .select("*", { count: "exact", head: true })
        .eq("action", "search");

      setStats({
        totalReports: totalReports || 0,
        verifiedReports: verifiedReports || 0,
        totalSearches: totalSearches || 0,
        pendingModeration: 0,
      });
    } catch (error) {
      console.error("Fetch data error:", error);
    }
  };

  const handleVerify = async (reportId: string, verify: boolean) => {
    setActionLoading(reportId);
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from("reports")
        .update({ 
          is_verified: verify,
          status: verify ? "active" : "pending"
        })
        .eq("id", reportId);

      if (!error) {
        // Update local state
        setReports((prev) =>
          prev.map((r) =>
            r.id === reportId ? { ...r, is_verified: verify } : r
          )
        );
        if (selectedReport?.id === reportId) {
          setSelectedReport({ ...selectedReport, is_verified: verify });
        }
        
        // Update stats
        await fetchData();

        // Log action
        await supabase.from("audit_logs").insert({
          action: verify ? "admin_verify" : "admin_unverify",
          entity_type: "report",
          entity_id: reportId,
          details: { verified: verify, admin: user?.email },
        });
      }
    } catch (error) {
      console.error("Verify error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this report? This cannot be undone.")) {
      return;
    }
    
    setActionLoading(reportId);
    try {
      const supabase = createClient();

      // Delete related data_points first
      await supabase.from("data_points").delete().eq("report_id", reportId);
      
      // Delete disputes
      await supabase.from("disputes").delete().eq("report_id", reportId);

      // Delete the report
      const { error } = await supabase.from("reports").delete().eq("id", reportId);

      if (!error) {
        setReports((prev) => prev.filter((r) => r.id !== reportId));
        if (selectedReport?.id === reportId) {
          setSelectedReport(null);
        }

        // Log action
        await supabase.from("audit_logs").insert({
          action: "admin_delete",
          entity_type: "report",
          entity_id: reportId,
          details: { deleted: true, admin: user?.email },
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const refreshData = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  // Loading state
  if (loading || authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authorized - redirect handled in useEffect
  if (!authorized) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            ScamGuard Admin
          </h1>
          <p className="text-muted-foreground">Secure Administration Panel</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{user?.email}</span>
          </div>
          <Button onClick={refreshData} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleLogout} variant="ghost" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats?.totalReports || 0}</p>
                <p className="text-sm text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats?.verifiedReports || 0}</p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {(stats?.totalReports || 0) - (stats?.verifiedReports || 0)}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Search className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats?.totalSearches || 0}</p>
                <p className="text-sm text-muted-foreground">Searches</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>All Reports</CardTitle>
            <CardDescription>Click to view details and verify</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {reports.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No reports yet
                </p>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedReport?.id === report.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">
                            {SCAM_TYPES[report.scam_type as keyof typeof SCAM_TYPES] ||
                              report.scam_type}
                          </span>
                          {report.is_verified ? (
                            <Badge className="bg-green-500">Verified</Badge>
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {report.platform} • {report.data_points?.length || 0} data points
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(report.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Eye className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Report Details */}
        <Card>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
            <CardDescription>
              {selectedReport ? "Review and take action" : "Select a report to view"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedReport ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a report from the list</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center gap-2">
                  {selectedReport.is_verified ? (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending Review
                    </Badge>
                  )}
                </div>

                {/* Scam Type */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Scam Type
                  </h4>
                  <p className="font-medium">
                    {SCAM_TYPES[selectedReport.scam_type as keyof typeof SCAM_TYPES] ||
                      selectedReport.scam_type}
                  </p>
                </div>

                {/* Platform */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Platform
                  </h4>
                  <p>{selectedReport.platform || "Not specified"}</p>
                </div>

                {/* Amount Lost */}
                {selectedReport.amount_lost && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Amount Lost
                    </h4>
                    <p className="text-red-600 font-medium">
                      {selectedReport.currency} {selectedReport.amount_lost.toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </h4>
                  <p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg max-h-32 overflow-y-auto">
                    {selectedReport.description || "No description provided"}
                  </p>
                </div>

                {/* Data Points */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Data Points ({selectedReport.data_points?.length || 0})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedReport.data_points?.map((dp) => (
                      <div
                        key={dp.id}
                        className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded"
                      >
                        <Badge variant="outline" className="text-xs">
                          {dp.type}
                        </Badge>
                        <span className="font-mono truncate">{dp.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence */}
                {selectedReport.evidence_urls && selectedReport.evidence_urls.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Evidence ({selectedReport.evidence_urls.length} files)
                    </h4>
                    <div className="space-y-2">
                      {selectedReport.evidence_urls.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Evidence {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {!selectedReport.is_verified ? (
                    <Button
                      onClick={() => handleVerify(selectedReport.id, true)}
                      disabled={actionLoading === selectedReport.id}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify Report
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleVerify(selectedReport.id, false)}
                      disabled={actionLoading === selectedReport.id}
                      variant="outline"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Unverify
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(selectedReport.id)}
                    disabled={actionLoading === selectedReport.id}
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Metadata */}
                <div className="text-xs text-muted-foreground pt-2">
                  <p>ID: {selectedReport.id}</p>
                  <p>Created: {new Date(selectedReport.created_at).toLocaleString()}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
