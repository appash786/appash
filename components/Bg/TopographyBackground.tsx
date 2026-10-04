"use client";

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



  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1,
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
