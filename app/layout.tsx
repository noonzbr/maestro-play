"use client"

import "./globals.css"
import { useEffect, useRef } from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX + "px"
      dot.style.top = mouseY + "px"
    }

    let raf: number
    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = ringX + "px"
      ring.style.top = ringY + "px"
      raf = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", onMove)
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <html lang="en" className="h-full">
      <head>
        <title>MaestroPlay — AI Education Gaming Platform</title>
        <meta name="description" content="Learn AI without coding. Gamified AI literacy for professionals. You don't need to code. You need to conduct." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col">
        <div ref={dotRef} className="cursor-dot" />
        <div ref={ringRef} className="cursor-ring" />
        {children}
      </body>
    </html>
  )
}
