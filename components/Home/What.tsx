"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import WhatCard, { CardData } from "./WhatCard";

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
    initialLeft: "left-[4%] sm:left-[8%]",
    initialTop: "110vh",
    targetTop: "-120vh",
    width: "w-[280px] sm:w-[320px] md:w-[360px]",
    height: "h-[360px] sm:h-[420px]",
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
    initialLeft: "left-[48%] sm:left-[58%]",
    initialTop: "135vh",
    targetTop: "-120vh",
    width: "w-[260px] sm:w-[300px] md:w-[340px]",
    height: "h-[340px] sm:h-[390px]",
  },
  {
    id: "03",
    title: "Branding",
    desc: "Identity systems — logo, color, type, and voice.",
    tag: "Visual Identity",
    gradient: "from-neutral-900 via-neutral-900/95 to-rose-950/40",
    border: "border-rose-500/30",
    badge: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    glow: "rgba(244, 63, 94, 0.15)",
    initialLeft: "left-[18%] sm:left-[30%]",
    initialTop: "160vh",
    targetTop: "-120vh",
    width: "w-[290px] sm:w-[330px] md:w-[370px]",
    height: "h-[370px] sm:h-[430px]",
  },
  {
    id: "04",
    title: "Video & Motion",
    desc: "Editing and motion graphics in Premiere Pro, from trailers to social cuts.",
    tag: "Motion & Media",
    gradient: "from-neutral-900 via-neutral-900/95 to-emerald-950/40",
    border: "border-emerald-500/30",
    badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    glow: "rgba(16, 185, 129, 0.15)",
    initialLeft: "left-[42%] sm:left-[52%]",
    initialTop: "185vh",
    targetTop: "-120vh",
    width: "w-[280px] sm:w-[320px] md:w-[360px]",
    height: "h-[360px] sm:h-[410px]",
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
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
        
          invalidateOnRefresh: true,
        },
      });

      // Cards 1 to 4 float up and pass completely off the top of the viewport
      cardRefs.current.forEach((cardEl, i) => {
        if (cardEl) {
          tl.to(
            cardEl,
            {
              top: cardsData[i].targetTop,
              ease: "none",
              duration: 3,
            },
            i * 0.6,
          );
        }
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-screen h-screen bg-[#0a0a0a] overflow-hidden select-none"
    >
      {/* Background Fixed Text Banner */}
      <div className="w-full h-full flex flex-col justify-center items-center relative z-0">
        <div className="w-full h-[450px] md:h-[500px] border-t border-b border-amber-50/20 px-6 sm:px-12 md:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-white uppercase  tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[100px] leading-[0.95] text-left">
            Innovate –<br />
            with a human <br />
            touch.
          </p>

          <p className="w-full md:w-[30%] lg:w-[25%] text-white/80 text-left md:text-right text-base sm:text-lg md:text-xl font-light leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia in
            sapiente debitis error fugiat accusamus sequi deserunt nostrum
            asperiores nesciunt, fugit magn
          </p>
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
          <div className="flex shrink-0 animate-marquee items-center whitespace-nowrap" aria-hidden="true">
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
          ref={(el) => {
            cardRefs.current[index] = el;
          }}
          card={card}
        />
      ))}
    </section>
  );
};

export default What;
