import { motion, useReducedMotion } from "motion/react";
import { Flame, HeartHandshake } from "lucide-react";
import { STREAK_COPY, type StreakTile } from "@/lib/profile-data";

const LEVEL_MIX = [8, 32, 55, 78, 100];

export function StreakBoard({
  streak,
  currentStreak,
  bestStreak,
}: {
  streak: StreakTile[];
  currentStreak: number;
  bestStreak: number;
}) {
  const calm = useReducedMotion() ?? false;
  const empty = streak.length === 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 150, damping: 18 }}
      className="stack-card relative mt-8 overflow-hidden rounded-4xl p-6 sm:p-8"
    >
      <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
        {/* big glowing current streak */}
        <div className="mx-auto text-center lg:mx-0">
          <motion.div
            className="relative mx-auto grid size-32 place-items-center rounded-full"
            style={{ background: "var(--gradient-care)", boxShadow: "var(--shadow-glow)" }}
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
          >
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full border-2 border-primary/50"
              animate={calm ? {} : { scale: [1, 1.25, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <span className="font-hero text-5xl text-primary-foreground">{currentStreak}</span>
          </motion.div>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            day streak · best {bestStreak}
          </p>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <motion.span
              className="grid size-9 place-items-center rounded-2xl text-primary-foreground"
              style={{ background: "var(--gradient-foil)" }}
              animate={calm ? {} : { scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Flame aria-hidden className="size-4" />
            </motion.span>
            <h2 className="text-xl font-extrabold">Engagement streak</h2>
          </div>

          {empty ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              className="glass-pane mt-4 rounded-3xl p-5"
            >
              <div className="flex items-start gap-3">
                <motion.span
                  className="grid size-10 shrink-0 place-items-center rounded-2xl text-primary-foreground"
                  style={{ background: "var(--gradient-care)" }}
                  animate={calm ? {} : { y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <HeartHandshake aria-hidden className="size-5" />
                </motion.span>
                <div>
                  <p className="font-extrabold">Caddy is holding your first tile</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Log one check-in — meds taken, a symptom note, anything — and your streak board
                    lights up from tomorrow. No blank grids, no guilt.
                  </p>
                  <motion.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="btn-3d mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground"
                  >
                    Start my streak
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted-foreground">{STREAK_COPY(currentStreak)}</p>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }}
                className="mt-5 grid grid-cols-7 gap-2 sm:grid-cols-14"
              >
                {streak.map((tile) => (
                  <motion.div
                    key={tile.label}
                    title={`${tile.label} · ${tile.level > 0 ? `${tile.level} logs` : "missed"}`}
                    variants={{
                      hidden: { opacity: 0, scale: 0.4, y: 10 },
                      show: { opacity: 1, scale: 1, y: 0 },
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 15 }}
                    whileHover={{ scale: 1.18, rotate: 6 }}
                    className="aspect-square rounded-xl"
                    style={{
                      background: `color-mix(in oklab, var(--care) ${LEVEL_MIX[tile.level] ?? 8}%, color-mix(in oklab, var(--charcoal) 6%, transparent))`,
                      boxShadow:
                        tile.level >= 3
                          ? "0 0 18px -4px color-mix(in oklab, var(--care) 70%, transparent)"
                          : "none",
                    }}
                  />
                ))}
              </motion.div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Last 14 days of adherence
              </p>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
}
