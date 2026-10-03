"use client"
import { useRef ,useState,useCallback , useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DecryptedText from "@/components/Text/DecryptedText"
import VisualHero from "@/components/ThreeJs/VisualHero";

// ─── Main Hero (The scroll logic) ───
const CURVE_PATH_D =
  "M -150 260 C 180 160, 420 180, 720 440 C 980 680, 1220 700, 1550 670";
const CURVE_PATH_S =
  "M 359.7 34.4 C 175.0 -18.0, 100.9 80.0, 100.9 163.8 C 100.9 300.0, 340.0 420.0, 247.1 602.6 C 200.6 693.9, 80.0 646.0, -5.2 646.0";

const CURVE_PATH_S_REV =
  "M -5.2 646.0 C 80.0 646.0, 200.6 693.9, 247.1 602.6 C 340.0 420.0, 100.9 300.0, 100.9 163.8 C 100.9 80.0, 175.0 -18.0, 359.7 34.4";

const heroTechItems = [
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

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const curveRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const maskStrokeRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGPolygonElement>(null);
  const maskHeadRef = useRef<SVGPolygonElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const mouse = useRef<[number, number]>([0, 0]);

  const [readyCount, setReadyCount] = useState(0);
  const isReady = readyCount >= 2;
  const onSceneReady = useCallback(() => setReadyCount((n) => n + 1), []);
  const cameraZ = useRef({ value: 5 });
  const [revealActive, setRevealActive] = useState(false);
  const isAutoScrolling = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const toolsString = useMemo(() => {
    const single =
      heroTechItems.map((item) => item.toUpperCase()).join("  ✦  ") + "  ✦  ";
    return single.repeat(5);
  }, []);

  useGSAP(
    () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      }
      if (!isReady) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 1.2,
          snap: {
            snapTo: (value) => (value >= 0.5 ? 1 : 0),
            duration: { min: 0.5, max: 0.9 },
            delay: 0.05,
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            // Trigger when clip mask animation reaches 95% (duration 1.0 -> time 0.95)
            const currentTime = self.progress * tl.duration();
            if (currentTime >= 0.9) {
              setRevealActive(true);
            } else {
              setRevealActive(false);
            }

            // Once user scrolls past 50% downwards, auto-scroll to completion without needing further scrub/scroll
            if (
              self.direction === 1 &&
              self.progress >= 0.5 &&
              self.progress < 0.95 &&
              !isAutoScrolling.current
            ) {
              isAutoScrolling.current = true;
              const target = self.end;
              const lenis = (window as any).__lenis;
              if (lenis) {
                lenis.scrollTo(target, {
                  duration: 1.0,
                  onComplete: () => {
                    isAutoScrolling.current = false;
                  },
                });
              } else {
                const scrollObj = { y: window.scrollY };
                gsap.to(scrollObj, {
                  y: target,
                  duration: 1.0,
                  ease: "power2.out",
                  onUpdate: () => window.scrollTo(0, scrollObj.y),
                  onComplete: () => {
                    isAutoScrolling.current = false;
                  },
                });
              }
            } else if (
              self.direction === -1 &&
              self.progress <= 0.5 &&
              self.progress > 0.05 &&
              !isAutoScrolling.current
            ) {
              isAutoScrolling.current = true;
              const target = self.start;
              const lenis = (window as any).__lenis;
              if (lenis) {
                lenis.scrollTo(target, {
                  duration: 1.0,
                  onComplete: () => {
                    isAutoScrolling.current = false;
                  },
                });
              } else {
                const scrollObj = { y: window.scrollY };
                gsap.to(scrollObj, {
                  y: target,
                  duration: 1.0,
                  ease: "power2.out",
                  onUpdate: () => window.scrollTo(0, scrollObj.y),
                  onComplete: () => {
                    isAutoScrolling.current = false;
                  },
                });
              }
            } else if (self.progress >= 0.98 || self.progress <= 0.02) {
              isAutoScrolling.current = false;
            }
          },
        },
      });
      // 1. Morph Phase: Clip-path the mask wrapper to create the cropped box (duration 1.0)

      tl.fromTo(
        maskRef.current,
        { clipPath: "inset(0% 0% 0% 0% round 0px)" },
        {
          clipPath: isMobile
            ? "inset(31% 8% 31% 8% round 0px)"
            : "inset(12% 35% 12% 35% round 0px)",
          ease: "power2.inOut",
          duration: 1,
        },
        0,
      );

      // 2. Text phase: Fade out big text layer
      const bigText = containerRef.current?.querySelector(".hero-text-layer");
      if (bigText) {
        tl.to(
          bigText,
          {
            opacity: 0,
            y: 0,
            duration: 0.3,
          },
          0,
        );
      }

      // 3. ZOOM EFFECT: On desktop animate camera Z; on mobile animate CSS scale
      if (isMobile) {
        const mobileFg =
          containerRef.current?.querySelector(".mobile-fg-scale");
        if (mobileFg) {
          tl.fromTo(
            mobileFg,
            { scale: 0.7 },
            {
              scale: 0.49, // visually matches cameraZ 5 → 10.25 zoom-out
              ease: "power2.inOut",
              duration: 1,
            },
            0,
          );
        }
      } else {
        tl.fromTo(
          cameraZ.current,
          { value: 5 },
          {
            value: 6.5,
            ease: "power2.inOut", // 👈 Match this to the clipPath ease
            duration: 1, // 👈 Match this to the clipPath duration (1)
          },
          0, // 👈 Start exactly when the clipPath starts
        );
      }

      // 4. Ribbon wipe: fire free-running when scroll hits 90% — not scrubbed
      if (pathRef.current) {
        const path = pathRef.current;
        const totalLength = path.getTotalLength();

        // Reset mask to hidden
        if (maskStrokeRef.current) {
          maskStrokeRef.current.style.strokeDasharray = `${totalLength}`;
          maskStrokeRef.current.style.strokeDashoffset = `${totalLength}`;
        }

        const ribbonStarted = { fired: false };

        const updateWipe = (p: number) => {
          const currentLength = p * totalLength;
          if (maskStrokeRef.current) {
            maskStrokeRef.current.style.strokeDashoffset = `${totalLength - currentLength}`;
          }

          if (headRef.current && maskHeadRef.current) {
            if (p <= 0.005) {
              headRef.current.style.opacity = "0";
              maskHeadRef.current.style.opacity = "0";
            } else {
              headRef.current.style.opacity = "1";
              maskHeadRef.current.style.opacity = "1";

              const pt = path.getPointAtLength(currentLength);
              const ptAhead = path.getPointAtLength(
                Math.min(totalLength, currentLength + 2),
              );
              const angle =
                (Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x) * 180) /
                Math.PI;

              const transform = `translate(${pt.x}, ${pt.y}) rotate(${angle})`;
              headRef.current.setAttribute("transform", transform);
              maskHeadRef.current.setAttribute("transform", transform);
            }
          }
        };

        updateWipe(0);

        // At 90% scroll progress — launch the free-running wipe tween
        tl.call(
          () => {
            if (ribbonStarted.fired) return;
            ribbonStarted.fired = true;

            const wipeObj = { progress: 0 };
            gsap.to(wipeObj, {
              progress: 1,
              duration: 2.4,
              ease: "expo.inOut",
              delay: 0.05,
              onUpdate: () => updateWipe(wipeObj.progress),
              onComplete: () => {
                // Hide pointed head cleanly
                if (headRef.current) headRef.current.style.opacity = "0";
                if (maskHeadRef.current)
                  maskHeadRef.current.style.opacity = "0";

                // Start infinite text marquee only after ribbon fully draws in
                if (textRef.current && textPathRef.current) {
                  let singleLoopLength = 1600;
                  try {
                    const total = textRef.current.getComputedTextLength();
                    if (total > 0) singleLoopLength = total / 5;
                  } catch {
                    /* fallback */
                  }

                  gsap.fromTo(
                    textPathRef.current,
                    { attr: { startOffset: 0 } },
                    {
                      attr: { startOffset: -singleLoopLength },
                      duration: 28,
                      repeat: -1,
                      ease: "none",
                    },
                  );
                }
              },
            });
          },
          [],
          0.9,
        );
      }

      // 5. Background text: Bring into view as clip mask nears completion (0.8 -> 1.0)
      tl.fromTo(
        contentSectionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.3 },
        0.8,
      );

      // Trigger DecryptedText exactly at 95% of the clip mask animation
      tl.call(() => setRevealActive(true), [], 0.15);

      // Force ScrollTrigger to sort by DOM order and refresh layout calculations
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    },
    { scope: containerRef, dependencies: [isReady] },
  );

  const onMove = (e: React.MouseEvent) => {
    // Parallax logic remains responsive to the viewport
    mouse.current = [
      (e.clientX / window.innerWidth) * 2 - 1,
      -((e.clientY / window.innerHeight) * 2 - 1),
    ];
  };

  return (
    <div
      ref={containerRef}
      id="Hero"
      className="relative mb-20 h-[90vh] xl:h-screen z-10 "
      onMouseMove={onMove}
    >
      {/* 
        The Mask: It holds the full-size visual but shrinks the viewable area.
        Keeping content inside fixed at w-screen/h-screen is the fix.
      */}
      <div
        ref={maskRef}
        className="fixed top-0 left-0 w-screen h-screen z-50 pointer-events-none"
        style={{ willChange: "clip-path" }}
      >
        {/* Changed w-screen/h-screen to w-full/h-full */}

        <VisualHero
          mouse={mouse}
          onReady={onSceneReady}
          isReady={isReady}
          cameraZ={cameraZ}
        />
      </div>

      {/* Background Curved Line with Flowing Tech Tools */}
      <div
        ref={curveRef}
        className="absolute inset-0 w-full h-screen pointer-events-none z-40 overflow-hidden"
      >
        <svg
          className="w-full h-full"
          viewBox={isMobile ? "0 0 344 674" : "0 0 1440 900"}
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Guide path for textPath and measurements */}
            <path
              id="hero-tool-curve"
              ref={pathRef}
              d={isMobile ? CURVE_PATH_S_REV : CURVE_PATH_D}
              fill="none"
            />

            {/* Mask to wipe the ribbon top to down */}
            <mask id="hero-wipe-mask" maskUnits="userSpaceOnUse">
              <path
                ref={maskStrokeRef}
                d={isMobile ? CURVE_PATH_S_REV : CURVE_PATH_D}
                fill="none"
                stroke="white"
                strokeWidth="52"
                strokeLinecap="butt"
              />
              <polygon
                ref={maskHeadRef}
                points="-4,-22 28,0 -4,22"
                fill="white"
              />
            </mask>
          </defs>

          {/* Group masked to wipe from top to down */}
          <g mask="url(#hero-wipe-mask)">
            {/* Main solid black curved ribbon */}
            <path
              d={isMobile ? CURVE_PATH_S_REV : CURVE_PATH_D}
              fill="none"
              stroke="#0a0a0a"
              strokeWidth="30"
              strokeLinecap="butt"
            />

            {/* Flowing tools text inside the ribbon */}
            <text
              ref={textRef}
              dominantBaseline="central"
              alignmentBaseline="central"
              className="select-none uppercase font-mono font-bold"
              style={{
                fontSize: "12px",
                fill: "#ffffff",
                letterSpacing: "0.22em",
              }}
            >
              <textPath
                ref={textPathRef}
                href="#hero-tool-curve"
                startOffset="0"
              >
                {toolsString}
              </textPath>
            </text>
          </g>

          {/* Visible pointed head attached to the leading edge of the wipe */}
          <polygon
            ref={headRef}
            points="-2,-18 24,0 -2,18"
            fill="#0a0a0a"
            style={{ opacity: 0 }}
          />
        </svg>
      </div>

      {/* This is the content behind that fades in at the end of the scroll */}
      <div
        ref={contentSectionRef}
        className="h-screen bg-am w-full relative z-[60] xl:grid flex justify-center   flex-col  xl:grid-cols-[minmax(0,1fr)_30vw_minmax(0,1fr)] items-center pointer-events-none text-white px-4 md:px-10 opacity-0"
      >
        {/* Left Column Text */}
        <div className="flex  flex-col justify-center items-end text-right pr-4 md:pr-10 pointer-events-auto min-w-0 w-full">
          <div className={`text-[5vw] md:text-[3vw] leading-[0.95] uppercase`}>
            <div className="whitespace-nowrap">
              <div
                className="HeroText uppercase cursor-pointer"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 3.8rem)",
                  lineHeight: 0.95,
                }}
              >
                <div>
                  <DecryptedText
                    text="Creative"
                    trigger={revealActive}
                    animateOn="inViewHover"
                    revealDirection="end"
                    sequential
                    speed={60}
                    maxIterations={12}
                  />
                </div>
                <div className="font-bold text-[#A50000]">
                  <DecryptedText
                    text="Developer"
                    trigger={revealActive}
                    animateOn="inViewHover"
                    revealDirection="end"
                    sequential
                    speed={60}
                    maxIterations={12}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Space (Empty spacer matching width of the masked hero scene) */}
        <div className="w-[30vw]  h-[40vh] xl:h-full pointer-events-none" />

        {/* Right Column Text */}
        <div className="flex  flex-col justify-center items-start text-left pl-4 md:pl-10 pointer-events-auto min-w-0 w-full">
          <div className={`text-[5vw] md:text-[3vw] leading-[0.95] uppercase`}>
            <div className="whitespace-nowrap">
              <div
                className="HeroText uppercase cursor-pointer"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 3.8rem)",
                  lineHeight: 0.95,
                }}
              >
                <div className="font-bold text-[#A50000]">
                  <DecryptedText
                    text="Multimedia"
                    trigger={revealActive}
                    animateOn="inViewHover"
                    revealDirection="start"
                    sequential
                    speed={60}
                    maxIterations={12}
                  />
                </div>
                <div className="">
                  <DecryptedText
                    text="Designer"
                    trigger={revealActive}
                    animateOn="inViewHover"
                    revealDirection="start"
                    sequential
                    speed={60}
                    maxIterations={12}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
