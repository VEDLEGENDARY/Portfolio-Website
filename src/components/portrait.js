"use client";
import Image from "next/image";
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
        let ht = null;
        let disposed = false;
        let played = false;
        let seen = false;
        const cleanups = [];
        const tryPlay = () => {
            if (ht?.loaded && !played && seen && !disposed) {
                played = true;
                ht.play();
            }
        };
        const prepare = () => {
            ht = new Halftone(cv, { ink, paper });
            if (!ht.ok)
                return;
            loadImage(src)
                .then((img) => {
                    if (disposed)
                        return;
                    ht.setImage(img, img.naturalWidth, img.naturalHeight);
                    el.classList.add("has-gl");
                    tryPlay();
                })
                .catch(() => { });
        };
        cleanups.push(watchVisibility(el, (v) => {
            if (v && !ht)
                prepare();
            ht?.setVisible(v);
            if (v) {
                seen = true;
                tryPlay();
            }
        }, "160px"));
        const move = (e) => {
            const p = localPoint(cv, e);
            ht?.setPointer(p.x, p.y);
        };
        const leave = () => ht?.setPointer(null);
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
        });
        return () => {
            disposed = true;
            cleanups.forEach((fn) => fn());
            ht?.dispose();
        };
    }, [src]);
    return (
        <div ref={box} className="portrait">
            <svg width={0} height={0} aria-hidden="true" style={{ position: "absolute" }}>
                <defs>
                    <filter id="portrait-cool" colorInterpolationFilters="sRGB">
                        <feColorMatrix type="matrix" values="0.97 0 0 0 0  0 1 0 0 0  0 0 1.035 0 0.003  0 0 0 1 0" />
                    </filter>
                </defs>
            </svg>
            <Image src={src} alt={alt} width={1000} height={1000} sizes="(max-width: 960px) 90vw, 40vw" />
            <canvas ref={canvas} aria-hidden="true" />
        </div>
    );
}
