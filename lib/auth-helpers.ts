import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Profile, UserTier } from "@/types/database";

interface CreateProfileOptions {
  tier?: UserTier;
  trialDays?: number;
}

export async function createOrFetchProfile(
  userId: string,
  email: string,
  options: CreateProfileOptions = {}
): Promise<Profile> {
  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (existing) return existing as Profile;

  const trialExpiresAt =
    options.trialDays && options.tier === "pro"
      ? new Date(Date.now() + options.trialDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

  const { data: created, error } = await supabaseAdmin
    .from("profiles")
    .insert({
      user_id: userId,
      email,
      tier: options.tier ?? "free",
      account_status: "email_unverified",
      support_priority: options.tier === "pro" ? "standard" : "none",
      trial_expires_at: trialExpiresAt,
    })
    .select()
    .single();

  if (error) throw error;
  return created as Profile;
}

export async function logAudit(
  userId: string | null,
  action: string,
  metadata: Record<string, unknown> = {}
) {
  await supabaseAdmin.from("audit_log").insert({
    user_id: userId,
    action,
    metadata,
  });
}
