# MaestroPlay — Masterpiece Roadmap
> Living document. Updated as we build. Claude reads this at the start of every session.

---

## THE VISION

**MaestroPlay is the world's first career simulation engine for AI fluency.**

Phase 1-5: The best cinematic AI learning platform ever built. Monetizable now.  
Phase 6: The Maestro Simulation — a full career sim where AI skills are learned by living inside a profession. Think The Sims, but your character is you, the skills transfer to real life, and the cheat codes work in actual job interviews.

**The feeling we're building toward:** "I can't wait to get home and play this."

**One-liner:** Learn AI the way you'd learn to play guitar — by playing, failing, and playing again until it's yours.

**Name note:** "MaestroPlay" works for Phases 1-5. Phase 6 (the simulation) will need its own identity. Decision deferred until the simulation is real and users tell us what it feels like.

---

## MONETIZATION MODEL (Updated: Freemium + Power-ups)

| Tier | Price | Status |
|------|-------|--------|
| Free | $0 forever | ALL 14 games, no paywall, no credit card |
| Starter Pack | $2.99 one-time | 5 lives, 3 Hints, 2 Double XP, 1 Second Chance |
| Maestro Bundle | $6.99 one-time | 15 lives, 8 Hints, 5 Double XP, 3 Shields, 2 Second Chances, 1 Restore, 1 Jackpot |
| Conductor Pass | $9.99/month | Unlimited lives, 10 power-ups/mo, Conductor badge, early access |
| Simulation *(Phase 6)* | $79/mo or $699/yr | Full career simulation |
| Enterprise *(Year 2)* | Custom | White-label + company scenarios |

**Revenue milestone:** 1,000 Conductor Pass subscribers = $9.9K MRR. This funds Phase 6 simulation build.

**Revenue milestone:** 1,000 Pro subscribers = $29K MRR. This funds the simulation build.

---

## CURRENT STATE (as of May 2026)

**What exists and works:**
- ✅ 12 cinematic games with scenario/quiz/boss/revelation/prompt scene types
- ✅ Three.js hero scene, GSAP + Framer Motion animations (underused)
- ✅ Sound engine with mood system (normal/boss/revelation)
- ✅ MaestroTransformation end screen (cinematic, beautiful)
- ✅ XP + streak display (in-session only — resets on reload)
- ✅ Claude API scoring on prompt challenges
- ✅ 4 tracks in PathwayPage (horizontal scroll carousels)
- ✅ Supabase + Stripe connected (not fully wired)

