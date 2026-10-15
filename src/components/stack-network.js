"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { Network } from "../lib/network.js";
import { watchVisibility } from "../lib/motion.js";
import { localPoint } from "../lib/ui.js";
export default function StackNetwork({ projects, groups }) {
    const canvas = useRef(null);
    useEffect(() => {
        const cv = canvas.current;
        const css = getComputedStyle(cv);
        const read = (n, d) => css.getPropertyValue(n).trim() || d;
        const net = new Network(cv, { projects, groups }, {
            ink: read("--ink", "#0f0f0e"),
            paper: read("--paper", "#e6e3d9"),
            signal: read("--signal", "#ff4a1c"),
            serif: read("--serif", "Georgia, serif"),
            mono: read("--mono", "monospace"),
        });
        const stopWatching = watchVisibility(cv, (v) => net.setVisible(v));
        net.start();
        const move = (e) => {
            const p = localPoint(cv, e);
            net.setPointer(p.x, p.y);
        };
        const leave = () => net.setPointer(null);
        cv.addEventListener("pointermove", move);
        cv.addEventListener("pointerdown", move);
        cv.addEventListener("pointerleave", leave);
        cv.addEventListener("pointercancel", leave);
        return () => {
            stopWatching();
            cv.removeEventListener("pointermove", move);
            cv.removeEventListener("pointerdown", move);
            cv.removeEventListener("pointerleave", leave);
            cv.removeEventListener("pointercancel", leave);
            net.dispose();
        };
    }, [projects, groups]);
    return (_jsx("div", { className: "network", children: _jsx("canvas", { ref: canvas, role: "img", "aria-label": "Network linking each project and skill area to the technologies it uses" }) }));
}
