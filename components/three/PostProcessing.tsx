"use client"

import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import * as THREE from "three"

export default function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        threshold={0.2}
        intensity={1.4}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.002, 0.002)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette
        eskil={false}
        offset={0.15}
        darkness={0.7}
      />
    </EffectComposer>
  )
}
