import { motion, useReducedMotion } from "motion/react";

/**
 * "Jelly spread" footer background — soft blobs of theme color that morph,
 * breathe and drift into each other (no hard ridge blocks). Purely decorative.
 */
export function CaddyMountains() {
  const calm = useReducedMotion();

  const jellies = [
    {
      bg: "var(--gradient-care)",
      className: "bottom-0 left-[4%] h-40 w-[34rem]",
      br: "62% 38% 55% 45% / 48% 62% 38% 52%",
      br2: "40% 60% 45% 55% / 60% 40% 60% 40%",
      opacity: 0.5,
      dur: 12,
      drift: 40,
    },
    {
      bg: "var(--gradient-foil)",
      className: "bottom-2 left-1/2 h-36 w-[30rem] -translate-x-1/2",
      br: "48% 52% 60% 40% / 55% 45% 55% 45%",
      br2: "60% 40% 44% 56% / 42% 58% 42% 58%",
      opacity: 0.4,
      dur: 11,
      drift: -30,
    },
    {
      bg: "var(--gradient-care)",
      className: "bottom-0 right-[6%] h-44 w-[36rem]",
      br: "55% 45% 40% 60% / 50% 55% 45% 50%",
      br2: "42% 58% 60% 40% / 58% 42% 58% 42%",
      opacity: 0.45,
      dur: 14,
      drift: -44,
    },
  ];

  return (
    <div aria-hidden className="pointer-events-none relative mt-10 h-44 w-full overflow-hidden sm:h-56">
      {/* spreading jelly color pools */}
      {jellies.map((j, i) => (
        <motion.div
          key={i}
          className={`absolute max-w-[85%] blur-3xl ${j.className}`}
          style={{ background: j.bg, opacity: j.opacity, borderRadius: j.br }}
          animate={
            calm
              ? {}
              : {
                  borderRadius: [j.br, j.br2, j.br],
                  scale: [1, 1.12, 1],
                  x: [0, j.drift, 0],
                  y: [0, i % 2 ? -10 : 8, 0],
                }
          }
          transition={{ duration: j.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.9 }}
        />
      ))}

      {/* soft wave crest rippling through the jelly */}
      <svg viewBox="0 0 960 150" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-full w-full">
        <motion.path
          d="M0,146 C120,126 240,160 360,140 C480,120 600,158 720,138 C840,118 900,150 960,136 L960,150 L0,150 Z"
          fill="var(--care)"
          opacity={0.35}
          animate={calm ? {} : { x: [0, -60, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,150 C140,132 300,162 460,144 C620,126 780,158 960,142 L960,150 L0,150 Z"
          fill="var(--gold)"
          opacity={0.25}
          animate={calm ? {} : { x: [0, 50, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
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
