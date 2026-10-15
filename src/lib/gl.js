/** Returns a WebGL context, or null when WebGL is unavailable or blocked. */
export function createGL(canvas, attrs = {}) {
    try {
        return canvas.getContext("webgl", {
            alpha: true,
            antialias: false,
            premultipliedAlpha: true,
            powerPreference: "high-performance",
            ...attrs,
        });
    }
    catch {
        return null;
    }
}
function compile(gl, type, src) {
    const shader = gl.createShader(type);
    if (!shader)
        return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
export function createProgram(gl, vertex, fragment) {
    const vs = compile(gl, gl.VERTEX_SHADER, vertex);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog)
        return null;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(prog));
        gl.deleteProgram(prog);
        return null;
    }
    return prog;
}
export function uniformLocations(gl, prog, names) {
    const out = {};
    for (const n of names)
        out[n] = gl.getUniformLocation(prog, n);
    return out;
}
/** One oversized triangle that covers the viewport, so no index buffer is needed. */
export function fullscreenTriangle(gl) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    return buf;
}
export const FULLSCREEN_VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){
  vUv = aPos * .5 + .5;
  gl_Position = vec4(aPos, 0., 1.);
}`;
export function createTexture(gl, source) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    // Works for non power-of-two images in WebGL 1: no mipmaps, clamped edges.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
}
/** Sizes the drawing buffer to the element's CSS size. Returns the CSS size and ratio used. */
export function fitCanvas(canvas, dprCap = 2) {
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    const bw = Math.round(w * dpr);
    const bh = Math.round(h * dpr);
    if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
    }
    return { w, h, dpr };
}
