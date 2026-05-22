import { Game } from "./types"

export const game8: Game = {
  slug: "chatgpt-mastery",
  week: 8,
  free: true,
  title: "ChatGPT — Beyond the Hype",
  emoji: "🤖",
  accentColor: "#19c37d",
  duration: "9 min",
  description:
    "Move past the basics of ChatGPT. Learn GPT-4o's real capabilities, how Custom GPTs work, what the Canvas editor unlocks, and when ChatGPT beats every other AI tool.",
  tagline: "Everyone's using it. Almost nobody's using it right.",
  characterName:  "Alex",
  characterRole:  "26-year-old content creator",
  characterBlurb: "A creator who moves past the hype to unlock ChatGPT's real capabilities",
  characterImage: "/images/alex.png",
  maestroImage:   "/images/maestro-alex.png",
  maestroLine:    "The last time he was just chasing the algorithm...",
  maestroSubline: "Alex creates on his terms now. The feed follows the conductor.",
  audioTrack:     "/audio/alex-sunlit-drafts.mp3",
  intro: {
    sceneImage: "/images/scene-alex.png",
    sceneColor: "#0a0806",
    noteOrigin: { bottom: "42%", left: "48%" },
    beats: [
      { type: "location",  text: "HOME STUDIO · SATURDAY · 1:48 AM" },
      { type: "narration", text: "The ring light was still on, the caption was still blank, and Alex had already missed the window where the algorithm rewards you." },
      { type: "dialogue",  speaker: "Brand Manager", text: "We're pausing the partnership, Alex. We found a creator who delivers a full content calendar in two days using AI. Same quality. We need that pace now." },
      { type: "final",     text: "The algorithm rewards output. The audience rewards truth. The conductor delivers both." },
    ],
  },
  scenes: [

    // ── SCENE 1 ──────────────────────────────────────────────────────────────
    {
      id: "w8-s1",
      type: "scenario",
      character: "Alex, 26",
      location: "COFFEE SHOP · SATURDAY · 2:15 PM",
      scenarioText:
        "Alex has used ChatGPT Plus almost every day for a year. Product descriptions, emails, caption drafts — always the same move: open a new chat, type the request, paste the result. Today, Mia pulls up her laptop and shows Alex the same tool producing something completely different. Same model. Completely different output. Alex stares at the screen like they've been playing chess with only the pawns.",
      npcLine: "How is your output so different from mine? It's the same ChatGPT Plus.",
      dialogue: [
        {
          speaker: "Alex",
          avatar: "jake" as const,
          text: "How is your output so different from mine? It's the same ChatGPT Plus.",
        },
        {
          speaker: "Mia",
          avatar: "npc" as const,
          npcKey: "default" as const,
          text: "Same model, different conductor. Look at what I told it before asking anything.",
        },
        {
          speaker: "Alex",
          avatar: "jake" as const,
          text: "You gave it a whole paragraph before you even asked the question. Who does that?",
        },
        {
          speaker: "Mia",
          avatar: "npc" as const,
          npcKey: "default" as const,
          text: "Everyone who wants it to sound like them and not like every other brand on the internet.",
        },
        {
          speaker: "Alex",
          avatar: "jake" as const,
          text: "So you gave it your brand voice, examples of your style, what to avoid... and then asked.",
        },
        {
          speaker: "Mia",
          avatar: "npc" as const,
          npcKey: "default" as const,
          text: "GPT-4o is a generalist. It can do almost anything — browse the web, analyse images, write code, generate images, have a voice conversation. But out of the box it's trained to please everyone. That means it pleases no one specifically.",
        },
        {
          speaker: "Alex",
          avatar: "jake" as const,
          text: "So I have to specialise it. Every time.",
        },
        {
          speaker: "Mia",
          avatar: "npc" as const,
          npcKey: "default" as const,
          text: "Or once — using a Custom GPT. But we'll get there.",
        },
      ],
      concept: {
        title: "GPT-4o Is a Generalist. You Have to Specialise It.",
        body: "GPT-4o's full capability set is genuinely remarkable: natural multi-turn conversation, image analysis (vision), code generation and debugging, real-time web browsing, DALL-E image creation, voice mode, and long-context document handling. But its default outputs are calibrated to be broadly acceptable — which means generically forgettable. The gap between average ChatGPT output and expert ChatGPT output isn't the model. It's the system context, examples, and constraints that specialise a generalist into exactly the collaborator you need.",
      },
      question:
        "What makes GPT-4o different from earlier versions of ChatGPT?",
      choices: [
        {
          label: "A",
          text: "It is exclusively a text model with no additional capabilities",
          correct: false,
          feedback:
            "GPT-4o is a multimodal model — it handles text, images, code, voice, and can browse the web and generate images via DALL-E. That 'o' stands for 'omni.'",
        },
        {
          label: "B",
          text: "It combines text, vision, voice, web browsing, code execution, and image generation in a single model",
          correct: true,
          feedback:
            "Exactly. GPT-4o unified capabilities that previously required switching between tools. The challenge isn't the capability — it's knowing how to direct each one with precision.",
        },
        {
          label: "C",
          text: "It automatically adjusts its style to match each user without any extra instructions",
          correct: false,
          feedback:
            "GPT-4o defaults to a broadly acceptable style — which is why two people using it identically get similar-sounding output. You have to specialise it deliberately.",
        },
        {
          label: "D",
          text: "It only works when connected to the internet",
          correct: false,
          feedback:
            "Web browsing is one optional capability. GPT-4o works across all its core functions without a live internet connection, though browsing requires it.",
        },
      ],
      xpAward: 100,
    },

    // ── SCENE 2 ──────────────────────────────────────────────────────────────
    {
      id: "w8-s2",
      type: "quiz",
      character: "Mia",
      location: "COFFEE SHOP · SATURDAY · 2:38 PM",
      scenarioText:
        "Mia opens her ChatGPT sidebar and shows Alex a list of named GPTs — Newsletter GPT, Caption Coach, Brand Voice, Interview Prep. Alex has never clicked the 'Explore GPTs' button in a year of daily use. Mia explains: a Custom GPT is not just a saved chat. It's a mini-application you build inside ChatGPT. You write persistent instructions that run before every conversation. You can upload knowledge files — your product docs, your writing samples, your SOPs. You define its name, its avatar, what it can do, and what it won't do. You can keep it private or publish it to the GPT Store for others to find.",
      npcLine:
        "Newsletter GPT writes every issue in my voice because I trained it on two years of my archives. Customer Support GPT knows our product better than any new hire. Interview Prep GPT has read every job description I've ever saved.",
      concept: {
        title: "Custom GPTs: Build Once, Use Forever.",
        body: "A Custom GPT is a persistent AI collaborator you configure once. Unlike a regular chat where you re-explain yourself every session, a Custom GPT holds your system instructions, knowledge files, and behavioural rules permanently. Real examples: Newsletter GPT (trained on your writing archive — matches your exact voice), Customer Support GPT (uploaded your product docs — handles tier-1 queries), Interview Prep GPT (loaded with job descriptions — challenges you with real questions). You build it in the GPT Builder with no code required. Keep it private or publish it to the GPT Store.",
      },
      question: "What is a Custom GPT most similar to?",
      choices: [
        {
          label: "A",
          text: "A saved conversation you can pick up where you left off",
          correct: false,
          feedback:
            "Saved conversations just resume context. A Custom GPT is a persistent application with pre-loaded instructions, knowledge, and rules that apply to every new conversation you start with it.",
        },
        {
          label: "B",
          text: "A purpose-built AI assistant trained once with your instructions and knowledge files",
          correct: true,
          feedback:
            "Exactly. A Custom GPT behaves consistently across every conversation because its instructions, knowledge files, and constraints are permanent — not re-typed each time. Build once, use forever.",
        },
        {
          label: "C",
          text: "A plugin that adds new capabilities ChatGPT doesn't have by default",
          correct: false,
          feedback:
            "Plugins (now largely replaced by GPT actions) connected external services. A Custom GPT primarily customises behaviour and knowledge — it works with ChatGPT's existing capabilities, not new ones.",
        },
        {
          label: "D",
          text: "A premium subscription tier that unlocks faster response times",
          correct: false,
          feedback:
            "Custom GPTs are available to ChatGPT Plus, Team, and Enterprise users. They're a configuration feature, not a billing tier — you build them inside the GPT Builder.",
        },
      ],
      xpAward: 150,
    },

    // ── SCENE 3 ──────────────────────────────────────────────────────────────
    {
      id: "w8-s3",
      type: "scenario",
      character: "Alex, 26",
      location: "HOME OFFICE · SUNDAY · 10:20 AM",
      scenarioText:
        "Alex is editing a brand article. The old workflow: paste into ChatGPT, ask for edits, copy the whole thing back, paste again for the next round. By iteration three, half the original document is buried in chat history and Alex has lost track of which version they're working from. Then Alex finds the Canvas button — a side-by-side editing mode that keeps the document on the right while the conversation stays on the left. Edit a section. Adjust the reading level. Make it shorter. Add headers. Convert to a Twitter thread. The document never disappears.",
      npcLine: "Why has this existed for months and no one told me?",
      dialogue: [
        {
          speaker: "Alex",
          avatar: "jake" as const,
          text: "Why has this existed for months and no one told me?",
        },
        {
          speaker: "Mia",
          avatar: "npc" as const,
          npcKey: "default" as const,
          text: "Because most people just use Chat mode out of habit. Canvas is buried unless you look for it.",
        },
        {
          speaker: "Alex",
          avatar: "jake" as const,
          text: "I can highlight a specific paragraph and ask ChatGPT to rewrite just that part. The rest stays.",
        },
        {
          speaker: "Mia",
          avatar: "npc" as const,
          npcKey: "default" as const,
          text: "And you can tell it to adjust reading level, shorten by 20%, punch up the opener, or turn the whole thing into a slide deck outline. All without losing your document.",
        },
        {
          speaker: "Alex",
          avatar: "jake" as const,
          text: "I've been copy-pasting like an idiot for a year.",
        },
        {
          speaker: "Mia",
          avatar: "npc" as const,
          npcKey: "default" as const,
          text: "To be fair — most people have.",
        },
      ],
      concept: {
        title: "Canvas: ChatGPT Finally Got a Document Editor.",
        body: "ChatGPT Canvas is a split-screen mode where your document lives persistently on the right while your conversation happens on the left. Key capabilities: highlight specific sections and ask for targeted rewrites, adjust reading level with a slider, shorten or expand selected passages, add formatting (headers, bullets, tables), convert content to different formats (email, thread, outline), and track changes across drafts. The document never collapses into a wall of chat. For anyone doing multi-draft content work, Canvas changes the fundamental workflow.",
      },
      question:
        "What problem does ChatGPT Canvas solve that regular chat doesn't?",
      choices: [
        {
          label: "A",
          text: "It makes ChatGPT responses significantly faster",
          correct: false,
          feedback:
            "Response speed is unrelated to Canvas mode. Canvas solves a workflow problem — keeping your document persistent and editable — not a speed problem.",
        },
        {
          label: "B",
          text: "It keeps your document persistent and editable alongside the conversation instead of buried in chat history",
          correct: true,
          feedback:
            "Precisely. In regular chat, every revision pastes a new wall of text that scrolls away. Canvas keeps the working document stable and lets you target specific sections — a completely different editing workflow.",
        },
        {
          label: "C",
          text: "It connects ChatGPT to Google Docs and Microsoft Word",
          correct: false,
          feedback:
            "Canvas is a native ChatGPT editing environment — it doesn't sync to external document editors. It's a self-contained workspace inside the ChatGPT interface.",
        },
        {
          label: "D",
          text: "It allows multiple team members to edit the same document simultaneously",
          correct: false,
          feedback:
            "Canvas is a single-user editing environment. Real-time collaboration is handled by tools like Google Docs — Canvas is for your own multi-draft iteration workflow with ChatGPT.",
        },
      ],
      xpAward: 100,
    },

    // ── SCENE 4 ──────────────────────────────────────────────────────────────
    {
      id: "w8-s4",
      type: "quiz",
      character: "Mia",
      location: "HOME OFFICE · SUNDAY · 11:05 AM",
      scenarioText:
        "Mia opens the Data Analysis feature in ChatGPT and drops in a CSV. Six months of sales data, 500 rows. Within seconds ChatGPT is running Python in a sandboxed environment — generating charts, calculating month-over-month trends, flagging anomalies, and producing a written summary with recommendations. No formulas. No pivot tables. No switching to Excel. Alex watches a tool they thought was a text chatbot build a full analytical report in four minutes.",
      npcLine:
        "It actually runs real code. Not simulated code — real Python, in a sandbox. It can read your files, crunch numbers, generate charts, and hand you back a report.",
      concept: {
        title: "Code Interpreter: ChatGPT as Your Data Analyst.",
        body: "ChatGPT's Code Interpreter (now called Data Analysis) runs actual Python code in a sandboxed environment. Upload a spreadsheet, a PDF, an image, or a dataset and it can: calculate descriptive statistics, generate charts and visualisations, identify trends and anomalies, clean and reformat messy data, merge multiple files, and produce written summary reports. It's not searching for an answer — it's writing and executing code to compute one. The output is a file you can download. This is one of the most underused capabilities in all of ChatGPT.",
      },
      question:
        "Alex uploads a 500-row sales CSV to ChatGPT. Which task can ChatGPT's Code Interpreter complete that regular chat cannot?",
      choices: [
        {
          label: "A",
          text: "Tell Alex which months had the highest sales by reading the file name",
          correct: false,
          feedback:
            "Reading a file name reveals nothing about its contents. Code Interpreter actually parses the data, runs calculations, and computes results — it doesn't guess from metadata.",
        },
        {
          label: "B",
          text: "Calculate month-over-month growth, flag anomalies, and generate a trend chart — by executing real Python on the data",
          correct: true,
          feedback:
            "Exactly. Code Interpreter doesn't hallucinate numbers — it writes and runs actual Python to compute them. The chart it generates is real. The statistics are calculated, not guessed.",
        },
        {
          label: "C",
          text: "Automatically share the analysis to a Google Sheets document",
          correct: false,
          feedback:
            "Code Interpreter runs in a sandbox and doesn't have live integrations with external apps. It produces downloadable files — charts, CSVs, reports — which you then use wherever you need.",
        },
        {
          label: "D",
          text: "Memorise the data and answer questions about it in all future conversations",
          correct: false,
          feedback:
            "ChatGPT does not retain file contents across conversations by default. Each session is fresh unless you use a Custom GPT with uploaded knowledge files or explicitly re-upload.",
        },
      ],
      xpAward: 150,
    },

    // ── SCENE 5b (PROMPT CHALLENGE) ──────────────────────────────────────────
    {
      id: "w8-s5b",
      type: "prompt",
      character: "Alex, 26",
      location: "HOME OFFICE · SUNDAY · 12:40 PM",
      promptChallenge: {
        context:
          "Alex has built a following writing about sustainable fashion. They want to create a Custom GPT that helps them write Instagram captions in their exact voice — conversational but informative, always ends with a question to drive comments, uses relevant hashtags, never sounds corporate or preachy. They have 10 example captions they have written that perfectly represent their style.",
        goal:
          "Write the system instructions Alex should give their Custom GPT so it captures their voice and writes captions they would actually post.",
        placeholder:
          "Write the Custom GPT instructions for Alex's sustainable fashion brand...",
      },
      xpAward: 150,
    },

    // ── SCENE 6 (BOSS) ───────────────────────────────────────────────────────
    {
      id: "w8-s6",
      type: "boss",
      character: "Alex, 26",
      location: "HOME OFFICE · SUNDAY · 2:00 PM",
      scenarioText:
        "Alex has spent the morning levelling up. Custom GPTs, Canvas, Code Interpreter, GPT-4o vision — the same interface they've opened every day for a year suddenly looks like a completely different tool. Mia calls it the Conductor Test: knowing not just what ChatGPT can do, but when it is definitively the right tool for the job. Time to prove it.",
      npcLine:
        "CONDUCTOR TEST. You know what it can do. Now show me you know when to use it.",
      question:
        "Which scenario gives ChatGPT the CLEAREST advantage over a basic Google search?",
      choices: [
        {
          label: "A",
          text: "Finding the current opening hours of a local restaurant",
          correct: false,
          feedback:
            "Real-time, location-specific factual lookups are where Google Search dominates. ChatGPT with browsing can do this, but it's slower and less reliable than a direct search. Use the right tool for the right job.",
        },
        {
          label: "B",
          text: "Looking up the definition of a legal term you don't recognise",
          correct: false,
          feedback:
            "A simple definition lookup is a retrieval task — Google Search, a legal dictionary, or Wikipedia handles this faster and more reliably. ChatGPT adds value when reasoning, synthesis, or computation is required.",
        },
        {
          label: "C",
          text: "Analysing a 200-row spreadsheet to find seasonal sales trends and generate a visual summary report",
          correct: true,
          feedback:
            "This is exactly where ChatGPT's Code Interpreter is unmatched. Google Search cannot execute code on your files, compute statistics, identify trends, or generate charts. ChatGPT runs real Python on your data and hands you a formatted report. No other free-tier tool comes close for this workflow.",
        },
        {
          label: "D",
          text: "Checking whether a specific product is in stock at a nearby retailer",
          correct: false,
          feedback:
            "Live inventory data requires a real-time connection to a retailer's system. Google Search or the retailer's own site is faster and more accurate. ChatGPT excels at reasoning and computation — not live inventory lookups.",
        },
      ],
      xpAward: 250,
    },

    // ── SCENE 7 (REVELATION) ─────────────────────────────────────────────────
    {
      id: "w8-s7",
      type: "revelation",
      revealText:
        "Alex spent a year asking a concert pianist to play 'Mary Had a Little Lamb.' This week, they finally asked for a sonata. The piano didn't change. The request did. Custom GPTs that work exactly like a trained team member. A Canvas editor that turns editing from chaos into craft. A Code Interpreter that makes data analysis something anyone can do. A GPT-4o that can see, speak, browse, and create — all from the same chat window. You now know how to make the request. Not the one that gets a paragraph back. The one that gets exactly what you needed — and sounds like you wrote it.",
      xpAward: 200,
    },
  ],
}
