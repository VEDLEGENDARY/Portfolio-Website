"use client";

import { useEffect } from "react";

/** One observer for progressive motion; server-rendered content stays visible without JS. */
export function EditorialMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    let observer: IntersectionObserver | undefined;

    const stop = () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    const start = () => {
      stop();
      if (preference.matches || !("IntersectionObserver" in window)) return;

      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const element = entry.target;
          const image = element.classList.contains("portrait-frame");
          const animation = element.animate(
            image
              ? [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }]
              : [{ opacity: 0, transform: "translateY(28px)" }, { opacity: 1, transform: "translateY(0)" }],
            { duration: image ? 1400 : 950, easing: "cubic-bezier(.22, 1, .36, 1)" },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
          observer?.unobserve(element);
        });
      }, { threshold: 0.08 });

      document.querySelectorAll(".section-heading, .project-grid article, .experience-entry, .contact-heading, .portrait-frame").forEach(element => observer?.observe(element));
    };
    start();
    preference.addEventListener("change", start);
    return () => {
      stop();
      preference.removeEventListener("change", start);
    };
  }, []);

  return null;
}
