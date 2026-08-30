"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Mail, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { MagneticButton } from "@/components/magnetic-button";

const navLinks = [
  { label: "Work", href: "#projects" },
  { label: "Experience", href: "#background" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Check window.scrollY AND documentElement.scrollTop in case html/body has layout styling
      const scrollPos = window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled(scrollPos > 8);
    };

    // Trigger check immediately on mount
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 transition-all duration-300"
      style={{
        /* Preserve the themed highlight while enabling glass only after scrolling. */
        backgroundColor: scrolled ? "var(--color-nav-blur)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: "none",
      }}
    >
      <nav
        className="flex items-center justify-between px-5 py-3.5 sm:px-10 lg:px-16"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <MagneticButton strength={0.25}>
          <a
            href="#"
            data-cursor-grow
            className="flex items-center gap-2.5 focus:outline-none"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[17px] font-medium transition-transform duration-200 hover:scale-105"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-accent-text)",
              }}
            >
              VP
            </div>
            <span
              className="font-display text-[17.5px] font-bold tracking-tight"
              style={{ color: "var(--color-foreground)" }}
            >
              Ved Patel
            </span>
          </a>
        </MagneticButton>

        {/* Links */}
        <div className="hidden items-center gap-8 sm:flex">
          {navLinks.map((link) => (
            <MagneticButton key={link.href} strength={0.3}>
              <a
                href={link.href}
                data-cursor-grow
                className="group relative text-[15px] font-medium transition-colors duration-200"
                style={{ color: "color-mix(in srgb, var(--color-foreground) 80%, transparent)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-foreground)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-muted)")
                }
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
              </a>
            </MagneticButton>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <MagneticButton strength={0.3}>
            <button
              data-cursor-grow
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200"
              style={{
                border: "1px solid var(--color-control-border)",
                color: "var(--color-foreground)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-control-hover)";
                e.currentTarget.style.color = "var(--color-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-control-border)";
                e.currentTarget.style.color = "var(--color-foreground)";
              }}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </MagneticButton>

          <MagneticButton strength={0.25}>
            <a
              data-cursor-grow
              href="/VedP_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="resume-btn hidden items-center gap-1.5 px-4 py-2 text-xs font-semibold sm:inline-flex"
            >
              Resume
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </MagneticButton>

          <MagneticButton strength={0.25}>
            <a
              data-cursor-grow
              href="mailto:ved.sp@outlook.com"
              className="resume-btn connect-btn inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-accent-text)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-accent)";
                e.currentTarget.style.color = "var(--color-accent-text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-foreground)";
                e.currentTarget.style.color = "var(--color-background)";
              }}
            >
              <span className="hidden sm:inline">Connect</span>
              <Mail className="h-3.5 w-3.5" />
            </a>
          </MagneticButton>
        </div>
      </nav>
    </header>
  );
}
