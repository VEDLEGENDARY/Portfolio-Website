export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeOutCubic = (t) => 1 - Math.pow(1 - clamp(t), 3);
export const easeInOutCubic = (t) => {
    const x = clamp(t);
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
/** Small, fast, seedable PRNG so generated layouts are stable between renders. */
export function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
export const prefersReducedMotion = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
export const hasFinePointer = () => typeof matchMedia !== "undefined" && matchMedia("(hover: hover) and (pointer: fine)").matches;
/** Parses #rgb / #rrggbb into 0..1 floats. */
export function hexToRgb(hex, fallback = [0, 0, 0]) {
    let h = hex.trim().replace("#", "");
    if (h.length === 3)
        h = h.split("").map((c) => c + c).join("");
    if (h.length !== 6 || /[^0-9a-f]/i.test(h))
        return fallback;
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}
/** Parses a computed CSS colour (`rgb(...)`, `rgba(...)` or hex) into 0..1 floats. */
export function parseColor(value, fallback = [0, 0, 0]) {
    const v = value.trim();
    if (v.startsWith("#"))
        return hexToRgb(v, fallback);
    const m = v.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
    if (!m)
        return fallback;
    return [Number(m[1]) / 255, Number(m[2]) / 255, Number(m[3]) / 255];
}
/** Reads a hex colour from a CSS custom property on the given element. */
export function readColor(name, fallback, el = document.documentElement) {
    return hexToRgb(getComputedStyle(el).getPropertyValue(name), fallback);
}
export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Could not load ${src}`));
        img.src = src;
    });
}
/** Calls back whenever an element enters or leaves the viewport. Returns a disposer. */
export function watchVisibility(el, cb, margin = "0px") {
    const io = new IntersectionObserver(([e]) => cb(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
}
