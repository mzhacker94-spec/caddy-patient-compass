import { motion, useReducedMotion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export type QueueToastProps = {
  /** Live queue position — when omitted the toast renders the demo preview. */
  position?: number;
  doctorName?: string;
  nowServing?: number;
  /** Demo variant shows the "See how it works" link. */
  demo?: boolean;
  className?: string;
};

/**
 * Reusable live-queue toast. Used as a demo preview on the home screen and
 * as the real-time card on the live tracking screen (feed it `position`).
 */
export function QueueToast({
  position = 4,
  doctorName = "Dr. Ahmed",
  nowServing = 1,
  demo = false,
  className = "",
}: QueueToastProps) {
  const calm = useReducedMotion() ?? false;

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 70, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.9 }}
      className={`glass-pane relative mx-auto flex max-w-2xl items-center gap-4 overflow-hidden rounded-4xl px-5 py-4 ${className}`}
    >
      {/* glow pulse around the border */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-4xl"
        style={{ boxShadow: "var(--shadow-glow)" }}
        animate={calm ? {} : { opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* one-time shimmer sweep */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--gold) 45%, transparent), transparent)",
        }}
        initial={{ x: "-140%" }}
        whileInView={calm ? {} : { x: "420%" }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 0.35 }}
      />

      <motion.span
        aria-hidden
        className="relative size-3 shrink-0 rounded-full bg-primary"
        animate={calm ? {} : { scale: [1, 1.7, 1], opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />

      <div className="relative min-w-0 flex-1">
        <p className="text-sm font-extrabold sm:text-base">
          You&apos;re #{position} in line
          <span className="text-muted-foreground"> — {doctorName} is with Patient #{nowServing}</span>
        </p>
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {demo ? "Preview of live queue tracking" : "Live · updating in real time"}
        </p>
      </div>

      {demo && (
        <Link
          to="/queue"
          className="relative inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-extrabold text-primary-foreground"
        >
          See how it works
          <ArrowRight aria-hidden className="size-3.5" strokeWidth={3} />
        </Link>
      )}
    </motion.div>
  );
}
