import { game1 } from "./game1"
import { game1v2 } from "./game1v2"
import { game2 } from "./game2"
import { game3 } from "./game3"
import { game4 } from "./game4"
import { game5 } from "./game5"
import { game6 } from "./game6"
import { game7 } from "./game7"
import { game8 } from "./game8"
import { game9 } from "./game9"
import { game10 } from "./game10"
import { game11 } from "./game11"
import { game12 } from "./game12"
import { game13 } from "./game13"
import { game14 } from "./game14"
import { game15 } from "./game15"
import { Game } from "./types"

export const allGames: Game[] = [game1, game2, game3, game4, game5, game6, game7, game8, game9, game10, game11, game12, game1v2, game13, game14, game15]

export function getGame(slug: string): Game | undefined {
  return allGames.find((g) => g.slug === slug)
}

export { game1, game1v2, game2, game3, game4, game5, game6, game7, game8, game9, game10, game11, game12, game13, game14, game15 }
export type { Game }
