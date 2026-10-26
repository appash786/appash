"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TextType from "../Text/TextType";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Me = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const clipPathRef = useRef<SVGPathElement>(null);
  const squareTopRef = useRef<HTMLDivElement>(null);
  const squareBottomRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);

  const [startTyping, setStartTyping] = useState(false);
  type Breakpoint = "xs" | "mobile" | "md" | "lg" | "xl";
  const getBreakpoint = (w: number): Breakpoint => {
    if (w < 480) return "xs";
    if (w < 768) return "mobile";
    if (w < 1024) return "md";
    if (w < 1280) return "lg";
    return "xl";
  };
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xl");
  const isMobile = breakpoint === "xs" || breakpoint === "mobile";

  useEffect(() => {
    const checkMobile = () => setBreakpoint(getBreakpoint(window.innerWidth));
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useGSAP(
    () => {
      const getMeClipPath = (topY: number, bottomY: number) => {
        const topCtrl = (topY / 1000).toFixed(4);
        const bottomCtrl = ((1000 + bottomY) / 1000).toFixed(4);
        return `M 0,0.08 Q 0.5,${topCtrl} 1,0.08 L 1,0.92 Q 0.5,${bottomCtrl} 0,0.92 Z`;
      };

      const bendState = { topY: 80, bottomY: 0 };
      const TOP_BENT = 230;
      const BOTTOM_BENT = -150;

      const applyBend = () => {
        if (clipPathRef.current) {
          clipPathRef.current.setAttribute(
            "d",
            getMeClipPath(bendState.topY, bendState.bottomY),
          );
        }
      };

      const mobileCheck = breakpoint === "xs" || breakpoint === "mobile";
      const tabletCheck = breakpoint === "md";
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Handle reduced motion or static mobile clip-path defaults if needed,
      // but let the entrance animations run for mobile!
      if (prefersReducedMotion) {
        bendState.topY = TOP_BENT;
        bendState.bottomY = BOTTOM_BENT;
        applyBend();
        if (squareTopRef.current && squareBottomRef.current) {
          gsap.set([squareTopRef.current, squareBottomRef.current], {
            scale: 1,
            opacity: 1,
          });
        }
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top center",
          onEnter: () => setStartTyping(true),
        });
        return;
      }

      if (mobileCheck) {
        // xs + mobile: apply final bent state statically (prevent janky scrub)
        bendState.topY = TOP_BENT;
        bendState.bottomY = BOTTOM_BENT;
        applyBend();
      } else if (tabletCheck) {
        // md: lighter scrub to avoid performance issues on tablets
        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top +=900",
              end: "top top",
              scrub: 0.6,
            },
          })
          .to(bendState, { topY: TOP_BENT, ease: "none", onUpdate: applyBend });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "bottom bottom",
              end: "bottom center",
              scrub: 0.6,
            },
          })
          .to(bendState, { bottomY: BOTTOM_BENT, ease: "none", onUpdate: applyBend });

        applyBend();
      } else {
        // lg + xl: full desktop scrub animations
        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top +=800",
              end: "top top",
              scrub: 0.4,
            },
          })
          .to(bendState, { topY: TOP_BENT, ease: "none", onUpdate: applyBend });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "bottom bottom",
              end: "bottom center",
              scrub: 0.4,
            },
          })
          .to(bendState, { bottomY: BOTTOM_BENT, ease: "none", onUpdate: applyBend });

        applyBend();
      }

      // Rotated squares: scale in from 0 -> 1 as the section enters (Works on Mobile & Desktop)
      if (squareTopRef.current && squareBottomRef.current) {
        gsap.set([squareTopRef.current, squareBottomRef.current], {
          scale: 0,
          opacity: 0,
        });

        const squareTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
        });

        squareTl.fromTo(
          [squareTopRef.current, squareBottomRef.current],
          { scale: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: "back.out(1.7)",
            duration: 0.6,
            stagger: 0.5,
          },
        );
      }

      // Typing animation trigger
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        onEnter: () => setStartTyping(true),
      });

      // Parallax effects: disabled on xs/mobile, lighter on md, full on lg/xl
      if (!mobileCheck) {
        const parallaxY = tabletCheck ? 70 : 120;
        const contentShift = tabletCheck ? -50 : -80;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          })
          .to([bgRef.current, squareBottomRef.current, squareTopRef.current], {
            translateY: parallaxY,
            ease: "none",
          });

        gsap.to([contentRef.current], {
          y: contentShift,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* SVG ClipPath Definition for dynamic curved mask */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="meClip" clipPathUnits="objectBoundingBox">
            <path
              ref={clipPathRef}
              d="M 0,0.08 Q 0.5,0.08 1,0.08 L 1,0.92 Q 0.5,0.92 0,0.92 Z"
            />
          </clipPath>
        </defs>
      </svg>

      {/* Clipped Red Background & Portrait Image */}
      <div
        className="absolute inset-0 z-10 w-full h-full bg-gradient-to-br from-red-600 to-red-700 pointer-events-none"
        style={{ clipPath: "url(#meClip)", WebkitClipPath: "url(#meClip)" }}
      >
        <Image
          src={
            breakpoint === "xs" || breakpoint === "mobile"
              ? "/Assets/Images/MeMobile.webp"
              : "/Assets/Images/image_1.webp"
          }
          alt="Portrait of Appash"
          fill
          ref={bgRef}
          unoptimized={true}
          className="object-cover pointer-events-none"
          sizes="(max-width: 768px) 100vw, 40vw"
          priority
        />
      </div>

      <div className="absolute z-10 flex justify-end h-screen w-full pointer-events-none">
        <div className="w-[50%] relative z-10 h-full">
          <div
            ref={squareTopRef}
            className="w-[150px] h-[200px] xl:w-[210px] xl:h-[290px] bg-amber-50 absolute border-solid border-[6px] border-red-50 overflow-hidden xl:right-50 rotate-12 xl:top-3/7 top-10 xl:left-2/5  right-10"
          >
            <Image
              src="/Assets/Images/ImagePc.webp"
              alt="Portrait of Appash using pc"
              fill
              unoptimized={true}
              className="z-6 object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
          </div>
          <div
            ref={squareBottomRef}
            className="w-[150px] h-[200px] xl:w-[200px] xl:h-[300px] bg-amber-50 absolute  lg:left-90 border-solid border-[6px] border-red-50 xl:-rotate-12  right-10 xl:bottom-35 lg:top-30 lg:bottom-2 lg:left-30 lg:-rotate-20"
          >
            <Image
              src="/Assets/Images/ImageViolin.webp"
              alt="Portrait of Appash playing Violin"
              fill
              unoptimized={true}
              className="z-6 object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full flex justify-center h-full min-h-screen">
        <div className="md:order-2 flex flex-col mb-15 items-center xl:justify-center justify-end text-center px-6 py-16 md:py-24">
          <div ref={contentRef} className="flex justify-between mt-30 flex-col">
            <div className="flex flex-col items-center justify-center h-[90%]">
              <h3 className="font-sans mb-2 font-semibold uppercase text-[3rem] lg:text-[4rem] xl:text-[5rem] leading-[1.05] text-white tracking-tight whitespace-pre-line">
                Hello,{" "}
              </h3>
              <TextType
                as="p"
                text={["I'm Appash"]}
                startTyping={startTyping}
                loop={false}
                typingSpeed={100}
                showCursor={true}
                cursorCharacter="|"
                className="font-sans font-semibold uppercase text-[3rem] lg:text-[4rem] xl:text-[5rem] leading-[1.05] text-white tracking-tight whitespace-pre-line"
              />

              <p className="mt-2 xl:mt-5 max-w-xl text-white/85 text-xs xl:text-lg  md:text-sm leading-tight tracking-wide ">
I’m a self-taught creative with a passion for design, video, and web development. I explore ideas, experiment with different mediums, and turn what I learn into work that speaks for itself.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Me;