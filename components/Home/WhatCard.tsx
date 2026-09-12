"use client";

import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import { RotateCw } from "lucide-react";
import gsap from "gsap";

export interface Skill {
  name: string;
  level: number;
}

export interface CardData {
  id: string;
  title: string;
  desc: string;
  tag: string;
  gradient: string;
  border: string;
  badge: string;
  glow: string;
  barGradient: string;
  initialLeft: string;
  initialTop: string;
  targetTop: string;
  width: string;
  height: string;
  skills: Skill[];
}

export interface WhatCardHandle {
  /** Flip to back (called by GSAP scroll animation) */
  flip: () => void;
  /** Flip back to front (called by GSAP scroll reverse) */
  unflip: () => void;
  /** The outer wrapper element for GSAP position/spread tweens */
  outerEl: HTMLDivElement | null;
  /** The inner flip-div element (if needed for direct GSAP rotation) */
  innerEl: HTMLDivElement | null;
}

interface WhatCardProps {
  card: CardData;
}

const WhatCard = forwardRef<WhatCardHandle, WhatCardProps>(({ card }, ref) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [gsapFlipped, setGsapFlipped] = useState(false);
  const lastScrollTimeRef = useRef<number>(0);
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  // Expose imperative flip API to parent
  useImperativeHandle(ref, () => ({
    flip: () => setGsapFlipped(true),
    unflip: () => setGsapFlipped(false),
    outerEl: outerRef.current,
    innerEl: innerRef.current,
  }));

  // Combined flipped state: either user click or GSAP scroll
  const showBack = isFlipped || gsapFlipped;

  // Track global scroll activity timestamp
  useEffect(() => {
    const updateScrollTime = () => {
      lastScrollTimeRef.current = Date.now();
    };

    window.addEventListener("scroll", updateScrollTime, { passive: true });
    window.addEventListener("wheel", updateScrollTime, { passive: true });
    window.addEventListener("touchmove", updateScrollTime, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollTime);
      window.removeEventListener("wheel", updateScrollTime);
      window.removeEventListener("touchmove", updateScrollTime);
    };
  }, []);

  // When user-click-flipped to backside, flip back if user scrolls
  useEffect(() => {
    if (!isFlipped) return;

    const handleScroll = () => {
      setIsFlipped(false);
    };

    const timeoutId = setTimeout(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("wheel", handleScroll, { passive: true });
      window.addEventListener("touchmove", handleScroll, { passive: true });
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [isFlipped]);

  const toggleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFlipped) {
      const isScrolling = Date.now() - lastScrollTimeRef.current < 200;
      if (isScrolling) return;
    }
    const next = !isFlipped;
    setIsFlipped(next);
    // GSAP owns the DOM rotation — animate directly so scroll-driven GSAP
    // and click-driven GSAP both target the same property without conflict
    if (innerRef.current) {
      gsap.to(innerRef.current, {
        rotateY: next ? 180 : 0,
        duration: 0.7,
        ease: "power2.inOut",
        overwrite: true,
      });
    }
  };

  return (
    <div
      ref={outerRef}
      className={`absolute z-10 ${card.initialLeft} ${card.width} ${card.height} [perspective:1000px] cursor-pointer group`}
      style={{ top: card.initialTop }}
      onClick={toggleFlip}
    >
      <div
        ref={innerRef}
        className="relative w-full h-full [transform-style:preserve-3d]"
        style={{
          boxShadow: `0 20px 40px -15px ${card.glow}`,
          // GSAP owns transform — no CSS transition here to avoid conflicts
        }}
      >
        {/* FRONT SIDE */}
        <div
          className={`absolute inset-0 w-full h-full p-6 sm:p-8 bg-gradient-to-br ${card.gradient} border ${card.border} backdrop-blur-md shadow-2xl flex flex-col justify-between overflow-hidden [backface-visibility:hidden]`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-2xl sm:text-3xl font-mono font-bold px-3 py-1 border ${card.badge}`}
            >
              {card.id}
            </span>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
              {card.tag}
            </span>
          </div>

          <div className="mt-auto">
            <h3 className="text-2xl uppercase sm:text-3xl font-bold text-white tracking-tight mb-2 sm:mb-3">
              {card.title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              {card.desc}
            </p>
          </div>

          {/* Flip indicator hint */}
          <div className="pt-4 flex items-center justify-between border-t border-white/10 text-xs text-neutral-400 font-mono">
            <span className="group-hover:text-white transition-colors flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-500 text-neutral-300" />
              Click to view skills
            </span>
            <span className="text-[10px] uppercase text-neutral-500">Flip card</span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className={`absolute inset-0 w-full h-full p-6 sm:p-8 bg-gradient-to-br ${card.gradient} border ${card.border} backdrop-blur-md shadow-2xl flex flex-col justify-between overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                {card.title}
              </h4>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">
                Proficiency &amp; Skills
              </span>
            </div>
            <button
              onClick={toggleFlip}
              className={`p-1.5 rounded-full border ${card.badge} hover:opacity-80 transition-opacity flex items-center justify-center`}
              title="Flip back"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Skill Bars List */}
          <div className="my-auto space-y-2.5 sm:space-y-3 py-1">
            {card.skills.map((skill, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-neutral-200 font-medium">{skill.name}</span>
                  <span className="text-neutral-400">{skill.level}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-900/90 border border-white/10 overflow-hidden relative p-[1px]">
                  <div
                    className={`h-full bg-gradient-to-r ${card.barGradient} transition-all duration-1000 ease-out`}
                    style={{
                      width: showBack ? `${skill.level}%` : "0%",
                      transitionDelay: `${idx * 80}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Back side footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
            <span>Tap card to return</span>
            <span className={`px-2 py-0.5 rounded text-[10px] border ${card.badge}`}>
              {card.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

WhatCard.displayName = "WhatCard";

export default WhatCard;
