"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Code2, ExternalLink, Mail } from "lucide-react";
import { Chip } from "@/components/chip";
import { MagneticButton } from "@/components/magnetic-button";

const highlights = [
  "AI/ML · LLMs · Computer Vision",
  "Production fintech APIs",
  "Automation pipelines",
  "Full-stack web apps",
  "End-to-end product delivery",
];

const socials = [
  { label: "GitHub", href: "https://github.com/VEDLEGENDARY", icon: Code2 },
  { label: "LinkedIn", href: "https://linkedin.com/in/vedspatel", icon: ExternalLink },
  { label: "Email", href: "mailto:ved.sp@outlook.com", icon: Mail },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="relative mx-auto max-w-screen-xl px-5 py-24 sm:px-10 lg:px-16 lg:py-32"
    >
      {/* Footer grid — propagates up from the bottom of the screen */}
      <div
        aria-hidden
        className="vp-grid-footer pointer-events-none absolute inset-x-0 bottom-0 h-[500px] opacity-75"
      />

      {/* Divider */}
      <div
        className="mb-20 h-px w-full"
        style={{ backgroundColor: "var(--color-border)" }}
      />

      {/* ── CTA card — glassmorphism ── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden rounded-3xl glass-strong"
      >
        <div className="relative p-8 sm:p-12 lg:p-16">
          {/* Accent glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full opacity-[0.07] blur-[120px]"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
          {/* Second glow bottom-left */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-20 h-[360px] w-[360px] rounded-full opacity-[0.04] blur-[100px]"
            style={{ backgroundColor: "var(--color-accent)" }}
          />

          <div className="relative grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <p
                className="section-eyebrow mb-4 text-xs font-semibold uppercase tracking-[0.35em]"
                style={{ color: "var(--color-accent)" }}
              >
                Contact
              </p>
              <h2
                className="font-display text-6xl font-extrabold leading-[0.9] tracking-[-0.03em] sm:text-7xl"
                style={{ color: "var(--color-foreground)" }}
              >
                Let&apos;s build
                <br />
                <span style={{ color: "var(--color-accent)" }}>
                  something real.
                </span>
              </h2>
              <p
                className="mt-7 max-w-md text-lg leading-relaxed"
                style={{ color: "var(--color-muted)" }}
              >
                Open to internships and roles in AI, automation, and product.
                Let&apos;s talk.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:min-w-[220px] lg:flex-col">
              <MagneticButton strength={0.22}>
                <a
                  data-cursor-grow
                  href="mailto:ved.sp@outlook.com"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-colors duration-200 w-full"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-accent-text)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-accent-dark)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-accent)";
                  }}
                >
                  <Mail className="h-4 w-4" />
                  Send an email
                </a>
              </MagneticButton>

              <MagneticButton strength={0.22}>
                <a
                  data-cursor-grow
                  href="/VedP_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="resume-btn inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold w-full"
                >
                  Resume PDF
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </MagneticButton>
            </div>
          </div>

          {/* Highlight pills */}
          <div
            className="relative mt-10 flex flex-wrap gap-2.5 border-t pt-10"
            style={{ borderColor: "var(--color-border)" }}
          >
            {highlights.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Footer ── */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-10 flex flex-col items-center justify-between gap-5 sm:flex-row"
        aria-label="Site footer"
      >
        {/* Brand — styled like a nav button */}
        <MagneticButton strength={0.2}>
          <a
            href="#"
            data-cursor-grow
            className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-bold transition-colors duration-200"
            style={{
              border: "2px solid rgba(255,255,255,0.2)",
              color: "#f0f0f0",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-black"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-accent-text)",
              }}
            >
              VP
            </div>
            <span>Ved Patel</span>
          </a>
        </MagneticButton>

        {/* Socials — pill button style */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {socials.map(({ label, href, icon: Icon }) => (
            <MagneticButton key={label} strength={0.2}>
              <a
                data-cursor-grow
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noreferrer"}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200"
                style={{
                  border: "2px solid rgba(255,255,255,0.2)",
                  color: "#f0f0f0",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#f0f0f0";
                }}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </a>
            </MagneticButton>
          ))}
        </div>

        {/* Copyright + email */}
        <div className="flex flex-col items-center gap-1 sm:items-end">
          <a
            href="mailto:ved.sp@outlook.com"
            className="text-xs font-medium transition-colors duration-200"
            style={{ color: "rgba(240,240,240,0.55)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,240,240,0.55)")}
          >
            ved.sp@outlook.com
          </a>
          <p className="text-xs" style={{ color: "rgba(240,240,240,0.35)" }}>
            &copy; {new Date().getFullYear()} Ved Patel
          </p>
        </div>
      </motion.footer>
    </section>
  );
}
