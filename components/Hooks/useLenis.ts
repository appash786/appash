// src/hooks/useLenis.ts
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";

export default function useLenis() {
  useEffect(() => {
    // Skip Lenis on touch/mobile devices — it sets touch-action:none which blocks native scroll
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Integrate with GSAP ticker for a single, unified animation loop
    const onTick = (time: number) => {
      lenis.raf(time * 1000); // gsap ticker provides seconds, lenis expects ms
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);
}
