import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { Clock, DoorOpen, MapPin, Stethoscope, Users } from "lucide-react";
import { NotificationBell } from "@/components/caddy/NotificationCenter";
import { OrbStage } from "@/components/caddy/OrbStage";
import { SiteFooter } from "@/components/caddy/SiteFooter";
import { useCaddy } from "@/lib/caddy-context";

export const Route = createFileRoute("/queue")({
  head: () => ({
    meta: [
      { title: "Live queue · Caddy Care" },
      {
        name: "description",
        content:
          "Watch your clinic queue move in real time — animated token board, live wait estimate and a nudge from Caddy when it's time to leave home.",
      },
      { property: "og:title", content: "Live queue · Caddy Care" },
      {
        property: "og:description",
        content: "An animated token board that tells you exactly when to leave.",
      },
    ],
  }),
  component: QueuePage,
});

const spring = { type: "spring" as const, stiffness: 170, damping: 20 };

const PEOPLE = [
  { token: "A-21", name: "Bilal A.", reason: "BP review" },
  { token: "A-22", name: "Sara N.", reason: "Migraine follow-up" },
  { token: "A-23", name: "Hamza I.", reason: "Sugar check" },
  { token: "A-24", name: "You", reason: "Dental cleaning" },
  { token: "A-25", name: "Nida F.", reason: "Skin consult" },
  { token: "A-26", name: "Rehan K.", reason: "Vaccination" },
];

function QueuePage() {
  const calm = useReducedMotion();
  const { pushNotification } = useCaddy();
  const [queue, setQueue] = useState(PEOPLE);
  const myIndex = queue.findIndex((p) => p.name === "You");
  const position = myIndex + 1;

  const posSpring = useSpring(position, { stiffness: 90, damping: 14, mass: 0.9 });
  const rounded = useTransform(posSpring, (v) => Math.max(1, Math.round(v)));
  const waitSpring = useSpring(position * 6, { stiffness: 80, damping: 16 });
  const wait = useTransform(waitSpring, (v) => `${Math.max(1, Math.round(v))} min`);

  useEffect(() => {
    posSpring.set(position);
    waitSpring.set(position * 6);
  }, [position, posSpring, waitSpring]);

  useEffect(() => {
    const id = setInterval(() => {
      setQueue((q) => (q.length > 1 && q[0]?.name !== "You" ? q.slice(1) : PEOPLE));
    }, 4200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (position === 2) {
      pushNotification({
        title: "You're next but one",
        body: "Head to Room 3 — Caddy will call your token in about 6 minutes.",
        kind: "queue",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

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
            <span className="font-display text-lg font-extrabold">Live queue</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/dashboard"
              className="hidden rounded-full px-4 py-2 text-sm font-extrabold text-muted-foreground hover:text-foreground sm:block"
            >
              My vault
            </Link>
            <NotificationBell />
          </div>
        </motion.header>

        {/* token stage */}
        <section className="mt-10 grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              <motion.span
                className="size-2 rounded-full bg-primary"
                animate={calm ? {} : { scale: [1, 1.7, 1], opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Caddy Smile Studio · Room 3
            </div>
            <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
              Token <span className="foil-text foil-animate">A-24</span> — you&apos;re moving up
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-5">
              <motion.div
                className="relative grid size-32 place-items-center rounded-full"
                style={{ background: "var(--gradient-care)", boxShadow: "var(--shadow-glow)" }}
                animate={calm ? {} : { scale: [1, 1.05, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full border-2 border-[color-mix(in_oklab,var(--care)_60%,transparent)]"
                  animate={calm ? {} : { scale: [1, 1.5], opacity: [0.7, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.span className="font-hero text-6xl text-primary-foreground">
                  {rounded}
                </motion.span>
              </motion.div>

              <div className="space-y-3">
                <Stat icon={Clock} label="Estimated wait">
                  <motion.span className="font-display text-xl font-extrabold">{wait}</motion.span>
                </Stat>
                <Stat icon={Users} label="Ahead of you">
                  <span className="font-display text-xl font-extrabold">{Math.max(0, myIndex)}</span>
                </Stat>
                <Stat icon={MapPin} label="Leave home in">
                  <span className="font-display text-xl font-extrabold">
                    {Math.max(0, position * 6 - 14)} min
                  </span>
                </Stat>
              </div>
            </div>
          </motion.div>

          <OrbStage className="mx-auto aspect-square w-full max-w-[340px]" />
        </section>

        {/* animated board */}
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold">Token board</h2>
          <motion.ul layout className="mt-5 space-y-3">
            <AnimatePresence initial={false}>
              {queue.map((p, i) => {
                const isMe = p.name === "You";
                return (
                  <motion.li
                    layout
                    key={p.token}
                    initial={{ opacity: 0, y: 40, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 120, scale: 0.9, rotateZ: 4 }}
                    transition={{ type: "spring", stiffness: 220, damping: 24 }}
                    className={`flex items-center gap-4 rounded-3xl p-4 ${isMe ? "glass-pane" : "glass-card"}`}
                  >
                    <motion.span
                      layout
                      className="grid size-14 shrink-0 place-items-center rounded-2xl font-hero text-lg text-primary-foreground"
                      style={{
                        background: i === 0 ? "var(--gradient-care)" : "var(--gradient-foil)",
                      }}
                      animate={i === 0 && !calm ? { scale: [1, 1.07, 1] } : {}}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {p.token}
                    </motion.span>
                    <div className="min-w-0">
                      <p className="font-extrabold">
                        {p.name}
                        {isMe && (
                          <span className="ml-2 rounded-full bg-accent/30 px-2 py-0.5 text-[0.62rem] font-extrabold uppercase tracking-wider text-accent-foreground">
                            your token
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{p.reason}</p>
                    </div>
                    <span className="ml-auto text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                      {i === 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-primary">
                          <DoorOpen aria-hidden className="size-3.5" /> in room
                        </span>
                      ) : (
                        `#${i}`
                      )}
                    </span>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Clock;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-xl bg-secondary text-primary">
        <Icon aria-hidden className="size-4" />
      </span>
      <div>
        <p className="text-[0.66rem] font-extrabold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}
