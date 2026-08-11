"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ChevronDown, Terminal } from "lucide-react";

const FRAME_COUNT = 240;
const framePath = (i: number) =>
  `/frames/frame_${String(i).padStart(4, "0")}.webp`;

export default function HeroScrubber() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef({ i: 0 });
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  // --- Preload every frame into memory for a locked 60 FPS scrub. ---
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    let count = 0;

    const onOne = () => {
      if (cancelled) return;
      count += 1;
      setLoaded(count);
      // Draw the first frame as soon as it is available.
      if (count === 1) drawFrame(0);
      if (count === FRAME_COUNT) setReady(true);
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = onOne;
      img.onerror = onOne; // don't stall the loader on a missing frame
      img.src = framePath(i + 1);
      images[i] = img;
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Canvas sizing (DPR-aware) + cover draw. ---
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // object-fit: cover
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    drawFrame(frameRef.current.i);
  };

  // --- GSAP ScrollTrigger: pin the hero and scrub the frame index. ---
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const state = frameRef.current;

    const anim = gsap.to(state, {
      i: FRAME_COUNT - 1,
      ease: "none",
      snap: "i",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=3200",
        scrub: 0.6,
        pin: pinRef.current,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
      onUpdate: () => drawFrame(Math.round(state.i)),
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      anim.scrollTrigger?.kill();
      anim.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once all frames are in, recalculate trigger positions.
  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  const pct = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <section ref={sectionRef} className="relative h-screen">
      {/* Pinned viewport */}
      <div
        ref={pinRef}
        className="will-pin relative h-screen w-full overflow-hidden bg-base"
      >
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

        {/* Cinematic vignette + gradient legibility scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-base/70 via-transparent to-base" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(10,10,12,0.75)_100%)]" />

        {/* Hero typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.28em] text-muted backdrop-blur">
              <Terminal className="h-3.5 w-3.5 text-accent" />
              Portfolio · v1.0
            </span>

            {/* Glow backdrop behind the title */}
            <div className="relative">
              <div className="absolute inset-0 -z-10 blur-3xl">
                <div className="mx-auto h-40 w-[80%] rounded-full bg-accent/25" />
              </div>
              <h1 className="font-display text-[clamp(2.2rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight text-ink text-balance">
                FULL-STACK
                <br />
                <span className="neon-text text-accent">SOFTWARE ENGINEER</span>
              </h1>
            </div>

            <p className="mt-6 max-w-xl font-body text-base text-muted sm:text-lg text-balance">
              Architecting resilient backends and cinematic interfaces —
              Spring&nbsp;Boot, React &amp; TypeScript, engineered end to end.
            </p>
          </motion.div>
        </div>

        {/* Explore Work scroll CTA */}
        <motion.button
          type="button"
          onClick={() =>
            document
              .getElementById("skills")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted transition-colors hover:text-ink"
        >
          Explore Work
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] transition-all group-hover:border-accent group-hover:shadow-glow">
            <ChevronDown className="h-4 w-4 animate-float text-accent" />
          </span>
        </motion.button>

        {/* Frame preloader indicator (fades once ready) */}
        {!ready && (
          <div className="absolute bottom-8 right-8 font-mono text-[11px] tracking-widest text-muted">
            <span className="text-accent">◈</span> BUFFERING FRAMES {pct}%
          </div>
        )}
      </div>
    </section>
  );
}
