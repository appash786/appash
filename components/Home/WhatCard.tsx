"use client";

import React, { forwardRef } from "react";

export interface CardData {
  id: string;
  title: string;
  desc: string;
  tag: string;
  gradient: string;
  border: string;
  badge: string;
  glow: string;
  initialLeft: string;
  initialTop: string;
  targetTop: string;
  width: string;
  height: string;
}

interface WhatCardProps {
  card: CardData;
}

const WhatCard = forwardRef<HTMLDivElement, WhatCardProps>(({ card }, ref) => {
  return (
    <div
      ref={ref}
      className={`absolute z-10 ${card.initialLeft} ${card.width} ${card.height}  p-6 sm:p-8 bg-gradient-to-br ${card.gradient} border ${card.border} backdrop-blur shadow-2xl flex flex-col justify-between overflow-hidden`}
      style={{
        top: card.initialTop,
        boxShadow: `0 20px 40px -15px ${card.glow}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-2xl sm:text-3xl font-mono font-bold px-3 py-1  border ${card.badge}`}
        >
          {card.id}
        </span>
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
          {card.tag}
        </span>
      </div>
      <div className="mt-auto">
        <h3 className="text-2xl uppercase sm:text-3xl font-bold text-white tracking-tight mb-2 sm:mb-3">
          {card.title}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
          {card.desc}
        </p>
      </div>
    </div>
  );
});

WhatCard.displayName = "WhatCard";

export default WhatCard;
