import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    const accept = request.headers.get("accept") ?? "";
    if (accept.includes("application/json")) {
      return NextResponse.json({ message: "Signed out successfully" });
    }

    return NextResponse.redirect(new URL("/login", request.url));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
