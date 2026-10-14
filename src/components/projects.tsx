"use client";
import { useState } from "react";
import Scene3D from "./scene3d";
import type { Project } from "@/content/data";

export default function Projects({ items }: { items: Project[] }) {
  const [open, setOpen] = useState(0);
  return (
    <ul className="rows">
      {items.map((p, i) => {
        const on = open === i;
        return (
          <li key={p.name} className={on ? "row on" : "row"}>
            <h3>
              <button aria-expanded={on} aria-controls={`panel-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                <span className="rn">{p.name}</span>
                <span className="rl">{p.line}</span>
                <span className="plus" aria-hidden="true" />
              </button>
            </h3>
            <div id={`panel-${i}`} className="panel" role="region" aria-label={`${p.name} details`} inert={!on}>
              <div className="inner">
                <div>
                  {p.badge && <p className="badge">{p.badge}</p>}
                  <ul className="points">{p.points.map((t) => <li key={t}>{t}</li>)}</ul>
                  <ul className="chips">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
                <Scene3D kind={p.scene} className="art" />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
