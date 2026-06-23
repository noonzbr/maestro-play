"use client"

import { useRef, useCallback, useEffect } from "react"

export type SoundMood = "normal" | "boss" | "revelation" | "cinematic"

export function useSoundEngine() {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const schedulerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const runningRef = useRef(false)
  const moodRef = useRef<SoundMood>("normal")

  const streakRef = useRef(0)
  const livesRef = useRef(3)
  const sequencerTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const updateGameState = useCallback((streak: number, livesVal: number) => {
    streakRef.current = streak
    livesRef.current = livesVal
  }, [])

  // MP3 track refs
  const trackRef = useRef<HTMLAudioElement | null>(null)
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const normalTrackRef = useRef<string>("/audio/concrete-riot.mp3")
  const mutedRef = useRef(false)

  const getTrack = (mood: SoundMood): string => {
    if (mood === "normal" || mood === "boss") return normalTrackRef.current
    if (mood === "cinematic" || mood === "revelation") return "/audio/sparks-of-vienna.mp3"
    return "/audio/concrete-riot.mp3"
  }

  const setNormalTrack = useCallback((url: string) => {
    normalTrackRef.current = url
  }, [])

  function getCtx(): AudioContext {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new AudioContext()
    }
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

  const playFireworks = useCallback(() => {
    try {
      const ctx = getCtx()
      const t = ctx.currentTime
      // Percussive pop bursts at staggered times
      ;[0, 0.18, 0.42, 0.72, 1.05].forEach(delay => {
        const bufLen = Math.floor(ctx.sampleRate * 0.09)
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
        const d = buf.getChannelData(0)
        for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufLen)
        const src = ctx.createBufferSource()
        src.buffer = buf
        const hpf = ctx.createBiquadFilter()
        hpf.type = "highpass"
        hpf.frequency.setValueAtTime(900, t + delay)
        const g = ctx.createGain()
        g.gain.setValueAtTime(0.28, t + delay)
        g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.09)
        src.connect(hpf); hpf.connect(g); g.connect(ctx.destination)
        src.start(t + delay)
      })
      // Triumphant ascending arpeggio
      ;[523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) =>
        tone(ctx, ctx.destination, f, t + i * 0.075, 0.45, 0.13, "triangle")
      )
      // Final sustain chord
      ;[523.25, 659.25, 783.99, 1046.5].forEach(f =>
        tone(ctx, ctx.destination, f, t + 0.55, 1.8, 0.07)
      )
    } catch { /* no AudioContext */ }
  }, [])

  const playClick = useCallback(() => {
    try {
      const ctx = getCtx()
      tone(ctx, ctx.destination, 660, ctx.currentTime, 0.1, 0.09, "triangle")
    } catch { /* no AudioContext */ }
  }, [])

  const playHover = useCallback(() => {
    try {
      const ctx = getCtx()
      tone(ctx, ctx.destination, 880, ctx.currentTime, 0.04, 0.015, "sine")
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

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current
    if (trackRef.current) trackRef.current.muted = mutedRef.current
    return mutedRef.current
  }, [])

  const startSequencer = useCallback(() => {
    if (sequencerTimerRef.current) return
    let step = 0
    sequencerTimerRef.current = setInterval(() => {
      try {
        const ctx = getCtx()
        if (ctx.state === "suspended") return
        const t = ctx.currentTime

        const streak = streakRef.current
        const livesVal = livesRef.current

        // 1. Tension Heartbeat - low lives (plays every 4 steps)
        if (livesVal === 1 && step % 4 === 0) {
          const osc = ctx.createOscillator()
          const g = ctx.createGain()
          osc.frequency.setValueAtTime(55, t)
          osc.frequency.exponentialRampToValueAtTime(30, t + 0.12)
          g.gain.setValueAtTime(0.08, t)
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
          osc.connect(g)
          g.connect(ctx.destination)
          osc.start(t)
          osc.stop(t + 0.15)
        }

        // 2. Stem 1: Chord Pad (Ambient block, plays at step 0 and 8)
        if (step % 8 === 0) {
          const freqs = step % 16 === 0 
            ? [261.63, 329.63, 392.00] // C major chord
            : [220.00, 261.63, 329.63] // A minor chord
          
          freqs.forEach(f => {
            const osc = ctx.createOscillator()
            const g = ctx.createGain()
            osc.type = "sine"
            osc.frequency.setValueAtTime(f, t)
            g.gain.setValueAtTime(0, t)
            g.gain.linearRampToValueAtTime(0.02, t + 0.4) // soft attack
            g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4) // release
            osc.connect(g)
            g.connect(ctx.destination)
            osc.start(t)
            osc.stop(t + 1.5)
          })
        }

        // 3. Stem 2: Bassline (Triangle pulses, plays eighth notes when streak >= 1)
        if (streak >= 1 && step % 2 === 0) {
          const isFirstBar = step < 8
          const rootFreq = isFirstBar ? 130.81 : 110.00 // C3 or A2
          const notes = [rootFreq, rootFreq * 1.5, rootFreq * 1.2, rootFreq * 0.8]
          const f = notes[(step / 2) % 4]

          const osc = ctx.createOscillator()
          const g = ctx.createGain()
          osc.type = "triangle"
          osc.frequency.setValueAtTime(f, t)
          g.gain.setValueAtTime(0.02, t)
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15)
          osc.connect(g)
          g.connect(ctx.destination)
          osc.start(t)
          osc.stop(t + 0.18)
        }

        // 4. Stem 3: Lead Arpeggiator (High sparkling sine notes, 16th notes when streak >= 3)
        if (streak >= 3) {
          const isFirstBar = step < 8
          const chord = isFirstBar 
            ? [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
            : [440.00, 523.25, 659.25, 880.00] // A4, C5, E5, A5
          const f = chord[step % 4]

          const osc = ctx.createOscillator()
          const g = ctx.createGain()
          const filter = ctx.createBiquadFilter()

          osc.type = "sine"
          osc.frequency.setValueAtTime(f, t)

          filter.type = "lowpass"
          filter.frequency.setValueAtTime(1000, t)
          filter.frequency.exponentialRampToValueAtTime(250, t + 0.08)

          g.gain.setValueAtTime(0.008, t)
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08)

          osc.connect(filter)
          filter.connect(g)
          g.connect(ctx.destination)
          osc.start(t)
          osc.stop(t + 0.10)
        }

        step = (step + 1) % 16
      } catch { /* AudioContext suspended */ }
    }, 200)
  }, [])

  const stopAmbient = useCallback(() => {
    runningRef.current = false
    if (schedulerRef.current) { clearTimeout(schedulerRef.current); schedulerRef.current = null }
    if (fadeTimerRef.current) { clearInterval(fadeTimerRef.current); fadeTimerRef.current = null }
    if (sequencerTimerRef.current) { clearInterval(sequencerTimerRef.current); sequencerTimerRef.current = null }
    const track = trackRef.current
    if (!track) return
    // Fade out over 1.5s
    const step = track.volume / 30
    fadeTimerRef.current = setInterval(() => {
      if (track.volume > step) {
        track.volume = Math.max(0, track.volume - step)
      } else {
        track.volume = 0
        track.pause()
        if (fadeTimerRef.current) { clearInterval(fadeTimerRef.current); fadeTimerRef.current = null }
      }
    }, 50)
  }, [])

  const startAmbient = useCallback((mood: SoundMood = "normal", startAt = 0) => {
    try {
      moodRef.current = mood
      const src = getTrack(mood)
      const current = trackRef.current

      // If same file is already playing, don't restart
      if (current && !current.paused && current.src.endsWith(src.replace("/audio/", ""))) {
        startSequencer()
        return
      }

      // Fade out old track
      if (fadeTimerRef.current) { clearInterval(fadeTimerRef.current); fadeTimerRef.current = null }
      if (current && !current.paused) {
        const fadeOut = setInterval(() => {
          if (current.volume > 0.04) { current.volume -= 0.04 }
          else { current.pause(); current.volume = 0; clearInterval(fadeOut) }
        }, 50)
      }

      // Start new track
      const audio = new Audio(src)
      audio.loop = true
      audio.volume = 0
      trackRef.current = audio

      // Seek to startAt position once metadata is available
      if (startAt > 0) {
        audio.addEventListener("loadedmetadata", () => {
          audio.currentTime = startAt
        }, { once: true })
      }

      // Set background music volume to 25% (0.25) as requested
      const targetVol = 0.25
      const fadeInDuration = mood === "cinematic" ? 4000 : 2500
      const steps = fadeInDuration / 50

      audio.play().catch(() => {/* autoplay blocked */})
      fadeTimerRef.current = setInterval(() => {
        if (audio.volume < targetVol - targetVol / steps) {
          audio.volume = Math.min(targetVol, audio.volume + targetVol / steps)
        } else {
          audio.volume = targetVol
          if (fadeTimerRef.current) { clearInterval(fadeTimerRef.current); fadeTimerRef.current = null }
        }
      }, 50)

      startSequencer()
    } catch { /* no audio */ }
  }, [startSequencer])

  const setMood = useCallback((mood: SoundMood) => {
    if (moodRef.current !== mood) {
      startAmbient(mood)
    }
  }, [startAmbient])

  /** Smoothly scale the current track volume by `factor` (e.g. 0.5 = halve it) */
  const setGameVolume = useCallback((factor: number) => {
    const track = trackRef.current
    if (!track || track.paused) return
    const target = Math.max(0, track.volume * factor)
    const steps = 25
    const step = (track.volume - target) / steps
    let count = 0
    const timer = setInterval(() => {
      count++
      if (count < steps) {
        track.volume = Math.max(target, track.volume - step)
      } else {
        track.volume = target
        clearInterval(timer)
      }
    }, 50)
  }, [])

  /** Smoothly fade the current track to an absolute volume level (0–1) */
  const fadeVolumeTo = useCallback((target: number, durationMs = 2000) => {
    const track = trackRef.current
    if (!track || track.paused) return
    const clampedTarget = Math.min(1, Math.max(0, target))
    const steps = Math.round(durationMs / 50)
    const from = track.volume
    const step = (clampedTarget - from) / steps
    let count = 0
    const timer = setInterval(() => {
      count++
      if (count < steps) {
        track.volume = Math.min(1, Math.max(0, from + step * count))
      } else {
        track.volume = clampedTarget
        clearInterval(timer)
      }
    }, 50)
  }, [])

  useEffect(() => {
    return () => {
      stopAmbient()
      if (sequencerTimerRef.current) {
        clearInterval(sequencerTimerRef.current)
        sequencerTimerRef.current = null
      }
      if (trackRef.current) { trackRef.current.pause(); trackRef.current = null }
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        ctxRef.current.close()
      }
      ctxRef.current = null
    }
  }, [stopAmbient])

  return {
    playCorrect,
    playWrong,
    playXP,
    playClick,
    playHover,
    playTransition,
    playRevelation,
    playFireworks,
    playStreak,
    startAmbient,
    stopAmbient,
    setMood,
    setNormalTrack,
    setGameVolume,
    fadeVolumeTo,
    toggleMute,
    updateGameState,
  }
}
