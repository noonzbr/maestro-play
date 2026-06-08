# MaestroPlay — Branching Narrative Storyboard
> Build guide for the Hub Architecture + Branching Story Paths.  
> Written: May 2026. Last updated: May 2026.  
> Use this as the single source of truth for all narrative branching decisions.

---

## THE BIG PICTURE

```
                          ┌─────────────────────────┐
                          │   GAME 1 — Jake's Hub   │
                          │  "Welcome to the World  │
                          │       of AI"            │
                          └────────────┬────────────┘
                                       │
                               REVELATION SCENE
                                       │
                          ┌────────────▼────────────┐
                          │  FELIPE APPEARS         │
                          │  "Which door do you     │
                          │   open first?"          │
                          └────────────┬────────────┘
                      ________________/\________________
           __________/        /        \        \________
          /                  /          \                 \
    ┌────▼────┐       ┌─────▼────┐  ┌───▼─────┐    ┌────▼────┐
    │ TRACK A │       │ TRACK B  │  │ TRACK C │    │ TRACK D │
    │   AI    │       │  Claude  │  │ChatGPT+ │    │Microsoft│
    │Fundamentals     │Ecosystem │  │ Gemini  │    │ Copilot │
    └────┬────┘       └─────┬────┘  └───┬─────┘    └────┬────┘
    G2→G3→G4          G5→G6→G7      G8→G9→G10       G11→G12
         \                  \            /                /
          \__________________\__________/________________/
                                   │
                      ┌────────────▼────────────┐
                      │  GAME 13 — Maya's Hub   │
                      │    "The Prompt Lab"     │
                      │  ALL TRACKS CONVERGE    │
                      └─────────────────────────┘
```

**The rules of this architecture:**
1. Game 1 is mandatory — every player starts here.
2. After Game 1's revelation, the player chooses a track. All choices are valid.
3. Tracks run linearly: 3 games (Track A, B, C) or 2 games (Track D).
4. All tracks converge at Game 13. No loops, no dead ends.
5. Wrong answers inside any game → consequence scene → Felipe appears → rejoin main path.
6. Felipe is the connective tissue. He has cross-game memory. He knows what you chose.

---

## CHARACTER + TRACK REFERENCE

### Felipe — Director of Consequences
- Role: Narrator, guide, connector between all games and all tracks
- Personality: Warm, perceptive, never judgmental — but always direct
- Cross-game memory: Remembers player's track choice, key decisions, wrong answers
- Appears: At branch consequences (wrong answers), at track selection, between games
- Visual: `/images/maestroplayer1.png` (to be replaced with real headshot)
- Videos: `/videos/felipe-game[N].mp4` (one per game transition)
- His signature move: Reframes the wrong answer as a lesson without diminishing it

### Track A — AI Fundamentals
| # | Character | Game | AI Model | Theme |
|---|-----------|------|----------|-------|
| G2 | Zoe, 19 | "Discover How AI Works" | general | Neural nets, training data, prediction |
| G3 | Carlos, 38 | "AI for Professionals" | claude | Maestro Method, professional prompting |
| G4 | Aria, 26 | "The Conductor Test" | general | Mastery assessment, broken prompts |

### Track B — Claude Ecosystem
| # | Character | Game | AI Model | Theme |
|---|-----------|------|----------|-------|
| G5 | Jordan, 28 | "Unlock Claude Chat" | claude | Capabilities, context, creative work |
| G6 | Kai, 24 | "Claude Code — AI in Your Terminal" | claude | Agentic coding, file reading, diffs |
| G7 | Priya, 33 | "Claude for Work" | claude | Projects, custom instructions, teams |

### Track C — ChatGPT + Gemini
| # | Character | Game | AI Model | Theme |
|---|-----------|------|----------|-------|
| G8 | Alex, 26 | "ChatGPT — Beyond the Hype" | chatgpt | GPT-4o, Custom GPTs, Canvas |
| G9 | Luna, 21 | "Gemini — Google's AI" | gemini | Google Workspace, context window |
| G10 | Sam, 29 | "Gemini CLI" | gemini | Terminal AI, scripts, automation |

### Track D — Microsoft Copilot
| # | Character | Game | AI Model | Theme |
|---|-----------|------|----------|-------|
| G11 | Jake (club prez) | "Microsoft Copilot M365" | copilot | Word, Teams, Outlook, Excel |
| G12 | Jake (bot builder) | "Copilot Studio" | copilot | No-code agent builder |

### Convergence
| # | Character | Game | Theme |
|---|-----------|------|-------|
| G13 | Maya, 31 | "The Prompt Lab" | Prompt engineering mastery — the skill under all tools |

---

## GAME 1 — FULL BRANCHING STORYBOARD

### Overview
**Character:** Jake, 17-year-old guitarist  
**Setting:** Bedroom → School Hallway → Music Class → Band Practice → Practice Room  
**Arc:** Jake discovers AI is an amplifier, not magic — and he's a natural conductor.  
**Concept taught:** The Conductor Principle — AI performs to the clarity of its conductor.

### Scene Flow Diagram

