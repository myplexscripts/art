// Orbit Series No. 04: Red Planet. A rust desert under a dusty pink sky: a huge far volcano, layered mesas, a plain in
// bands and dunes with wind ripples in front. A small pale sun sits in flat rings and two moons cross at their own
// speeds. A rover crawls across the middle distance leaving tracks, a small base blinks on the far plain, and dust
// devils wander through in time slots.
import { mulberry, clamp, frac, osc, sway, noise1, poly, circle, pill, TAU } from './geom.js?v=20261011-clock-edge';
import { C, F } from './kit.js?v=20261011-clock-edge';
import { hash, el, bars } from './bits.js?v=20261011-clock-edge';

export const title = 'RED PLANET', no = 'No. 04', text = '#3a1712', dark = '#2a100e';
const R = { sky: '#dc9c78', k1: '#e4ab84', k2: '#ecbd94', k3: '#f4d2ab', vol: '#ca8463', vol2: '#bd7455', m1: '#b96a4c', m2: '#a35638', p1: '#c9744a', p2: C.rust, p3: '#974a2e', d1: '#7c3a26', d2: '#5c281c', ink: '#2e1310', ochre: '#dc9a50', dust: '#e6b38c', shade: '#c9b48c' };
const nP = noise1(1501), nD = noise1(1511), nV = noise1(1523);
const HAZE = [[0.1, 0.5, 520, 22, R.k1, 4], [0.55, 0.72, 420, 18, R.k1, 6], [0.8, 0.6, 300, 16, R.k2, 5]];
const SAND = [[0.15, 0.2, 360, 9, R.ochre, 34], [0.6, 0.5, 300, 8, R.p1, 46], [0.4, 0.82, 420, 10, R.ochre, 58]];

function butte(c, x, base, w, h, skirt) {
  poly(c, [[x - w / 2 - skirt * 1.7, base], [x - w / 2 - skirt, base - h * 0.3], [x - w / 2 - skirt * 0.25, base - h * 0.42], [x - w / 2, base - h], [x + w / 2, base - h], [x + w / 2 + skirt * 0.25, base - h * 0.42], [x + w / 2 + skirt, base - h * 0.3], [x + w / 2 + skirt * 1.7, base]]);
}

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall;
  const HY = Math.round(H * (0.6 - 0.03 * tall)), D = H - HY;
  const SUN = { x: W * (0.27 - 0.03 * tall), y: HY * 0.36, r: 26 * big };
  // the volcano: a shield so wide its slopes barely rise, with a notch of a caldera on top
  const VOL = { x: W * (0.66 - 0.06 * tall), w: Math.max(W * 0.5, 620), h: Math.min(clamp(HY * 0.5, 220, 560), Math.max(W * 0.5, 620) * 0.5) };
  const volY = (x) => { const u = Math.abs(x - VOL.x) / VOL.w; if (u >= 1) return HY; return HY - VOL.h * Math.pow(1 - Math.max(u, 0.1), 1.6) / Math.pow(0.9, 1.6) + (u < 0.075 ? VOL.h * 0.05 : 0) + 3 * nV(x / 40); };
  const FARM = [[0.05, 190, 70, 30], [0.2, 90, 44, 20], [0.36, 240, 58, 30], [0.93, 170, 80, 34]].map(([fx, w, h, sk]) => ({ x: fx * W, w: w * (0.8 + 0.2 * big), h: h * big, sk }));
  const MIDM = [[0.13 - 0.05 * tall, 210, 150, 44], [0.47, 70, 80, 22], [1.0, 260, 190, 50]].map(([fx, w, h, sk]) => ({ x: fx * W, w: w * (0.8 + 0.2 * big), h: h * big, sk }));
  const plain = [(x) => HY, (x) => HY + D * 0.15 + 9 * nP(x / 300), (x) => HY + D * 0.34 + 14 * nP(x / 260 + 30)];
  // dunes: long crests leaning one way, nearer ones bigger
  const dune = (j) => (x) => HY + D * (0.52 + 0.17 * j) - D * (0.1 + 0.03 * j) * (0.5 + 0.5 * Math.sin(x / (210 + 90 * j) + 1.7 * j + 0.8 * Math.sin(x / (330 + 70 * j) + j))) - 10 * nD(x / 170 + j * 13);
  const DUNES = [dune(0), dune(1), dune(2)];
  const BASE = { x: W * (0.8 - 0.04 * tall), y: HY + D * 0.085, s: 0.8 * big };
  const ROVER = { y: HY + D * 0.25, s: 0.85 * big };
  const r = mulberry(1507);
  const ROCKS = Array.from({ length: Math.round(W / 70) }, () => { const x = r() * W, f = r(); return { x, y: HY + D * (0.03 + 0.42 * f), w: (5 + 12 * r()) * (0.5 + f) * big }; });
  return { W, H, HY, D, tall, big, SUN, VOL, volY, FARM, MIDM, plain, DUNES, BASE, ROVER, ROCKS };
}

