import { motion, useReducedMotion } from "motion/react";
import { AudioLines, Check, Radio } from "lucide-react";
import howItWorks from "@/assets/how-caddy-works.jpg";

const STEPS = [
  {
    id: "talk",
    icon: AudioLines,
    title: "Talk to Caddy",
    copy: "Just describe how you feel — no forms, no jargon.",
  },
  {
    id: "book",
    icon: Check,
    title: "Book in seconds",
    copy: "Caddy locks the nearest verified slot for you instantly.",
  },
  {
    id: "track",
    icon: Radio,
    title: "Track your turn live",
    copy: "Watch the queue move — no more waiting blind in a lobby.",
  },
] as const;

const spring = { type: "spring" as const, stiffness: 220, damping: 20, mass: 0.8 };

export function HowCaddyWorks() {
  const calm = useReducedMotion() ?? false;

  return (
    <section className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
      {/* glass framed, floating illustration */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 8 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        className="relative"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] blur-3xl"
          style={{ background: "var(--gradient-care)", opacity: 0.18 }}
          animate={calm ? {} : { opacity: [0.12, 0.24, 0.12], scale: [1, 1.06, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          animate={calm ? {} : { y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="glass-pane overflow-hidden rounded-4xl p-2.5"
        >
          <img
            src={howItWorks}
            alt="A patient talking to the Caddy assistant on their phone while booking and tracking a live appointment"
            width={1280}
            height={1024}
            loading="lazy"
            className="w-full rounded-[1.6rem] object-cover"
          />
        </motion.div>
      </motion.div>

      {/* benefit lines */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        className="space-y-4"
      >
        <motion.h2
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
          transition={spring}
          className="font-display text-[2rem] font-extrabold leading-[1.05] tracking-tight sm:text-4xl"
        >
          How <span className="foil-text foil-animate">Caddy</span> works
        </motion.h2>

        {STEPS.map((step) => (
          <motion.div
            key={step.id}
            variants={{ hidden: { opacity: 0, y: 26, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1 } }}
            transition={spring}
            whileHover={{ x: 4 }}
            className="glass-card flex items-start gap-4 rounded-3xl p-4"
          >
            <span
              className="relative grid size-11 shrink-0 place-items-center rounded-2xl text-primary-foreground"
              style={{ background: "var(--gradient-care)", boxShadow: "var(--shadow-glow)" }}
            >
              {step.id === "talk" && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-2xl border border-primary/50"
                  animate={calm ? {} : { scale: [1, 1.35], opacity: [0.7, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <motion.span
                className="inline-flex"
                animate={
                  calm
                    ? {}
                    : step.id === "book"
                      ? { scale: [1, 1.25, 1] }
                      : step.id === "track"
                        ? { y: [0, -3, 0], opacity: [1, 0.55, 1] }
                        : { scaleY: [1, 1.25, 0.85, 1] }
                }
                transition={{
                  duration: step.id === "book" ? 2.2 : 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <step.icon aria-hidden className="size-5" strokeWidth={2.6} />
              </motion.span>
            </span>
            <span>
              <span className="block text-base font-extrabold">{step.title}</span>
              <span className="block text-sm text-muted-foreground">{step.copy}</span>
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
