"use client";
import { useEffect, useRef } from "react";
import { Arrow } from "./icons.js";
import { ParticleField } from "../lib/particles.js";
import { clamp, easeInOutCubic, parseColor, watchVisibility } from "../lib/motion.js";
import { localPoint } from "../lib/ui.js";
export default function Hero({ name, lead, main }) {
    const section = useRef(null);
    const title = useRef(null);
    const canvas = useRef(null);
    useEffect(() => {
        const sec = section.current;
        const h1 = title.current;
        const cv = canvas.current;
        let field = null;
        let disposed = false;
        const cleanups = [];
        const css = getComputedStyle(document.documentElement);
        const ink = parseColor(css.getPropertyValue("--ink"), [0.06, 0.06, 0.055]);
        const signal = parseColor(css.getPropertyValue("--signal"), [1, 0.29, 0.11]);
        const family = getComputedStyle(h1).fontFamily;
        const words = name.split(" ");
        const setup = () => {
            if (disposed)
                return;
            field = new ParticleField(cv, {
                lines: (w) => (w < 640 && words.length > 1 ? words : [name]),
                family,
                weight: 400,
                fit: 0.88,
                maxBlock: 0.92,
                insets: () => ({
                    top: sec.querySelector(".hero-top").offsetHeight + 18,
                    bottom: sec.querySelector(".hero-foot").offsetHeight + 26,
                }),
                ink,
                signal,
                focus: 92,
                size: 2.2,
            });
            if (!field.ok) {
                sec.classList.add("no-gl");
                return;
            }
            sec.classList.add("has-gl");
            field.start();
            const move = (e) => {
                const p = localPoint(cv, e);
                field?.setPointer(p.x, p.y);
            };
            const leave = () => field?.setPointer(null);
            const down = (e) => {
                const p = localPoint(cv, e);
                field?.pulse(p.x, p.y);
            };
            sec.addEventListener("pointermove", move);
            sec.addEventListener("pointerleave", leave);
            sec.addEventListener("pointercancel", leave);
            sec.addEventListener("pointerdown", down);
            cleanups.push(() => {
                sec.removeEventListener("pointermove", move);
                sec.removeEventListener("pointerleave", leave);
                sec.removeEventListener("pointercancel", leave);
                sec.removeEventListener("pointerdown", down);
            });
            cleanups.push(watchVisibility(sec, (v) => field?.setVisible(v)));
            const onScroll = () => {
                const p = clamp(window.scrollY / (sec.offsetHeight * 0.75));
                field?.setDisperse(easeInOutCubic(p));
                sec.style.setProperty("--hp", p.toFixed(3));
            };
            onScroll();
            window.addEventListener("scroll", onScroll, { passive: true });
            cleanups.push(() => window.removeEventListener("scroll", onScroll));
        };
        // The text is sampled from the real font, so wait for it (but never for long).
        const fontReady = document.fonts
            ? Promise.race([
                document.fonts.load(`400 120px ${family}`).then(() => document.fonts.ready),
                new Promise((r) => setTimeout(r, 1800)),
            ])
            : Promise.resolve();
        fontReady.then(setup).catch(setup);
        return () => {
            disposed = true;
            cleanups.forEach((fn) => fn());
            field?.dispose();
        };
    }, [name]);
    return (
        <section ref={section} id="top" className="hero" data-section="top" aria-labelledby="hero-title">
            <div className="hero-stage"><canvas ref={canvas} aria-hidden="true" /></div>
            <div className="hero-top mono"><span><span className="small-cross" aria-hidden="true">+</span>Selected work / 2026</span><span>Computer science · UT Dallas</span></div>
            <h1 ref={title} id="hero-title" className="hero-title">{name}</h1>
            <div className="hero-foot">
                <p className="hero-lead">{lead}<span>{main}</span></p>
                <a href="#work" className="hero-explore" aria-label="Explore selected work"><span className="round-arrow"><Arrow direction="down" /></span><span>Explore the work<span className="mono">01 / Selected projects</span></span></a>
                <p className="hero-edition mono"><span>Web / AI / Robotics</span>A portfolio in progress</p>
            </div>
        </section>
    );
}
