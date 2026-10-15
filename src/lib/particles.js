import { clamp, easeOutCubic, mulberry32, prefersReducedMotion } from "./motion.js";
import { createGL, createProgram, fitCanvas, uniformLocations } from "./gl.js";
const VERT = `
attribute vec2 aPos;
attribute float aSeed;
uniform vec2 uRes;
uniform vec2 uPointer;
uniform float uDpr, uSize, uFocus;
varying float vFocus;
varying float vSeed;
void main(){
  vec2 clip = vec2(aPos.x / uRes.x * 2. - 1., 1. - aPos.y / uRes.y * 2.);
  gl_Position = vec4(clip, 0., 1.);
  float d = distance(aPos, uPointer);
  vFocus = exp(-(d * d) / (2. * uFocus * uFocus));
  vSeed = aSeed;
  gl_PointSize = uSize * (.72 + .56 * aSeed + .9 * vFocus) * uDpr;
}`;
const FRAG = `
precision mediump float;
uniform vec3 uInk;
uniform vec3 uSignal;
uniform float uAlpha;
varying float vFocus;
varying float vSeed;
void main(){
  float r = length(gl_PointCoord - .5) * 2.;
  float a = 1. - smoothstep(.62, 1., r);
  vec3 col = mix(uInk, uSignal, smoothstep(.12, .75, vFocus));
  a *= uAlpha * (.62 + .38 * vSeed);
  gl_FragColor = vec4(col * a, a);
}`;
const UNIFORMS = ["uRes", "uPointer", "uDpr", "uSize", "uFocus", "uInk", "uSignal", "uAlpha"];
/**
 * A cloud of particles that estimates a piece of text, like a particle filter
 * converging on a pose. Particles start scattered, converge on the text, get
 * shoved by the pointer and recover, and disperse as `setDisperse` rises.
 */
