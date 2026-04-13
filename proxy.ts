import { type NextRequest, NextResponse } from "next/server";
import { createProxyClient } from "@/lib/supabase/proxy";
import { supabaseAdmin } from "@/lib/supabase/admin";

const PUBLIC_ROUTES = [
  "/api/auth/signup",
  "/api/auth/signup-pro-trial",
  "/api/auth/signin",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/callback",
  "/api/health",
  "/api/billing/webhook",
];

const ADMIN_PREFIX = "/api/admin";

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Stripe webhook must bypass auth entirely (raw body, no cookies)
  if (pathname === "/api/billing/webhook") {
    return NextResponse.next();
  }

  // Refresh Supabase session on every request
  const { supabaseResponse, user } = await createProxyClient(request);

  // Public routes don't require auth
  if (isPublicRoute(pathname)) {
    return supabaseResponse;
  }

  // All other API routes require authentication
  if (pathname.startsWith("/api/") && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user && pathname.startsWith("/api/")) {
    // Load profile for trial check and admin gating
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 403 }
      );
    }

    // Trial expiry auto-downgrade
    if (
      profile.tier === "pro" &&
      profile.trial_expires_at &&
      new Date(profile.trial_expires_at).getTime() <= Date.now()
    ) {
      const { data: subscription } = await supabaseAdmin
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .in("status", ["active", "trialing"])
        .maybeSingle();

      if (!subscription) {
        await supabaseAdmin
          .from("profiles")
          .update({ tier: "free", trial_expires_at: null })
          .eq("user_id", user.id);
      }
    }

    // Admin route protection
    if (
      pathname.startsWith(ADMIN_PREFIX) &&
      profile.role !== "admin" &&
      profile.role !== "super_admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/api/:path*"],
};
