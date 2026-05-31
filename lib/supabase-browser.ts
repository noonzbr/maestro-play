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
      // Return a no-op client stub so the app doesn't crash without credentials
      throw new Error("Supabase env vars not set: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY required")
    }
    _client = createClient(url, key, {
      auth: {
        persistSession:    true,
        autoRefreshToken:  true,
        detectSessionInUrl: true,
      },
    })
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
