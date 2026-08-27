import { motion } from "motion/react";
import { Menu, Stethoscope } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { NotificationBell } from "./NotificationCenter";

const LINKS: { label: string; to: string }[] = [
  { label: "Find doctors", to: "/" },
  { label: "Live queue", to: "/queue" },
  { label: "Health vault", to: "/dashboard" },
  { label: "My profile", to: "/profile" },
  { label: "For clinics", to: "/doctor" },
];

export function SiteNav({ minimal = false }: { minimal?: boolean } = {}) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
      className="glass-card sticky top-4 z-50 flex items-center gap-3 rounded-full px-3 py-2.5 sm:px-5"
    >
      <motion.a
        href="/"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className="flex items-center gap-2"
      >
        <span
          className="grid size-9 place-items-center rounded-2xl text-primary-foreground"
          style={{ background: "var(--gradient-care)" }}
        >
          <Stethoscope aria-hidden className="size-5" />
        </span>
        <span className="font-display text-lg font-extrabold leading-none">
          Caddy<span className="foil-text foil-animate"> Care</span>
        </span>
      </motion.a>

      <ul className="no-scrollbar mx-auto hidden items-center gap-1 overflow-x-auto text-sm font-bold md:flex">
        {(minimal ? LINKS.filter((l) => l.to !== "/profile") : LINKS).map((link, i) => (
          <motion.li
            key={link.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 + i * 0.07 }}
          >
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 420, damping: 18 }}>
              <Link
                to={link.to}
                className="relative block rounded-full px-3.5 py-2 text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
              >
                {link.label}
              </Link>
            </motion.div>
          </motion.li>
        ))}
      </ul>

      <div className="ml-auto flex items-center gap-2 lg:ml-0">
        <NotificationBell />
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ y: 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
        >
          <Link
            to="/login"
            className="btn-3d block rounded-full bg-primary px-5 py-2 text-sm font-extrabold text-primary-foreground"
          >
            Sign in
          </Link>
        </motion.div>
        <motion.button
          type="button"
          aria-label="Open menu"
          whileTap={{ scale: 0.92 }}
          className="grid size-9 place-items-center rounded-full bg-secondary text-foreground lg:hidden"
        >
          <Menu aria-hidden className="size-4" />
        </motion.button>
      </div>
    </motion.nav>
  );
}
