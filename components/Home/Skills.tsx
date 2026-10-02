"use client";

import { useRef } from "react";
import SkillSection from "./SkillSection";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Skills = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const SkillsList = [
    {
      title: "CODING",
      model: "/Models/Globe_4.glb",
    },
    {
      title: "MOTION",
      model: "/Models/Camera.glb",
    },
    {
      title: "DESIGN",
      model: "/Models/Brush.glb",
    },
  ];

  useGSAP(
    () => {
      if (!containerRef.current || !particlesRef.current) return;

      if (window.innerWidth < 768) {
        gsap.set(particlesRef.current, { opacity: 0.4 });
        return;
      }

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom", // Fade in as soon as section top enters viewport
        end: "bottom top",   // Fade out when section bottom leaves viewport
        onToggle: (self) => {
          if (self.isActive) {
            gsap.to(particlesRef.current, {
              opacity: 0.4,
              duration: 0.4,
              overwrite: "auto",
            });
          } else {
            gsap.to(particlesRef.current, {
              opacity: 0,
              duration: 0.4,
              overwrite: "auto",
            });
          }
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className="relative -translate-y-20 xl:-translate-y-  overflow-hidden">
      {/* Background Particles Layer fixed to viewport and toggled by ScrollTrigger */}


      <div className="relative">
        {SkillsList.map((Skill, idx) => (
          <SkillSection key={idx} text={Skill.title} model={Skill.model} />
        ))}
      </div>
    </section>
  );
};

export default Skills;


