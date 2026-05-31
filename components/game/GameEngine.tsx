"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { Game, Scene, Choice } from "@/lib/games/types"
import SceneRenderer from "./SceneRenderer"
import EndScreen from "./EndScreen"
import XPCounter from "./XPCounter"
import FloatingNotes from "./FloatingNotes"
import CinematicIntro from "./CinematicIntro"
import GameIcon from "./GameIcon"
import NovelScene from "./NovelScene"
import PromptChallenge from "./PromptChallenge"
import VideoIntro from "./VideoIntro"
import SceneEnvironment from "./SceneEnvironment"
import BossArena from "./BossArena"
import { useSoundEngine, SoundMood } from "./SoundEngine"
import AchievementToast, { AchievementId } from "./AchievementToast"
import { useAuth } from "@/context/AuthContext"
import { supabaseBrowser } from "@/lib/supabase-browser"

type Props = { game: Game }
type GameState = "brand-video" | "video" | "story" | "intro" | "playing" | "answered" | "complete"

/* ── Background image map — mirrors NovelScene ──────────────────────────── */
function getSceneBgImage(location: string): string {
  const loc = location.toUpperCase()
  if (loc.includes("PRACTICE ROOM")) return "/images/bg-practiceroom.png"
  if (loc.includes("BAND PRACTICE"))  return "/images/bg-bandpractice.png"
  if (loc.includes("SCHOOL HALLWAY") || loc.includes("HALLWAY")) return "/images/bg-hallway.png"
  if (loc.includes("MUSIC CLASS") || loc.includes("CLASSROOM"))  return "/images/bg-musicclass.png"
  if (loc.includes("BEDROOM"))        return "/images/bg-bedroom.png"
  if (loc.includes("COFFEE SHOP") || loc.includes("CAFE"))       return "/images/bg-lobby.png"
  if (loc.includes("HOME OFFICE") || loc.includes("HOME"))       return "/images/bg-bedroom.png"
  if (loc.includes("OFFICE") || loc.includes("BOARDROOM") || loc.includes("CORPORATE") || loc.includes("CONFERENCE")) return "/images/bg-hallway.png"
  if (loc.includes("DESIGN STUDIO") || loc.includes("STUDIO") || loc.includes("CREATIVE")) return "/images/bg-musicclass.png"
  if (loc.includes("COMPUTER LAB") || loc.includes("LAB") || loc.includes("SERVER ROOM") || loc.includes("TECH")) return "/images/bg-practiceroom.png"
  if (loc.includes("LIBRARY") || loc.includes("RESEARCH"))       return "/images/bg-musicclass.png"
  if (loc.includes("CONCERT") || loc.includes("STAGE") || loc.includes("PERFORMANCE")) return "/images/bg-bandpractice.png"
  if (loc.includes("REHEARSAL"))      return "/images/bg-bandpractice.png"
  return ""   // truly unrecognised — show ambient gradient
}

function XPBurst({ xp }: { xp: number }) {
  return (
    <div style={{
      position: "fixed",
      top: "72px",
      right: "2rem",
      zIndex: 200,
      fontFamily: "Inter, sans-serif",
      fontWeight: 900,
      fontSize: "1.4rem",
      color: "#00d4f0",
      pointerEvents: "none",
      animation: "xp-burst 1.4s cubic-bezier(0.16,1,0.3,1) forwards",
    }}>
      +{xp} XP
    </div>
  )
}

function CorrectBurst() {
  const dots = Array.from({ length: 18 }, (_, i) => i)
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 150 }}>
      {dots.map(i => {
        const angle = (i / dots.length) * 360
        const dist  = 80 + Math.random() * 120
        const color = i % 3 === 0 ? "#00d4f0" : i % 3 === 1 ? "#e040fb" : "#00ff80"
        const size  = 4 + Math.random() * 6
        return (
          <div key={i} style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: `${size}px`, height: `${size}px`,
            borderRadius: "50%",
            background: color,
            animation: `particle-fly-${i % 4} 1s ease-out forwards`,
            transform: `rotate(${angle}deg) translateY(-${dist}px)`,
            opacity: 0,
            animationDelay: `${i * 0.02}s`,
          }} />
        )
      })}
    </div>
  )
}

