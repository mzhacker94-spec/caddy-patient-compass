import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  MessageCircle,
  Stethoscope,
  CalendarCheck,
  Clock3,
  Timer,
  Sparkles,
  Bell,
  UserRound,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import journeyChat from "@/assets/journey-chat.jpg";
import journeyDoctor from "@/assets/journey-doctor.jpg";
import journeyBooked from "@/assets/journey-booked.jpg";
import journeyQueue from "@/assets/journey-queue.jpg";
import journeyArrive from "@/assets/journey-arrive.jpg";

type Pos = { left: number; top: number };

const at = ({ left, top }: Pos): CSSProperties => ({ left, top });

type CardId = "caddy" | "answers" | "doctor" | "slot" | "booked" | "queue" | "arrive";

/** Two layouts: a branching canvas for wide screens, one straight row for narrow ones. */
type Layout = {
  width: number;
  height: number;
  cards: Record<CardId, Pos>;
  startDot: Pos;
  startPill: Pos;
  endDot: Pos;
  endPill: Pos;
  midDots: Pos[];
  paths: string[];
};

const WIDE: Layout = {
  width: 3400,
  height: 1000,
  cards: {
    caddy: { left: 400, top: 500 },
    answers: { left: 1060, top: 180 },
    doctor: { left: 1060, top: 500 },
    slot: { left: 1060, top: 820 },
    booked: { left: 1700, top: 500 },
    queue: { left: 2350, top: 500 },
    arrive: { left: 2950, top: 500 },
  },
  startDot: { left: 120, top: 500 },
  startPill: { left: 120, top: 380 },
  endDot: { left: 3260, top: 500 },
  endPill: { left: 3260, top: 380 },
  midDots: [
    { left: 700, top: 500 },
    { left: 1400, top: 500 },
  ],
  paths: [
    "M 120 500 L 250 500",
    "M 550 500 L 700 500",
    "M 700 500 C 800 500, 820 180, 910 180",
    "M 700 500 L 910 500",
    "M 700 500 C 800 500, 820 820, 910 820",
    "M 1210 180 C 1300 180, 1320 500, 1400 500",
    "M 1210 500 L 1400 500",
    "M 1210 820 C 1300 820, 1320 500, 1400 500",
    "M 1400 500 L 1550 500",
    "M 1850 500 L 2200 500",
    "M 2500 500 L 2800 500",
    "M 3100 500 L 3260 500",
  ],
};

const ROW_Y = 300;
const COMPACT: Layout = {
  width: 4720,
  height: 600,
  cards: {
    caddy: { left: 420, top: ROW_Y },
    answers: { left: 1040, top: ROW_Y },
    doctor: { left: 1660, top: ROW_Y },
    slot: { left: 2280, top: ROW_Y },
    booked: { left: 2900, top: ROW_Y },
    queue: { left: 3520, top: ROW_Y },
    arrive: { left: 4140, top: ROW_Y },
  },
  startDot: { left: 120, top: ROW_Y },
  startPill: { left: 160, top: 90 },
  endDot: { left: 4520, top: ROW_Y },
  endPill: { left: 4480, top: 90 },
  midDots: [],
  paths: [
    "M 120 300 L 4520 300",
  ],
};

const STEP_META: { id: string; card: CardId; label: string }[] = [
  { id: "step-caddy", card: "caddy", label: "Say hi to Caddy" },
  { id: "step-answers", card: "answers", label: "Get real answers" },
  { id: "step-doctor", card: "doctor", label: "Find your doctor" },
  { id: "step-slot", card: "slot", label: "Pick a time" },
  { id: "step-booked", card: "booked", label: "Booked in 30s" },
  { id: "step-queue", card: "queue", label: "Watch the queue" },
  { id: "step-arrive", card: "arrive", label: "Walk in on time" },
];

