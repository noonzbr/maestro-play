import { createClient, SupabaseClient } from "@supabase/supabase-js"

let _supabase: SupabaseClient | null = null
let _supabaseClient: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return _supabase
}

export function getSupabaseClient(): SupabaseClient {
  if (!_supabaseClient) {
    _supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _supabaseClient
}

export type Purchase = {
  id: string
  user_id: string | null
  stripe_session_id: string
  game_slug: string
  amount: number
  created_at: string
}

export async function hasPurchased(userId: string, gameSlug: string): Promise<boolean> {
  const { data } = await getSupabase()
    .from("purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("game_slug", gameSlug)
    .maybeSingle()
  return !!data
}

export async function recordPurchase(params: {
  stripeSessionId: string
  gameSlug: string
  userId?: string
  amount: number
}) {
  const { error } = await getSupabase().from("purchases").insert({
    stripe_session_id: params.stripeSessionId,
    game_slug: params.gameSlug,
    user_id: params.userId ?? null,
    amount: params.amount,
  })
  if (error) throw error
}
