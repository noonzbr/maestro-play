/**
 * /pixverse-brief
 * Print to PDF: Ctrl+P → Save as PDF → Layout: Portrait
 * Organized by CHARACTER so you know exactly who to generate for.
 */

export const metadata = { title: "MaestroPlay · PixVerse Video Brief" }

/* ── Types ─────────────────────────────────────────────────────────────── */
type VideoEntry = {
  type:        "intro" | "revelation" | "end"
  forGame:     string     // e.g. "Game 1 — Welcome to the Exciting World of AI"
  fileTarget:  string
  sourceImage: string
  duration:    string
  credits:     number
  prompt:      string
  action:      string
  narration:   string
}

type CharacterBrief = {
  name:         string
  role:         string
  sourceImages: string[]   // all image files usable as source
  accentColor:  string
  videos:       VideoEntry[]
}

/* ── Character data ─────────────────────────────────────────────────────── */
const CHARACTERS: CharacterBrief[] = [

  /* ──────────────────────────────────────────────────────────── JAKE */
  {
    name: "Jake",
    role: "17-year-old guitarist → music club president → bot builder (Games 1, 11, 12)",
    sourceImages: ["guitarplayer1.png", "guitarjake.png", "guitarjake3.png"],
    accentColor: "#0055aa",
    videos: [
      // ── GAME 1 ────────────────────────────────────────────────────────
      {
        type: "intro", forGame: "Game 1 — Welcome to the Exciting World of AI",
        fileTarget: "/public/videos/g01-intro.mp4",
        sourceImage: "guitarplayer1.png",
        duration: "7 sec", credits: 70,
        prompt: "Teenage male guitarist in dark bedroom at 11 PM, blue computer screen glow, electric guitar in hands, frustrated expression slowly shifting to surprised curiosity as he glances at laptop, subtle head tilt, moody cinematic lighting",
        action: "Jake looks up from guitar at laptop — frustration turns to curiosity",
        narration: "Three hours a day. Every day. But the world just changed.",
      },
      {
        type: "revelation", forGame: "Game 1 — Welcome to the Exciting World of AI",
        fileTarget: "/public/videos/g01-reveal.mp4",
        sourceImage: "guitarplayer1.png",
        duration: "7 sec", credits: 70,
        prompt: "Teenage male guitarist standing up slowly with wonder on face, golden musical note particles appear around him, raises one hand slowly like conducting an orchestra, light shifts from blue to warm gold, transformative cinematic moment",
        action: "Jake stands, raises hand like a conductor — golden light fills the frame",
        narration: "You were never just a guitarist. You were always a conductor.",
      },
      {
        type: "end", forGame: "Game 1 — Welcome to the Exciting World of AI",
        fileTarget: "/public/videos/g01-end.mp4",
        sourceImage: "maestroplayer1.png",
        duration: "5 sec", credits: 50,
        prompt: "Young male conductor in dark elegant attire with baton, bedroom backdrop glowing warm concert gold, proud confident smile, raises baton triumphantly, golden particles swirl, cinematic close",
        action: "Maestro Jake raises baton — transformation complete",
        narration: "The Maestro has arrived.",
      },
      // ── GAME 11 ───────────────────────────────────────────────────────
      {
        type: "intro", forGame: "Game 11 — Microsoft Copilot (M365)",
        fileTarget: "/public/videos/g11-intro.mp4",
        sourceImage: "guitarjake.png",
        duration: "7 sec", credits: 70,
        prompt: "Teenage male student in school admin office, laptop showing Microsoft Word, surrounded by printed club paperwork, overwhelmed expression counting on fingers, then notices something on screen with sudden curiosity, fluorescent school lighting, cinematic",
        action: "Jake drowning in admin — notices Copilot hiding in plain sight",
        narration: "He'd been running the music club on willpower. The tools were already there.",
      },
      {
        type: "revelation", forGame: "Game 11 — Microsoft Copilot (M365)",
        fileTarget: "/public/videos/g11-reveal.mp4",
        sourceImage: "guitarjake.png",
        duration: "7 sec", credits: 70,
        prompt: "Teenage male student, watching laptop screen with growing amazement as documents summarize themselves, eyes widen, slow incredulous smile, shakes head gently, school transforms to feel like a stage, cinematic breakthrough",
        action: "Jake watches Copilot work inside his M365 tools — it was there all along",
        narration: "He had been flying the whole time. He just hadn't looked at the instrument panel.",
      },
      {
        type: "end", forGame: "Game 11 — Microsoft Copilot (M365)",
        fileTarget: "/public/videos/g11-end.mp4",
        sourceImage: "maestroplayer1.png",
        duration: "5 sec", credits: 50,
        prompt: "Young male conductor, school music room in background, confident mature energy, raises baton with practiced authority, warm school auditorium lighting, cinematic, Jake grown into conductor",
        action: "Maestro Jake — the music club runs itself now",
        narration: "Jake runs the music club AND the AI. Copilot keeps up.",
      },
      // ── GAME 12 ───────────────────────────────────────────────────────
      {
        type: "intro", forGame: "Game 12 — Copilot Studio (Build Your Own AI Agent)",
        fileTarget: "/public/videos/g12-intro.mp4",
        sourceImage: "guitarjake3.png",
        duration: "7 sec", credits: 70,
        prompt: "Teenage male in music club room, laptop open with flooded email inbox, counts on fingers the same questions he keeps answering every week, tired but suddenly amused expression, then looks at laptop with a scheming confident smile, cinematic maker energy",
        action: "Jake counts the same five questions — then smiles. He has a plan.",
        narration: "Thirty-one emails. Same five questions. Jake had a better plan.",
      },
      {
        type: "revelation", forGame: "Game 12 — Copilot Studio (Build Your Own AI Agent)",
        fileTarget: "/public/videos/g12-reveal.mp4",
        sourceImage: "guitarjake3.png",
        duration: "7 sec", credits: 70,
        prompt: "Teenage male student watching laptop screen showing a live chatbot answering club questions automatically, slow wide smile spreads across face, leans back and folds arms with deep pride and satisfaction, sense of completion, cinematic",
        action: "Jake watches MelodyBot answer questions on its own — he built this",
        narration: "MelodyBot went live on Friday. By Monday the emails were thank-yous.",
      },
      {
        type: "end", forGame: "Game 12 — Copilot Studio (Build Your Own AI Agent)",
        fileTarget: "/public/videos/g12-end.mp4",
        sourceImage: "maestroplayer1.png",
        duration: "5 sec", credits: 50,
        prompt: "Young male conductor, school auditorium stage, raises baton with quiet mastery and a knowing smile, golden finale lighting, Jake's full arc complete, intimate and triumphant, cinematic",
        action: "Jake — the final transformation. Story complete.",
        narration: "He deployed his first AI agent. The music plays on.",
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────── ZOE */
  {
    name: "Zoe",
    role: "19-year-old drummer (Game 2 — Discover How AI Works)",
    sourceImages: ["zoe.png", "maestro-zoe.png"],
    accentColor: "#7700cc",
    videos: [
      {
        type: "intro", forGame: "Game 2 — Discover How AI Works",
        fileTarget: "/public/videos/g02-intro.mp4",
        sourceImage: "zoe.png",
        duration: "7 sec", credits: 70,
        prompt: "Young woman drummer in rehearsal studio at night, purple stage lights, drumsticks in hand, looking at phone with worried expression then setting it down with determined resolve, subtle head movement, cinematic moody lighting",
        action: "Zoe reads bad news on phone, sets it down, looks up with determination",
        narration: "She kept time for everyone. But the beat was changing.",
      },
      {
        type: "revelation", forGame: "Game 2 — Discover How AI Works",
        fileTarget: "/public/videos/g02-reveal.mp4",
        sourceImage: "zoe.png",
        duration: "7 sec", credits: 70,
        prompt: "Young woman drummer, eyes widen with sudden realization, drumsticks lower as hands shift to open conducting gesture, lighting shifts from cool purple to warm amber gold, confident smile blooms, cinematic dramatic insight moment",
        action: "Zoe's hands move from drumstick grip to conducting — rhythm becomes direction",
        narration: "Pattern recognition. That was your superpower all along.",
      },
      {
        type: "end", forGame: "Game 2 — Discover How AI Works",
        fileTarget: "/public/videos/g02-end.mp4",
        sourceImage: "maestro-zoe.png",
        duration: "5 sec", credits: 50,
        prompt: "Young woman conductor, warm golden stage lighting, relaxed confident posture, raises both hands in smooth conducting gesture, satisfied smile, cinematic, triumphant",
        action: "Maestro Zoe conducts — rhythm finds its conductor",
        narration: "Zoe's rhythm found its conductor. Keep the beat.",
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────── CARLOS */
  {
    name: "Carlos",
    role: "38-year-old jazz saxophonist (Game 3 — AI for Professionals)",
    sourceImages: ["carlos.png", "maestro-carlos.png"],
    accentColor: "#cc5500",
    videos: [
      {
        type: "intro", forGame: "Game 3 — AI for Professionals",
        fileTarget: "/public/videos/g03-intro.mp4",
        sourceImage: "carlos.png",
        duration: "7 sec", credits: 70,
        prompt: "Middle-aged professional man with saxophone, backstage before a concert, warm backstage lighting, holding saxophone thoughtfully while looking at phone with worried frown, then straightening up with quiet resolve, jazz venue atmosphere, cinematic",
        action: "Carlos holds his saxophone, reads concerning news, straightens with determination",
        narration: "Thirty-eight years of mastery. And still, the music was shifting.",
      },
      {
        type: "revelation", forGame: "Game 3 — AI for Professionals",
        fileTarget: "/public/videos/g03-reveal.mp4",
        sourceImage: "carlos.png",
        duration: "7 sec", credits: 70,
        prompt: "Middle-aged professional man, saxophone held to side, slow smile of realization spreads, eyes light up with understanding, nods deliberately with confidence, warm amber light intensifies, cinematic moment of strategic clarity",
        action: "Carlos nods slowly — the AI doesn't replace the craft. It serves it.",
        narration: "The musician who learns to conduct commands the whole orchestra.",
      },
      {
        type: "end", forGame: "Game 3 — AI for Professionals",
        fileTarget: "/public/videos/g03-end.mp4",
        sourceImage: "maestro-carlos.png",
        duration: "5 sec", credits: 50,
        prompt: "Middle-aged male conductor, professional confident bearing, concert hall lighting, raises baton with practiced authority, slight smile of mastery, cinematic, elegant",
        action: "Maestro Carlos raises baton — precision and experience combined",
        narration: "Carlos plays every note with intention. Now you will too.",
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────── ARIA */
  {
    name: "Aria",
    role: "26-year-old violinist (Game 4 — The Conductor Test)",
    sourceImages: ["aria.png", "maestro-aria.png"],
    accentColor: "#cc0044",
    videos: [
      {
        type: "intro", forGame: "Game 4 — The Conductor Test",
        fileTarget: "/public/videos/g04-intro.mp4",
        sourceImage: "aria.png",
        duration: "7 sec", credits: 70,
        prompt: "Young woman violinist in concert hall, elegant attire, holding violin with intense focus, looks up from music stand with competitive determined expression, dramatic concert lighting, classical music atmosphere, cinematic",
        action: "Aria looks up from her violin — the challenge has been set, and she accepts it",
        narration: "Mastery is not the destination. It is the only map that matters.",
      },
      {
        type: "revelation", forGame: "Game 4 — The Conductor Test",
        fileTarget: "/public/videos/g04-reveal.mp4",
        sourceImage: "aria.png",
        duration: "7 sec", credits: 70,
        prompt: "Young woman violinist, stands tall with triumphant expression, golden spotlight floods from behind, eyes close briefly then open with confidence and clarity, quiet proud smile, cinematic transformation moment",
        action: "Aria stands tall — she has passed the Conductor Test",
        narration: "You are now a Maestro Conductor. The baton is yours.",
      },
      {
        type: "end", forGame: "Game 4 — The Conductor Test",
        fileTarget: "/public/videos/g04-end.mp4",
        sourceImage: "maestro-aria.png",
        duration: "5 sec", credits: 50,
        prompt: "Young woman conductor, concert hall, raises violin bow as a conducting baton, composed confident smile, warm golden lighting, elegant bearing, cinematic",
        action: "Maestro Aria — precision becomes direction",
        narration: "Aria leads the section. The stage is yours.",
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────── JORDAN */
  {
    name: "Jordan",
    role: "28-year-old freelance consultant (Game 5 — Unlock Claude Chat)",
    sourceImages: ["jordan.png", "maestro-jordan.png"],
    accentColor: "#007755",
    videos: [
      {
        type: "intro", forGame: "Game 5 — Unlock Claude Chat — Your AI Co-Pilot",
        fileTarget: "/public/videos/g05-intro.mp4",
        sourceImage: "jordan.png",
        duration: "7 sec", credits: 70,
        prompt: "Late-20s professional in coffee shop late at night, laptop open, multiple browser tabs, tired stressed expression rubbing eyes, then sits forward with sudden renewed energy when something clicks on screen, warm coffee shop lighting, cinematic",
        action: "Jordan exhausted and overwhelmed — then leans forward with sudden energy",
        narration: "Three open proposals. One overdue invoice. Zero time.",
      },
      {
        type: "revelation", forGame: "Game 5 — Unlock Claude Chat — Your AI Co-Pilot",
        fileTarget: "/public/videos/g05-reveal.mp4",
        sourceImage: "jordan.png",
        duration: "7 sec", credits: 70,
        prompt: "Late-20s professional leaning back in coffee shop with satisfied smile, laptop glows in background, relaxed confident posture, relief and clarity on face, sense of having just solved something large, warm lighting",
        action: "Jordan leans back — from overwhelmed to completely in control",
        narration: "You used to hand someone a to-do list and wait. Now you think alongside it.",
      },
      {
        type: "end", forGame: "Game 5 — Unlock Claude Chat — Your AI Co-Pilot",
        fileTarget: "/public/videos/g05-end.mp4",
        sourceImage: "maestro-jordan.png",
        duration: "5 sec", credits: 50,
        prompt: "Late-20s professional conductor, modern cafe or office, confident relaxed smile, raises hand in subtle conducting gesture, soft warm lighting, cinematic",
        action: "Maestro Jordan — the thinking partner arrives",
        narration: "Jordan's thinking just found its conductor.",
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────── KAI */
  {
    name: "Kai",
    role: "24-year-old junior developer (Game 6 — Claude Code)",
    sourceImages: ["kai.png", "maestro-kai.png"],
    accentColor: "#0099aa",
    videos: [
      {
        type: "intro", forGame: "Game 6 — Claude Code — AI in Your Terminal",
        fileTarget: "/public/videos/g06-intro.mp4",
        sourceImage: "kai.png",
        duration: "7 sec", credits: 70,
        prompt: "Young male developer at desk in startup office at 2 AM, multiple monitors with terminal open, staring at blinking cursor with frustrated confused expression, then slowly leaning forward with dawning realization, blue terminal glow, dark office atmosphere, cinematic",
        action: "Kai stares at the blinking cursor — then something shifts in his understanding",
        narration: "The bug was never the code. It was always working alone.",
      },
      {
        type: "revelation", forGame: "Game 6 — Claude Code — AI in Your Terminal",
        fileTarget: "/public/videos/g06-reveal.mp4",
        sourceImage: "kai.png",
        duration: "7 sec", credits: 70,
        prompt: "Young male developer sitting back with wide eyes and slow disbelieving smile, terminal screen shows rapid code generation in background, hands open palms-up in amazed gesture, blue glow warms to gold, cinematic breakthrough moment",
        action: "Kai watches Claude Code write — leans back in disbelief. He shipped in 40 minutes.",
        narration: "He didn't get faster. He stopped working alone.",
      },
      {
        type: "end", forGame: "Game 6 — Claude Code — AI in Your Terminal",
        fileTarget: "/public/videos/g06-end.mp4",
        sourceImage: "maestro-kai.png",
        duration: "5 sec", credits: 50,
        prompt: "Young male developer-turned-conductor, dark startup with neon code glow, confident stance, raises hand to conduct like directing code instead of orchestra, tech-meets-music aesthetic, cinematic",
        action: "Maestro Kai — the terminal becomes the orchestra pit",
        narration: "Kai ships faster now. The codebase bends to the conductor.",
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────── PRIYA */
  {
    name: "Priya",
    role: "33-year-old operations manager (Game 7 — Claude for Work)",
    sourceImages: ["priya.png", "maestro-priya.png"],
    accentColor: "#884400",
    videos: [
      {
        type: "intro", forGame: "Game 7 — Claude for Work — AI That Knows Your Business",
        fileTarget: "/public/videos/g07-intro.mp4",
        sourceImage: "priya.png",
        duration: "7 sec", credits: 70,
        prompt: "Early-30s professional woman in glass conference room at dusk, business attire, looking at spreadsheets and dashboards with overwhelmed expression, then sits straighter with strategic thinking shifting across her face, corporate cinematic lighting",
        action: "Priya surveys the chaos — then straightens. She sees the system now.",
        narration: "Every system she built held the company together. Only she knew how fragile it was.",
      },
      {
        type: "revelation", forGame: "Game 7 — Claude for Work — AI That Knows Your Business",
        fileTarget: "/public/videos/g07-reveal.mp4",
        sourceImage: "priya.png",
        duration: "7 sec", credits: 70,
        prompt: "Early-30s professional woman leans forward to laptop with sharp purposeful energy, conference room lighting warms dramatically, decisive expression, nodding as results appear, sense of orchestrating a complex system with ease",
        action: "Priya types with precision — she's not managing chaos anymore. She's directing it.",
        narration: "She didn't make the AI smarter. She finally gave it what it needed.",
      },
      {
        type: "end", forGame: "Game 7 — Claude for Work — AI That Knows Your Business",
        fileTarget: "/public/videos/g07-end.mp4",
        sourceImage: "maestro-priya.png",
        duration: "5 sec", credits: 50,
        prompt: "Early-30s professional woman conductor, corporate meets orchestra aesthetic, confident authoritative posture, raises baton with quiet power, warm boardroom lighting, cinematic",
        action: "Maestro Priya — operations becomes orchestration",
        narration: "Priya runs the show. Now the AI runs with her.",
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────── ALEX */
  {
    name: "Alex",
    role: "26-year-old content creator (Game 8 — ChatGPT Beyond the Hype)",
    sourceImages: ["alex.png", "maestro-alex.png"],
    accentColor: "#cc2200",
    videos: [
      {
        type: "intro", forGame: "Game 8 — ChatGPT — Beyond the Hype",
        fileTarget: "/public/videos/g08-intro.mp4",
        sourceImage: "alex.png",
        duration: "7 sec", credits: 70,
        prompt: "Mid-20s male content creator in home studio at 1 AM, ring light on, phone in hand, blank caption on screen, frustrated tired expression, phone notification jolts him alert with urgency, studio lighting, cinematic",
        action: "Alex stares at blank content, gets bad notification, looks up with urgent energy",
        narration: "The algorithm rewards output. The audience rewards truth. He needed both.",
      },
      {
        type: "revelation", forGame: "Game 8 — ChatGPT — Beyond the Hype",
        fileTarget: "/public/videos/g08-reveal.mp4",
        sourceImage: "alex.png",
        duration: "7 sec", credits: 70,
        prompt: "Mid-20s male content creator looking at phone with growing amazement, ring light casting dramatic shadows, eyebrows rise then wide grin spreads, leans back gesturing like 'finally this is it', cinematic breakthrough moment",
        action: "Alex watches content flow — eyes wide, grin spreading. He gets it now.",
        narration: "He spent a year asking for 'Mary Had a Little Lamb.' This week he asked for a sonata.",
      },
      {
        type: "end", forGame: "Game 8 — ChatGPT — Beyond the Hype",
        fileTarget: "/public/videos/g08-end.mp4",
        sourceImage: "maestro-alex.png",
        duration: "5 sec", credits: 50,
        prompt: "Mid-20s male conductor, studio meets stage, ring light becomes spotlight, raises phone like a baton, relaxed confident smile, modern creative energy, cinematic",
        action: "Maestro Alex — the content creator becomes the director",
        narration: "Alex creates on his terms now. The feed follows the conductor.",
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────── LUNA */
  {
    name: "Luna",
    role: "21-year-old grad student (Game 9 — Gemini Unleashed)",
    sourceImages: ["luna.png", "maestro-luna.png"],
    accentColor: "#4400aa",
    videos: [
      {
        type: "intro", forGame: "Game 9 — Gemini — Google's AI, Fully Unleashed",
        fileTarget: "/public/videos/g09-intro.mp4",
        sourceImage: "luna.png",
        duration: "7 sec", credits: 70,
        prompt: "Young woman grad student in university library at midnight, surrounded by open books and papers, laptop glow showing too many tabs, overwhelmed expression, rubs temples, then one thing catches her eye and she leans in with sudden focus, academic atmosphere, cinematic",
        action: "Luna drowning in research — then one thing catches her eye. She leans in.",
        narration: "Fifteen browser tabs. Three contradicting papers. Intelligence was never the bottleneck.",
      },
      {
        type: "revelation", forGame: "Game 9 — Gemini — Google's AI, Fully Unleashed",
        fileTarget: "/public/videos/g09-reveal.mp4",
        sourceImage: "luna.png",
        duration: "7 sec", credits: 70,
        prompt: "Young woman grad student, sits back with calm satisfied expression, closes browser tabs one by one with serene confidence, library has warm quiet glow, subtle smile of someone who knows exactly where to look, academic peace and clarity",
        action: "Luna closes tabs one by one — calm, focused, purposeful. She has her answer.",
        narration: "She didn't write faster. She thought faster — with a thinking partner.",
      },
      {
        type: "end", forGame: "Game 9 — Gemini — Google's AI, Fully Unleashed",
        fileTarget: "/public/videos/g09-end.mp4",
        sourceImage: "maestro-luna.png",
        duration: "5 sec", credits: 50,
        prompt: "Young woman conductor, library meets stage, warm academic gold lighting, raises hand with quiet intellectual authority, serene confident smile, cinematic",
        action: "Maestro Luna — research becomes revelation",
        narration: "Luna submitted three days early. Intelligence found its conductor.",
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────── SAM */
  {
    name: "Sam",
    role: "29-year-old DevOps engineer (Game 10 — Gemini CLI)",
    sourceImages: ["sam.png", "maestro-sam.png"],
    accentColor: "#005500",
    videos: [
      {
        type: "intro", forGame: "Game 10 — Gemini CLI — AI for the Command Line",
        fileTarget: "/public/videos/g10-intro.mp4",
        sourceImage: "sam.png",
        duration: "7 sec", credits: 70,
        prompt: "Late-20s male DevOps engineer in home lab at 1 AM, multiple monitors showing terminal windows and config files, serious focused expression, scrolling through files with growing frustration, then stops with a new idea forming, dark technical atmosphere, cinematic",
        action: "Sam scrolls through 47 config files, stops — there has to be a better way",
        narration: "Forty-seven config files. A Friday deadline. He mapped it perfectly — and still hadn't moved.",
      },
      {
        type: "revelation", forGame: "Game 10 — Gemini CLI — AI for the Command Line",
        fileTarget: "/public/videos/g10-reveal.mp4",
        sourceImage: "sam.png",
        duration: "7 sec", credits: 70,
        prompt: "Late-20s male DevOps engineer leaning back watching terminal output with wide amazed eyes, grins and shakes head in disbelief as files process automatically, blue terminal glow warms to green success state, cinematic",
        action: "Sam watches Gemini CLI process all 47 files in 11 minutes — can't believe it",
        narration: "Forty-seven files. Eleven minutes. Not because Sam got faster.",
      },
      {
        type: "end", forGame: "Game 10 — Gemini CLI — AI for the Command Line",
        fileTarget: "/public/videos/g10-end.mp4",
        sourceImage: "maestro-sam.png",
        duration: "5 sec", credits: 50,
        prompt: "Late-20s male conductor, home lab meets server room, terminal green glow, raises hand in conducting motion with cool technical precision, slight satisfied grin, cinematic",
        action: "Maestro Sam — the terminal becomes the orchestra",
        narration: "Sam freed himself from the mechanical. Now only Sam can do what Sam does.",
      },
    ],
  },
]

/* ── NPC bonus section ─────────────────────────────────────────────────── */
const NPC_VIDEOS = [
  {
    name: "Señora Vega",
    file: "/public/videos/char-senora_vega.mp4",
    image: "senoravega.png",
    credits: 50,
    appearsIn: "Games 1, 6, 9, 10, 11",
    prompt: "Warm maternal teacher-mentor woman with encouraging presence, gentle affirming nod and soft smile, subtle forward lean as if listening closely, warm amber classroom lighting, soft natural motion, gentle authoritative energy, 5 seconds, loop-friendly",
    action: "Señora Vega nods warmly, encourages — the mentor always in your corner",
  },
  {
    name: "Tyler",
    file: "/public/videos/char-tyler.mp4",
    image: "tyler.png",
    credits: 50,
    appearsIn: "Games 1, 5, 7, 11, 12",
    prompt: "Young male bandmate and peer, casual confident energy, shrugs with a knowing smirk, relaxed body language, subtle head tilt, cool ambient lighting, peer-to-peer casual vibe, 5 seconds, loop-friendly",
    action: "Tyler shrugs with that 'I told you so' grin — the friend who always knows",
  },
]

/* ── Components ─────────────────────────────────────────────────────────── */
const TYPE_CONFIG = {
  intro:       { label: "INTRO",       color: "#0055aa", bg: "#e8f2ff", border: "#aaccff", emoji: "🎬" },
  revelation:  { label: "REVELATION",  color: "#6600bb", bg: "#f2e8ff", border: "#ccaaff", emoji: "✨" },
  end:         { label: "END",         color: "#aa4400", bg: "#fff3e0", border: "#ffcc88", emoji: "🏆" },
} as const

function TypeBadge({ type }: { type: "intro" | "revelation" | "end" }) {
  const c = TYPE_CONFIG[type]
  return (
    <span style={{
      display:       "inline-flex",
      alignItems:    "center",
      gap:           "3px",
      padding:       "2px 9px",
      borderRadius:  "100px",
      fontSize:      "9px",
      fontWeight:    800,
      letterSpacing: "0.1em",
      color:         c.color,
      background:    c.bg,
      border:        `1px solid ${c.border}`,
    }}>
      {c.emoji} {c.label}
    </span>
  )
}

function VideoRow({ v }: { v: VideoEntry }) {
  const c = TYPE_CONFIG[v.type]
  return (
    <div style={{
      border:          `1px solid ${c.border}`,
      borderLeft:      `4px solid ${c.color}`,
      borderRadius:    "8px",
      padding:         "12px 14px",
      marginBottom:    "10px",
      background:      c.bg,
      pageBreakInside: "avoid",
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
        <TypeBadge type={v.type} />
        <span style={{ fontSize: "11px", color: "#444", flex: 1 }}>{v.forGame}</span>
        <span style={{ fontSize: "10px", color: "#666", flexShrink: 0 }}>⏱ {v.duration} &nbsp;·&nbsp; 💎 {v.credits} credits</span>
      </div>

      {/* Detail rows */}
      <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", rowGap: "5px", fontSize: "11px" }}>
        <span style={{ fontWeight: 700, color: "#555" }}>📁 Save as</span>
        <code style={{ fontSize: "10px", background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "3px", color: c.color }}>{v.fileTarget}</code>

        <span style={{ fontWeight: 700, color: "#555" }}>🖼 Source image</span>
        <code style={{ fontSize: "10px" }}>{v.sourceImage}</code>

        <span style={{ fontWeight: 700, color: "#555", paddingTop: "2px" }}>🎬 Prompt</span>
        <span style={{ color: "#222", lineHeight: "1.55" }}>{v.prompt}</span>

        <span style={{ fontWeight: 700, color: "#555", paddingTop: "2px" }}>🎭 What to do</span>
        <span style={{ color: "#333", lineHeight: "1.55" }}>{v.action}</span>

        <span style={{ fontWeight: 700, color: "#555", paddingTop: "2px" }}>🎙 Narration</span>
        <span style={{ color: c.color, fontStyle: "italic", lineHeight: "1.55" }}>&ldquo;{v.narration}&rdquo;</span>
      </div>
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export default function PixVerseBriefPage() {
  const totalCredits = CHARACTERS.reduce((s, c) => s + c.videos.reduce((vs, v) => vs + v.credits, 0), 0)
  const totalVideos  = CHARACTERS.reduce((s, c) => s + c.videos.length, 0)
  const npcCredits   = NPC_VIDEOS.reduce((s, n) => s + n.credits, 0)

  return (
    <div style={{ fontFamily: "Georgia, serif", maxWidth: "860px", margin: "0 auto", padding: "32px 24px", color: "#111", background: "#fff" }}>

      {/* ── COVER ─────────────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: "36px", paddingBottom: "24px", borderBottom: "3px solid #111" }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#777", margin: "0 0 8px" }}>
          MaestroPlay · Confidential Production Brief
        </p>
        <h1 style={{ fontSize: "28px", fontWeight: 900, margin: "0 0 6px", fontFamily: "Arial, sans-serif" }}>
          PixVerse Video Generation Brief
        </h1>
        <p style={{ fontSize: "13px", color: "#555", margin: "0 0 20px" }}>
          Organized by character — complete prompts for all {totalVideos} videos across 10 characters
        </p>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          {[
            { label: "Characters",        value: "10",                           sub: "+ 2 NPCs" },
            { label: "Total Videos",      value: String(totalVideos),            sub: "3 per game" },
            { label: "Main Credits",      value: totalCredits.toLocaleString(),  sub: "of 2,000 budget" },
            { label: "Buffer Remaining",  value: (2000 - totalCredits).toLocaleString(), sub: "for retakes" },
            { label: "Duration",          value: "5–7 sec",                      sub: "50–70 credits each" },
          ].map(s => (
            <div key={s.label} style={{ background: "#f5f5f5", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "10px 16px", minWidth: "110px" }}>
              <div style={{ fontSize: "20px", fontWeight: 900, fontFamily: "Arial, sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#555" }}>{s.label}</div>
              <div style={{ fontSize: "9px", color: "#999", marginTop: "2px" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── JAKE ALREADY DONE ─────────────────────────────────────────────── */}
      <div style={{ background: "#e8ffe8", border: "1px solid #88cc88", borderLeft: "4px solid #009900", borderRadius: "8px", padding: "10px 14px", marginBottom: "20px" }}>
        <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, color: "#006600" }}>
          ✅ Jake&apos;s character loop already done — <code>JakeRocking.mp4</code> is live in Game 1 dialogue scenes.
        </p>
        <p style={{ margin: "3px 0 0", fontSize: "11px", color: "#444" }}>
          You still need Jake&apos;s 9 story videos (intro + revelation + end for games 1, 11, 12). See his section below.
        </p>
      </div>

      {/* ── HOW TO USE ────────────────────────────────────────────────────── */}
      <div style={{ background: "#f9f9f9", border: "1px solid #ddd", borderRadius: "8px", padding: "14px 18px", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 8px", fontFamily: "Arial, sans-serif" }}>
          How to Use
        </h2>
        <ol style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", lineHeight: "2", color: "#333" }}>
          <li><strong>PixVerse:</strong> Image to Video → upload <em>Source image</em> → paste <em>Prompt</em> → set duration</li>
          <li><strong>Download</strong> and rename to the exact path shown in <em>Save as</em></li>
          <li><strong>Drop into</strong> <code>/public/videos/</code> in the MaestroPlay project folder</li>
          <li><strong>Tell Claude:</strong> &ldquo;Wire game [X] videos&rdquo; — one-line additions auto-activate each clip</li>
          <li><strong>Narration</strong> is optional text overlay — add in CapCut or similar if desired</li>
        </ol>

        <div style={{ display: "flex", gap: "16px", marginTop: "10px", flexWrap: "wrap" }}>
          {(["intro", "revelation", "end"] as const).map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <TypeBadge type={t} />
              <span style={{ fontSize: "10px", color: "#666" }}>
                {t === "intro" ? "Opens the game · 7 sec" : t === "revelation" ? "The aha moment · 7 sec" : "Transformation close · 5 sec"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CHARACTER SECTIONS ────────────────────────────────────────────── */}
      {CHARACTERS.map(char => (
        <div key={char.name} style={{ marginBottom: "44px", pageBreakInside: "avoid" }}>

          {/* Character header */}
          <div style={{
            display:      "flex",
            alignItems:   "center",
            gap:          "10px",
            marginBottom: "12px",
            padding:      "10px 14px",
            background:   `${char.accentColor}10`,
            border:       `2px solid ${char.accentColor}40`,
            borderRadius: "10px",
          }}>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 900, fontFamily: "Arial, sans-serif", margin: "0 0 2px", color: char.accentColor }}>
                {char.name}
              </h2>
              <p style={{ margin: 0, fontSize: "11px", color: "#555" }}>{char.role}</p>
              <p style={{ margin: "3px 0 0", fontSize: "10px", color: "#888" }}>
                Source images: {char.sourceImages.join(" · ")}
              </p>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: "14px", fontWeight: 900, fontFamily: "Arial, sans-serif", color: char.accentColor }}>
                {char.videos.length} videos
              </div>
              <div style={{ fontSize: "10px", color: "#888" }}>
                {char.videos.reduce((s, v) => s + v.credits, 0)} credits
              </div>
            </div>
          </div>

          {/* Video cards */}
          {char.videos.map((v, i) => (
            <VideoRow key={i} v={v} />
          ))}
        </div>
      ))}

      {/* ── NPC BONUS ─────────────────────────────────────────────────────── */}
      <div style={{ marginTop: "8px", pageBreakBefore: "always" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 900, fontFamily: "Arial, sans-serif", borderBottom: "2px solid #111", paddingBottom: "6px", marginBottom: "16px" }}>
          🎭 Bonus: NPC Character Loops (only if credits remain after main 36)
        </h2>
        <p style={{ fontSize: "11px", color: "#666", marginBottom: "12px" }}>
          These are short looping clips for supporting characters. Currently showing as static images in dialogue scenes. Each costs {npcCredits / NPC_VIDEOS.length} credits.
        </p>
        {NPC_VIDEOS.map(npc => (
          <div key={npc.name} style={{ border: "1px solid #bbddcc", borderLeft: "4px solid #007744", borderRadius: "8px", padding: "12px 14px", marginBottom: "12px", background: "#f0fff8" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontWeight: 900, fontSize: "13px", color: "#007744" }}>{npc.name}</span>
              <span style={{ fontSize: "10px", color: "#666" }}>appears in {npc.appearsIn}</span>
              <span style={{ marginLeft: "auto", fontSize: "11px", color: "#555" }}>💎 {npc.credits} credits · 5 sec loop</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", rowGap: "5px", fontSize: "11px" }}>
              <span style={{ fontWeight: 700, color: "#555" }}>📁 Save as</span>
              <code style={{ fontSize: "10px", color: "#007744" }}>{npc.file}</code>
              <span style={{ fontWeight: 700, color: "#555" }}>🖼 Source image</span>
              <code style={{ fontSize: "10px" }}>{npc.image}</code>
              <span style={{ fontWeight: 700, color: "#555", paddingTop: "2px" }}>🎬 Prompt</span>
              <span style={{ lineHeight: "1.55" }}>{npc.prompt}</span>
              <span style={{ fontWeight: 700, color: "#555", paddingTop: "2px" }}>🎭 What to do</span>
              <span style={{ color: "#333", lineHeight: "1.55" }}>{npc.action}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── CREDIT SUMMARY TABLE ──────────────────────────────────────────── */}
      <div style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 900, fontFamily: "Arial, sans-serif", borderBottom: "2px solid #111", paddingBottom: "6px", marginBottom: "14px" }}>
          💎 Credit Summary
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              {["Character", "Role", "Videos", "Credits"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "7px 10px", fontWeight: 700, borderBottom: "2px solid #ddd", fontFamily: "Arial, sans-serif" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CHARACTERS.map((c, i) => (
              <tr key={c.name} style={{ background: i % 2 ? "#fafafa" : "#fff", borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "7px 10px", fontWeight: 700, color: c.accentColor }}>{c.name}</td>
                <td style={{ padding: "7px 10px", color: "#555" }}>{c.videos[0]?.forGame.split("—")[0].trim()}</td>
                <td style={{ padding: "7px 10px" }}>{c.videos.length}</td>
                <td style={{ padding: "7px 10px", fontWeight: 700 }}>{c.videos.reduce((s, v) => s + v.credits, 0)}</td>
              </tr>
            ))}
            <tr style={{ background: "#f5f5f5", borderTop: "2px solid #333", fontWeight: 900 }}>
              <td style={{ padding: "9px 10px" }} colSpan={2}>TOTAL (main 36 videos)</td>
              <td style={{ padding: "9px 10px" }}>{totalVideos}</td>
              <td style={{ padding: "9px 10px", fontSize: "13px" }}>{totalCredits}</td>
            </tr>
            <tr style={{ background: "#e8ffe8" }}>
              <td style={{ padding: "7px 10px", fontWeight: 700, color: "#006600" }} colSpan={2}>Professional Plan allowance</td>
              <td style={{ padding: "7px 10px" }}>—</td>
              <td style={{ padding: "7px 10px", fontWeight: 700, color: "#006600" }}>2,000</td>
            </tr>
            <tr style={{ background: "#fff3e0" }}>
              <td style={{ padding: "7px 10px", fontWeight: 700, color: "#aa4400" }} colSpan={2}>Remaining for retakes / NPC loops</td>
              <td style={{ padding: "7px 10px" }}>—</td>
              <td style={{ padding: "7px 10px", fontWeight: 700, color: "#aa4400" }}>{2000 - totalCredits}</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: "10px", color: "#999", marginTop: "8px" }}>
          {2000 - totalCredits} remaining credits = {Math.floor((2000 - totalCredits) / 50)} retake videos at 5 sec each · or use toward {Math.floor((2000 - totalCredits) / 50)} NPC loops
        </p>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: "40px", paddingTop: "12px", borderTop: "1px solid #ddd", textAlign: "center", fontSize: "9px", color: "#bbb" }}>
        MaestroPlay · PixVerse Production Brief · {totalVideos} videos · {totalCredits} credits · Professional Plan ($49.99/mo, cancel after 1 month)
      </div>

    </div>
  )
}
