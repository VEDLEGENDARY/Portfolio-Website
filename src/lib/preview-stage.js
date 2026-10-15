import { FULLSCREEN_VERT, createGL, createProgram, createTexture, fitCanvas, fullscreenTriangle, uniformLocations, } from "./gl.js";
import { clamp, easeInOutCubic, easeOutCubic } from "./motion.js";
// Note: GLSL ES 1.00 reserves words like `half`, so the plane half-size is `hs`.
const FRAG = `
precision highp float;
uniform sampler2D uT0;
uniform sampler2D uT1;
uniform vec2 uCanvas;
uniform vec2 uPlane;
uniform vec2 uAsp;
uniform vec2 uVel;
uniform float uMix, uReveal, uAngle, uTime;
varying vec2 vUv;

vec3 pick(vec2 uv, float planeA){
  vec2 u0 = uv;
  vec2 u1 = uv;
  float a0 = uAsp.x;
  float a1 = uAsp.y;
  if (a0 > planeA) u0.x = (uv.x - .5) * planeA / a0 + .5; else u0.y = (uv.y - .5) * a0 / planeA + .5;
  if (a1 > planeA) u1.x = (uv.x - .5) * planeA / a1 + .5; else u1.y = (uv.y - .5) * a1 / planeA + .5;
  return mix(texture2D(uT0, clamp(u0, 0., 1.)).rgb, texture2D(uT1, clamp(u1, 0., 1.)).rgb, uMix);
}

void main(){
  vec2 p = (vec2(vUv.x, 1. - vUv.y) - .5) * uCanvas;
  float c = cos(uAngle);
  float s = sin(uAngle);
  p = vec2(c * p.x + s * p.y, -s * p.x + c * p.y);

  float sc = mix(.88, 1., uReveal);
  vec2 hs = uPlane * .5 * sc;
  float r = 14.;
  vec2 q = abs(p) - hs + r;
  float sd = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r;
  float edge = 1. - smoothstep(-1., 1., sd);
  if (edge <= 0.) { gl_FragColor = vec4(0.); return; }

  vec2 uv = p / (hs * 2.) + .5;
  float pa = uPlane.x / uPlane.y;
  float sp = length(uVel);
  vec2 dir = sp > .001 ? uVel / sp : vec2(0.);
  float amt = clamp(sp / 30., 0., 1.);
  float wave = .35 + .65 * amt;
  uv.x += sin(uv.y * 7. + uTime * 1.6) * .007 * wave + sin(uv.y * 15. - uTime * 2.4) * .002 * wave;
  uv.y += sin(uv.x * 7. + uTime * 1.3) * .005 * wave;
  vec2 split = dir * amt * .014 / vec2(pa, 1.);

  vec3 col = vec3(pick(uv + split, pa).r, pick(uv, pa).g, pick(uv - split, pa).b);
  float alpha = edge * smoothstep(0., .5, uReveal);
  gl_FragColor = vec4(col * alpha, alpha);
}`;
const UNIFORMS = ["uT0", "uT1", "uCanvas", "uPlane", "uAsp", "uVel", "uMix", "uReveal", "uAngle", "uTime"];
function dims(src) {
    if (src instanceof HTMLImageElement)
        return [src.naturalWidth, src.naturalHeight];
    const s = src;
    return [s.width, s.height];
}
/**
 * A card that follows the pointer and shows the hovered project, with a wave
 * and RGB split that respond to how fast the pointer moves. It only draws
 * while visible, so it costs nothing when idle.
 */
