import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import doctorArt from "@/assets/caddy-doctor.png";

/**
 * Hero visual: an anime-styled doctor illustration with idle float,
 * pointer parallax tilt, a breathing glow halo and floating trust chips.
 */
export function HeroCaddy() {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [10, -10]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [-8, 8]), {
    stiffness: 120,
    damping: 18,
  });

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[460px] [perspective:1000px]"
      initial={{ opacity: 0, scale: 0.9, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14, mass: 1 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <div className="relative aspect-square w-full">
        {/* breathing glow halo */}
        <motion.div
          aria-hidden
          className="absolute inset-6 rounded-full bg-primary/30 blur-3xl"
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute inset-10 rounded-full border border-primary/25"
          animate={{ rotate: 360 }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        />

        <motion.img
          src={doctorArt}
          alt="Caddy, the anime-styled clinic doctor mascot"
          width={1024}
          height={1024}
          className="relative z-10 size-full object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.28)]"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {[
        { label: "Verified clinics", pos: "left-0 top-10" },
        { label: "No lobby waiting", pos: "right-0 bottom-16" },
      ].map((chip, i) => (
        <motion.span
          key={chip.label}
          className={`glass-card absolute z-20 ${chip.pos} rounded-full px-3 py-1.5 text-xs font-bold`}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -4, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.5 + i * 0.15 }}
        >
          {chip.label}
        </motion.span>
      ))}
    </motion.div>
  );
}
