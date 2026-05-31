import { Game } from "./types"

export const game10: Game = {
  slug: "gemini-cli-unlocked",
  week: 10,
  free: false,
  price: 4.99,
  title: "Gemini CLI — AI for the Command Line",
  emoji: "⚡",
  accentColor: "#f59e0b",
  duration: "9 min",
  description:
    "Google's free, open-source terminal AI agent. Reads your files, runs code, writes scripts, and automates workflows — powered by Gemini 2.5 Pro, right in your shell.",
  tagline: "The terminal just got a brain.",
  characterName:  "Sam",
  characterRole:  "29-year-old DevOps engineer",
  characterBlurb: "A terminal wizard who adds Gemini CLI to his command-line arsenal",
  characterImage: "/images/sam.png",
  maestroImage:   "/images/maestro-sam.png",
  audioTrack:     "/audio/concrete-riot.mp3",
  intro: {
    sceneImage: "/images/scene-sam.png",
    sceneColor: "#060a06",
    noteOrigin: { bottom: "42%", left: "48%" },
    beats: [
      { type: "location",  text: "HOME LAB · MONDAY · 1:17 AM" },
      { type: "narration", text: "Forty-seven config files and a Friday deadline — Sam had mapped the problem perfectly and still hadn't moved a single line." },
      { type: "dialogue",  speaker: "Riya", text: "I finished the whole migration in eleven minutes. Gemini CLI read every file, caught three pattern variants I hadn't noticed, and asked before it touched anything. Sam, when did you last ship something this week?" },
      { type: "final",     text: "The engineer who automates the mechanical frees the human to do the irreplaceable." },
    ],
  },
  aiModel:  "gemini" as const,
  felipeOutroVideo:   "/videos/felipe-game10.mp4",
  nextGame: {
    slug:         "microsoft-copilot",
    character:    "Jake",
    teaserLine:   "Sam automated the terminal. Now Jake's back — and this time he's dealing with a totally different world: Microsoft 365. Copilot is hiding in every app his school uses, and most people have no idea it's there.",
    previewImage: "/images/guitarplayer1.png",
  },
  scenes: [
    // ── Scene 1 ── Meet Sam ───────────────────────────────────────────────────
    {
      id: "w10-s1",
      type: "scenario",
      character: "Sam, DevOps/SRE Engineer, 29",
      location: "TECH COMPANY · SRE TEAM OFFICE · MONDAY · 9:47 AM",
      dialogue: [
        {
          speaker: "Sam",
          avatar: "jake",
          text:
            "Forty-seven legacy config files. All need to be converted to the new YAML format before the infrastructure review on Friday. It's find-and-replace hell — and every file is slightly different.",
        },
        {
          speaker: "Riya",
          avatar: "npc",
          npcKey: "senora_vega",
          text: "Have you tried Gemini CLI?",
        },
        {
          speaker: "Sam",
          avatar: "jake",
          text: "Isn't that just a chatbot in the terminal? I could paste config files into the browser version. Same thing.",
        },
        {
          speaker: "Riya",
          avatar: "npc",
          npcKey: "senora_vega",
          text: "It's not a chatbot. It's an agent. It can read your entire ./legacy/ directory, understand the pattern across every file, write all 47 converted files into ./config/, and ask you before it saves anything.",
        },
        {
          speaker: "Sam",
          avatar: "jake",
          text: "It reads the actual files? On disk?",
        },
        {
          speaker: "Riya",
          avatar: "npc",
          npcKey: "senora_vega",
          text: "Your whole filesystem if you let it. It's open source — install it with npm or pip, log in with your Google account, and you get 60 requests a minute on the free tier. Powered by Gemini 2.5 Pro.",
        },
        {
          speaker: "Sam",
          avatar: "jake",
          text: "Free tier. No enterprise contract. That's it?",
        },
        {
          speaker: "Riya",
          avatar: "npc",
          npcKey: "senora_vega",
          text: "That's it. One command: npm install -g @google/gemini-cli. Or pip install gemini-cli if you prefer Python tooling. Then type gemini in any directory and start talking to it.",
        },
      ],
      concept: {
        title: "What Gemini CLI Actually Is",
        body: "Gemini CLI is a free, open-source terminal AI agent — not a browser chat window you copy-paste into.\n\nHow to install:\nnpm install -g @google/gemini-cli\n— or —\npip install gemini-cli\n\nHow to authenticate:\nSign in with your Google account. The free tier gives you 60 requests per minute.\n\nWhat it's powered by:\nGemini 2.5 Pro — Google's most capable model, with a 1-million-token context window.\n\nWhat it can do:\n• Read your filesystem — files, folders, whole codebases\n• Edit files directly on disk — no clipboard, no copy-paste\n• Run shell commands when you allow it\n• Pipe stdin input (cat file.log | gemini \"what's wrong here?\")\n• Connect to external tools via MCP servers\n• Run headlessly in scripts, CI/CD, and automation pipelines\n\nThe key shift: instead of being a Q&A tool you talk at, Gemini CLI is an agent that works inside your environment.",
      },
      question:
        "What makes Gemini CLI fundamentally different from typing a question into gemini.google.com?",
      choices: [
        {
          label: "A",
          text: "Gemini CLI uses a different, weaker model optimised for short terminal responses",
          correct: false,
          feedback:
            "Gemini CLI is powered by Gemini 2.5 Pro — the same frontier model, with a 1-million-token context window. The difference isn't the model, it's the environment it operates in.",
        },
        {
          label: "B",
          text: "Gemini CLI is an agent that reads your files, edits them directly, and runs shell commands — operating inside your environment, not outside it",
          correct: true,
          feedback:
            "Exactly right. The browser version requires you to be the bridge — copy your code in, paste suggestions back. Gemini CLI removes that bridge entirely. It lives in your filesystem and acts on it directly.",
        },
        {
          label: "C",
          text: "Gemini CLI only works for Google Cloud infrastructure and GCP-specific tooling",
          correct: false,
          feedback:
            "Gemini CLI is general-purpose. It works with any files, any language, any project — YAML configs, Python scripts, shell scripts, CI definitions, you name it. It's not GCP-specific.",
        },
        {
          label: "D",
          text: "Gemini CLI is faster because it skips the network and processes everything locally on your machine",
          correct: false,
          feedback:
            "Gemini CLI still calls Google's API — it's not a local model. The difference is its agency: it can read, write, and run things in your environment, whereas the browser chat is isolated from your files.",
        },
      ],
      xpAward: 100,
    },

    // ── Scene 2 ── The 1M Context Window ─────────────────────────────────────
    {
      id: "w10-s2",
      type: "quiz",
      scenarioText:
        "Sam's company had a major incident last Tuesday. The on-call log is a 500-line wall of timestamps, stack traces, and cascading errors — impossible to read fast under pressure. Sam pipes it directly into Gemini CLI from the terminal:\n\ncat error.log | gemini \"what's the root cause?\"\n\nGemini CLI reads all 500 lines in a single pass, traces the cascade back to a misconfigured connection pool timeout, and returns a three-sentence summary with the exact line numbers of the origin error. Sam didn't open the file once. That's Gemini CLI's 1-million-token context window at work — it can hold an entire codebase, a year of logs, or hundreds of config files in a single session without losing track of any of it.",
      question:
        "Sam runs `gemini 'summarise what changed' --all-files` in a directory with 200 files. What happens?",
      choices: [
        {
          label: "A",
          text: "Gemini CLI processes the first 10 files and returns an error — 200 files exceeds the context limit",
          correct: false,
          feedback:
            "Gemini CLI has a 1-million-token context window. 200 files is well within range. It reads everything before responding, which is precisely what makes it useful for large-scale analysis.",
        },
        {
          label: "B",
          text: "Gemini CLI picks a random sample of files to keep the response fast",
          correct: false,
          feedback:
            "Gemini CLI doesn't sample or guess — it reads all the files. Incomplete context leads to incomplete answers, and Gemini CLI is designed to work with the full picture.",
        },
        {
          label: "C",
          text: "Gemini CLI reads all 200 files and returns a coherent summary of changes across the entire directory",
          correct: true,
          feedback:
            "Correct. The 1-million-token context window means Gemini CLI can hold hundreds of files in a single session without truncating. It reads everything, connects the dots across the whole directory, and gives you a complete answer.",
        },
        {
          label: "D",
          text: "Gemini CLI asks you to select which files to include before it reads anything",
          correct: false,
          feedback:
            "With --all-files, Gemini CLI reads the whole directory automatically. You can always narrow scope with explicit file paths, but the tool doesn't require you to pre-select when you want broad analysis.",
        },
      ],
      xpAward: 100,
    },

    // ── Scene 3 ── The Migration ───────────────────────────────────────────────
    {
      id: "w10-s3",
      type: "scenario",
      character: "Sam",
      location: "TECH COMPANY · SRE TEAM OFFICE · MONDAY · 10:22 AM",
      dialogue: [
        {
          speaker: "Sam",
          avatar: "jake",
          text:
            "Okay. Let's actually do this. I'm going to give it the old format, the new format, and the directory.",
        },
        {
          speaker: "Sam",
          avatar: "jake",
          text:
            "[types]: gemini \"convert all .conf files in ./legacy/ to the new YAML format in ./config/ — here's an example of the old format: [pastes example] and here's the new format: [pastes example]. Write each converted file with the same base name but .yaml extension. Ask me before writing anything.\"",
        },
        {
          speaker: "AI",
          avatar: "npc",
          npcKey: "ai",
          text:
            "Reading ./legacy/… Found 47 .conf files. I've analysed the structure — there are three sub-patterns across the files. I'll normalise all three to the new YAML schema. Ready to write 47 files to ./config/. Confirm to proceed?",
        },
        {
          speaker: "Sam",
          avatar: "jake",
          text: "It found three sub-patterns I didn't even mention. I thought they were all the same format.",
        },
        {
          speaker: "Riya",
          avatar: "npc",
          npcKey: "senora_vega",
          text: "It read every file. You'd have caught those inconsistencies on file 23 at 2am. Type yes.",
        },
        {
          speaker: "AI",
          avatar: "npc",
          npcKey: "ai",
          text:
            "Done. 47 files written to ./config/. 44 followed the primary pattern. 2 had deprecated 'timeout_ms' keys I've mapped to 'timeout_seconds'. 1 had a duplicate key I've deduplicated and flagged for your review: ./config/db-replica.yaml",
        },
        {
          speaker: "Sam",
          avatar: "jake",
          text: "It caught a duplicate key I would have shipped to production.",
        },
        {
          speaker: "Riya",
          avatar: "npc",
          npcKey: "senora_vega",
          text: "That's what happens when something reads every file before it writes anything.",
        },
      ],
      concept: {
        title: "Automate the Tedious, Think About the Interesting",
        body: "Gemini CLI is most powerful when you give it a clear pattern, a target, and permission to ask before it acts.\n\nUseful patterns:\n\nShell piping:\ncat error.log | gemini \"what's the root cause?\"\n\nBatch file operations:\ngemini \"convert all .conf files in ./legacy/ to YAML in ./config/\"\n\nConfirmation before write:\nGemini CLI asks for approval before creating or overwriting files — you stay in control of what lands on disk.\n\nAnomalies flagged automatically:\nWhen Gemini CLI reads all input files before writing, it catches inconsistencies, deprecated patterns, and errors you didn't know to look for.\n\nThe principle: don't automate blindly. Automate with context. Gemini CLI reads first, plans second, confirms third, writes last.",
      },
      question:
        "Which Gemini CLI behaviour protects Sam from accidental file overwrites?",
      choices: [
        {
          label: "A",
          text: "Gemini CLI writes to a hidden temp directory and never touches the target directory directly",
          correct: false,
          feedback:
            "Gemini CLI writes to the directory you specify. It doesn't silently redirect output. The protection comes from the confirmation prompt — you approve the write before it happens, not after.",
        },
        {
          label: "B",
          text: "Gemini CLI asks for explicit confirmation before writing files, giving you the chance to review the plan first",
          correct: true,
          feedback:
            "Correct. The confirmation step is the safeguard. Gemini CLI tells you exactly what it intends to write, to where, and waits for your approval. You see the plan before anything touches disk.",
        },
        {
          label: "C",
          text: "Gemini CLI automatically creates a git commit before every write operation so you can roll back",
          correct: false,
          feedback:
            "Gemini CLI doesn't manage your git history automatically. It can be asked to run git commands, but it doesn't silently commit on your behalf. The built-in protection is the confirmation prompt, not version control.",
        },
        {
          label: "D",
          text: "Gemini CLI only writes to new files and refuses to overwrite any existing file",
          correct: false,
          feedback:
            "Gemini CLI can overwrite existing files — that's often what you want for an in-place update. The protection is that it tells you what it's about to write and waits for a yes before proceeding.",
        },
      ],
      xpAward: 100,
    },

    // ── Scene 4 ── Headless Mode & CI/CD ──────────────────────────────────────
    {
      id: "w10-s4",
      type: "quiz",
      scenarioText:
        "Sam's team ships new modules constantly. Every time a new module lands, someone has to remember to write the test stubs — and they often don't. Sam wants to automate it. Riya shows her the headless flag:\n\ngemini --headless \"write a test for every exported function in src/\"\n\nHeadless mode runs Gemini CLI without any interactive prompts — no confirmation dialogs, no back-and-forth. It reads input, executes the task, and exits. That makes it composable with automation: GitHub Actions steps, pre-commit hooks, cron jobs, deployment scripts. Sam wires it into the CI pipeline as a post-push step — every new module automatically gets test stubs generated and committed to a review branch before the PR is opened.",
      question:
        "Sam wants Gemini CLI to automatically generate test stubs every time a new module is added to the codebase. Which Gemini CLI feature makes this possible?",
      choices: [
        {
          label: "A",
          text: "The --watch flag, which monitors the filesystem and re-runs Gemini CLI whenever a file changes",
          correct: false,
          feedback:
            "There's no built-in --watch flag in Gemini CLI. Filesystem monitoring is handled by the surrounding automation layer — a GitHub Actions trigger, a git hook, or a cron job. Gemini CLI's role is the headless execution step.",
        },
        {
          label: "B",
          text: "Headless mode (--headless), which runs Gemini CLI without interactive prompts so it can be composed into automated pipelines",
          correct: true,
          feedback:
            "Exactly right. --headless strips out all interactive prompts and confirmation dialogs so Gemini CLI can run as a step inside any automation — CI pipelines, git hooks, scheduled tasks. It's the bridge between an interactive tool and an automated one.",
        },
        {
          label: "C",
          text: "MCP server integration, which lets Gemini CLI subscribe to external events like new file creation",
          correct: false,
          feedback:
            "MCP servers extend what Gemini CLI can connect to, but they don't provide event-driven triggers inside a repo. Automation triggers come from the pipeline layer — GitHub Actions, hooks, or cron. MCP is about data sources and tool integrations, not scheduling.",
        },
        {
          label: "D",
          text: "The free tier API, which has no rate limits and can run continuously as a background daemon",
          correct: false,
          feedback:
            "The free tier has a rate limit of 60 requests per minute — it's not an unlimited background daemon. Continuous automation with Gemini CLI works by running it as discrete steps in a pipeline, not as an always-on process.",
        },
      ],
      xpAward: 150,
    },

    // ── Scene 5b ── LIVE Prompt Moment ────────────────────────────────────────
    {
      id: "w10-s5b",
      type: "prompt",
      character: "Sam",
      location: "TECH COMPANY · SRE TEAM OFFICE · MONDAY · 2:15 PM",
      promptChallenge: {
        context:
          "Sam needs to write a shell script that monitors disk usage across 12 servers every 15 minutes, logs to a central file, and sends a Slack webhook alert if any server exceeds 80% disk usage. Sam knows bash and cron well but has never written webhook integration before. They want to give Gemini CLI enough context to produce a complete, production-ready script they can deploy immediately — not a skeleton, not pseudocode, but something that actually runs.",
        goal:
          "Write a prompt for Gemini CLI that gives it enough technical context to produce a complete, working monitoring script Sam can deploy immediately.",
        placeholder: "Write Sam's Gemini CLI prompt for the monitoring script...",
      },
      xpAward: 150,
    },

    // ── Scene 6 ── Boss: Conductor Test ───────────────────────────────────────
    {
      id: "w10-s6",
      type: "boss",
      scenarioText:
        "CONDUCTOR TEST — Sam's team wants to use Gemini CLI to review every pull request for security vulnerabilities before merging. Sam has 60 seconds to choose the right implementation approach.",
      question:
        "Sam's team wants Gemini CLI to review every pull request for security vulnerabilities before merging. Which implementation best uses Gemini CLI's capabilities?",
      choices: [
        {
          label: "A",
          text: "Ask each developer to manually run gemini 'check this file for security issues' on every file they change before pushing",
          correct: false,
          feedback:
            "Manual, per-developer steps break down immediately. People forget, rush, or skip them under deadline pressure. Gemini CLI's headless mode exists precisely so you don't depend on individual discipline — you automate the check into the pipeline where it can't be skipped.",
        },
        {
          label: "B",
          text: "Configure a GitHub Actions step that runs `gemini --headless \"review this diff for security issues: $(git diff main...HEAD)\"` and posts the output as a PR comment",
          correct: true,
          feedback:
            "This is the right architecture. Headless mode runs without interaction. The diff is piped in as context. The output posts automatically as a PR comment — reviewers see the security analysis before approving. It's automated, consistent, and requires zero developer action per PR.",
        },
        {
          label: "C",
          text: "Set up Gemini CLI as an always-on daemon that watches the repo over SSH and reviews code in real time",
          correct: false,
          feedback:
            "Gemini CLI isn't designed as a persistent daemon. It's a request-driven tool — it runs, completes a task, and exits. The right pattern for PR reviews is event-driven: trigger on pull_request events via GitHub Actions, not continuous polling.",
        },
        {
          label: "D",
          text: "Use the Gemini browser interface to paste each PR diff manually and copy the security review back into a PR comment",
          correct: false,
          feedback:
            "Manual copy-paste at the browser interface is exactly the workflow Gemini CLI's headless mode replaces. At any meaningful PR volume, a human doing this for every review becomes the bottleneck. Automate it.",
        },
      ],
      xpAward: 250,
    },

    // ── Scene 7 ── Revelation ─────────────────────────────────────────────────
    {
      id: "w10-s7",
      type: "revelation",
      revealText:
        "Sam migrated 47 config files in 11 minutes.\n\nNot because Sam got faster.\n\nBecause Sam finally stopped doing work a machine should do and started doing work only Sam can do.\n\nThe config migration that would have taken an afternoon — and introduced at least three subtle errors — was done before the second cup of coffee. The duplicate key that would have caused a 3am incident was caught before the file was written.\n\nThe terminal didn't get smarter.\n\nThe engineer using it did.\n\nGemini CLI doesn't replace the instinct to notice something is wrong, the experience to know why, or the judgment to decide what to do next. It handles the part that was always mechanical — reading every file, applying a pattern consistently, catching the thing you'd have missed on file 43 of 47.\n\nThat's always been the whole point.\n\nThe best engineers aren't the ones who can do the most tedious work the fastest.\n\nThey're the ones who know which work shouldn't be done by a person at all.",
      xpAward: 200,
    },

    // ═══ AI COMPARE ══════════════════════════════════════════════════════════
    {
      id: "w10-compare",
      type: "ai-compare",
      character: "Sam",
      location: "SERVER ROOM · TERMINAL OPEN",
      xpAward: 75,
      aiCompare: {
        models: ["gemini", "claude", "copilot"],
        headline: "Gemini CLI vs Claude Code vs GitHub Copilot — Terminal AI Showdown",
        context: "Sam evaluated all three for DevOps and infrastructure automation. Real tasks: bulk file migrations, CI/CD pipeline scripts, security audits. Here's the operational comparison.",
        rows: [
          {
            dimension: "Bulk File Operations",
            winner: "Gemini",
            claude:  "Strong at file operations; requires Claude Code CLI setup",
            chatgpt: "N/A",
            gemini:  "Gemini CLI: processes entire directories in bulk natively",
            copilot: "IDE-focused; limited bulk terminal operations",
            note: "47 config files in 11 minutes. Gemini CLI's batch processing is purpose-built for this.",
          },
          {
            dimension: "Codebase-Wide Refactoring",
            winner: "Claude",
            claude:  "Claude Code: reads entire repo, plans refactors across all files",
            chatgpt: "N/A",
            gemini:  "Strong; handles large codebases via 1M context",
            copilot: "Good at local refactors; less effective for cross-repository changes",
            note: "For complex architectural refactors touching many files — Claude Code's agentic planning wins.",
          },
          {
            dimension: "CI/CD Pipeline Integration",
            winner: "Copilot",
            claude:  "No native GitHub Actions integration",
            chatgpt: "N/A",
            gemini:  "Gemini CLI headless mode: can run in CI/CD pipelines",
            copilot: "Native GitHub Actions, Azure Pipelines, enterprise enterprise toolchain",
            note: "For automated PR reviews and pipeline agents — Copilot has the deepest GitHub integration.",
          },
          {
            dimension: "Google Cloud Integration",
            winner: "Gemini",
            claude:  "No native GCP integration",
            chatgpt: "N/A",
            gemini:  "Native GCP tooling — natural fit for Google Cloud infrastructure",
            copilot: "Azure-native; limited GCP support",
            note: "Sam's team runs on GCP. Gemini CLI is home turf.",
          },
          {
            dimension: "Security Audit Automation",
            winner: "Claude",
            claude:  "Claude Code: reads entire codebase, identifies security patterns systematically",
            chatgpt: "N/A",
            gemini:  "Gemini CLI: can run automated security scans with scripts",
            copilot: "Copilot security features focused on inline code suggestions",
            note: "For a full automated security audit across a repo — Claude Code's systematic reading advantage shows.",
          },
        ],
        verdict: "Gemini CLI for Google Cloud + bulk file operations. Claude Code for deep codebase reasoning and refactoring. Copilot for GitHub-native CI/CD integration. DevOps pros use all three strategically.",
        question: "Sam needs to automatically review every new PR for security vulnerabilities before it merges, running as part of the GitHub Actions CI/CD pipeline. Which tool fits this use case best?",
        choices: [
          {
            label: "A",
            text: "Gemini CLI in headless mode — can run automated tasks in pipelines",
            correct: false,
            feedback: "Gemini CLI's headless mode is powerful for automation — but it lacks the native GitHub Actions integration that makes Copilot a natural fit for PR review automation in a GitHub workflow. Integration depth matters here.",
            wrongFeedback: "Gemini CLI's headless mode is powerful for automation — but it lacks the native GitHub Actions integration that makes Copilot a natural fit for PR review automation in a GitHub workflow. Integration depth matters here.",
          },
          {
            label: "B",
            text: "GitHub Copilot — native GitHub Actions integration designed for exactly this workflow",
            correct: true,
            feedback: "Right. Copilot's native GitHub integration means PR review automation is a first-class workflow — not a workaround. For CI/CD pipeline agents that live inside GitHub Actions, Copilot has the deepest, most reliable integration.",
          },
          {
            label: "C",
            text: "Claude Code — strongest at systematic security analysis across large codebases",
            correct: false,
            feedback: "Claude Code's security analysis is excellent — but it requires terminal-level setup and doesn't have native GitHub Actions integration for automated PR workflows. For this specific use case, the integration architecture of Copilot is the decisive factor.",
            wrongFeedback: "Claude Code's security analysis is excellent — but it requires terminal-level setup and doesn't have native GitHub Actions integration for automated PR workflows. For this specific use case, the integration architecture of Copilot is the decisive factor.",
          },
        ],
      },
    },

    // ═══ HANDOFF ═════════════════════════════════════════════════════════════
    {
      id: "w10-handoff",
      type: "handoff",
      character: "Sam",
      location: "SERVER ROOM · END OF SHIFT",
      xpAward: 0,
      dialogue: [
        {
          speaker: "Sam",
          avatar: "protagonist" as const,
          text: "You've seen what AI looks like at the infrastructure layer. It's not chat. It's automation. Scripts running, files moving, pipelines executing. That's what happens when AI touches the command line.",
        },
        {
          speaker: "Sam",
          avatar: "protagonist" as const,
          text: "Now here's the wild thing — most people in business never get anywhere near a terminal. They live in email and spreadsheets and slide decks.",
        },
        {
          speaker: "Sam",
          avatar: "protagonist" as const,
          text: "And there's an AI that lives RIGHT THERE. In Microsoft 365. In Outlook, Word, Excel, Teams. Most organizations already have it turned on. Most employees have no idea.",
        },
        {
          speaker: "Sam",
          avatar: "protagonist" as const,
          text: "Jake — the guitarist from the beginning — he found it. He's running his school's music club using Copilot across all of M365. Scheduling, budgeting, meeting summaries, event planning.",
        },
        {
          speaker: "Sam",
          avatar: "protagonist" as const,
          text: "The AI you didn't know you already had. Go find it.",
        },
      ],
    },

  ],
}