function Card({
  id,
  pos,
  accent,
  step,
  chip,
  icon,
  title,
  sub,
  image,
  imageAlt,
  children,
}: {
  id: string;
  pos: Pos;
  accent: string;
  step: string;
  chip: string;
  icon: ReactNode;
  title: string;
  sub: string;
  image?: string;
  imageAlt?: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className="clay-el clay-card gs-reveal" style={at(pos)}>
      <div className="clay-card-head" style={{ background: accent }}>
        {image && (
          <img
            src={image}
            alt={imageAlt ?? ""}
            width={640}
            height={512}
            decoding="async"
            className="clay-card-img"
          />
        )}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex gap-2">
            <span className="clay-badge">{step}</span>
            <span className="clay-badge">{chip}</span>
          </div>
          <div className="clay-badge-icon">{icon}</div>
        </div>
        <div className="relative z-10">
          <div className="clay-card-title">{title}</div>
          <div className="clay-card-sub">{sub}</div>
        </div>
      </div>
      <div className="clay-card-body">{children}</div>
    </div>
  );
}

function Line({ children }: { children: ReactNode }) {
  return <div className="clay-line">{children}</div>;
}

export function ClinicJourney() {
  const rootRef = useRef<HTMLDivElement>(null);
  /** Maps a canvas x position to a window scrollY. Null while flow scrolling is inactive. */
  const scrollForXRef = useRef<((x: number) => number) | null>(null);
  const [active, setActive] = useState(0);
  const [compact, setCompact] = useState(false);
  const [ready, setReady] = useState(false);

  const layout = compact ? COMPACT : WIDE;

  // Decide the layout before the GSAP effect builds its triggers.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const apply = () => setCompact(mq.matches);
    apply();
    setReady(true);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(STEP_META.length - 1, index));
      setActive(clamped);
      const step = STEP_META[clamped];
      if (!step) return;
      const mapper = scrollForXRef.current;
      if (mapper) {
        window.scrollTo({ top: mapper(layout.cards[step.card].left), behavior: "smooth" });
      } else {
        document.getElementById(step.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [layout],
  );

  useEffect(() => {
    if (!ready) return;
    let ctx: { revert: () => void } | undefined;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !rootRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Reduced motion: plain stacked reading order, no pinning.
      if (reduce) return;

      ctx = gsap.context(() => {
        const root = rootRef.current!;
        const canvas = root.querySelector<HTMLElement>(".clay-canvas")!;

        // Fit the canvas height into the viewport so narrow screens keep the node flow.
        const chrome = compact ? 190 : 60;
        const avail = Math.max(240, window.innerHeight - chrome);
        const scale = Math.min(1, avail / layout.height);
        gsap.set(canvas, { yPercent: -50, scale, transformOrigin: "left center", x: 0 });

        const scaledWidth = layout.width * scale;
        const scrollMax = Math.max(1, scaledWidth - window.innerWidth + (compact ? 40 : 160));

        const horizontal = gsap.to(canvas, {
          x: -scrollMax,
          ease: "none",
          scrollTrigger: {
            trigger: ".clay-viewport",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
            end: () => "+=" + scrollMax,
            onUpdate: (self) => {
              const x = (self.progress * scrollMax + window.innerWidth / 2) / scale;
              let nearest = 0;
              let best = Infinity;
              STEP_META.forEach((s, i) => {
                const d = Math.abs(layout.cards[s.card].left - x);
                if (d < best) {
                  best = d;
                  nearest = i;
                }
              });
              setActive((prev) => (prev === nearest ? prev : nearest));
            },
          },
        });

        const st = horizontal.scrollTrigger!;
        scrollForXRef.current = (x: number) => {
          const p = Math.max(0, Math.min(1, (x * scale - window.innerWidth / 2) / scrollMax));
          return st.start + p * (st.end - st.start);
        };

        gsap.fromTo(
          ".clay-progress",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".clay-viewport",
              start: "top top",
              end: () => "+=" + scrollMax,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        root.querySelectorAll<SVGPathElement>(".clay-path").forEach((path) => {
          const length = path.getTotalLength();
          gsap.fromTo(
            path,
            { strokeDasharray: length, strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: path,
                containerAnimation: horizontal,
                start: "left right-=120",
                end: "right center",
                scrub: true,
              },
            },
          );
        });

        root.querySelectorAll<HTMLElement>(".gs-reveal").forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 0.72, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "power3.out",
              force3D: true,
              scrollTrigger: {
                trigger: el,
                containerAnimation: horizontal,
                start: "left right-=100",
                toggleActions: "play none none reverse",
              },
            },
          );
        });
      }, rootRef);

      // Late layout shifts (fonts, images, sticky nav) are the usual cause of the
      // first-scroll jump — refresh once everything has settled.
      const refresh = () => ScrollTrigger.refresh();
      requestAnimationFrame(refresh);
      const t = window.setTimeout(refresh, 600);
      if (document.readyState !== "complete") window.addEventListener("load", refresh, { once: true });

      let raf = 0;
      const onResize = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(refresh);
      };
      window.addEventListener("resize", onResize);
      window.addEventListener("orientationchange", onResize);
      cleanup = () => {
        window.clearTimeout(t);
        cancelAnimationFrame(raf);
        window.removeEventListener("load", refresh);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
      scrollForXRef.current = null;
      ctx?.revert();
    };
  }, [ready, compact, layout]);

  return (
    <div className={"clay-scene" + (compact ? " is-compact" : "")} ref={rootRef}>
      <div className="clay-viewport">
        <div className="clay-progress" />
        <div className="clay-title-block">
          <p className="clay-eyebrow">The clinic flow</p>
          <h2 className="clay-heading">
            Chat with Caddy.
            <br />
            Book a doctor. Skip the wait.
          </h2>
          <p className="clay-subheading">Seven simple steps, start to seat.</p>
        </div>

        <nav className="clay-steps" aria-label="Journey steps">
          <button
            type="button"
            className="clay-step-arrow"
            onClick={() => goToStep(active - 1)}
            disabled={active === 0}
            aria-label="Previous step"
          >
            <ChevronLeft size={16} />
          </button>
          <ol className="clay-step-list">
            {STEP_META.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={"clay-step" + (i === active ? " is-active" : "")}
                  onClick={() => goToStep(i)}
                  aria-current={i === active ? "step" : undefined}
                >
                  <span className="clay-step-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="clay-step-label">{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="clay-step-arrow"
            onClick={() => goToStep(active + 1)}
            disabled={active === STEP_META.length - 1}
            aria-label="Next step"
          >
            <ChevronRight size={16} />
          </button>
        </nav>

        <div className="clay-canvas" style={{ width: layout.width, height: layout.height }}>
          <svg
            className="clay-lines"
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            preserveAspectRatio="none"
          >
            {layout.paths.map((d) => (
              <path key={d} className="clay-path" d={d} />
            ))}
          </svg>

          <div className="clay-el clay-dot gs-reveal" style={at(layout.startDot)} />
          <div className="clay-el clay-pill gs-reveal" style={at(layout.startPill)}>
            <UserRound size={16} /> You, on your phone
          </div>

          <Card
            id="step-caddy"
            pos={layout.cards.caddy}
            accent="var(--clay-caddy)"
            step="01"
            chip="24/7"
            icon={<MessageCircle size={18} />}
            title="Say hi to Caddy"
            sub="Type or talk, in plain words"
            image={journeyChat}
            imageAlt="Caddy assistant character chatting on a phone"
          >
            <Line>
              <Sparkles size={15} /> “My tooth hurts on the left”
            </Line>
            <Line>
              <Sparkles size={15} /> “Do you take my insurance?”
            </Line>
            <div className="clay-stats">
              <span>Replies in 2s</span>
              <span>Voice + chat</span>
            </div>
          </Card>

          {layout.midDots[0] && (
            <div className="clay-el clay-dot gs-reveal" style={at(layout.midDots[0])} />
          )}

          <Card
            id="step-answers"
            pos={layout.cards.answers}
            accent="var(--clay-care)"
            step="02"
            chip="Ask"
            icon={<Sparkles size={18} />}
            title="Get real answers"
            sub="Symptoms, prices, what to bring"
            image={journeyChat}
            imageAlt="Caddy answering questions in chat"
          >
            <Line>
              <MapPin size={15} /> Where to park, when to arrive
            </Line>
            <Line>
              <Sparkles size={15} /> Clear prices before you book
            </Line>
            <div className="clay-stats">
              <span>No phone queue</span>
              <span>No hold music</span>
            </div>
          </Card>

          <Card
            id="step-doctor"
            pos={layout.cards.doctor}
            accent="var(--clay-care)"
            step="03"
            chip="Match"
            icon={<Stethoscope size={18} />}
            title="Find your doctor"
            sub="Caddy picks the right specialist"
            image={journeyDoctor}
            imageAlt="A matched specialist doctor"
          >
            <Line>
              <Stethoscope size={15} /> Dr. Rao · Dental · 4.9★
            </Line>
            <Line>
              <Stethoscope size={15} /> Dr. Ellis · General · 4.8★
            </Line>
            <div className="clay-stats">
              <span>12 doctors</span>
              <span>Live availability</span>
            </div>
          </Card>

          <Card
            id="step-slot"
            pos={layout.cards.slot}
            accent="var(--clay-care)"
            step="04"
            chip="Time"
            icon={<Clock3 size={18} />}
            title="Pick a time"
            sub="Real open slots, not a callback"
            image={journeyBooked}
            imageAlt="Calendar with open appointment times"
          >
            <Line>
              <Clock3 size={15} /> Today 4:20 PM
            </Line>
            <Line>
              <Clock3 size={15} /> Tomorrow 9:00 AM
            </Line>
            <div className="clay-stats">
              <span>Updated live</span>
              <span>Free reschedule</span>
            </div>
          </Card>

          {layout.midDots[1] && (
            <div className="clay-el clay-dot gs-reveal" style={at(layout.midDots[1])} />
          )}

          <Card
            id="step-booked"
            pos={layout.cards.booked}
            accent="var(--clay-time)"
            step="05"
            chip="30 sec"
            icon={<CalendarCheck size={18} />}
            title="Booked. Done."
            sub="Confirmed before you close the chat"
            image={journeyBooked}
            imageAlt="Confirmed booking on a calendar"
          >
            <Line>
              <CalendarCheck size={15} /> Dr. Rao · Today · 4:20 PM
            </Line>
            <Line>
              <Bell size={15} /> Reminder + calendar invite sent
            </Line>
            <div className="clay-stats">
              <span>No forms</span>
              <span>No calls</span>
            </div>
          </Card>

          <Card
            id="step-queue"
            pos={layout.cards.queue}
            accent="var(--clay-queue)"
            step="06"
            chip="Live"
            icon={<Timer size={18} />}
            title="Watch the queue"
            sub="Your turn updates in real time"
            image={journeyQueue}
            imageAlt="Live queue countdown on a phone"
          >
            <div className="clay-queue-row">
              <span>#12 · In consultation</span>
              <span>now</span>
            </div>
            <div className="clay-queue-row">
              <span>#13 · Waiting</span>
              <span>~8 min</span>
            </div>
            <div className="clay-queue-row clay-you">
              <span>#14 · You</span>
              <span>~16 min</span>
            </div>
            <div className="clay-stats">
              <span>Leave home at 4:02</span>
              <span>Ping on delay</span>
            </div>
          </Card>

          <Card
            id="step-arrive"
            pos={layout.cards.arrive}
            accent="var(--clay-caddy)"
            step="07"
            chip="0 min wait"
            icon={<Bell size={18} />}
            title="Walk in on time"
            sub="Arrive, sit down, get called"
            image={journeyArrive}
            imageAlt="Patient walking into the clinic on time"
          >
            <Line>
              <Bell size={15} /> “Head over now — you’re next.”
            </Line>
            <Line>
              <Clock3 size={15} /> Average wait: 3 minutes
            </Line>
            <div className="clay-stats">
              <span>No crowded lobby</span>
              <span>Hours saved</span>
            </div>
          </Card>

          <div className="clay-el clay-dot gs-reveal" style={at(layout.endDot)} />
          <div className="clay-el clay-pill gs-reveal" style={at(layout.endPill)}>
            <Sparkles size={16} /> Hours saved, every visit
          </div>
        </div>

        <div className="clay-hint">↓ Keep scrolling to trace your visit ↓</div>
      </div>
    </div>
  );
}

export default ClinicJourney;
