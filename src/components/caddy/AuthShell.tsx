import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";
import type { ReactNode } from "react";
import { DoctorCallStage } from "./DoctorCallStage";

/**
 * Shared split layout for /login and /signup:
 * left = 3D Caddy orb on an aurora field, right = tilting glass form pane.
 */
export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  const calm = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [8, -8]), {
    stiffness: 140,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [-8, 8]), {
    stiffness: 140,
    damping: 18,
  });

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* aurora field */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-40 -top-40 size-[38rem] rounded-full blur-3xl"
          style={{ background: "color-mix(in oklab, var(--care) 40%, transparent)" }}
          animate={calm ? {} : { x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-52 -right-32 size-[34rem] rounded-full blur-3xl"
          style={{ background: "color-mix(in oklab, var(--ember) 35%, transparent)" }}
          animate={calm ? {} : { x: [0, -50, 0], y: [0, -30, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="clinic-grain absolute inset-0 opacity-60" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-2">
        {/* brand + doctor call visual */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <Link to="/" className="inline-flex items-center gap-2">
              <span
                className="grid size-10 place-items-center rounded-2xl text-primary-foreground"
                style={{ background: "var(--gradient-care)" }}
              >
                <Stethoscope aria-hidden className="size-5" />
              </span>
              <span className="font-display text-xl font-extrabold">
                Caddy<span className="foil-text foil-animate"> Care</span>
              </span>
            </Link>
          </motion.div>

          <DoctorCallStage className="mx-auto mt-4" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 18, delay: 0.25 }}
            className="glass-card mx-auto -mt-6 hidden max-w-sm rounded-3xl px-5 py-4 text-center lg:block"
          >
            <p className="text-sm font-bold">“Caddy watched the queue so I didn’t have to.”</p>
            <p className="mt-1 text-xs text-muted-foreground">
              4.9★ from 12,400 patients across 180 clinics
            </p>
          </motion.div>
        </div>

        {/* form pane */}
        <motion.div
          onPointerMove={(e) => {
            if (calm) return;
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onPointerLeave={() => {
            mx.set(0);
            my.set(0);
          }}
          style={{ perspective: 1200 }}
          className="w-full"
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, y: 48, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 130, damping: 15, mass: 0.9 }}
            className="glass-pane relative overflow-hidden rounded-4xl p-7 sm:p-9"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full blur-3xl"
              style={{ background: "color-mix(in oklab, var(--gold) 45%, transparent)" }}
              animate={calm ? {} : { scale: [1, 1.18, 1], opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            <div style={{ transform: "translateZ(40px)" }}>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.1 }}
                className="inline-flex rounded-full bg-accent/25 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-accent-foreground"
              >
                {eyebrow}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 16, delay: 0.15 }}
                className="mt-3 font-display text-3xl font-extrabold sm:text-4xl"
              >
                {title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.2 }}
                className="mt-2 text-sm text-muted-foreground"
              >
                {subtitle}
              </motion.p>

              <div className="mt-6">{children}</div>
              <div className="mt-6 text-center text-sm font-semibold text-muted-foreground">
                {footer}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}

export function GlassField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <input
        {...props}
        className="field-glass w-full rounded-2xl px-4 py-3 text-sm font-semibold placeholder:font-medium placeholder:text-muted-foreground"
      />
    </label>
  );
}
