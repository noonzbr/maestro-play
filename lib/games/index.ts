import { week1 } from "./week1"
import { week2 } from "./week2"
import { week3 } from "./week3"
import { week4 } from "./week4"
import { week5 } from "./week5"
import { Game } from "./types"

export const allGames: Game[] = [week1, week2, week3, week4, week5]

export function getGame(slug: string): Game | undefined {
  return allGames.find((g) => g.slug === slug)
}

export { week1, week2, week3, week4, week5 }
export type { Game }
