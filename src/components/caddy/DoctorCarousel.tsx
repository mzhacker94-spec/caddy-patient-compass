import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Star,
} from "lucide-react";
import { DOCTORS, type Doctor } from "@/lib/home-data";


const spring = { type: "spring" as const, stiffness: 260, damping: 22 };

function DoctorCard({
  doctor,
  index,
  progress,
  total,
}: {
  doctor: Doctor;
  index: number;
  progress: MotionValue<number>;
  total: number;
}) {
  // Coverflow: scroll progress → per-card 3D rotation, so the card nearest the
  // centre faces the viewer while its neighbours angle away.
  const center = index / Math.max(1, total - 1);
  const rotateY = useTransform(progress, [center - 0.45, center, center + 0.45], [24, 0, -24], {
    clamp: true,
  });
  const scale = useTransform(progress, [center - 0.45, center, center + 0.45], [0.94, 1, 0.94], {
    clamp: true,
  });

  return (
    <motion.article
      style={{ rotateY, scale, transformPerspective: 1200 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      whileHover={{ y: -12, boxShadow: "var(--shadow-card-hover)" }}
      transition={{ ...spring, delay: index * 0.07 }}
      className="glass-card group relative w-[min(300px,84vw)] shrink-0 snap-center overflow-hidden rounded-4xl p-6 sm:w-[300px]"
    >
      {/* soft gradient wash that blooms on hover */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-care)" }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.08 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
      />

      <div className="relative flex items-start gap-4">
        <div className="relative size-20 shrink-0">
          <motion.div
            aria-hidden
            className="absolute -inset-2 rounded-full blur-xl"
            style={{ background: "color-mix(in oklab, var(--care) 55%, transparent)" }}
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.06, 0.95] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
          />
          <img
            src={doctor.photo}
            alt={`${doctor.name}, ${doctor.specialty}`}
            width={640}
            height={640}
            loading="lazy"
            draggable={false}
            className="relative size-20 rounded-full border-2 border-card object-cover"
          />
          <motion.span
            className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 420, damping: 14, delay: 0.25 }}
          >
            <BadgeCheck aria-hidden className="size-3.5" />
          </motion.span>
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-lg font-extrabold leading-tight">{doctor.name}</h3>
          <p className="text-sm font-bold text-primary">{doctor.specialty}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin aria-hidden className="size-3" />
            <span className="truncate">{doctor.clinic}</span>
          </p>
        </div>
      </div>

      <p className="relative mt-4 text-sm leading-relaxed text-muted-foreground">{doctor.bio}</p>

      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {doctor.tags.map((tag) => (
          <motion.span
            key={tag}
            whileHover={{ scale: 1.06 }}
            transition={spring}
            className="rounded-full bg-secondary/80 px-2.5 py-1 text-[11px] font-bold text-muted-foreground"
          >
            {tag}
          </motion.span>
        ))}
      </div>

      <dl className="relative mt-4 grid grid-cols-3 gap-2 rounded-3xl bg-secondary/60 p-3 text-center">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Rating
          </dt>
          <dd className="mt-0.5 flex items-center justify-center gap-1 text-sm font-extrabold text-gold">
            <Star aria-hidden className="size-3.5 fill-current" />
            {doctor.rating}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Experience
          </dt>
          <dd className="mt-0.5 text-sm font-extrabold">{doctor.experience}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Visit fee
          </dt>
          <dd className="mt-0.5 text-sm font-extrabold">{doctor.fee}</dd>
        </div>
      </dl>

      <p className="relative mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-primary">
        <Clock aria-hidden className="size-3.5" />
        Next slot · {doctor.next}
      </p>

      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ y: 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
        className="btn-3d relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-primary py-3 text-sm font-extrabold text-primary-foreground"
      >
        <motion.span
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, transparent 20%, color-mix(in oklab, white 45%, transparent) 50%, transparent 80%)",
          }}
          initial={{ x: "-120%" }}
          animate={{ x: "120%" }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
        />
        <CalendarCheck aria-hidden className="relative size-4" />
        <span className="relative">Book appointment</span>
      </motion.button>
    </motion.article>
  );
}

export function DoctorCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const { scrollXProgress } = useScroll({ container: trackRef, axis: "x" });

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure]);

  const scrollBy = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = (card?.clientWidth ?? 300) + 20;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };


  return (
    <section className="space-y-5">
      <motion.header
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div className="space-y-2">
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 20 } },
            }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[0.65rem] font-bold tracking-[0.22em] uppercase text-primary"
          >
            Handpicked care
          </motion.span>

          <h2 className="flex flex-wrap items-baseline gap-x-3 text-[clamp(2rem,6vw,3.4rem)] leading-[0.95] font-black tracking-[-0.04em]">
            {["Featured", "doctors"].map((word, i) => (
              <motion.span
                key={word}
                variants={{
                  hidden: { opacity: 0, y: 28, rotateX: -55 },
                  show: {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    transition: { type: "spring", stiffness: 180, damping: 16 },
                  },
                }}
                className={
                  i === 1
                    ? "bg-gradient-to-r from-primary via-primary to-foreground bg-clip-text text-transparent italic"
                    : ""
                }
                style={{ transformOrigin: "bottom" }}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 22 } },
            }}
            className="max-w-md text-sm text-muted-foreground"
          >
            Swipe or use the arrows — Caddy shuffles the deck for you.
          </motion.p>
        </div>

        <motion.span
          variants={{
            hidden: { opacity: 0, scale: 0.85 },
            show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 260, damping: 18 } },
          }}
          className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground"
        >
          <span className="size-2 animate-pulse rounded-full bg-primary" />
          {DOCTORS.length} available now
        </motion.span>
      </motion.header>

      <div className="relative">
        <div
          ref={trackRef}
          className="no-scrollbar -mx-1 snap-x snap-mandatory scroll-px-1 overflow-x-auto px-1 pb-6"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex items-stretch gap-5">
            {DOCTORS.map((d, i) => (
              <DoctorCard
                key={d.id}
                doctor={d}
                index={i}
                total={DOCTORS.length}
                progress={scrollXProgress}
              />
            ))}
          </div>
        </div>

        {/* scroll arrows */}
        {([-1, 1] as const).map((dir) => {
          const disabled = dir === -1 ? edges.start : edges.end;
          const Icon = dir === -1 ? ChevronLeft : ChevronRight;
          return (
            <motion.button
              key={dir}
              type="button"
              onClick={() => scrollBy(dir)}
              disabled={disabled}
              aria-label={dir === -1 ? "Previous doctors" : "Next doctors"}
              whileHover={{ scale: disabled ? 1 : 1.08 }}
              whileTap={{ scale: disabled ? 1 : 0.94 }}
              transition={{ type: "spring", stiffness: 460, damping: 18 }}
              className={`glass-card absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full text-foreground sm:grid ${
                dir === -1 ? "-left-3" : "-right-3"
              } ${disabled ? "pointer-events-none opacity-0" : "opacity-100"}`}
            >
              <Icon aria-hidden className="size-5" />
            </motion.button>
          );
        })}
      </div>

    </section>
  );
}
