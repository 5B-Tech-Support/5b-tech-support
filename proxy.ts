import { type NextRequest, NextResponse } from "next/server";
import { createProxyClient } from "@/lib/supabase/proxy";
import { supabaseAdmin } from "@/lib/supabase/admin";

const PUBLIC_API_ROUTES = [
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

function isPublicApiRoute(pathname: string): boolean {
  return PUBLIC_API_ROUTES.some((route) => pathname === route);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Stripe webhook must bypass entirely (raw body, no cookies)
  if (pathname === "/api/billing/webhook") {
    return NextResponse.next();
  }

  // Refresh Supabase session on every matched request
  const { supabaseResponse, user } = await createProxyClient(request);

  // Non-API pages: just refresh session, never block
  if (!pathname.startsWith("/api/")) {
    return supabaseResponse;
  }

  // Public API routes don't require auth
  if (isPublicApiRoute(pathname)) {
    return supabaseResponse;
  }

  // All other API routes require authentication
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
