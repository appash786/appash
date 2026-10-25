import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <main
        className="nf-flicker relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0a0000] text-white select-none"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        {/* Pulse ring */}
        <div className="nf-pulse-ring" />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center gap-6 px-6 text-center nf-drift-up">
          {/* 404 glitch headline */}
          <div>
            <div
              data-text="404"
              style={{
                fontSize: "clamp(7rem, 22vw, 18rem)",
                fontWeight: 900,
                lineHeight: 1,
                color: "#fff",

                letterSpacing: "-0.04em",
              }}
            >
              404
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center  w-full max-w-xs">
              <span className="text-red-600 text-xs tracking-[0.3em] uppercase">
                Error
              </span>
            </div>
          </div>

          {/* Message */}
          <h1
            className="text-xl md:text-2xl font-semibold tracking-widest uppercase text-white"
            style={{ textShadow: "0 0 20px rgba(220,38,38,0.4)" }}
          >
            Page Not Found
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-sm leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track.
          </p>

          {/* CTA */}
          <Link
            href="/"
            className="group relative mt-4 inline-flex items-center gap-3 overflow-hidden rounded-full border border-red-700/60 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-red-300 transition-all duration-300 hover:border-red-500 hover:text-white"
            style={{
              backdropFilter: "blur(8px)",
              background: "rgba(127,29,29,0.15)",
            }}
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-red-800/60 to-red-600/60 transition-transform duration-500 group-hover:translate-x-0 rounded-full" />
            <span className="relative">← Back to Home</span>
          </Link>

          {/* Error code badge */}

        </div>
      </main>
    </>
  );
}
