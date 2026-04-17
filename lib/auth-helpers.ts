import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Profile, UserTier } from "@/types/database";

/** First word of the signup name — used as the default profile display name. */
export function displayNameFromSignupFullName(full_name: unknown): string | null {
  if (typeof full_name !== "string") return null;
  const t = full_name.trim();
  if (!t) return null;
  const first = t.split(/\s+/)[0];
  return first ?? null;
}

interface CreateProfileOptions {
  tier?: UserTier;
  trialDays?: number;
  /** Stored on `profiles.full_name` (default: first name from signup). */
  full_name?: string | null;
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

  const proTrialStartedAt =
    trialExpiresAt && options.tier === "pro" ? new Date().toISOString() : null;

  const { data: created, error } = await supabaseAdmin
    .from("profiles")
    .insert({
      user_id: userId,
      email,
      full_name: options.full_name ?? null,
      tier: options.tier ?? "free",
      account_status: "email_unverified",
      support_priority: options.tier === "pro" ? "standard" : "none",
      trial_expires_at: trialExpiresAt,
      pro_trial_started_at: proTrialStartedAt,
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
  await supabaseAdmin.from("admin_audit_log").insert({
    actor_user_id: userId,
    action,
    after_json: metadata,
  });
}
