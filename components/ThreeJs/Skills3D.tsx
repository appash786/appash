"use client";

import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Float, Center, Environment } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

function CameraModel() {
  const { scene } = useGLTF("/Models/Camera.glb");
  const groupRef = useRef<THREE.Group>(null);

  useGSAP(() => {
    if (!groupRef.current) return;

    gsap.to(groupRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#Skills",
        start: "top 25%", // Trigger when top of section hits 70% down the viewport
        markers: true,
        toggleActions: "play none none reverse", // Play forward when entering, reverse when leaving back up
      },
    });
  }, []);

  return (
    <Float
      speed={2} // Animation speed
      rotationIntensity={0.5} // XYZ rotation intensity
      floatIntensity={0.5} // Up/down float intensity
      floatingRange={[-0.1, 0.1]} // Range of y-axis values the object will float within
    >
      <Center>
        <group ref={groupRef} scale={0}>
          <primitive
            object={scene}
            position={[0, -3, 0]}
            rotation={[0.3, 0.6, 0]}
            scale={1.1}
          />
        </group>
      </Center>
    </Float>
  );
}

const Skills3D = () => {
  return (
    <div className="w-full h-full absolute inset-0 z-20 pointer-events-none">
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

          <CameraModel />

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
