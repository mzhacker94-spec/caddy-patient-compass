import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SPECIALIZATIONS } from "@/lib/home-data";
import { Baby, Clock, Eye, Heart, MapPin, Smile, Sparkles, Stethoscope, Search } from "lucide-react";

const ICONS = {
  tooth: Smile,
  stethoscope: Stethoscope,
  sparkles: Sparkles,
  baby: Baby,
  heart: Heart,
  eye: Eye,
} as const;

const tintClass = {
  care: "bg-primary/15 text-primary",
  ember: "bg-accent/20 text-accent-foreground",
  gold: "bg-gold/25 text-foreground",
} as const;

const spring = { type: "spring" as const, stiffness: 300, damping: 22, mass: 0.7 };

const HEADLINE = "What do you need today?".split(" ");

export function SpecialtyFinder() {
  const calm = useReducedMotion();
  const [active, setActive] = useState<string>(SPECIALIZATIONS[0]!.id);
  const selected = SPECIALIZATIONS.find((s) => s.id === active)!;

  return (
    <section className="relative">
      {/* soft aurora behind the finder */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-4 -z-10 size-[26rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--gradient-care)", opacity: 0.16 }}
        animate={calm ? {} : { scale: [1, 1.12, 1], opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="text-center">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={spring}
          className="glass-card inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-primary"
        >
          <motion.span
            animate={calm ? {} : { rotate: [0, 14, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex"
          >
            <Search aria-hidden className="size-3" strokeWidth={3} />
          </motion.span>
          Find your care
        </motion.span>

        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          className="mx-auto mt-4 max-w-2xl font-display text-[2rem] font-extrabold leading-[1.05] tracking-tight sm:text-5xl"
        >
          {HEADLINE.map((word, i) => (
            <motion.span
              key={word + i}
              variants={{
                hidden: { opacity: 0, y: 26, rotateX: -60 },
                show: { opacity: 1, y: 0, rotateX: 0 },
              }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              className={`inline-block ${i === HEADLINE.length - 1 ? "foil-text foil-animate" : ""}`}
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ ...spring, delay: 0.15 }}
          className="mx-auto mt-3 max-w-md text-sm text-muted-foreground"
        >
          Pick a speciality and Caddy lines up the nearest verified slot for you.
        </motion.p>
      </div>

      {/* search + filter console */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        className="glass-pane mx-auto mt-8 max-w-4xl rounded-4xl p-3 sm:p-5"
      >
        {/* search bar */}
        <div className="flex flex-col gap-2 rounded-3xl bg-background/60 p-2 sm:flex-row sm:items-center">
          <label className="flex flex-1 items-center gap-2.5 rounded-2xl px-3 py-2.5">
            <Search aria-hidden className="size-4 shrink-0 text-primary" strokeWidth={3} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${selected.label.toLowerCase()} near you`}
              aria-label="Search doctors and clinics"
              className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
            />
          </label>
          <span className="hidden h-7 w-px bg-border sm:block" />
          <span className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-muted-foreground">
            <MapPin aria-hidden className="size-3.5" /> Karachi · Clifton
          </span>
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ y: 3, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 480, damping: 18 }}
            className="btn-3d rounded-2xl px-5 py-3 text-sm font-extrabold text-primary-foreground"
            style={{ background: "var(--gradient-care)" }}
          >
            Find slots
          </motion.button>
        </div>

        {/* specialty chips */}
        <motion.ul
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-2.5"
        >
          {SPECIALIZATIONS.map((s) => {
            const Icon = ICONS[s.icon];
            const isActive = s.id === active;
            return (
              <motion.li
                key={s.id}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.94 },
                  show: { opacity: 1, y: 0, scale: 1, transition: spring },
                }}
              >
                <motion.button
                  type="button"
                  onClick={() => setActive(s.id)}
                  aria-pressed={isActive}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 420, damping: 20 }}
                  className={`relative flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-extrabold transition-colors ${
                    isActive
                      ? "border-transparent text-primary-foreground"
                      : "border-border bg-background/50 text-foreground hover:border-primary/40"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="specialty-highlight"
                      aria-hidden
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "var(--gradient-care)",
                        boxShadow: "var(--shadow-glow)",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative grid size-7 place-items-center rounded-full ${
                      isActive ? "bg-primary-foreground/20 text-primary-foreground" : tintClass[s.tint]
                    }`}
                  >
                    <Icon aria-hidden className="size-3.5" strokeWidth={2.4} />
                  </span>
                  <span className="relative">{s.label}</span>
                </motion.button>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* live readout */}
        <div className="mt-4 grid gap-2 border-t border-border/60 pt-4 sm:grid-cols-3">
          {[
            { icon: Stethoscope, label: `${selected.label} clinics`, value: "24 verified" },
            { icon: Clock, label: "Next free slot", value: "in 18 min" },
            { icon: Sparkles, label: "Avg. wait today", value: "9 minutes" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: 0.05 * i }}
              className="flex items-center gap-2.5 rounded-2xl bg-secondary/60 px-3 py-2.5"
            >
              <span className="grid size-8 place-items-center rounded-xl bg-primary/15 text-primary">
                <item.icon aria-hidden className="size-4" strokeWidth={2.6} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  {item.label}
                </span>
                <span className="block truncate text-sm font-extrabold">{item.value}</span>
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
