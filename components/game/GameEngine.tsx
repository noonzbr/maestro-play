"use client"

import { useState, useCallback, useEffect } from "react"
import { Game, Scene, Choice } from "@/lib/games/types"
import SceneRenderer from "./SceneRenderer"
import EndScreen from "./EndScreen"
import XPCounter from "./XPCounter"
import FloatingNotes from "./FloatingNotes"
import CinematicIntro from "./CinematicIntro"
import GameIcon from "./GameIcon"
import DialogueScene from "./DialogueScene"
import PromptChallenge from "./PromptChallenge"
import VideoIntro from "./VideoIntro"
import { useSoundEngine, SoundMood } from "./SoundEngine"

type Props = { game: Game }
type GameState = "video" | "story" | "intro" | "transitioning" | "playing" | "answered" | "complete"

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
        const dist = 80 + Math.random() * 120
        const color = i % 3 === 0 ? "#00d4f0" : i % 3 === 1 ? "#e040fb" : "#00ff80"
        const size = 4 + Math.random() * 6
        return (
          <div key={i} style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: `${size}px`,
            height: `${size}px`,
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
  const [sceneIndex, setSceneIndex] = useState(0)
  const [state, setState] = useState<GameState>("video")
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
  const [totalXp, setTotalXp] = useState(0)
  const [lastXp, setLastXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [streakCount, setStreakCount] = useState(0)
  const [showBurst, setShowBurst] = useState(false)
  const [showXpBurst, setShowXpBurst] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const [fadeIn, setFadeIn] = useState(false)
  const [dialogueDone, setDialogueDone] = useState(false)

  const sound = useSoundEngine()

  const currentScene = game.scenes[sceneIndex]
  const totalScenes = game.scenes.length
  const maxXp = game.scenes.reduce((sum, s) => sum + s.xpAward, 0)

  const currentMood: SoundMood =
    currentScene?.type === "boss" ? "boss" :
    currentScene?.type === "revelation" ? "revelation" : "normal"

  // Keyframe injection
  useEffect(() => {
    const id = "maestro-keyframes"
    if (document.getElementById(id)) return
    const style = document.createElement("style")
    style.id = id
    style.textContent = `
      @keyframes xp-burst {
        0%   { opacity:0; transform:translateY(0) scale(0.5); }
        20%  { opacity:1; transform:translateY(-8px) scale(1.2); }
        80%  { opacity:1; transform:translateY(-32px) scale(1); }
        100% { opacity:0; transform:translateY(-56px) scale(0.8); }
      }
      @keyframes scene-fade-in {
        from { opacity:0; transform:translateY(16px); }
        to   { opacity:1; transform:translateY(0); }
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
    `
    document.head.appendChild(style)
  }, [])

  // Set per-game audio track once on mount
  useEffect(() => {
    if (game.audioTrack) sound.setNormalTrack(game.audioTrack)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Mood & revelation sound when scene starts
  useEffect(() => {
    if (state !== "playing") return
    if (currentScene?.type === "revelation") {
      sound.startAmbient("revelation", 60)  // Sparks of Vienna from 1-min mark
      sound.playRevelation()
    } else if (currentScene?.type === "boss") {
      sound.setMood("boss")
    } else {
      sound.setMood("normal")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneIndex, state])

  // Swell music back up on EndScreen to match the opening cinematic feel
  useEffect(() => {
    if (state === "complete") sound.fadeVolumeTo(0.55, 2500)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  // Reset dialogue when moving to a new scene
  useEffect(() => {
    setDialogueDone(false)
  }, [sceneIndex])

  const handleAnswer = useCallback((choice: Choice) => {
    if (state !== "playing") return
    setSelectedLabel(choice.label)
    setState("answered")

    const xpEarned = choice.correct ? currentScene.xpAward : Math.floor(currentScene.xpAward * 0.1)
    setLastXp(xpEarned)
    setTotalXp(prev => prev + xpEarned)

    if (choice.correct) {
      sound.playCorrect()
      setTimeout(() => sound.playXP(), 380)
      const newStreak = streakCount + 1
      setStreakCount(newStreak)
      setStreak(prev => Math.max(prev, newStreak))
      if (newStreak >= 2) setTimeout(() => sound.playStreak(), 620)
      setShowBurst(true)
      setTimeout(() => setShowBurst(false), 1200)
    } else {
      sound.playWrong()
      setStreakCount(0)
    }

    setShowXpBurst(true)
    setBurstKey(k => k + 1)
    setTimeout(() => setShowXpBurst(false), 1500)
  }, [state, currentScene, streakCount, sound])

  const handleNext = useCallback(() => {
    sound.playClick()

    // Award XP immediately for passive scenes (revelation, learn)
    if (currentScene.type === "revelation" || currentScene.type === "learn") {
      if (currentScene.xpAward > 0) {
        setTotalXp(prev => prev + currentScene.xpAward)
        setLastXp(currentScene.xpAward)
        setShowXpBurst(true)
        setBurstKey(k => k + 1)
        setTimeout(() => setShowXpBurst(false), 1500)
      }
    }

    if (sceneIndex + 1 >= totalScenes) {
      setState("complete")  // volume handled by useEffect
      return
    }

    sound.playTransition()
    setState("transitioning")
    setFadeIn(false)
    setTimeout(() => {
      setSceneIndex(i => i + 1)
      setSelectedLabel(null)
      setLastXp(0)
      setState("playing")
      setFadeIn(true)
    }, 320)
  }, [sceneIndex, totalScenes, currentScene, sound])

  const handleStart = () => {
    sound.playClick()
    // Switch to normal (Concrete Riot) — already at 50% from video exit
    sound.startAmbient("normal")
    setState("transitioning")
    setTimeout(() => {
      setState("playing")
      setFadeIn(true)
    }, 400)
  }

  if (state === "video") {
    return (
      <VideoIntro
        onComplete={() => {
          sound.setGameVolume(0.5)
          setState("story")
        }}
        startMusic={() => sound.startAmbient("cinematic", 52)}
        gameTitle={game.title}
        gameEmoji={game.emoji}
        accentColor={game.accentColor}
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
  const isBoss = currentScene?.type === "boss"

  return (
    <div style={{ height: "100vh", background: "var(--bg-primary)", position: "relative", overflow: "hidden" }}>

      {/* Floating musical notes — always present */}
      <FloatingNotes mood={currentMood} />

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

      {/* Particle burst on correct */}
      {showBurst && <CorrectBurst />}
      {showXpBurst && <XPBurst xp={lastXp} key={String(burstKey)} />}

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", background: "rgba(255,255,255,0.06)", zIndex: 50 }}>
        <div style={{ height: "100%", width: `${progressPct}%`, background: isBoss ? "linear-gradient(90deg,#e040fb,#7b2fbe)" : "linear-gradient(90deg,#00d4f0,#e040fb)", transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>

      {/* Top bar */}
      <div style={{ position: "fixed", top: "3px", left: 0, right: 0, padding: "0.875rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,6,15,0.75)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <GameIcon name="guitar" size={28} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {state !== "intro" && (
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "var(--muted)" }}>
              {sceneIndex + 1} / {totalScenes}
            </span>
          )}
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
      {state === "intro" && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 2rem 2rem", animation: "scene-fade-in 0.7s ease both" }}>
          <div style={{ maxWidth: "560px", width: "100%", textAlign: "center" }}>
            <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center", animation: "maestro-pulse 3s ease-in-out infinite" }}>
              <GameIcon name="guitar" size={88} />
            </div>
            <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "0.75rem" }}>
              Game {game.week} · {game.duration}
            </div>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem, 6vw, 3rem)", color: "#fff", lineHeight: 1.1, marginBottom: "1rem" }}>
              {game.title}
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "1rem" }}>
              {game.description}
            </p>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1.15rem", color: "rgba(240,238,255,0.6)", marginBottom: "2.5rem" }}>
              &ldquo;{game.tagline}&rdquo;
            </p>

            {/* Scene preview pills */}
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "2.5rem", flexWrap: "wrap" }}>
              {game.scenes.map((_, i) => (
                <div key={i} style={{ width: "28px", height: "5px", borderRadius: "3px", background: "rgba(255,255,255,0.12)" }} />
              ))}
            </div>

            <button
              onClick={handleStart}
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)", padding: "0.95rem 3rem", borderRadius: "100px", border: "none", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 0 0 rgba(0,212,240,0)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 32px rgba(0,212,240,0.3)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "" }}
            >
              Begin →
            </button>

            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "var(--muted)", marginTop: "1.25rem" }}>
              {game.scenes.length} scenes · {game.free ? "Free" : `$${game.price?.toFixed(2)}`} · Earn up to {maxXp} XP
            </p>
          </div>
        </div>
      )}

      {/* ——— DIALOGUE OVERLAY ——— */}
      {state === "playing" && currentScene?.dialogue?.length && !dialogueDone && currentScene.type !== "prompt" && (
        <DialogueScene
          scene={currentScene}
          onComplete={() => setDialogueDone(true)}
        />
      )}

      {/* ——— PROMPT CHALLENGE OVERLAY ——— */}
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
              setState("transitioning")
              setFadeIn(false)
              setTimeout(() => {
                setSceneIndex(i => i + 1)
                setSelectedLabel(null)
                setLastXp(0)
                setState("playing")
                setFadeIn(true)
              }, 320)
            }
          }}
        />
      )}

      {/* ——— GAME CONTENT ——— */}
      {state !== "intro" && currentScene?.type !== "prompt" && (
        <div style={{
          height: "100vh",
          overflow: "hidden",
          position: "relative",
          zIndex: 10,
        }}>
        <div style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "4.2rem 1.5rem 0",
          opacity: state === "transitioning" ? 0 : 1,
          transform: state === "transitioning" ? "translateY(12px)" : "translateY(0)",
          transition: "opacity 0.32s ease, transform 0.32s ease",
          animation: fadeIn ? "scene-fade-in 0.5s cubic-bezier(0.16,1,0.3,1) both" : "none",
        }}>

          {/* Scene label */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
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
          />
        </div>
        </div>
      )}
    </div>
  )
}
