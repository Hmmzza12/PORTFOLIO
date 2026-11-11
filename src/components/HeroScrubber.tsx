"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ChevronDown, Terminal } from "lucide-react";

const FRAME_COUNT = 173;
const framePath = (i: number) =>
  `/frames/frame_${String(i).padStart(4, "0")}.webp`;

// clamp helper + linear ramp (0..1) for p between a and b
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ramp = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

export default function HeroScrubber() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef({ i: 0 });

  // Staged copy blocks revealed across the scroll.
  const stage0Ref = useRef<HTMLDivElement>(null);
  const stage1Ref = useRef<HTMLDivElement>(null);
  const stage2Ref = useRef<HTMLDivElement>(null);

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
      if (count === 1) drawFrame(0);
      if (count === FRAME_COUNT) setReady(true);
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = onOne;
      img.onerror = onOne;
      img.src = framePath(i + 1);
      images[i] = img;
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Canvas cover-draw (DPR-aware). ---
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

    const scale = Math.max(cw / iw, ch / ih); // object-fit: cover
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

  // Drive the staged copy from scroll progress (0..1).
  const updateStages = (p: number) => {
    const s0 = stage0Ref.current;
    const s1 = stage1Ref.current;
    const s2 = stage2Ref.current;
    if (!s0 || !s1 || !s2) return;

    // Stage 0 — intro/title: visible at start, exits upward.
    const out0 = ramp(p, 0.2, 0.34);
    gsap.set(s0, { opacity: 1 - out0, y: -out0 * 44 });

    // Stage 1 — "who": fades in, holds, exits.
    const in1 = ramp(p, 0.36, 0.46);
    const out1 = ramp(p, 0.58, 0.7);
    gsap.set(s1, { opacity: in1 * (1 - out1), y: (1 - in1) * 40 - out1 * 44 });

    // Stage 2 — "what": fades in and holds to the end.
    const in2 = ramp(p, 0.72, 0.84);
    gsap.set(s2, { opacity: in2, y: (1 - in2) * 40 });
  };

  // --- GSAP ScrollTrigger: pin the hero, scrub frames + copy. ---
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Hide the later stages before the first scroll update.
    gsap.set([stage1Ref.current, stage2Ref.current], { opacity: 0 });

    const state = frameRef.current;
    const lastFrame = FRAME_COUNT - 1;

    const anim = gsap.to(state, {
      i: lastFrame,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=4600",
        scrub: 0.6,
        pin: sectionRef.current,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
      onUpdate: () => {
        drawFrame(Math.round(state.i));
        updateStages(state.i / lastFrame);
      },
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      anim.scrollTrigger?.kill();
      anim.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  const pct = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <section ref={sectionRef} className="relative h-screen">
      <div
        ref={pinRef}
        className="will-pin relative h-screen w-full overflow-hidden bg-base"
      >
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

        {/* Lightened legibility scrim — lets the video breathe, keeps copy readable */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-base/45 via-base/10 to-base/85" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(10,10,12,0.6)_100%)]" />

        {/* ================= STAGED SCROLL COPY ================= */}

        {/* Stage 0 — Title */}
        <div
          ref={stage0Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.28em] text-muted backdrop-blur">
              <Terminal className="h-3.5 w-3.5 text-accent" />
              Portfolio · v1.0
            </span>

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

            <p className="mt-6 font-mono text-sm tracking-[0.2em] text-muted">
              REACT · NODE.JS · TYPESCRIPT · SPRING BOOT
            </p>
          </motion.div>
        </div>

        {/* Stage 1 — Who */}
        <div
          ref={stage1Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <div className="relative max-w-3xl">
            <div className="absolute inset-0 -z-10 blur-3xl">
              <div className="mx-auto h-40 w-[70%] rounded-full bg-accent/15" />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              {"// whoami"}
            </span>
            <h2 className="mt-4 font-display text-[clamp(1.8rem,5.5vw,4rem)] font-bold leading-[1.02] text-ink text-balance">
              Hi, I&apos;m Hamza Touaban.
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-body text-lg text-ink/80 text-balance">
              Software engineer building web applications with React,
              Node.js, TypeScript, Java/Spring Boot and SQL databases.
            </p>
          </div>
        </div>

        {/* Stage 2 — What */}
        <div
          ref={stage2Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <div className="relative max-w-3xl">
            <div className="absolute inset-0 -z-10 blur-3xl">
              <div className="mx-auto h-40 w-[70%] rounded-full bg-accent/15" />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              {"// what I do"}
            </span>
            <h2 className="mt-4 font-display text-[clamp(1.8rem,5.5vw,4rem)] font-bold leading-[1.02] text-ink text-balance">
              Full-stack architecture, end to end
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-body text-lg text-ink/80 text-balance">
              From JWT-authenticated REST APIs to fluid React
              frontends — I build robust systems from database schema
              to final pixel.
            </p>
          </div>
        </div>

        {/* Explore Work scroll CTA (persistent) */}
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
          className="group absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted transition-colors hover:text-ink"
        >
          Explore Work
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] transition-all group-hover:border-accent group-hover:shadow-glow">
            <ChevronDown className="h-4 w-4 animate-float text-accent" />
          </span>
        </motion.button>

        {/* Frame preloader indicator */}
        {!ready && (
          <div className="absolute bottom-8 right-8 font-mono text-[11px] tracking-widest text-muted">
            <span className="text-accent">◈</span> BUFFERING FRAMES {pct}%
          </div>
        )}
      </div>
    </section>
  );
}
