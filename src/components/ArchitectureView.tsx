"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { Monitor, Server, ShieldCheck, Database, Zap } from "lucide-react";

type NodeDef = {
  id: string;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  detail: string;
};

const NODES: NodeDef[] = [
  {
    id: "client",
    label: "React Client",
    sub: "React 19 · Vite · TanStack",
    icon: Monitor,
    detail:
      "React 19 SPA bundled with Vite. Access tokens held in memory, refresh token in an httpOnly cookie. TanStack Query handles server-state caching and optimistic updates.",
  },
  {
    id: "api",
    label: "API Server",
    sub: "Express 5 · Fastify 5",
    icon: Server,
    detail:
      "Stateless REST API layer — Express 5 powers Pulse, Fastify 5 powers Forge. Zod validates every request body. Rate limiting and CORS configured at the middleware level.",
  },
  {
    id: "auth",
    label: "Auth Layer",
    sub: "JWT · bcrypt · RBAC",
    icon: ShieldCheck,
    detail:
      "Signs JWT access + rotating refresh token pairs. Passwords hashed with bcrypt. Forge enforces Owner / Admin / Member RBAC with cross-tenant isolation at the service layer.",
  },
  {
    id: "realtime",
    label: "Real-time",
    sub: "Socket.IO · WebSocket",
    icon: Zap,
    detail:
      "Socket.IO transport for Pulse's live DMs, notifications and emoji reactions. JWT-authenticated on handshake — every WebSocket event is verified against the access token.",
  },
  {
    id: "db",
    label: "Turso",
    sub: "SQLite Edge · Drizzle ORM",
    icon: Database,
    detail:
      "Turso's embedded SQLite replicas at the edge for low-latency reads. Drizzle ORM provides type-safe queries. Parameterized SQL guards every statement against injection.",
  },
];

export default function ArchitectureView() {
  const [active, setActive] = useState(0);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeNode = NODES[active];

  useEffect(() => {
    const dots = dotsRef.current;
    dots.forEach((dot) => {
      if (dot) gsap.killTweensOf(dot);
    });

    const tl = gsap.timeline();

    for (let i = 0; i < active; i++) {
      const dot = dots[i];
      if (!dot) continue;
      gsap.set(dot, { opacity: 1, left: "0%" });
      tl.to(
        dot,
        { left: "100%", duration: 0.4, ease: "power2.inOut" },
        i * 0.12
      );
    }

    for (let i = active; i < NODES.length - 1; i++) {
      const dot = dots[i];
      if (dot) gsap.set(dot, { opacity: 0 });
    }

    return () => {
      tl.kill();
    };
  }, [active]);

  return (
    <section
      id="architecture"
      className="relative overflow-hidden bg-base py-20"
    >
      <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-10 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            {"// System Design"}
          </span>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,5vw,3.4rem)] font-bold text-ink">
            Frontend → Backend Handshake
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Tap a node to trace how a request flows from the browser through the
            gateway, past JWT validation, and into persistence.
          </p>
        </motion.div>

        <div className="glass rounded-2xl p-5 sm:p-8">
          {/* Horizontal flow (md+) · Vertical flow (mobile) */}
          <div className="flex flex-col items-center py-6 md:flex-row md:items-center md:py-8">
            {NODES.map((n, i) => {
              const Icon = n.icon;
              const isActive = i === active;
              const inPath = i <= active;

              return (
                <Fragment key={n.id}>
                  {/* Node */}
                  <motion.button
                    type="button"
                    onClick={() => setActive(i)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.08,
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}
                    whileHover={!isActive ? { scale: 1.1, y: -4 } : {}}
                    whileTap={{ scale: 0.95 }}
                    animate={isActive ? { scale: 1.08 } : { scale: 1 }}
                    className="group relative z-10 flex shrink-0 flex-col items-center"
                  >
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-xl border backdrop-blur transition-all duration-300 sm:h-16 sm:w-16 ${
                        isActive
                          ? "border-accent bg-accent/15 shadow-[0_0_28px_rgba(255,30,66,0.35)]"
                          : inPath
                            ? "border-accent/40 bg-accent/[0.06]"
                            : "border-white/15 bg-white/[0.04] group-hover:border-accent/40 group-hover:bg-white/[0.08] group-hover:shadow-[0_0_16px_rgba(255,30,66,0.12)]"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 transition-colors duration-300 ${
                          isActive
                            ? "text-accent"
                            : inPath
                              ? "text-accent/70"
                              : "text-ink/60 group-hover:text-ink/90"
                        }`}
                      />
                    </span>
                    <span
                      className={`mt-2.5 whitespace-nowrap font-mono text-[10px] font-medium transition-colors duration-300 sm:text-[11px] ${
                        isActive
                          ? "text-accent"
                          : inPath
                            ? "text-accent/60"
                            : "text-muted group-hover:text-ink/70"
                      }`}
                    >
                      {n.label}
                    </span>
                    <span
                      className={`mt-0.5 hidden whitespace-nowrap font-mono text-[8px] transition-colors duration-300 sm:block sm:text-[9px] ${
                        isActive ? "text-muted" : "text-muted/40"
                      }`}
                    >
                      {n.sub}
                    </span>
                  </motion.button>

                  {/* Connector between nodes */}
                  {i < NODES.length - 1 && (
                    <>
                      {/* Desktop — horizontal */}
                      <div className="relative mx-1 hidden h-[2px] flex-1 md:block lg:mx-2">
                        <div
                          className={`h-full rounded-full transition-colors duration-500 ${
                            i < active ? "bg-accent/50" : "bg-white/10"
                          }`}
                        />
                        <svg
                          width="7"
                          height="12"
                          viewBox="0 0 7 12"
                          className={`absolute -right-1 top-1/2 -translate-y-1/2 fill-current transition-colors duration-500 ${
                            i < active ? "text-accent/50" : "text-white/10"
                          }`}
                        >
                          <path d="M0 0L7 6L0 12Z" />
                        </svg>
                        {/* Animated dot */}
                        <div
                          ref={(el) => {
                            dotsRef.current[i] = el;
                          }}
                          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent opacity-0"
                          style={{
                            boxShadow: "0 0 10px 3px rgba(255,30,66,0.6)",
                          }}
                        />
                      </div>

                      {/* Mobile — vertical */}
                      <div className="relative my-1.5 block h-8 w-[2px] md:hidden">
                        <div
                          className={`h-full w-full rounded-full transition-colors duration-500 ${
                            i < active ? "bg-accent/50" : "bg-white/10"
                          }`}
                        />
                        <svg
                          width="12"
                          height="7"
                          viewBox="0 0 12 7"
                          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 fill-current transition-colors duration-500 ${
                            i < active ? "text-accent/50" : "text-white/10"
                          }`}
                        >
                          <path d="M0 0L6 7L12 0Z" />
                        </svg>
                      </div>
                    </>
                  )}
                </Fragment>
              );
            })}
          </div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="mt-4 flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent/40 bg-accent/10">
                <activeNode.icon className="h-5 w-5 text-accent" />
              </span>
              <div>
                <div className="flex items-baseline gap-3">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {activeNode.label}
                  </h3>
                  <span className="font-mono text-[11px] text-muted">
                    {activeNode.sub}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {activeNode.detail}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
