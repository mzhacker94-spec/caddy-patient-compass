import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { HeroCaddy } from "@/components/caddy/HeroCaddy";
import { SiteNav } from "@/components/caddy/SiteNav";
import { SpecialtyFinder } from "@/components/caddy/SpecialtyFinder";
import { PatientReviews } from "@/components/caddy/PatientReviews";
import { DoctorCarousel } from "@/components/caddy/DoctorCarousel";
import { QueueTeaser } from "@/components/caddy/QueueTeaser";
import { SiteFooter } from "@/components/caddy/SiteFooter";
import { CallDoctorAnimation } from "@/components/caddy/CallDoctorAnimation";
import { ClinicJourney } from "@/components/caddy/ClinicJourney";
import { QueueToast } from "@/components/caddy/QueueToast";


import { Link } from "@tanstack/react-router";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Caddy Care — Book Doctors & Dentists in Seconds" },
      {
        name: "description",
        content:
          "Caddy Care is a premium appointment booking app for doctors and dentists — live queue tracking, verified specialists and instant slots, guided by your Caddy companion.",
      },
      { property: "og:title", content: "Caddy Care — Book Doctors & Dentists in Seconds" },
      {
        property: "og:description",
        content:
          "Meet Caddy, your animated care companion. Book verified doctors, track your live queue and never wait in a lobby again.",
      },
    ],
  }),
  component: Home,
});

const spring = { type: "spring" as const, stiffness: 180, damping: 20, mass: 0.9 };

function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div aria-hidden className="clinic-grain pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-4 sm:px-8">
        <SiteNav />

        {/* HERO */}
        <section className="grid items-center gap-10 pt-12 lg:grid-cols-[1.1fr_1fr]">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            className="order-2 space-y-6 lg:order-1"
          >
            <motion.p
              variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}
              transition={spring}
              className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground"
            >
              Your care companion
            </motion.p>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 34, scale: 0.96 },
                show: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ type: "spring", stiffness: 150, damping: 16 }}
              className="max-w-2xl font-display text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.2rem]"
            >
              Book the right doctor
              <br className="hidden sm:block" />{" "}
              <span className="foil-text foil-animate">in a single tap</span>
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}
              transition={spring}
              className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Caddy finds the right specialist, holds your slot and watches the queue for you — so you
              show up exactly when it&apos;s your turn.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
              transition={spring}
              className="flex flex-wrap items-center gap-3"
            >
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ y: 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
              >
                <Link
                  to="/signup"
                  className="btn-3d block rounded-full bg-primary px-7 py-3.5 text-sm font-extrabold text-primary-foreground"
                >
                  Book an appointment
                </Link>
              </motion.div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 20 }}
                className="glass-card rounded-full px-6 py-3.5 text-sm font-extrabold"
              >
                Browse specialities
              </motion.button>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              transition={spring}
              className="flex flex-wrap gap-8 pt-2 text-sm"
            >
              {[
                ["1,200+", "verified doctors"],
                ["4 min", "avg. booking"],
                ["24/7", "queue tracking"],
              ].map(([big, small]) => (
                <div key={big}>
                  <p className="font-display text-2xl font-extrabold">{big}</p>
                  <p className="text-xs text-muted-foreground">{small}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="order-1 lg:order-2">
            <HeroCaddy />
          </div>
        </section>


        {/* HOW CADDY WORKS — claymorphism journey */}
        <ClinicJourney />


        {/* LIVE QUEUE TOAST PREVIEW */}
        <div className="pt-10">
          <QueueToast demo position={4} doctorName="Dr. Ahmed" nowServing={1} />
        </div>

        {/* SPECIALIZATIONS */}
        <section className="pt-20">
          <SpecialtyFinder />
        </section>


        {/* LIVE QUEUE */}
        <div className="pt-14">
          <QueueTeaser />
        </div>

        {/* DOCTORS */}
        <div className="pt-14">
          <DoctorCarousel />
        </div>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 150, damping: 18 }}
          className="glass-card mt-16 grid items-center gap-8 overflow-hidden rounded-4xl p-8 lg:grid-cols-[1fr_0.9fr]"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold">Caddy is listening</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground lg:mx-0">
              Say the symptom, Caddy rings the right specialist and holds the line — voice booking
              arrives with your first visit.
            </p>
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ y: 4 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="btn-3d mt-6 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground"
            >
              Talk to Caddy
            </motion.button>
          </div>
          <CallDoctorAnimation className="mx-auto" />
        </motion.section>

        {/* PATIENT REVIEWS */}
        <PatientReviews />

      </div>

      <SiteFooter />
    </main>
  );
}
