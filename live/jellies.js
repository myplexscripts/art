// Deep Series No. 04: Jellyfish Bloom. Dark water full of jellyfish at three depths: many small dim ones far off, a
// few large bright ones up close. Each bell pulses, squeezing and gliding upward and then relaxing, and drifts off the
// top to come in again from below somewhere else, so the frame is always peopled. Tentacles and arms are chains of
// points that sit where the bell was a moment ago, so they trail it and snake after every pulse. There is no sea
// floor; a wider or taller frame simply holds more jellies.
import { clamp, osc, noise1, circle, frac, TAU } from './geom.js';
import { C, F } from './kit.js';
import { hash } from './bits.js';

export const title = 'JELLYFISH BLOOM', no = 'No. 04', text = '#1b1a4a', dark = '#07061a';
const K = { w: ['#141338', '#0e0d2b', '#09081f'], far: ['#2b2a66', '#3d3c85'], pink: '#e58aa8' };
const MID = [['#7d6540', '#a8894e'], ['#7f4467', '#a85a84'], ['#7a4a3c', '#a66142']];
const NEAR = [[C.gold, C.cream], [C.orange, C.gold], [K.pink, C.cream], [C.cream, C.gold]];
const nD = noise1(1401);

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall, area = (W * H) / 1440000;
  // One jelly. Every number comes from hash(its id, k), so a jelly is the same jelly at every size and a bigger
  // frame only adds more at the end of a tier. b is its size before the frame's scale, s after; T is the length of
  // a pulse; cross is how many seconds one trip up the frame takes (its old speed over a frame 900 high) and u0
  // how far through a trip it starts. T and cross use b, not s, so they do not change with the size.
  const jelly = (i, tier, s0, s1) => { const id = tier * 1000 + i, q = (k) => hash(id, 900 + k), b = s0 + (s1 - s0) * q(0), s = b * big, lb = (150 + 110 * q(2)) * b, len = lb * big;
    return { s, T: 3.2 + 2.6 * q(1) + b * 0.02, cross: (960 + 150 * b + lb) / ((9 + 9 * q(3)) * (0.5 + b * 0.6)), ph: q(4), u0: q(5), id, len, span: H + 150 * s + len + 60, tn: 5 + Math.floor(q(6) * 3), col: i, wide: 0.9 + 0.3 * q(7) }; };
  const tier = (n, s0, s1, k) => Array.from({ length: n }, (_, i) => jelly(i, k, s0, s1)).sort((a, b) => a.s - b.s);
  const FAR = tier(Math.round(16 * area) + 4, 0.22, 0.4, 0), MIDS = tier(Math.round(7 * area) + 3, 0.55, 0.85, 1), NEARS = tier(Math.round(3 * area) + 2, 1.2, 1.9, 2);
  // snow keeps a share of the way across and down (x, y) and rates in crossings a second (d, v)
  const SNOW = Array.from({ length: Math.round(70 * area) + 30 }, (_, i) => { const q = (k) => hash(5000 + i, 900 + k); return { x: q(0), y: q(1), v: (4 + q(2) * 10) / 900, d: ((q(3) - 0.5) * 8) / 1800, f: 0.1 + q(4) * 0.3, ph: q(5), r: 1 + q(6) * q(7) * 3, c: 3 + Math.floor(q(8) * 6) }; });
  return { W, H, tall, big, FAR, MIDS, NEARS, SNOW };
}

// Where a jelly's bell is at a moment, and how far through its pulse. It climbs faster on the squeeze. n is which
// trip up the frame this is; each trip starts at a different place along the width. d counts trips, whole and part,
// and does not depend on the size; only its fraction is scaled by the frame.
function where(j, tt, W, H, n) {
  const ph = tt / j.T + j.ph, d = j.u0 + (tt - 0.7 * (j.T / TAU) * Math.cos(TAU * ph)) / j.cross;
  if (n === undefined) n = Math.floor(d);
  return [hash(j.id, n) * W + 70 * j.s * nD(tt * 0.035 + j.id * 7.3) + 26 * j.s * nD(tt * 0.11 + j.id * 3.1), H + 150 * j.s + 20 - (d - n) * j.span, ph, n];
}

