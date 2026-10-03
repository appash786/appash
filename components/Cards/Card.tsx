"use client";
import React, { useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomEase from "gsap/dist/CustomEase";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
gsap.registerPlugin(CustomEase);
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ThreeDImage = ({
  image,
  index,
}: {
  image?: { img: string; depth: string };
  index: number;
}) => {
  if (!image) return null;
  const mouse = useRef<[number, number]>([0, 0]);
  const hovering = useRef(false);
  const onReady = useCallback(() => {}, []);
  const cameraZ = useRef({ value: 5 });
  const CanvaRef = useRef<HTMLImageElement>(null);

  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 10,
    objectFit: "cover",
    aspectRatio: "16:9",
  };

  useGSAP(() => {
    if (!CanvaRef.current) return;

    if (window.innerWidth < 768) {
      gsap.set(CanvaRef.current, {
        clipPath: "inset(0% 0% 0% 0% round 10px)",
        translateX: "0%",
      });
      return;
    }

    const isLeft = index % 2 === 0;

    gsap.fromTo(
      CanvaRef.current,
      {
        clipPath: "inset(20% 20% 20% 20% round 10px)",
        translateX: isLeft ? "20%" : "-20%",
      },
      {
        clipPath: "inset(0% 0% 0% 0% round 10px)",
        translateX: "0%",

        duration: 1.5,

        ease: CustomEase.create(
          "custom",
          "M0,0 C0.084,0.61 0.061,0.599 0.195,0.789 0.263,0.886 0.374,1 1,1 ",
        ),
        scrollTrigger: {
          trigger: CanvaRef.current,
          start: "top 90%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  const onMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouse.current = [
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -(((e.clientY - rect.top) / rect.height) * 2 - 1),
    ];
    hovering.current = true;
  };

  const onLeave = () => {
    hovering.current = false;
  };

  return (
    <div
      className="w-full aspect-video xl:h-[78%] relative   justify-center items-center flex  rounded-lg xl:rounded-xl "
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <Image
        ref={CanvaRef}
        src={image.img}
        alt={"appasj"}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};

export default ThreeDImage;
