"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <header className="site-header">
      <nav className="shell navigation" aria-label="Main navigation">
        <a className="wordmark" href="#top">Ved Patel<span className="brand-period">.</span></a>
        <div className="nav-links">
          <a href="#projects">Work</a><a href="#background">Experience</a><a href="#contact">Contact</a>
          <button className="theme-toggle" aria-label="Toggle color theme" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
            <Moon className="moon-icon" size={17} /><Sun className="sun-icon" size={17} />
          </button>
        </div>
      </nav>
    </header>
  );
}
