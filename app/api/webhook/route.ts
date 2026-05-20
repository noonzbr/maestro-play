import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { recordPurchase } from "@/lib/supabase"
import Stripe from "stripe"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const gameSlug = session.metadata?.gameSlug
    const userId = session.metadata?.userId || undefined
    const amount = session.amount_total || 0

    if (gameSlug) {
      // Handle bundle — unlock both week 3 and week 4
      const slugsToUnlock = gameSlug === "bundle"
        ? ["ai-for-professionals", "the-conductor-test"]
        : [gameSlug]

      for (const slug of slugsToUnlock) {
        try {
          await recordPurchase({
            stripeSessionId: session.id,
            gameSlug: slug,
            userId,
            amount,
          })
        } catch (e) {
          console.error(`Failed to record purchase for ${slug}:`, e)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
