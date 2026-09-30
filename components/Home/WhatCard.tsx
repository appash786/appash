"use client";

import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import { RotateCw } from "lucide-react";
import PixelSwap from "../ReactBits/PixelSwap";

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
  /** Swap to back (called from the GSAP timeline) */
  flip: () => void;
  /** Swap back to front (called on timeline reverse) */
  unflip: () => void;
  /** Outer wrapper for GSAP position/spread tweens */
  outerEl: HTMLDivElement | null;
  innerEl: HTMLDivElement | null;
}

interface WhatCardProps {
  card: CardData;
}

const TOTAL_BLOCKS = 10;

const WhatCard = forwardRef<WhatCardHandle, WhatCardProps>(({ card }, ref) => {
  const [isFlipped, setIsFlipped] = useState(false); // click-driven
  const [gsapFlipped, setGsapFlipped] = useState(false); // timeline-driven
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    flip: () => setGsapFlipped(true),
    unflip: () => setGsapFlipped(false),
    outerEl: outerRef.current,
    innerEl: innerRef.current,
  }));

  const showBack = isFlipped || gsapFlipped;

  // When click-flipped to the back, return to front if the user scrolls
  useEffect(() => {
    if (!isFlipped) return;

    const handleScroll = () => setIsFlipped(false);

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
    const next = !(isFlipped || gsapFlipped);
    setIsFlipped(next);
    setGsapFlipped(next);
  };

  // FRONT — red-800 background → light text
  const front = (
    <div
      className={`w-full h-full p-6 sm:p-8 bg-red-800 border ${card.border} flex flex-col justify-between overflow-hidden`}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl sm:text-3xl font-mono font-bold px-3 py-1 border border-white/30 bg-white/10 text-white">
          {card.id}
        </span>
        <span className="text-xs uppercase tracking-widest text-red-200 font-mono">
          {card.tag}
        </span>
      </div>

      <div className="mt-auto">
        <h3 className="text-2xl uppercase sm:text-3xl font-bold text-white tracking-tight mb-2 sm:mb-3">
          {card.title}
        </h3>
        <p className="text-xs sm:text-sm text-red-100 font-light leading-relaxed">
          {card.desc}
        </p>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-white/20 text-xs text-red-200 font-mono">
        <span className="group-hover:text-white transition-colors flex items-center gap-1.5">
          <RotateCw className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-500" />
          Click to view skills
        </span>
        <span className="text-[10px] uppercase text-red-300">Flip card</span>
      </div>
    </div>
  );

  // BACK — white background → dark text, red accents
  const back = (
    <div
      className={`w-full h-full p-6 sm:p-8 bg-white border ${card.border} flex flex-col justify-between overflow-hidden`}
    >
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
            {card.title}
          </h4>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">
            Proficiency &amp; Skills
          </span>
        </div>
        <button
          onClick={toggleFlip}
          className="p-1.5 rounded-full border border-red-800/30 text-red-800 hover:bg-red-800/10 transition-colors flex items-center justify-center"
          title="Flip back"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Skill level blocks */}
      <div className="my-auto space-y-2.5 sm:space-y-3 py-1">
        {card.skills.map((skill, idx) => {
          const filled = Math.round((skill.level / 100) * TOTAL_BLOCKS);
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-neutral-800 font-medium">{skill.name}</span>
                <span className="text-neutral-500">{skill.level}%</span>
              </div>
              <div
                className="flex gap-1"
                role="img"
                aria-label={`${skill.name}: ${skill.level}%`}
              >
                {Array.from({ length: TOTAL_BLOCKS }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      i < filled ? "bg-red-800" : "bg-neutral-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
        <span>Tap card to return</span>
        <span className="px-2 py-0.5 text-[10px] border border-red-800/30 bg-red-800/10 text-red-800">
          {card.id}
        </span>
      </div>
    </div>
  );

  return (
    <div
      ref={outerRef}
      className={`relative md:absolute md:left-1/2 md:top-[60%] ${card.width} ${card.height} cursor-pointer group shrink-0`}
      onClick={toggleFlip}
    >
      <div
        ref={innerRef}
        className="relative w-full h-full"
        style={{ boxShadow: `0 20px 40px -15px ${card.glow}` }}
      >
        <PixelSwap
          firstContent={front}
          secondContent={back}
          trigger="manual"
          active={showBack}
          aspectRatio="auto"
          className="h-full"
          pixelSize={48}
          pattern="random"
          pixelScale={0.35}
          duration={900}
          pixelDuration={350}
          fade
        />
      </div>
    </div>
  );
});

WhatCard.displayName = "WhatCard";

export default WhatCard;