import { motion, useReducedMotion } from "motion/react";
import { PhoneCall, Stethoscope, HeartPulse, Waves } from "lucide-react";

/**
 * Glass "call a doctor" hero animation — replaces the old sign-in/sign-up pane.
 * Idle-floating phone handset, expanding ring waves, orbiting care icons.
 */
export function CallDoctorAnimation({ className = "" }: { className?: string }) {
  const calm = useReducedMotion();

  return (
    <div
      className={`relative grid aspect-square w-full max-w-[420px] place-items-center ${className}`}
      aria-label="Animated illustration of calling a doctor"
      role="img"
    >
      {/* expanding call waves */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute rounded-full border border-primary/30"
          style={{ width: "40%", height: "40%" }}
          animate={calm ? {} : { scale: [1, 2.2], opacity: [0.55, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut", delay: i * 1.05 }}
        />
      ))}

      {/* glow bloom */}
      <motion.div
        aria-hidden
        className="absolute size-1/2 rounded-full blur-3xl"
        style={{ background: "color-mix(in oklab, var(--care) 50%, transparent)" }}
        animate={calm ? {} : { opacity: [0.4, 0.8, 0.4], scale: [0.94, 1.08, 0.94] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* orbiting care icons */}
      <motion.div
        aria-hidden
        className="absolute inset-[12%]"
        animate={calm ? {} : { rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        {[
          { Icon: Stethoscope, pos: "left-1/2 top-0 -translate-x-1/2" },
          { Icon: HeartPulse, pos: "right-0 bottom-1/4 translate-x-1/3" },
          { Icon: Waves, pos: "left-0 bottom-1/4 -translate-x-1/3" },
        ].map(({ Icon, pos }, i) => (
          <motion.span
            key={i}
            className={`glass-card absolute ${pos} grid size-11 place-items-center rounded-2xl text-primary`}
            animate={calm ? {} : { rotate: -360 }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          >
            <Icon aria-hidden className="size-5" />
          </motion.span>
        ))}
      </motion.div>

      {/* handset */}
      <motion.div
        className="glass-card relative grid size-28 place-items-center rounded-4xl"
        animate={calm ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.span
          className="grid size-16 place-items-center rounded-3xl text-primary-foreground"
          style={{ background: "var(--gradient-care)" }}
          animate={calm ? {} : { rotate: [-8, 8, -8], scale: [1, 1.06, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <PhoneCall aria-hidden className="size-7" />
        </motion.span>
      </motion.div>

      {/* status pill */}
      <motion.p
        className="glass-card absolute bottom-2 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      >
        <span className="size-2 animate-pulse rounded-full bg-primary" />
        Connecting you to a doctor…
      </motion.p>
    </div>
  );
}
