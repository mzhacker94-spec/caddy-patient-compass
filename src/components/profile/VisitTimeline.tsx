import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FileText, History, ImageIcon, Paperclip, Pill, ScrollText } from "lucide-react";
import type { Visit } from "@/lib/profile-data";

const STATUS_GLOW: Record<Visit["status"], string> = {
  Completed: "var(--care)",
  "Follow-up due": "var(--ember)",
  Cancelled: "var(--destructive)",
};

const ATTACH_ICON = {
  lab: FileText,
  image: ImageIcon,
  prescription: ScrollText,
} as const;

export function VisitTimeline({ visits }: { visits: Visit[] }) {
  const calm = useReducedMotion() ?? false;
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2">
        <motion.span
          className="grid size-9 place-items-center rounded-2xl text-primary-foreground"
          style={{ background: "var(--gradient-care)" }}
          animate={calm ? {} : { rotate: [-6, 6, -6] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <History aria-hidden className="size-4" />
        </motion.span>
        <h2 className="text-xl font-extrabold">Visit history</h2>
      </div>

      {visits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 170, damping: 18 }}
          className="glass-card mt-5 rounded-4xl p-8 text-center"
        >
          <motion.span
            className="mx-auto grid size-14 place-items-center rounded-3xl text-primary-foreground"
            style={{ background: "var(--gradient-foil)" }}
            animate={calm ? {} : { y: [0, -6, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <History aria-hidden className="size-6" />
          </motion.span>
          <h3 className="mt-4 text-lg font-extrabold">Your timeline starts with visit one</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            After each consult Caddy files the complaint, the doctor&apos;s notes and every
            attachment here — so you never retell your history from memory again.
          </p>
        </motion.div>
      ) : (
        <div className="relative mt-6 pl-6 sm:pl-8">
          <motion.span
            aria-hidden
            className="absolute left-1.5 top-2 w-0.5 origin-top rounded-full sm:left-2.5"
            style={{
              bottom: "0.5rem",
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--care) 80%, transparent), color-mix(in oklab, var(--ember) 50%, transparent))",
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: calm ? 0 : 1.1, ease: "easeOut" }}
          />

          <div className="space-y-5">
            {visits.map((visit, i) => {
              const open = openId === visit.id;
              return (
                <motion.div
                  key={visit.id}
                  layout
                  initial={{ opacity: 0, x: -28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ type: "spring", stiffness: 180, damping: 20, delay: i * 0.07 }}
                  className="relative"
                >
                  <motion.span
                    aria-hidden
                    className="absolute -left-[1.4rem] top-7 size-3 rounded-full sm:-left-[1.65rem]"
                    style={{
                      background: STATUS_GLOW[visit.status],
                      boxShadow: `0 0 16px 2px color-mix(in oklab, ${STATUS_GLOW[visit.status]} 70%, transparent)`,
                    }}
                    animate={calm ? {} : { scale: [1, 1.25, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
                  />

                  <motion.button
                    type="button"
                    layout
                    onClick={() => setOpenId(open ? null : visit.id)}
                    aria-expanded={open}
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="stack-card block w-full rounded-3xl p-5 text-left"
                  >
                    <motion.div layout="position" className="flex flex-wrap items-center gap-4">
                      <img
                        src={visit.photo}
                        alt={visit.doctor}
                        loading="lazy"
                        width={120}
                        height={120}
                        className="size-14 shrink-0 rounded-2xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-extrabold">{visit.doctor}</p>
                        <p className="truncate text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {visit.specialty} · {visit.date}
                        </p>
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {visit.complaint}
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold"
                        style={{
                          background: `color-mix(in oklab, ${STATUS_GLOW[visit.status]} 18%, transparent)`,
                          color: `color-mix(in oklab, ${STATUS_GLOW[visit.status]} 75%, var(--charcoal))`,
                          boxShadow: `0 0 22px -8px color-mix(in oklab, ${STATUS_GLOW[visit.status]} 90%, transparent)`,
                        }}
                      >
                        {visit.status}
                      </span>
                    </motion.div>

                    <AnimatePresence initial={false}>
                      {open ? (
                        <motion.div
                          key="detail"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 26 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-5 space-y-4 border-t border-border pt-5">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                                Complaint
                              </p>
                              <p className="mt-1 text-sm">{visit.complaintDetail}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                                Doctor&apos;s notes
                              </p>
                              <p className="mt-1 text-sm">{visit.notes}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                                Medicines
                              </p>
                              <ul className="mt-2 space-y-2">
                                {visit.medicines.map((m) => (
                                  <li
                                    key={m.name}
                                    className="glass-pane flex items-start gap-3 rounded-2xl p-3"
                                  >
                                    <Pill aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                                    <span className="min-w-0">
                                      <span className="block text-sm font-extrabold">{m.name}</span>
                                      <span className="block text-xs font-semibold text-muted-foreground">
                                        {m.dosage} · {m.duration}
                                      </span>
                                      <span className="block text-xs text-muted-foreground">
                                        {m.instructions}
                                      </span>
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <motion.div layout="position" className="mt-4 flex flex-wrap gap-2">
                      {visit.attachments.map((a) => {
                        const Icon = ATTACH_ICON[a.kind];
                        return (
                          <motion.span
                            key={a.label}
                            role="button"
                            tabIndex={0}
                            onClick={(e) => e.stopPropagation()}
                            whileHover={{ y: -2, scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: "spring", stiffness: 420, damping: 18 }}
                            className="glass-pane inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold"
                          >
                            <Icon className="size-3.5 text-primary" />
                            {a.label}
                          </motion.span>
                        );
                      })}
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground">
                        <Paperclip aria-hidden className="size-3.5" />
                        {open ? "Tap to collapse" : "Tap to expand"}
                      </span>
                    </motion.div>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
