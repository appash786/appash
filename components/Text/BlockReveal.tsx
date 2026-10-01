"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface BlockRevealProps {
  children: React.ReactNode;
  color?: string;
  delay?: number;
  duration?: number; // total duration of the wipe (split across in+out)
  className?: string;
}

export default function BlockReveal({
  children,
  color = "#C1F322",
  delay = 0,
  duration = 0.8,
  className = "",
}: BlockRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop / tablet only
      mm.add("(min-width: 768px)", () => {
        gsap.set(textRef.current, { opacity: 0 });
        gsap.set(overlayRef.current, { scaleX: 0, transformOrigin: "left" });

        const half = duration / 2;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            delay,
            defaults: { ease: "power3.inOut" },
          })
          .to(overlayRef.current, { scaleX: 1, duration: half })
          .set(textRef.current, { opacity: 1 })
          .set(overlayRef.current, { transformOrigin: "right" })
          .to(overlayRef.current, { scaleX: 0, duration: half });
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [color, delay, duration] }
  );

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-fit overflow-hidden ${className}`}
    >
      {/* Visible by default on mobile; hidden only on md+ until GSAP reveals it */}
      <div ref={textRef} className="relative z-10 md:opacity-0">
        {children}
      </div>

      {/* Overlay doesn't exist on mobile */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-20 hidden h-full w-full origin-left scale-x-0 will-change-transform md:block"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}