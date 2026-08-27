import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { GlassField } from "@/components/caddy/AuthShell";
import { OrbStage } from "@/components/caddy/OrbStage";
import { useCaddy } from "@/lib/caddy-context";
import { EMPTY_PROFILE, type CaddyProfile } from "@/lib/caddy-store";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your health profile · Caddy Care" },
      {
        name: "description",
        content:
          "Tell Caddy about your health basics — blood group, allergies, conditions and emergency contact — so every doctor sees the full picture.",
      },
      { property: "og:title", content: "Set up your health profile · Caddy Care" },
      {
        property: "og:description",
        content: "A three-step profile that makes every future visit faster.",
      },
    ],
  }),
  component: OnboardingPage,
});

const STEPS = ["Identity", "Medical", "Safety net"] as const;
const spring = { type: "spring" as const, stiffness: 160, damping: 18 };

function OnboardingPage() {
  const { state, setProfile, pushNotification } = useCaddy();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<CaddyProfile>({
    ...EMPTY_PROFILE,
    ...(state.profile ?? {}),
  });

  const set = (k: keyof CaddyProfile) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const finish = () => {
    setProfile({ ...form, completedOnboarding: true });
    pushNotification({
      title: "Profile complete",
      body: "Your health profile is now shared with your care team.",
      kind: "report",
    });
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div aria-hidden className="clinic-grain pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <div className="flex items-center gap-4">
          <OrbStage className="size-24 shrink-0" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Step {step + 1} of 3
            </p>
            <h1 className="font-display text-3xl font-extrabold">Let&apos;s build your profile</h1>
          </div>
        </div>

        {/* progress rail */}
        <div className="mt-8 flex items-center gap-3">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "var(--gradient-care)" }}
                  initial={false}
                  animate={{ width: i <= step ? "100%" : "0%" }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
              <p
                className={`mt-2 text-xs font-extrabold ${i <= step ? "text-foreground" : "text-muted-foreground"}`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="glass-pane mt-8 overflow-hidden rounded-4xl p-6 sm:p-8">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60, rotateY: dir * 8 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -dir * 60, rotateY: -dir * 8 }}
              transition={spring}
              className="grid gap-4 sm:grid-cols-2"
            >
              {step === 0 && (
                <>
                  <GlassField label="Full name" value={form.name} onChange={set("name")} />
                  <GlassField label="Email" value={form.email} onChange={set("email")} />
                  <GlassField
                    label="Phone"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+92 300 0000000"
                  />
                  <GlassField
                    label="Date of birth"
                    type="date"
                    value={form.dob}
                    onChange={set("dob")}
                  />
                  <GlassField
                    label="Gender"
                    value={form.gender}
                    onChange={set("gender")}
                    placeholder="Female / Male / Other"
                  />
                  <GlassField
                    label="City"
                    value={form.city}
                    onChange={set("city")}
                    placeholder="Karachi"
                  />
                </>
              )}

              {step === 1 && (
                <>
                  <GlassField
                    label="Blood group"
                    value={form.bloodGroup}
                    onChange={set("bloodGroup")}
                    placeholder="O+"
                  />
                  <GlassField
                    label="Insurance / panel"
                    value={form.insurance}
                    onChange={set("insurance")}
                    placeholder="Jubilee Health"
                  />
                  <div className="sm:col-span-2">
                    <GlassField
                      label="Known allergies"
                      value={form.allergies}
                      onChange={set("allergies")}
                      placeholder="Penicillin, pollen…"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <GlassField
                      label="Ongoing conditions"
                      value={form.conditions}
                      onChange={set("conditions")}
                      placeholder="Asthma, hypertension…"
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <GlassField
                    label="Emergency contact"
                    value={form.emergencyName}
                    onChange={set("emergencyName")}
                    placeholder="Sara Ahmed (sister)"
                  />
                  <GlassField
                    label="Emergency phone"
                    value={form.emergencyPhone}
                    onChange={set("emergencyPhone")}
                    placeholder="+92 321 0000000"
                  />
                  <div className="glass-card sm:col-span-2 rounded-3xl p-5">
                    <p className="text-sm font-extrabold">Share records with your doctors</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Doctors you book see your shared reports and visit history — you can revoke any
                      report anytime from your vault.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            <motion.button
              type="button"
              onClick={() => go(Math.max(0, step - 1))}
              disabled={step === 0}
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold text-muted-foreground disabled:opacity-40"
            >
              <ArrowLeft aria-hidden className="size-4" /> Back
            </motion.button>

            <motion.button
              type="button"
              onClick={() => (step === 2 ? finish() : go(step + 1))}
              whileHover={{ y: -2 }}
              whileTap={{ y: 4 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="btn-3d inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground"
            >
              {step === 2 ? (
                <>
                  Finish setup <Check aria-hidden className="size-4" />
                </>
              ) : (
                <>
                  Continue <ArrowRight aria-hidden className="size-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </main>
  );
}
