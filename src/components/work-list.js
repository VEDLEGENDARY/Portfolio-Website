"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
    return (_jsxs(_Fragment, { children: [_jsx("ol", { ref: list, className: "rows", children: items.map((p, i) => (_jsxs("li", { className: "row", children: [_jsx("h3", { children: _jsxs("button", { type: "button", "aria-expanded": "false", "aria-controls": `panel-${p.slug}`, children: [_jsx("span", { className: "row-i mono", children: String(i + offset + 1).padStart(2, "0") }), _jsx("span", { className: "row-name", children: p.name }), _jsx("span", { className: "row-line", children: p.line }), _jsx("span", { className: "row-plus", "aria-hidden": "true" })] }) }), _jsx("div", { id: `panel-${p.slug}`, className: "panel", role: "region", "aria-label": `${p.name} details`, inert: true, children: _jsxs("div", { className: "panel-in", children: [_jsx("figure", { className: "cover", children: p.cover.kind === "image" ? (_jsx("img", { src: p.cover.src, alt: p.cover.alt, width: 1200, height: 800, loading: "lazy", decoding: "async" })) : (_jsx("canvas", { "data-art": p.cover.art, width: 1200, height: 800, role: "img", "aria-label": p.cover.alt })) }), _jsxs("div", { className: "detail", children: [p.badge && _jsx("p", { className: "badge mono", children: p.badge }), _jsx("ul", { className: "points", children: p.points.map((t) => (_jsx("li", { children: t }, t))) }), _jsx("ul", { className: "chips", children: p.stack.map((s) => (_jsx("li", { children: s }, s))) }), p.href && (_jsx("a", { className: "link-arrow", href: p.href, target: "_blank", rel: "noopener noreferrer", children: "Visit project" }))] })] }) })] }, p.slug))) }), _jsx("canvas", { ref: stageEl, className: "stage", "aria-hidden": "true" })] }));
}
