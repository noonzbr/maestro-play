import { Game } from "./types"

export const game11: Game = {
  slug: "microsoft-copilot",
  week: 11,
  free: true,
  title: "Microsoft Copilot — AI in Your M365",
  emoji: "🪟",
  accentColor: "#0078d4",
  audioTrack: "/audio/concrete-riot-instrumental.mp3",
  characterName: "Jake",
  characterRole: "17-year-old guitarist and music club officer",
  characterBlurb: "Jake discovers the AI already living inside the music club's Microsoft 365",
  characterImage: "/images/guitarplayer1.png",
  maestroImage: "/images/maestro-jake.png",
  maestroLine: "The last time he was drowning in meeting notes and spreadsheets...",
  maestroSubline: "Jake plays guitar AND runs the AI now under Tyler's presidential lead.",
  intro: {
    sceneImage: "/images/scene-jake-copilot.png",
    sceneColor: "#060810",
    noteOrigin: { bottom: "42%", left: "48%" },
    beats: [
      { type: "location",  text: "SCHOOL ADMIN OFFICE · MONDAY · 7:44 AM" },
      { type: "narration", text: "Jake had been running the music club's guitar section on willpower, while the school ran on paper and habit." },
      { type: "dialogue",  speaker: "Tyler", text: "The district rolled out Microsoft Copilot. Jake, it's been in our M365 apps all year. As club president, I need you on top of this." },
      { type: "final",     text: "The tools were always there. The guitarist just had to pick up the baton." },
    ],
  },
  duration: "9 min",
  description:
    "Discover how Microsoft Copilot transforms your daily M365 workflow — Word, Excel, Teams, Outlook — turning hours of admin into minutes of flow.",
  tagline: "The AI already in your computer. Most people never unlock it.",
  aiModel:  "copilot" as const,
  mondayPrompt: "In Microsoft Copilot (Teams or Word): 'Using my recent emails and meeting notes from the last [X days], draft a status update for [STAKEHOLDER]. Include: 1) What was decided, 2) What is in progress, 3) What is blocked and needs input. Keep it under 150 words. Flag if any information seems outdated or contradictory.'",
  felipeOutroVideo:   "/videos/felipe-game11.mp4",
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
          speaker: "Jake", avatar: "jake" as const,
          text: "Concert's in three weeks. I need a proposal, a budget sheet, twenty emails, and to run a meeting they already skipped.",
        },
        {
          speaker: "Tyler",
          avatar: "npc" as const,
          npcKey: "tyler" as const,
          text: "Jake. Can I show you something before you open Word?",
        },
        {
          speaker: "Jake", avatar: "jake" as const,
          text: "Tyler, I really don't have time —",
        },
        {
          speaker: "Tyler",
          avatar: "npc" as const,
          npcKey: "tyler" as const,
          text: "Click the Copilot icon in the top right. It's been there all year.",
        },
        {
          speaker: "Jake", avatar: "jake" as const,
          text: "...that purple sparkle? I thought it was just a decorative button.",
        },
        {
          speaker: "Tyler",
          avatar: "npc" as const,
          npcKey: "tyler" as const,
          text: "It's an AI with access to our school emails, files, calendar, and Teams chats. It's been waiting since September.",
        },
        {
          speaker: "Jake", avatar: "jake" as const,
          text: "Since September? And I've been doing everything manually for seven months.",
        },
        {
          speaker: "Tyler",
          avatar: "npc" as const,
          npcKey: "tyler" as const,
          text: "Most people never use it, assuming it's just a chatbot. But it's much more.",
        },
        {
          speaker: "Jake", avatar: "jake" as const,
          text: "Wait — the school actually paid for this and nobody told us?",
        },
        {
          speaker: "Tyler",
          avatar: "npc" as const,
          npcKey: "tyler" as const,
          text: "It's included in school plans. The icon is just the tip of a massive iceberg.",
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
          wrongFeedback: "Copilot runs on **Microsoft Cloud Infrastructure**, not locally — its true power is **M365 Contextual Access** to your real files, emails, and meetings.",
          wrongStoryText: "Jake brags about local speed to his team. Then Copilot pulls up yesterday's meeting notes mid-sentence. 'It's not fast,' Riya says. 'It's connected.'",
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
          wrongFeedback: "That describes a generic chatbot — Copilot's power is **Contextual Access**, connecting directly to your M365 files, emails, and meetings without manual uploads.",
          wrongStoryText: "Jake reaches for the upload button. The Copilot icon pulses gently. 'I already know where your files live,' it seems to whisper.",
        },
        {
          label: "D",
          text: "Copilot is a premium add-on that costs extra on top of a Microsoft 365 subscription",
          correct: false,
          feedback:
            "Copilot is included in many Microsoft 365 Education, Business, and Enterprise plans. Whether it's available depends on your organisation's license — check for the sparkle icon in your toolbar. If it's there, it's already paid for.",
          wrongFeedback: "Check your toolbar for the sparkle icon — if it's there, **Copilot Access** is already included in your organisation's M365 license, no extra cost required.",
          wrongStoryText: "Jake hesitates, wallet in hand. Tyler grins and points to the glowing sparkle icon already sitting in Jake's toolbar. 'It's been yours all along.'",
        },
      ],
      xpAward: 100,
    },

    // ── SCENE 2 ── Quiz: What IS Copilot ─────────────────────────────────────
    {
      id: "w11-s2",
      type: "quiz",
      scenarioText:
        "Tyler explains Copilot's architecture. It connects LLMs to your Microsoft Graph, a secure layer mapping your emails, files, meetings, and contacts. Asking it to 'draft a follow-up email' or 'summarise the budget discussion' pulls real data from your Teams transcripts and Outlook. Your data stays private, secure, and governed by your existing M365 permissions.",
      question:
        "Jake asks Copilot in Teams: 'What did we decide about the concert date in our last club meeting?' How does Copilot find the answer?",
      choices: [
        {
          label: "A",
          text: "Copilot searches the public internet for information about Jake's music club",
          correct: false,
          feedback:
            "Copilot does not search the public internet for your personal meeting content — that information doesn't exist there. Copilot uses Microsoft Graph to access your organisation's actual data: your Teams transcripts, emails, and calendar entries.",
          wrongFeedback: "Your club meetings aren't public — Copilot uses **Microsoft Graph** to securely retrieve your private Teams transcripts, never the open internet.",
          wrongStoryText: "Jake imagines his club secrets floating online. Tyler shakes his head. 'Copilot doesn't go out there — it goes in here,' he says, tapping the screen.",
        },
        {
          label: "B",
          text: "Copilot asks Tyler to paste the meeting notes into the chat window first",
          correct: false,
          feedback:
            "That's how a generic chatbot works. Copilot's advantage is that it already has access to your Teams meeting transcripts through Microsoft Graph — no copy-pasting required. It finds the relevant meeting automatically.",
          wrongFeedback: "Unlike generic chatbots, Copilot's **Microsoft Graph Integration** already accesses your Teams transcripts directly — no copy-pasting or manual sharing needed.",
          wrongStoryText: "Jake starts typing the meeting notes. Copilot's response appears before he finishes. 'I already read it,' the interface seems to say. Tyler laughs warmly.",
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
          wrongFeedback: "**Permission-Aware Access** means Copilot inherits your existing M365 rights — it reads only what you can already see, with no extra admin approval per query.",
          wrongStoryText: "Jake looks toward the IT office nervously. Tyler stops him. 'Your permissions are already set. Copilot just respects them automatically,' he explains with a nod.",
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
          speaker: "Jake", avatar: "jake" as const,
          text: "First up, the concert proposal for Principal Okafor. Last year this took me three hours to write.",
        },
        {
          speaker: "Tyler",
          avatar: "npc" as const,
          npcKey: "tyler" as const,
          text: "Open Word, click the Copilot icon in the toolbar, and select 'Draft with Copilot.'",
        },
        {
          speaker: "Jake", avatar: "jake" as const,
          text: "Okay, prompting: 'Draft a spring concert proposal. Include overview, date/venue options, $800 budget, and responsibilities.'",
        },
        {
          speaker: "Tyler",
          avatar: "npc" as const,
          npcKey: "tyler" as const,
          text: "Hit Generate.",
        },
        {
          speaker: "Jake", avatar: "jake" as const,
          text: "Wow, it wrote a full four-page proposal with a budget table and timeline in twelve seconds!",
        },
        {
          speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const,
          text: "That is insane. That really took you three hours last year?",
        },
        {
          speaker: "Jake", avatar: "jake" as const,
          text: "It's a bit formal and has too many bullet points, but the structure is all there. I just need to edit it.",
        },
        {
          speaker: "Tyler",
          avatar: "npc" as const,
          npcKey: "tyler" as const,
          text: "Select a section and ask Copilot to rewrite it in a warmer, more conversational tone.",
        },
        {
          speaker: "Jake", avatar: "jake" as const,
          text: "Done! It sounds exactly like me now. The whole draft took eleven minutes, editing included.",
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
          wrongFeedback: "No template needed — **Prompt Specificity** is the real driver, giving Copilot your purpose, audience, sections, and goal to build from scratch.",
          wrongStoryText: "Jake clicks open an old document, searching for a template. The blank page was never the problem. His words — specific and clear — were always the key.",
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
          wrongFeedback: "Templates don't drive Copilot's output quality — **Prompt Detail** does, giving Copilot the purpose, audience, and structure it needs to draft effectively.",
          wrongStoryText: "Jake scrolls through the template gallery. Tyler gently closes the panel. 'Tell Copilot what you need — that's your real template,' he says quietly.",
        },
        {
          label: "D",
          text: "He typed the full document himself first and then asked Copilot to improve it",
          correct: false,
          feedback:
            "Tyler did the opposite — he let Copilot draft first, then refined the result. Writing the full document himself first would defeat the purpose of 'Draft with Copilot.' The gain is precisely that you start with Copilot's draft and edit it, not the other way around.",
          wrongFeedback: "The workflow is reversed — **AI-Assisted Drafting** means Copilot writes first, and you refine, saving time by editing rather than starting from nothing.",
          wrongStoryText: "Jake types furiously, filling the page himself. Tyler watches, puzzled. 'You just did Copilot's job for it,' he says. Jake slowly puts down his pen.",
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
          speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const,
          text: "Dude, you missed the logistics meeting. Twenty minutes of chaos.",
        },
        {
          speaker: "Jake", avatar: "jake" as const,
          text: "I was stuck in Mr. Patel's class. What did we decide?",
        },
        {
          speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const,
          text: "No idea. I was zoning out. Maya was taking notes but left early.",
        },
        {
          speaker: "Jake", avatar: "jake" as const,
          text: "Typical. But Teams has Copilot, and it transcribes everything automatically.",
        },
        {
          speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const,
          text: "So we can just ask it?",
        },
        {
          speaker: "Jake", avatar: "jake" as const,
          text: "[opens Teams Recap] 'Summarise the key decisions and list action items with owners.'",
        },
        {
          speaker: "AI",
          avatar: "npc" as const,
          npcKey: "ai" as const,
          text: "Key decisions: (1) Concert date confirmed as May 30th. (2) Venue: school auditorium. (3) Ticket price: $8. Action items: Jake — finalise setlist by Wednesday. Tyler — coordinate PA system with Mr. Diaz. Maya — design poster by Friday.",
        },
        {
          speaker: "Jake", avatar: "jake" as const,
          text: "Wow, it assigned me to finish the setlist. That would've fallen through the cracks.",
        },
        {
          speaker: "Tyler", avatar: "npc" as const, npcKey: "tyler" as const,
          text: "So missing a meeting isn't a disaster anymore.",
        },
        {
          speaker: "Jake", avatar: "jake" as const,
          text: "We should still show up, but it's a great safety net.",
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
          wrongFeedback: "No manual saving is needed — **Meeting Transcription** auto-generates a live text record that Copilot analyses, completely separate from the chat log.",
          wrongStoryText: "Jake searches for a saved chat log in OneDrive, finding nothing. 'The transcript does the work automatically,' Tyler says, 'if transcription was switched on.'",
        },
        {
          label: "B",
          text: "The meeting must have been recorded to video — Copilot reads the video file",
          correct: false,
          feedback:
            "Copilot uses the meeting transcript, not the video recording. Transcription generates a time-stamped text record of everything said, which is what Copilot analyses to produce summaries and action items. Video recording and transcription are separate settings.",
          wrongFeedback: "Copilot reads the **Meeting Transcript** — a separate auto-generated text record — not the video file, which is why transcription must be enabled independently.",
          wrongStoryText: "Jake assumes the recording was enough. The Recap tab stays blank. 'Video and transcript are different switches,' Tyler says quietly. 'One wasn't flipped.'",
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
          wrongFeedback: "**Meeting Transcription** is Copilot's fuel — without a text record of the meeting, there's nothing for it to analyse, regardless of your role.",
          wrongStoryText: "Jake clicks the Recap tab confidently. The console flickers: 'Organiser status means nothing here — did anyone hit record?'",
        },
      ],
      xpAward: 100,
    },

    // ── SCENE 5 ── Quiz: Copilot in Excel ─────────────────────────────────────
    {
      id: "w11-s5",
      type: "quiz",
      scenarioText:
        "Jake opens the music club's ticket sales spreadsheet — 80 rows of dates, ticket types, and revenue. Instead of manually writing SUMIF formulas or building charts, he uses Copilot in Excel: 'Analyse this data. Which show format made the most revenue? Create a trend chart.' In 30 seconds, Copilot builds the chart and notes a low-attendance anomaly in October, suggesting he check for a competing school event.",
      question:
        "Jake asks Copilot in Excel to analyse 80 rows of ticket data and create a chart — all in plain English. What is Copilot doing under the hood to make this work?",
      choices: [
        {
          label: "A",
          text: "Copilot exports the data to an external AI service that returns a static image of the chart",
          correct: false,
          feedback:
            "Copilot works natively inside Excel — it doesn't export your data to an external service to generate a static image. The charts and analysis it creates are real, live Excel objects: editable, interactive, and formatted to Excel standards.",
          wrongFeedback: "Copilot works **natively inside Excel** — your data never leaves the workbook, and every chart it builds is a real, editable Excel object.",
          wrongStoryText: "Jake frowns at the screen. The console pulses: 'Your data didn't go anywhere, Jake — it never left the room.'",
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
          wrongFeedback: "There's no **'Prepare for AI'** button — Copilot reads your existing Excel table directly, no conversion step required.",
          wrongStoryText: "Jake searches every ribbon tab, confused. The console chimes gently: 'Stop looking for a door that doesn't exist, Jake.'",
        },
        {
          label: "D",
          text: "Copilot can only describe what's in the data — it cannot create charts or write formulas",
          correct: false,
          feedback:
            "Copilot in Excel can do all three: describe patterns in plain English, generate formulas (including complex ones like SUMIF, XLOOKUP, and array formulas), and create charts. The analysis Jake got — including the inserted chart and the anomaly flag — is well within its standard capability.",
          wrongFeedback: "Copilot in Excel goes beyond description — it performs **formula generation**, chart creation, and anomaly detection all natively.",
          wrongStoryText: "Jake types a cautious query. The console responds sharply: 'You asked for a spark — Copilot hands you the whole firework.'",
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
          "Jake needs to email Mr. Diaz, the school tech coordinator who set up the PA system and lights for free, saving the club $300. Jake wants to use 'Draft with Copilot' in Outlook to turn his rough bullet points (donated Saturday, saved $300, sound was professional, wants to thank him publicly) into a warm, sincere message.",
        goal:
          "Write the prompt Jake would type into Copilot's 'Draft with Copilot' field in Outlook to generate this thank-you email from his bullet points.",
        placeholder: "Write Jake's Copilot prompt for the Outlook thank-you email...",
      },
      xpAward: 150,
    },

    // ── NEAR-TRANSFER: Same Copilot, Different Collaboration ──────────────────
    {
      id:       "w11-near-transfer",
      type:     "learn",
      location: "SCHOOL LIBRARY · MONDAY · 3:15 PM",
      xpAward:  0,
      concept: {
        title: "Same Copilot. Different Collaboration.",
        body:  "Henry, an operations associate at a logistics firm, had to prepare a project post-mortem report. He had 15 sources of unstructured data: email threads in Outlook, spreadsheets tracking budget overruns, and Teams transcripts debating lessons. Instead of spending days copying text, Henry used M365 Copilot in Word. He created a blank document and prompted: 'Read the email thread 'Project Neptune Delays', the budget spreadsheet in my Drive, and the Teams meeting transcript from yesterday. Write a structured post-mortem report. Section 1: Summary. Section 2: Budget Overrun Reasons. Section 3: Recommendations.' Copilot drafted a comprehensive post-mortem in seconds. Same Copilot integration. Completely different business report.",
      },
      learnHighlight: "Copilot's true strength is bridging the gaps between your office apps — pulling raw text from emails, data from spreadsheets, and discussions from chat into a unified document in one place.",
    },

    // ── SCENE 6 ── Boss: Conductor Test ──────────────────────────────────────
    {
      id: "w11-s6",
      type: "boss",
      scenarioText:
        "CONDUCTOR TEST — It's concert week. To brief Principal Okafor for a district board member's visit, Jake must compile key decisions, action items, and budgets from the last five club meetings into one summary document using Copilot.",
      question:
        "Jake needs a briefing document for Principal Okafor covering the key decisions, action items, and budget mentions from the last five Teams meetings. What is the most effective way to use Copilot to produce this?",
      choices: [
        {
          label: "A",
          text: "Open each of the five meeting recaps in Teams one at a time, copy the summaries manually, paste them into Word, and ask Copilot to tidy up the formatting",
          correct: false,
          feedback:
            "This misses the whole point — you're doing the cross-meeting synthesis yourself. Copilot is capable of pulling information across multiple meetings in a single query. Manual copy-paste across five sources is exactly the kind of work Copilot eliminates when used properly.",
          wrongFeedback: "Manual copy-paste defeats **AI-powered cross-source synthesis** — Copilot can pull all five meetings in one single, structured prompt.",
          wrongStoryText: "Jake opens five tabs and sighs. The console dims: 'You just became the machine, Jake. That wasn't the plan.'",
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
          wrongFeedback: "Delegating to Tyler recreates the same bottleneck — **Microsoft Graph** lets Copilot synthesise five meetings instantly, no human intermediary needed.",
          wrongStoryText: "Tyler looks overwhelmed with five notebooks. The console flashes: 'Same problem, different person. Copilot was right there, Jake.'",
        },
        {
          label: "D",
          text: "Use Copilot in Teams to email Principal Okafor directly from each meeting recap using the 'Share summary' button",
          correct: false,
          feedback:
            "Individual per-meeting share buttons produce five separate emails, not one coherent briefing document. The task requires cross-meeting synthesis — pulling threads from multiple sources into a single, organised summary. That's a Word + Copilot task, not a one-click share.",
          wrongFeedback: "Five separate emails aren't a briefing — **cross-meeting synthesis** into one coherent document requires Word's 'Draft with Copilot', not individual share buttons.",
          wrongStoryText: "Principal Okafor's inbox floods with five emails. The console sighs: 'You gave her noise, Jake, not a briefing.'",
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
          wrongStoryText: "Jake opens Claude, then stares at three weeks of emails to copy. The console murmurs: 'Great writer — wrong key for this lock.'",
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
          wrongStoryText: "Jake pastes email after email into ChatGPT. The console crackles: 'You brought the ingredients yourself. Copilot already had the kitchen.'",
          },
        ],
      },
    },

    // ─── HANDOFF ─────────────────────────────────────────────────────────────
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
          text: "So Copilot is everywhere in M365. It's about integration, not magic. It knows your emails, meetings, and files.",
        },
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "But it can't proactively help people who don't know what to ask.",
        },
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "Our 47 club members need something purpose-built. A custom AI just for the club.",
        },
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "So I tried Copilot Studio. It's a no-code AI agent builder. You define what it knows and how it talks.",
        },
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "I built MelodyBot over the weekend to handle FAQs, schedules, and gear booking. Let me show you.",
        },
      ],
    },

  ],
}
