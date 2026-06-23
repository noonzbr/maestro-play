/**
 * Browser-safe Supabase client
 * Uses anon key — safe to run in Client Components.
 * Do NOT import getSupabase() (service role) from client code.
 */
import { createClient, SupabaseClient, User, Session } from "@supabase/supabase-js"

let _client: SupabaseClient | null = null

export function supabaseBrowser(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      console.warn("Supabase env vars not set. Falling back to local dummy client.")
      _client = new Proxy({
        auth: {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          getUser: () => Promise.resolve({ data: { user: null }, error: null }),
          onAuthStateChange: (cb: any) => {
            setTimeout(() => cb("INITIAL_SESSION", null), 0)
            return { data: { subscription: { unsubscribe: () => {} } } }
          },
          signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
          signUp: () => Promise.resolve({ data: {}, error: null }),
          signInWithOAuth: () => Promise.resolve({ data: {}, error: null }),
          signOut: () => Promise.resolve({ error: null }),
        },
        from: () => {
          const chain = {
            select: () => chain,
            eq: () => chain,
            in: () => chain,
            maybeSingle: () => Promise.resolve({ data: null, error: null }),
            single: () => Promise.resolve({ data: null, error: null }),
            insert: () => Promise.resolve({ data: null, error: null }),
            update: () => Promise.resolve({ data: null, error: null }),
            delete: () => Promise.resolve({ data: null, error: null }),
            then: (resolve: any) => resolve({ data: null, error: null }),
          }
          return chain
        }
      } as any, {
        get(target, prop) {
          if (prop in target) return target[prop]
          return () => new Proxy({}, {
            get(t, p) {
              if (p === "then") return (r: any) => r({ data: null, error: null })
              return () => new Proxy({}, {})
            }
          })
        }
      }) as any as SupabaseClient
    } else {
      _client = createClient(url, key, {
        auth: {
          persistSession:    true,
          autoRefreshToken:  true,
          detectSessionInUrl: true,
        },
      })
    }
  }
  return _client
}

/* ─── Auth helpers ───────────────────────────────────────────────────────── */

export type AuthUser = User

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabaseBrowser().auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabaseBrowser().auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signInWithGoogle() {
  const { data, error } = await supabaseBrowser().auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined,
    },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabaseBrowser().auth.signOut()
  if (error) throw error
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabaseBrowser().auth.getSession()
  return data.session
}

export function onAuthChange(callback: (user: User | null) => void) {
  const { data: { subscription } } = supabaseBrowser().auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
  return () => subscription.unsubscribe()
}
