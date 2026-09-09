<div align="center">

<br />

<a href="https://vedp.dev"><strong>vedp.dev</strong></a>

```
██╗   ██╗███████╗██████╗ ██████╗     ██████╗ ███████╗██╗   ██╗
██║   ██║██╔════╝██╔══██╗██╔══██╗    ██╔══██╗██╔════╝██║   ██║
██║   ██║█████╗  ██║  ██║██████╔╝    ██║  ██║█████╗  ██║   ██║
╚██╗ ██╔╝██╔══╝  ██║  ██║██╔═══╝     ██║  ██║██╔══╝  ╚██╗ ██╔╝
 ╚████╔╝ ███████╗██████╔╝██║    ██╗  ██████╔╝███████╗ ╚████╔╝ 
  ╚═══╝  ╚══════╝╚═════╝ ╚═╝    ╚═╝  ╚═════╝ ╚══════╝  ╚═══╝  
```

<em>"I build intelligent, resilient, elegant, scalable software."</em>

<br />

[![Live](https://img.shields.io/badge/live-vedp.dev-B9FF66?style=for-the-badge&labelColor=080808)](https://vedp.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=B9FF66&labelColor=080808)](https://nextjs.org)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Physics_Engine-B9FF66?style=for-the-badge&labelColor=080808)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/license-All_Rights_Reserved-888888?style=for-the-badge&labelColor=080808)]()

<br />

**Contact** &nbsp;[ved.sp@outlook.com](mailto:ved.sp@outlook.com)  ·  **LinkedIn** &nbsp;[ved-patel](https://linkedin.com/in/ved-patel-1ab48b274)  ·  **GitHub** &nbsp;[VEDLEGENDARY](https://github.com/VEDLEGENDARY)

<br />

[Overview](#01--overview) · [Motion System](#02--core-physics--motion-system) · [Design System](#03--design-system) · [Architecture](#04--architecture--directory-tree) · [Projects](#05--featured-projects) · [Experience](#06--experience--education) · [Tech Stack](#07--tech-stack) · [Local Dev](#08--local-development)

</div>

<br />

---

<br />

<div align="center">

## 01 — Overview

</div>

A motion-first, physics-driven personal portfolio built with **Next.js 16** and **Framer Motion**. Engineered around clean dark surfaces, high-contrast typography, and an electric lime accent. Every card tilts, every button breathes, and every section earns its scroll.

> Built to feel like production software. Designed to read like a story.

<br />

---

<br />

<div align="center">

## 02 — Core Physics & Motion System

</div>

**`01`  CardTilt3D — Physics Engine**

The flagship interaction. Every card tracks continuous mouse coordinates and applies spring-interpolated 3D rotation (`rotateX`, `rotateY`) with smooth depth scaling on hover.

| Parameter | Value |
|:--|:--|
| Perspective | `1000px` 3D viewport |
| Spring Config | `stiffness: 300` · `damping: 25` · `mass: 0.5` |
| Hardware Accel. | `will-change: transform` + `transformStyle: preserve-3d` (no `overflow: hidden` on tilt layers) |

```
Cursor Enter  →  scale: 1.03 (spring-boost)
Cursor Move   →  rotateX / rotateY derived from relative offset [-intensity, +intensity]
Cursor Leave  →  spring physics damp smoothly back to rest (0deg, 0deg, scale 1.0)
```

**`02`  MagneticButton**

Interactive CTAs use proximity-attraction physics — buttons draw toward the cursor as it enters their radius, for tactile, weighted feedback.

**`03`  HighlightText — Auto-Renderer**

A regex-driven keyword highlighter. Detects technical terms (`LLM`, `REST APIs`, `CI/CD`, `Python`, `PostgreSQL`, etc.) on the fly and wraps them in accent styling with interactive glow states.

**`04`  Scroll-Aware Frosted Navbar**

| State | Behavior |
|:--|:--|
| At top (`y = 0`) | Fully transparent, `0px` blur — preserves the sharp background noise grid |
| Scrolled (`y > 8px`) | Transitions to `rgba(8, 8, 8, 0.75)` with `20px` backdrop blur, tuned to avoid conflicting stacking-context isolation |

<br />

---

<br />

<div align="center">

## 03 — Design System

**Color Palette**

| Preview | Token | Hex | Role |
|:---:|:--|:--|:--|
| ![#080808](https://img.shields.io/badge/-%20%20%20%20%20%20-080808?style=flat-square) | **Canvas** | `#080808` | Main dark background |
| ![#111111](https://img.shields.io/badge/-%20%20%20%20%20%20-111111?style=flat-square) | **Surface** | `#111111` | Elevated card surfaces |
| ![#F0F0F0](https://img.shields.io/badge/-%20%20%20%20%20%20-F0F0F0?style=flat-square) | **Primary** | `#F0F0F0` | Headline & primary text |
| ![#888888](https://img.shields.io/badge/-%20%20%20%20%20%20-888888?style=flat-square) | **Secondary** | `#888888` | Muted subtitles & labels |
| ![#B9FF66](https://img.shields.io/badge/-%20%20%20%20%20%20-B9FF66?style=flat-square) | **Electric Lime** | `#B9FF66` | Accent & focus highlights |

<br />

**Typography**

| Role | Family | Weights | Details |
|:--|:--|:--|:--|
| Display / Headlines | `Bricolage Grotesque` | `800` Extrabold | Optical sizing enabled, tight tracking (`-0.03em`) |
| Body / Interface | `Inter` | `400` · `500` · `600` | High-legibility UI scaling |

</div>

<br />

---

<br />

<div align="center">

## 04 — Architecture & Directory Tree

</div>

```
portfoliowebsite/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx           ← Root layout, fonts, metadata & viewport
│   │   ├── page.tsx             ← Main section orchestration
│   │   └── globals.css          ← Design tokens, glass utilities & keyframes
│   │
│   ├── components/
│   │   ├── navbar.tsx           ← Frosted glass nav & scroll-aware blur engine
│   │   ├── hero.tsx             ← Animated headline, rotating text loop & CTAs
│   │   ├── hero-canvas.tsx      ← WebGL ambient layer
│   │   ├── projects.tsx         ← Featured project grid with 3D tilt
│   │   ├── background.tsx       ← Work experience, education & tech chip cloud
│   │   ├── contact.tsx          ← CTA section & pill-button footer
│   │   ├── card-tilt.tsx        ← CardTilt3D engine (spring physics)
│   │   ├── magnetic-button.tsx  ← Cursor-attracted interactive wrapper
│   │   ├── highlight-text.tsx   ← Auto keyword accent renderer
│   │   ├── chip.tsx             ← Pill tag component
│   │   ├── cursor.tsx           ← Custom interactive cursor
│   │   ├── preloader.tsx        ← Entry sequence animation
│   │   └── theme-provider.tsx   ← Theme context manager
│   │
│   ├── hooks/
│   │   └── useIntersection.ts   ← Viewport gate for lazy rendering
│   │
│   └── providers/
│       └── lenis-provider.tsx   ← Smooth scrolling engine (Lenis)
│
└── public/
   ├── Resume_VedPatel.pdf       ← Professional resume document
    ├── nexdrop.png              ← Project previews
    └── profilepic.jpeg          ← Headshot media
```

<br />

---

<br />

<div align="center">

## 05 — Featured Projects

<em>Add project cards here — screenshot, stack badges, and a one-line pitch for each shipped project (e.g. NexDrop).</em>

</div>

<br />

---

<br />

<div align="center">

## 06 — Experience & Education

</div>

```
EXPERIENCE
├─ VisorFin Tech Services ─────────────────────────── [ Gurugram, IN | Jun 2025 – Feb 2026 ]
│  Role: Junior Full Stack Developer
│  • Built ~10 REST APIs in Node.js & Python handling legal and transactional data for 500+ accounts.
│  • Automated a daily data pipeline syncing 6,000+ fund entries, cutting 20+ hours of manual effort weekly.
│  • Shipped 12 native investment calculator components for Android (Kotlin) and iOS (Swift).
│
└─ Schoolhouse · Learn To Be ──────────────────────── [ Remote | 2023 – 2024 ]
   Role: STEM & CS Tutor
   • Conducted interactive Python workshops & tutored SAT Math, VEX Robotics, and CS fundamentals.
   • Maintained ~90% student retention through structured, project-based lesson plans.

EDUCATION
└─ The University of Texas at Dallas ───────────────── [ Richardson, TX | 2025 – 2029 ]
   Degree: B.S. in Computer Science (Minor in Marketing & Entrepreneurship)
   • 26th Place World Rank — International VEXU Robotics Championship
   • 1st Place National — TSA Web Development
   • Active Programmer — Comet Robotics
```

<br />

---

<br />

<div align="center">

## 07 — Tech Stack

**Languages**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white)
![Swift](https://img.shields.io/badge/Swift-FA7343?style=for-the-badge&logo=swift&logoColor=white)

<br />

**Frontend & Mobile**

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

<br />

**Backend & Databases**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

<br />

**AI, Machine Learning & DevOps**

![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

</div>

<br />

---

<br />

<div align="center">

## 08 — Local Development

**Prerequisites**  ·  Node.js `v20.0.0`+  ·  `pnpm` (recommended), `npm`, or `yarn`

</div>

```bash
# 1. Clone repository
git clone https://github.com/VEDLEGENDARY/portfoliowebsite.git
cd portfoliowebsite

# 2. Install dependencies
pnpm install

# 3. Run development server (Turbopack)
pnpm dev
```

Navigate to `http://localhost:3000` to view the running application.

```bash
# Production build check
pnpm build
pnpm start
```

### Figma MCP

This repository includes a project-scoped Figma MCP server in `.vscode/mcp.json`.
In VS Code, open the Command Palette and run **MCP: List Servers**, select
`figma`, then choose **Start** and complete the Figma authorization prompt.
Once connected, Copilot can inspect the selected Figma file, read its design
context, capture screenshots, and use that context while editing this app.

The current design handoff is the [VP Portfolio — Upscaled Direction](https://www.figma.com/design/NwmnnOIVFf4JKqc4EErjDt?node-id=4-5)
frame. The original captured implementation remains available in the same file
for visual comparison.

When asking Copilot to work from a design, include the Figma file or frame URL
and identify the target route or component. The MCP configuration contains no
credentials; authorization is handled by VS Code and Figma.

<br />

---

<br />

<div align="center">

```
╔═══════════════════════════════════════╗
║   Built with precision by Ved Patel   ║
║   © 2026  ·  All rights reserved      ║
╚═══════════════════════════════════════╝
```

[ved.sp@outlook.com](mailto:ved.sp@outlook.com)  ·  [linkedin.com/in/ved-patel-1ab48b274](https://linkedin.com/in/ved-patel-1ab48b274)  ·  [github.com/VEDLEGENDARY](https://github.com/VEDLEGENDARY)

<br />

[↑ Back to top](#)

</div>
