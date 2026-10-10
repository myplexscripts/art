// Orbit Series No. 05: Comet Pass. From the dark surface of a small icy world: a great comet in flat glow rings creeps
// across the sky over many minutes. Its two tails are fans of flat tapering streamers that start at the head: a broad
// dust tail in dull gold, gold and cream that curls away, and a narrow straight ion tail in pale blue. Each streamer's
// spine carries a slow wave that travels outward, so the tails ripple. Below, a frozen plain with a small probe, the
// comet's light lying on the ice, and spikes of ice in the foreground.
import { mulberry, lerp, clamp, osc, sway, noise1, poly, circle, pill, star4, TAU } from './geom.js';
import { C, F } from './kit.js';
import { hash, el, makeStars, paintStars, meteor } from './bits.js';

export const title = 'COMET PASS', no = 'No. 05', text = '#121a44', dark = '#060920';
const K = { sky: '#080b24', k1: '#0e1438', k2: '#172052', k3: '#25327a', dim: '#a07a44', ion: '#9fd8ec', ion2: '#4f8fc4', i1: '#b4dae6', i2: '#6fa3c4', i3: '#3f6d9c', i4: '#1f3d6c', ink: '#0a1230', night: '#141a40' };
const nI = noise1(1601), nR = noise1(1613);
// streamers as [bend, length share, greatest width as a share of length, ink], widest and dullest first
const DUST = [[-0.2, 1, 0.075, K.dim], [-0.5, 0.92, 0.08, K.dim], [-0.82, 0.76, 0.07, K.dim], [-0.28, 0.88, 0.042, C.gold], [-0.62, 0.76, 0.04, C.gold], [-0.4, 0.66, 0.02, C.cream]];
const ION = [[0.05, 1.18, 0.03, K.ion2], [-0.03, 1.0, 0.016, K.ion]];
const ANG = -0.38;                                              // the tails stream up and to the right, away from a sun below the horizon

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall, r = mulberry(1607);
  const HY = Math.round(H * (0.7 - 0.04 * tall)), D = H - HY;
  const L = clamp(Math.min(W * 0.6, HY * 1.0), 420, 1100);
  const STARS = makeStars(74, clamp(Math.round((W * HY) / 4800), 160, 400), W, HY);
  const FAR = { x: W * (0.13 + 0.03 * tall), y: Math.max(90, HY * 0.17), r: 30 * big };
  const jag = (step, k) => (x) => { const i = Math.floor(x / step), f = x / step - i; return hash(i, k) * (1 - f) + hash(i + 1, k) * f; };
  const j1 = jag(26, 1);
  const farY = (x) => HY - H * 0.006 - H * 0.04 * j1(x) * (0.2 + 0.8 * Math.abs(nI(x / 340)));
  const midY = (x) => HY + D * 0.36 + 12 * nI(x / 240 + 20);
  // spikes of ice: a few thickets on the plain, and tall ones crowding in from both edges at the bottom
  const thicket = (n, x0, x1, y, h0, h1, edge) => Array.from({ length: n }, () => { const x = lerp(x0, x1, r()), e = edge ? Math.pow(Math.abs((2 * x) / W - 1), 1.5) : 1, h = lerp(h0, h1, r() * r()) * (0.45 + 0.55 * e); return { x, y: typeof y === 'function' ? y(x) : y, h, w: h * (0.12 + 0.1 * r()) + 6, lean: (r() - 0.35) * 0.45 * h }; }).sort((a, b) => b.h - a.h);
  const MID = [...thicket(9, W * 0.02, W * 0.2, (x) => midY(x) + 8, 30 * big, 110 * big), ...thicket(7, W * 0.8, W * 0.97, (x) => midY(x) + 8, 30 * big, 90 * big), ...thicket(5, W * 0.42, W * 0.54, (x) => midY(x) + 8, 20 * big, 60 * big)];
  const NEAR = thicket(Math.round(W / 46), -20, W + 20, H + 20, D * 0.3, D * 0.95 + 80 * tall, true);
  const PROBE = { x: W * (0.66 - 0.04 * tall), y: HY + D * 0.2, s: 0.75 * big };
  return { W, H, HY, D, tall, big, L, STARS, FAR, farY, midY, MID, NEAR, PROBE };
}

const night = (c, R, k) => { c.moveTo(0, -R - 1); c.arc(0, 0, R + 1, -Math.PI / 2, Math.PI / 2); c.ellipse(0, 0, Math.abs(k) * R, R + 1, 0, Math.PI / 2, -Math.PI / 2, k > 0); c.closePath(); };

