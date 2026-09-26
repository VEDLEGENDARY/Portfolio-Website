"use client";

import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="site-header">
      <nav className="shell navigation" aria-label="Main navigation">
        <a className="wordmark" href="#top">Ved Patel<span className="brand-period">.</span></a>
        <div className="nav-links">
          <a href="#projects">Projects</a><a href="#background">Experience</a><a href="#contact">Contact</a><a className="nav-resume" href="/Resume_VedPatel.pdf" target="_blank" rel="noreferrer">Résumé <span aria-hidden="true">↗</span></a>
          <button className="theme-toggle" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} onClick={toggleTheme}>
            <Moon className="moon-icon" size={17} /><Sun className="sun-icon" size={17} />
          </button>
        </div>
      </nav>
    </header>
  );
}
