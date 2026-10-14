"use client";
import { useEffect, useRef } from "react";

export default function KineticTitle({ lines }: { lines: string[] }) {
  const root = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(pointer: fine)").matches) return;
    const el = root.current!;
    const letters = [...el.querySelectorAll<HTMLElement>("[data-l]")];
    const move = (e: PointerEvent) => {
      for (const l of letters) {
        const b = l.getBoundingClientRect();
        const dist = Math.hypot(e.clientX - (b.left + b.width / 2), e.clientY - (b.top + b.height / 2));
        l.style.fontWeight = String(Math.round(800 - Math.min(dist, 320) / 320 * 520));
      }
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, []);

  return (
    <h1 ref={root} aria-label={lines.join(" ")}>
      {lines.map((text, i) => (
        <span className="line" key={text} aria-hidden="true">
          <span className={i ? "soft" : ""}>
            {[...text].map((ch, j) => (
              <span key={j} data-l={ch === " " ? undefined : ""}>{ch === " " ? "\u00a0" : ch}</span>
            ))}
          </span>
        </span>
      ))}
    </h1>
  );
}
