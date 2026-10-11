// Pieces more than one scene uses: curves, a field of stars, shooting stars, drifting bars of cloud, a crescent, a pine.
import { mulberry, osc, frac, circle, pill, star4, poly, TAU } from './geom.js?v=20261011-dreamscapes';
import { C, F } from './kit.js?v=20261011-dreamscapes';

export const bez = (A, B, D, t) => [(1 - t) ** 2 * A[0] + 2 * t * (1 - t) * B[0] + t * t * D[0], (1 - t) ** 2 * A[1] + 2 * t * (1 - t) * B[1] + t * t * D[1]];
export const bezT = (A, B, D, t) => { const x = 2 * (1 - t) * (B[0] - A[0]) + 2 * t * (D[0] - B[0]), y = 2 * (1 - t) * (B[1] - A[1]) + 2 * t * (D[1] - B[1]), l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
// an ellipse as its own subpath, so several can share one fill without stray joins
export const el = (c, x, y, rx, ry, rot = 0) => { c.moveTo(x + rx * Math.cos(rot), y + rx * Math.sin(rot)); c.ellipse(x, y, rx, ry, rot, 0, TAU); };
// a number in 0..1 that belongs to an integer, for things placed along an endless strip
export const hash = (i, k = 0) => { let h = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(k + 1, 0xc2b2ae35); h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12; return (h >>> 0) / 4294967296; };

export const makeStars = (seed, n, W, H, keep = () => true) => {
  const r = mulberry(seed), a = [];
  for (let i = 0; i < n; i++) { const s = { x: r() * W, y: r() * H, s: 0.8 + r() * r() * 2.2, c: [4, 5, 7, 9, 11][Math.floor(r() * 5)], ph: r() }; if (keep(s)) a.push(s); }
  return a;
};
export const paintStars = (ctx, stars, p, fill = C.cream) => F(ctx, (c) => { for (const s of stars) star4(c, s.x, s.y, (3 + s.s * 2.2) * (0.7 + 0.3 * osc(p, s.c, s.ph))); }, fill);

// A shooting star now and then: time is cut into slots and a little over half of them get one, placed by the slot's own seed.
export function meteor(ctx, t, W, HY, slot = 14, seed = 3, fill = C.cream) {
  const n = Math.floor(t / slot), r = mulberry(n * 7919 + seed);
  if (r() > 0.55) return;
  const u = (t - (n * slot + 1 + r() * (slot - 4))) / 0.9;
  const x0 = W * (0.1 + 0.8 * r()), y0 = HY * (0.05 + 0.35 * r()), a = 0.35 + 0.5 * r(), dx = Math.cos(a) * (r() < 0.5 ? -1 : 1), dy = Math.sin(a);
  if (u < 0 || u > 1) return;
  const head = u * 420, tail = Math.max(0, head - 170 * Math.sin(Math.PI * u)), hx = x0 + dx * head, hy = y0 + dy * head;
  F(ctx, (c) => { c.moveTo(x0 + dx * tail, y0 + dy * tail); c.lineTo(hx - dy * 3, hy + dx * 3); c.lineTo(hx + dy * 3, hy - dx * 3); c.closePath(); }, fill);
}

// bars of cloud that cross the sky and come back in from the left: [x share, y, width, height, color, units per second].
// The crossing is a phase that does not depend on the frame's width, so resizing never throws a bar across the sky.
export function bars(ctx, list, W, t, yOf = (y) => y) {
  for (const [fx, y, w, h, col, v] of list) {
    const bw = Math.min(w, W * 0.42), span = W + bw + 160, x = frac(fx + (v * t) / 1800) * span - bw - 80;
    F(ctx, (c) => pill(c, x, yOf(y), bw, h), col);
  }
}

// a crescent: the moon's disc with a bite out of it, whatever is painted behind
export function crescent(ctx, x, y, r, fill, turn = 0.5) {
  ctx.save(); ctx.beginPath(); circle(ctx, x, y, r); ctx.clip();
  ctx.beginPath(); ctx.rect(x - 2 * r, y - 2 * r, 4 * r, 4 * r); circle(ctx, x + r * turn, y - r * 0.18, r * 0.92); ctx.fillStyle = fill; ctx.fill('evenodd'); ctx.restore();
}

// a pine as stacked tiers, added to the current path; lean tips the top over, in units
export function pine(ctx, x, y, h, w, lean = 0, tiers = 5) {
  poly(ctx, [[x - w * 0.07, y + 4], [x + w * 0.07, y + 4], [x + lean * 0.2 + w * 0.05, y - h * 0.3], [x + lean * 0.2 - w * 0.05, y - h * 0.3]]);
  for (let i = 0; i < tiers; i++) {
    const a = i / tiers, b = (i + 1.55) / tiers, y0 = y - h * (0.14 + 0.86 * a), y1 = y - h * Math.min(1, 0.14 + 0.86 * b), hw = (w / 2) * (1 - a * 0.78), l0 = lean * a * a, l1 = lean * Math.min(1, b) ** 2;
    poly(ctx, [[x + l0 - hw, y0], [x + l0 + hw, y0], [x + l1, y1]]);
  }
}