**Masterpiece Framework (completed May 2026):**
- ✅ All 12 games updated with `aiModel` + `nextGame` metadata
- ✅ AI Compare scenes added to all 12 games (comparing tools relevant to each game's topic)
- ✅ Handoff scenes added to all 12 games (character-to-character bridge dialogue)
- ✅ `AICompareScene.tsx` renderer built — table layout, winner highlights, quiz integration
- ✅ `GameEngine.tsx` — handoff "What's Next" card with next character preview + teaser
- ✅ `SceneRenderer.tsx` — routes "ai-compare" and "handoff" scene types
- ✅ `game13.ts` — The Prompt Lab (Maya, 14 scenes, 6 prompt patterns, boss, compare, handoff)
- ✅ HEYGEN_VIDEO_SCRIPTS.txt — opening video scripts for all 12 original characters
- ✅ Visual novel framework: NovelScene, background images, lobby fallback, protagonist avatar

**Critical gaps (remaining):**
- ✅ Auth: Supabase email + Google OAuth, session persistence, AuthModal
- ✅ XP persists: localStorage (immediate) + Supabase /api/progress (on game complete)
- ✅ Streaks persisted: Supabase user_streaks table, /api/progress updates on completion
- ✅ lib/pricing.ts: all 14 games reflected (6 pro, 8 free), bundle updated to "All 14 Games"
- ✅ Wrong answer feedback: Claude API elaboration (/api/maestro-feedback), FeedbackPanel
- ✅ Mastery gates: 80% quiz accuracy required before boss, "Maestro Intervenes" overlay
- ✅ Dashboard: full game dashboard with lives, power-ups, 14-game grid, streak, AI Fluency Score
- ✅ Lives system: 3 hearts in localStorage, daily refill, deducted on wrong answers (GameEngine)
- ✅ Protected routes: proxy.ts (optimistic cookie check) + Server Component purchase gate
- ✅ Animations: Framer Motion, GSAP boss cinematic, NovelScene spring bubbles, Achievement Toast
- ❌ FSRS spaced repetition (deferred to Phase 2)
- ❌ Certificates (deferred to Phase 3)
- ✅ Background images: 9 new location patterns added (Design Studio, Server Room, Home Office, etc.) — all map to closest existing bg image
- ✅ Streak freeze: shield power-up absorbs one missed day (GameEngine streak logic fixed + consecutive-day detection)
- ✅ game1 introVideo: jake-confession.mp4 now correctly wired to game1 (not game1v2)
- ✅ game1v2 introVideo: removed (needs own unique video — placeholder for HeyGen creation)
- ✅ Dashboard hero background: dashboardpix.png reference added (drop file at public/images/dashboardpix.png)
- ✅ Maya character images (/images/maya.png, /images/maestro-maya.png) — generated with Gemini
- ❌ FSRS spaced repetition (deferred to Phase 2)
- ❌ Certificates (deferred to Phase 3)
- ❌ game1v2 intro video — needs unique HeyGen video for "The Conductor's Awakening"

---

## THE ROADMAP

### ✅ PHASE 0: Research & Vision (COMPLETE)
- [x] Deep game dev SME research (saved to memory + skill)
- [x] Deep MaestroPlay codebase study
- [x] EdTech market intelligence ($6.9B → $41B market)
- [x] Knowledge Architecture research (ACT-R, CLT, Bloom's, FSRS, KST)
- [x] Simulation-Based Learning research (Gee, Shaffer, Kolb, epistemic games)
- [x] AI Education + Simulation research (AI4K12, AI Director concept, Twist Reveal)
- [x] Full masterpiece roadmap defined
- [x] Career simulation vision defined (The Sims model)
- [x] Cheat codes system designed
- [x] All knowledge saved to permanent memory

---

### 🔨 PHASE 1: The Foundation — "The Player Exists"
**Goal:** Persistent user identity. Progress is real.  
**Timeline:** ~3-4 weeks  
**Monetization unlocked:** Can now gate content behind Pro tier

#### Supabase Auth
- [x] Email + password signup/login — AuthModal + signInWithEmail/signUpWithEmail
- [x] Google OAuth — signInWithGoogle with /auth/callback redirect
- [x] Auth UI component — AuthModal with email/Google tabs, AnimatePresence, error handling
- [x] Session persistence across tabs/reload — Supabase client handles via localStorage
- [x] Protected routes for Pro content — proxy.ts (optimistic cookie gate) + Server Component purchase check

#### Progress Persistence
- [x] `user_progress` table: game completions, XP earned, scores, completed_at
- [x] `user_xp` table: total_xp, level, updated_at
- [x] `user_streaks` table: current_streak, longest_streak, last_active_date
- [x] `user_mastery` table: concept_id, mastery_score, ease_factor, interval, due_date (schema ready)
- [x] Wire GameEngine XP awards to Supabase on completion (/api/progress POST)
- [x] Wire streak increment on daily game completion (handled in /api/progress)

#### Pricing Fix
- [x] Define all 14 games with proper free/pro tier in lib/pricing.ts (8 free, 6 pro) — bundle updated to "All 14 Games"
- [x] Implement Pro subscription via Stripe ($29/mo, $249/yr) — entries in pricing.ts
- [x] Gate Pro content behind auth check — proxy.ts + game page Server Component
- [x] Free tier: 2 games per track — game files updated (games 3,4,7,8,10,12 → free:false)
- [x] Add upgrade CTA when free user hits locked game — checkout page redesigned

#### Streak System
- [x] Streak counter persists to Supabase — /api/progress handles streak upsert
- [x] Day 1 achievement fires on first game completion — achievement system live
- [x] Streak display in header/dashboard — Nav XP pill + Dashboard streak card
- [x] Streak freeze mechanic — shield power-up (unlocks at 14-day streak) absorbs one missed day in GameEngine streak logic

---

### 🔨 PHASE 2: The Learning Engine — "It Actually Teaches"
**Goal:** Close the learning loop. Wrong answers teach, not just inform.  
**Timeline:** ~4-6 weeks  
**Monetization unlocked:** AI Tutor is a Pro feature

#### Elaborative Feedback on Wrong Answers
- [x] Add `wrongFeedback` field to Choice type in lib/games/types.ts
- [ ] Add wrong feedback content to all existing game quiz scenes (content work, deferred)
- [x] GameEngine shows "Maestro intervenes" moment on wrong answer (cinematic)
- [x] Claude API generates in-character elaborative explanation (/api/maestro-feedback)
- [x] Player must confirm understanding before continuing (500ms delayed button)

#### Mastery Gates
- [x] Quiz scenes track accuracy across all questions in scene (quizTotal/quizCorrect state)
- [x] Boss scene requires 80% quiz accuracy in preceding scenes to unlock
- [x] Boss can be re-challenged with narrative variation on failure — "Challenge Again — A different path" button on loss; attempt counter changes motivational text; state fully resets
- [x] "Not ready yet" cinematic moment from Maestro on gate fail — full overlay with accuracy %

#### FSRS Spaced Repetition — Daily Maestro Challenge
- [x] Implement FSRS algorithm (open source, client-side + server-side backup)
- [x] Every concept gets a card: slug, ease_factor, interval, due_date, per user
- [x] Daily Challenge: review cards page with rating and stats
- [x] Framed cinematically: "The Maestro summons you to the practice room"
- [x] Daily Challenge XP bonus (streak multiplier)
- [x] Concept cards due count visible in dashboard

#### Failure as Narrative
- [x] Wrong answers become narrative branches (story continues, detour to Felipe, rejoin main path)
- [x] Longer path to insight vs. shorter path for correct answer
- [x] Maestro acknowledges the wrong choice within the story (consequence scenes and Felipe card)

#### AI Tutor — Socratic Maestro (Pro Feature)
- [x] Post-game chat interface with Maestro character — MaestroTutor.tsx bottom sheet
- [x] Never answers directly — asks Socratic guiding questions (system prompt enforced)
- [x] Adapts pressure to demonstrated understanding
- [x] "I need the direct answer" escape hatch (3 per session) — directLeft counter, regex trigger
- [x] Conversation history persists per game per user

---

### 🔨 PHASE 3: The Engagement Loop — "It Pulls You Back"
**Goal:** Daily habit formation. Users come back without thinking about it.  
**Timeline:** ~4-6 weeks

#### Progress Dashboard (/dashboard) — COMPLETE
- [x] XP progress bar toward next Conductor Level
- [x] Conductor Levels: Apprentice → Associate → Conductor → Grand Maestro
- [x] Track completion rings (4 tracks, weeks 1-12)
- [x] Streak flame with longest streak record (maestro_best_streak)
- [x] Games completed with character portraits unlocked (14-game grid)
- [x] Daily Challenge CTA — front and center
- [x] "Your AI Fluency Score" composite (grows as mastery improves)
- [x] Lives system: 3 hearts, daily refill, deducted on wrong answers
- [x] Power-ups: 4 unlockable boosts (doubleXp, hint, shield, maestroMode)
- [x] Bonus games section: game1v2 (week 13) + game13/prompt-lab (week 14)
- [x] FSRS concept cards due count (deferred to Phase 2)

#### LinkedIn-Shareable Certificates
- [x] Certificate generated on game completion
- [x] Beautiful dark-aesthetic certificate image (auto-generated)
- [x] LinkedIn share flow with pre-filled text
- [x] Certificate verification URL (unique hash per certificate)
- [ ] Certificate list in dashboard (deferred)

#### Email Re-engagement
- [ ] Streak about to break → "Your streak ends in 4 hours" email
- [ ] Review session due → "A concept is fading. The Maestro has summoned you."
- [ ] New game in your track → "Your next lesson is ready. The orchestra waits."
- [ ] Integrate with Resend or SendGrid
- [ ] Unsubscribe handling

#### Streak Freeze
- [x] Streak Shield power-up unlocks at 14-day streak (Phase 1 implementation supersedes this)
- [x] Shield activatable from dashboard power-ups panel, lasts 24h
- [x] Visual freeze indicator in streak display — 🛡️ "Protected · Xh Ym left" badge in streak card + shield icon in hero banner streak chip + countdown ticker (60s interval)
- [ ] Email: "You used your freeze — don't make it a habit" (requires email integration — Phase 3)

---

### 🔨 PHASE 4: Animation & Polish — "It Feels Alive"
**Goal:** The visual experience matches the cinematic ambition.  
**Timeline:** ~2-3 weeks (can run in parallel with Phase 3)

#### Tier 1: Immediate Wins
- [x] Scene slide transitions — scenes slide right-in / left-out (CSS translateX, 300-480ms)
- [x] Character float animation (CSS keyframes, 4s infinite, 7px range) — on character name pill
- [x] NPC quote typewriter effect (character-by-character, 28ms/char, blinking cursor) — in quiz scenes
- [x] Boss entrance cinematic — scale+glow keyframe, 850ms cubic spring, darkens then brightens dramatically
- [x] Boss scenario card — separate `boss-card-enter` animation (scale + brightness flash)
- [x] Character talk/breathe animations — `char-talk` 6-keyframe expressive idle, `char-breathe` 4s bob, active/inactive dim states (0.22 opacity + translateY)
- [x] Scene environments — 12 distinct SVG/CSS environments (bedroom, hallway, classroom, band, practice, coffee shop, home office, office/boardroom, concert stage, library, computer lab, rehearsal studio) with CalendarWidget tracking day across story
- [x] Speaker-colored UI — dialogue border, cursor, progress pips all adapt to active speaker color
- [x] Floor glow pulse under active characters, speaker chip slide-in animation
- [x] XP count-up animation — cubic ease-out count-up, number pop/glow keyframe, shimmer on bar, floating +XP label with text-shadow glow
- [x] Wrong answer shake effect on choice button (already existed in ChoiceButton)

#### Tier 2: High Impact
- [ ] Lottie animations: streak flame, XP burst (remaining — no Lottie installed yet)
- [x] GSAP boss battle cinematic sequence (screen darkens, boss scales in — purple flash overlay)
- [x] Framer Motion dialogue bubbles spring in from speaker's direction (left for Jake, right for NPC)
- [x] Dialogue speaker highlight (active speaker subtly glows — char-glow animations + speaker-side bloom in dialogue box)
- [x] Scene location background animations (subtle motion, mouse-parallax — lerp RAF loop, ±9px×5px)
- [x] Achievement Toast system — 7 achievements (first_game, streak_3, streak_5, level_assoc, level_cond, level_maestro, first_boss) with cinematic slide-in + shimmer
- [x] "Maestro Intervenes" wrong-answer FeedbackPanel — cinematic 🎼 header, elaborative explanation card, delayed button (reads insight first)
- [x] Cinematic game intro screen — character art backdrop (blurred atmospheric fill + masked sharp art), staggered pip entrance, bottom-anchored content panel

#### Tier 3: Game-Changer
- [ ] Rive character state machines: Idle / Talking / Reacting / Celebrating / Thinking
- [ ] Spline 3D elements for key scenes
- [x] Conductor Level-up cinematic sequence — lightweight version: Level Up banner appears on EndScreen when XP crosses a conductor level threshold (Associate, Conductor, Grand Maestro); full cinematic interstitial deferred

---

### 🔨 PHASE 5: Content Expansion — "It Has Depth"
**Goal:** 50+ games. Complete tracks. Recurring characters. Career relevance.  
**Timeline:** Ongoing from Phase 2

#### Game Expansion
- [ ] Expand to 50+ games across 4 complete tracks (12-15 per track)
- [ ] AI Fundamentals Track: hallucination, training data, tokenization, bias, context windows, RAG
- [ ] Claude Mastery Track: system prompts, few-shot, chain-of-thought, agents, RAG design
- [ ] AI Toolkit Track: Midjourney, Cursor/Copilot, Perplexity, n8n, automation
- [ ] Microsoft AI Track: Copilot, Azure AI, enterprise deployment

#### Character Arcs
- [ ] Characters recur across games (Jake from Game 1 reappears in Game 4, more capable)
- [ ] Character transformation is visible (before/after AI fluency)
- [ ] Players feel invested in character journeys

#### Career-Track Content
- [ ] HR Tech → Solution Architect track (Nat's path)
- [ ] CS Graduate → Software Developer track
- [ ] Marketing → AI-Augmented Marketer track
- [ ] Manager → AI-Fluent Leader track

---

### 🏆 PHASE 6: The Maestro Simulation — "Your AI Career, Simulated"
**Goal:** The Sims but for AI career development. The masterpiece.  
**Timeline:** Month 6-18  
**Monetization:** $79/mo or $699/yr Simulation tier

#### Career Onboarding
- [ ] Career avatar creation (not a Sim, but YOUR professional self)
- [ ] Background input (industry, years of experience, current role)
- [ ] Career goal selection (target role)
- [ ] Knowledge state assessment (KST — what do you already know?)
- [ ] Prerequisite graph generated per career path
- [ ] Starting "job title" and office environment assigned

#### The Simulation World
- [ ] Simulated workplace (Nexus Corp or custom company name)
- [ ] LLM-powered NPCs: The Mentor, The Skeptic, Stakeholder NPCs, Clients
- [ ] NPC memory: they remember your past decisions and reference them
- [ ] Daily scenario generation via Claude API (personalized per background + level)
- [ ] Random event system (breaking news, crises, opportunities, promotions)
- [ ] Visible skill bars filling in real time

#### Career Progression (The Sims Loop)
- [ ] Job titles: Intern → Junior → Mid → Senior → Principal → Director
- [ ] Office environment visually upgrades per promotion
- [ ] Portfolio builds with every scenario completed
- [ ] Performance review system = mastery gate for promotion
- [ ] Time pressure: projects have deadlines (creates urgency)

#### Cheat Codes System
- [ ] MAESTRO → Socratic hint from Maestro (earn via 7-day streak)
- [ ] MOTHERLODE → 2x XP for 30 minutes (earn via completing full track)
- [ ] CONDUCTOR → Skip to boss challenge (earn via 100% skill mastery)
- [ ] SYMPHONY → Reveal AI's reasoning on any scenario (earn via 5 consecutive no-hints)
- [ ] VIRTUOSO → Unlock secret advanced scenario (hidden, players discover)
- [ ] CHEATCODE → Unlock a real AI prompt template usable in actual work (reach Senior level)
- [ ] Cheat code input UI (type in a terminal-style console)

#### The Twist Reveal (Most Powerful Mechanic)
- [ ] At end of campaign: reveal all decisions were observed by a simulated AI
- [ ] Demonstrate that AI making decisions based on patterns learned from player
- [ ] Speed-over-safety players → unsafe AI behavior shown
- [ ] Data-diversity investors → lower-bias AI shown
- [ ] Corner-cutters → unauditable AI shown
- [ ] Closing reflection: "The AI learned from you. What does that mean for how you decide?"

---

### 🏢 PHASE 7: B2B Platform — "The Enterprise Play"
**Timeline:** Year 2  
**Monetization:** Custom enterprise pricing

- [ ] Company accounts with seat management
- [ ] Custom scenario packs per industry/company
- [ ] Manager dashboards (team AI fluency progress)
- [ ] HR system integration (ironic given Nat's background)
- [ ] White-label option
- [ ] Enterprise certificate programs
- [ ] ROI reporting (before/after AI fluency scores)

---

## KEY DESIGN PRINCIPLES (Never Compromise)

1. **Concepts as mechanics, not topics.** If it can't be a game mechanic, reconsider.
2. **Emotional stakes through character.** Every AI concept is attached to someone whose fate depends on the player's choice.
3. **The cinematic layer is sacred.** Dark aesthetic, conductor metaphor, sound engine — preserve always.
4. **The Sims feeling is the design target.** "One more scenario" pulling you forward. Always.
5. **Cheat codes work in real life.** The reward IS a real skill, prompt, or tool.
6. **Elaborative feedback always.** Never buzzer-and-continue. The WHY is the lesson.
7. **85% accuracy is the flow zone.** Too easy = boredom. Too hard = quit. Hit the zone.
8. **Professional identity as the frame.** "You are becoming" not "here is a concept."

---

## TECH STACK REMINDERS

- **Next.js 16** (CRITICAL: params are Promises, use `await params`)
- **Supabase** — lazy-initialized (`if (typeof window !== 'undefined')`)
- **Stripe** — lazy-initialized
- **Claude API** — claude-sonnet-4-6, existing pattern in `app/api/ai-prompt/route.ts`
- **Animations** — Framer Motion + GSAP installed but underused. Rive for characters. Lottie for icons/effects.
- **Port** — 3000

---

## MEMORY & KNOWLEDGE REFERENCES

- Game Dev SME: `memory/reference_gamedev_knowledge_base.md`
- Knowledge Architecture + Sim Design: `memory/reference_knowledge_architecture_edu_simulation.md`
- MaestroPlay Deep Study: `memory/reference_maestroplay_knowledge_base.md`
- Project Memory: `memory/project_maestro_play.md`
- Skill available: `gamedev-sme` (invoke via /gamedev-sme)

---

## SESSION START CHECKLIST

When starting a new Claude Code session on MaestroPlay:
1. Claude reads this file automatically via CLAUDE.md reference
2. Check current phase — what's checked vs unchecked
3. State which task we're starting this session
4. Mark tasks `[~]` = in progress, `[x]` = complete as we go
5. Update this file at end of session with progress

---

*Last updated: June 2026 | Phase 0 COMPLETE. Phase 1 COMPLETE (Supabase Auth + OAuth, progress persistence, pricing 14 games, streak + shield freeze, protected routes via proxy.ts + Server Component purchase gate). Phase 2 COMPLETE: elaborative feedback (/api/maestro-feedback), mastery gates (80% accuracy), AI Tutor (Socratic Maestro, /api/maestro-tutor), boss re-challenge with attempt counter and narrative variation, AI Tutor conversation history persistence (tutor_conversations Supabase table + migration 20250531_tutor_conversations.sql, debounced save/load, "conversation resumed" indicator, restart button), spaced repetition FSRS, and failure-as-narrative branches. Phase 3 dashboard COMPLETE with lives + power-ups + 14-game grid + hero background. Streak Freeze COMPLETE: 🛡️ shield visual in streak card + hero banner streak chip + Nav XP pill + countdown ticker. Duolingo clone learning path built in app/worldmap/page.tsx with vertical snake path, unit banners, guidebook modals, weekly NPC leaderboard standings, daily quests, and power shop refill. Masterpiece Framework COMPLETE: ai-compare + handoff scenes all 12 games, game13 (Maya/The Prompt Lab), AICompareScene renderer, all location backgrounds mapped, game1 introVideo fixed. Phase 4 Tier 1 COMPLETE. Phase 4 Tier 2 MOSTLY COMPLETE (Lottie remaining). Phase 4 Tier 3: Level-up banner on EndScreen COMPLETE, Rive/Spline TODO. Coda's cinematic Socratic connection intro dialogue completed in GameEngine.tsx with synthesized Web Audio connect/hum startup chimes, CRT scanline effects, dynamic portraits, and active dialogue voice waves visualizer. Maya character images (maya.png, maestro-maya.png) generated. Assets still needed: game1v2 intro video (HeyGen). Homepage COMPLETE REDESIGN: split hero with CSS animated orbs (purple/cyan/pink) + Three.js + MaestroPlayVideo.mp4 in browser mockup + floating XP/streak badges, testimonials section, numbered How It Works timeline. Monetization UPDATED: freemium (all 14 games free), power-up packs ($2.99/$6.99/$9.99/mo), lib/pricing.ts + checkout route + webhook all updated, pack buttons wired to Stripe checkout. Pending SQL migrations to run in Supabase: 20250531_review_cards.sql (FSRS), 20250531_tutor_conversations.sql (AI Tutor history). BRANCHING STORY PATHS COMPLETE (May 2026): MAESTROPLAY_STORYBOARD.md written (hub architecture, 4 tracks A/B/C/D, Felipe touchpoints, cross-game memory spec). Game 1 branching built: 3 new scene types (consequence, felipe, track-select) + leadsTo routing in Choice type + GameEngine scene-ID router + FelipeCard/TrackSelect renderers + consequence auto-advance. Game 1 has 30 scenes (18 are branch scenes). Consequence → Felipe → Rejoin pattern works. Track selection scene routes to first game of each track (Tracks A→G2, B→G5, C→G8, D→G11). 0 TypeScript errors. Build passes.*
