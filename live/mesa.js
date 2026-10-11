// Nocturne Series No. 06: Desert Mesa. A big moon comes up behind the buttes; in front, saguaros and a wind pump
// that never stops turning. The series' blues give way to dusk violets and rust, with the same cream, gold and orange.
import { mulberry, clamp, osc, sway, noise1, poly, circle, pill, TAU } from './geom.js?v=20261011-ui';
import { C, F } from './kit.js?v=20261011-ui';
import { hash, el, makeStars, paintStars, meteor, bars } from './bits.js?v=20261011-ui';

export const title = 'DESERT MESA', no = 'No. 06', text = '#241640', dark = '#120b22';
const D = { sky: '#1a1338', r1: '#2c1a4c', r2: '#55285a', r3: '#93405a', far: '#b55f4e', mid: '#4a2148', near: '#3d1d42', f1: '#7a3550', f2: '#5c284c', f3: '#3d1d42', ink: '#120b22' };
const nP = noise1(501), nW = noise1(509), nG = noise1(521);
const CLOUDS = [[0.06, 0.24, 460, 28, D.r1, 5], [0.12, 0.31, 280, 22, D.r1, 5], [0.6, 0.5, 400, 26, D.r2, 8], [0.68, 0.56, 220, 18, D.r2, 8], [0.3, 0.74, 340, 20, D.r3, 11]];
const DUST = [[0.2, 0.3, 380, 14, D.f1, 16], [0.7, 0.55, 300, 12, D.f2, 22], [0.45, 0.8, 420, 14, D.f2, 28]];

// a butte: a flat cap on a waist of scree. Added to the current path.
function butte(c, x, base, w, h, skirt) {
  poly(c, [[x - w / 2 - skirt * 1.7, base], [x - w / 2 - skirt, base - h * 0.3], [x - w / 2 - skirt * 0.25, base - h * 0.42], [x - w / 2, base - h], [x + w / 2, base - h], [x + w / 2 + skirt * 0.25, base - h * 0.42], [x + w / 2 + skirt, base - h * 0.3], [x + w / 2 + skirt * 1.7, base]]);
}
// an upright bar with a rounded top
const post = (c, x, y, w, h) => { const r = w / 2; c.moveTo(x, y + r); c.arc(x + r, y + r, r, Math.PI, 0); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); };
function saguaro(c, x, y, s, arms) {
  post(c, x - 15 * s, y - 210 * s, 30 * s, 240 * s);
  for (const [side, at, out, up] of arms) { const ax = x + side * out * s, ay = y - at * s; c.rect(Math.min(x, ax), ay - 11 * s, Math.abs(ax - x), 22 * s); post(c, ax - 11 * s, ay - up * s, 22 * s, up * s + 11 * s); }
}

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall, r = mulberry(505);
  const HY = Math.round(H * (0.68 - 0.04 * tall));
  const MOON = { x: W * (0.46 - 0.06 * tall), y: HY - (190 + 150 * tall) * big, r: 112 };
  const STARS = makeStars(61, 170, W, HY * 0.9, (s) => Math.hypot(s.x - MOON.x, s.y - MOON.y) > 230);
  // the far tableland steps along the horizon
  const farY = (x) => HY - H * 0.035 - H * 0.05 * Math.round(2.4 * (0.5 + 0.5 * nP(x / 300))) / 2;
  const BUTTES = [[0.12, 150, 300, 46, 1], [0.27, 54, 240, 30, 1], [0.7 + 0.04 * tall, 330, 250, 60, 1], [0.9, 44, 300, 26, 1], [0.985, 120, 210, 40, 1]].map(([fx, w, h, sk]) => ({ x: fx * W, w: w * (0.8 + 0.2 * big), h: h * big, sk }));
  const groundY = (x) => H * 0.9 - 22 * tall + 20 * nG(x / 260) + H * 0.035 * Math.cos(clamp(x / W) * TAU);
  const pump = { x: W * (0.64 + 0.04 * tall), s: big };
  const CACTI = [[0.09, 1.25, [[-1, 96, 50, 70], [1, 132, 44, 56]]], [0.24, 0.72, [[1, 104, 42, 60]]], [0.88, 1.05, [[-1, 120, 46, 64], [1, 84, 50, 80]]], [0.42, 0.5, [[-1, 110, 40, 50], [1, 130, 36, 40]]]].map(([fx, s, arms]) => ({ x: fx * W, s: s * big, arms }));
  const TUFTS = Array.from({ length: Math.round(W / 30) }, () => ({ x: r() * W, h: 20 + r() * 46, c: [5, 7, 9][Math.floor(r() * 3)], ph: r(), n: 3 + Math.floor(r() * 3) }));
  return { W, H, HY, tall, big, MOON, STARS, farY, BUTTES, groundY, pump, CACTI, TUFTS };
}

