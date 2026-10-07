"use client";
import { forwardRef } from "react";
import SplitText from "../Text/SplitText";
import Image from "next/image";



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
        <div>
          <Image src={project.image.img} alt={project.title} width={1000} height={1000} className="w-full h-full object-cover rounded-sm " />
        </div>

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
