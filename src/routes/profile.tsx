import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { z } from "zod";
import { SiteNav } from "@/components/caddy/SiteNav";
import { SiteFooter } from "@/components/caddy/SiteFooter";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { StatChips } from "@/components/profile/StatChips";
import { StreakBoard } from "@/components/profile/StreakBoard";
import { UpcomingAppointmentCard } from "@/components/profile/UpcomingAppointmentCard";
import { VisitTimeline } from "@/components/profile/VisitTimeline";
import { PrescriptionRail } from "@/components/profile/PrescriptionRail";
import { LabReportsGrid } from "@/components/profile/LabReportsGrid";
import { getProfileMock, type MockState } from "@/lib/profile-data";

const searchSchema = z.object({
  state: z.enum(["populated", "new"]).optional().catch("populated"),
});

export const Route = createFileRoute("/profile")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Patient Profile — Caddy Care Health Vault" },
      {
        name: "description",
        content:
          "Your Caddy Care patient profile: visit history, live queue position, prescriptions, lab reports and your care streak — all in one glass dashboard.",
      },
      { property: "og:title", content: "Patient Profile — Caddy Care Health Vault" },
      {
        property: "og:description",
        content:
          "Track visits, appointments, prescriptions and lab reports with Caddy, your animated care companion.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function StateToggle({ state }: { state: MockState }) {
  const options: { key: MockState; label: string }[] = [
    { key: "populated", label: "Gold patient" },
    { key: "new", label: "Brand-new patient" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.1 }}
      className="glass-card mt-6 flex flex-wrap items-center gap-2 rounded-full p-2"
    >
      <span className="px-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
        Mock data
      </span>
      {options.map((o) => {
        const active = o.key === state;
        return (
          <Link
            key={o.key}
            to="/profile"
            search={{ state: o.key }}
            className="relative rounded-full px-4 py-2 text-sm font-extrabold"
          >
            {active ? (
              <motion.span
                layoutId="mockStatePill"
                className="absolute inset-0 rounded-full"
                style={{ background: "var(--gradient-care)" }}
                transition={{ type: "spring", stiffness: 340, damping: 26 }}
              />
            ) : null}
            <span className={`relative ${active ? "text-primary-foreground" : "text-muted-foreground"}`}>
              {o.label}
            </span>
          </Link>
        );
      })}
    </motion.div>
  );
}

function ProfilePage() {
  const { state = "populated" } = Route.useSearch();
  const mock = getProfileMock(state);
  const isNew = state === "new";

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div aria-hidden className="clinic-grain pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-4 sm:px-8">
        <SiteNav minimal />
        <StateToggle state={state} />

        <ProfileHero patient={mock.patient} />
        <StatChips stats={mock.stats} isNew={isNew} />
        <StreakBoard
          streak={mock.streak}
          currentStreak={mock.currentStreak}
          bestStreak={mock.bestStreak}
        />
        <UpcomingAppointmentCard appointment={mock.appointment} />
        <VisitTimeline visits={mock.visits} />
        <PrescriptionRail prescriptions={mock.prescriptions} />
        <LabReportsGrid labs={mock.labs} />

        <SiteFooter />
      </div>
    </main>
  );
}
