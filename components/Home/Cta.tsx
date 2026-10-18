"use client";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import gsap from "gsap";
import Toast from "@/components/ui/Toast";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Status = "idle" | "sending" | "sent" | "error";

const Cta = () => {
  const ctaRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [toastVisible, setToastVisible] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // parallax only on desktop; mobile gets no animation
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          ".form",
          { y: 160 },
          {
            y: -100,
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: ctaRef },
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // grab before the await
    setStatus("sending");

    try {
      const data = Object.fromEntries(new FormData(form));
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setToastVisible(true);
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
    <Toast
      message="Submitted"
      visible={toastVisible}
      onClose={() => {
        setToastVisible(false);
        setStatus("idle");
      }}
    />
    <section id="Cta"
      ref={ctaRef}
      className="w-full z-10 h-[70vh] flex flex-col relative"
    >
      <div className="w-full border-t border-b py-5 border-black/10 px-6 sm:px-12 md:px-16 flex flex-col md:flex-row items-start md:items-center justify-between xl:gap-6">
        <p className="BlackT MoveText uppercase xl:max-w-[60%] tracking-tight text-4xl sm:text-6xl md:text-6xl lg:text-5xl xl:text-[80px] leading-[0.95] text-left">
          I’M HERE TO TALK ABOUT YOU, YOUR COMPANY AND YOUR NEXT BIG IDEA
        </p>

        <div className="xl:min-w-[40%] lg:min-w-[50%] w-full flex justify-center relative xl:p-4 mt-4 gap-5 h-full">
          <form
            onSubmit={onSubmit}
            className="flex flex-col translate-y-20 xl:absolute gap-4 form bg-red-700 px-5 py-7 xl:p-10"
          >
            <p className="w-full text-amber-50 xl:max-w-xl text-left leading-tight text-base sm:text-lg md:text-xl font-light">
              Have a project, a video or a brand in mind? Tell me about it and
              let’s make it happen.
            </p>

            <div className="group">
              <input
                type="text"
                name="name"
                aria-label="Your name"
                placeholder="Your name"
                required
                maxLength={100}
                autoComplete="name"
                className="w-full h-[50px] focus:outline-none text-amber-50 placeholder:text-amber-50/60"
              />
              <div className="w-full h-[2px] bg-amber-50/70 group-focus-within:bg-amber-50" />
            </div>

            <div className="group">
              <input
                type="email"
                name="email"
                aria-label="Your email address"
                placeholder="Your email address"
                required
                maxLength={150}
                autoComplete="email"
                className="w-full h-[50px] focus:outline-none text-amber-50 placeholder:text-amber-50/60"
              />
              <div className="w-full h-[2px] bg-amber-50/70 group-focus-within:bg-amber-50" />
            </div>

            <div className="group w-full flex flex-col">
              <textarea
                id="message"
                name="message"
                aria-label="Your message"
                placeholder="How can I help you?"
                required
                maxLength={2000}
                rows={3}
                className="w-full resize-none focus:outline-none text-amber-50 placeholder:text-amber-50/60"
              />
              <div className="w-full h-[2px] mt-1 bg-amber-50/70 group-focus-within:bg-amber-50" />
            </div>

            {/* honeypot: hidden from humans, bots fill it */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <div className="w-full flex items-center gap-3 leading-tight text-md justify-between">
              <p className="opacity-80 text-amber-50">
                I usually reply within 24 hours.
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-white text-sm px-3 xl:px-8 py-2 text-red-900 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "sending" ? "Sending..." : "Send message"}
              </button>
            </div>

            {status === "error" && (
              <p aria-live="polite" className="text-amber-50 text-sm min-h-5">
                Something went wrong. Please try again or message me directly.
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="w-full h-50 px-15 mt-2 hidden">
        <p className="w-full MoveText text-black/50 max-w-xl text-left leading-tight text-base sm:text-lg md:text-sm font-light">
          Featured works showcasing interactive 3D web experiences and modern
          applications.
        </p>
      </div>
    </section>
    </>
  );
};

export default Cta;