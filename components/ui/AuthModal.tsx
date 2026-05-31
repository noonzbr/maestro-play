"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } from "@/lib/supabase-browser"

/* ─── keyframes ─────────────────────────────────────────────────────────── */
function ensureKf() {
  if (typeof document === "undefined") return
  const id = "auth-modal-kf"
  if (document.getElementById(id)) return
  const s = document.createElement("style")
  s.id = id
  s.textContent = `
    @keyframes auth-backdrop-in  { from { opacity:0; } to { opacity:1; } }
    @keyframes auth-modal-in {
      from { opacity:0; transform:translateY(24px) scale(0.96); }
      to   { opacity:1; transform:translateY(0)    scale(1);    }
    }
    @keyframes auth-shake {
      0%,100% { transform:translateX(0); }
      20%     { transform:translateX(-8px); }
      40%     { transform:translateX(8px); }
      60%     { transform:translateX(-5px); }
      80%     { transform:translateX(5px); }
    }
  `
  document.head.appendChild(s)
}

/* ─── Input field ────────────────────────────────────────────────────────── */
function AuthInput({ label, type = "text", value, onChange, placeholder, disabled }: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; disabled?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom:"1rem" }}>
      <label style={{ fontFamily:"Inter, sans-serif", fontWeight:700, fontSize:"0.62rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(240,238,255,0.5)", display:"block", marginBottom:"0.4rem" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width:"100%", boxSizing:"border-box",
          fontFamily:"Inter, sans-serif", fontSize:"0.925rem",
          color:"#fff",
          background:"rgba(255,255,255,0.04)",
          border:`1.5px solid ${focused ? "rgba(0,212,240,0.5)" : "rgba(255,255,255,0.1)"}`,
          borderRadius:"12px",
          padding:"0.75rem 1rem",
          outline:"none",
          transition:"border-color 0.2s",
          opacity: disabled ? 0.5 : 1,
        }}
      />
    </div>
  )
}

/* ─── Google button ──────────────────────────────────────────────────────── */
function GoogleButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.65rem",
        fontFamily:"Inter, sans-serif", fontWeight:700, fontSize:"0.88rem",
        color:"#fff",
        background:"rgba(255,255,255,0.06)",
        border:"1.5px solid rgba(255,255,255,0.14)",
        borderRadius:"12px", padding:"0.75rem 1rem",
        cursor: disabled ? "wait" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition:"background 0.2s, border-color 0.2s",
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background="rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.25)" }}}
      onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.14)" }}
    >
      {/* Google G icon */}
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
        <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
      </svg>
      Continue with Google
    </button>
  )
}

