"use client";

import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import { RotateCw } from "lucide-react";

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
  /** Flip to back (called from the GSAP timeline) */
  flip: () => void;
  /** Flip back to front (called on timeline reverse) */
  unflip: () => void;
  /** Outer wrapper for GSAP position/spread tweens */
  outerEl: HTMLDivElement | null;
  innerEl: HTMLDivElement | null;
}

interface WhatCardProps {
  card: CardData;
}

const TOTAL_BLOCKS = 10;

const faceStyle: React.CSSProperties = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

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

  // Decorative corner mark used on both faces
  const Corner = ({ className }: { className: string }) => (
    <span
      className={`absolute w-3 h-3 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );

  // FRONT — red card, light text
  const front = (
    <div
      className={`absolute inset-0  bg-red-800 border ${card.border} overflow-hidden`}
      style={{
        ...faceStyle,
        pointerEvents: showBack ? "none" : "auto",
      }}
    >
      {/* sheen + subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(120% 80% at 0% 0%, rgba(255,255,255,0.18), transparent 55%), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 24px 24px, 24px 24px",
        }}
      />
      {/* inner frame */}
      <div className="absolute inset-2.5 sm:inset-3  border border-white/25 pointer-events-none" />
      <Corner className="top-4 left-4 border-t-2 border-l-2 border-white/60" />
      <Corner className="top-4 right-4 border-t-2 border-r-2 border-white/60" />
      <Corner className="bottom-4 left-4 border-b-2 border-l-2 border-white/60" />
      <Corner className="bottom-4 right-4 border-b-2 border-r-2 border-white/60" />

      <div className="relative w-full h-full p-7 sm:p-9 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-2xl sm:text-3xl font-mono font-bold px-3 py-1  border border-white/30 bg-white/10 text-white">
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

        <div className="pt-4 flex items-center justify-between  text-xs text-red-200 font-mono">
          <span className="group-hover:text-white transition-colors flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-500" />
            Click to view skills
          </span>
          <span className="text-[10px] uppercase text-red-300">Flip card</span>
        </div>
      </div>
    </div>
  );

  // BACK — white card, dark text, red accents (pre-rotated 180deg)
  const back = (
    <div
      className={`absolute inset-0  bg-white border ${card.border} overflow-hidden`}
      style={{
        ...faceStyle,
        transform: "rotateY(180deg)",
        pointerEvents: showBack ? "auto" : "none",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(153,27,27,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(153,27,27,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-2.5 sm:inset-3  border border-red pointer-events-none" />
      <Corner className="top-4 left-4 border-t-2 border-l-2 border-red-800/60" />
      <Corner className="top-4 right-4 border-t-2 border-r-2 border-red-800/60" />
      <Corner className="bottom-4 left-4 border-b-2 border-l-2 border-red-800/60" />
      <Corner className="bottom-4 right-4 border-b-2 border-r-2 border-red-800/60" />

      <div className="relative w-full h-full p-7 sm:p-9 flex flex-col justify-between">
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
                  <span className="text-neutral-800 font-medium">
                    {skill.name}
                  </span>
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
                      className={`w-4 h-4 sm:w-5 sm:h-5  ${
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
          <span className="px-2 py-0.5 text-[10px] rounded border border-red-800/30 bg-red-800/10 text-red-800">
            {card.id}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={outerRef}
      className={`relative md:absolute md:left-1/2 md:top-[60%] ${card.width} ${card.height} cursor-pointer group shrink-0`}
      onClick={toggleFlip}
    >
      {/* innerEl stays free for GSAP transforms; perspective lives here */}
      <div
        ref={innerRef}
        className="relative w-full h-full"
        style={{ perspective: "1200px" }}
      >
        {/* The flipper is the only element that rotates */}
        <div
          className="relative w-full h-full rounded-2xl transition-transform duration-700 ease-[cubic-bezier(0.4,0.2,0.2,1)] motion-reduce:transition-none"
          style={{
            transformStyle: "preserve-3d",
            transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)",
            boxShadow: `0 20px 40px -15px ${card.glow}`,
            willChange: "transform",
          }}
        >
          {front}
          {back}
        </div>
      </div>
    </div>
  );
});

WhatCard.displayName = "WhatCard";

export default WhatCard;