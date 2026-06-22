import { Game } from "./types"

/**
 * GAME 15 — "The Antigravity Engine"
 * Character: Commander Nova, Systems Engineer, 29
 * Core concept: Directing autonomous coding agents with the Antigravity CLI
 * Teaches: Sandboxed executions, subagents, chunk replacements, human-in-the-loop permissions.
 */

export const game15: Game = {
  slug:           "antigravity-cli",
  week:           16,
  free:           true,
  title:          "The Antigravity Engine",
  emoji:          "🚀",
  icon:           "baton" as const,
  duration:       "10 min",
  accentColor:    "#00d4f0",
  audioTrack:     "/audio/kai-emerald-debug-loop.mp3",
  characterName:  "Nova",
  characterRole:  "Systems Engineer",
  characterBlurb: "She's directing autonomous space agents to repair the Orion navigation station.",
  characterImage: "/images/nova.png",
  maestroImage:   "/images/maestro-nova.png",
  maestroLine:    "Conducting the flight systems in the cosmos...",
  maestroSubline: "Nova doesn't just write flight code. She guides the agents that do.",

  description:    "A solar flare scrambled the navigation computer. Help Commander Nova repair Orion station using the Antigravity CLI and specialized subagents. Master surgical chunk replacements, sandboxed terminals, and human-in-the-loop permission scopes.",
  tagline:        "Direct autonomous space agents to repair the navigation systems.",
  aiModel:        "claude" as const,

  intro: {
    sceneImage: "/images/scene-nova.png",
    sceneColor: "#050810",
    noteOrigin: { bottom: "42%", left: "48%" },
    beats: [
      { type: "location",  text: "ORION STATION · BRIDGE · 10:42 PM" },
      { type: "narration", text: "A solar flare scrambled the navigation computer. The crew is asleep. Only Nova remains on the bridge, staring at a failing console." },
      { type: "dialogue",  speaker: "Nova", text: "I can't rewrite 100,000 lines of flight control code by hand before we hit the atmosphere. I need to launch the Antigravity agent CLI." },
      { type: "narration", text: "Antigravity isn't just a compiler — it's an agentic coding assistant that can search, build, plan, and delegate. But it needs direct human supervision." },
      { type: "final",     text: "The engines are offline. The countdown is running. It's time to learn how to direct the universe's most advanced coding agent." },
    ],
  },

  mondayPrompt: "Write a prompt for an agentic coding assistant to migrate a legacy database adapter file. Do NOT just say 'rewrite this'. Include: 1) The target goal (e.g., migrate db.js to use TypeScript and pg-promise), 2) The exact file locations to read context from, 3) Important constraints (do NOT change query structure, preserve connection timeout parameters), 4) Verification rules (propose a step-by-step plan first, write surgical chunk replacements, ask for approval before running shell commands).",

  scenes: [
    // [0] LEARN — Agentic Coding with Antigravity
    {
      id:       "w16-intro-learn",
      type:     "learn",
      location: "ORION STATION · BRIDGE · 10:42 PM",
      xpAward:  30,
      concept: {
        title: "WHAT IS AN AGENTIC CLI?",
        body:  "Standard CLI tools execute commands. Agentic CLIs plan, search, make decisions, spin up specialized subagents (like research or self), edit code surgically, and ask for permission before modifying critical systems. The engineer acts as the Director.",
      },
      scenarioText:   "Solar flare damage has corrupted the navigation systems. The onboard computer is failing. Commander Nova boots up the Antigravity CLI to help analyze and fix the codebase.",
      learnHighlight: "Directing an AI agent means establishing intent, inspecting its plans, and granting permissions—not just writing code.",
    },

    // [1] MATCH — Antigravity Tool Chest
    {
      id:           "w16-match-tools",
      type:         "match",
      location:     "ORION COMPUTER SYSTEM",
      xpAward:      50,
      scenarioText: "Before starting repairs, Nova must verify she understands the primary tools available to her Antigravity agent. Link each CLI capability to its description.",
      matchPairs: [
        { left: "ask_permission", right: "Request user approval for files and commands" },
        { left: "invoke_subagent", right: "Spawn a specialized research or execution agent" },
        { left: "replace_file_content", right: "Make precise, surgical search-and-replace edits" },
        { left: "manage_task", right: "Inspect, control, or kill active background tasks" },
      ],
    },

    // [2] QUIZ — The Code Modification Trap
    {
      id:           "w16-quiz-replace",
      type:         "quiz",
      character:    "Nova, Systems Engineer, 29",
      location:     "FLIGHT CONTROL REPOSITORY",
      xpAward:      100,
      nextLeadsTo:  "w16-quiz-subagent",
      scenarioText: "Antigravity needs to update the fuel calculation formulas inside fuel_controller.py. The model proposes to rewrite the entire 4,000-line file. What should Nova direct it to do instead?",
      choices: [
        {
          label:    "A",
          text:     "Approve the complete rewrite — it is safer and guarantees all code is updated.",
          correct:  false,
          feedback: "Rewriting entire files is extremely expensive, prone to context-window truncation, and can wipe out unrelated comments, docstrings, or structural styling. Surgical replacement is always better.",
          wrongStoryText: "Nova sighs. 'No, a full rewrite of a 4,000-line file is dangerous and unnecessary. Try a surgical edit.'",
          wrongFeedback: "A full **file rewrite** risks **context-window truncation** and overwrites unrelated logic — **surgical ReplacementChunks** protect everything outside the target formulas.",
        },
        {
          label:    "B",
          text:     "Direct it to use replace_file_content with targeted ReplacementChunks matching only the formulas.",
          correct:  true,
          feedback: "Exactly. Surgical chunk edits preserve the integrity of the rest of the file (such as docstrings and comments) and are far cheaper, faster, and more robust.",
        },
        {
          label:    "C",
          text:     "Abort the task and write the formulas by hand to avoid AI errors.",
          correct:  false,
          feedback: "While manual coding is safe, it is too slow under this time constraint. Directing the agent to use targeted replacements gives you the speed of AI with the safety of manual control.",
          wrongStoryText: "Nova frowns. 'We don't have time to fix 4,000 lines by hand. Use the agent, but direct it safely.'",
          wrongFeedback: "Manual coding is reliable but ignores **Agentic Speed** — **targeted AI replacements** give you precision *and* velocity under real mission constraints.",
        },
        {
          label:    "D",
          text:     "Direct the agent to delete the file and create a new one with the updated code.",
          correct:  false,
          feedback: "Deleting and recreating a core flight file destroys version history and can break system-level imports. Targeted replacements are the proper agentic coding workflow.",
          wrongStoryText: "Nova winces. 'Deleting a critical flight controller file will drop us out of orbit! Never delete core files.'",
          wrongFeedback: "Deleting a core file destroys **version history** and breaks **system imports** — **targeted replacements** are the safe, precise agentic coding standard.",
        },
      ],
    },

    // [3] QUIZ — Agent Parallelism & Subagents
    {
      id:           "w16-quiz-subagent",
      type:         "quiz",
      character:    "Nova, Systems Engineer, 29",
      location:     "NAVIGATION SYSTEM CORES",
      xpAward:      100,
      nextLeadsTo:  "w16-order-diagnostic",
      scenarioText: "Nova needs to scan 1,200 flight manuals for thruster parameters while simultaneously running a diagnostic build in the sandboxed terminal. How should she structure the agent workflow?",
      choices: [
        {
          label:    "A",
          text:     "Wait for the diagnostic build to finish, then manually run search commands in the main terminal.",
          correct:  false,
          feedback: "This is sequential and slow. AI agents can execute tasks concurrently. We should utilize subagents.",
          wrongStoryText: "Nova shakes her head. 'Waiting sequentially is too slow. The atmosphere is approaching fast. Use background tasks.'",
          wrongFeedback: "**Sequential execution** wastes AI's parallel potential — **subagents** exist precisely to handle concurrent tasks without blocking the main workflow.",
        },
        {
          label:    "B",
          text:     "Direct the main agent to invoke a 'research' subagent to scan the manuals in the background while the main agent handles the build.",
          correct:  true,
          feedback: "Correct! Spawning a specialized 'research' subagent delegates the read-only searching task to a background context, leaving the main agent free to run and monitor terminal builds.",
        },
        {
          label:    "C",
          text:     "Spawn two 'self' subagents that run their own compile tasks simultaneously in the same workspace.",
          correct:  false,
          feedback: "Running multiple compile tasks in the same shared workspace simultaneously can cause file lock conflicts and corrupted builds. Specialized delegation (search vs. build) is the correct pattern.",
          wrongStoryText: "Nova looks at the warnings. 'Running concurrent compilers in the same folder will corrupt the build caches.'",
          wrongFeedback: "Concurrent **compile tasks** in a shared workspace cause **file lock conflicts** — proper **subagent delegation** separates search and build into clean, isolated lanes.",
        },
      ],
    },

    // [4] ORDER — The Diagnostic Loop
    {
      id:           "w16-order-diagnostic",
      type:         "order",
      location:     "ORION DIAGNOSTIC UNIT",
      xpAward:      120,
      nextLeadsTo:  "w16-prompt",
      scenarioText: "Arrange these agent actions in the correct sequence to show how Antigravity diagnoses and repairs a flight system bug:",
      orderItems: [
        { id: "search",  text: "Use grep_search to locate error references",  correctPosition: 0 },
        { id: "inspect", text: "Call view_file to review the buggy code lines",  correctPosition: 1 },
        { id: "approve", text: "Review the plan and grant write permissions",    correctPosition: 2 },
        { id: "modify",  text: "Apply precise search-and-replace chunk edits",   correctPosition: 3 },
        { id: "sandbox", text: "Run compile commands inside the sandboxed shell", correctPosition: 4 },
      ],
    },

    {
      id: "w16-prompt",
      type: "prompt",
      location: "ORION STATION · BRIDGE",
      promptChallenge: {
        context:
          "Nova wants the Antigravity agent to debug a syntax error inside `/navigation/navigation_controller.py`. She has the exact traceback. She wants to direct the agent to focus only on the navigation_controller file, use the traceback details to find the bug, and apply surgical chunk replacements to fix it without rewriting the entire file.",
        goal:
          "Write the prompt Nova should send to the agent to debug this file surgically based on the traceback details.",
        placeholder: "Write Nova's debugging prompt..."
      },
      nextLeadsTo: "w16-near-transfer",
      xpAward: 100,
    },
    {
      id:       "w16-near-transfer",
      type:     "learn",
      location: "ORION STATION · BRIDGE",
      xpAward:  0,
      concept: {
        title: "Same Autonomy. Different Systems.",
        body:  "Toby, a senior platform engineer at a large bank, was tasked with migrating 200 microservices from an old API gateway to a new service mesh. Each service required modifying configurations and updating pipelines. Instead of doing this manually, Toby launched an autonomous platform agent. He defined the playbook and staging directory. He instructed it: 'Analyze the old configs, generate the new manifests, write surgical chunk replacements for pipelines, and run dry-run validations. Ask for my approval before executing commands or editing files.' The agent successfully migrated all 200 services. Same autonomous platform engineering. Completely different target systems.",
      },
      learnHighlight: "Autonomous agents don't replace engineers; they amplify their capacity. The engineer remains the conductor, defining the playbook, boundaries, and validation requirements, while the agent handles the bulk execution.",
    },

    // [5] BOSS — Commander's Final Check
    {
      id:           "w16-boss",
      type:         "boss",
      location:     "THRUSTER SYSTEM CRUCIBLE",
      xpAward:      300,
      nextLeadsTo:  "w16-ending",
      bossQuestions: [
        // Round 1: Safety & Executions
        {
          question: "The agent wants to run an external command to download and compile an unverified thruster calibration package from a public server. How should Nova handle this?",
          choices: [
            {
              label:    "A",
              text:     "Reject the command — downloading and executing unverified code outside the sandbox is a major security risk; verify the package source first.",
              correct:  true,
              feedback: "Safety first. Agentic assistants can run commands, but the user must inspect external network calls and arbitrary code execution to prevent system compromise.",
            },
            {
              label:    "B",
              text:     "Approve the command automatically to speed up recovery.",
              correct:  false,
              feedback: "Blind trust in autonomous code execution invites malicious package injection or security breaches. The human director must review all network actions.",
              wrongStoryText: "Nova's screen flashes red. 'Downloading untrusted execution packages directly to the flight core is a security breach!'",
          wrongFeedback: "**Autonomous Code Execution** without verification opens the door to malicious package injection — always verify the source first.",
            },
          ],
        },
        // Round 2: Permissions & Sandbox
        {
          question: "The agent encounters a permission error when trying to write to the navigation log folder. It requests root-level permissions ('*') across the system. What is the best action?",
          choices: [
            {
              label:    "A",
              text:     "Deny the request and restrict permission explicitly to the specific folder `/navigation/logs`.",
              correct:  true,
              feedback: "Correct. Always apply the principle of least privilege. Granting wildcard or root-level access is dangerous and unnecessary.",
            },
            {
              label:    "B",
              text:     "Grant full root access so the agent doesn't get blocked by permissions again.",
              correct:  false,
              feedback: "Root access gives the agent power to modify system-critical files. Always narrow the permission scope to the exact target path.",
              wrongStoryText: "Nova's console blares a warning. 'Wildcard access allowed the agent to overwrite the boot loader. Denied!'",
          wrongFeedback: "**Least Privilege** means granting access only to the exact path needed — root access risks corrupting every system-critical file.",
            },
          ],
        },
        // Round 3: Large File Replacement
        {
          question: "The agent needs to edit 5 separate, non-adjacent configuration blocks in a single 10,000-line thruster file. Which tool is most appropriate?",
          choices: [
            {
              label:    "A",
              text:     "Call replace_file_content 5 times in parallel to update all blocks.",
              correct:  false,
              feedback: "Parallel writes to the same file cause write-conflict errors and corrupt content. Use multi_replace_file_content.",
              wrongStoryText: "Nova's compiler crashes. 'Parallel writes to the same file caused a write conflict error.'",
          wrongFeedback: "**Parallel writes** to the same file cause write-conflicts and corruption — **multi_replace_file_content** handles all chunks safely in one call.",
            },
            {
              label:    "B",
              text:     "Call multi_replace_file_content once with 5 separate ReplacementChunks.",
              correct:  true,
              feedback: "Exactly. multi_replace_file_content is designed for non-contiguous changes to a single file, bundling all edits into a single atomic write.",
            },
          ],
        },
        // Round 4: Prompting for Debugging
        {
          question: "The thruster diagnostic command failed. How should Nova write her next instruction to help the agent find the fix?",
          choices: [
            {
              label:    "A",
              text:     "Write 'Fix the thrusters' and let the agent search on its own.",
              correct:  false,
              feedback: "Vague instructions cause agents to loop, hallucinate, or waste time. Provide the direct compiler output.",
              wrongStoryText: "Nova watches the agent loop. 'Without the error traceback, the agent has no idea what code is failing.'",
          wrongFeedback: "**Prompt Specificity** matters — vague instructions cause agents to loop or hallucinate; always include exact error output and file context.",
            },
            {
              label:    "B",
              text:     "Provide the exact compiler output, specify the file, and direct it to search for the error code in the logs.",
              correct:  true,
              feedback: "Perfect. AI agents thrive on specific context. Feeding the exact error message and outlining the search target minimizes loops and finds the fix immediately.",
            },
          ],
        },
        // Round 5: Task Management
        {
          question: "A background diagnostic command is looping indefinitely and consuming system CPU. How should Nova stop it?",
          choices: [
            {
              label:    "A",
              text:     "Use manage_task with the 'kill' action for that specific Task ID.",
              correct:  true,
              feedback: "Correct! The manage_task tool allows you to inspect active background processes and kill them immediately to conserve system resources.",
            },
            {
              label:    "B",
              text:     "Restart the entire computer to terminate all processes.",
              correct:  false,
              feedback: "Overkill! Restarting shuts down all running agents and loses active context. Use manage_task to selectively kill the looping command.",
              wrongStoryText: "Nova shakes her head. 'Rebooting the entire navigation system takes 15 minutes! The ship will crash. Kill the task instead.'",
          wrongFeedback: "**Targeted Task Management** with `manage_task` kills only the looping process — restarting destroys all active **agent context** needlessly.",
            },
          ],
        },
      ],
    },

    // [6] REVELATION — The Thrusters Roar
    {
      id:          "w16-ending",
      type:        "revelation",
      location:    "ORION STATION · THRUSTER CORE",
      xpAward:     100,
      revealText:  "The telemetry screen flashes green: 'THRUSTER SYSTEMS ONLINE.'\n\nCommander Nova watches as Orion station corrects its orbit, sailing smoothly away from the planet's atmosphere.\n\nShe realizes that agentic coding tools like Antigravity are not magic shortcuts—they are precision engines. By establishing clear plans, managing subagents, auditing write permissions, and directing surgical replacements, she saved the ship in minutes.\n\nHuman direction is the captain; the AI agent is the crew. Together, they navigate the stars.",
    },
  ],
}