/* ─── Main modal ─────────────────────────────────────────────────────────── */
export default function AuthModal() {
  useEffect(() => { ensureKf() }, [])

  const { authModalOpen, authModalMode, closeAuthModal } = useAuth()
  const [mode,     setMode]     = useState<"signin" | "signup">(authModalMode)
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")
  const [success,  setSuccess]  = useState("")
  const shakeRef = useRef<HTMLDivElement | null>(null)

  // Sync mode with parent
  useEffect(() => { setMode(authModalMode) }, [authModalMode])

  // Reset on open
  useEffect(() => {
    if (authModalOpen) {
      setEmail(""); setPassword(""); setError(""); setSuccess(""); setLoading(false)
    }
  }, [authModalOpen])

  if (!authModalOpen) return null

  const shake = () => {
    if (!shakeRef.current) return
    shakeRef.current.style.animation = ""
    void shakeRef.current.offsetHeight // reflow
    shakeRef.current.style.animation = "auth-shake 0.4s ease"
  }

  const handleEmailAuth = async () => {
    if (!email || !password) { setError("Email and password are required."); shake(); return }
    setLoading(true); setError(""); setSuccess("")
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password)
        closeAuthModal()
      } else {
        await signUpWithEmail(email, password)
        setSuccess("Check your email to confirm your account. Welcome to MaestroPlay!")
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong."
      setError(msg)
      shake()
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true); setError("")
    try {
      await signInWithGoogle()
      // Redirects to /auth/callback, so no closeModal here
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Google sign-in failed."
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeAuthModal}
        style={{
          position:"fixed", inset:0, zIndex:400,
          background:"rgba(8,6,15,0.85)",
          backdropFilter:"blur(16px)",
          animation:"auth-backdrop-in 0.25s ease both",
        }}
      />

      {/* Modal */}
      <div
        ref={shakeRef}
        style={{
          position:"fixed", inset:0, zIndex:401,
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"1.5rem", pointerEvents:"none",
        }}
      >
        <div style={{
          maxWidth:"420px", width:"100%",
          background:"rgba(10,7,20,0.98)",
          border:"1px solid rgba(0,212,240,0.2)",
          borderRadius:"24px",
          padding:"2rem 2.25rem 2.25rem",
          boxShadow:"0 0 80px rgba(0,212,240,0.08), 0 24px 80px rgba(0,0,0,0.7)",
          pointerEvents:"all",
          animation:"auth-modal-in 0.4s cubic-bezier(0.34,1.1,0.64,1) both",
          position:"relative",
        }}>
          {/* Close */}
          <button
            onClick={closeAuthModal}
            style={{ position:"absolute", top:"1.25rem", right:"1.25rem", background:"none", border:"none", cursor:"pointer", color:"rgba(240,238,255,0.35)", fontSize:"1.1rem", lineHeight:1, transition:"color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color="rgba(240,238,255,0.7)")}
            onMouseLeave={e => (e.currentTarget.style.color="rgba(240,238,255,0.35)")}
          >
            ✕
          </button>

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:"1.75rem" }}>
            <div style={{ fontFamily:"Inter, sans-serif", fontWeight:700, fontSize:"0.52rem", letterSpacing:"0.3em", textTransform:"uppercase", color:"var(--cyan)", marginBottom:"0.55rem", opacity:0.8 }}>
              {mode === "signin" ? "Welcome back" : "Join MaestroPlay"}
            </div>
            <h2 style={{ fontFamily:"Cormorant Garamond, serif", fontWeight:700, fontSize:"1.75rem", color:"#fff", lineHeight:1.15, margin:0 }}>
              {mode === "signin" ? "Sign in to continue" : "Create your account"}
            </h2>
          </div>

          {/* Google button */}
          <GoogleButton onClick={handleGoogle} disabled={loading} />

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", margin:"1.25rem 0" }}>
            <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.08)" }} />
            <span style={{ fontFamily:"Inter, sans-serif", fontSize:"0.7rem", color:"rgba(240,238,255,0.3)" }}>or</span>
            <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.08)" }} />
          </div>

          {/* Email/password */}
          <AuthInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" disabled={loading} />
          <AuthInput label="Password" type="password" value={password} onChange={setPassword} placeholder={mode === "signup" ? "At least 8 characters" : "Your password"} disabled={loading} />

          {/* Error / success */}
          {error && (
            <div style={{ fontFamily:"Inter, sans-serif", fontSize:"0.8rem", color:"#ff8080", background:"rgba(255,80,80,0.08)", border:"1px solid rgba(255,80,80,0.2)", borderRadius:"10px", padding:"0.65rem 0.9rem", marginBottom:"1rem" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ fontFamily:"Inter, sans-serif", fontSize:"0.8rem", color:"#58cc02", background:"rgba(88,204,2,0.06)", border:"1px solid rgba(88,204,2,0.2)", borderRadius:"10px", padding:"0.65rem 0.9rem", marginBottom:"1rem" }}>
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleEmailAuth}
            disabled={loading}
            style={{
              width:"100%", fontFamily:"Inter, sans-serif", fontWeight:800,
              fontSize:"0.95rem", color:"#08060f",
              background: loading ? "rgba(255,255,255,0.2)" : "linear-gradient(90deg, #00d4f0, #e040fb)",
              padding:"0.85rem 1rem", borderRadius:"12px", border:"none",
              cursor: loading ? "wait" : "pointer",
              letterSpacing:"0.03em", marginBottom:"1.1rem",
              transition:"transform 0.2s, box-shadow 0.2s",
              boxShadow: loading ? "none" : "0 0 28px rgba(0,212,240,0.22)",
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 0 40px rgba(0,212,240,0.35)" }}}
            onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=loading?"none":"0 0 28px rgba(0,212,240,0.22)" }}
          >
            {loading
              ? "Please wait…"
              : mode === "signin" ? "Sign in →" : "Create account →"
            }
          </button>

          {/* Mode switch */}
          <div style={{ textAlign:"center", fontFamily:"Inter, sans-serif", fontSize:"0.8rem", color:"rgba(240,238,255,0.4)" }}>
            {mode === "signin" ? (
              <>Don't have an account?{" "}
                <button onClick={() => setMode("signup")} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--cyan)", fontWeight:700, fontSize:"0.8rem", fontFamily:"Inter, sans-serif", padding:0 }}>
                  Sign up
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => setMode("signin")} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--cyan)", fontWeight:700, fontSize:"0.8rem", fontFamily:"Inter, sans-serif", padding:0 }}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
