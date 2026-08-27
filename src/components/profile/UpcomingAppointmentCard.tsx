import { useEffect, useState } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { CalendarPlus, CalendarX2, Clock, RefreshCw, Stethoscope } from "lucide-react";
import type { Appointment } from "@/lib/profile-data";

function GlassPill({
  children,
  icon: Icon,
  tone = "default",
}: {
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "danger";
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      className={`glass-pane inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold ${
        tone === "danger" ? "text-destructive" : "text-foreground"
      }`}
    >
      <Icon className="size-4" />
      {children}
    </motion.button>
  );
}

export function UpcomingAppointmentCard({ appointment }: { appointment: Appointment | null }) {
  const calm = useReducedMotion() ?? false;
  const [position, setPosition] = useState(appointment?.queuePosition ?? 0);
  const spring = useSpring(appointment?.queuePosition ?? 0, {
    stiffness: 90,
    damping: 14,
    mass: 0.9,
  });
  const rounded = useTransform(spring, (v) => Math.max(1, Math.round(v)));
  const [shown, setShown] = useState(position);

  useEffect(() => spring.set(position), [position, spring]);
  useEffect(() => rounded.on("change", (v) => setShown(v as number)), [rounded]);

  const live = appointment?.checkedInToday ?? false;
  useEffect(() => {
    if (!live || calm) return;
    const id = setInterval(() => setPosition((p) => (p <= 1 ? 4 : p - 1)), 5000);
    return () => clearInterval(id);
  }, [live, calm]);

  if (!appointment) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 150, damping: 18 }}
        className="glass-card mt-8 rounded-4xl p-6 text-center sm:p-10"
      >
        <motion.span
          className="mx-auto grid size-14 place-items-center rounded-3xl text-primary-foreground"
          style={{ background: "var(--gradient-care)", boxShadow: "var(--shadow-glow)" }}
          animate={calm ? {} : { y: [0, -6, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <CalendarPlus aria-hidden className="size-6" />
        </motion.span>
        <h2 className="mt-4 text-2xl font-extrabold">No appointments yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Caddy has scanned 240 slots near Clifton and there are openings today. Pick a specialist
          and your first visit lands right here — with live queue tracking.
        </p>
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ y: 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className="btn-3d mt-6 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground"
        >
          Find a doctor
        </motion.button>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      className="glass-pane relative mt-8 overflow-hidden rounded-4xl p-6 sm:p-8"
    >
      {/* pulsing border ring */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-4xl border-2 border-primary/60"
        animate={calm ? {} : { opacity: [0.25, 0.9, 0.25], scale: [1, 1.01, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
          <motion.img
            src={appointment.photo}
            alt={appointment.doctor}
            loading="lazy"
            width={160}
            height={160}
            className="size-20 shrink-0 rounded-3xl object-cover sm:size-24"
            style={{ boxShadow: "var(--shadow-card)" }}
            whileHover={{ scale: 1.04, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          />
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Stethoscope aria-hidden className="size-3.5" /> Next appointment
            </p>
            <h2 className="mt-1 truncate text-2xl font-extrabold">{appointment.doctor}</h2>
            <p className="truncate text-sm font-semibold text-muted-foreground">
              {appointment.specialty}
            </p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold">
              <Clock aria-hidden className="size-4 text-primary" />
              {appointment.date} · {appointment.time}
            </p>
          </div>
        </div>

        {live ? (
          <div className="flex items-center gap-4 lg:justify-end">
            <div className="text-center">
              <motion.div
                className="relative grid size-24 place-items-center rounded-full"
                style={{ background: "var(--gradient-care)", boxShadow: "var(--shadow-glow)" }}
                animate={calm ? {} : { scale: [1, 1.04, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="font-hero text-4xl text-primary-foreground">{shown}</span>
              </motion.div>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                in queue
              </p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="inline-flex items-center gap-2 font-bold text-primary">
                <motion.span
                  className="size-2 rounded-full bg-primary"
                  animate={calm ? {} : { scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
                Checked in
              </p>
              <p className="font-bold">~{Math.max(4, shown * 6)} min wait</p>
              <p className="text-muted-foreground">
                {appointment.room} · {appointment.token}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative mt-6 flex flex-wrap gap-3">
        <GlassPill icon={Stethoscope}>View details</GlassPill>
        <GlassPill icon={RefreshCw}>Reschedule</GlassPill>
        <GlassPill icon={CalendarX2} tone="danger">
          Cancel
        </GlassPill>
      </div>
    </motion.section>
  );
}