// One streamer, added to the current path: its spine turns steadily by `bend` over its length and carries a wave that
// moves outward; it swells from the head and tapers to a point.
function streamer(c, hx, hy, L, bend, wMax, w0, t, k) {
  const N = 18, up = [], dn = [];
  for (let i = 0; i <= N; i++) {
    const s = i / N, a = ANG + bend * s, b = Math.abs(bend) < 1e-3 ? 1e-3 : bend;
    const x = hx + (L * (Math.sin(a) - Math.sin(ANG))) / b, y = hy - (L * (Math.cos(a) - Math.cos(ANG))) / b;
    const nx = -Math.sin(a), ny = Math.cos(a);
    const rip = L * s * (0.02 * Math.sin(7 * s - t * 0.45 + k * 1.9) + 0.012 * Math.sin(13 * s - t * 0.7 + k * 3.1) + 0.02 * nR(s * 3 - t * 0.12 + k * 9));
    const w = w0 * (1 - s) + wMax * L * Math.sin(Math.PI * Math.pow(s, 0.75)) * (1 - 0.35 * s);
    up.push([x + nx * (rip + w), y + ny * (rip + w)]); dn.push([x + nx * (rip - w), y + ny * (rip - w)]);
  }
  poly(c, up.concat(dn.reverse()));
}

function probe(ctx, t) {
  F(ctx, (c) => el(c, 30, 3, 80, 5), K.i4);
  ctx.strokeStyle = K.ink; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath();
  for (const sd of [-1, 1]) { ctx.moveTo(sd * 20, -26); ctx.lineTo(sd * 44, -2); } ctx.moveTo(14, -52); ctx.lineTo(14, -92); ctx.moveTo(-16, -52); ctx.lineTo(-22, -66); ctx.stroke();
  F(ctx, (c) => { for (const fx of [-44, 44]) pill(c, fx - 9, -4, 18, 6); }, K.ink);
  F(ctx, (c) => poly(c, [[-26, -24], [-30, -38], [-22, -52], [22, -52], [30, -38], [26, -24]]), C.gold);
  F(ctx, (c) => poly(c, [[4, -24], [4, -52], [22, -52], [30, -38], [26, -24]]), K.dim);
  F(ctx, (c) => { c.rect(-29, -40, 58, 4); el(c, -26, -72, 18, 8, -0.5); }, C.cream);
  F(ctx, (c) => circle(c, -22, -76, 3), K.ink);
  const on = Math.pow(Math.max(0, Math.sin(t * 1.5)), 6);
  F(ctx, (c) => circle(c, 14, -94, 3.5 + 5 * on), on > 0.3 ? C.gold : C.orange);
}

