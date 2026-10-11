// Nocturne Series No. 04: Campfire Ridge. A fire and a lit tent on a dark ridge between the pines, ranges falling
// away behind with mist between them, and the Milky Way across the sky. The ridge keeps a fixed share of the height;
// extra room becomes sky.
import { mulberry, clamp, osc, sway, noise1, poly, circle, pill, star4, TAU } from './geom.js?v=20261011-clock';
import { C, F } from './kit.js?v=20261011-clock';
import { hash, el, makeStars, paintStars, meteor, bars, crescent, pine } from './bits.js?v=20261011-clock';

export const title = 'CAMPFIRE RIDGE', no = 'No. 04', text = C.navy, dark = C.ink;
const K = { sky: '#0c1834', way1: '#101f42', way2: '#152c54', r1: '#2f7f97', r1b: '#1d5a74', r2: '#18486a', r3: '#123458', r4: '#0d2444', glow1: '#3a2034', glow2: '#7a3f33', log: '#2a1420', smoke: '#1d3558' };
const nA = noise1(401), nB = noise1(409), nC = noise1(419), nD = noise1(431), nG = noise1(443), nF = noise1(457);
// ranges, far to near: [top as a share of the height, relief, wavelength, noise, fill]
const RANGES = [[0.5, 0.11, 360, nA, K.r1b], [0.585, 0.07, 300, nB, K.r2], [0.66, 0.06, 420, nC, K.r3], [0.735, 0.05, 340, nD, K.r4]];
// mist between the ranges: [x share, y share of the height, width, height, color, drift]
const MIST = [[0.1, 0.595, 520, 26, K.r1, 5], [0.6, 0.665, 430, 22, K.r1b, 8], [0.3, 0.735, 480, 22, K.r2, 6]];

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall;
  let r = mulberry(404);   // reseeded before each list, so the dust's size-dependent count does not disturb the others
  const groundY = (x) => H * 0.845 - H * 0.03 * Math.sin(clamp(x / W) * Math.PI) + 8 * nG(x / 150);
  const STARS = makeStars(51, 170, W, H * 0.55);
  // the Milky Way: a band across the sky, thick with small stars; placed in its own turned frame
  const WAY = { x: W * 0.64, y: H * 0.25, a: -0.42 - 0.3 * tall, L: Math.hypot(W, H) * 1.3, h: 250 * big };
  r = mulberry(4040); const DUST = Array.from({ length: Math.round(170 + W / 12) }, () => ({ u: (r() - 0.5) * WAY.L, v: (r() + r() + r() - 1.5) * WAY.h * 0.42, s: 1.2 + r() * 2.6, c: [4, 5, 7, 9][Math.floor(r() * 4)], ph: r() }));
  const fs = 1.35 + 0.3 * tall, fire = { x: W * (0.4 - 0.08 * tall), s: fs };
  const tent = { x: fire.x + (250 - 70 * tall) * fs, s: fs };
  const PINES = [[-0.02, 0.62, 5], [0.06, 0.46, 4], [0.13, 0.33, 4], [0.87 + 0.3 * tall, 0.4, 4], [0.97 + 0.06 * tall, 0.66, 5]].map(([fx, fh, c], i) => ({ x: fx * W, h: fh * H * (0.8 + 0.2 * big), c, ph: i * 0.21 }));
  r = mulberry(4041); const SPARKS = Array.from({ length: 30 }, () => ({ T: 2.4 + r() * 3.2, ph: r(), dx: (r() - 0.35) * 150, w: 10 + r() * 22, up: 260 + r() * 300, r: 2.5 + r() * 3 }));
  r = mulberry(4042); const TUFTS = Array.from({ length: Math.round(W / 26) }, () => ({ x: r() * W, h: 18 + r() * 40, c: [5, 7, 9][Math.floor(r() * 3)], ph: r() }));
  return { W, H, tall, big, groundY, STARS, WAY, DUST, fire, tent, PINES, SPARKS, TUFTS };
}

