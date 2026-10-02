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
    <section ref={CtaRef} className="w-full z-10 h-[70vh] flex flex-col  relative ">
      <div className="w-full border-t border-b py-5   border-black/10 px-6 sm:px-12 md:px-16 flex flex-col md:flex-row items-start md:items-center justify-between xl:gap-6">
        <p className="BlackT MoveText uppercase xl:max-w-[60%] tracking-tight text-4xl sm:text-6xl md:text-6xl lg:text-8xl xl:text-[80px] leading-[0.95] text-left">
          I’M here to talk about you, your company
        </p>

        <div className=" xl:min-w-[40%]  flex justify-center  relative p-4 gap-5 h-full">
          <div className="flex flex-col translate-y-20 xl:absolute gap-4 form  bg-red-700  p-10">
            <p className="w-full  text-amber-50  xl:max-w-xl text-left leading-tight  text-base sm:text-lg md:text-xl font-light">
              Featured works showcasing interactive 3D web experiences and
              modern applications.
            </p>

            <input
              type="text"
              placeholder="Name"
              className=" w-full h-[50px] text-amber-50"
            />
            <div className="w-full h-[2px] bg-amber-50/70" />

            <input
              type="text"
              placeholder="Email"
              className=" w-full h-[50px] text-amber-50"
            />
            <div className="w-full h-[2px] bg-amber-50/70" />
            <textarea
              id="message"
              name="message"
              placeholder="How can i Help You"
            ></textarea>
            <div className="w-full h-[2px] bg-amber-50/70" />
            <div className="w-full flex items-center justify-between">
              <p>submentite ernera enre</p>
              <button className="bg-white px-8 py-2 text-red-900">
                submit
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
