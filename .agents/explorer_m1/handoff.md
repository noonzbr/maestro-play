# Handoff Report — Visual Novel Engine Exploration

## 1. Observation
- **Character images and portraits**: The files `/images/guitarplayer1.png`, `/images/guitarplayer1_excited.png`, `/images/guitarplayer1_thinking.png`, `/images/guitarplayer1_tense.png` exist inside `public/images/`.
- **Character Rendering (`NovelScene.tsx`)**:
  - Lip-sync: Class name `"char-talk"` is assigned to images when dialogue typewriter is in progress (`!textDone`, lines 708 and 877). It references `@keyframes char-lipsync` at lines 339–345:
    ```css
    @keyframes char-lipsync {
      0%,100% { transform: scaleY(1)   translateY(0);    }
      20%     { transform: scaleY(1.008) translateY(-1px); }
      ...
    }
    ```
  - Breathing: Class name `"char-breathe"` is assigned otherwise. It references `@keyframes char-breathe` at lines 350–357:
    ```css
    @keyframes char-breathe {
      0%,100% { transform: scaleY(1)    translateY(0); }
      50%     { transform: scaleY(1.012) translateY(-3px); }
    }
    ```
  - Excitement jump: Handles vertical translation using Framer Motion keyframe array animation `y: npcActive ? (npcEmotion === "excited" ? [0, -18, -4, 0] : ...) : 15` (line 651) with easeInOut duration `0.5` (line 668).
- **Game Scenario Files**:
  - `game10.ts` next game transition configuration (lines 34–41):
    ```typescript
    nextGame: {
      slug:         "microsoft-copilot",
      character:    "Jake",
      teaserLine:   "...",
      previewImage: "/images/guitarplayer1.png",
    }
    ```
  - `game11.ts` slug property (line 4): `slug: "microsoft-copilot"`, next game transition configuration (lines 36–41):
    ```typescript
    nextGame: {
      slug:         "copilot-studio",
      character:    "Jake",
      ...
    }
    ```
  - `game12.ts` slug property (line 4): `slug: "copilot-studio"`.
- **Sound Engine volume parameters**:
  - Background music target volume (lines 394-396):
    ```typescript
    // LOWERED ANOTHER 70%: music is background ambience only, SFX must cut through clearly
    const targetVol = mood === "cinematic" ? 0.007 : mood === "revelation" ? 0.009 : 0.006
    ```
  - `GameEngine.tsx` halving volume calls (lines 1113, 1139):
    ```typescript
    sound.setGameVolume(0.5)
    ```
- **Mouth position mappings**: The PowerShell command `Get-ChildItem -Recurse -Filter "*.ts*" -Path "C:\Users\night\Documents\ClaudeAgent\maestro-play" | Select-String -Pattern "MOUTH_POSITIONS"` completed successfully with empty output.
- **TypeScript Typecheck**: The command `npx tsc --noEmit` in directory `C:\Users\night\Documents\ClaudeAgent\maestro-play` completed with no compiler errors.

---

## 2. Logic Chain
- **Character images exist**: Directly confirmed by inspecting directory structure via file explorer matching `/public/images/`.
- **Vertical scaling animations**: Because the CSS animations in `NovelScene.tsx` (`char-lipsync` and `char-breathe`) apply vertical scaling (`scaleY` and `translateY`) on the entire `<img>` element instead of specific pixel coordinates or crop offsets, the visual novel engine animates talking and breathing globally.
- **No coordinate mappings**: Since the pattern search for `MOUTH_POSITIONS` returned zero matches, and the portrait styling applies only to the whole `<img>` element, it is confirmed that the codebase lacks mouth coordinate mappings.
- **Transitions alignment**:
  - `game10.ts` designates the next slug as `microsoft-copilot`.
  - `game11.ts` has slug `microsoft-copilot` and designates `copilot-studio` as next.
  - `game12.ts` has slug `copilot-studio`.
  - Thus, the transition path from DevOps engineer Sam (Game 10) to M365/Copilot Studio Jake (Games 11 & 12) is unbroken and fully aligned.
- **Volume controls**: Background track volume is kept very low (`0.006` to `0.009`) in `SoundEngine.tsx`, and `GameEngine.tsx` reduces it by half (`setGameVolume(0.5)`) during storytelling/intro screens to avoid interference with sound effects.
- **Baseline Typecheck**: Run command `npx tsc --noEmit` had zero compilation errors, verifying the baseline TS files are structurally sound.

---

## 3. Caveats
- Playwright integration tests were not run dynamically because the local dev server was not listening on port 3099, and the command authorization prompt timed out.
- The investigation assumes that the code in `NovelScene.tsx` is the active engine used during playthroughs, which matches the imports seen in `GameEngine.tsx`.

---

## 4. Conclusion
The Visual Novel Engine in `maestro-play` is structurally correct, fully type-safe (passing `tsc --noEmit`), and well-sequenced across Games 10, 11, and 12. Character animations rely entirely on global image transforms (vertical scaling, bounces, and shakes) without specialized mouth or facial coordinate mapping. The audio engine prioritizes SFX clarity by keeping ambient tracks below `0.01` volume and halving them during narrative scenes.

---

## 5. Verification Method
- **TypeScript Compliance**: Run `npx tsc --noEmit` from the root of `maestro-play` to ensure no typing errors.
- **Mouth Mappings Absence**: Execute a grep or PowerShell search for `MOUTH_POSITIONS` or `mouth` inside `components/` and `lib/` to verify no specific coordinates exist.
- **Sound Volumes**: Inspect `components/game/SoundEngine.tsx` at lines 394-396 for background music target volumes.
- **Story Transitions**: Open `lib/games/game10.ts`, `lib/games/game11.ts`, and `lib/games/game12.ts` to inspect the `nextGame` objects and `slug` fields.
