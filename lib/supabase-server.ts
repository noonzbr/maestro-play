import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { getSupabase } from "./supabase"

/** Extract the Supabase project ref from the public URL */
function getProjectRef(): string {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
    return new URL(url).hostname.split(".")[0]
  } catch {
    return ""
  }
}

/**
 * Read + verify the Supabase session from cookies in a Server Component.
 * Returns { user, accessToken } if authenticated, or null if not.
 *
 * Calling this in a Server Component makes the route dynamic (per-request).
 * Only call it when you need to gate access — free game pages stay static.
 */
export async function getServerUser(): Promise<{
  user: { id: string; email?: string }
  accessToken: string
} | null> {
  try {
    const cookieStore = await cookies()
    const ref = getProjectRef()

    // Try standard cookie first, then chunked (.0) fallback
    const rawCookie =
      (ref ? cookieStore.get(`sb-${ref}-auth-token`)?.value : undefined) ??
      (ref ? cookieStore.get(`sb-${ref}-auth-token.0`)?.value : undefined)

    if (!rawCookie) return null

    const parsed = JSON.parse(rawCookie)
    const accessToken: string | undefined = parsed?.access_token
    if (!accessToken) return null

    // Verify the token with Supabase
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
    )
    const { data: { user }, error } = await client.auth.getUser()
    if (error || !user) return null

    return { user: { id: user.id, email: user.email }, accessToken }
  } catch {
    return null
  }
}

/**
 * Check if a user has access to a specific Pro game.
 * Accepts either a direct individual purchase, or a bundle/Pro subscription.
 */
export async function hasGameAccess(userId: string, gameSlug: string): Promise<boolean> {
  try {
    const admin = getSupabase()

    // Direct game purchase
    const { data: direct } = await admin
      .from("purchases")
      .select("id")
      .eq("user_id", userId)
      .eq("game_slug", gameSlug)
      .maybeSingle()
    if (direct) return true

    // Bundle or Pro subscription (unlocks all games)
    const { data: proAccess } = await admin
      .from("purchases")
      .select("id")
      .eq("user_id", userId)
      .in("game_slug", ["bundle", "pro-monthly", "pro-annual"])
      .maybeSingle()
    if (proAccess) return true

    return false
  } catch {
    return false
  }
}
