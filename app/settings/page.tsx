"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Nav from "@/components/ui/Nav"
import Footer from "@/components/ui/Footer"
import FloatingNotes from "@/components/game/FloatingNotes"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function SettingsPage() {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Preferences state
  const [unsubscribed, setUnsubscribed] = useState(false)
  const [gameCompletePref, setGameCompletePref] = useState(true)
  const [reviewDuePref, setReviewDuePref] = useState(true)
  const [streakWarningPref, setStreakWarningPref] = useState(true)

  // Gumroad License states
  const [hasPremium, setHasPremium] = useState(false)
  const [licenseKey, setLicenseKey] = useState("")
  const [activating, setActivating] = useState(false)
  const [activationMsg, setActivationMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user: sbUser } } = await supabaseBrowser().auth.getUser()
        if (sbUser) {
          setUser(sbUser)
          
          // Parse metadata preferences
          const metadata = sbUser.user_metadata || {}
          setUnsubscribed(metadata.unsubscribed === true)
          
          const emailPrefs = metadata.email_prefs || {}
          setGameCompletePref(emailPrefs.gameComplete !== false)
          setReviewDuePref(emailPrefs.reviewDue !== false)
          setStreakWarningPref(emailPrefs.streakWarning !== false)

          // Check for active premium license
          const { data: premiumCheck } = await supabaseBrowser()
            .from("purchases")
            .select("id")
            .eq("user_id", sbUser.id)
            .in("game_slug", ["maestro-bundle", "conductor-edition"])
            .maybeSingle()
          const premium = !!premiumCheck
          setHasPremium(premium)

          // Auto-verify if license_key is present in URL search params
          if (typeof window !== "undefined" && !premium) {
            const params = new URLSearchParams(window.location.search)
            const queryKey = params.get("license_key")
            if (queryKey) {
              setActivating(true)
              setActivationMsg(null)
              try {
                const res = await fetch("/api/gumroad/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ licenseKey: queryKey.trim(), userId: sbUser.id }),
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.error || "Auto-verification failed")
                setHasPremium(true)
                setActivationMsg({ type: "success", text: "Conductor's Edition auto-activated! ⚡ All tracks unlocked." })
              } catch (err: any) {
                setActivationMsg({ type: "error", text: `Auto-activation failed: ${err.message}` })
              } finally {
                setActivating(false)
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading user:", err)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const handleActivateLicense = async () => {
    if (!user || !licenseKey.trim()) return
    setActivating(true)
    setActivationMsg(null)

    try {
      const res = await fetch("/api/gumroad/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: licenseKey.trim(), userId: user.id }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to verify license key.")
      }

      setHasPremium(true)
      setActivationMsg({ type: "success", text: "Conductor's Edition activated successfully! ⚡ All tracks unlocked." })
      setLicenseKey("")
    } catch (err: any) {
      setActivationMsg({ type: "error", text: err.message || "Invalid license key. Please check your key and try again." })
    } finally {
      setActivating(false)
    }
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabaseBrowser().auth.updateUser({
        data: {
          unsubscribed,
          email_prefs: {
            gameComplete: gameCompletePref,
            reviewDue: reviewDuePref,
            streakWarning: streakWarningPref
          }
        }
      })

      if (error) throw error
      
      setMessage({ type: "success", text: "Preferences saved successfully!" })
    } catch (err) {
      console.error("Error updating preferences:", err)
      setMessage({ type: "error", text: "Failed to save preferences. Please try again." })
    } finally {
      setSaving(false)
    }
  }

  const containerStyle: React.CSSProperties = {
    background: "rgba(10, 8, 22, 0.72)",
    border: "1.5px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "24px",
    padding: "2.2rem",
    boxShadow: "0 20px 48px rgba(0, 0, 0, 0.55)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    fontFamily: "Inter, sans-serif",
  }

  const headingStyle: React.CSSProperties = {
    fontSize: "1.45rem",
    fontWeight: 900,
    margin: "0 0 0.4rem",
    color: "#fff",
    letterSpacing: "-0.01em",
  }

  const labelStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.85rem",
    color: "rgba(240, 238, 255, 0.85)",
    fontSize: "0.86rem",
    cursor: "pointer",
    padding: "0.6rem 0",
  }

  const checkboxStyle: React.CSSProperties = {
    width: "18px",
    height: "18px",
    accentColor: "var(--cyan)",
    cursor: "pointer",
  }

  return (
    <>
      <Nav />
      <main style={{ 
        position: "relative",
        minHeight: "100vh", 
        background: "#06040a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6.5rem 1.5rem 4rem",
        overflow: "hidden"
      }}>
        {/* Particle Backdrop */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
          <FloatingNotes mood="normal" />
        </div>
        
        {/* Glow Effects */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
          <div className="hero-orb-purple" style={{ opacity: 0.12, top: "15%", left: "15%" }} />
          <div className="hero-orb-cyan" style={{ opacity: 0.12, bottom: "15%", right: "15%" }} />
        </div>

        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "520px" }}>
          {/* Back button */}
          <div style={{ marginBottom: "1.2rem", paddingLeft: "0.2rem" }}>
            <Link href="/worldmap" style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "0.4rem", 
              fontFamily: "Inter, sans-serif", 
              fontSize: "0.78rem", 
              fontWeight: 700, 
              color: "rgba(255,255,255,0.4)", 
              textDecoration: "none", 
              transition: "color 0.2s" 
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--cyan)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
            >
              ← Back to World Map
            </Link>
          </div>

          {/* Gumroad License Key Activation Card */}
          {user && (
            <div style={{ ...containerStyle, marginBottom: "1.5rem" }}>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "2.4rem" }}>⚡</span>
                <h2 style={headingStyle}>Conductor&apos;s Edition</h2>
                <p style={{ fontSize: "0.76rem", color: "rgba(240, 238, 255, 0.4)", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
                  Activate your Gumroad premium purchase
                </p>
              </div>

              {hasPremium ? (
                <div style={{
                  padding: "1.2rem",
                  background: "rgba(0, 212, 240, 0.08)",
                  border: "1.5px solid rgba(0, 212, 240, 0.35)",
                  borderRadius: "16px",
                  textAlign: "center",
                  fontFamily: "Inter, sans-serif"
                }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>🏆</div>
                  <div style={{ fontWeight: 800, color: "var(--cyan)", fontSize: "0.9rem", marginBottom: "0.2rem" }}>
                    Conductor&apos;s Edition Active
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "rgba(240,238,255,0.6)", margin: 0 }}>
                    All 14 game tracks and features are unlocked on your account.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.76rem", color: "rgba(240, 238, 255, 0.6)", fontWeight: 700, paddingLeft: "0.2rem" }}>
                      Gumroad License Key
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. XXXX-XXXX-XXXX-XXXX"
                      value={licenseKey}
                      onChange={e => setLicenseKey(e.target.value)}
                      disabled={activating}
                      style={{
                        background: "rgba(0,0,0,0.4)",
                        border: "1.5px solid rgba(255,255,255,0.08)",
                        borderRadius: "12px",
                        padding: "0.75rem 1rem",
                        color: "#fff",
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        outline: "none",
                        transition: "border-color 0.2s"
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = "var(--cyan)"}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                    />
                  </div>

                  {activationMsg && (
                    <div style={{
                      padding: "0.85rem",
                      borderRadius: "10px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      textAlign: "center",
                      background: activationMsg.type === "success" ? "rgba(88,204,2,0.12)" : "rgba(255,71,87,0.12)",
                      border: activationMsg.type === "success" ? "1px solid rgba(88,204,2,0.3)" : "1px solid rgba(255,71,87,0.3)",
                      color: activationMsg.type === "success" ? "#58cc02" : "#ff4757",
                    }}>
                      {activationMsg.text}
                    </div>
                  )}

                  <button
                    onClick={handleActivateLicense}
                    disabled={activating || !licenseKey.trim()}
                    style={{
                      width: "100%",
                      padding: "0.85rem",
                      borderRadius: "12px",
                      background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                      border: "none",
                      color: "#08060f",
                      fontSize: "0.86rem",
                      fontWeight: 800,
                      cursor: activating || !licenseKey.trim() ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      boxShadow: "0 0 20px rgba(0,212,240,0.2)",
                      transition: "transform 0.15s, opacity 0.15s",
                      opacity: activating || !licenseKey.trim() ? 0.5 : 1,
                    }}
                    onMouseEnter={e => { if (!activating && licenseKey.trim()) e.currentTarget.style.transform = "scale(1.02)" }}
                    onMouseLeave={e => { if (!activating && licenseKey.trim()) e.currentTarget.style.transform = "scale(1)" }}
                  >
                    {activating ? "Verifying key..." : "Activate License ⚡"}
                  </button>
                </div>
              )}
            </div>
          )}

          <div style={containerStyle}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <span style={{ fontSize: "2.4rem" }}>⚙️</span>
              <h1 style={headingStyle}>Email Preferences</h1>
              <p style={{ fontSize: "0.76rem", color: "rgba(240, 238, 255, 0.4)", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
                Manage your MaestroPlay communication channel
              </p>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem 0", color: "rgba(255,255,255,0.5)" }}>
                Loading settings...
              </div>
            ) : !user ? (
              <div style={{ textAlign: "center", padding: "1.5rem", background: "rgba(255,71,87,0.1)", borderRadius: "14px", border: "1px solid rgba(255,71,87,0.2)" }}>
                <p style={{ color: "#ff4757", margin: "0 0 1rem", fontSize: "0.88rem", fontWeight: 700 }}>
                  You must be logged in to modify preferences.
                </p>
                <Link href="/" style={{
                  display: "inline-block",
                  padding: "0.55rem 1.4rem",
                  background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                  borderRadius: "100px",
                  color: "#08060f",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: "0.78rem"
                }}>
                  Return to Home page
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
                
                {/* Unsubscribe All Toggle */}
                <div style={{ 
                  background: unsubscribed ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)", 
                  padding: "0.8rem 1.1rem", 
                  borderRadius: "14px", 
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "background 0.2s"
                }}>
                  <label style={labelStyle}>
                    <input 
                      type="checkbox" 
                      checked={unsubscribed}
                      onChange={e => setUnsubscribed(e.target.checked)}
                      style={checkboxStyle}
                    />
                    <div>
                      <span style={{ fontWeight: 800 }}>Unsubscribe from all emails</span>
                      <div style={{ fontSize: "0.7rem", color: "rgba(240, 238, 255, 0.4)", marginTop: "0.15rem" }}>
                        Turn off all game updates, streak warnings, and review sessions.
                      </div>
                    </div>
                  </label>
                </div>

                {/* Sub Toggles — Disabled if Unsubscribe All is checked */}
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "0.7rem",
                  opacity: unsubscribed ? 0.35 : 1,
                  pointerEvents: unsubscribed ? "none" : "auto",
                  transition: "opacity 0.2s"
                }}>
                  <div style={{ fontSize: "0.75rem", color: "rgba(240,238,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", paddingLeft: "0.2rem" }}>
                    Select notifications you wish to receive:
                  </div>

                  <label style={labelStyle}>
                    <input 
                      type="checkbox" 
                      checked={gameCompletePref}
                      onChange={e => setGameCompletePref(e.target.checked)}
                      style={checkboxStyle}
                    />
                    <div>
                      <span style={{ fontWeight: 700 }}>New Game Unlock Alerts</span>
                      <div style={{ fontSize: "0.72rem", color: "rgba(240, 238, 255, 0.4)", marginTop: "0.15rem" }}>
                        Receive updates on next unlock challenges when completing a game unit.
                      </div>
                    </div>
                  </label>

                  <label style={labelStyle}>
                    <input 
                      type="checkbox" 
                      checked={reviewDuePref}
                      onChange={e => setReviewDuePref(e.target.checked)}
                      style={checkboxStyle}
                    />
                    <div>
                      <span style={{ fontWeight: 700 }}>Review Session summons</span>
                      <div style={{ fontSize: "0.72rem", color: "rgba(240, 238, 255, 0.4)", marginTop: "0.15rem" }}>
                        Get notified when FSRS spaced repetition cards are due for practice.
                      </div>
                    </div>
                  </label>

                  <label style={labelStyle}>
                    <input 
                      type="checkbox" 
                      checked={streakWarningPref}
                      onChange={e => setStreakWarningPref(e.target.checked)}
                      style={checkboxStyle}
                    />
                    <div>
                      <span style={{ fontWeight: 700 }}>Streak Break Warnings</span>
                      <div style={{ fontSize: "0.72rem", color: "rgba(240, 238, 255, 0.4)", marginTop: "0.15rem" }}>
                        Alerts sent 4 hours before your daily streak breaks.
                      </div>
                    </div>
                  </label>
                </div>

                {message && (
                  <div style={{
                    padding: "0.85rem",
                    borderRadius: "10px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    textAlign: "center",
                    background: message.type === "success" ? "rgba(88,204,2,0.12)" : "rgba(255,71,87,0.12)",
                    border: message.type === "success" ? "1px solid rgba(88,204,2,0.3)" : "1px solid rgba(255,71,87,0.3)",
                    color: message.type === "success" ? "#58cc02" : "#ff4757",
                  }}>
                    {message.text}
                  </div>
                )}

                <button 
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    marginTop: "1.2rem",
                    width: "100%",
                    padding: "0.85rem",
                    borderRadius: "12px",
                    background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                    border: "none",
                    color: "#08060f",
                    fontSize: "0.86rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    boxShadow: "0 0 20px rgba(0,212,240,0.2)",
                    transition: "transform 0.15s, opacity 0.15s",
                    opacity: saving ? 0.7 : 1,
                  }}
                  onMouseEnter={e => { if(!saving) e.currentTarget.style.transform = "scale(1.02)" }}
                  onMouseLeave={e => { if(!saving) e.currentTarget.style.transform = "scale(1)" }}
                >
                  {saving ? "Saving Changes..." : "Save Preferences ⚡"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
