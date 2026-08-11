"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Monitor,
  Server,
  ShieldCheck,
  Database,
  Radio,
} from "lucide-react";

type Node = {
  id: string;
  label: string;
  sub: string;
  x: number; // % of viewBox width
  y: number; // % of viewBox height
  icon: React.ComponentType<{ className?: string }>;
  detail: string;
};

const NODES: Node[] = [
  {
    id: "client",
    label: "React Client",
    sub: "Next.js · Canvas · GSAP",
    x: 12,
    y: 50,
    icon: Monitor,
    detail:
      "Server-rendered React shell. Access tokens held in memory; refresh token in an httpOnly cookie. Canvas + GSAP drive the 60 FPS scroll experience.",
  },
  {
    id: "gateway",
    label: "API Gateway",
    sub: "Routing · Rate limit",
    x: 38,
    y: 50,
    icon: Radio,
    detail:
      "Edge gateway terminating TLS, applying rate limits and forwarding requests with the Bearer token to the appropriate service.",
  },
  {
    id: "auth",
    label: "Auth Service",
    sub: "Spring Security · JWT",
    x: 64,
    y: 22,
    icon: ShieldCheck,
    detail:
      "Validates credentials, signs JWTs (HS256), rotates refresh tokens and exposes a JWKS endpoint for downstream local validation.",
  },
  {
    id: "api",
    label: "Spring Boot API",
    sub: "REST · Business logic",
    x: 64,
    y: 78,
    icon: Server,
    detail:
      "Stateless REST services. A security filter validates the JWT signature and role claims on every request before hitting business logic.",
  },
  {
    id: "db",
    label: "PostgreSQL",
    sub: "Persistence · Redis cache",
    x: 88,
    y: 50,
    icon: Database,
    detail:
      "Relational store fronted by a Redis cache for hot reads. Connection pooling keeps p95 query latency low under peak load.",
  },
];

// Directed edges between node ids.
const EDGES: [string, string][] = [
  ["client", "gateway"],
  ["gateway", "auth"],
  ["gateway", "api"],
  ["auth", "api"],
  ["api", "db"],
];

const byId = (id: string) => NODES.find((n) => n.id === id)!;

export default function ArchitectureView() {
  const [active, setActive] = useState<string>("client");
  const activeNode = byId(active);

  return (
    <section
      id="architecture"
      className="relative overflow-hidden bg-base py-28"
    >
      <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
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

        <div className="glass rounded-2xl p-4 sm:p-8">
          {/* Diagram */}
          <div className="relative w-full" style={{ aspectRatio: "16 / 8" }}>
            <svg
              viewBox="0 0 100 50"
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 h-full w-full"
            >
              {/* Edges */}
              {EDGES.map(([from, to]) => {
                const a = byId(from);
                const b = byId(to);
                const isLive = active === from || active === to;
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={isLive ? "#FF1E42" : "rgba(255,255,255,0.14)"}
                    strokeWidth={isLive ? 0.5 : 0.3}
                    strokeDasharray="1.4 1.2"
                    className={isLive ? "animate-pulse-glow" : ""}
                  />
                );
              })}
            </svg>

            {/* Nodes (HTML overlay for crisp text + interactivity) */}
            {NODES.map((n, i) => {
              const Icon = n.icon;
              const isActive = active === n.id;
              return (
                <motion.button
                  key={n.id}
                  type="button"
                  onClick={() => setActive(n.id)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border backdrop-blur transition-all sm:h-16 sm:w-16 ${
                      isActive
                        ? "border-accent bg-accent/15 shadow-glow"
                        : "border-white/15 bg-white/[0.04] group-hover:border-accent/50"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 sm:h-7 sm:w-7 ${
                        isActive ? "text-accent" : "text-ink/70"
                      }`}
                    />
                  </span>
                  <span
                    className={`mt-2 whitespace-nowrap font-mono text-[9px] sm:text-[11px] ${
                      isActive ? "text-accent" : "text-muted"
                    }`}
                  >
                    {n.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Detail panel */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5"
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
        </div>
      </div>
    </section>
  );
}
