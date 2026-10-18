"use client";

import { createContext, useContext, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/* ---------- context: lets the page hand its horizontal tween to children ---------- */
type HScrollCtx = { animation: gsap.core.Animation | null };
const HorizontalScrollContext = createContext<HScrollCtx | null>(null);

export function HorizontalScrollProvider({
  animation,
  children,
}: {
  animation: gsap.core.Animation | null;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ animation }), [animation]);
  return (
    <HorizontalScrollContext.Provider value={value}>
      {children}
    </HorizontalScrollContext.Provider>
  );
}

type TriggerAxis = "vertical" | "horizontal";

interface BlockRevealProps {
  children: React.ReactNode;
  color?: string;
  delay?: number;
  duration?: number;
  className?: string;
  /** Pass "horizontal", "vertical", or directly pass the horizontal GSAP animation / tween */
  trigger?: TriggerAxis | gsap.core.Animation | null;
  /** Optional manual override; otherwise taken from trigger or HorizontalScrollProvider. */
  containerAnimation?: gsap.core.Animation | null;
  /** @deprecated use trigger="horizontal" */
  horizontal?: boolean;
  start?: string;
  toggleActions?: string;
  managed?: boolean;
}

export default function BlockReveal({
  children,
  color = "#A50000",
  delay = 0,
  duration = 0.8,
  className = "",
  trigger,
  containerAnimation: containerAnimationProp,
  horizontal = false,
  start,
  toggleActions = "play none none none",
  managed = false,
}: BlockRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const ctx = useContext(HorizontalScrollContext);

  // Allow passing the GSAP animation via `trigger={hAnim}` or `containerAnimation={hAnim}` or context
  const passedAnim =
    (typeof trigger === "object" && trigger !== null ? trigger : null) ??
    containerAnimationProp ??
    ctx?.animation ??
    null;

  const wantsHorizontal =
    trigger === "horizontal" ||
    horizontal ||
    !!passedAnim ||
    !!ctx;

  useGSAP(
    () => {
      if (managed) return;

      // reduced motion: just show the content
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(textRef.current, { opacity: 1 });
        gsap.set(overlayRef.current, { scaleX: 0 });
        return;
      }

      gsap.set(textRef.current, { opacity: 0 });
      gsap.set(overlayRef.current, { scaleX: 0, transformOrigin: "left" });

      // If waiting for horizontal animation to be ready, stay hidden until it arrives
      if (wantsHorizontal && !passedAnim) return;

      const isHorizontal = wantsHorizontal && !!passedAnim;
      const half = duration / 2;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: start ?? (isHorizontal ? "left 85%" : "top 85%"),
            toggleActions,
            ...(isHorizontal ? { containerAnimation: passedAnim } : {}),
          },
          delay,
          defaults: { ease: "power3.inOut" },
        })
        .to(overlayRef.current, { scaleX: 1, duration: half })
        .set(textRef.current, { opacity: 1 })
        .set(overlayRef.current, { transformOrigin: "right" })
        .to(overlayRef.current, { scaleX: 0, duration: half });
    },
    {
      scope: containerRef,
      revertOnUpdate: true, // important: clean up the old trigger when the tween arrives
      dependencies: [color, delay, duration, passedAnim, wantsHorizontal, start, toggleActions, managed],
    }
  );

  return (
    <div
      ref={containerRef}
      data-block-reveal
      className={`relative inline-block w-fit overflow-hidden ${className}`}
    >
      <div ref={textRef} data-block-text className="relative z-10 opacity-0 motion-reduce:opacity-100">
        {children}
      </div>
      <div
        ref={overlayRef}
        data-block-overlay
        className="absolute inset-0 z-20 h-full w-full origin-left scale-x-0 will-change-transform motion-reduce:hidden"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}