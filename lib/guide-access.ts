const COOKIE_KEY = "5b_guide_reads";

export type AccessTier = "anon" | "free" | "pro";

const LIMITS: Record<AccessTier, number> = {
  anon: 1,
  free: 3,
  pro: Infinity,
};

function getMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getReadSlugs(): string[] {
  if (typeof document === "undefined") return [];
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE_KEY}=`));
  if (!raw) return [];
  try {
    const data = JSON.parse(decodeURIComponent(raw.split("=")[1]));
    if (data.month !== getMonth()) return [];
    return data.slugs ?? [];
  } catch {
    return [];
  }
}

function setReadSlugs(slugs: string[]) {
  const value = encodeURIComponent(
    JSON.stringify({ month: getMonth(), slugs })
  );
  const expires = new Date();
  expires.setDate(expires.getDate() + 60);
  document.cookie = `${COOKIE_KEY}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

export function recordGuideRead(slug: string) {
  const slugs = getReadSlugs();
  if (!slugs.includes(slug)) {
    slugs.push(slug);
    setReadSlugs(slugs);
  }
}

export function getReadsThisMonth(): number {
  return getReadSlugs().length;
}

export function hasAlreadyRead(slug: string): boolean {
  return getReadSlugs().includes(slug);
}

export function canReadGuide(slug: string, tier: AccessTier): boolean {
  if (tier === "pro") return true;
  if (hasAlreadyRead(slug)) return true;
  const limit = LIMITS[tier];
  return getReadsThisMonth() < limit;
}

export function getReadLimit(tier: AccessTier): number {
  return LIMITS[tier];
}

export function getRemainingReads(tier: AccessTier): number {
  if (tier === "pro") return Infinity;
  const limit = LIMITS[tier];
  return Math.max(0, limit - getReadsThisMonth());
}
