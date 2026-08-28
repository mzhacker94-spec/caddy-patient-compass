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

/** Anchor x positions (canvas space) used by the clickable step prompts. */
const STEPS = [
  { id: "step-caddy", label: "Say hi to Caddy", x: 400 },
  { id: "step-answers", label: "Get real answers", x: 1060 },
  { id: "step-doctor", label: "Find your doctor", x: 1060 },
  { id: "step-slot", label: "Pick a slot", x: 1060 },
  { id: "step-booked", label: "Booked. Done.", x: 1700 },
  { id: "step-queue", label: "Watch the queue", x: 2350 },
  { id: "step-arrive", label: "Walk in on time", x: 2950 },
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
            loading="lazy"
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

  const goToStep = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(STEPS.length - 1, index));
    setActive(clamped);
    const step = STEPS[clamped];
    if (!step) return;
    const mapper = scrollForXRef.current;
    if (mapper) {
      window.scrollTo({ top: mapper(step.x), behavior: "smooth" });
    } else {
      document.getElementById(step.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cleanupResize: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const stacked = reduce || window.matchMedia("(max-width: 900px)").matches;

      // Stacked layout (mobile / reduced motion): no pinning, no horizontal scrub.
      if (stacked) {
        if (reduce) return;
        ctx = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>(".gs-reveal").forEach((el) => {
            gsap.from(el, {
              y: 24,
              opacity: 0,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          });
        }, rootRef);
        return;
      }

      ctx = gsap.context(() => {
        const canvas = rootRef.current!.querySelector<HTMLElement>(".clay-canvas")!;
        const scrollMax = canvas.scrollWidth - window.innerWidth + 160;

        const horizontal = gsap.to(canvas, {
          x: -scrollMax,
          ease: "none",
          scrollTrigger: {
            trigger: ".clay-viewport",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            end: () => "+=" + scrollMax,
            onUpdate: (self) => {
              const x = self.progress * scrollMax + window.innerWidth / 2;
              let nearest = 0;
              let best = Infinity;
              STEPS.forEach((s, i) => {
                const d = Math.abs(s.x - x);
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
          const p = Math.max(0, Math.min(1, (x - window.innerWidth / 2) / scrollMax));
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

        gsap.to(".clay-hint", {
          opacity: 0,
          y: 24,
          scrollTrigger: { trigger: "body", start: "top -40", end: "top -120", scrub: true },
        });

        rootRef.current!.querySelectorAll<SVGPathElement>(".clay-path").forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: path,
              containerAnimation: horizontal,
              start: "left right-=180",
              end: "right center",
              scrub: true,
            },
          });
        });

        rootRef.current!.querySelectorAll<HTMLElement>(".gs-reveal").forEach((el) => {
          gsap.from(el, {
            scale: 0.6,
            opacity: 0,
            rotation: el.classList.contains("clay-pill") ? -6 : 0,
            duration: 0.6,
            ease: "back.out(1.2)",
            force3D: true,
            scrollTrigger: {
              trigger: el,
              containerAnimation: horizontal,
              start: "left right-=140",
              toggleActions: "play none none reverse",
            },
          });
        });
      }, rootRef);

      // Re-evaluate the whole setup when the layout mode could change.
      let raf = 0;
      const onResize = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      window.addEventListener("resize", onResize);
      window.addEventListener("orientationchange", onResize);
      cleanupResize = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);
      };
    })();

    return () => {
      cancelled = true;
      cleanupResize?.();
      scrollForXRef.current = null;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="clay-scene" ref={rootRef}>
      <div className="clay-viewport">
        <div className="clay-progress" />
        <div className="clay-title-block">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[var(--clay-muted)]">
            The clinic flow
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight text-[var(--clay-ink)]">
            Talk to Caddy. Book your doctor. Skip the waiting room.
          </h2>
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
            {STEPS.map((s, i) => (
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
            disabled={active === STEPS.length - 1}
            aria-label="Next step"
          >
            <ChevronRight size={16} />
          </button>
        </nav>

        <div className="clay-canvas">
          <svg className="clay-lines" viewBox="0 0 3400 1000" preserveAspectRatio="none">
            <path className="clay-path" d="M 120 500 L 250 500" />
            <path className="clay-path" d="M 550 500 L 700 500" />
            <path className="clay-path" d="M 700 500 C 800 500, 820 180, 910 180" />
            <path className="clay-path" d="M 700 500 L 910 500" />
            <path className="clay-path" d="M 700 500 C 800 500, 820 820, 910 820" />
            <path className="clay-path" d="M 1210 180 C 1300 180, 1320 500, 1400 500" />
            <path className="clay-path" d="M 1210 500 L 1400 500" />
            <path className="clay-path" d="M 1210 820 C 1300 820, 1320 500, 1400 500" />
            <path className="clay-path" d="M 1400 500 L 1550 500" />
            <path className="clay-path" d="M 1850 500 L 2200 500" />
            <path className="clay-path" d="M 2500 500 L 2800 500" />
            <path className="clay-path" d="M 3100 500 L 3260 500" />
          </svg>

          <div className="clay-el clay-dot gs-reveal" style={at({ left: 120, top: 500 })} />
          <div className="clay-el clay-pill gs-reveal" style={at({ left: 120, top: 400 })}>
            <UserRound size={16} /> You, on your phone
          </div>

          <Card
            id="step-caddy"
            pos={{ left: 400, top: 500 }}
            accent="var(--clay-caddy)"
            step="01"
            chip="24/7"
            icon={<MessageCircle size={18} />}
            title="Say hi to Caddy"
            sub="Type or talk — plain language, any hour"
            image={journeyChat}
            imageAlt="Caddy assistant character chatting on a phone"
          >
            <Line>
              <Sparkles size={15} /> “My tooth hurts on the left side”
            </Line>
            <Line>
              <Sparkles size={15} /> “Do you take my insurance?”
            </Line>
            <div className="clay-stats">
              <span>REPLIES IN 2s</span>
              <span>VOICE + CHAT</span>
            </div>
          </Card>

          <div className="clay-el clay-dot gs-reveal" style={at({ left: 700, top: 500 })} />

          <Card
            id="step-answers"
            pos={{ left: 1060, top: 180 }}
            accent="var(--clay-care)"
            step="02"
            chip="ASK"
            icon={<Sparkles size={18} />}
            title="Get real answers"
            sub="Symptoms, prices, prep, directions"
            image={journeyChat}
            imageAlt="Caddy answering questions in chat"
          >
            <Line>
              <MapPin size={15} /> What to bring, where to park
            </Line>
            <div className="clay-stats">
              <span>NO PHONE QUEUE</span>
              <span>NO HOLD MUSIC</span>
            </div>
          </Card>

          <Card
            id="step-doctor"
            pos={{ left: 1060, top: 500 }}
            accent="var(--clay-care)"
            step="02"
            chip="MATCH"
            icon={<Stethoscope size={18} />}
            title="Find your doctor"
            sub="Caddy matches the right specialist"
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
              <span>12 DOCTORS</span>
              <span>LIVE AVAILABILITY</span>
            </div>
          </Card>

          <Card
            id="step-slot"
            pos={{ left: 1060, top: 820 }}
            accent="var(--clay-care)"
            step="02"
            chip="TIME"
            icon={<Clock3 size={18} />}
            title="Pick a slot that fits"
            sub="Real open times, not a callback promise"
            image={journeyBooked}
            imageAlt="Calendar with open appointment times"
          >
            <Line>
              <Clock3 size={15} /> Today 4:20 PM · Tomorrow 9:00 AM
            </Line>
            <div className="clay-stats">
              <span>REAL-TIME</span>
              <span>FREE RESCHEDULE</span>
            </div>
          </Card>

          <div className="clay-el clay-dot gs-reveal" style={at({ left: 1400, top: 500 })} />

          <Card
            id="step-booked"
            pos={{ left: 1700, top: 500 }}
            accent="var(--clay-time)"
            step="03"
            chip="30 SEC"
            icon={<CalendarCheck size={18} />}
            title="Booked. Done."
            sub="Confirmation before you close the chat"
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
              <span>NO FORMS</span>
              <span>NO CALLS</span>
            </div>
          </Card>

          <Card
            id="step-queue"
            pos={{ left: 2350, top: 500 }}
            accent="var(--clay-queue)"
            step="04"
            chip="LIVE"
            icon={<Timer size={18} />}
            title="Watch the queue move"
            sub="Your place updates in real time"
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
              <span>#14 · YOU</span>
              <span>~16 min</span>
            </div>
            <div className="clay-stats">
              <span>LEAVE HOME AT 4:02</span>
              <span>PING ON DELAY</span>
            </div>
          </Card>

          <Card
            id="step-arrive"
            pos={{ left: 2950, top: 500 }}
            accent="var(--clay-caddy)"
            step="05"
            chip="0 MIN WAIT"
            icon={<Bell size={18} />}
            title="Walk in on time"
            sub="Arrive, sit down, get called"
            image={journeyArrive}
            imageAlt="Patient walking into the clinic on time"
          >
            <Line>
              <Bell size={15} /> “Head over now — you’re next.”
            </Line>
            <div className="clay-stats">
              <span>AVG WAIT 3 MIN</span>
              <span>NO CROWDED LOBBY</span>
            </div>
          </Card>

          <div className="clay-el clay-dot gs-reveal" style={at({ left: 3260, top: 500 })} />
          <div className="clay-el clay-pill gs-reveal" style={at({ left: 3260, top: 400 })}>
            <Sparkles size={16} /> Hours saved, every visit
          </div>
        </div>

        <div className="clay-hint">↓ Scroll or tap a step to trace your visit ↓</div>
      </div>
    </div>
  );
}

export default ClinicJourney;