```
[INTRO CINEMATIC] Jake's bedroom, Tyler drops the bomb
         │
    [w1-learn-1] ──────────────────────────────────── What AI Actually Is
         │
    [w1-s1] ────────────── BRANCH POINT 1 ──── Tyler's EP / "write me a song"
         │                        │
    [CORRECT: C] ──┐     [WRONG: A,B,D] ──┐
         │         │                      │
         │    (main path)          [w1-s1-consequence]
         │                               │
         │                         [w1-s1-felipe]
         │                               │
         └───────────────────────────────┘
         │
    [w1-learn-2] ─────────────────────────── Why Most People Get Mediocre Results
         │
    [w1-s2] ────────────── NO BRANCH ──────── Tyler's viral hit / Fast vs. Deep
         │                                   (This scene has no wrong-path branch —
         │                                   Jake is DISCOVERING, not deciding)
         │
    [w1-learn-3] ─────────────────────────── Richness In, Richness Out
         │
    [w1-s3] ────────────── BRANCH POINT 2 ──── Señora Vega / hollow AI piece
         │                        │
    [CORRECT: B] ──┐     [WRONG: A,C,D] ──┐
         │         │                      │
         │    (main path)          [w1-s3-consequence]
         │                               │
         │                         [w1-s3-felipe]
         │                               │
         └───────────────────────────────┘
         │
    [w1-s4] ────────────── NO BRANCH ──────── Jake experiments at home
         │
    [w1-s4b] ─────────────────────────────── Prompt challenge (creative, no wrong)
         │
    [w1-s5] ────────────── BRANCH POINT 3 ──── Band practice / refine the output
         │                        │
    [CORRECT: C] ──┐     [WRONG: A,B,D] ──┐
         │         │                      │
         │    (main path)          [w1-s5-consequence]
         │                               │
         │                         [w1-s5-felipe]
         │                               │
         └───────────────────────────────┘
         │
    [w1-s6] ─────────────────────────────── BOSS — 5-round battle
         │
    [w1-s7] ─────────────────────────────── REVELATION
         │
    [w1-track-select] ───────────────────── FELIPE APPEARS — Track Selection
         │                                 (4 choices — all valid, none wrong)
         │
    ┌────┴─────────────────────────────────┐
    ▼         ▼            ▼              ▼
 Track A   Track B      Track C        Track D
(G2→G3→G4) (G5→G6→G7) (G8→G9→G10)  (G11→G12)
```

---

### Scene-by-Scene Detail

---

#### [INTRO CINEMATIC]
**Scene type:** Intro beats (existing)  
**Location:** BEDROOM · TUESDAY · 11:47 PM  
**Beats:**
- Tyler tells Jake he made a whole EP this weekend with AI
- Jake is still perfecting the same riff for the third week
- The world changed while he was trying to make it perfect

**Felipe:** Does not appear here. This is pure story.

---

#### [w1-learn-1] — What AI Actually Is
**Type:** learn  
**Location:** BEDROOM · TUESDAY · 11:40 PM  
**Concept:** AI is a prediction engine trained on billions of human examples. It mirrors what you give it.  
**Key line:** "AI amplifies your input. Garbage in, garbage out — but brilliance in, something remarkable out."  
**No branch needed.** This is pure teaching — player absorbs, doesn't decide.

---

#### [w1-s1] — Tyler's EP / The Conductor Principle ⚡ BRANCH POINT 1
**Type:** scenario  
**Location:** BEDROOM · TUESDAY · 11:47 PM  
**Question:** "Jake types 'write me a song' into an AI. The result sounds like elevator music — technically fine, completely soulless. What went wrong?"

**Correct path (Choice C — "He gave vague instructions"):**
- Reward: Jake nods slowly. "So I have to actually… conduct it." 
- XP burst fires: +100 XP
- → Continue to [w1-learn-2]

**Wrong path — Choice A ("AI isn't creative enough"):**
- → [w1-s1-consequence-A]
  - CONSEQUENCE SCENE (type: "consequence", location: BEDROOM · ONE WEEK LATER)
  - Jake dismisses AI entirely. Doesn't try again. His bandmates move forward. A month passes. Jake is still on the same riff. Tyler casually mentions his track just hit 100K plays.
  - Jake's internal thought: "Maybe it just isn't for me."
  - → [w1-s1-felipe-A]
    - Felipe appears (portrait + quote card, no video needed here)
    - Felipe line: "I've watched thousands of Jakes reach this exact moment. Every single one who blamed the tool never found out what the tool could do. The ones who asked 'what if I'm the problem' — they became conductors."
    - → Continue to [w1-learn-2]

**Wrong path — Choice B ("He needed a better/paid model"):**
- → [w1-s1-consequence-B]
  - CONSEQUENCE SCENE (location: BEDROOM · WEDNESDAY · 12:10 AM)
  - Jake spends $20 on a premium subscription. Types the same words: "write me a song." Gets the same elevator music — just with slightly better production.
  - Jake's thought: "I just got robbed. This is a scam."
  - → [w1-s1-felipe-B]
    - Felipe line: "A Stradivarius in untrained hands still sounds like noise. The most expensive instrument in the world waits for the musician who knows what to ask for. The subscription was never the investment that mattered."
    - → Continue to [w1-learn-2]

