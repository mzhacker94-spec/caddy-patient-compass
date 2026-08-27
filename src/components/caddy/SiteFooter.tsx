import { motion, useReducedMotion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Heart, Instagram, Linkedin, Stethoscope, Twitter } from "lucide-react";
import { CaddyMountains } from "@/components/caddy/CaddyMountains";

const COLUMNS: { title: string; links: { label: string; to?: string }[] }[] = [
  {
    title: "Patients",
    links: [
      { label: "Find doctors", to: "/" },
      { label: "Live queue", to: "/queue" },
      { label: "My profile", to: "/profile" },
      { label: "Health vault", to: "/dashboard" },
    ],
  },
  {
    title: "Clinics",
    links: [
      { label: "Doctor console", to: "/doctor" },
      { label: "Onboard a clinic", to: "/onboarding" },
      { label: "Create account", to: "/signup" },
      { label: "Sign in", to: "/login" },
    ],
  },
  {
    title: "Clinic hours",
    links: [
      { label: "Mon – Fri · 9:00 – 21:00" },
      { label: "Sat · 10:00 – 18:00" },
      { label: "Sun · emergency queue only" },
      { label: "Clifton, Karachi" },
    ],
  },
];

const MARQUEE = [
  "no lobby waiting",
  "verified clinics",
  "live queue",
  "health vault",
  "care streaks",
  "one tap booking",
];

export function SiteFooter() {
  const calm = useReducedMotion();

  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* marquee ribbon */}
      <div
        className="relative overflow-hidden py-2.5"
        style={{ background: "var(--gradient-care)" }}
        aria-hidden
      >
        <motion.div
          className="flex w-max gap-6 whitespace-nowrap"
          animate={calm ? {} : { x: ["0%", "-50%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        >
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="font-display text-xs font-extrabold uppercase tracking-[0.22em] text-primary-foreground/90"
            >
              {word} <span className="opacity-60">✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      <div className="relative bg-secondary/60">
        <div aria-hidden className="clinic-grain pointer-events-none absolute inset-0 opacity-50" />

        <div className="relative mx-auto max-w-6xl px-5 pb-9 pt-12 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: "spring", stiffness: 150, damping: 18 }}
            >
              <div className="flex items-center gap-2">
                <motion.span
                  className="grid size-10 place-items-center rounded-2xl text-primary-foreground"
                  style={{ background: "var(--gradient-care)" }}
                  animate={calm ? {} : { rotate: [-5, 5, -5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Stethoscope aria-hidden className="size-4.5" />
                </motion.span>
                <span className="font-display text-xl font-extrabold leading-none">
                  Caddy<span className="foil-text foil-animate"> Care</span>
                </span>
              </div>
              <p className="mt-4 max-w-sm text-[0.8rem] leading-relaxed text-muted-foreground">
                The daily operating system for small clinics — bookings, live queue, patient records
                and follow-ups, wrapped in something patients actually enjoy using.
              </p>

              <div className="mt-5 flex gap-2">
                {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    aria-label="Caddy Care social"
                    whileHover={{ y: -4, rotate: -6 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 420, damping: 14 }}
                    className="glass-card grid size-9 place-items-center rounded-xl"
                  >
                    <Icon aria-hidden className="size-3.5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-8 sm:grid-cols-3">
              {COLUMNS.map((col, ci) => (
                <motion.div
                  key={col.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    type: "spring",
                    stiffness: 170,
                    damping: 18,
                    delay: 0.06 * ci,
                  }}
                >
                  <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-primary">
                    {col.title}
                  </p>
                  <ul className="mt-3.5 space-y-2 text-[0.8rem] font-semibold">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        {l.to ? (
                          <Link
                            to={l.to}
                            className="story-link inline-block text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {l.label}
                          </Link>
                        ) : (
                          <span className="inline-block text-muted-foreground">
                            {l.label}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* animated jelly mountain range */}
          <CaddyMountains />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5 text-[0.7rem] font-semibold text-muted-foreground">
            <p>© {new Date().getFullYear()} Caddy Care. Built for clinics that care.</p>
            <p className="inline-flex items-center gap-1.5">
              Made with
              <motion.span
                animate={calm ? {} : { scale: [1, 1.35, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="text-accent"
              >
                <Heart aria-hidden className="size-3" />
              </motion.span>
              for waiting rooms everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