// One jelly: tentacles first, then the frilled arms, the bell and the lighter dome inside it. The paths are handed in
// so that a whole tier of far jellies can share three paths.
function jelly(j, t, W, H, thin, arms, bell, inner) {
  const [x, y, ph, n] = where(j, t, W, H), s = j.s;
  if (y < -j.len - 80 * s || y > H + 160 * s) return;
  const sq = Math.sin(TAU * ph + 0.9), w = 62 * s * j.wide * (1 - 0.17 * sq), h = 56 * s * (1 + 0.16 * sq);
  // the chain: point k sits under where the bell was k steps ago
  const N = 9, trail = [];
  for (let k = 0; k <= N; k++) { const q = where(j, t - k * 0.42, W, H, n); trail.push([q[0], q[1] + (k * j.len) / N * 0.62]); }
  for (let i = 0; i < j.tn; i++) {
    const u = (i / (j.tn - 1)) * 2 - 1, l = 0.75 + 0.25 * hash(j.id, i);
    thin.moveTo(x + u * w * 0.86, y);
    for (let k = 1; k <= N; k++) { const a = k / N; thin.lineTo(trail[k][0] + u * w * (0.86 + 0.25 * a) + 7 * s * a * Math.sin(k * 1.1 - t * 1.3 + i * 2 + j.id), y + (trail[k][1] - y) * l + (k * j.len * 0.38 * l) / N); }
  }
  for (let i = 0; i < 3; i++) {
    const u = (i - 1) * 0.3;
    arms.moveTo(x + u * w, y);
    for (let k = 1; k <= 6; k++) { const a = k / 6; arms.lineTo(trail[k][0] + u * w * (1 - 0.3 * a) + 10 * s * a * Math.sin(k * 1.5 - t * 1.1 + i * 2.4 + j.id), y + (trail[k][1] - y) * 0.6 + (k * j.len * 0.2) / 6); }
  }
  // bell: a dome over a scalloped hem
  bell.moveTo(x - w, y); bell.bezierCurveTo(x - w * 1.02, y - h * 1.36, x + w * 1.02, y - h * 1.36, x + w, y);
  for (let k = 0; k < 6; k++) { const x0 = x + w - (k * w) / 3, x1 = x0 - w / 3; bell.quadraticCurveTo((x0 + x1) / 2, y + 11 * s * (1 + 0.5 * sq), x1, y); }
  bell.closePath();
  inner.moveTo(x - w * 0.6, y - h * 0.2); inner.bezierCurveTo(x - w * 0.6, y - h * 0.98, x + w * 0.6, y - h * 0.98, x + w * 0.6, y - h * 0.2); inner.quadraticCurveTo(x, y - h * 0.02, x - w * 0.6, y - h * 0.2); inner.closePath();
}

export function paint(ctx, p, t, G) {
  const { W, H, big } = G;
  // the water: three flat bands, a shade lighter toward the top, with slow edges
  K.w.forEach((col, j) => F(ctx, (c) => { c.moveTo(-20, H + 20); for (let x = -20; x <= W + 80; x += 80) c.lineTo(x, j ? H * (0.3 * j + 0.03) + 26 * Math.sin(x / 340 + t * 0.09 + j * 2.1) + 12 * Math.sin(x / 130 - t * 0.07 + j) : -20); c.lineTo(W + 80, H + 20); c.closePath(); }, col));

  const snow = (lo, hi) => F(ctx, (c) => { for (const f of G.SNOW) if (f.r >= lo && f.r < hi) circle(c, frac(f.x + f.d * t + (20 * Math.sin(TAU * (t * f.f * 0.1 + f.ph))) / W) * W, frac(f.y + f.v * t) * H,f.r * big * (0.7 + 0.3 * osc(p, f.c, f.ph))); }, C.cream);
  const strokeFill = (thin, arms, bell, inner, a, b, s) => {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = a; ctx.lineWidth = Math.max(1.2, 2.2 * s); ctx.stroke(thin);
    ctx.strokeStyle = b; ctx.lineWidth = Math.max(2, 9 * s); ctx.stroke(arms);
    ctx.fillStyle = a; ctx.fill(bell); ctx.fillStyle = b; ctx.fill(inner);
  };
  ctx.depthLayer?.('far');
  // far jellies share their paths; the nearer ones are drawn one at a time, smallest first
  { const P = [new Path2D(), new Path2D(), new Path2D(), new Path2D()]; for (const j of G.FAR) jelly(j, t, W, H, ...P); strokeFill(...P, K.far[0], K.far[1], 0.3 * big); }
  snow(0, 1.8);
  ctx.depthLayer?.('middle');
  for (const j of G.MIDS) { const P = [new Path2D(), new Path2D(), new Path2D(), new Path2D()], c = MID[j.col % MID.length]; jelly(j, t, W, H, ...P); strokeFill(...P, c[0], c[1], j.s); }
  snow(1.8, 2.6);
  ctx.depthLayer?.('near');
  for (const j of G.NEARS) { const P = [new Path2D(), new Path2D(), new Path2D(), new Path2D()], c = NEAR[j.col % NEAR.length]; jelly(j, t, W, H, ...P); strokeFill(...P, c[0], c[1], j.s); }
  snow(2.6, 9);
}
