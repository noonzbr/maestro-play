"use client"

import { Suspense, useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"
import ParticleField from "./ParticleField"
import BatonStream from "./BatonStream"
import PostProcessing from "./PostProcessing"

function BackgroundNebula() {
  const meshRef = useRef<THREE.Mesh>(null)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#08060f") },
      uColorB: { value: new THREE.Color("#0d0b14") },
      uCyan: { value: new THREE.Color("#00d4f0") },
      uPurple: { value: new THREE.Color("#7b2fbe") },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uCyan;
      uniform vec3 uPurple;
      varying vec2 vUv;

      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(noise(i), noise(i + vec2(1,0)), f.x),
          mix(noise(i + vec2(0,1)), noise(i + vec2(1,1)), f.x),
          f.y
        );
      }

      void main() {
        vec2 uv = vUv - 0.5;
        float t = uTime * 0.08;

        float n1 = smoothNoise(uv * 3.0 + t);
        float n2 = smoothNoise(uv * 5.0 - t * 0.7);
        float n = n1 * 0.6 + n2 * 0.4;

        float dist = length(uv);
        float haze = smoothstep(0.8, 0.0, dist) * 0.12;

        vec3 col = mix(uColorA, uColorB, n);
        col = mix(col, uCyan, haze * n1 * 0.3);
        col = mix(col, uPurple, haze * n2 * 0.2);

        gl_FragColor = vec4(col, 1.0);
      }
    `,
    depthWrite: false,
  })

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -8]}>
      <planeGeometry args={[30, 20]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

function Conductor() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1
  })

  return (
    <group ref={groupRef} position={[-1, -0.5, 0]}>
      {/* Conductor body silhouette — stylized shapes */}
      <mesh position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.18, 0.7, 8, 16]} />
        <meshStandardMaterial color="#1a1025" emissive="#2d1a4a" emissiveIntensity={0.5} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#1a1025" emissive="#2d1a4a" emissiveIntensity={0.3} />
      </mesh>
      {/* Outstretched arm + baton */}
      <mesh position={[0.6, 0.9, 0]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.04, 0.55, 4, 8]} />
        <meshStandardMaterial color="#1a1025" emissive="#3d2060" emissiveIntensity={0.4} />
      </mesh>
      {/* Baton */}
      <mesh position={[1.0, 0.55, 0]} rotation={[0, 0, 0.8]}>
        <cylinderGeometry args={[0.012, 0.02, 0.6, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
      </mesh>
      {/* Baton tip glow */}
      <pointLight position={[1.25, 0.3, 0]} color="#00d4f0" intensity={4} distance={3} />
    </group>
  )
}

function CameraRig({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  useFrame(({ camera }) => {
    camera.position.x += (mouse.current.x * 0.8 - camera.position.x) * 0.05
    camera.position.y += (-mouse.current.y * 0.5 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function HeroScene() {
  const mouse = useRef({ x: 0, y: 0 })
  const [scroll, setScroll] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onScroll = () => setScroll(window.scrollY)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("scroll", onScroll)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  if (!mounted) return null

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#08060f"]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} color="#7b2fbe" intensity={2} />

      <Suspense fallback={null}>
        <BackgroundNebula />
        <ParticleField count={800} scroll={scroll} />
        <BatonStream count={200} />
        <Conductor />
        <CameraRig mouse={mouse} />
        <PostProcessing />
      </Suspense>
    </Canvas>
  )
}
