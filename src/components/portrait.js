"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { Halftone } from "../lib/halftone.js";
import { loadImage, parseColor, watchVisibility } from "../lib/motion.js";
import { localPoint } from "../lib/ui.js";
export default function Portrait({ src, alt }) {
    const box = useRef(null);
    const canvas = useRef(null);
    useEffect(() => {
        const el = box.current;
        const cv = canvas.current;
        const css = getComputedStyle(document.documentElement);
        const ink = parseColor(css.getPropertyValue("--ink"), [0.06, 0.06, 0.055]);
        const paper = parseColor(css.getPropertyValue("--paper"), [0.9, 0.89, 0.85]);
        const ht = new Halftone(cv, { ink, paper });
        if (!ht.ok)
            return;
        let disposed = false;
        let played = false;
        let seen = false;
        const cleanups = [];
        const tryPlay = () => {
            if (!played && seen && !disposed) {
                played = true;
                ht.play();
            }
        };
        loadImage(src)
            .then((img) => {
            if (disposed)
                return;
            ht.setImage(img, img.naturalWidth, img.naturalHeight);
            el.classList.add("has-gl");
            tryPlay();
        })
            .catch(() => { });
        cleanups.push(watchVisibility(el, (v) => {
            ht.setVisible(v);
            if (v) {
                seen = true;
                tryPlay();
            }
        }, "0px 0px -12% 0px"));
        const move = (e) => {
            const p = localPoint(cv, e);
            ht.setPointer(p.x, p.y);
        };
        const leave = () => ht.setPointer(null);
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
        });
        return () => {
            disposed = true;
            cleanups.forEach((fn) => fn());
            ht.dispose();
        };
    }, [src]);
    return (_jsxs("div", { ref: box, className: "portrait", children: [_jsx("img", { src: src, alt: alt, width: 1000, height: 1000, decoding: "async" }), _jsx("canvas", { ref: canvas, "aria-hidden": "true" })] }));
}
