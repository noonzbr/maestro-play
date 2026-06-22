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
  aiModel:  "chatgpt" as const,
  mondayPrompt: "Create a Custom GPT for [YOUR USE CASE]. Instructions to write: 'You are [specific role]. You know: [3-5 facts about your context]. You always: [3 behaviors]. You never: [3 constraints]. When asked [TRIGGER SCENARIO], you respond with: [specific format/approach].' Upload: [knowledge files]. Test it with: 'What would you do if [edge case scenario]?'",
  felipeOutroVideo:   "/videos/felipe-game8.mp4",
  nextGame: {
    slug:         "gemini-unlocked",
    character:    "Luna",
    teaserLine:   "Alex mastered ChatGPT's ecosystem. Now meet the AI that's built right inside your Google world. Luna found something in Gemini that changed her entire dissertation process.",
    previewImage: "/images/luna.png",
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
          wrongFeedback: "GPT-4o's 'o' stands for **Omni** — it unifies text, vision, voice, code, and image generation into one **multimodal** model, far beyond text alone.",
          wrongStoryText: "Alex blinks at Mia's screen. The console whispers: 'You've been using one pawn while a whole board waited.'",
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
          wrongFeedback: "GPT-4o defaults to a broad, neutral style — real differentiation comes from **deliberate prompting** and **system instructions**, not automatic personalisation.",
          wrongStoryText: "Alex leans back, humbled. The screen glows steadily: 'Same tool. Same output. The difference was always in the direction given.'",
        },
        {
          label: "D",
          text: "It only works when connected to the internet",
          correct: false,
          feedback:
            "Web browsing is one optional capability. GPT-4o works across all its core functions without a live internet connection, though browsing requires it.",
          wrongFeedback: "Web browsing is just one **optional capability** of GPT-4o — its core **multimodal functions** like vision, code, and voice work without a live internet connection.",
          wrongStoryText: "Alex frowns at the screen. Mia closes the browser tab. ChatGPT answers anyway — steady, unfazed, still fully alive.",
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
          wrongFeedback: "Saved chats only resume previous context; a **Custom GPT** is a persistent **mini-application** with pre-loaded instructions and knowledge files active from the very first message.",
          wrongStoryText: "Alex opens an old saved chat. It's just frozen history. Mia's Custom GPT hums to life — already knowing everything, ready before Alex types a word.",
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
          wrongFeedback: "**Custom GPTs** configure behaviour and inject knowledge — they work within existing capabilities, unlike **Actions**, which connect to external APIs and services.",
          wrongStoryText: "Alex clicks through menus hunting for a plugin. Mia points quietly to the GPT Builder. 'It was never about adding power,' she says. 'It was about focusing it.'",
        },
        {
          label: "D",
          text: "A premium subscription tier that unlocks faster response times",
          correct: false,
          feedback:
            "Custom GPTs are available to ChatGPT Plus, Team, and Enterprise users. They're a configuration feature, not a billing tier — you build them inside the GPT Builder.",
          wrongFeedback: "**Custom GPTs** are a **configuration feature** inside ChatGPT Plus — you build them using the **GPT Builder**, not by upgrading to a higher billing tier.",
          wrongStoryText: "Alex checks the subscription page twice, finding nothing new. Mia taps the Explore button instead. The GPT Builder opens — free of charge, waiting patiently.",
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
          wrongFeedback: "**Canvas** is a **persistent document workspace** — it solves version-loss and workflow fragmentation, not response latency or processing speed.",
          wrongStoryText: "Alex watches the timer. The response arrives at the same speed. Mia smiles: 'Canvas wasn't built to go faster — it was built so you never lose your place.'",
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
          wrongFeedback: "**Canvas** is a self-contained workspace inside ChatGPT — it doesn't sync with Google Docs or Word; it replaces the need to copy-paste between external editors.",
          wrongStoryText: "Alex reaches for the Google Docs tab out of habit. Mia closes it gently. 'Everything you need,' she says, 'is already on the right side of this screen.'",
        },
        {
          label: "D",
          text: "It allows multiple team members to edit the same document simultaneously",
          correct: false,
          feedback:
            "Canvas is a single-user editing environment. Real-time collaboration is handled by tools like Google Docs — Canvas is for your own multi-draft iteration workflow with ChatGPT.",
          wrongFeedback: "**Canvas** is a single-user **iterative editing environment** — real-time team collaboration belongs to tools like Google Docs, not this focused personal workspace.",
          wrongStoryText: "Alex looks around for a share button. There isn't one. The document glows quietly on the right — built for one focused mind, one clear draft at a time.",
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
          wrongFeedback: "**Code Interpreter** actually parses and executes real **Python** on your data — it reads file contents row by row, not metadata like a file name.",
          wrongStoryText: "Alex smirks at the file name: 'sales_final_v3.' ChatGPT ignores it entirely — already deep inside 500 rows, calculating truths the filename could never tell.",
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
          wrongFeedback: "**Code Interpreter** runs in an isolated **sandbox** — it creates downloadable files but has no live connection to external apps like Google Sheets.",
          wrongStoryText: "Alex frowns. The console reads: 'I can hand you the report — but I can't walk it over to Google for you.'",
        },
        {
          label: "D",
          text: "Memorise the data and answer questions about it in all future conversations",
          correct: false,
          feedback:
            "ChatGPT does not retain file contents across conversations by default. Each session is fresh unless you use a Custom GPT with uploaded knowledge files or explicitly re-upload.",
          wrongFeedback: "**Session Memory** isn't automatic — ChatGPT starts fresh each conversation, so your uploaded data doesn't persist without re-uploading or a **Custom GPT**.",
          wrongStoryText: "Alex pauses. The screen blinks: 'I analyzed it brilliantly — but tomorrow, I won't remember a single row.'",
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

    // ── NEAR-TRANSFER: Same Tool, Different Report ────────────────────────────
    {
      id:       "w8-near-transfer",
      type:     "learn",
      location: "HOME OFFICE · SUNDAY · 2:00 PM",
      xpAward:  0,
      concept: {
        title: "Same Tool. Different Report.",
        body:  "David, a junior data analyst, spent every Friday morning cleaning CSV exports, compiling sales trends, and formatting them into a PDF report for executives. It was a repetitive, three-hour chore. Instead of writing custom code manually, David built a Custom GPT called 'Sales Insight Engine' equipped with his team's specific KPI formulas. Now, he simply uploads the raw CSVs. The Custom GPT automatically cleans the data, runs the analysis, creates beautiful charts, and drafts the executive summary using his predefined business rules. David went from three hours of manual cleaning to three minutes of verification. Same ChatGPT. Completely different productivity.",
      },
      learnHighlight: "When you move beyond basic chat prompts and build custom tools with automated execution, you change the nature of your daily work.",
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
          wrongFeedback: "Real-time, location-specific lookups are a **retrieval task** — Google Search wins here. ChatGPT shines at **reasoning and synthesis**, not live local facts.",
          wrongStoryText: "Alex hesitates. Mia smiles quietly: 'You'd ask a conductor to find your keys? Use the right tool, Alex.'",
        },
        {
          label: "B",
          text: "Looking up the definition of a legal term you don't recognise",
          correct: false,
          feedback:
            "A simple definition lookup is a retrieval task — Google Search, a legal dictionary, or Wikipedia handles this faster and more reliably. ChatGPT adds value when reasoning, synthesis, or computation is required.",
          wrongFeedback: "Simple definitions are pure **retrieval** — a dictionary or Google handles this faster. ChatGPT's edge is **reasoning and synthesis**, not looking facts up.",
          wrongStoryText: "Alex winces. Mia taps the board: 'A scalpel is precise — but not for every cut. Know your tools.'",
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
          wrongFeedback: "Live inventory is **real-time external data** — ChatGPT can't access retailer systems. Use Google or the retailer's site; save ChatGPT for **computation and reasoning**.",
          wrongStoryText: "Alex shakes her head slowly. The screen pulses: 'I reason beautifully — but I can't see inside a warehouse.'",
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

    // ═══ AI COMPARE ══════════════════════════════════════════════════════════
    {
      id: "w8-compare",
      type: "ai-compare",
      character: "Alex",
      location: "STUDIO · LAPTOP OPEN",
      xpAward: 75,
      aiCompare: {
        models: ["chatgpt", "claude", "gemini"],
        headline: "ChatGPT vs Claude vs Gemini — For Content Creators",
        context: "Alex spent 30 days using all three for real content creation work. Videos, scripts, posts, graphics briefs, audience analysis. Here's the unfiltered comparison.",
        rows: [
          {
            dimension: "Custom GPTs & Specialized Tools",
            winner: "ChatGPT",
            claude:  "Custom instructions per Project; no GPT Store equivalent",
            chatgpt: "GPT Store: 3M+ custom GPTs for every niche use case",
            gemini:  "Gems: custom AI personas; smaller ecosystem than GPT Store",
            note: "Need a YouTube thumbnail critic or a TikTok script formatter? There's a Custom GPT for that.",
          },
          {
            dimension: "Visual Content & Image Analysis",
            winner: "ChatGPT",
            claude:  "Can analyze images; no image generation built-in",
            chatgpt: "DALL·E integrated — generate + analyze images in one session",
            gemini:  "Imagen integration for Google-powered generation",
            note: "Alex generates thumbnail concepts in the same chat she's scripting. ChatGPT's all-in-one wins.",
          },
          {
            dimension: "Long-Form Script Writing",
            winner: "Claude",
            claude:  "Maintains voice and narrative arc over thousands of words",
            chatgpt: "Good; voice can drift in very long outputs",
            gemini:  "Solid structure; research-heavy scripts are a strength",
            note: "A 20-minute documentary script needs a consistent narrator voice. Claude holds it.",
          },
          {
            dimension: "Data Analysis (Code Interpreter)",
            winner: "ChatGPT",
            claude:  "Strong data reasoning; no native code execution",
            chatgpt: "Code Interpreter runs Python — live charts, stats, pivot tables",
            gemini:  "Google Sheets integration; less flexible than Code Interpreter",
            note: "Alex analyzed her YouTube analytics directly in ChatGPT. No Excel needed.",
          },
          {
            dimension: "SEO & Trending Topics Research",
            winner: "ChatGPT",
            claude:  "Reasoning on existing knowledge; limited live data",
            chatgpt: "Browses live — current trends, competitor keywords, platform changes",
            gemini:  "Google Trends integration is a natural advantage",
            note: "Both ChatGPT and Gemini edge Claude here because content creators need LIVE data.",
          },
        ],
        verdict: "For content creators: ChatGPT's ecosystem (Custom GPTs, DALL·E, Code Interpreter, live browse) is the most complete creative toolbox. Claude for long-form quality. Gemini for Google-integrated research.",
        question: "Alex needs to analyze her last 6 months of YouTube analytics, create charts, and identify which video formats perform best. Which tool solves this end-to-end?",
        choices: [
          {
            label: "A",
            text: "Claude — strongest at data reasoning and pattern recognition",
            correct: false,
            feedback: "Claude reasons brilliantly about data — but it can't execute code or generate charts directly. Alex would need to describe the data manually rather than uploading her CSV and having it analyzed live. That's the key gap here.",
            wrongFeedback: "Claude reasons brilliantly about data — but it can't execute code or generate charts directly. Alex would need to describe the data manually rather than uploading her CSV and having it analyzed live. That's the key gap here.",
          wrongStoryText: "Alex uploads the file. Nothing runs. The terminal whispers: 'I can think about your data — but I can't touch it.'",
          },
          {
            label: "B",
            text: "ChatGPT with Code Interpreter — uploads the CSV, runs Python, generates charts live",
            correct: true,
            feedback: "Exactly. ChatGPT's Code Interpreter runs live Python in the chat window. Alex uploads her analytics export, asks for a bar chart of average view duration by video format, and gets a visual answer in seconds. This is the use case Code Interpreter was built for.",
          },
          {
            label: "C",
            text: "Gemini — Google Sheets integration handles the analysis",
            correct: false,
            feedback: "Gemini's Sheets integration is useful for Google-native workflows, but it's more about assisting within Sheets than running full analytical pipelines. For a full CSV-to-charts data session, ChatGPT's Code Interpreter has a more direct workflow.",
            wrongFeedback: "Gemini's Sheets integration is useful for Google-native workflows, but it's more about assisting within Sheets than running full analytical pipelines. For a full CSV-to-charts data session, ChatGPT's Code Interpreter has a more direct workflow.",
          wrongStoryText: "Alex waits. The Sheets cell blinks endlessly. Mia calls over: 'It helps inside the doc — it doesn't build the lab.'",
          },
        ],
      },
    },

    // ═══ HANDOFF ═════════════════════════════════════════════════════════════
    {
      id: "w8-handoff",
      type: "handoff",
      character: "Alex",
      location: "STUDIO · WRAPPING UP",
      xpAward: 0,
      dialogue: [
        {
          speaker: "Alex",
          avatar: "protagonist" as const,
          text: "You now know what ChatGPT actually is. Not the chat window — the whole platform. Custom GPTs, Canvas, Code Interpreter, image generation. Most creators never get past the chat window.",
        },
        {
          speaker: "Alex",
          avatar: "protagonist" as const,
          text: "But here's what I kept running into: every time I needed to research something current — trends, competitor data, live stats — I'd end up bouncing to Google anyway.",
        },
        {
          speaker: "Alex",
          avatar: "protagonist" as const,
          text: "There's a grad student — Luna — who solved this differently. She lives in the Google ecosystem. And she found that Gemini isn't just good at search. It's good at THINKING through massive amounts of research.",
        },
        {
          speaker: "Alex",
          avatar: "protagonist" as const,
          text: "She read her entire dissertation's worth of papers — like, all of them, at once — with Gemini's context window. Found connections that would have taken weeks manually.",
        },
        {
          speaker: "Alex",
          avatar: "protagonist" as const,
          text: "If you've ever had to wrangle a lot of information and find the signal in the noise — Luna's story is going to hit different.",
        },
      ],
    },

  ],
}
