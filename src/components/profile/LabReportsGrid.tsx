import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, FileText, FlaskConical, Upload, X, ZoomIn, ZoomOut } from "lucide-react";
import type { LabReport } from "@/lib/profile-data";

const FLAG_COLOR = { normal: "var(--care)", high: "var(--destructive)", low: "var(--ember)" };

function ReportPreview({ report, onClose }: { report: LabReport; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);

  return (
    <motion.div
      className="fixed inset-0 z-[60] grid place-items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-charcoal/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${report.test} preview`}
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="glass-pane relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-4xl p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Lab report preview
            </p>
            <h3 className="mt-1 truncate text-2xl font-extrabold">{report.test}</h3>
            <p className="text-sm font-semibold text-muted-foreground">
              {report.lab} · {report.date}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.2).toFixed(2)))}
              className="grid size-9 place-items-center rounded-full bg-secondary"
            >
              <ZoomOut className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => setZoom((z) => Math.min(2.2, +(z + 0.2).toFixed(2)))}
              className="grid size-9 place-items-center rounded-full bg-secondary"
            >
              <ZoomIn className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Close preview"
              onClick={onClose}
              className="grid size-9 place-items-center rounded-full bg-secondary"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* pinch/scroll-zoomable document sheet */}
        <div className="mt-5 overflow-auto rounded-3xl bg-card/70 p-1 [touch-action:pinch-zoom]">
          <motion.div
            className="origin-top-left rounded-3xl p-5"
            animate={{ scale: zoom }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            style={{ width: `${100 / zoom}%` }}
          >
            <p className="font-display text-lg font-extrabold">{report.test}</p>
            <p className="mt-1 text-sm text-muted-foreground">{report.summary}</p>
            {report.values.length > 0 ? (
              <table className="mt-4 w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-2 font-bold">Marker</th>
                    <th className="pb-2 font-bold">Value</th>
                    <th className="pb-2 font-bold">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {report.values.map((v) => (
                    <tr key={v.name} className="border-t border-border">
                      <td className="py-2 font-semibold">{v.name}</td>
                      <td className="py-2 font-extrabold" style={{ color: FLAG_COLOR[v.flag] }}>
                        {v.value}
                      </td>
                      <td className="py-2 text-muted-foreground">{v.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                Imaging report — full film available on request at the clinic front desk.
              </p>
            )}
          </motion.div>
        </div>
        <p className="mt-3 text-xs font-semibold text-muted-foreground">
          Pinch to zoom on touch, or use the zoom controls.
        </p>
      </motion.div>
    </motion.div>
  );
}

export function LabReportsGrid({ labs }: { labs: LabReport[] }) {
  const calm = useReducedMotion() ?? false;
  const [open, setOpen] = useState<LabReport | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function accept(name: string) {
    setUploaded(name);
    setDragging(false);
    setTimeout(() => setUploaded(null), 3200);
  }

  return (
    <section className="mt-12">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <motion.span
            className="grid size-9 shrink-0 place-items-center rounded-2xl text-primary-foreground"
            style={{ background: "var(--gradient-care)" }}
            animate={calm ? {} : { rotate: [-6, 6, -6] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <FlaskConical aria-hidden className="size-4" />
          </motion.span>
          <h2 className="truncate text-xl font-extrabold">Lab reports</h2>
        </div>
        <motion.button
          type="button"
          onClick={() => inputRef.current?.click()}
          whileHover={{ y: -2, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 420, damping: 18 }}
          className="glass-pane inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold"
        >
          <Upload className="size-4 text-primary" />
          Upload report
        </motion.button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) accept(f.name);
        }}
      />

      {/* drag & drop zone */}
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          accept(e.dataTransfer.files?.[0]?.name ?? "report.pdf");
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        animate={{
          boxShadow: dragging ? "var(--shadow-glow)" : "var(--shadow-card)",
          scale: dragging ? 1.01 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="glass-card relative mt-5 grid place-items-center rounded-4xl border-2 border-dashed p-7 text-center"
        style={{
          borderColor: dragging
            ? "color-mix(in oklab, var(--care) 70%, transparent)"
            : "color-mix(in oklab, var(--charcoal) 14%, transparent)",
        }}
      >
        <AnimatePresence mode="wait">
          {uploaded ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: "spring", stiffness: 460, damping: 14 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.span
                className="grid size-12 place-items-center rounded-full text-primary-foreground"
                style={{ background: "var(--gradient-care)", boxShadow: "var(--shadow-glow)" }}
                initial={{ scale: 0.4, rotate: -20 }}
                animate={{ scale: [0.4, 1.25, 1], rotate: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 12 }}
              >
                <Check className="size-6" />
              </motion.span>
              <p className="text-sm font-extrabold">Uploaded · {uploaded}</p>
              <p className="text-xs text-muted-foreground">
                Caddy is reading it now and will file it under Lab reports.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.span
                className="grid size-12 place-items-center rounded-2xl text-primary-foreground"
                style={{ background: "var(--gradient-foil)" }}
                animate={calm || !dragging ? {} : { y: [0, -6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <Upload className="size-5" />
              </motion.span>
              <p className="text-sm font-extrabold">
                {dragging ? "Drop it — Caddy has got this" : "Drag & drop a report here"}
              </p>
              <p className="text-xs text-muted-foreground">PDF, JPG or PNG up to 20MB</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {labs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 170, damping: 18 }}
          className="glass-card mt-5 rounded-4xl p-8 text-center"
        >
          <motion.span
            className="mx-auto grid size-14 place-items-center rounded-3xl text-primary-foreground"
            style={{ background: "var(--gradient-care)" }}
            animate={calm ? {} : { y: [0, -6, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <FlaskConical aria-hidden className="size-6" />
          </motion.span>
          <h3 className="mt-4 text-lg font-extrabold">No lab reports yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Upload an older report from another clinic and Caddy will keep it beside every future
            result, so your doctors always see the full picture.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {labs.map((report, i) => {
            const ready = report.status === "Ready";
            return (
              <motion.button
                key={report.id}
                type="button"
                disabled={!ready}
                onClick={() => ready && setOpen(report)}
                variants={{
                  hidden: { opacity: 0, y: 28, scale: 0.94 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                whileHover={ready ? { y: -5 } : {}}
                className="stack-card relative overflow-hidden rounded-3xl p-5 text-left disabled:cursor-default"
              >
                {!ready ? (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 w-1/2 skew-x-[-18deg]"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, color-mix(in oklab, white 60%, transparent), transparent)",
                    }}
                    animate={calm ? { opacity: 0 } : { x: ["-120%", "260%"] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  />
                ) : null}

                <div className="relative flex items-start gap-3">
                  <motion.span
                    className="grid size-12 shrink-0 place-items-center rounded-2xl text-primary-foreground"
                    style={{
                      background: ready ? "var(--gradient-care)" : "var(--gradient-foil)",
                      boxShadow: ready
                        ? "0 0 26px -8px color-mix(in oklab, var(--care) 90%, transparent)"
                        : "none",
                      transform: `rotate(${i % 2 === 0 ? -8 : 7}deg)`,
                    }}
                    whileHover={{ rotate: 0, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 320, damping: 16 }}
                  >
                    <FileText aria-hidden className="size-5" />
                  </motion.span>
                  <div className="min-w-0">
                    <p className="truncate font-extrabold">{report.test}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {report.date}
                    </p>
                    <span
                      className="mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-extrabold"
                      style={{
                        background: `color-mix(in oklab, ${ready ? "var(--care)" : "var(--gold)"} 20%, transparent)`,
                        color: `color-mix(in oklab, ${ready ? "var(--care)" : "var(--ember)"} 80%, var(--charcoal))`,
                        boxShadow: ready
                          ? "0 0 20px -6px color-mix(in oklab, var(--care) 85%, transparent)"
                          : "none",
                      }}
                    >
                      {report.status}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      )}

      <AnimatePresence>
        {open ? <ReportPreview report={open} onClose={() => setOpen(null)} /> : null}
      </AnimatePresence>
    </section>
  );
}
