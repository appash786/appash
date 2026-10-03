"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import BgScene from "./BgScene";
import FgScene from "./FgScene";

const canvasStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
};

interface HeroCanvasesProps {
  mouse: React.MutableRefObject<[number, number]>;
  onReady: () => void;
  cameraZ: React.MutableRefObject<{ value: number }>;
}

// This file is the ONLY place the hero imports three / @react-three/fiber.
// VisualHero loads it with next/dynamic after the first paint, so the poster
// and the heading never wait for WebGL.
export default function HeroCanvases({ mouse, onReady, cameraZ }: HeroCanvasesProps) {
  return (
    <>
      {/* Layer 1 — background */}
      <Canvas
        style={{ ...canvasStyle, zIndex: 1 }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 75 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 1);
          // r3f sets touch-action:none; override so wheel/touch scroll passes through.
          gl.domElement.style.touchAction = "auto";
          gl.domElement.style.pointerEvents = "none";
        }}
      >
        <Suspense fallback={null}>
          <BgScene onReady={onReady} />
        </Suspense>
      </Canvas>

      {/* Layer 3 — foreground with depth parallax */}
      <Canvas
        style={{ ...canvasStyle, zIndex: 20 }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.domElement.style.touchAction = "auto";
          gl.domElement.style.pointerEvents = "none";
        }}
      >
        <Suspense fallback={null}>
          <FgScene mouse={mouse} onReady={onReady} cameraZ={cameraZ} />
        </Suspense>
      </Canvas>
    </>
  );
}
