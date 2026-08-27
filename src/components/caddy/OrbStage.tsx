import { Suspense, lazy, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const CaddyOrb = lazy(() => import("./CaddyOrb"));

/**
 * Client-only mount for the react-three-fiber Caddy orb.
 * SSR renders the glow shell only; WebGL boots after hydration.
 */
export function OrbStage({ className = "" }: { className?: string }) {
  const [ready, setReady] = useState(false);
  const calm = useReducedMotion() ?? false;

  useEffect(() => setReady(true), []);

  return (
    <div className={`relative ${className}`}>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-4 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, color-mix(in oklab, var(--care) 60%, transparent), color-mix(in oklab, var(--ember) 30%, transparent) 55%, transparent 72%)",
        }}
        animate={calm ? {} : { scale: [0.9, 1.08, 0.9], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative size-full">
        {ready ? (
          <Suspense fallback={null}>
            <CaddyOrb calm={calm} />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
}
