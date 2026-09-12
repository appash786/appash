"use client";

import React, { Suspense, useCallback, useMemo, useRef } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
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
      start: "top 85%",
      toggleActions: "play none none reverse",
    };

    // Animate scale from 0 to 1 via GSAP without hardcoding scale={0} in JSX
    gsap.fromTo(
      groupRef.current.scale,
      { x: 0, y: 0, z: 0 },
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: scrollTriggerConfig,
      }
    );

    // Animate entrance rotation
    gsap.fromTo(
      groupRef.current.rotation,
      { x: 0.3, y: 0.6, z: 0 },
      {
        x: Math.PI,
        y: Math.PI,
        z: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: scrollTriggerConfig,
      }
    );
  }, [triggerRef]);

  // Elastic drag interaction
  const dragRef = useRef<THREE.Group>(null);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const elasticTweenRef = useRef<gsap.core.Tween | null>(null);

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (clientX === undefined || clientY === undefined) return;

    isDraggingRef.current = true;
    startPosRef.current = { x: clientX, y: clientY };
    document.body.style.cursor = "grabbing";

    if (elasticTweenRef.current) {
      elasticTweenRef.current.kill();
    }

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current || !dragRef.current) return;
      const dx = moveEvent.clientX - startPosRef.current.x;
      const dy = moveEvent.clientY - startPosRef.current.y;

      // Convert drag pixel deltas to 3D units
      const rawX = -dx * 0.012;
      const rawY = dy * 0.012;

      // Soft clamp / limit maximum stretched distance (rubber-band resistance)
      const dist = Math.hypot(rawX, rawY);
      const MAX_DRAG = 1.5; // Maximum base stretch limit in 3D units
      let targetX = rawX;
      let targetY = rawY;

      if (dist > MAX_DRAG) {
        const excess = dist - MAX_DRAG;
        const clampedDist = MAX_DRAG + Math.tanh(excess * 0.6) * 0.35;
        const factor = clampedDist / dist;
        targetX = rawX * factor;
        targetY = rawY * factor;
      }

      dragRef.current.position.x = targetX;
      dragRef.current.position.y = targetY;

      // Subdued, subtle tilt rotation
      dragRef.current.rotation.z = targetX * 0.04;
      dragRef.current.rotation.x = targetY * 0.04;
      dragRef.current.rotation.y = -targetX * 0.06;
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = "grab";
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      if (!dragRef.current) return;

      elasticTweenRef.current = gsap.to(dragRef.current.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.2,
        ease: "elastic.out(1.2, 0.4)",
      });

      gsap.to(dragRef.current.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.2,
        ease: "elastic.out(1.2, 0.4)",
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }, []);

  return (
    <Float
      speed={2}
      rotationIntensity={1.5}
      floatIntensity={0.6}
      floatingRange={[-0.1, 0.1]}
    >
      <Center>
        <group ref={groupRef}>
          <group ref={dragRef}>
            <primitive
              object={clonedScene}
              position={[0, 2, 0]}
              rotation={[-0.5, -0.7, 3.1]}
              scale={1.1}
              onPointerDown={handlePointerDown}
              onPointerOver={() => {
                if (!isDraggingRef.current) document.body.style.cursor = "grab";
              }}
              onPointerOut={() => {
                if (!isDraggingRef.current) document.body.style.cursor = "auto";
              }}
            />
          </group>
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
    <div className="w-full h-full absolute inset-0 z-20" style={{ pointerEvents: "auto", cursor: "grab" }}>
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