**Wrong path — Choice D ("AI only works for technical people"):**
- → [w1-s1-consequence-D]
  - CONSEQUENCE SCENE (location: SCHOOL HALLWAY · WEDNESDAY)
  - Jake watches Tyler demo AI music to a crowd of bandmates. He doesn't try. Labels it "for coders, not musicians." Six weeks later, a 14-year-old beatmaker from the same school goes viral using the same tool Jake dismissed.
  - → [w1-s1-felipe-D]
    - Felipe line: "The most powerful AI users I've worked with are musicians, poets, and chefs. Not because they're technical — because they know exactly what they want. That knowing is the whole skill. You already have it."
    - → Continue to [w1-learn-2]

---

#### [w1-learn-2] — Why Most People Get Mediocre Results
**Type:** learn  
**No branch.** Tyler's first 50 tracks were garbage — he just didn't tell Jake. The lesson is about prompting quality as the ceiling.

---

#### [w1-s2] — Fast vs. Deep
**Type:** scenario  
**Location:** SCHOOL HALLWAY · WEDNESDAY · 8:14 AM  
**No branch needed here.** Jake is raising a hypothesis (speed vs. depth) — this is exploratory. Getting the quiz question right or wrong here doesn't have major story consequences. Tyler is genuinely open to Jake's idea. The lesson is about possibility, not a mistake to avoid.

---

#### [w1-learn-3] — Richness In, Richness Out
**Type:** learn  
**No branch.** Pure teaching beat.

---

#### [w1-s3] — Señora Vega / Emotional Depth ⚡ BRANCH POINT 2
**Type:** scenario  
**Location:** MUSIC CLASS · WEDNESDAY · 3:21 PM  
**Question:** "Jake says the AI piece is 'technically perfect but hollow — like a robot trying to cry.' Why does AI-generated work often feel emotionally empty?"

**Correct path (Choice B — "The person didn't specify emotional intention"):**
- Señora Vega nods. "Now you're conducting."
- Jake has the specific language he's been missing: emotional direction.
- → Continue to [w1-s4]

**Wrong path — Choice A ("AI fundamentally cannot understand emotion"):**
- → [w1-s3-consequence-A]
  - CONSEQUENCE SCENE (location: MUSIC CLASS · SAME DAY · AFTER BELL)
  - Jake concludes AI music is inherently inferior. Decides it's not worth learning. A classmate — someone with no musical training — uses Jake's own emotional ideas (the description he muttered under his breath: "watching someone you love choose to leave") and asks AI to compose it. The piece makes the whole class go quiet.
  - Jake realizes: the idea was his. The AI just needed someone to give it a direction.
  - → [w1-s3-felipe-A]
    - Felipe line: "The AI didn't feel it. But when someone gave it a feeling to channel — the audience did. That's the entire game. The feeling lives in you. The instrument was always ready."
    - → Continue to [w1-s4]

**Wrong path — Choice C ("AI music will always be inferior"):**
- → [w1-s3-consequence-C] (same consequence as A, slight variation)
  - CONSEQUENCE SCENE: Same classmate moment, but this time the piece wins a regional composition award.
  - → [w1-s3-felipe-C]
    - Felipe line: "The judges didn't know it was AI. But they knew it moved them. What made it land wasn't the AI — it was the specificity of the human emotion someone injected into the prompt. 'Always inferior' was the wrong ceiling to set."
    - → Continue to [w1-s4]

**Wrong path — Choice D ("Señora Vega should have used a better tool"):**
- → [w1-s3-consequence-D]
  - CONSEQUENCE SCENE (location: HOME · THAT EVENING)
  - Jake Googles "best AI music tool." Tries four different ones. Each gets the same prompt: "write a sad string quartet." Each produces a different technically-correct, emotionally-hollow piece. He's spent two hours and learned nothing.
  - → [w1-s3-felipe-D]
    - Felipe line: "Same conductor. Four different orchestras. Same hollow result. The gap was never in the instrument. What Señora Vega needed wasn't a better tool — she needed a better score. So does Jake."
    - → Continue to [w1-s4]

---

#### [w1-s4] — Jake Experiments at Home / Context Is Your Score
**Type:** scenario  
**No branch needed.** Jake is alone, experimenting. This scene is about him discovering for himself — the learning is in the doing, not in a decision he can get wrong. Let it breathe.

---

#### [w1-s4b] — Prompt Challenge
**Type:** prompt  
**No branch.** Claude API scores this — all responses are valid attempts. XP is awarded for trying. The Maestro never penalizes creative courage.

---

#### [w1-s5] — Band Practice / Refining the Output ⚡ BRANCH POINT 3
**Type:** scenario  
**Location:** BAND PRACTICE · THURSDAY · 6:30 PM  
**Question:** "Jake's first prompt produces okay output. His second — with specific refinements — produces something the band actually wants to play. What skill made the difference?"

**Correct path (Choice C — "Expert evaluation + knowing what to ask for next"):**
- Tyler looks genuinely impressed. "So it's not about the first prompt. It's about knowing what to ask for next."
- Jake grins. "You don't write a song in one take. You don't get great AI output in one prompt either."
- → Continue to [w1-s6] (Boss)

**Wrong path — Choice A ("Luck"):**
- → [w1-s5-consequence-A]
  - CONSEQUENCE SCENE (location: BAND PRACTICE · SAME NIGHT · LATER)
  - Jake tries to replicate the result by running the same first prompt 20 more times, hoping to get lucky again. He doesn't. By midnight he has 20 mediocre bridges and no good ones. Tyler has gone home.
  - → [w1-s5-felipe-A]
    - Felipe line: "Luck is what experts call 'pattern recognition when you don't understand your own process.' Jake knew what was wrong with the first bridge — too soft, too long, metaphors where he needed declarations. That wasn't luck. That was musical judgment. Trust it."
    - → Continue to [w1-s6]

