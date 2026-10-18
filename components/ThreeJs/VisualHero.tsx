"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BlockReveal from "../Text/BlockReveal";
import "./Styles.css";

// three + @react-three/fiber live ONLY in this chunk. ssr:false is fine here
// because the poster below is already painted by the time this loads.
const HeroCanvases = dynamic(() => import("./HeroCanvases"), { ssr: false });

const layer: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
};

export default function VisualHero({ mouse, onReady, isReady, cameraZ }: any) {
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
  const [canvasesOn, setCanvasesOn] = useState(false);

  useEffect(() => {
    const update = () => {
      const bp = getBreakpoint(window.innerWidth);
      setBreakpoint(bp);
      return bp;
    };

    const initialBp = update();

    const start = () => {
      // xs and mobile skip WebGL: poster IS the hero
      if (initialBp === "xs" || initialBp === "mobile") {
        onReady();
        onReady();
      } else {
        setCanvasesOn(true);
      }
    };

    window.addEventListener("resize", update);
    const hasRIC = "requestIdleCallback" in window;
    const id = hasRIC
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 300);

    return () => {
      window.removeEventListener("resize", update);
      if (hasRIC) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, [onReady]);

  // Desktop poster is replaced by the canvases once they have drawn.
  const hidePoster = isReady && !isMobile;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* GSAP scales this element, so poster + canvases + text scale together */}
      <div
        className="visual-hero-container"
        style={{ ...layer, transformOrigin: "center center" }}
      >
        {/* ── POSTER: server-rendered, visible immediately, LCP candidate ── */}
        <div
          style={{
            ...layer,
            zIndex: 1,
            background: "#000",
            pointerEvents: "none",
            opacity: hidePoster ? 0 : 1,
            // wait for the canvas fade-in to finish before removing the poster
            transition: hidePoster ? "opacity 0s linear 0.7s" : "none",
          }}
        >
          <picture style={{ display: "contents" }}>
            {/* xs: very small phones */}
            <source
              media="(max-width: 479px)"
              srcSet="/Assets/Images/BgMobile.webp"
            />
            {/* mobile: standard phones */}
            <source
              media="(max-width: 767px)"
              srcSet="/Assets/Images/BgMobile.webp"
            />
            {/* md: tablets */}
            <source
              media="(max-width: 1023px)"
              srcSet="/Assets/Images/bg.webp"
            />
            {/* lg + xl: desktops */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Assets/Images/bg.webp"
              alt=""
              fetchPriority="high"
              decoding="async"
              style={{ ...layer, objectFit: "cover", objectPosition: "center" }}
            />
          </picture>
        </div>

        <div
          className="mobile-fg-scale"
          style={{
            ...layer,
            zIndex: 20,
            pointerEvents: "none",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            transformOrigin: "center center",
            opacity: hidePoster ? 0 : 1,
            transition: hidePoster ? "opacity 0s linear 0.7s" : "none",
          }}
        >
          <picture style={{ display: "contents" }}>
            {/* lg + xl desktops: full-frame WebGL-matching crop */}
            <source
              media="(min-width: 1024px)"
              srcSet="/Assets/Images/appash.webp"
            />
            {/* md tablets: contained portrait */}
            <source
              media="(min-width: 768px)"
              srcSet="/Assets/Images/appash.webp"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Assets/Images/appash_Full.webp"
              alt=""
              fetchPriority="high"
              decoding="async"
              // xs/mobile: fit the screen HEIGHT (width auto, no max-width cap).
              // md (768px+): cover the whole frame like the WebGL scene does.
              // lg/xl (1024px+): same cover behaviour.
              className="h-full w-auto max-w-none object-contain object-bottom min-[768px]:w-full min-[768px]:object-cover min-[768px]:object-center"
            />
          </picture>
        </div>

        {/* ── WEBGL: mounted after idle, fades in over the poster ── */}
        {canvasesOn && (
          <div
            style={{
              ...layer,
              zIndex: 2,
              pointerEvents: "none",
              opacity: isReady ? 1 : 0,
              transition: "opacity 0.6s",
            }}
          >
            <HeroCanvases mouse={mouse} onReady={onReady} cameraZ={cameraZ} />
          </div>
        )}

        <div
          className="hero-text-layer"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 23,
            display: "flex",
            alignItems: "end",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          {/* NOT gated by isReady any more: the heading is real HTML from the first paint */}
          <div className="w-full flex z-22  xl:justify-center xl:items-center flex-col  h-[40vh]">
            <div className="xl: w-full flex mt-10 xl:mt-0  justify-center  ">
              <h1 className="xl:text-5xl text-2xl uppercase xl:leading-tight  text-center  ">
                <span className="font-semibold">Appash Appanath .</span> <br />
                Design & code for brands
                <br />
                that want more.
              </h1>
            </div>

            <div className="relative z-[9999] pointer-events-auto flex flex-col lg:justify-center sm:flex-row items-center gap-2 mt-3 px-4">
              <a
                href="#form-section"
                className="w-full sm:w-auto px-6 py-3 text-center font-medium text-white bg-[#A50000] hover:text-[#A50000] cursor-pointer z-1000 hover:bg-[#FFFDF4] transition-colors shadow-md"
              >
                Get Started
              </a>

              <a
                href="https://wa.me/+916282238163"
                className="w-full sm:w-auto px-6 py-3 text-center font-medium text-gray-300 border border-gray-700  hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>WhatsApp Me</span>
                
              </a>
            </div>
          </div>

          <div className="w-full h-[70vh] bg-gradient-to-t from-black/70 via-black/0 to-transparent absolute z-21" />
        </div>
      </div>
    </div>
  );
}
