# Codebase Exploration & Analysis Report — Maestro Play Visual Novel Engine

## Executive Summary
This report documents a read-only investigation of the **maestro-play** codebase, analyzing the visual novel engine, character pose logic, sound engine, game scenario files, and tests. Key findings show that the visual novel engine simulates lip-sync and breathing by scaling entire character portraits vertically using CSS keyframe animations, while excitement jumps are handled via Framer Motion keyframe arrays. Scenario transitions between games 10, 11, and 12 are fully aligned. The sound engine runs background music at extremely low volume levels (`0.006` to `0.009`) to allow sound effects to stand out, and uses a custom `setGameVolume(0.5)` function to halve volume during story transitions. No localized mouth position mappings or coordinates (e.g., `MOUTH_POSITIONS`) exist in the codebase.

---

## 1. Character Images and Portraits
All character images and portraits are stored under the `/public/images/` directory. 
The specific files requested exist at the following relative paths from the workspace root:

| Virtual Path (Browser) | Actual Physical Path | File Size | Description |
|---|---|---|---|
| `/images/guitarplayer1.png` | `public/images/guitarplayer1.png` | 806,105 bytes | Protagonist (Jake) - Neutral Pose |
| `/images/guitarplayer1_excited.png` | `public/images/guitarplayer1_excited.png` | 735,817 bytes | Protagonist (Jake) - Excited Pose |
| `/images/guitarplayer1_thinking.png` | `public/images/guitarplayer1_thinking.png` | 731,486 bytes | Protagonist (Jake) - Thinking Pose |
| `/images/guitarplayer1_tense.png` | `public/images/guitarplayer1_tense.png` | 734,743 bytes | Protagonist (Jake) - Tense Pose |

These images represent the different poses/expressions of the protagonist, **Jake**, who is a 17-year-old music club officer featured in several games.

---

## 2. Visual Novel Engine & Character Rendering (`NovelScene.tsx`)
The primary rendering and animation engine for the visual novel is located in `components/game/NovelScene.tsx`. An older/simpler version exists as `components/game/VisualNovelScene.tsx`.

### A. Portrait Rendering & Layout
- Characters are split into two sides: **NPC** (left side, lines 642–808) and **Protagonist** (right side, lines 811–893).
- Inactive characters are dimmed and grayscaled using CSS filter properties: `grayscale(0.4) brightness(0.65)`, with opacity reduced to `0.08` on mobile and `0.25` on desktop.
- Active characters have an opacity of `1`, and are rendered with a circular glow halo behind them (powered by `@keyframes dlg-speaker-glow`).
- A top-fading mask is applied to portraits using a linear gradient:
  `maskImage: "linear-gradient(to top, black 0%, black 72%, transparent 100%)"`

### B. Emotion Parsing & Pose Logic
Dialogue text sentiment is parsed on the fly using `getLineEmotion(text)` (lines 150–162) to determine the character's pose.
- **Excited**: Triggered by keywords `!`, `awesome`, `brilliant`, `incredible`, `perfect`, `exactly`, `yes`.
  - NPC scale increases to `1.05`.
  - NPC position bounces: `y: [0, -18, -4, 0]`.
- **Thinking**: Triggered by keywords `?`, `...`, `how`, `why`, `maybe`, `wonder`, `think`, `guess`.
  - Scale increases to `1.01`.
  - Position shifts slightly: `y: [0, -3, 0]`.
  - Rotates gently: NPC `rotate: [0, -1.5, 1.5, 0]`, Protagonist `rotate: [0, 1.5, -1.5, 0]`.
- **Tense**: Triggered by keywords `unethical`, `ruined`, `crisis`, `disaster`, `toxic`, `angry`, `cost`, `replaced`, `wrong`, `fail`, `error`, `boilerplate`.
  - Shakes side-to-side: `x: [-6, 6, -4, 4, -2, 2, -1, 1, 0]`.
  - Renders a glowing drop shadow: `drop-shadow(0 0 25px rgba(180, 0, 255, 0.6))`.
- **Neutral**: Default state.

### C. Lip-Sync & Mouth Movement
Mouth movement is simulated globally on the entire character image rather than on a dedicated mouth cutout or sprite.
- When a dialogue line is active and still typing (`!textDone`), the character image is assigned the CSS class `char-talk`.
- The `char-talk` class triggers `@keyframes char-lipsync` (lines 339–349):
  ```css
  @keyframes char-lipsync {
    0%,100% { transform: scaleY(1)   translateY(0);    }
    20%     { transform: scaleY(1.008) translateY(-1px); }
    40%     { transform: scaleY(0.995) translateY(0.5px); }
    60%     { transform: scaleY(1.006) translateY(-0.5px); }
    80%     { transform: scaleY(0.997) translateY(0.3px); }
  }
  ```
- This vibrates/distorts the image vertically at an interval of `0.18s` centered around the bottom of the stage, creating the illusion of talking.

### D. Breathing Animation
- When the typewriter finishes typing or the character is inactive, the image is assigned the class `char-breathe`.
- The class triggers `@keyframes char-breathe` (lines 350–357) over a `3.5s` loop:
  ```css
  @keyframes char-breathe {
    0%,100% { transform: scaleY(1)    translateY(0); }
    50%     { transform: scaleY(1.012) translateY(-3px); }
  }
  ```
- This slowly moves the character image up and down to simulate breathing.

### E. Excitement Jump
- Bouncing is handled dynamically via Framer Motion's `animate` prop on the wrapper `motion.div`.
- When the emotion is `"excited"`, it runs a keyframes array transition: `y: [0, -18, -4, 0]`, making the character spring upward by 18 pixels and land back down.

---

