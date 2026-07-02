"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { myPixelFont } from "@/lib/fonts/fonts";

gsap.registerPlugin(ScrollTrigger);

interface PixelRevealProps {
  text: string;
  gridSize?: number;
  className?: string;
  fontFamily?: string;
  color?: string;
  style?: React.CSSProperties;
  active?: boolean;
}

const PixelRevealText: React.FC<PixelRevealProps> = ({
  text,
  gridSize = 20,
  className = "",
  fontFamily = "inherit",
  color = "white",
  style,
  active,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<number[]>([]);

  // If className includes "italic", skew the overlay grid to match the slant
  const isItalic = className.includes("italic");
  const skewStyle: React.CSSProperties = isItalic
    ? { transform: "skewX(-12deg)", transformOrigin: "center" }
    : {};

  // Calculate how many blocks we need based on the container size
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const columns = Math.ceil(width / gridSize);
      const rows = Math.ceil(height / gridSize);
      const totalBlocks = columns * rows;
      setBlocks(Array.from({ length: totalBlocks }));
    }
  }, [gridSize, text]);

  useGSAP(
    () => {
      if (blocks.length === 0) return;

      const blocksSelector = gsap.utils.toArray<HTMLElement>(".pixel-block", containerRef.current);

      if (active !== undefined) {
        if (active) {
          // Animate blocks away when active is true
          gsap.to(blocksSelector, {
            opacity: 0,
            duration: 0.1,
            stagger: {
              amount: 1.2,
              from: "random",
            },
          });
        } else {
          // Instantly cover text back up
          gsap.to(blocksSelector, {
            opacity: 1,
            duration: 0.1,
          });
        }
      } else {
        // Fallback to ScrollTrigger if active is not specified
        gsap.to(blocksSelector, {
          opacity: 0,
          duration: 0.1,
          stagger: {
            amount: 1.5,
            from: "random",
          },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
        });
      }
    },
    { dependencies: [blocks, active], scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={`relative inline-block overflow-hidden ${className}`}
      style={style}
    >
      {/* The Actual Text */}
      <div ref={textRef} className={`relative z-0 ${myPixelFont.className}`} style={{ color }}>
        {text}
      </div>

      {/* The Pixel Grid Overlay — skewed to match italic slant if needed */}
      <div
        className="absolute inset-0 z-10 pointer-events-none flex flex-wrap"
        aria-hidden="true"
        style={skewStyle}
      >
        {blocks.map((_, i) => (
          <div
            key={i}
            className="pixel-block"
            style={{
              width: `${gridSize}px`,
              height: `${gridSize}px`,
              backgroundColor: color,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PixelRevealText;