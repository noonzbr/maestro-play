"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase-browser"

/**
 * Handles Supabase OAuth callback (Google sign-in redirect).
 * Supabase exchanges the code for a session, then we redirect to /games.
 */
export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const sb = supabaseBrowser()
    // Supabase automatically handles the code exchange from the URL hash/params
    sb.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push("/games")
      } else {
        // If exchange failed, try listening for auth state change
        const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
          subscription.unsubscribe()
          router.push(session ? "/games" : "/")
        })
      }
    })
  }, [router])

  return (
    <div style={{
      minHeight:"100vh", background:"var(--bg-primary)",
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"2rem", marginBottom:"1rem", animation:"pulse-glow 0.8s ease-in-out infinite" }}>🎼</div>
        <div style={{ fontFamily:"Cormorant Garamond, serif", fontStyle:"italic", fontSize:"1.25rem", color:"rgba(240,238,255,0.7)" }}>
          Signing you in…
        </div>
      </div>
    </div>
  )
}
