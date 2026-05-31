import { getGame, allGames } from "@/lib/games"
import { notFound, redirect } from "next/navigation"
import GameEngine from "@/components/game/GameEngine"
import { getServerUser, hasGameAccess } from "@/lib/supabase-server"

// Force server-side rendering so auth cookies are readable at request time.
// Free game pages are cheap to render; Pro games need the security check anyway.
export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ success?: string }>
}

export async function generateStaticParams() {
  return allGames.map((g) => ({ slug: g.slug }))
}

export default async function GamePage({ params, searchParams }: Props) {
  const { slug } = await params
  const { success } = await searchParams

  const game = getGame(slug)
  if (!game) notFound()

  // Gate pro games behind auth + purchase check
  if (!game.free) {
    const session = await getServerUser()

    if (!session) {
      // Not authenticated → send to checkout (which shows auth + payment gate)
      redirect(`/checkout/${slug}`)
    }

    const access = await hasGameAccess(session.user.id, slug)
    if (!access) {
      // Authenticated but hasn't purchased → checkout
      redirect(`/checkout/${slug}`)
    }
  }

  return <GameEngine game={game} />
}
