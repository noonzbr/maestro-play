import type { Metadata } from "next"
import "./globals.css"
import PWARegister, { PWAInstallBanner } from "@/components/PWARegister"
import { AuthProvider } from "@/context/AuthContext"
import AuthModal from "@/components/ui/AuthModal"

export const metadata: Metadata = {
  title: "MaestroPlay — Master AI Without Code | Cinematic Learning Games",
  description: "The world's first career simulation engine for AI fluency. 14 cinematic story-driven games teach ChatGPT, Claude, Gemini & more. No coding required. Start free.",
  keywords: ["AI literacy", "learn AI", "prompt engineering", "AI for professionals", "AI training", "ChatGPT course", "Claude AI", "gamified learning", "AI skills", "no code AI"],
  authors: [{ name: "Felipe Maestro", url: "https://aimaestro.academy" }],
  creator: "Maestro Academy",
  metadataBase: new URL("https://maestro-play.vercel.app"),
  openGraph: {
    title: "MaestroPlay — Master AI Without Code",
    description: "14 cinematic games that teach you to use ChatGPT, Claude & Gemini like a professional. Story-driven. No code. Start free.",
    images: [{ url: "/images/maestroplayer1.png", width: 1200, height: 630, alt: "MaestroPlay — AI Learning Games" }],
    type: "website",
    siteName: "MaestroPlay",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MaestroPlay — Master AI Without Code",
    description: "14 cinematic games that teach AI fluency for professionals. Story-driven. No code. Start free.",
    images: ["/images/maestroplayer1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
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
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
        <PWARegister />
        <PWAInstallBanner />
      </body>
    </html>
  )
}
