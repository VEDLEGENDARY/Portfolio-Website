"use client";
import { useEffect, useRef } from "react";

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `
precision highp float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform float s;uniform float d;
vec2 h(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return -1.+2.*fract(sin(p)*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
return mix(mix(dot(h(i),f),dot(h(i+vec2(1,0)),f-vec2(1,0)),u.x),mix(dot(h(i+vec2(0,1)),f-vec2(0,1)),dot(h(i+vec2(1,1)),f-vec2(1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r.y;
  vec2 mm=m*vec2(r.x/r.y,1.);
  float dist=distance(uv,mm);
  float lift=exp(-dist*dist*3.)*.12;
  vec2 q=uv*1.1+vec2(t*.008,-t*.006+s*1.2);
  vec2 w=vec2(fbm(q+3.1),fbm(q-1.7));
  float f=fbm(q+w*.5)+lift;
  float k=f*4.5;
  float line=1.-smoothstep(0.,.45,abs(fract(k)-.5));
  float band=smoothstep(.0,.6,fbm(q*.5+9.));
  vec3 bg=mix(vec3(.914,.933,.961),vec3(.063,.102,.2),d);
  vec3 ink=mix(vec3(.18,.36,1.),vec3(.75,.95,.85),d);
  vec3 col=mix(bg,ink,line*(.1+.07*band+lift*.6));
  gl_FragColor=vec4(col,1.);
}`;

export default function ShaderBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const gl = c.getContext("webgl", { antialias: false });
    if (!gl) return;
    gl.getExtension("OES_standard_derivatives");
    const sh = (type: number, src: string) => {
      const x = gl.createShader(type)!;
      gl.shaderSource(x, src.replace("precision highp float;", "#extension GL_OES_standard_derivatives : enable\nprecision highp float;"));
      gl.compileShader(x);
      return x;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const [uR, uT, uM, uS, uD] = [U("r"), U("t"), U("m"), U("s"), U("d")];

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const st = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, s: 0, ts: 0, d: 0, td: 0 };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = innerWidth * dpr;
      c.height = innerHeight * dpr;
      gl.viewport(0, 0, c.width, c.height);
    };
    const move = (e: PointerEvent) => {
      st.tx = e.clientX / innerWidth;
      st.ty = 1 - e.clientY / innerHeight;
    };
    const scroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      st.ts = max > 0 ? scrollY / max : 0;
      document.documentElement.style.setProperty("--p", String(st.ts));
    };
    const tones = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          const dark = (e.target as HTMLElement).dataset.tone === "dark";
          st.td = dark ? 1 : 0;
          document.documentElement.dataset.sec = (e.target as HTMLElement).id;
          document.documentElement.dataset.tone = dark ? "dark" : "light";
        }),
      { rootMargin: "-50% 0px -50% 0px" }
    );
    document.querySelectorAll("[data-tone]").forEach((el) => tones.observe(el));
    resize();
    scroll();
    addEventListener("resize", resize);
    addEventListener("pointermove", move);
    addEventListener("scroll", scroll, { passive: true });

    let raf = 0;
    const start = performance.now();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      st.x += (st.tx - st.x) * 0.06;
      st.y += (st.ty - st.y) * 0.06;
      st.s += (st.ts - st.s) * 0.08;
      st.d += (st.td - st.d) * 0.06;
      gl.uniform2f(uR, c.width, c.height);
      gl.uniform1f(uT, reduce ? 0 : (performance.now() - start) / 1000);
      gl.uniform2f(uM, st.x, st.y);
      gl.uniform1f(uS, st.s);
      gl.uniform1f(uD, st.d);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      tones.disconnect();
      removeEventListener("resize", resize);
      removeEventListener("pointermove", move);
      removeEventListener("scroll", scroll);
    };
  }, []);

  return <canvas ref={ref} className="shader" aria-hidden="true" />;
}
