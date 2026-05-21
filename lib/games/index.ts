import { game1 } from "./game1"
import { game2 } from "./game2"
import { game3 } from "./game3"
import { game4 } from "./game4"
import { game5 } from "./game5"
import { Game } from "./types"

export const allGames: Game[] = [game1, game2, game3, game4, game5]

export function getGame(slug: string): Game | undefined {
  return allGames.find((g) => g.slug === slug)
}

export { game1, game2, game3, game4, game5 }
export type { Game }
