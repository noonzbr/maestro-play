"use client"

import "./globals.css"
import PWARegister, { PWAInstallBanner } from "@/components/PWARegister"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>MaestroPlay — AI Literacy Games</title>
        <meta name="description" content="Master AI through 10 interactive story-driven games. No code required." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* PWA essentials */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00d4f0" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* iOS / Safari PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MaestroPlay" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />

        {/* Favicon */}
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Open Graph */}
        <meta property="og:title" content="MaestroPlay — AI Literacy Games" />
        <meta property="og:description" content="Master AI through 10 interactive story-driven games. No code required." />
        <meta property="og:image" content="/images/maestroplayer1.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <PWARegister />
        <PWAInstallBanner />
      </body>
    </html>
  )
}
