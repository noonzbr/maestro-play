# Original User Request

## Initial Request — 2026-06-18T18:07:10Z

Revamp the Next.js visual novel game engine (maestro-play) to align character portraits, implement emotion-specific character poses, add typewriter-synchronized mouth movements, reduce character bounce animations, adjust music volume, and condense scenario dialogue text.

Working directory: C:/Users/night/Documents/ClaudeAgent/maestro-play
Integrity mode: development

## Requirements

### R1. Character Art Alignment and Poses (Jake)
- Jake's primary portrait in `/images/guitarplayer1.png` must be the newly generated high-quality portrait matching the global style.
- Jake must have emotion-specific poses: `/images/guitarplayer1_excited.png`, `/images/guitarplayer1_thinking.png`, and `/images/guitarplayer1_tense.png`.
- The game engine must dynamically load the correct emotion-specific image based on the dialogue's emotion state, falling back to the base image if the emotion asset is missing or not supported.

### R2. Track D Data Fix (Jake / Tyler protag swap)
- In `lib/games/game11.ts` and `lib/games/game12.ts`, change the protagonist to "Jake" and the NPC to "Tyler".
- Update all dialogues in both files so that Jake is the guitarist and main character learning Copilot/Copilot Studio, and Tyler is the NPC friend/president guiding him.
- Update `intro.sceneImage` to `"/images/scene-jake-copilot.png"` and `"/images/scene-jake-studio.png"` respectively.
- Correct the `nextGame` transitions in `game10.ts` and `game11.ts` to show Jake as the character for Track D.

### R3. Visual Novel Engine Upgrades (Mouth movements & Bounce reduction)
- Implement a procedural mouth overlay component (`CharacterMouth`) in `NovelScene.tsx` placed using `MOUTH_POSITIONS` percentage coordinates.
- The mouth component must render a subtle lip-colored oval that opens and closes dynamically when the character is talking (typing text) and disappears when quiet.
- Reduce character bounciness: disable `char-lipsync` body jitter completely. Set `char-breathe` keyframes to a very subtle scale modification (e.g. `scaleY(1.002)` / `translateY(0)`), and tone down the Framer Motion excitement jump transition from `[0, -18, -4, 0]` to `[0, -4, 0]`.

### R4. Sound Levels & Dialogue Text Condensing
- In `SoundEngine.tsx`, lower default target ambient music volumes: `cinematic` to `0.003`, `revelation` to `0.004`, and `normal` to `0.002`.
- Cap the complete victory fade-out volume in `GameEngine.tsx` at `0.02`.
- Audit and shorten all long scenario and dialogue text blocks across the game TS files (`game1.ts` through `game14.ts` / `game1v2.ts`) so they are punchy and fit easily inside dialogue balloons.

## Verification

### V1. Programmatic Checks
- Run type check `npx tsc --noEmit` and verify zero compiler errors.
- Run Playwright test suites: `node scripts/test-out-of-lives.js` and `node scripts/test-path-d.js`. Both must pass completely.

### V2. Visual Checks
- Verify that `guitarplayer1.png`, `guitarplayer1_excited.png`, `guitarplayer1_thinking.png`, and `guitarplayer1_tense.png` all exist and match the character features.

## Acceptance Criteria

- [ ] All TypeScript files compile cleanly.
- [ ] Both Playwright test suites pass successfully.
- [ ] In Track D, Jake is correctly rendered as the protagonist on the right side and Tyler as the NPC on the left side.
- [ ] Dialogue text is condensed and easy to read.
- [ ] Whole-body character bounciness during speech is eliminated; speech is represented by the mouth overlay opening/closing.
- [ ] Global music volume is set to low ambient levels and the complete screen fade volume is capped at `0.02`.

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


