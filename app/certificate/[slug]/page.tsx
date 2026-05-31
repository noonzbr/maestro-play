import { allGames } from "@/lib/games"
import PrintButton from "./PrintButton"

// ── Certificate Page (Server Component) ─────────────────────────────────────
export default async function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const game = allGames.find((g) => g.slug === slug)

  if (!game) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#08060f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        color: "rgba(240,238,255,0.5)",
        fontSize: "1.1rem",
      }}>
        Game not found.
      </div>
    )
  }

  const totalXp = game.scenes.reduce((s, sc) => s + sc.xpAward, 0)
  const now = new Date()
  const issueDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const descriptionFirst = (() => {
    const first = game.description.split(".")[0]
    return first.length > 100 ? first.slice(0, 97) + "…" : first
  })()

  const linkedInUrl =
    `https://www.linkedin.com/profile/add` +
    `?startTask=CERTIFICATION_NAME` +
    `&name=${encodeURIComponent("AI Fluency: " + game.title)}` +
    `&organizationId=105930013` +
    `&issueYear=${year}` +
    `&issueMonth=${month}` +
    `&certUrl=${encodeURIComponent("https://maestroplay.app/certificate/" + game.slug)}` +
    `&certId=${encodeURIComponent(game.slug)}`

  return (
    <>
      <style>{`
        @keyframes seal-pulse {
          0%, 100% { box-shadow: 0 0 24px rgba(0,212,240,0.35), 0 0 48px rgba(224,64,251,0.15); }
          50%       { box-shadow: 0 0 40px rgba(0,212,240,0.6),  0 0 80px rgba(224,64,251,0.3); }
        }
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#08060f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        gap: "2rem",
      }}>

        {/* ── Certificate Card ── */}
        <div style={{
          position: "relative",
          maxWidth: "800px",
          width: "100%",
          padding: "4rem",
          background: "linear-gradient(145deg, rgba(15,10,30,0.95) 0%, rgba(8,6,15,0.98) 100%)",
          borderRadius: "24px",
          border: "1px solid rgba(0,212,240,0.25)",
          boxShadow:
            "0 0 0 1px rgba(224,64,251,0.12), inset 0 0 80px rgba(0,212,240,0.03), 0 32px 80px rgba(0,0,0,0.6)",
        }}>

          {/* Gradient overlay */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: "24px", pointerEvents: "none",
            background: "linear-gradient(135deg, rgba(0,212,240,0.06) 0%, transparent 40%, transparent 60%, rgba(224,64,251,0.05) 100%)",
          }} />

          <div style={{ position: "relative", textAlign: "center" }}>

            {/* MaestroPlay wordmark */}
            <div style={{
              fontFamily: "Cormorant Garamond, serif",
              fontStyle: "italic",
              fontSize: "1.1rem",
              color: "rgba(240,238,255,0.3)",
              letterSpacing: "0.18em",
              marginBottom: "2rem",
            }}>
              MaestroPlay
            </div>

            {/* Decorative top divider */}
            <div style={{
              width: "60px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(0,212,240,0.5), transparent)",
              margin: "0 auto 2rem",
            }} />

            {/* Certificate of Completion */}
            <h1 style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 700,
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
              letterSpacing: "-0.01em",
            }}>
              Certificate of Completion
            </h1>

            {/* This certifies mastery of */}
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.75rem",
              color: "rgba(240,238,255,0.4)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}>
              This certifies mastery of
            </p>

            {/* Game title — gradient */}
            <div style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 700,
              fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
              background: "linear-gradient(90deg, #00d4f0, #e040fb)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "2rem",
              lineHeight: 1.3,
              padding: "0 1rem",
            }}>
              {game.title}
            </div>

            {/* Character image */}
            {game.characterImage && (
              <div style={{ marginBottom: "1.5rem" }}>
                <img
                  src={game.maestroImage ?? game.characterImage}
                  alt={game.characterName ?? "Game character"}
                  width={120}
                  height={120}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "contain",
                    objectPosition: "top",
                    display: "block",
                    margin: "0 auto",
                    filter: "drop-shadow(0 0 20px rgba(0,212,240,0.3))",
                  }}
                />
              </div>
            )}

            {/* Description — first sentence */}
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.875rem",
              color: "rgba(240,238,255,0.45)",
              lineHeight: 1.65,
              maxWidth: "520px",
              margin: "0 auto 2rem",
              fontStyle: "italic",
            }}>
              {descriptionFirst}
            </p>

            {/* Full-width divider */}
            <div style={{
              width: "100%",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(0,212,240,0.2), rgba(224,64,251,0.2), transparent)",
              marginBottom: "1.75rem",
            }} />

            {/* XP badge + date */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "2.5rem",
              marginBottom: "2rem",
              flexWrap: "wrap",
            }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(0,212,240,0.08)",
                border: "1px solid rgba(0,212,240,0.25)",
                borderRadius: "100px",
                padding: "0.45rem 1.1rem",
              }}>
                <span style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.15rem",
                  color: "#00d4f0",
                }}>
                  {totalXp}
                </span>
                <span style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.6rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(0,212,240,0.7)",
                }}>
                  XP
                </span>
              </div>

              <div style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "0.95rem",
                color: "rgba(240,238,255,0.35)",
                letterSpacing: "0.05em",
              }}>
                Issued {issueDate}
              </div>
            </div>

            {/* Seal */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: "2px solid rgba(0,212,240,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                color: "rgba(0,212,240,0.8)",
                background: "rgba(0,212,240,0.05)",
                animation: "seal-pulse 3s ease-in-out infinite",
              }}>
                ♪
              </div>
              <p style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.58rem",
                color: "rgba(240,238,255,0.25)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}>
                Verified by the MaestroPlay Cinematic Learning Platform
              </p>
            </div>

          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="no-print" style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {/* Add to LinkedIn Profile */}
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#fff",
              background: "#0A66C2",
              padding: "0.85rem 2rem",
              borderRadius: "100px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              letterSpacing: "0.01em",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Add to LinkedIn Profile
          </a>

          {/* Print / Download — client component */}
          <PrintButton />
        </div>

      </div>
    </>
  )
}
