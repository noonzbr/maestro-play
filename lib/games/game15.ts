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
        },
        {
          label:    "D",
          text:     "Direct the agent to delete the file and create a new one with the updated code.",
          correct:  false,
          feedback: "Deleting and recreating a core flight file destroys version history and can break system-level imports. Targeted replacements are the proper agentic coding workflow.",
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
        },
      ],
    },

    // [4] ORDER — The Diagnostic Loop
    {
      id:           "w16-order-diagnostic",
      type:         "order",
      location:     "ORION DIAGNOSTIC UNIT",
      xpAward:      120,
      nextLeadsTo:  "w16-boss",
      scenarioText: "Arrange these agent actions in the correct sequence to show how Antigravity diagnoses and repairs a flight system bug:",
      orderItems: [
        { id: "search",  text: "Use grep_search to locate error references",  correctPosition: 0 },
        { id: "inspect", text: "Call view_file to review the buggy code lines",  correctPosition: 1 },
        { id: "approve", text: "Review the plan and grant write permissions",    correctPosition: 2 },
        { id: "modify",  text: "Apply precise search-and-replace chunk edits",   correctPosition: 3 },
        { id: "sandbox", text: "Run compile commands inside the sandboxed shell", correctPosition: 4 },
      ],
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
