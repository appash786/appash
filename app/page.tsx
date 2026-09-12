"use client";
import Hero from "@/components/ThreeJs/VisualHero";
import PixelBlast from "@/components/Bg/PixelsBlast";
import About from "@/components/Home/About";
import Who from "@/components/Home/Who";
import Projects from "@/components/Home/Projects";
import Skills from "@/components/Home/Skills";
import What from "@/components/Home/What";
import Blogs from "@/components/Home/Blogs";
export default function Home() {
  return (
    <>
      <Hero />
      {/* <Who /> */}
      <Skills />
      <What />
      <Projects />
      <Blogs />
    </>
  );
}
