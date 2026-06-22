import { Game } from "./types"

export const game9: Game = {
  slug: "gemini-unlocked",
  week: 9,
  free: true,
  title: "Gemini — Google's AI, Fully Unleashed",
  emoji: "🔮",
  accentColor: "#8ab4f8",
  duration: "8 min",
  description:
    "Learn how Gemini integrates with your entire Google life — Gmail, Docs, Sheets, Drive — and why its massive context window changes everything for deep research.",
  tagline: "If you live in Google, Gemini lives there too.",
  characterName:  "Luna",
  characterRole:  "21-year-old grad student",
  characterBlurb: "A researcher who uses Gemini to work at the speed of thought",
  characterImage: "/images/luna.png",
  maestroImage:   "/images/maestro-luna.png",
  audioTrack:     "/audio/concrete-riot.mp3",
  intro: {
    sceneImage: "/images/scene-luna.png",
    sceneColor: "#060808",
    noteOrigin: { bottom: "42%", left: "48%" },
    beats: [
      { type: "location",  text: "UNIVERSITY LIBRARY · THURSDAY · 12:53 AM" },
      { type: "narration", text: "Fifteen browser tabs, three contradicting papers, and a chapter due in two weeks — Luna's research felt like trying to drink from a river." },
      { type: "dialogue",  speaker: "Prof. Chen", text: "Your classmate submitted her literature review yesterday. Forty sources, cross-referenced, argument gaps flagged. She used Gemini. Luna, how long have you been on your first draft?" },
      { type: "final",     text: "Intelligence was never the bottleneck. Knowing where to look always was." },
    ],
  },
  aiModel:  "gemini" as const,
  mondayPrompt: "In Gemini (with Google Workspace access), upload [2-5 documents from Drive]. Then ask: 'Read all these documents. I need you to: 1) Identify the 3 most important themes across all documents, 2) Find any contradictions or gaps between them, 3) Tell me what is missing that I should find before making a decision about [SPECIFIC DECISION]. Be specific about which document each finding comes from.'",
  felipeOutroVideo:   "/videos/felipe-game9.mp4",
  nextGame: {
    slug:         "gemini-cli-unlocked",
    character:    "Sam",
    teaserLine:   "Luna used Gemini for research. Sam uses it for something completely different — bulk infrastructure tasks in the terminal. Gemini CLI is an AI that doesn't chat. It works.",
    previewImage: "/images/sam.png",
  },
  scenes: [
    // ── Scene 1 ── Meet Luna ──────────────────────────────────────────────────
    {
      id: "w9-s1",
      type: "scenario",
      character: "Luna, Grad Student, 21",
      location: "UNIVERSITY LIBRARY · THURSDAY · 3:12 PM",
      dialogue: [
        {
          speaker: "Luna",
          avatar: "jake",
          text:
            "I have 15 tabs open, three Docs with notes that contradict each other, and a 200-page paper I've only skimmed. My dissertation chapter is due in two weeks.",
        },
        {
          speaker: "Prof. Chen",
          avatar: "npc",
          npcKey: "senora_vega",
          text:
            "I can see the panic from across the library. Have you tried Gemini yet? Not Google Search — Gemini.",
        },
        {
          speaker: "Luna",
          avatar: "jake",
          text: "I thought Gemini was just another chatbot. Like a smarter autocomplete.",
        },
        {
          speaker: "Prof. Chen",
          avatar: "npc",
          npcKey: "senora_vega",
          text:
            "It's built into every Google tool you already use. Your Docs, your Gmail, your Drive. It knows your workflow because it lives inside it.",
        },
        {
          speaker: "Luna",
          avatar: "jake",
          text: "Wait — it's actually inside Google Docs? Like, right there in the sidebar?",
        },
        {
          speaker: "Prof. Chen",
          avatar: "npc",
          npcKey: "senora_vega",
          text:
            "Right there in the sidebar. And it can read the document you have open — no copy-paste required.",
        },
        {
          speaker: "Luna",
          avatar: "jake",
          text: "…That changes everything about how I've been working.",
        },
      ],
      concept: {
        title: "Gemini Is Everywhere You Already Work",
        body: "Gemini isn't one product — it's a family of AI models woven into Google's ecosystem.\n\n• gemini.google.com — standalone chat, like ChatGPT but from Google\n• Gemini Advanced — Google One subscription, unlocks Gemini 2.5 Pro (the most powerful model) and Deep Research\n• Gemini in Gmail — summarise threads, draft replies, suggest responses\n• Gemini in Google Docs — 'Help me write' sidebar drafts, rewrites, and improves your documents\n• Gemini in Sheets — write formulas in plain English, explain data, build charts from descriptions\n• Gemini in Drive — search across all your files using natural language\n\nKey models: Gemini 2.5 Pro (deep reasoning, massive context) and Gemini 2.5 Flash (faster, efficient for everyday tasks). If you already live in Google Workspace, Gemini meets you exactly where you are.",
      },
      question:
        "What makes Gemini different from just using Google Search with AI summaries?",
      choices: [
        {
          label: "A",
          text: "Gemini searches the web faster and returns more links than regular Search",
          correct: false,
          feedback:
            "Speed and link count aren't the point. Gemini is a reasoning model — it thinks through problems, generates content, and works inside your documents. Google Search retrieves pages; Gemini creates, analyzes, and acts.",
          wrongFeedback: "**Gemini** isn't faster search — it's a **reasoning model** that generates, analyzes, and acts inside your tools. Speed and links are Search's job, not Gemini's.",
          wrongStoryText: "Luna blinks. The screen responds: 'I don't fetch pages, Luna — I think through problems and build things with you.'",
        },
        {
          label: "B",
          text: "Gemini is embedded in Gmail, Docs, Sheets, and Drive — and can reason over your actual files and emails, not just web pages",
          correct: true,
          feedback:
            "Exactly. Search AI summaries pull from the public web. Gemini works inside your private Workspace — reading your drafts, summarising your email threads, writing formulas in your Sheets. That's a fundamentally different capability.",
        },
        {
          label: "C",
          text: "Gemini gives longer answers than Google Search AI Overviews",
          correct: false,
          feedback:
            "Length isn't the distinction. The real difference is integration: Gemini lives inside your tools and can act on your personal files. Search AI only ever sees the public web.",
          wrongFeedback: "**Response length** isn't what separates Gemini — its power is **Workspace integration**, reasoning over your personal files rather than only the public web.",
          wrongStoryText: "Luna frowns at the long answer. Mia leans in: 'More words isn't the point. Ask it to rewrite your actual email.'",
        },
        {
          label: "D",
          text: "Gemini is only useful if you pay for Google One — the free version does nothing",
          correct: false,
          feedback:
            "The free tier at gemini.google.com is genuinely powerful and runs Gemini 2.5 Flash. Google One (Gemini Advanced) unlocks 2.5 Pro and Deep Research — useful upgrades, but not required to get real value.",
          wrongFeedback: "The **free tier** runs **Gemini 2.5 Flash** and is genuinely capable — **Google One** upgrades to 2.5 Pro and Deep Research, but isn't required for real value.",
          wrongStoryText: "Luna nearly closes the tab. The screen lights up: 'You haven't even tried me yet — open the door before deciding it's locked.'",
        },
      ],
      xpAward: 100,
    },

    // ── Scene 2 ── The Context Window ────────────────────────────────────────
    {
      id: "w9-s2",
      type: "quiz",
      scenarioText:
        "Luna has a 200-page dissertation draft and five reference papers totalling another 300 pages. Her advisor flagged inconsistencies in her argument — but didn't say where. Instead of reading everything herself for the third time, Luna opens Gemini 2.5 Pro, uploads all six documents at once, and types: 'Where does the argument in my dissertation contradict or weakly align with the evidence in these reference papers?' Gemini reads all 500 pages in one pass and returns a list of specific section-by-section tensions — including one she had completely missed.",
      question:
        "Luna uploads a 200-page draft and 5 research papers to Gemini. What does the large context window actually enable?",
      choices: [
        {
          label: "A",
          text: "Gemini can reply faster because it reads fewer words per second",
          correct: false,
          feedback:
            "Context window size is about how much text the model holds in memory at once — not processing speed. A larger window means Gemini can read more material before its memory resets.",
          wrongFeedback: "**Context Window** measures simultaneous memory capacity, not speed — Gemini holds more text at once, not reads faster.",
          wrongStoryText: "Luna frowns at the screen. The Maestro's voice echoes: 'More memory, not more miles per hour. Think bigger, not quicker.'",
        },
        {
          label: "B",
          text: "Gemini can hold all 500+ pages in memory simultaneously and reason across them in a single query — finding contradictions, patterns, and gaps that span documents",
          correct: true,
          feedback:
            "This is the superpower. Gemini 2.5 Pro supports up to 1 million tokens — roughly 750,000 words, or a full novel. Luna's 500 pages fit easily in one pass. Gemini doesn't have to chunk, summarise, or lose context between documents.",
        },
        {
          label: "C",
          text: "Luna can store her documents permanently in Gemini's memory for future sessions",
          correct: false,
          feedback:
            "Context windows are per-session — Gemini doesn't retain files between conversations unless you're using a specific integration like NotebookLM. The 1M token window is about what Gemini can process at once, not what it remembers forever.",
          wrongFeedback: "**Context Windows** reset each session — Gemini processes your uploads now, but forgets them the moment the conversation ends.",
          wrongStoryText: "Luna reaches for yesterday's chat. It's gone. The console blinks: 'I held your words once. Now they've faded like morning notes.'",
        },
        {
          label: "D",
          text: "The large context window means Luna gets more detailed answers, regardless of what she uploads",
          correct: false,
          feedback:
            "The context window determines how much Gemini can read — not automatically the quality of the answer. What makes the difference is using that capacity well: uploading the right documents and asking a precise question.",
          wrongFeedback: "**Context Window** expands what Gemini can read — but **Prompt Quality** and the right documents determine answer depth.",
          wrongStoryText: "Luna hits send on a vague prompt. Pages upload, but the answer drifts. 'A wide lens still needs something worth seeing,' the Maestro murmurs.",
        },
      ],
      xpAward: 150,
    },

    // ── Scene 3 ── Gemini in the Workspace ───────────────────────────────────
    {
      id: "w9-s3",
      type: "scenario",
      character: "Luna",
      location: "CAMPUS CAFÉ · FRIDAY · 11:40 AM",
      dialogue: [
        {
          speaker: "Luna",
          avatar: "jake",
          text:
            "Prof. Chen, I just used Gemini in Gmail on that grant thread. There are 50 emails going back three months — I needed three bullet points. It took eight seconds.",
        },
        {
          speaker: "Prof. Chen",
          avatar: "npc",
          npcKey: "senora_vega",
          text: "What did it surface?",
        },
        {
          speaker: "Luna",
          avatar: "jake",
          text:
            "The outstanding budget approval, the two reviewers who still haven't responded, and a deadline I had completely missed. Eight seconds.",
        },
        {
          speaker: "Prof. Chen",
          avatar: "npc",
          npcKey: "senora_vega",
          text:
            "Now try it in Sheets. Describe a chart you want in plain English. Don't touch a formula.",
        },
        {
          speaker: "Luna",
          avatar: "jake",
          text:
            "[types]: 'Create a bar chart comparing average response times across five participant groups, sorted highest to lowest, with error bars.' [chart appears]",
        },
        {
          speaker: "Luna",
          avatar: "jake",
          text: "I would have spent an hour on that. And probably got the error bars wrong.",
        },
        {
          speaker: "Prof. Chen",
          avatar: "npc",
          npcKey: "senora_vega",
          text:
            "You're not just saving time. You're removing the parts of your workflow that don't require your expertise.",
        },
      ],
      concept: {
        title: "The Workspace Superpower",
        body: "Gemini transforms the three tools most knowledge workers live in:\n\nGmail\n• Summarise long threads in bullet points\n• Draft replies in your voice\n• Identify action items buried in conversation chains\n• Suggest meeting times based on thread context\n\nGoogle Docs\n• 'Help me write' sidebar — describe what you need, Gemini drafts it\n• Rewrite selected sections for clarity, tone, or length\n• Add a section, generate an outline, refine a paragraph — all in context\n\nGoogle Sheets\n• Write formulas by describing what you want in plain English\n• Explain what a complex formula does\n• Generate charts from text descriptions\n• Identify patterns and anomalies in your data\n\nThe common thread: Gemini removes the gap between knowing what you need and producing it.",
      },
      question:
        "Which Gemini Workspace feature saves the most time for someone managing a complex project with many email threads?",
      choices: [
        {
          label: "A",
          text: "Gemini drafting replies to every email automatically, without any input from the user",
          correct: false,
          feedback:
            "Auto-drafting without review creates risk — wrong tone, wrong information, wrong decisions. Gemini is a drafting partner, not an autopilot. You review and send; it reduces the work of composing.",
          wrongFeedback: "**Human-in-the-Loop** matters — auto-drafting without review risks tone errors and misinformation you'd never knowingly send.",
          wrongStoryText: "An email fires off. Luna gasps — wrong tone, wrong recipient. The Maestro sighs: 'Automation without oversight isn't help. It's a gamble.'",
        },
        {
          label: "B",
          text: "Gmail thread summarisation — surfacing decisions, deadlines, and open questions from dozens of emails in seconds",
          correct: true,
          feedback:
            "For complex projects, the real cost is cognitive overhead: tracking what was decided, what's pending, who's responsible. Gemini's thread summarisation compresses that overhead dramatically — turning a 50-email chain into three bullet points you can act on immediately.",
        },
        {
          label: "C",
          text: "Gemini translating emails into other languages for international teams",
          correct: false,
          feedback:
            "Translation is useful but niche. For most project managers, the bottleneck is keeping track of what's happening across many conversations — which is where thread summarisation has the broadest impact.",
          wrongFeedback: "Translation is valuable but narrow; **Thread Summarisation** tackles the universal bottleneck of information overload across complex projects.",
          wrongStoryText: "Luna translates an email perfectly — but still drowns in forty unread threads. 'Fluency,' the Maestro notes quietly, 'isn't the same as clarity.'",
        },
        {
          label: "D",
          text: "Gemini scheduling meetings directly in Google Calendar without any user review",
          correct: false,
          feedback:
            "Gemini can suggest meeting times, but calendar actions still require your confirmation. The highest-value feature for complex projects remains the ability to instantly understand long email threads.",
          wrongFeedback: "Gemini suggests times but requires **Human Confirmation** — the real project management win is understanding threads, not automating calendars.",
          wrongStoryText: "A meeting appears on Luna's calendar uninvited. She blinks. 'I never approved that,' she whispers. The Maestro nods: 'Exactly the point.'",
        },
      ],
      xpAward: 100,
    },

    // ── Scene 4 ── Deep Research ──────────────────────────────────────────────
    {
      id: "w9-s4",
      type: "quiz",
      scenarioText:
        "Luna needs to write a literature review covering current NLP research methodologies — transformer architectures, attention mechanisms, fine-tuning approaches, and how they compare to older RNN-based methods. Normally she'd spend two to three days reading papers and taking notes. Instead, she opens Gemini Advanced, selects Deep Research, and types her research question. Forty minutes later, Gemini returns a 12-page research report with citations, a comparative table of methodologies, key findings from dozens of papers, and a list of contested claims in the field. Luna uses it as the scaffold for her literature review — and finishes a first draft the same afternoon.",
      question:
        "What does Gemini's Deep Research feature do that a regular Gemini chat cannot?",
      choices: [
        {
          label: "A",
          text: "Deep Research gives longer answers than standard Gemini chat",
          correct: false,
          feedback:
            "Length is a symptom, not the capability. Standard Gemini can also write long responses. What Deep Research does differently is how it gathers information — by actively browsing and synthesising dozens of live sources before writing.",
          wrongFeedback: "**Deep Research** doesn't just write longer — it actively **browses live sources** and synthesises them before composing, unlike standard chat.",
          wrongStoryText: "Luna expects a longer reply — instead, she gets a research report. 'It wasn't writing more,' the Maestro says. 'It was working first.'",
        },
        {
          label: "B",
          text: "Deep Research autonomously browses the web, reads dozens of sources, synthesises findings, and produces a cited multi-page research report — acting more like a research agent than a chat model",
          correct: true,
          feedback:
            "This is the key distinction. Regular Gemini chat works from training data. Deep Research is agentic — it plans a research strategy, browses live web sources, reads them, and integrates findings into a structured report with citations. It doesn't just know; it goes and finds.",
        },
        {
          label: "C",
          text: "Deep Research can access Luna's private Google Drive files without her uploading them",
          correct: false,
          feedback:
            "Deep Research browses the public web — it doesn't automatically access private Drive files unless you explicitly share them. Your private documents remain private unless you bring them into the conversation.",
          wrongFeedback: "**Deep Research** only browses the public web — your private Drive files stay private unless you explicitly upload them to the session.",
          wrongStoryText: "Luna checks her Drive nervously. Everything's intact. 'Your private work stays yours,' the Maestro reassures. 'I only see what you show me.'",
        },
        {
          label: "D",
          text: "Deep Research is faster than standard Gemini because it skips the reasoning step",
          correct: false,
          feedback:
            "Actually the opposite — Deep Research takes longer because it does more work. It browses and reads sources before generating the report. The trade-off is time for depth: you wait 20–40 minutes and get a research-grade output instead of a quick reply.",
          wrongFeedback: "**Deep Research** actually takes longer — it trades speed for depth by reading dozens of live sources before generating a cited report.",
          wrongStoryText: "Luna taps her desk waiting forty minutes. Then twelve cited pages appear. 'Worth it,' she breathes. The Maestro smiles: 'Depth has its own clock.'",
        },
      ],
      xpAward: 150,
    },

    // ── Scene 5b ── LIVE AI Moment ────────────────────────────────────────────
    {
      id: "w9-s5b",
      type: "prompt",
      character: "Luna",
      location: "LIBRARY STUDY ROOM · SATURDAY · 2:00 PM",
      promptChallenge: {
        context:
          "Luna has uploaded her 60-page dissertation chapter to Gemini. The chapter argues that transformer-based models outperform RNNs for long-range language dependencies. Her advisor said the argument in section 3.2 'lacks support' but didn't explain why. Luna needs Gemini to identify the weakest claims in section 3.2 and suggest what specific evidence — types of studies, experimental results, or citations — would strengthen each one. The feedback needs to be precise and academic in quality, not vague encouragement.",
        goal:
          "Write a prompt that gives Gemini the right context and task to produce specific, academic-quality feedback on Luna's argument gaps.",
        placeholder: "Write Luna's Gemini prompt for dissertation feedback...",
      },
      xpAward: 150,
    },

    // ── NEAR-TRANSFER: Same Window, Different Critique ────────────────────────
    {
      id:       "w9-near-transfer",
      type:     "learn",
      location: "LIBRARY STUDY ROOM · SATURDAY · 2:00 PM",
      xpAward:  0,
      concept: {
        title: "Same Window. Different Critique.",
        body:  "Alex, a lead product designer at a fintech startup, was overwhelmed by design critique feedback. He had collected 50 feedback comments from Slack, Figma, and a 12-person video recording transcript. Instead of manually sorting the chaos, Alex uploaded the Figma comment export and the video transcript into Gemini. He used its massive context window to ask: 'Analyze these design critiques. Group the comments into three themes: navigation clarity, trust concerns, and visual polish. For each theme, identify the three most common suggestions and point out if any conflict with our design system.' Gemini mapped the comments, flagging a crucial contradiction in the checkout flow. Same context window. Completely different feedback synthesis.",
      },
      learnHighlight: "A massive context window isn't just about reading books. It's about dumping all your messy, unstructured team feedback into one place and letting the AI find the signal.",
    },

    // ── Scene 6 ── Boss: Conductor Test ──────────────────────────────────────
    {
      id: "w9-s6",
      type: "boss",
      scenarioText:
        "CONDUCTOR TEST — You have seen Gemini's context window, its Workspace integration, and its Deep Research capability. One question decides whether you have truly understood what makes Gemini unique.",
      question:
        "Luna needs to compare the methodology sections of 8 research papers to find which experimental designs are most common across the field. She has all 8 papers as PDFs. Which approach best uses Gemini's unique strengths?",
      choices: [
        {
          label: "A",
          text: "Read each paper herself, take notes in a Google Doc, then ask Gemini to summarise her notes",
          correct: false,
          feedback:
            "This uses Gemini as a note summariser — the least powerful application. Luna is still doing the hardest cognitive work herself. Gemini's context window exists precisely so it can do the reading across documents, not you.",
          wrongFeedback: "Summarising your own notes wastes Gemini's **Large Context Window** — its power is reading the source documents directly, so you don't have to.",
          wrongStoryText: "Luna highlights notes all afternoon. The Maestro watches, patient then firm: 'You carried the weight the window was built for. Upload the papers.'",
        },
        {
          label: "B",
          text: "Upload one paper at a time and ask Gemini eight separate questions about each methodology section",
          correct: false,
          feedback:
            "Eight separate conversations means Gemini never sees the full picture at once — it can't identify cross-paper patterns or make genuine comparisons. You lose the main advantage of a 1-million-token context window.",
          wrongFeedback: "Splitting documents across sessions destroys **Cross-Document Context** — Gemini's **1M Token Window** only works when all sources coexist simultaneously.",
          wrongStoryText: "Luna submits her eighth question and stares at eight disconnected answers. The Maestro sighs: 'You gave it pieces, never the puzzle.'",
        },
        {
          label: "C",
          text: "Upload all 8 PDFs in a single Gemini session and ask it to extract, compare, and rank the methodology patterns across all of them at once",
          correct: true,
          feedback:
            "This is the play. Gemini 2.5 Pro's context window can hold all 8 papers simultaneously. Uploading them together lets Gemini reason across documents — spotting shared patterns, divergences, and experimental design trends in a single response. This is the task that would take a human researcher days.",
        },
        {
          label: "D",
          text: "Use Gemini's Deep Research to search for methodology trends in NLP papers on the open web instead of using her PDFs",
          correct: false,
          feedback:
            "Deep Research is powerful for discovering sources you don't have yet. But Luna already has the 8 specific papers she needs to compare — her task is cross-document analysis, not discovery. Using her PDFs directly gives Gemini the exact corpus she cares about.",
          wrongFeedback: "**Deep Research** discovers sources you lack — but Luna's corpus exists; she needs **Multi-Document Analysis**, not web discovery.",
          wrongStoryText: "Luna watches Gemini scour the web while her 8 PDFs sit unopened. The Maestro murmurs: 'You sent it searching for what you already held.'",
        },
      ],
      xpAward: 250,
    },

    // ── Scene 7 ── Revelation ─────────────────────────────────────────────────
    {
      id: "w9-s7",
      type: "revelation",
      revealText:
        "Luna submitted her dissertation chapter three days early.\n\nShe didn't write faster. She thought faster — because she finally had a thinking partner who could hold the entire conversation in its head at once.\n\nThe research didn't get easier. She got sharper. There's a difference.\n\nShe stopped reading every email twice to remember what had been decided. She stopped rebuilding her notes from scratch every time her argument evolved. She stopped spending Tuesday afternoons wrestling with Sheets formulas that had nothing to do with her actual research.\n\nGemini didn't do the dissertation. She did.\n\nBut it held everything she needed — the papers, the threads, the drafts, the gaps — so she could focus on the one thing only she could do:\n\nThe thinking.",
      xpAward: 200,
    },

    // ═══ AI COMPARE ══════════════════════════════════════════════════════════
    {
      id: "w9-compare",
      type: "ai-compare",
      character: "Luna",
      location: "LIBRARY · RESEARCH STATION",
      xpAward: 75,
      aiCompare: {
        models: ["gemini", "claude", "chatgpt"],
        headline: "Gemini vs Claude vs ChatGPT — For Research & Academic Work",
        context: "Luna tested all three tools across six months of dissertation research. Lit reviews, data synthesis, citation management, argument structuring. Here's the honest breakdown.",
        rows: [
          {
            dimension: "Google Workspace Integration",
            winner: "Gemini",
            claude:  "No native Google integration",
            chatgpt: "No native Google integration",
            gemini:  "Native in Gmail, Docs, Drive, Slides — works where researchers already live",
            note: "Luna's papers are in Drive. Her notes are in Docs. Gemini meets her there with zero friction.",
          },
          {
            dimension: "Context Window for Long Documents",
            winner: "Gemini",
            claude:  "200K tokens — excellent for long docs",
            chatgpt: "128K tokens — good for most documents",
            gemini:  "1M tokens — reads entire research corpora simultaneously",
            note: "Luna loaded 47 papers at once. Gemini found cross-paper patterns Claude and ChatGPT would have to process separately.",
          },
          {
            dimension: "Deep Research Mode",
            winner: "Gemini",
            claude:  "Strong synthesis; no automated multi-source deep research",
            chatgpt: "Browses web; no dedicated deep research workflow",
            gemini:  "Deep Research: scans 100+ sources, synthesizes into structured report",
            note: "Deep Research is Gemini's superpower for academic work — automated literature review.",
          },
          {
            dimension: "Nuanced Argument Construction",
            winner: "Claude",
            claude:  "Best at building careful, nuanced academic arguments with appropriate hedging",
            chatgpt: "Good arguments; can be overconfident",
            gemini:  "Strong structure; sometimes research-summary heavy vs. argument-forward",
            note: "Luna's committee required a specific style of careful hedged argumentation. Claude nailed it.",
          },
          {
            dimension: "Citation & Source Reliability",
            winner: "ChatGPT",
            claude:  "Acknowledges uncertainty; rarely hallucinate sources when careful",
            chatgpt: "Browse mode can verify and cite live sources",
            gemini:  "Google Scholar integration in research mode; cites sources reliably",
            note: "For finding and citing REAL papers — use Gemini's Deep Research or ChatGPT with browse. Never trust AI-generated citations without verification.",
          },
        ],
        verdict: "For academic research: Gemini's Google integration + massive context + Deep Research mode make it the research discovery engine. Claude for writing the actual argument. Smart academics use both.",
        question: "Luna needs to synthesize 50 papers into a literature review framework — finding themes, gaps, and contradictions across the entire corpus. Which tool is most naturally suited?",
        choices: [
          {
            label: "A",
            text: "Claude — best at nuanced synthesis and argument construction",
            correct: false,
            feedback: "Claude writes the best arguments — but feeding it 50 papers requires working around its context limits and manual uploads. The synthesis task itself is better handled by a tool with built-in research infrastructure and massive context.",
            wrongFeedback: "Claude writes the best arguments — but feeding it 50 papers requires working around its context limits and manual uploads. The synthesis task itself is better handled by a tool with built-in research infrastructure and massive context.",
          wrongStoryText: "Luna admires Claude's elegant prose, then watches it stall at paper thirty-one. The Maestro says quietly: 'Brilliance means nothing without capacity.'",
          },
          {
            label: "B",
            text: "Gemini — 1M context + Deep Research handles the whole corpus simultaneously",
            correct: true,
            feedback: "Right. Gemini's 1M token context can hold the entire 50-paper corpus in one session while Deep Research synthesizes themes across all of them. That's the architecture built for exactly this use case. Once you have the synthesis, use Claude to write the actual argument.",
          },
          {
            label: "C",
            text: "ChatGPT — it can browse to find additional papers too",
            correct: false,
            feedback: "ChatGPT's browsing is valuable for finding new papers — but for synthesizing 50 you ALREADY have, you need context capacity and multi-document analysis. ChatGPT's 128K context and lack of deep research mode are limiting factors here.",
            wrongFeedback: "ChatGPT's browsing is valuable for finding new papers — but for synthesizing 50 you ALREADY have, you need context capacity and multi-document analysis. ChatGPT's 128K context and lack of deep research mode are limiting factors here.",
          wrongStoryText: "Luna watches ChatGPT find three new papers while ignoring thirty she already has. The Maestro nods slowly: 'Finding more won't help you understand what you have.'",
          },
        ],
      },
    },

    // ═══ HANDOFF ═════════════════════════════════════════════════════════════
    {
      id: "w9-handoff",
      type: "handoff",
      character: "Luna",
      location: "LIBRARY · PACKING UP",
      xpAward: 0,
      dialogue: [
        {
          speaker: "Luna",
          avatar: "protagonist" as const,
          text: "You now know what Gemini can actually do. Not just the chat — the research infrastructure. The context window. The Google integration. The Deep Research mode.",
        },
        {
          speaker: "Luna",
          avatar: "protagonist" as const,
          text: "Everything we did was in a browser, in documents, in the research world. There's a completely different side of Gemini that I never touched.",
        },
        {
          speaker: "Luna",
          avatar: "protagonist" as const,
          text: "Gemini CLI. The terminal version. It doesn't chat — it works. Bulk file operations, infrastructure scripting, automated pipelines. A whole different beast.",
        },
        {
          speaker: "Luna",
          avatar: "protagonist" as const,
          text: "Sam is a DevOps engineer. He migrated 47 configuration files in 11 minutes with Gemini CLI. Not manually — the AI DID it. In the terminal.",
        },
        {
          speaker: "Luna",
          avatar: "protagonist" as const,
          text: "If you've ever had to do anything tedious and repetitive at the command line — what Sam found is going to change how you think about that kind of work.",
        },
      ],
    },

  ],
}
