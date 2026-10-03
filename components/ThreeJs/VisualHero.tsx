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
  const [isMobile, setIsMobile] = useState(false);
  const [canvasesOn, setCanvasesOn] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);

    // Start AFTER the first paint, when the main thread is idle.
    const start = () => {
      if (mql.matches) {
        // Mobile never loads WebGL: the poster IS the hero.
        // Hero waits for readyCount >= 2 before building its scroll timeline.
        onReady();
        onReady();
      } else {
        setCanvasesOn(true);
      }
    };
    const hasRIC = "requestIdleCallback" in window;
    const id = hasRIC
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 300);

    return () => {
      mql.removeEventListener("change", handler);
      if (hasRIC) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, [onReady]);

  // Desktop poster is replaced by the canvases once they have drawn.
  const hidePoster = isReady && !isMobile;

  return (
    <div style={{ position: "absolute", inset: 0, width: "100vw", height: "100vh", overflow: "hidden" }}>
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
            <source media="(max-width: 768px)" srcSet="/Assets/Images/BgMobile.webp" />
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
            <source media="(min-width: 769px)" srcSet="/Assets/Images/appash.webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Assets/Images/appash_Full.webp"
              alt=""
              fetchPriority="high"
              decoding="async"
              className="hero-fg-poster"
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
          <div className="w-full flex z-22 xl:justify-between justify-center items-center xl:flex-row flex-col xl:items-center h-[40vh]">
            <div className="xl:w-[45%] w-full flex justify-center xl:justify-end ">
              <h1 className="xl:text-5xl text-3xl leading-7 xl:leading-11 font-bold uppercase text-center italic ">
                <span className="float-right">
                  {" "}
                  <BlockReveal className=" text-black block" color="#A50000" delay={0.15} duration={1.2}>
                    <p className=" text-white block mr-3">Kerala&apos;s best</p>
                  </BlockReveal>
                </span>{" "}
                <br />
                <BlockReveal className=" text-black block" color="#A50000" delay={0.25} duration={1.2}>
                  <span className="mr-15 text-white">website </span>
                  <span className="text-white mr-2"> frontend</span>
                </BlockReveal>
                <br />
                <BlockReveal className=" text-black block" color="#A50000" delay={0.3} duration={1.2}>
                  <span className="mr-10 text-white">Developer</span>
                </BlockReveal>
              </h1>
            </div>
            <div className="xl:w-[45%] px-4 mt-4 xl:mt-0 mb-20 xl:mb-0 xl:px-0 ">
              <p className="max-w-lg text-center text-xs xl:text-left text-white/80">
                {/* TODO: replace this placeholder copy with your real intro */}
                This is looking very close to the reference — deep top bend, centered text, rotated squares fully
                scaled in on the right, and the photo bleeding on the left (currently gray placeholder). Let&apos;s
                check the scale-in mid-transition and the bottom bend
              </p>
            </div>
          </div>

          <div className="w-full h-[70vh] bg-gradient-to-t from-black/70 via-black/0 to-transparent absolute z-21" />
        </div>
      </div>
    </div>
  );
}
