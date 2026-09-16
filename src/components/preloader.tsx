"use client";

import { useCallback, useEffect, useState } from "react";

/** A short opening title, never a simulated loading percentage or a network gate. */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const skip = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dismiss = () => setVisible(false);
    const timer = window.setTimeout(dismiss, preference.matches ? 0 : 2300);
    const onPreference = () => { if (preference.matches) dismiss(); };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Tab") skip();
    };
    preference.addEventListener("change", onPreference);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      preference.removeEventListener("change", onPreference);
      window.removeEventListener("keydown", onKey);
    };
  }, [skip, visible]);

  if (!visible) return null;

  return (
    <div className="preloader" aria-hidden="true" onAnimationEnd={event => {
      if (event.target === event.currentTarget) skip();
    }}>
      <div className="intro-curtain intro-curtain-top" aria-hidden="true" />
      <div className="intro-curtain intro-curtain-bottom" aria-hidden="true" />
      <div className="intro-composition" aria-hidden="true">
        <div className="intro-name"><span>Ved</span> <em>Patel.</em></div>
        <div className="intro-rule"><span /></div>
      </div>
    </div>
  );
}
