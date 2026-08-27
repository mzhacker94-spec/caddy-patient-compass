import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SPECIALIZATIONS } from "@/lib/home-data";
import { Baby, Eye, Heart, Smile, Sparkles, Stethoscope, Search } from "lucide-react";

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

      {/* filter rail */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        className="glass-pane mx-auto mt-8 max-w-4xl rounded-4xl p-3 sm:p-4"
      >
        <motion.ul
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-2.5"
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
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold transition-colors ${
                    isActive ? "text-primary-foreground" : "text-foreground"
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
                    className={`relative grid size-8 place-items-center rounded-full ${
                      isActive ? "bg-primary-foreground/20 text-primary-foreground" : tintClass[s.tint]
                    }`}
                  >
                    <Icon aria-hidden className="size-4" strokeWidth={2.4} />
                  </span>
                  <span className="relative">{s.label}</span>
                </motion.button>
              </motion.li>
            );
          })}
        </motion.ul>

        <div className="mt-3 flex items-center justify-center gap-2 border-t border-border/60 pt-3">
          <motion.p
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="text-xs font-semibold text-muted-foreground"
          >
            <span className="font-extrabold text-foreground">{selected.label}</span> — 24 verified
            clinics nearby · next slot in
            <span className="text-primary"> 18 min</span>
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
