"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/dist/CustomEase";
gsap.registerPlugin(CustomEase) 
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface LineBarProps {
  className?: string;
  duration?: number;
  ease?: string;
  start?: string;
}

const LineBar: React.FC<LineBarProps> = ({
  className = "w-full h-px bg-[#29221a46]",
  duration = 1.5,
  ease = "power3.out",
  start = "top 85%",
}) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!lineRef.current) return;

      if (window.innerWidth < 768) {
        gsap.set(lineRef.current, { scaleX: 1 });
        return;
      }

      gsap.fromTo(
        lineRef.current,
        {
          scaleX: 0,
          transformOrigin: "center center",
        },
        {
          scaleX: 1,
          duration: duration,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: lineRef.current,
            start: start,
            toggleActions: "play none none reverse",
          
          },
        }
      );
    },
    { scope: lineRef }
  );

  return <div className="w-full flex justify-center items-center">
    <div ref={lineRef} className={className} />
  </div>;
};

export default LineBar;
