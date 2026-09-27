"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import Topography to avoid SSR issues (it uses WebGL)
const Topography = dynamic(
  () => import("./Topography"),
  { ssr: false }
);

/**
 * TopographyBackground
 *
 * Renders the Topography WebGL effect as a fixed full-screen backdrop behind
 * all page content.  As the user scrolls, we shift `scale` and `morphAmount`
 * so the contour terrain "zooms" gently, giving an immersive sense of
 * moving through the landscape.
 */
export default function TopographyBackground() {
  // scroll-driven props

  const rafRef = useRef<number>(0);
  const scrollYRef = useRef(0);
  const currentScaleRef = useRef(1.0);
  const currentMorphRef = useRef(3.0);
  const currentOpacityRef = useRef(0.72);

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const tick = () => {
      const scrollY = scrollYRef.current;
      const docH = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      // 0 at top, 1 at bottom
      const progress = Math.min(scrollY / docH, 1);

      // Scale: 1.0 at top → 1.6 at bottom (gentle zoom in as you scroll)
      const targetScale = 1.0 + progress * 0.6;
      // MorphAmount: 3.0 at top → 5.5 at bottom (terrain shifts more)
      const targetMorph = 3.0 + progress * 2.5;
      // Opacity: starts at 0.72, subtly varies
      const targetOpacity = 0.72 - progress * 0.1;

      const EASE = 0.04; // lower = smoother/lazier follow
      currentScaleRef.current = lerp(currentScaleRef.current, targetScale, EASE);
      currentMorphRef.current = lerp(currentMorphRef.current, targetMorph, EASE);
      currentOpacityRef.current = lerp(currentOpacityRef.current, targetOpacity, EASE);


      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 5,
        pointerEvents: "none",
        // Dark base so the coloured contour lines pop
        background: "transparent",
      }}
    >
      <Topography
        lowColor="#7B8585"
        midColor="#7B8585"
        highColor="#7B8585"
        speed={0.28}
        morphAmount={1.3}
        morphSpeed={0.045}
        bands={3.5}
        thickness={0.012}
        scale={3}
        pixelSize={1.0}
        glow={0.3}
        colorMode="elevation"
        contrast={2.8}
        brightness={1.05}
        fillBands={false}
        opacity={0.2}
        grain={true}
        grainIntensity={0.04}
        mouseInteraction={true}
        mouseRadius={0.28}
        mouseStrength={0.35}
      />
    </div>
  );
}
