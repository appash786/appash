"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import PixelRevealText from "../Text/PixelText";
import SplitText from "../Text/SplitText";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PhotoTile {
  src: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width: string;
  aspectRatio: string;
  /** px the box drifts horizontally as the section scrolls */
  boxSpeed: number;
  /** inner image counter-drifts to avoid empty edges */
  imgSpeed: number;
  /** optional slight rotation for organic feel */
  rotate?: number;
}

interface TextBlock {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  text: string;
  maxWidth?: string;
  isPixel?: boolean;
}

interface AboutSectionProps {
  /** Pass the horizontal tween so parallax runs against it */
  containerAnimation?: gsap.core.Tween;
  isMobile?: boolean;
}

// ─── Story Copy ───────────────────────────────────────────────────────────────

const text1 =
  "I'm Appash — a self-taught frontend developer and designer based in Kerala, India. I craft immersive web experiences where clean code meets striking visual aesthetics.";

const text2 =
  "My journey started with a curiosity for how things are built on the web. Over the years, that curiosity evolved into a passion for writing pixel-perfect React code and building seamless animations.";

const text3 =
  "But I don't just write code. I believe that a developer should also understand branding, design, and identity. That's why I picked up the camera—to capture stories and express ideas visually.";

const text4 =
  "Whether I'm debugging WebGL shaders or crafting the composition and lighting for a shoot, I approach every project with a meticulous eye for detail and a drive to create something memorable.";

const text5 =
  "Ultimately, I build experiences that connect. Let's collaborate and bring your brand's digital story to life.";

// ─── Layout data (Centering the first section: Headline & Image 1 at 39vw) ─────

const aboutPhotos: PhotoTile[] = [
  // Image 1 — large red-lit portrait, left (aligns under headline, centered horizontally at start)
  {
    src: "Assets/Images/Image_1.jpg",
    top: "28%",
    left: "100vw",
    width: "22vw",
    aspectRatio: "3/4",
    boxSpeed: -180,
    imgSpeed: 100,
  },
  // Image 2 — gaming chair, laptop in dark room
  {
    src: "Assets/Images/Image_2.jpg",
    top: "52%",
    left: "148vw",
    width: "20vw",
    aspectRatio: "4/3",
    boxSpeed: 140,
    imgSpeed: 100,
    rotate: 1,
  },
  // Image 3 — stripe studio background portrait
  {
    src: "Assets/Images/Image_3.jpg",
    top: "10%",
    left: "194vw",
    width: "18vw",
    aspectRatio: "2/3",
    boxSpeed: -120,
    imgSpeed: 100,
    rotate: 0,
  },
  // Image 4 — sitting outdoor with laptop on table
  {
    src: "Assets/Images/Image_4.jpg",
    top: "42%",
    left: "240vw",
    width: "28vw",
    aspectRatio: "16/10",
    boxSpeed: 160,
    imgSpeed: 100,
    rotate: -0.8,
  },
  // Image 5 — writing on a whiteboard
  {
    src: "Assets/Images/Image_6.jpg",
    top: "12%",
    left: "296vw",
    width: "20vw",
    aspectRatio: "3/4",
    boxSpeed: -150,
    imgSpeed: 100,
    rotate: 0,
  },
];

const aboutTextBlocks: TextBlock[] = [
  // Text 1 — right of image 1 (Panel 1)
  {
    top: "35%",
    left: "124vw",
    text: text1,
    maxWidth: "18vw",
    isPixel: false,
  },
  // Text 2 — right of Image 2 (Panel 1/2 transition)
  {
    top: "56%",
    left: "170vw",
    text: "CURIOUS ABOUT THE WEB / CRAFTING PIXEL-PERFECT ",
    maxWidth: "20vw",
    isPixel: true,
  },
  // Text 3 — right of Image 3 (Panel 2)
  {
    top: "20%",
    left: "214vw",
    text: text3,
    maxWidth: "20vw",
    isPixel: false,
  },
  // Text 4 — right of Image 4 (Panel 2/3 transition)
  {
    top: "48%",
    left: "270vw",
    text: "DEBUGGING SHADERS / VISUAL STORYTELLING",
    maxWidth: "20vw",
    isPixel: true,
  },
  // Text 5 — right of Image 5 (Panel 3)
  {
    top: "20%",
    left: "318vw",
    text: text5,
    maxWidth: "20vw",
    isPixel: false,
  },
];

