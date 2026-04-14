import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=invalid_code`);
  }

  // Activate account on first email verification
  if (data.user) {
    await supabaseAdmin
      .from("profiles")
      .update({ account_status: "active" })
      .eq("user_id", data.user.id)
      .eq("account_status", "email_unverified");
  }

  return NextResponse.redirect(`${origin}${next}`);
}
