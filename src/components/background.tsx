"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Trophy, ArrowUpRight, Code2 } from "lucide-react";
import { Chip } from "@/components/chip";
import { HighlightText } from "@/components/highlight-text";
import { CardTilt3D } from "@/components/card-tilt";
import { MagneticButton } from "./magnetic-button";

const skills = [
  "Python",
  "TypeScript",
  "Java",
  "C++",
  "Go",
  "SQL",
  "Node.js",
  "React",
  "Next.js",
  "Express.js",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "GraphQL",
  "REST APIs",
  "Supabase",
  "TensorFlow",
  "PyTorch",
  "OpenCV",
  "Scikit-learn",
  "Docker",
  "Kubernetes",
  "AWS",
  "CI/CD",
  "Kotlin",
  "Swift",
  "Tailwind CSS",
  "Git",
  "Linux",
];

type ExperienceEntry = {
  index: string;
  role: string;
  org: string;
  period: string;
  location: string;
  bullets: string[];
};

const experience: ExperienceEntry[] = [
  {
    index: "01",
    role: "Full-Stack Developer Intern",
    org: "VisorFin Tech Services",
    period: "Jun 2025 – Feb 2026",
    location: "Gurugram, IN",
    bullets: [
      "Built 10+ RESTful APIs in Node.js and Python for legal and transactional data across 500+ accounts.",
      "Automated a daily pipeline syncing 6,000+ fund entries — cutting 20+ hours of manual work per week.",
      "Shipped 12 investment calculators into Kotlin (Android) and Swift (iOS) apps.",
    ],
  },
  {
    index: "02",
    role: "STEM & CS Tutor",
    org: "Schoolhouse · Learn To Be",
    period: "2023 – 2024",
    location: "Remote",
    bullets: [
      "Taught SAT Math, VEX Robotics, and Computer Science — students averaged a +50 point score gain on SAT.",
      "Ran interactive Python workshops that lifted participation across every session.",
      "Held ~90% student retention with structured, project-based lessons.",
    ],
  },
];

const education = {
  school: "UT Dallas",
  degree: "B.S. Computer Science",
  period: "2025 – 2029",
  location: "Richardson, TX",
  highlights: [
    { icon: Trophy, text: "26th — International VEXU Robotics" },
    { icon: Trophy, text: "1st Place National — TSA Web Dev" },
    { icon: GraduationCap, text: "Comet Robotics — Programmer · Localization · Autonomous algorithms" },
  ],
};

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

export function Background() {
  return (
    <section
      id="background"
      className="relative mx-auto max-w-screen-xl px-5 py-24 sm:px-10 lg:px-16 lg:py-32"
    >
      {/* Side grid — propagates from the right, underlaid behind all content */}
      <div
        aria-hidden
        className="vp-grid-right pointer-events-none absolute inset-y-0 right-0 z-0 w-[380px] opacity-70"
      />

      <div className="relative z-10">
      <div
        className="mb-20 h-px w-full"
        style={{ backgroundColor: "var(--color-border)" }}
      />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease }}
        className="mb-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p
            className="section-eyebrow mb-3 text-xs font-semibold uppercase tracking-[0.35em]"
            style={{ color: "var(--color-accent)" }}
          >
            Career
          </p>
          <h2 className="shine-text font-display text-6xl font-extrabold leading-[0.9] tracking-[-0.03em] sm:text-7xl">
            Experience
          </h2>
        </div>
        <MagneticButton strength={0.25}>
          <a
            data-cursor-grow
            href="/Resume_VedPatel.pdf"
            target="_blank"
            rel="noreferrer"
            className="resume-btn inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold"
          >
            Full Resume_VedPatel
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </MagneticButton>
      </motion.div>

      {/*
        Flat 2-col grid — items placed explicitly so rows align:
          col-1 row-1: VisorFin   col-2 row-1: Education
          col-1 row-2: Tutor      col-2 row-2: TechStack
      */}
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:grid-rows-[auto_auto]">

        {/* ── VisorFin (row 1, col 1) ── */}
        {experience.map((entry, i) => (
          <motion.div
            key={entry.org}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease }}
            className="lg:col-start-1"
          >
            <CardTilt3D
              className="glass-card rounded-2xl"
              intensity={6}
              scaleOnHover={false}
            >
              <article className="p-6 sm:p-8">
                <div className="mb-5 flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      border: "1px solid var(--color-border)",
                      backgroundColor: "var(--color-surface-raised)",
                      color: "var(--color-accent)",
                    }}
                  >
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3
                        className="font-display text-lg font-extrabold tracking-tight sm:text-xl"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        {entry.role}
                      </h3>
                      <span
                        className="font-display shrink-0 text-2xl font-extrabold tabular-nums"
                        style={{ color: "var(--color-border-hover)" }}
                      >
                        {entry.index}
                      </span>
                    </div>
                    <p
                      className="mt-0.5 text-sm font-semibold"
                      style={{ color: "var(--color-accent)" }}
                    >
                      {entry.org}
                    </p>
                  </div>
                </div>

                <div className="mb-5 flex flex-wrap gap-2">
                  <Chip>{entry.period}</Chip>
                  <Chip>{entry.location}</Chip>
                </div>

                <ul className="space-y-3">
                  {entry.bullets.map((bullet, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-sm leading-relaxed"
                      style={{ color: "var(--color-muted)" }}
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: "var(--color-accent)" }}
                      />
                      <span>
                        <HighlightText>{bullet}</HighlightText>
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </CardTilt3D>
          </motion.div>
        ))}

        {/* ── Education (row 1, col 2) — no border per design ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="glass-card rounded-2xl p-6 sm:p-8 lg:col-start-2 lg:row-start-1"
        >
          <div className="mb-5 flex items-start gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface-raised)",
                color: "var(--color-accent)",
              }}
            >
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <h3
                className="font-display text-lg font-extrabold leading-tight tracking-tight sm:text-xl"
                style={{ color: "var(--color-foreground)" }}
              >
                {education.school}
              </h3>
              <p
                className="mt-0.5 text-sm font-semibold"
                style={{ color: "var(--color-accent)" }}
              >
                {education.degree}
              </p>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <Chip>{education.period}</Chip>
            <Chip>{education.location}</Chip>
          </div>

          <div className="space-y-2.5">
            {education.highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div
                  key={h.text}
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface-raised)",
                  }}
                >
                  <Icon
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--color-accent)" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-foreground-secondary)" }}
                  >
<HighlightText>{h.text}</HighlightText>
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Tech Stack (row 2, col 2) — adjacent to Tutor ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="glass-card rounded-2xl p-6 sm:p-8 lg:col-start-2 lg:row-start-2"
        >
          <div className="mb-5 flex items-center gap-3">
            <div
              className="flex size-9 items-center justify-center rounded-lg"
              style={{
                border: "1px solid var(--color-accent)",
                color: "var(--color-accent)",
                backgroundColor: "var(--color-surface-raised)",
              }}
            >
              <Code2 className="size-4" />
            </div>
            <p
              className="text-sm font-bold uppercase tracking-[0.35em]"
              style={{ color: "var(--color-foreground)" }}
            >
              Tech stack
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.02 * i, ease }}
              >
                <Chip>{skill}</Chip>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
      </div>{/* end relative z-10 */}
    </section>
  );
}
