# MaestroPlay — Asset Generation Dashboard
> Every video and image you need to generate, organized by game and priority.
> ✅ = exists  |  🎬 = generate with HeyGen  |  🎨 = generate with Midjourney/DALL-E/Gemini  |  🎞 = generate with PixVerse/Runway
> Update status as you create each asset.

---

## HOW TO USE THIS DASHBOARD
1. **HeyGen videos (🎬):** Scripts are in `HEYGEN_VIDEO_SCRIPTS.txt`. Match character appearance to existing images.
2. **Character images (🎨):** Drop at `public/images/[filename]`. Dark aesthetic, cinematic lighting.
3. **PixVerse/Runway clips (🎞):** Short 5–15 second cinematic loops. Drop at `public/videos/[filename]`.
4. **Felipe videos (🎬):** Felipe is the Maestro narrator — appears between games. Use same HeyGen avatar across all 14.

---

## 🚨 PRIORITY 1 — Game 1 & 2 (Currently live, needed now)

### Game 1 — Jake: "Write Me a Song" (`slug: write-me-a-song`)
| Asset | File | Type | Status | Notes |
|-------|------|------|--------|-------|
| Jake intro video | `/videos/jake-confession.mp4` | 🎬 HeyGen | ✅ EXISTS | Already wired |
| Felipe Game 1 outro | `/videos/felipe-game1.mp4` | 🎬 HeyGen | ✅ EXISTS | Already wired |
| Jake rocking clip | `/videos/JakeRocking.mp4` | 🎞 PixVerse | ✅ EXISTS | Used in game |
| Jake bedroom scene | `/images/jakebedroom.png` | 🎨 | ✅ EXISTS | Intro scene bg |
| Señora Vega portrait | `/images/senoravega.png` | 🎨 | ✅ EXISTS | NPC character |
| Tyler portrait | `/images/tyler.png` | 🎨 | ✅ EXISTS | NPC character |

**Game 1 — MISSING:**
| Asset | File | Type | Status | Notes |
|-------|------|------|--------|-------|
| Jake EP revelation clip | `/videos/g01-reveal.mp4` | 🎞 PixVerse | ❌ GENERATE | 8–12 sec loop: Jake hears his EP back, realizes it sounds like him. Dark bedroom, laptop glow. |

---

### Game 2 — Zoe: "Signal vs. Noise" (`slug: how-ai-works`)
| Asset | File | Type | Status | Notes |
|-------|------|------|--------|-------|
| Zoe character image | `/images/zoe.png` | 🎨 | ✅ EXISTS | Main portrait |
| Zoe maestro image | `/images/maestro-zoe.png` | 🎨 | ✅ EXISTS | Transformation |
| Zoe scene image | `/images/scene-zoe.png` | 🎨 | ✅ EXISTS | Intro backdrop |
| Zoe audio | `/audio/zoe-glass-circuit.mp3` | 🎵 | ✅ EXISTS | Game soundtrack |
| Felipe Game 2 outro | `/videos/felipe-game2.mp4` | 🎬 HeyGen | ✅ EXISTS | Already wired |

**Game 2 — MISSING:**
| Asset | File | Type | Status | Notes |
|-------|------|------|--------|-------|
| Zoe intro video | `/videos/g02-intro.mp4` | 🎬 HeyGen | ❌ GENERATE | Script in HEYGEN_VIDEO_SCRIPTS.txt — "Marcus Didn't Need Me Anymore" |
| Marcus NPC portrait | `/images/marcus.png` | 🎨 | ❌ GENERATE | Music producer, 30s-40s, casual studio look, dark aesthetic |
| Diana Voss NPC portrait | `/images/diana-voss.png` | 🎨 | ❌ GENERATE | VP Artist Development, Meridian Records, 40s, sharp professional, dark power aesthetic |
| Zoe revelation clip | `/videos/g02-reveal.mp4` | 🎞 PixVerse | ❌ GENERATE | Optional: 8 sec — recording studio, Zoe signing a contract, warm gold light breaking through |

---

## 🔶 PRIORITY 2 — Games 3–6 (Next to build)

### Game 3 — Carlos: "AI for Professionals" (`slug: ai-for-professionals`)
| Asset | File | Type | Status | Notes |
|-------|------|------|--------|-------|
| Carlos character | `/images/carlos.png` | 🎨 | ✅ EXISTS | |
| Carlos maestro | `/images/maestro-carlos.png` | 🎨 | ✅ EXISTS | |
| Carlos scene | `/images/scene-carlos.png` | 🎨 | ✅ EXISTS | |
| Carlos audio | `/audio/carlos-bar-one-spark.mp3` | 🎵 | ✅ EXISTS | |
| Carlos boardroom audio | `/audio/carlos-boardroom-afterglow.mp3` | 🎵 | ✅ EXISTS | |
| Felipe Game 3 outro | `/videos/felipe-game3.mp4` | 🎬 HeyGen | ✅ EXISTS | |

