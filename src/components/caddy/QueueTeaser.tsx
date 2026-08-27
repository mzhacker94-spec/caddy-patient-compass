import { motion, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { DOCTORS } from "@/lib/home-data";

export function QueueTeaser() {
  const [position, setPosition] = useState(5);
  const spring = useSpring(5, { stiffness: 90, damping: 14, mass: 0.9 });
  const rounded = useTransform(spring, (v) => Math.max(1, Math.round(v)));

  useEffect(() => {
    spring.set(position);
  }, [position, spring]);

  useEffect(() => {
    const id = setInterval(() => setPosition((p) => (p <= 1 ? 5 : p - 1)), 4200);
    return () => clearInterval(id);
  }, []);

  const doctor = DOCTORS[0]!;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      className="glass-card relative overflow-hidden rounded-4xl p-6"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full blur-3xl"
        style={{ background: "color-mix(in oklab, var(--care) 45%, transparent)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <motion.span
              className="size-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            Live queue
          </div>
          <h2 className="mt-2 text-2xl font-extrabold">You&apos;re almost in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {doctor.name} · {doctor.clinic} · {doctor.next}
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-center">
            <motion.div
              className="relative grid size-24 place-items-center rounded-full"
              style={{ background: "var(--gradient-care)", boxShadow: "var(--shadow-glow)" }}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span className="font-hero text-4xl text-primary-foreground">
                {rounded}
              </motion.span>
            </motion.div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              in queue
            </p>
          </div>
          <div className="space-y-1 text-sm">
            <p className="font-bold">~12 min wait</p>
            <p className="text-muted-foreground">Room 3 · Token A-24</p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="mt-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              Track visit
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
