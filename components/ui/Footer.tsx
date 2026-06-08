import Link from "next/link"

export default function Footer() {
  return (
    <footer style={{
      padding: "3rem 2rem",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      background: "var(--bg-secondary)",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18V5l12-2v13" stroke="url(#logo-grad-footer)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6" cy="18" r="3" fill="url(#logo-grad-footer)"/>
              <circle cx="18" cy="16" r="3" fill="url(#logo-grad-footer)"/>
              <defs>
                <linearGradient id="logo-grad-footer" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00d4f0"/>
                  <stop offset="100%" stopColor="#e040fb"/>
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#fff" }}>
              Maestro<span style={{ background: "linear-gradient(90deg,#00d4f0,#e040fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Play</span>
            </span>
          </Link>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(240,238,255,0.4)" }}>
            AI Education Gaming Platform · <a href="https://aimaestro.academy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan)", textDecoration: "none" }}>aimaestro.academy</a>
          </p>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          <Link href="/games" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(240,238,255,0.5)", textDecoration: "none" }}>Games</Link>
          <a href="https://aimaestro.academy" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(240,238,255,0.5)", textDecoration: "none" }}>Academy</a>
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "rgba(240,238,255,0.3)" }}>
          © {new Date().getFullYear()} Maestro Academy. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