**Game 3 — MISSING:**
| Asset | File | Type | Status | Notes |
|-------|------|------|--------|-------|
| Carlos intro video | `/videos/g03-intro.mp4` | 🎬 HeyGen | ❌ GENERATE | Script in HEYGEN_VIDEO_SCRIPTS.txt — "I Can Hear When Someone Is Faking It" |

---

### Game 4 — Aria: "AI for Creatives" (`slug: ai-for-creatives`)
| Asset | File | Type | Status | Notes |
|-------|------|------|--------|-------|
| Aria character | `/images/aria.png` | 🎨 | ✅ EXISTS | |
| Aria maestro | `/images/maestro-aria.png` | 🎨 | ✅ EXISTS | |
| Aria scene | `/images/scene-aria.png` | 🎨 | ✅ EXISTS | |
| Felipe Game 4 outro | `/videos/felipe-game4.mp4` | 🎬 HeyGen | ✅ EXISTS | |

**Game 4 — MISSING:**
| Asset | File | Type | Status | Notes |
|-------|------|------|--------|-------|
| Aria intro video | `/videos/g04-intro.mp4` | 🎬 HeyGen | ❌ GENERATE | Script in HEYGEN_VIDEO_SCRIPTS.txt |
| Aria audio | `/audio/aria-midnight-brass-run.mp3` | 🎵 | ✅ EXISTS | |

---

### Game 5 — Jordan: "AI for Business" (`slug: ai-for-business`)
| Asset | File | Type | Status | Notes |
|-------|------|------|--------|-------|
| Jordan character | `/images/jordan.png` | 🎨 | ✅ EXISTS | |
| Jordan maestro | `/images/maestro-jordan.png` | 🎨 | ✅ EXISTS | |
| Jordan scene | `/images/scene-jordan.png` | 🎨 | ✅ EXISTS | |
| Jordan audio | `/audio/jordan-blue-cup-variations.mp3` | 🎵 | ✅ EXISTS | |
| Felipe Game 6 outro | `/videos/felipe-game6.mp4` | 🎬 HeyGen | ✅ EXISTS | |

**Game 5 — MISSING:**
| Asset | File | Type | Status | Notes |
|-------|------|------|--------|-------|
| Jordan intro video | `/videos/g05-intro.mp4` | 🎬 HeyGen | ❌ GENERATE | Script in HEYGEN_VIDEO_SCRIPTS.txt — "I Billed 40 Hours for 8 Hours of Work" |
| Felipe Game 5 outro | `/videos/felipe-game5.mp4` | 🎬 HeyGen | ❌ GENERATE | ⚠️ Missing from /videos/ — needed for game 5 outro |

---

### Game 6 — Kai: "AI for Developers" (`slug: ai-for-developers`)
| Asset | File | Type | Status | Notes |
|-------|------|------|--------|-------|
| Kai character | `/images/kai.png` | 🎨 | ✅ EXISTS | |
| Kai maestro | `/images/maestro-kai.png` | 🎨 | ✅ EXISTS | |
| Kai scene | `/images/scene-kai.png` | 🎨 | ✅ EXISTS | |
| Kai audio | `/audio/kai-emerald-debug-loop.mp3` | 🎵 | ✅ EXISTS | |
| Felipe Game 7 outro | `/videos/felipe-game7.mp4` | 🎬 HeyGen | ✅ EXISTS | |

**Game 6 — MISSING:**
| Asset | File | Type | Status | Notes |
|-------|------|------|--------|-------|
| Kai intro video | `/videos/g06-intro.mp4` | 🎬 HeyGen | ❌ GENERATE | Script in HEYGEN_VIDEO_SCRIPTS.txt — "I Said Pair Programming. I Didn't Say With Who." |

---

## 🔷 PRIORITY 3 — Games 7–12

### Game 7 — Priya
| Asset | File | Status |
|-------|------|--------|
| Priya character | `/images/priya.png` | ✅ EXISTS |
| Priya maestro | `/images/maestro-priya.png` | ✅ EXISTS |
| Priya scene | `/images/scene-priya.png` | ✅ EXISTS |
| Priya audio | `/audio/priya-desk-light-drift.mp3` | ✅ EXISTS |
| Felipe Game 8 outro | `/videos/felipe-game8.mp4` | ✅ EXISTS |
| Priya intro video | `/videos/g07-intro.mp4` | ❌ GENERATE |