export function paint(ctx, p, t, G) {
  const { W, H, HY, MOON, big } = G, a = (TAU * t) / 420, mx = MOON.x + sway(p, 0.03) + 60 * Math.sin(a), my = MOON.y - HY * 0.07 * (1 - Math.cos(a));
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  ctx.fillStyle = D.sky; ctx.fillRect(0, 0, W, H);
  F(ctx, (c) => circle(c, mx, my, 760), D.r1); F(ctx, (c) => circle(c, mx, my, 500), D.r2); F(ctx, (c) => circle(c, mx, my, 290), D.r3);
  paintStars(ctx, G.STARS, p);
  meteor(ctx, t, W, HY * 0.7, 13, 21);
  F(ctx, (c) => circle(c, mx, my, MOON.r), C.gold);
  F(ctx, (c) => { circle(c, mx - 34, my - 26, 20); circle(c, mx + 30, my + 22, 28); circle(c, mx + 40, my - 44, 11); circle(c, mx - 28, my + 48, 13); }, '#e6ab42');
  bars(ctx, CLOUDS, W, t, (y) => y * HY);

  ctx.depthLayer?.('mesas');
  // tableland on the horizon, then the buttes standing out on the plain
  layer(0.08, () => F(ctx, (c) => { c.moveTo(-90, HY + 6); let last = G.farY(-90); for (let x = -90; x <= W + 90; x += 6) { const y = G.farY(x); if (y !== last) { c.lineTo(x - 5, last); c.lineTo(x + 5, y); last = y; } } c.lineTo(W + 90, last); c.lineTo(W + 90, HY + 6); c.closePath(); }, D.far));
  layer(0.16, () => F(ctx, (c) => { for (const b of G.BUTTES) butte(c, b.x, HY + 6, b.w, b.h, b.sk); }, D.mid));

  // the plain, in three bands, with dust blowing low across it
  const floor = (f, wob, fill) => F(ctx, (c) => { const y0 = HY + (H - HY) * f; c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 14) c.lineTo(x, y0 + wob * nW(x / 240 + f * 30)); c.lineTo(W + 90, H + 60); c.closePath(); }, fill);
  layer(0.3, () => floor(0, 0, D.f1));
  // headlights far out on the plain, now and then
  { const n = Math.floor(t / 70), q = mulberry(n * 9973 + 4), go = q() < 0.7, dir = q() < 0.5 ? -1 : 1, u = (t - n * 70 - 4 - q() * 12) / 44;
    if (go && u >= 0 && u <= 1) { const x = dir > 0 ? -60 + u * (W + 120) : W + 60 - u * (W + 120), y = HY + (H - HY) * 0.1; F(ctx, (c) => poly(c, [[x, y - 3], [x + dir * 90, y - 10], [x + dir * 90, y + 6], [x, y + 3]]), C.gold); F(ctx, (c) => c.rect(x - dir * 26 - 13, y - 9, 26, 13), D.ink); } }
  bars(ctx, [DUST[0]], W, t, (y) => HY + (H - HY) * y * 0.6);
  layer(0.45, () => { floor(0.26, 14, D.f2); F(ctx, (c) => butte(c, W * 0.5, HY + (H - HY) * 0.3, 90 * big, 70 * big, 20 * big), D.f3); });
  bars(ctx, [DUST[1]], W, t, (y) => HY + (H - HY) * y * 0.6);
  layer(0.6, () => floor(0.5, 18, D.f3));
  bars(ctx, [DUST[2]], W, t, (y) => HY + (H - HY) * y * 0.6);

  ctx.depthLayer?.('cacti');
  // foreground: the wind pump, saguaros and dry grass on a dark rise
  layer(0.9, () => {
    const { x, s } = G.pump, y = G.groundY(x) + 10, wind = 1.1 * t + 2.4 * nW(t * 0.07), top = -300;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = D.ink; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath();
    for (const sd of [-1, 1]) { ctx.moveTo(sd * 62, 0); ctx.lineTo(sd * 10, top); }
    for (let k = 0; k < 4; k++) { const f0 = k / 4, f1 = (k + 1) / 4, w0 = 62 - 52 * f0, w1 = 62 - 52 * f1; ctx.moveTo(-w0, top * f0); ctx.lineTo(w1, top * f1); ctx.moveTo(w0, top * f0); ctx.lineTo(-w1, top * f1); ctx.moveTo(-w1, top * f1); ctx.lineTo(w1, top * f1); }
    ctx.stroke();
    // the vane swings a little to follow the wind; the wheel turns faster in the gusts
    ctx.save(); ctx.translate(0, top - 8); ctx.rotate(0.07 * osc(p, 3, 0.2));
    F(ctx, (c) => poly(c, [[0, -4], [-96, -8], [-140, -34], [-140, 34], [-96, 8], [0, 4]]), D.ink); ctx.restore();
    ctx.save(); ctx.translate(14, top - 8); ctx.rotate(wind);
    F(ctx, (c) => { for (let k = 0; k < 14; k++) { const b = (k * TAU) / 14, c0 = Math.cos(b), s0 = Math.sin(b), c1 = Math.cos(b + 0.3), s1 = Math.sin(b + 0.3); poly(c, [[c0 * 20, s0 * 20], [c0 * 78, s0 * 78], [c1 * 78, s1 * 78], [c1 * 20, s1 * 20]]); } circle(c, 0, 0, 12); }, D.ink);
    ctx.beginPath(); circle(ctx, 0, 0, 50); ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
    F(ctx, (c) => { c.rect(84, -52, 120, 52); c.rect(78, -58, 132, 8); }, D.ink);
    ctx.restore();

    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let gx = -90; gx <= W + 90; gx += 12) c.lineTo(gx, G.groundY(gx)); c.lineTo(W + 90, H + 60); c.closePath(); }, D.ink);
    F(ctx, (c) => { for (const q of G.CACTI) saguaro(c, q.x, G.groundY(q.x) + 14, q.s, q.arms); }, D.ink);
    F(ctx, (c) => { for (const q of G.TUFTS) { const gy = G.groundY(q.x) + 4; for (let k = 0; k < q.n; k++) { const bx = q.x + k * 7, h = q.h * (0.6 + 0.4 * hash(k, q.n)), sw = h * (0.22 * osc(p, q.c, q.ph + k * 0.05) + (k - q.n / 2) * 0.16); c.moveTo(bx - 3, gy); c.quadraticCurveTo(bx + sw * 0.2, gy - h * 0.6, bx + sw, gy - h); c.quadraticCurveTo(bx + 3 + sw * 0.2, gy - h * 0.6, bx + 3, gy); c.closePath(); } } }, D.ink);
    // a tumbleweed bowls across the rise now and then
    { const n = Math.floor(t / 23), q = mulberry(n * 3301 + 8), go = q() < 0.75, u = (t - n * 23 - 1 - q() * 6) / 13;
      if (go && u >= 0 && u <= 1) { const tx = -80 + u * (W + 160), rr = 24 * big, hop = Math.abs(Math.sin(u * 17 + q() * 6)) * 34 * big, ty = G.groundY(tx) - rr * 0.6 - hop;
        ctx.save(); ctx.translate(tx, ty); ctx.rotate(u * (W + 160) / rr); ctx.strokeStyle = D.ink; ctx.lineWidth = 3.5; ctx.beginPath();
        for (let k = 0; k < 5; k++) el(ctx, 3 * Math.cos(k * 2.1), 3 * Math.sin(k * 2.1), rr * (0.55 + 0.45 * hash(k, 3)), rr * (0.95 - 0.1 * k), k * 0.63);
        ctx.stroke(); ctx.restore(); } }
  });
}