export default function GameEngine({ game }: Props) {
  const [sceneIndex,   setSceneIndex]   = useState(0)
  const [state,        setState]        = useState<GameState>("brand-video")
  const [selectedLabel,setSelectedLabel]= useState<string | null>(null)
  const [totalXp,      setTotalXp]      = useState(0)
  const [lastXp,       setLastXp]       = useState(0)
  const [streak,       setStreak]       = useState(0)
  const [streakCount,  setStreakCount]  = useState(0)
  const [showBurst,    setShowBurst]    = useState(false)
  const [showXpBurst,  setShowXpBurst]  = useState(false)
  const [burstKey,     setBurstKey]     = useState(0)
  const [dialogueDone,   setDialogueDone]   = useState(false)
  const [achievement,    setAchievement]    = useState<{ id: AchievementId; ts: number } | undefined>()
  const [isMuted,        setIsMuted]        = useState(false)
  // undefined = idle/not needed, null = loading, "" = error/empty, string = AI text
  const [aiElaboration,  setAiElaboration]  = useState<string | null | undefined>(undefined)
  const [mounted,        setMounted]        = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => setMounted(true), [])

  // Mastery gate — quiz accuracy tracking
  const [quizTotal,         setQuizTotal]         = useState(0)
  const [quizCorrect,       setQuizCorrect]        = useState(0)
  const [masteryGateVisible,setMasteryGateVisible] = useState(false)

  const sound       = useSoundEngine()
  const { user }    = useAuth()

  /* ── Boss entrance GSAP overlay ─────────────────────────────────────── */
  const bossOverlayRef = useRef<HTMLDivElement | null>(null)
  const prevSceneType  = useRef<string>("")

  const currentScene = game.scenes[sceneIndex]
  const totalScenes  = game.scenes.length
  const maxXp        = game.scenes.reduce((sum, s) => sum + s.xpAward, 0)

  const currentMood: SoundMood =
    currentScene?.type === "boss"       ? "boss" :
    currentScene?.type === "revelation" ? "revelation" : "normal"

  /* ── one-time keyframe injection ─────────────────────────────────────── */
  useEffect(() => {
    const id = "maestro-keyframes"
    if (document.getElementById(id)) return
    const style = document.createElement("style")
    style.id    = id
    style.textContent = `
      @keyframes xp-burst {
        0%   { opacity:0; transform:translateY(0) scale(0.5); }
        20%  { opacity:1; transform:translateY(-8px) scale(1.2); }
        80%  { opacity:1; transform:translateY(-32px) scale(1); }
        100% { opacity:0; transform:translateY(-56px) scale(0.8); }
      }
      @keyframes particle-fly-0 {
        0%   { opacity:1; transform:rotate(var(--r,0deg)) translateY(0); }
        100% { opacity:0; transform:rotate(var(--r,0deg)) translateY(-160px) scale(0); }
      }
      @keyframes particle-fly-1 {
        0%   { opacity:1; transform:rotate(var(--r,0deg)) translateY(0); }
        100% { opacity:0; transform:rotate(var(--r,0deg)) translateY(-140px) translateX(40px) scale(0); }
      }
      @keyframes particle-fly-2 {
        0%   { opacity:1; transform:rotate(var(--r,0deg)) translateY(0); }
        100% { opacity:0; transform:rotate(var(--r,0deg)) translateY(-180px) translateX(-30px) scale(0); }
      }
      @keyframes particle-fly-3 {
        0%   { opacity:1; transform:rotate(var(--r,0deg)) translateY(0); }
        100% { opacity:0; transform:rotate(var(--r,0deg)) translateY(-120px) translateX(60px) scale(0); }
      }
      @keyframes streak-pop {
        0%   { transform:scale(1); }
        50%  { transform:scale(1.4); }
        100% { transform:scale(1); }
      }
      @keyframes revelation-glow {
        0%,100% { opacity:0.35; }
        50%     { opacity:0.65; }
      }
      @keyframes float {
        0%,100% { opacity:0.7; transform:scale(1); }
        50%     { opacity:1;   transform:scale(1.08); }
      }
      @keyframes pulse-glow {
        0%,100% { opacity:0.4; }
        50%     { opacity:1; }
      }
      @keyframes maestro-pulse {
        0%,100% { filter:drop-shadow(0 0 12px rgba(0,212,240,0.4)); }
        50%     { filter:drop-shadow(0 0 28px rgba(0,212,240,0.9)); }
      }
      @keyframes maestro-gate-in {
        from { opacity:0; transform:scale(0.96); }
        to   { opacity:1; transform:scale(1); }
      }
    `
    document.head.appendChild(style)
  }, [])

  /* ── audio hooks ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (game.audioTrack) sound.setNormalTrack(game.audioTrack)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (state !== "playing") return
    if (currentScene?.type === "revelation") {
      sound.startAmbient("revelation", 60)
      sound.playRevelation()
    } else if (currentScene?.type === "boss") {
      sound.setMood("boss")
      // ── Boss achievement (first boss ever) ──
      if (prevSceneType.current !== "boss") {
        if (!localStorage.getItem("maestro_ach_first_boss")) {
          setTimeout(() => setAchievement({ id: "first_boss", ts: Date.now() }), 1000)
        }
      }
      // ── Boss entrance cinematic via GSAP ──
      if (prevSceneType.current !== "boss" && bossOverlayRef.current) {
        const el = bossOverlayRef.current
        gsap.timeline()
          .set(el, { opacity: 0, display: "block" })
          .to(el, { opacity: 1, duration: 0.18, ease: "power2.in" })
          .to(el, { opacity: 0, duration: 0.55, ease: "power3.out", delay: 0.12 })
          .set(el, { display: "none" })
      }
    } else {
      sound.setMood("normal")
    }
    prevSceneType.current = currentScene?.type ?? ""
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneIndex, state])

  useEffect(() => {
    if (state === "complete") sound.fadeVolumeTo(0.55, 2500)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  useEffect(() => { setDialogueDone(false) }, [sceneIndex])

  /* ── persist XP + completion to localStorage on game complete ─────────── */
  useEffect(() => {
    if (state !== "complete") return
    try {
      // Accumulate total XP across all games
      const prev = parseInt(localStorage.getItem("maestro_total_xp") ?? "0") || 0
      const newTotal = prev + totalXp
      localStorage.setItem("maestro_total_xp", String(newTotal))

      // Mark this game as completed with XP earned
      const completedKey = `maestro_game_${game.week}_xp`
      const alreadyEarned = parseInt(localStorage.getItem(completedKey) ?? "0") || 0
      if (totalXp > alreadyEarned) {
        localStorage.setItem(completedKey, String(totalXp))
      }

      // ── Streak logic (with Streak Shield power-up support) ───────────────
      const prevStreak = parseInt(localStorage.getItem("maestro_daily_streak") ?? "0") || 0
      const today      = new Date().toDateString()
      const yesterday  = new Date(Date.now() - 86_400_000).toDateString()
      const lastPlay   = localStorage.getItem("maestro_last_play_date")

      // Check if Streak Shield power-up is active
      let shieldActive = false
      try {
        const puRaw = localStorage.getItem("maestro_pu_active")
        if (puRaw) {
          const pu = JSON.parse(puRaw)
          shieldActive = typeof pu.shield === "number" && Date.now() < pu.shield
        }
      } catch {}

      if (lastPlay !== today) {
        let newStreak: number
        if (!lastPlay || lastPlay === yesterday) {
          // Played yesterday (or first ever) — increment streak
          newStreak = prevStreak + 1
        } else if (shieldActive) {
          // Shield absorbs the broken streak — preserve current count
          newStreak = prevStreak
        } else {
          // Missed a day — streak resets to 1
          newStreak = 1
        }
        localStorage.setItem("maestro_daily_streak", String(newStreak))
        localStorage.setItem("maestro_last_play_date", today)
        // Update best streak if this is a new record
        const bestStreak = parseInt(localStorage.getItem("maestro_best_streak") ?? "0") || 0
        if (newStreak > bestStreak) {
          localStorage.setItem("maestro_best_streak", String(newStreak))
        }
      }

      // Dispatch storage event so Nav updates immediately
      window.dispatchEvent(new StorageEvent("storage", { key: "maestro_total_xp" }))

      // ── Persist to Supabase if user is logged in (async, non-blocking) ──
      if (user) {
        supabaseBrowser().auth.getSession().then(({ data }) => {
          const token = data.session?.access_token
          if (!token) return
          fetch("/api/progress", {
            method:  "POST",
            headers: {
              "Content-Type":  "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              gameSlug: game.slug,
              gameWeek: game.week,
              xpEarned: totalXp,
            }),
          }).catch(e => console.warn("Progress sync error:", e))
        }).catch(() => {})
      }

      // ── Achievements ──
      // First game ever
      if (!localStorage.getItem("maestro_ach_first_game")) {
        setTimeout(() => setAchievement({ id: "first_game", ts: Date.now() }), 1200)
      }
      // Level up — check if crossing a conductor threshold
      const levelThresholds: Array<{ xp: number; id: AchievementId }> = [
        { xp: 500,  id: "level_assoc"   },
        { xp: 1500, id: "level_cond"    },
        { xp: 3000, id: "level_maestro" },
      ]
      for (const { xp, id } of levelThresholds) {
        if (prev < xp && newTotal >= xp) {
          setTimeout(() => setAchievement({ id, ts: Date.now() }), 2000)
          break
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  /* ── handlers ────────────────────────────────────────────────────────── */
  const handleAnswer = useCallback((choice: Choice) => {
    if (state !== "playing") return
    setSelectedLabel(choice.label)
    setState("answered")

    const xpEarned = choice.correct ? currentScene.xpAward : Math.floor(currentScene.xpAward * 0.1)
    setLastXp(xpEarned)
    setTotalXp(prev => prev + xpEarned)

    // Track mastery accuracy (non-boss scenes only — boss is the gate, not the test)
    if (currentScene.type !== "boss") {
      setQuizTotal(t => t + 1)
      if (choice.correct) setQuizCorrect(c => c + 1)
    }

    if (choice.correct) {
      sound.playCorrect()
      setTimeout(() => sound.playXP(), 380)
      const newStreak = streakCount + 1
      setStreakCount(newStreak)
      setStreak(prev => Math.max(prev, newStreak))
      if (newStreak >= 2) setTimeout(() => sound.playStreak(), 620)
      setShowBurst(true)
      setTimeout(() => setShowBurst(false), 1200)
      // Streak achievements
      if (newStreak === 3) setAchievement({ id: "streak_3", ts: Date.now() })
      if (newStreak === 5) setAchievement({ id: "streak_5", ts: Date.now() })
      setAiElaboration(undefined)
    } else {
      sound.playWrong()
      setStreakCount(0)

      // ── Deduct a life for wrong answers ──────────────────────────────────
      try {
        const currentLives = parseInt(localStorage.getItem("maestro_lives") ?? "3") || 3
        if (currentLives > 0) {
          const newLives = currentLives - 1
          localStorage.setItem("maestro_lives", String(newLives))
          // Notify dashboard / nav in real time
          window.dispatchEvent(new StorageEvent("storage", { key: "maestro_lives" }))
        }
      } catch {}

      // Trigger Claude API elaboration if scene has a question with choices
      if (currentScene.question && currentScene.choices) {
        const correctChoice = currentScene.choices.find(c => c.correct)
        if (correctChoice) {
          abortRef.current?.abort()
          abortRef.current = new AbortController()
          setAiElaboration(null) // loading
          fetch("/api/maestro-feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: abortRef.current.signal,
            body: JSON.stringify({
              question: currentScene.question,
              wrongChoiceText: choice.text,
              correctChoiceText: correctChoice.text,
              concept: currentScene.concept?.title,
              scenarioText: currentScene.scenarioText,
            }),
          })
            .then(r => r.json())
            .then(data => setAiElaboration(data.elaboration ?? ""))
            .catch(err => { if (err.name !== "AbortError") setAiElaboration("") })
        }
      }
    }

    setShowXpBurst(true)
    setBurstKey(k => k + 1)
    setTimeout(() => setShowXpBurst(false), 1500)
  }, [state, currentScene, streakCount, sound])

  const handleNext = useCallback(() => {
    sound.playClick()
    // Cancel any in-flight elaboration fetch and reset state
    abortRef.current?.abort()
    abortRef.current = null
    setAiElaboration(undefined)

    // Award XP for passive scenes (revelation, learn, handoff)
    if (currentScene.type === "revelation" || currentScene.type === "learn" || currentScene.type === "handoff") {
      if (currentScene.xpAward > 0) {
        setTotalXp(prev => prev + currentScene.xpAward)
        setLastXp(currentScene.xpAward)
        setShowXpBurst(true)
        setBurstKey(k => k + 1)
        setTimeout(() => setShowXpBurst(false), 1500)
      }
    }

    if (sceneIndex + 1 >= totalScenes) { setState("complete"); return }

    // ── Mastery gate: check accuracy before boss scene ──
    const nextScene = game.scenes[sceneIndex + 1]
    if (nextScene?.type === "boss" && quizTotal > 0) {
      const accuracy = quizCorrect / quizTotal
      if (accuracy < 0.8) {
        setMasteryGateVisible(true)
        return
      }
    }

    sound.playTransition()
    // AnimatePresence handles the visual transition — just update the index
    setSceneIndex(i => i + 1)
    setSelectedLabel(null)
    setLastXp(0)
    setState("playing")
  }, [sceneIndex, totalScenes, currentScene, sound, game.scenes, quizTotal, quizCorrect])

  const handleBossComplete = useCallback((xpEarned: number) => {
    sound.playClick()
    setTotalXp(prev => prev + xpEarned)
    setLastXp(xpEarned)
    setShowXpBurst(true)
    setBurstKey(k => k + 1)
    setTimeout(() => setShowXpBurst(false), 1500)
    if (sceneIndex + 1 >= totalScenes) { setState("complete"); return }
    sound.playTransition()
    setSceneIndex(i => i + 1)
    setSelectedLabel(null)
    setState("playing")
  }, [sceneIndex, totalScenes, sound])

  const handleStart = () => {
    sound.playClick()
    sound.startAmbient("normal")
    setState("playing")
  }

  /* ── early-exit states ───────────────────────────────────────────────── */

  /* Hydration guard — return a black screen until client is mounted so SSR
     and client agree on the initial render (avoids video src mismatch). */
  if (!mounted) {
    return <div style={{ position: "fixed", inset: 0, background: "#000" }} />
  }

  /* 1 — MaestroPlay brand opener — always plays first, muted, no game-specific branding */
  if (state === "brand-video") {
    return (
      <VideoIntro
        src="/videos/MaestroPlayVideo.mp4"
        onComplete={() => {
          if (game.introVideo) setState("video")           // → game-specific intro next
          else {
            sound.setGameVolume(0.5)
            // Skip story beats if the game has none — go straight to intro card
            if (game.intro?.beats?.length) setState("story")
            else setState("intro")
          }
        }}
        startMusic={() => {
          // Only start ambient music here if no game-specific video follows.
          // If there IS a game-specific video, music starts after that video ends instead,
          // so Jake's voice + Sparks of Vienna don't clash with the ambient track.
          if (!game.introVideo) sound.startAmbient("cinematic", 52)
        }}
        gameTitle={game.title}
        gameEmoji={game.emoji}
        accentColor={game.accentColor}
        hasAudio={false}
      />
    )
  }

  /* 2 — Game-specific intro video (e.g. jake-confession.mp4) — plays second */
  if (state === "video") {
    return (
      <VideoIntro
        src={game.introVideo!}
        onComplete={() => {
          sound.setGameVolume(0.5)
          // Video told the story — always skip beats and go straight to intro card
          setState("intro")
        }}
        startMusic={() => sound.startAmbient("cinematic", 52)}
        gameTitle={game.title}
        gameEmoji={game.emoji}
        accentColor={game.accentColor}
        hasAudio={true}
      />
    )
  }
  if (state === "story") {
    return (
      <CinematicIntro
        onComplete={() => setState("intro")}
        startMusic={() => sound.startAmbient("cinematic")}
        intro={game.intro}
      />
    )
  }
  if (state === "complete") {
    return <EndScreen game={game} totalXp={totalXp} streak={streak} />
  }

  const progressPct = (sceneIndex / totalScenes) * 100
  const isBoss      = currentScene?.type === "boss"
  const sceneBgImage = currentScene?.location ? getSceneBgImage(currentScene.location) : ""

  /* ── Framer Motion variants ──────────────────────────────────────────── */
  const regularVariants = {
    initial: { opacity: 0, x: 38 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -22 },
  }
  const bossVariants = {
    initial: { opacity: 0, scale: 0.93, filter: "blur(8px)" },
    animate: { opacity: 1, scale: 1,    filter: "blur(0px)" },
    exit:    { opacity: 0, scale: 0.97, filter: "blur(4px)" },
  }
  const regularTransition = {
    x:       { type: "spring" as const, stiffness: 420, damping: 38 },
    opacity: { duration: 0.18 },
  }
  const bossTransition = {
    scale:   { type: "spring" as const, stiffness: 300, damping: 26 },
    opacity: { duration: 0.28 },
    filter:  { duration: 0.32 },
  }

  return (
    <div style={{ height: "100vh", background: "var(--bg-primary)", position: "relative", overflow: "hidden" }}>

      <FloatingNotes mood={currentMood} />
      <AchievementToast trigger={achievement} />

      {/* ── Boss entrance flash overlay (GSAP controlled) ──── */}
      <div
        ref={bossOverlayRef}
        style={{
          display:        "none",
          position:       "fixed",
          inset:          0,
          background:     "radial-gradient(ellipse at 50% 40%, rgba(224,64,251,0.55) 0%, rgba(123,47,190,0.85) 40%, rgba(8,6,15,0.95) 100%)",
          zIndex:         200,
          pointerEvents:  "none",
        }}
      />

      {/* ── Mastery Gate overlay ──── */}
      {masteryGateVisible && (
        <div style={{
          position:      "fixed", inset: 0, zIndex: 300,
          background:    "rgba(8,6,15,0.94)",
          backdropFilter:"blur(24px)",
          display:       "flex", alignItems: "center", justifyContent: "center",
          padding:       "2rem",
          animation:     "maestro-gate-in 0.5s cubic-bezier(0.34,1.1,0.64,1) both",
        }}>
          <div style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>
            {/* Conductor icon */}
            <div style={{
              width:"72px", height:"72px", borderRadius:"50%", margin:"0 auto 1.5rem",
              background:"linear-gradient(135deg, rgba(224,64,251,0.15) 0%, rgba(123,47,190,0.15) 100%)",
              border:"1.5px solid rgba(224,64,251,0.3)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"2rem",
              boxShadow:"0 0 40px rgba(224,64,251,0.2)",
            }}>
              🎼
            </div>

            {/* Title */}
            <div style={{
              fontFamily:"Inter, sans-serif", fontWeight:800, fontSize:"0.55rem",
              letterSpacing:"0.32em", textTransform:"uppercase",
              color:"rgba(224,64,251,0.6)", marginBottom:"0.65rem",
            }}>
              The Maestro Intervenes
            </div>
            <h2 style={{
              fontFamily:"Cormorant Garamond, serif", fontWeight:700,
              fontSize:"clamp(1.6rem, 4vw, 2.2rem)", color:"#fff",
              lineHeight:1.15, marginBottom:"1rem",
            }}>
              The conductor's door is closed.
            </h2>

            {/* Accuracy display */}
            <div style={{
              display:"inline-flex", alignItems:"baseline", gap:"0.4rem",
              background:"rgba(224,64,251,0.07)", border:"1px solid rgba(224,64,251,0.2)",
              borderRadius:"16px", padding:"1rem 2rem", marginBottom:"1.25rem",
            }}>
              <span style={{
                fontFamily:"Inter, sans-serif", fontWeight:900,
                fontSize:"3rem", color:"var(--pink)", lineHeight:1,
              }}>
                {Math.round((quizCorrect / quizTotal) * 100)}%
              </span>
              <span style={{
                fontFamily:"Inter, sans-serif", fontSize:"0.8rem",
                color:"rgba(240,238,255,0.5)",
              }}>
                accuracy
              </span>
            </div>

            <p style={{
              fontFamily:"Cormorant Garamond, serif", fontStyle:"italic",
              fontSize:"1.05rem", color:"rgba(240,238,255,0.55)",
              lineHeight:1.65, marginBottom:"2rem",
            }}>
              "{quizCorrect} of {quizTotal} questions answered correctly. The conductor test demands 80% — the maestro expects precision before the stage."
            </p>

            {/* Buttons */}
            <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem", maxWidth:"360px", margin:"0 auto" }}>
              <button
                onClick={() => {
                  // Proceed to boss anyway — the brave path
                  setMasteryGateVisible(false)
                  sound.playTransition()
                  setSceneIndex(i => i + 1)
                  setSelectedLabel(null)
                  setLastXp(0)
                  setState("playing")
                }}
                style={{
                  fontFamily:"Inter, sans-serif", fontWeight:800, fontSize:"0.95rem",
                  color:"#fff",
                  background:"linear-gradient(90deg, #e040fb, #7b2fbe)",
                  padding:"0.9rem 2rem", borderRadius:"100px", border:"none",
                  cursor:"pointer", letterSpacing:"0.02em",
                  boxShadow:"0 0 32px rgba(224,64,251,0.3)",
                  transition:"transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 0 48px rgba(224,64,251,0.45)" }}
                onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 0 32px rgba(224,64,251,0.3)" }}
              >
                Challenge the conductor anyway →
              </button>

              <button
                onClick={() => {
                  // Go back — let them keep reviewing where they are
                  setMasteryGateVisible(false)
                }}
                style={{
                  fontFamily:"Inter, sans-serif", fontWeight:600, fontSize:"0.875rem",
                  color:"rgba(240,238,255,0.45)",
                  background:"transparent", border:"1px solid rgba(255,255,255,0.1)",
                  padding:"0.8rem 2rem", borderRadius:"100px",
                  cursor:"pointer", letterSpacing:"0.02em",
                  transition:"color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color="rgba(240,238,255,0.7)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.22)" }}
                onMouseLeave={e => { e.currentTarget.style.color="rgba(240,238,255,0.45)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)" }}
              >
                ← Review the material
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Ambient background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: isBoss
          ? "radial-gradient(ellipse at 50% 30%, rgba(224,64,251,0.06) 0%, transparent 55%), radial-gradient(ellipse at 30% 70%, rgba(123,47,190,0.07) 0%, transparent 50%)"
          : currentScene?.type === "revelation"
          ? "radial-gradient(ellipse at 50% 40%, rgba(0,212,240,0.07) 0%, transparent 55%), radial-gradient(ellipse at 50% 60%, rgba(123,47,190,0.08) 0%, transparent 50%)"
          : "radial-gradient(ellipse at 20% 50%, rgba(0,212,240,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(123,47,190,0.06) 0%, transparent 50%)",
        transition: "background 1.2s ease",
      }} />

      {showBurst    && <CorrectBurst />}
      {showXpBurst  && <XPBurst xp={lastXp} key={String(burstKey)} />}

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", background: "rgba(255,255,255,0.06)", zIndex: 50 }}>
        <div style={{ height: "100%", width: `${progressPct}%`, background: isBoss ? "linear-gradient(90deg,#e040fb,#7b2fbe)" : "linear-gradient(90deg,#00d4f0,#e040fb)", transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>

      {/* Top bar */}
      <div style={{ position: "fixed", top: "3px", left: 0, right: 0, padding: "0.875rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,6,15,0.75)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", zIndex: 50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
          {game.icon
            ? <GameIcon name={game.icon} size={26} />
            : <span style={{ fontSize:"1.4rem", lineHeight:1 }}>{game.emoji}</span>
          }
          <span style={{ fontFamily:"Inter,sans-serif", fontWeight:700, fontSize:"0.72rem", color:"rgba(240,238,255,0.5)", letterSpacing:"0.04em", display:"none" }} className="sm:block">
            {game.characterName ?? game.title}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {state !== "intro" && (
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "var(--muted)" }}>
              {sceneIndex + 1} / {totalScenes}
            </span>
          )}
          {/* Mute toggle */}
          <button
            onClick={() => { const m = sound.toggleMute(); setIsMuted(m) }}
            title={isMuted ? "Unmute music" : "Mute music"}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: "0.15rem",
              fontSize: "1.1rem", lineHeight: 1, flexShrink: 0,
              color: isMuted ? "rgba(240,238,255,0.28)" : "rgba(240,238,255,0.6)",
              transition: "color 0.2s, transform 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.15)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "" }}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
          <div style={{ width: "130px" }}>
            <XPCounter xp={totalXp} maxXp={maxXp} newXp={lastXp} />
          </div>
          {streakCount >= 2 && (
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "var(--pink)", animation: "streak-pop 0.3s ease" }}>
              {streakCount}🔥
            </span>
          )}
        </div>
      </div>

      {/* ——— INTRO SCREEN ——— */}
      <AnimatePresence>
        {state === "intro" && (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.28 } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "fixed", inset: 0, zIndex: 10, display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}
          >
            {/* Character art as cinematic backdrop */}
            {game.characterImage && (
              <>
                {/* Full blurred atmospheric fill */}
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url(${game.characterImage})`,
                  backgroundSize: "cover", backgroundPosition: "center top",
                  filter: "blur(60px) saturate(1.2) brightness(0.35)",
                  transform: "scale(1.15)",
                }} />
                {/* Sharp character art — centered, tall */}
                <div style={{
                  position: "absolute", bottom: 0, left: "50%",
                  transform: "translateX(-50%)",
                  height: "75vh", maxWidth: "380px", width: "100%",
                  maskImage: "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.7) 15%, black 40%, black 70%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.7) 15%, black 40%, black 70%, transparent 100%)",
                }}>
                  {game.protagonistVideo ? (
                    <video
                      src={game.protagonistVideo}
                      autoPlay loop muted playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
                    />
                  ) : (
                    <img src={game.characterImage} alt={game.characterName ?? ""} draggable={false}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block", animation: "maestro-pulse 4s ease-in-out infinite" }} />
                  )}
                </div>
              </>
            )}

            {/* Dark gradient at bottom for text legibility */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,6,15,0.98) 0%, rgba(8,6,15,0.75) 28%, rgba(8,6,15,0.2) 55%, transparent 75%)", pointerEvents: "none" }} />
            {/* Dark vignette at top for nav area */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,6,15,0.7) 0%, transparent 25%)", pointerEvents: "none" }} />
            {/* Accent color tint */}
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 80%, ${game.accentColor ?? "rgba(0,212,240,0.1)"} 0%, transparent 55%)`, pointerEvents: "none", opacity: 0.4 }} />

            {/* Content panel — bottom anchored */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.18, type: "spring", stiffness: 320, damping: 28 }}
              style={{ position: "relative", zIndex: 5, maxWidth: "540px", width: "100%", padding: "0 2rem 3rem", textAlign: "center" }}
            >
              {/* Character chip */}
              {game.characterName && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 380, damping: 28 }}
                  style={{ marginBottom: "0.6rem" }}
                >
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", background: `${game.accentColor ?? "rgba(0,212,240,0.08)"}18`, border: `1px solid ${game.accentColor ?? "rgba(0,212,240,0.3)"}55`, borderRadius: "100px", padding: "0.22rem 0.85rem" }}>
                    <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: game.accentColor ?? "var(--cyan)", boxShadow: `0 0 6px ${game.accentColor ?? "var(--cyan)"}` }} />
                    <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: game.accentColor ?? "var(--cyan)" }}>
                      {game.characterName}{game.characterRole ? ` · ${game.characterRole}` : ""}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Game label */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                <div className="label-caps" style={{ color: "var(--muted)", marginBottom: "0.6rem", fontSize: "0.58rem" }}>
                  Game {game.week} · {game.duration}
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, type: "spring", stiffness: 320, damping: 26 }}
                style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(1.8rem, 6vw, 2.8rem)", color: "#fff", lineHeight: 1.08, marginBottom: "0.75rem", letterSpacing: "-0.01em" }}
              >
                {game.title}
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.52 }}
                style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1rem", color: "rgba(240,238,255,0.55)", marginBottom: "1.5rem", lineHeight: 1.55 }}
              >
                &ldquo;{game.tagline}&rdquo;
              </motion.p>

              {/* Scene pips — staggered entrance */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                style={{ display: "flex", gap: "0.4rem", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" }}
              >
                {game.scenes.map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                    transition={{ delay: 0.62 + i * 0.04, type: "spring", stiffness: 480, damping: 30 }}
                    style={{ width: "22px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.18)", transformOrigin: "left", boxShadow: "none" }}
                  />
                ))}
              </motion.div>

              {/* Begin button */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, type: "spring", stiffness: 380, damping: 28 }}>
                <button
                  onClick={handleStart}
                  style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1rem",
                    color: "#08060f",
                    background: `linear-gradient(90deg, ${game.accentColor ?? "#00d4f0"}, #e040fb)`,
                    padding: "1rem 3.5rem", borderRadius: "100px", border: "none", cursor: "pointer",
                    boxShadow: `0 0 40px ${game.accentColor ?? "rgba(0,212,240,0.3)"}44`,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow = `0 0 56px ${game.accentColor ?? "rgba(0,212,240,0.4)"}66` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 0 40px ${game.accentColor ?? "rgba(0,212,240,0.3)"}44` }}
                >
                  Begin Game →
                </button>
              </motion.div>

              {/* Meta */}
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
                style={{ fontFamily: "Inter,sans-serif", fontSize: "0.7rem", color: "var(--muted)", marginTop: "1rem" }}>
                {game.scenes.length} scenes · {game.free ? "Free" : `$${game.price?.toFixed(2)}`} · Up to {maxXp} XP
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ——— DIALOGUE OVERLAY ——— */}
      {state === "playing" && currentScene?.dialogue?.length && !dialogueDone && currentScene.type !== "prompt" && (
        <NovelScene
          scene={currentScene}
          onComplete={() => setDialogueDone(true)}
          protagonistVideo={game.protagonistVideo}
          protagonistImage={game.characterImage}
        />
      )}

      {/* ——— HANDOFF: "What's Next" card — shown after dialogue completes ——— */}
      {state === "playing" && currentScene?.type === "handoff" && dialogueDone && (
        <div style={{
          position:       "fixed",
          inset:          0,
          zIndex:         30,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          padding:        "2rem",
          background:     "rgba(8,6,15,0.88)",
          backdropFilter: "blur(20px)",
        }}>
          {/* Background gradient */}
          <div style={{
            position:   "absolute",
            inset:      0,
            background: "radial-gradient(ellipse at 50% 40%, rgba(0,212,240,0.06) 0%, transparent 55%)",
            pointerEvents:"none",
          }} />

          <div style={{
            position:   "relative",
            maxWidth:   "480px",
            width:      "100%",
            textAlign:  "center",
            zIndex:     1,
          }}>
            {/* Animated ♪ */}
            <div style={{
              fontSize:     "2rem",
              marginBottom: "1rem",
              filter:       "drop-shadow(0 0 16px rgba(0,212,240,0.6))",
              display:      "inline-block",
              animation:    "float 4s ease-in-out infinite",
            }}>
              ♪
            </div>

            {/* Next character preview */}
            {game.nextGame && (
              <>
                <div style={{
                  display:      "inline-flex",
                  alignItems:   "center",
                  gap:          "0.45rem",
                  background:   "rgba(0,212,240,0.07)",
                  border:       "1px solid rgba(0,212,240,0.22)",
                  borderRadius: "100px",
                  padding:      "0.22rem 0.85rem",
                  marginBottom: "0.75rem",
                }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 6px var(--cyan)" }} />
                  <span style={{
                    fontFamily:    "Inter, sans-serif",
                    fontWeight:    700,
                    fontSize:      "0.62rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color:         "var(--cyan)",
                  }}>
                    Next up: {game.nextGame.character}
                  </span>
                </div>

                {game.nextGame.previewImage && (
                  <div style={{
                    width:        "90px",
                    height:       "90px",
                    borderRadius: "50%",
                    margin:       "0 auto 1rem",
                    overflow:     "hidden",
                    border:       "2px solid rgba(0,212,240,0.3)",
                    boxShadow:    "0 0 24px rgba(0,212,240,0.15)",
                  }}>
                    <img
                      src={game.nextGame.previewImage}
                      alt={game.nextGame.character}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                    />
                  </div>
                )}
              </>
            )}

            <h2 style={{
              fontFamily:   "Cormorant Garamond, serif",
              fontWeight:   700,
              fontSize:     "clamp(1.5rem, 4vw, 2rem)",
              color:        "#fff",
              lineHeight:   1.15,
              marginBottom: "0.75rem",
              letterSpacing:"-0.01em",
            }}>
              {game.nextGame ? `Meet ${game.nextGame.character} →` : "Journey continues →"}
            </h2>

            <p style={{
              fontFamily:   "Cormorant Garamond, serif",
              fontStyle:    "italic",
              fontSize:     "1rem",
              color:        "rgba(240,238,255,0.6)",
              lineHeight:   1.65,
              marginBottom: "2rem",
            }}>
              &ldquo;{game.nextGame?.teaserLine ?? "The next chapter is waiting."}&rdquo;
            </p>

            {/* XP earned this session */}
            <div style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          "0.4rem",
              background:   "rgba(0,212,240,0.08)",
              border:       "1px solid rgba(0,212,240,0.22)",
              borderRadius: "100px",
              padding:      "0.28rem 0.9rem",
              marginBottom: "1.5rem",
            }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.85rem", color: "var(--cyan)" }}>
                +{totalXp} XP earned
              </span>
            </div>

            <div>
              <button
                onClick={handleNext}
                style={{
                  fontFamily:   "Inter, sans-serif",
                  fontWeight:   800,
                  fontSize:     "1rem",
                  color:        "#08060f",
                  background:   "linear-gradient(90deg, #00d4f0, #e040fb)",
                  padding:      "1rem 3rem",
                  borderRadius: "100px",
                  border:       "none",
                  cursor:       "pointer",
                  boxShadow:    "0 0 40px rgba(0,212,240,0.3)",
                  transition:   "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 56px rgba(0,212,240,0.45)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 0 40px rgba(0,212,240,0.3)" }}
              >
                Complete Game →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ——— BOSS ARENA (5-punch battle — replaces SceneRenderer for boss scenes) ——— */}
      {state === "playing" && currentScene?.type === "boss" && (dialogueDone || !currentScene?.dialogue?.length) && (
        <BossArena
          scene={currentScene}
          onComplete={handleBossComplete}
          maestroImage={game.maestroImage}
          accentColor={game.accentColor}
          onPlayCorrect={sound.playCorrect}
          onPlayWrong={sound.playWrong}
          onPlayFireworks={sound.playFireworks}
        />
      )}

      {/* ——— PROMPT CHALLENGE ——— */}
      {state === "playing" && currentScene?.type === "prompt" && (
        <PromptChallenge
          scene={currentScene}
          onComplete={(xp) => {
            setTotalXp(prev => prev + xp)
            setShowXpBurst(true)
            setBurstKey(k => k + 1)
            setTimeout(() => setShowXpBurst(false), 1500)
            sound.playFireworks()
            if (sceneIndex + 1 >= totalScenes) {
              setState("complete")
            } else {
              sound.playTransition()
              setSceneIndex(i => i + 1)
              setSelectedLabel(null)
              setLastXp(0)
              setState("playing")
            }
          }}
        />
      )}

      {/* ——— SCENE BACKGROUND (behind quiz/scenario content) ——— */}
      {(state === "playing" || state === "answered") && currentScene?.type !== "prompt" && currentScene?.type !== "handoff" && !currentScene?.dialogue?.length && sceneBgImage && (
        <>
          {/* Real anime-style background image */}
          <div style={{
            position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
            backgroundImage:    `url(${sceneBgImage})`,
            backgroundSize:     "cover",
            backgroundPosition: "center center",
          }} />
          {/* Dark overlay so text stays readable */}
          <div style={{
            position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
            background: currentScene?.type === "revelation"
              ? "rgba(6,4,14,0.82)"
              : "rgba(6,4,14,0.72)",
          }} />
        </>
      )}
      {/* SceneEnvironment kept for prompt-type scenes that opt in explicitly */}

      {/* ——— GAME CONTENT (not used for boss, prompt, or handoff — those have dedicated components) ——— */}
      {state !== "intro" && currentScene?.type !== "prompt" && currentScene?.type !== "boss" && currentScene?.type !== "handoff" && (
        <div style={{ height: "100vh", overflow: currentScene?.type === "revelation" || currentScene?.type === "learn" || currentScene?.type === "ai-compare" ? "auto" : "hidden", position: "relative", zIndex: 10 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={sceneIndex}
              variants={isBoss ? bossVariants : regularVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={isBoss ? bossTransition : regularTransition}
              style={{ maxWidth: "680px", margin: "0 auto", padding: "4.2rem 1.5rem 0" }}
            >
              {/* Scene label row */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                {isBoss ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "rgba(224,64,251,0.1)", border: "1px solid rgba(224,64,251,0.25)", borderRadius: "100px", padding: "0.3rem 0.9rem 0.3rem 0.5rem" }}>
                    <GameIcon name="baton" size={22} />
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--pink)" }}>Conductor Test</span>
                  </div>
                ) : currentScene.type === "revelation" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "rgba(0,212,240,0.08)", border: "1px solid rgba(0,212,240,0.2)", borderRadius: "100px", padding: "0.3rem 0.9rem 0.3rem 0.5rem" }}>
                    <GameIcon name="musicNotes" size={22} />
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--cyan)" }}>Revelation</span>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        {game.scenes.map((_, i) => (
                          <div key={i} style={{ height: "4px", width: i === sceneIndex ? "20px" : "8px", borderRadius: "2px", background: i < sceneIndex ? "rgba(0,212,240,0.6)" : i === sceneIndex ? "var(--cyan)" : "rgba(255,255,255,0.12)", transition: "all 0.4s ease" }} />
                        ))}
                      </div>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>
                        Scene {sceneIndex + 1}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <SceneRenderer
                scene={currentScene}
                answered={state === "answered"}
                selectedLabel={selectedLabel}
                onAnswer={handleAnswer}
                onNext={handleNext}
                streakCount={streakCount}
                playFireworks={sound.playFireworks}
                aiElaboration={aiElaboration}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
