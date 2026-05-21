export type DialogueLine = {
  speaker: string
  avatar: "jake" | "npc"
  npcKey?: "default" | "senora_vega" | "tyler" | "ai"
  text: string
}

export type Choice = {
  label: string
  text: string
  correct: boolean
  feedback: string
}

export type PromptChallengeData = {
  context:     string
  goal:        string
  placeholder?: string
}

export type Scene = {
  id: string
  type: "scenario" | "quiz" | "revelation" | "boss" | "prompt"
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
  promptChallenge?: PromptChallengeData
}

export type Game = {
  slug: string
  week: number
  free: boolean
  title: string
  emoji: string
  icon?: "guitar" | "baton" | "musicNotes" | "tuningFork" | "gramophone" | "harp" | "metronome" | "headphones" | "volume"
  accentColor?: string      // hex — overrides var(--cyan) for per-game theming
  characterImage?: string   // "/images/zoe.png"   — shown in transformation phase 0
  maestroImage?: string     // "/images/maestro-zoe.png" — shown in transformation phase 1+
  maestroLine?: string      // "The last time she was just a drummer..."
  maestroSubline?: string   // shown on EndScreen below the maestro image
  duration: string
  description: string
  tagline: string
  scenes: Scene[]
  price?: number
  priceId?: string
}
