## 2026-06-18T18:11:02Z
You are tasked with implementing the revamp of the Next.js visual novel game engine (maestro-play) based on the requirements below.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your working directory is C:/Users/night/Documents/ClaudeAgent/maestro-play/.agents/worker_m2.

### Scope of Work:

1. **R1. Character Art Alignment and Poses (Jake)**
   - In `components/game/NovelScene.tsx`, dynamically load the correct emotion-specific image based on the dialogue's emotion state (excited, thinking, tense, or neutral).
   - Fall back to the base image if the emotion asset is missing or fails to load.
   - Implement this by replacing the NPC and protagonist `<img>` tags with a helper component or inline fallback logic that handles the `.png` -> `_[emotion].png` swap and hooks into `onError` to fall back to the base image.

2. **R2. Track D Data Fix (Jake / Tyler protag swap)**
   - In `lib/games/game11.ts` and `lib/games/game12.ts`, make sure the protagonist is "Jake" and the NPC is "Tyler".
   - Review and update all dialogues in both files so that Jake is the guitarist and main character learning Copilot/Copilot Studio, and Tyler is the NPC friend/president guiding him.
   - Update `intro.sceneImage` to `"/images/scene-jake-copilot.png"` and `"/images/scene-jake-studio.png"` respectively.
   - Correct the `nextGame` transitions in `game10.ts` and `game11.ts` to show Jake as the character for Track D.

3. **R3. Visual Novel Engine Upgrades (Mouth movements & Bounce reduction)**
   - Define a `MOUTH_POSITIONS` constant mapping character keys (e.g., `jake`, `tyler`, `senora_vega`, `zoe`, `carlos`, etc.) to percentage coordinates `{ top: string; left: string }`.
   - Implement a procedural mouth overlay component (`CharacterMouth`) in `NovelScene.tsx` placed using `MOUTH_POSITIONS` coordinates. It must render a subtle lip-colored oval that opens and closes dynamically when the character is talking (typewriter active: `!textDone`) and disappears when quiet. Use Framer Motion `motion.div` for a clean loop.
   - Reduce character bounciness in `NovelScene.tsx`:
     - Disable `char-lipsync` body jitter completely (set the `@keyframes char-lipsync` transform to `scaleY(1) translateY(0)`).
     - Set `char-breathe` keyframes to a very subtle scale modification: `scaleY(1.002)` and `translateY(0)`.
     - Tone down the Framer Motion excitement jump transition from `[0, -18, -4, 0]` to `[0, -4, 0]` (update all occurrences of this array in `NovelScene.tsx`).

4. **R4. Sound Levels & Dialogue Text Condensing**
   - In `components/game/SoundEngine.tsx`, lower default target ambient music volumes: `cinematic` to `0.003`, `revelation` to `0.004`, and `normal` to `0.002`.
   - In `components/game/GameEngine.tsx`, locate the victory screen or completion fade-out volume and ensure it is capped at `0.02`.
   - Audit and shorten all long scenario and dialogue text blocks across the game TS files (`game1.ts` through `game14.ts` and `game1v2.ts`) so they are punchy and fit easily inside dialogue balloons. Ensure they don't overflow the UI.

5. **Verification**
   - Run type checks: `npx tsc --noEmit`. Fix any compilation issues.
   - Run Playwright test suites: `node scripts/test-out-of-lives.js` and `node scripts/test-path-d.js` to ensure they pass completely. (You may start the local development server if needed, or run the scripts directly).

Please write a detailed report of changes made (changes.md) and handoff.md in your working directory. Report back when completed.
