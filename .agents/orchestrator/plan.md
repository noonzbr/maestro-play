# Plan - Next.js Visual Novel Revamp

## Objectives & Success Criteria
- Clean TypeScript compilation (`npx tsc --noEmit`).
- All Playwright tests pass: `node scripts/test-out-of-lives.js` and `node scripts/test-path-d.js`.
- Jake is protagonist on the right side and Tyler as NPC on the left side in Track D (game11/game12).
- Dialogue text is condensed and readable inside balloons.
- Whole-body character bounciness during speech is eliminated; mouth overlay opens/closes dynamically.
- Ambient music volume set to low levels and victory screen fade volume capped at 0.02.
- Jake's primary, excited, thinking, and tense images exist and are dynamically loaded.

## Execution Steps

### Phase 1: Exploration & Analysis
- **Step 1.1**: Spawn an Explorer to locate the files and analyze the structure:
  - Game files: `lib/games/game1.ts` to `game14.ts`, `game1v2.ts`.
  - UI files: `NovelScene.tsx`, `GameEngine.tsx`, `SoundEngine.tsx`.
  - Poses/Portraits: Locate the images directory and existing assets, see what's in `/images/`.
  - Look for existing mouth positioning coordinates or how the layout works.
  - Determine where character animation styles and keyframes are defined (e.g. `char-lipsync`, `char-breathe`, excitement jump animation).

### Phase 2: Implementation (Visual Novel Engine & Sound upgrades)
- **Step 2.1**: Implement the visual upgrades:
  - Procedural mouth overlay component (`CharacterMouth`) in `NovelScene.tsx`.
  - Position it using `MOUTH_POSITIONS` percentage coordinates.
  - Tweak character bouncing: disable `char-lipsync` body jitter completely, set `char-breathe` keyframes to subtle scale modification, and tone down the Framer Motion excitement jump transition from `[0, -18, -4, 0]` to `[0, -4, 0]`.
  - Convert background scene images in `CinematicIntro.tsx`, `NovelScene.tsx`, and `VisualNovelScene.tsx` into `<motion.img>` with an infinite slow Ken Burns pan/zoom loop so no background is static.
- **Step 2.2**: Update volumes in `SoundEngine.tsx` and `GameEngine.tsx`.
- **Step 2.3**: Spawn a Worker to perform these changes.

### Phase 3: Implementation (Character Poses & Track D Swap)
- **Step 3.1**: Check and verify Jake's and other character portraits exist.
- **Step 3.2**: Implement dynamic loading of emotion-specific images for all characters based on dialogue's emotion state in `NovelScene.tsx` using the `onError` fallback pattern to support the whole game robustly.
- **Step 3.3**: Perform protagonist swap (Jake/Tyler swap) in `lib/games/game11.ts` and `lib/games/game12.ts`. Update dialogue, intro scene images, and nextGame transitions in `game10.ts` and `game11.ts`.
- **Step 3.4**: Spawn a Worker to perform these changes.

### Phase 4: Implementation (Dialogue Text Condensing)
- **Step 4.1**: Shorten all long scenario and dialogue text blocks across `game1.ts` through `game14.ts` / `game1v2.ts`.
- **Step 4.2**: Spawn a Worker to implement the condensed dialogue text.

### Phase 5: Verification & Auditing
- **Step 5.1**: Run TS compiler check and Playwright tests.
- **Step 5.2**: Spawn a Reviewer to verify correctness.
- **Step 5.3**: Spawn a Challenger to check for regression/integrity.
- **Step 5.4**: Spawn a Forensic Auditor to ensure no cheating/hardcoding of test results.

## Status Tracking
- Phase 1: Planned
- Phase 2: Planned
- Phase 3: Planned
- Phase 4: Planned
- Phase 5: Planned