### Game 8 — Alex
| Asset | File | Status |
|-------|------|--------|
| Alex character | `/images/alex.png` | ✅ EXISTS |
| Alex maestro | `/images/maestro-alex.png` | ✅ EXISTS |
| Alex scene | `/images/scene-alex.png` | ✅ EXISTS |
| Alex audio | `/audio/alex-sunlit-drafts.mp3` | ✅ EXISTS |
| Felipe Game 9 outro | `/videos/felipe-game9.mp4` | ✅ EXISTS |
| Alex intro video | `/videos/g08-intro.mp4` | ❌ GENERATE |

### Game 9 — Luna
| Asset | File | Status |
|-------|------|--------|
| Luna character | `/images/luna.png` | ✅ EXISTS |
| Luna maestro | `/images/maestro-luna.png` | ✅ EXISTS |
| Luna scene | `/images/scene-luna.png` | ✅ EXISTS |
| Felipe Game 10 outro | `/videos/felipe-game10.mp4` | ✅ EXISTS |
| Luna intro video | `/videos/g09-intro.mp4` | ❌ GENERATE |

### Game 10 — Sam
| Asset | File | Status |
|-------|------|--------|
| Sam character | `/images/sam.png` | ✅ EXISTS |
| Sam maestro | `/images/maestro-sam.png` | ✅ EXISTS |
| Sam scene | `/images/scene-sam.png` | ✅ EXISTS |
| Felipe Game 11 outro | `/videos/felipe-game11.mp4` | ✅ EXISTS |
| Sam intro video | `/videos/g10-intro.mp4` | ❌ GENERATE |

### Game 11 — Jake (Music Club)
| Asset | File | Status |
|-------|------|--------|
| Felipe Game 12 outro | `/videos/felipe-game12.mp4` | ✅ EXISTS |
| Jake (club) intro video | `/videos/g11-intro.mp4` | ❌ GENERATE |

### Game 12 — Jake (Builder)
| Asset | File | Status |
|-------|------|--------|
| Felipe Game 13 outro | `/videos/felipe-game13.mp4` | ✅ EXISTS |
| Jake (builder) intro video | `/videos/g12-intro.mp4` | ❌ GENERATE |

---

## 🟣 PRIORITY 4 — Bonus Games (Week 13 & 14)

### Game 13 — Maya (The Prompt Lab)
| Asset | File | Status | Notes |
|-------|------|--------|-------|
| Maya character | `/images/maya.png` | ✅ GENERATE | Generated: Maya, 30s, UX/AI researcher, smart and confident expression, dark blazer, dark gray studio backdrop |
| Maya maestro | `/images/maestro-maya.png` | ✅ GENERATE | Generated: Transformed version with neon pink/blue holographic user interfaces |
| Felipe Game 14 outro | `/videos/felipe-game14.mp4` | ✅ EXISTS | |
| Maya intro video | `/videos/g13-intro.mp4` | ❌ GENERATE | |

### Game 1v2 — Jake (Conductor's Awakening)
| Asset | File | Status | Notes |
|-------|------|--------|-------|
| Game 1v2 intro video | `/videos/g01v2-intro.mp4` | ❌ GENERATE | Unique HeyGen video needed — different from jake-confession.mp4 |
| Felipe 1v2 outro | `/videos/felipe-game1v2.mp4` | ✅ EXISTS | |

---

## 📺 FELIPE — The Maestro Narrator (all games)

Felipe appears after every game as the cross-game narrator. All Felipe videos
use the same HeyGen avatar/character. Tone: warm, demanding, cinematic.

| Game | File | Status |
|------|------|--------|
| Game 1 | `/videos/felipe-game1.mp4` | ✅ EXISTS |
| Game 1v2 | `/videos/felipe-game1v2.mp4` | ✅ EXISTS |
| Game 2 | `/videos/felipe-game2.mp4` | ✅ EXISTS |
| Game 3 | `/videos/felipe-game3.mp4` | ✅ EXISTS |
| Game 4 | `/videos/felipe-game4.mp4` | ✅ EXISTS |
| **Game 5** | `/videos/felipe-game5.mp4` | **❌ MISSING** |
| Game 6 | `/videos/felipe-game6.mp4` | ✅ EXISTS |
| Game 7 | `/videos/felipe-game7.mp4` | ✅ EXISTS |
| Game 8 | `/videos/felipe-game8.mp4` | ✅ EXISTS |
| Game 9 | `/videos/felipe-game9.mp4` | ✅ EXISTS |
| Game 10 | `/videos/felipe-game10.mp4` | ✅ EXISTS |
| Game 11 | `/videos/felipe-game11.mp4` | ✅ EXISTS |
| Game 12 | `/videos/felipe-game12.mp4` | ✅ EXISTS |
| Game 13 | `/videos/felipe-game13.mp4` | ✅ EXISTS |
| Game 14 | `/videos/felipe-game14.mp4` | ✅ EXISTS |

---

