import type { Metadata } from "next"
import "./globals.css"
import PWARegister, { PWAInstallBanner } from "@/components/PWARegister"

export const metadata: Metadata = {
  title: "MaestroPlay — AI Literacy Games",
  description: "Master AI through 10 interactive story-driven games. No code required.",
  openGraph: {
    title: "MaestroPlay — AI Literacy Games",
    description: "Master AI through 10 interactive story-driven games. No code required.",
    images: ["/images/maestroplayer1.png"],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00d4f0" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MaestroPlay" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <PWARegister />
        <PWAInstallBanner />
      </body>
    </html>
  )
}
