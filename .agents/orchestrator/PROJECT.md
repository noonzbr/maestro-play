# Project: maestro-play visual novel engine revamp

## Architecture
Next.js visual novel game engine.
- `lib/games/game1.ts` through `game14.ts` and `game1v2.ts` define individual games/chapters, including characters, dialogue, nextGame transition routes, scenes, and emotions.
- `NovelScene.tsx` handles rendering of characters, poses, background images, dialogue text typewriter animation, and the lip-sync animation (bouncing).
- `SoundEngine.tsx` handles playing sound effects and ambient/cinematic music, controlling their target volumes.
- `GameEngine.tsx` manages overall game state, transitions, and fade-outs (such as the victory fade-out volume).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| 1 | Exploration | Analyze visual novel engine, sound engine, games TS files, and locate where mouth positions are or need to be. | none | DONE (Conv: 7155644c-807a-4884-8d26-04d74c61ad6c) |
| 2 | VN Engine Upgrades | Implement CharacterMouth procedural mouth overlay component, place using MOUTH_POSITIONS coordinates in NovelScene.tsx. Disable body jitter, tweak breathe keyframes, and reduce Framer Motion excitement jump. | M1 | DONE (Conv: 03ce25a5-2b9e-437d-90bf-be4c6b20e61c) |
| 3 | Jake Character Art & Poses | Ensure Jake's primary/excited/thinking/tense poses are loaded dynamically based on dialogue emotion. | M1 | DONE (Conv: 03ce25a5-2b9e-437d-90bf-be4c6b20e61c) |
| 4 | Protagonist Swap & Track D Data Fix | In game11.ts/game12.ts swap Jake and Tyler (roles, dialogue, guitar, intro scene images). Correct transitions in game10.ts and game11.ts. | M1 | DONE (Conv: 03ce25a5-2b9e-437d-90bf-be4c6b20e61c) |
| 5 | Sound Levels & Dialogue Text Condensing | Lower volumes in SoundEngine.tsx and GameEngine.tsx. Audit and shorten all long dialogue/scenario text blocks in game1.ts through game14.ts and game1v2.ts to fit dialogue balloons. | M1, M2, M3, M4 | DONE (Conv: 03ce25a5-2b9e-437d-90bf-be4c6b20e61c) |
| 6 | E2E Testing Track | Design and run Playwright test suites (test-out-of-lives.js, test-path-d.js), verify compilation and visual checks. | M5 | DONE (Conv: c28def2b-19c2-4c0a-bf25-9d5836636085) |
| 7 | Forensic Integrity Audit | Verify changes authenticity and integrity (no cheat/hardcoding, no dummy/facades). | M6 | CLEAN (Conv: 9f91c101-e4de-439e-81ea-e300c895b893) |

## Interface Contracts
- CharacterMouth: procedural mouth overlay component within NovelScene.tsx.
- MOUTH_POSITIONS: percentage coordinates (e.g. `{ x, y }` or mapping) used to place the mouth component on each character portrait.
- Game Data (lib/games/): protagonist/NPC state, `intro.sceneImage`, and `nextGame` transition targets.
- SoundEngine volume settings.
