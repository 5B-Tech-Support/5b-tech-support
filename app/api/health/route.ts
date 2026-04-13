import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const checks = {
    auth_configured: !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
    stripe_configured: !!(
      process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_PRO
    ),
    supabase_connected: false,
  };

  try {
    const { error } = await supabaseAdmin.from("profiles").select("user_id").limit(1);
    checks.supabase_connected = !error;
  } catch {
    checks.supabase_connected = false;
  }

  const allHealthy = Object.values(checks).every(Boolean);

  return NextResponse.json(
    { status: allHealthy ? "healthy" : "degraded", checks },
    { status: allHealthy ? 200 : 503 }
  );
}
