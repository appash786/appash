"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  useRef,
  useMemo,
  Suspense,
  useState,
  useCallback,
  useEffect,
} from "react";
import PixelRevealText from "@/components/Text/PixelText";
import { myPixelFont } from "@/lib/fonts/fonts";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { scale } from "framer-motion";
import PixelBlast from "../PixelBlast";
gsap.registerPlugin(ScrollTrigger, useGSAP);

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
          style={{ ...canvasStyle, zIndex: 1 }}
          camera={{ position: [0, 0, 5], fov: 75 }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 1)}
        >
          <Suspense fallback={null}>
            <BgScene onReady={onReady} />
          </Suspense>
        </Canvas>

        {/* Layer 2 — big "APPASH" text */}
        <div
          className="hero-text-layer"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <p
            className="text-white uppercase font-bold italic"
            style={{
              fontSize: "clamp(3.1rem, 60.6vw, 20.3rem)",
              lineHeight: 0.95,
            }}
          >
            appash
          </p>
        </div>

        {/* Layer 3 — foreground with depth parallax */}
        <Canvas
          style={{ ...canvasStyle, zIndex: 20 }}
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <Suspense fallback={null}>
            <FgScene mouse={mouse} onReady={onReady} cameraZ={cameraZ} />
          </Suspense>
        </Canvas>

        {/* <div
          className="hero-text-layer"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 23,
            display: "flex",
            alignItems: "end",
            justifyContent: "center",
            pointerEvents: "none",
            marginBottom: ""
          }}
        >
          <p
            className="text-white mb-10 z-22 text-3xl  "
            style={{
              fontSize: "",
              lineHeight: 0.95,
            }}
          >
            Creative Developer & Multimedia Designer
          </p>
          <div className="w-full h-45 bg-gradient-to-t from-black/40 via-black/0 to-transparent absolute z-21" />
        </div> */}
      </div>
    </div>
  );
}

// ─── Main Hero (The scroll logic) ───
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const mouse = useRef<[number, number]>([0, 0]);

  const [readyCount, setReadyCount] = useState(0);
  const isReady = readyCount >= 2;
  const onSceneReady = useCallback(() => setReadyCount((n) => n + 1), []);
  const cameraZ = useRef({ value: 5 });
  const [revealActive, setRevealActive] = useState(false);

  useGSAP(
    () => {
      if (!isReady) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1.2,
          onUpdate: (self) => {
            if (self.progress >= 0.7) {
              setRevealActive(true);
            } else {
              setRevealActive(false);
            }
          },
        },
      });
      // 1. Morph Phase: Clip-path the mask wrapper to create the cropped box
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
        tl.to(bigText, { opacity: 0, y: -20, duration: 0.3 }, 0);
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

      // 4. Background text: Bring the second section into view
      tl.fromTo(
        contentSectionRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.5 },
        0.6,
      );

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
      className="relative mb-20 z-10 overflow-hidden"
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

      {/* This is the content behind that fades in at the end of the scroll */}
      <div
        ref={contentSectionRef}
        className="h-screen w-full relative z-[60] grid grid-cols-[1fr_30vw_1fr] items-center pointer-events-none text-white px-4 md:px-10 opacity-0"
      >
        {/* Left Column Text */}
        <div className="flex flex-col justify-baseline items-end text-right pr-4 md:pr-10">
          <div
            className={` text-[5vw] md:text-[3vw] leading-[0.95] text-white uppercase`}
          >
            <div className="whitespace-nowrap">
              {" "}
              <p
                className="text-white uppercase f"
                style={{
                  fontSize: "clamp(3.1rem, 5.6vw, 5.3rem)",
                  lineHeight: 0.95,
                }}
              >
                Creative<br />
                <span className="font-bold">Developer</span>
              </p>
            </div>
          </div>
        </div>

        {/* Center Space (Empty spacer matching width of the masked hero scene) */}
        <div className="w-[30vw]  h-full" />

        {/* Right Column Text */}
        <div className="flex flex-col items-start text-left pl-4 md:pl-10">
          <div
            className={`text-[5vw] md:text-[3vw] leading-[0.95] text-white uppercase`}
          >
            <div className="whitespace-nowrap">
              {" "}
              <p
                className="text-white uppercase f"
                style={{
                  fontSize: "clamp(3.1rem, 5.6vw, 5.3rem)",
                  lineHeight: 0.95,
                }}
              >
                Multimedia
                <br />
                <span className="font-bold">Designer</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full  z-0 opacity-80  fixed top-0 left-0 ">
        <PixelBlast
          variant="square"
          pixelSize={7}
          color="#8B0000"
          patternScale={8.5}
          patternDensity={2}
          pixelSizeJitter={1.05}
          enableRipples
          rippleSpeed={1}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.25}
          edgeFade={0.27}
          transparent
        />
      </div>
    </div>
  );
}
