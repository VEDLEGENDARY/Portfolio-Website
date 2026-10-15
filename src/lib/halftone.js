import { FULLSCREEN_VERT, createGL, createProgram, createTexture, fitCanvas, fullscreenTriangle, uniformLocations, } from "./gl.js";
import { clamp, easeInOutCubic, prefersReducedMotion } from "./motion.js";
const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uPtr;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform float uDpr, uImgA, uResolve, uDisturb, uRadius, uCell;
varying vec2 vUv;

float luma(vec3 c){ return dot(c, vec3(.299, .587, .114)); }
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

vec2 cover(vec2 px){
  vec2 uv = px / uRes;
  float ca = uRes.x / uRes.y;
  if (uImgA > ca) uv.x = (uv.x - .5) * ca / uImgA + .5; else uv.y = (uv.y - .5) * uImgA / ca + .5;
  return clamp(uv, 0., 1.);
}

void main(){
  vec2 px = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;

  // Dot grid rotated 45 degrees, like a printed halftone screen.
  float a = .7853982;
  float ca = cos(a);
  float sa = sin(a);
  vec2 g = vec2(ca * px.x + sa * px.y, -sa * px.x + ca * px.y) / uCell;
  vec2 cell = floor(g) + .5;
  vec2 cg = cell * uCell;
  vec2 cpx = vec2(ca * cg.x - sa * cg.y, sa * cg.x + ca * cg.y);

  vec3 cc = texture2D(uTex, cover(cpx)).rgb;
  float l = pow(luma(cc), .85);
  float rad = uCell * .74 * sqrt(l);
  float d = length(g - cell) * uCell;
  float dotMask = 1. - smoothstep(rad - .8, rad + .8, d);
  vec3 tone = mix(uInk, mix(uPaper, cc * 1.25, .45), dotMask);

  vec3 photo = texture2D(uTex, cover(px)).rgb;

  float dp = distance(px, uPtr);
  float local = exp(-(dp * dp) / (2. * uRadius * uRadius));
  float k = uResolve - uDisturb * local + (hash(cell) - .5) * .55 * (1. - uResolve + uDisturb * local);
  gl_FragColor = vec4(mix(tone, photo, smoothstep(.35, .65, k)), 1.);
}`;
const UNIFORMS = ["uTex", "uRes", "uPtr", "uInk", "uPaper", "uDpr", "uImgA", "uResolve", "uDisturb", "uRadius", "uCell"];
/**
 * Renders an image as a halftone that resolves into the real photo. Moving the
 * pointer across it perturbs the area under the cursor, which then recovers.
 */
export class Halftone {
    constructor(canvas, colors) {
        this.prog = null;
        this.buf = null;
        this.tex = null;
        this.aspect = 1;
        this.w = 1;
        this.h = 1;
        this.dpr = 1;
        this.resolve = 0;
        this.resolveFrom = 0;
        this.resolveTarget = 0;
        this.resolveStart = 0;
        this.disturb = 0;
        this.ptr = { x: -9999, y: -9999, sx: -9999, sy: -9999, active: false, speed: 0 };
        this.raf = 0;
        this.running = false;
        this.visible = true;
        this.ro = null;
        this.loaded = false;
        this.tick = (now) => {
            if (!this.running)
                return;
            const p = this.ptr;
            if (this.resolve !== this.resolveTarget) {
                const t = clamp((now - this.resolveStart) / 2400);
                this.resolve = this.resolveFrom + (this.resolveTarget - this.resolveFrom) * easeInOutCubic(t);
                if (t >= 1)
                    this.resolve = this.resolveTarget;
            }
            if (p.active) {
                const nx = p.sx + (p.x - p.sx) * 0.3;
                const ny = p.sy + (p.y - p.sy) * 0.3;
                p.speed += (Math.hypot(nx - p.sx, ny - p.sy) - p.speed) * 0.2;
                p.sx = nx;
                p.sy = ny;
            }
            else {
                p.speed *= 0.9;
            }
            const target = p.active ? clamp(0.5 + p.speed * 0.05, 0, 0.95) : 0;
            this.disturb += (target - this.disturb) * 0.1;
            if (!p.active && this.disturb < 0.004)
                this.disturb = 0;
            this.draw();
            if (this.busy() && this.visible)
                this.raf = requestAnimationFrame(this.tick);
            else
                this.running = false;
        };
        this.canvas = canvas;
        this.colors = colors;
        this.reduce = prefersReducedMotion();
        this.gl = createGL(canvas, { premultipliedAlpha: false });
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
        gl.uniform1i(this.u.uTex, 0);
        this.ro = new ResizeObserver(() => {
            this.measure();
            this.wake();
        });
        this.ro.observe(canvas);
        this.measure();
    }
    setImage(source, width, height) {
        const gl = this.gl;
        if (!gl)
            return;
        this.tex = createTexture(gl, source);
        this.aspect = width / Math.max(1, height);
        this.loaded = true;
        if (this.reduce)
            this.resolve = this.resolveTarget = 1;
        this.wake();
    }
    /** Dissolves from the dot matrix into the photo. */
    play() {
        if (this.reduce) {
            this.resolve = this.resolveTarget = 1;
        }
        else {
            this.resolve = this.resolveFrom = 0;
            this.resolveTarget = 1;
            this.resolveStart = performance.now();
        }
        this.wake();
    }
    setVisible(v) {
        this.visible = v;
        if (v)
            this.wake();
    }
    /** Pointer position in canvas-local CSS pixels, or null when it leaves. */
    setPointer(x, y) {
        if (this.reduce)
            return;
        const p = this.ptr;
        if (x === null || y === undefined) {
            p.active = false;
        }
        else {
            if (!p.active) {
                p.sx = x;
                p.sy = y;
            }
            p.x = x;
            p.y = y;
            p.active = true;
        }
        this.wake();
    }
    dispose() {
        this.running = false;
        cancelAnimationFrame(this.raf);
        this.ro?.disconnect();
        const gl = this.gl;
        if (!gl)
            return;
        if (this.tex)
            gl.deleteTexture(this.tex);
        if (this.buf)
            gl.deleteBuffer(this.buf);
        if (this.prog)
            gl.deleteProgram(this.prog);
    }
    measure() {
        if (!this.gl)
            return;
        const { w, h, dpr } = fitCanvas(this.canvas, 2);
        this.w = w;
        this.h = h;
        this.dpr = dpr;
    }
    busy() {
        return (this.resolve !== this.resolveTarget || this.disturb > 0.004 || this.ptr.active);
    }
    wake() {
        if (!this.ok || !this.loaded || !this.visible)
            return;
        if (this.reduce || !this.busy()) {
            this.draw();
            return;
        }
        if (this.running)
            return;
        this.running = true;
        this.raf = requestAnimationFrame(this.tick);
    }
    draw() {
        const gl = this.gl;
        if (!gl || !this.tex)
            return;
        const { u, ptr: p } = this;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.uniform2f(u.uRes, this.w, this.h);
        gl.uniform2f(u.uPtr, p.active ? p.sx : -9999, p.active ? p.sy : -9999);
        gl.uniform3f(u.uInk, ...this.colors.ink);
        gl.uniform3f(u.uPaper, ...this.colors.paper);
        gl.uniform1f(u.uDpr, this.dpr);
        gl.uniform1f(u.uImgA, this.aspect);
        gl.uniform1f(u.uResolve, this.resolve);
        gl.uniform1f(u.uDisturb, this.disturb);
        gl.uniform1f(u.uRadius, 60 + p.speed * 4);
        gl.uniform1f(u.uCell, Math.max(5, Math.round(this.w / 62)));
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}
