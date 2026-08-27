import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Quote, Star } from "lucide-react";
import patientAvatar from "@/assets/patient-avatar.jpg";

type Review = {
  id: string;
  name: string;
  meta: string;
  rating: number;
  quote: string;
  tint: "care" | "ember" | "gold";
};

const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Sana Malik",
    meta: "Dentist visit · Caddy Smile Studio",
    rating: 5,
    quote:
      "Caddy pinged me when I was three patients away. I walked in, sat down, and was called in ninety seconds. No lobby, no guessing.",
    tint: "care",
  },
  {
    id: "r2",
    name: "Daniyal Or",
    meta: "General physician · Northside Care",
    rating: 5,
    quote:
      "Booked at 9pm for a fever, saw a doctor by 10:30 the next morning. The live queue is genuinely the best part of the whole thing.",
    tint: "ember",
  },
  {
    id: "r3",
    name: "Rabia Noor",
    meta: "Pediatrics · Little Hearts Clinic",
    rating: 5,
    quote:
      "With a toddler, waiting rooms are a nightmare. Caddy held our slot and told us exactly when to leave the house. Magic.",
    tint: "gold",
  },
  {
    id: "r4",
    name: "Hamza Iqbal",
    meta: "Skin specialist · Glow Skin Lab",
    rating: 4,
    quote:
      "All my reports sit in one vault, so the doctor already had context. Follow-up took four minutes instead of forty.",
    tint: "care",
  },
];

const TINT_BG = {
  care: "var(--gradient-care)",
  ember: "linear-gradient(135deg, var(--ember), var(--gold))",
  gold: "linear-gradient(135deg, var(--gold), var(--care))",
} as const;

const spring = { type: "spring" as const, stiffness: 200, damping: 22 };

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ ...spring, delay: 0.05 * i }}
          className={i < rating ? "text-accent" : "text-muted-foreground/40"}
        >
          <Star aria-hidden className="size-3.5 fill-current" />
        </motion.span>
      ))}
    </div>
  );
}

export function PatientReviews() {
  const calm = useReducedMotion();
  const [index, setIndex] = useState(0);
  const active = REVIEWS[index]!;

  useEffect(() => {
    if (calm) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % REVIEWS.length), 6000);
    return () => clearInterval(t);
  }, [calm]);

  return (
    <section className="relative mt-20">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-10 left-1/2 -z-10 h-72 w-[36rem] max-w-full -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--gradient-foil)", opacity: 0.14 }}
        animate={calm ? {} : { scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="text-center">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={spring}
          className="glass-card inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-primary"
        >
          Loved by patients
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
          className="mx-auto mt-4 max-w-2xl font-display text-[2rem] font-extrabold leading-[1.05] tracking-tight sm:text-5xl"
        >
          Real visits, <span className="foil-text foil-animate">real relief</span>
        </motion.h2>
      </div>

      <div className="mt-9 grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        {/* spotlight review */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 150, damping: 18 }}
          className="glass-pane relative overflow-hidden rounded-4xl p-7 sm:p-9"
        >
          <motion.span
            aria-hidden
            className="absolute -right-6 -top-8 text-primary/15"
            animate={calm ? {} : { y: [0, 8, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <Quote className="size-40" />
          </motion.span>

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active.id}
              initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className="relative"
            >
              <Stars rating={active.rating} />
              <p className="mt-4 font-display text-xl font-bold leading-snug sm:text-2xl">
                “{active.quote}”
              </p>
              <footer className="mt-6 flex items-center gap-3">
                <motion.span
                  className="grid size-11 place-items-center overflow-hidden rounded-2xl"
                  style={{ background: TINT_BG[active.tint] }}
                  animate={calm ? {} : { rotate: [-4, 4, -4] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src={patientAvatar}
                    alt={`${active.name}, Caddy Care patient`}
                    className="size-full object-cover mix-blend-luminosity"
                    loading="lazy"
                  />
                </motion.span>
                <div>
                  <p className="text-sm font-extrabold">{active.name}</p>
                  <p className="text-xs text-muted-foreground">{active.meta}</p>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="relative mt-7 flex items-center gap-2">
            {REVIEWS.map((r, i) => (
              <button
                key={r.id}
                type="button"
                aria-label={`Show review from ${r.name}`}
                onClick={() => setIndex(i)}
                className="group py-2"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ${
                    i === index ? "w-9 bg-primary" : "w-3 bg-border group-hover:bg-primary/50"
                  }`}
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* jelly review stack */}
        <div className="grid gap-4">
          {REVIEWS.slice(0, 3).map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, x: 34, rotate: 2 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: "spring", stiffness: 210, damping: 20, delay: i * 0.09 }}
              whileHover={{ y: -5, rotate: i % 2 ? 1 : -1 }}
              onHoverStart={() => setIndex(i)}
              className="glass-card cursor-pointer rounded-3xl p-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid size-9 place-items-center rounded-xl text-xs font-extrabold text-primary-foreground"
                  style={{ background: TINT_BG[r.tint] }}
                >
                  {r.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold">{r.name}</p>
                  <p className="truncate text-[0.7rem] text-muted-foreground">{r.meta}</p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1 text-xs font-extrabold text-accent">
                  <Star aria-hidden className="size-3 fill-current" />
                  {r.rating}.0
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-[0.8rem] leading-relaxed text-muted-foreground">
                {r.quote}
              </p>
            </motion.article>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ ...spring, delay: 0.25 }}
            className="flex items-center justify-between rounded-3xl px-5 py-4 text-primary-foreground"
            style={{ background: "var(--gradient-care)" }}
          >
            <div>
              <p className="font-display text-2xl font-extrabold leading-none">4.9/5</p>
              <p className="text-[0.7rem] font-semibold opacity-85">from 12,400 visits</p>
            </div>
            <Stars rating={5} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
