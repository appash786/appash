import React, { useRef } from "react";
import Image from "next/image";
import LineBar from "../LineBar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BlogList = ({ lists }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLDivElement>(".blog-item");

      items.forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.8 },
          {
            scale: 1,
            duration: .3,
            ease:"power1.out",
            scrollTrigger: {
              trigger: el,
              start: "top 70%",
              end: "bottom center",
            
              markers: true,
            },
          }
        );
      });
    },
    { scope: containerRef, dependencies: [lists] }
  );

  return (
    <div ref={containerRef} className="w-full flex flex-col relative">
      {lists.map((item: any, index: number) => (
        <div key={item.id ?? index}>
          <div className="blog-item w-full px-16 py-5">
            <div className="flex px-3">
              <div className="relative aspect-video w-[900px] overflow-hidden shadow-md bg-gray-100">
                {/* Tags Container */}
                <div className="absolute right-3 top-3 z-10 flex max-w-[30%] flex-wrap justify-end gap-2">
                  {item.tags.map((tag: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center rounded bg-amber-100 px-2.5 py-1 shadow-sm text-amber-900"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider">
                        {tag}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Background Image */}
                <Image
                  className="object-cover"
                  src={item.image}
                  alt="Story thumbnail"
                  fill
                  sizes="500px"
                />
              </div>

              <div className="ml-8 flex flex-col w-full justify-between">
                <p className="text-white text-2xl">{item.title}</p>
                <p className="text-white/70 text-md">{item.readTime}</p>
              </div>

              <div className="w-[5%] flex justify-center items-center">
                <p className="text-white">{">"}</p>
              </div>
            </div>
          </div>
          <LineBar />
        </div>
      ))}
    </div>
  );
};

export default BlogList;