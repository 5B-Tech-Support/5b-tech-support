import { supabaseAdmin } from "@/lib/supabase/admin";

const GRANT_MINUTES = 15;

export async function hasValidBillingGrant(userId: string): Promise<boolean> {
  const now = new Date().toISOString();
  const { data } = await supabaseAdmin
    .from("billing_access_grants")
    .select("id")
    .eq("user_id", userId)
    .gt("expires_at", now)
    .limit(1)
    .maybeSingle();

  return !!data;
}

export async function createBillingGrant(userId: string): Promise<void> {
  const expiresAt = new Date(Date.now() + GRANT_MINUTES * 60 * 1000).toISOString();
  await supabaseAdmin.from("billing_access_grants").delete().eq("user_id", userId);
  await supabaseAdmin.from("billing_access_grants").insert({
    user_id: userId,
    expires_at: expiresAt,
  });
}
