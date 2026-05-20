import { Game } from "./types"

export const week1: Game = {
  slug: "welcome-to-ai",
  week: 1,
  free: true,
  title: "Welcome to the Exciting World of AI",
  emoji: "🎸",
  duration: "8 min",
  description: "Follow Jake, a passionate 17-year-old guitarist, as he discovers that mastering AI is just like conducting an orchestra — and his musical instincts are his greatest weapon.",
  tagline: "Every maestro was once just a kid with a guitar.",
  scenes: [
    {
      id: "w1-s1",
      type: "scenario",
      character: "Jake, 17",
      location: "BEDROOM · TUESDAY · 11:47 PM",
      scenarioText:
        "Jake plays guitar three hours every day, without exception. He hears melodies in his sleep and wakes up reaching for his fretboard. His bandmates have gone all-in on AI — generated beats, AI lyrics, entire EPs finished in a weekend. They think Jake is falling behind.",
      npcLine: "Dude. I made an entire EP this weekend with AI. While you were tabbing that one riff for the third week.",
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
          feedback:
            "AI has composed pieces indistinguishable from human work. Creativity isn't the gap — direction is. Even a full orchestra sounds like noise without a conductor.",
        },
        {
          label: "B",
          text: "He needed a better, paid AI model",
          correct: false,
          feedback:
            "A Stradivarius in untrained hands still sounds like noise. The instrument is never the problem.",
        },
        {
          label: "C",
          text: "He gave vague instructions — AI performs to the clarity it's given",
          correct: true,
          feedback:
            "Exactly. 'Write me a song' is like telling an orchestra to 'play something.' But 'a fingerstyle piece in Am, quiet grief building to defiant resolution'? Now you're conducting.",
        },
        {
          label: "D",
          text: "AI only works for technical people, not musicians",
          correct: false,
          feedback:
            "Musicians are often the most powerful AI users — they understand emotion, texture, tension, and resolution with precision that most people lack.",
        },
      ],
      xpAward: 150,
    },
    {
      id: "w1-s2",
      type: "scenario",
      character: "Señora Vega",
      location: "MUSIC CLASS · WEDNESDAY · 3:21 PM",
      scenarioText:
        "Señora Vega plays an AI-composed string quartet for the class. Technically perfect — not one wrong note, ideal structure, textbook form. But Jake feels it immediately. Like a brilliant forgery. Every element correct, something essential absent. She notices his expression and calls on him.",
      npcLine: "Jake. You're making your 'something is wrong' face. Tell the class what you hear.",
      concept: {
        title: "Emotion Doesn't Come From the AI",
        body: "AI mirrors its conductor. Emotional depth, tension, and meaning must be injected through your instructions — the AI has processed millions of emotional works, but it has no feeling of its own. You are the feeling. It is the instrument.",
      },
      question: "Jake says the piece is 'technically perfect but hollow — like a robot trying to cry.' Señora Vega nods. 'Exactly right.' Why does AI-generated work often feel emotionally empty?",
      choices: [
        {
          label: "A",
          text: "AI fundamentally cannot understand emotion",
          correct: false,
          feedback:
            "AI has processed more emotional expression than any human could in a lifetime. That's not the gap.",
        },
        {
          label: "B",
          text: "The person using it didn't specify emotional intention, context, or purpose",
          correct: true,
          feedback:
            "The AI mirrors its conductor. 'Sad song' vs. 'the specific grief of watching someone you love choose to leave, fingerstyle Am at 68 BPM with a suspended chord that never resolves' — completely different results.",
        },
        {
          label: "C",
          text: "AI music will always be inferior to human music",
          correct: false,
          feedback:
            "AI has already moved audiences to tears without them knowing it was AI. The limit isn't the instrument — it's the conductor.",
        },
        {
          label: "D",
          text: "Señora Vega should have used a better AI tool",
          correct: false,
          feedback:
            "The same AI that produced this hollow piece can produce something devastating with different instructions. The tool isn't the bottleneck.",
        },
      ],
      xpAward: 150,
    },
    {
      id: "w1-s3",
      type: "boss",
      character: "Jake",
      location: "PRACTICE ROOM · FRIDAY · 2:14 AM",
      scenarioText:
        "Two weeks of experimenting. Three hours every night. Jake has filled a notebook with what works and what doesn't. Tonight, something shifts — the AI stops producing generic output and starts producing exactly what he hears in his head. Not because the AI changed. Because Jake did.",
      npcLine: "Wait... I'm not playing the notes anymore. I'm directing them. I'm the conductor.",
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
          feedback:
            "His musical mastery became the vocabulary that lets him conduct AI with a precision no beginner can match. The instrument still matters — it becomes the language.",
        },
        {
          label: "B",
          text: "That deep expertise makes you a dramatically more powerful AI conductor",
          correct: true,
          feedback:
            "THIS IS THE ENTIRE GAME. A surgeon's clinical knowledge makes them a better medical AI user. A lawyer's case knowledge makes them better at legal AI. Jake's musical ear lets him conduct AI with extraordinary precision. Expertise × AI = force multiplication.",
        },
        {
          label: "C",
          text: "That he needs to learn programming to use AI properly",
          correct: false,
          feedback:
            "The most powerful AI users are domain experts — musicians, doctors, writers — who speak to AI in the precise language of their craft. Code is irrelevant.",
        },
        {
          label: "D",
          text: "That AI will make musicians obsolete within five years",
          correct: false,
          feedback:
            "Musicians who conduct AI become 10× more capable. But the conductor is still essential. The baton doesn't conduct itself.",
        },
      ],
      xpAward: 150,
    },
    {
      id: "w1-s4",
      type: "revelation",
      revealText:
        "You were never just a guitarist. You were always a conductor waiting for an orchestra to arrive. The AI is your ensemble — a hundred instruments, ready to play exactly what you hear in your head. All you needed was to learn how to raise the baton. Jake sets down his guitar. Opens the AI interface. And for the first time, types with the precision of a conductor who knows exactly what he wants. The composition he's been hearing in his dreams for three years? It's finally time. The Maestro has arrived.",
      xpAward: 200,
    },
  ],
}
