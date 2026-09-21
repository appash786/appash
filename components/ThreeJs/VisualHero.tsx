"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import FoldText from "../Text/FoldText";
import BlockReveal from "../Text/BlockReveal";
import {
  useRef,
  useMemo,
  Suspense,
  useState,
  useCallback,
  useEffect,
} from "react";
import PixelRevealText from "@/components/Text/PixelText";
import DecryptedText from "@/components/Text/DecryptedText";
import { myPixelFont } from "@/lib/fonts/fonts";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PixelBlast from "../PixelBlast";
gsap.registerPlugin(ScrollTrigger, useGSAP);

import "./Styles.css";
// --- Keep your Shaders, BgScene, and FgScene exactly as they are ---
const coverUVGlsl = `vec2 coverUV(vec2 uv, float imgA, float viewA) { vec2 scale = viewA > imgA ? vec2(1.0, imgA / viewA) : vec2(viewA / imgA, 1.0); return (uv - 0.5) * scale + 0.5; }`;
const bgVert = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const bgFrag = `${coverUVGlsl} uniform sampler2D uBackground; uniform float uBgAspect; uniform float uViewportAspect; varying vec2 vUv; void main() { gl_FragColor = texture2D(uBackground, coverUV(vUv, uBgAspect, uViewportAspect)); }`;
const fgVert = bgVert;
const fgFrag = `${coverUVGlsl} uniform sampler2D uTexture; uniform sampler2D uDepthMap; uniform vec2 uMouse; uniform vec2 uThreshold; uniform float uFgAspect; uniform float uViewportAspect; varying vec2 vUv; void main() { vec2 base = coverUV(vUv, uFgAspect, uViewportAspect); vec4 depth = texture2D(uDepthMap, base); vec2 displacement = -uMouse * depth.r * uThreshold; gl_FragColor = texture2D(uTexture, base + displacement); }`;

function BgScene({ onReady }: { onReady: () => void }) {
  const { viewport, size } = useThree();
  const [bgTex] = useLoader(THREE.TextureLoader, ["/bg.jpg"]);
  const frameCount = useRef(0);
  const uniforms = useMemo(
    () => ({
      uBackground: { value: bgTex },
      uBgAspect: { value: bgTex.image.width / bgTex.image.height },
      uViewportAspect: { value: size.width / size.height },
    }),
    [bgTex, size.width, size.height],
  );
  useFrame(() => {
    uniforms.uViewportAspect.value = size.width / size.height;
    if (frameCount.current < 2) {
      frameCount.current++;
      if (frameCount.current === 2) {
        onReady();
      }
    }
  });
  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        vertexShader={bgVert}
        fragmentShader={bgFrag}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function FgScene({
  mouse,
  onReady,
  cameraZ,
}: {
  mouse: React.MutableRefObject<[number, number]>;
  onReady: () => void;
  cameraZ?: React.MutableRefObject<{ value: number }>;
}) {
  const { viewport, size } = useThree();

  // Store the initial viewport dimensions on mount so they do not reactively scale
  // and neutralize the camera Z-axis animation.
  const initialViewport = useMemo(
    () => ({
      width: viewport.width,
      height: viewport.height,
    }),
    [],
  );

  const [tex, depthTex] = useLoader(THREE.TextureLoader, [
    "/appash.png",
    "/appash_depth.png",
  ]);
  const frameCount = useRef(0);
  const uniforms = useMemo(
    () => ({
      uTexture: { value: tex },
      uDepthMap: { value: depthTex },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uThreshold: { value: new THREE.Vector2(0.007, 0.005) },
      uFgAspect: { value: tex.image.width / tex.image.height },
      uViewportAspect: { value: size.width / size.height },
    }),
    [tex, depthTex],
  );
  useFrame(({ camera }) => {
    if (cameraZ?.current) {
      camera.position.z = cameraZ.current.value;
      camera.updateProjectionMatrix();
    }
    uniforms.uViewportAspect.value = size.width / size.height;
    uniforms.uMouse.value.x +=
      (mouse.current[0] - uniforms.uMouse.value.x) * 0.06;
    uniforms.uMouse.value.y +=
      (mouse.current[1] - uniforms.uMouse.value.y) * 0.06;
    if (frameCount.current < 2) {
      frameCount.current++;
      if (frameCount.current === 2) {
        onReady();
      }
    }
  });
  return (
    <mesh>
      <planeGeometry args={[initialViewport.width, initialViewport.height]} />
      <shaderMaterial
        vertexShader={fgVert}
        fragmentShader={fgFrag}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export function VisualHero({ mouse, onReady, isReady, cameraZ }: any) {
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
                <h1 className="xl:text-6xl text-3xl  font-bold uppercase text-center italic ">
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
                    delay={0.30}
                    duration={1.2}
                  >
                    <span className="mr-10 text-white">Developer</span>
                  </BlockReveal>
                </h1>
              </div>
              <div className="xl:w-[45%] px-4 mt-4 xl:mt-0 mb-20  xl:mb-0 xl:px-0 ">
                <div>
                  <p className=" max-w-lg text-center xl:text-left text-white/80">
                    This is looking very close to the reference — deep top bend,
                    centered text, rotated squares fully scaled in on the right,
                    and the photo bleeding on the left (currently gray
                    placeholder). Let's check the scale-in mid-transition and the
                    bottom bend
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

// ─── Main Hero (The scroll logic) ───
const CURVE_PATH_D =
  "M -150 260 C 180 160, 420 180, 720 440 C 980 680, 1220 700, 1550 670";

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

  const toolsString = useMemo(() => {
    const single =
      heroTechItems.map((item) => item.toUpperCase()).join("  ✦  ") + "  ✦  ";
    return single.repeat(5);
  }, []);

  useGSAP(
    () => {
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
          clipPath: "inset(12% 35% 12% 35% round 0px)",
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

      // 3. ZOOM EFFECT: Animate camera Z position to zoom out
      tl.fromTo(
        cameraZ.current,
        { value: 5 },
        {
          value: 6.25,
          ease: "power2.inOut", // 👈 Match this to the clipPath ease
          duration: 1, // 👈 Match this to the clipPath duration (1)
        },
        0, // 👈 Start exactly when the clipPath starts
      );

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
      className="relative mb-20  z-10 overflow-hidden"
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
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Guide path for textPath and measurements */}
            <path
              id="hero-tool-curve"
              ref={pathRef}
              d={CURVE_PATH_D}
              fill="none"
            />

            {/* Mask to wipe the ribbon top to down */}
            <mask id="hero-wipe-mask" maskUnits="userSpaceOnUse">
              <path
                ref={maskStrokeRef}
                d={CURVE_PATH_D}
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
              d={CURVE_PATH_D}
              fill="none"
              stroke="#0a0a0a"
              strokeWidth="36"
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