**Wrong path — Choice B ("Longer prompts every time"):**
- → [w1-s5-consequence-B]
  - CONSEQUENCE SCENE (location: BEDROOM · FRIDAY · 1:00 AM)
  - Jake spends the next session writing 400-word prompts for every request. They're meticulous and exhausting. The AI tries to satisfy every instruction simultaneously and produces something stiff and overcooked. Jake is spending more time prompting than playing.
  - → [w1-s5-felipe-B]
    - Felipe line: "A scalpel, not a shovel. Jake had the right instinct and the wrong execution. Precision is about relevance, not volume. One word in exactly the right place outperforms a paragraph of good intentions."
    - → Continue to [w1-s6]

**Wrong path — Choice D ("Live audience improves AI"):**
- → [w1-s5-consequence-D]
  - CONSEQUENCE SCENE: Jake gets home and tries to replicate the band-session result alone. It doesn't work the same way. He's confused — was it the crowd? Was it Tyler watching?
  - → [w1-s5-felipe-D]
    - Felipe line: "The audience didn't change the prompt — Jake's judgment did. When he's in the room with people who care, he hears more clearly what's missing. That listening is the skill. Bring it to every session, alone or not."
    - → Continue to [w1-s6]

---

#### [w1-s6] — BOSS — 5-Round Battle (Existing)
**No branches here.** The Boss is already a hard test. Getting a boss question wrong triggers the existing "Maestro Intervenes" feedback panel. Felipe does not appear in boss rounds — the Maestro (AI character) is already the boss adversary.

**Boss theme:** Jake vs. the AI — proving he's become the conductor, not just the user.  
**5 rounds cover:** vague prompts → emotion gap → fast vs. deep → context power → expertise multiplier.

---

#### [w1-s7] — REVELATION (Existing)
**No branches.** Pure cinematic moment. Jake sets down his guitar and opens the AI interface — this time as a conductor.  
**Key line:** "You were never just a guitarist. You were always a conductor waiting for an orchestra to arrive."

---

#### [w1-track-select] — FELIPE APPEARS: TRACK SELECTION ⚡ THE BIG BRANCH
**Type:** `track-select` (new scene type — renders Felipe portrait + 4 navigation cards)  
**Location:** BEDROOM · FRIDAY · 3:00 AM (after the revelation)

**Felipe's opening monologue:**
> "Jake. I've been watching you for a while. You just figured something out that most people never do — that AI is the instrument, not the musician. But here's the thing: there are dozens of orchestras waiting. All different. All powerful. The question is which stage you walk onto first."
> 
> "I can't make this choice for you. But I'll tell you what I know about each path."

**The 4 choices (all correct — this is navigation, not a test):**

**Choice 1 — 🧠 Track A: The Science**
> *"How does this thing actually work? Not the surface — the engine."*
- Description: "Go deep. Learn what's actually happening inside AI — why the same tool gives different people different results. Zoe figured this out in one rehearsal session. Carlos turned it into a career. Aria made it into a life."
- Leads to: Game 2 (Zoe — "Discover How AI Works")
- Felipe's aside: "The people who understand the engine don't just use AI better. They use every version of it better, forever. This path ages well."

**Choice 2 — 🎭 Track B: Claude's World**
> *"Show me the one they call the creative AI."*
- Description: "Claude. Jordan uses it to run a one-person consulting firm that competes with agencies. Kai uses it to ship code while most developers are still reading documentation. Priya uses it to run an entire operations team. Three different people. Same tool. Different superpowers."
- Leads to: Game 5 (Jordan — "Unlock Claude Chat")
- Felipe's aside: "This is the track for people who want to collaborate with an AI that actually thinks. Not just follows instructions."

**Choice 3 — 💬 Track C: Everyone's AI**
> *"ChatGPT and Gemini — the ones everyone's talking about."*
- Description: "The most used AI tools on earth. Alex turned ChatGPT into a content studio. Luna uses Gemini to read an entire semester of research in one afternoon. Sam runs his whole infrastructure from the terminal. Most people use 10% of what these tools can do."
- Leads to: Game 8 (Alex — "ChatGPT — Beyond the Hype")
- Felipe's aside: "If you're going to use the tool everyone has — you might as well use it better than everyone else."

**Choice 4 — 🏢 Track D: The Enterprise**
> *"Microsoft Copilot. AI inside the tools I already use every day."*
- Description: "Jake — future you, actually. At 17, you're already running a club with 31 emails a week and zero time. The AI is already in your Word, Teams, and Outlook. You just never opened it. Track D is about making the AI that lives inside your organization work for you, not around you."
- Leads to: Game 11 (Jake — "Microsoft Copilot M365")
- Felipe's aside: "A special case. This is the only track where you already know the main character."

**After player selects:**
Felipe's closing line (adapts to choice — see "Felipe's Line Library" section below):
> "Good. [Character name] is expecting you. Tell them Jake sent you."

---

## TRACK A — AI FUNDAMENTALS STORYBOARD

