import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Loader2, LogIn, ShieldCheck } from "lucide-react";
import { AuthShell, GlassField } from "@/components/caddy/AuthShell";
import { useCaddy } from "@/lib/caddy-context";
import { EMPTY_PROFILE, type Role } from "@/lib/caddy-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · Caddy Care" },
      {
        name: "description",
        content:
          "Sign in to Caddy Care to track your live queue position, open your health vault and see every visit in one place.",
      },
      { property: "og:title", content: "Sign in · Caddy Care" },
      {
        property: "og:description",
        content: "Your queue, reports and care streak — all behind one secure sign in.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { state, setProfile } = useCaddy();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      const existing = state.profile;
      setProfile({
        ...EMPTY_PROFILE,
        ...(existing ?? {}),
        name: existing?.name || (role === "doctor" ? "Dr. Aisha Rahman" : "Zayan Ahmed"),
        email: email || existing?.email || "you@caddy.care",
        role,
        completedOnboarding: existing?.completedOnboarding ?? false,
      });
      if (role === "doctor") navigate({ to: "/doctor" });
      else if (existing?.completedOnboarding) navigate({ to: "/dashboard" });
      else navigate({ to: "/onboarding" });
    }, 900);
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title={
        <>
          Your care, <span className="foil-text foil-animate">right where you left it</span>
        </>
      }
      subtitle="Sign in to see your queue position, reports and follow-ups."
      footer={
        <>
          New to Caddy Care?{" "}
          <Link to="/signup" className="font-extrabold text-primary">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <RoleToggle role={role} setRole={setRole} />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.26 }}
        >
          <GlassField
            label="Email"
            type="email"
            placeholder="you@caddy.care"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.32 }}
        >
          <GlassField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </motion.div>

        <div className="flex items-center justify-between text-xs font-bold">
          <label className="inline-flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="size-4 accent-[var(--care)]" defaultChecked />
            Keep me signed in
          </label>
          <span className="cursor-pointer text-primary">Forgot password?</span>
        </div>

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
                key="busy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-2"
              >
                <Loader2 aria-hidden className="size-4 animate-spin" /> Waking Caddy…
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-2"
              >
                <LogIn aria-hidden className="size-4" /> Sign in
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <p className="flex items-center justify-center gap-1.5 text-[0.7rem] font-semibold text-muted-foreground">
          <ShieldCheck aria-hidden className="size-3.5 text-primary" />
          End-to-end encrypted records · HIPAA-style controls
        </p>
      </form>
    </AuthShell>
  );
}

export function RoleToggle({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  return (
    <div className="glass-card relative flex rounded-2xl p-1">
      {(["patient", "doctor"] as Role[]).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => setRole(r)}
          className="relative flex-1 rounded-xl px-4 py-2.5 text-sm font-extrabold capitalize"
        >
          {role === r && (
            <motion.span
              layoutId="role-pill"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="absolute inset-0 rounded-xl"
              style={{ background: "var(--gradient-care)", boxShadow: "var(--shadow-glow)" }}
            />
          )}
          <span
            className={`relative ${role === r ? "text-primary-foreground" : "text-muted-foreground"}`}
          >
            {r === "patient" ? "I'm a patient" : "I'm a doctor"}
          </span>
        </button>
      ))}
    </div>
  );
}
