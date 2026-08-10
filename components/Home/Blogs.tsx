import React from "react";
import FlowingMenu from "@/components/Menu/FlowingMenu";

import { useEffect, useState } from "react";
import Image from "next/image";
import LineBar from "../LineBar";
import { div } from "three/src/nodes/math/OperatorNode.js";
const Blogs = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const BlogsData = [
    {
      id: 1,
      text: "Productivity", // Keeping this as your main category
      title: "10 Habits of Highly Effective Developers",
      image: "/Assets/Images/Appash/image_1.jpg",
      readTime: "5 min read",
      tags: ["Focus", "Career", "Habits"],
    },
    {
      id: 2,
      text: "Web Design",
      title: "Mastering UI/UX: A Guide for Beginners",
      image: "/Assets/Images/Appash/image_2.jpg",
      readTime: "8 min read",
      tags: ["Figma", "UI/UX", "CSS"],
    },
    {
      id: 3,
      text: "Lifestyle",
      title: "How to Balance Remote Work and Personal Life",
      image: "/Assets/Images/Appash/image_3.jpg",
      readTime: "4 min read",
      tags: ["Remote", "Mental Health", "Wellness"],
    },
    {
      id: 4,
      text: "Technology",
      title: "The Future of AI in Modern Applications",
      image: "/Assets/Images/Appash/image_4.jpg",
      readTime: "10 min read",
      tags: ["Machine Learning", "Tech Trends", "OpenAI"],
    },
    {
      id: 5,
      text: "Freelancing",
      title: "Pricing Your Projects: Time vs. Value",
      image: "/Assets/Images/Appash/image_5.jpg",
      readTime: "6 min read",
      tags: ["Business", "Finance", "Clients"],
    },
    {
      id: 6,
      text: "Tutorials",
      title: "Building Fast Websites with Next.js",
      image: "/Assets/Images/Appash/image_6.jpg",
      readTime: "12 min read",
      tags: ["React", "Performance", "Web Dev"],
    },
  ];
  return (
    <section className="relative w-screen overflow-hidden select-none py-12">
      <div className="w-full h-full flex flex-col relative z-0">
        <div className="w-full border-t border-b py-5 border-amber-50/20 px-6 sm:px-12 md:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-white uppercase  tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[100px] leading-[0.95] text-left">
            Blogs
          </p>

          <p className="w-full md:w-[30%] lg:w-[25%] text-white/80 text-left md:text-right text-base sm:text-lg md:text-xl font-light leading-relaxed">
            Featured works showcasing interactive 3D web experiences and modern
            applications.
          </p>
        </div>

        <div className="w-full flex flex-col   relative ">
          {BlogsData.map((item, index) => (
            <div>
              <div key={index} className="w-full  px-16  py-5">
                <div className="flex px-3  f ">
                  <div className="relative aspect-video w-[900px] overflow-hidden  shadow-md bg-gray-100">
                    {/* Tags Container */}
                    <div className="absolute right-3 top-3 z-10 flex max-w-[30%] flex-wrap justify-end gap-2">
                      {item.tags.map((tag, i) => (
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

                  <div></div>

                  <div className="ml-8 flex flex-col w-full  justify-between">
            
                      <p className="text-white text-2xl">{item.title}</p>
                      <p className="text-white/70 text-md">{item.readTime}</p>
   

                  </div>

                  <div className="float-right  w-[5%] flex justify-center items-center ">
                    <p className="text-white">{">"}</p>
                  </div>
                </div>
              </div>
              <LineBar />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
