"use client";

import React, { Suspense, useCallback, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Float, Center, Environment } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

function CameraModel({
  model,
  triggerRef,
}: {
  model: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { scene } = useGLTF(model);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const groupRef = useRef<THREE.Group>(null);

  useGSAP(() => {
    if (!groupRef.current || !triggerRef.current) return;

    const scrollTriggerConfig = {
      trigger: triggerRef.current,
      start: "top 25%",
      markers: true,
      toggleActions: "play none none reverse",
    };

    // Animate scale
    gsap.to(groupRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: scrollTriggerConfig,
    });

    // Animate rotation (targets the Euler object, not Vector3)
    gsap.from(groupRef.current.rotation, {
      x: 0.3,
      y: 0.6,
      z: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { ...scrollTriggerConfig },
    });
  }, [triggerRef]);

  // Click animation — scale punch + Y-axis spin
  const isAnimatingRef = useRef(false);

  const handleClick = useCallback(() => {
    if (!groupRef.current || isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    // Quick scale punch: shrink → overshoot → settle
    tl.to(groupRef.current.scale, {
      x: 0.8,
      y: 0.8,
      z: 0.8,
      duration: 0.15,
      ease: "power2.in",
    })
      .to(groupRef.current.scale, {
        x: 1.15,
        y: 1.15,
        z: 0.8,
        duration: 0.3,
        ease: "back.out(3)",
      })
      .to(groupRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.25,
        ease: "power2.out",
      });

    // Simultaneous Y-axis spin
    gsap.to(groupRef.current.rotation, {
      y: groupRef.current.rotation.y + Math.PI * 2,
      duration: 0.7,
      ease: "power3.out",
    });
  }, []);

  return (
    <Float
      speed={2}
      rotationIntensity={1.5}
      floatIntensity={0.6}
      floatingRange={[-0.1, 0.1]}
    >
      <Center>
        <group ref={groupRef} scale={0} rotation={[Math.PI, Math.PI, 0]}>
          <primitive
            object={clonedScene}
            position={[0, 2, 0]}
            rotation={[-0.5, -0.7, 3.1]}
            scale={1.1}
            onClick={handleClick}
          />
        </group>
      </Center>
    </Float>
  );
}

interface Skills3DProps {
  model: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

const Skills3D: React.FC<Skills3DProps> = ({ model, triggerRef }) => {
  return (
    <div className="w-full h-full absolute inset-0 z-20" style={{ pointerEvents: "auto", cursor: "pointer" }}>
      <Canvas
        camera={{ position: [0, 0, 18], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Plane light (using directional light for reliable uniform front lighting) */}
          <directionalLight
            position={[4, -2, 4]}
            intensity={1}
            color={"#ffffff"}
          />

          {/* Spotlight from behind */}
          <spotLight
            position={[0, 6, -8]}
            angle={0.8}
            penumbra={0.5}
            intensity={30}
            decay={2}
            distance={50}
            color={"#ffffff"}
            castShadow
          />

          {/* Slight ambient light so it's not completely pitch black in the shadows */}
          <ambientLight intensity={1} />

          <CameraModel model={model} triggerRef={triggerRef} />

          {/* Environment for reflections if the model has shiny PBR materials */}
          <Environment preset="city" environmentIntensity={2.5} />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Preload the model
useGLTF.preload("/Models/Camera.glb");

export default Skills3D;