export class PreviewStage {
    constructor(canvas, loaders) {
        this.prog = null;
        this.buf = null;
        this.from = 0;
        this.to = -1;
        this.want = -1;
        this.mix = 1;
        this.reveal = 0;
        this.revealTarget = 0;
        this.pos = { x: 0, y: 0 };
        this.slot = { x: 0, w: 360 };
        this.rowY = 0;
        this.ptr = { x: 0, y: 0 };
        this.lastPtr = { x: 0, y: 0 };
        this.vel = { x: 0, y: 0 };
        this.angle = 0;
        this.plane = { w: 360, h: 240 };
        this.box = { w: 470, h: 360 };
        this.time = 0;
        this.last = 0;
        this.raf = 0;
        this.running = false;
        this.tick = (now) => {
            if (!this.running)
                return;
            this.raf = requestAnimationFrame(this.tick);
            const dt = Math.min(0.05, (now - this.last) / 1000 || 0.016);
            this.last = now;
            this.time += dt;
            const k = dt * 60;
            // The card stays in its column and glides to whichever row is hovered.
            const follow = 1 - Math.pow(1 - 0.14, k);
            const tx = this.slot.x + (this.ptr.x - this.slot.x) * 0.02;
            const ty = this.rowY + (this.ptr.y - this.rowY) * 0.06;
            this.pos.x += (tx - this.pos.x) * follow;
            this.pos.y += (ty - this.pos.y) * follow;
            const pvx = this.ptr.x - this.lastPtr.x;
            const pvy = this.ptr.y - this.lastPtr.y;
            this.lastPtr.x = this.ptr.x;
            this.lastPtr.y = this.ptr.y;
            this.vel.x += (pvx - this.vel.x) * 0.15;
            this.vel.y += (pvy - this.vel.y) * 0.15;
            this.angle += (clamp(this.vel.x * 0.006, -0.08, 0.08) - this.angle) * 0.1;
            this.reveal += (this.revealTarget - this.reveal) * (1 - Math.pow(1 - 0.12, k));
            if (this.mix < 1)
                this.mix = Math.min(1, this.mix + dt / 0.5);
            if (this.revealTarget === 0 && this.reveal < 0.003) {
                this.reveal = 0;
                this.running = false;
                const gl = this.gl;
                if (gl) {
                    gl.clear(gl.COLOR_BUFFER_BIT);
                }
                return;
            }
            this.draw();
        };
        this.canvas = canvas;
        this.loaders = loaders;
        this.tex = loaders.map(() => null);
        this.aspect = loaders.map(() => 1.5);
        this.ready = loaders.map(() => false);
        this.loading = loaders.map(() => false);
        this.gl = createGL(canvas);
        const gl = this.gl;
        const prog = gl ? createProgram(gl, FULLSCREEN_VERT, FRAG) : null;
        this.ok = !!(gl && prog);
        if (!gl || !prog)
            return;
        this.prog = prog;
        gl.useProgram(prog);
        this.u = uniformLocations(gl, prog, UNIFORMS);
        this.buf = fullscreenTriangle(gl);
        const aPos = gl.getAttribLocation(prog, "aPos");
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0, 0, 0, 0);
        gl.uniform1i(this.u.uT0, 0);
        gl.uniform1i(this.u.uT1, 1);
        this.measure();
    }
    /** Loads every texture in the background so hover feels instant. */
    prime() {
        this.loaders.forEach((_, i) => this.ensure(i));
    }
    /**
     * Sets the free column the card may use: its centre x and width, in viewport
     * pixels. The card keeps this x and glides vertically between rows.
     */
    setSlot(centerX, width) {
        this.slot = { x: centerX, w: width };
        this.measure();
    }
    /** Shows the card for a project, centred vertically on its row. */
    show(index, rowCenterY, px, py) {
        if (!this.ok)
            return;
        const hidden = this.revealTarget === 0 && this.reveal < 0.02;
        this.rowY = rowCenterY;
        this.ptr.x = px;
        this.ptr.y = py;
        if (hidden) {
            this.pos.x = this.slot.x;
            this.pos.y = rowCenterY;
            this.lastPtr.x = px;
            this.lastPtr.y = py;
            this.vel.x = 0;
            this.vel.y = 0;
        }
        this.revealTarget = 1;
        this.want = index;
        this.ensure(index);
        if (this.ready[index])
            this.switchTo(index, hidden);
        this.ensureLoop();
    }
    move(px, py) {
        this.ptr.x = px;
        this.ptr.y = py;
    }
    hide() {
        this.revealTarget = 0;
        this.want = -1;
    }
    dispose() {
        this.running = false;
        cancelAnimationFrame(this.raf);
        const gl = this.gl;
        if (!gl)
            return;
        this.tex.forEach((t) => t && gl.deleteTexture(t));
        if (this.buf)
            gl.deleteBuffer(this.buf);
        if (this.prog)
            gl.deleteProgram(this.prog);
    }
    measure() {
        const w = clamp(this.slot.w, 200, 440);
        this.plane = { w, h: w / 1.5 };
        this.box = { w: Math.round(w * 1.3), h: Math.round((w / 1.5) * 1.5) };
        this.canvas.style.width = `${this.box.w}px`;
        this.canvas.style.height = `${this.box.h}px`;
        fitCanvas(this.canvas, 1.5);
    }
    ensure(i) {
        if (this.ready[i] || this.loading[i] || !this.gl)
            return;
        this.loading[i] = true;
        this.loaders[i]()
            .then((src) => {
            const gl = this.gl;
            if (!gl)
                return;
            this.tex[i] = createTexture(gl, src);
            const [w, h] = dims(src);
            this.aspect[i] = w / Math.max(1, h);
            this.ready[i] = true;
            if (this.want === i)
                this.switchTo(i, this.to < 0);
        })
            .catch(() => {
            this.loading[i] = false;
        });
    }
    switchTo(i, snap) {
        if (i === this.to)
            return;
        if (snap || this.to < 0) {
            this.from = i;
            this.to = i;
            this.mix = 1;
        }
        else {
            this.from = this.to;
            this.to = i;
            this.mix = 0;
        }
    }
    ensureLoop() {
        if (this.running)
            return;
        this.running = true;
        this.last = performance.now();
        this.raf = requestAnimationFrame(this.tick);
    }
    draw() {
        const gl = this.gl;
        if (!gl || this.to < 0 || !this.tex[this.to])
            return;
        const { u } = this;
        const t0 = this.tex[this.from] ?? this.tex[this.to];
        this.canvas.style.transform = `translate3d(${this.pos.x - this.box.w / 2}px, ${this.pos.y - this.box.h / 2}px, 0)`;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, t0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.tex[this.to]);
        gl.uniform2f(u.uCanvas, this.box.w, this.box.h);
        gl.uniform2f(u.uPlane, this.plane.w, this.plane.h);
        gl.uniform2f(u.uAsp, this.aspect[this.from], this.aspect[this.to]);
        gl.uniform2f(u.uVel, this.vel.x, this.vel.y);
        gl.uniform1f(u.uMix, easeInOutCubic(this.mix));
        gl.uniform1f(u.uReveal, easeOutCubic(this.reveal));
        gl.uniform1f(u.uAngle, this.angle);
        gl.uniform1f(u.uTime, this.time);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}
