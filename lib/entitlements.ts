import type { Profile, Subscription } from "@/types/database";
import type { Entitlements } from "@/types/entitlements";

export function getEntitlements(
  profile: Profile,
  subscription?: Subscription | null
): Entitlements {
  const hasActiveSubscription =
    !!subscription &&
    (subscription.status === "active" || subscription.status === "trialing");

  const now = Date.now();
  const trialEnd = profile.trial_expires_at
    ? new Date(profile.trial_expires_at).getTime()
    : null;

  const isTrialActive =
    profile.tier === "pro" &&
    trialEnd !== null &&
    trialEnd > now &&
    !hasActiveSubscription;

  const isTrialExpired =
    profile.tier === "pro" &&
    trialEnd !== null &&
    trialEnd <= now &&
    !hasActiveSubscription;

  const effectiveTier =
    hasActiveSubscription || isTrialActive ? "pro" : "free";

  return {
    tier: effectiveTier,
    canAccessAllGuides: effectiveTier === "pro",
    supportResponseDays: effectiveTier === "pro" ? 2 : 3,
    isTrialActive,
    isTrialExpired,
    hasActiveSubscription,
  };
}
