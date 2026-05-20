export type Choice = {
  label: string
  text: string
  correct: boolean
  feedback: string
}

export type Scene = {
  id: string
  type: "scenario" | "quiz" | "revelation" | "boss"
  character?: string
  location?: string
  scenarioText?: string
  npcLine?: string
  concept?: { title: string; body: string }
  question?: string
  choices?: Choice[]
  xpAward: number
  revealText?: string
}

export type Game = {
  slug: string
  week: number
  free: boolean
  title: string
  emoji: string
  duration: string
  description: string
  tagline: string
  scenes: Scene[]
  price?: number
  priceId?: string
}
