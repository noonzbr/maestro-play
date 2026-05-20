"use client"

import { useRef, useCallback, useEffect } from "react"

export type SoundMood = "normal" | "boss" | "revelation"

export function useSoundEngine() {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const schedulerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const runningRef = useRef(false)
  const moodRef = useRef<SoundMood>("normal")

  function getCtx(): AudioContext {
    if (!ctxRef.current) ctxRef.current = new AudioContext()
    if (ctxRef.current.state === "suspended") ctxRef.current.resume()
    return ctxRef.current
  }

  function tone(
    ctx: AudioContext,
    dest: AudioNode,
    freq: number,
    start: number,
    dur: number,
    vol: number,
    type: OscillatorType = "sine"
  ) {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, start)
    g.gain.setValueAtTime(0, start)
    g.gain.linearRampToValueAtTime(vol, start + Math.min(0.025, dur * 0.15))
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
    osc.connect(g)
    g.connect(dest)
    osc.start(start)
    osc.stop(start + dur + 0.02)
  }

  const playCorrect = useCallback(() => {
    try {
      const ctx = getCtx()
      const t = ctx.currentTime
      // Rising C major guitar arpeggio
      ;[261.63, 329.63, 392.0, 523.25].forEach((f, i) =>
        tone(ctx, ctx.destination, f, t + i * 0.09, 0.55, 0.2)
      )
      // Warm chord sustain underneath
      ;[261.63, 392.0, 523.25].forEach(f =>
        tone(ctx, ctx.destination, f, t + 0.28, 1.0, 0.07)
      )
    } catch { /* no AudioContext */ }
  }, [])

  const playWrong = useCallback(() => {
    try {
      const ctx = getCtx()
      const t = ctx.currentTime
      // Tritone (the most dissonant interval in Western music)
      tone(ctx, ctx.destination, 246.94, t, 0.4, 0.16, "sawtooth") // B3
      tone(ctx, ctx.destination, 349.23, t, 0.4, 0.14, "sawtooth") // F4
      // Descending pitch glide — the "sad slide"
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(290, t)
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.45)
      g.gain.setValueAtTime(0.12, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45)
      osc.connect(g)
      g.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.5)
    } catch { /* no AudioContext */ }
  }, [])

  const playXP = useCallback(() => {
    try {
      const ctx = getCtx()
      const t = ctx.currentTime
      // Sparkly high arpeggio
      ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        tone(ctx, ctx.destination, f, t + i * 0.065, 0.3, 0.1)
      )
    } catch { /* no AudioContext */ }
  }, [])

  const playClick = useCallback(() => {
    try {
      const ctx = getCtx()
      tone(ctx, ctx.destination, 660, ctx.currentTime, 0.1, 0.09, "triangle")
    } catch { /* no AudioContext */ }
  }, [])

  const playTransition = useCallback(() => {
    try {
      const ctx = getCtx()
      const t = ctx.currentTime
      // Soft filtered noise whoosh
      const bufLen = Math.floor(ctx.sampleRate * 0.35)
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufLen)
      const src = ctx.createBufferSource()
      src.buffer = buf
      const bpf = ctx.createBiquadFilter()
      bpf.type = "bandpass"
      bpf.frequency.setValueAtTime(1400, t)
      bpf.Q.setValueAtTime(0.4, t)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.055, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
      src.connect(bpf)
      bpf.connect(g)
      g.connect(ctx.destination)
      src.start(t)
      // Single clean note after the whoosh
      tone(ctx, ctx.destination, 440, t + 0.06, 0.5, 0.08)
    } catch { /* no AudioContext */ }
  }, [])

  const playRevelation = useCallback(() => {
    try {
      const ctx = getCtx()
      const t = ctx.currentTime
      // Rich orchestral C major chord swell — the Maestro moment
      const voices: Array<{ f: number; type: OscillatorType; v: number }> = [
        { f: 130.81, type: "sawtooth", v: 0.055 }, // C3
        { f: 196.0,  type: "sawtooth", v: 0.045 }, // G3
        { f: 261.63, type: "sine",     v: 0.075 }, // C4
        { f: 329.63, type: "sine",     v: 0.065 }, // E4
        { f: 392.0,  type: "sine",     v: 0.055 }, // G4
        { f: 523.25, type: "sine",     v: 0.045 }, // C5
      ]
      voices.forEach(({ f, type, v }) => {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = type
        osc.frequency.setValueAtTime(f, t)
        g.gain.setValueAtTime(0, t)
        g.gain.linearRampToValueAtTime(v, t + 0.9)
        g.gain.setValueAtTime(v, t + 3.0)
        g.gain.exponentialRampToValueAtTime(0.0001, t + 5.5)
        osc.connect(g)
        g.connect(ctx.destination)
        osc.start(t)
        osc.stop(t + 6)
      })
      // High shimmer harmonics
      tone(ctx, ctx.destination, 1046.5, t + 0.4, 3.5, 0.035)
      tone(ctx, ctx.destination, 1318.5, t + 0.7, 3.0, 0.025)
    } catch { /* no AudioContext */ }
  }, [])

  const playStreak = useCallback(() => {
    try {
      const ctx = getCtx()
      const t = ctx.currentTime
      // Celebratory triplet — C D E
      ;[523.25, 587.33, 659.25].forEach((f, i) =>
        tone(ctx, ctx.destination, f, t + i * 0.065, 0.25, 0.13, "triangle")
      )
    } catch { /* no AudioContext */ }
  }, [])

  const stopAmbient = useCallback(() => {
    runningRef.current = false
    if (schedulerRef.current) {
      clearTimeout(schedulerRef.current)
      schedulerRef.current = null
    }
    if (masterRef.current && ctxRef.current) {
      const now = ctxRef.current.currentTime
      try {
        masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, now)
        masterRef.current.gain.linearRampToValueAtTime(0, now + 1.5)
      } catch { /* node already disconnected */ }
    }
  }, [])

  const startAmbient = useCallback((mood: SoundMood = "normal") => {
    try {
      stopAmbient()
      const ctx = getCtx()
      moodRef.current = mood

      const master = ctx.createGain()
      master.gain.setValueAtTime(0, ctx.currentTime)
      master.gain.linearRampToValueAtTime(mood === "boss" ? 0.09 : 0.055, ctx.currentTime + 2.5)
      masterRef.current = master

      const lpf = ctx.createBiquadFilter()
      lpf.type = "lowpass"
      lpf.frequency.setValueAtTime(
        mood === "revelation" ? 1600 : mood === "boss" ? 700 : 900,
        ctx.currentTime
      )
      lpf.connect(master)
      master.connect(ctx.destination)

      // Scale selection — each tells a different emotional story
      const normalNotes  = [220, 261.63, 293.66, 329.63, 392.0]  // Am pentatonic — hopeful mystery
      const bossNotes    = [146.83, 174.61, 220.0, 261.63, 311.13] // Dm minor — tension
      const revealNotes  = [110, 164.81, 246.94, 329.63]           // Am suspended — transcendence
      const notes = mood === "boss" ? bossNotes : mood === "revelation" ? revealNotes : normalNotes
      const tempo = mood === "boss" ? 0.4 : mood === "revelation" ? 1.1 : 0.62

      let step = 0
      let nextTime = ctx.currentTime + 0.1
      runningRef.current = true

      function schedule() {
        if (!runningRef.current) return
        const now = ctx.currentTime
        while (nextTime < now + 0.6) {
          const freq = notes[step % notes.length]
          const osc = ctx.createOscillator()
          const g = ctx.createGain()
          osc.type = "sine"
          osc.frequency.setValueAtTime(freq, nextTime)
          g.gain.setValueAtTime(0, nextTime)
          g.gain.linearRampToValueAtTime(0.75, nextTime + 0.05)
          g.gain.exponentialRampToValueAtTime(0.0001, nextTime + tempo * 1.9)
          osc.connect(g)
          g.connect(lpf)
          osc.start(nextTime)
          osc.stop(nextTime + tempo * 2)
          step++
          nextTime += tempo
        }
        schedulerRef.current = setTimeout(schedule, 30)
      }
      schedule()
    } catch { /* no AudioContext */ }
  }, [stopAmbient])

  const setMood = useCallback((mood: SoundMood) => {
    if (moodRef.current !== mood && runningRef.current) {
      startAmbient(mood)
    }
  }, [startAmbient])

  useEffect(() => {
    return () => {
      stopAmbient()
      ctxRef.current?.close()
    }
  }, [stopAmbient])

  return {
    playCorrect,
    playWrong,
    playXP,
    playClick,
    playTransition,
    playRevelation,
    playStreak,
    startAmbient,
    stopAmbient,
    setMood,
  }
}