### Game 2: Zoe — "Discover How AI Works"
**Character:** Zoe, 19 — drummer  
**Setting:** Rehearsal Studio  
**Core concept:** What's happening inside the AI (prediction, tokens, training data, pattern matching)

**Key branch points:**
1. **The Training Data question** — "AI knows what it knows because..."
   - WRONG → Zoe tries to use AI for something outside its training window, gets confused why it's wrong. Felipe: "You can't ask the drummer to play a score she's never seen. AI knows the songs in its training set. Everything else, it's guessing from patterns."
2. **The Hallucination scene** — AI gives a confidently wrong fact
   - WRONG (trusting it blindly) → Consequence: Zoe submits a school paper with an AI hallucination. Grade drops.
   - Felipe: "The orchestra plays exactly what it sees on the score. It doesn't know when the composer made an error. That's still your job."

**Felipe outro (between G2→G3):**
> "Now Zoe knows how the engine works. Carlos has been using that engine for 15 years of professional work. He built a framework around it. You're going to want to see this."

---

### Game 3: Carlos — "AI for Professionals"
**Character:** Carlos, 38 — jazz saxophonist  
**Setting:** Backstage, home office, jazz club  
**Core concept:** The Maestro Method — a structured prompting framework for professional work (email, strategy, research, meetings)

**Key branch points:**
1. **The Maestro Method structure** — Carlos teaches Role → Task → Context → Constraint → Format
   - WRONG (skipping context) → Output is generic and unhelpful. Felipe: "Carlos learned this the hard way. A prompt without context is a musician who hasn't read the setlist. You have to tell it where you are in the story."
2. **The professional stakes scene** — Carlos uses AI on a high-stakes client proposal
   - WRONG (sends raw AI output without editing) → Client catches an error that reveals it was AI-generated. Relationship damage.
   - Felipe: "AI is the first draft. The expert is always the final editor. Carlos almost forgot that once too."

**Felipe outro (between G3→G4):**
> "Carlos gave you the framework. Aria is about to use it under pressure — the kind of pressure where everything either clicks or falls apart. This is the test."

---

### Game 4: Aria — "The Conductor Test"
**Character:** Aria, 26 — violinist  
**Setting:** Concert hall, practice room  
**Core concept:** Mastery assessment — diagnosing broken AI interactions, correcting them in real time

**Key branch points:**
1. **Broken prompt diagnosis** — Aria is given a bad prompt and must identify what's wrong
   - WRONG (misdiagnoses the problem) → Aria "fixes" the wrong element, still gets bad output. Felipe: "When the sound is wrong, the conductor listens for where it's wrong. Not just that it's wrong. The diagnosis matters as much as the fix."
2. **The pressure moment** — Real-time competition where Aria must beat another musician's AI output quality
   - WRONG → Aria over-engineers her prompt, produces something technically impressive but emotionally flat. Irony: the simpler, more emotionally precise prompt would have won.
   - Felipe: "Mastery sometimes looks like restraint. The best conductors know when to put down the baton and trust the musicians."

**Track A Felipe outro (after G4, before Game 13):**
> "Three games. Zoe gave you the engine. Carlos gave you the framework. Aria gave you the test. Now there's one more room in this school. Maya's been waiting. The Prompt Lab doesn't grade you on what you know — it grades you on how you use it."
> → Go to Game 13

---

## TRACK B — CLAUDE ECOSYSTEM STORYBOARD

### Game 5: Jordan — "Unlock Claude Chat"
**Character:** Jordan, 28 — freelance consultant  
**Setting:** Coffee shop, home office  
**Core concept:** Claude Chat's real capabilities — writing, research, strategy, creative work — and why most people use 10%

**Key branch points:**
1. **The capabilities reveal** — Jordan discovers Claude can do things she had no idea it could
   - WRONG (underestimates scope) → Jordan keeps using Claude as a fancy Google. Her competitor uses it to produce a full strategy deck in a night.
   - Felipe: "The musician who only uses the piano's white keys never hears what the black keys can do. Claude has black keys. This game is about finding them."
2. **The context window scene** — Jordan pastes an entire contract for analysis
   - WRONG (gives it in pieces) → Gets incomplete analysis, misses a critical clause.
   - Felipe: "Claude can hold the whole score in its head. Jordan was handing it one bar at a time. The whole is always smarter than the fragment."

**Felipe outro (between G5→G6):**
> "Jordan uses Claude to think. Kai uses Claude to build. Same AI. Completely different superpower. If you've ever stared at an error message for 45 minutes — Kai's story is specifically for you."

---

### Game 6: Kai — "Claude Code — AI in Your Terminal"
**Character:** Kai, 24 — junior developer  
**Setting:** Startup office, 2am  
**Core concept:** Claude Code — agentic coding, reads your codebase, writes diffs, runs tests

**Key branch points:**
1. **The agentic loop** — Kai learns to let Claude read files and iterate without copy-pasting
   - WRONG (keeps copy-pasting) → Kai is 45 minutes into pasting code while Elena has already merged her PR.
   - Felipe: "The musician who plays every note by ear in isolation never benefits from the orchestra reading the same sheet. Claude Code reads the room. Let it."
