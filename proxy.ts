import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Optimistic auth gate for Pro-gated game routes.
 * Only checks for the presence of a Supabase auth cookie — no DB call.
 * The actual purchase verification happens in the Server Component.
 *
 * Next.js 16: this file must be named proxy.ts and export a function named `proxy`.
 */

const PRO_SLUGS = new Set([
  "ai-for-professionals",
  "the-conductor-test",
  "claude-for-work",
  "chatgpt-mastery",
  "gemini-cli-unlocked",
  "copilot-studio",
])

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only gate /games/[slug] routes
  const match = pathname.match(/^\/games\/([^/]+)\/?$/)
  if (!match) return NextResponse.next()

  const slug = match[1]
  if (!PRO_SLUGS.has(slug)) return NextResponse.next()

  // Optimistic check: does the user have ANY Supabase auth cookie?
  // Cookie name: sb-<project-ref>-auth-token (or chunked: sb-<ref>-auth-token.0)
  const hasAuthCookie = request.cookies.getAll().some(
    c => /^sb-.+-auth-token(\.0)?$/.test(c.name)
  )

  if (!hasAuthCookie) {
    // Not logged in — redirect to checkout (which shows the auth + payment gate)
    const dest = new URL(`/checkout/${slug}`, request.url)
    return NextResponse.redirect(dest)
  }

  // Auth cookie present — let the Server Component do the purchase check
  return NextResponse.next()
}

export const config = {
  matcher: ["/games/:slug*"],
}