// one tongue of flame: it leans and stretches with its own noise
function flame(c, x, y, w, h, t, k) {
  const lean = w * 0.55 * nF(t * 1.9 + k * 7.3), hh = h * (0.78 + 0.3 * nF(t * 2.7 + k * 3.1));
  c.moveTo(x - w / 2, y); c.bezierCurveTo(x - w * 0.8, y - hh * 0.35, x - w * 0.1 + lean * 0.3, y - hh * 0.55, x + lean, y - hh);
  c.bezierCurveTo(x + w * 0.25 + lean * 0.3, y - hh * 0.6, x + w * 0.85, y - hh * 0.3, x + w / 2, y); c.closePath();
}

export function paint(ctx, p, t, G) {
  const { W, H, big } = G;
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  ctx.fillStyle = K.sky; ctx.fillRect(0, 0, W, H);
  { const w = G.WAY; ctx.save(); ctx.translate(w.x, w.y); ctx.rotate(w.a + 0.02 * Math.sin((TAU * t) / 400));
    F(ctx, (c) => pill(c, -w.L / 2, -w.h / 2, w.L, w.h), K.way1); F(ctx, (c) => pill(c, -w.L / 2 + 120, -w.h * 0.24 + 12, w.L, w.h * 0.48), K.way2);
    F(ctx, (c) => { for (const d of G.DUST) star4(c, d.u, d.v, d.s * (1.5 + 0.6 * osc(p, d.c, d.ph))); }, C.cream);
    ctx.restore(); }
  paintStars(ctx, G.STARS, p);
  meteor(ctx, t, W, H * 0.5, 9, 13);
  crescent(ctx, W * 0.84 + sway(p, 0.03), H * 0.1 + 6 * Math.sin((TAU * t) / 360), 46, C.gold, -0.5);

  ctx.depthLayer?.('mountains');
  // the ranges, far to near, with mist lying in the valleys between
  RANGES.forEach(([fy, rel, lam, n, fill], i) => {
    layer(0.06 + 0.07 * i, () => {
      const top = (x) => H * fy - H * rel * (i ? 0.5 + 0.5 * n(x / lam) : Math.pow(Math.abs(n(x / lam)), 0.8) * 1.5) - 7 * n(x / 38);
      if (!i) F(ctx, (c) => { c.moveTo(-90, H); for (let x = -90; x <= W + 90; x += 8) c.lineTo(x, top(x)); c.lineTo(W + 90, H); c.closePath(); }, K.r1);
      F(ctx, (c) => { c.moveTo(-90, H); for (let x = -90; x <= W + 90; x += 8) c.lineTo(x, top(x) + (i ? 0 : 16 * (0.5 + Math.abs(n(x / 26))))); c.lineTo(W + 90, H); c.closePath(); }, fill);
      if (i > 1) F(ctx, (c) => { for (let x = -90; x <= W + 90; x += 30 - i * 3) { const px = x + 10 * hash(x, i); pine(c, px, top(px) + 5, (14 + 22 * hash(x, i + 4)) * (i - 0.6), 10 * i, 0, 3); } }, fill);
    });
    if (i < 3) bars(ctx, [MIST[i]], W, t, (y) => y * H);
  });

  ctx.depthLayer?.('camp');
  // the ridge, the fire's light on it, and the tent
  const f = G.fire, fy = G.groundY(f.x) + 16, fl = 0.5 + 0.5 * nF(t * 3.3), fl2 = 0.5 + 0.5 * nF(t * 5.1 + 40);
  layer(0.8, () => {
    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 12) c.lineTo(x, G.groundY(x)); c.lineTo(W + 90, H + 60); c.closePath(); }, C.ink);
    F(ctx, (c) => { for (const q of G.TUFTS) { const y = G.groundY(q.x) + 4, sw = q.h * (0.25 * osc(p, q.c, q.ph) + 0.1); c.moveTo(q.x - 4, y); c.quadraticCurveTo(q.x + sw * 0.2, y - q.h * 0.6, q.x + sw, y - q.h); c.quadraticCurveTo(q.x + 4 + sw * 0.2, y - q.h * 0.6, q.x + 4, y); c.closePath(); } }, C.ink);
    F(ctx, (c) => el(c, f.x, fy + 14 * f.s, (330 + 26 * fl) * f.s, (46 + 4 * fl) * f.s), K.glow1);
    F(ctx, (c) => el(c, f.x, fy + 12 * f.s, (190 + 30 * fl2) * f.s, (26 + 4 * fl2) * f.s), K.glow2);

    // tent: lit from inside, its doorway the brightest thing after the fire
    { const { x, s } = G.tent, y = G.groundY(x + 110 * s) + 22;
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(112, -150); ctx.lineTo(-52, 4); ctx.moveTo(112, -150); ctx.lineTo(276, 4); ctx.stroke();
      F(ctx, (c) => poly(c, [[0, 0], [224, 0], [112, -150]]), C.rust);
      F(ctx, (c) => poly(c, [[112, -150], [224, 0], [150, 0]]), C.orange);
      F(ctx, (c) => poly(c, [[112, -112], [146, 0], [84, 0]]), fl > 0.35 ? C.gold : '#e8ac45');
      F(ctx, (c) => { poly(c, [[112, -112], [102, -56], [84, 0], [92, 0]]); c.rect(108, -168, 8, 22); }, C.ink);
      ctx.restore(); }

    // smoke, then the fire: three flames deep in three inks, over crossed logs and a ring of stones
    { const dt = 0.7, life = 9, n = Math.floor(t / dt);
      F(ctx, (c) => { for (let k = Math.ceil(life / dt); k >= 0; k--) { const id = n - k, a = t - id * dt; if (a < 0 || a >= life) continue; circle(c, f.x + (12 * a + 26 * Math.sin(a * 0.6 + id * 0.9)) * f.s, fy - (120 + 62 * a - a * a * 1.6) * f.s, Math.max(0.5, (9 + 10 * Math.sqrt(a) + 5 * hash(id, 1)) * (1 - Math.pow(a / life, 3)) * f.s)); } }, K.smoke); }
    ctx.save(); ctx.translate(f.x, fy); ctx.scale(f.s, f.s);
    F(ctx, (c) => { flame(c, 0, 0, 104, 190, t, 1); flame(c, -42, 0, 56, 104, t, 2); flame(c, 44, 0, 60, 118, t, 3); }, C.orange);
    F(ctx, (c) => { flame(c, 2, 0, 66, 128, t, 4); flame(c, -30, 0, 34, 62, t, 5); flame(c, 32, 0, 36, 70, t, 6); }, C.gold);
    F(ctx, (c) => flame(c, 0, 0, 32, 62, t, 7), C.cream);
    for (const a of [-0.2, 0.22]) { ctx.save(); ctx.rotate(a); F(ctx, (c) => pill(c, -74, -12, 148, 22), K.log); ctx.restore(); }
    F(ctx, (c) => { for (let k = 0; k < 7; k++) el(c, -96 + k * 32, 14 + 5 * Math.sin(k * 2.2), 17, 11); }, '#10294d');
    ctx.restore();
    // sparks ride the heat up, wander and go out
    for (const [fill, odd] of [[C.gold, 0], [C.orange, 1]]) F(ctx, (c) => { G.SPARKS.forEach((q, i) => { if (i % 2 !== odd) return; const u = (t / q.T + q.ph) % 1; circle(c, f.x + (q.dx * u + q.w * Math.sin(u * 9 + q.ph * 20)) * f.s, fy - (70 + q.up * u) * f.s, Math.max(0.3, q.r * (1 - u * u) * f.s)); }); }, fill);
  });

  ctx.depthLayer?.('pines');
  // pines either side
  layer(1, () => F(ctx, (c) => { for (const q of G.PINES) pine(c, q.x, H + q.h * 0.15, q.h, q.h * 0.36, q.h * 0.03 * osc(p, q.c, q.ph) + q.h * 0.01 * osc(p, 9, q.ph), 6); }, C.ink));
}
