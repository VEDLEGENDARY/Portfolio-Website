"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { Contours } from "../lib/contours.js";
import { parseColor, watchVisibility } from "../lib/motion.js";
/** Drifting contour lines behind the contact section. Decorative only. */
export default function ContactField() {
    const canvas = useRef(null);
    useEffect(() => {
        const cv = canvas.current;
        const host = cv.parentElement;
        const signal = parseColor(getComputedStyle(document.documentElement).getPropertyValue("--signal"), [1, 0.29, 0.11]);
        const field = new Contours(cv, signal);
        if (!field.ok)
            return;
        const stop = watchVisibility(host, (v) => field.setVisible(v));
        field.start();
        const move = (e) => {
            const r = cv.getBoundingClientRect();
            field.setPointer((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
        };
        host.addEventListener("pointermove", move);
        return () => {
            stop();
            host.removeEventListener("pointermove", move);
            field.dispose();
        };
    }, []);
    return _jsx("canvas", { ref: canvas, className: "contact-field", "aria-hidden": "true" });
}
