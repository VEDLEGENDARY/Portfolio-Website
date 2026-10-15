"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { PreviewStage } from "../lib/preview-stage.js";
import { drawCover } from "../lib/covers.js";
import { hasFinePointer, loadImage, watchVisibility } from "../lib/motion.js";
export default function WorkList({ items, offset = 0 }) {
    const list = useRef(null);
    const stageEl = useRef(null);
    useEffect(() => {
        const ol = list.current;
        const cleanups = [];
        const rows = [...ol.querySelectorAll(".row")];
        const anyOpen = () => rows.some((r) => r.classList.contains("on"));
        const setOpen = (row, open) => {
            row.classList.toggle("on", open);
            row.querySelector("button")?.setAttribute("aria-expanded", String(open));
            const panel = row.querySelector(".panel");
            if (panel)
                panel.inert = !open;
        };
        // Hover preview: a card parked beside the list, only on devices with a mouse.
        let stage = null;
        let hovered = -1;
        let refreshPreview = null;
        const pt = { x: 0, y: 0 };
        const prepare = () => {
            ol.querySelectorAll("canvas[data-art]").forEach((c) => {
                const art = drawCover(c.dataset.art);
                c.getContext("2d")?.drawImage(art, 0, 0);
            });
            if (hasFinePointer() && stageEl.current) {
                const loaders = items.map((p) => p.cover.kind === "image"
                    ? () => loadImage(p.cover.src)
                    : () => Promise.resolve(drawCover(p.cover.art)));
                const st = new PreviewStage(stageEl.current, loaders);
                if (st.ok) {
                    stage = st;
                    const preload = window.setTimeout(() => st.prime(), 100);
                    cleanups.push(() => window.clearTimeout(preload));
                    // The free column sits between the longest project name and the descriptions.
                    const MIN = 240;
                    let usable = false;
                    const layout = () => {
                        const names = [...ol.querySelectorAll(".row-name")];
                        const lines = [...ol.querySelectorAll(".row-line")];
                        const range = document.createRange();
                        let right = 0;
                        for (const n of names) {
                            range.selectNodeContents(n);
                            right = Math.max(right, range.getBoundingClientRect().right);
                        }
                        const left = right + 16 + 20; // hover nudge plus breathing room
                        const end = Math.min(...lines.map((l) => l.getBoundingClientRect().left)) - 20;
                        const width = Math.min(440, end - left);
                        usable = window.innerWidth >= 1000 && width >= MIN;
                        if (usable)
                            st.setSlot(left + width / 2, width);
                        else
                            st.hide();
                    };
                    const rowY = (i) => {
                        const r = rows[i].querySelector("button").getBoundingClientRect();
                        return r.top + r.height / 2;
                    };
                    const refresh = () => {
                        if (hovered < 0 || anyOpen() || !usable)
                            return;
                        st.show(hovered, rowY(hovered), pt.x, pt.y);
                    };
                    refreshPreview = refresh;
                    layout();
                    window.addEventListener("resize", layout);
                    window.addEventListener("scroll", refresh, { passive: true });
                    cleanups.push(() => {
                        window.removeEventListener("resize", layout);
                        window.removeEventListener("scroll", refresh);
                    });
                    rows.forEach((row, i) => {
                        const track = (e) => {
                            hovered = i;
                            pt.x = e.clientX;
                            pt.y = e.clientY;
                            if (anyOpen() || !usable)
                                st.hide();
                            else
                                st.show(i, rowY(i), pt.x, pt.y);
                        };
                        row.addEventListener("pointerenter", track);
                        row.addEventListener("pointermove", track);
                        cleanups.push(() => {
                            row.removeEventListener("pointerenter", track);
                            row.removeEventListener("pointermove", track);
                        });
                    });
                    const leave = () => {
                        hovered = -1;
                        st.hide();
                    };
                    ol.addEventListener("pointerleave", leave);
                    cleanups.push(() => {
                        ol.removeEventListener("pointerleave", leave);
                        st.dispose();
                    });
                }
            }
        };
        let prepared = false;
        cleanups.push(watchVisibility(ol, (visible) => {
            if (visible && !prepared) {
                prepared = true;
                prepare();
            }
        }, "240px"));
        // One row open at a time. Opening hides the preview; closing brings it back.
        rows.forEach((row) => {
            const btn = row.querySelector("button");
            const onClick = () => {
                const open = !row.classList.contains("on");
                rows.forEach((r) => setOpen(r, false));
                setOpen(row, open);
                if (open)
                    stage?.hide();
                else
                    refreshPreview?.();
            };
            btn.addEventListener("click", onClick);
            cleanups.push(() => btn.removeEventListener("click", onClick));
        });
        return () => cleanups.forEach((fn) => fn());
    }, [items]);
    return (
        <>
            <ol ref={list} className="rows" start={offset + 1}>
                {items.map((project, index) => (
                    <li className="row" key={project.slug}>
                        <h3>
                            <button type="button" aria-expanded="false" aria-controls={`panel-${project.slug}`}>
                                <span className="row-i mono">{String(index + offset + 1).padStart(2, "0")}</span>
                                <span className="row-name">{project.name}</span>
                                <span className="row-line">{project.line}</span>
                                <span className="row-plus" aria-hidden="true" />
                            </button>
                        </h3>
                        <div id={`panel-${project.slug}`} className="panel" role="region" aria-label={`${project.name} details`} inert>
                            <div className="panel-in">
                                <figure className="cover">
                                    {project.cover.kind === "image" ? (
                                        <Image src={project.cover.src} alt={project.cover.alt} width={1200} height={800} sizes="(max-width: 960px) 90vw, 55vw" />
                                    ) : (
                                        <canvas data-art={project.cover.art} width={1200} height={800} role="img" aria-label={project.cover.alt} />
                                    )}
                                </figure>
                                <div className="detail">
                                    {project.badge && <p className="badge mono">{project.badge}</p>}
                                    <ul className="points">{project.points.map((point) => <li key={point}>{point}</li>)}</ul>
                                    <ul className="chips">{project.stack.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                                    {project.href && <a className="link-arrow" href={project.href} target="_blank" rel="noopener noreferrer">Visit project</a>}
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ol>
            <canvas ref={stageEl} className="stage" aria-hidden="true" />
        </>
    );
}
