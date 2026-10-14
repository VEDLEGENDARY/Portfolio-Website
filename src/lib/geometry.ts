export type Kind = "particles" | "route" | "blocks" | "graph" | "globe" | "lattice" | "rope";
export type Geo = { lines: number[]; points: number[] };

const rng = (seed: number) => {
  let s = seed;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
};

export function build(kind: Kind): Geo {
  const r = rng(kind.length * 31 + 7);
  const L: number[] = [];
  const P: number[] = [];
  const seg = (a: number[], b: number[]) => L.push(...a, ...b);

  if (kind === "particles") {
    for (let i = 0; i < 900; i++) {
      const v = [r() * 2 - 1, r() * 2 - 1, r() * 2 - 1];
      const n = Math.hypot(...v) || 1;
      const rad = 2.2 * Math.cbrt(r());
      P.push((v[0] / n) * rad, (v[1] / n) * rad, (v[2] / n) * rad);
    }
    return { lines: L, points: P };
  }
  if (kind === "route") {
    let x = 0, z = 0, prev = [0, 0, 0];
    P.push(...prev);
    for (let i = 0; i < 18; i++) {
      if (i % 2) x += 1 + (r() - 0.5) * 0.6;
      else z += 1 + (r() - 0.5) * 0.6;
      const cur = [x, Math.sin(i * 0.6) * 0.4, z];
      seg(prev, cur);
      P.push(...cur);
      prev = cur;
    }
    for (let i = 0; i <= 10; i++) {
      seg([i - 1, -0.5, -1], [i - 1, -0.5, 9]);
      seg([-1, -0.5, i - 1], [9, -0.5, i - 1]);
    }
  } else if (kind === "blocks") {
    for (let gx = 0; gx < 7; gx++)
      for (let gz = 0; gz < 7; gz++) {
        if (r() < 0.3) continue;
        const h = 0.3 + r() * 1.8;
        const c = [[gx, gz], [gx + 0.7, gz], [gx + 0.7, gz + 0.7], [gx, gz + 0.7]];
        c.forEach(([a, b], i) => {
          const [a2, b2] = c[(i + 1) % 4];
          seg([a, h, b], [a2, h, b2]);
          seg([a, 0, b], [a, h, b]);
        });
        P.push(gx + 0.35, h, gz + 0.35);
      }
  } else if (kind === "graph") {
    const N: number[][] = [];
    for (let i = 0; i < 26; i++) {
      const v = [r() * 2 - 1, r() * 2 - 1, r() * 2 - 1];
      const n = Math.hypot(...v) || 1;
      N.push([(v[0] / n) * 2, (v[1] / n) * 2, (v[2] / n) * 2]);
    }
    N.forEach((a, i) => {
      P.push(...a);
      N.map((b, j) => ({ j, d: Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) }))
        .filter((o) => o.j !== i)
        .sort((u, v) => u.d - v.d)
        .slice(0, 2)
        .forEach((o) => seg(a, N[o.j]));
    });
  } else if (kind === "globe") {
    const R = 2, S = 40;
    const at = (t: number, a: number) => [R * Math.cos(t) * Math.cos(a), R * Math.sin(t), R * Math.cos(t) * Math.sin(a)];
    for (const lat of [-60, -30, 0, 30, 60])
      for (let j = 0; j < S; j++) seg(at((lat * Math.PI) / 180, (j / S) * 6.2832), at((lat * Math.PI) / 180, ((j + 1) / S) * 6.2832));
    for (let m = 0; m < 6; m++)
      for (let j = 0; j < S; j++) seg(at((j / S) * 6.2832, (m * Math.PI) / 6), at(((j + 1) / S) * 6.2832, (m * Math.PI) / 6));
    for (let i = 0; i < 10; i++) P.push(...at((r() - 0.5) * 2.4, r() * 6.2832));
  } else if (kind === "lattice") {
    for (let x = 0; x < 4; x++)
      for (let y = 0; y < 4; y++)
        for (let z = 0; z < 4; z++) {
          P.push(x - 1.5, y - 1.5, z - 1.5);
          if (x < 3) seg([x - 1.5, y - 1.5, z - 1.5], [x - 0.5, y - 1.5, z - 1.5]);
          if (y < 3) seg([x - 1.5, y - 1.5, z - 1.5], [x - 1.5, y - 0.5, z - 1.5]);
          if (z < 3) seg([x - 1.5, y - 1.5, z - 1.5], [x - 1.5, y - 1.5, z - 0.5]);
        }
  } else {
    let prev = [-3, 0.55, 0];
    for (let i = 1; i <= 40; i++) {
      const x = -3 + (i / 40) * 6;
      const cur = [x, 0.55 - (1 - (x / 3) ** 2) * 1.1, Math.sin(x * 1.6) * 0.35];
      seg(prev, cur);
      prev = cur;
    }
    for (let i = 0; i < 24; i++) P.push((i < 12 ? -3.2 : 3.2) + (r() - 0.5) * 0.7, 0.55 + (r() - 0.5) * 0.7, (r() - 0.5) * 0.7);
  }

  // center and scale so every scene fits the same frame
  const all = [...L, ...P];
  const c = [0, 1, 2].map((k) => {
    const v = all.filter((_, i) => i % 3 === k);
    return (Math.max(...v) + Math.min(...v)) / 2;
  });
  let m = 1e-9;
  for (let i = 0; i < all.length; i += 3) m = Math.max(m, Math.hypot(all[i] - c[0], all[i + 1] - c[1], all[i + 2] - c[2]));
  const fit = (a: number[]) => a.map((v, i) => ((v - c[i % 3]) / m) * 2.4);
  return { lines: fit(L), points: fit(P) };
}

const mul = (a: number[], b: number[]) => {
  const o = new Array(16).fill(0);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
  return o;
};

export function mat(ry: number, rx: number, asp: number, d: number): Float32Array {
  const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
  const M = [cy, -sx * sy, cx * sy, 0, 0, cx, sx, 0, -sy, -sx * cy, cx * cy, 0, 0, 0, -d, 1];
  const f = 1 / Math.tan(0.4), n = 0.1, fa = 50;
  const P = [f / asp, 0, 0, 0, 0, f, 0, 0, 0, 0, (fa + n) / (n - fa), -1, 0, 0, (2 * fa * n) / (n - fa), 0];
  return new Float32Array(mul(P, M));
}
