import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Pill, ScrollText, X } from "lucide-react";
import type { Prescription } from "@/lib/profile-data";

export function PrescriptionRail({ prescriptions }: { prescriptions: Prescription[] }) {
  const calm = useReducedMotion() ?? false;
  const [open, setOpen] = useState<Prescription | null>(null);

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2">
        <motion.span
          className="grid size-9 place-items-center rounded-2xl text-primary-foreground"
          style={{ background: "var(--gradient-foil)" }}
          animate={calm ? {} : { y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <ScrollText aria-hidden className="size-4" />
        </motion.span>
        <h2 className="text-xl font-extrabold">Prescriptions</h2>
      </div>

      {prescriptions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 170, damping: 18 }}
          className="glass-card mt-5 rounded-4xl p-8 text-center"
        >
          <motion.span
            className="mx-auto grid size-14 place-items-center rounded-3xl text-primary-foreground"
            style={{ background: "var(--gradient-care)" }}
            animate={calm ? {} : { rotate: [-8, 8, -8] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Pill aria-hidden className="size-6" />
          </motion.span>
          <h3 className="mt-4 text-lg font-extrabold">No prescriptions on file</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            When a doctor prescribes something, Caddy stores the dosage, duration and instructions
            here — and nudges you when it&apos;s time for a refill.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="-mx-1 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4"
        >
          {prescriptions.map((rx) => (
            <motion.button
              key={rx.id}
              type="button"
              onClick={() => setOpen(rx)}
              variants={{
                hidden: { opacity: 0, y: 26, scale: 0.94 },
                show: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="stack-card w-[17rem] shrink-0 snap-start rounded-3xl p-5 text-left sm:w-[19rem]"
            >
              <div className="flex items-center gap-3">
                <img
                  src={rx.photo}
                  alt={rx.doctor}
                  loading="lazy"
                  width={120}
                  height={120}
                  className="size-12 rounded-2xl object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate font-extrabold">{rx.doctor}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {rx.date}
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-1.5">
                {rx.medicines.map((m) => (
                  <li key={m.name} className="flex items-center gap-2 text-sm font-semibold">
                    <Pill aria-hidden className="size-3.5 shrink-0 text-primary" />
                    <span className="truncate">{m.name}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 inline-flex rounded-full bg-secondary px-3 py-1.5 text-xs font-extrabold text-muted-foreground">
                {rx.refillsLeft > 0 ? `${rx.refillsLeft} refills left` : "No refills left"}
              </p>
            </motion.button>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              aria-hidden
              className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
              onClick={() => setOpen(null)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Prescription from ${open.doctor}`}
              initial={{ opacity: 0, scale: 0.9, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              className="glass-pane relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-4xl p-6"
            >
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close prescription"
                className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-secondary text-foreground"
              >
                <X className="size-4" />
              </button>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Prescription
              </p>
              <h3 className="mt-1 text-2xl font-extrabold">{open.doctor}</h3>
              <p className="text-sm font-semibold text-muted-foreground">{open.date}</p>

              <ul className="mt-5 space-y-3">
                {open.medicines.map((m) => (
                  <li key={m.name} className="glass-card rounded-3xl p-4">
                    <p className="font-extrabold">{m.name}</p>
                    <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Dosage
                        </dt>
                        <dd className="font-semibold">{m.dosage}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Duration
                        </dt>
                        <dd className="font-semibold">{m.duration}</dd>
                      </div>
                    </dl>
                    <p className="mt-2 text-sm text-muted-foreground">{m.instructions}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
