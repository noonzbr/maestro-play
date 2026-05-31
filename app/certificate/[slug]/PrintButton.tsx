"use client"

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print"
      style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 700,
        fontSize: "0.95rem",
        color: "#fff",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.2)",
        padding: "0.85rem 2rem",
        borderRadius: "100px",
        cursor: "pointer",
        letterSpacing: "0.01em",
      }}
    >
      Download Certificate (PDF)
    </button>
  )
}
