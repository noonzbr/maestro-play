import { Game } from "./types"

export const game11: Game = {
  slug: "microsoft-copilot",
  week: 11,
  free: true,
  title: "Microsoft Copilot — AI in Your M365",
  emoji: "🪟",
  accentColor: "#0078d4",
  audioTrack: "/audio/concrete-riot.mp3",
  characterName: "Jake",
  characterRole: "17-year-old music club president",
  characterBlurb: "Jake discovers the AI already living inside his school's Microsoft 365",
  characterImage: "/images/guitarplayer1.png",
  maestroImage: "/images/maestroplayer1.png",
  maestroLine: "The last time he was drowning in meeting notes and spreadsheets...",
  maestroSubline: "Jake runs the music club AND the AI now. Copilot keeps up.",
  intro: {
    sceneImage: "/images/scene-jake-copilot.png",
    sceneColor: "#060810",
    noteOrigin: { bottom: "42%", left: "48%" },
    beats: [
      { type: "location",  text: "SCHOOL ADMIN OFFICE · MONDAY · 7:44 AM" },
      { type: "narration", text: "Jake had been running the music club on willpower and late nights, the same way the school had been running on paper and habit." },
      { type: "dialogue",  speaker: "Ms. Chen", text: "The district is rolling out Microsoft Copilot across all M365 accounts this semester. Jake, it's been in your Word and Teams and Outlook all year. You never opened it once." },
      { type: "final",     text: "The tools were always there. The conductor just had to pick up the baton." },
    ],
  },
  duration: "9 min",
  description:
    "Discover how Microsoft Copilot transforms your daily M365 workflow — Word, Excel, Teams, Outlook — turning hours of admin into minutes of flow.",
  tagline: "The AI already in your computer. Most people never unlock it.",
  aiModel:  "copilot" as const,
  nextGame: {
    slug:         "copilot-studio",
    character:    "Jake",
    teaserLine:   "Jake used every Copilot feature Microsoft gave him. Now he wants to BUILD his own. Copilot Studio lets you create custom AI agents — no coding required. The music club is about to get its own AI.",
    previewImage: "/images/guitarplayer1.png",
  },
  scenes: [

    // ── SCENE 1 ── The Iceberg ────────────────────────────────────────────────
    {
      id: "w11-s1",
      type: "scenario",
      character: "Jake, 17",
      location: "SCHOOL LIBRARY · MONDAY · 7:52 AM",
      dialogue: [
        {
          speaker: "Jake",
          avatar: "jake" as const,
          text: "Okay. Concert is in three weeks. I have to draft the proposal, do the budget spreadsheet, send twenty emails, and somehow get everyone to show up to a meeting they already skipped once.",
        },
        {
          speaker: "Ms. Chen",
          avatar: "npc" as const,
          npcKey: "senora_vega" as const,
          text: "Jake. Can I show you something before you open Word?",
        },
        {
          speaker: "Jake",
          avatar: "jake" as const,
          text: "Ms. Chen, I really don't have time —",
        },
        {
          speaker: "Ms. Chen",
          avatar: "npc" as const,
          npcKey: "senora_vega" as const,
          text: "Click the little Copilot icon. Top right. It's been there the whole year.",
        },
        {
          speaker: "Jake",
          avatar: "jake" as const,
          text: "...that purple sparkle thing? I thought it was just a decorative button.",
        },
        {
          speaker: "Ms. Chen",
          avatar: "npc" as const,
          npcKey: "senora_vega" as const,
          text: "It's an AI assistant that knows your school account — your emails, your files, your calendar, your Teams chats. Everything in Microsoft 365. It's been waiting for you since September.",
        },
        {
          speaker: "Jake",
          avatar: "jake" as const,
          text: "Since September. And I've been doing everything manually. For seven months.",
        },
        {
          speaker: "Ms. Chen",
          avatar: "npc" as const,
          npcKey: "senora_vega" as const,
          text: "You're not alone. Most people never unlock it. They see the icon, assume it's just a chatbot, and close it. It is not just a chatbot.",
        },
        {
          speaker: "Tyler",
          avatar: "npc" as const,
          npcKey: "tyler" as const,
          text: "Wait — the school actually paid for this and nobody told us?",
        },
        {
          speaker: "Ms. Chen",
          avatar: "npc" as const,
          npcKey: "senora_vega" as const,
          text: "Microsoft 365 Copilot is included in many education and business licenses. The iceberg is enormous. The icon at the surface is just the tip.",
        },
      ],
      concept: {
        title: "The Copilot Iceberg",
        body: "Microsoft Copilot is embedded across the entire Microsoft 365 suite — Word, Excel, Teams, Outlook, PowerPoint, OneNote, and more.\n\nWhat most people think it is: a chatbot you can ask questions.\n\nWhat it actually is: an AI with full context of your work — your files, emails, meetings, and calendar — that can draft, summarise, analyse, and act across every M365 app.\n\nWhere to find it:\n• The Copilot icon (sparkle) in any M365 app toolbar\n• The dedicated Copilot app in your Microsoft 365 home\n• The Copilot sidebar in Teams, Outlook, Word, and Excel\n\nAvailability: Included in many Microsoft 365 Business, Education, and Enterprise plans. Check with your IT admin or look for the sparkle icon — if it's there, you're licensed.\n\nThe key insight: most people see the icon, assume it's just another chatbot, and ignore it. It is not a chatbot. It's a co-pilot with context of your entire work environment.",
      },
      question:
        "Jake has had Microsoft Copilot available all year without knowing it. What makes Copilot fundamentally different from a generic AI chatbot like typing into ChatGPT?",
      choices: [
        {
          label: "A",
          text: "Copilot is faster because it runs locally on your device rather than in the cloud",
          correct: false,
          feedback:
            "Copilot runs on Microsoft's cloud infrastructure — not locally. Speed isn't the differentiator. The real difference is context: Copilot has access to your actual files, emails, and meetings, which a generic chatbot never does.",
        },
        {
          label: "B",
          text: "Copilot has contextual access to your M365 data — files, emails, meetings, calendar — so it works within your actual environment, not in isolation",
          correct: true,
          feedback:
            "Exactly. A generic chatbot only knows what you paste into it. Copilot already knows your documents, your emails, your meeting history, and your calendar. It's not just answering questions — it's working with the real content of your work life.",
        },
        {
          label: "C",
          text: "Copilot can only work with documents you share with it manually through the upload button",
          correct: false,
          feedback:
            "That describes a generic chatbot, not Copilot. Microsoft Copilot has permission-aware access to the files, emails, and meetings in your M365 account — no manual uploading required. It finds relevant content automatically.",
        },
        {
          label: "D",
          text: "Copilot is a premium add-on that costs extra on top of a Microsoft 365 subscription",
          correct: false,
          feedback:
            "Copilot is included in many Microsoft 365 Education, Business, and Enterprise plans. Whether it's available depends on your organisation's license — check for the sparkle icon in your toolbar. If it's there, it's already paid for.",
        },
      ],
      xpAward: 100,
    },

    // ── SCENE 2 ── Quiz: What IS Copilot ─────────────────────────────────────
    {
      id: "w11-s2",
      type: "quiz",
      scenarioText:
        "Ms. Chen explains how Copilot works under the hood. It's built on the same large language model technology as ChatGPT — but Microsoft connects it to your M365 Graph, a secure layer that maps relationships between your emails, files, meetings, and contacts. When you ask Copilot to 'summarise the budget discussion from last Tuesday's meeting,' it doesn't search the internet — it searches your actual Teams transcript. When you ask it to 'draft a follow-up to my email with Tyler,' it pulls up your real email thread. Copilot never shares your data with other users or uses it to train the model. Your content stays inside your organisation's Microsoft 365 environment, governed by the same permissions that already control who can see what.",
      question:
        "Jake asks Copilot in Teams: 'What did we decide about the concert date in our last club meeting?' How does Copilot find the answer?",
      choices: [
        {
          label: "A",
          text: "Copilot searches the public internet for information about Jake's music club",
          correct: false,
          feedback:
            "Copilot does not search the public internet for your personal meeting content — that information doesn't exist there. Copilot uses Microsoft Graph to access your organisation's actual data: your Teams transcripts, emails, and calendar entries.",
        },
        {
          label: "B",
          text: "Copilot asks Jake to paste the meeting notes into the chat window first",
          correct: false,
          feedback:
            "That's how a generic chatbot works. Copilot's advantage is that it already has access to your Teams meeting transcripts through Microsoft Graph — no copy-pasting required. It finds the relevant meeting automatically.",
        },
        {
          label: "C",
          text: "Copilot accesses Jake's actual Teams meeting transcripts through Microsoft Graph and surfaces the relevant decision",
          correct: true,
          feedback:
            "Correct. Microsoft Graph is the secure data layer connecting your entire M365 environment. Copilot uses it to find the right meeting, read the transcript, and pull out the specific decision — without ever leaving your organisation's secure boundary.",
        },
        {
          label: "D",
          text: "Copilot asks Jake's IT administrator for permission before reading any meeting transcripts",
          correct: false,
          feedback:
            "Copilot respects the permissions already set in your M365 environment — it can only access meetings and files that you yourself have permission to view. No extra admin approval is needed per query. The access controls are already built in.",
        },
      ],
      xpAward: 100,
    },

    // ── SCENE 3 ── Copilot in Word ────────────────────────────────────────────
    {
      id: "w11-s3",
      type: "scenario",
      character: "Jake, 17",
      location: "SCHOOL LIBRARY · MONDAY · 8:24 AM",
      dialogue: [
        {
          speaker: "Jake",
          avatar: "jake" as const,
          text: "Alright. First thing — the concert proposal. I need to send it to Principal Okafor by end of day. Last year it took me three hours to write.",
        },
        {
          speaker: "Ms. Chen",
          avatar: "npc" as const,
          npcKey: "senora_vega" as const,
          text: "Open a new Word document. Click the Copilot icon in the toolbar. Then click 'Draft with Copilot.'",
        },
        {
          speaker: "Jake",
          avatar: "jake" as const,
          text: "It's asking me to describe what I want. Okay: 'Draft a concert proposal for Westfield High School's annual music club spring concert. Include event overview, date and venue options, budget estimate of $800, student responsibilities, and a request for admin approval.'",
        },
        {
          speaker: "Ms. Chen",
          avatar: "npc" as const,
          npcKey: "senora_vega" as const,
          text: "Hit Generate.",
        },
        {
          speaker: "Jake",
          avatar: "jake" as const,
          text: "It just... wrote a complete four-page proposal. With sections, headings, a budget breakdown table, even a timeline. In twelve seconds.",
        },
        {
          speaker: "Tyler",
          avatar: "npc" as const,
          npcKey: "tyler" as const,
          text: "Okay that's actually insane. That's what took you three hours last year?",
        },
        {
          speaker: "Jake",
          avatar: "jake" as const,
          text: "It's not perfect — Principal Okafor hates bullet points, and the tone is a bit formal. But the structure is all there. I just need to tune it.",
        },
        {
          speaker: "Ms. Chen",
          avatar: "npc" as const,
          npcKey: "senora_vega" as const,
          text: "Try selecting a section and clicking Copilot again. Ask it to rewrite that section in a warmer, more conversational tone.",
        },
        {
          speaker: "Jake",
          avatar: "jake" as const,
          text: "Done. That's exactly how I'd say it. Draft is done. That was... eleven minutes. Including fixing it.",
        },
      ],
      concept: {
        title: "Copilot in Word — Draft with Copilot",
        body: "Copilot in Word gives you two core modes:\n\n1. Draft with Copilot (blank or existing doc)\nDescribe what you want — include purpose, audience, key sections, tone, and any constraints. Copilot generates a complete structured draft. Treat it as a first draft, not a final one.\n\n2. Rewrite & Refine (selected text)\nSelect any passage, click the Copilot icon, and ask for specific changes: 'Make this more concise,' 'Change the tone to be warmer,' 'Add a specific example here,' 'Rewrite this as a bulleted list.'\n\nPro tips:\n• The more context you give in your initial prompt, the less editing you need to do.\n• Copilot can also summarise existing long documents: open any Word doc and ask 'Summarise this document in 3 bullet points.'\n• Reference other files: 'Draft a proposal similar to /Budget Report Q1.docx but for the spring concert.'\n\nThe shift: you move from writing to editing. That's always faster.",
      },
      question:
        "Jake used 'Draft with Copilot' and got a complete proposal in 12 seconds, then spent 9 more minutes refining it. What is the most important prompt habit that made the draft useful from the start?",
      choices: [
        {
          label: "A",
          text: "He opened an existing document first so Copilot had a template to follow",
          correct: false,
          feedback:
            "Jake started with a blank document — 'Draft with Copilot' works without an existing template. The quality of his initial output came from the specificity of his description: purpose, audience, sections, budget figure, and goal all in one prompt.",
        },
        {
          label: "B",
          text: "He described the purpose, audience, specific sections, budget figure, and desired outcome in his initial prompt",
          correct: true,
          feedback:
            "Exactly. A prompt that includes who it's for, what it needs to cover, specific numbers, and the end goal gives Copilot a complete picture. The more context you provide upfront, the closer the first draft is to what you actually need.",
        },
        {
          label: "C",
          text: "He used the Word template gallery to give Copilot a starting structure",
          correct: false,
          feedback:
            "Template selection isn't required for 'Draft with Copilot' — Copilot creates its own structure based on your description. The useful output came from Jake's detailed prompt, not from a pre-selected template.",
        },
        {
          label: "D",
          text: "He typed the full document himself first and then asked Copilot to improve it",
          correct: false,
          feedback:
            "Jake did the opposite — he let Copilot draft first, then refined the result. Writing the full document himself first would defeat the purpose of 'Draft with Copilot.' The gain is precisely that you start with Copilot's draft and edit it, not the other way around.",
        },
      ],
      xpAward: 100,
    },

    // ── SCENE 4 ── Copilot in Teams ───────────────────────────────────────────
    {
      id: "w11-s4",
      type: "scenario",
      character: "Jake, 17",
      location: "HALLWAY · MONDAY · 12:41 PM",
      dialogue: [
        {
          speaker: "Tyler",
          avatar: "npc" as const,
          npcKey: "tyler" as const,
          text: "Dude. You missed the logistics meeting. Twenty minutes of everyone talking over each other.",
        },
        {
          speaker: "Jake",
          avatar: "jake" as const,
          text: "I was in Mr. Patel's class. What did we decide?",
        },
        {
          speaker: "Tyler",
          avatar: "npc" as const,
          npcKey: "tyler" as const,
          text: "I don't know. I was trying to play a riff under the table. Maya was taking notes but she left early.",
        },
        {
          speaker: "Jake",
          avatar: "jake" as const,
          text: "Classic. Okay — wait. The meeting was on Teams. Copilot was in the toolbar. Ms. Chen said it records and transcribes if Transcription was on.",
        },
        {
          speaker: "Tyler",
          avatar: "npc" as const,
          npcKey: "tyler" as const,
          text: "So just... ask it?",
        },
        {
          speaker: "Jake",
          avatar: "jake" as const,
          text: "[opens Teams, clicks Recap tab on the meeting] 'Summarise the key decisions from today's music club logistics meeting and list the action items with owners.'",
        },
        {
          speaker: "AI",
          avatar: "npc" as const,
          npcKey: "ai" as const,
          text: "Key decisions: (1) Concert date confirmed as May 30th. (2) Venue: school auditorium, Main Stage. (3) Ticket price set at $8. Action items: Jake — finalise setlist by Wednesday. Tyler — coordinate PA system with Mr. Diaz. Maya — design poster by Friday.",
        },
        {
          speaker: "Jake",
          avatar: "jake" as const,
          text: "It has my name on an action item I didn't even know about. That would have just fallen through the cracks.",
        },
        {
          speaker: "Tyler",
          avatar: "npc" as const,
          npcKey: "tyler" as const,
          text: "So missing a meeting isn't the catastrophe it used to be.",
        },
        {
          speaker: "Jake",
          avatar: "jake" as const,
          text: "Still show up. But now there's a safety net.",
        },
      ],
      concept: {
        title: "Copilot in Teams — Meeting Intelligence",
        body: "Copilot in Microsoft Teams turns every meeting into a searchable, summarisable record — provided Meeting Transcription is enabled.\n\nWhat Copilot can do during a live meeting:\n• Summarise what's been discussed so far (great when you join late)\n• List open questions and unresolved points\n• Capture decisions as they happen\n\nWhat Copilot can do after a meeting (via the Recap tab):\n• Generate a full meeting summary\n• Extract key decisions with context\n• List action items and assign them to named speakers\n• Answer specific questions about the transcript ('What did Maya say about the poster?')\n• Draft follow-up emails based on the meeting\n\nRequirements: Meeting transcription must be enabled in your Teams meeting settings. The organiser or a participant must start transcription.\n\nThe principle: Copilot doesn't replace attending — being present still matters for relationships and real-time decisions. But it eliminates the information loss that happens when people miss meetings, take incomplete notes, or forget what was agreed.",
      },
      question:
        "Jake uses Copilot's Recap tab to get the decisions and action items from a Teams meeting he missed. What does Copilot require in order for this to work?",
      choices: [
        {
          label: "A",
          text: "At least one participant must have manually saved a copy of the chat log to OneDrive during the meeting",
          correct: false,
          feedback:
            "No manual save is needed. Copilot works from the meeting transcript — a live, automatic text record of what was said. The transcript is distinct from the chat log and is generated when transcription is enabled, without any manual action from participants.",
        },
        {
          label: "B",
          text: "The meeting must have been recorded to video — Copilot reads the video file",
          correct: false,
          feedback:
            "Copilot uses the meeting transcript, not the video recording. Transcription generates a time-stamped text record of everything said, which is what Copilot analyses to produce summaries and action items. Video recording and transcription are separate settings.",
        },
        {
          label: "C",
          text: "Meeting transcription must have been enabled during the meeting, so Copilot has a text record to analyse",
          correct: true,
          feedback:
            "Correct. Copilot's post-meeting capabilities — summaries, action items, Q&A on the transcript — all depend on the meeting transcript. If transcription wasn't turned on, there's no text record for Copilot to work from. Make enabling transcription a habit.",
        },
        {
          label: "D",
          text: "Jake must have been the meeting organiser — Copilot only works for the person who scheduled the meeting",
          correct: false,
          feedback:
            "Copilot's Recap tab is available to any participant who had access to the meeting, not just the organiser. Access is governed by your M365 permissions — if you could attend the meeting, you can access its Copilot recap.",
        },
      ],
      xpAward: 100,
    },

    // ── SCENE 5 ── Quiz: Copilot in Excel ─────────────────────────────────────
    {
      id: "w11-s5",
      type: "quiz",
      scenarioText:
        "Jake opens the music club's ticket sales spreadsheet — 80 rows of show dates, ticket types, prices, and quantities sold across the last two years. He needs to figure out which show types made the most money, which months are best for attendance, and whether raising the ticket price to $10 would be viable. Before Copilot, this meant writing SUMIF formulas, manually building charts, and spending an hour reading through the data. Now Jake clicks the Copilot icon in Excel, and types: 'Analyse this data. Which show format generated the highest total revenue? Which month had the best average attendance? Create a chart showing monthly attendance trends.' In 30 seconds, Copilot highlights the relevant columns, generates the analysis, and inserts a line chart — without Jake writing a single formula. It also flags an anomaly: the October show has suspiciously low attendance compared to a nearly identical show in April, and suggests checking if there was a competing event.",
      question:
        "Jake asks Copilot in Excel to analyse 80 rows of ticket data and create a chart — all in plain English. What is Copilot doing under the hood to make this work?",
      choices: [
        {
          label: "A",
          text: "Copilot exports the data to an external AI service that returns a static image of the chart",
          correct: false,
          feedback:
            "Copilot works natively inside Excel — it doesn't export your data to an external service to generate a static image. The charts and analysis it creates are real, live Excel objects: editable, interactive, and formatted to Excel standards.",
        },
        {
          label: "B",
          text: "Copilot reads the spreadsheet's content, runs the appropriate Excel functions internally, and generates real charts and formula-based results within the workbook",
          correct: true,
          feedback:
            "Correct. Copilot understands your spreadsheet structure, determines which functions and aggregations answer your question, runs them, and produces real Excel outputs — pivot tables, charts, formulas — that you can edit like anything else in the workbook.",
        },
        {
          label: "C",
          text: "Copilot only works if you first convert the spreadsheet to a Copilot-compatible format using the 'Prepare for AI' button",
          correct: false,
          feedback:
            "There's no conversion step or 'Prepare for AI' button required. Copilot works directly on any Excel table or range. For best results, make sure your data is in a formatted Excel Table (Insert > Table), which helps Copilot understand column relationships — but no special conversion is needed.",
        },
        {
          label: "D",
          text: "Copilot can only describe what's in the data — it cannot create charts or write formulas",
          correct: false,
          feedback:
            "Copilot in Excel can do all three: describe patterns in plain English, generate formulas (including complex ones like SUMIF, XLOOKUP, and array formulas), and create charts. The analysis Jake got — including the inserted chart and the anomaly flag — is well within its standard capability.",
        },
      ],
      xpAward: 150,
    },

    // ── SCENE 5b ── Prompt Challenge: Copilot in Outlook ─────────────────────
    {
      id: "w11-s5b",
      type: "prompt",
      character: "Jake, 17",
      location: "SCHOOL LIBRARY · MONDAY · 3:15 PM",
      promptChallenge: {
        context:
          "Jake just finished the concert logistics. He needs to send a thank-you email in Outlook to Mr. Diaz, the school's tech coordinator, who volunteered to set up the PA system and lighting rig for free — saving the club $300. Jake has these bullet points jotted down: donated his Saturday, set up PA and lights, saved us $300, made the concert actually sound professional, club really appreciates it, wants to acknowledge him at the concert if he's okay with it. Jake wants to use Copilot in Outlook's 'Draft with Copilot' feature to turn these bullet points into a warm, genuine thank-you email — not corporate-sounding, not over-the-top, just sincere and specific.",
        goal:
          "Write the prompt Jake would type into Copilot's 'Draft with Copilot' field in Outlook to generate this thank-you email from his bullet points.",
        placeholder: "Write Jake's Copilot prompt for the Outlook thank-you email...",
      },
      xpAward: 150,
    },

    // ── SCENE 6 ── Boss: Conductor Test ──────────────────────────────────────
    {
      id: "w11-s6",
      type: "boss",
      scenarioText:
        "CONDUCTOR TEST — It's concert week. Jake needs to use Copilot across M365 to handle three urgent tasks simultaneously. He has 60 seconds to choose the right approach for the most complex one: a board member from the school district is attending, and Jake needs to brief Principal Okafor on everything discussed at the last five club meetings, pulling together decisions, outstanding action items, and any budget mentions — in one coherent summary document.",
      question:
        "Jake needs a briefing document for Principal Okafor covering the key decisions, action items, and budget mentions from the last five Teams meetings. What is the most effective way to use Copilot to produce this?",
      choices: [
        {
          label: "A",
          text: "Open each of the five meeting recaps in Teams one at a time, copy the summaries manually, paste them into Word, and ask Copilot to tidy up the formatting",
          correct: false,
          feedback:
            "This misses the whole point — you're doing the cross-meeting synthesis yourself. Copilot is capable of pulling information across multiple meetings in a single query. Manual copy-paste across five sources is exactly the kind of work Copilot eliminates when used properly.",
        },
        {
          label: "B",
          text: "In a new Word document, use 'Draft with Copilot' and reference the specific Teams meeting transcripts: 'Summarise decisions, action items, and budget mentions from the last 5 music club meetings in Teams. Format as an executive briefing.'",
          correct: true,
          feedback:
            "This is the right architecture. Copilot in Word can reference your Teams meeting data through Microsoft Graph. A single well-formed prompt that specifies the source (Teams), the time scope (last 5 meetings), the content to extract (decisions, action items, budget), and the output format (executive briefing) produces a complete, coherent document — without you touching any of the individual transcripts.",
        },
        {
          label: "C",
          text: "Ask Tyler to attend all five meeting recaps and manually write notes, then give them to Jake to edit",
          correct: false,
          feedback:
            "Outsourcing the manual work to Tyler is still manual work — and a bottleneck depending on Tyler's availability and note-taking accuracy. Copilot can read five meeting transcripts and synthesise them in seconds with no human intermediary.",
        },
        {
          label: "D",
          text: "Use Copilot in Teams to email Principal Okafor directly from each meeting recap using the 'Share summary' button",
          correct: false,
          feedback:
            "Individual per-meeting share buttons produce five separate emails, not one coherent briefing document. The task requires cross-meeting synthesis — pulling threads from multiple sources into a single, organised summary. That's a Word + Copilot task, not a one-click share.",
        },
      ],
      xpAward: 250,
    },

    // ── SCENE 7 ── Revelation ─────────────────────────────────────────────────
    {
      id: "w11-s7",
      type: "revelation",
      revealText:
        "Jake had been flying the whole time.\n\nHe just hadn't looked at the instrument panel.\n\nAll year, the tools were there: the sparkle icon in Word when he was staring at a blank page at midnight. The Recap tab in Teams after every meeting he scrambled to get notes from. The Copilot sidebar in Excel while he was manually sorting through rows with his eyes. The 'Draft with Copilot' button in Outlook while he was typing the same polite email for the fourth time that week.\n\nHe thought he was working hard. He was just working alone.\n\nA co-pilot doesn't fly the plane for you. It doesn't replace your judgment about when to take off, where to land, or how to navigate when the weather turns. It handles the altitude calculations, the system checks, the routine monitoring — so you can focus on the decisions only you can make.\n\nJake submitted the concert proposal in 11 minutes.\nHe caught his own action item from a meeting he missed.\nHe analysed two years of ticket data in 30 seconds.\nHe sent a thank-you email that actually sounded like him.\n\nThe concert was sold out.\n\nNot because the AI ran the music club.\n\nBecause Jake finally stopped doing the work that was never meant to be done by a person — and started doing the work that only he could do.",
      xpAward: 200,
    },

    // ═══ AI COMPARE ══════════════════════════════════════════════════════════
    {
      id: "w11-compare",
      type: "ai-compare",
      character: "Jake",
      location: "SCHOOL HALLWAY · LAPTOP OPEN",
      xpAward: 75,
      aiCompare: {
        models: ["copilot", "claude", "chatgpt"],
        headline: "Microsoft Copilot vs Claude vs ChatGPT — For Business Productivity",
        context: "Jake ran the same productivity tasks through all three. Meeting summaries, email drafts, spreadsheet analysis, document creation. Here's what the real-world comparison looked like.",
        rows: [
          {
            dimension: "Microsoft 365 Native Integration",
            winner: "Copilot",
            claude:  "No native M365 integration",
            chatgpt: "Limited M365 integration",
            gemini:  "N/A",
            copilot: "Native in Word, Excel, Teams, Outlook — zero friction",
            note: "Jake's entire school runs on M365. Copilot is already in every app he uses.",
          },
          {
            dimension: "Meeting Summary & Action Items",
            winner: "Copilot",
            claude:  "Excellent at summarizing pasted transcripts",
            chatgpt: "Excellent at summarizing pasted transcripts",
            gemini:  "N/A",
            copilot: "Auto-summarizes Teams meetings, extracts action items, drafts follow-ups",
            note: "Copilot was in Jake's meeting. It doesn't need a transcript — it heard the meeting.",
          },
          {
            dimension: "Document Drafting Quality",
            winner: "Claude",
            claude:  "Best at nuanced, constraint-heavy professional writing",
            chatgpt: "Excellent drafting; broad capability",
            gemini:  "N/A",
            copilot: "Strong M365-context-aware drafting; slightly more templated feel",
            note: "For a 5-page grant proposal with specific voice requirements — Claude still wins on pure writing quality.",
          },
          {
            dimension: "Excel & Data Analysis",
            winner: "Copilot",
            claude:  "Can analyze pasted data; no native Excel integration",
            chatgpt: "Code Interpreter handles data; requires upload",
            gemini:  "N/A",
            copilot: "Native Excel integration — analyzes live spreadsheet data, generates formulas, creates charts",
            note: "Jake's budget is LIVE in Excel. Copilot analyzes it in place. No exports, no uploads.",
          },
          {
            dimension: "Cross-App Context Synthesis",
            winner: "Copilot",
            claude:  "No cross-app context",
            chatgpt: "No cross-app context",
            gemini:  "N/A",
            copilot: "Microsoft Graph: synthesizes across email, calendar, docs, meetings",
            note: "Copilot knows Jake's calendar, his email thread, and his meeting notes — and can combine them in one response.",
          },
        ],
        verdict: "For M365-native workflows — Copilot wins on integration depth. For standalone writing quality — Claude still leads. Smart M365 users use Copilot for workflow tasks and Claude for high-stakes writing.",
        question: "Jake needs to summarize 3 weeks of club email threads, calendar entries, and meeting notes into a single status report. Which tool does this with the least friction?",
        choices: [
          {
            label: "A",
            text: "Claude — best at synthesizing complex information into clear summaries",
            correct: false,
            feedback: "Claude's synthesis quality is excellent — but it would need Jake to manually compile and paste 3 weeks of emails, calendar data, and meeting notes. That's a lot of friction. The question is about the whole workflow, not just the writing quality.",
            wrongFeedback: "Claude's synthesis quality is excellent — but it would need Jake to manually compile and paste 3 weeks of emails, calendar data, and meeting notes. That's a lot of friction. The question is about the whole workflow, not just the writing quality.",
          },
          {
            label: "B",
            text: "Microsoft Copilot — Microsoft Graph already has access to all of Jake's emails, calendar, and meeting notes",
            correct: true,
            feedback: "Exactly. Copilot has native access to Jake's M365 data through Microsoft Graph. It can pull his email threads, calendar entries, and meeting notes simultaneously and synthesize them into a status report without a single copy-paste. This is Copilot's home territory.",
          },
          {
            label: "C",
            text: "ChatGPT — can handle complex multi-source synthesis with browsing",
            correct: false,
            feedback: "ChatGPT can't browse Jake's email or calendar — those are private M365 systems. It would need the same manual compilation as Claude. Copilot's Microsoft Graph access is the critical differentiator for this type of cross-app synthesis.",
            wrongFeedback: "ChatGPT can't browse Jake's email or calendar — those are private M365 systems. It would need the same manual compilation as Claude. Copilot's Microsoft Graph access is the critical differentiator for this type of cross-app synthesis.",
          },
        ],
      },
    },

    // ═══ HANDOFF ═════════════════════════════════════════════════════════════
    {
      id: "w11-handoff",
      type: "handoff",
      character: "Jake",
      location: "SCHOOL HALLWAY · AFTER CLASS",
      xpAward: 0,
      dialogue: [
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "Okay — Copilot is everywhere in M365. I get it now. It's not magic, it's integration. The AI already knows your emails, your meetings, your files. You just have to ask.",
        },
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "But I kept running into the same wall: the AI can answer questions, but it can't PROACTIVELY help people who don't know what to ask.",
        },
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "Like — 47 students in the music club. Most of them have no idea how to use AI. They need something purpose-built for THEM. A custom AI just for the club.",
        },
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "So I tried Copilot Studio. No-code AI agent builder. You define what it knows, how it talks, what questions it answers. Built it over a weekend.",
        },
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "MelodyBot. The music club's own AI. Handles FAQs, rehearsal schedules, equipment booking. Come see how I built it.",
        },
      ],
    },

  ],
}
