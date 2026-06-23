import { Game } from "./types"

/**
 * Game 1 V2 — "The Conductor's Awakening" (Impasse-First Remaster)
 *
 * Structural changes from Game 1:
 *  - ALL LEARN scenes moved AFTER their corresponding scenarios (impasse-first)
 *  - Two "wrong path narrative" scenes show Jake experiencing the consequence
 *    of the wrong approach before the concept is revealed
 *  - NPC Articulation Gate: player must explain the principle in Jake's voice
 *  - Callback moment in boss setup references Scene 1's "write me a song" failure
 *
 * Scene order (impasse-first):
 *  1. COLD OPEN (scenario, no teaching) — Jake tries "write me a song," hits the wall
 *  2. WRONG PATH NARRATIVE — Jake doubles down, spirals, Tyler gives up
 *  3. SEÑORA VEGA'S TEST (scenario) — second impasse, she asks "what's wrong?"
 *  4. THE AHA: CONDUCTOR PRINCIPLE (learn) — concept arrives AFTER impasse
 *  5. APPLY (scenario) — Jake uses the principle; Tyler's jaw drops
 *  6. FAST VS. DEEP: COLD COMPARISON (scenario, no teaching) — viral vs. licensed
 *  7. WRONG PATH: SPEED TRAP (narrative) — Tyler's 143 tracks, 6 with real plays
 *  8. AHA: FAST VS. DEEP (learn) — concept arrives after narrative
 *  9. SPECIFICITY SHOWDOWN (scenario) — two prompts side by side
 * 10. EMOTIONAL PROMPT CHALLENGE
 * 11. ARTICULATION GATE — player writes Jake explaining it to Tyler
 * 12. ITERATIVE PROMPTING (scenario) — live refinement at band practice
 * 13. BOSS (5-punch, with callback to Scene 1)
 * 14. REVELATION
 */

