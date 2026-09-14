"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import WhatCard, { CardData, WhatCardHandle } from "./WhatCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const cardsData: CardData[] = [
  {
    id: "01",
    title: "Web Development",
    desc: "React, Next.js, TypeScript, Tailwind — responsive, fast, maintainable.",
    tag: "Core Stack",
    gradient: "from-neutral-900 via-neutral-900/95 to-amber-950/40",
    border: "border-amber-500/30",
    badge: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    glow: "rgba(245, 158, 11, 0.15)",
    barGradient: "from-amber-500 to-amber-300",
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
    gradient: "from-neutral-900 via-neutral-900/95 to-indigo-950/40",
    border: "border-indigo-500/30",
    badge: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    glow: "rgba(99, 102, 241, 0.15)",
    barGradient: "from-indigo-500 to-indigo-300",
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
  // Imperative handles — expose outerEl (for spread), flip() / unflip() (for flip)
  const cardHandleRefs = useRef<(WhatCardHandle | null)[]>([]);
  const textOneRef = useRef<HTMLDivElement>(null);
  const textTwoRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth < 1024;

      const fanOffsetX = isMobile ? 110 : isTablet ? 180 : 260;
      const rowOffsetX = isMobile ? 210 : isTablet ? 310 : 390;
      const targetScale = isMobile ? 0.72 : 1;
      const baseY = isMobile ? 40 : 60; // Offset lower towards the bottom

      // 1. Initial pose matching fanned stack reference image

      gsap.fromTo(
        slideRef.current,
        { translateY: 200 },
        {
          translateY: 0,
          ease: "expo.out",
          duration: 2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "center 70%",
            end: "bottom -20%",

            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );


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

      // Card 1 (Center): front & center
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

      // Card 2 (Right): shifted right & tilted right
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

      // Background text entrance
      if (textOneRef.current && textTwoRef.current) {
        gsap.to([textOneRef.current, textTwoRef.current], {
          translateY: "0vh",
          ease: "expo.out",
          duration: 2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            invalidateOnRefresh: true,
          },
        });
      }

      // 2. Timeline to un-fan cards into a straight horizontal side-by-side row on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          // +=250% gives enough pinned scroll distance for spread + 3 sequential flips
          end: "+=250%",
          pin: true,
          scrub: 1,           // ties every tween to scroll position
          invalidateOnRefresh: true,
        },
      });

      // Left card moves out to left side of row & straightens
      if (h0) {
        tl.to(
          h0,
          {
            x: -rowOffsetX,
            y: baseY,
            rotationZ: 0,
            duration: 1,
            scale: targetScale,
            ease: "power2.inOut",
          },
          0,
        );
      }

      // Center card stays in center & straightens
      if (h1) {
        tl.to(
          h1,
          {
            x: 0,
            y: baseY,
            rotationZ: 0,
            scale: targetScale,
            duration: 1,
            ease: "power2.inOut",
          },
          0,
        );
      }

      // Right card moves out to right side of row & straightens
      if (h2) {
        tl.to(
          h2,
          {
            x: rowOffsetX,
            y: baseY,
            rotationZ: 0,
            duration: 1,
            scale: targetScale,
            ease: "power2.inOut",
          },
          0,
        );
      }

      // FLIP: after cards spread, each card flips one by one as you scroll.
      // Targets innerEl directly so rotateY is fully scrub-driven —
      // the pin won't release until the user scrolls through all 3 flips.
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
            // Update React state for skill bars when each flip starts/reverses
            onStart: () => cardHandleRefs.current[i]?.flip(),
            onReverseComplete: () => cardHandleRefs.current[i]?.unflip(),
          },
          ">",  // sequential: left → center → right
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-screen h-screen  overflow-hidden select-none"
    >
      <div
        ref={slideRef}
        className=" w-screen h-screen  overflow-hidden select-none"
      >
        {/* Background Fixed Text Banner */}
        <div className="w-full h-full flex flex-col  relative z-0">
          <div className="w-full h-[450px] md:h-[500px] group border-t border-b  0 border-amber-50/20 px-20  flex-col  flex  gap-1">
            <div className="w-full h-[200px] overflow-hidden  ">
              <p
                ref={textOneRef}
                className="translate-y-50 text-[180px] uppercase HeroText"
              >
                Innovate with
              </p>
            </div>
            <div className="w-full h-[2px]  "></div>
            <div className="w-full h-[200px] overflow-hidden flex items-end  justify-end ">
              <p
                ref={textTwoRef}
                className="-translate-y-50 text-[180px] uppercase HeroText font-bold"
              >
                a Human touch
              </p>
            </div>
          </div>
          {/* Flowing Text Strip */}
          <div className="w-full h-[5vh] min-h-[44px] bg-white text-black overflow-hidden flex items-center relative select-none">
            {/* Block 1 */}
            <div className="flex shrink-0 animate-marquee items-center whitespace-nowrap">
              {[...techItems, ...techItems].map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-black  text-lg sm:text-sm tracking-widest px-3 uppercase">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            {/* Block 2 (identical duplicate for 100% seamless infinite loop) */}
            <div
              className="flex shrink-0 animate-marquee items-center whitespace-nowrap"
              aria-hidden="true"
            >
              {[...techItems, ...techItems].map((item, index) => (
                <div key={`dup-${index}`} className="flex items-center">
                  <span className="text-black  text-lg sm:text-sm tracking-widest px-3 uppercase">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Cards Layer */}
        {cardsData.map((card, index) => (
          <WhatCard
            key={card.id}
            ref={(handle) => {
              // WhatCard now forwards a WhatCardHandle — store it for imperative flip calls
              cardHandleRefs.current[index] = handle;
              // Also keep the outer DOM node via handle.innerEl's parent for GSAP position tweens
              // (cardRefs is populated separately below via a wrapper div if needed,
              //  but WhatCard's outer element is still accessible as handle)
            }}
            card={card}
          />
        ))}
      </div>
    </section>
  );
};

export default What;
