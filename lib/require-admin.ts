import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { User } from "@supabase/supabase-js";

/** CMS / `/api/admin/*` access: `profiles.role` must be `admin`. */
export async function requireAdminUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.role !== "admin") return null;
  return user;
}

/** True when the signed-in user has the `admin` role (CMS + /api/admin). */
export async function userIsAdmin(): Promise<boolean> {
  return (await requireAdminUser()) !== null;
}