export function paint(ctx, p, t, G) {
  const { W, H, HY, D, big, L, FAR } = G;
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  // the comet's head wanders the left half of the sky on two slow, unrelated turns
  const hx = W * (0.3 - 0.04 * G.tall) + W * 0.14 * Math.sin((TAU * t) / 1500 - 0.5) + sway(p, 0.03), hy = Math.max(L * 0.55, HY * 0.6) + HY * 0.09 * Math.cos((TAU * t) / 1130 + 0.4);
  ctx.fillStyle = K.sky; ctx.fillRect(0, 0, W, H);
  F(ctx, (c) => circle(c, hx, hy, L * 0.5), K.k1); F(ctx, (c) => circle(c, hx, hy, L * 0.32), K.k2); F(ctx, (c) => circle(c, hx, hy, L * 0.16), K.k3);
  paintStars(ctx, G.STARS, p);
  meteor(ctx, t, W, HY * 0.8, 15, 9);

  // far off, a ringed planet with one moon going round it
  { const { x, y, r } = FAR, tilt = 0.35, half = (c, a0) => { c.moveTo(x + 2.1 * r * Math.cos(a0 + tilt), y + 2.1 * r * Math.sin(a0 + tilt)); c.ellipse(x, y, r * 2.1, r * 0.5, tilt, a0, a0 + Math.PI); c.ellipse(x, y, r * 1.45, r * 0.34, tilt, a0 + Math.PI, a0, true); c.closePath(); };
    const th = (TAU * t) / 260, mx = x + r * 3.4 * Math.cos(th) * Math.cos(tilt) - r * 0.8 * Math.sin(th) * Math.sin(tilt), my = y + r * 3.4 * Math.cos(th) * Math.sin(tilt) + r * 0.8 * Math.sin(th) * Math.cos(tilt);
    if (Math.sin(th) < 0) F(ctx, (c) => circle(c, mx, my, r * 0.17), K.i1);
    F(ctx, (c) => half(c, Math.PI), K.i2);
    F(ctx, (c) => circle(c, x, y, r), K.ion2);
    F(ctx, (c) => { c.rect(x - r, y - r * 0.5, 2 * r, r * 0.22); c.rect(x - r, y + r * 0.15, 2 * r, r * 0.3); }, K.i3);
    ctx.save(); ctx.beginPath(); circle(ctx, x, y, r); ctx.clip(); F(ctx, (c) => circle(c, x + r * 0.7, y - r * 0.5, r * 1.05), K.sky); ctx.restore();
    F(ctx, (c) => half(c, 0), K.i1);
    if (Math.sin(th) >= 0) F(ctx, (c) => circle(c, mx, my, r * 0.17), K.i1); }

  ctx.depthLayer?.('comet');
  // the tails, the coma and the head
  ION.forEach(([bend, ls, wm, fill], k) => F(ctx, (c) => streamer(c, hx, hy, L * ls, bend, wm, 7 * big, t, k + 20), fill));
  DUST.forEach(([bend, ls, wm, fill], k) => F(ctx, (c) => streamer(c, hx, hy, L * ls, bend, wm, 13 * big, t, k), fill));
  F(ctx, (c) => circle(c, hx, hy, 30 * big), C.gold);
  F(ctx, (c) => { circle(c, hx, hy, 17 * big); star4(c, hx, hy, (52 + 7 * osc(p, 7, 0.2)) * big); }, C.cream);

  ctx.depthLayer?.('ice');
  // the ice: a low broken horizon, the frozen plain, a nearer shelf
  layer(0.08, () => {
    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 6.5) c.lineTo(x, G.farY(x)); c.lineTo(W + 90, H + 60); c.closePath(); }, K.i2);
    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 6.5) c.lineTo(x, Math.min(HY + 2, G.farY(x) + 5 + 9 * Math.abs(nI(x / 19)))); c.lineTo(W + 90, H + 60); c.closePath(); }, K.i3);
  });
  // glints slide over the plain in long dashes, and the comet's light lies broken on the ice below it
  ctx.save(); ctx.strokeStyle = K.i2; ctx.lineCap = 'round';
  for (let k = 0; k < 7; k++) { const y = HY + 10 + k * (9 + k * 3.4) * (D / 300); ctx.lineWidth = 2 + k * 0.7; ctx.setLineDash([60 + 70 * hash(k, 1), 150 + 260 * hash(k, 2)]); ctx.lineDashOffset = k * 173 + (5 + 2.5 * k) * t * (k % 2 ? 1 : -1); ctx.beginPath(); ctx.moveTo(-40, y); ctx.lineTo(W + 40, y); ctx.stroke(); }
  ctx.restore();
  for (let k = 0; k < 10; k++) { const y = HY + 12 + (k / 10) * D * 0.32, a = 0.5 + 0.5 * osc(p, 5 + (k % 5), hash(k, 9)), w = (26 + k * 10) * (0.5 + 0.8 * hash(k, 40)) * (0.45 + 0.9 * a) * big; F(ctx, (c) => pill(c, hx + (hash(k, 80) - 0.5) * (14 + k * 7) + 4 * osc(p, 3, hash(k, 9)) - w / 2, y - 3.5, w, 7), k % 3 ? C.gold : C.cream); }
  layer(0.3, () => { const { x, y, s } = G.PROBE; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); probe(ctx, t); ctx.restore(); });
  const spikes = (list, body, face) => {
    F(ctx, (c) => { for (const q of list) poly(c, [[q.x - q.w, q.y], [q.x + q.lean, q.y - q.h], [q.x + q.w, q.y]]); }, body);
    F(ctx, (c) => { for (const q of list) poly(c, [[q.x - q.w, q.y], [q.x + q.lean, q.y - q.h], [q.x - q.w * 0.25, q.y]]); }, face);
  };
  layer(0.5, () => {
    spikes(G.MID, K.i4, K.i3);
    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 14) c.lineTo(x, G.midY(x)); c.lineTo(W + 90, H + 60); c.closePath(); }, K.i4);
    // frost winks on the shelf
    F(ctx, (c) => { for (let k = 0; k < 12; k++) { const a = osc(p, [4, 5, 7][k % 3], hash(k, 3)); if (a > 0.25) star4(c, W * hash(k, 5), G.midY(W * hash(k, 5)) + 14 + D * 0.3 * hash(k, 6), 9 * a * big); } }, K.i1);
  });
  ctx.depthLayer?.('shards');
  layer(0.95, () => spikes(G.NEAR, K.ink, K.i4));
}
