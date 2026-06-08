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

  const POWER_UP_PACKS = ["starter-pack", "maestro-bundle", "conductor-pass"]

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const productSlug = session.metadata?.productSlug || session.metadata?.gameSlug
    const userId      = session.metadata?.userId || undefined
    const amount      = session.amount_total || 0

    if (productSlug) {
      if (POWER_UP_PACKS.includes(productSlug)) {
        try {
          await recordPurchase({ stripeSessionId: session.id, gameSlug: productSlug, userId, amount })
        } catch (e) {
          console.error(`Failed to record pack purchase ${productSlug}:`, e)
        }
      } else {
        const slugsToUnlock = productSlug === "bundle"
          ? ["ai-for-professionals", "the-conductor-test"]
          : [productSlug]
        for (const slug of slugsToUnlock) {
          try {
            await recordPurchase({ stripeSessionId: session.id, gameSlug: slug, userId, amount })
          } catch (e) {
            console.error(`Failed to record purchase for ${slug}:`, e)
          }
        }
      }
    }
  }

  if (event.type === "invoice.paid") {
    // Recurring subscription renewal — record pack renewal
    const invoice = event.data.object as Stripe.Invoice
    const productSlug = invoice.metadata?.productSlug || invoice.metadata?.gameSlug
    const userId      = invoice.metadata?.userId || undefined
    const amount      = invoice.amount_paid || 0
    if (productSlug && POWER_UP_PACKS.includes(productSlug)) {
      try {
        await recordPurchase({ stripeSessionId: invoice.id, gameSlug: productSlug, userId, amount })
      } catch (e) {
        console.error(`Failed to record subscription renewal for ${productSlug}:`, e)
      }
    }
  }

  return NextResponse.json({ received: true })
}
