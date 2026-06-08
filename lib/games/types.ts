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
  question?:  string                 // quiz question after the table
  choices?:   Choice[]               // standard choices array
}

export type ChoiceBreakdown = {
  phrase: string   // exact text to highlight (substring of choice.text)
  note:   string   // what this phrase reveals
}

export type Choice = {
  label: string
  text: string
  /** Omit on decision/skipFeedback scenes — feedback is never shown */
  correct?: boolean
  feedback?: string
  wrongFeedback?: string   // optional wrong-answer-specific elaboration (overrides feedback when wrong)
  breakdown?: ChoiceBreakdown[]  // annotated phrases shown after correct reveal
  /** Scene ID to jump to after this choice is selected (overrides sequential index advance) */
  leadsTo?: string
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

/** Data for a consequence scene — shown when a player picks a wrong answer that has leadsTo set */
export type FelipeCardData = {
  quote: string
  /** ID of the scene to jump to after Felipe's card is dismissed */
  rejoinsAt: string
}

/** One track option shown in the track-select scene */
export type TrackOption = {
  id: "A" | "B" | "C" | "D"
  emoji: string
  label: string
  teaser: string
  felipeAside: string
  /** Slug of the first game in this track */
  nextGameSlug: string
}

/** One pair in a Matching scene */
export type MatchPair = { left: string; right: string }

/** One item in an Ordering scene */
export type OrderItem = { id: string; text: string; correctPosition: number }

export type Scene = {
  id: string
  type: "scenario" | "quiz" | "revelation" | "boss" | "prompt" | "learn" | "predict" | "handoff" | "ai-compare"
      | "match"          // drag/tap to connect concepts to definitions
      | "order"          // tap to build a sequence in the correct order
      | "construct"      // free-form: player writes their own response to a task/prompt challenge
      | "consequence"    // wrong-answer detour — shows story beat, auto-advances to felipe scene
      | "felipe"         // Felipe portrait + quote card — player clicks Continue
      | "track-select"   // 4-card track selection (end of hub game)
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
  /** Matching pairs — used when type === "match" */
  matchPairs?: MatchPair[]
  /** Ordering items — used when type === "order" */
  orderItems?: OrderItem[]
  /**
   * Construct mode — used when type === "construct".
   *   "self-assess": player submits, model answer (revealText) reveals, player self-rates
   *   "ai-score":    calls /api/ai-prompt to score the response (same as prompt scenes)
   */
  constructMode?: "self-assess" | "ai-score"
  /**
   * Felipe card data — used when type === "felipe".
   * Shows Felipe's portrait + quote, then jumps to rejoinsAt scene ID.
   */
  felipeCard?: FelipeCardData
  /**
   * Consequence text — used when type === "consequence".
   * A narrated story beat showing what happens after the wrong choice.
   * Auto-advances to the next scene in array (which should be the corresponding felipe scene).
   */
  consequenceText?: string
  /**
   * Track selection options — used when type === "track-select".
   * Renders Felipe's opening monologue + 4 track navigation cards.
   */
  trackOptions?: TrackOption[]
  /** Felipe's opening monologue for track-select scene */
  felipeMonologue?: string
  /**
   * Skip the feedback panel entirely — choices immediately navigate to leadsTo.
   * Used for narrative decision scenes where the player makes a STORY CHOICE, not a quiz answer.
   * No XP, no streak, no lives — just instant scene transition.
   */
  skipFeedback?: boolean
  /**
   * After the player clicks Continue/Next on this scene, navigate to this scene ID
   * instead of advancing sequentially. Works on any scene type (revelation, learn, scenario, etc).
   */
  nextLeadsTo?: string
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
  /** Felipe Maestro closing video — plays fullscreen between last scene and EndScreen */
  felipeOutroVideo?: string    // e.g. "/videos/felipe-game1.mp4"
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
  /**
   * Dr. Park's Transfer Bridge — "Monday Morning Prompt"
   * A real, copy-paste-ready prompt template shown on the EndScreen.
   * Closes the gap between game-context learning and real-world application.
   * If omitted, EndScreen generates a generic one based on game title/concept.
   * Format: plain text, use [BRACKETS] for player-filled variables.
   * Example: "Write me a [WHAT] about [TOPIC]. Do NOT include [WHAT_NOT].
   *           Format it as [HOW]. Context: [WHY]."
   */
  mondayPrompt?: string
}
