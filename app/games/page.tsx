import { allGames } from "@/lib/games"
import GameCard from "@/components/ui/GameCard"
import Nav from "@/components/ui/Nav"
import Footer from "@/components/ui/Footer"

export default function GamesPage() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingTop: "80px" }}>
        {/* Header */}
        <section style={{
          padding: "5rem 2rem 3rem",
          textAlign: "center",
          maxWidth: "700px",
          margin: "0 auto",
        }}>
          <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "1rem" }}>
            Game Catalog
          </div>
          <h1 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 700,
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}>
            Four Games.<br />
            <em style={{ background: "linear-gradient(90deg,#00d4f0,#e040fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              One Transformation.
            </em>
          </h1>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "1.05rem",
            color: "var(--muted)",
            lineHeight: 1.7,
          }}>
            Each game is 5–10 minutes. No lectures. No videos. Pure interactive learning. Start free.
          </p>
        </section>

        {/* Games grid */}
        <section style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 2rem 6rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}>
          {allGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </section>

        {/* Bundle CTA */}
        <section style={{
          textAlign: "center",
          padding: "3rem 2rem 6rem",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}>
          <div className="label-caps" style={{ color: "var(--muted)", marginBottom: "1rem" }}>
            Full Bundle
          </div>
          <h2 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 700,
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            color: "#fff",
            marginBottom: "0.75rem",
          }}>
            All 4 Weeks for $9.99
          </h2>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "var(--muted)", marginBottom: "2rem" }}>
            Save 20% · Instant access · Conductor certification included
          </p>
          <a href="/checkout/bundle" style={{
            display: "inline-flex",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "#08060f",
            background: "linear-gradient(90deg,#00d4f0,#e040fb)",
            padding: "0.85rem 2.5rem",
            borderRadius: "100px",
            textDecoration: "none",
          }}>
            Get Full Bundle →
          </a>
        </section>
      </main>
      <Footer />
    </>
  )
}
