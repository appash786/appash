// src/hooks/useLenis.ts
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function useLenis() {
  useEffect(() => {
    // html/body have overflow:hidden in globals.css, so native scroll is disabled.
    // Lenis MUST run on all devices (including touch) to be the scroll driver.
    // smoothTouch:false defers momentum/inertia to the browser on touch devices
    // while still keeping ScrollTrigger in sync.
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    
    });

    (window as any).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    // Integrate with GSAP ticker for a single, unified animation loop
    const onTick = (time: number) => {
      lenis.raf(time * 1000); // gsap ticker provides seconds, lenis expects ms
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      delete (window as any).__lenis;
      lenis.destroy();
    };
  }, []);
}
