import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, useSpring } from "motion/react";

/**
 * Spring counter that runs from zero the first time it scrolls into view.
 * Reduced motion snaps straight to the final value.
 */
export function AnimatedCounter({
  value,
  delay = 0,
  className = "",
}: {
  value: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const calm = useReducedMotion() ?? false;
  const spring = useSpring(0, { stiffness: 90, damping: 16, mass: 0.9 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (calm) {
      setDisplay(value);
      return;
    }
    const id = setTimeout(() => spring.set(value), delay * 1000);
    return () => clearTimeout(id);
  }, [inView, calm, value, delay, spring]);

  useEffect(() => spring.on("change", (v) => setDisplay(Math.round(v))), [spring]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