## 3. Game Scenario & Transitions (`game10.ts`, `game11.ts`, `game12.ts`)
The protagonist and NPC setups are defined as static configuration objects in the game scenarios under `lib/games/`:

### A. Protagonist / NPC Setup
- **`game11.ts` (Microsoft Copilot — AI in Your M365)**
  - **Protagonist**: Jake (`characterName: "Jake"`, role: "17-year-old music club officer", image: `/images/guitarplayer1.png`).
  - **NPCs**: Ms. Chen (`npcKey: "senora_vega"`), Tyler (`npcKey: "tyler"`), AI (`npcKey: "ai"`).
- **`game12.ts` (Copilot Studio — Build Your Own AI Agent)**
  - **Protagonist**: Jake (`characterName: "Jake"`, role: "17-year-old bot builder (formerly officer)", image: `/images/guitarplayer1.png`).
  - **NPCs**: Tyler (`npcKey: "tyler"`), AI (`npcKey: "ai"`).

### B. Story Transitions
The transitions between weeks 10, 11, and 12 are fully connected:
1. **Game 10 (`game10.ts`)** (Sam, DevOps Engineer): Ends with a `nextGame` transition linking to Game 11 (slug: `microsoft-copilot`, character: `"Jake"`, previewImage: `/images/guitarplayer1.png`).
2. **Game 11 (`game11.ts`)**: Defines slug `microsoft-copilot`. Ends with a `nextGame` transition linking to Game 12 (slug: `copilot-studio`, character: `"Jake"`, previewImage: `/images/guitarplayer1.png`).
3. **Game 12 (`game12.ts`)**: Defines slug `copilot-studio`. Ends with a `nextGame` transition linking to Game 13 (slug: `prompt-lab`, character: `"Maya"`, previewImage: `/images/maya.png`).

---

## 4. Sound Engine & Volume Parameters (`SoundEngine.tsx`, `GameEngine.tsx`)

### A. Volume Levels in `SoundEngine.tsx`
`components/game/SoundEngine.tsx` synthesizes game sound effects (SFX) using Web Audio API nodes and plays background MP3 audio. The volume levels are carefully tuned:

1. **Background Ambience (`startAmbient`)**:
   - Cinematic Mood: `0.007`
   - Revelation Mood: `0.009`
   - Normal/Default Mood: `0.006`
   - *Note*: A code comment specifies that background music is lowered by an additional 70% to ensure SFX remain audible.
2. **Sound Effects (SFX)**:
   - `playCorrect`: `0.2` (for arpeggio notes) and `0.07` (for sustain chord).
   - `playWrong`: `0.16` / `0.14` (sawtooth notes) and `0.12` (descending sine glide).
   - `playXP`: `0.1` (sparkly arpeggio).
   - `playFireworks`: `0.28` (noise pop bursts), `0.13` (arpeggio), and `0.07` (final chord).
   - `playClick`: `0.09` (triangle note).
   - `playHover`: `0.015` (sine note).
   - `playTransition`: `0.055` (filtered noise whoosh) and `0.08` (clean note).
   - `playRevelation`: orchestral voices ranging from `0.045` to `0.075` (harmonics at `0.025`–`0.035`).
3. **Background Sequencer Stems**:
   - Tension Heartbeat: `0.08`
   - Stem 1 (Chord Pad): `0.02`
   - Stem 2 (Bassline): `0.02`
   - Stem 3 (Lead Arpeggiator): `0.008`

### B. Sound Control in `GameEngine.tsx`
`components/game/GameEngine.tsx` controls game state and triggers the following volume adjustments:
- When entering the brand video or story/intro screens, `sound.setGameVolume(0.5)` is called (lines 1113, 1139) to halve the background ambient volume.
- SFX are triggered dynamically on button clicks (`sound.playClick()`), scene transitions (`sound.playTransition()`), and completion screens (`sound.playFireworks()`).

---

## 5. Mouth Position Mappings (`MOUTH_POSITIONS`)
A comprehensive codebase search was performed for `MOUTH_POSITIONS` or localized mouth coordinate systems. 
- **Result**: No such constants, variables, or functions exist in the codebase.
- **Explanation**: The engine does not utilize crop coordinates or mouth overlay assets to animate speaking. Lip-sync is performed by scaling the entire portrait image vertically inside `NovelScene.tsx` using the CSS class `char-talk`.

---

## 6. Verification & Test Suite Status

### A. TypeScript Typecheck
- Command: `npx tsc --noEmit`
- Status: **SUCCESS**
- Result: Completed with 0 type errors. The codebase type definitions are fully valid.

### B. Playwright Tests Audited
The Playwright integration tests are located in the `/scripts/` folder:

1. **`scripts/test-out-of-lives.js` (Game Over & Recovery Audit)**
   - Starts a headless Chromium browser.
   - Sets the player name and advances past Coda's introduction in dev mode (`?dev=true`).
   - Uses the developer bypass tool (clicks the `DRAIN` button 3 times) to reduce player lives to 0.
   - Verifies the "HEARTS EMPTY" recovery screen renders with the "Review Lesson with Coda" button.
   - Clicks the button, verifies Coda's socratic lesson details are displayed, clicks "I Understand", and confirms the player is returned to the game with 3 hearts refilled.
2. **`scripts/test-path-d.js` (Jake Path D / Conductor Path Audit)**
   - Navigates through Game 1 (`welcome-to-ai`).
   - At Branch Point 1, selects **Option D** ("He takes fifteen minutes to write a detailed prompt").
   - Advances through Scene 5 (`w1-conductor-1`) and Scene 6 (`w1-conductor-2`) dialogue lines.
   - Verifies the wrap-up text ("Jake walked out feeling...") renders correctly without leaving a blank screen.
   - Validates transition to the matching terms exercise (`w1-match-terms`).