function rover(ctx, t) {
  const a = t * 0.31, ca = Math.cos(a);
  F(ctx, (c) => el(c, 26, 2, 62, 5), R.p3);
  ctx.strokeStyle = R.ink; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath();
  ctx.moveTo(-30, -6); ctx.lineTo(-14, -20); ctx.lineTo(0, -6); ctx.moveTo(-14, -20); ctx.lineTo(30, -6); ctx.moveTo(22, -30); ctx.lineTo(22, -62); ctx.moveTo(-26, -30); ctx.lineTo(-30, -46); ctx.stroke();
  F(ctx, (c) => { for (const wx of [-30, 0, 30]) circle(c, wx, -8, 9); }, R.ink);
  F(ctx, (c) => { for (const wx of [-30, 0, 30]) circle(c, wx, -8, 3.5); c.rect(-36, -34, 66, 14); }, C.cream);
  F(ctx, (c) => c.rect(-2, -34, 32, 14), R.shade);
  F(ctx, (c) => poly(c, [[-42, -37], [26, -37], [20, -43], [-36, -43]]), C.deep);
  F(ctx, (c) => { c.rect(-42, -38, 68, 2.5); el(c, -32, -50, 11, 5, -0.5); }, C.gold);
  // the mast camera looks slowly round: its head narrows as it turns away and its lens shows on the side it faces
  const hw = 6 + 6 * Math.abs(ca);
  F(ctx, (c) => c.rect(22 - hw, -72, 2 * hw, 11), C.cream);
  F(ctx, (c) => circle(c, 22 + 8 * Math.sin(a), -66.5, 3), Math.cos(a) > -0.2 ? C.gold : R.ink);
}

function base(ctx, t) {
  F(ctx, (c) => el(c, 40, 3, 150, 7), R.p2);
  F(ctx, (c) => { c.moveTo(-46, 0); c.arc(0, 0, 46, Math.PI, 0); c.closePath(); c.rect(40, -22, 50, 22); }, C.cream);
  F(ctx, (c) => { c.moveTo(6, 0); c.lineTo(6, -45.6); c.arc(0, 0, 46, -1.44, 0); c.closePath(); c.rect(66, -22, 24, 22); }, R.shade);
  F(ctx, (c) => { c.rect(-12, -22, 16, 22); c.rect(-34, -18, 10, 8); c.rect(104, -52, 3, 52); for (const px of [-120, -86]) { c.rect(px + 12, -14, 3, 14); } }, R.ink);
  F(ctx, (c) => { for (const px of [-120, -86]) poly(c, [[px, -14], [px + 28, -30], [px + 30, -26], [px + 2, -10]]); }, C.deep);
  F(ctx, (c) => { for (const px of [-120, -86]) poly(c, [[px, -14], [px + 28, -30], [px + 28.6, -28.6], [px + 0.6, -12.6]]); c.rect(40, -25, 50, 3); c.rect(-46, -3, 92, 3); }, C.gold);
  const on = Math.pow(Math.max(0, Math.sin(t * 1.7)), 6);
  F(ctx, (c) => circle(c, 105.5, -54, 3.5 + 4.5 * on), on > 0.3 ? C.gold : C.orange);
}

