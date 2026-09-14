"use client";
import React, { forwardRef } from "react";
import ThreeDImage from "../Cards/Card";
import { ArrowUpRight } from "lucide-react";
import SplitText from "../Text/SplitText";
interface ProjectCardProps {
  project: {
    title: string;
    category: string;
    link: string;
    image: { img: string; depth: string };
  };
  index?: number;
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ project, index }, ref) => {
    const handleAnimationComplete = () => {
      console.log("All letters have animated!");
    };
    return (
      /* 
      We attach the ref to this outer wrapper which remains completely static in size.
      The actual animation targets the `.card-inner` div below.
      This prevents R3F from detecting layout resizes and glitching the canvas size!
    */
      <div ref={ref} className="w-full h-[520px] sm:h-[580px]">
        <div className="card-inner w-full h-full group relative flex flex-col p-4 rounded-2xl  hover:border-white/20 transition-all duration-300">
          {/* 3D Image Container */}
          {/* <div className="w-full h-[78%] relative overflow-hidden rounded-xl bg-black/40">
         <div className="absolute inset-0 w-full h-full bg-cover bg-center ">
           <ThreeDImage image={project.image} />
         </div>

        
          <a
            href={project.link}
            className="absolute top-4 right-4 z-30 p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-lg flex items-center justify-center pointer-events-auto"
            aria-label={`View ${project.title}`}
          >
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div> */}

          <ThreeDImage image={project.image} index={index} />

          {/* Info Content */}
          <div className="w-full space-y-1 mt-4 px-1 flex flex-col justify-between">
            <p className="text-white/60 text-sm sm:text-base font-light tracking-wide">
              {project.category}
            </p>
            <div className="flex items-center gap-1 overflow-hidden justify-betwee">
              {/* <p className="text-white text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight group-hover:text-amber-200 transition-colors duration-300">
              {project.title}
            </p> */}
            <p className="text-white group-hover:translate-x-0 transition-all duration-500 text-6xl -translate-x-10 leading-[0.95]">{'> '} </p>
              <SplitText
                text={project.title}
                tag="h1"
                className="text-4xl -translate-x-10 group-hover:translate-x-0 transition-all duration-500 HeroText text-center"
                delay={50}
                duration={0.5}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                onLetterAnimationComplete={handleAnimationComplete}
              />
            </div>
          <div>
            <div className="w-full h-[10vh] bg-black p-5 ">
              <button>visit us</button>
              
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  },
);

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
