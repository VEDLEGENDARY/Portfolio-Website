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
        this.labels = [];
        this.labelKey = null;
        this.time = 0;
        this.last = 0;
        this.ptr = { x: -9999, y: -9999, active: false };
        this.raf = 0;
        this.running = false;
        this.visible = true;
        this.reduce = prefersReducedMotion();
        this.tick = (now) => {
            if (!this.running)
                return;
            this.raf = requestAnimationFrame(this.tick);
            const dt = Math.min(0.05, (now - this.last) / 1000 || 1 / 60);
            this.last = now;
            this.step(dt);
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
        this.last = performance.now();
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
        let bd = 38 * 38;
        this.nodes.forEach((n, i) => {
            const d = (n.x - x) ** 2 + (n.y - y) ** 2;
            if (d < bd) {
                bd = d;
                best = i;
            }
        });
        // Label hit areas and a little hysteresis make connections easy to inspect.
        const label = this.labels.find((box) => x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h);
        if (label)
            best = label.index;
        else if (best < 0 && this.hover >= 0) {
            const current = this.nodes[this.hover];
            if (Math.hypot(current.x - x, current.y - y) < 52)
                best = this.hover;
        }
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
        if (!first && w === this.w && h === this.h && dpr === this.dpr)
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
        // Settle once before displaying the graph, then anchor it in place.
        this.ptr.active = false;
        this.hover = -1;
        for (let i = 0; i < 480; i++)
            this.settleStep();
        const minY = Math.min(...this.nodes.map((node) => node.y));
        const maxY = Math.max(...this.nodes.map((node) => node.y));
        this.nodes.forEach((node) => {
            // Use the enlarged drawing area instead of leaving it empty above
            // and below a tightly clustered simulation.
            node.y = 42 + (node.y - minY) / Math.max(1, maxY - minY) * (h - 84);
            node.ax = node.x;
            node.ay = node.y;
            node.vx = node.vy = 0;
        });
        this.labelKey = null;
        this.draw();
    }
    step(dt = 1 / 60) {
        this.time += dt;
        const follow = 1 - Math.exp(-8 * dt);
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            let dx = this.reduce ? 0 : Math.sin(this.time * 0.7 + i * 2.4) * 0.9;
            let dy = this.reduce ? 0 : Math.cos(this.time * 0.6 + i * 1.7) * 0.75;
            if (i === this.hover && this.ptr.active && !this.reduce && Math.hypot(this.ptr.x - node.ax, this.ptr.y - node.ay) < 64) {
                dx = clamp((this.ptr.x - node.ax) * 0.22, -6, 6);
                dy = clamp((this.ptr.y - node.ay) * 0.22, -6, 6);
            }
            node.x += (node.ax + dx - node.x) * follow;
            node.y += (node.ay + dy - node.y) * follow;
        }
    }
    settleStep() {
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
        for (const p of nodes) {
            p.vx += (w / 2 - p.x) * 0.0007;
            p.vy += (h / 2 - p.y) * 0.0026;
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
        const labelKey = `${hover}:${this.w}:${this.h}`;
        if (this.labelKey !== labelKey) {
            this.labels = [];
            const priority = (i) => i === hover ? 0 : active && near(i) ? 1 : nodes[i].kind === "group" ? 2 : nodes[i].kind === "project" ? 3 : 4;
            const order = nodes.map((_, i) => i).sort((a, b) => priority(a) - priority(b));
            for (const i of order) {
                const node = nodes[i];
                const on = near(i);
                if (compact && node.kind === "tech" && !(active && on))
                    continue;
                const size = node.kind === "group" ? (compact ? 16 : 21) : node.kind === "project" ? (compact ? 15 : 19) : 12;
                ctx.font = `${node.kind === "group" ? "italic " : ""}${size}px ${node.kind === "tech" ? c.mono : c.serif}`;
                const width = ctx.measureText(node.label).width + 10;
                const height = size * 1.25 + 6;
                const off = node.r + 9;
                const x = node.ax;
                const y = node.ay;
                const candidates = [];
                for (const shift of [0, -20, 20, -40, 40, -64, 64, -90, 90]) {
                    candidates.push([x + off, y - height / 2 + shift]);
                    candidates.push([x - off - width, y - height / 2 + shift]);
                    candidates.push([x - width / 2, y - off - height + shift]);
                    candidates.push([x - width / 2, y + off + shift]);
                }
                const fits = (box) => box.x >= 4 && box.y >= 4 && box.x + box.w <= this.w - 4 && box.y + box.h <= this.h - 4 &&
                    !this.labels.some((b) => box.x < b.x + b.w + 5 && box.x + box.w + 5 > b.x && box.y < b.y + b.h + 4 && box.y + box.h + 4 > b.y) &&
                    !nodes.some((n) => n.ax + n.r + 8 > box.x && n.ax - n.r - 8 < box.x + box.w && n.ay + n.r + 8 > box.y && n.ay - n.r - 8 < box.y + box.h);
                let box = candidates.map(([x, y]) => ({ x, y, w: width, h: height, index: i })).find(fits);
                if (!box && i === hover) {
                    // Reserve a readable location for the selected label even in
                    // a dense mobile cluster. Colour identifies its selected node.
                    const open = [];
                    for (let y = 6; y + height <= this.h - 6; y += 12)
                        for (let x = 6; x + width <= this.w - 6; x += 12) {
                            const candidate = { x, y, w: width, h: height, index: i };
                            if (fits(candidate)) open.push(candidate);
                        }
                    open.sort((a, b) => Math.hypot(a.x + width / 2 - node.x, a.y + height / 2 - node.y) - Math.hypot(b.x + width / 2 - node.x, b.y + height / 2 - node.y));
                    box = open[0];
                }
                // Omit a crowded peripheral label instead of ever drawing over text.
                if (!box)
                    continue;
                this.labels.push({ ...box, font: ctx.font });
            }
            this.labelKey = labelKey;
        }
        for (const box of this.labels) {
            const i = box.index;
            const node = nodes[i];
            const on = near(i);
            ctx.font = box.font;
            ctx.globalAlpha = on ? (node.kind === "tech" && !active ? 0.66 : 1) : 0.12;
            ctx.fillStyle = c.ink;
            ctx.fillRect(box.x, box.y, box.w, box.h);
            ctx.fillStyle = node.kind === "project" || i === hover ? c.signal : c.paper;
            ctx.textBaseline = "middle";
            ctx.textAlign = "left";
            ctx.fillText(node.label, box.x + 5, box.y + box.h / 2);
        }
        ctx.globalAlpha = 1;
    }
}
