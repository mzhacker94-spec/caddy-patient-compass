import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Activity, ChevronRight, Stethoscope } from "lucide-react";
import { NotificationBell } from "@/components/caddy/NotificationCenter";
import { SiteFooter } from "@/components/caddy/SiteFooter";
import { DOCTOR_PATIENTS, type PatientHistory } from "@/lib/caddy-store";
import { useCaddy } from "@/lib/caddy-context";

export const Route = createFileRoute("/doctor")({
  head: () => ({
    meta: [
      { title: "Doctor console · Caddy Care" },
      {
        name: "description",
        content:
          "The Caddy Care doctor console — see today's queue, open any patient's full visit history and read the reports they shared with you.",
      },
      { property: "og:title", content: "Doctor console · Caddy Care" },
      {
        property: "og:description",
        content: "Every patient's history, shared reports and risk flags in one screen.",
      },
    ],
  }),
  component: DoctorConsole,
});

const spring = { type: "spring" as const, stiffness: 170, damping: 20 };

const RISK_MIX: Record<PatientHistory["risk"], string> = {
  low: "var(--care)",
  medium: "var(--gold)",
  high: "var(--ember)",
};

function DoctorConsole() {
  const [activeId, setActiveId] = useState(DOCTOR_PATIENTS[0]!.id);
  const active = DOCTOR_PATIENTS.find((p) => p.id === activeId)!;
  const { state } = useCaddy();

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div aria-hidden className="clinic-grain pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-6xl px-5 pt-6 sm:px-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="glass-card sticky top-4 z-40 flex items-center gap-3 rounded-full px-4 py-2.5"
        >
          <Link to="/" className="flex items-center gap-2">
            <span
              className="grid size-9 place-items-center rounded-2xl text-primary-foreground"
              style={{ background: "var(--gradient-care)" }}
            >
              <Stethoscope aria-hidden className="size-4" />
            </span>
            <span className="font-display text-lg font-extrabold">Doctor console</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/queue"
              className="hidden rounded-full px-4 py-2 text-sm font-extrabold text-muted-foreground hover:text-foreground sm:block"
            >
              Live queue
            </Link>
            <NotificationBell />
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="mt-10"
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
            Today · 14 booked · 3 waiting
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
            Patient <span className="foil-text foil-animate">history at a glance</span>
          </h1>
        </motion.div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,20rem)_1fr]">
          {/* patient list */}
          <ul className="space-y-3">
            {DOCTOR_PATIENTS.map((p, i) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, x: -26 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring, delay: i * 0.07 }}
              >
                <motion.button
                  type="button"
                  onClick={() => setActiveId(p.id)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex w-full items-center gap-3 rounded-3xl p-4 text-left ${
                    activeId === p.id ? "glass-pane" : "glass-card"
                  }`}
                >
                  <span
                    className="grid size-11 shrink-0 place-items-center rounded-2xl font-display text-lg font-extrabold text-primary-foreground"
                    style={{ background: "var(--gradient-care)" }}
                  >
                    {p.name[0]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-extrabold">{p.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {p.age} yrs · {p.condition}
                    </span>
                  </span>
                  <span
                    className="rounded-full px-2 py-1 text-[0.6rem] font-extrabold uppercase tracking-wider"
                    style={{
                      background: `color-mix(in oklab, ${RISK_MIX[p.risk]} 28%, transparent)`,
                    }}
                  >
                    {p.risk}
                  </span>
                  <ChevronRight aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                </motion.button>
              </motion.li>
            ))}
          </ul>

          {/* timeline */}
          <AnimatePresence mode="wait">
            <motion.section
              key={active.id}
              initial={{ opacity: 0, y: 28, rotateX: 6 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={spring}
              className="glass-pane rounded-4xl p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-extrabold">{active.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Last visit {active.lastVisit} · {active.condition}
                  </p>
                </div>
                <motion.span
                  className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-extrabold"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Activity aria-hidden className="size-3.5 text-primary" />
                  {state.reports.filter((r) => r.sharedWithDoctor).length} shared reports
                </motion.span>
              </div>

              <ol className="relative mt-7 space-y-6 border-l border-border pl-6">
                {active.visits.map((v, i) => (
                  <motion.li
                    key={v.date}
                    initial={{ opacity: 0, x: 22 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.1 + i * 0.09 }}
                    className="relative"
                  >
                    <motion.span
                      className="absolute -left-[1.9rem] top-1 size-3 rounded-full"
                      style={{ background: "var(--gradient-care)" }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.2 + i * 0.09 }}
                    />
                    <p className="text-xs font-extrabold uppercase tracking-wider text-primary">
                      {v.kind} · {v.date}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{v.note}</p>
                  </motion.li>
                ))}
              </ol>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {state.reports
                  .filter((r) => r.sharedWithDoctor)
                  .map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...spring, delay: 0.25 + i * 0.06 }}
                      whileHover={{ y: -4 }}
                      className="glass-card rounded-3xl p-4"
                    >
                      <p className="text-sm font-extrabold">{r.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{r.summary}</p>
                    </motion.div>
                  ))}
              </div>
            </motion.section>
          </AnimatePresence>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
