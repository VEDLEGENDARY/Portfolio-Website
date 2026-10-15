import { clamp, easeInOutCubic, easeOutCubic, hasFinePointer, prefersReducedMotion } from "./motion.js";
const noop = () => { };
const root = () => document.documentElement;
/**
 * One rAF-throttled scroll loop drives every scroll-linked effect:
 * the progress bar, the scrubbed statement, and the timeline line.
 */
export function mountScroll() {
    const reduce = prefersReducedMotion();
    let queued = false;
    const update = () => {
        queued = false;
        const vh = window.innerHeight;
        const max = root().scrollHeight - vh;
        root().style.setProperty("--scroll", String(max > 0 ? clamp(window.scrollY / max) : 0));
        const under = document.elementsFromPoint(window.innerWidth / 2, 30).find((n) => !n.closest(".nav"));
        root().dataset.navtone = under?.closest(".dark") ? "dark" : "light";
        document.querySelectorAll("[data-scrub]").forEach((el) => {
            const words = el.querySelectorAll(".w");
            if (!words.length)
                return;
            if (reduce) {
                words.forEach((w) => (w.style.opacity = "1"));
                return;
            }
            const r = el.getBoundingClientRect();
            const p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.32));
            const span = words.length + 5;
            words.forEach((w, i) => {
                const v = clamp(p * span - i, 0, 1);
                w.style.opacity = String(0.16 + 0.84 * easeOutCubic(v));
            });
        });
        document.querySelectorAll(".timeline > li").forEach((li) => {
            li.classList.toggle("reached", reduce || li.getBoundingClientRect().top < vh * 0.66);
        });
        document.querySelectorAll("[data-progress]").forEach((el) => {
            const r = el.getBoundingClientRect();
            const p = clamp((vh * 0.62 - r.top) / r.height);
            el.style.setProperty("--p", reduce ? "1" : p.toFixed(4));
        });
    };
    const request = () => {
        if (queued)
            return;
        queued = true;
        requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
        window.removeEventListener("scroll", request);
        window.removeEventListener("resize", request);
    };
}
/** Fades and lifts `[data-reveal]` elements into place when they enter the viewport. */
export function mountReveal() {
    const els = [...document.querySelectorAll("[data-reveal]")];
    if (!els.length)
        return noop;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
        els.forEach((el) => el.classList.add("in"));
        return noop;
    }
    const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
            if (!e.isIntersecting)
                continue;
            e.target.classList.add("in");
            io.unobserve(e.target);
        }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
}
/** Counts `[data-count]` numbers up from zero the first time they are seen. */
export function mountCounters() {
    const els = [...document.querySelectorAll("[data-count]")];
    if (!els.length || prefersReducedMotion() || !("IntersectionObserver" in window))
        return noop;
    let raf = 0;
    const fmt = (el, v) => {
        const d = Number(el.dataset.decimals ?? 0);
        el.textContent = v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) + (el.dataset.suffix ?? "");
    };
    const run = (el) => {
        const to = Number(el.dataset.count);
        const t0 = performance.now();
        const dur = 1600;
        const loop = (now) => {
            const t = clamp((now - t0) / dur);
            fmt(el, to * easeOutCubic(t));
            if (t < 1)
                raf = requestAnimationFrame(loop);
            else
                fmt(el, to);
        };
        fmt(el, 0);
        raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
            if (!e.isIntersecting)
                continue;
            run(e.target);
            io.unobserve(e.target);
        }
    }, { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
    return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
    };
}
/** Marks the section nearest the middle of the screen, for the nav and for theming. */
export function mountSectionSpy() {
    const sections = [...document.querySelectorAll("[data-section]")];
    if (!sections.length || !("IntersectionObserver" in window))
        return noop;
    const links = [...document.querySelectorAll("[data-nav] a[href^='#']")];
    const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
            if (!e.isIntersecting)
                continue;
            const id = e.target.dataset.section ?? "";
            root().dataset.section = id;
            links.forEach((a) => {
                if (a.getAttribute("href") === `#${id}`)
                    a.setAttribute("aria-current", "true");
                else
                    a.removeAttribute("aria-current");
            });
        }
    }, { rootMargin: "-45% 0px -54% 0px" });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
}
/** Keeps `[data-clock]` showing the local time in the given zone. */
export function mountClock(timeZone) {
    const els = [...document.querySelectorAll("[data-clock]")];
    if (!els.length)
        return noop;
    let fmt;
    try {
        fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone, timeZoneName: "short" });
    }
    catch {
        return noop;
    }
    const tick = () => {
        const text = fmt.format(new Date());
        els.forEach((el) => (el.textContent = text));
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
}
/**
 * A thin ring that trails the real cursor and grows over links. It is an
 * outline only, so it never covers the content under it, and it switches to a
 * light colour over dark sections.
 */
export function mountCursor(el) {
    if (!hasFinePointer() || prefersReducedMotion())
        return noop;
    const p = { x: -100, y: -100, tx: -100, ty: -100 };
    let raf = 0;
    let shown = false;
    const move = (e) => {
        p.tx = e.clientX;
        p.ty = e.clientY;
        if (!shown) {
            shown = true;
            p.x = p.tx;
            p.y = p.ty;
            el.classList.add("on");
        }
        const t = e.target;
        el.classList.toggle("link", !!t?.closest("a, button, summary"));
        el.classList.toggle("inv", !!t?.closest(".dark"));
    };
    const leave = () => {
        shown = false;
        el.classList.remove("on");
    };
    const loop = () => {
        raf = requestAnimationFrame(loop);
        p.x += (p.tx - p.x) * 0.22;
        p.y += (p.ty - p.y) * 0.22;
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
    };
    loop();
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", leave);
    };
}
/** Scrolls the skills marquee on its own, and speeds it up or reverses it with the page scroll. */
export function mountMarquee() {
    const tracks = [...document.querySelectorAll(".marquee .track")];
    if (!tracks.length || prefersReducedMotion())
        return noop;
    let x = 0;
    let last = window.scrollY;
    let vel = 0;
    let raf = 0;
    const seen = new Set();
    const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target))));
    tracks.forEach((t) => io.observe(t));
    const loop = () => {
        raf = requestAnimationFrame(loop);
        const dy = window.scrollY - last;
        last = window.scrollY;
        vel += (clamp(dy, -60, 60) - vel) * 0.08;
        x += 0.7 + vel * 0.55;
        if (!seen.size)
            return;
        tracks.forEach((t) => {
            const half = t.scrollWidth / 2;
            const o = ((x % half) + half) % half;
            t.style.transform = `translate3d(${-o}px, 0, 0)`;
        });
    };
    loop();
    return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
    };
}
/** Buttons lean slightly toward the pointer. */
export function mountMagnetic() {
    if (!hasFinePointer() || prefersReducedMotion())
        return noop;
    const cleanups = [];
    document.querySelectorAll(".btn").forEach((el) => {
        const move = (e) => {
            const r = el.getBoundingClientRect();
            el.style.transform = `translate3d(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px, 0)`;
        };
        const leave = () => (el.style.transform = "");
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
        });
    });
    return () => cleanups.forEach((fn) => fn());
}
/** Pulls the first matching element's box relative to a canvas, in CSS pixels. */
export function localPoint(canvas, e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
}
export { easeInOutCubic };
