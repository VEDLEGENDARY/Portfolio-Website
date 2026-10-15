"use client";
import { useEffect, useRef } from "react";
import { mountClock, mountCounters, mountCursor, mountMagnetic, mountMarquee, mountReveal, mountScroll, mountSectionSpy } from "../lib/ui.js";
/** Mounts the page-wide behaviours: scroll effects, reveals, counters, clock and cursor. */
export default function Enhance({ timezone }) {
    const cursor = useRef(null);
    useEffect(() => {
        document.documentElement.classList.add("js");
        const cleanups = [
            mountScroll(),
            mountReveal(),
            mountCounters(),
            mountSectionSpy(),
            mountClock(timezone),
            mountMarquee(),
            mountMagnetic(),
            cursor.current ? mountCursor(cursor.current) : () => { },
        ];
        return () => cleanups.forEach((fn) => fn());
    }, [timezone]);
    return <div ref={cursor} className="cursor" aria-hidden="true" />;
}
