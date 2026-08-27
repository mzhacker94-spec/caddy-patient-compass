import { motion, useReducedMotion } from "motion/react";
import { OrbStage } from "@/components/caddy/OrbStage";

/**
 * The 3D Caddy companion for the profile hero: idle float plus a one-shot
 * greeting "wave" (tilt + hop) on page load. Reduced motion stays perfectly still.
 */
export function ProfileCaddy({ className = "" }: { className?: string }) {
  const calm = useReducedMotion() ?? false;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={
        calm
          ? { opacity: 1, scale: 1, y: 0, rotate: 0 }
          : {
              opacity: 1,
              scale: 1,
              y: [20, -14, 0, -6, 0],
              rotate: [0, -12, 10, -6, 0],
            }
      }
      transition={
        calm
          ? { duration: 0 }
          : { duration: 1.9, ease: "easeInOut", times: [0, 0.28, 0.55, 0.78, 1] }
      }
    >
      <motion.div
        className="size-full"
        animate={calm ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <OrbStage className="size-full" />
      </motion.div>
    </motion.div>
  );
}