2. **The trust question** — How much should Kai trust Claude's output without reviewing?
   - WRONG (full blind trust) → A subtle bug makes it to production. Small but real damage.
   - Felipe: "Claude Code is the most capable session musician you've ever hired. It still plays what it sees on the score. You're still the one who writes the score."

**Felipe outro (between G6→G7):**
> "Kai ships code with it. Priya runs a business with it. Claude for Work is where the tool stops feeling like a tool and starts feeling like a colleague who actually knows your company."

---

### Game 7: Priya — "Claude for Work"
**Character:** Priya, 33 — operations manager  
**Setting:** Conference room, office  
**Core concept:** Claude Projects, custom instructions, team workflows — making Claude context-persistent

**Key branch points:**
1. **The custom instructions scene** — Priya sets up a Project with company context
   - WRONG (no custom instructions) → Every session starts from scratch. Claude gives generic output with no awareness of Priya's company.
   - Felipe: "Every musician who joins a new orchestra reads the program notes before the first rehearsal. Custom instructions are the program notes. Without them, Claude is playing someone else's show."
2. **The team handoff** — Priya shares a Claude Project with her team
   - WRONG (shares without documentation) → Team members use it inconsistently, outputs are all over the place.
   - Felipe: "An orchestra with one conductor and twelve individual interpretations plays cacophony. The same model with a shared context plays together."

**Track B Felipe outro (after G7, before Game 13):**
> "Jordan. Kai. Priya. Three people who made Claude feel like it was built specifically for their life. Now Maya is about to show you what makes ALL of this work — the craft underneath the tool. The Prompt Lab."
> → Go to Game 13

---

## TRACK C — CHATGPT + GEMINI STORYBOARD

### Game 8: Alex — "ChatGPT — Beyond the Hype"
**Character:** Alex, 26 — content creator  
**Setting:** Home studio, 1am  
**Core concept:** GPT-4o real capabilities, Custom GPTs, Canvas editor, when ChatGPT wins vs. other tools

**Key branch points:**
1. **The Custom GPT moment** — Alex builds a GPT trained on his own voice and style
   - WRONG (never customizes) → Alex gets generic content that sounds nothing like him. Brand deal falls through.
   - Felipe: "A cover band that sounds exactly like the original isn't Alex. A Custom GPT trained on his own content IS Alex. The tool follows; the creator leads."
2. **The platform comparison** — Alex realizes ChatGPT and Claude are different tools for different jobs
   - WRONG (assumes ChatGPT is best for everything) → Tries to use it for a 200-page document analysis, hits context limits.
   - Felipe: "Different orchestras play different repertoire. ChatGPT is extraordinary for some things. The best musicians know which hall they're performing in."

**Felipe outro (between G8→G9):**
> "Alex runs his content studio on ChatGPT. Luna runs her entire research life on Gemini. The interesting thing? Luna lives in Google. Gemini lives there too. This one gets efficient fast."

---

### Game 9: Luna — "Gemini — Google's AI"
**Character:** Luna, 21 — grad student  
**Setting:** University library, midnight  
**Core concept:** Gemini's Google Workspace integration, massive context window, deep research capability

**Key branch points:**
1. **The context window reveal** — Luna feeds Gemini an entire semester's worth of papers
   - WRONG (summarizes each paper separately) → Misses the cross-paper argument gaps Prof. Chen specifically asked about.
   - Felipe: "Luna was reading individual notes. Gemini could read the whole score at once. She was solving a chapter-one problem with a chapter-seven tool."
2. **The Google integration** — Gemini reads from Gmail, Docs, and Drive directly
   - WRONG (manually copies content) → Spends 45 minutes on data preparation that Gemini could have done in 3 seconds.
   - Felipe: "The instrument was already on the stage. Luna was still carrying it from the car."

**Felipe outro (between G9→G10):**
> "Luna uses Gemini to think at scale. Sam uses it in the terminal. For people who live in the command line, this next one is a different beast entirely."

---

### Game 10: Sam — "Gemini CLI"
**Character:** Sam, 29 — DevOps engineer  
**Setting:** Home lab, 1am  
**Core concept:** Gemini CLI — Google's free, open-source terminal AI agent; reads files, writes scripts, automates workflows

**Key branch points:**
1. **The file-reading revelation** — Gemini CLI reads Sam's entire config directory at once
   - WRONG (gives it one file at a time) → Takes twice as long, misses pattern variants.
   - Felipe: "Sam was handing the orchestra single pages. The whole score exists. Let it read the whole thing."
2. **The "ask before touching" safety feature** — Gemini CLI confirms before making changes
   - WRONG (disables confirmation) → A destructive change runs without review. Near-miss.
   - Felipe: "A conductor who never pauses before a key change leaves the orchestra scrambling. The confirm step is the pause. It's there for a reason."

**Track C Felipe outro (after G10, before Game 13):**
> "Alex. Luna. Sam. Three people who took the most-used AI tools in the world and found the ceiling everyone else missed. One more stage. Maya's Prompt Lab teaches the skill that makes EVERY tool better. No matter which ones you use."
> → Go to Game 13

---

## TRACK D — MICROSOFT COPILOT STORYBOARD

### Game 11: Jake — "Microsoft Copilot M365"
**Character:** Jake, 17 — music club president  
**Setting:** School admin office, classroom  
**Core concept:** Copilot in Word, Teams, Outlook, Excel — AI that lives inside tools the player already uses

