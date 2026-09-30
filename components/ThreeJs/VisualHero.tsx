"use client";

import { Canvas } from "@react-three/fiber";


import BlockReveal from "../Text/BlockReveal";
import {
  useRef,
  useMemo,
  Suspense,
  useState,
  useCallback,
  useEffect,
} from "react";

import DecryptedText from "@/components/Text/DecryptedText";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

import "./Styles.css";

import dynamic from "next/dynamic";
// ✅ Move dynamic import OUTSIDE the component body
const FgScene = dynamic(() => import("./FgScene"), {
  ssr: false,
});
const BgScene = dynamic(() => import("./BgScene"), {
  ssr: false,
});


export default function VisualHero({ mouse, onReady, isReady, cameraZ }: any) {
  const [isMobile, setIsMobile] = useState(false);
  const mobileBgLoaded = useRef(false);
  const mobileFgLoaded = useRef(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Fire onReady for the mobile path once both images have loaded
  const checkMobileReady = useCallback(() => {
    if (mobileBgLoaded.current && mobileFgLoaded.current) {
      onReady(); // call twice to satisfy readyCount >= 2
      onReady();
    }
  }, [onReady]);

  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    zIndex: 10,
  };

  return (
    // Outer shell: fills the mask, clips overflow
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        opacity: isReady ? 1 : 0,
        transition: "opacity 0.6s",
      }}
    >
      {/* 
        Single scaling target — GSAP targets this element.
        Both canvases live inside it, so they scale together.
      */}
      <div
        className="visual-hero-container"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          transformOrigin: "center center",
        }}
      >
        {isMobile ? (
          /* ─── Mobile: lightweight CSS images instead of Three.js ─── */
          <>
            {/* Layer 1 — background (CSS) */}
            <div
              style={{
                ...canvasStyle,
                zIndex: 1,
                pointerEvents: "none",
                background: "#000",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Assets/Images/BgMobile.webp"
                alt=""
                onLoad={() => {
                  mobileBgLoaded.current = true;
                  checkMobileReady();
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center center",
                }}
              />
            </div>

            {/* Layer 3 — foreground person (CSS), animated via .mobile-fg-scale */}
            <div
              className="mobile-fg-scale"
              style={{
                ...canvasStyle,
                zIndex: 20,
                pointerEvents: "none",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                transformOrigin: "center center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Assets/Images/appash_Full.webp"
                alt=""
                onLoad={() => {
                  mobileFgLoaded.current = true;
                  checkMobileReady();
                }}
                style={{
                  width: "auto",
                  height: "100%",
                  maxWidth: "none",
                  objectFit: "contain",
                  objectPosition: "center bottom",
                }}
              />
            </div>
          </>
        ) : (
          /* ─── Desktop: full Three.js with depth parallax ─── */
          <>
            {/* Layer 1 — background */}
            <Canvas
              style={{ ...canvasStyle, zIndex: 1, pointerEvents: "none" }}
              camera={{ position: [0, 0, 5], fov: 75 }}
              onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 1);
                // r3f sets touch-action:none on the canvas element internally;
                // override it so touch/wheel scroll events pass through to the page.
                gl.domElement.style.touchAction = "auto";
                gl.domElement.style.pointerEvents = "none";
              }}
            >
              <Suspense fallback={null}>
                <BgScene onReady={onReady} />
              </Suspense>
            </Canvas>

            {/* Layer 3 — foreground with depth parallax */}
            <Canvas
              style={{ ...canvasStyle, zIndex: 20, pointerEvents: "none" }}
              camera={{ position: [0, 0, 5], fov: 75 }}
              gl={{ antialias: true, alpha: true }}
              onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
                gl.domElement.style.touchAction = "auto";
                gl.domElement.style.pointerEvents = "none";
              }}
            >
              <Suspense fallback={null}>
                <FgScene mouse={mouse} onReady={onReady} cameraZ={cameraZ} />
              </Suspense>
            </Canvas>
          </>
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
            marginBottom: "",
          }}
        >
          {isReady && (
            <div className="w-full  flex z-22 xl:justify-between justify-center items-center xl:flex-row flex-col xl:items-center h-[40vh]">
              <div className="xl:w-[45%] w-full flex justify-center xl:justify-end ">
                <h1 className="xl:text-5xl text-3xl leading-7 xl:leading-11  font-bold uppercase text-center italic ">
                  <span className="float-right">
                    {" "}
                    <BlockReveal
                      className=" text-black block"
                      color="#A50000"
                      delay={0.15}
                      duration={1.2}
                    >
                      <p className=" text-white block mr-3">Kerala's best</p>
                    </BlockReveal>
                  </span>{" "}
                  <br />
                  <BlockReveal
                    className=" text-black block"
                    color="#A50000"
                    delay={0.25}
                    duration={1.2}
                  >
                    <span className="mr-15 text-white">website </span>
                    <span className="text-white mr-2"> frontend</span>
                  </BlockReveal>
                  <br />
                  <BlockReveal
                    className=" text-black block"
                    color="#A50000"
                    delay={0.3}
                    duration={1.2}
                  >
                    <span className="mr-10 text-white">Developer</span>
                  </BlockReveal>
                </h1>
              </div>
              <div className="xl:w-[45%] px-4 mt-4 xl:mt-0 mb-20  xl:mb-0 xl:px-0 ">
                <div>
                  <p className=" max-w-lg text-center text-xs xl:text-left text-white/80">
                    This is looking very close to the reference — deep top bend,
                    centered text, rotated squares fully scaled in on the right,
                    and the photo bleeding on the left (currently gray
                    placeholder). Let's check the scale-in mid-transition and
                    the bottom bend
                  </p>
                  {/* <div className="flex mt-4 gap-5">
                    <button className="bg-white px-6 py-2 font-medium text-black rounded-sm text-bl">
                      Explore my work
                    </button>
                    <button className="bg-red-600 z-100 cursor-crosshair px-6 py-2 font-medium text-white rounded-sm text-bl ">
                      Hire me
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          )}

          <div className="w-full h-[70vh] bg-gradient-to-t from-black/70 via-black/0 to-transparent absolute z-21" />
        </div>
      </div>
    </div>
  );
}

