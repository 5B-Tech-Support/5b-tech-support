import type { UserTier } from "./database";

export interface Entitlements {
  tier: UserTier;
  canAccessAllGuides: boolean;
  supportResponseDays: number;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  hasActiveSubscription: boolean;
  /** Internal: full Pro without Stripe (UI treats as Pro) */
  isComplimentaryPro: boolean;
}
