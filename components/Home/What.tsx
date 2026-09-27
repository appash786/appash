"use client";

import  { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import WhatCard, { CardData, WhatCardHandle } from "./WhatCard";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const cardsData: CardData[] = [
  {
    id: "01",
    title: "Web Development",
    desc: "React, Next.js, TypeScript, Tailwind — responsive, fast, maintainable.",
    tag: "Core Stack",
    gradient: "from-neutral-900 via-neutral-900/95 to-rose-950/40",
    border: "border-rose-500/30",
    badge: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    glow: "rgba(244, 63, 94, 0.15)",
    barGradient: "from-rose-500 to-rose-300",
    initialLeft: "left-1/2",
    initialTop: "60%",
    targetTop: "60%",
    width: "w-[280px] sm:w-[320px] md:w-[360px]",
    height: "h-[340px] sm:h-[380px] md:h-[410px]",
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 92 },
      { name: "GSAP / Animations", level: 85 },
      { name: "Three.js / WebGL", level: 78 },
    ],
  },
  {
    id: "02",
    title: "UI / UX Design",
    desc: "Wireframes to polished interfaces, built around real user flows.",
    tag: "Product & Craft",
    gradient: "from-neutral-900 via-neutral-900/95 to-rose-950/40",
    border: "border-rose-500/30",
    badge: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    glow: "rgba(244, 63, 94, 0.15)",
    barGradient: "from-rose-500 to-rose-300",
    initialLeft: "left-1/2",
    initialTop: "60%",
    targetTop: "60%",
    width: "w-[280px] sm:w-[320px] md:w-[360px]",
    height: "h-[340px] sm:h-[380px] md:h-[410px]",
    skills: [
      { name: "Figma & Prototyping", level: 94 },
      { name: "Design Systems", level: 88 },
      { name: "Wireframing & UX", level: 90 },
      { name: "User Research", level: 82 },
      { name: "UI Micro-interactions", level: 86 },
    ],
  },
  {
    id: "03",
    title: "Branding & Motion",
    desc: "Identity systems, logo design, typography, and motion graphics.",
    tag: "Visual & Motion",
    gradient: "from-neutral-900 via-neutral-900/95 to-rose-950/40",
    border: "border-rose-500/30",
    badge: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    glow: "rgba(244, 63, 94, 0.15)",
    barGradient: "from-rose-500 to-rose-300",
    initialLeft: "left-1/2",
    initialTop: "60%",
    targetTop: "60%",
    width: "w-[280px] sm:w-[320px] md:w-[360px]",
    height: "h-[340px] sm:h-[380px] md:h-[410px]",
    skills: [
      { name: "Visual Identity", level: 92 },
      { name: "Logo Design", level: 88 },
      { name: "Typography", level: 94 },
      { name: "After Effects / Premiere", level: 90 },
      { name: "Brand Guidelines", level: 86 },
    ],
  },
];

const techItems = [
  "typescript",
  "javascript",
  "figma",
  "react.js",
  "next.js",
  "tailwind css",
  "gsap",
  "three.js",
  "ui / ux design",
  "motion graphics",
  "web development",
];

