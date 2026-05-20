export type DialogueLine = {
  speaker: string
  avatar: "jake" | "npc"
  npcKey?: "default" | "senora_vega" | "marcus" | "ai"
  text: string
}

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
  dialogue?: DialogueLine[]
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
  icon?: "guitar" | "baton" | "musicNotes" | "tuningFork" | "gramophone" | "harp" | "metronome" | "headphones" | "volume"
  duration: string
  description: string
  tagline: string
  scenes: Scene[]
  price?: number
  priceId?: string
}
