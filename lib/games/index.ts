import { week1 } from "./week1"
import { week2 } from "./week2"
import { week3 } from "./week3"
import { week4 } from "./week4"
import { Game } from "./types"

export const allGames: Game[] = [week1, week2, week3, week4]

export function getGame(slug: string): Game | undefined {
  return allGames.find((g) => g.slug === slug)
}

export { week1, week2, week3, week4 }
export type { Game }
