import { FULLSCREEN_VERT, createGL, createProgram, fitCanvas, fullscreenTriangle, uniformLocations } from "./gl.js";
import { prefersReducedMotion } from "./motion.js";
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uPtr;
uniform float uTime;
uniform vec3 uLine;
varying vec2 vUv;

vec2 hash(vec2 p){
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1. + 2. * fract(sin(p) * 43758.5453);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  return mix(mix(dot(hash(i), f), dot(hash(i + vec2(1., 0.)), f - vec2(1., 0.)), u.x),
             mix(dot(hash(i + vec2(0., 1.)), f - vec2(0., 1.)), dot(hash(i + vec2(1., 1.)), f - vec2(1.)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0., a = .5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= .5; }
  return v;
}
void main(){
  vec2 px = gl_FragCoord.xy / uRes.y;
  vec2 m = uPtr * vec2(uRes.x / uRes.y, 1.);
  float d = distance(px, m);
  float lift = exp(-d * d * 6.) * .16;
  vec2 q = px * 1.25 + vec2(uTime * .018, -uTime * .012);
  vec2 w = vec2(fbm(q + 3.1), fbm(q - 1.7));
  float f = fbm(q + w * .6) + lift;
  float line = 1. - smoothstep(0., .055, abs(fract(f * 7.) - .5));
  float band = .3 + .7 * smoothstep(.15, .85, fbm(q * .5 + 9.));
  float a = line * band * .4;
  gl_FragColor = vec4(uLine * a, a);
}`;
const UNIFORMS = ["uRes", "uPtr", "uTime", "uLine"];
/** Slowly drifting topographic lines that lift toward the pointer. Used as a quiet backdrop. */
export class Contours {
    constructor(canvas, line) {
        this.prog = null;
        this.buf = null;
        this.ptr = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
        this.raf = 0;
        this.running = false;
        this.visible = true;
        this.t0 = performance.now();
        this.reduce = prefersReducedMotion();
        this.ro = null;
        this.tick = () => {
            if (!this.running)
                return;
            this.raf = requestAnimationFrame(this.tick);
            this.ptr.x += (this.ptr.tx - this.ptr.x) * 0.05;
            this.ptr.y += (this.ptr.ty - this.ptr.y) * 0.05;
            this.draw();
        };
        this.canvas = canvas;
        this.line = line;
        this.gl = createGL(canvas, { premultipliedAlpha: true });
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
        gl.clearColor(0, 0, 0, 0);
        this.ro = new ResizeObserver(() => {
            fitCanvas(canvas, 1.25);
            if (this.reduce || !this.running)
                this.draw();
        });
        this.ro.observe(canvas);
        fitCanvas(canvas, 1.25);
        this.draw();
    }
    start() {
        if (!this.ok || this.reduce || this.running || !this.visible)
            return;
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
    /** Pointer as 0..1 within the canvas (y from the top). */
    setPointer(x, y) {
        this.ptr.tx = x;
        this.ptr.ty = 1 - y;
    }
    dispose() {
        this.running = false;
        cancelAnimationFrame(this.raf);
        this.ro?.disconnect();
        const gl = this.gl;
        if (!gl)
            return;
        if (this.buf)
            gl.deleteBuffer(this.buf);
        if (this.prog)
            gl.deleteProgram(this.prog);
    }
    draw() {
        const gl = this.gl;
        if (!gl)
            return;
        const { u } = this;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
        gl.uniform2f(u.uPtr, this.ptr.x, this.ptr.y);
        gl.uniform1f(u.uTime, this.reduce ? 12 : (performance.now() - this.t0) / 1000);
        gl.uniform3f(u.uLine, ...this.line);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}
