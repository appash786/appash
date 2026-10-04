"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const BG = "#C30201";
const STROKE = "white";
const MIN_DISPLAY_S = 3; // minimum time the loader stays up

const SIGNATURE_PATH =
  "M32.705,433.705 C32.705,433.705 55.819,331.312 163.705,178.705 C271.591,26.098 287.705,13.705 287.705,13.705 C287.705,13.705 227.795,223.029 248.705,372.705 C250.486,385.456 252.360,309.184 157.705,311.705 C63.050,314.226 -12.884,325.671 13.705,297.705 C45.524,264.238 155.549,210.170 213.705,193.705 C291.307,171.735 450.116,162.648 365.705,216.705 C281.243,270.794 299.926,254.087 272.540,281.558 C256.067,298.083 251.705,327.705 251.705,327.705 C251.705,327.705 284.849,236.816 298.705,221.705 C312.561,206.594 244.674,302.355 283.705,275.705 C322.736,249.055 335.239,244.309 340.705,246.705 C350.513,251.004 383.239,246.387 398.415,231.601 C416.379,214.099 444.906,176.165 386.705,252.705 C365.218,280.963 356.705,305.705 356.705,305.705 L357.705,309.705 L369.705,288.705 C369.705,288.705 404.678,240.396 405.705,239.705 C406.732,239.014 451.649,197.767 464.705,201.705 C477.761,205.643 460.630,224.566 452.705,228.705 C444.780,232.844 401.705,245.705 401.705,245.705 L405.705,246.705 C405.705,246.705 464.544,232.169 483.705,220.705 C496.699,212.931 498.568,207.231 514.906,198.119 C526.278,191.777 527.705,195.705 527.705,195.705 C527.705,195.705 490.746,201.905 485.705,234.705 C484.956,239.579 510.093,225.929 525.705,204.705 C530.038,198.814 518.705,227.705 518.705,227.705 C518.705,227.705 515.978,234.951 535.705,223.705 C555.386,212.485 563.705,208.705 563.705,208.705 C563.705,208.705 592.335,191.136 591.705,185.705 C591.075,180.274 559.808,182.732 571.705,196.705 C584.907,212.210 598.444,221.523 589.705,233.705 C580.966,245.887 554.985,249.491 559.705,240.705 C564.425,231.919 594.291,217.449 611.705,209.705 C629.119,201.961 672.633,177.744 698.705,132.705 C724.777,87.666 740.226,52.840 737.705,47.705 C735.184,42.570 705.664,69.410 668.705,148.705 C631.746,228.000 629.705,238.705 629.705,238.705 C629.705,238.705 651.036,207.512 665.705,198.705 C680.374,189.898 685.851,181.521 683.705,201.705 C681.559,221.889 684.931,230.103 724.705,231.705 C767.646,233.434 834.616,213.492 833.705,213.705";

interface LoadingScreenProps {
  onComplete?: () => void;
  /**
   * Keep this false until your heavy content (R3F scene, textures, etc.)
   * is ready. Defaults to true, so only window load + fonts + the minimum
   * time are waited on.
   */
  ready?: boolean;
}

export default function LoadingScreen({
  onComplete,
  ready = true,
}: LoadingScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const [visible, setVisible] = useState(true);

  const readyRef = useRef(ready);
  const onCompleteRef = useRef(onComplete);
  const tryFinishRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    readyRef.current = ready;
    tryFinishRef.current?.();
  }, [ready]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let cancelled = false;
    let finished = false;
    let pageLoaded = false;
    let minTimePassed = false;
    let creep: gsap.core.Tween | null = null;

    const path = pathRef.current;
    const len = path ? path.getTotalLength() : 3000;
    if (path) path.style.strokeDasharray = `${len} ${len}`;

    // One object owns progress. Only one tween runs on it at a time and each
    // starts from the current value, so the drawing can never go backwards.
    const progress = { value: 0 };

    const render = () => {
      if (path) {
        path.style.strokeDashoffset = String(len * (1 - progress.value / 100));
      }
    };

    const ctx = gsap.context(() => {
      render();

      // Phase 1: draw 0 -> 90% over the minimum display time
      gsap.to(progress, {
        value: 90,
        duration: MIN_DISPLAY_S,
        ease: "power1.inOut",
        onUpdate: render,
        onComplete: () => {
          minTimePassed = true;
          tryFinish();
          // Phase 2: still waiting, so creep slowly and never look frozen
          if (!finished && !cancelled) {
            ctx.add(() => {
              creep = gsap.to(progress, {
                value: 97,
                duration: 12,
                ease: "none",
                onUpdate: render,
              });
            });
          }
        },
      });
    }, rootRef);

    // Exit: finish the stroke, hold a beat, fade it, wipe the overlay up
    const tryFinish = () => {
      if (cancelled || finished) return;
      if (!pageLoaded || !minTimePassed || !readyRef.current) return;
      finished = true;
      creep?.kill();

      ctx.add(() => {
        gsap
          .timeline({
            onComplete: () => {
              document.body.style.overflow = prevOverflow;
              setVisible(false);
              onCompleteRef.current?.();
            },
          })
          .to(progress, {
            value: 100,
            duration: 0.6,
            ease: "power2.out",
            onUpdate: render,
          })
          .to(
            svgRef.current,
            { opacity: 0, duration: 0.4, ease: "power2.out" },
            "+=0.35"
          )
          .to(
            rootRef.current,
            {
              clipPath: "inset(0 0 100% 0)",
              duration: 0.9,
              ease: "power4.inOut",
            },
            "-=0.1"
          );
      });
    };
    tryFinishRef.current = tryFinish;

    // Readiness: window load + web fonts
    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            window.addEventListener("load", () => resolve(), { once: true })
          );

    Promise.all([loaded, document.fonts?.ready]).then(() => {
      pageLoaded = true;
      tryFinish();
    });

    return () => {
      cancelled = true;
      tryFinishRef.current = null;
      ctx.revert();
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Loading"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        clipPath: "inset(0 0 0% 0)",
        userSelect: "none",
      }}
    >
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 845.115 442.115"
        aria-hidden="true"
        style={{
          width: "min(60vw, 520px)",
          height: "auto",
          overflow: "visible",
        }}
      >
        {/* Faint outline so the signature reads as filling in */}
        <path
          d={SIGNATURE_PATH}
          fill="none"
          stroke={STROKE}
          strokeWidth={7.41}
          strokeLinecap="butt"
          strokeLinejoin="miter"
          opacity={0.32}
        />
        {/* The drawing stroke. Starts hidden (huge dash offset) to avoid a flash before the effect runs. */}
        <path
          ref={pathRef}
          d={SIGNATURE_PATH}
          fill="none"
          stroke={STROKE}
          strokeWidth={7.41}
          strokeLinecap="butt"
          strokeLinejoin="miter"
          style={{ strokeDasharray: 5000, strokeDashoffset: 5000 }}
        />
      </svg>
    </div>
  );
}