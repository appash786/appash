"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Me = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const topPathRef = useRef<SVGPathElement>(null);
  const bottomPathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!topPathRef.current || !bottomPathRef.current) return;

      // Top mask: a white rectangle covering the strip 0..80, whose BOTTOM
      // edge (the boundary visible against the red below it) is a single
      // quadratic curve from (0,80) to (1000,80) with control point
      // (500, controlY). At controlY=80 the curve is mathematically flat
      // (coincides with the straight baseline). Animating controlY UP
      // (past 80) dips the boundary DOWN in the middle — red recedes
      // into a shallow dip at the top.
      const topPath = (controlY: number) =>
        `M0,0 L1000,0 L1000,80 Q500,${controlY} 0,80 Z`;

      // Bottom mask: mirrors this at the section's bottom edge. Its TOP
      // edge is the visible boundary, anchored at (0,0) and (1000,0), so
      // its flat baseline is controlY=0. Animating controlY NEGATIVE
      // (above the baseline) bows the boundary UPWARD in the middle —
      // red bulges up into the white at the bottom.
      const bottomPath = (controlY: number) =>
        `M0,80 L1000,80 L1000,0 Q500,${controlY} 0,0 Z`;

      const bendState = { topY: 80, bottomY: 0 };
      // Tune these two to adjust how deep each bend curves at full scroll.
      const TOP_BENT = 152;
      const BOTTOM_BENT = -72;

      const applyBend = () => {
        topPathRef.current?.setAttribute("d", topPath(bendState.topY));
        bottomPathRef.current?.setAttribute("d", bottomPath(bendState.bottomY));
      };

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        // Skip the scroll-scrub entirely and land on the fully bent state.
        bendState.topY = TOP_BENT;
        bendState.bottomY = BOTTOM_BENT;
        applyBend();
        return;
      }

      // Top bend: flat while the section is below the viewport, curves in
      // as the section's top edge travels from the viewport bottom up to
      // its vertical center — then stays bent (one-way, no reverse).
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top center",
            scrub: 0.4,
          },
        })
        .to(bendState, {
          topY: TOP_BENT,
          ease: "none",
          onUpdate: applyBend,
        });

      // Bottom bend: flat while the section's bottom edge is still below
      // the viewport, curves in as that edge rises from the viewport
      // bottom up to viewport center.
      gsap.fromTo(
        containerRef.current,
        {
          y:200 ,
        },
        {
          y:-50,
          scrollTrigger:{
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top -=1000",
            scrub: 0.4,
            markers:true
          }
        },
      );
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "bottom bottom",
            end: "bottom center",
            scrub: 0.4,
          },
        })
        .to(bendState, {
          bottomY: BOTTOM_BENT,
          ease: "none",
          onUpdate: applyBend,
        });

      applyBend();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-red-800  min-h-screen overflow-hidden"
    >
      {/* Top bend mask */}
      <div className="absolute top-0 left-0 w-full h-20 z-4 -translate-y-[1px]">
        <svg
          viewBox="0 0 1000 80"
          preserveAspectRatio="none"
          className="w-full h-full block overflow-visible"
        >
          <path
            ref={topPathRef}
            d="M0,0 L1000,0 L1000,80 L0,80 Z"
            fill="white"
          />
        </svg>
      </div>

      <div ref={containerRef} className="relative z-10 max-w-[80%] z-[999]  mx-auto  md:px-12 pt-32 pb-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className=" text-[6.5rem] uppercase z-7  leading-[0.95] text-white">
            Heyy I&apos;m 
            <br />
            <span className="font-bold">Appash A S</span>
          </h2>

          <p className="mt-8 max-w-4xl text-white/85 text-sm md:text-[18px] leading-tight tracking-wide">
            I&apos;m a Visual Director working across video editing, graphic
            design, and frontend development. From cinematic edits to
            interactive web builds, I turn raw ideas into visuals that connect —
            blending storytelling, design, and code into one craft.
          </p>

          <div className="mt-16">
            <p className="text-white/80 text-sm mb-3">
              Follow me on social media
            </p>
            <div className="flex gap-3">
              {["instagram", "youtube", "linkedin"].map((label) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 bg-white/90 hover:bg-white transition-colors rounded-sm"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex justify-center  ">
          <div className="relative w-[580px] h-[660px] -translate-y-14 bg-amber-300">
            <Image
              src="/ProfileMe.jpg"
              alt="Portrait of Appash"
              fill
              quality={100}
              unoptimized={true}
              className="object-cover"
              sizes="(max-width: 768px) 560px, z-6 640px"
            />
          </div>
          <div className="absolute -right-4 top-16 w-16 h-16 bg-white" />
          <div className="absolute left-8 -bottom-8 w-14 h-14 bg-white" />
        </div>
      </div>

      {/* Bottom bend mask */}
      <div className="absolute bottom-0 left-0 w-full h-20 translate-y-[1px]">
        <svg
          viewBox="0 0 1000 80"
          preserveAspectRatio="none"
          className="w-full h-full block overflow-visible"
        >
          <path
            ref={bottomPathRef}
            d="M0,0 L1000,0 L1000,80 L0,80 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Me;
