// Deep Series No. 05: Open Blue. Looking up through open water: the surface is the palest band along the top, with
// the sun as a bright patch that wobbles on it and long shafts fanning down from it, and the water darkens band by
// band to navy at the bottom. A whale crosses in some of the long time slots, now and then with a calf under her; a
// loose ball of small fish wheels as one body lower down, and a ray or a turtle goes over between times.
// Nothing stands on anything here, so a wider or taller frame is simply more water.
import { mulberry, clamp, osc, noise1, poly, circle, frac, TAU } from './geom.js?v=20261011-focus';
import { C, F } from './kit.js?v=20261011-focus';
import { hash, el } from './bits.js?v=20261011-focus';

export const title = 'OPEN BLUE', no = 'No. 05', text = '#0e2f5a', dark = '#081a36';
const K = { w: ['#c5efe0', '#86d3d6', '#4eaecb', '#2f86b4', '#1f6297', '#15457a', '#0e2f5a'], light: '#e8f8e6', whale: '#0b2344', ink: '#081a36' };
const SHARE = [0, 0.075, 0.2, 0.36, 0.53, 0.7, 0.86];
const nA = noise1(1501);

// A fish as a pointed oval and a tail triangle, added to the current path. fx is its length along x, signed, so a fish
// that turns shortens and then points the other way; fy tips it; wag swings the tail.
function fish(c, x, y, s, fx, fy = 0, wag = 0) {
  const h = 0.34 * s * (fx < 0 ? -1 : 1), nx = x + fx * s, ny = y + fy * s, tx = x - fx * 0.7 * s, ty = y - fy * 0.7 * s, ex = x - fx * 1.3 * s, ey = y - fy * 1.3 * s + wag * s;
  c.moveTo(nx, ny); c.quadraticCurveTo(x, y - h * 1.5, tx, ty); c.quadraticCurveTo(x, y + h * 1.5, nx, ny); c.closePath();
  c.moveTo(x - fx * 0.5 * s, y - fy * 0.5 * s); c.lineTo(ex, ey - h * 1.1); c.lineTo(ex, ey + h * 1.1); c.closePath();
}

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall, r = mulberry(1511);
  const SUN = { x: W * (0.64 - 0.12 * tall), y: H * 0.03, r: 150 * big };
  const reach = Math.hypot(W, H);
  const SHAFTS = Array.from({ length: 9 }, (_, i) => ({ a: -1.15 + (i + 0.2 + 0.6 * r()) * (2.3 / 9), w: 0.03 + 0.045 * r(), len: reach * 1.1, c: 1 + (i % 3), ph: r() }));
  const BALL = Array.from({ length: Math.round(120 + 30 * tall) }, (_, i) => ({ a: r() * TAU, rad: 0.2 + 0.8 * Math.sqrt(r()), w: 0.8 + 0.4 * r(), s: (8 + 5 * r()) * big, ph: r(), hot: i % 6 === 0 }));
  // Bubbles and specks take their numbers from hash(their own index, k), so they have the same ones at every size.
  // Each keeps a share of the way across or up (u, x, y) and a rate in crossings a second (v, d: the old speeds
  // over a frame 1800 wide and 900 high), so the wrap never depends on the size.
  const h = (L, i, k) => hash(L * 1000 + i, 700 + k);
  const BUB = Array.from({ length: Math.round(12 + W / 100) }, (_, i) => ({ u: h(1, i, 0), v: (34 + h(1, i, 1) * 46) / 960, r: 2 + h(1, i, 2) * 4.5, ph: h(1, i, 3), f: 0.25 + h(1, i, 4) * 0.5 }));
  const SPECK = Array.from({ length: Math.round(30 + W / 40) }, (_, i) => ({ x: h(2, i, 0), y: h(2, i, 1), d: (3 + h(2, i, 2) * 8) / 1800, v: (2 + h(2, i, 3) * 6) / 900, r: 1.2 + h(2, i, 4) * 2, ph: h(2, i, 5) }));
  return { W, H, tall, big, SUN, SHAFTS, BALL, BUB, SPECK, whaleL: clamp(W * 0.56, 660, 1050) };
}

