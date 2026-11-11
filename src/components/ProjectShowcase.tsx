"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import {
  Layers,
  ArrowLeftRight,
  X,
  Lock,
  Cpu,
  ArrowRight,
  Github,
  ExternalLink,
} from "lucide-react";
import { projects, type Project } from "@/data/projects";

const methodColor: Record<string, string> = {
  GET: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  POST: "text-sky-400 border-sky-400/30 bg-sky-400/10",
  PUT: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  DELETE: "text-accent border-accent/30 bg-accent/10",
};

export default function ProjectShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    // Horizontal pin only on wider viewports; stack vertically on small screens.
    mm.add("(min-width: 768px)", () => {
      const getScrollAmount = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden bg-base"
    >
      {/* Heading rail */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 px-6 pt-10 md:px-12">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              {"// Selected Work"}
            </span>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,3rem)] font-bold text-ink">
              Project Architecture
            </h2>
          </div>
          <span className="hidden items-center gap-2 font-mono text-xs text-muted md:flex">
            <ArrowLeftRight className="h-4 w-4 text-accent" />
            scroll to traverse
          </span>
        </div>
      </div>

      {/* Horizontal track (transforms with scroll on md+) */}
      <div
        ref={trackRef}
        className="flex flex-col gap-8 px-6 py-24 md:h-screen md:flex-row md:flex-nowrap md:items-center md:gap-10 md:px-12 md:py-0 md:pt-40 will-pin"
      >
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}

        {/* Closing panel */}
        <div className="flex w-full shrink-0 flex-col justify-center md:w-[40vw]">
          <p className="font-display text-2xl font-semibold text-ink md:text-3xl">
            More on the way.
          </p>
          <p className="mt-3 max-w-sm text-muted">
            Every project is a study in trade-offs — latency, security,
            developer experience. Reach out to talk architecture.
          </p>
          <a
            href="#contact"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 px-5 py-2.5 font-mono text-sm text-accent transition-all hover:bg-accent/10 hover:shadow-glow"
          >
            Get in touch <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <article
      className="group relative flex w-full shrink-0 flex-col overflow-hidden rounded-2xl md:h-[68vh] md:w-[62vw] lg:w-[46vw]"
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glass card face */}
      <div className="glass-strong relative flex h-full flex-col rounded-2xl p-7 shadow-2xl transition-transform duration-500 md:p-9">
        {/* accent corner glow */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl"
          style={{ background: project.accent }}
        />

        <div className="flex items-start justify-between">
          <span
            className="font-mono text-5xl font-bold leading-none opacity-20"
            style={{ color: project.accent }}
          >
            {project.index}
          </span>
          <div className="text-right font-mono text-xs text-muted">
            <div>{project.year}</div>
            <div className="mt-1">{project.role}</div>
          </div>
        </div>

        <div className="mt-8">
          <p
            className="font-mono text-xs uppercase tracking-[0.2em]"
            style={{ color: project.accent }}
          >
            {project.tagline}
          </p>
          <h3 className="mt-2 font-display text-3xl font-bold text-ink md:text-4xl">
            {project.title}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/75 md:text-[1rem]">
            {project.description}
          </p>
        </div>

        {/* Metrics */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {project.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
            >
              <div className="font-mono text-lg font-bold text-ink">
                {m.value}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wide text-muted">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tech badges */}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-ink/80"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Actions: Live · Code · Architecture */}
        <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-6">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 font-mono text-sm font-semibold transition-all hover:shadow-glow"
              style={{ backgroundColor: project.accent, color: "#0A0A0C" }}
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 font-mono text-sm text-ink/85 transition-all hover:border-white/30 hover:text-ink"
          >
            <Github className="h-4 w-4" />
            Code
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 font-mono text-sm transition-all hover:shadow-glow"
            style={{
              borderColor: `${project.accent}66`,
              color: project.accent,
            }}
          >
            <Layers className="h-4 w-4" />
            Architecture
          </button>
        </div>
      </div>

      {/* Expandable Architecture overlay (kept absolute so the horizontal track width stays stable) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong absolute inset-0 z-30 flex flex-col rounded-2xl p-7 md:p-9"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4" style={{ color: project.accent }} />
                <span className="font-display text-lg font-semibold text-ink">
                  {project.title} · Architecture
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-muted transition-colors hover:bg-white/10 hover:text-ink"
                aria-label="Close architecture view"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid flex-1 gap-6 overflow-y-auto no-scrollbar md:grid-cols-2">
              {/* API routes */}
              <div>
                <h4 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted">
                  REST API Routes
                </h4>
                <ul className="space-y-2">
                  {project.apiRoutes.map((r) => (
                    <li
                      key={`${r.method} ${r.path}`}
                      className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold ${methodColor[r.method]}`}
                        >
                          {r.method}
                        </span>
                        <code className="font-mono text-xs text-ink/90">
                          {r.path}
                        </code>
                      </div>
                      <p className="mt-1 pl-1 font-mono text-[11px] text-muted">
                        {r.note}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* JWT auth flow */}
              <div>
                <h4 className="mb-3 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted">
                  <Lock className="h-3.5 w-3.5" /> JWT Auth Flow
                </h4>
                <ol className="relative space-y-3 border-l border-white/10 pl-5">
                  {project.authFlow.map((step, i) => (
                    <li key={i} className="relative">
                      <span
                        className="absolute -left-[23px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border"
                        style={{
                          borderColor: project.accent,
                          background: "rgba(10,10,12,1)",
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: project.accent }}
                        />
                      </span>
                      <p className="font-mono text-xs leading-relaxed text-ink/80">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
