import { motion, useReducedMotion } from "motion/react";

/**
 * Layered "jelly mountain" range for the footer — soft parallax ridges that
 * breathe, with a wobbling jelly gradient blob behind them. Purely decorative.
 */
export function CaddyMountains() {
  const calm = useReducedMotion();

  const layers = [
    { d: "M0,150 L120,86 L210,132 L330,54 L470,124 L600,70 L720,140 L840,96 L960,150 Z", o: 0.18, dur: 13, x: 10 },
    { d: "M0,150 L90,110 L200,60 L300,120 L420,72 L540,128 L660,88 L780,138 L900,104 L960,150 Z", o: 0.3, dur: 17, x: -14 },
    { d: "M0,150 L130,118 L250,96 L360,134 L500,102 L640,136 L760,112 L880,142 L960,150 Z", o: 0.55, dur: 21, x: 8 },
  ];

  return (
    <div aria-hidden className="pointer-events-none relative mt-10 h-44 w-full overflow-hidden sm:h-56">
      {/* jelly blob */}
      <motion.div
        className="absolute bottom-6 left-1/2 h-40 w-[30rem] max-w-[85%] -translate-x-1/2 blur-2xl"
        style={{ background: "var(--gradient-foil)", opacity: 0.35, borderRadius: "48% 52% 60% 40% / 55% 45% 55% 45%" }}
        animate={
          calm
            ? {}
            : {
                borderRadius: [
                  "48% 52% 60% 40% / 55% 45% 55% 45%",
                  "60% 40% 44% 56% / 42% 58% 42% 58%",
                  "48% 52% 60% 40% / 55% 45% 55% 45%",
                ],
                scale: [1, 1.06, 1],
              }
        }
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        viewBox="0 0 960 150"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-full w-full"
      >
        <defs>
          <linearGradient id="caddy-ridge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--care)" />
            <stop offset="55%" stopColor="var(--ember)" />
            <stop offset="100%" stopColor="var(--gold)" />
          </linearGradient>
        </defs>

        {layers.map((l, i) => (
          <motion.path
            key={i}
            d={l.d}
            fill="url(#caddy-ridge)"
            opacity={l.o}
            animate={calm ? {} : { x: [0, l.x, 0], y: [0, i % 2 ? 4 : -4, 0] }}
            transition={{ duration: l.dur, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* jelly wave crest that ripples across the ridges */}
        <motion.path
          d="M0,146 C120,126 240,160 360,140 C480,120 600,158 720,138 C840,118 900,150 960,136 L960,150 L0,150 Z"
          fill="var(--care)"
          opacity={0.5}
          animate={calm ? {} : { x: [0, -60, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* drifting care sparks */}
      {!calm &&
        [12, 34, 58, 76, 90].map((left, i) => (
          <motion.span
            key={left}
            className="absolute size-1.5 rounded-full bg-primary/60"
            style={{ left: `${left}%`, bottom: "38%" }}
            animate={{ y: [0, -26, 0], opacity: [0, 0.9, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
          />
        ))}
    </div>
  );
}
