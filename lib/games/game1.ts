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
  characterName:  "Jake",
  characterRole:  "17-year-old guitarist",
  characterBlurb: "A teenage guitarist who discovers AI is his greatest instrument yet",
  characterImage:   "/images/guitarplayer1.png",
  maestroImage:     "/images/maestroplayer1.png",
  maestroLine:      "The last time he was just a guitarist...",
  maestroSubline:   "Jake's story is just beginning. The orchestra awaits.",
  introVideo:       "/videos/jake-confession.mp4",
  protagonistVideo: "/videos/JakeRocking.mp4",
  intro: {
    sceneImage: "/images/jakebedroom.png",
    noteOrigin: { bottom: "38%", left: "54%" },
    beats: [
      { type: "location",  text: "BEDROOM · TUESDAY · 11:47 PM" },
      { type: "narration", text: "Three hours a day. Every single day. Jake lived inside the notes." },
      { type: "dialogue",  speaker: "Tyler", text: "I made an entire EP this weekend with AI. While you were tabbing that one riff. For the third week." },
      { type: "final",     text: "The world changed while he was perfecting the riff. But perfection has its own kind of power." },
    ],
  },
  scenes: [

    // ── LEARN 1: What AI Actually Is ─────────────────────────────────────────
    {
      id: "w1-learn-1",
      type: "learn",
      location: "BEDROOM · TUESDAY · 11:40 PM",
      concept: {
        title: "WHAT AI ACTUALLY IS",
        body: "AI is not magic. It's not a search engine. It's not a brain. It's a prediction engine — trained on billions of examples of human writing, it learned to predict what words should come next given any starting point. That's it. Which means: what you give it determines everything it gives back.",
      },
      scenarioText: "Jake plugged in his guitar and typed 'write me a song' — and got elevator music. AI is an amp: it makes your signal bigger, not better. Give it nothing specific, and you'll hear the average of every song ever written.",
      learnHighlight: "AI amplifies your input. Garbage in, garbage out — but brilliance in, something remarkable out.",
      xpAward: 25,
    },

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

    // ── LEARN 2: Why Most People Get Mediocre Results ────────────────────────
    {
      id: "w1-learn-2",
      type: "learn",
      location: "SCHOOL HALLWAY · WEDNESDAY · 8:10 AM",
      concept: {
        title: "WHY MOST PEOPLE GET MEDIOCRE RESULTS",
        body: "The single biggest reason AI disappoints people isn't the AI — it's a prompting quality problem. Most people type what they want in the fewest words possible, get a generic result, and conclude the tool doesn't work. The professionals getting remarkable results are writing prompts with context, constraints, and purpose.",
      },
      scenarioText: "Tyler's first 50 AI tracks were garbage — he just never told Jake that part. The difference between his viral hit and the throwaway wasn't the tool: it was how precisely he described what he needed.",
      learnHighlight: "Your prompting skill is the ceiling of your AI output. Raise the ceiling by raising the detail.",
      xpAward: 25,
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

    // ── LEARN 3: The Garbage In Garbage Out Principle ───────────────────────
    {
      id: "w1-learn-3",
      type: "learn",
      location: "MUSIC CLASS · WEDNESDAY · 3:15 PM",
      concept: {
        title: "RICHNESS IN, RICHNESS OUT",
        body: "Every AI output is downstream of your input. Not metaphorically — literally. The model predicts the most likely continuation of exactly what you gave it. Give it vague, get generic. Give it precise and emotional, get something that might actually move people.",
      },
      scenarioText: "Señora Vega called it 'prompt poverty' — Jake winced because he'd done it that morning. Jake's years knowing tension, release, and dynamics aren't obsolete now; they're the raw material AI can't generate on its own.",
      learnHighlight: "The richer your input, the richer your output. Your expertise is the raw material AI can't generate on its own.",
      xpAward: 25,
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

    // ── SCENE 6 (BOSS — 5-punch battle) ──────────────────────────────────────
    {
      id: "w1-s6",
      type: "boss",
      character: "Jake",
      location: "PRACTICE ROOM · FRIDAY · 2:14 AM",
      dialogue: [
        { speaker: "Jake", avatar: "jake" as const, text: "Two weeks of experiments. Three hours every night. I've filled an entire notebook with what works and what doesn't." },
        { speaker: "AI",   avatar: "npc" as const, npcKey: "ai" as const, text: "Ready for your next prompt." },
        { speaker: "Jake", avatar: "jake" as const, text: "A fingerstyle piece in Am. 68 BPM. The grief of watching someone you love choose to leave. The suspended chord never resolves." },
        { speaker: "AI",   avatar: "npc" as const, npcKey: "ai" as const, text: "Composing..." },
        { speaker: "Jake", avatar: "jake" as const, text: "This is... exactly what I hear in my head. Not because the AI changed. Because I learned how to direct it." },
        { speaker: "AI",   avatar: "npc" as const, npcKey: "ai" as const, text: "Your musical expertise is your advantage. A beginner says 'make it good.' You describe exact texture, tension, and arc." },
        { speaker: "Jake", avatar: "jake" as const, text: "Wait... I'm not playing the notes anymore. I'm directing them. I'm the conductor." },
      ],
      bossQuestions: [
        // ── Round 1: The Orchestra Without a Conductor ──────────────────────
        {
          npcLine: "Just type 'write me a song' — you're done in five minutes.",
          question: "Tyler has made 50 AI tracks this month. Most are technically fine but interchangeable — no distinct voice, no specific emotion. They could be from any band, any decade. What single change would unlock dramatically different output?",
          choices: [
            {
              label: "A",
              text: "Switch to a more powerful AI model",
              correct: false,
              feedback: "A better instrument doesn't play itself. The bottleneck was never the tool — it's the direction. Give the same model specific direction and everything changes.",
              wrongFeedback: "A better instrument doesn't play itself. The bottleneck was never the tool — it's the direction. Give the same model specific direction and everything changes.",
            },
            {
              label: "B",
              text: "Inject specific musical identity, emotional intent, and constraints into every prompt",
              correct: true,
              feedback: "Exactly. Generic input produces the average of everything the AI has ever learned. The moment you add who is speaking, what they feel, and what they won't do — the output collapses from infinite to specific.",
            },
            {
              label: "C",
              text: "Use AI for beats only and write everything else by hand",
              correct: false,
              feedback: "Compartmentalizing doesn't solve the root problem. Precision in any prompt — beats, lyrics, arrangement — is what separates generic from specific. The skill transfers everywhere.",
              wrongFeedback: "Compartmentalizing doesn't solve the root problem. Precision in any prompt — beats, lyrics, arrangement — is what separates generic from specific. The skill transfers everywhere.",
            },
            {
              label: "D",
              text: "Hire a professional songwriter to review and improve the output",
              correct: false,
              feedback: "Post-production can polish edges, but it can't add the specificity that was never in the prompt. Fix the input, not just the output.",
              wrongFeedback: "Post-production can polish edges, but it can't add the specificity that was never in the prompt. Fix the input, not just the output.",
            },
          ],
        },
        // ── Round 2: The Emotion Gap ────────────────────────────────────────
        {
          npcLine: "The AI mirrors its conductor. Emotional depth must come from your instructions.",
          question: "Señora Vega plays an AI string quartet prompted with 'write a sad piece.' It's technically flawless — and emotionally hollow. Jake hears it immediately: 'like a robot trying to cry.' What would have produced something genuinely moving?",
          choices: [
            {
              label: "A",
              text: "Use an AI model specifically trained on emotional music",
              correct: false,
              feedback: "The same model that produced this hollow piece can produce something devastating. The gap is never in the model — it's in what you asked for.",
              wrongFeedback: "The same model that produced this hollow piece can produce something devastating. The gap is never in the model — it's in what you asked for.",
            },
            {
              label: "B",
              text: "Ask the AI to 'try harder' or 'make it sadder'",
              correct: false,
              feedback: "Vague refinement produces vague improvement. 'Sadder' is still an average of every sad piece ever written. The specific grief of a specific moment is what actually moves people.",
              wrongFeedback: "Vague refinement produces vague improvement. 'Sadder' is still an average of every sad piece ever written. The specific grief of a specific moment is what actually moves people.",
            },
            {
              label: "C",
              text: "Describe the exact emotional texture — whose grief, what moment, what feeling refuses to resolve",
              correct: true,
              feedback: "'Sad string quartet' lets AI average every sad piece it's ever seen. 'The grief of watching someone you love choose to leave — the chord that reaches but never resolves' — that's a specific human experience, not a genre. Specificity is the only path to genuine emotion.",
            },
            {
              label: "D",
              text: "Add precise technical details: tempo, key signature, instrument articulations",
              correct: false,
              feedback: "Technical specificity helps, but it's not what moves people. A perfect Am piece at 68 BPM can still be emotionally hollow. Emotional specificity — the story behind the sound — is what transforms technique into feeling.",
              wrongFeedback: "Technical specificity helps, but it's not what moves people. A perfect Am piece at 68 BPM can still be emotionally hollow. Emotional specificity — the story behind the sound — is what transforms technique into feeling.",
            },
          ],
        },
        // ── Round 3: Fast vs. Deep ──────────────────────────────────────────
        {
          question: "Tyler made a track in an afternoon that went viral. Jake spent a week on a track that got licensed for a film score. A producer compares their approaches. What's the most likely difference in how they used AI?",
          choices: [
            {
              label: "A",
              text: "Jake paid for a higher-tier AI subscription",
              correct: false,
              feedback: "The tool is identical. The conductor is different.",
              wrongFeedback: "The tool is identical. The conductor is different.",
            },
            {
              label: "B",
              text: "Jake got lucky with a client who values slower production",
              correct: false,
              feedback: "Film licensing selects for the quality and distinctiveness of the work, not the production timeline. Something caught the music supervisor's ear.",
              wrongFeedback: "Film licensing selects for the quality and distinctiveness of the work, not the production timeline. Something caught the music supervisor's ear.",
            },
            {
              label: "C",
              text: "Tyler optimized for speed; Jake applied deep musical knowledge to produce something too specific to be ignored",
              correct: true,
              feedback: "Speed is the floor of AI value — Tyler found it fast. The ceiling is what happens when years of domain expertise become the language you use to direct the AI with precision. Jake went looking for the ceiling.",
            },
            {
              label: "D",
              text: "Tyler's approach will eventually catch up once AI improves",
              correct: false,
              feedback: "Better AI doesn't change the fundamental principle — more powerful instruments still don't conduct themselves. Whatever direction you give a stronger model, you get more of. The conductor is still essential.",
              wrongFeedback: "Better AI doesn't change the fundamental principle — more powerful instruments still don't conduct themselves. Whatever direction you give a stronger model, you get more of. The conductor is still essential.",
            },
          ],
        },
        // ── Round 4: Context Is Your Score ─────────────────────────────────
        {
          question: "Jake runs two prompts for the same song verse. Prompt 1: 'Write a verse about heartbreak for my punk band.' Prompt 2: 'Write a verse for a 17-year-old guitarist in a punk band — his ex started a rival band, tone: bitter but still in love, rhyme ABCB, no clichés.' Why is Prompt 2 exponentially more powerful?",
          choices: [
            {
              label: "A",
              text: "Prompt 2 is longer, so the AI 'tries harder'",
              correct: false,
              feedback: "Length is irrelevant. A longer vague prompt still produces vague output. It's not effort — it's information. Relevance beats volume.",
              wrongFeedback: "Length is irrelevant. A longer vague prompt still produces vague output. It's not effort — it's information. Relevance beats volume.",
            },
            {
              label: "B",
              text: "The 'avoid clichés' constraint is the critical element",
              correct: false,
              feedback: "Negative constraints help, but they're not the primary driver. The bigger shift is giving Jake's identity, the specific emotional situation, and the tone — that context is what tells AI which world to write from.",
              wrongFeedback: "Negative constraints help, but they're not the primary driver. The bigger shift is giving Jake's identity, the specific emotional situation, and the tone — that context is what tells AI which world to write from.",
            },
            {
              label: "C",
              text: "Context tells AI which world to write from — collapsing infinite possibilities down to exactly the right one",
              correct: true,
              feedback: "Without context, 'heartbreak' could be a thousand songs from a thousand voices. With context, there is only one song — Jake's. The moment the AI knows who is speaking and from what wound, it stops averaging and starts channeling.",
            },
            {
              label: "D",
              text: "The specific rhyme scheme (ABCB) is what unlocks better structure",
              correct: false,
              feedback: "Structural constraints are useful, but a perfect ABCB rhyme scheme can still be completely generic if there's no context about who is singing it and why. Structure without identity is just scaffolding.",
              wrongFeedback: "Structural constraints are useful, but a perfect ABCB rhyme scheme can still be completely generic if there's no context about who is singing it and why. Structure without identity is just scaffolding.",
            },
          ],
        },
        // ── Round 5: Expertise × AI = Force Multiplication ─────────────────
        {
          npcLine: "Wait... I'm not playing the notes anymore. I'm directing them. I'm the conductor.",
          question: "Jake and a classmate with no music training both use the same AI tool for the same task. Jake consistently gets output that sounds like a real band with a real emotional arc. His classmate gets competent but generic results. What explains the gap?",
          choices: [
            {
              label: "A",
              text: "Jake types faster and submits more prompts per session",
              correct: false,
              feedback: "Volume of prompting doesn't close this gap. A classmate who submits 1,000 prompts without knowing what a good bridge needs still can't identify what's missing — or ask for it precisely.",
              wrongFeedback: "Volume of prompting doesn't close this gap. A classmate who submits 1,000 prompts without knowing what a good bridge needs still can't identify what's missing — or ask for it precisely.",
            },
            {
              label: "B",
              text: "Jake's years of musical training give him the vocabulary to describe exactly what he needs — texture, tension, arc, dynamics — while a non-expert can only say 'make it better'",
              correct: true,
              feedback: "THIS IS THE ENTIRE GAME. Expertise becomes the vocabulary you conduct with. Jake hears what's missing and can name it precisely — 'too much reverb on the bridge, the tension never releases at the peak.' That gap in description is the gap in output. Expertise × AI = force multiplication.",
            },
            {
              label: "C",
              text: "Jake uses longer, more detailed prompts than his classmate",
              correct: false,
              feedback: "Precision, not length. A 10-word prompt from someone who knows exactly what they need beats a 200-word prompt from someone who doesn't know what they're listening for.",
              wrongFeedback: "Precision, not length. A 10-word prompt from someone who knows exactly what they need beats a 200-word prompt from someone who doesn't know what they're listening for.",
            },
            {
              label: "D",
              text: "The AI performs better for musicians because it was trained primarily on music data",
              correct: false,
              feedback: "The AI responds to the precision and specificity of the input, not the identity of who is typing. Jake's results are better because his prompts are better — because he hears what the music needs and can say it.",
              wrongFeedback: "The AI responds to the precision and specificity of the input, not the identity of who is typing. Jake's results are better because his prompts are better — because he hears what the music needs and can say it.",
            },
          ],
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
