import React, { useRef } from "react";
import FlowingMenu from "../Menu/FlowingMenu";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const projectsData = [
  {
    title: "Ecommerce Website",
    category: "Web Development & Design",
    link: "#",
    image: { img: "/car.jpg", depth: "/car-depth.png" },
  },
  {
    title: "Portfolio Platform",
    category: "UI/UX & Interactive 3D",
    link: "#",
    image: { img: "/spider.jpg", depth: "/spider-depth.png" },
  },
  {
    title: "AI Dashboard",
    category: "Fullstack Application",
    link: "#",
    image: { img: "/Editor.jpg", depth: "/Editor-depth.png" },
  },
  {
    title: "Brand Mobile App",
    category: "Mobile App & Motion",
    link: "#",
    image: { img: "/app.jpg", depth: "/app-depth.png" },
  },
];

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);



  return (
    <section
      ref={containerRef}
      className="relative w-screen overflow-hidden select-none py-12"
    >
      <div className="w-full h-full flex flex-col relative z-0">
        <div className="w-full border-t border-b py-5 border-amber-50/20 px-6 sm:px-12 md:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-white uppercase tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[100px] leading-[0.95] text-left">
            PROJECTS
          </p>

          <p className="w-full md:w-[30%] lg:w-[25%] text-white/80 text-left md:text-right text-base sm:text-lg md:text-xl font-light leading-relaxed">
            Featured works showcasing interactive 3D web experiences and modern
            applications.
          </p>
        </div>

        <div className="w-full mt-10 px-6 sm:px-12 md:px-16 flex flex-wrap gap-8 relative justify-between">
          {projectsData.map((project, index) => {
            return (
              <div
                key={index}
                className="w-full md:w-[calc(50%-16px)]"
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
              >
                <ProjectCard project={project} index={index}/>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
