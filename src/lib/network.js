import { clamp, mulberry32, prefersReducedMotion } from "./motion.js";
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9+#.]/g, "");
/** Projects and skill groups are hubs; every technology links to the hubs that use it. */
export function buildGraph({ projects, groups }) {
    const nodes = [];
    const links = [];
    const techs = new Map();
    const add = (id, label, kind) => {
        nodes.push({ id, label, kind, x: 0, y: 0, vx: 0, vy: 0, r: kind === "group" ? 9 : kind === "project" ? 6.5 : 3, deg: 0 });
        return nodes.length - 1;
    };
    const tech = (name) => {
        const key = norm(name);
        if (!techs.has(key))
            techs.set(key, add(`t:${key}`, name, "tech"));
        return techs.get(key);
    };
    groups.forEach((g) => {
        const gi = add(`g:${g.name}`, g.name, "group");
        g.items.forEach((it) => links.push([gi, tech(it)]));
    });
    projects.forEach((p) => {
        const pi = add(`p:${p.name}`, p.name, "project");
        p.stack.forEach((it) => links.push([pi, tech(it)]));
    });
    links.forEach(([a, b]) => {
        nodes[a].deg++;
        nodes[b].deg++;
    });
    nodes.forEach((n) => {
        if (n.kind === "tech")
            n.r = 2.6 + Math.min(n.deg, 3) * 0.9;
    });
    return { nodes, links };
}
/** A small force simulation drawn to a 2D canvas. Hover a node to trace what it connects to. */
export class Network {
    constructor(canvas, input, colors) {
        this.canvas = canvas;
        this.colors = colors;
        this.w = 0;
        this.h = 0;
        this.dpr = 1;
        this.alpha = 1;
        this.hover = -1;
        this.ptr = { x: -9999, y: -9999, active: false };
        this.raf = 0;
        this.running = false;
        this.visible = true;
        this.reduce = prefersReducedMotion();
        this.tick = () => {
            if (!this.running)
                return;
            this.raf = requestAnimationFrame(this.tick);
            this.step();
            this.draw();
        };
        this.ctx = canvas.getContext("2d");
        const g = buildGraph(input);
        this.nodes = g.nodes;
        this.links = g.links;
        this.adj = this.nodes.map(() => new Set());
        this.links.forEach(([a, b]) => {
            this.adj[a].add(b);
            this.adj[b].add(a);
        });
        this.ro = new ResizeObserver(() => this.resize());
        this.ro.observe(canvas);
        this.resize(true);
    }
    start() {
        if (!this.ctx || this.running || !this.visible)
            return;
        if (this.reduce) {
            this.draw();
            return;
        }
        this.running = true;
        this.raf = requestAnimationFrame(this.tick);
    }
    setVisible(v) {
        this.visible = v;
        if (v)
            this.start();
        else {
            this.running = false;
            cancelAnimationFrame(this.raf);
        }
    }
    setPointer(x, y) {
        if (x === null || y === undefined) {
            this.ptr.active = false;
            this.hover = -1;
            this.canvas.style.cursor = "";
            if (this.reduce)
                this.draw();
            return;
        }
        this.ptr.x = x;
        this.ptr.y = y;
        this.ptr.active = true;
        let best = -1;
        let bd = 30 * 30;
        this.nodes.forEach((n, i) => {
            const d = (n.x - x) ** 2 + (n.y - y) ** 2;
            if (d < bd) {
                bd = d;
                best = i;
            }
        });
        this.hover = best;
        this.canvas.style.cursor = best >= 0 ? "pointer" : "";
        if (this.reduce)
            this.draw();
    }
    dispose() {
        this.running = false;
        cancelAnimationFrame(this.raf);
        this.ro.disconnect();
    }
    resize(first = false) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, this.canvas.clientWidth);
        const h = Math.max(1, this.canvas.clientHeight);
        if (w < 8 || h < 8)
            return;
        this.dpr = dpr;
        this.canvas.width = Math.round(w * dpr);
        this.canvas.height = Math.round(h * dpr);
        const rnd = mulberry32(11);
        if (first || this.w === 0) {
            this.nodes.forEach((n, i) => {
                const a = (i / this.nodes.length) * Math.PI * 2 + rnd();
                const r = Math.min(w, h) * (0.15 + rnd() * 0.3);
                n.x = w / 2 + Math.cos(a) * r;
                n.y = h / 2 + Math.sin(a) * r;
            });
        }
        else {
            this.nodes.forEach((n) => {
                n.x = (n.x / this.w) * w;
                n.y = (n.y / this.h) * h;
            });
        }
        this.w = w;
        this.h = h;
        this.alpha = 1;
        if (this.reduce) {
            for (let i = 0; i < 400; i++)
                this.step();
            this.draw();
        }
    }
    step() {
        const { nodes, links, w, h } = this;
        const n = nodes.length;
        const scale = clamp(Math.min(w / 1000, h / 640), 0.3, 1.2);
        const a = this.alpha;
        for (let i = 0; i < n; i++) {
            const p = nodes[i];
            for (let j = i + 1; j < n; j++) {
                const q = nodes[j];
                let dx = p.x - q.x;
                let dy = p.y - q.y;
                if (dx * dx + dy * dy < 1) {
                    dx = Math.random() - 0.5;
                    dy = Math.random() - 0.5;
                }
                // Labels are wide, so horizontal neighbours count as closer than vertical ones.
                const ex = dx * 0.55;
                const d2 = ex * ex + dy * dy;
                const hubs = p.kind !== "tech" && q.kind !== "tech";
                const min = (hubs ? 100 : p.kind === "tech" && q.kind === "tech" ? 44 : 70) * scale;
                const d = Math.sqrt(dx * dx + dy * dy) || 1;
                const f = ((min * min * 9) / Math.max(d2, 1)) * 0.2 * a + (Math.sqrt(d2) < min ? (min - Math.sqrt(d2)) * 0.06 : 0);
                dx /= d;
                dy /= d;
                p.vx += dx * f;
                p.vy += dy * f;
                q.vx -= dx * f;
                q.vy -= dy * f;
            }
        }
        for (const [ai, bi] of links) {
            const p = nodes[ai];
            const q = nodes[bi];
            const dx = q.x - p.x;
            const dy = q.y - p.y;
            const d = Math.hypot(dx, dy) || 1;
            const rest = (p.kind === "group" || q.kind === "group" ? 150 : 96) * scale;
            const f = (d - rest) * 0.012;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
            q.vx -= (dx / d) * f;
            q.vy -= (dy / d) * f;
        }
        const R = 110;
        for (const p of nodes) {
            p.vx += (w / 2 - p.x) * 0.0007;
            p.vy += (h / 2 - p.y) * 0.0026;
            if (this.ptr.active) {
                const dx = p.x - this.ptr.x;
                const dy = p.y - this.ptr.y;
                const d = Math.hypot(dx, dy);
                if (d < R && d > 0.1) {
                    const f = (1 - d / R) * 1.6;
                    p.vx += (dx / d) * f;
                    p.vy += (dy / d) * f;
                }
            }
            p.vx *= 0.82;
            p.vy *= 0.82;
            p.x = clamp(p.x + p.vx, 24, w - 24);
            p.y = clamp(p.y + p.vy, 24, h - 24);
        }
        this.alpha = Math.max(0.04, this.alpha * 0.994);
    }
    draw() {
        const ctx = this.ctx;
        if (!ctx)
            return;
        const { nodes, links, adj, hover, colors: c } = this;
        ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        ctx.clearRect(0, 0, this.w, this.h);
        const active = hover >= 0;
        const near = (i) => !active || i === hover || adj[hover].has(i);
        ctx.lineWidth = 1;
        for (const [a, b] of links) {
            const on = active && (a === hover || b === hover);
            ctx.strokeStyle = on ? c.signal : c.paper;
            ctx.globalAlpha = on ? 0.95 : active ? 0.05 : 0.17;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.stroke();
        }
        nodes.forEach((n, i) => {
            const on = near(i);
            ctx.globalAlpha = on ? 1 : 0.14;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r + (i === hover ? 2 : 0), 0, Math.PI * 2);
            if (n.kind === "group") {
                ctx.fillStyle = c.ink;
                ctx.fill();
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = c.paper;
                ctx.stroke();
            }
            else {
                ctx.fillStyle = n.kind === "project" || i === hover ? c.signal : c.paper;
                ctx.fill();
            }
        });
        const compact = this.w < 640;
        nodes.forEach((n, i) => {
            const on = near(i);
            if (n.kind === "tech") {
                // On small screens only hub labels stay visible; a touched node reveals its neighbours.
                if (compact && !(active && on))
                    return;
                ctx.font = `${compact ? 10 : 11}px ${c.mono}`;
                ctx.fillStyle = c.paper;
                ctx.globalAlpha = on ? (active ? 0.95 : 0.55) : 0.08;
            }
            else if (n.kind === "group") {
                ctx.font = `italic ${compact ? 16 : 21}px ${c.serif}`;
                ctx.fillStyle = c.paper;
                ctx.globalAlpha = on ? 1 : 0.12;
            }
            else {
                ctx.font = `${compact ? 15 : 19}px ${c.serif}`;
                ctx.fillStyle = c.signal;
                ctx.globalAlpha = on ? 1 : 0.14;
            }
            const off = n.r + 7;
            const tw = ctx.measureText(n.label).width;
            const flip = n.x + off + tw > this.w - 6 && n.x - off - tw > 4;
            ctx.textBaseline = "middle";
            ctx.textAlign = flip ? "right" : "left";
            ctx.fillText(n.label, n.x + (flip ? -off : off), n.y - (n.kind === "tech" ? 0 : 1));
        });
        ctx.globalAlpha = 1;
    }
}
