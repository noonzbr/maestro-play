import { Game } from "./types"

export const game1: Game = {
  slug: "welcome-to-ai",
  week: 1,
  free: true,
  title: "Welcome to the Exciting World of AI",
  emoji: "🎸",
  icon: "guitar" as const,
  duration: "10 min",
  description: "Follow Jake, a 17-year-old guitarist, as he discovers that mastering AI is just like conducting an orchestra — and his musical instincts are his greatest weapon.",
  tagline: "Every maestro was once just a kid with a guitar.",
  characterName:   "Jake",
  characterRole:   "17-year-old guitarist",
  characterBlurb:  "A teenage guitarist who discovers AI is his greatest instrument yet",
  characterImage:  "/images/guitarplayer1.png",
  maestroImage:    "/images/maestroplayer1.png",
  maestroLine:     "The last time he was just a guitarist...",
  maestroSubline:  "Jake's story is just beginning. The orchestra awaits.",
  protagonistVideo:"/videos/JakeRocking.mp4",
  felipeOutroVideo:"/videos/felipe-game1.mp4",
  intro: {
    sceneImage:  "/images/jakebedroom.png",
    noteOrigin:  { bottom: "38%", left: "54%" },
    beats: [
      { type: "location",  text: "BEDROOM · TUESDAY · 11:47 PM" },
      { type: "narration", text: "Three hours a day. Every single day. Jake lived inside the notes. Refinement, technique, precision." },
      { type: "dialogue",  speaker: "Jake", text: "I've been working on the same three songs for four months. Perfecting a single transition." },
      { type: "dialogue",  speaker: "Tyler", text: "I finished a whole EP last weekend, Jake. Produced, mixed, vocals—everything. In two days. Using AI." },
      { type: "dialogue",  speaker: "Jake", text: "Two days? That's impossible. It takes weeks just to get a drum track down." },
      { type: "dialogue",  speaker: "Tyler", text: "Not anymore. Open the AI, type 'write me a song,' and hit send. See for yourself." },
      { type: "location",  text: "CLAUDE CHAT · MOMENTS LATER" },
      { type: "narration", text: "Jake typed the four words. Hit send. In eight seconds, the screen filled with lyrics and chords." },
      { type: "dialogue",  speaker: "Jake", text: "'You left me standing in the rain, without a word, without a care...' It's... fine. Totally fine. But it sounds like a dentist's office playlist." },
      { type: "dialogue",  speaker: "Tyler", text: "Well, yeah. You gave it four words. You gave it nothing. You have to be more specific." },
      { type: "dialogue",  speaker: "Jake", text: "More specific how? I typed 'write me a GOOD song' and got the exact same thing with shinier adjectives." },
      { type: "location",  text: "THE CONDUIT · A BEYOND-PERSPECTIVE" },
      { type: "dialogue",  speaker: "Felipe Maestro", text: "A Stradivarius in untrained hands still sounds like noise. The most expensive instrument in the world waits for the musician who knows what to ask for." },
      { type: "dialogue",  speaker: "Felipe Maestro", text: "Jake is looking for a magic box. What he needs to find is his baton. Every orchestra, human or silicon, needs a conductor." },
      { type: "final",     text: "The world changed while Jake was perfecting his riff. But perfection has its own kind of power. Let's see if he can find it." },
    ],
  },

  scenes: [

    // ── SCENE 0 — BRANCH POINT 1: The First Prompt ─────────────────────────
    // Jake has just been challenged by Tyler to try Claude. The cursor blinks.
    // Four authentic teenager choices — not quiz answers, story decisions.
    // Where you go depends entirely on what you type.
    {
      id:           "w1-branch-1",
      type:         "scenario",
      skipFeedback: true,
      location:     "BEDROOM · TUESDAY · 11:47 PM",
      scenarioText: "Tyler's been raving for five minutes. An EP in a weekend. 50,000 plays. All AI. 'Just try it,' he says, pulling up Claude on Jake's laptop. 'Type whatever you want.' Jake stares at the cursor. Five years of guitar. Hundreds of hours knowing exactly what music should feel like. He starts to type.",
      question:     "What does Jake type?",
      choices: [
        {
          label: "A",
          text:  '"Write me a hit song."',
          leadsTo: "w1-lazy-1",
        },
        {
          label: "B",
          text:  '"Write an indie song about a best friend moving away. Early Arctic Monkeys feel."',
          leadsTo: "w1-middle-1",
        },
        {
          label: "C",
          text:  '"Help me write something for my EP — raw, emotional, indie guitar, about when someone you love leaves for another city. No clichés."',
          leadsTo: "w1-middle-1",
        },
        {
          label: "D",
          text:  "He takes fifteen minutes. He tells Claude his name, his age, Tyler's name, the specific story. He describes the feeling — grief of knowing something is ending before it ends. He references three specific songs. He says the key, the rough tempo, what not to include.",
          leadsTo: "w1-conductor-1",
        },
      ],
      xpAward: 0,
    },

    // ─── PATH A: "The Shortcut" ────────────────────────────────────────────

    // Scene 1 (PATH A) — Tyler loves the generic output
    {
      id:       "w1-lazy-1",
      type:     "scenario",
      location: "BEDROOM · TUESDAY · 11:52 PM",
      dialogue: [
        { speaker: "Jake",  avatar: "jake" as const, text: '"Write me a hit song." Send.' },
        { speaker: "Jake",  avatar: "jake" as const, text: "It came back in eight seconds. Rhymes fine. Has a hook. Lyrics about chasing dreams and never giving up." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "YOOO. That slaps. Post it." },
        { speaker: "Jake",  avatar: "jake" as const, text: "...I've heard this song before. Like a dozen times. Different artists, same song." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "200 plays by morning though. Jake. That's fast." },
        { speaker: "Jake",  avatar: "jake" as const, text: "Yeah. Fine. Posting." },
      ],
      scenarioText: "Jake posted it. By next morning: 214 plays. Tyler sent twelve fire emojis. Jake stared at the number and felt absolutely nothing.",
      xpAward: 25,
    },

    // Scene 2 (PATH A) — Señora Vega delivers the verdict
    {
      id:          "w1-lazy-2",
      type:        "scenario",
      location:    "MUSIC CLASS · WEDNESDAY · 3:20 PM",
      nextLeadsTo: "w1-vega-moment",
      dialogue: [
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "Play it again." },
        { speaker: "Jake",        avatar: "jake" as const, text: "It's just something I made with—" },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "I know what it is. Play it again." },
        { speaker: "Jake",        avatar: "jake" as const, text: "(second listen)" },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "Tell me what you gave it." },
        { speaker: "Jake",        avatar: "jake" as const, text: '"Write me a hit song."' },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "Four words." },
        { speaker: "Jake",        avatar: "jake" as const, text: "Yeah. It worked fine though, right? 200 plays—" },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "AI amplifies what you put in. You put in four words and got four words of output stretched into a song. It hit nobody because it came from nobody." },
        { speaker: "Jake",        avatar: "jake" as const, text: "But the numbers—" },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "Numbers measure reach. Not resonance. Now tell me: where were YOU in that song?" },
      ],
      xpAward: 25,
    },

    // ─── PATH B/C: "The Half Measure" ─────────────────────────────────────

    // Scene 3 (PATH BC) — Tyler says it's decent, something nags at Jake
    {
      id:       "w1-middle-1",
      type:     "scenario",
      location: "BEDROOM · TUESDAY · 11:57 PM",
      dialogue: [
        { speaker: "Jake",  avatar: "jake" as const, text: "Sent it. Here." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "...okay. That's actually good. Has some texture." },
        { speaker: "Jake",  avatar: "jake" as const, text: "Yeah but." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "But what? It sounds indie. It has the vibe." },
        { speaker: "Jake",  avatar: "jake" as const, text: "It sounds like it COULD be us. Like an approximation. Like if you described our band to someone who'd never heard us." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "I mean... yeah. Because it doesn't KNOW you. You described the genre, not yourself." },
        { speaker: "Jake",  avatar: "jake" as const, text: "I gave it everything it needed to write the song." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Did you? Or did you give it what you wanted to hear? Those aren't the same thing." },
      ],
      scenarioText: "Jake read back what he'd typed. He'd described the music perfectly. He hadn't mentioned himself once.",
      xpAward: 25,
    },

    // Scene 4 (PATH BC) — Señora Vega asks the deeper question
    {
      id:          "w1-middle-2",
      type:        "scenario",
      location:    "MUSIC CLASS · WEDNESDAY · 3:20 PM",
      nextLeadsTo: "w1-vega-moment",
      dialogue: [
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "It's good." },
        { speaker: "Jake",        avatar: "jake" as const, text: "But?" },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "What did you give it?" },
        { speaker: "Jake",        avatar: "jake" as const, text: "The genre. The mood. The concept. I said no clichés." },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "You described the music. But did you tell it who's doing the listening?" },
        { speaker: "Jake",        avatar: "jake" as const, text: "The... audience?" },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "No. YOU. The specific human being with specific memories and a specific wound this song comes from. If I asked you to write a letter — just 'write a letter' — what would you write?" },
        { speaker: "Jake",        avatar: "jake" as const, text: "I don't know. About what? To who?" },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "Exactly. Now imagine I said: write a letter to the person you regret losing the most, in the voice of who you were at 14, six lines maximum." },
        { speaker: "Jake",        avatar: "jake" as const, text: "(slowly) That I could write." },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "Because I gave you a SELF to write from. AI needs a self to write from too. You gave it a genre. You didn't give it Jake." },
      ],
      xpAward: 25,
    },

    // ─── PATH D: "The Conductor" ───────────────────────────────────────────

    // Scene 5 (PATH D) — Tyler witnesses something he wasn't expecting
    {
      id:       "w1-conductor-1",
      type:     "scenario",
      location: "BEDROOM · TUESDAY · MIDNIGHT",
      dialogue: [
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Dude. It's been fifteen minutes." },
        { speaker: "Jake",  avatar: "jake" as const, text: "I know. Almost done." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "You wrote a PARAGRAPH to an AI chatbot." },
        { speaker: "Jake",  avatar: "jake" as const, text: "I told it everything. My name. Your name. The story. The feeling. What NOT to do." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "(reading over Jake's shoulder) ...you told it about the amp cutting out at the Riverside show." },
        { speaker: "Jake",  avatar: "jake" as const, text: "That's the specific grief I'm writing about. AI needs the specific, not the general." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "(Claude responds) ...Jake." },
        { speaker: "Jake",  avatar: "jake" as const, text: "(reading)" },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "That's the song. That's the song I said I was going to help you write after I came back from Portland." },
        { speaker: "Jake",  avatar: "jake" as const, text: "Yeah." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "You told it about me." },
        { speaker: "Jake",  avatar: "jake" as const, text: "I told it everything. That's the whole point." },
      ],
      xpAward: 50,
    },

    // Scene 6 (PATH D) — Señora Vega hears it and understands
    {
      id:          "w1-conductor-2",
      type:        "scenario",
      location:    "MUSIC CLASS · WEDNESDAY · 4:00 PM",
      nextLeadsTo: "w1-match-terms",
      dialogue: [
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "(listening, long silence after it ends)" },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "What did you give it?" },
        { speaker: "Jake",        avatar: "jake" as const, text: "(reads back the full prompt)" },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "Read it again." },
        { speaker: "Jake",        avatar: "jake" as const, text: "(reads again)" },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "This isn't AI writing music. This is a musician directing a tool he already knows how to use." },
        { speaker: "Jake",        avatar: "jake" as const, text: "But the lyrics are—" },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "Were already yours before you typed them. You knew what needed to be said. You just needed something to say it back to you perfectly." },
        { speaker: "Jake",        avatar: "jake" as const, text: "Is that... cheating?" },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "Is using a recording studio cheating? Sheet music? Tools extend what you're capable of. They don't replace the musician. They amplify them." },
        { speaker: "Jake",        avatar: "jake" as const, text: "The music is still mine." },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "The music was always yours. This was just the first instrument that could hear exactly what you were describing." },
      ],
      scenarioText: "Jake walked out feeling like something had shifted. Not in the music — in how he understood what he was capable of.",
      xpAward: 75,
    },

    // ─── SECOND BRANCH: Señora Vega's Question ────────────────────────────
    // Convergence point for PATH A and PATH BC players.
    // Right choice → w1-recovery → boss → Ending 1
    // Wrong choice → Ending 2 directly

    {
      id:           "w1-vega-moment",
      type:         "scenario",
      skipFeedback: true,
      location:     "MUSIC CLASS HALLWAY · WEDNESDAY · 4:15 PM",
      scenarioText: "Señora Vega stops Jake in the hallway. She holds up his prompt on her screen — the exact words he typed into Claude. She doesn't say anything. She just holds it there.",
      question:     "Jake looks at his own words. What does he see?",
      choices: [
        {
          label:   "A",
          text:    '"It worked. Got plays. What\'s the problem?"',
          leadsTo: "w1-ending-2",
        },
        {
          label:   "B",
          text:    "Jake reads his own words carefully. Something drops in his stomach. 'I gave it nothing about me. I gave it a recipe. Not a person.'",
          leadsTo: "w1-recovery",
        },
      ],
      xpAward: 0,
    },

    // ─── RECOVERY: Jake rewrites the prompt ───────────────────────────────
    // For PATH A and PATH BC players who "got it" at Señora Vega's question.

    {
      id:       "w1-recovery",
      type:     "scenario",
      location: "JAKE'S ROOM · WEDNESDAY · 11:30 PM",
      dialogue: [
        { speaker: "Jake", avatar: "jake" as const, text: "Okay. New attempt. No shortcuts." },
        { speaker: "Jake", avatar: "jake" as const, text: "I'm going to tell it everything." },
        { speaker: "Jake", avatar: "jake" as const, text: "My name. The story. Tyler leaving. The specific amp-cut-out show. The key I hear it in. What I DON'T want. The feeling that has no name except 'the thing you feel when you know something is ending before it ends.'" },
        { speaker: "Jake", avatar: "jake" as const, text: "(twenty minutes later, reading Claude's response)" },
        { speaker: "Jake", avatar: "jake" as const, text: "There it is." },
      ],
      scenarioText: "Context is who you are, not what you want. Jake had learned it the hard way. But he had learned it.",
      xpAward: 50,
    },

    // ─── MATCHING EXERCISE: Prompt Orchestra Analogy ───────────────────────
    {
      id:          "w1-match-terms",
      type:        "match",
      location:    "MUSIC CLASS · WEDNESDAY · 4:05 PM",
      question:    "Señora Vega challenges you: 'Match the prompt components to their roles in our orchestra.' Connect them to continue:",
      matchPairs: [
        { left: "System Prompt", right: "The Conductor's Sheet Music (defines persona and boundaries)" },
        { left: "User Prompt",   right: "The Player's Direct Cue (the active task instructions)" },
        { left: "Temperature",   right: "The Improvisation Level (controls output randomness)" },
        { left: "Context Window",right: "The Ensemble Memory (total memory capacity)" }
      ],
      xpAward: 40,
    },

    // ─── ORDERING EXERCISE: Constructing the Prompt ────────────────────────
    {
      id:          "w1-order-prompt",
      type:        "order",
      location:    "JAKE'S ROOM · WEDNESDAY · 11:45 PM",
      question:    "Jake reviews his new prompt structure. Tap and arrange these blocks in the correct order to form a master prompt:",
      orderItems: [
        { id: "1", text: "Assign Role (e.g., 'You are a veteran sound engineer')", correctPosition: 1 },
        { id: "2", text: "Establish Context (e.g., 'mixing a live rock concert recording')", correctPosition: 2 },
        { id: "3", text: "Deliver Task (e.g., 'provide 3 EQ frequencies to clear muddy vocals')", correctPosition: 3 },
        { id: "4", text: "Enforce Constraints (e.g., 'do not suggest high-pass filters')", correctPosition: 4 }
      ],
      xpAward: 45,
    },

    // ─── BOSS BATTLE: The Conductor Test ──────────────────────────────────
    // Reached from PATH D (direct) and PATH A/BC recovered.
    // 5-round battle testing the core concepts from all paths.

    {
      id:       "w1-boss",
      type:     "boss",
      location: "PRACTICE ROOM · LATE NIGHT",
      dialogue: [
        { speaker: "Jake", avatar: "jake" as const, text: "One conversation. Two days. That's all it took to understand something I'd been doing wrong the whole time." },
        { speaker: "AI",   avatar: "npc" as const, npcKey: "ai" as const, text: "Tell me what you understand now." },
        { speaker: "Jake", avatar: "jake" as const, text: "The quality of what I get is exactly the quality of what I give. Not approximately. Exactly." },
        { speaker: "AI",   avatar: "npc" as const, npcKey: "ai" as const, text: "And your advantage as a musician?" },
        { speaker: "Jake", avatar: "jake" as const, text: "I know what a good bridge needs. I hear what's missing before it's fixed. Most people can't say that. I can say it with precision." },
        { speaker: "AI",   avatar: "npc" as const, npcKey: "ai" as const, text: "Then prove it. Five rounds. Show me you understand why it works." },
        { speaker: "Jake", avatar: "jake" as const, text: "Come on then." },
      ],
      bossQuestions: [
        // ── Round 1: The Orchestra Without a Conductor ────────────────────
        {
          npcLine:  "Tyler made 50 tracks this month. Most are technically fine. All completely interchangeable.",
          question: "Tyler has made 50 AI tracks this month. Technically fine, emotionally interchangeable — no distinct voice, no specific feeling. They could be from any band, any decade. What single change would unlock dramatically different output?",
          choices: [
            {
              label:        "A",
              text:         "Switch to a more powerful AI model",
              correct:      false,
              feedback:     "A better instrument doesn't play itself. The bottleneck was never the tool — it's the direction. Give the same model specific direction and everything changes.",
              wrongFeedback:"A better instrument doesn't play itself. The bottleneck was never the tool — it's the direction.",
            },
            {
              label:    "B",
              text:     "Inject specific musical identity, emotional intent, and personal context into every prompt",
              correct:  true,
              feedback: "Exactly. Generic input produces the average of everything AI has ever learned. The moment you add who is speaking, what they feel, and what the specific story is — the output collapses from infinite possibilities to exactly what you needed.",
            },
            {
              label:        "C",
              text:         "Use AI for beats only and write everything else by hand",
              correct:      false,
              feedback:     "Compartmentalizing doesn't solve the root problem. Precision in any prompt — beats, lyrics, arrangement — is what separates generic from specific. The skill transfers everywhere.",
              wrongFeedback:"Compartmentalizing doesn't solve the root problem. Precision works everywhere once you have it.",
            },
            {
              label:        "D",
              text:         "Hire a professional songwriter to review and improve the AI output",
              correct:      false,
              feedback:     "Post-production can polish edges, but it can't add the specificity that was never in the prompt. Fix the input, not just the output.",
              wrongFeedback:"Fix the input, not just the output. What goes in determines what comes out.",
            },
          ],
        },
        // ── Round 2: The Emotion Gap ──────────────────────────────────────
        {
          npcLine:  "The AI mirrors its conductor. Emotional depth must come from your instructions.",
          question: "Señora Vega plays an AI string quartet prompted with 'write a sad piece.' Technically flawless — emotionally hollow. Jake hears it: 'like a robot trying to cry.' What would have produced something genuinely moving?",
          choices: [
            {
              label:        "A",
              text:         "Use an AI model specifically trained on emotional music",
              correct:      false,
              feedback:     "The same model that produced this hollow piece can produce something devastating. The gap is never in the model — it's in what you asked for.",
              wrongFeedback:"The same model. Different instructions. Completely different result.",
            },
            {
              label:        "B",
              text:         "Ask the AI to 'try harder' or 'make it more emotional'",
              correct:      false,
              feedback:     "Vague refinement produces vague improvement. 'More emotional' is still an average of every emotional piece ever written. The specific grief of a specific moment is what actually moves people.",
              wrongFeedback:"'More emotional' is still vague. Specific grief — a specific moment — is what moves people.",
            },
            {
              label:    "C",
              text:     "Describe the exact emotional texture — whose grief, what specific moment, what feeling refuses to resolve",
              correct:  true,
              feedback: "'Sad string quartet' lets AI average every sad piece it has ever processed. 'The grief of watching someone you love choose to leave — the chord that reaches but never resolves' — that's a specific human experience. Specificity is the only path to genuine emotion.",
            },
            {
              label:        "D",
              text:         "Add precise technical details: tempo, key signature, instrument articulations",
              correct:      false,
              feedback:     "Technical specificity helps, but it's not what moves people. A perfect Am piece at 68 BPM can still be emotionally hollow. Emotional specificity — the story behind the sound — is what transforms technique into feeling.",
              wrongFeedback:"Technical details help. But the feeling comes from the emotional story you put in, not just the key and tempo.",
            },
          ],
        },
        // ── Round 3: Fast vs. Deep ────────────────────────────────────────
        {
          question: "Tyler made a track in an afternoon that went viral. Jake spent two days on a track that got licensed for a film score. A producer compares their approaches. What's the most likely difference in how they used AI?",
          choices: [
            {
              label:        "A",
              text:         "Jake paid for a higher-tier AI subscription",
              correct:      false,
              feedback:     "The tool is identical. The conductor makes all the difference.",
              wrongFeedback:"Same tool. Same model. The conductor is what changed.",
            },
            {
              label:        "B",
              text:         "Jake got lucky with a client who values slower production",
              correct:      false,
              feedback:     "Film licensing selects for quality and distinctiveness, not production timeline. Something specific caught the music supervisor's ear.",
              wrongFeedback:"Film licensing selects for what stands out — not how long it took.",
            },
            {
              label:    "C",
              text:     "Tyler optimized for speed; Jake applied deep musical knowledge to produce something too specific to be ignored",
              correct:  true,
              feedback: "Speed is the floor of AI value — Tyler found it fast. The ceiling is what happens when years of domain expertise become the language you use to direct AI with precision. Jake went looking for the ceiling.",
            },
            {
              label:        "D",
              text:         "Tyler's approach will eventually match Jake's once AI improves further",
              correct:      false,
              feedback:     "More powerful instruments still don't conduct themselves. Whatever direction you give a stronger model, you get more of. The conductor is always essential.",
              wrongFeedback:"Better AI with vague prompts still gives vague output at higher quality. The conductor is always the key.",
            },
          ],
        },
        // ── Round 4: Context Is Your Score ───────────────────────────────
        {
          question: "Jake runs two prompts for the same song verse. Prompt 1: 'Write a verse about heartbreak for my punk band.' Prompt 2: 'Write a verse for a 17-year-old guitarist — his ex started a rival band, tone: bitter but still in love, rhyme ABCB, no clichés.' Why is Prompt 2 exponentially more powerful?",
          choices: [
            {
              label:        "A",
              text:         "Prompt 2 is longer, so the AI processes more information and 'tries harder'",
              correct:      false,
              feedback:     "Length is irrelevant. A longer vague prompt still produces vague output. It's not effort — it's relevance. Specific information beats volume.",
              wrongFeedback:"Length ≠ power. Relevant specificity does. A long vague prompt is still vague.",
            },
            {
              label:        "B",
              text:         "The 'no clichés' constraint is the critical element that changes the output",
              correct:      false,
              feedback:     "Negative constraints help, but they're not the primary driver. The bigger shift is Jake's identity, the specific emotional situation, and the competing-band detail — that context tells AI which world to write from.",
              wrongFeedback:"Negative constraints help. But the bigger shift is giving AI a specific world to write from — Jake's world.",
            },
            {
              label:    "C",
              text:     "Context tells AI which world to write from — collapsing infinite possibilities down to exactly the one that's needed",
              correct:  true,
              feedback: "Without context, 'heartbreak' could be a thousand songs from a thousand voices. With context, there is only one song — Jake's. The moment AI knows who is speaking and from what wound, it stops averaging and starts channeling.",
            },
            {
              label:        "D",
              text:         "The specific rhyme scheme (ABCB) is what structures the output correctly",
              correct:      false,
              feedback:     "A perfect ABCB rhyme scheme can still be completely generic if there's no context about who is singing it and why. Structure without identity is just scaffolding.",
              wrongFeedback:"Structure without identity is just scaffolding. The who and why matter far more than the rhyme scheme.",
            },
          ],
        },
        // ── Round 5: Expertise × AI = Force Multiplication ───────────────
        {
          npcLine:  "The music was always yours. This was just the first instrument that could hear exactly what you were describing.",
          question: "Jake and a classmate with no music training both use the same AI tool for the same task. Jake consistently gets output that sounds like a real band with emotional arc. His classmate gets competent but generic results. What explains the gap?",
          choices: [
            {
              label:        "A",
              text:         "Jake types faster and submits more prompts per session",
              correct:      false,
              feedback:     "Volume of prompting doesn't close this gap. A classmate who submits 1,000 prompts without knowing what a good bridge needs still can't identify what's missing — or ask for it precisely.",
              wrongFeedback:"Volume doesn't fix the gap. Knowing what to ask for does.",
            },
            {
              label:    "B",
              text:     "Jake's musical training gives him the vocabulary to describe exactly what he needs — texture, tension, arc, dynamics — while a non-expert can only say 'make it better'",
              correct:  true,
              feedback: "THIS IS THE ENTIRE GAME. Expertise becomes the vocabulary you conduct with. Jake hears what's missing and names it precisely. 'The bridge needs to feel like something unraveling slowly, not a resolution.' That gap in description is the gap in output. Expertise × AI = force multiplication.",
            },
            {
              label:        "C",
              text:         "Jake uses longer, more detailed prompts than his classmate",
              correct:      false,
              feedback:     "Precision beats length. A 10-word prompt from someone who knows exactly what they need beats a 200-word prompt from someone who doesn't know what they're listening for.",
              wrongFeedback:"Precision beats length every time. It's knowing what to ask for, not how much.",
            },
            {
              label:        "D",
              text:         "AI performs better for musicians because it was primarily trained on music data",
              correct:      false,
              feedback:     "AI responds to precision and specificity of input, not the identity of who typed it. Jake's results are better because his prompts are better — because he hears what the music needs and can say it.",
              wrongFeedback:"AI responds to what you put in, not who you are. Jake's prompts are better because he hears the gap and can name it.",
            },
          ],
        },
      ],
      xpAward: 150,
    },

    // ─── ENDING 1: "The Conductor" ────────────────────────────────────────
    // Reached from PATH D (direct) and recovered PATH A/BC players.
    // Jake's EP sounds like Jake. The identity shift lands.

    {
      id:          "w1-ending-1",
      type:        "revelation",
      nextLeadsTo: "w1-track-select",
      revealText:
        "Jake submitted the EP demo. Four tracks. All of them built with Claude, directed by Jake, shaped by five years of knowing exactly what he was listening for.\n\nThe record label contact doesn't ask if AI was involved. She doesn't notice. She says: 'This is the most distinctively personal set I've heard from a student this year. What's your process?'\n\nJake thinks about how to answer. He thinks about the cursor blinking. The fifteen-minute prompt. Señora Vega reading his words back to him.\n\n'I describe exactly what I need,' he says. 'And I don't stop until what I hear matches what was in my head.'\n\nShe nods slowly. 'That's a real artist's process.'\n\nJake looks at his guitar in the corner. Then at the screen.\n\nHe's not just a guitarist anymore. He never stopped being one. But now he knows what he is:\n\nHe's a conductor. And the orchestra was always ready.",
      xpAward: 200,
    },

    // ─── ENDING 2: "The Wake-Up" ──────────────────────────────────────────
    // Reached when player doesn't recognize their own gap at Señora Vega's question.
    // Not a failure ending — a different kind of learning. The insight still lands.

    {
      id:          "w1-ending-2",
      type:        "revelation",
      nextLeadsTo: "w1-track-select",
      revealText:
        "The EP went up. Fine. Technically competent. Tyler said it sounded great.\n\nSenora Vega listened once. Said nothing except: 'It doesn't sound like you, Jake.'\n\nThe record label contact listened and moved on. Nothing to say. Nothing remarkable to remember.\n\nJake sits in his room that night and pulls up his own prompt on screen.\n\n'Write me a hit song.'\n\nHe stares at it for a long time.\n\nFive years of knowing exactly what music should feel like. All of it — sitting in his hands. And he gave an AI four words.\n\nHe closes the tab. Opens a new one.\n\nHe starts typing.\n\nThis time, he writes his name. He writes Tyler's name. He writes the specific grief of knowing something is ending before it ends. He writes the Riverside show, the amp cutting out, 200 people watching something they didn't know was a goodbye.\n\nHe writes for twenty minutes.\n\nClaude responds.\n\nJake reads it.\n\nOh.\n\nThat's what it was supposed to sound like the whole time.\n\nHe finally understands what Señora Vega meant. AI is an amplifier. Give it nothing — get nothing back. Give it everything you are, and watch what it does with that.",
      xpAward: 150,
    },

    // ─── TRACK SELECTION ──────────────────────────────────────────────────
    // Same track select regardless of ending — the emotional context of arrival
    // is already established by whichever ending preceded this.

    {
      id:             "w1-track-select",
      type:           "track-select",
      location:       "SOMEWHERE BETWEEN BEDROOM AND STAGE",
      xpAward:        0,
      felipeMonologue:"Jake. Whether you got here the direct way or the long way — you got here. And you figured something out that takes most people months to see: the gap between average AI output and remarkable AI output isn't the tool. It's the human directing it. The question now is what you want to direct next. Four stages. Four orchestras. All different, all powerful. I can't make this choice for you. But here's what I know about each one.",
      trackOptions: [
        {
          id:           "A",
          emoji:        "🧠",
          label:        "The Science of AI",
          teaser:       "Go deep. Learn what's actually happening inside AI — why the same tool gives different people wildly different results.",
          felipeAside:  "People who understand the engine don't just use AI better — they use every future version of it better too. This path ages well.",
          nextGameSlug: "how-ai-works",
        },
        {
          id:           "B",
          emoji:        "🎭",
          label:        "Claude's World",
          teaser:       "Jordan uses it to outcompete agencies. Kai uses it to ship code. Priya uses it to run an entire operations team.",
          felipeAside:  "This is the track for people who want to collaborate with an AI that actually thinks — not just follows instructions.",
          nextGameSlug: "claude-chat-unlocked",
        },
        {
          id:           "C",
          emoji:        "💬",
          label:        "ChatGPT + Gemini",
          teaser:       "The most used AI tools on earth. Most people use 10% of what they can do. Alex, Luna, and Sam found the ceiling.",
          felipeAside:  "If you're going to use the tool everyone has — you might as well use it better than everyone else.",
          nextGameSlug: "chatgpt-mastery",
        },
        {
          id:           "D",
          emoji:        "🏢",
          label:        "Microsoft Copilot",
          teaser:       "The AI already lives inside your Word, Teams, and Outlook. You just haven't opened it yet.",
          felipeAside:  "A special case — this is the only track where you already know the main character.",
          nextGameSlug: "microsoft-copilot",
        },
      ],
    },

  ],
}
