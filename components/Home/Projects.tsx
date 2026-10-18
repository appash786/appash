"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import BlockReveal from "../Text/BlockReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const projectsData = [
  {
    title: "Ecommerce Website",
    category: "Web Development & Design",
    link: "#",
    image: {
      img: "/Assets/Images/ecom.jpg",
      depth: "/Assets/Depth-maps/car-depth.webp",
    },
  },
  {
    title: "Portfolio Platform",
    category: "UI/UX & Interactive 3D",
    link: "#",
    image: {
      img: "/Assets/Images/netflix.jpg",
      depth: "/Assets/Depth-maps/spider-depth.webp",
    },
  },
];

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const clipPathRef = useRef<SVGPathElement | null>(null);

  useGSAP(
    () => {
      type Breakpoint = "xs" | "mobile" | "md" | "lg" | "xl";
      const getBreakpoint = (w: number): Breakpoint => {
        if (w < 480) return "xs";
        if (w < 768) return "mobile";
        if (w < 1024) return "md";
        if (w < 1280) return "lg";
        return "xl";
      };
      const bp = getBreakpoint(window.innerWidth);
      const isMobile = bp === "xs" || bp === "mobile";
      const isTablet = bp === "md";

      //Clip Path
      const getMeClipPath = (topY: number, bottomY: number) => {
        const bottomCtrl = ((1000 + bottomY) / 1000).toFixed(4);
        if (isMobile) {
          return `M 0,0 L 1,0 L 1,0.92 Q 0.5,${bottomCtrl} 0,0.92 Z`;
        }
        const topCtrl = (topY / 1000).toFixed(3);
        return `M 0,0 Q 0.5,${topCtrl} 1,0 L 1,0.92 Q 0.5,${bottomCtrl} 0,0.92 Z`;
      };
      const bendState = { topY: 0, bottomY: 0 };
      const TOP_BENT = 70;
      const BOTTOM_BENT = -110; //previous -150

      const applyBend = () => {
        if (clipPathRef.current) {
          clipPathRef.current.setAttribute(
            "d",
            getMeClipPath(bendState.topY, bendState.bottomY),
          );
        }
      };

      if (isMobile) {
        // xs + mobile: static bent state, no scroll-driven animation
        bendState.topY = TOP_BENT;
        bendState.bottomY = BOTTOM_BENT;
        applyBend();
        return;
      }

      if (isTablet) {
        // md: lighter scrub for tablets
        gsap
          .timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "bottom bottom",
              end: "bottom center",
              scrub: 0.6,
            },
          })
          .to(bendState, {
            bottomY: BOTTOM_BENT,
            ease: "none",
            onUpdate: applyBend,
          });

        applyBend();
        return;
      }

      // Bottom bend: mirrors top on exit
      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "bottom bottom",
            end: "bottom center",
            scrub: 0.4,
          },
        })
        .to(bendState, {
          bottomY: BOTTOM_BENT,
          ease: "none",
          onUpdate: applyBend,
        });

      applyBend();
    },
    { scope: containerRef },
  );

  return (
    <section
    id="Projects"
      ref={containerRef}
      className="relative lg:pb-0 xl:pb-40 pb-40 w-screen overflow-hidden select-none py-12"
    >
      <div
        style={{ clipPath: "url(#meClip-3)", WebkitClipPath: "url(#meClip-3)" }}
        className="absolute w-full h-full top-0 bg-black"
      ></div>
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="meClip-3" clipPathUnits="objectBoundingBox">
            <path
              ref={clipPathRef}
              d="M 0,0.08 Q 0.5,0.08 1,0.08 L 1,0.92 Q 0.5,0.92 0,0.92 Z"
            />
          </clipPath>
        </defs>
      </svg>
      <div className="w-full z-10 h-full flex flex-col relative ">
        <div className="w-full border-t border-b py-5 border-black/10 px-4 sm:px-12 md:px-16 lg:px-3 flex flex-col md:flex-row items-start md:items-center justify-between  gap-3 xl:gap-6">
          <BlockReveal className="text-amber-50 uppercase tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-[100px] leading-[0.95] text-left">
            PROJECTS
          </BlockReveal>

          <div className=" xl:min-w-3xl ">
            <p className="w-full text-amber-50/60 max-w-xl lg:max-w-lg text-left leading-tight  text-base sm:text-lg md:text-xl lg:text-md font-light">
              Featured works showcasing interactive 3D web experiences and
              modern applications.
            </p>
          </div>
        </div>

        <div className="w-full xl:mt-10  px-2 sm:px-12 md:px-16 lg:px-2 flex gap-4 flex-wrap xl:gap-8 relative xl:justify-between">
          {projectsData.map((project, index) => {
            return (
              <div
                key={index}
                className="w-full  md:w-[calc(50%-16px)]"
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
              >
                <ProjectCard project={project} index={index} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
