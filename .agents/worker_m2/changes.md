# Changes Made

This document details the modifications made to implement the maestro-play visual novel game engine revamp.

## 1. R1. Character Art Alignment and Poses
- **File modified**: `components/game/NovelScene.tsx`
- **Updates**:
  - Implemented the `CharacterImage` helper component. It builds emotion-specific URLs (`_excited`, `_thinking`, `_tense`) based on the current dialogue sentiment and maps them to `.png` suffixes while preserving query parameters.
  - Implemented an `onError` event handler in `CharacterImage` to gracefully fall back to the base portrait if the emotion-specific asset is missing or fails to load.
  - Replaced the raw `<img>` tags for both the NPC and protagonist portraits with the new `<CharacterImage>` component, ensuring emotion-specific art works for all characters across the game.

## 2. R2. Track D Data Fix (Jake / Tyler protag swap)
- **Files modified**: `lib/games/game11.ts`, `lib/games/game12.ts`, `lib/games/game10.ts`
- **Updates**:
  - Swap roles in `game11.ts` and `game12.ts` so that Jake is the main protagonist (guitarist & music club officer) and Tyler is the NPC president guiding him.
  - Replaced `Ms. Chen` (advisor) dialogue lines in `game11.ts` with `Tyler` (president), utilizing the `tyler` NPC config.
  - Updated narration beats (e.g. from "Jake was the club president..." to "Tyler was the club president, but Jake was handling the FAQ.").
  - Verified `nextGame` transitions in `game10.ts` and `game11.ts` point to Jake as the character for Track D.
  - Corrected `game12.ts` transition teaser line to describe Jake building the MelodyBot instead of Tyler.

## 3. R3. Visual Novel Engine Upgrades (Mouth movements & Bounce reduction)
- **Files modified**: `components/game/NovelScene.tsx`, `components/game/VisualNovelScene.tsx`, `components/game/CinematicIntro.tsx`
- **Updates**:
  - Defined the `MOUTH_POSITIONS` coordinate constant mapping percentage positions (`top`, `left`) for all character keys (`jake`, `tyler`, `senora_vega`, `zoe`, `carlos`, etc.).
  - Added the procedural `CharacterMouth` component to render a subtle lip-colored oval that opens and closes dynamically when a character is talking (`!textDone`) and disappears when quiet.
  - Disabled `char-lipsync` body jitter completely in CSS keyframes (transform set to `scaleY(1) translateY(0)`).
  - Set `char-breathe` keyframes to a very subtle scale modification: `scaleY(1.002)` and `translateY(0)`.
  - Toned down the Framer Motion excitement jump transition array from `[0, -18, -4, 0]` to `[0, -4, 0]`.
  - Replaced static background scene image containers with `<motion.img>` that executes a slow, infinite Ken Burns zoom/pan loop in `CinematicIntro.tsx` (scale: `[1, 1.07, 1]`, x: `[0, -8, 0]`, y: `[0, 4, 0]`) and a subtle camera loop in `NovelScene.tsx`/`VisualNovelScene.tsx` (scale: `[1, 1.05, 1]`, x: `[0, -5, 0]`, y: `[0, 3, 0]`).

## 4. R4. Sound Levels & Dialogue Text Condensing
- **Files modified**: `components/game/SoundEngine.tsx`, `components/game/GameEngine.tsx`, `lib/games/*.ts`
- **Updates**:
  - Lowered default ambient music target volumes in `SoundEngine.tsx`: `cinematic` to `0.003`, `revelation` to `0.004`, and `normal` to `0.002`.
  - Capped completion fade-out volume in `GameEngine.tsx` at `0.02` (down from `0.12`).
  - Audited scenario and dialogue text blocks, ensuring they are short, punchy, and fit within UI boundaries without overflowing.
