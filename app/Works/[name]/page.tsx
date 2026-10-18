"use client";

import { Fragment, useLayoutEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TopographyBackground from "@/components/Bg/TopographyBackground";
import BlockReveal from "@/components/Text/BlockReveal";
import Projects from "@/components/Home/Projects";

/* ------------------------------------------------------------------ */
/* Content                                                            */
/* ------------------------------------------------------------------ */
const COPY =
  "A premium portfolio website designed for Mecabo, a modern construction company, engineered to showcase their projects, works, and services while maximizing lead generation.";

const CHALLENGE =
  "Mecabo needed a powerful digital presence that not only showcases their extensive construction works and services with premium visual details, but also functions as an active sales driver. Their main target was to increase business inquiries by converting website visitors into prospective clients.";

const HERO_COPY =
  "We built a premium portfolio website to highlight their project works and services, establishing a high-converting digital channel to capture qualified leads.";

const SERVICES = ["Web Design", "Web Development", "UI/UX"];

/* ------------------------------------------------------------------ */
/* Shared class strings                                               */
/* ------------------------------------------------------------------ */
const BIG =
  "m-0 text-[clamp(2.4rem,5.5vw,7rem)] leading-[0.95] font-normal tracking-[-0.02em]";
const MID = "m-0 text-[clamp(1.8rem,3.2vw,4rem)] leading-none font-normal";
const COPY_LG = "w-full lg:w-[28vw] text-[clamp(1.2rem,1.35vw,3.5rem)]";
const COPY_SM = "text-[clamp(0.8rem,0.95vw,1.1rem)]";
const PLACEHOLDER = "bg-[#d9d9d9]";
const LABEL = "block mb-0.5 text-[10px]";

/* ------------------------------------------------------------------ */
/* Text-fill paragraph                                                */
/* ------------------------------------------------------------------ */
type RevealProps = {
  text: string;
  tone?: "onBlack" | "onWhite";
  className?: string;
  start?: string;
  end?: string;
};

const TONES = {
  onBlack: "[--dim:rgba(255,255,255,0.2)] [--lit:#fff]",
  onWhite: "[--dim:rgba(0,0,0,0.18)] [--lit:#000]",
};

function RevealText({
  text,
  tone = "onBlack",
  className = "",
  start,
  end,
}: RevealProps) {
  return (
    <p
      className={`m-0 leading-[1.25] ${TONES[tone]} ${className}`}
      data-reveal
      data-start={start}
      data-end={end}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, i) => (
          <Fragment key={i}>
            <span className="relative inline-block text-[#606060]  xl:text-[color:var(--dim)] lg:text-black">
              {word}
              <span
                data-fill
                className="pointer-events-none absolute left-0 top-0 whitespace-nowrap text-[color:var(--lit)] [clip-path:inset(0%_100%_0%_0%)] motion-reduce:[clip-path:none]"
              >
                {word}
              </span>
            </span>{" "}
          </Fragment>
        ))}
      </span>
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Client / Services / Timeline / Year block                          */
/* ------------------------------------------------------------------ */
function InfoBlock() {
  return (
    <div className="relative lg:absolute lg:left-1/2 lg:top-[5vw] z-[5] grid w-full lg:w-[min(724px,92vw)] lg:-translate-x-1/2 grid-cols-1 sm:grid-cols-[30%_1fr_17%] lg:grid-rows-[96px_auto] leading-[1.15] text-white gap-6 lg:gap-0 p-6 lg:p-0">
      {/* Client */}
      <div className="col-start-1 row-start-1 flex flex-col justify-end border-b border-white pb-3 pl-0.5 pr-3">
        <span className={`${LABEL} text-left lg:text-right`}>Client</span>
        <span className="text-[32px] lg:text-[40px] leading-[0.95]">Innovations Pvt Ltd</span>
      </div>

      {/* Services */}
      <div className="col-start-2 row-start-1 flex flex-col justify-end border-b lg:border-l border-white pb-[9px] pl-0 lg:pl-3 pt-4 lg:pt-0">
        <span className={LABEL}>Services</span>
        <div className="flex flex-wrap gap-1.5">
          {SERVICES.map((s) => (
            <span
              key={s}
              className="bg-[#d9d9d9] px-2.5 py-px text-[10px] leading-normal text-black"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="col-start-3 row-start-1 lg:translate-y-1/2 self-start lg:self-end pl-0 lg:pl-1.5 pt-4 lg:pt-0">
        <span className={LABEL}>Timeline</span>
        <span className="text-[24px] lg:text-[28px]">2 Weeks</span>
      </div>

      {/* Year */}
      <div className="col-start-1 row-start-2 pr-2 pt-1.5 hidden lg:block">
        <span className={`${LABEL} text-right`}>Year</span>
        <span className="block text-right text-2xl">August 2026</span>
      </div>

      <p className="col-start-2 row-start-2 m-0 lg:border-l border-white lg:pl-3 lg:pr-5 pt-1.5 text-xs">
        {COPY}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
export default function Page() {
  const rootRef = useRef<HTMLElement>(null);
  const darkRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const outDarkRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [hAnim, setHAnim] = useState<gsap.core.Animation | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia(rootRef);

    // Desktop only: Horizontal scroll & pinning setup
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const dark = darkRef.current!;
      const track = trackRef.current!;
      const getDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      const horizontal = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: dark,
          start: "top center",
          end: () => "+=" + getDistance(),
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      setHAnim(horizontal);

      gsap.fromTo(
        [darkRef.current, bannerRef.current],
        { translateY: 200 },
        {
          translateY: 0,
          ease: "expo.out",
          duration: 2,
          scrollTrigger: {
            trigger: outDarkRef.current,
            start: "center 70%",
            end: "bottom -20%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.timeline({
        scrollTrigger: {
          trigger: outDarkRef.current,
          start: "top top",
          end: () => "+=" + getDistance(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const fills = el.querySelectorAll("[data-fill]");
        const inTrack = track.contains(el);

        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: el.dataset.start ?? (inTrack ? "left 75%" : "top 80%"),
              end: el.dataset.end ?? (inTrack ? "left 35%" : "top 35%"),
              scrub: 1,
              ...(inTrack ? { containerAnimation: horizontal } : {}),
            },
          })
          .fromTo(
            fills,
            { clipPath: "inset(0% 100% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              duration: 2,
              stagger: 2,
            },
          );
      });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    });

    return () => {
      setHAnim(null);
      mm.revert();
    };
  }, []);

  return (
    <>
      <TopographyBackground />
      <main
        ref={rootRef}
        className="isolate overflow-x-clip bg-white font-sans text-black [--cap:17vw]"
      >
        {/* ---------------- HERO ---------------- */}
        <section className="relative z-[2] px-[7vw]">
          <div className="mb-[1.7vw] translate-y-10 lg:translate-y-20 grid grid-cols-1 lg:grid-cols-[55%_1fr] items-start gap-8 lg:gap-0">
            <h1 className="m-0 text-[8vw] lg:text-[4.6vw] font-normal uppercase leading-[0.95]">
              Ecommerce
              <br />
              Application
            </h1>

            <div>
              <p className="max-w-full lg:max-w-[36vw] text-[clamp(1rem,1.2vw,1.3rem)] leading-[1.1]">
                {HERO_COPY}
              </p>
              <div className="mt-[1.1vw] flex gap-[1.2vw]">
                {["Visit Site", "All Works"].map((label) => (
                  <a
                    key={label}
                    href="#"
                    className="grid h-[40px] lg:h-[2.4vw] w-[120px] lg:w-[9.6vw] place-items-center bg-[#d9d9d9] text-[12px] lg:text-[0.8vw] text-black no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8f0e0e]"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div ref={bannerRef} className="aspect-[16/9] w-full translate-y-10 lg:translate-y-30 bg-[#8f0e0e]" />
        </section>

        {/* ---------------- SECTION (Horizontal on Desktop, Vertical on Mobile) ---------------- */}
        <div ref={outDarkRef} className="bg-black relative mt-20 lg:mt-0">
          <section
            ref={darkRef}
            className="relative z-[1] h-auto lg:h-screen bg-black text-white py-16 lg:py-0"
          >
            {/* InfoBlock remains pinned/fixed on desktop, normal stacked block on mobile */}
            <InfoBlock />

            {/* Clips track on desktop, flows normally as a stacked column on mobile */}
            <div className="relative lg:absolute lg:inset-0 overflow-visible lg:overflow-hidden motion-reduce:overflow-x-auto mt-16 lg:mt-0">
              <div
                ref={trackRef}
                className="flex flex-col lg:flex-row h-auto lg:h-full w-full lg:w-max items-start lg:items-end gap-16 lg:gap-[5vw] px-[7vw] pb-12 lg:pb-[9vh] will-change-transform [&>*]:flex-none"
              >
                <div className="hidden lg:block w-[50vw] h-1" />
                
<div className="flex flex-col gap-3">
                  {/* Block 1 */}
                <div className="flex flex-col leading-[0.95]">
                  <BlockReveal
                    className={BIG}
                    color="#A50000"
                    delay={0.15}
                    duration={1.2}
                  >
                    <span>Showcasing</span>
                  </BlockReveal>
                  <BlockReveal
                    className={BIG}
                    color="#A50000"
                    delay={0.15}
                    duration={1.2}
                  >
                    <span>structural works,</span>
                  </BlockReveal>
                  <BlockReveal
                    className={BIG}
                    color="#A50000"
                    delay={0.15}
                    duration={1.2}
                  >
                    <span>generating</span>
                  </BlockReveal>
                  <BlockReveal
                    className={BIG}
                    color="#A50000"
                    delay={0.15}
                    duration={1.2}
                  >
                    <span>high-intent leads.</span>
                  </BlockReveal>
                </div>

                {/* Copy Paragraph */}
                <RevealText className={COPY_LG} text={COPY} />
</div>

                {/* Placeholder Image 1 */}
                <div className={`h-[40vh] lg:h-[50vh] w-full lg:w-[30vw] ${PLACEHOLDER}`} />

                {/* Challenge Section */}
                <div className="flex h-auto lg:h-[50vh] w-full lg:w-[30vw] gap-3 xl:gap-5 flex-col">
                  <div className="flex flex-col leading-[0.95]">
                    <BlockReveal
                      className={MID}
                      color="#A50000"
                      delay={0.15}
                      duration={1.2}
                      trigger={hAnim}
                    >
                      <span>The Challenge</span>
                    </BlockReveal>
                  </div>
                  <RevealText className={COPY_LG} text={CHALLENGE} />
                </div>

                {/* Approach Section */}
                <div className="flex flex-col gap-4 ">
                  <div className="  leading-[0.95]">
                    <BlockReveal
                      className={MID}
                      color="#A50000"
                      delay={0.15}
                      duration={1.2}
                      trigger={hAnim}
                    >
                      <span>Our Approach</span>
                    </BlockReveal>
                  </div>
                  <RevealText className={COPY_LG} text={COPY} />
                </div>

                {/* Key Features Section */}
                <div className="flex-col xl:w-auto w-full   flex ">
                  <div className="mb-4 lg:mb-2">
                    <BlockReveal
                      className={MID}
                      color="#A50000"
                      delay={0.15}
                      duration={1.2}
                      trigger={hAnim}
                    >
                      <span>Key Features</span>
                    </BlockReveal>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-5 lg:gap-[2vw] w-full">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-[30vh] lg:h-[40vh] w-full lg:w-[24vw] ${PLACEHOLDER}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Tech Stack Section */}
                <div className="flex flex-col lg:flex-row  xl:w-auto w-full   pb-12 lg:pb-0">
                  <div className="flex flex-col">
                    <BlockReveal
                      className={BIG}
                      color="#A50000"
                      delay={0.15}
                      duration={1.2}
                      trigger={hAnim}
                    >
                      <span>Tech</span>
                    </BlockReveal>
                    <BlockReveal
                      className={BIG}
                      color="#A50000"
                      delay={0.15}
                      duration={1.2}
                      trigger={hAnim}
                    >
                      <span>Stack &</span>
                    </BlockReveal>
                    <BlockReveal
                      className={BIG}
                      color="#A50000"
                      delay={0.15}
                      duration={1.2}
                      trigger={hAnim}
                    >
                      <span>Deliverables</span>
                    </BlockReveal>
                  </div>
                  <div className="flex flex-col sm:flex-row mt-8 lg:mt-0 lg:ml-10 items-start lg:items-center gap-8 lg:gap-10 justify-center">
                    <div className="text-[clamp(0.95rem,1.35vw,1.5rem)]">
                      <span className={LABEL}>Services &amp; Tech</span>
                      <ul className="m-0 mt-[0.4em] list-none p-0">
                        <li>Web Design</li>
                        <li>Web Development</li>
                        <li>UI/UX</li>
                      </ul>
                    </div>
                    <div className="text-[clamp(0.95rem,1.35vw,1.5rem)]">
                      <span className={LABEL}>Services &amp; Tech</span>
                      <ul className="m-0 mt-[0.4em] list-none p-0">
                        <li>Web Design</li>
                        <li>Web Development</li>
                        <li>UI/UX</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </div>

        <Projects />
      </main>
    </>
  );
}