"use client";
import { useEffect, useRef } from "react";
import { build, mat, type Kind } from "@/lib/geometry";

const VS = `attribute vec3 p;uniform mat4 m;uniform float k;void main(){gl_Position=m*vec4(p,1.);gl_PointSize=k/gl_Position.w;}`;
const FS = `precision mediump float;uniform vec4 c;uniform float pt;void main(){if(pt>.5&&length(gl_PointCoord-.5)>.5)discard;gl_FragColor=c;}`;

export default function Scene3D({ kind, className = "" }: { kind: Kind; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const gl = c.getContext("webgl", { premultipliedAlpha: false });
    if (!gl) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sh = (t: number, s: string) => {
      const x = gl.createShader(t)!;
      gl.shaderSource(x, s);
      gl.compileShader(x);
      return x;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const geo = build(kind);
    const lines = new Float32Array(geo.lines);
    const pts = new Float32Array(geo.points);
    const mk = (d: Float32Array) => {
      const b = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, d, gl.DYNAMIC_DRAW);
      return b;
    };
    const lb = mk(lines), pb = mk(pts);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    const [uM, uC, uP, uK] = ["m", "c", "pt", "k"].map((n) => gl.getUniformLocation(prog, n));

    let dpr = 1, vis = true, ry = 0.5, tx = 0, ty = 0, nx = 0.5, ny = 0.5, col = [0.18, 0.36, 1], tick = 0;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
      gl.viewport(0, 0, c.width, c.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting));
    io.observe(c);
    const move = (e: PointerEvent) => {
      nx = e.clientX / innerWidth;
      ny = e.clientY / innerHeight;
    };
    addEventListener("pointermove", move);
    const accent = () => {
      const h = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim().replace("#", "");
      if (h.length === 6) col = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    };

    const step = () => {
      const b = c.getBoundingClientRect();
      const asp = b.width / b.height;
      const cl = (v: number) => Math.max(-1.3, Math.min(1.3, v));
      const gx = cl(((nx * innerWidth - b.left) / b.width) * 2 - 1) * 2.96 * asp;
      const gy = cl(-(((ny * innerHeight - b.top) / b.height) * 2 - 1)) * 2.96;
      const N = pts.length / 3;
      const d2 = (i: number) => (gx - pts[i * 3]) ** 2 + (gy - pts[i * 3 + 1]) ** 2 + pts[i * 3 + 2] ** 2;
      for (let i = 0; i < N; i++) {
        const o = i * 3;
        const w = Math.exp(-d2(i) / 2.5);
        const pull = 0.004 + 0.03 * w;
        pts[o] += (gx - pts[o]) * pull + (Math.random() - 0.5) * 0.04 * (1.2 - w);
        pts[o + 1] += (gy - pts[o + 1]) * pull + (Math.random() - 0.5) * 0.04 * (1.2 - w);
        pts[o + 2] += -pts[o + 2] * pull * 0.5 + (Math.random() - 0.5) * 0.04 * (1.2 - w);
        if (Math.random() < 0.015) {
          const a = (Math.random() * N) | 0, q = (Math.random() * N) | 0, s = d2(a) < d2(q) ? a : q;
          for (let k = 0; k < 3; k++) pts[o + k] = pts[s * 3 + k] + (Math.random() - 0.5) * 0.1;
        }
      }
    };

    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!vis) return;
      if (tick++ % 30 === 0) accent();
      const particles = kind === "particles";
      if (particles && !reduce) step();
      if (!particles && !reduce) ry += 0.0035;
      tx += ((ny - 0.5) * 0.4 - tx) * 0.05;
      ty += ((nx - 0.5) * 0.8 - ty) * 0.05;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(uM, false, mat(particles ? 0 : ry + ty, particles ? 0 : -0.35 + tx, c.width / c.height, 7));
      if (lines.length) {
        gl.bindBuffer(gl.ARRAY_BUFFER, lb);
        gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
        gl.uniform1f(uP, 0);
        gl.uniform4f(uC, col[0], col[1], col[2], 0.5);
        gl.drawArrays(gl.LINES, 0, lines.length / 3);
      }
      if (pts.length) {
        gl.bindBuffer(gl.ARRAY_BUFFER, pb);
        if (particles) gl.bufferData(gl.ARRAY_BUFFER, pts, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
        gl.uniform1f(uP, 1);
        gl.uniform1f(uK, (particles ? 20 : 34) * dpr);
        gl.uniform4f(uC, col[0], col[1], col[2], 0.9);
        gl.drawArrays(gl.POINTS, 0, pts.length / 3);
      }
    };
    frame();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      removeEventListener("pointermove", move);
    };
  }, [kind]);

  return <canvas ref={ref} className={className} role="img" aria-label={`Interactive 3D ${kind} visual`} />;
}
