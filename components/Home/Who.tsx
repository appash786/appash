"use client";
import React, { useState, useEffect, useRef } from "react";
import PixelRevealText from "../Text/PixelText";
import Image from "next/image";
import FlowingMenu from "@/components/Menu/FlowingMenu";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const menuItems = [
  { text: "when working hardd", image: "/Assets/Images/Appash/image_1.jpg" },
  { text: "hobyy ass this ", image: "/Assets/Images/Appash/image_4.jpg" },
  { text: "Time is everything", image: "/Assets/Images/Appash/image_2.jpg" },
];

const TRANSITION = "opacity .7s ease";

const Who = () => {
  // Two image slots — always rendered, cross-fade by toggling opacity
  const [slotA, setSlotA] = useState(menuItems[0].image);
  const [slotB, setSlotB] = useState("");
  const [activeSlot, setActiveSlot] = useState<"a" | "b">("a");
  const [scrollActiveIndex, setScrollActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeIndex = hoveredIndex !== null ? hoveredIndex : scrollActiveIndex;

  const sectionRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleHover = (image: string | null) => {
    if (!image) return; // keep last active image on mouse leave
    setActiveSlot((prev) => {
      if (prev === "a") {
        setSlotB(image);
        return "b";
      } else {
        setSlotA(image);
        return "a";
      }
    });
  };

  useGSAP(() => {
    if (!sectionRef.current || !progressBarRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%", // scroll distance
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const index = Math.min(
            Math.floor(progress * menuItems.length),
            menuItems.length - 1
          );
          setScrollActiveIndex(index);
        },
      },
    });

    tl.to(progressBarRef.current, {
      height: "100%",
      ease: "none",
    });
  }, { scope: sectionRef });

  useEffect(() => {
    const activeImage = menuItems[activeIndex]?.image;
    if (activeImage) {
      handleHover(activeImage);
    }
  }, [activeIndex]);

  return (
    <section ref={sectionRef} className="w-screen z-10  h-screen relative flex justify-center items-center">
      <div className="w-full h-full absolute">
        {/* Slot A */}
        {slotA && (
          <Image
            src={slotA}
            alt="bg-a"
            fill
            className="object-cover absolute inset-0"
            style={{
              transition: TRANSITION,
              opacity: activeSlot === "a" ? 1 : 0,
            }}
          />
        )}
        {/* Slot B */}
        {slotB && (
          <Image
            src={slotB}
            alt="bg-b"
            fill
            className="object-cover absolute inset-0"
            style={{
              transition: TRANSITION,
              opacity: activeSlot === "b" ? 1 : 0,
            }}
          />
        )}
      </div>
      <div className="w-full h-full z-10 flex flex-col">
        <div className="w-full h-[40%] flex justify-end BorderColor border-b ">
          <div className="w-[40%] h-full text-right justify-end items-centerof pr-10 BorderColor border-l ">
            <div className="w-full h-full flex flex-col justify-center items-end ">
              <PixelRevealText
                text={"Not just a dev"}
                gridSize={16}
                className="uppercase text-white font-bold"
                style={{
                  fontSize: "clamp(3.1rem, 5.6vw, 5.5rem)",
                  lineHeight: 0.95,
                }}
              />
              <PixelRevealText
                text={" in progress"}
                gridSize={16}
                className="uppercase text-white font-bold"
                style={{
                  fontSize: "clamp(3.1rem, 5.6vw, 5.5rem)",
                  lineHeight: 0.95,
                }}
              />
              <p className="mt-5 text-white/50 font-sans leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt,
                incidunt. Animi, voluptate accusamus minima blanditiis quibusdam
                non quas quis iste harum sequi eveniet.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-full flex relative justify-end">
            <div className="w-[40%] h-full flex flex-col justify-center relative">
              {/* Progress Bar Line instead of static border-l */}
              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/20 BorderColor" />
              <div
                ref={progressBarRef}
                className="absolute left-0 top-0 w-[2px] bg-white origin-top"
                style={{ height: "0%" }}
              />
              <div className="w-full">
                <FlowingMenu
                  items={menuItems}
                  speed={12}
                  textColor="rgba(255,255,255,0.75)"
                  bgColor="transparent"
                  marqueeBgColor="#ffffff"
                  marqueeTextColor="#0a0a0a"
                  borderColor="rgba(240,248,255,0.3)"
                  onItemHover={handleHover}
                  activeIndex={activeIndex}
                  onItemEnter={(idx) => setHoveredIndex(idx)}
                  onItemLeave={() => setHoveredIndex(null)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Who;
