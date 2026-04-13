import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createOrFetchProfile, logAudit } from "@/lib/auth-helpers";

export async function POST(request: Request) {
  try {
    const { email, password, full_name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      const profile = await createOrFetchProfile(data.user.id, email);
      await logAudit(data.user.id, "signup", { tier: "free" });

      return NextResponse.json({
        user: data.user,
        profile,
        message: "Check your email for a verification link",
      });
    }

    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
