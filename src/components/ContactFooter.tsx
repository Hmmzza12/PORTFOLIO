"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

const LINKS = [
  { label: "Email", href: "mailto:hamzatouaban11@gmail.com", icon: Mail },
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
];

export default function ContactFooter() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-white/5 bg-base py-28"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[80%] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            {"// Let's build"}
          </span>
          <h2 className="mt-5 font-display text-[clamp(2rem,6vw,4rem)] font-bold leading-[1.05] text-ink text-balance">
            Have a system worth
            <br />
            <span className="neon-text text-accent">engineering?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-muted">
            I design and ship full-stack products end to end. If you have an
            idea that needs a resilient backend and a cinematic front end,
            let&apos;s talk.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {LINKS.map((l) => {
              const Icon = l.icon;
              return (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    l.href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  className="group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-5 py-2.5 font-mono text-sm text-ink/85 transition-all hover:border-accent/50 hover:text-accent hover:shadow-glow"
                >
                  <Icon className="h-4 w-4" />
                  {l.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              );
            })}
          </div>
        </motion.div>

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 font-mono text-xs text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} Hamza Touaban</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-emerald-400" />
            Built with Next.js · GSAP · Framer Motion
          </span>
        </div>
      </div>
    </section>
  );
}
