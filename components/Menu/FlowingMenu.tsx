"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

interface MenuItemData {

  text: string;
  image: string;
}

interface FlowingMenuProps {
  items?: MenuItemData[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  onItemHover?: (image: string | null) => void;
  activeIndex?: number;
  onItemEnter?: (index: number) => void;
  onItemLeave?: () => void;
}

interface MenuItemProps extends MenuItemData {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  isLast: boolean;
  onItemHover?: (image: string | null) => void;
  isActive: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  speed = 15,
  textColor = "#fff",
  bgColor = "transparent",
  marqueeBgColor = "#fff",
  marqueeTextColor = "#120F17",
  borderColor = "#fff",
  onItemHover,
  activeIndex = -1,
  onItemEnter,
  onItemLeave,
}) => {
  return (
    <div className="w-full h-full overflow-hidden" style={{ backgroundColor: bgColor }}>
      <nav className="flex flex-col h-full m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            isLast={idx === items.length - 1}
            onItemHover={onItemHover}
            isActive={idx === activeIndex}
            onMouseEnter={() => onItemEnter?.(idx)}
            onMouseLeave={() => onItemLeave?.()}
          />
        ))}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({
  text,
  image,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  isLast,
  onItemHover,
  isActive,
  onMouseEnter,
  onMouseLeave,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const marqueeInnerWrapperRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);
  const [isHovered, setIsHovered] = useState(false);
  const edgeRef = useRef<"top" | "bottom">("bottom");

  const animationDefaults = { duration: 0.6, ease: "expo" };

  const findClosestEdge = (
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ): "top" | "bottom" => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist =
      Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector(
        ".marquee-part"
      ) as HTMLElement;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener("resize", calculateRepetitions);
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, [text, image]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector(
        ".marquee-part"
      ) as HTMLElement;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      if (animationRef.current) {
        animationRef.current.kill();
      }

      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    };

    const timer = setTimeout(setupMarquee, 50);
    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [text, image, repetitions, speed]);

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      const edge = findClosestEdge(
        ev.clientX - rect.left,
        ev.clientY - rect.top,
        rect.width,
        rect.height
      );
      edgeRef.current = edge;
    }
    setIsHovered(true);
    onItemHover?.(image);
    onMouseEnter?.();
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      const edge = findClosestEdge(
        ev.clientX - rect.left,
        ev.clientY - rect.top,
        rect.width,
        rect.height
      );
      edgeRef.current = edge;
    }
    setIsHovered(false);
    onItemHover?.(null);
    onMouseLeave?.();
  };

  const showMarquee = isActive || isHovered;

  useEffect(() => {
    if (!marqueeRef.current || !marqueeInnerWrapperRef.current) return;
    const edge = edgeRef.current;

    if (showMarquee) {
      gsap.killTweensOf([marqueeRef.current, marqueeInnerWrapperRef.current]);
      gsap
        .timeline({ defaults: animationDefaults })
        .set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
        .set(marqueeInnerWrapperRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0)
        .to([marqueeRef.current, marqueeInnerWrapperRef.current], { y: "0%" }, 0);
    } else {
      gsap.killTweensOf([marqueeRef.current, marqueeInnerWrapperRef.current]);
      gsap
        .timeline({ defaults: animationDefaults })
        .to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
        .to(
          marqueeInnerWrapperRef.current,
          { y: edge === "top" ? "101%" : "-101%" },
          0
        );
    }
  }, [showMarquee]);

  return (
    <div
      className="flex-1 relative overflow-hidden text-center"
      ref={itemRef}
      style={{ borderBottom:`1px solid ${borderColor}` }}
    >
      <a
        className="flex items-center justify-center h-full relative cursor-pointer uppercase no-underline font-semibold text-[4vh]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          color: textColor,
          opacity: showMarquee ? 1 : 0.4,
          transition: "opacity 0.3s ease",
        }}
      >
        {text}
      </a>
      <div
        className="absolute top-0  left-0 w-full h-full overflow-hidden pointer-events-none translate-y-[101%]"
        ref={marqueeRef}
        style={{ backgroundColor: marqueeBgColor }}
      >
        <div className="w-full h-full" ref={marqueeInnerWrapperRef}>
          <div className="h-full w-fit flex" ref={marqueeInnerRef}>
            {[...Array(repetitions)].map((_, idx) => (
              <div
                className="marquee-part flex items-center flex-shrink-0"
                key={idx}
                style={{ color: marqueeTextColor }}
              >
                <span className="whitespace-nowrap uppercase font-normal text-[4vh] leading-[1] px-[1vw]">
                  {text}
                </span>
                <div
                  className="w-[200px] h-[7vh] my-[2em] mx-[2vw] py-[1em] rounded-[50px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${image})` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowingMenu;