const What = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardHandleRefs = useRef<(WhatCardHandle | null)[]>([]);
  const textOneRef = useRef<HTMLDivElement>(null);
  const textTwoRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const clipPathRef = useRef<SVGPathElement | null>(null);
  const WhatBgRef = useRef<HTMLDivElement>(null);
  const WhatBgImageRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      const fanOffsetX = isTablet ? 180 : 260;
      const rowOffsetX = isTablet ? 310 : 390;
      const targetScale = isTablet ? 0.85 : 1;
      const baseY = isTablet ? 40 : 60;

      // --- Clip path bend (perf-critical: runs every scroll tick) ---
      const getMeClipPath = (topY: number, bottomY: number) => {
        const topCtrl = (topY / 1000).toFixed(3);
        const bottomCtrl = ((1000 + bottomY) / 1000).toFixed(4);
        return `M 0,0 Q 0.5,${topCtrl} 1,0 L 1,0.92 Q 0.5,${bottomCtrl} 0,0.92 Z`;
      };
      const bendState = { topY: 0, bottomY: 0 };
      const TOP_BENT = 70;
      const BOTTOM_BENT = -110;

      // quickSetter avoids GSAP re-parsing/re-validating the attribute on every
      // single scroll callback — meaningfully cheaper than a raw setAttribute
      // call inside onUpdate when scrub is firing at high frequency.
      const setClipD = clipPathRef.current
        ? gsap.quickSetter(clipPathRef.current, "attribute", "d")
        : null;

      const applyBend = () => {
        setClipD?.(getMeClipPath(bendState.topY, bendState.bottomY));
      };

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        bendState.topY = TOP_BENT;
        bendState.bottomY = BOTTOM_BENT;
        applyBend();
      } else {
        applyBend();

        // Merged: bend + parallax now share ONE ScrollTrigger on WhatBgRef
        // instead of two independent ones, halving the per-frame callback count.
        const bgTl = gsap.timeline({
          scrollTrigger: {
            trigger: WhatBgRef.current,
            start: "top bottom",
            end: "bottom -=1000",
            scrub: 0.6, // slightly smoothed — fewer forced recalcs per pixel
            invalidateOnRefresh: true, // kept: end depends on layout height
          },
        });

        bgTl
          .fromTo(
            WhatBgImageRef.current,
            { y: isMobile ? -80 : -100 },
            { y: isMobile ? 100 : 350, ease: "none" },
            0,
          )
          .to(
            bendState,
            {
              bottomY: TOP_BENT,
              ease: "none",
              onUpdate: applyBend,
            },
            0,
          );
      }

      // 1. Initial pose / slide entrance
      gsap.fromTo(
        slideRef.current,
        { translateY: isMobile ? 60 : 200 },
        {
          translateY: 0,
          ease: "expo.out",
          duration: 1.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );

      // Background text entrance (both desktop & mobile)
      if (textOneRef.current && textTwoRef.current) {
        gsap.to([textOneRef.current, textTwoRef.current], {
          translateY: "0vh",
          ease: "expo.out",
          duration: 1.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      }

      if (!isMobile) {
        const h0 = cardHandleRefs.current[0]?.outerEl;
        const h1 = cardHandleRefs.current[1]?.outerEl;
        const h2 = cardHandleRefs.current[2]?.outerEl;

        if (h0) {
          gsap.set(h0, {
            xPercent: -50,
            yPercent: -50,
            x: -fanOffsetX,
            y: baseY,
            rotationZ: -7,
            scale: 1,
            zIndex: 10,
          });
        }

        if (h1) {
          gsap.set(h1, {
            xPercent: -50,
            yPercent: -50,
            x: 0,
            y: baseY - 10,
            rotationZ: 0,
            scale: 1,
            zIndex: 20,
          });
        }

        if (h2) {
          gsap.set(h2, {
            xPercent: -50,
            yPercent: -50,
            x: fanOffsetX,
            y: baseY,
            rotationZ: 7,
            scale: 1,
            zIndex: 10,
          });
        }

        // 2. Timeline to un-fan cards into a straight horizontal row
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            toggleActions: "play none none none",
          },
        });

        if (h0) {
          tl.to(
            h0,
            {
              x: -rowOffsetX,
              y: baseY,
              rotationZ: 0,
              duration: 0.9,
              scale: targetScale,
              ease: "power2.out",
            },
            0,
          );
        }

        if (h1) {
          tl.to(
            h1,
            {
              x: 0,
              y: baseY,
              rotationZ: 0,
              scale: targetScale,
              duration: 0.9,
              ease: "power2.out",
            },
            0,
          );
        }

        if (h2) {
          tl.to(
            h2,
            {
              x: rowOffsetX,
              y: baseY,
              rotationZ: 0,
              duration: 0.9,
              scale: targetScale,
              ease: "power2.out",
            },
            0,
          );
        }

        // FLIP: after cards spread, each card flips one by one
        [0, 1, 2].forEach((i) => {
          const innerEl = cardHandleRefs.current[i]?.innerEl;
          if (!innerEl) return;
          tl.fromTo(
            innerEl,
            { rotateY: 0 },
            {
              rotateY: 180,
              duration: 0.6,
              ease: "power2.inOut",
              onStart: () => cardHandleRefs.current[i]?.flip(),
              onReverseComplete: () => cardHandleRefs.current[i]?.unflip(),
            },
            i === 0 ? "+=0.2" : ">-0.3",
          );
        });
      } else {
        // Mobile: each card has an entrance animation and flips when its center hits the viewport center
        [0, 1, 2].forEach((i) => {
          const innerEl = cardHandleRefs.current[i]?.innerEl;
          const outerEl = cardHandleRefs.current[i]?.outerEl;
          if (!innerEl || !outerEl) return;

          // Entrance fade & slight upward slide as card approaches
          gsap.fromTo(
            outerEl,
            { y: 35, opacity: 0.4 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: outerEl,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          );

          // Card flip triggered when card hits the center of the viewport
          gsap.fromTo(
            innerEl,
            { rotateY: 0 },
            {
              rotateY: 180,
              duration: 0.7,
              ease: "power2.inOut",
              onStart: () => cardHandleRefs.current[i]?.flip(),
              onReverseComplete: () => cardHandleRefs.current[i]?.unflip(),
              scrollTrigger: {
                trigger: outerEl,
                start: "top center",
                toggleActions: "play none none reverse",
              },
            },
          );
        });
      }
    },
    { scope: sectionRef },
  );

  return (
    <>
      <section className="relative w-full bg-black">
        <svg
          className="absolute w-0 h-0 pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="meClip-2" clipPathUnits="objectBoundingBox">
              <path
                ref={clipPathRef}
                d="M 0,0 Q 0.5,0 1,0 L 1,0.92 Q 0.5,0.92 0,0.92 Z"
              />
            </clipPath>
          </defs>
        </svg>

        <div
          style={{
            clipPath: "url(#meClip-2)",
            WebkitClipPath: "url(#meClip-2)",
            zIndex: 10,
            willChange: "clip-path",
          }}
          className="relative w-full overflow-hidden aspect-4/5 xl:aspect-[21/9] flex justify-center items-center"
          ref={WhatBgRef}
        >
          <Image
            ref={WhatBgImageRef}
            src="/Assets/Images/BgImage-5.webp"
            className="w-full h-full object-cover xl:scale-125  will-change-transform"
            fill
            sizes="100vw" 
            quality={75}
            alt="BG Image"
          />
        </div>
      </section>
      <section
        ref={sectionRef}
        className="relative w-full md:w-screen min-h-screen md:h-screen bg-black md:overflow-hidden select-none"
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br bg-black pointer-events-none" />

        <div
          ref={slideRef}
          className="w-full md:w-screen min-h-screen md:h-screen flex flex-col md:block select-none will-change-transform"
        >
          {/* Background Fixed Text Banner */}
          <div className="w-full md:h-full flex  flex-col relative pt-8 md:pt-0">
            <div className="w-full xl:h-[450px] justify-center md:h-[500px] 0 z-11 group px-2 sm:px-12 xl:px-20 flex-col flex xl:gap-1">
              <div className="w-full xl:h-[160px]  flex justify-end   overflow-hidden">
                <p
                  ref={textOneRef}
                  className="translate-y-50 z-100 text-4xl sm:text-6xl md:text-8xl xl:text-[180px] text-white uppercase font-bold tracking-tight"
                >
                  Innovate with
                </p>
              </div>
              <div className="w-full hidden   xl:block h-1 md:h-2 bg xl:h-[1px]"></div>
              <div className="w-full xl:h-[160px]   overflow-hidden flex  items-end">
                <p
                  ref={textTwoRef}
                  className="-translate-y-50 text-4xl sm:text-6xl md:text-8xl xl:text-[180px] text-white uppercase font-bold tracking-tight"
                >
                  a Human touch
                </p>
              </div>
            </div>
            {/* Flowing Text Strip */}
            <div className="w-full mt-6 md:mt-12 xl:mt-0 xl:h-[5vh] xl:min-h-[44px] py-2 md:py-0 bg-white/10 border-y border-white/10 text-white overflow-hidden flex items-center relative select-none">
              <div className="flex shrink-0 animate-marquee items-center whitespace-nowrap">
                {[...techItems, ...techItems].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-white xl:text-lg text-xs sm:text-sm tracking-widest xl:px-3 px-2 uppercase">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="flex shrink-0 animate-marquee items-center whitespace-nowrap"
                aria-hidden="true"
              >
                {[...techItems, ...techItems].map((item, index) => (
                  <div key={`dup-${index}`} className="flex items-center">
                    <span className="text-white text-lg sm:text-sm tracking-widest px-3 uppercase">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Cards Layer */}
          <div className="relative md:absolute md:inset-0 flex flex-col md:block items-center justify-center gap-6 my-10 md:my-0 md:h-screen pointer-events-auto">
            {cardsData.map((card, index) => (
              <WhatCard
                key={card.id}
                ref={(handle) => {
                  cardHandleRefs.current[index] = handle;
                }}
                card={card}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default What;
