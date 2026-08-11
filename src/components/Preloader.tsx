"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BOOT_LINES = [
  "INITIALIZING CORE_SYSTEM",
  "CONNECTING SPRING BOOT BACKEND",
  "MOUNTING REACT VIRTUAL DOM",
  "SYSTEM READY [100%]",
] as const;

// Progress thresholds at which each line becomes visible.
const LINE_AT = [0, 26, 54, 100];

// Accent flips from neon red to neon green the moment we hit 100%.
const RED = "#FF1E42";
const GREEN = "#22F58E";

type Props = {
  /** Called once the preloader has finished so the shell can enable scroll. */
  onComplete?: () => void;
};

export default function Preloader({ onComplete }: Props) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [linesShown, setLinesShown] = useState(1);
  const [complete, setComplete] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete?.();
  };

  useEffect(() => {
    // Always play the full splash on every load / reload — no session skip.

    // Lock scroll while the preloader is on screen.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const duration = reduceMotion ? 500 : 2300; // ms
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      const shown = LINE_AT.filter((t) => pct >= t).length;
      setLinesShown(Math.max(1, shown));

      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setComplete(true); // red -> green
        finish();
        // Hold the green "SYSTEM READY" state briefly, then raise the curtain.
        window.setTimeout(() => setVisible(false), reduceMotion ? 220 : 800);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore scroll when the overlay unmounts.
  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
    }
  }, [visible]);

  const accent = complete ? GREEN : RED;
  const accentGlow = complete
    ? "0 0 18px rgba(34,245,142,0.6), 0 0 40px rgba(34,245,142,0.28)"
    : "0 0 18px rgba(255,30,66,0.55), 0 0 40px rgba(255,30,66,0.25)";
  const colorTransition = "color .45s ease, text-shadow .45s ease";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-base"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* faint grid + scanline ambience */}
          <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-60" />
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="animate-scan-down absolute inset-x-0 h-40 bg-gradient-to-b from-transparent to-transparent"
              style={{
                // subtle moving light in the current accent hue
                backgroundImage: `linear-gradient(to bottom, transparent, ${accent}14, transparent)`,
                transition: "background-image .45s ease",
              }}
            />
          </div>

          <div className="relative w-[min(560px,90vw)]">
            {/* Terminal window */}
            <div
              className="glass-strong overflow-hidden rounded-xl"
              style={{
                boxShadow: complete
                  ? "0 0 45px rgba(34,245,142,0.28)"
                  : "0 0 45px rgba(255,30,66,0.25)",
                transition: "box-shadow .5s ease",
              }}
            >
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: accent,
                    opacity: 0.85,
                    transition: "background-color .45s ease",
                  }}
                />
                <span className="h-3 w-3 rounded-full bg-muted/50" />
                <span className="h-3 w-3 rounded-full bg-muted/30" />
                <span className="ml-3 font-mono text-xs tracking-widest text-muted">
                  core_system.sh
                </span>
              </div>

              <div className="min-h-[168px] px-5 py-5 font-mono text-sm leading-7">
                {BOOT_LINES.slice(0, linesShown).map((line, i) => {
                  const isLast = i === linesShown - 1;
                  const isReady = line.includes("READY");
                  return (
                    <motion.div
                      key={line}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      style={
                        isReady
                          ? { color: accent, textShadow: accentGlow, transition: colorTransition }
                          : undefined
                      }
                      className={isReady ? "" : "text-ink/90"}
                    >
                      <span
                        className="mr-2"
                        style={{ color: accent, transition: colorTransition }}
                      >
                        {">"}
                      </span>
                      {line}
                      {isLast && !isReady && (
                        <span
                          className="animate-caret-blink ml-1"
                          style={{ color: accent }}
                        >
                          _
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-5 flex items-center gap-4">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: accent,
                    boxShadow: complete
                      ? "0 0 20px rgba(34,245,142,0.5)"
                      : "0 0 20px rgba(255,30,66,0.35)",
                    transition: "background-color .45s ease, box-shadow .45s ease",
                  }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <span
                className="w-14 text-right font-mono text-xs tabular-nums"
                style={{
                  color: complete ? GREEN : "#8A8A93",
                  transition: colorTransition,
                }}
              >
                {progress.toString().padStart(3, "0")}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