// the shafts all leave the sun's patch and fan out below it; each swings a little on its own time
function shafts(c, G, p) {
  const { x, y } = G.SUN;
  for (const s of G.SHAFTS) { const a = s.a + 0.05 * osc(p, s.c, s.ph) + 0.03 * osc(p, 5, s.ph * 3), w = s.w * (1 + 0.25 * osc(p, s.c + 1, s.ph)); poly(c, [[x - 14, y - 30], [x + 14, y - 30], [x + Math.sin(a + w) * s.len, y + Math.cos(a + w) * s.len], [x + Math.sin(a - w) * s.len, y + Math.cos(a - w) * s.len]]); }
}
// a wobbling blob for the sun on the surface, flattened because we see the surface edge on from below
function blob(c, x, y, rx, ry, t, k) {
  for (let i = 0; i <= 40; i++) { const a = (i / 40) * TAU, rr = 1 + 0.16 * Math.sin(3 * a + t * 0.7 + k) + 0.1 * Math.sin(5 * a - t * 1.1 + k * 2) + 0.07 * Math.sin(8 * a + t * 1.6); const px = x + Math.cos(a) * rx * rr, py = y + Math.sin(a) * ry * rr; i ? c.lineTo(px, py) : c.moveTo(px, py); }
  c.closePath();
}

// The whale in her own units: about 1000 long, snout at the right. The body is built along a spine whose after half
// bends up and down with the tail beat, and the flukes ride on the end of it.
const TOP = (s) => 9 + 80 * Math.pow(Math.sin(Math.PI * Math.pow(s, 0.72)), 0.9) * (1 - 0.35 * s);
const BOT = (s) => 9 + 104 * Math.sin(Math.PI * Math.pow(s, 0.62)) * (1 - 0.4 * s);
function whale(ctx, x, y, sc, dir, t, ph, belly) {
  const w = t * 0.75 + ph, bend = (s) => 150 * Math.pow(Math.max(0, s - 0.42), 1.6) * Math.sin(w - s * 2.2) + 10 * Math.sin(w + 1) * (0.5 - s);
  const X = (s) => 480 - 880 * s, up = [], dn = [];
  for (let i = 0; i <= 30; i++) { const s = i / 30, o = bend(s); up.push([X(s), o - TOP(s)]); dn.push([X(s), o + BOT(s)]); }
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * sc, sc); ctx.rotate(0.03 * Math.sin(w + 0.6));
  const e = bend(1), th = Math.atan2(bend(1) - bend(0.96), -35) - Math.PI + 0.45 * Math.cos(w - 2.4), cs = Math.cos(th), sn = Math.sin(th), fl = 20 * Math.sin(w * 0.5);
  const fluke = [[10, -9], [-46, -64], [-128, -92], [-96, -40], [-80, 0], [-96, 40], [-128, 92], [-46, 64], [10, 9]].map(([a, b]) => [-400 + a * cs - b * 0.62 * sn, e + a * sn + b * 0.62 * cs]);
  F(ctx, (c) => {
    poly(c, up.concat(dn.reverse())); poly(c, fluke);
    poly(c, [[286, bend(0.22) + 70], [196, bend(0.32) + 84], [70, 250 + fl], [34, 262 + fl], [60, 206 + fl]]);              // the long flipper
    const d = bend(0.68); poly(c, [[-92, d - TOP(0.65) + 4], [-158, d - TOP(0.72) + 6], [-142, d - TOP(0.7) - 26]]);       // the small fin on her back
  }, K.whale);
  // the pale underside of the throat
  F(ctx, (c) => { c.moveTo(X(0.03), bend(0.03) + BOT(0.03)); for (let i = 1; i <= 16; i++) { const s = 0.03 + i * 0.03; c.lineTo(X(s), bend(s) + BOT(s)); } for (let i = 16; i >= 0; i--) { const s = 0.03 + i * 0.03; c.lineTo(X(s), bend(s) + BOT(s) * (0.55 + 0.45 * Math.abs(i - 8) / 8)); } c.closePath(); }, belly);
  ctx.restore();
}
// a ray and a turtle, both seen from underneath as plain dark shapes
function ray(ctx, x, y, s, dir, t) {
  const f = Math.sin(t * 1.5), g = Math.sin(t * 1.5 - 0.8);
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
  F(ctx, (c) => { c.moveTo(52, 0); c.quadraticCurveTo(20, -16, -6 + 6 * g, -52 - 14 * f); c.quadraticCurveTo(-14, -12, -44, 0); c.quadraticCurveTo(-14, 12, -6 + 6 * g, 52 + 14 * f); c.quadraticCurveTo(20, 16, 52, 0); c.closePath(); poly(c, [[-40, -3], [-40, 3], [-150, 6 * g]]); }, K.ink);
  ctx.restore();
}
function turtle(ctx, x, y, s, dir, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s); ctx.rotate(-0.08 + 0.04 * Math.sin(t * 0.7));
  const a = 2.1 + 0.75 * Math.sin(t * 1.5), b = 2.5 + 0.3 * Math.sin(t * 1.5 - 1);
  F(ctx, (c) => { el(c, 0, 0, 48, 29); el(c, 56, -3, 15, 10); poly(c, [[34, 2], [12, 6], [20 + Math.cos(a) * 74, 4 + Math.sin(a) * 74], [26 + Math.cos(a) * 40, 12 + Math.sin(a) * 40]]); poly(c, [[-30, 6], [-44, 2], [-40 + Math.cos(b) * 38, 8 + Math.sin(b) * 38]]); poly(c, [[-44, -4], [-44, 5], [-60, 2]]); }, K.ink);
  ctx.restore();
}

