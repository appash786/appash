"use client";
import React, { useRef, Suspense, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import ThreeImage from "../ThreeJs/ThreeImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomEase from "gsap/dist/CustomEase";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(CustomEase) 
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ThreeDImage = ({ image,index }: { image?: { img: string; depth: string }; index:number }) => {
  const mouse = useRef<[number, number]>([0, 0]);
  const hovering = useRef(false);
  const onReady = useCallback(() => {}, []);
  const cameraZ = useRef({ value: 5 });
  const CanvaRef = useRef<HTMLCanvasElement>(null);

  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 10,
    objectFit: "cover",
    aspectRatio: "16:9",
  };

  useGSAP(() => {
    if (!CanvaRef.current) return;

    const isLeft = index % 2 === 0;

    gsap.fromTo(
      CanvaRef.current,
      {
         clipPath: "inset(20% 20% 20% 20% round 10px)" ,
         translateX: isLeft ? "20%" : "-20%",
      },
      {
        clipPath: "inset(0% 0% 0% 0% round 10px)" , 
        translateX: "0%",

        duration: 1.5,

        ease: CustomEase.create("custom", "M0,0 C0.084,0.61 0.061,0.599 0.195,0.789 0.263,0.886 0.374,1 1,1 "),
        scrollTrigger: {
          trigger: CanvaRef.current,
          start: "top 90%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  const onMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouse.current = [
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -(((e.clientY - rect.top) / rect.height) * 2 - 1),
    ];
    hovering.current = true;
  };

  const onLeave = () => {
    hovering.current = false;
  };

  return (
    <div
      className="w-full h-[78%] relative  justify-center items-center flex rounded-xl "
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <Canvas
        ref={CanvaRef}
        style={{ ...canvasStyle, zIndex: 20 }}
        camera={{ position: [0, 0, 6], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Suspense fallback={null}>
          <ThreeImage
            mouse={mouse}
            onReady={onReady}
            cameraZ={cameraZ}
            image={image}
            hovering={hovering}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeDImage;
