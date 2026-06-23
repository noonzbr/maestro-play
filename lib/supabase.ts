import { createClient, SupabaseClient } from "@supabase/supabase-js"

let _supabase: SupabaseClient | null = null
let _supabaseClient: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      console.warn("Supabase server service role env vars not set. Falling back to dummy client.")
      _supabase = new Proxy({}, {
        get() {
          return () => new Proxy({}, {
            get(t, p) {
              if (p === "then") return (r: any) => r({ data: null, error: null })
              return () => new Proxy({}, {})
            }
          })
        }
      }) as any as SupabaseClient
    } else {
      _supabase = createClient(url, key)
    }
  }
  return _supabase
}

export function getSupabaseClient(): SupabaseClient {
  if (!_supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      console.warn("Supabase server anon env vars not set. Falling back to dummy client.")
      _supabaseClient = new Proxy({}, {
        get() {
          return () => new Proxy({}, {
            get(t, p) {
              if (p === "then") return (r: any) => r({ data: null, error: null })
              return () => new Proxy({}, {})
            }
          })
        }
      }) as any as SupabaseClient
    } else {
      _supabaseClient = createClient(url, key)
    }
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