export function paint(ctx, p, t, G) {
  const { W, H, HY, D, big, SUN, VOL } = G;
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  ctx.fillStyle = R.sky; ctx.fillRect(0, 0, W, H);
  const sx = SUN.x + sway(p, 0.02), sy = SUN.y + HY * 0.04 * Math.sin((TAU * t) / 600), sr = SUN.r;
  F(ctx, (c) => circle(c, sx, sy, sr * 11), R.k1); F(ctx, (c) => circle(c, sx, sy, sr * 6.5), R.k2); F(ctx, (c) => circle(c, sx, sy, sr * 3), R.k3);
  F(ctx, (c) => circle(c, sx, sy, sr), C.cream);
  // two moons: a lumpy one that hurries across, and a speck that takes its time
  for (const [T, ph, yb, w, h] of [[170, 0.3, 0.2, 8, 6], [610, 0.62, 0.11, 3.5, 3.5]]) { const u = (((t / T + ph) % 1) + 1) % 1, x = -40 + u * (W + 80), y = HY * (yb - 0.07 * Math.sin(Math.PI * u)); F(ctx, (c) => { el(c, x, y, w * big, h * big, 0.5); if (w > 5) circle(c, x + 3 * big, y + 2 * big, 4.5 * big); }, C.cream); }
  bars(ctx, HAZE, W, t, (y) => y * HY);

  ctx.depthLayer?.('volcano');
  // the volcano, with a darker foot, and thin haze drifting across its flank
  layer(0.04, () => {
    F(ctx, (c) => { c.moveTo(VOL.x - VOL.w, HY + 4); for (let x = VOL.x - VOL.w; x <= VOL.x + VOL.w; x += 12) c.lineTo(x, G.volY(x)); c.lineTo(VOL.x + VOL.w, HY + 4); c.closePath(); }, R.vol);
    F(ctx, (c) => { c.moveTo(VOL.x - VOL.w, HY + 4); for (let x = VOL.x - VOL.w; x <= VOL.x + VOL.w; x += 12) c.lineTo(x, Math.max(G.volY(x) + 6, HY - VOL.h * (0.2 + 0.07 * nV(x / 150)))); c.lineTo(VOL.x + VOL.w, HY + 4); c.closePath(); }, R.vol2);
  });
  bars(ctx, [[0.3, 0.86, 380, 12, R.k1, 7], [0.7, 0.8, 260, 10, R.k1, 9]], W, t, (y) => y * HY);
  layer(0.1, () => F(ctx, (c) => { for (const b of G.FARM) butte(c, b.x, HY + 6, b.w, b.h, b.sk); }, R.m1));
  layer(0.18, () => F(ctx, (c) => { for (const b of G.MIDM) butte(c, b.x, HY + 8, b.w, b.h, b.sk); }, R.m2));

  ctx.depthLayer?.('plain');
  // the plain in three bands, with the base on the far one and the rover on the next
  const band = (j, fill) => F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 16) c.lineTo(x, G.plain[j](x)); c.lineTo(W + 90, H + 60); c.closePath(); }, fill);
  const rocks = (lo, hi, fill) => F(ctx, (c) => { for (const q of G.ROCKS) if (q.y >= lo && q.y < hi) poly(c, [[q.x - q.w, q.y], [q.x - q.w * 0.5, q.y - q.w * 0.8], [q.x + q.w * 0.4, q.y - q.w * 0.6], [q.x + q.w * 2.2, q.y]]); }, fill);
  layer(0.25, () => {
    band(0, R.p1); rocks(HY, HY + D * 0.15, R.p2);
    const { x, y, s } = G.BASE; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); base(ctx, t); ctx.restore();
  });
  // a dust devil: a leaning stack of flat ovals, each sliding from side to side a little after the one below
  const devil = (seed, slot, y0, sc) => {
    const n = Math.floor(t / slot), q = mulberry(n * 5179 + seed), go = q() < 0.8, dur = slot * 0.7, u = (t - n * slot - q() * slot * 0.25) / dur, x0 = W * (0.1 + 0.8 * q()), dir = q() < 0.5 ? -1 : 1;
    if (!go || u <= 0 || u >= 1) return;
    const grow = Math.pow(Math.sin(Math.PI * u), 0.6), h = (150 + 110 * q()) * sc * big * grow, x = x0 + dir * W * 0.22 * u + 30 * nD(t * 0.3 + seed), lean = 26 * nD(t * 0.21 + seed * 5) * sc;
    F(ctx, (c) => { el(c, x, y0, 34 * sc * big * grow, 6 * sc * big); for (let k = 0; k < 13; k++) { const f = k / 12, w = (5 + 30 * Math.pow(f, 1.4)) * sc * big * grow; el(c, x + lean * f * 2 + Math.sin(k * 0.8 - t * 3.2) * w * 0.45, y0 - h * f, w, h / 15); } }, R.dust);
  };
  devil(3, 67, HY + D * 0.1, 0.6);
  layer(0.34, () => {
    band(1, R.p2); rocks(HY + D * 0.15, HY + D * 0.34, R.p3);
    // the rover: about six and a half minutes to cross at any size, then it starts again from the left with the tracks
    // swept clean; the crossing is a share of the way, so a change of size slides it and never throws it
    const { y, s } = G.ROVER, span = W + 360, x = -180 + frac(t / 393) * span;
    ctx.strokeStyle = R.p3; ctx.lineWidth = 2.5 * s; ctx.setLineDash([7 * s, 4 * s]); ctx.beginPath();
    for (const dy of [0, 5]) { ctx.moveTo(-190, y + dy * s); ctx.lineTo(x - 30 * s, y + dy * s); } ctx.stroke(); ctx.setLineDash([]);
    ctx.save(); ctx.translate(x, y + 1.2 * nD(x / 14)); ctx.rotate(0.02 * nD(x / 23 + 7)); ctx.scale(s, s); rover(ctx, t); ctx.restore();
  });
  bars(ctx, [SAND[0]], W, t, (y) => HY + D * (0.2 + 0.2 * y));
  devil(11, 89, HY + D * 0.3, 1);
  layer(0.45, () => { band(2, R.p3); rocks(HY + D * 0.34, H, R.d1); });

  ctx.depthLayer?.('dunes');
  // dunes: each a lit crest over its shaded body, with ripples that creep along it and sand streaming low in between
  const cols = [[R.ochre, R.d1], [R.p1, R.d2], [R.d1, R.ink]];
  G.DUNES.forEach((top, j) => {
    layer(0.55 + 0.17 * j, () => {
      F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 12) c.lineTo(x, top(x)); c.lineTo(W + 90, H + 60); c.closePath(); }, cols[j][0]);
      F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 12) c.lineTo(x, top(x) + (10 + 6 * j) + D * (0.03 + 0.012 * j) * (0.5 + 0.5 * Math.sin(x / (210 + 90 * j) + 1.7 * j + 0.8 * Math.sin(x / (330 + 70 * j) + j) + 1.1))); c.lineTo(W + 90, H + 60); c.closePath(); }, cols[j][1]);
      ctx.save(); ctx.strokeStyle = cols[j][0]; ctx.lineCap = 'round'; ctx.lineWidth = 2.5 + j;
      for (let k = 0; k < 3; k++) { const dy = D * (0.07 + 0.016 * j) + 18 + k * (13 + 5 * j); ctx.setLineDash([70 + 40 * hash(k, j), 50 + 90 * hash(k, j + 5)]); ctx.lineDashOffset = k * 91 + j * 37 - (5 + 3 * j + 2 * k) * t; ctx.beginPath(); for (let x = -90; x <= W + 90; x += 24) { const yy = top(x) + dy + 4 * Math.sin(x / 60 + k); if (x === -90) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); } ctx.stroke(); }
      ctx.restore();
    });
    if (j < 2) bars(ctx, [SAND[j + 1]], W, t, () => HY + D * (0.6 + 0.17 * j));
  });
}
