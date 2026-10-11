// Daybreak Series No. 05: Savanna Sunrise. A huge sun comes up behind flat-topped acacias on a grassland. The plain is
// four bands of grass, lighter far and darker near, each with a fringe of blades that leans in waves travelling along
// it. Giraffes walk the horizon very slowly, birds cross the sun in a loose V now and then, and dust lies in bars low
// over the grass. Tall seed heads nod along the bottom edge.
import { mulberry, clamp, osc, sway, noise1, poly, circle, TAU } from './geom.js?v=20261011-clock';
import { C, F } from './kit.js?v=20261011-clock';
import { hash, el, bars } from './bits.js?v=20261011-clock';

export const title = 'SAVANNA SUNRISE', no = 'No. 05', text = '#4a2414', dark = '#27140d';
const P = { sky: '#d0603a', r1: C.orange, r2: '#e8913f', r3: '#f2a743', hills: '#b65634', g1: '#b8702e', g2: '#8c4f24', g3: '#5f321c', ink: '#2b1710' };
const nS = noise1(1601), nV = noise1(1613);
const CLOUDS = [[0.06, 0.14, 480, 16, P.r1, 4], [0.15, 0.2, 260, 12, P.r1, 4], [0.62, 0.3, 420, 14, P.r2, 6], [0.72, 0.36, 220, 10, P.r2, 6], [0.3, 0.52, 360, 12, P.r3, 8]];
const DUST = [[0.1, 0.06, 520, 12, P.r3, 9], [0.6, 0.12, 400, 10, C.cream, -7], [0.35, 0.3, 560, 14, P.r3, 13], [0.8, 0.5, 460, 14, P.r2, -11]];
const BANDS = [[0, P.g1], [0.22, P.g2], [0.48, P.g3], [0.76, P.ink]];

// an acacia about the foot of its trunk: a forked trunk under flat plates of leaf. sw slides the crown a little.
function acacia(c, s, sw) {
  poly(c, [[-10 * s, 4], [10 * s, 4], [5 * s, -74 * s], [-5 * s, -74 * s]]);
  for (const [tx, ty] of [[-78, -150], [-24, -166], [34, -162], [86, -142]]) poly(c, [[-5 * s, -66 * s], [5 * s, -66 * s], [(tx + 3) * s + sw, ty * s], [(tx - 3) * s + sw, ty * s]]);
  for (const [x, y, rx, ry] of [[-64, -158, 72, 15], [10, -174, 92, 17], [78, -150, 62, 13], [-6, -150, 118, 9]]) el(c, x * s + sw, y * s, rx * s, ry * s);
}
// a giraffe about its feet, walking; ph carries its stride
function giraffe(c, x, y, s, d, ph) {
  const q = (pts) => poly(c, pts.map(([a, b]) => [x + d * a * s, y + b * s])), up = -1.2 * Math.abs(Math.sin(ph));
  q([[-17, -27 + up], [-13, -35 + up], [12, -40 + up], [18, -32 + up], [14, -23 + up], [-13, -21 + up]]);
  q([[8, -37 + up], [17, -35 + up], [31, -70 + up], [26, -72 + up]]); q([[25, -75 + up], [29, -77 + up], [40, -70 + up], [39, -66 + up], [28, -65 + up]]);
  q([[-17, -30 + up], [-15, -30 + up], [-20, -12 + up], [-21, -12 + up]]);
  for (const [hx, o] of [[-13, 0], [-9, Math.PI], [10, Math.PI * 0.5], [14, Math.PI * 1.5]]) { const f = 6 * Math.sin(ph + o); q([[hx - 1.8, -23 + up], [hx + 1.8, -23 + up], [hx + f + 1.3, 0], [hx + f - 1.3, 0]]); }
}

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall, r = mulberry(1607);
  const HY = Math.round(H * (0.66 - 0.03 * tall)), gh = H - HY;
  const SUN = { x: W * (0.57 - 0.05 * tall), y: HY - 60 * big, r: 185 * big };
  const hillY = (x) => HY - H * 0.02 - H * 0.055 * (0.5 + 0.5 * nV(x / 520 + 4)) - H * 0.03 * Math.pow(clamp(1 - x / (W * 0.4)), 2) - 4 * nV(x / 70);
  const bandY = (j, x) => HY + gh * BANDS[j][0] + (6 + 5 * j) * nS(x / 240 + j * 9);
  // trees: [x share, size, which band it stands on (-1 is the horizon), ink]
  const TREES = [[0.07, 0.34, -1, P.hills], [0.69 + 0.1 * tall, 0.26, -1, P.hills], [0.93, 0.4, -1, P.g1], [0.84 - 0.1 * tall, 0.8, 1, P.g2], [0.33 - 0.01 * tall, 1.75 - 0.6 * tall, 2, P.g3]].map(([fx, s, j, ink], i) => ({ x: fx * W, s: s * big * clamp(H / 900, 1, 1.25), j, ink, c: [3, 4, 5][i % 3], ph: i * 0.27 }));
  const HEADS = Array.from({ length: Math.round(W / 26) }, () => { const x = r() * W, e = Math.pow(Math.abs(x / W - 0.5) * 2, 2); return { x, h: (60 + 70 * r() + 170 * e * (0.4 + 0.6 * r())) * big, lean: (r() - 0.4) * 0.34, c: [4, 5, 7][Math.floor(r() * 3)], ph: r(), back: r() < 0.3 }; });
  return { W, H, HY, gh, tall, big, SUN, hillY, bandY, TREES, HEADS };
}

