"use client";
import { forwardRef } from "react";
import dynamic from "next/dynamic";
import SplitText from "../Text/SplitText";

const ThreeDImage = dynamic(() => import("../Cards/Card"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video xl:h-[78%] bg-neutral-900/30 rounded-lg animate-pulse" />
  ),
});

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
    return (
      /* 
      We attach the ref to this outer wrapper which remains completely static in size.
      The actual animation targets the `.card-inner` div below.
      This prevents R3F from detecting layout resizes and glitching the canvas size!
    */
      <div ref={ref} className="w-full xl:h-[520px] sm:h-[580px]">
        <div className="card-inner w-full h-full group relative flex  flex-col px-2 xl:p-4 rounded-2xl  hover:border-white/20 transition-all duration-300">
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

          <ThreeDImage image={project.image} index={index ?? 0} />

          {/* Info Content */}
          <div className="w-full   px-1 flex flex-col mt-2 xl:justify-between">
            <p className="text-amber-50/60 xl:text-sm text-xs sm:text-base font-light tracking-wide">
              {project.category}
            </p>
            <div className="flex  xl:items-center gap-1 overflow-hidden justify-betwee">
              {/* <p className="text-white text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight group-hover:text-amber-200 transition-colors duration-300">
              {project.title}
            </p> */}
              <p className="text-amber-50 group-hover:translate-x-0 transition-all duration-500 text-6xl -translate-x-10 leading-[0.95]">
                {"> "}{" "}
              </p>
              <SplitText
                text={project.title}
                tag="h1"
                className="xl:text-4xl text-2xl text-amber-50  font-medium  -translate-x-10 group-hover:translate-x-0 transition-all duration-500  text-center"
                delay={50}
                duration={0.5}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />
            </div>
            <div></div>
          </div>
        </div>
      </div>
    );
  },
);

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