export class ParticleField {
    constructor(canvas, opts) {
        this.prog = null;
        this.posBuf = null;
        this.seedBuf = null;
        this.w = 0;
        this.h = 0;
        this.dpr = 1;
        this.n = 0;
        this.pos = new Float32Array(0);
        this.base = new Float32Array(0);
        this.vel = new Float32Array(0);
        this.home = new Float32Array(0);
        this.dir = new Float32Array(0);
        this.ptr = { x: 0, y: 0, sx: 0, sy: 0, vx: 0, vy: 0, active: false, seen: false };
        this.time = 0;
        this.last = 0;
        this.frame = 0;
        this.raf = 0;
        this.running = false;
        this.visible = true;
        this.disperse = 0;
        this.fade = 1;
        this.resizeTimer = 0;
        this.ro = null;
        this.tick = (now) => {
            if (!this.running)
                return;
            this.raf = requestAnimationFrame(this.tick);
            const dt = Math.min(0.033, (now - this.last) / 1000 || 0.016);
            this.last = now;
            this.time += dt;
            this.step(dt);
            this.draw();
        };
        this.canvas = canvas;
        this.opts = opts;
        this.reduce = prefersReducedMotion();
        this.gl = createGL(canvas);
        const gl = this.gl;
        const prog = gl ? createProgram(gl, VERT, FRAG) : null;
        this.ok = !!(gl && prog);
        if (!gl || !prog)
            return;
        this.prog = prog;
        gl.useProgram(prog);
        this.u = uniformLocations(gl, prog, UNIFORMS);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0, 0, 0, 0);
        this.layout(true);
        this.ro = new ResizeObserver(() => {
            window.clearTimeout(this.resizeTimer);
            this.resizeTimer = window.setTimeout(() => this.layout(false), 120);
        });
        this.ro.observe(canvas);
    }
    /** Re-scatters the cloud and plays the convergence again. */
    play() {
        if (!this.ok)
            return;
        this.time = 0;
        this.scatter();
        if (this.reduce)
            this.settle();
        this.ensureLoop();
    }
    start() {
        if (!this.ok)
            return;
        if (this.reduce) {
            this.settle();
            return;
        }
        this.running = true;
        this.last = performance.now();
        this.raf = requestAnimationFrame(this.tick);
    }
    stop() {
        this.running = false;
        cancelAnimationFrame(this.raf);
    }
    setVisible(visible) {
        this.visible = visible;
        if (visible)
            this.ensureLoop();
        else
            this.stop();
    }
    /** 0 keeps the text intact, 1 dissolves it into dust. */
    setDisperse(v) {
        this.disperse = clamp(v);
        if (this.reduce)
            this.draw();
    }
    setFade(v) {
        this.fade = clamp(v);
        if (this.reduce)
            this.draw();
    }
    setColors(ink, signal) {
        this.opts.ink = ink;
        this.opts.signal = signal;
        if (this.reduce)
            this.draw();
    }
    /** Pointer position in canvas-local CSS pixels, or null when it has left. */
    setPointer(x, y) {
        const p = this.ptr;
        if (x === null || y === undefined) {
            p.active = false;
            return;
        }
        p.x = x;
        p.y = y;
        p.active = true;
    }
    /** A one-off shockwave from a point, used for taps and clicks. */
    pulse(x, y, strength = 16) {
        const R = (this.opts.focus ?? 96) * 2.6;
        for (let i = 0; i < this.n; i++) {
            const dx = this.pos[i * 2] - x;
            const dy = this.pos[i * 2 + 1] - y;
            const d = Math.hypot(dx, dy);
            if (d > R)
                continue;
            const f = (1 - d / R) ** 2 * strength;
            this.vel[i * 2] += (dx / (d + 0.001)) * f;
            this.vel[i * 2 + 1] += (dy / (d + 0.001)) * f;
        }
        this.ensureLoop();
    }
    dispose() {
        this.stop();
        window.clearTimeout(this.resizeTimer);
        this.ro?.disconnect();
        const gl = this.gl;
        if (!gl)
            return;
        if (this.posBuf)
            gl.deleteBuffer(this.posBuf);
        if (this.seedBuf)
            gl.deleteBuffer(this.seedBuf);
        if (this.prog)
            gl.deleteProgram(this.prog);
    }
    ensureLoop() {
        if (!this.ok || this.reduce || !this.visible)
            return;
        if (this.running)
            return;
        this.start();
    }
    autoCount(w, h) {
        return Math.round(clamp((w * h) / 80, 5000, 18000));
    }
    layout(first) {
        const gl = this.gl;
        if (!gl)
            return;
        const cw = this.canvas.clientWidth;
        const ch = this.canvas.clientHeight;
        if (cw < 8 || ch < 8)
            return;
        if (!first && cw === this.w && ch === this.h && this.dpr === Math.min(window.devicePixelRatio || 1, this.opts.dprCap ?? 2))
            return;
        const { w, h, dpr } = fitCanvas(this.canvas, this.opts.dprCap ?? 2);
        this.w = w;
        this.h = h;
        this.dpr = dpr;
        const init = first || this.n === 0;
        if (init) {
            this.n = this.opts.count ?? this.autoCount(w, h);
            this.pos = new Float32Array(this.n * 2);
            this.base = new Float32Array(this.n * 2);
            this.vel = new Float32Array(this.n * 2);
            this.home = new Float32Array(this.n * 2);
            this.dir = new Float32Array(this.n * 2);
            const rnd = mulberry32(7);
            const seeds = new Float32Array(this.n);
            for (let i = 0; i < this.n; i++) {
                seeds[i] = rnd();
                // Sum of two uniforms gives a softer, bell-shaped scatter direction.
                this.dir[i * 2] = rnd() + rnd() - 1;
                this.dir[i * 2 + 1] = rnd() + rnd() - 1;
            }
            this.posBuf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuf);
            gl.bufferData(gl.ARRAY_BUFFER, this.pos, gl.DYNAMIC_DRAW);
            const aPos = gl.getAttribLocation(this.prog, "aPos");
            gl.enableVertexAttribArray(aPos);
            gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
            this.seedBuf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.seedBuf);
            gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
            const aSeed = gl.getAttribLocation(this.prog, "aSeed");
            gl.enableVertexAttribArray(aSeed);
            gl.vertexAttribPointer(aSeed, 1, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuf);
        }
        this.assignHomes();
        if (init)
            this.scatter();
        else {
            this.base.set(this.home);
            this.pos.set(this.home);
            this.vel.fill(0);
        }
        if (this.reduce)
            this.settle();
    }
    /** Renders the target text offscreen and picks a home on a text pixel for every particle. */
    assignHomes() {
        const { w, h } = this;
        const { family } = this.opts;
        const lines = typeof this.opts.lines === "function" ? this.opts.lines(w, h) : this.opts.lines;
        const weight = this.opts.weight ?? 800;
        const fit = this.opts.fit ?? 0.92;
        const maxBlock = this.opts.maxBlock ?? 0.7;
        const insets = this.opts.insets?.(w, h) ?? { top: 0, bottom: 0 };
        const availableHeight = Math.max(1, h - insets.top - insets.bottom);
        const c = document.createElement("canvas");
        c.width = Math.round(w);
        c.height = Math.round(h);
        const ctx = c.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
            this.ok = false;
            return;
        }
        const base = 100;
        ctx.font = `${weight} ${base}px ${family}`;
        const widest = Math.max(...lines.map((l) => ctx.measureText(l).width), 1);
        let size = (base * fit * w) / widest;
        const lineGap = 0.94;
        const probe = ctx.measureText(lines[0]);
        const capRatio = (probe.actualBoundingBoxAscent || base * 0.72) / base;
        const block = (lines.length - 1) * size * lineGap + size * capRatio;
        if (block > maxBlock * availableHeight)
            size *= (maxBlock * availableHeight) / block;
        ctx.font = `${weight} ${size}px ${family}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#000";
        const cap = size * capRatio;
        const total = (lines.length - 1) * size * lineGap + cap;
        const firstBase = insets.top + (availableHeight - total) / 2 + cap;
        lines.forEach((l, i) => ctx.fillText(l, w / 2, firstBase + i * size * lineGap));
        const step = 2;
        const data = ctx.getImageData(0, 0, c.width, c.height).data;
        const cand = [];
        for (let y = 0; y < c.height; y += step) {
            const row = y * c.width;
            for (let x = 0; x < c.width; x += step) {
                if (data[(row + x) * 4 + 3] > 110)
                    cand.push(x, y);
            }
        }
        const m = cand.length / 2;
        if (m === 0)
            return;
        const rnd = mulberry32(31);
        const order = new Uint32Array(m);
        for (let i = 0; i < m; i++)
            order[i] = i;
        for (let i = m - 1; i > 0; i--) {
            const j = (rnd() * (i + 1)) | 0;
            const t = order[i];
            order[i] = order[j];
            order[j] = t;
        }
        for (let i = 0; i < this.n; i++) {
            const j = i < m ? order[i] : (rnd() * m) | 0;
            this.home[i * 2] = cand[j * 2] + (rnd() - 0.5) * step;
            this.home[i * 2 + 1] = cand[j * 2 + 1] + (rnd() - 0.5) * step;
        }
    }
    scatter() {
        const rnd = mulberry32(Math.floor(performance.now()) % 9973);
        for (let i = 0; i < this.n; i++) {
            this.pos[i * 2] = rnd() * this.w;
            this.pos[i * 2 + 1] = rnd() * this.h;
            this.vel[i * 2] = 0;
            this.vel[i * 2 + 1] = 0;
        }
        this.base.set(this.pos);
    }
    settle() {
        this.pos.set(this.home);
        this.base.set(this.home);
        this.vel.fill(0);
        this.draw();
        this.opts.onReadout?.({ n: this.n, sigma: 0, settled: true });
    }
    step(dt) {
        const { pos, base, vel, home, dir, n, ptr: p } = this;
        const k = dt * 60;
        const conv = easeOutCubic((this.time - 0.1) / 2.4);
        const disp = this.disperse;
        const spring = (0.01 + 0.075 * conv) * (1 - 0.55 * disp);
        const damp = Math.pow(0.84, k);
        const reach = Math.min(this.w, this.h) * 0.6 * Math.pow(disp, 1.2);
        // The text itself converges without inertia. Pointer impulses retain their
        // own spring so hover, dragging and click waves still feel responsive.
        const converge = 1 - Math.exp(-(1.4 + 6 * conv) * dt);
        const focus = this.opts.focus ?? 96;
        const R = focus * 1.15;
        const R2 = R * R;
        const push = 2.6;
        const drag = 0.16;
        let pvx = 0;
        let pvy = 0;
        if (p.active) {
            if (!p.seen) {
                p.sx = p.x;
                p.sy = p.y;
                p.seen = true;
            }
            const nx = p.sx + (p.x - p.sx) * 0.4;
            const ny = p.sy + (p.y - p.sy) * 0.4;
            pvx = clamp(nx - p.sx, -30, 30);
            pvy = clamp(ny - p.sy, -30, 30);
            p.sx = nx;
            p.sy = ny;
        }
        else {
            p.seen = false;
        }
        let err = 0;
        for (let i = 0; i < n; i++) {
            const ix = i * 2;
            const iy = ix + 1;
            const x = pos[ix];
            const y = pos[iy];
            const hx = home[ix];
            const hy = home[iy];
            const tx = hx + dir[ix] * reach;
            const ty = hy + dir[iy] * reach;
            const ox = x - base[ix];
            const oy = y - base[iy];
            base[ix] += (tx - base[ix]) * converge;
            base[iy] += (ty - base[iy]) * converge;
            let ax = -ox * spring;
            let ay = -oy * spring;
            if (p.active) {
                const dx = x - p.sx;
                const dy = y - p.sy;
                const d2 = dx * dx + dy * dy;
                if (d2 < R2) {
                    const d = Math.sqrt(d2) + 0.001;
                    let f = 1 - d / R;
                    f *= f;
                    ax += (dx / d) * push * f + pvx * drag * f;
                    ay += (dy / d) * push * f + pvy * drag * f;
                }
            }
            const vx = (vel[ix] + ax * k) * damp;
            const vy = (vel[iy] + ay * k) * damp;
            vel[ix] = vx;
            vel[iy] = vy;
            pos[ix] = base[ix] + ox + vx * k;
            pos[iy] = base[iy] + oy + vy * k;
            const ex = hx - x;
            const ey = hy - y;
            err += ex * ex + ey * ey;
        }
        this.frame++;
        if (this.frame % 8 === 0 && this.opts.onReadout) {
            const sigma = Math.sqrt(err / n);
            this.opts.onReadout({ n, sigma, settled: conv > 0.98 && sigma < 3 && disp < 0.05 });
        }
    }
    draw() {
        const gl = this.gl;
        if (!gl || !this.prog || this.n === 0)
            return;
        const { u } = this;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuf);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.pos);
        gl.uniform2f(u.uRes, this.w, this.h);
        const p = this.ptr;
        gl.uniform2f(u.uPointer, p.active ? p.sx : -9999, p.active ? p.sy : -9999);
        gl.uniform1f(u.uDpr, this.dpr);
        gl.uniform1f(u.uSize, this.opts.size ?? 2.15);
        gl.uniform1f(u.uFocus, this.opts.focus ?? 96);
        gl.uniform3f(u.uInk, ...this.opts.ink);
        gl.uniform3f(u.uSignal, ...this.opts.signal);
        gl.uniform1f(u.uAlpha, (1 - this.disperse * 0.85) * this.fade);
        gl.drawArrays(gl.POINTS, 0, this.n);
    }
}
