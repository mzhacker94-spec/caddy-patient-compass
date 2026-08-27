import { motion, useReducedMotion } from "motion/react";

/**
 * Cut-out portrait avatar: the photo is clipped with a curved scoop so it
 * appears to sit *inside* a soft tinted plate, with a name tag that springs
 * up on hover. Inspired by the reference design, re-skinned in Caddy tokens.
 */
export function AvatarPortrait({
  src,
  name,
  caption,
}: {
  src: string;
  name: string;
  caption?: string;
}) {
  const calm = useReducedMotion() ?? false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className="avatar-portrait group relative mx-auto size-44 shrink-0 sm:mx-0 sm:size-48"
    >
      {/* tinted plate behind the lower half of the portrait */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 top-1/2 rounded-[1.6rem] transition-[filter,transform] duration-500 group-hover:blur-[10px]"
        style={{ background: "var(--gradient-care)", boxShadow: "var(--shadow-glow)" }}
      />
      <motion.span
        aria-hidden
        className="absolute inset-x-3 bottom-2 top-[55%] rounded-[1.4rem] opacity-70 mix-blend-overlay"
        style={{ background: "var(--gradient-foil)" }}
        animate={calm ? {} : { opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* the scooped photo */}
      <div className="avatar-portrait-clip relative size-full">
        <img
          src={src}
          alt={`${name}, Caddy Care patient`}
          width={512}
          height={512}
          loading="eager"
          className="size-full origin-bottom scale-90 rounded-[1.5rem] object-cover transition-[scale,filter] duration-300 group-hover:scale-[1.08]"
          style={{ filter: "drop-shadow(6px 10px 8px color-mix(in oklab, var(--care-deep) 45%, transparent))" }}
        />
      </div>

      {/* name tag */}
      <p className="pointer-events-none absolute -bottom-2 right-1 translate-y-3 font-display text-sm font-extrabold text-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        {caption ?? name}
      </p>
    </motion.div>
  );
}
