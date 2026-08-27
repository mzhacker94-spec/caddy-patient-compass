import { motion, useReducedMotion } from "motion/react";
import { Crown, Droplet, MapPin, Sparkles } from "lucide-react";
import type { Patient } from "@/lib/profile-data";
import { ProfileCaddy } from "./ProfileCaddy";

export function ProfileHero({ patient }: { patient: Patient }) {
  const calm = useReducedMotion() ?? false;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      className="glass-pane relative mt-8 overflow-hidden rounded-4xl p-6 sm:p-9"
    >
      {/* slow animated gradient wash */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(115deg, color-mix(in oklab, var(--care) 30%, transparent), color-mix(in oklab, var(--gold) 26%, transparent) 45%, color-mix(in oklab, var(--ember) 28%, transparent) 75%, transparent)",
          backgroundSize: "260% 260%",
        }}
        animate={calm ? {} : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative grid gap-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <div className="relative mx-auto flex size-36 shrink-0 items-center justify-center sm:mx-0 sm:size-40">
          {/* pulse ring */}
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-primary/60"
            animate={calm ? {} : { scale: [1, 1.22, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            aria-hidden
            className="absolute inset-2 rounded-full blur-2xl"
            style={{ background: "color-mix(in oklab, var(--care) 55%, transparent)" }}
            animate={calm ? {} : { scale: [0.92, 1.1, 0.92], opacity: [0.45, 0.8, 0.45] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src={patient.avatar}
            alt={`${patient.name}, Caddy Care patient`}
            width={768}
            height={768}
            className="relative size-32 rounded-full object-cover sm:size-36"
            style={{ boxShadow: "var(--shadow-glow)" }}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.15 }}
          />
        </div>

        <div className="min-w-0 space-y-3 text-center sm:text-left">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.1 }}
            className="text-xs font-bold uppercase tracking-[0.18em] text-primary"
          >
            Patient profile
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 16, delay: 0.16 }}
            className="truncate font-display text-3xl font-extrabold sm:text-5xl"
          >
            {patient.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.24 }}
            className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-muted-foreground sm:justify-start"
          >
            <span className="inline-flex items-center gap-1.5">
              <Sparkles aria-hidden className="size-4" /> {patient.memberSince}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden className="size-4" /> {patient.city}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Droplet aria-hidden className="size-4" /> {patient.bloodGroup}
            </span>
          </motion.div>

          {/* tier badge with shine sweep */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.32 }}
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4 py-2 text-sm font-extrabold text-accent-foreground"
            style={{ background: "var(--gradient-foil)" }}
          >
            <Crown aria-hidden className="size-4" />
            {patient.tier}
            <motion.span
              aria-hidden
              className="absolute inset-y-0 w-1/3 skew-x-[-20deg]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, color-mix(in oklab, white 75%, transparent), transparent)",
              }}
              animate={calm ? { opacity: 0 } : { x: ["-140%", "320%"] }}
              transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>

      {/* 3D Caddy companion */}
      <ProfileCaddy className="pointer-events-none absolute -top-2 right-0 size-24 opacity-90 sm:-bottom-6 sm:top-auto sm:size-56 sm:opacity-100 lg:size-64" />
    </motion.section>
  );
}
