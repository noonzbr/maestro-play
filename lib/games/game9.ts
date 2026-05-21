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
        },
        {
          label: "D",
          text: "Gemini is only useful if you pay for Google One — the free version does nothing",
          correct: false,
          feedback:
            "The free tier at gemini.google.com is genuinely powerful and runs Gemini 2.5 Flash. Google One (Gemini Advanced) unlocks 2.5 Pro and Deep Research — useful upgrades, but not required to get real value.",
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
        },
        {
          label: "D",
          text: "The large context window means Luna gets more detailed answers, regardless of what she uploads",
          correct: false,
          feedback:
            "The context window determines how much Gemini can read — not automatically the quality of the answer. What makes the difference is using that capacity well: uploading the right documents and asking a precise question.",
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
        },
        {
          label: "D",
          text: "Gemini scheduling meetings directly in Google Calendar without any user review",
          correct: false,
          feedback:
            "Gemini can suggest meeting times, but calendar actions still require your confirmation. The highest-value feature for complex projects remains the ability to instantly understand long email threads.",
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
        },
        {
          label: "D",
          text: "Deep Research is faster than standard Gemini because it skips the reasoning step",
          correct: false,
          feedback:
            "Actually the opposite — Deep Research takes longer because it does more work. It browses and reads sources before generating the report. The trade-off is time for depth: you wait 20–40 minutes and get a research-grade output instead of a quick reply.",
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
        },
        {
          label: "B",
          text: "Upload one paper at a time and ask Gemini eight separate questions about each methodology section",
          correct: false,
          feedback:
            "Eight separate conversations means Gemini never sees the full picture at once — it can't identify cross-paper patterns or make genuine comparisons. You lose the main advantage of a 1-million-token context window.",
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
  ],
}
