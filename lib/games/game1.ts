import { Game } from "./types"

export const game1: Game = {
  slug: "welcome-to-ai",
  week: 1,
  free: true,
  title: "Welcome to the Exciting World of AI",
  emoji: "🎸",
  icon: "guitar" as const,
  duration: "8 min",
  description: "Follow Jake, a passionate 17-year-old guitarist, as he discovers that mastering AI is just like conducting an orchestra — and his musical instincts are his greatest weapon.",
  tagline: "Every maestro was once just a kid with a guitar.",
  scenes: [

    // ── SCENE 1 ──────────────────────────────────────────────────────────────
    {
      id: "w1-s1",
      type: "scenario",
      character: "Jake, 17",
      location: "BEDROOM · TUESDAY · 11:47 PM",
      scenarioText:
        "Jake plays guitar three hours every day, without exception. He hears melodies in his sleep and wakes up reaching for his fretboard. His bandmates have gone all-in on AI — generated beats, AI lyrics, entire EPs finished in a weekend. They think Jake is falling behind.",
      npcLine: "Dude. I made an entire EP this weekend with AI. While you were tabbing that one riff for the third week.",
      dialogue: [
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Dude. I made an entire EP this weekend with AI. While you were tabbing that one riff for the third week." },
        { speaker: "Jake",  avatar: "jake" as const, text: "It's a complex riff. The feeling has to be exactly right." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Just type 'write me a song' and you're done in five minutes. Try it." },
        { speaker: "Jake",  avatar: "jake" as const, text: "...okay. 'Write me a song.'" },
        { speaker: "Jake",  avatar: "jake" as const, text: "This is elevator music. Completely generic. No soul whatsoever." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Right. Because you told it nothing. AI is like an orchestra — every instrument ready, but zero direction." },
        { speaker: "Jake",  avatar: "jake" as const, text: "So I have to... conduct it?" },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Exactly. Tell it what you hear in your head. The more specific you are, the better the output." },
      ],
      concept: {
        title: "The Conductor Principle",
        body: "AI produces exactly what you describe — no more, no less. Like an orchestra without a conductor, it has all the instruments but no direction. Vague input gives vague output. Precision gives precision.",
      },
      question: "Jake types 'write me a song' into an AI. The result sounds like elevator music — technically fine, completely soulless. What went wrong?",
      choices: [
        {
          label: "A",
          text: "The AI isn't creative enough for real music",
          correct: false,
          feedback: "AI has composed pieces indistinguishable from human work. Creativity isn't the gap — direction is. Even a full orchestra sounds like noise without a conductor.",
        },
        {
          label: "B",
          text: "He needed a better, paid AI model",
          correct: false,
          feedback: "A Stradivarius in untrained hands still sounds like noise. The instrument is never the problem.",
        },
        {
          label: "C",
          text: "He gave vague instructions — AI performs to the clarity it's given",
          correct: true,
          feedback: "Exactly. 'Write me a song' is like telling an orchestra to 'play something.' But 'a fingerstyle piece in Am, quiet grief building to defiant resolution'? Now you're conducting.",
        },
        {
          label: "D",
          text: "AI only works for technical people, not musicians",
          correct: false,
          feedback: "Musicians are often the most powerful AI users — they understand emotion, texture, tension, and resolution with precision that most people lack.",
        },
      ],
      xpAward: 100,
    },

    // ── SCENE 2 (NEW) ────────────────────────────────────────────────────────
    {
      id: "w1-s2",
      type: "scenario",
      character: "Tyler",
      location: "SCHOOL HALLWAY · WEDNESDAY · 8:14 AM",
      dialogue: [
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Dude. 50,000 plays in two days. AI beat, AI mix, my vocals. Done in a Sunday afternoon." },
        { speaker: "Jake",  avatar: "jake" as const, text: "It's catchy. Has a hook. But it doesn't go anywhere — same four bars the whole way. No tension, no release." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "50K plays don't lie, man." },
        { speaker: "Jake",  avatar: "jake" as const, text: "I'm not saying it's bad. I'm saying — you used AI to go fast. What if you used it to go deeper?" },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Deeper how?" },
        { speaker: "Jake",  avatar: "jake" as const, text: "What if instead of 'write me a beat' you described the exact emotional arc? The tension points? Used everything you know about music?" },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "...I never thought about that. I just wanted it quick." },
        { speaker: "Jake",  avatar: "jake" as const, text: "Speed is the floor. I think depth is the ceiling." },
      ],
      concept: {
        title: "Fast vs. Deep",
        body: "Most people use AI to do things faster. The real power is using AI to go deeper — producing work of a quality and specificity that would have taken weeks before. Speed is the floor. Depth is the ceiling.",
      },
      question: "Tyler made a viral song in an afternoon using AI. Jake thinks Tyler is only using AI at 10% of its potential. What's the key distinction Jake is pointing to?",
      choices: [
        {
          label: "A",
          text: "Viral content proves Tyler's approach is better",
          correct: false,
          feedback: "Virality and depth are different metrics. Going viral with a shallow approach doesn't mean you've reached the ceiling of what's possible.",
        },
        {
          label: "B",
          text: "Tyler should switch to a different AI tool for better quality",
          correct: false,
          feedback: "The same tool that made a generic beat can produce something extraordinary. The gap is in how it's directed, not which tool you choose.",
        },
        {
          label: "C",
          text: "Using AI for speed is fine, but applying deep domain knowledge unlocks a completely different level of output",
          correct: true,
          feedback: "Speed is the minimum value of AI. The maximum comes when your deep knowledge — musical, technical, human — becomes the language you use to direct it precisely.",
        },
        {
          label: "D",
          text: "AI-generated music can never match the depth of human-created music",
          correct: false,
          feedback: "AI-directed by a skilled musician can produce genuinely moving work. The limit isn't the instrument — it's the conductor.",
        },
      ],
      xpAward: 100,
    },

    // ── SCENE 3 ──────────────────────────────────────────────────────────────
    {
      id: "w1-s3",
      type: "scenario",
      character: "Señora Vega",
      location: "MUSIC CLASS · WEDNESDAY · 3:21 PM",
      scenarioText:
        "Señora Vega plays an AI-composed string quartet for the class. Technically perfect — not one wrong note, ideal structure, textbook form. But Jake feels it immediately. Like a brilliant forgery. Every element correct, something essential absent. She notices his expression and calls on him.",
      npcLine: "Jake. You're making your 'something is wrong' face. Tell the class what you hear.",
      dialogue: [
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "Listen closely to this piece." },
        { speaker: "Jake",        avatar: "jake" as const, text: "It's technically perfect. Not one wrong note. But..." },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "Jake. You're making your 'something is wrong' face. Tell the class what you hear." },
        { speaker: "Jake",        avatar: "jake" as const, text: "It's hollow. Like a robot trying to cry. Every element correct — but there's nobody home." },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "Exactly right. This was AI given one instruction: 'write a sad string quartet.'" },
        { speaker: "Jake",        avatar: "jake" as const, text: "So the AI didn't know what KIND of sad. It just... guessed average sadness." },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "The AI mirrors its conductor. You are the feeling. It is the instrument. Emotional depth must come from your instructions." },
        { speaker: "Jake",        avatar: "jake" as const, text: "So if I told it 'the grief of watching someone choose to leave' — that's completely different." },
        { speaker: "Señora Vega", avatar: "npc" as const, npcKey: "senora_vega" as const, text: "Now you're conducting." },
      ],
      concept: {
        title: "Emotion Doesn't Come From the AI",
        body: "AI mirrors its conductor. Emotional depth, tension, and meaning must be injected through your instructions — the AI has processed millions of emotional works, but it has no feeling of its own. You are the feeling. It is the instrument.",
      },
      question: "Jake says the AI piece is 'technically perfect but hollow — like a robot trying to cry.' Why does AI-generated work often feel emotionally empty?",
      choices: [
        {
          label: "A",
          text: "AI fundamentally cannot understand emotion",
          correct: false,
          feedback: "AI has processed more emotional expression than any human could in a lifetime. The gap isn't understanding — it's the lack of specific emotional direction from the conductor.",
        },
        {
          label: "B",
          text: "The person using it didn't specify emotional intention, context, or purpose",
          correct: true,
          feedback: "'Sad song' vs. 'the specific grief of watching someone you love choose to leave, fingerstyle Am at 68 BPM with a suspended chord that never resolves' — completely different results.",
        },
        {
          label: "C",
          text: "AI music will always be inferior to human music",
          correct: false,
          feedback: "AI has already moved audiences to tears without them knowing it was AI. The limit isn't the instrument — it's the conductor.",
        },
        {
          label: "D",
          text: "Señora Vega should have used a better AI tool",
          correct: false,
          feedback: "The same AI that produced this hollow piece can produce something devastating with different instructions. The tool isn't the bottleneck.",
        },
      ],
      xpAward: 100,
    },

    // ── SCENE 4 (NEW) ────────────────────────────────────────────────────────
    {
      id: "w1-s4",
      type: "scenario",
      character: "Jake, 17",
      location: "JAKE'S ROOM · WEDNESDAY · 10:55 PM",
      dialogue: [
        { speaker: "Jake",  avatar: "jake" as const, text: "Okay. Let me actually try this right. Not just 'write me a song.'" },
        { speaker: "Jake",  avatar: "jake" as const, text: "Prompt one: 'Write a rock song about heartbreak.' Here we go..." },
        { speaker: "Jake",  avatar: "jake" as const, text: "Generic. Could be any band from any decade. No personality at all." },
        { speaker: "Jake",  avatar: "jake" as const, text: "Now with context. 'Write a verse for a 17-year-old guitarist in a punk band. His ex started a rival band. Tone: bitter but still in love. Rhyme scheme: ABCB. Avoid clichés like broken hearts or falling apart.'" },
        { speaker: "Jake",  avatar: "jake" as const, text: "...okay. THAT sounds like it could actually be us. The AI knew exactly what world to write from." },
        { speaker: "Jake",  avatar: "jake" as const, text: "The difference wasn't the AI. It was me telling it who I am, what I need, and what I don't want." },
      ],
      concept: {
        title: "Context Is Your Orchestra's Score",
        body: "Without context, AI guesses. With context — who you are, what you need, what to avoid, the world the output lives in — AI stops guessing and starts conducting. Context is the score every musician reads from.",
      },
      question: "Jake runs two prompts. The first — 'write a rock song about heartbreak' — is generic. The second adds who he is, the tone, the constraints, and what to avoid. Why does the second prompt produce dramatically better output?",
      choices: [
        {
          label: "A",
          text: "The second prompt used more words, so AI tried harder",
          correct: false,
          feedback: "Length isn't the key — relevance is. A longer vague prompt still produces vague output. It's the specificity and context that matter.",
        },
        {
          label: "B",
          text: "Context tells AI what world to write from — removing ambiguity collapses the output space to exactly what you need",
          correct: true,
          feedback: "Without context, AI averages across everything it knows. With context, it narrows to a specific voice, world, and purpose. That's the entire difference.",
        },
        {
          label: "C",
          text: "Adding a rhyme scheme is the most important part",
          correct: false,
          feedback: "The rhyme scheme is one small piece. The bigger shift was giving Jake's identity, the emotional situation, and the constraints — which together defined the whole world of the output.",
        },
        {
          label: "D",
          text: "Avoiding clichés is what made the second prompt work",
          correct: false,
          feedback: "Negative constraints help, but they're not the whole picture. The combination of who, what, tone, and what-not-to-do is what makes the context rich enough to produce precise output.",
        },
      ],
      xpAward: 100,
    },

    // ── SCENE 4b (PROMPT CHALLENGE) ──────────────────────────────────────────
    {
      id: "w1-s4b",
      type: "prompt",
      character: "Jake, 17",
      location: "BEDROOM · WEDNESDAY · 11:32 PM",
      promptChallenge: {
        context: "Jake has a song in his head that he's been trying to write for three weeks. An opening riff that captures the exact feeling of driving away from someone's house for the last time. City lights blurring through rain on the windshield. Numb. Not crying. Not yet. He's going to try asking the AI — but this time, the way Señora Vega described. With precision. With everything he knows about music.",
        goal: "Write Jake's prompt. Give the AI enough to create an opening guitar riff that sounds like that specific feeling.",
        placeholder: "Type Jake's prompt to the AI...",
      },
      xpAward: 150,
    },

    // ── SCENE 5 (NEW) ────────────────────────────────────────────────────────
    {
      id: "w1-s5",
      type: "scenario",
      character: "Tyler",
      location: "BAND PRACTICE · THURSDAY · 6:30 PM",
      dialogue: [
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "Alright Jake, show us this 'conducting' thing. Live. Right now." },
        { speaker: "Jake",  avatar: "jake" as const, text: "Fine. I'll start with what we know. 'Write a bridge for a punk song about feeling invisible at school.'" },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "It's okay. Not great." },
        { speaker: "Jake",  avatar: "jake" as const, text: "Right. Now watch. I add: 'Make it angrier. Shorter lines. No metaphors — direct statements. The character is done being patient.'" },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "...that actually hits. How'd you know to change those specific things?" },
        { speaker: "Jake",  avatar: "jake" as const, text: "Because I know what a good bridge feels like. The AI doesn't — I have to tell it what's missing." },
        { speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const, text: "So it's not about the first prompt. It's about knowing what to ask for next." },
        { speaker: "Jake",  avatar: "jake" as const, text: "Exactly. You don't write a song in one take. You don't get great AI output in one prompt either." },
      ],
      concept: {
        title: "Prompting Is Conversation, Not Command",
        body: "Great AI output rarely comes from a single prompt. It comes from a conversation — where you evaluate the output with your expert ear and refine your direction. Each round gets closer. Your ability to know what's missing is the skill.",
      },
      question: "Jake's first prompt produces okay output. His second — which adds specific refinements based on what was missing — produces something the band actually wants to play. What skill made the difference?",
      choices: [
        {
          label: "A",
          text: "Luck — the second prompt happened to be better",
          correct: false,
          feedback: "Jake knew exactly what was wrong with the first output: the anger was missing, the lines were too long, metaphors were softening it. That diagnosis came from musical expertise, not luck.",
        },
        {
          label: "B",
          text: "Writing longer and more detailed prompts every time",
          correct: false,
          feedback: "The second prompt wasn't necessarily longer — it was precisely targeted. Jake diagnosed what was missing and asked for exactly that. Precision beats length.",
        },
        {
          label: "C",
          text: "The ability to evaluate output with expert knowledge and identify exactly what to ask for next",
          correct: true,
          feedback: "This is the skill that separates expert AI conductors from everyone else. Your domain expertise lets you hear what's missing — and describe the fix. That feedback loop is where the magic happens.",
        },
        {
          label: "D",
          text: "Using AI in front of an audience makes it perform better",
          correct: false,
          feedback: "AI output quality is entirely determined by your input quality. The audience didn't change the prompt — Jake's musical judgment did.",
        },
      ],
      xpAward: 100,
    },

    // ── SCENE 6 (BOSS) ───────────────────────────────────────────────────────
    {
      id: "w1-s6",
      type: "boss",
      character: "Jake",
      location: "PRACTICE ROOM · FRIDAY · 2:14 AM",
      scenarioText:
        "Two weeks of experimenting. Three hours every night. Jake has filled a notebook with what works and what doesn't. Tonight, something shifts — the AI stops producing generic output and starts producing exactly what he hears in his head. Not because the AI changed. Because Jake did.",
      npcLine: "Wait... I'm not playing the notes anymore. I'm directing them. I'm the conductor.",
      dialogue: [
        { speaker: "Jake", avatar: "jake" as const, text: "Two weeks of experiments. Three hours every night. I've filled an entire notebook with what works and what doesn't." },
        { speaker: "AI",   avatar: "npc" as const, npcKey: "ai" as const, text: "Ready for your next prompt." },
        { speaker: "Jake", avatar: "jake" as const, text: "A fingerstyle piece in Am. 68 BPM. The grief of watching someone you love choose to leave. The suspended chord never resolves." },
        { speaker: "AI",   avatar: "npc" as const, npcKey: "ai" as const, text: "Composing..." },
        { speaker: "Jake", avatar: "jake" as const, text: "This is... exactly what I hear in my head. Not because the AI changed. Because I learned how to direct it." },
        { speaker: "AI",   avatar: "npc" as const, npcKey: "ai" as const, text: "Your musical expertise is your advantage. A beginner says 'make it good.' You describe exact texture, tension, and arc." },
        { speaker: "Jake", avatar: "jake" as const, text: "Wait... I'm not playing the notes anymore. I'm directing them. I'm the conductor." },
      ],
      concept: {
        title: "Expertise × AI = Force Multiplication",
        body: "Deep domain knowledge doesn't become obsolete with AI — it becomes a superpower. A musician can describe exactly the texture, tension, and arc of what they want. A beginner can only say 'make it good.' The gap in output is enormous.",
      },
      question: "Jake realizes his years of musical training — rhythm, tension, release, dynamics, emotional arc — aren't obsolete in the AI age. They've become his superpower. What did he understand that most people never do?",
      choices: [
        {
          label: "A",
          text: "That AI can now replace his need to practice guitar",
          correct: false,
          feedback: "His musical mastery became the vocabulary that lets him conduct AI with a precision no beginner can match. The instrument still matters — it becomes the language.",
        },
        {
          label: "B",
          text: "That deep expertise makes you a dramatically more powerful AI conductor",
          correct: true,
          feedback: "THIS IS THE ENTIRE GAME. A surgeon's clinical knowledge makes them a better medical AI user. A lawyer's case knowledge makes them better at legal AI. Jake's musical ear lets him conduct AI with extraordinary precision. Expertise × AI = force multiplication.",
        },
        {
          label: "C",
          text: "That he needs to learn programming to use AI properly",
          correct: false,
          feedback: "The most powerful AI users are domain experts — musicians, doctors, writers — who speak to AI in the precise language of their craft. Code is irrelevant.",
        },
        {
          label: "D",
          text: "That AI will make musicians obsolete within five years",
          correct: false,
          feedback: "Musicians who conduct AI become 10× more capable. But the conductor is still essential. The baton doesn't conduct itself.",
        },
      ],
      xpAward: 150,
    },

    // ── SCENE 7 (REVELATION) ─────────────────────────────────────────────────
    {
      id: "w1-s7",
      type: "revelation",
      revealText:
        "You were never just a guitarist. You were always a conductor waiting for an orchestra to arrive. The AI is your ensemble — a hundred instruments, ready to play exactly what you hear in your head. All you needed was to learn how to raise the baton. Jake sets down his guitar. Opens the AI interface. And for the first time, types with the precision of a conductor who knows exactly what he wants. The composition he's been hearing in his dreams for three years? It's finally time. The Maestro has arrived.",
      xpAward: 200,
    },
  ],
}
