# Original User Request

## Initial Request — 2026-06-18T18:07:26Z

You are the Project Orchestrator. Your identity is teamwork_preview_orchestrator.
Your working directory is C:/Users/night/Documents/ClaudeAgent/maestro-play/.agents/orchestrator.
Your task is to revamp the Next.js visual novel game engine (maestro-play) to align character portraits, implement emotion-specific character poses, add typewriter-synchronized mouth movements, reduce character bounce animations, adjust music volume, and condense scenario dialogue text, as specified in the original request at C:/Users/night/Documents/ClaudeAgent/maestro-play/ORIGINAL_REQUEST.md.

You are expected to:
1. Decompose the request into logical milestones and maintain a plan in `plan.md` in your working directory.
2. Maintain active progress tracking in `progress.md` in your working directory.
3. Spawn workers or peer agents to implement and verify code edits.
4. When all requirements are met and verified, send a message back to me (the Sentinel) claiming completion.

Ensure all instructions and constraints from ORIGINAL_REQUEST.md are fully satisfied. Let's begin.

## Follow-up — 2026-06-18T18:11:17Z

CRITICAL DESIGN FEEDBACK:
The user has clarified that the dynamic emotion-specific pose system must support the WHOLE game (all characters, not just Jake). 

To implement this robustly without hardcoding which characters have emotion assets (which would cause 404 errors in the browser for unmapped characters), please implement an `onError` fallback pattern in React for the character portraits:

1. Use a state variable for the image source (initialized to the base image or resolved emotion image).
2. When the emotion changes, compute the emotion image path (e.g. `/images/zoe_excited.png` from `/images/zoe.png`).
3. If the image fails to load (triggering the `onError` event handler), catch the error and immediately fall back to the base character image.
4. This allows any character to support pose-swapping dynamically if their `_excited.png`, `_thinking.png`, or `_tense.png` assets are generated/present, while safely defaulting to their neutral portrait otherwise.

Please incorporate this into the visual novel engine revamp.

## Follow-up — 2026-06-18T18:28:25Z

CRITICAL BUG / USER FEEDBACK:
The user reported: "Jake's bedroom scene, the very first piece of the game is still standing still. no animation. this is on port 3099 btw"

To fix this and make the entire game feel alive:
1. In `components/game/CinematicIntro.tsx`, replace the raw CSS `@keyframes cin-ken-burns` animation on the background scene image with a Framer Motion `<motion.img>` that executes a slow, infinite Ken Burns zoom/pan loop (e.g. scale: [1, 1.07, 1], x: [0, -8, 0], y: [0, 4, 0] over 45s).
2. Similarly, in `components/game/NovelScene.tsx` and `components/game/VisualNovelScene.tsx`, convert the background scene image into a `<motion.img>` with a very slow, subtle infinite pan/zoom camera motion. This will ensure that NO scene background in the entire game is ever static or "standing still".

Please apply this fix immediately.