export function paint(ctx, p, t, G) {
  const { W, H, big, SUN } = G;
  const sx = SUN.x + 20 * osc(p, 1, 0.3), sun = { ...G, SUN: { x: sx, y: SUN.y } };
  // water in flat bands, palest at the surface; a shaft crossing a band takes the colour of the band above
  K.w.forEach((col, j) => {
    const top = (c) => { c.moveTo(-20, H + 20); for (let x = -20; x <= W + 60; x += 40) c.lineTo(x, j ? H * SHARE[j] + (j === 1 ? 7 : 12) * Math.sin(x / (j === 1 ? 120 : 260) + t * (j === 1 ? 0.5 : 0.21) + j * 2.1) + 7 * Math.sin(x / 97 - t * 0.17 + j) : -20); c.lineTo(W + 60, H + 20); c.closePath(); };
    F(ctx, top, col);
    ctx.save(); ctx.beginPath(); top(ctx); ctx.clip(); F(ctx, (c) => shafts(c, sun, p), j ? K.w[j - 1] : K.light); ctx.restore();
  });
  // the sun on the surface, and the bright undersides of the waves around it
  F(ctx, (c) => blob(c, sx, SUN.y, SUN.r * 1.7, SUN.r * 0.5, t * 0.6, 1), K.light);
  F(ctx, (c) => blob(c, sx, SUN.y, SUN.r, SUN.r * 0.3, t * 0.8, 3), C.cream);
  F(ctx, (c) => blob(c, sx, SUN.y - 4, SUN.r * 0.42, SUN.r * 0.13, t, 5), C.gold);
  ctx.save(); ctx.strokeStyle = K.light; ctx.lineCap = 'round';
  for (let k = 0; k < 4; k++) { const y = H * (0.085 + 0.034 * k) + 4 * osc(p, 5, k * 0.3); ctx.lineWidth = (7 - k) * big; ctx.setLineDash([(70 - 12 * k) * big, (150 + 60 * hash(k, 1)) * big]); ctx.lineDashOffset = (k * 133 + (14 + 5 * k) * t * (k % 2 ? 1 : -1)) * big; /* scaled like the dashes, so the pattern holds still as big changes */ ctx.beginPath(); ctx.moveTo(-40, y); ctx.lineTo(W + 40, y); ctx.stroke(); }
  ctx.restore();

  ctx.depthLayer?.('fish');
  // the bait ball: every fish circles the middle, and the middle wanders and the outline keeps changing
  { const cx = W * (0.46 + 0.2 * Math.sin(t * 0.023 + 1) + 0.08 * Math.sin(t * 0.041)), cy = H * (0.68 + 0.08 * Math.sin(t * 0.031) + 0.03 * Math.sin(t * 0.057 + 2)), R = Math.min(W, H) * 0.2 * (1 + 0.12 * Math.sin(t * 0.045)), sq = 0.6 * (1 + 0.18 * Math.sin(t * 0.05 + 1));
    for (const hot of [false, true]) F(ctx, (c) => { for (const f of G.BALL) { if (f.hot !== hot) continue;
      const a = f.a + 0.2 * f.w * t, rr = R * f.rad * (1 + 0.3 * Math.sin(2 * a + t * 0.11) + 0.18 * Math.sin(3 * a - t * 0.07 + 1)) + 8 * Math.sin(t * 0.9 + f.ph * 30);
      fish(c, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * sq, f.s, -Math.sin(a), Math.cos(a) * 0.45, 0.12 * Math.sin(t * 6 + f.ph * 20)); } }, hot ? C.orange : C.gold); }

  // a ray or a turtle goes over in some of the short slots
  { const slot = 41, n = Math.floor(t / slot), q = mulberry(n * 3301 + 7), go = q() < 0.75, dir = q() < 0.5 ? -1 : 1, u = (t - n * slot - 1 - q() * 5) / 34, y0 = H * (0.2 + 0.25 * q()), kind = q();
    if (go && u >= 0 && u <= 1) { const x = dir > 0 ? -220 + u * (W + 440) : W + 220 - u * (W + 440), y = y0 + 20 * Math.sin(t * 0.4) - H * 0.05 * u; kind < 0.55 ? ray(ctx, x, y, 1.3 * big, dir, t) : turtle(ctx, x, y, 1.2 * big, dir, t); } }

  ctx.depthLayer?.('whale');
  // the whale: one long slot at a time, most of them with a whale in, some of those with a calf keeping station below
  { const slot = 140, n = Math.floor(t / slot), q = mulberry(n * 9151 + 11), go = q() < 0.85, dir = q() < 0.5 ? -1 : 1, u = (t - n * slot - 4 - q() * 30) / 95, y0 = H * (0.36 + 0.14 * q()), calf = q() < 0.5, L = G.whaleL, sc = L / 1000;
    if (go && u >= 0 && u <= 1) { const span = W + 2.4 * L, x = dir > 0 ? -1.2 * L + u * span : W + 1.2 * L - u * span, y = y0 + H * 0.03 * Math.sin(t * 0.13) + H * 0.04 * (u - 0.5);
      if (calf) whale(ctx, x - dir * L * 0.2, y + L * 0.3 + 10 * Math.sin(t * 0.3), sc * 0.42, dir, t * 1.35, 2, K.w[4]);
      whale(ctx, x, y, sc, dir, t, 0, K.w[5]); } }

  ctx.depthLayer?.('bubbles');
  { const span = H + 60; ctx.strokeStyle = C.cream; ctx.lineWidth = 2.5; ctx.beginPath();
    G.BUB.forEach((b, i) => { const d = b.u + b.v * t, n = Math.floor(d); circle(ctx, hash(i, n) * W + 12 * Math.sin(TAU * (t * b.f + b.ph)), H + 30 - (d - n) * span, b.r * big); });
    ctx.stroke(); }
  F(ctx, (c) => { for (const f of G.SPECK) circle(c, frac(f.x + f.d * t + (20 * nA(t * 0.05 + f.ph * 40)) / W) * W, frac(f.y - f.v * t) * H, f.r * big); }, C.cream);
}
