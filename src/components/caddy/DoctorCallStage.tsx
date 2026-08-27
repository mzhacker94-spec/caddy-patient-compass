import { motion, useReducedMotion } from "motion/react";
import { HeartPulse, Mic, PhoneCall, ShieldCheck, Stethoscope, Video } from "lucide-react";
import doc2 from "@/assets/doc-2.jpg";

/**
 * Auth-screen hero visual: a glass "video consultation" card with a doctor on
 * the line — idle float, expanding call rings, live waveform and vitals chips.
 * Pure presentation; honours reduced-motion.
 */
export function DoctorCallStage({ className = "" }: { className?: string }) {
  const calm = useReducedMotion();

  return (
    <div
      role="img"
      aria-label="Animated illustration of a live video consultation with a doctor"
      className={`relative grid aspect-square w-full max-w-[420px] place-items-center ${className}`}
    >
      {/* glow bloom */}
      <motion.div
        aria-hidden
        className="absolute size-3/5 rounded-full blur-3xl"
        style={{ background: "color-mix(in oklab, var(--care) 55%, transparent)" }}
        animate={calm ? {} : { opacity: [0.35, 0.75, 0.35], scale: [0.94, 1.1, 0.94] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* expanding call rings */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute rounded-full border border-primary/30"
          style={{ width: "46%", height: "46%" }}
          animate={calm ? {} : { scale: [1, 2], opacity: [0.5, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeOut", delay: i * 1.1 }}
        />
      ))}

      {/* orbiting care chips */}
      <motion.div
        aria-hidden
        className="absolute inset-[6%]"
        animate={calm ? {} : { rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[
          { Icon: Stethoscope, pos: "left-1/2 top-0 -translate-x-1/2" },
          { Icon: HeartPulse, pos: "right-0 top-1/2 translate-x-1/3 -translate-y-1/2" },
          { Icon: ShieldCheck, pos: "left-0 top-1/2 -translate-x-1/3 -translate-y-1/2" },
        ].map(({ Icon, pos }, i) => (
          <motion.span
            key={i}
            className={`glass-card absolute ${pos} grid size-10 place-items-center rounded-2xl text-primary`}
            animate={calm ? {} : { rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <Icon aria-hidden className="size-4.5" />
          </motion.span>
        ))}
      </motion.div>

      {/* phone / consultation card */}
      <motion.div
        initial={{ opacity: 0, y: 34, rotate: -3, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 16 }}
        style={{ transformPerspective: 1200 }}
        className="relative w-[62%] max-w-[240px]"
      >
        <motion.div
          className="glass-pane relative overflow-hidden rounded-4xl p-3"
          animate={calm ? {} : { y: [0, -12, 0], rotateZ: [-1.2, 1.2, -1.2] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* doctor "video" tile */}
          <div className="relative overflow-hidden rounded-3xl">
            <img
              src={doc2}
              alt="Doctor on a video consultation"
              width={640}
              height={640}
              className="aspect-[4/5] w-full object-cover"
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 45%, color-mix(in oklab, var(--care) 55%, transparent) 100%)",
              }}
              animate={calm ? {} : { opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-background/70 px-2.5 py-1 text-[10px] font-extrabold backdrop-blur">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              Live · 02:14
            </span>
          </div>

          {/* waveform */}
          <div className="mt-3 flex h-8 items-end justify-center gap-1">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                className="w-1 rounded-full bg-primary/70"
                animate={calm ? { height: 10 } : { height: [6, 22, 10, 28, 8] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.08,
                }}
              />
            ))}
          </div>

          {/* call controls */}
          <div className="mt-3 flex items-center justify-center gap-2.5">
            {[Mic, Video].map((Icon, i) => (
              <span
                key={i}
                className="grid size-9 place-items-center rounded-full bg-secondary text-muted-foreground"
              >
                <Icon aria-hidden className="size-4" />
              </span>
            ))}
            <motion.span
              className="grid size-11 place-items-center rounded-full text-primary-foreground"
              style={{ background: "var(--gradient-care)" }}
              animate={calm ? {} : { scale: [1, 1.08, 1], rotate: [-6, 6, -6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <PhoneCall aria-hidden className="size-5" />
            </motion.span>
          </div>
        </motion.div>
      </motion.div>

      {/* floating vitals chip */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.35 }}
        className="glass-card absolute bottom-[14%] left-0 rounded-2xl px-3 py-2"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Heart rate
        </p>
        <p className="flex items-center gap-1.5 text-sm font-extrabold text-primary">
          <motion.span
            animate={calm ? {} : { scale: [1, 1.25, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          >
            <HeartPulse aria-hidden className="size-4" />
          </motion.span>
          72 bpm
        </p>
      </motion.div>

      {/* doctor answering chip */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.5 }}
        className="glass-card absolute right-0 top-[16%] rounded-2xl px-3 py-2 text-right"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          On the line
        </p>
        <p className="text-sm font-extrabold">Dr. Omar Shafiq</p>
      </motion.div>
    </div>
  );
}
