"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Blogs", href: "#blogs" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Twitter", href: "https://twitter.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
];

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!footerRef.current) return;

      gsap.fromTo(
        nameRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      gsap.fromTo(
        contentRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-red-700 overflow-hidden select-none"
    >
      {/* Top border line */}
      <div className="w-full h-px bg-white/10" />

      {/* Big ghost name */}
      <div
        ref={nameRef} 
        className="px-6 sm:px-12   md:px-16 pt-16 pb-8 overflow-hidden"
      >
        <p className="text-white z-10 uppercase font-black leading-none tracking-tighter text-[18vw]">
          Appash
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/50" />

      {/* Content row */}
      <div
        ref={contentRef}
        className="px-6 sm:px-12 md:px-16 py-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-10"
      >
        {/* Left — tagline + nav */}
        <div className="flex flex-col gap-6 max-w-sm">
          <p className="text-white/80 text-sm leading-relaxed font-light">
            Crafting purposeful digital experiences at the intersection of
            design and technology.
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/60 uppercase font-semibold text-sm tracking-widest hover:text-white transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right — socials */}
        <div className="flex flex-col items-start md:items-end gap-4">
          <p className="text-white/80 uppercase text-xs tracking-widest">
            Find me on
          </p>
          <div className="flex gap-5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative text-white/60 uppercase font-semibold text-sm  tracking-widest hover:text-white transition-colors duration-300"
              >
                {s.label}
                <span className="absolute -bottom-px left-0 w-0 h-px bg-red-600 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full h-px bg-white/50" />
      <div className="px-6 sm:px-12 md:px-16 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="text-white/80 text-xs uppercase tracking-widest">
          © {new Date().getFullYear()} Appash. All rights reserved.
        </p>
        <p className="text-white/80 text-xs uppercase tracking-widest">
          Designed &amp; Built by Appash
        </p>
      </div>
    </footer>
  );
};

export default Footer;
