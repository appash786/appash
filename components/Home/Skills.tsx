"use client";

import React, { useRef } from 'react';
import Skills3D from '@/components/ThreeJs/Skills3D';
import PixelRevealText from '@/components/Text/PixelText';
import { myPixelFont } from '@/lib/fonts/fonts';

const Skills = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={containerRef}
      id="Skills"
      className="relative w-screen h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
    >
      {/* Background Text Layer (behind the 3D canvas) */}
      <div className="absolute inset-0  z-10 flex items-center justify-center pointer-events-none">
        <div className={`${myPixelFont.className} flex mb-40 flex-col items-center justify-center text-center`}>
          <PixelRevealText
            text="VIDEO"
            gridSize={46}
            className="uppercase text-white font-bold tracking-widest"
            style={{ fontSize: "clamp(4rem, 20vw, 20rem)", lineHeight: 0.9 }}
            active={true}
          />
        </div>
      </div>

      {/* Foreground 3D Canvas Layer */}
      <Skills3D />
      
      {/* Texture overlay to give a slightly grungy/pixelated look (optional) */}
      <div 
        className="absolute inset-0 z-30 pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '4px 4px'
        }}
      />
    </section>
  );
};

export default Skills;