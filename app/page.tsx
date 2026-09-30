"use client";
import Hero from "@/components/Home/Hero"
import Projects from "@/components/Home/Projects";
import Skills from "@/components/Home/Skills";
import What from "@/components/Home/What";
import Blogs from "@/components/Home/Blogs";
import Me from "@/components/Home/Me";
import Brief from "@/components/Home/Brief";
import TopographyBackground from "@/components/Bg/TopographyBackground";
import BCta from "@/components/Home/BCta";
import Cta from "@/components/Home/Cta";
import Footer from "@/components/Home/Footer";
export default function Home() {
  return (
    <>
      <TopographyBackground />
      <Hero />
      <Brief />
      <Me />
      <Skills />
      <What />
      <Projects />

      <BCta />

      <Cta />
      <Blogs />
      <Footer />
    </>
  );
}
