"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useThree, useLoader, useFrame } from "@react-three/fiber";

const coverUVGlsl = `vec2 coverUV(vec2 uv, float imgA, float viewA) { vec2 scale = viewA > imgA ? vec2(1.0, imgA / viewA) : vec2(viewA / imgA, 1.0); return (uv - 0.5) * scale + 0.5; }`;
const bgVert = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const bgFrag = `${coverUVGlsl} uniform sampler2D uBackground; uniform float uBgAspect; uniform float uViewportAspect; varying vec2 vUv; void main() { gl_FragColor = texture2D(uBackground, coverUV(vUv, uBgAspect, uViewportAspect)); }`;

interface BgSceneProps {
  onReady?: () => void;
}

export default function BgScene({ onReady }: BgSceneProps) {
  const { viewport, size } = useThree();
  const [bgTex] = useLoader(THREE.TextureLoader, ["/Assets/Images/bg.webp"]);
  const frameCount = useRef(0);

  const uniforms = useMemo(
    () => ({
      uBackground: { value: bgTex },
      uBgAspect: {
        value: bgTex?.image ? bgTex.image.width / bgTex.image.height : 1,
      },
      uViewportAspect: { value: size.width / size.height },
    }),
    [bgTex, size.width, size.height],
  );

  useFrame(() => {
    uniforms.uViewportAspect.value = size.width / size.height;

    if (frameCount.current < 2) {
      frameCount.current++;
      if (frameCount.current === 2) {
        onReady?.();
      }
    }
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        vertexShader={bgVert}
        fragmentShader={bgFrag}
        uniforms={uniforms}
      />
    </mesh>
  );
}