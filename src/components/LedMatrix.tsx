"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const SKILLS = [
  { name: "Spring Boot", detail: "Microservices · Security" },
  { name: "React", detail: "Hooks · Canvas · GSAP" },
  { name: "TypeScript", detail: "Strict · End-to-end types" },
  { name: "JWT Auth", detail: "OAuth2 · RBAC · Rotation" },
];

const ACCENT = { r: 255, g: 30, b: 66 };

export default function LedMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GAP = 26;
    const DOT = 1.6;
    const RADIUS = 130; // cursor influence radius
    let dpr = 1;
    let cols = 0;
    let rows = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / GAP);
      rows = Math.ceil(h / GAP);
    };

    const render = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const mx = mouse.current.x;
      const my = mouse.current.y;

      for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
          const px = x * GAP;
          const py = y * GAP;
          const dx = px - mx;
          const dy = py - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < RADIUS) {
            const t = 1 - dist / RADIUS; // 0..1 proximity
            const size = DOT + t * 3.2;
            const alpha = 0.12 + t * 0.88;
            ctx.beginPath();
            ctx.fillStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${alpha})`;
            ctx.shadowColor = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${t})`;
            ctx.shadowBlur = t * 14;
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.fillStyle = "rgba(255,255,255,0.06)";
            ctx.shadowBlur = 0;
            ctx.arc(px, py, DOT, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      rafRef.current = requestAnimationFrame(render);
    };

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };

    resize();
    render();
    window.addEventListener("resize", resize);
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      id="skills"
      ref={wrapRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base py-28"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            {"// Core Stack"}
          </span>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,5vw,3.4rem)] font-bold text-ink">
            Engineered Across the Stack
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Move your cursor across the matrix — every node responds, the way a
            well-instrumented system should.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent shadow-glow" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold text-ink transition-colors group-hover:text-accent">
                {skill.name}
              </h3>
              <p className="mt-1.5 font-mono text-xs text-muted">
                {skill.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
