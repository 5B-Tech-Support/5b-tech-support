import type { Profile, Subscription } from "@/types/database";
import type { Entitlements } from "@/types/entitlements";

function tierIsProLike(tier: string): boolean {
  return tier === "pro" || tier === "priority_10" || tier === "essentials_2";
}

export function getEntitlements(
  profile: Profile,
  subscription?: Subscription | null
): Entitlements {
  const isComplimentaryPro = profile.is_complimentary_pro === true;

  const hasActiveSubscription =
    !!subscription &&
    (subscription.status === "active" || subscription.status === "trialing");

  const now = Date.now();
  const trialEnd = profile.trial_expires_at
    ? new Date(profile.trial_expires_at).getTime()
    : null;

  const isTrialActive =
    !isComplimentaryPro &&
    tierIsProLike(profile.tier) &&
    trialEnd !== null &&
    trialEnd > now &&
    !hasActiveSubscription;

  const isTrialExpired =
    !isComplimentaryPro &&
    tierIsProLike(profile.tier) &&
    trialEnd !== null &&
    trialEnd <= now &&
    !hasActiveSubscription;

  const effectiveTier: Entitlements["tier"] =
    isComplimentaryPro || hasActiveSubscription || isTrialActive ? "pro" : "free";

  return {
    tier: effectiveTier,
    canAccessAllGuides: effectiveTier === "pro",
    supportResponseDays: effectiveTier === "pro" ? 2 : 3,
    isTrialActive,
    isTrialExpired,
    hasActiveSubscription,
    isComplimentaryPro,
  };
}
