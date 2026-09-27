"use client";

import React, { useRef } from "react";
import Skills3D from "@/components/ThreeJs/Skills3D";

import FoldText from "../Text/FoldText";

interface SkillSectionProps {
  text: string;
  model: string;
}

const SkillSection: React.FC<SkillSectionProps> = ({ text, model }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      id={`Skills-${text}`}
      className="relative w-screen h-[50vh] xl:h-screen  flex xl:items-center xl:justify-center  overflow-hidden"
    >
      {/* Background Text Layer (behind the 3D canvas) */}
      <div className="absolute xl:inset-0 w-full   z-10  flex items-center justify-center pointer-events-none">
        <div
          className={` flex mb-40 flex-col items-center justify-center text-center`}
        >
          <p className="text-[20vw] BlackT font-semibold SkillHead ">
            <FoldText
              text={text}
              splitBy="char"
              hinge="top"
              trigger="scroll"
              duration={0.65}
              stagger={0.045}
              ease="power3.out"
              perspective={700}
              creaseShading={0.55}
              fontWeight={800}
              color="BlackT"
            />
          </p>
        </div>
      </div>

      {/* Foreground 3D Canvas Layer */}
      <Skills3D model={model} triggerRef={containerRef} />

      {/* Texture overlay to give a slightly grungy/pixelated look (optional) */}
      <div
        className="absolute inset-0 z-30 pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />
    </section>
  );
};

export default SkillSection;
