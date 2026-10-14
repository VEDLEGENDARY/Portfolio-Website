"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    const el = ref.current!;
    const p = { x: -50, y: -50, tx: -50, ty: -50 };
    let mag: HTMLElement | null = null;
    const move = (e: PointerEvent) => {
      p.tx = e.clientX;
      p.ty = e.clientY;
      const t = e.target as Element;
      el.classList.toggle("big", !!t.closest("a,button"));
      el.style.opacity = "1";
      const b = t.closest<HTMLElement>(".btn");
      if (mag && mag !== b) mag.style.transform = "";
      if (b) {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      }
      mag = b;
    };
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      p.x += (p.tx - p.x) * 0.2;
      p.y += (p.ty - p.y) * 0.2;
      el.style.transform = `translate(${p.x}px,${p.y}px)`;
    };
    loop();
    addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
    };
  }, []);
  return <div ref={ref} className="cursor" aria-hidden="true" />;
}