**Special note:** This is older Jake. He already has his conductor revelation from Game 1. This game shows him applying it in a Microsoft ecosystem context. His knowledge from Game 1 is referenced.

**Key branch points:**
1. **The discovery scene** — Ms. Chen shows Jake that Copilot has been in his tools all year
   - WRONG (still doesn't bother) → Jake keeps manually summarizing meeting notes for another month, falls behind on club responsibilities.
   - Felipe: "The instrument was in the case this whole time. Jake kept playing with no strings. Miss Chen was patient. The semester wasn't."
2. **The Copilot in Outlook scene** — Jake uses Copilot to draft club announcement emails
   - WRONG (sends raw Copilot draft) → Email goes out sounding impersonal and formal. Club members notice it doesn't sound like Jake.
   - Felipe: "Copilot's first draft is the section rehearsal. Jake's edit is the final performance. Same process he learned in Game 1 — still applies."

**Felipe outro (between G11→G12):**
> "Jake found the AI that was already there. Now Tyler's given him a new challenge: build one of his own. No code. No computer science degree. Just understanding the problem well enough to hand it off."

---

### Game 12: Jake — "Copilot Studio"
**Character:** Jake, 17 — bot builder  
**Setting:** Music club room, Friday  
**Core concept:** No-code agent builder — knowledge base, conversation flows, deployment

**Key branch points:**
1. **The scope definition** — Jake must define exactly what his club bot should and shouldn't answer
   - WRONG (makes it too broad) → The bot tries to answer everything and hallucinates answers to questions it shouldn't touch. Three members get wrong rehearsal times.
   - Felipe: "An orchestra doesn't improvise the funeral march. Scope is the score. The bot plays what you wrote. Jake had to write the right score."
2. **The knowledge base upload** — Jake feeds the bot the club handbook
   - WRONG (uploads without cleaning outdated info) → The bot gives last year's room numbers. Confusion ensues.
   - Felipe: "Bad data in, bad answers out. The Conductor Principle works for bots too. Jake already knew this. He just forgot it applied here."

**Track D Felipe outro (after G12, before Game 13):**
> "Jake went from guitarist to conductor to agent builder. Three game-changing upgrades. The last one — Maya's Prompt Lab — is the one that makes all of it more powerful. The craft under the tool. Time to go."
> → Go to Game 13

---

## GAME 13 — CONVERGENCE: MAYA'S PROMPT LAB

### Character: Maya, 31 — UX designer & prompt engineer
### Setting: The Prompt Lab (abstract, cinematic — represents mastery)
### Concept: Prompt engineering as the universal skill under every AI tool

**This game is the keystone.** Players arrive here from 4 different paths. They all know different tools. But none of them know the craft that makes those tools 3x more powerful. That craft is what Maya teaches.

**Felipe's opening at Game 13 (appears once, at the very start):**
> "You made it. I've brought people here from four different paths — scientists, creators, coders, managers. Some of you took the long road. Some of you came straight here. It doesn't matter. Maya doesn't care where you came from. She cares whether you can think precisely. That's what this is."

**Felipe then disappears.** Maya takes over. She doesn't need his narration. This game stands alone.

**Maya's arc (existing 14-scene structure):**
1. Cold open — before/after prompt comparison. Shocking.
2. The 5 anatomy layers of a great prompt
3. Scenario: Context is King
4. Scenario: The Constraint Flip (what NOT to do)
5. Scenario: Role & Persona
6. Scenario: Chain of Thought
7. Predict the Output — player guesses which prompt wins
8. The 6 patterns that unlock 80% of use cases
9. Live challenge — player writes, AI scores
10. Boss — 5 optimization challenges
11. AI Compare — which AI responds to which prompting style
12. Revelation
13. Handoff — Maya to Jake (full circle)

**Revelation text (partial):**
> "Every tool you learned works because of this. Not the buttons — the craft. The craft of telling a machine exactly what you mean, in the language it understands, with the context it needs, and the constraints that define what you don't want. Jake called it conducting. Zoe called it the engine. Carlos called it the framework. They're all right. Maya calls it prompting. And you just learned how to do it."

**Maya's handoff to Jake (full circle):**
> Maya → Jake: "Tell him the Prompt Lab is finally done. The students are waiting for the maestro."

---

## FELIPE'S LINE LIBRARY

### At wrong-answer consequence scenes
Each Felipe appearance follows this structure:
1. **Reframe** — What the wrong choice actually reveals ("You made the choice most people make.")
2. **Insight** — The single truth the consequence scene demonstrated
3. **Bridge** — Where we go from here ("Now you know. This is where it gets different.")

### Track selection — Felipe's closing line by choice
| Track | Felipe's closing |
|-------|-----------------|
| A (Zoe) | "Good. Zoe is in the rehearsal studio. She's been keeping time alone long enough." |
| B (Jordan) | "Good. Jordan's at a coffee shop with three open tabs and a problem you're about to solve together." |
| C (Alex) | "Good. Alex is staring at a blank caption. He could use a second opinion on the algorithm." |
| D (Jake 11) | "Good. This one you'll recognize. A little older. A little wiser. Still the same guitar." |

### Between-game Felipe transitions
Each track has a Felipe outro video `/videos/felipe-game[N].mp4` — these already exist in the game data. The content for those videos should reflect the character handoff lines written in this document.

---

## CROSS-GAME MEMORY TRACKING

The following variables should be stored in `localStorage` and optionally synced to Supabase:

| Variable | Type | Set when | Used when |
|----------|------|----------|-----------|
| `maestro_player_name` | string | Game intro (name input) | Certificate, Felipe dialogue |
| `maestro_track_selected` | "A"\|"B"\|"C"\|"D" | Track selection (Game 1 end) | Felipe's cross-game references |
| `maestro_wrong_answers` | `{[sceneId]: string[]}` | Every wrong choice | Felipe personalizes ("You almost chose...") |
| `maestro_games_completed` | string[] | Game completion | Dashboard progress, Felipe's count ("You've completed 3 games") |
| `maestro_jake_knew_conductor` | boolean | Game 1 revelation confirmed | Games 11/12 (Jake track) — references G1 revelation |
| `maestro_xp_total` | number | Every XP award | Dashboard, EndScreen, Certificate |
| `maestro_streak_current` | number | Daily play | Nav pill, dashboard flame |

### Felipe's cross-game memory usage examples
- After 2 wrong answers: "You've had to take the long road a couple times today. The long road teaches things the short road doesn't."
- On Track A after choosing wrong: "The engine question is the hardest one. Zoe got it wrong the first time too."
- On Track D game 11: "The last time you saw Jake, he was in his bedroom at 3am figuring out he was a conductor. Look at him now."

---

## IMPLEMENTATION GUIDE

### New scene types needed
```typescript
// Add to Scene.type union in types.ts:
type Scene = {
  type: "scenario" | "quiz" | "revelation" | "boss" | "prompt" | "learn" 
      | "predict" | "handoff" | "ai-compare"
      | "consequence"    // NEW — wrong-answer detour scene
      | "felipe"         // NEW — Felipe portrait + quote card
      | "track-select"   // NEW — 4-card track selection UI
  ...
}
```

### Scene ID routing (for branching)
```typescript
// Add to Choice type:
type Choice = {
  ...
  leadsTo?: string  // scene ID to jump to (overrides sequential index)
}
```

### Game engine routing change
```typescript
// Current: sceneIndex + 1
// New: if choice.leadsTo exists → find scene by ID → jump there
//      else → sceneIndex + 1 (backward compatible with all existing games)
```

### Consequence scene flow
```
Wrong choice selected
  → choice.leadsTo = "w1-s1-consequence-A"
  → renders consequence scene (type: "consequence")
  → auto-advances after 4 seconds (no player decision needed)
  → leadsTo = "w1-s1-felipe-A"
  → renders Felipe portrait card (type: "felipe")
  → player clicks "Continue" to proceed
  → leadsTo = "w1-learn-2" (rejoin main path)
```

### Track selection scene
```
After revelation scene completes:
  → load "w1-track-select" (type: "track-select")
  → renders Felipe portrait + 4 navigation cards
  → player selects track
  → save to localStorage: maestro_track_selected = "A"/"B"/"C"/"D"
  → navigate to: /game/[track-first-game-slug]
```

### Felipe component (lightweight)
```tsx
// No video needed for consequence Felipes — just portrait + quote card
<FelipeCard
  quote="..."
  onContinue={() => advanceToScene("w1-learn-2")}
/>
// Renders: Dark overlay, Felipe portrait left, quote text right, Continue button
```

---

## CONTENT BUILD PRIORITY

### Phase 1 (this session): Game 1 branching
- [ ] Add `consequence`, `felipe`, `track-select` scene types to types.ts
- [ ] Add `leadsTo` to Choice type
- [ ] Update GameEngine scene router (scene ID lookup)
- [ ] Build FelipeCard component
- [ ] Build TrackSelectScene component
- [ ] Add 9 new scenes to game1.ts (3 branch points × 3 wrong choices = 9 consequence scenes, 9 felipe scenes... simplified to ~6 by sharing some consequences)
- [ ] Add w1-track-select scene to game1.ts

### Phase 2 (next session): Track entry points
- [ ] Felipe outro text woven into existing game transition videos (update script notes)
- [ ] Verify all 4 tracks' first games load correctly from track selection

### Phase 3 (content sprint): Branch scenes per track
- [ ] 2-3 branch points per game × 11 remaining games
- [ ] Felipe line library written for each touchpoint

### Phase 4 (polish): Cross-game memory
- [ ] localStorage tracking for all variables above
- [ ] Felipe dialogue responds to player history

---

## INVARIANTS — WHAT NEVER CHANGES

1. **No loops.** Every wrong branch rejoins the main path exactly 2 scenes later.
2. **No dead ends.** Every scene has a forward path.
3. **Felipe never judges.** He reframes. He teaches. He does not shame.
4. **The boss is sacred.** Boss rounds use the existing FeedbackPanel. Felipe does not appear inside boss rounds.
5. **Track selection cannot be wrong.** All 4 tracks are valid. Never suggest otherwise.
6. **Game 13 is the destination.** All roads lead to Maya. No track can skip it.
7. **The Conductor Principle is the spine.** Every game teaches a variation of: your expertise × AI = force multiplication. The theme never changes — only the domain does.

---

*Storyboard v1.0 — May 2026*  
*Next step: Build Game 1 branching architecture using this document as the guide.*
