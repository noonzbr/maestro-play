import { getGame, allGames } from "@/lib/games"
import { notFound, redirect } from "next/navigation"
import GameEngine from "@/components/game/GameEngine"

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

  // For locked games without purchase, redirect to checkout
  // (In production, check Supabase purchase record here)
  // We trust the client for now; middleware handles enforcement

  return <GameEngine game={game} />
}
