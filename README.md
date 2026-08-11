# Cinematic AI-Driven Developer Portfolio

A high-performance, cinematic developer portfolio built with **Next.js 14 (App Router)**, **Tailwind CSS**, **GSAP (ScrollTrigger)**, and **Framer Motion**.

## ✨ Sections

| # | Component | What it does |
|---|-----------|--------------|
| 1 | `Preloader.tsx` | Full-screen terminal boot sequence with a live progress bar. Uses `sessionStorage` to skip instantly for returning visitors, then raises a Framer Motion curtain to reveal the hero. |
| 2 | `HeroScrubber.tsx` | Pins the viewport and scrubs a 240-frame WebP sequence onto an HTML5 `<canvas>` via GSAP ScrollTrigger, linking scroll progress to the active frame. Overlaid with the *"FULL-STACK SOFTWARE ENGINEER"* title and an **Explore Work** CTA. |
| 3 | `LedMatrix.tsx` | Interactive 2D canvas dot matrix that glows around the cursor, backing the core-stack skill cards (Spring Boot, React, TypeScript, JWT Auth). |
| 4 | `ProjectShowcase.tsx` | GSAP-pinned vertical→horizontal card gallery. Each 3D glass card has an **Architecture View** toggle revealing REST API routes, the JWT auth flow, and tech-stack badges. |
| 5 | `ArchitectureView.tsx` | Interactive node graph mapping the frontend → backend request path. Click any node to trace the flow and read its role. |
| — | `ContactFooter.tsx` | Closing call-to-action and contact links. |

## 🎨 Brand Kit

Defined in `tailwind.config.ts` and `src/app/globals.css`:

- **Background** `#0A0A0C` · **Accent** `#FF1E42` · **Slate** `#1E1E24` · **Text** `#F4F4F6` · **Muted** `#8A8A93`
- Fonts: **Space Grotesk** (display), **JetBrains Mono** (mono/terminal), **Inter** (body) — loaded via `next/font`.
- Cyberpunk aesthetic: neon glows, glassmorphism (`.glass`, `.glass-strong`), grid backdrops.

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## 🎞️ Hero frames & video

- `public/frames/frame_0001.webp … frame_0240.webp` — the WebP sequence the hero canvas scrubs (1280×720, 24 fps, ~7 MB total).
- `public/hero-clean.mp4` — the watermark-free source clip (kept as a fallback / reference).

The frames were extracted from the source clip with the Gemini watermark removed via ffmpeg's `delogo` filter. To regenerate them (requires ffmpeg on your PATH):

```bash
# Watermark box: x=1134 y=568 w=54 h=64  (the bottom-right sparkle)
ffmpeg -i "source.mp4" -vf "delogo=x=1134:y=568:w=54:h=64" \
  -c:v libwebp -q:v 72 public/frames/frame_%04d.webp
```

## 🧱 Structure

```
src/
  app/
    layout.tsx        # fonts + metadata
    page.tsx          # composes all sections
    globals.css       # theme tokens + utilities
  components/
    Preloader.tsx
    HeroScrubber.tsx
    LedMatrix.tsx
    ProjectShowcase.tsx
    ArchitectureView.tsx
    ContactFooter.tsx
  data/
    projects.ts       # project + architecture content
public/
  frames/             # hero frame sequence
  hero-clean.mp4
```

## ⚙️ Performance notes

- All hero frames are preloaded into `Image` objects inside a `useEffect` so canvas draws stay at a locked 60 FPS.
- Every scroll-driven component is a `'use client'` module; ScrollTrigger instances are cleaned up on unmount and refreshed once frames finish loading.
- Pinned sections use `will-change: transform` (`.will-pin`) to avoid scroll stutter.
- `prefers-reduced-motion` is respected in the preloader and global styles.
