"use client"

import { useState, useCallback } from "react"
import { Game, Scene, Choice } from "@/lib/games/types"
import SceneRenderer from "./SceneRenderer"
import EndScreen from "./EndScreen"
import XPCounter from "./XPCounter"

type Props = {
  game: Game
}

type GameState = "playing" | "answered" | "complete"

export default function GameEngine({ game }: Props) {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [state, setState] = useState<GameState>("playing")
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
  const [totalXp, setTotalXp] = useState(0)
  const [lastXp, setLastXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [streakCount, setStreakCount] = useState(0)

  const currentScene = game.scenes[sceneIndex]
  const totalScenes = game.scenes.length
  const maxXp = game.scenes.reduce((sum, s) => sum + s.xpAward, 0)

  const handleAnswer = useCallback((choice: Choice) => {
    if (state !== "playing") return
    setSelectedLabel(choice.label)
    setState("answered")

    const xpEarned = choice.correct ? currentScene.xpAward : Math.floor(currentScene.xpAward * 0.1)
    setLastXp(xpEarned)
    setTotalXp((prev) => prev + xpEarned)

    if (choice.correct) {
      setStreakCount((prev) => prev + 1)
      setStreak((prev) => Math.max(prev, streakCount + 1))
    } else {
      setStreakCount(0)
    }
  }, [state, currentScene, streakCount])

  const handleNext = useCallback(() => {
    if (currentScene.type === "revelation") {
      setTotalXp((prev) => prev + currentScene.xpAward)
      setLastXp(currentScene.xpAward)
    }

    if (sceneIndex + 1 >= totalScenes) {
      setState("complete")
    } else {
      setSceneIndex((i) => i + 1)
      setState("playing")
      setSelectedLabel(null)
      setLastXp(0)
    }
  }, [sceneIndex, totalScenes, currentScene])

  if (state === "complete") {
    return <EndScreen game={game} totalXp={totalXp} streak={streak} />
  }

  const progressPct = ((sceneIndex) / totalScenes) * 100

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Particle field bg */}
      <div style={{
        position: "fixed",
        inset: 0,
        background: "radial-gradient(ellipse at 20% 50%, rgba(0,212,240,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(123,47,190,0.06) 0%, transparent 50%)",
        pointerEvents: "none",
      }} />

      {/* Progress bar */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "rgba(255,255,255,0.06)",
        zIndex: 50,
      }}>
        <div style={{
          height: "100%",
          width: `${progressPct}%`,
          background: "linear-gradient(90deg,#00d4f0,#e040fb)",
          transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </div>

      {/* Top bar */}
      <div style={{
        position: "fixed",
        top: "3px",
        left: 0,
        right: 0,
        padding: "0.875rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(8,6,15,0.7)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        zIndex: 50,
      }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>
          {game.emoji} {game.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "var(--muted)" }}>
            {sceneIndex + 1} / {totalScenes}
          </span>
          <div style={{ width: "140px" }}>
            <XPCounter xp={totalXp} maxXp={maxXp} newXp={lastXp} />
          </div>
          {streakCount >= 2 && (
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "var(--pink)" }}>
              {streakCount}🔥
            </span>
          )}
        </div>
      </div>

      {/* Game content */}
      <div style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "6rem 2rem 4rem",
        position: "relative",
        zIndex: 10,
      }}>
        {/* Scene type label */}
        <div className="label-caps" style={{ marginBottom: "1.5rem", color: "var(--cyan)" }}>
          {currentScene.type === "revelation" ? "Revelation" : currentScene.type === "boss" ? "⚡ Conductor Test" : `Scene ${sceneIndex + 1}`}
        </div>

        <SceneRenderer
          scene={currentScene}
          answered={state === "answered"}
          selectedLabel={selectedLabel}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      </div>
    </div>
  )
}