// ─── Sub-component: single parallax photo tile ────────────────────────────────

const PhotoCard = ({
  tile,
  containerAnimation,
  isMobile,
}: {
  tile: PhotoTile;
  containerAnimation?: gsap.core.Tween;
  isMobile: boolean;
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isMobile || !containerAnimation) return;

    const ctx = gsap.context(() => {
      const trigger: ScrollTrigger.Vars = {
        trigger: triggerRef.current, // Use the static wrapper as the trigger to prevent feedback loops
        start: "left right",
        end: "right left",
        scrub: true,
        containerAnimation,
        invalidateOnRefresh: true,
      };

      // Inner image counter-drifts horizontally
      gsap.fromTo(
        imgRef.current,
        { x: -tile.imgSpeed * 0.5 },
        {
          x: tile.imgSpeed * 0.5,
          ease: "none",
          scrollTrigger: trigger,
        },
      );
    });

    return () => ctx.revert();
  }, [containerAnimation, isMobile, tile.boxSpeed, tile.imgSpeed]);

  const posStyle: React.CSSProperties = {
    position: "absolute",
    width: tile.width,
    top: tile.top,
    bottom: tile.bottom,
    left: tile.left,
    right: tile.right,
    aspectRatio: tile.aspectRatio,
    overflow: "hidden",
    transform: `rotate(${tile.rotate ?? 0}deg)`,
    willChange: "transform",
  };

  return (
    <div ref={triggerRef} style={posStyle}>
      <div
        ref={boxRef}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
        }}

        
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={tile.src}
          className="group"
          alt=""
          style={{
            width: "130%", // overshoot horizontally to allow horizontal counter-drift without showing edges
            height: "115%", // overshoot vertically for rotation safety
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
            position: "absolute",
            left: "-15%", // center horizontal overshoot
            top: "-7.5%", // center vertical overshoot
            willChange: "transform",
          }}
        />
      </div>
    </div>
  );
};

// ─── Sub-component: single scroll-reveal text block ───────────────────────────

