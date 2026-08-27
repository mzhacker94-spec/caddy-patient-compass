import { motion, useReducedMotion } from "motion/react";
import { Activity, CalendarClock, FlaskConical, Pill } from "lucide-react";
import type { Stat } from "@/lib/profile-data";
import { AnimatedCounter } from "./AnimatedCounter";

const ICONS = {
  visits: Activity,
  calendar: CalendarClock,
  pill: Pill,
  flask: FlaskConical,
} as const;

const TINT: Record<Stat["tint"], string> = {
  care: "var(--care)",
  ember: "var(--ember)",
  gold: "var(--gold)",
};

export function StatChips({ stats, isNew }: { stats: Stat[]; isNew: boolean }) {
  const calm = useReducedMotion() ?? false;

  return (
    <section className="mt-8">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat, i) => {
          const Icon = ICONS[stat.icon];
          return (
            <motion.div
              key={stat.key}
              variants={{
                hidden: { opacity: 0, y: 28, scale: 0.94 },
                show: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              whileHover={{ y: -4 }}
              className="stack-card relative overflow-hidden rounded-3xl p-5"
            >
              <motion.span
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full blur-2xl"
                style={{ background: `color-mix(in oklab, ${TINT[stat.tint]} 40%, transparent)` }}
                animate={calm ? {} : { scale: [1, 1.18, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 5, repeat: Infinity, delay: i * 0.4 }}
              />

              <div className="relative flex items-start gap-3">
                <motion.span
                  className="grid size-11 shrink-0 place-items-center rounded-2xl text-primary-foreground"
                  style={{
                    background: `linear-gradient(140deg, ${TINT[stat.tint]}, color-mix(in oklab, ${TINT[stat.tint]} 55%, var(--charcoal)))`,
                    boxShadow: `0 10px 24px -10px color-mix(in oklab, ${TINT[stat.tint]} 80%, transparent), inset 0 2px 0 color-mix(in oklab, white 45%, transparent)`,
                  }}
                  animate={calm ? {} : { y: [0, -3, 0], rotate: [-3, 3, -3] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                >
                  <Icon aria-hidden className="size-5" />
                </motion.span>

                <div className="min-w-0">
                  <p className="font-hero text-4xl leading-none text-foreground">
                    <AnimatedCounter value={stat.value} delay={i * 0.08} />
                  </p>
                  <p className="mt-1.5 truncate text-sm font-extrabold">{stat.label}</p>
                  <p className="text-xs font-semibold text-muted-foreground">{stat.hint}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {isNew ? (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mt-4 text-center text-sm font-semibold text-muted-foreground sm:text-left"
        >
          Every number starts at zero — Caddy will fill these in as you book, visit and collect
          reports.
        </motion.p>
      ) : null}
    </section>
  );
}
