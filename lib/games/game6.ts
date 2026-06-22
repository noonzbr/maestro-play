import { Game } from "./types"

export const game6: Game = {
  slug: "claude-code-unlocked",
  week: 6,
  free: true,
  title: "Claude Code — AI in Your Terminal",
  emoji: "💻",
  accentColor: "#10b981",
  duration: "9 min",
  description:
    "Learn how Claude Code turns your terminal into an agentic coding partner — reading files, writing code, running tests, and shipping features without copy-pasting.",
  tagline: "Stop copy-pasting. Start collaborating.",
  characterName:  "Kai",
  characterRole:  "24-year-old junior developer",
  characterBlurb: "A junior dev who stops copy-pasting and starts shipping with Claude Code",
  characterImage: "/images/kai.png",
  maestroImage:   "/images/maestro-kai.png",
  maestroLine:    "The last time he was just a junior dev staring at a terminal...",
  maestroSubline: "Kai ships faster now. The codebase bends to the conductor.",
  audioTrack:     "/audio/kai-emerald-debug-loop.mp3",
  intro: {
    sceneImage: "/images/scene-kai.png",
    sceneColor: "#060a08",
    noteOrigin: { bottom: "42%", left: "48%" },
    beats: [
      { type: "location",  text: "STARTUP OFFICE · TUESDAY · 2:07 AM" },
      { type: "narration", text: "The terminal blinked and blinked, indifferent, as Kai searched the same Stack Overflow thread for the fourth time." },
      { type: "dialogue",  speaker: "Elena", text: "I shipped the whole auth refactor before lunch. Claude Code read the codebase, wrote the plan, and I just reviewed the diffs. When did you last ship something, Kai?" },
      { type: "final",     text: "The bug was never the code. It was always working alone." },
    ],
  },
  aiModel:  "claude" as const,
  felipeOutroVideo:   "/videos/felipe-game6.mp4",
  nextGame: {
    slug:         "claude-for-work",
    character:    "Priya",
    teaserLine:   "Kai made Claude work on his code. Priya made it work for her ENTIRE team. Claude Projects changed how her whole operations department functions — and she's going to show you exactly how.",
    previewImage: "/images/priya.png",
  },

  mondayPrompt: "In Claude Code terminal, run this task: 'Read all [FILE TYPE] files in [DIRECTORY]. For each file: [WHAT TO DO — e.g., extract the date, rename with ISO date prefix, move to /archive/YYYY-MM/]. Show me a plan before executing. List any files you are unsure about rather than guessing.'",
  scenes: [
    // ── Scene 1 ── Meet Kai ────────────────────────────────────────────────
    {
      id: "w6-s1",
      type: "scenario",
      character: "Kai, Junior Developer, 24",
      location: "STARTUP OFFICE · TUESDAY · 3:12 PM",
      dialogue: [
        {
          speaker: "Kai",
          avatar: "jake",
          text:
            "Two hours. Two hours on this React rendering bug. I've console-logged everything. I've Googled everything. I'm going in circles.",
        },
        {
          speaker: "Elena",
          avatar: "npc",
          npcKey: "senora_vega",
          text: "Did you try Claude Code?",
        },
        {
          speaker: "Kai",
          avatar: "jake",
          text: "I've used Claude. It's just a chat window. I paste my code in, it gives me a suggestion, I paste it back. Takes forever.",
        },
        {
          speaker: "Elena",
          avatar: "npc",
          npcKey: "senora_vega",
          text: "That's not Claude Code. Claude Code runs in your terminal. It reads your actual files. It edits them directly. It can run your tests. You don't paste anything.",
        },
        {
          speaker: "Kai",
          avatar: "jake",
          text: "Wait — it reads my files? Like, the whole project?",
        },
        {
          speaker: "Elena",
          avatar: "npc",
          npcKey: "senora_vega",
          text: "Your whole codebase. It understands the structure before it touches a single line. It's not a chat window. It's a coding agent.",
        },
        {
          speaker: "Kai",
          avatar: "jake",
          text: "…Okay. How do I install it?",
        },
        {
          speaker: "Elena",
          avatar: "npc",
          npcKey: "senora_vega",
          text: "npm install -g @anthropic-ai/claude-code. Then just type claude in your terminal. It'll handle the rest.",
        },
      ],
      concept: {
        title: "What Claude Code Actually Is",
        body: "Claude Code is a terminal-based agentic coding tool — not a chat interface you copy-paste into.\n\nHow to install:\nnpm install -g @anthropic-ai/claude-code\n\nHow to run:\nType claude in any project directory.\n\nWhat it does:\n• Reads your entire codebase — file structure, imports, component hierarchy, everything\n• Edits files directly on disk — no clipboard, no manual pasting\n• Runs shell commands (tests, linters, installs) when you allow it\n• Asks for permission before any destructive action\n• Shows diffs before applying changes so you stay in control\n\nThe key shift: instead of copy-pasting snippets into a browser tab, you have a coding partner that already knows your project and works inside it.",
      },
      question:
        "What's the key difference between Claude Code and using Claude in a browser chat window?",
      choices: [
        {
          label: "A",
          text: "Claude Code uses a more powerful AI model that isn't available in the browser",
          correct: false,
          feedback:
            "The model can be the same. The difference isn't which AI is running — it's how it interfaces with your work. Claude Code operates inside your project, not outside it.",
          wrongFeedback: "The **AI Model** can be identical — what changes is the **Execution Layer**. Claude Code lives inside your project; browser chat stays outside it.",
          wrongStoryText: "Kai scratches his head. The terminal blinks back: 'Same engine, different track. One reads your files. The other waits for you to paste them.'",
        },
        {
          label: "B",
          text: "Claude Code reads your actual files, edits them directly, and runs commands in your terminal — no copy-pasting required",
          correct: true,
          feedback:
            "Exactly right. This is the architectural shift. A browser chat requires you to be the bridge between Claude and your codebase. Claude Code removes that bridge entirely — it works directly in your project.",
        },
        {
          label: "C",
          text: "Claude Code only works with specific programming languages like Python and JavaScript",
          correct: false,
          feedback:
            "Claude Code works with any language your terminal can handle. It reads whatever files are in your project — TypeScript, Python, Go, Rust, Ruby, you name it.",
          wrongFeedback: "Claude Code has no language restrictions — **Terminal-Native Access** means it works with any language your environment supports, from Go to Ruby.",
          wrongStoryText: "Kai's eyes widen slightly. The Maestro's voice carries through the terminal: 'If your machine can run it, Claude Code can read it.'",
        },
        {
          label: "D",
          text: "Claude Code is a VS Code extension that adds an AI sidebar panel",
          correct: false,
          feedback:
            "Claude Code lives in your terminal, not inside an editor. You run it with the claude command in any directory. It has editor integrations, but the core tool is terminal-native.",
          wrongFeedback: "Claude Code is **Terminal-Native**, not editor-bound — it runs via the `claude` command in any directory, with optional editor integrations as extras.",
          wrongStoryText: "Kai glances at his VS Code sidebar. The terminal cursor blinks: 'I don't live in your sidebar, Kai. Open the terminal. That's where I work.'",
        },
      ],
      xpAward: 100,
    },

    // ── Scene 2 ── First Run ───────────────────────────────────────────────────
    {
      id: "w6-s2",
      type: "quiz",
      scenarioText:
        "Kai installs Claude Code and runs claude in his project root for the first time. Within seconds, Claude Code reads through his entire src/ folder — 34 files — and reports back a summary of the component hierarchy, the state management pattern, and which files are likely related to the rendering bug. Kai hasn't typed a single line of code. He's typed one sentence describing his bug.",
      question: "When Claude Code edits a file, what actually happens?",
      choices: [
        {
          label: "A",
          text: "The updated code is copied to your clipboard so you can paste it manually",
          correct: false,
          feedback:
            "That's how browser-based AI chat works. Claude Code bypasses the clipboard entirely — it writes changes straight to the file on disk, just like your own editor would.",
          wrongFeedback: "That's **Browser Chat** behavior — Claude Code skips your clipboard entirely, writing changes straight to disk using **Direct File Editing**.",
          wrongStoryText: "Kai reaches for his mouse to paste. Then stops. The terminal already shows the diff — the file changed while he was still reaching.",
        },
        {
          label: "B",
          text: "Claude Code writes the change directly to the file on disk and shows you a diff of what changed",
          correct: true,
          feedback:
            "Correct. Claude Code edits the actual file — no clipboard, no paste. It shows you a diff first so you can review exactly what it changed before moving on. This is what makes it feel like a real collaborator.",
        },
        {
          label: "C",
          text: "Claude Code creates a new file with the suffix _claude.ts and leaves the original untouched",
          correct: false,
          feedback:
            "Claude Code edits in place — it modifies the original file directly. It doesn't create shadow copies. That's why reviewing diffs before confirming changes is an important habit.",
          wrongFeedback: "Claude Code edits **in-place** — no shadow files, just direct disk writes shown as a **diff** for your review.",
          wrongStoryText: "Kai scans his folder. No _claude.ts files anywhere. The console blinks: 'I work on the real thing, not a copy.'",
        },
        {
          label: "D",
          text: "Claude Code summarises the changes in text but doesn't modify any files until you manually apply them",
          correct: false,
          feedback:
            "Claude Code applies changes directly once you confirm. It's agentic — it acts, it doesn't just advise. That's the whole point. You're in control of confirming, but Claude Code does the actual work.",
          wrongFeedback: "Claude Code is **agentic** — it applies changes directly upon confirmation, not just narrates them for you to execute.",
          wrongStoryText: "Kai waits for a patch file that never arrives. The console hums: 'I don't advise. I act — once you say go.'",
        },
      ],
      xpAward: 100,
    },

    // ── Scene 3 ── The Refactor Task ──────────────────────────────────────────
    {
      id: "w6-s3",
      type: "scenario",
      character: "Kai",
      location: "STARTUP OFFICE · TUESDAY · 4:05 PM",
      dialogue: [
        {
          speaker: "Kai",
          avatar: "jake",
          text:
            "Okay, the bug is fixed. Now I want to try something bigger. The auth flow is a mess — prop drilling four levels deep. I've been putting off this refactor for weeks.",
        },
        {
          speaker: "Kai",
          avatar: "jake",
          text:
            "[types]: Refactor the auth flow to use React context instead of prop drilling. The user object is currently passed through App → Layout → Sidebar → UserMenu.",
        },
        {
          speaker: "AI",
          avatar: "npc",
          npcKey: "ai",
          text:
            "Reading auth-related files… I can see App.tsx, Layout.tsx, Sidebar.tsx, UserMenu.tsx, AuthProvider.tsx, useAuth.ts, and types/auth.ts. Here's my plan before I touch anything: 1) Create an AuthContext in AuthProvider.tsx, 2) Wrap App with the provider, 3) Replace prop chains in Layout, Sidebar, and UserMenu with useContext. Should I proceed?",
        },
        {
          speaker: "Kai",
          avatar: "jake",
          text: "It read seven files and made a plan before doing anything?",
        },
        {
          speaker: "Elena",
          avatar: "npc",
          npcKey: "senora_vega",
          text: "It always reads first. And it always asks before it touches something significant. Type 'yes' and watch.",
        },
        {
          speaker: "AI",
          avatar: "npc",
          npcKey: "ai",
          text:
            "Applying changes… Done. Here are the diffs for all 4 files. AuthProvider.tsx gained the context export. App.tsx now wraps with AuthProvider. Layout, Sidebar, and UserMenu no longer accept user as a prop — they call useAuth() directly instead.",
        },
        {
          speaker: "Kai",
          avatar: "jake",
          text: "That would have taken me a full afternoon.",
        },
      ],
      concept: {
        title: "Agentic but Not Reckless",
        body: "Claude Code is autonomous — but it's designed to be trustworthy, not trigger-happy.\n\nBefore it writes anything:\n• It reads all relevant files to understand the full picture\n• It proposes a plan in plain language\n• It waits for your confirmation\n\nBefore it runs a destructive command:\n• It tells you exactly what the command does\n• It asks permission explicitly\n\nAs it works:\n• It shows diffs for every file it edits\n• You can approve, reject, or ask it to revise\n\nThe rule: Claude Code acts like a senior developer who still asks 'does this look right to you?' before merging. Powerful, but never without your sign-off.",
      },
      question:
        "What should you do when Claude Code proposes a plan to refactor a large section of code?",
      choices: [
        {
          label: "A",
          text: "Immediately type 'yes' — Claude Code's plans are always optimal and don't need review",
          correct: false,
          feedback:
            "Claude Code is capable, but it doesn't have full business context. It might technically refactor correctly while missing an important constraint — like a part of the codebase it wasn't told about. Always read the plan.",
          wrongFeedback: "Claude Code lacks your **business context** — even a technically perfect plan can miss a constraint only you know about.",
          wrongStoryText: "Kai hits yes instantly. Three files refactor cleanly. A fourth — one he forgot to mention — breaks silently in production.",
        },
        {
          label: "B",
          text: "Read the plan, verify it covers the right files and approach, then confirm — or ask Claude Code to adjust it",
          correct: true,
          feedback:
            "This is the right habit. Claude Code proposes and you decide. The plan step exists precisely so you can catch misunderstandings before any code changes. You can always say 'actually, skip the Sidebar — I'll handle that manually.'",
        },
        {
          label: "C",
          text: "Cancel the session and make the changes manually — AI refactors are too risky to trust",
          correct: false,
          feedback:
            "Over-caution cuts off the value. Claude Code reads the full codebase before proposing, shows diffs before applying, and waits for confirmation. The workflow is designed to keep you in control.",
          wrongFeedback: "Claude Code's **diff-review workflow** is designed for control — rejecting it entirely trades safety for unnecessary manual effort.",
          wrongStoryText: "Kai closes the session and opens his editor. An hour later, he's done what Claude Code would have finished in minutes.",
        },
        {
          label: "D",
          text: "Ask Claude Code to refactor one file at a time and never let it plan across multiple files",
          correct: false,
          feedback:
            "File-by-file can work, but it misses one of Claude Code's core strengths: understanding how files relate to each other. A context-aware multi-file plan is often more accurate than sequential single-file edits.",
          wrongFeedback: "Claude Code's strength is **cross-file context awareness** — isolating it to one file at a time discards its most powerful capability.",
          wrongStoryText: "Kai locks Claude Code to one file. It fixes the function perfectly — but misses the three callers that now break downstream.",
        },
      ],
      xpAward: 100,
    },

    // ── Scene 4 ── Slash Commands & Context Management ────────────────────────
    {
      id: "w6-s4",
      type: "quiz",
      scenarioText:
        "Kai has been working with Claude Code for 90 minutes on a complex feature. The conversation is long — dozens of back-and-forth turns covering the bug fix, the auth refactor, and now a new API integration. He notices Claude Code's suggestions are getting slightly less focused, occasionally referencing earlier parts of the session that aren't relevant anymore. Elena tells him about slash commands: /compact summarises the conversation so Claude Code keeps its focus without losing the thread. /clear starts a completely fresh session. /memory lets him set persistent facts — like which files to always consider or which patterns to follow — that survive across sessions.",
      question:
        "Kai is 90 minutes into a session and Claude Code starts giving less focused responses. What's the most likely fix?",
      choices: [
        {
          label: "A",
          text: "Restart his computer — Claude Code's performance degrades over time due to memory leaks",
          correct: false,
          feedback:
            "Restarting hardware won't change anything. The issue is context length inside the session, not the machine. Claude Code manages context through conversation, not RAM.",
          wrongFeedback: "Sluggish responses signal **context window** saturation, not hardware — restarting your machine changes nothing about the conversation length.",
          wrongStoryText: "Kai reboots. The session reloads. Claude Code gives the same drifting answer. The machine was never the problem.",
        },
        {
          label: "B",
          text: "Run /compact to summarise the session context so Claude Code stays focused on what's current",
          correct: true,
          feedback:
            "Exactly right. /compact is specifically designed for this. It distills the long conversation into a focused summary — preserving the important decisions and current state while discarding noise. Claude Code comes back into focus without losing the thread.",
        },
        {
          label: "C",
          text: "Switch to a different AI tool — Claude Code isn't designed for long sessions",
          correct: false,
          feedback:
            "Claude Code is built for long, complex sessions. /compact is the mechanism for managing them. This is a feature, not a limitation.",
          wrongFeedback: "Long sessions are Claude Code's design strength — **/compact** is the built-in tool that manages **context length** without abandoning the work.",
          wrongStoryText: "Kai switches tools mid-refactor. The new session knows nothing. He spends twenty minutes re-explaining what Claude Code already understood.",
        },
        {
          label: "D",
          text: "Open a new terminal window and start a parallel Claude Code session",
          correct: false,
          feedback:
            "A new session loses all context from the current one. /compact keeps the important history while trimming the noise — it's a much better solution than starting over.",
          wrongFeedback: "**/compact** preserves relevant **session context** while trimming noise — a new terminal discards everything you've built together.",
          wrongStoryText: "Kai opens a second terminal. The new Claude Code stares back, blank. Ninety minutes of shared context — gone.",
        },
      ],
      xpAward: 100,
    },

    // ── Scene 5b ── LIVE Prompt Moment ────────────────────────────────────────
    {
      id: "w6-s5b",
      type: "prompt",
      character: "Kai",
      location: "STARTUP OFFICE · WEDNESDAY · 10:30 AM",
      promptChallenge: {
        context:
          "Kai needs to add input validation to a signup form. The form has three fields: email, password (minimum 8 characters, must contain at least one number), and username (alphanumeric only, between 3 and 20 characters). He's using React with TypeScript. He wants Claude Code to write the validation logic and show him exactly what changes were made — so he can review every line before it goes into the PR.",
        goal:
          "Write a prompt for Claude Code that gives it enough context to produce validation code Kai can trust — specific about the requirements, the stack, and what output he needs.",
        placeholder: "Write Kai's Claude Code prompt...",
      },
      xpAward: 150,
    },

    // ── NEAR-TRANSFER: Same Agent, Different Venture ──────────────────────────
    {
      id:       "w6-near-transfer",
      type:     "learn",
      location: "STARTUP OFFICE · WEDNESDAY · 10:30 AM",
      xpAward:  0,
      concept: {
        title: "Same Agent. Different Venture.",
        body:  "Leo, a startup founder, had to prepare a personalized pitch deck for twelve different venture firms. Instead of copying slides manually, he used a command-line agentic script. He instructed it: 'Read our master pitch.md and the portfolio profiles of the twelve target VCs in /profiles. For each VC, write a plan showing how to customize slide 3 (market fit) and slide 5 (differentiation) to match their investment focus. Show me the plan first. Do not modify the files until I approve.' The agent proposed a list of custom slides. Leo approved, and the agent wrote the files. Same planning loop. Completely different venture.",
      },
      learnHighlight: "Terminal agency isn't just for code. It's for any developer-minded professional who wants to plan, review, and execute complex workflows programmatically.",
    },

    // ── Scene 6 ── Boss: Conductor Test ───────────────────────────────────────
    {
      id: "w6-s6",
      type: "boss",
      scenarioText:
        "CONDUCTOR TEST — Kai has debugged a rendering bug, refactored an auth flow, managed session context, and written a precise validation prompt. One question stands between him and the revelation.",
      question:
        "Which practice makes Claude Code MOST effective for a complex multi-file refactor?",
      choices: [
        {
          label: "A",
          text: "Give Claude Code access to the entire repo and let it decide what to change without any guidance",
          correct: false,
          feedback:
            "Unrestricted autonomy without context leads to technically correct but strategically wrong changes. Claude Code works best as a partner — it needs your goal and constraints to make good decisions.",
          wrongFeedback: "Without your **goal and constraints**, Claude Code optimises technically but can't know what's strategically correct for your project.",
          wrongStoryText: "Kai grants full access and steps back. The refactor compiles cleanly — and quietly removes the feature flag still needed in production.",
        },
        {
          label: "B",
          text: "Break the task into very small one-line edits to keep Claude Code from making mistakes",
          correct: false,
          feedback:
            "Over-constraining Claude Code undermines the core benefit. It's designed to reason across files. Micro-managing each edit is slower and more error-prone than letting it plan the full refactor and reviewing the result.",
          wrongFeedback: "Micro-managing one-line edits ignores Claude Code's **cross-file reasoning** — the real safety net is reviewing the **diff**, not shrinking the task.",
          wrongStoryText: "Kai feeds Claude Code one line at a time. It obeys — slowly, confused, unable to see the pattern he's trying to build.",
        },
        {
          label: "C",
          text: "Start with a clear description of the goal and constraints, then review each change before confirming",
          correct: true,
          feedback:
            "This is the pattern that works. A clear goal lets Claude Code plan intelligently. Reviewing each diff keeps you in control of the outcome. You get the speed of an agent with the confidence of a code review.",
        },
        {
          label: "D",
          text: "Paste the entire codebase into Claude.ai first, then paste the suggestions back into your files",
          correct: false,
          feedback:
            "That's the old workflow — the one Claude Code replaces. Manual copy-paste loses context, misses file relationships, and doubles your work. Claude Code handles the file layer directly so you never have to do this.",
          wrongFeedback: "**Manual copy-paste** destroys file relationships and doubles work — Claude Code's power is operating **directly on your codebase**.",
          wrongStoryText: "Kai's hand hovers over the keyboard. The terminal blinks slowly. The old workflow flickers on screen — and he realizes he almost went backward.",
        },
      ],
      xpAward: 250,
    },

    // ── Scene 7 ── Revelation ─────────────────────────────────────────────────
    {
      id: "w6-s7",
      type: "revelation",
      revealText:
        "Kai shipped the feature in 40 minutes.\n\nNot because he got faster at typing.\n\nBecause he stopped treating his terminal like a typewriter and started using it like a conversation.\n\nClaude Code didn't write his software. Kai wrote his software — with a partner who never gets tired of reading the whole codebase before touching a single line.\n\nThe bug that took two hours? Fixed in eight minutes.\n\nThe auth refactor he'd been avoiding for weeks? Done before lunch.\n\nThe difference wasn't intelligence. It was interface.\n\nYour terminal is no longer just where you run commands.\n\nIt's where you think out loud with something that can actually build what you're thinking.",
      xpAward: 200,
    },

    // ═══ AI COMPARE ══════════════════════════════════════════════════════════
    {
      id: "w6-compare",
      type: "ai-compare",
      character: "Kai",
      location: "COMPUTER LAB · LATE NIGHT",
      xpAward: 75,
      aiCompare: {
        models: ["claude", "chatgpt", "copilot"],
        headline: "Claude Code vs ChatGPT vs GitHub Copilot — The Real Dev Tools Comparison",
        context: "Kai spent two weeks testing all three coding AIs on real tasks. Not toy examples — production features and bug hunts. Here's what actually happened.",
        rows: [
          {
            dimension: "Full Codebase Awareness",
            winner: "Claude",
            claude:  "Reads the entire codebase in one session — understands how files interact",
            chatgpt: "Strong at file-level analysis; requires pasting relevant context",
            copilot: "IDE-integrated; understands open files + limited workspace context",
            note: "Kai's bug was in the interaction between 3 files. Claude saw all three simultaneously.",
          },
          {
            dimension: "Inline Code Suggestions (IDE)",
            winner: "Copilot",
            claude:  "Terminal-based; no native inline IDE suggestions",
            chatgpt: "No native IDE integration",
            copilot: "Native VS Code/JetBrains integration — suggests as you type",
            note: "For moment-to-moment coding flow, Copilot's inline suggestions are unmatched.",
          },
          {
            dimension: "Complex Refactoring",
            winner: "Claude",
            claude:  "Plans the refactor, explains the trade-offs, executes across multiple files",
            chatgpt: "Strong planning; execution requires copy-paste between files",
            copilot: "Better at local completions than architectural refactors",
            note: "Kai's auth refactor touched 7 files. Claude managed the entire operation from the terminal.",
          },
          {
            dimension: "Debugging Speed",
            winner: "Claude",
            claude:  "Reads error logs, traces through call stack, hypothesizes root cause",
            chatgpt: "Strong debugging with pasted context; no live file access",
            copilot: "Good at spot suggestions; less effective on systemic bugs",
            note: "The 2-hour bug became an 8-minute bug when Claude could read every relevant file.",
          },
          {
            dimension: "Team/Enterprise Integration",
            winner: "Copilot",
            claude:  "Individual terminal tool; no enterprise integration",
            chatgpt: "Limited enterprise dev tooling",
            copilot: "GitHub Actions, Azure DevOps, enterprise security features",
            note: "For teams with enterprise GitHub — Copilot has native CI/CD pipeline integration.",
          },
        ],
        verdict: "For individual deep debugging and refactoring sessions — Claude Code wins. For everyday inline coding flow — Copilot is irreplaceable. Smart developers use both.",
        question: "Kai needs to trace a bug that's causing a race condition across 5 async functions in 4 different files. Which tool should he reach for?",
        choices: [
          {
            label: "A",
            text: "GitHub Copilot — it's already in his IDE with full workspace context",
            correct: false,
            feedback: "Copilot knows his open files but lacks the agentic ability to trace a race condition across 4 files simultaneously while understanding the async relationships between them. This is a whole-codebase problem.",
            wrongFeedback: "Copilot knows his open files but lacks the agentic ability to trace a race condition across 4 files simultaneously while understanding the async relationships between them. This is a whole-codebase problem.",
          wrongStoryText: "Kai selects Copilot. Four file tabs blur together. The race condition hides in the gaps between them, untouched.",
          },
          {
            label: "B",
            text: "Claude Code — reads all 4 files simultaneously and reasons about their interaction",
            correct: true,
            feedback: "Exactly. A race condition between async functions requires understanding the execution order across multiple files simultaneously. Claude Code reads the entire relevant context in one go and can reason about how the pieces interact — the exact scenario where its agentic architecture shines.",
          },
          {
            label: "C",
            text: "ChatGPT — strongest reasoning model overall",
            correct: false,
            feedback: "ChatGPT is excellent at reasoning — but it needs the context pasted in manually. Pasting 4 files of async code, maintaining the context, and iterating is exactly the friction Claude Code eliminates. The tool's ability to READ the files directly is the key advantage here.",
            wrongFeedback: "ChatGPT is excellent at reasoning — but it needs the context pasted in manually. Pasting 4 files of async code, maintaining the context, and iterating is exactly the friction Claude Code eliminates. The tool's ability to READ the files directly is the key advantage here.",
          wrongStoryText: "Kai starts pasting. File two. File three. By file four, the context has already started slipping away.",
          },
        ],
      },
    },

    // ═══ HANDOFF ═════════════════════════════════════════════════════════════
    {
      id: "w6-handoff",
      type: "handoff",
      character: "Kai",
      location: "COMPUTER LAB · POST-SHIFT",
      xpAward: 0,
      dialogue: [
        {
          speaker: "Kai",
          avatar: "protagonist" as const,
          text: "Okay — so now you know what happens when you give an AI access to your actual files. Not just advice. Real changes. That's a different category of tool.",
        },
        {
          speaker: "Kai",
          avatar: "protagonist" as const,
          text: "But I'm one developer. What happens when you need an AI that works for an entire team? Same context. Same rules. Consistent output. Every. Single. Time.",
        },
        {
          speaker: "Kai",
          avatar: "protagonist" as const,
          text: "My friend Priya manages an ops team. She figured out Claude Projects — which is like setting up a brain that all of her team members can share.",
        },
        {
          speaker: "Kai",
          avatar: "protagonist" as const,
          text: "Upload your company knowledge. Set custom instructions. Every AI interaction starts from the same foundation. No more 'explain our business model for the 400th time.'",
        },
        {
          speaker: "Kai",
          avatar: "protagonist" as const,
          text: "The difference between a personal AI tool and a team AI system — Priya lives in that difference every day. Go learn it.",
        },
      ],
    },

  ],
}