## 🖼 BACKGROUND SCENES (used as game location environments)

| Location | File | Status |
|----------|------|--------|
| Bedroom | `/images/bg-bedroom.png` | ✅ EXISTS |
| Band practice | `/images/bg-bandpractice.png` | ✅ EXISTS |
| Hallway | `/images/bg-hallway.png` | ✅ EXISTS |
| Lobby | `/images/bg-lobby.png` | ✅ EXISTS |
| Music class | `/images/bg-musicclass.png` | ✅ EXISTS |
| Practice room | `/images/bg-practiceroom.png` | ✅ EXISTS |
| Recording studio | ❌ GENERATE | For Game 2 — Zoe's world. Dark, intimate studio look. |
| Coffee shop | ❌ GENERATE | For Game 2 middle path. Casual, warm, slightly moody. |
| Conference room | ❌ GENERATE | For Game 2 — Meridian Records. Sleek, power aesthetic. |

Background image naming convention: `bg-[location].png`
Drop at: `public/images/`

---

## 🎵 AUDIO TRACKS (game soundtracks)

| Character | File | Status |
|-----------|------|--------|
| Jake / default | `/audio/concrete-riot.mp3` | ✅ EXISTS |
| Zoe | `/audio/zoe-glass-circuit.mp3` | ✅ EXISTS |
| Carlos (main) | `/audio/carlos-bar-one-spark.mp3` | ✅ EXISTS |
| Carlos (boardroom) | `/audio/carlos-boardroom-afterglow.mp3` | ✅ EXISTS |
| Aria | `/audio/aria-midnight-brass-run.mp3` | ✅ EXISTS |
| Jordan | `/audio/jordan-blue-cup-variations.mp3` | ✅ EXISTS |
| Kai | `/audio/kai-emerald-debug-loop.mp3` | ✅ EXISTS |
| Priya | `/audio/priya-desk-light-drift.mp3` | ✅ EXISTS |
| Alex | `/audio/alex-sunlit-drafts.mp3` | ✅ EXISTS |
| Luna/Sam/Jake v2 | `/audio/sparks-of-vienna.mp3` | ✅ EXISTS |
| Boardroom alt | `/audio/boardroom-afterglow.mp3` | ✅ EXISTS |

---

## 📋 QUICK GENERATE LIST (copy this when creating assets)

### Immediate — Generate These First:
1. 🎬 **Zoe intro video** — `/videos/g02-intro.mp4` — Script in HEYGEN_VIDEO_SCRIPTS.txt ("Marcus Didn't Need Me Anymore")
2. 🎨 **Maya character** — `/images/maya.png` — ✅ GENERATED
3. 🎨 **Maya maestro** — `/images/maestro-maya.png` — ✅ GENERATED
4. 🎬 **Felipe Game 5** — `/videos/felipe-game5.mp4` — Missing from video library
5. 🎨 **Marcus (NPC)** — `/images/marcus.png` — Music producer, 30s-40s, casual studio aesthetic
6. 🎨 **Diana Voss (NPC)** — `/images/diana-voss.png` — Music exec, 40s, sharp professional, power aesthetic

### Next Wave:
7. 🎬 Carlos intro — `/videos/g03-intro.mp4`
8. 🎬 Aria intro — `/videos/g04-intro.mp4`
9. 🎬 Jordan intro — `/videos/g05-intro.mp4`
10. 🎬 Kai intro — `/videos/g06-intro.mp4`
11. 🎞 Jake revelation clip — `/videos/g01-reveal.mp4`
12. 🎞 Zoe revelation clip — `/videos/g02-reveal.mp4`
13. 🎬 Game 1v2 intro — `/videos/g01v2-intro.mp4`

### Game 14 — Vera: "Pixel Perfect" (NEW):
14. 🎨 **Vera character** — `/images/vera.png` — 29-year-old Senior Frontend Developer, East Asian, dark studio aesthetic, cinematic lighting, tech/design vibe
15. 🎨 **Vera maestro** — `/images/maestro-vera.png` — Same character, post-transformation, confident, clean design studio backdrop
16. 🎬 **Vera intro video** — `/videos/g14-intro.mp4` — HeyGen avatar, "AI didn't replace my job. It made bad judgment faster." See HEYGEN_VIDEO_SCRIPTS.txt
17. 🎨 **Professor Reid NPC** — `/images/professor-reid.png` — Female UX director, 50s, formidable, dark academia aesthetic, glasses, whiteboard behind her
18. 🎬 **Felipe Game 14 outro** — `/videos/felipe-game14.mp4` — Felipe Maestro narrator, bridge to Carlos/Game 3

---

*Last updated: June 2026 — Game 14 (Pixel Perfect) + Design Critic Agent*
*Asset counts: ✅ ~45 exist | ❌ ~23 need generation*
