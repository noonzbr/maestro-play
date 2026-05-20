"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function ParticleField({ count = 800, scroll = 0 }: { count?: number; scroll?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const r = 12
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      speeds[i] = 0.3 + Math.random() * 0.7
    }

    return { positions, speeds }
  }, [count])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.getElapsedTime()
    const material = pointsRef.current.material as THREE.PointsMaterial
    material.opacity = 0.4 + Math.sin(t * 0.5) * 0.15
    pointsRef.current.rotation.y = t * 0.02
    pointsRef.current.rotation.x = Math.sin(t * 0.05) * 0.1

    // Scatter on scroll
    const scatter = 1 + scroll * 0.001
    pointsRef.current.scale.set(scatter, scatter, scatter)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#00d4f0"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
