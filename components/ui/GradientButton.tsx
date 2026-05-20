"use client"

import Link from "next/link"
import { CSSProperties } from "react"

type Props = {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  variant?: "primary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  style?: CSSProperties
  disabled?: boolean
}

export default function GradientButton({ href, onClick, children, variant = "primary", size = "md", style, disabled }: Props) {
  const sizes = {
    sm: { padding: "0.4rem 1rem", fontSize: "0.8rem" },
    md: { padding: "0.65rem 1.6rem", fontSize: "0.875rem" },
    lg: { padding: "0.85rem 2.2rem", fontSize: "1rem" },
  }

  const base: CSSProperties = {
    fontFamily: "Inter, sans-serif",
    fontWeight: 700,
    letterSpacing: "0.02em",
    borderRadius: "100px",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "opacity 0.2s, transform 0.2s, box-shadow 0.2s",
    border: "none",
    ...sizes[size],
    ...style,
  }

  const variants: Record<string, CSSProperties> = {
    primary: {
      background: "linear-gradient(90deg,#00d4f0,#e040fb)",
      color: "#08060f",
    },
    outline: {
      background: "transparent",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.2)",
    },
    ghost: {
      background: "rgba(255,255,255,0.05)",
      color: "rgba(240,238,255,0.8)",
    },
  }

  const combined: CSSProperties = { ...base, ...variants[variant] }

  const onEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return
    e.currentTarget.style.transform = "translateY(-2px)"
    if (variant === "primary") e.currentTarget.style.boxShadow = "0 0 30px rgba(0,212,240,0.3)"
  }
  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "translateY(0)"
    e.currentTarget.style.boxShadow = "none"
  }

  if (href) {
    return (
      <Link href={href} style={combined} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        {children}
      </Link>
    )
  }

  return (
    <button style={combined} onClick={disabled ? undefined : onClick} onMouseEnter={onEnter} onMouseLeave={onLeave} disabled={disabled}>
      {children}
    </button>
  )
}
