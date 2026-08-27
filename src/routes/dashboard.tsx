import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FilePlus2, FileText, ShieldCheck, Stethoscope, Upload } from "lucide-react";
import { NotificationBell } from "@/components/caddy/NotificationCenter";
import { StreakGraph } from "@/components/caddy/StreakGraph";
import { OrbStage } from "@/components/caddy/OrbStage";
import { SiteFooter } from "@/components/caddy/SiteFooter";
import { useCaddy } from "@/lib/caddy-context";
import type { Report } from "@/lib/caddy-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your health vault · Caddy Care" },
      {
        name: "description",
        content:
          "Your Caddy Care dashboard — saved reports, care streak, live notifications and the visit history your doctor can see.",
      },
      { property: "og:title", content: "Your health vault · Caddy Care" },
      {
        property: "og:description",
        content: "Reports, streaks and queue alerts in one calm place.",
      },
    ],
  }),
  component: Dashboard,
});

const spring = { type: "spring" as const, stiffness: 160, damping: 18 };

function Dashboard() {
  const { state, addReport, toggleShare, logToday, pushNotification } = useCaddy();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const profile = state.profile;

  const upload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const report: Report = {
      id: `r${Date.now()}`,
      title: title.trim(),
      kind: "Lab",
      date: new Date().toISOString().slice(0, 10),
      doctor: "Uploaded by you",
      summary: "Awaiting doctor review — Caddy will notify you when it's read.",
      sharedWithDoctor: true,
    };
    addReport(report);
    pushNotification({
      title: "Report added to vault",
      body: `${report.title} is now shared with your care team.`,
      kind: "report",
    });
    setTitle("");
    setAdding(false);
  };

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
            <span className="font-display text-lg font-extrabold">Caddy Care</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <Link
              to="/queue"
              className="hidden rounded-full px-4 py-2 text-sm font-extrabold text-muted-foreground hover:text-foreground sm:block"
            >
              Live queue
            </Link>
            <Link
              to="/doctor"
              className="hidden rounded-full px-4 py-2 text-sm font-extrabold text-muted-foreground hover:text-foreground sm:block"
            >
              Doctor view
            </Link>
            <NotificationBell />
          </nav>
        </motion.header>

        {/* greeting */}
        <section className="mt-10 grid items-center gap-6 lg:grid-cols-[1.4fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Health vault
            </p>
            <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
              Hey {profile?.name?.split(" ")[0] || "there"},{" "}
              <span className="foil-text foil-animate">you&apos;re on track</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm text-muted-foreground">
              {profile?.completedOnboarding
                ? "Everything your doctor needs is ready before you walk in."
                : "Finish your profile so every doctor sees the full picture."}
            </p>
            {!profile?.completedOnboarding && (
              <Link
                to="/onboarding"
                className="btn-3d mt-5 inline-block rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground"
              >
                Complete profile
              </Link>
            )}
          </motion.div>
          <OrbStage className="mx-auto aspect-square w-full max-w-[280px]" />
        </section>

        {/* profile summary */}
        {profile && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={spring}
            className="glass-card mt-10 grid gap-4 rounded-4xl p-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              ["Blood group", profile.bloodGroup || "—"],
              ["Allergies", profile.allergies || "None recorded"],
              ["Conditions", profile.conditions || "None recorded"],
              ["Emergency", profile.emergencyName || "—"],
            ].map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: i * 0.07 }}
              >
                <p className="text-[0.68rem] font-extrabold uppercase tracking-wider text-muted-foreground">
                  {k}
                </p>
                <p className="mt-1 text-sm font-bold">{v}</p>
              </motion.div>
            ))}
          </motion.section>
        )}

        {/* streak */}
        <div className="mt-10">
          <StreakGraph streak={state.streak} onLog={logToday} />
        </div>

        {/* reports */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold">Saved reports</h2>
            <motion.button
              type="button"
              onClick={() => setAdding((a) => !a)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 4 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="btn-3d inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground"
            >
              <FilePlus2 aria-hidden className="size-4" /> Add report
            </motion.button>
          </div>

          <AnimatePresence initial={false}>
            {adding && (
              <motion.form
                onSubmit={upload}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                className="overflow-hidden"
              >
                <div className="glass-pane mt-4 flex flex-wrap items-center gap-3 rounded-3xl p-4">
                  <Upload aria-hidden className="size-4 text-primary" />
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Report title, e.g. Thyroid panel"
                    className="field-glass min-w-[16rem] flex-1 rounded-2xl px-4 py-2.5 text-sm font-semibold"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground"
                  >
                    Save to vault
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.ul layout className="mt-5 grid gap-4 sm:grid-cols-2">
            <AnimatePresence initial={false}>
              {state.reports.map((r, i) => (
                <motion.li
                  layout
                  key={r.id}
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.05 }}
                  whileHover={{ y: -6, rotateX: 4, rotateY: -3 }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="glass-card rounded-3xl p-5"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="grid size-10 shrink-0 place-items-center rounded-2xl text-primary-foreground"
                      style={{ background: "var(--gradient-care)" }}
                    >
                      <FileText aria-hidden className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-extrabold">{r.title}</p>
                      <p className="text-xs font-bold text-muted-foreground">
                        {r.kind} · {r.date} · {r.doctor}
                      </p>
                      <p className="mt-2 text-sm leading-snug text-muted-foreground">{r.summary}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleShare(r.id)}
                    className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold ${
                      r.sharedWithDoctor
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <ShieldCheck aria-hidden className="size-3.5" />
                    {r.sharedWithDoctor ? "Shared with doctor" : "Private"}
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
