export type IntroBeat = {
  type: "location" | "narration" | "dialogue" | "final"
  speaker?: string
  text: string
}

export type GameIntro = {
  sceneImage?: string          // e.g. "/images/jakebedroom.png"
  sceneColor?: string          // fallback bg color when no image, e.g. "#050810"
  noteOrigin?: { bottom: string; left: string }  // where floating notes rise from
  beats: IntroBeat[]
}

export type DialogueLine = {
  speaker: string
  /** "protagonist" = right-side character (works for any game hero, not just Jake) */
  avatar: "jake" | "protagonist" | "npc"
  npcKey?: "default" | "senora_vega" | "tyler" | "ai"
  text: string
}

/** One row in an AI model comparison table */
export type AICompareRow = {
  dimension: string    // e.g. "Creative Writing"
  winner:    string    // e.g. "Claude"
  claude?:   string    // short descriptor — e.g. "Nuanced, long-form"
  chatgpt?:  string
  gemini?:   string
  copilot?:  string
  note?:     string    // optional teaching note
}

/** Full AI model comparison block for "ai-compare" scenes */
export type AICompareData = {
  models:    ("claude" | "chatgpt" | "gemini" | "copilot")[]  // which models to compare
  headline:  string                 // e.g. "Claude vs ChatGPT — Actually Different Tools"
  context:   string                 // 1-2 sentence intro
  rows:      AICompareRow[]
  verdict:   string                 // closing takeaway sentence
  question:  string                 // quiz question after the table
  choices:   Choice[]               // standard choices array
}

export type ChoiceBreakdown = {
  phrase: string   // exact text to highlight (substring of choice.text)
  note:   string   // what this phrase reveals
}

export type Choice = {
  label: string
  text: string
  correct: boolean
  feedback: string
  wrongFeedback?: string   // optional wrong-answer-specific elaboration (overrides feedback when wrong)
  breakdown?: ChoiceBreakdown[]  // annotated phrases shown after correct reveal
}

export type PromptChallengeData = {
  context:     string
  goal:        string
  placeholder?: string
}

export type BossQuestion = {
  question:  string
  npcLine?:  string
  choices:   Choice[]
}

export type Scene = {
  id: string
  type: "scenario" | "quiz" | "revelation" | "boss" | "prompt" | "learn" | "predict" | "handoff" | "ai-compare"
  character?: string
  location?: string
  scenarioText?: string
  npcLine?: string
  concept?: { title: string; body: string }
  learnHighlight?: string     // pull-quote shown on "learn" scenes
  dialogue?: DialogueLine[]
  question?: string
  choices?: Choice[]
  xpAward: number
  revealText?: string
  promptChallenge?: PromptChallengeData
  /** PixVerse clip played as a cinematic moment before the revelation text */
  revelationVideo?: string    // e.g. "/videos/g01-reveal.mp4"
  /** 5-punch boss battle rounds — if present, BossArena renders instead of SceneRenderer */
  bossQuestions?: BossQuestion[]
  /**
   * "Predict the Output" scene type.
   * Shows a chat-bubble interface: what Jake typed → player picks which AI output he actually got.
   * Uses the standard `question`, `choices`, and `xpAward` fields.
   * `predictPrompt` is what Jake typed into the AI (shown in a right-aligned chat bubble).
   */
  predictPrompt?: string
  /** AI model comparison data — used when type === "ai-compare" */
  aiCompare?: AICompareData
}

export type Game = {
  slug: string
  week: number
  free: boolean
  title: string
  emoji: string
  icon?: "guitar" | "baton" | "musicNotes" | "tuningFork" | "gramophone" | "harp" | "metronome" | "headphones" | "volume"
  accentColor?: string      // hex — overrides var(--cyan) for per-game theming
  audioTrack?: string       // "/audio/zoe-glass-circuit.mp3" — overrides default normal/boss track
  characterName?: string    // "Jake" — shown on pathway card
  characterRole?: string    // "17-year-old guitarist" — shown on pathway card
  characterBlurb?: string   // one-liner shown on pathway card under character name
  characterImage?: string   // "/images/zoe.png"   — shown in transformation phase 0
  maestroImage?: string     // "/images/maestro-zoe.png" — shown in transformation phase 1+
  maestroLine?: string      // "The last time she was just a drummer..."
  maestroSubline?: string   // shown on EndScreen below the maestro image
  duration: string
  description: string
  tagline: string
  scenes: Scene[]
  intro?: GameIntro
  price?: number
  priceId?: string
  /**
   * PixVerse video clips — all optional.
   * Drop the file in /public/videos/ and reference it here.
   *
   *   introVideo      — plays instead of the generic MaestroPlay opener
   *   endVideo        — plays on the EndScreen before the transformation
   *
   * Naming convention: /videos/g01-intro.mp4, /videos/g01-end.mp4, etc.
   */
  introVideo?: string          // e.g. "/videos/g01-intro.mp4"
  endVideo?: string            // e.g. "/videos/g01-end.mp4"
  /**
   * Looping video clip for the protagonist character in dialogue scenes.
   * Only set this for a specific game's character — e.g. Jake in game 1.
   * Falls back to characterImage (static PNG) if not provided.
   * Convention: /videos/char-jake.mp4, /videos/char-zoe.mp4, etc.
   */
  protagonistVideo?: string    // e.g. "/videos/char-jake.mp4"
  /** Which AI model this game primarily teaches */
  aiModel?: "claude" | "chatgpt" | "gemini" | "copilot" | "general"
  /** Handoff teaser — used to build the end-of-game "what's next" dialogue */
  nextGame?: {
    slug:        string     // e.g. "how-ai-works"
    character:   string     // e.g. "Zoe"
    teaserLine:  string     // what the current character says about the next game
    previewImage?: string   // optional image of next character
  }
}
