'use client'
import Hero  from "@/components/ThreeJs/VisualHero";
import PixelBlast from "@/components/Bg/PixelsBlast";
import About from "@/components/Home/About";
import Who from "@/components/Home/Who";
import Skills from "@/components/Home/Skills";

export default function Home() {
  return <>
  <Who/>
 <Skills />




  
<div className="w-full h-full z-0 opacity-80  fixed top-0 left-0 ">
      <PixelBlast
    variant="square"
    pixelSize={7}
    color="#8B0000"
    patternScale={5.5}
    patternDensity={1}
    pixelSizeJitter={1.05}
    enableRipples
    rippleSpeed={1}
    rippleThickness={0.12}
    rippleIntensityScale={1.5}
    liquid={false}
    liquidStrength={0.12}
    liquidRadius={1.2}
    liquidWobbleSpeed={5}
    speed={0.25}
    edgeFade={0.27}
    transparent
  />
</div>
  </>;
}
