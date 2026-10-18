"use client";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const Cta = () => {
  const CtaRef = useRef(null);
  useGSAP(() => {
    if (window.innerWidth < 768) {
      gsap.set(".form", { y: 0 });
      return;
    }

    gsap.fromTo(
      ".form",
      { y: 160 },
      {
        y: -100,
        scrollTrigger: {
          trigger: CtaRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });
  return (
    <section
      ref={CtaRef}
      className="w-full z-10 h-[70vh] flex flex-col  relative "
    >
      <div className="w-full border-t border-b py-5   border-black/10 px-6 sm:px-12 md:px-16 flex flex-col md:flex-row items-start md:items-center justify-between xl:gap-6">
        <p className="BlackT MoveText uppercase xl:max-w-[60%] tracking-tight text-4xl sm:text-6xl md:text-6xl lg:text-5xl xl:text-[80px] leading-[0.95] text-left">
          I’M HERE TO TALK ABOUT YOU, YOUR COMPANY AND YOUR NEXT BIG IDEA
        </p>

        <div className=" xl:min-w-[40%] lg:min-w-[50%] w-full   flex justify-center  relative xl:p-4 mt-4 gap-5 h-full">
          <div className="flex flex-col translate-y-20 xl:absolute gap-4 form  bg-red-700 px-5 py-7  xl:p-10">
            <p className="w-full  text-amber-50  xl:max-w-xl text-left leading-tight  text-base sm:text-lg md:text-xl font-light">
              Have a project, a video or a brand in mind? Tell me about it and
              let’s make it happen.
            </p>

            <div>
              <input
                type="text"
                placeholder="Your name"
                className=" w-full h-[50px] focus:outline-none  text-amber-50"
              />
              <div className="w-full h-[2px] bg-amber-50/70" />
            </div>

            <div className="">
              <input
                type="text"
                placeholder="Your email address"
                className=" w-full h-[50px] focus:outline-none text-amber-50"
              />
              <div className="w-full h-[2px] bg-amber-50/70" />
            </div>

            <div className="w-full flex flex-col">
              <textarea
                id="message"
                name="message"
                className="focus:outline-none"
                placeholder="How can i Help You"
              ></textarea>
              <div className="w-full h-[2px] mt-1 bg-amber-50/70" />
            </div>

            <div className="w-full flex items-center leading-tight  text-md justify-between">
              <p className="opacity-80">I usually reply within 24 hours.</p>
              <button className="bg-white text-sm  px-3  xl:px-8 py-2 text-red-900">
                Send message
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className=" w-full h-50 px-15 mt-2 hidden ">
        <p className="w-full MoveText text-black/50  max-w-xl text-left leading-tight  text-base sm:text-lg md:text-sm font-light">
          Featured works showcasing interactive 3D web experiences and modern
          applications.
        </p>
      </div>
    </section>
  );
};

export default Cta;
