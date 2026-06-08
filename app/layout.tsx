import type { Metadata, Viewport } from "next"
import "./globals.css"
import PWARegister, { PWAInstallBanner } from "@/components/PWARegister"
import { AuthProvider } from "@/context/AuthContext"
import AuthModal from "@/components/ui/AuthModal"

// Next.js 16: viewport + themeColor belong in the dedicated `viewport` export.
// Putting <meta name="viewport"> manually in <head> produces a DUPLICATE tag
// because the framework auto-injects one. This export is the single source.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#00d4f0",
}

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
      {/* Skip-to-content: WCAG 2.4.1 — keyboard users bypass nav */}
      {/* Rendered as first focusable element in the DOM */}
      <head>
        {/* viewport + theme-color are handled by the `viewport` export above —
            do NOT add <meta name="viewport"> here or it duplicates. */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MaestroPlay" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        {/* fetchpriority=high: icon.svg is the LCP element — hint browser to load eagerly */}
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="preload" href="/icons/icon.svg" as="image" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-to-content">Skip to main content</a>
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
