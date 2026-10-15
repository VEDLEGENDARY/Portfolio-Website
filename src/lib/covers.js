import { mulberry32 } from "./motion.js";
/**
 * Generated cover art for projects that have no screenshot. Each drawing is a
 * diagram of what the project does, in the site's paper, ink and signal colours.
 */
const PAPER = "#e3e0d6";
const PAPER_LIGHT = "#eeece6";
const INK = "#0f0f0e";
const SIGNAL = "#ff4a1c";
const rgba = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
function line(ctx, a, b) {
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
}
function dot(ctx, x, y, r, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}
/** A query pulling the closest chunks out of a field of documents, then reranking them into an answer. */
function rag(ctx, w, h, rnd) {
    const pts = [];
    for (let tries = 0; pts.length < 250 && tries < 8000; tries++) {
        const x = 70 + rnd() * (w - 140);
        const y = 70 + rnd() * (h - 140);
        if (pts.every(([a, b]) => (a - x) ** 2 + (b - y) ** 2 > 34 * 34))
            pts.push([x, y]);
    }
    const q = [250, h / 2];
    const dist = (p) => Math.hypot(p[0] - q[0], p[1] - q[1]);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = rgba(INK, 0.1);
    for (const p of pts) {
        const near = pts
            .filter((o) => o !== p)
            .sort((a, b) => Math.hypot(a[0] - p[0], a[1] - p[1]) - Math.hypot(b[0] - p[0], b[1] - p[1]))
            .slice(0, 2);
        for (const o of near)
            line(ctx, p, o);
    }
    const reach = 330;
    for (const p of pts) {
        const inside = dist(p) < reach;
        dot(ctx, p[0], p[1], inside ? 4 : 2.6, rgba(INK, inside ? 0.5 : 0.22));
    }
    ctx.setLineDash([6, 9]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = rgba(INK, 0.32);
    ctx.beginPath();
    ctx.arc(q[0], q[1], reach, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    const top = pts
        .filter((p) => dist(p) > 70)
        .sort((a, b) => dist(a) - dist(b))
        .slice(0, 8);
    ctx.lineWidth = 2;
    ctx.strokeStyle = rgba(SIGNAL, 0.55);
    for (const p of top) {
        ctx.beginPath();
        ctx.moveTo(q[0], q[1]);
        ctx.quadraticCurveTo((q[0] + p[0]) / 2, (q[1] + p[1]) / 2 + (p[1] - q[1]) * 0.35, p[0], p[1]);
        ctx.stroke();
        dot(ctx, p[0], p[1], 6.5, SIGNAL);
    }
    const card = { x: 860, y: 290, w: 250, h: 220 };
    const kept = [top[1], top[3], top[6]].filter(Boolean);
    ctx.lineWidth = 3;
    ctx.strokeStyle = SIGNAL;
    kept.forEach((p, i) => {
        const ty = card.y + 55 + i * 55;
        ctx.beginPath();
        ctx.moveTo(p[0], p[1]);
        ctx.bezierCurveTo(p[0] + 160, p[1], card.x - 120, ty, card.x, ty);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(p[0], p[1], 11, 0, Math.PI * 2);
        ctx.stroke();
    });
    roundRect(ctx, card.x, card.y, card.w, card.h, 14);
    ctx.fillStyle = PAPER_LIGHT;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = INK;
    ctx.stroke();
    [0.9, 0.7, 0.82, 0.5].forEach((f, i) => {
        roundRect(ctx, card.x + 26, card.y + 34 + i * 38, (card.w - 52) * f, 11, 5.5);
        ctx.fillStyle = rgba(INK, i === 0 ? 0.8 : 0.3);
        ctx.fill();
    });
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = INK;
    ctx.beginPath();
    ctx.arc(q[0], q[1], 17, 0, Math.PI * 2);
    ctx.stroke();
    dot(ctx, q[0], q[1], 7, SIGNAL);
}
/** Two crowds pulling a rope, with the marker dragged off centre. */
function rope(ctx, w, h, rnd) {
    const y0 = 400;
    const ground = y0 + 130;
    ctx.lineWidth = 2;
    ctx.strokeStyle = rgba(INK, 0.2);
    line(ctx, [70, ground], [w - 70, ground]);
    ctx.setLineDash([6, 9]);
    ctx.strokeStyle = rgba(INK, 0.35);
    line(ctx, [w / 2, 170], [w / 2, ground]);
    ctx.setLineDash([]);
    const crowd = (side, color) => {
        for (let i = 0; i < 26; i++) {
            const row = i % 3;
            const x = w / 2 + side * (300 + row * 46 + rnd() * 34 + Math.floor(i / 3) * 6);
            const head = [x + side * 22 + (rnd() - 0.5) * 4, y0 - 34 + row * 14 + (rnd() - 0.5) * 10];
            const feet = [x - side * 22, ground - row * 8];
            ctx.lineCap = "round";
            ctx.lineWidth = 7;
            ctx.strokeStyle = rgba(color, 0.78 - row * 0.16);
            line(ctx, head, feet);
            dot(ctx, head[0], head[1], 9.5, rgba(color, 0.9 - row * 0.16));
        }
        ctx.lineCap = "butt";
    };
    crowd(-1, INK);
    crowd(1, SIGNAL);
    const left = w / 2 - 285;
    const right = w / 2 + 285;
    ctx.lineWidth = 13;
    ctx.strokeStyle = INK;
    ctx.beginPath();
    ctx.moveTo(left, y0);
    ctx.bezierCurveTo(left + 150, y0 + 6, right - 150, y0 + 6, right, y0);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = rgba(PAPER, 0.7);
    for (let x = left + 6; x < right; x += 9) {
        line(ctx, [x, y0 - 5], [x + 5, y0 + 5]);
    }
    const mx = w / 2 - 70;
    ctx.lineWidth = 3;
    ctx.strokeStyle = INK;
    line(ctx, [mx, y0], [mx, y0 - 130]);
    ctx.fillStyle = SIGNAL;
    ctx.beginPath();
    ctx.moveTo(mx, y0 - 130);
    ctx.lineTo(mx + 62, y0 - 108);
    ctx.lineTo(mx, y0 - 86);
    ctx.closePath();
    ctx.fill();
    dot(ctx, mx, y0, 15, SIGNAL);
    dot(ctx, mx, y0, 5.5, PAPER_LIGHT);
}
/** A frozen weight matrix plus a low-rank update: W + B x A. */
function lora(ctx, w, h, rnd) {
    const n = 18;
    const cell = 18;
    const size = n * cell;
    const top = (h - size) / 2;
    const grid = (ox, oy, cols, rows, color, vary) => {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const a = vary ? 0.16 + 0.66 * rnd() : 0.95;
                dot(ctx, ox + i * cell + cell / 2, oy + j * cell + cell / 2, vary ? 3.7 : 4.8, rgba(color, a));
            }
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = rgba(INK, 0.28);
        roundRect(ctx, ox - 8, oy - 8, cols * cell + 16, rows * cell + 16, 10);
        ctx.stroke();
    };
    const sign = (x, y, kind) => {
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.strokeStyle = INK;
        const r = 13;
        if (kind === "plus") {
            line(ctx, [x - r, y], [x + r, y]);
            line(ctx, [x, y - r], [x, y + r]);
        }
        else {
            line(ctx, [x - r * 0.8, y - r * 0.8], [x + r * 0.8, y + r * 0.8]);
            line(ctx, [x - r * 0.8, y + r * 0.8], [x + r * 0.8, y - r * 0.8]);
        }
        ctx.lineCap = "butt";
    };
    const wx = 120;
    grid(wx, top, n, n, INK, true);
    sign(wx + size + 62, h / 2, "plus");
    const bx = wx + size + 122;
    grid(bx, top, 2, n, SIGNAL, false);
    sign(bx + 2 * cell + 54, h / 2, "times");
    const ax = bx + 2 * cell + 112;
    grid(ax, h / 2 - cell, n, 2, SIGNAL, false);
}
const DRAW = { rag, rope, lora };
export function drawCover(kind, w = 1200, h = 800) {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx)
        return canvas;
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    DRAW[kind](ctx, w, h, mulberry32(kind.length * 2654435761));
    return canvas;
}
