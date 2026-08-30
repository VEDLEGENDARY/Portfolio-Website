"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { MagneticButton } from "@/components/magnetic-button";
import { useIntersection } from "@/hooks/useIntersection";

// R3F canvas — lazy loaded, never SSR
const HeroCanvas = dynamic(
  () => import("@/components/hero-canvas").then((m) => m.HeroCanvas),
  { ssr: false },
);

const rotatingWords = ["intelligent", "resilient", "elegant", "scalable"];

const marqueeItems = [
  "Python",
  "TypeScript",
  "Java",
  "C++",
  "Go",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "JavaScript",
  "Kotlin",
  "Swift",
  "SQL",
  "Express.js",
  "FastAPI",
  "Tailwind",
  "Scikit-learn",
  "pandas",
  "NumPy",
  "Matplotlib",
  "ChromaDB",
  "NetworkX",
  "Tree-Sitter",
  "Firebase",
  "Supabase",
  "Google Cloud",
  "System Design",
  "API Design",
  "Software Architecture",
  "Data Pipelines",
  "NLP",
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const { ref: sectionRef, isIntersecting } = useIntersection<HTMLElement>({
    rootMargin: "200px",
  });

  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((i) => (i + 1) % rotatingWords.length),
      2400,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* grid backdrop */}
      <div className="vp-grid-bg pointer-events-none absolute inset-0 opacity-85" />

      {/* static top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-52 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full opacity-[0.06] blur-[150px]"
        style={{ backgroundColor: "var(--color-accent)" }}
      />

      {/* ── IntersectionObserver-gated R3F canvas ── */}
      {isIntersecting && <HeroCanvas />}

      {/* film grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-30 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* spacer for fixed nav */}
      <div className="shrink-0 h-16" aria-hidden />

      {/* ── Hero body ── */}
      <div className="relative z-10 flex flex-1 items-center px-5 sm:px-10 lg:px-16">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-[1.15fr_0.85fr] items-center gap-4 sm:gap-10">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.25 }}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 glass"
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
              </span>
              <span
                className="text-xs font-semibold tracking-wide"
                style={{ color: "var(--color-foreground-secondary)" }}
              >
                Software Engineer · Dallas, TX
              </span>
            </motion.div>

            {/* Headline */}
            <h1
              className="font-display font-extrabold leading-[0.9] tracking-[-0.03em] text-[clamp(2.6rem,6.2vw,5.6rem)]"
              style={{ color: "var(--color-foreground)" }}
            >
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease, delay: 0.3 }}
                >
                  I build
                </motion.span>
              </span>
              <span className="relative block overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingWords[wordIndex]}
                    className="block"
                    initial={{ y: "105%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-105%", opacity: 0 }}
                    transition={{ duration: 0.55, ease }}
                    style={{ color: "var(--color-accent)" }}
                  >
                    {rotatingWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
                <motion.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease, delay: 0.44 }}
                >
                  software.
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease }}
              className="mt-7 max-w-md text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--color-muted)" }}
            >
              AI, computer vision, and production fintech APIs — shipped to real
              users at real scale.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.68, ease }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <MagneticButton strength={0.28}>
                <a
                  data-cursor-grow
                  href="#projects"
                  className="resume-btn group inline-flex items-center gap-2 px-6 py-3 text-sm font-bold"
                >
                  See my work
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </MagneticButton>

              <MagneticButton strength={0.28}>
                <a
                  data-cursor-grow
                  href="/VedP_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="resume-btn inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold"
                >
                  Resume
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right: Portrait with glass overlay card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease }}
            className="relative mx-auto block w-full max-w-[180px] min-[520px]:max-w-[240px] min-[900px]:max-w-[420px]"
          >
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <Image
                src="/profilepic.jpeg"
                alt="Ved Patel — Software Engineer"
                width={680}
                height={860}
                priority
                className="project-img aspect-[4/5] h-auto max-h-[clamp(260px,52vh,520px)] w-full object-cover object-top"
              />
              {/* Gradient scrim so the badge is legible */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(8,8,8,0.82) 0%, transparent 100%)",
                }}
              />
              {/* Open to work badge — original chip style */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
                <div
                  className="inline-flex items-center gap-2.5 rounded-full px-3.5 py-2"
                  style={{
                    backgroundColor: "rgba(8,8,8,0.72)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                  }}
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    />
                    <span
                      className="relative inline-flex h-2 w-2 rounded-full"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    />
                  </span>
                  <div>
                    <p
                      className="text-xs font-bold leading-none"
                      style={{ color: "var(--color-accent)" }}
                    >
                      Open to work
                    </p>
                    <p
                      className="mt-0.5 text-[11px] leading-none"
                      style={{ color: "white" }}
                    >
                      AI/ML · Automation · Full-stack
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Static directional cue */}
      <ArrowDown
        aria-hidden
        className="pointer-events-none absolute bottom-20 left-1/2 z-10 hidden size-5 -translate-x-1/2 sm:block"
        style={{ color: "var(--color-subtle)" }}
      />

      {/* ── Tech marquee footer ── */}
      <motion.div
        className="vp-marquee relative z-10 shrink-0 overflow-hidden py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        aria-hidden
      >
        <div className="vp-marquee-track gap-10">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="flex items-center gap-10">
              <span
                className="text-sm font-semibold tracking-wide whitespace-nowrap"
                style={{ color: "var(--color-foreground)" }}
              >
                {item}
              </span>
              <span
                className="h-1 w-1 rounded-full"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
