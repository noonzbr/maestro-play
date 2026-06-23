import { Game } from "./types"

export const game12: Game = {
  slug: "copilot-studio",
  week: 12,
  free: true,
  title: "Copilot Studio — Build Your Own AI Agent",
  emoji: "🏗️",
  accentColor: "#8764b8",
  audioTrack: "/audio/concrete-riot-instrumental.mp3",
  characterName: "Jake",
  characterRole: "17-year-old guitarist and music club officer",
  characterBlurb: "Jake builds a no-code AI assistant for the music club under President Tyler's guidance",
  characterImage: "/images/guitarplayer1.png",
  maestroImage: "/images/maestro-jake.png",
  maestroLine:
    "The last time he thought 'building AI' required a computer science degree...",
  maestroSubline: "Jake deployed his first AI agent. The music plays on — and the bot handles the questions.",
  intro: {
    sceneImage: "/images/scene-jake-studio.png",
    sceneColor: "#08060a",
    noteOrigin: { bottom: "42%", left: "48%" },
    beats: [
      { type: "location",  text: "MUSIC CLUB ROOM · FRIDAY · 4:02 PM" },
      { type: "narration", text: "Thirty-one emails with the same questions — Tyler was the club president, but Jake was handling the FAQ." },
      { type: "dialogue",  speaker: "Tyler", text: "Build a no-code bot with Copilot Studio. Drag and drop, live by Saturday. Or keep answering the same questions forever." },
      { type: "final",     text: "You don't need to write the code. You need to understand the problem well enough to hand it off." },
    ],
  },
  duration: "10 min",
  description:
    "Learn how Microsoft Copilot Studio lets anyone build custom AI agents — with a knowledge base, personality, and real integrations — without writing code.",
  tagline: "You don't need to code to build AI. You need to think clearly.",
  aiModel:  "copilot" as const,
  mondayPrompt: "In Copilot Studio, create an agent for [USE CASE]. Write these system instructions: 'You are [Agent Name], the [team/company] assistant. You answer questions about [SCOPE]. You always: [3 behaviors]. You never: [3 hard limits — especially never guess on [SENSITIVE TOPICS]]. When you do not know something, say: I am not certain — please contact [PERSON/EMAIL]. Your tone is: [warm/professional/technical].'",
  felipeOutroVideo:   "/videos/felipe-game12.mp4",
  nextGame: {
    slug:         "prompt-lab",
    character:    "Maya",
    teaserLine:   "Jake built an AI agent. Now it's time to go meta — the entire next game is about the craft of prompting itself. Maya is a UX designer who turned prompt engineering into a superpower. The before and after will shock you.",
    previewImage: "/images/maya.png",
  },
  scenes: [
    // ── Scene 1 ── The Problem ─────────────────────────────────────────────────
    {
      id: "w12-s1",
      type: "scenario",
      character: "Jake, Music Club Officer, 17",
      location: "WESTBROOK HIGH · MUSIC ROOM · FRIDAY · 3:45 PM",
      dialogue: [
        {
          speaker: "Jake", avatar: "jake",
          text:
            "Thirty-one emails this week. Same questions over and over. I'm a guitarist, not an FAQ page.",
        },
        {
          speaker: "Tyler", avatar: "npc", npcKey: "tyler",
          text: "As president, I need you focused on music, not admin. Why not put the answers on the website?",
        },
        {
          speaker: "Jake", avatar: "jake",
          text:
            "They're in the handbook, but people don't read it. I need something that auto-answers.",
        },
        {
          speaker: "Tyler", avatar: "npc", npcKey: "tyler",
          text:
            "You need an interactive chatbot on the site. And you don't need to code it.",
        },
        {
          speaker: "Jake", avatar: "jake",
          text: "I'm a guitarist, not a developer. What is this?",
        },
        {
          speaker: "Tyler", avatar: "npc", npcKey: "tyler",
          text:
            "Microsoft Copilot Studio. It's a no-code drag-and-drop platform for building custom AI agents.",
        },
        {
          speaker: "Jake", avatar: "jake",
          text: "And it understands natural language?",
        },
        {
          speaker: "Tyler", avatar: "npc", npcKey: "tyler",
          text:
            "Yes, LLMs power it. Students can type naturally, and it gets the intent. Let's build it.",
        },
      ],
      concept: {
        title: "What Is Microsoft Copilot Studio?",
        body: "Microsoft Copilot Studio is a low-code/no-code platform for building custom AI agents — also called copilots — that can answer questions, automate tasks, and connect to your organisation's data.\n\nKey facts:\n• It's the evolution of Power Virtual Agents, now part of the Microsoft Power Platform\n• No programming required — you build using a visual designer, not code\n• Agents are powered by large language models (including GPT-4 under the hood)\n• You can connect agents to data sources: SharePoint, websites, uploaded documents, APIs\n• Finished agents can be published to websites, Teams, mobile apps, and more\n\nWho uses it:\nIT admins, HR teams, teachers, student leaders, small business owners — anyone who needs a smart assistant and doesn't want to wait for a developer.\n\nThe core idea: you define what the agent knows, how it should behave, and where it lives. Copilot Studio handles the AI and the infrastructure.",
      },
      question:
        "What is Microsoft Copilot Studio, and what problem is it designed to solve?",
      choices: [
        {
          label: "A",
          text: "A Microsoft 365 add-in that automatically replies to emails using pre-written templates",
          correct: false,
          feedback:
            "Copilot Studio is not an email auto-responder or template system. It's a full AI agent builder — you create a conversational agent that understands natural language and responds intelligently, not a simple reply bot.",
          wrongFeedback: "Copilot Studio is a **low-code AI agent builder** — it creates intelligent, conversational agents, not simple auto-reply template systems.",
          wrongStoryText: "Jake expects a polished out-of-office tool. The console hums quietly: 'You found a blueprint for a brain — and called it a sticky note.'",
        },
        {
          label: "B",
          text: "A low-code/no-code platform for building custom AI agents that understand natural language and connect to your data — without writing code",
          correct: true,
          feedback:
            "Exactly right. Copilot Studio is the Power Platform's no-code AI agent builder. You define topics, upload knowledge, configure conversation flows, and publish — all through a visual interface. The AI handles the language understanding.",
        },
        {
          label: "C",
          text: "A coding environment where developers write Python scripts to create custom chatbots for Microsoft Teams",
          correct: false,
          feedback:
            "Copilot Studio is explicitly designed to not require coding. It uses a visual designer, not a script editor. Developers can extend it with code if they want, but the whole point is that non-developers can build fully functional agents.",
          wrongFeedback: "Copilot Studio's power is its **Low-Code/No-Code** design — a visual builder replaces Python scripts entirely, empowering non-developers.",
          wrongStoryText: "Jake blinks at the screen. No terminal, no syntax errors — just drag-and-drop flows. 'Code isn't the only way to build,' the console reminds him.",
        },
        {
          label: "D",
          text: "A plugin for Microsoft Word that generates FAQ documents from your existing content",
          correct: false,
          feedback:
            "That describes a document generation feature, not an AI agent platform. Copilot Studio builds interactive agents that have live conversations with users — not static documents.",
          wrongFeedback: "Copilot Studio builds **Conversational AI Agents** for live dialogue — not static FAQ documents that sit on a page.",
          wrongStoryText: "Jake clicks through the interface. Conversations branch and respond in real time. 'This talks back,' he murmurs, surprised.",
        },
      ],
      xpAward: 100,
    },

    // ── Scene 2 ── What Copilot Studio Is ─────────────────────────────────────
    {
      id: "w12-s2",
      type: "quiz",
      scenarioText:
        "Jake opens Copilot Studio at studio.microsoft.com. Instead of a code editor, he finds a visual designer with conversation flow diagrams, a 'Topics' panel, and a 'Knowledge' section. Formerly called Power Virtual Agents, Copilot Studio handles both structured dialogues (Topics) and generative AI answers from uploaded files.",
      question:
        "Jake wants to understand where Copilot Studio fits in Microsoft's product ecosystem. What is its relationship to Power Virtual Agents?",
      choices: [
        {
          label: "A",
          text: "Copilot Studio and Power Virtual Agents are separate competing products — companies must choose between them",
          correct: false,
          feedback:
            "They are not competitors. Power Virtual Agents was rebranded and evolved into Copilot Studio in 2023. All Power Virtual Agents functionality exists within Copilot Studio, which adds generative AI capabilities on top.",
          wrongFeedback: "Power Virtual Agents wasn't replaced by a competitor — it **evolved** directly into Copilot Studio through a **Rebranding** in 2023.",
          wrongStoryText: "Jake reads the release notes. One product, one story — just a new name and new powers. 'They grew up,' he thinks.",
        },
        {
          label: "B",
          text: "Power Virtual Agents was renamed and upgraded to become Copilot Studio, which adds generative AI on top of the original no-code bot builder",
          correct: true,
          feedback:
            "Correct. Microsoft unified and elevated their conversational AI platform under the Copilot Studio brand in 2023, adding generative AI features — like document-grounded answering — to what was Power Virtual Agents. It's the same platform, evolved.",
        },
        {
          label: "C",
          text: "Copilot Studio is a premium enterprise upgrade that replaces Power Virtual Agents only for Fortune 500 companies",
          correct: false,
          feedback:
            "Copilot Studio is not restricted to enterprise. It's available to Microsoft 365 and Power Platform subscribers at various license levels — including educational institutions. Jake can use it for his school music club.",
          wrongFeedback: "Copilot Studio isn't exclusive to enterprises — its **Licensing** spans Microsoft 365 and Power Platform tiers, including schools.",
          wrongStoryText: "Jake checks his school account. Access granted. MelodyBot's home is right here — no Fortune 500 budget required.",
        },
        {
          label: "D",
          text: "Power Virtual Agents handles voice interfaces while Copilot Studio handles text — they work together as a pair",
          correct: false,
          feedback:
            "This is not the distinction. Power Virtual Agents was the predecessor product, not a specialised voice layer. Copilot Studio is the unified platform that handles both structured conversation flows and generative AI responses.",
          wrongFeedback: "Power Virtual Agents was a **Predecessor Platform**, not a voice specialist — Copilot Studio unifies **Structured Topics** and **Generative AI** together.",
          wrongStoryText: "Jake finds no separate voice console — just one unified studio. 'It was always one thing,' he realises, scrolling back through the history.",
        },
      ],
      xpAward: 100,
    },

    // ── Scene 3 ── Building MelodyBot ──────────────────────────────────────────
    {
      id: "w12-s3",
      type: "scenario",
      character: "Jake",
      location: "WESTBROOK HIGH · COMPUTER LAB · SATURDAY · 11:00 AM",
      dialogue: [
        {
          speaker: "Tyler", avatar: "npc", npcKey: "tyler",
          text:
            "Step one: click 'New agent', name it, and write its description to set its personality.",
        },
        {
          speaker: "Jake", avatar: "jake",
          text: "Name: MelodyBot. And for the description...",
        },
        {
          speaker: "Jake", avatar: "jake",
          text:
            "[types]: 'MelodyBot helps students learn about the Music Club. It's friendly, encouraging, and focused only on club info.'",
        },
        {
          speaker: "Tyler", avatar: "npc", npcKey: "tyler",
          text:
            "Good. That description defines its boundaries. Now let's set up Topics, which are conversational paths.",
        },
        {
          speaker: "Jake", avatar: "jake",
          text: "Like — 'how to join' is one topic?",
        },
        {
          speaker: "Tyler", avatar: "npc", npcKey: "tyler",
          text:
            "Yes. Each Topic has trigger phrases and a response flow, which can branch based on questions.",
        },
        {
          speaker: "Jake", avatar: "jake",
          text:
            "So I set up a 'How to Join' topic with triggers like 'sign up', and it walks them through?",
        },
        {
          speaker: "Tyler", avatar: "npc", npcKey: "tyler",
          text:
            "Exactly. The AI infers intent, so 'yo i wanna be in the band' routes to the same topic.",
        },
        {
          speaker: "Jake", avatar: "jake",
          text: "That's actually impressive. This is starting to feel real.",
        },
      ],
      concept: {
        title: "Topics, Triggers, and Conversation Flows",
        body: "In Copilot Studio, a Topic is a self-contained conversation unit — a defined subject the agent knows how to handle.\n\nEach Topic has:\n\nTrigger phrases — words or phrases that activate it. You add a few examples; the AI generalises to understand variations you haven't listed.\n\nA conversation flow — what the agent says, in what order. Flows can include:\n• Simple message nodes (agent responds with text)\n• Question nodes (agent asks a follow-up and branches based on the answer)\n• Condition nodes (if/else logic based on user input)\n• Action nodes (do something — look up data, send an email, etc.)\n\nSystem Topics — built-in topics Copilot Studio creates automatically:\n• Greeting — what the agent says when a conversation starts\n• Goodbye — how it ends a conversation\n• Escalate — what it does when it can't answer (usually: offer to connect to a human)\n• Fallback — what it says when it genuinely doesn't understand\n\nYou don't need to build every topic from scratch. Generative AI answering can handle many questions automatically from your uploaded knowledge — Topics are for structured, step-by-step interactions where the exact flow matters.",
      },
      question:
        "Jake sets up a 'How to Join' topic with three trigger phrases. A student types 'I wanna audition for the orchestra.' How does Copilot Studio handle this?",
      choices: [
        {
          label: "A",
          text: "The agent ignores the message because 'audition for the orchestra' is not one of Jake's exact trigger phrases",
          correct: false,
          feedback:
            "Copilot Studio doesn't require exact string matching. It uses AI to understand intent. 'Audition for the orchestra' signals joining intent clearly — the agent recognises this and routes to the 'How to Join' topic, even without a literal match.",
          wrongFeedback: "Copilot Studio uses **Intent Recognition** to understand meaning — not exact string matching — so natural variations always reach the right **Topic**.",
          wrongStoryText: "The message lands. MelodyBot doesn't hesitate — it understands 'audition' means joining. Jake grins. 'She gets it.'",
        },
        {
          label: "B",
          text: "The agent uses AI to infer the intent and routes the student to the 'How to Join' topic, even without a literal match",
          correct: true,
          feedback:
            "Correct. Trigger phrases are examples, not exhaustive lists. The underlying language model generalises — it understands that wanting to audition means wanting to join. Jake doesn't have to anticipate every phrasing variation.",
        },
        {
          label: "C",
          text: "The agent asks the student to rephrase their question using one of the exact trigger phrases Jake defined",
          correct: false,
          feedback:
            "Asking users to rephrase in a specific way defeats the purpose of a natural-language agent. Copilot Studio is built to handle the natural variation in how people express the same idea — the burden of exact phrasing is on the system, not the user.",
          wrongFeedback: "In **Natural Language Understanding**, the system absorbs phrasing variation — users should never be forced to match your exact **Trigger Phrases**.",
          wrongStoryText: "Jake imagines a student typing carefully, word by word. 'That's not a conversation,' he thinks. 'That's a form.'",
        },
        {
          label: "D",
          text: "The agent routes the message to the Fallback topic and tells the student it doesn't understand",
          correct: false,
          feedback:
            "Fallback only fires when the agent genuinely cannot determine intent. 'I wanna audition for the orchestra' is a clear signal of joining intent — the AI understands this. Fallback is a safety net, not the default for anything slightly unexpected.",
          wrongFeedback: "**Fallback** is a last resort — when **Intent Recognition** clearly reads 'audition,' the agent routes correctly rather than surrendering to uncertainty.",
          wrongStoryText: "MelodyBot pauses only a beat, then routes smoothly. Jake exhales. 'Fallback stays in its lane,' he notes approvingly.",
        },
      ],
      xpAward: 100,
    },

    // ── Scene 4 ── Knowledge Base ──────────────────────────────────────────────
    {
      id: "w12-s4",
      type: "scenario",
      character: "Jake",
      location: "WESTBROOK HIGH · COMPUTER LAB · SATURDAY · 12:30 PM",
      dialogue: [
        {
          speaker: "Jake", avatar: "jake",
          text:
            "Topics are set for joining. But what about all the policies in the handbook? I can't build a Topic for everything.",
        },
        {
          speaker: "Tyler", avatar: "npc", npcKey: "tyler",
          text:
            "You don't have to. Just upload the handbook PDF. Generative AI will answer questions directly from it.",
        },
        {
          speaker: "Jake", avatar: "jake",
          text: "Just upload it and it knows?",
        },
        {
          speaker: "Tyler", avatar: "npc", npcKey: "tyler",
          text:
            "Yes, Generative Answers searches the PDF, answers using its content, and even cites the source.",
        },
        {
          speaker: "Jake", avatar: "jake",
          text: "What else counts besides PDFs?",
        },
        {
          speaker: "Tyler", avatar: "npc", npcKey: "tyler",
          text:
            "Word files, SharePoint, websites. Point it to a SharePoint folder and it updates automatically.",
        },
        {
          speaker: "Jake", avatar: "jake",
          text:
            "So when I update the SharePoint file next semester, the bot learns it automatically?",
        },
        {
          speaker: "Tyler", avatar: "npc", npcKey: "tyler",
          text:
            "Exactly. You just maintain the source documents, and the bot reflects the changes.",
        },
        {
          speaker: "Jake", avatar: "jake",
          text: "This is what I should have had at the start of the year.",
        },
      ],
      concept: {
        title: "Knowledge Sources and Generative Answers",
        body: "The Knowledge section in Copilot Studio is where you connect your agent to real information.\n\nSupported knowledge sources:\n• Uploaded files — PDF, Word, PowerPoint, Excel\n• SharePoint sites and document libraries\n• Public websites (the agent crawls and indexes them)\n• Dataverse tables (Microsoft's data platform)\n• Custom APIs via Power Automate connectors\n\nHow Generative Answers works:\nWhen a student asks a question that doesn't match any Topic, the agent searches connected knowledge sources, finds the most relevant passage, and generates a response based on that content — not a fabricated answer.\n\nKey benefits:\n• No topic required for every possible question — the knowledge base handles the long tail\n• Answers cite their source, so users can verify\n• Connected sources (like SharePoint) stay in sync automatically — update the document, the bot updates too\n• You control which sources the agent is allowed to search\n\nImportant distinction:\nTopics = structured flows you design (step-by-step, branching)\nGenerative Answers = AI-powered responses from your documents (flexible, document-grounded)\n\nMost agents use both: Topics for critical journeys, Generative Answers for everything else.",
      },
      question:
        "Jake uploads the club handbook as a PDF. A student asks MelodyBot about the policy for missing a rehearsal — something Jake never created a Topic for. What happens?",
      choices: [
        {
          label: "A",
          text: "The agent triggers the Fallback topic and tells the student to email Jake directly",
          correct: false,
          feedback:
            "Fallback fires when the agent has no knowledge to draw from. Jake uploaded the handbook — which presumably covers attendance policy. The Generative Answers feature searches the document and responds from the content, rather than giving up.",
          wrongFeedback: "**Generative Answers** actively reads your uploaded **Knowledge Sources** — so the agent responds from documents even without a matching Topic.",
          wrongStoryText: "The handbook sat quietly in the Knowledge panel — but MelodyBot found the answer anyway. Jake hadn't written a single word of that response.",
        },
        {
          label: "B",
          text: "The agent uses Generative Answers to search the uploaded handbook, find the relevant section, and generate a response grounded in that content",
          correct: true,
          feedback:
            "Exactly right. Generative Answers is specifically designed for this — questions that don't match any pre-built Topic but are covered in connected knowledge sources. The agent finds the rehearsal policy in the PDF and answers from it, without Jake needing to build a Topic for every policy.",
        },
        {
          label: "C",
          text: "The agent cannot answer because only Topics can produce responses — the PDF is just for decoration",
          correct: false,
          feedback:
            "This confuses Topics (structured conversation flows) with knowledge sources (documents the AI can read). Generative Answers is a core Copilot Studio feature that lets the agent respond to questions from uploaded documents, independent of Topics.",
          wrongFeedback: "**Topics** handle structured flows; **Generative Answers** reads documents — your PDF is an active **Knowledge Source**, not decoration.",
          wrongStoryText: "Jake stares at the uploaded PDF. It wasn't just sitting there — MelodyBot had already read every page, ready to answer.",
        },
        {
          label: "D",
          text: "The agent generates a creative answer based on general AI knowledge, ignoring the uploaded handbook entirely",
          correct: false,
          feedback:
            "Copilot Studio's Generative Answers is grounded in your knowledge sources — it searches the actual documents you've uploaded, not the model's general training data. This prevents hallucination and keeps answers accurate to your specific content.",
          wrongFeedback: "**Generative Answers** always searches your uploaded knowledge sources first — it never ignores them in favour of general training data.",
          wrongStoryText: "Jake's eyes widen as MelodyBot rambles about generic rehearsal etiquette. The handbook sits ignored. Tyler sighs: 'You uploaded it for a reason.'",
        },
      ],
      xpAward: 100,
    },

    // ── Scene 5 ── Topics and Escalation ──────────────────────────────────────
    {
      id: "w12-s5",
      type: "quiz",
      scenarioText:
        "Jake's agent is taking shape. Tyler explains the role of escalation and fallback topics. When MelodyBot can't help or confidence is low, it triggers the Escalate topic, notifying Jake and informing the student. If it can't parse the question, it uses Fallback to politely ask the student to rephrase.",
      question:
        "A student types 'I need to talk to someone about a scheduling conflict for the concert.' MelodyBot doesn't have a Topic for scheduling conflicts. What should happen?",
      choices: [
        {
          label: "A",
          text: "MelodyBot should pretend it understands, generate a generic encouraging response, and hope the student doesn't notice",
          correct: false,
          feedback:
            "Generating a confident-sounding non-answer is one of the worst outcomes in agent design. Students lose trust instantly when they realise the bot is bluffing. The right design is honest acknowledgment and a clear path forward — not a hallucinated response.",
          wrongFeedback: "Generating a confident non-answer is called **hallucination** — and it destroys student trust the moment they realise the bot was bluffing.",
          wrongStoryText: "MelodyBot chirps encouragingly. The student nods — then checks with Jake anyway. Trust, once faked, is hard to rebuild.",
        },
        {
          label: "B",
          text: "MelodyBot should trigger Fallback, acknowledge it can't resolve this, and offer to escalate or provide Jake's contact information",
          correct: true,
          feedback:
            "Correct. This is graceful degradation — the agent knows its limits, tells the student honestly, and provides a next step. The Fallback and Escalate topics exist for exactly this scenario. A bot that handles what it knows and hands off what it doesn't is more trustworthy than one that tries to handle everything.",
        },
        {
          label: "C",
          text: "MelodyBot should end the conversation immediately with an error message and ask the student to start over",
          correct: false,
          feedback:
            "Abruptly ending the conversation is poor design. The student came with a real need. The right response is to acknowledge the gap, offer a path forward (escalation, contact info, a different question), and keep the experience positive even when the bot can't fully help.",
          wrongFeedback: "Abrupt termination ignores the student's real need — good **Fallback design** keeps the experience constructive by offering escalation or a clear next step.",
          wrongStoryText: "The screen flashes: 'Error. Restart.' The student stares, frustrated. Jake winces — a door slammed shut on someone who needed help.",
        },
        {
          label: "D",
          text: "MelodyBot should search its knowledge base and make up a scheduling policy if no relevant document is found",
          correct: false,
          feedback:
            "Fabricating information the agent doesn't have is a hallucination — and in Copilot Studio, Generative Answers is specifically grounded to your knowledge sources to prevent this. If the scheduling conflict policy isn't in the documents, the agent should say so and escalate, not invent an answer.",
          wrongFeedback: "Inventing missing information is **hallucination** — **Generative Answers** is grounded to your documents precisely so the agent admits gaps instead of fabricating answers.",
          wrongStoryText: "MelodyBot confidently invents a scheduling rule. Tyler catches it and shakes his head: 'A bot that makes things up is worse than no bot.'",
        },
      ],
      xpAward: 150,
    },

    // ── Scene 5b ── Prompt Challenge ──────────────────────────────────────────
    {
      id: "w12-s5b",
      type: "prompt",
      character: "Jake",
      location: "WESTBROOK HIGH · COMPUTER LAB · SATURDAY · 1:45 PM",
      promptChallenge: {
        context:
          "Jake is writing MelodyBot's system instructions to define its identity, purpose, and boundaries in Copilot Studio. The prompt must keep the bot on-topic, friendly for freshmen, and ready to escalate gracefully when it doesn't know an answer.",
        goal:
          "Write the system instructions (agent description/personality prompt) for MelodyBot — the Westbrook High Music Club AI assistant.",
        placeholder:
          "You are MelodyBot, the AI assistant for the Westbrook High Music Club...",
      },
      xpAward: 150,
    },

    // ── NEAR-TRANSFER: Same Studio, Different Service ─────────────────────────
    {
      id:       "w12-near-transfer",
      type:     "learn",
      location: "WESTBROOK HIGH · COMPUTER LAB · SATURDAY · 1:45 PM",
      xpAward:  0,
      concept: {
        title: "Same Studio. Different Service.",
        body:  "Nadia, a customer experience manager at a boutique hotel chain, wanted to build a chatbot to help guests book rooms, check check-in times, and order room service. She used Copilot Studio to build 'ConciergeBot.' She mapped out specific conversational paths ('Topics') for room booking and checkout. In the system settings, she uploaded the hotel's raw guidelines as a knowledge base to handle random questions (pool hours, pet policy). She set up an fallback path that automatically routes the conversation to a front desk receptionist for complex requests. ConciergeBot handled 80% of daily guest questions. Same Copilot Studio building. Completely different customer service.",
      },
      learnHighlight: "Building custom bots in Copilot Studio means combining structured logic (Topics), unstructured knowledge lookup (RAG), and graceful human-in-the-loop escalation.",
    },

    // ── Scene 6 ── Boss: Conductor Test ───────────────────────────────────────
    {
      id: "w12-s6",
      type: "boss",
      scenarioText:
        "CONDUCTOR TEST — Principal Chen wants to know how MelodyBot handles questions that aren't in the handbook or pre-built topics before it goes live on the website. Jake has 60 seconds to answer.",
      question:
        "Ms. Chen asks: 'If a student asks MelodyBot something that isn't in our club handbook and isn't covered by any Topic Jake built — what does the bot do?' What is the correct answer?",
      choices: [
        {
          label: "A",
          text: "MelodyBot searches the internet for a general answer and responds with whatever it finds publicly available",
          correct: false,
          feedback:
            "By default, Copilot Studio agents are grounded to their configured knowledge sources — not the open internet. Jake controls exactly what MelodyBot can draw from. It won't go searching the web unless Jake explicitly connects a web search action. This is a deliberate safety boundary.",
          wrongFeedback: "Copilot Studio agents are **grounded to configured knowledge sources** by default — web search only activates if Jake explicitly adds that **action**.",
          wrongStoryText: "MelodyBot pulls a random website answer. Ms. Chen frowns. Jake goes pale — that wasn't in any school document he'd ever approved.",
        },
        {
          label: "B",
          text: "MelodyBot triggers its Fallback topic, acknowledges the gap honestly, and either escalates to a human or provides Jake's contact so the student can get a real answer",
          correct: true,
          feedback:
            "This is exactly the right design. When the agent reaches the edge of its knowledge, it doesn't bluff — it escalates gracefully. The Fallback and Escalate system topics handle this. Ms. Chen can be confident that MelodyBot won't fabricate information about school policies.",
        },
        {
          label: "C",
          text: "MelodyBot generates a confident answer using general AI knowledge, even if it contradicts the school's actual policies",
          correct: false,
          feedback:
            "This is the nightmare scenario that Copilot Studio's grounded knowledge approach is specifically designed to prevent. Generative Answers pulls from your documents — not the model's general training data. An agent that contradicts actual school policy would be a serious problem, and a well-configured Copilot Studio agent doesn't do this.",
          wrongFeedback: "**Grounded knowledge** in Copilot Studio pulls from your documents — never general training data — preventing the agent from contradicting real school policies.",
          wrongStoryText: "MelodyBot states a policy that directly contradicts the handbook. Ms. Chen's expression hardens. Jake's 60 seconds just ran out.",
        },
        {
          label: "D",
          text: "MelodyBot crashes and stops responding until Jake manually restarts it from the admin panel",
          correct: false,
          feedback:
            "Copilot Studio agents don't crash when they hit an unknown question — they route to system topics designed for exactly this situation. The Fallback topic is always present as a safety net. Unknown questions are a normal operating condition, not an error state.",
          wrongFeedback: "Unknown questions are a **normal operating condition** — Copilot Studio's built-in **Fallback topic** is always the safety net, not a crash state.",
          wrongStoryText: "The chatbot goes dark. A student refreshes the page three times. Tyler puts a hand on Jake's shoulder: 'Bots don't crash — bad designs do.'",
        },
      ],
      xpAward: 250,
    },

    // ── Scene 7 ── Revelation ─────────────────────────────────────────────────
    {
      id: "w12-s7",
      type: "revelation",
      revealText:
        "MelodyBot went live on a Friday afternoon.\n\nBy Monday, Jake had received two emails about the music club.\n\nBoth were from students who wanted to thank him — not ask him the same questions again.\n\nIn the first week, MelodyBot handled 94 conversations. Audition questions. Rehearsal schedules. Instrument requirements. The code of conduct. The same questions Jake had answered 31 times in a single week — now answered instantly, at 11pm when students were actually doing research, on a Saturday when Jake was at a gig, in the time between a student thinking 'I want to join' and talking themselves out of it.\n\nJake didn't write a single line of code.\n\nHe thought clearly about what the bot needed to know, what tone it should take, what it should refuse to guess at, and when it should hand off to a human. That's the whole skill.\n\nBuilding AI agents isn't about knowing how neural networks work. It's about knowing how people work — what they're really asking, what they actually need, what happens when the answer isn't there.\n\nJake knew his club. He knew his students. He knew the questions.\n\nThat made him the right person to build this.\n\nNot a developer.\n\nA conductor.",
      xpAward: 200,
    },

    // ═══ AI COMPARE ══════════════════════════════════════════════════════════
    {
      id: "w12-compare",
      type: "ai-compare",
      character: "Jake",
      location: "COMPUTER LAB · POST-LAUNCH",
      xpAward: 75,
      aiCompare: {
        models: ["copilot", "chatgpt"],
        headline: "Copilot Studio vs ChatGPT Custom GPTs — No-Code AI Agent Battle",
        context: "Jake compared both platforms before choosing where to build MelodyBot. Same requirements: music club FAQ bot, schedule lookup, equipment booking. Different results.",
        rows: [
          {
            dimension: "Microsoft 365 Integration",
            winner: "Copilot",
            claude:  "N/A",
            chatgpt: "No native M365 integration",
            gemini:  "N/A",
            copilot: "Deep M365 integration — Teams, SharePoint, Outlook as native channels",
            note: "MelodyBot needed to answer questions in Teams. Copilot Studio deploys directly there.",
          },
          {
            dimension: "Ease of Building",
            winner: "ChatGPT",
            claude:  "N/A",
            chatgpt: "Custom GPTs: 5-minute setup, conversational builder, instant publish",
            gemini:  "N/A",
            copilot: "More setup required; more powerful but steeper learning curve",
            note: "ChatGPT's GPT Builder is genuinely simpler. Copilot Studio has more power but more complexity.",
          },
          {
            dimension: "Knowledge Base & Document Grounding",
            winner: "Copilot",
            claude:  "N/A",
            chatgpt: "File upload to Custom GPT; limited document grounding",
            gemini:  "N/A",
            copilot: "SharePoint-grounded knowledge base; enterprise document management",
            note: "Jake needed MelodyBot to answer from the club's actual policy documents stored in SharePoint.",
          },
          {
            dimension: "Conversation Flow Control",
            winner: "Copilot",
            claude:  "N/A",
            chatgpt: "Custom GPT: conversation style configurable; limited hard flow control",
            gemini:  "N/A",
            copilot: "Topics system: define exact conversation flows with branching logic",
            note: "Copilot Studio lets Jake define exactly what the bot says at each step. Custom GPTs are more free-form.",
          },
          {
            dimension: "Public Distribution",
            winner: "ChatGPT",
            claude:  "N/A",
            chatgpt: "GPT Store: publish publicly, anyone can use it",
            gemini:  "N/A",
            copilot: "Primarily enterprise/org deployment; less suited for public distribution",
            note: "If Jake wanted MelodyBot available to anyone — Custom GPT wins on distribution reach.",
          },
        ],
        verdict: "For M365-native team bots with SharePoint knowledge — Copilot Studio. For quick builds with broad public reach — ChatGPT Custom GPTs. Jake's school context made Copilot Studio the right call.",
        question: "Jake wants to build a bot for his music club that answers questions from documents stored in SharePoint and lives inside Microsoft Teams. Which platform is purpose-built for this?",
        choices: [
          {
            label: "A",
            text: "ChatGPT Custom GPTs — simplest to build and maintain",
            correct: false,
            feedback: "Custom GPTs are simpler to build — but they can't natively connect to SharePoint or deploy inside Teams. Jake would lose the M365 integration that makes the bot actually useful for his school context.",
            wrongFeedback: "Custom GPTs are simpler to build — but they can't natively connect to SharePoint or deploy inside Teams. Jake would lose the M365 integration that makes the bot actually useful for his school context.",
          wrongStoryText: "Jake launches his Custom GPT proudly — then realises it can't see SharePoint or reach Teams. Tyler smiles gently: 'Right idea, wrong tool.'",
          },
          {
            label: "B",
            text: "Copilot Studio — native SharePoint grounding and Teams deployment",
            correct: true,
            feedback: "Exactly. Jake's two requirements — SharePoint knowledge base and Teams deployment — are Copilot Studio's native strengths. It was built specifically for M365-grounded bots that live inside the Microsoft ecosystem.",
          },
          {
            label: "C",
            text: "Either — they're equivalent for school use cases",
            correct: false,
            feedback: "They're not equivalent here. The specific requirements — SharePoint grounding and Teams channels — are core features in Copilot Studio and workarounds (or impossible) in Custom GPTs. Platform fit matters.",
            wrongFeedback: "They're not equivalent here. The specific requirements — SharePoint grounding and Teams channels — are core features in Copilot Studio and workarounds (or impossible) in Custom GPTs. Platform fit matters.",
          wrongStoryText: "Jake shrugs and picks randomly. Weeks later, the SharePoint connection fails again. Tyler crosses his arms: 'Equivalent tools don't have equivalent limitations.'",
          },
        ],
      },
    },

    // ─── HANDOFF ─────────────────────────────────────────────────────────────
    {
      id: "w12-handoff",
      type: "handoff",
      character: "Jake",
      location: "MUSIC CLUB ROOM · LOOKING AT SCREEN",
      xpAward: 0,
      dialogue: [
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "MelodyBot handled 94 conversations in its first week. No emails, no repeating schedules.",
        },
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "I've come a long way. Jake the guitarist, the president, the bot builder. Same guy, just better tools.",
        },
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "But it all comes down to one thing: how you talk to it.",
        },
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "The words, structure, context. We call it prompting, but we haven't gone deep into the actual craft.",
        },
        {
          speaker: "Jake",
          avatar: "protagonist" as const,
          text: "Maya, a UX designer, made this her specialty. Her prompts will make you rethink how you talk to AI.",
        },
      ],
    },

  ],
}
