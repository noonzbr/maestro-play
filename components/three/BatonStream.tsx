"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function BatonStream({ count = 200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, lifetimes, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const lifetimes = new Float32Array(count)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      lifetimes[i] = Math.random()
      const angle = (Math.random() - 0.5) * 0.8
      const speed = 0.02 + Math.random() * 0.04
      velocities[i * 3] = Math.cos(angle) * speed
      velocities[i * 3 + 1] = Math.sin(angle) * speed + 0.01
      velocities[i * 3 + 2] = (Math.random() - 0.5) * speed * 0.5
    }

    return { positions, lifetimes, velocities }
  }, [count])

  const colorsRef = useRef(new Float32Array(count * 3))
  const colors = colorsRef.current

  useFrame(({ clock }) => {
    if (!pointsRef.current) return

    const geo = pointsRef.current.geometry
    const posArr = geo.attributes.position.array as Float32Array
    const colArr = geo.attributes.color?.array as Float32Array | undefined

    if (!colArr) return

    for (let i = 0; i < count; i++) {
      lifetimes[i] += 0.008 * (0.5 + Math.random() * 0.5)

      if (lifetimes[i] > 1) {
        lifetimes[i] = 0
        posArr[i * 3] = 0.8 + (Math.random() - 0.5) * 0.1
        posArr[i * 3 + 1] = 0.3 + (Math.random() - 0.5) * 0.1
        posArr[i * 3 + 2] = 0
      } else {
        posArr[i * 3] += velocities[i * 3]
        posArr[i * 3 + 1] += velocities[i * 3 + 1]
        posArr[i * 3 + 2] += velocities[i * 3 + 2]
      }

      // Color: cyan → purple → pink along lifetime
      const t = lifetimes[i]
      if (t < 0.5) {
        const s = t * 2
        colArr[i * 3] = 0 + s * (0.48)
        colArr[i * 3 + 1] = 0.83 * (1 - s) + 0.18 * s
        colArr[i * 3 + 2] = 0.94 * (1 - s) + 0.75 * s
      } else {
        const s = (t - 0.5) * 2
        colArr[i * 3] = 0.48 + s * (0.88 - 0.48)
        colArr[i * 3 + 1] = 0.18 * (1 - s) + 0.25 * s
        colArr[i * 3 + 2] = 0.75 * (1 - s) + 0.98 * s
      }
    }

    geo.attributes.position.needsUpdate = true
    geo.attributes.color.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
