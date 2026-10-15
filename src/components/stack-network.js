"use client";
import { useEffect, useRef } from "react";
import { Network } from "../lib/network.js";
import { watchVisibility } from "../lib/motion.js";
import { localPoint } from "../lib/ui.js";
export default function StackNetwork({ projects, groups }) {
    const canvas = useRef(null);
    useEffect(() => {
        const cv = canvas.current;
        let net = null;
        let disposed = false;
        const stopWatching = watchVisibility(cv, (visible) => {
            if (visible && !net) {
                const css = getComputedStyle(cv);
                const read = (n, d) => css.getPropertyValue(n).trim() || d;
                net = new Network(cv, { projects, groups }, {
                    ink: read("--ink", "#0f0f0e"),
                    paper: read("--paper", "#e6e3d9"),
                    signal: read("--signal", "#ff4a1c"),
                    serif: read("--serif", "Georgia, serif"),
                    mono: read("--mono", "monospace"),
                });
                document.fonts?.ready.then(() => {
                    if (!disposed) {
                        net.labelKey = null;
                        net.draw();
                    }
                });
            }
            net?.setVisible(visible);
        }, "240px");
        const move = (e) => {
            const p = localPoint(cv, e);
            net?.setPointer(p.x, p.y);
        };
        const leave = () => net?.setPointer(null);
        cv.addEventListener("pointermove", move);
        cv.addEventListener("pointerdown", move);
        cv.addEventListener("pointerleave", leave);
        cv.addEventListener("pointercancel", leave);
        return () => {
            disposed = true;
            stopWatching();
            cv.removeEventListener("pointermove", move);
            cv.removeEventListener("pointerdown", move);
            cv.removeEventListener("pointerleave", leave);
            cv.removeEventListener("pointercancel", leave);
            net?.dispose();
        };
    }, [projects, groups]);
    return (
        <div className="network">
            <canvas ref={canvas} role="img" aria-label="Network linking each project and skill area to the technologies it uses" />
        </div>
    );
}
