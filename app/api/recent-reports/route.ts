import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function maskValue(type: string, value: string): string {
  if (!value) return "***";

  switch (type) {
    case "phone":
    case "whatsapp": {
      const digits = value.replace(/\D/g, "");
      if (digits.length >= 8) {
        return digits.slice(0, 3) + "-XXX-" + digits.slice(-3);
      }
      return value.slice(0, 3) + "***";
    }
    case "email": {
      const [local, domain] = value.split("@");
      if (local && domain) {
        return local.slice(0, 2) + "***@" + domain;
      }
      return "***@***.com";
    }
    case "bank_account": {
      const d = value.replace(/\D/g, "");
      if (d.length >= 6) {
        return d.slice(0, 3) + "****" + d.slice(-3);
      }
      return "***";
    }
    default:
      if (value.length > 4) {
        return value.slice(0, 2) + "***" + value.slice(-2);
      }
      return "***";
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: reports, error } = await supabase
      .from("reports")
      .select("id, scam_type, created_at, data_points(type, value)")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error || !reports) {
      return NextResponse.json({ reports: [] });
    }

    const masked = reports.map((r) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dp = (r.data_points as any[])?.[0];
      return {
        id: r.id,
        scamType: r.scam_type,
        createdAt: r.created_at,
        dataPointType: dp?.type || null,
        maskedValue: dp ? maskValue(dp.type, dp.value) : null,
      };
    });

    return NextResponse.json({ reports: masked });
  } catch {
    return NextResponse.json({ reports: [] });
  }
}
