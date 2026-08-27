import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { AuthShell, GlassField } from "@/components/caddy/AuthShell";
import { RoleToggle } from "./login";
import { useCaddy } from "@/lib/caddy-context";
import { EMPTY_PROFILE, type Role } from "@/lib/caddy-store";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account · Caddy Care" },
      {
        name: "description",
        content:
          "Create a Caddy Care account in seconds — book verified doctors, store every report and let Caddy watch the queue for you.",
      },
      { property: "og:title", content: "Create your account · Caddy Care" },
      {
        property: "og:description",
        content: "Join 12,400 patients booking care without the lobby wait.",
      },
    ],
  }),
  component: SignupPage,
});

const STRENGTH = ["Too short", "Weak", "Getting there", "Strong", "Fort Knox"];

function scorePassword(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

function SignupPage() {
  const { setProfile } = useCaddy();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const score = scorePassword(password);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      setProfile({ ...EMPTY_PROFILE, name, email, role });
      navigate({ to: role === "doctor" ? "/doctor" : "/onboarding" });
    }, 900);
  };

  return (
    <AuthShell
      eyebrow="Join Caddy Care"
      title={
        <>
          Care that <span className="foil-text foil-animate">waits for you</span>
        </>
      }
      subtitle="One account for bookings, reports, reminders and your live queue."
      footer={
        <>
          Already with us?{" "}
          <Link to="/login" className="font-extrabold text-primary">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <RoleToggle role={role} setRole={setRole} />

        {[
          <GlassField
            key="name"
            label="Full name"
            placeholder="Zayan Ahmed"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />,
          <GlassField
            key="email"
            label="Email"
            type="email"
            placeholder="you@caddy.care"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />,
          <GlassField
            key="pw"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />,
        ].map((field, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.24 + i * 0.07 }}
          >
            {field}
          </motion.div>
        ))}

        <div>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 flex-1 rounded-full bg-secondary"
                animate={{
                  backgroundColor:
                    i < score
                      ? "color-mix(in oklab, var(--care) 85%, transparent)"
                      : "color-mix(in oklab, var(--charcoal) 12%, transparent)",
                  scaleY: i < score ? 1.35 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              />
            ))}
          </div>
          <p className="mt-1.5 text-[0.7rem] font-bold text-muted-foreground">{STRENGTH[score]}</p>
        </div>

        <label className="flex items-start gap-2 text-xs font-semibold text-muted-foreground">
          <input type="checkbox" required className="mt-0.5 size-4 accent-[var(--care)]" />
          I agree to the care terms and privacy policy.
        </label>

        <motion.button
          type="submit"
          disabled={busy}
          whileHover={{ y: -2 }}
          whileTap={{ y: 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className="btn-3d flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-extrabold text-primary-foreground disabled:opacity-70"
        >
          <AnimatePresence mode="wait" initial={false}>
            {busy ? (
              <motion.span
                key="b"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-2"
              >
                <Loader2 aria-hidden className="size-4 animate-spin" /> Building your vault…
              </motion.span>
            ) : (
              <motion.span
                key="i"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-2"
              >
                <Sparkles aria-hidden className="size-4" /> Create account
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </form>
    </AuthShell>
  );
}