export const game1v2: Game = {
  slug:           "welcome-to-ai-v2",
  week:           13,
  free:           true,
  title:          "The Conductor's Awakening",
  emoji:          "🎸",
  icon:           "guitar" as const,
  duration:       "14 min",
  description:    "The reimagined Jake story — impasse-first. You hit the wall before anyone explains why. The conductor principle lands differently when you already feel the gap.",
  tagline:        "What if the orchestra started playing before the conductor showed up?",
  characterName:  "Jake",
  characterRole:  "17-year-old guitarist",
  characterBlurb: "He tried 'write me a song.' He got elevator music. That was the best thing that ever happened to him.",
  characterImage:  "/images/guitarplayer1.png",
  maestroImage:    "/images/maestro-jake.png",
  maestroLine:     "The last time he was just a guitarist...",
  maestroSubline:  "Jake's story is just beginning. The orchestra awaits.",
  accentColor:    "#00d4f0",
  audioTrack:     "/audio/concrete-riot-instrumental.mp3",
  protagonistVideo:"/videos/JakeRocking.mp4",
  aiModel:         "claude",
  felipeOutroVideo:   "/videos/felipe-game1v2.mp4",
  nextGame: {
    slug:         "how-ai-works",
    character:    "Zoe",
    teaserLine:   "There's this drummer I met at the state showcase. Zoe. She kept asking me: 'But how does the AI actually know what to say?' I couldn't answer. That bothered me. She figured it out though — and what she found will blow your mind.",
    previewImage: "/images/zoe.png",
  },
  intro: {
    sceneImage:  "/images/jakebedroom.png",
    noteOrigin:  { bottom: "38%", left: "54%" },
    beats: [],   // storytelling is in the video — no text slides needed
  },

  mondayPrompt: "Write a prompt for Claude to draft lyrics for a song. Do NOT just say 'write a song'. Include: 1) The genre/vibe (e.g. 90s grunge), 2) The story/theme (e.g. leaving home for college), 3) Three specific words or phrases to include, 4) What NOT to include (no pop clichés), 5) The structure (verse-chorus-verse).",

  scenes: [

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 0 — PREDICT THE OUTPUT (opener)
    // Player sees Jake's first-ever AI prompt and guesses what he got.
    // Creates the impasse before a single word of narration. Pure experience.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s0",
      type: "predict",
      character: "Jake, 17",
      location: "BEDROOM · TUESDAY · 11:47 PM",
      predictPrompt: "Write me a song.",
      question: "Jake typed three words and hit send. The AI responded in seconds. Which output did he get?",
      choices: [
        {
          label: "A",
          text: "You left me standing in the rain\nWithout a word, without a care\nMy heart is broken once again\nYou were never really there\n\n[Verse 2 continues same pattern. Key: C major. BPM: 95. Structure: AABA. Suitable for multiple genres.]",
          correct: true,
          feedback: "Exactly. The AI didn't fail — it did precisely what 'write me a song' asks: average every song it ever learned. The result is technically a song. It has rhymes, meter, structure. And it could have been written for literally no one.",
          breakdown: [
            { phrase: "You left me standing in the rain", note: "The single most common first line in AI-generated heartbreak songs. Appears in millions of training examples." },
            { phrase: "Without a word, without a care", note: "Filler to hit the syllable count. No image, no specificity — just rhythm-shaped air." },
            { phrase: "[Verse 2 continues same pattern]", note: "The AI exposing its own template logic. It built a formula, not a song." },
            { phrase: "Suitable for multiple genres", note: "This is the tell. 'Suitable for everyone' = written for no one. Real songs come from a specific wound." },
          ],
        },
        {
          label: "B",
          text: "She named the band first, beat me to it\nThree months and she's already better-known\nTold Tyler I was fine with it — blew it\nCan't say her name right when we're not alone",
          correct: false,
          feedback: "This is what Jake eventually gets — but only after learning to ask differently. This output required the AI to know: who is speaking, from what specific wound, in what voice, with what emotional constraints. 'Write me a song' gives it none of that.",
          wrongFeedback: "This is what Jake eventually gets — but only after learning to ask differently. This output required the AI to know: who is speaking, from what specific wound, in what voice, with what emotional constraints. 'Write me a song' gives it none of that. The AI can't invent your specifics — you have to supply them.",
          wrongStoryText: "Jake stares at the generic verses. They rhyme perfectly. He feels nothing. Somewhere in the lines, his actual story never showed up.",
        },
        {
          label: "C",
          text: "I'd be happy to help! To write something that fits your needs, could you share more details? What genre are you looking for? What should the mood or theme be? Any specific instruments or style?",
          correct: false,
          feedback: "Some tools ask for clarification — but most creative AI attempts the task with whatever it was given. What Jake got wasn't a refusal. It was something stranger: a song that was technically complete and emotionally hollow.",
          wrongFeedback: "Some tools ask for clarification — but most creative AI attempts the task with whatever it was given. What Jake got wasn't a refusal. It was something stranger: a song that was technically complete and emotionally hollow. A song that could have been written by no one, for no one, about nothing in particular.",
          wrongStoryText: "Jake expected a question back. Instead, four verses appear instantly. He reads them twice, frowning. It answered — just not him.",
        },
      ],
      xpAward: 50,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 1 — COLD OPEN
    // No learn scene before this. Player hits the impasse with zero preparation.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s1",
      type: "scenario",
      character: "Jake, 17",
      location: "BEDROOM · TUESDAY · 11:47 PM",
      dialogue: [
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Dude. 50,000 plays in two days. AI beat, AI mix, my vocals. Done in a Sunday afternoon." },
        { speaker: "Jake",  avatar: "jake" as const, text: "Impressive. But I can hear it stops developing at bar eight. Same loop the whole way." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "50K plays don't care about bar eight. Just type 'write me a song' and try it." },
        { speaker: "Jake",  avatar: "jake" as const, text: "...okay. 'Write me a song.'" },
        { speaker: "Jake",  avatar: "jake" as const, text: "This is elevator music. I've heard this exact song in seventeen different waiting rooms." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Well yeah. You gave it nothing. You have to be more specific." },
        { speaker: "Jake",  avatar: "jake" as const, text: "More specific how? 'Write me a GOOD song'?" },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "...I don't know, man. It just works for me." },
      ],
      npcLine: "Just type 'write me a song' — you'll be done in five minutes.",
      question: "Jake typed 'write me a song' and got generic elevator music — technically fine, completely soulless. He tries minor variations ('write me a rock song', 'write something emotional') and gets the same result every time. Before anyone has explained anything to him — what is the root cause?",
      choices: [
        {
          label: "A",
          text: "The AI model isn't advanced enough for genuine creative output",
          correct: false,
          feedback: "The same AI that produced this hollow output has written pieces that moved audiences to tears — without them knowing AI made them. The instrument isn't the gap. The direction is.",
          wrongFeedback: "The same AI that produced this hollow output has written pieces that moved audiences to tears — without them knowing AI made them. The instrument isn't the gap. The direction is.",
          wrongStoryText: "Jake refreshes and tries 'something emotional.' The new song lands just as flat. He leans back, blaming the tool — missing the mirror.",
        },
        {
          label: "B",
          text: "Music is too emotionally subjective for AI to understand",
          correct: false,
          feedback: "AI has processed more emotional expression than any human could in ten lifetimes — it's trained on the full breadth of human music. What it can't invent is the specific emotional intention Jake hasn't told it yet.",
          wrongFeedback: "AI has processed more emotional expression than any human could in ten lifetimes — it's trained on the full breadth of human music. What it can't invent is the specific emotional intention Jake hasn't told it yet.",
          wrongStoryText: "Jake mutters, 'It just doesn't get feelings.' Across the room, a playlist of AI-written ballads plays softly. Nobody in it knows.",
        },
        {
          label: "C",
          text: "Jake hasn't given the AI anything specific — it averaged across everything it knows",
          correct: true,
          feedback: "Exactly. 'Write me a song' is like hiring a world-class orchestra and saying 'play something.' They're ready for anything — which means they play the safest, most average version of everything. Without direction, AI produces the mean of all songs ever written.",
        },
        {
          label: "D",
          text: "AI can only replicate existing songs, not create anything genuinely new",
          correct: false,
          feedback: "AI has produced music, visual art, and writing that experts couldn't distinguish from human originals. The capability is there. The gap is always in what you ask for — not what AI can do.",
          wrongFeedback: "AI has produced music, visual art, and writing that experts couldn't distinguish from human originals. The capability is there. The gap is always in what you ask for — not what AI can do.",
          wrongStoryText: "Jake crosses his arms. 'It's just copying.' The Maestro says nothing — just pulls up a track no human wrote. Jake goes quiet.",
        },
      ],
      xpAward: 75,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 2 — WRONG PATH NARRATIVE
    // Jake doubles down on generic prompts. Tyler gives up on him. The spiral.
    // No quiz — this is a narrative consequence beat. Let it breathe.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s2",
      type: "learn",
      location: "BEDROOM · TUESDAY · 1:23 AM",
      dialogue: [
        { speaker: "Jake",  avatar: "jake" as const, text: "'Write me a punk song about feeling invisible.' Better. Still not right." },
        { speaker: "Jake",  avatar: "jake" as const, text: "'Write something angry, for guitar, about watching someone you trusted change.' Closer. Still average." },
        { speaker: "Jake",  avatar: "jake" as const, text: "'Write a verse that sounds like our band.' The AI doesn't know what our band sounds like. Obviously." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "You've been at this for two hours. Just quit. Maybe it's a tool for people who aren't real musicians." },
        { speaker: "Jake",  avatar: "jake" as const, text: "That's not what's happening. Something is fundamentally wrong with how I'm asking." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Or you're just bad at this. Go to sleep." },
        { speaker: "Jake",  avatar: "jake" as const, text: "I can hear the gap between what it's giving me and what's in my head. I just don't have the language for the gap yet." },
      ],
      scenarioText: "One forty-three AM. Seventeen prompt variations. Each one marginally better than 'write me a song.' None of them close to what Jake hears when he closes his eyes and plays the riff in his head. Tyler had called it a waste of time and left. Jake kept going — not because he was stubborn, but because the gap between the AI's output and his actual vision was too precise to be random. There was a reason for it. He just didn't know what it was yet.",
      learnHighlight: "Jake couldn't name what was wrong. But he could hear it — and that gap between 'what I got' and 'what I wanted' was the most important thing that had happened to him all week.",
      xpAward: 20,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 3 — SEÑORA VEGA'S TEST
    // Second impasse. She plays the hollow AI quartet. Asks Jake BEFORE explaining.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s3",
      type: "scenario",
      character: "Señora Vega",
      location: "MUSIC CLASS · WEDNESDAY · 3:15 PM",
      dialogue: [
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "I'm going to play something. Listen closely. Don't think — just react." },
        { speaker: "Jake",        avatar: "jake" as const, text: "It's technically perfect. Every note exactly where it should be. Structure is correct. Form is correct. And yet..." },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "And yet. Jake. You're making your 'something is wrong' face. Tell the class what you hear." },
        { speaker: "Jake",        avatar: "jake" as const, text: "It's hollow. Like someone described sadness without ever having been sad. A brilliant forgery — every element correct, something essential absent." },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "Now. Before I tell you anything — why do you think that happened?" },
        { speaker: "Jake",        avatar: "jake" as const, text: "The composer... didn't bring any actual feeling to it? Just described a category of feeling?" },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "Stay with that thought. Don't let it go." },
      ],
      npcLine: "Now — before I tell you anything — why do you think that happened?",
      question: "Señora Vega plays AI-composed music that is technically flawless but leaves the class unmoved. Jake says it's 'hollow — like a brilliant forgery.' Before she explains anything — what is the most likely root cause of this emptiness?",
      choices: [
        {
          label: "A",
          text: "AI fundamentally cannot produce emotionally resonant music",
          correct: false,
          feedback: "AI has produced music that moved audiences to tears without them knowing its origin. The capability exists. What's missing isn't in the model — it's in what the model was asked for.",
          wrongFeedback: "AI has produced music that moved audiences to tears without them knowing its origin. The capability exists. What's missing isn't in the model — it's in what the model was asked for.",
          wrongStoryText: "Jake frowns at the speaker. The Maestro's voice cuts through: 'The machine isn't broken, Jake. It was just never told whose heart to break.'",
        },
        {
          label: "B",
          text: "Señora Vega used an inferior AI tool for this demonstration",
          correct: false,
          feedback: "The same tool that produced this hollow piece can produce something genuinely moving. The bottleneck is upstream of the tool — it's in what the tool was asked to do.",
          wrongFeedback: "The same tool that produced this hollow piece can produce something genuinely moving. The bottleneck is upstream of the tool — it's in what the tool was asked to do.",
          wrongStoryText: "Jake glances at the console, ready to blame it. The screen flickers: 'Same engine, Jake. Different driver. Look upstream.'",
        },
        {
          label: "C",
          text: "Whoever prompted it described a genre of sadness, not a specific human experience",
          correct: true,
          feedback: "Jake heard it correctly. 'Sad string quartet' lets AI average every sad piece it's ever seen — which produces technically correct sadness with the emotional fingerprint of no one in particular. A specific grief — whose, from what, why it doesn't resolve — is a completely different request.",
        },
        {
          label: "D",
          text: "String quartets require decades of compositional training to write well",
          correct: false,
          feedback: "AI has absorbed centuries of string quartet composition. The technical mastery is already there. What's missing is the emotional specificity that tells AI which kind of sadness, from whose life, at what moment.",
          wrongFeedback: "AI has absorbed centuries of string quartet composition. The technical mastery is already there. What's missing is the emotional specificity that tells AI which kind of sadness, from whose life, at what moment.",
          wrongStoryText: "Jake thinks of music school. The Maestro shakes his head slowly: 'The AI already passed that exam. It's waiting for a reason to feel it.'",
        },
      ],
      xpAward: 75,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 4 — THE AHA: CONDUCTOR PRINCIPLE
    // The concept arrives AFTER two impasse scenes. Now it lands.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s4",
      type: "learn",
      location: "MUSIC CLASS · WEDNESDAY · 3:28 PM",
      concept: {
        title: "THE CONDUCTOR PRINCIPLE",
        body: "AI is not magic, not a search engine, not a creative mind. It is a prediction engine — trained on billions of examples of human expression, it predicts what should come next given exactly what you gave it. This means vague input produces the average of everything. Specific input collapses the search space to exactly what you need. You are the conductor. It is the orchestra. Every instrument is ready. The only thing missing was a baton.",
      },
      scenarioText: "Señora Vega let it land before she said anything. 'The instruction was: write a sad string quartet. The AI did exactly what it was told — it wrote the statistical average of all sad string quartets ever composed. Every choice technically defensible. No choice emotionally true. Because no one told it whose sadness. What moment. What doesn't resolve at the end.' Jake stared at the notation on his desk. He had been doing exactly this for seventeen prompts last night. He had felt the gap. Now he had the name for it.",
      learnHighlight: "AI amplifies what you give it. Give it a category — you get the average. Give it a specific human truth — you get something that could only come from you.",
      xpAward: 40,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 5 — APPLY THE PRINCIPLE
    // Jake immediately applies the conductor principle. First real success.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s5",
      type: "scenario",
      character: "Jake, 17",
      location: "BEDROOM · WEDNESDAY · 10:45 PM",
      dialogue: [
        { speaker: "Jake",  avatar: "jake" as const, text: "Okay. Not 'write me a song.' Let me try this for real." },
        { speaker: "Jake",  avatar: "jake" as const, text: "'A verse for a 17-year-old guitarist. Punk band. His ex started a rival band. Tone: bitter, but still in love. He can't say her name without his voice doing something weird. Rhyme ABCB. No metaphors — direct statements only. The character is done pretending he's fine.'" },
        { speaker: "Jake",  avatar: "jake" as const, text: "..." },
        { speaker: "Jake",  avatar: "jake" as const, text: "This sounds like it could actually be us. It knows the world I described. It wrote FROM that world." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Wait — you made that? Just now? That's actually... that's good." },
        { speaker: "Jake",  avatar: "jake" as const, text: "The difference wasn't the AI. I gave it who I am, what I need, and what I refuse to sound like. It did the rest." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "So when I just typed 'write me a song'..." },
        { speaker: "Jake",  avatar: "jake" as const, text: "You hired a world-class orchestra and said 'play something.' They played the safest thing they know." },
      ],
      concept: {
        title: "Context Collapses Infinite Possibilities",
        body: "Without context, AI searches an infinite space of possible outputs — and returns the most statistically probable one. Context — who, what, tone, constraints, what to avoid — narrows that space from infinite to specific. The more of yourself you put in, the more of you comes back out.",
      },
      question: "Jake's detailed prompt produces something that sounds like it 'could actually be us.' His earlier generic prompts produced elevator music. The AI is identical. What changed?",
      choices: [
        {
          label: "A",
          text: "Jake added a rhyme scheme, which structured the AI's output better",
          correct: false,
          feedback: "The rhyme scheme was one small element. The larger shift was giving the AI a whole world — who is speaking, from what emotional wound, with what constraints. The rhyme was one brick. The world was the blueprint.",
          wrongFeedback: "The rhyme scheme was one small element. The larger shift was giving the AI a whole world — who is speaking, from what emotional wound, with what constraints. The rhyme was one brick. The world was the blueprint.",
          wrongStoryText: "Jake highlights the rhyme scheme proudly. Señora Vega tilts her head: 'One brick doesn't build a room, Jake. What made the whole world feel real?'",
        },
        {
          label: "B",
          text: "Jake gave the AI a specific emotional world to write from — which collapsed an infinite space to exactly the right voice",
          correct: true,
          feedback: "The moment Jake described the person, the situation, the tone, and what to avoid — the AI stopped averaging and started channeling. 'Write me a song' asks AI to choose from everything. This prompt leaves it no choice but to write Jake's song.",
        },
        {
          label: "C",
          text: "Longer prompts always produce better output because the AI has more to work with",
          correct: false,
          feedback: "A longer vague prompt still produces vague output. A 500-word description of 'please write something good' still averages. It's the precision of the context, not the volume of the words.",
          wrongFeedback: "A longer vague prompt still produces vague output. A 500-word description of 'please write something good' still averages. It's the precision of the context, not the volume of the words.",
          wrongStoryText: "Jake's longer prompt sits on screen. The console hums quietly: 'Five hundred words of vague is still vague, Jake. More isn't the same as precise.'",
        },
        {
          label: "D",
          text: "Jake used negative constraints ('no metaphors') which filtered out the generic patterns",
          correct: false,
          feedback: "Negative constraints are useful, but they're not the primary engine. The identity context — who is speaking, from what situation — is what made this feel like Jake's band. Constraints without identity still produce generic work with fewer clichés.",
          wrongFeedback: "Negative constraints are useful, but they're not the primary engine. The identity context — who is speaking, from what situation — is what made this feel like Jake's band. Constraints without identity still produce generic work with fewer clichés.",
          wrongStoryText: "Jake points at his list of negatives. The Maestro leans in: 'You told it what to avoid. Did you tell it who was speaking?'",
        },
      ],
      xpAward: 100,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 5b — PREDICT #2: THE SPECIFIC PROMPT
    // Player just saw Jake's detailed prompt work. Now they predict the output.
    // Reinforces the contrast: same AI, completely different input → output.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s5b",
      type: "predict",
      character: "Jake, 17",
      location: "BEDROOM · WEDNESDAY · 10:48 PM",
      predictPrompt: "A verse for a 17-year-old guitarist. Punk band. His ex started a rival band. Tone: bitter, but still in love. He can't say her name without his voice doing something weird. Rhyme ABCB. No metaphors — direct statements only. The character is done pretending he's fine.",
      question: "Same AI. Completely different prompt. Which response did Jake get this time?",
      choices: [
        {
          label: "A",
          text: "My broken heart won't heal tonight\nYou left me crying in the rain\nI loved you with all of my might\nBut you caused me so much pain",
          correct: false,
          feedback: "This is the generic output Jake got from 'write me a song' — not from a prompt packed with specific identity, situation, tone, and constraints. With specific input, the AI has no choice but to write something specific back.",
          wrongFeedback: "This is the generic output Jake got from 'write me a song' — not from a prompt packed with specific identity, situation, tone, and constraints. With specific input, the AI has no choice but to write something specific back.",
          wrongStoryText: "Jake reads the clichés aloud. His jaw tightens. 'That's what I used to write,' he mutters, 'before I told it the truth.'",
        },
        {
          label: "B",
          text: "She named the band first, beat me to the name\nThree months in, already better than before\nTold Tyler I was fine — said it straight, no game\nCan't say her name out loud the way I used to anymore",
          correct: true,
          feedback: "That's exactly what Jake got — and Tyler's jaw dropped. Context collapsed infinite possibilities to exactly one voice: 17, punk, bitter but in love, specific situation, direct language, done pretending. The AI stopped averaging. It started channeling.",
        },
        {
          label: "C",
          text: "What a powerful creative vision! Here's an uplifting take on moving forward:\n\nEvery storm reveals the sun ahead\nKeep your chin up, better days await\nNew chapters start when old ones end instead\nYour story's just begun — it isn't late",
          correct: false,
          feedback: "When Jake gave the AI explicit emotional direction — bitter, direct statements, done pretending, no metaphors — the AI followed it precisely. This motivational reframe would only appear if you removed all the specific emotional instructions from the prompt.",
          wrongFeedback: "When Jake gave the AI explicit emotional direction — bitter, direct statements, done pretending, no metaphors — the AI followed it precisely. This motivational reframe would only appear if you removed all the specific emotional instructions from the prompt.",
          wrongStoryText: "Jake stares at the motivational verse. 'I asked it not to do that,' he says. The Maestro nods: 'Exactly. And it listened perfectly.'",
        },
        {
          label: "D",
          text: "Content note: This prompt references specific personal relationships and a real person ('his ex'). I'm not able to generate content about real individuals. Please provide a more general creative brief.",
          correct: false,
          feedback: "Creative AI tools don't flag fictional character prompts this way. 'A 17-year-old guitarist' is a character, not a real person. And even when AI needs clarification, it asks a follow-up question — not a policy refusal.",
          wrongFeedback: "Creative AI tools don't flag fictional character prompts this way. 'A 17-year-old guitarist' is a character, not a real person. And even when AI needs clarification, it asks a follow-up question — not a policy refusal.",
          wrongStoryText: "Jake blinks at the refusal notice. The Maestro smiles: 'AI doesn't confuse a 17-year-old guitarist with a real person, Jake. It just waits to be directed.'",
        },
      ],
      xpAward: 75,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 6 — FAST VS. DEEP: COLD COMPARISON
    // No teaching before this. Player reasons from narrative context alone.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s6",
      type: "scenario",
      character: "Tyler",
      location: "SCHOOL HALLWAY · THURSDAY · 8:14 AM",
      dialogue: [
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "50K plays in two days. Look." },
        { speaker: "Jake",  avatar: "jake" as const, text: "I hear it. It's catchy. Has a hook. But it doesn't develop — same four bars the whole way through. No tension, no release. It's a loop, not a song." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "50K plays don't lie." },
        { speaker: "Jake",  avatar: "jake" as const, text: "50K people heard it. How many will remember it in a month?" },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "More than zero remembered your EP last year." },
        { speaker: "Jake",  avatar: "jake" as const, text: "I'm not saying your approach is wrong. I'm saying — you used AI to go fast. What if you used it to go deeper?" },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Deeper how? It's a three-minute song, not a symphony." },
        { speaker: "Jake",  avatar: "jake" as const, text: "What if instead of 'make me a beat' you described the emotional arc? The tension points? Used everything you know about what makes a song stick?" },
      ],
      npcLine: "Speed is literally the point. Why would you make it slower?",
      question: "Tyler made a viral track in an afternoon with a generic AI prompt. Jake is arguing this is only 10% of what AI can do. Before Jake explains his reasoning — what is the most likely distinction he's pointing to?",
      choices: [
        {
          label: "A",
          text: "Viral content means Tyler's approach is objectively superior",
          correct: false,
          feedback: "Virality and depth measure different things. A song can go viral for being catchy and fade in a week, or it can be placed in a film score and outlive everyone who made it. Tyler optimized for one metric — Jake is pointing at another.",
          wrongFeedback: "Virality and depth measure different things. A song can go viral for being catchy and fade in a week, or it can be placed in a film score and outlive everyone who made it. Tyler optimized for one metric — Jake is pointing at another.",
          wrongStoryText: "Jake crosses his arms. 'Tyler's track is everywhere.' The Maestro nods slowly: 'For now. Ask me where it'll be in two years.'",
        },
        {
          label: "B",
          text: "Tyler should switch to a different AI tool for better quality output",
          correct: false,
          feedback: "The same tool that produced Tyler's viral hook can produce something exceptional — if the input is different. Tool quality is not the variable. The depth of what you ask for is.",
          wrongFeedback: "The same tool that produced Tyler's viral hook can produce something exceptional — if the input is different. Tool quality is not the variable. The depth of what you ask for is.",
          wrongStoryText: "Jake shakes his head slowly. 'It's not the hammer,' he says, tapping his temple. 'It's what you know before you swing it.'",
        },
        {
          label: "C",
          text: "Speed is the floor — AI can do that for anyone. The ceiling is what happens when deep domain knowledge becomes the language you use to direct it",
          correct: true,
          feedback: "Exactly. Tyler found the floor quickly — AI can get you to 'decent' in an afternoon. Jake is pointing at the ceiling: what happens when years of musical knowledge about tension, dynamics, emotional arc become the vocabulary you use to conduct AI? That's a different tool entirely.",
        },
        {
          label: "D",
          text: "AI-generated music will always lack the depth of human composition",
          correct: false,
          feedback: "AI directed by someone with deep musical knowledge can produce genuinely moving, technically sophisticated work. The limit isn't the instrument — it's always the conductor.",
          wrongFeedback: "AI directed by someone with deep musical knowledge can produce genuinely moving, technically sophisticated work. The limit isn't the instrument — it's always the conductor.",
          wrongStoryText: "Jake pulls up two tracks — same AI, same tool. One's forgettable. One stops the room. 'Same instrument,' he says quietly. 'Different conductor.'",
        },
      ],
      xpAward: 75,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 7 — WRONG PATH: SPEED TRAP (narrative consequence)
    // Three months later. Tyler's numbers tell the story of the speed approach.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s7",
      type: "learn",
      location: "THREE MONTHS LATER",
      scenarioText: "Tyler: 143 AI tracks released. 11 with more than 1,000 plays. 132 forgotten within a week of posting. His Spotify monthly listeners had plateaued. He was faster than anyone — and had less to show for it than he expected. Jake: 14 tracks released. 11 still getting regular plays eight weeks later. Two had caught the attention of people neither of them had heard of. One came from a music supervisor who worked in film. Jake wasn't faster. He was asking for something that couldn't be averaged.",
      learnHighlight: "Volume is what you produce when you don't know exactly what you're building toward. Precision is what you produce when you do.",
      xpAward: 20,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 8 — AHA: FAST VS. DEEP
    // Concept arrives AFTER the narrative consequence. Lands harder.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s8",
      type: "learn",
      location: "MUSIC CLASS · FOUR MONTHS IN",
      concept: {
        title: "SPEED IS THE FLOOR. DEPTH IS THE CEILING.",
        body: "AI makes the floor of creative output extremely accessible — anyone can produce something competent quickly. This is real and valuable. But most people stop there. They use AI to go fast. The professionals getting remarkable results use AI to go deeper than they could without it — producing work with the specificity, craft, and emotional precision that would have taken weeks to develop alone.",
      },
      scenarioText: "Señora Vega had said it more simply: 'Every student who gets mediocre results from AI uses it to go faster. Every student who gets remarkable results uses it to go further.' Not further in time — further in depth. The same hour that Tyler spent making eight generic tracks, Jake spent making one piece that landed in someone's creative brief. Both students used AI. Neither approach is wrong. But only one of them is building toward something.",
      learnHighlight: "The question is never 'can I use AI to do this faster?' The question is 'can I use AI to do this at a depth that would have been impossible without it?'",
      xpAward: 40,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 9 — SPECIFICITY SHOWDOWN
    // Jake runs both prompts live at band practice. Iterative refinement demo.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s9",
      type: "scenario",
      character: "Jake, 17",
      location: "BAND PRACTICE · THURSDAY · 6:30 PM",
      dialogue: [
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Alright. Show us. Live. Right now." },
        { speaker: "Jake",  avatar: "jake" as const, text: "First run: 'Write a bridge for a punk song about feeling invisible at school.' Okay — here's what we get." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "It's... okay. Generic though. Could be any punk band." },
        { speaker: "Jake",  avatar: "jake" as const, text: "Right. Now I add: 'Angrier. Shorter lines. No metaphors — direct statements. The character is done being patient. This is the moment they stop performing being fine.'" },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "...that actually sounds like us. How'd you know what to add?" },
        { speaker: "Jake",  avatar: "jake" as const, text: "I knew what was missing. Three years playing live — I know what a bridge needs to do to the room. I heard what the first one didn't do and I named exactly that." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "So it's not about the first prompt. It's about knowing what's wrong with the output." },
        { speaker: "Jake",  avatar: "jake" as const, text: "You don't finish a song in one take. Same principle." },
      ],
      concept: {
        title: "Prompting Is a Conversation, Not a Command",
        body: "The best AI output rarely comes from a single prompt. It comes from a dialogue — you evaluate what you received using expert knowledge, identify exactly what's missing, and ask for precisely that. Each round closes the gap. Your ability to hear what's wrong is the skill that separates exceptional AI conductors from everyone else.",
      },
      question: "Jake's first prompt produces acceptable output. His second — targeting exactly what was missing from the first — produces something the band actually wants to play. What skill made the second prompt possible?",
      choices: [
        {
          label: "A",
          text: "Luck — the second prompt happened to use better keywords",
          correct: false,
          feedback: "Jake knew exactly what was wrong with the first output — the anger was missing, lines were too soft, metaphors were cushioning what needed to hit directly. That diagnosis came from musical expertise, not luck.",
          wrongFeedback: "Jake knew exactly what was wrong with the first output — the anger was missing, lines were too soft, metaphors were cushioning what needed to hit directly. That diagnosis came from musical expertise, not luck.",
          wrongStoryText: "Jake almost laughs. 'Luck?' The second prompt had seven precise words. Every one of them earned. Luck doesn't know what 'too soft' sounds like.",
        },
        {
          label: "B",
          text: "Writing longer and more detailed prompts every time",
          correct: false,
          feedback: "The second prompt wasn't longer — it was precisely targeted. Jake diagnosed what was wrong and asked for that exact fix. Targeted precision beats comprehensive length.",
          wrongFeedback: "The second prompt wasn't longer — it was precisely targeted. Jake diagnosed what was wrong and asked for that exact fix. Targeted precision beats comprehensive length.",
          wrongStoryText: "Jake's second prompt is shorter than the first. The band goes quiet when it plays back. Precision, not volume, filled the room.",
        },
        {
          label: "C",
          text: "The ability to evaluate output with expert knowledge and name exactly what to ask for next",
          correct: true,
          feedback: "This is the compounding skill that separates expert AI conductors. Your domain expertise lets you hear what's missing — and describe the fix with enough precision that the AI can deliver it. The feedback loop is where the magic lives.",
        },
        {
          label: "D",
          text: "Telling the AI what NOT to do (avoiding metaphors) is more powerful than telling it what to do",
          correct: false,
          feedback: "Negative constraints are one useful tool — but the bigger shift was the positive direction: shorter lines, direct statements, the emotional state of the character at that specific moment. What to avoid helps; what to become is the real instruction.",
          wrongFeedback: "Negative constraints are one useful tool — but the bigger shift was the positive direction: shorter lines, direct statements, the emotional state of the character at that specific moment. What to avoid helps; what to become is the real instruction.",
          wrongStoryText: "Jake underlines three words in his prompt: *what to become*. 'Avoiding something,' he mutters, 'is still running away from the target.'",
        },
      ],
      xpAward: 100,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 10 — EMOTIONAL PROMPT CHALLENGE
    // The rain-on-windshield moment. Precision under emotional pressure.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s10",
      type: "prompt",
      character: "Jake, 17",
      location: "BEDROOM · THURSDAY · 11:32 PM",
      promptChallenge: {
        context: "There's a specific moment Jake has been trying to capture for three years. Driving away from someone's house for the last time. City lights blurring through rain on the windshield. Completely numb — not crying yet, maybe never. The radio plays something he'll never be able to listen to again. He's tried to write this song seven times. Tonight, for the first time, he's going to ask AI — but with everything he now knows about how to conduct it.",
        goal: "Write Jake's prompt. Give the AI enough emotional, sonic, and structural specificity to compose an opening guitar riff that actually sounds like that exact feeling — not 'heartbreak in general', but that specific drive home.",
        placeholder: "Type Jake's prompt to the AI...",
      },
      xpAward: 150,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 11 — ARTICULATION GATE
    // Tyler asks Jake to explain it. Player must articulate the principle.
    // This forces encoding: you have to TEACH it before you own it.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s11",
      type: "prompt",
      character: "Jake, 17",
      location: "BAND PRACTICE · FRIDAY · 5:50 PM",
      promptChallenge: {
        context: "Tyler is convinced. He's watched Jake get results he can't match — same tool, completely different output. 'Okay,' he says. 'Walk me through it. Not the technical stuff. Just — what are you actually doing in your head when you write a prompt? Because I'm doing something different and I can't see what it is.' Jake has one shot to explain this in plain language. No jargon. No theory. Just the real principle, in words Tyler can use tomorrow when he opens AI on his own.",
        goal: "Write what Jake says. Explain — in Jake's direct voice, using music metaphors if they help — the core difference between how Jake approaches AI and how Tyler does. Make it something Tyler can actually walk away and apply.",
        placeholder: "Jake says: '...'",
      },
      xpAward: 100,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 12 — ITERATIVE PROMPTING AT SCALE
    // Jake demonstrates the full loop: evaluate, diagnose, refine.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s12",
      type: "scenario",
      character: "Tyler",
      location: "BAND PRACTICE · FRIDAY · 7:15 PM",
      dialogue: [
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Okay, I described the character, what they want and fear. First prompt was still mid." },
        { speaker: "Jake",  avatar: "jake" as const, text: "What was mid about it?" },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "The rhythm. Too steady. The character should feel off-balance, but the lyrics land too comfortably." },
        { speaker: "Jake",  avatar: "jake" as const, text: "That's the diagnosis. Tell the AI: 'Rhythm is too resolved. Shorter lines, irregular breaks, unfinished sentences.'" },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "...okay that's significantly better. The unevenness is in the line breaks now." },
        { speaker: "Jake",  avatar: "jake" as const, text: "You just did something I couldn't do six months ago — you heard what was wrong and you named it." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Because I know what off-balance feels like in a song. I just never thought to put that knowledge into the prompt." },
        { speaker: "Jake",  avatar: "jake" as const, text: "That's it. Everything you know about music — you put that in the prompt. The AI can't feel what's missing. You can." },
      ],
      concept: {
        title: "Your Ear Is the Engine",
        body: "The iterative prompting loop only works if you can hear what's wrong. This is where musical expertise becomes irreplaceable — AI can execute any instruction precisely, but it cannot evaluate its own output with the ear of someone who has played 10,000 hours of live music. Your taste is not obsolete. It is the steering wheel.",
      },
      question: "Tyler makes real progress on his second prompt — but only because he was able to diagnose what was wrong with the first. What made the second round possible?",
      choices: [
        {
          label: "A",
          text: "He used longer and more detailed instructions the second time",
          correct: false,
          feedback: "The second prompt wasn't necessarily longer — it was precisely targeted. Tyler heard a specific problem (too-steady rhythm for an off-balance character) and translated that into an exact instruction. Precision, not volume.",
          wrongFeedback: "The second prompt wasn't necessarily longer — it was precisely targeted. Tyler heard a specific problem (too-steady rhythm for an off-balance character) and translated that into an exact instruction. Precision, not volume.",
          wrongStoryText: "Tyler's second prompt is barely longer. But it lands differently. Jake nods. 'You heard the problem. That's the whole skill right there.'",
        },
        {
          label: "B",
          text: "His musical expertise let him hear a specific gap and translate it into an exact instruction",
          correct: true,
          feedback: "This is the compounding advantage. Tyler heard that the rhythm felt too resolved for an off-balance character — that's a sophisticated musical observation. Without that knowledge, he couldn't have named what was wrong. Without naming it, he couldn't have asked for the fix.",
        },
        {
          label: "C",
          text: "The second prompt worked because he asked the AI to 'try harder'",
          correct: false,
          feedback: "'Try harder' is still a vague instruction. The AI doesn't have a 'trying harder' mode — it responds to precision. Tyler's breakthrough came from precise diagnosis, not from asking for more effort.",
          wrongFeedback: "'Try harder' is still a vague instruction. The AI doesn't have a 'trying harder' mode — it responds to precision. Tyler's breakthrough came from precise diagnosis, not from asking for more effort.",
          wrongStoryText: "The console doesn't try harder. It just listens. Tyler stares at the screen, realizing the AI was never the one holding back.",
        },
        {
          label: "D",
          text: "He got lucky with the second attempt",
          correct: false,
          feedback: "There was no luck here. Tyler named a specific problem — rhythm too steady for an emotionally off-balance character — and asked for its opposite with precision. That's craft, not chance.",
          wrongFeedback: "There was no luck here. Tyler named a specific problem — rhythm too steady for an emotionally off-balance character — and asked for its opposite with precision. That's craft, not chance.",
          wrongStoryText: "Jake crosses his arms. 'Luck doesn't know the difference between steady and stumbling.' Tyler's second prompt did. That's not the same thing.",
        },
      ],
      xpAward: 100,
    },

    // ── NEAR-TRANSFER: Same Principle, Different Stage ────────────────────────
    {
      id:       "w1v2-near-transfer",
      type:     "learn",
      location: "PRACTICE ROOM · SATURDAY · 2:14 AM",
      xpAward:  0,
      concept: {
        title: "Same Principle. Different Stage.",
        body:  "Maya runs marketing at a SaaS startup. Her agency kept producing generic campaign copy — technically correct, completely unmemorable. She stopped saying 'write us social posts' and started saying: 'Write 5 LinkedIn posts for a Series A CFO audience. Each must reference one specific pain point from enterprise procurement. DO NOT use startup jargon. Tone: direct, confident, data-backed.' First draft hit 4x their usual engagement. Same AI. Completely different prompt.",
      },
      learnHighlight: "The musician who names the feeling gets the performance. The professional who names the constraint gets the output.",
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 13 — BOSS (5-punch, with callback to Scene 1)
    // The boss dialogue explicitly references the cold open. Emotional payoff.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s13",
      type: "boss",
      character: "Jake",
      location: "PRACTICE ROOM · SATURDAY · 2:14 AM",
      dialogue: [
        { speaker: "Jake", avatar: "jake" as const, text: "I want to do an experiment. AI — do you remember the first thing I ever asked you?" },
        { speaker: "AI",   avatar: "npc" as const, npcKey: "ai" as const, text: "Query: 'Write me a song.' Output delivered. Confidence: maximum. Quality: average of all songs ever written." },
        { speaker: "Jake", avatar: "jake" as const, text: "Play it back." },
        { speaker: "AI",   avatar: "npc" as const, npcKey: "ai" as const, text: "Playing. [Generic chord progression. Safe dynamics. Predictable resolution.]" },
        { speaker: "Jake", avatar: "jake" as const, text: "That's what I almost gave up over. I almost decided the tool was broken. The tool was never broken." },
        { speaker: "AI",   avatar: "npc" as const, npcKey: "ai" as const, text: "Correct. Your input was imprecise. The output was precisely what you asked for." },
        { speaker: "Jake", avatar: "jake" as const, text: "Now. New prompt. 'A fingerstyle piece in Am. 68 BPM. The grief of watching someone you love choose to leave. The chord that reaches but never resolves.'" },
        { speaker: "AI",   avatar: "npc" as const, npcKey: "ai" as const, text: "Composing. [A piece begins that sounds like no AI output Jake has ever heard. It sounds like him.]" },
        { speaker: "Jake", avatar: "jake" as const, text: "Same tool. Same AI. Different conductor. That's the whole story." },
      ],
      bossQuestions: [
        {
          npcLine: "Just type 'write me a song' — you're done in five minutes.",
          question: "Tyler has made 50 AI tracks this month. Most are technically fine but interchangeable — no distinct voice, no specific emotion. They could be from any band, any decade. What single change would unlock dramatically different output?",
          choices: [
            { label: "A", text: "Switch to a more powerful AI model", correct: false, feedback: "A better instrument doesn't play itself. The bottleneck was never the tool — it's the direction. Give the same model specific direction and everything changes.", wrongFeedback: "A better instrument doesn't play itself. The bottleneck was never the tool — it's the direction. Give the same model specific direction and everything changes.",
          wrongStoryText: "Jake sets down his coffee. 'Give a louder speaker the same empty signal,' he says, 'and you just get louder emptiness.'", },
            { label: "B", text: "Inject specific musical identity, emotional intent, and constraints into every prompt", correct: true, feedback: "Exactly. Generic input produces the average of everything the AI has ever learned. The moment you add who is speaking, what they feel, and what they won't do — the output collapses from infinite to specific." },
            { label: "C", text: "Use AI for beats only and write everything else by hand", correct: false, feedback: "Compartmentalizing doesn't solve the root problem. Precision in any prompt — beats, lyrics, arrangement — is what separates generic from specific.", wrongFeedback: "Compartmentalizing doesn't solve the root problem. Precision in any prompt — beats, lyrics, arrangement — is what separates generic from specific.",
          wrongStoryText: "Jake tilts his head. 'You're just moving the problem sideways.' Tyler looks at his beat folder — fifty tracks, no voice. Still.", },
            { label: "D", text: "Hire a professional songwriter to review and improve the output", correct: false, feedback: "Post-production can polish edges, but it can't add the specificity that was never in the prompt. Fix the input, not just the output.", wrongFeedback: "Post-production can polish edges, but it can't add the specificity that was never in the prompt. Fix the input, not just the output.",
          wrongStoryText: "Jake winces. The console flickers: 'A songwriter can't add what the prompt never asked for.' The tracks stay identical.", },
          ],
        },
        {
          npcLine: "The AI mirrors its conductor. Emotional depth must come from your instructions.",
          question: "Señora Vega plays an AI string quartet prompted with 'write a sad piece.' It's technically flawless — and emotionally hollow. Jake says it's 'like a brilliant forgery.' What would have produced something genuinely moving?",
          choices: [
            { label: "A", text: "Use an AI model specifically trained on emotional music", correct: false, feedback: "The same model that produced this hollow piece can produce something devastating. The gap is never in the model — it's in what you asked for.", wrongFeedback: "The same model that produced this hollow piece can produce something devastating. The gap is never in the model — it's in what you asked for.",
          wrongStoryText: "Jake shakes his head slowly. 'Same engine,' he murmurs, 'different conductor.' Señora Vega's hollow quartet plays on.", },
            { label: "B", text: "Ask the AI to 'try harder' or 'make it sadder'", correct: false, feedback: "Vague refinement produces vague improvement. 'Sadder' is still an average. The specific grief of a specific moment is what actually moves people.", wrongFeedback: "Vague refinement produces vague improvement. 'Sadder' is still an average. The specific grief of a specific moment is what actually moves people.",
          wrongStoryText: "The strings play again — marginally softer, still empty. Jake crosses his arms. 'You asked for more of nothing,' he says quietly.", },
            { label: "C", text: "Describe the exact emotional texture — whose grief, what moment, what feeling refuses to resolve", correct: true, feedback: "'Sad string quartet' lets AI average every sad piece it knows. 'The grief of watching someone you love choose to leave — the chord that reaches but never resolves' — that's a specific human experience. Specificity is the only path to genuine emotion." },
            { label: "D", text: "Add precise technical details: tempo, key signature, instrument articulations", correct: false, feedback: "Technical specificity helps, but it's not what moves people. A perfect Am piece at 68 BPM can still be emotionally hollow. Emotional specificity — the story behind the sound — is what transforms technique into feeling.", wrongFeedback: "Technical specificity helps, but it's not what moves people. A perfect Am piece at 68 BPM can still be emotionally hollow. Emotional specificity — the story behind the sound — is what transforms technique into feeling.",
          wrongStoryText: "A perfect Am at 68 BPM fills the hall. Jake listens, unmoved. 'Flawless,' he sighs. 'And completely forgettable.'", },
          ],
        },
        {
          question: "Tyler made a track in an afternoon that went viral. Jake spent a week on a track that got licensed for a film score. A producer comparing their approaches — what's the most likely difference?",
          choices: [
            { label: "A", text: "Jake paid for a higher-tier AI subscription", correct: false, feedback: "The tool is identical. The conductor is different.", wrongFeedback: "The tool is identical. The conductor is different.",
          wrongStoryText: "Jake laughs quietly at the screen. 'Same AI,' he says. 'The invoice doesn't conduct the orchestra — you do.'", },
            { label: "B", text: "Jake got lucky with a client who values slower production", correct: false, feedback: "Film licensing selects for the quality and distinctiveness of the work, not the production timeline.", wrongFeedback: "Film licensing selects for the quality and distinctiveness of the work, not the production timeline.",
          wrongStoryText: "Jake reads the licensing email again. No mention of timelines. Just: 'This piece was unlike anything else we heard.'", },
            { label: "C", text: "Tyler optimized for speed; Jake applied deep musical knowledge to produce something too specific to be ignored", correct: true, feedback: "Speed is the floor of AI value — Tyler found it fast. The ceiling is what happens when years of domain expertise become the language you use to direct the AI with precision." },
            { label: "D", text: "Tyler's approach will eventually catch up once AI improves", correct: false, feedback: "Better AI doesn't change the fundamental principle — more powerful instruments still don't conduct themselves. The conductor is always essential.", wrongFeedback: "Better AI doesn't change the fundamental principle — more powerful instruments still don't conduct themselves. The conductor is always essential.",
          wrongStoryText: "Jake stares at the horizon. 'Better engines,' he says, 'still don't know where they're going without a driver.'", },
          ],
        },
        {
          question: "Jake runs two prompts for the same verse. Prompt 1: 'Write a verse about heartbreak for my punk band.' Prompt 2: 'Write a verse for a 17-year-old guitarist — his ex started a rival band, tone: bitter but still in love, rhyme ABCB, no clichés.' Why is Prompt 2 exponentially more powerful?",
          choices: [
            { label: "A", text: "Prompt 2 is longer, so the AI 'tries harder'", correct: false, feedback: "Length is irrelevant. A longer vague prompt still produces vague output. It's precision of information, not volume of words.", wrongFeedback: "Length is irrelevant. A longer vague prompt still produces vague output. It's precision of information, not volume of words.",
          wrongStoryText: "Jake pulls up both outputs. The longer one rambles. 'Words aren't direction,' he says, tapping the screen. 'Intent is.'", },
            { label: "B", text: "The 'avoid clichés' constraint is the critical element", correct: false, feedback: "Negative constraints help, but they're not the primary driver. The bigger shift is defining who is speaking, from what emotional wound, in what tone.", wrongFeedback: "Negative constraints help, but they're not the primary driver. The bigger shift is defining who is speaking, from what emotional wound, in what tone.",
          wrongStoryText: "Jake reads the cliché-free verse. It's clean. It's hollow. 'You told it what to avoid,' he says. 'Not who to be.'", },
            { label: "C", text: "Context tells AI which world to write from — collapsing infinite possibilities down to exactly the right one", correct: true, feedback: "Without context, 'heartbreak' could be a thousand songs from a thousand voices. With context, there is only one song — Jake's. The moment AI knows who is speaking and from what wound, it stops averaging and starts channeling." },
            { label: "D", text: "The rhyme scheme (ABCB) is what unlocks better structure", correct: false, feedback: "Structural constraints are useful, but a perfect ABCB rhyme scheme can still be completely generic without identity context. Structure without identity is just scaffolding.", wrongFeedback: "Structural constraints are useful, but a perfect ABCB rhyme scheme can still be completely generic without identity context. Structure without identity is just scaffolding.",
          wrongStoryText: "Jake reads the neatly rhymed verse aloud. Technically clean. Completely forgettable. 'Structure,' he says, 'is not a soul.'", },
          ],
        },
        {
          npcLine: "Same tool. Same AI. Different conductor. That's the whole story.",
          question: "Jake and a classmate with no music training both use the same AI tool for the same task. Jake consistently gets output that sounds like a real band with a real emotional arc. His classmate gets competent but generic results. What explains the gap?",
          choices: [
            { label: "A", text: "Jake types faster and submits more prompts per session", correct: false, feedback: "Volume of prompting doesn't close this gap. A classmate who submits 1,000 prompts without knowing what a good bridge needs still can't identify what's missing.", wrongFeedback: "Volume of prompting doesn't close this gap. A classmate who submits 1,000 prompts without knowing what a good bridge needs still can't identify what's missing.",
          wrongStoryText: "Jake watches his classmate spam the interface. The AI responds dutifully — and generically. Jake types four words about tension. The room shifts.", },
            { label: "B", text: "Jake's years of musical training give him vocabulary to describe exactly what he needs — texture, tension, arc, dynamics — while a non-expert can only say 'make it better'", correct: true, feedback: "THIS IS THE ENTIRE GAME. Expertise becomes the vocabulary you conduct with. Jake hears what's missing and names it precisely. That gap in description IS the gap in output. Expertise × AI = force multiplication." },
            { label: "C", text: "Jake uses longer, more detailed prompts than his classmate", correct: false, feedback: "Precision, not length. A 10-word prompt from someone who knows exactly what they need beats a 200-word prompt from someone who doesn't know what they're listening for.", wrongFeedback: "Precision, not length. A 10-word prompt from someone who knows exactly what they need beats a 200-word prompt from someone who doesn't know what they're listening for.",
          wrongStoryText: "Jake's classmate submits a paragraph. Jake submits a sentence. The AI returns something alive. His classmate stares, confused. The words were right. The knowledge wasn't.", },
            { label: "D", text: "The AI performs better for musicians because it was trained primarily on music", correct: false, feedback: "The AI responds to precision and specificity of input, not the identity of who is typing. Jake's results are better because his prompts are better — because he hears what the music needs and can say it.", wrongFeedback: "The AI responds to precision and specificity of input, not the identity of who is typing. Jake's results are better because his prompts are better — because he hears what the music needs and can say it.",
          wrongStoryText: "Jake shakes his head. The AI doesn't know who's typing. It only knows what it receives. His training shaped the message. The message shaped the music.", },
          ],
        },
      ],
      xpAward: 150,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 14 — REVELATION
    // Hits differently now. The player has earned this.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s14",
      type: "revelation",
      revealText:
        "You were never just a guitarist. You were always a conductor waiting for an orchestra to arrive. The night it gave you elevator music — that wasn't failure. That was the question forming. Every prompting spiral, every hollow AI output, every moment you heard the gap between what you wanted and what you got — you were training your ear for this. The AI didn't change. You did. Jake sets down his guitar. Opens the interface. Types with the precision of someone who knows exactly what he hears in his head. The composition that's lived there for three years? It's finally time. The orchestra is ready. So is the conductor.",
      xpAward: 200,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 15 — AI COMPARE: Claude vs ChatGPT for Creative Work
    // Players learn which tool actually wins at nuanced, expressive output.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s15",
      type: "ai-compare",
      character: "Jake",
      location: "PRACTICE ROOM · AFTER HOURS",
      xpAward: 75,
      aiCompare: {
        models: ["claude", "chatgpt"],
        headline: "Claude vs ChatGPT — Same Prompt, Different Soul",
        context: "Jake ran the same emotional music prompt through both. He expected a coin flip. What he got was a lesson in which AI was built to actually understand nuance.",
        rows: [
          {
            dimension: "Creative Writing & Lyrics",
            winner: "Claude",
            claude:  "Preserves emotional texture, specific imagery, resists cliché",
            chatgpt: "Competent, clear, leans toward familiar patterns",
            note: "Claude was trained to understand nuance in creative tasks — it treats 'sad' as a question, not an answer.",
          },
          {
            dimension: "Following Complex Constraints",
            winner: "Claude",
            claude:  "Holds multiple rules simultaneously — tone + format + what to avoid",
            chatgpt: "Handles constraints but may drop subtle ones under complexity",
            note: "Jake's best prompts have 5–6 simultaneous requirements. Claude rarely drops one.",
          },
          {
            dimension: "Long-Form Story Consistency",
            winner: "Claude",
            claude:  "Maintains character voice and narrative arc across thousands of words",
            chatgpt: "Good for shorter pieces; voice can drift in longer work",
            note: "For a full EP narrative or album concept, Claude sustains the through-line.",
          },
          {
            dimension: "Speed & Availability",
            winner: "ChatGPT",
            claude:  "Slightly slower — processing nuanced context takes time",
            chatgpt: "Faster responses, more infrastructure redundancy globally",
            note: "When you need 50 first drafts in 20 minutes, speed wins. For ONE piece that matters, take the extra second.",
          },
          {
            dimension: "Broad Knowledge & Search",
            winner: "ChatGPT",
            claude:  "Deep reasoning but limited live web access",
            chatgpt: "GPT-4o browses the web by default — great for current facts",
            note: "Researching a band's current tour dates? ChatGPT has live access. Writing their song? Use Claude.",
          },
        ],
        verdict: "For the work Jake does — emotionally specific creative output that has to sound like a real human wrote it — Claude is the sharper instrument. But a smart musician knows when to switch tools.",
        question: "Jake needs to write liner notes for an EP — each song's emotional journey in 3 vivid paragraphs. Which AI is the better choice?",
        choices: [
          {
            label: "A",
            text: "Claude — better at sustaining emotional nuance across long creative pieces",
            correct: true,
            feedback: "Exactly. Liner notes are creative writing that must carry emotional weight across multiple distinct sections without going generic. That's Claude's specialty — it holds the feeling without drifting into cliché.",
          },
          {
            label: "B",
            text: "ChatGPT — faster output and wider knowledge base",
            correct: false,
            feedback: "Speed matters for volume tasks. But liner notes aren't a volume task — they're the emotional soul of the album. This is where Claude's nuanced creative output earns its keep.",
            wrongFeedback: "Speed matters for volume tasks. But liner notes aren't a volume task — they're the emotional soul of the album. This is where Claude's nuanced creative output earns its keep.",
          wrongStoryText: "Jake selects ChatGPT. The notes arrive fast — clean, correct, hollow. He reads them twice. Nothing moves. The album deserved more than efficiency.",
          },
          {
            label: "C",
            text: "Either one — they're basically the same for writing tasks",
            correct: false,
            feedback: "They're not the same. Run the same emotionally complex creative prompt through both. The difference shows up immediately in how each handles the gap between 'technically correct' and 'actually moving.'",
            wrongFeedback: "They're not the same. Run the same emotionally complex creative prompt through both. The difference shows up immediately in how each handles the gap between 'technically correct' and 'actually moving.'",
          wrongStoryText: "Jake shrugs and picks randomly. The output is fine. But 'fine' sits wrong with him. He'd heard what this album could say. This wasn't it.",
          },
        ],
      },
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 16 — HANDOFF: Jake introduces Zoe + Game 2
    // The visual novel moment that bridges the gap to the next character.
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: "w1v2-s16",
      type: "handoff",
      character: "Jake",
      location: "PRACTICE ROOM · LATE NIGHT",
      xpAward: 0,
      dialogue: [
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "So — now you know. Same tool. Different conductor. That's the whole story.",
        },
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "But I kept wondering: how does the AI actually know what to say? What's happening inside?",
        },
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "I met a drummer named Zoe at the showcase who was obsessed with that question.",
        },
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "She researched the real mechanism under the hood. What she found makes our work make perfect sense.",
        },
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "Ready to see what's happening under the hood? Once you know, you'll never prompt the same way.",
        },
      ],
    },

  ],
}