const TextCard = ({
  block,
  containerAnimation,
  isMobile,
}: {
  block: TextBlock;
  containerAnimation?: gsap.core.Tween;
  isMobile: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const posStyle: React.CSSProperties = {
    position: "absolute",
    top: block.top,
    bottom: block.bottom,
    left: block.left,
    right: block.right,
    maxWidth: block.maxWidth ?? "22vw",
    margin: 0,
    zIndex: 10,
  };

  useEffect(() => {
    if (isMobile || !containerAnimation || !block.isPixel) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "left 85%", // Trigger once when card hits 85% of screen width
        once: true,
        containerAnimation,
        onEnter: () => setIsRevealed(true),
      });
    });

    return () => ctx.revert();
  }, [containerAnimation, isMobile, block.isPixel]);

  if (block.isPixel) {
    const lines = block.text.split(" / ");
    return (
      <div ref={cardRef} style={posStyle} className="flex flex-col gap-0">
        {lines.map((line, idx) => (
          <div key={idx} className="whitespace-nowrap">
            <PixelRevealText
              text={line}
              gridSize={16} // smaller pixels for smaller text
              className="uppercase text-white font-bold"
              style={{
                fontSize: "clamp(1.1rem, 1.6vw, 2.5rem)",
                lineHeight: 0.95,
              }}
              active={isMobile ? undefined : isRevealed}
            />
          </div>
        ))}
      </div>
    );
  }

  const shouldRenderSplit = isMobile || !!containerAnimation;

  if (!shouldRenderSplit) {
    // Render static paragraph invisible during initialization to prevent layout flash and race conditions
    return (
      <p
        style={{
          ...posStyle,
          color: "rgba(255,255,255,0.85)",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "clamp(14px, 1.0vw, 20px)",
          lineHeight: 1.7,
          opacity: 0,
        }}
      >
        {block.text}
      </p>
    );
  }

  return (
    <div style={posStyle}>
      <SplitText
        text={block.text}
        tag="p"
        textAlign="left"
        splitType="words"
        delay={35}
        duration={0.9}
        ease="power2.out"
        from={{ opacity: 0, y: 15 }}
        to={{ opacity: 1, y: 0 }}
        className="text-[rgba(255,255,255,0.85)] text-xl"
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "clamp(14px, 1.0vw, 20px)",
          lineHeight: 1.7,
        }}
        scrollTrigger={
          !isMobile && containerAnimation
            ? {
                start: "left 90%", // Trigger once when word card hits 90% of screen width
                once: true,
                containerAnimation,
              }
            : undefined
        }
      />
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const About: React.FC<AboutSectionProps> = ({
  containerAnimation: propContainerAnimation,
  isMobile: propIsMobile = false,
}) => {
  const [isMobile, setIsMobile] = useState(propIsMobile);
  const [hasMounted, setHasMounted] = useState(false);

  const parentRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [horizontalTween, setHorizontalTween] =
    useState<gsap.core.Tween | null>(null);

  // ─── 1. Detect mobile ──────────────────────────────────────────────────────
  useEffect(() => {
    const mobileCheck =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      window.innerWidth < 1024;
    setIsMobile(mobileCheck);
    setHasMounted(true);
  }, []);

  // ─── 2. GSAP setup ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hasMounted) return;
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const ctx = gsap.context(() => {
      if (!isMobile) {
        const scrollFactor = 2.6;
        const pinDistance = scrollFactor * window.innerHeight * 1.5;

        // 1. Separate Pin ScrollTrigger to handle vertical pinning when About hits the top of viewport
        ScrollTrigger.create({
          id: "about-pin-trigger",
          trigger: parentRef.current,
          start: "top top", // Pin exactly when top of parent reaches top of viewport
          end: () => `+=${pinDistance}`,
          pin: triggerRef.current,
          pinSpacing: true,
          invalidateOnRefresh: true,
          refreshPriority: -1,
        });

        // 2. Separate Translation ScrollTrigger to start translating horizontally BEFORE hitting the top
        const tween = gsap.to(sectionRef.current, {
          x: () => `-${scrollFactor * window.innerWidth}px`, // Translate by scrollFactor * 100vw
          ease: "none",
          force3D: true,
          scrollTrigger: {
            id: "about-scroll-trigger",
            trigger: parentRef.current,
            start: "top bottom", // Start translating horizontally as soon as parent enters from the bottom of viewport
            end: () => `+=${pinDistance + window.innerHeight}`, // Spans across the entry scroll + pin duration
            scrub: 0.7,
            pin: false, // Do not pin in this trigger (handled by about-pin-trigger)
   
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: -1,
          },
        });

        setHorizontalTween(tween);
      }
    }, parentRef);

    // Force ScrollTrigger to sort and refresh after Three.js and Hero triggers finish loading asynchronously
    const timer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 1000);

    return () => {
      ctx.revert();
      setHorizontalTween(null);
      clearTimeout(timer);
    };
  }, [hasMounted, isMobile]);

  const finalAnimation =
    propContainerAnimation || (horizontalTween ?? undefined);

  // Mobile Styles
  const mobileTextStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "15px",
    lineHeight: 1.7,
    margin: 0,
  };

  const mobileImageWrapperStyle = (aspectRatio: string): React.CSSProperties => ({
    width: "100%",
    aspectRatio,
    overflow: "hidden",
    borderRadius: "4px",
    border: "1px solid rgba(255,255,255,0.1)",
  });

  const mobileImageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <section ref={parentRef} className="h-auto mt-20 z-[10] relative">
      <div
        ref={triggerRef}
        className={!isMobile && hasMounted ? "overflow-hidden" : undefined}
      >
        <div
          ref={sectionRef}
          className={
            !isMobile && hasMounted
              ? "h-screen flex flex-row transform-gpu relative"
              : "flex flex-col w-full"
          }
          style={
            !isMobile && hasMounted
              ? {
                  width: "360vw",
                  background: "",
                }
              : {
                  background: "",
                }
          }
        >
          {/* ── Pixel-font headline ─────────────────────────────────────── */}
          {!isMobile && (
            <div
              style={{
                position: "absolute",
                top: "6%",
                left: "100vw",
                zIndex: 10,
                lineHeight: 1.1,
              }}
            >
              <PixelRevealText
                text="Not just developer"
                gridSize={46}
                className="uppercase text-white"
                style={{ fontSize: "clamp(1.5rem, 3.8vw, 5rem)" }}
              />
              <br />
              <PixelRevealText
                text="A Brand In Progress."
                gridSize={46}
                className="uppercase text-white"
                style={{ fontSize: "clamp(1.5rem, 3.8vw, 5rem)" }}
              />
            </div>
          )}

          {/* ── Floating photos ─────────────────────────────────────────── */}
          {!isMobile &&
            aboutPhotos.map((tile, i) => (
              <PhotoCard
                key={i}
                tile={tile}
                containerAnimation={finalAnimation}
                isMobile={isMobile}
              />
            ))}

          {/* ── Scattered text blocks ───────────────────────────────────── */}
          {!isMobile &&
            aboutTextBlocks.map((block, i) => (
              <TextCard
                key={i}
                block={block}
                containerAnimation={finalAnimation}
                isMobile={isMobile}
              />
            ))}

          {/* ── Mobile stacked layout ───────────────────────────────────── */}
          {isMobile && (
            <div
              style={{
                padding: "120px 20px 60px",
                display: "flex",
                flexDirection: "column",
                gap: "40px",
              }}
            >
              {/* Mobile Headline */}
              <h2
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "20px",
                  color: "#ffffff",
                  margin: "0 0 10px 0",
                  lineHeight: 1.3,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                Not Just A Dev.
                <br />
                A Brand In Progress.
              </h2>

              {/* Story Section 1 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <p style={mobileTextStyle}>{text1}</p>
                <div style={mobileImageWrapperStyle(aboutPhotos[0].aspectRatio)}>
                  <img src={aboutPhotos[0].src} alt="" style={mobileImageStyle} />
                </div>
              </div>

              {/* Story Section 2 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <p style={mobileTextStyle}>{text2}</p>
                <div style={mobileImageWrapperStyle(aboutPhotos[1].aspectRatio)}>
                  <img src={aboutPhotos[1].src} alt="" style={mobileImageStyle} />
                </div>
              </div>

              {/* Story Section 3 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <p style={mobileTextStyle}>{text3}</p>
                <div style={mobileImageWrapperStyle(aboutPhotos[2].aspectRatio)}>
                  <img src={aboutPhotos[2].src} alt="" style={mobileImageStyle} />
                </div>
              </div>

              {/* Story Section 4 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <p style={mobileTextStyle}>{text4}</p>
                <div style={mobileImageWrapperStyle(aboutPhotos[3].aspectRatio)}>
                  <img src={aboutPhotos[3].src} alt="" style={mobileImageStyle} />
                </div>
              </div>

              {/* Story Section 5 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <p style={mobileTextStyle}>{text5}</p>
                <div style={mobileImageWrapperStyle(aboutPhotos[4].aspectRatio)}>
                  <img src={aboutPhotos[4].src} alt="" style={mobileImageStyle} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
