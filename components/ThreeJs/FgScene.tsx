"use client";

import { useThree, useLoader, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const coverUVGlsl = `vec2 coverUV(vec2 uv, float imgA, float viewA) { vec2 scale = viewA > imgA ? vec2(1.0, imgA / viewA) : vec2(viewA / imgA, 1.0); return (uv - 0.5) * scale + 0.5; }`;
const bgVert = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const fgVert = bgVert;
const fgFrag = `${coverUVGlsl} uniform sampler2D uTexture; uniform sampler2D uDepthMap; uniform vec2 uMouse; uniform vec2 uThreshold; uniform float uFgAspect; uniform float uViewportAspect; varying vec2 vUv; void main() { vec2 base = coverUV(vUv, uFgAspect, uViewportAspect); vec4 depth = texture2D(uDepthMap, base); vec2 displacement = -uMouse * depth.r * uThreshold; gl_FragColor = texture2D(uTexture, base + displacement); }`;

interface FgSceneProps {
  mouse?: React.MutableRefObject<[number, number]>;
  onReady?: () => void;
  cameraZ?: React.MutableRefObject<{ value: number }>;
}

export default function FgScene({ mouse, onReady, cameraZ }: FgSceneProps) {
  const { viewport, size } = useThree();

  // Store the initial viewport dimensions on mount so they do not reactively scale
  // and neutralize the camera Z-axis animation.
  const initialViewport = useMemo(
    () => ({
      width: viewport.width,
      height: viewport.height,
    }),
    [],
  );

  const [tex, depthTex] = useLoader(THREE.TextureLoader, [
    "/Assets/Images/appash.webp",
    "/Assets/Depth-maps/appash_depth.webp",
  ]);

  const frameCount = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: tex },
      uDepthMap: { value: depthTex },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uThreshold: { value: new THREE.Vector2(0.007, 0.005) },
      uFgAspect: { value: tex.image ? tex.image.width / tex.image.height : 1 },
      uViewportAspect: { value: size.width / size.height },
    }),
    [tex, depthTex],
  );

  useFrame(({ camera }) => {
    if (cameraZ?.current) {
      camera.position.z = cameraZ.current.value;
      camera.updateProjectionMatrix();
    }

    uniforms.uViewportAspect.value = size.width / size.height;

    // Safely check both `mouse` prop and `mouse.current` before reading values
    if (mouse?.current) {
      uniforms.uMouse.value.x +=
        (mouse.current[0] - uniforms.uMouse.value.x) * 0.06;
      uniforms.uMouse.value.y +=
        (mouse.current[1] - uniforms.uMouse.value.y) * 0.06;
    }

    if (frameCount.current < 2) {
      frameCount.current++;
      if (frameCount.current === 2) {
        onReady?.();
      }
    }
  });

  return (
    <mesh>
      <planeGeometry args={[initialViewport.width, initialViewport.height]} />
      <shaderMaterial
        vertexShader={fgVert}
        fragmentShader={fgFrag}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}