export function paint(ctx, p, t, G) {
  const { W, H, HY, gh, SUN, big } = G, a = (TAU * t) / 480, mx = SUN.x + sway(p, 0.03) + 40 * Math.sin(a), my = SUN.y - HY * 0.16 * (1 - Math.cos(a));
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  const trees = (j) => { for (const q of G.TREES) if (q.j === j) { const y = j < 0 ? HY + 2 : G.bandY(j, q.x) + 4; ctx.save(); ctx.translate(q.x, y); F(ctx, (c) => acacia(c, q.s, q.s * (3 * osc(p, q.c, q.ph) + 1.2 * osc(p, 9, q.ph))), q.ink); ctx.restore(); } };
  ctx.fillStyle = P.sky; ctx.fillRect(0, 0, W, H);
  F(ctx, (c) => circle(c, mx, my, 900 * big), P.r1); F(ctx, (c) => circle(c, mx, my, 620 * big), P.r2); F(ctx, (c) => circle(c, mx, my, 380 * big), P.r3);
  F(ctx, (c) => circle(c, mx, my, SUN.r), C.gold);
  bars(ctx, CLOUDS, W, t, (y) => y * HY);

  // birds cross the sun now and then in a V that keeps shifting. The slots are a fixed length, so the size never
  // changes which one the clock is in; on a very wide frame the birds fly a little faster to fit theirs.
  { const dur = Math.min((W + 500) / 60, 50), slot = 68, n = Math.floor(t / slot), q = mulberry(n * 8101 + 6), go = q() < 0.8, dir = q() < 0.5 ? -1 : 1, cnt = 7 + Math.floor(q() * 5), u = (t - n * slot - 2 - q() * 16) / dur, y0 = my + (q() - 0.6) * SUN.r;
    if (go && u >= 0 && u <= 1) { ctx.strokeStyle = P.ink; ctx.lineWidth = 2.6 * big; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
      for (let k = 0; k < cnt; k++) { const s = 10 * big, rank = Math.ceil(k / 2), e = u * (W + 500) - 80 - rank * 28 * big * (1 + 0.25 * nS(t * 0.11 + k)) + 10 * nS(t * 0.3 + k * 5), x = dir > 0 ? e : W - e, y = y0 + 24 * Math.sin(t * 0.13) + (k % 2 ? 1 : -1) * rank * 15 * big * (1 + 0.3 * nS(t * 0.09 + k * 3)) + 7 * nS(t * 0.25 + k * 9), fl = s * 0.75 * Math.sin(t * 4.4 + k * 1.9); ctx.moveTo(x - s, y - fl); ctx.lineTo(x, y); ctx.lineTo(x + s, y - fl); }
      ctx.stroke(); } }

  // far hills, the trees on the horizon, and the herd walking it
  layer(0.06, () => F(ctx, (c) => { c.moveTo(-90, HY + 30); for (let x = -90; x <= W + 90; x += 10) c.lineTo(x, G.hillY(x)); c.lineTo(W + 90, HY + 30); c.closePath(); }, P.hills));
  layer(0.12, () => {
    trees(-1);
    // the herd's slots are a fixed length too
    const dur = Math.min((W + 700) / 13, 240), slot = 250, n = Math.floor(t / slot), q = mulberry(n * 2203 + 11), dir = q() < 0.5 ? -1 : 1, cnt = 3 + Math.floor(q() * 3), u = (t - n * slot - 10) / dur;
    if (u >= 0 && u <= 1) F(ctx, (c) => { for (let k = 0; k < cnt; k++) { const s = (k === 2 ? 0.62 : 0.85 + 0.25 * hash(k, n)) * big, e = u * (W + 700) - 120 - k * (70 + 40 * hash(k, n + 3)) * big, x = dir > 0 ? e : W - e; giraffe(c, x, HY + 5, s, dir, (e / (11 * s)) + k * 1.3); } }, P.g3);
  });

  ctx.depthLayer?.('plain');
  // the plain: each band ends in a fringe of blades, and the wind runs along it
  for (let j = 0; j < BANDS.length; j++) {
    layer(0.18 + 0.2 * j, () => {
      if (j === BANDS.length - 1) ctx.depthLayer?.('acacias');
      const st = 9 + 5 * j, bh = (9 + 9 * j) * big;
      F(ctx, (c) => { c.moveTo(-60, H + 60); for (let i = Math.floor(-60 / st); i * st <= W + 60; i++) { const x = i * st, y = G.bandY(j, x), h = bh * (0.5 + 0.9 * hash(i, j)), ln = h * (0.55 * Math.sin(x / 170 - t * 0.7 + j * 1.9) + 0.25 * Math.sin(x / 61 + t * 0.43 + j)); c.lineTo(x, y); c.lineTo(x + st * 0.5 + ln, y - h); } c.lineTo(W + 60, H + 60); c.closePath(); }, BANDS[j][1]);
      trees(j);
    });
    bars(ctx, DUST.filter((d) => d[1] >= BANDS[j][0] && d[1] < (j + 1 < BANDS.length ? BANDS[j + 1][0] : 2)), W, t, (y) => HY + gh * y);
  }

  ctx.depthLayer?.('grass');
  // tall seed heads along the bottom, nodding; a few paler ones stand behind
  layer(1, () => {
    for (const back of [true, false]) {
      const tip = [], ink = back ? P.g3 : P.ink;
      ctx.strokeStyle = ink; ctx.lineWidth = 3 * big; ctx.lineCap = 'round'; ctx.beginPath();
      for (const q of G.HEADS) { if (q.back !== back) continue; const ln = q.lean + 0.14 * osc(p, q.c, q.ph) + 0.05 * osc(p, 11, q.ph), tx = q.x + ln * q.h, ty = H + 10 - q.h * (back ? 1.15 : 1); ctx.moveTo(q.x, H + 10); ctx.quadraticCurveTo(q.x - ln * q.h * 0.1, H - q.h * 0.6, tx, ty); tip.push(tx, ty, ln); }
      ctx.stroke();
      F(ctx, (c) => { for (let i = 0; i < tip.length; i += 3) { const an = tip[i + 2] * 2.2 + 0.25; el(c, tip[i] + Math.sin(an) * 20 * big, tip[i + 1] + (1 - Math.cos(an)) * 20 * big - 16 * big, 6 * big, 26 * big, an); } }, ink);
    }
  });
}
