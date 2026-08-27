import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HeartPulse } from "lucide-react";

/** Full-screen branded boot animation shown once while the app warms up. */
export function BootLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-6 bg-background"
          exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.div
            aria-hidden
            className="absolute size-72 rounded-full bg-primary/25 blur-3xl"
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="relative flex size-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-xl"
            initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 12 }}
          >
            <motion.span
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            >
              <HeartPulse className="size-9" />
            </motion.span>
          </motion.div>

          <div className="relative flex gap-[0.06em] text-2xl font-black tracking-tight">
            {"Caddy Care".split("").map((c, i) => (
              <motion.span
                key={`${c}-${i}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 + i * 0.045 }}
              >
                {c === " " ? "\u00A0" : c}
              </motion.span>
            ))}
          </div>

          <div className="relative h-1 w-44 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
