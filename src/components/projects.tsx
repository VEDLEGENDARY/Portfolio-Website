"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Chip } from "@/components/chip";
import { HighlightText } from "@/components/highlight-text";
import { CardTilt3D } from "@/components/card-tilt";
import { MagneticButton } from "@/components/magnetic-button";
import { useIntersection } from "@/hooks/useIntersection";

type Project = {
  index: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  imageFit?: "cover" | "contain";
  link: string;
  linkLabel: string;
  badge: string;
  accent: string;
  extraLink?: string;
  extraLabel?: string;
};

const projects: Project[] = [
  {
    index: "02",
    name: "TruScope",
    category: "Fine-tuned LLM",
    description:
      "Fine-tuned LLM classification detects bias and clickbait across a web app and Chrome extension, with a live 5.0 rating.",
    tags: ["LLM", "Classification", "Extension"],
    image: "/truscope.png",
    link: "https://truscope.app/",
    extraLink:
      "https://chromewebstore.google.com/detail/truscope/pncjbinbmlfgkgedabggpfgafomgjamn/",
    linkLabel: "Website",
    extraLabel: "Chrome Store",
    badge: "Live · 5.0★",
    accent: "#60a5fa",
  },
  {
    index: "03",
    name: "NaviEats",
    category: "Full-stack web app",
    description:
      "Navigation-first food discovery app with a polished full-stack experience, ranked #1 nationally at TSA Web Dev.",
    tags: ["Web", "Backend", "UX"],
    image: "/navieats.png",
    imageFit: "contain",
    link: "https://navieats.netlify.app/",
    linkLabel: "Website",
    badge: "#1 National",
    accent: "#fb923c",
  },
  {
    index: "04",
    name: "VFIN",
    category: "Production fintech",
    description:
      "Production Node.js and Python API layer serving 500+ accounts, syncing 6,000+ fund entries daily, and powering 12 iOS and Android calculators.",
    tags: ["Node.js", "Python", "PostgreSQL"],
    image: "/vfin.png",
    link: "https://play.google.com/store/search?q=vfin&c=apps",
    linkLabel: "Play Store",
    badge: "Production",
    accent: "#34d399",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.04 } },
};

/* ─── Gated project card: only renders when visible ─── */
function ProjectCard({ project }: { project: Project }) {
  const { ref, hasEverIntersected } = useIntersection<HTMLDivElement>({
    rootMargin: "80px",
    threshold: 0.05,
  });

  return (
    <motion.div ref={ref} variants={fadeUp} className="h-full">
      {hasEverIntersected ? (
        <CardTilt3D
          className="group relative flex h-full flex-col overflow-hidden rounded-2xl glass-card"
          intensity={8}
        >
          {/* Image */}
          <div className="relative h-52 overflow-hidden sm:h-56">
            <Image
              src={project.image}
              alt={`${project.name} screenshot`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center"
            />
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col p-5">
            <div className="mb-1 flex items-center justify-between gap-2">
              <h3
                className="font-display text-xl font-extrabold tracking-tight"
                style={{ color: "var(--color-foreground)" }}
              >
                {project.name}
              </h3>
              <span
                className="font-display text-2xl font-extrabold tabular-nums"
                style={{ color: "var(--color-border-hover)" }}
              >
                {project.index}
              </span>
            </div>

            <p
              className="mb-3 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-accent)" }}
            >
              {project.category}
            </p>

            <p
              className="flex-1 text-sm leading-relaxed"
              style={{ color: "var(--color-muted)" }}
            >
              <HighlightText>{project.description}</HighlightText>
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <Chip color={project.accent} dot>
                {project.badge}
              </Chip>
              {project.tags.map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {project.extraLink && (
                <a
                  data-cursor-grow
                  href={project.extraLink}
                  target="_blank"
                  rel="noreferrer"
                  className="resume-btn inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold"
                >
                  {project.extraLabel}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
              {project.link && (
                <a
                  data-cursor-grow
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="resume-btn inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold"
                >
                  {project.linkLabel}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </CardTilt3D>
      ) : (
        // Skeleton placeholder while off-screen
        <div
          className="h-full rounded-2xl"
          style={{
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
            minHeight: 380,
          }}
        />
      )}
    </motion.div>
  );
}

export function Projects() {
  return (
    <section
      id="projects"
      className="relative mx-auto max-w-screen-xl px-5 py-24 sm:px-10 lg:px-16 lg:py-32"
    >
      {/* Side grid — propagates from the left */}
      <div
        aria-hidden
        className="vp-grid-left pointer-events-none absolute inset-y-0 left-0 w-[380px] opacity-70"
      />

      {/* ── Section header ── */}
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
            Portfolio
          </p>
          <h2 className="shine-text font-display text-6xl font-extrabold leading-[0.9] tracking-[-0.03em] sm:text-7xl">
            Projects
          </h2>
        </div>
        <p
          className="max-w-xs text-sm leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          Computer vision, fine-tuned LLMs, and production fintech systems — built
          for measurable impact.
        </p>
      </motion.div>

      {/* ── Featured card (NexDrop) with 3D tilt ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease }}
        className="mb-5"
      >
        <CardTilt3D
          className="group overflow-hidden rounded-3xl glass-card"
          intensity={5}
        >
          <div className="grid grid-cols-1">
            <div className="relative min-h-[280px] overflow-hidden sm:min-h-[360px] lg:min-h-[460px]">
              <Image
                src="/nexdrop.png"
                alt="NexDrop — satellite imagery ROI scoring app"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>

            <div className="flex flex-col justify-between p-7 sm:p-10">
              <div>
                <div className="mb-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span
                      className="font-display text-xs font-semibold uppercase tracking-[0.35em]"
                      style={{ color: "var(--color-accent)" }}
                    >
                      01 — Featured
                    </span>
                    <span
                      className="font-display text-2xl font-extrabold tabular-nums"
                      style={{ color: "var(--color-border-hover)" }}
                    >
                      01
                    </span>
                  </div>
                  <h3
                    className="font-display mt-2 text-4xl font-extrabold tracking-[-0.02em]"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    NexDrop
                  </h3>
                  <p
                    className="mt-1 text-sm font-medium"
                    style={{ color: "var(--color-foreground-secondary)" }}
                  >
                    AI/ML
                  </p>
                </div>

                <p
                  className="text-base leading-relaxed"
                  style={{ color: "var(--color-muted)" }}
                >
                  <HighlightText>
                    {
                      "Computer-vision pipeline that extracts roof areas from satellite imagery and scores rainwater-harvesting ROI — with automated CI/CD around precipitation and surface-area analysis."
                    }
                  </HighlightText>
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Chip color="var(--color-accent)" dot>
                    MLH Win
                  </Chip>
                  {["OpenCV", "TensorFlow", "Scikit-learn", "CI/CD"].map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <MagneticButton strength={0.25}>
                  <a
                    data-cursor-grow
                    href="https://github.com/nshah2006/NexDrop/"
                    target="_blank"
                    rel="noreferrer"
                    className="resume-btn group/btn inline-flex items-center gap-2 px-6 py-3 text-sm font-bold"
                  >
                    View source
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </a>
                </MagneticButton>
                <MagneticButton strength={0.25}>
                  <a
                    data-cursor-grow
                    href="https://v0-nexdrop.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                    className="resume-btn group/btn inline-flex items-center gap-2 px-6 py-3 text-sm font-bold"
                  >
                    Live demo
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        </CardTilt3D>
      </motion.div>

      {/* ── Remaining 3 projects ── */}
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
      >
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </motion.div>
    </section>
  );
}
