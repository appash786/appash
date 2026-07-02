"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface PixelSweepTextProps {
  text: string;
  gridSize?: number;
  className?: string;
  fontFamily?: string;
  color?: string;
  blockColor?: string;
  style?: React.CSSProperties;
  containerAnimation?: gsap.core.Tween;
  isMobile?: boolean;
}

const PixelSweepText: React.FC<PixelSweepTextProps> = ({
  text,
  gridSize = 12,
  className = "",
  fontFamily = "inherit",
  color = "rgba(255,255,255,0.85)",
  blockColor,
  style,
  containerAnimation,
  isMobile = false,
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      if (isMobile || !containerAnimation) return;

      const blocksSelector = gsap.utils.toArray<HTMLElement>(
        ".pixel-sweep-block",
        containerRef.current
      );

      gsap.fromTo(
        blocksSelector,
        { opacity: 1 },
        {
          opacity: 0,
          ease: "none",
          stagger: (index, target) => {
            const rect = target.getBoundingClientRect();
            const containerRect = containerRef.current!.getBoundingClientRect();
            const x = rect.left - containerRect.left;
            const progress = containerRect.width > 0 ? x / containerRect.width : 0;
            return progress * 0.8; // Sweep duration = 0.8s
          },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "left 90%", // start revealing when left edge reaches 90% viewport width
            end: "left 60%",   // fully revealed when left edge reaches 60% viewport width
            scrub: 0.5,
            containerAnimation,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { dependencies: [containerAnimation, isMobile], scope: containerRef }
  );

  return (
    <p
      ref={containerRef}
      className={`block w-full ${className}`}
      style={{
        ...style,
        margin: 0,
        fontFamily,
      }}
    >
      {words.map((word, i) => {
        // Estimate the dimensions of the word based on character count to render synchronously
        const charCount = word.length;
        const cols = Math.ceil((charCount * 8.5) / gridSize);
        const rows = 2; // height fits 2 rows of pixel blocks for typical line height
        const totalBlocks = cols * rows;

        return (
          <React.Fragment key={i}>
            <span className="relative inline-block overflow-hidden">
              <span style={{ color, fontFamily }}>{word}</span>
              {!isMobile && totalBlocks > 0 && (
                <span
                  className="absolute inset-0 z-10 pointer-events-none grid"
                  aria-hidden="true"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                  }}
                >
                  {Array.from({ length: totalBlocks }).map((_, idx) => (
                    <span
                      key={idx}
                      className="pixel-sweep-block"
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: blockColor || color,
                      }}
                    />
                  ))}
                </span>
              )}
            </span>
            {i < words.length - 1 && " "}
          </React.Fragment>
        );
      })}
    </p>
  );
};

export default PixelSweepText;
