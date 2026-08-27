import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Bell, CalendarCheck, FileText, Flame, Users } from "lucide-react";
import { useCaddy } from "@/lib/caddy-context";
import type { CaddyNotification } from "@/lib/caddy-store";

const ICONS = {
  queue: Users,
  report: FileText,
  appointment: CalendarCheck,
  streak: Flame,
} as const;

export function NotificationBell() {
  const { state, markAllRead, markRead } = useCaddy();
  const [open, setOpen] = useState(false);
  const unread = state.notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <motion.button
        type="button"
        aria-label={`Notifications (${unread} unread)`}
        onClick={() => setOpen((o) => !o)}
        whileHover={{ y: -2, rotate: -8 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 420, damping: 14 }}
        className="glass-card relative grid size-10 place-items-center rounded-2xl"
      >
        <Bell aria-hidden className="size-4" />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 14 }}
              className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-accent text-[0.6rem] font-extrabold text-accent-foreground"
            >
              {unread}
              <motion.span
                className="absolute inset-0 rounded-full bg-accent"
                animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="glass-pane absolute right-0 z-50 mt-3 w-[21rem] origin-top-right rounded-3xl p-3"
          >
            <div className="flex items-center justify-between px-2 pb-2">
              <p className="text-sm font-extrabold">Notifications</p>
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-extrabold text-primary"
              >
                Mark all read
              </button>
            </div>
            <ul className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
              {state.notifications.map((n, i) => (
                <NotificationRow key={n.id} n={n} index={i} onRead={() => markRead(n.id)} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationRow({
  n,
  index,
  onRead,
}: {
  n: CaddyNotification;
  index: number;
  onRead: () => void;
}) {
  const Icon = ICONS[n.kind];
  return (
    <motion.li
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, delay: index * 0.05 }}
      whileHover={{ x: 3 }}
      onClick={onRead}
      className={`flex cursor-pointer gap-3 rounded-2xl p-3 transition-colors ${
        n.read ? "opacity-70" : "bg-secondary/60"
      }`}
    >
      <span
        className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl text-primary-foreground"
        style={{ background: "var(--gradient-care)" }}
      >
        <Icon aria-hidden className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-extrabold">{n.title}</p>
        <p className="text-xs leading-snug text-muted-foreground">{n.body}</p>
        <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
          {n.time}
        </p>
      </div>
      {!n.read && <span className="ml-auto mt-2 size-2 shrink-0 rounded-full bg-accent" />}
    </motion.li>
  );
}
