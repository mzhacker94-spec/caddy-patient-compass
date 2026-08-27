import { motion, useReducedMotion } from "motion/react";
import { Flame } from "lucide-react";
import { currentStreak } from "@/lib/caddy-store";

const LEVEL_MIX = [10, 32, 55, 78, 100];

/**
 * 28-day care-streak heatmap + a spring-animated area line for follow-back rate.
 */
export function StreakGraph({ streak, onLog }: { streak: number[]; onLog: () => void }) {
  const calm = useReducedMotion();
  const days = currentStreak(streak);
  const best = Math.max(days, 21);
  const followBack = Math.round((streak.filter((v) => v > 0).length / streak.length) * 100);

  const points = streak
    .map((v, i) => `${(i / (streak.length - 1)) * 100},${34 - (v / 4) * 30}`)
    .join(" ");

  return (
    <motion.section
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 150, damping: 18 }}
      className="glass-card relative overflow-hidden rounded-4xl p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <motion.span
              className="grid size-9 place-items-center rounded-2xl text-primary-foreground"
              style={{ background: "var(--gradient-care)" }}
              animate={calm ? {} : { scale: [1, 1.09, 1], rotate: [-4, 4, -4] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Flame aria-hidden className="size-4" />
            </motion.span>
            <h2 className="text-xl font-extrabold">Care streak</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Meds, check-ins and follow-ups logged over the last 28 days.
          </p>
        </div>

        <div className="flex gap-6">
          {[
            [`${days}`, "day streak"],
            [`${best}`, "personal best"],
            [`${followBack}%`, "follow-back"],
          ].map(([big, small], i) => (
            <motion.div
              key={small}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="font-display text-2xl font-extrabold">{big}</p>
              <p className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground">
                {small}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* follow-back line */}
      <svg viewBox="0 0 100 38" preserveAspectRatio="none" className="mt-6 h-24 w-full">
        <defs>
          <linearGradient id="streakFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--care)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--care)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.polyline
          points={points}
          fill="none"
          stroke="var(--care)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: calm ? 0 : 1.6, ease: "easeOut" }}
        />
        <motion.polygon
          points={`0,38 ${points} 100,38`}
          fill="url(#streakFill)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
      </svg>

      {/* heatmap */}
      <div
        className="mt-4 grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}
      >
        {streak.map((v, i) => (
          <motion.div
            key={i}
            title={`Day ${i + 1} · ${v} logs`}
            className="aspect-square rounded-md"
            style={{
              background: `color-mix(in oklab, var(--care) ${LEVEL_MIX[v] ?? 10}%, color-mix(in oklab, var(--charcoal) 6%, transparent))`,
            }}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.25, rotate: 6 }}
            transition={{ type: "spring", stiffness: 320, damping: 18, delay: i * 0.015 }}
          />
        ))}
      </div>

      <motion.button
        type="button"
        onClick={onLog}
        whileHover={{ y: -2 }}
        whileTap={{ y: 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
        className="btn-3d mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground"
      >
        Log today&apos;s check-in
      </motion.button>
    </motion.section>
  );
}
