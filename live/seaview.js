// Window Series No. 05: Sea View. The one daylight poster: open shutters and a sheer curtain frame a bright bay.
// A whitewashed town steps down the hillside on the right under terracotta roofs, with a church dome and cypresses;
// fishing boats bob at anchor, a sailboat crosses slowly, gulls glide, and the sun lies on the water in a path of
// glints. Geraniums nod on the sill. The curtain is one filled shape whose free edge and hem are travelling waves,
// so its folds run down and along it. The horizon is a share of the glass; the hill hangs off the right edge and
// the curtain off the left, so extra width becomes open sea between them.
import { mulberry, lerp, clamp, osc, noise1, poly, circle, pill, star4, frac, TAU } from './geom.js?v=20261011-focus';
import { C, F } from './kit.js?v=20261011-focus';
import { hash, el } from './bits.js?v=20261011-focus';

export const title = 'SEA VIEW', no = 'No. 05', text = '#12306c', dark = '#0e2658';
const M = { sky: '#a6d8ec', sea1: '#1f5fae', sea2: '#2f7ac8', sea3: '#74b6e2', hill: '#9db56b', cyp: '#24553f', white: '#fcf7ea', shade: '#d8caab', wall: '#12306c' };
const nH = noise1(1501), nC = noise1(1511);
const CLOUDS = [[0.1, 0.2, 420, 30, M.white, 3], [0.17, 0.3, 240, 22, M.white, 3], [0.62, 0.52, 360, 26, M.white, 5], [0.42, 0.74, 280, 18, M.white, 4]];

// Bars of cloud that cross the sky and come back in from the left: [x share, y, width, height, color, units per second].
// As bars() in bits.js, but what wraps is a share of the way across, so a change of size cannot throw them along.
function bars(ctx, list, W, t, yOf = (y) => y) {
  for (const [fx, y, w, h, col, v] of list) { const bw = Math.min(w, W * 0.42), span = W + bw + 160; F(ctx, (c) => pill(c, frac((fx * W + bw + 80) / span + (v * t) / 2300) * span - bw - 80, yOf(y), bw, h), col); }
}

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.35 * tall, rS = mulberry(1509), rG = mulberry(1513);   // sparkles, gulls
  const O = { x: 70, y: 62, w: W - 140, h: H - 62 - 150 * big }, B = O.y + O.h, R = O.x + O.w;
  const HY = O.y + O.h * (0.4 - 0.04 * tall);
  // the hill: rises from the shore at xL to its crest over a fixed span, then rolls on to the right edge
  const xL = O.x + O.w * (0.56 - 0.14 * tall), span = Math.min(R - xL, 760 * big), crest = HY - O.h * (0.2 + 0.05 * tall);
  const hillY = (x) => { const u = clamp((x - xL) / span); return lerp(B + 20, crest, 1 - (1 - u) * (1 - u)) + 18 * big * nH(x / 170) * u; };
  // houses in terraces, top row first so nearer ones overlap; some plots hold cypresses instead. Each terrace has its
  // own generator and starts where it meets the hillside (found to the unit), so a change of size slides the rows and
  // adds plots at the right or rows at the bottom, and no house changes into another
  const HOUSES = [], CYP = []; let rows = 0;
  for (let j = 0, ry = crest + 90 * big; ry < B + 70 * big; j++, ry += 72 * big) {
    const r = mulberry(1503 + 977 * j), lim = ry - 46 * big; let x = xL; while (x < R && hillY(x) > lim) x += 14; if (x > xL) for (x -= 14; x < R && hillY(x) > lim;) x += 1; x += r() * 40 * big; rows = j + 1;
    for (let n = 0; x < R + 20; n++) { const w = (64 + r() * 60) * big, h = (58 + r() * 44) * big, q = r(); if (q < 0.7) HOUSES.push({ x, y: ry, w, h, roof: r() < 0.5, row: j, win: 1 + Math.floor(r() * 2.5) }); else if (q < 0.9) for (let k = 0; k < 2; k++) CYP.push({ x: x + (0.3 + 0.45 * k) * w, y: ry + 4, h: (120 + r() * 90) * big, c: 4 + ((j + n + k) % 3), ph: r() }); x += w + r() * 14 * big; }
  }
  // the washing line hangs over the second house of a low terrace
  const wRow = HOUSES.filter((h) => h.row === Math.min(5, rows - 2)), wash = wRow[1] || wRow[0] || HOUSES[0];
  const church = { x: xL + span * (0.6 + 0.04 * tall) };
  // bands of sea: not a whole number, so that more height spreads them out and lets the next one in at the bottom
  const POOL = clamp((B - HY) / 52, 5, 12);
  const band = (j) => { const u = j / POOL; return { u, y0: HY + Math.pow(u, 1.3) * (B - HY), lam: 150 + 280 * u, amp: 2 + 7 * u }; };
  const sunX = O.x + O.w * (0.42 - 0.04 * tall);
  const SPARK = Array.from({ length: Math.round(40 + O.w / 30) }, () => { const v = rS(); return { x: O.x + rS() * (xL - O.x + 200), y: HY + 12 + v * (B - HY), s: 0.4 + v, c: [5, 7, 9, 11, 13][Math.floor(rS() * 5)], ph: rS() }; });
  const BOATS = [[-90, 0.86, 1.25, 0], [-330, 0.7, 1, 1], [-170, 0.56, 0.8, 2], [-520, 0.9, 1.15, 3]].map(([dx, fy, s, i]) => ({ x: Math.max(O.x + 60, xL + dx * big * (1 - 0.35 * tall)), y: lerp(HY, B, fy), s: s * big, i }));
  const GULLS = Array.from({ length: 5 }, (_, i) => ({ x: O.x + O.w * (0.25 + 0.5 * rG()), y: O.y + (HY - O.y) * (0.25 + 0.8 * rG()), ax: O.w * (0.16 + 0.12 * rG()), ay: O.h * (0.03 + 0.04 * rG()), f: 0.05 + 0.05 * rG(), ph: rG() * 9, s: (0.7 + 0.6 * rG()) * big, id: i }));
  const pots = [0.5 + 0.04 * tall, 0.7, 0.88].map((f) => O.x + O.w * f);
  return { W, H, tall, big, O, B, R, HY, xL, span, crest, hillY, HOUSES, CYP, church, POOL, band, sunX, SPARK, BOATS, GULLS, pots, wash };
}

function boat(ctx, b, p, t) {
  const bob = 4 * osc(p, 5 + b.i, b.i * 0.3), tilt = 0.05 * osc(p, 4 + b.i, b.i * 0.21), col = [C.orange, M.sea1, C.rust, C.gold][b.i];
  ctx.save(); ctx.translate(b.x, b.y + bob); ctx.scale(b.s, b.s);
  F(ctx, (c) => { for (let k = 0; k < 4; k++) { const w = (70 - k * 13) * (0.6 + 0.4 * osc(p, 6 + k, b.i * 0.4 + k * 0.2)); pill(c, 5 * osc(p, 5, k * 0.3) - w / 2, 22 + k * 11, w, 5); } }, M.white);
  ctx.rotate(tilt);
  F(ctx, (c) => poly(c, [[-62, -10], [68, -12], [50, 16], [-50, 16]]), M.white);
  F(ctx, (c) => { c.rect(-58, -10, 122, 8); c.rect(-22, -34, 34, 24); }, col);
  F(ctx, (c) => { c.rect(-3, -92, 4, 60); c.rect(-3, -64, 40, 3); c.rect(-14, -28, 9, 9); }, M.wall);
  F(ctx, (c) => { const f = Math.sin(t * 2.6 + b.i); c.moveTo(1, -92); c.quadraticCurveTo(12, -94 + 3 * f, 24, -87 - 2 * f); c.quadraticCurveTo(12, -84 + 2 * f, 1, -82); c.closePath(); }, C.orange);
  ctx.restore();
}

export function paint(ctx, p, t, G) {
  const { W, H, O, B, R, HY, xL, big } = G, k = big;
  ctx.save(); ctx.beginPath(); ctx.rect(O.x, O.y, O.w, O.h); ctx.clip();
  ctx.fillStyle = M.sky; ctx.fillRect(O.x, O.y, O.w, O.h);
  bars(ctx, CLOUDS, W, t, (y) => O.y + y * (HY - O.y));
  // a pale cape across the bay
  F(ctx, (c) => { c.moveTo(O.x, HY + 4); for (let x = O.x; x <= O.x + O.w * 0.5; x += 10) c.lineTo(x, HY - (O.h * 0.05 * Math.pow(1 - (x - O.x) / (O.w * 0.5), 0.7)) * (0.7 + 0.3 * nH(x / 120 + 9))); c.lineTo(O.x + O.w * 0.5, HY + 4); c.closePath(); }, M.sea3);

  // the sea: bands sliding slowly, white caps on them, the sun's path and loose sparkles
  for (let j = 0; j < G.POOL; j++) {
    const b = G.band(j), s = 1.2 * p * b.lam + j * 71, e = [];
    for (let x = O.x - 20; x <= R + 20; x += 10) e.push([x, b.y0 - (j ? b.amp * Math.sin(((x - s) / b.lam) * TAU) + 2 * osc(p, 4 + (j % 3), j * 0.17) : 0)]);
    F(ctx, (c) => { c.moveTo(e[0][0], e[0][1]); for (const q of e) c.lineTo(q[0], q[1]); c.lineTo(R + 20, B + 20); c.lineTo(O.x - 20, B + 20); c.closePath(); }, j === 0 ? M.sea3 : j % 2 ? M.sea2 : M.sea1);
    if (j < 2) continue;
    ctx.save(); ctx.beginPath(); ctx.moveTo(e[0][0], e[0][1] + 6); for (const q of e) ctx.lineTo(q[0], q[1] + 6 + 5 * b.u);
    ctx.strokeStyle = M.sea3; ctx.lineWidth = 2 + 2.5 * b.u; ctx.lineCap = 'round'; ctx.setLineDash([b.lam * 0.22, b.lam * 0.78]); ctx.lineDashOffset = -s + j * 97; ctx.stroke(); ctx.restore();
  }
  F(ctx, (c) => { const span = B - HY, n = 26; for (let i = 0; i < n; i++) { const u = i / n, a = 0.5 + 0.5 * osc(p, 5 + (i % 5), hash(i, 9)), w = (30 + 150 * u) * k * (0.5 + 0.8 * hash(i, 40)) * (0.4 + 0.9 * a); pill(c, G.sunX + (hash(i, 80) - 0.5) * (30 + 220 * u) * k + 6 * osc(p, 3, hash(i, 9)) - w / 2, HY + 10 + u * span * 0.97, w, (4 + 5 * u) * k); }
    for (const q of G.SPARK) { const a = osc(p, q.c, q.ph); if (a > 0.1) star4(c, q.x, q.y, (4 + 9 * q.s) * k * a); } }, M.white);

  // a sailboat works its way across, far out: about five minutes a crossing, whatever the width
  { const span = O.w + 500 * k, x = O.x - 250 * k + frac(0.3 + t / 309) * span, y = lerp(HY, B, 0.13) + 2 * osc(p, 5, 0.3), s = k * 0.9;
    ctx.save(); ctx.translate(x, y); ctx.rotate(0.03 * osc(p, 4, 0.6)); ctx.scale(s, s);
    F(ctx, (c) => { for (let i = 0; i < 3; i++) { const w = (50 - i * 12) * (0.6 + 0.4 * osc(p, 6 + i, i * 0.3)); pill(c, 4 - w / 2, 12 + i * 8, w, 4); } poly(c, [[4, -112], [4, -12], [58, -12]]); poly(c, [[-2, -96], [-2, -12], [-40, -12]]); }, M.white);
    F(ctx, (c) => { poly(c, [[-52, -8], [66, -8], [50, 10], [-42, 10]]); c.rect(-1, -118, 3, 112); }, M.wall);
    F(ctx, (c) => c.rect(-50, -8, 114, 5), C.orange);
    ctx.restore(); }

  // the hill and its town
  F(ctx, (c) => { c.moveTo(xL - 30, B + 30); for (let x = xL - 30; x <= R + 12; x += 12) c.lineTo(x, G.hillY(x)); c.lineTo(R + 12, B + 30); c.closePath(); }, M.hill);
  // church near the crest: nave, dome and cross, the bell tower on its uphill side
  { const x = G.church.x, y = G.hillY(x) + 80 * k;
    F(ctx, (c) => { c.rect(x + 110 * k, y - 250 * k, 54 * k, 560 * k); c.rect(x - 90 * k, y - 130 * k, 200 * k, 330 * k); }, C.cream);
    F(ctx, (c) => { c.rect(x + 150 * k, y - 250 * k, 14 * k, 560 * k); c.rect(x + 80 * k, y - 130 * k, 30 * k, 330 * k); }, M.shade);
    F(ctx, (c) => { c.moveTo(x - 62 * k, y - 130 * k); c.arc(x + 10 * k, y - 130 * k, 72 * k, Math.PI, 0); c.closePath(); c.rect(x + 3 * k, y - 222 * k, 14 * k, 22 * k); c.rect(x + 124 * k, y - 226 * k, 18 * k, 34 * k); c.rect(x - 20 * k, y - 96 * k, 22 * k, 40 * k); c.rect(x + 34 * k, y - 96 * k, 22 * k, 40 * k); }, M.sea1);
    F(ctx, (c) => { poly(c, [[x + 104 * k, y - 250 * k], [x + 170 * k, y - 250 * k], [x + 137 * k, y - 300 * k]]); c.rect(x - 96 * k, y - 136 * k, 212 * k, 9 * k); }, C.orange);
    F(ctx, (c) => { c.rect(x + 8 * k, y - 252 * k, 4 * k, 32 * k); c.rect(x + 1 * k, y - 244 * k, 18 * k, 4 * k); const sw = 0.05 * Math.sin(t * 0.9); circle(c, x + 133 * k + 30 * k * sw, y - 198 * k, 5 * k); }, C.gold); }
  const cyp = (c, q) => { const tip = q.h * 0.05 * osc(p, q.c, q.ph) + q.h * 0.02 * osc(p, 9, q.ph), w = q.h * 0.11; c.moveTo(q.x - w * 0.5, q.y); c.bezierCurveTo(q.x - w * 1.5, q.y - q.h * 0.35, q.x - w * 0.6 + tip * 0.4, q.y - q.h * 0.8, q.x + tip, q.y - q.h); c.bezierCurveTo(q.x + w * 0.6 + tip * 0.4, q.y - q.h * 0.8, q.x + w * 1.5, q.y - q.h * 0.35, q.x + w * 0.5, q.y); c.closePath(); };
  F(ctx, (c) => { for (const q of G.CYP) cyp(c, q); }, M.cyp);
  // houses: wall, shaded side, roof, windows; painted row by row so each terrace stands in front of the one above
  { let i = 0; while (i < G.HOUSES.length) { let j = i; while (j < G.HOUSES.length && G.HOUSES[j].y === G.HOUSES[i].y) j++; const row = G.HOUSES.slice(i, j); i = j;
      F(ctx, (c) => { for (const h of row) c.rect(h.x, h.y - h.h, h.w, h.h + 30 * k); }, C.cream);
      F(ctx, (c) => { for (const h of row) c.rect(h.x + h.w * 0.78, h.y - h.h, h.w * 0.22, h.h + 30 * k); }, M.shade);
      for (const [flag, fill] of [[true, C.orange], [false, C.rust]]) F(ctx, (c) => { for (const h of row) if (h.roof === flag) poly(c, [[h.x - 6 * k, h.y - h.h], [h.x + h.w + 6 * k, h.y - h.h], [h.x + h.w - 8 * k, h.y - h.h - 20 * k], [h.x + 10 * k, h.y - h.h - 20 * k]]); }, fill);
      F(ctx, (c) => { for (const h of row) for (let n = 0; n < h.win; n++) c.rect(h.x + (10 + n * 24) * k, h.y - h.h + 16 * k, 11 * k, 17 * k); }, M.sea1); } }
  // washing on a line between two houses, lifting in the breeze
  { const h = G.wash; if (h) { const x0 = h.x + 4, y0 = h.y - h.h - 2 * k, w = h.w * 0.9; F(ctx, (c) => c.rect(x0, y0 - 34 * k, w, 2), M.wall); [C.orange, M.white, M.sea2, C.gold].forEach((fill, n) => F(ctx, (c) => { const x = x0 + (0.08 + n * 0.23) * w, f = 5 * k * Math.sin(t * 1.9 + n * 1.3); poly(c, [[x, y0 - 33 * k], [x + 0.17 * w, y0 - 33 * k], [x + 0.17 * w + f, y0 - 6 * k], [x + f, y0 - 8 * k]]); }, fill)); } }

  // breakwater and the boats at anchor
  F(ctx, (c) => { pill(c, xL - 250 * k, lerp(HY, B, 0.42), 330 * k, 16 * k); c.rect(xL - 246 * k, lerp(HY, B, 0.42) - 26 * k, 8 * k, 30 * k); }, M.shade);
  F(ctx, (c) => circle(c, xL - 242 * k, lerp(HY, B, 0.42) - 30 * k, 7 * k), C.orange);
  for (const b of G.BOATS) boat(ctx, b, p, t);

  // gulls gliding on long loops; their wings barely move
  ctx.strokeStyle = M.white; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 4 * k; ctx.beginPath();
  for (const g of G.GULLS) { const x = g.x + g.ax * Math.sin(t * g.f + g.ph) + g.ax * 0.3 * Math.sin(t * g.f * 2.7 + g.ph * 2), y = g.y + g.ay * Math.sin(t * g.f * 1.6 + g.ph * 3), fl = 0.35 + 0.3 * Math.sin(t * 1.1 + g.ph) * Math.sin(t * 0.23 + g.ph), s = 30 * g.s, d = Math.cos(t * g.f + g.ph) > 0 ? 1 : -1;
    ctx.moveTo(x - s, y - s * fl * 0.3); ctx.quadraticCurveTo(x - s * 0.5, y - s * (0.3 + fl * 0.6), x, y); ctx.quadraticCurveTo(x + s * 0.5, y - s * (0.3 + fl * 0.6), x + s, y - s * fl * 0.3); ctx.moveTo(x, y); ctx.lineTo(x + d * s * 0.22, y + s * 0.06); }
  ctx.stroke();
  ctx.restore();

  ctx.depthLayer?.('window');
  // the room in shade: wall, the white reveal round the opening, the sill
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.rect(O.x, O.y, O.w, O.h); ctx.fillStyle = M.wall; ctx.fill('evenodd');
  F(ctx, (c) => { c.rect(O.x - 14, O.y - 14, O.w + 28, 14); c.rect(O.x - 14, O.y, 14, O.h); c.rect(R, O.y, 14, O.h); }, M.shade);
  // shutters folded back at either side, seen edge on: slats in the darker ink
  for (const sd of [-1, 1]) { const x0 = sd < 0 ? O.x : R, w = 78 * k, X = (v) => x0 - sd * v, a = 0.006 * osc(p, 3, sd * 0.2);
    F(ctx, (c) => poly(c, [[X(0), O.y - 6], [X(w), O.y + 26 * k + a * 900], [X(w), B - 20 * k - a * 900], [X(0), B + 4]]), M.sea2);
    F(ctx, (c) => { for (let y = O.y + 50 * k; y < B - 40 * k; y += 30 * k) poly(c, [[X(10 * k), y], [X(w - 10 * k), y + 5 * k], [X(w - 10 * k), y + 13 * k], [X(10 * k), y + 8 * k]]); poly(c, [[X(w), O.y + 26 * k], [X(w + 7 * k), O.y + 30 * k], [X(w + 7 * k), B - 24 * k], [X(w), B - 20 * k]]); }, M.sea1); }
  F(ctx, (c) => c.rect(O.x - 46, B, O.w + 92, 26 * k), C.cream);
  F(ctx, (c) => c.rect(O.x - 46, B + 26 * k, O.w + 92, 9 * k), M.shade);

  ctx.depthLayer?.('flowers');
  // geraniums: leaves, then heads of bloom nodding on their stalks
  { ctx.strokeStyle = M.cyp; ctx.lineWidth = 4 * k; ctx.lineCap = 'round'; ctx.beginPath();
    const heads = [];
    G.pots.forEach((x, n) => { for (let i = 0; i < 5; i++) { const a = -1.57 + (i - 2) * 0.42, l = (120 + 70 * hash(n, i)) * k, nod = (0.09 * osc(p, 5 + (i % 3), n * 0.3 + i * 0.17) + 0.04 * osc(p, 11, i * 0.4)) * l, tx = x + Math.cos(a) * l * 0.8 + nod, ty = B - 60 * k + Math.sin(a) * l; ctx.moveTo(x + (i - 2) * 9 * k, B - 60 * k); ctx.quadraticCurveTo(x + (i - 2) * 16 * k, ty + l * 0.4, tx, ty); heads.push([tx, ty, n * 5 + i]); } });
    ctx.stroke();
    F(ctx, (c) => { G.pots.forEach((x, n) => { for (let i = 0; i < 8; i++) { const a = hash(n, 20 + i) * TAU, d = (20 + 46 * hash(n, 30 + i)) * k; circle(c, x + Math.cos(a) * d * 1.3 + 3 * k * osc(p, 6, i * 0.2), B - 92 * k + Math.sin(a) * d * 0.6, (22 + 12 * hash(n, 40 + i)) * k); } }); }, M.cyp);
    F(ctx, (c) => { G.pots.forEach((x, n) => { for (let i = 0; i < 4; i++) { const a = hash(n, 50 + i) * TAU, d = (20 + 40 * hash(n, 60 + i)) * k; circle(c, x + Math.cos(a) * d * 1.3 + 3 * k * osc(p, 6, i * 0.3), B - 98 * k + Math.sin(a) * d * 0.5, 15 * k); } }); }, M.hill);
    F(ctx, (c) => { for (const [x, y] of heads) for (let j = 0; j < 6; j++) circle(c, x + Math.cos(j * 1.05) * 15 * k, y + Math.sin(j * 1.05) * 13 * k, 12 * k); }, C.orange);
    F(ctx, (c) => { for (const [x, y, id] of heads) { circle(c, x, y, 9 * k); if (id % 2) circle(c, x + 13 * k, y - 9 * k, 6 * k); } }, C.gold);
    F(ctx, (c) => { for (const x of G.pots) poly(c, [[x - 52 * k, B - 62 * k], [x + 52 * k, B - 62 * k], [x + 40 * k, B + 4 * k], [x - 40 * k, B + 4 * k]]); }, C.rust);
    F(ctx, (c) => { for (const x of G.pots) c.rect(x - 58 * k, B - 72 * k, 116 * k, 16 * k); }, C.orange); }

  ctx.depthLayer?.('curtain');
  // the sheer curtain: hung from the rod at the left, its free edge and hem carried on waves that travel
  { const x0 = O.x - 24, y0 = O.y - 30, yb = B + 12 * k, w0 = clamp(O.w * 0.26, 240, 460 * k), g = 0.5 + 0.5 * nC(t * 0.13), A = O.w * 0.07 * (1 + tallK(G));
    const xe = (s, f = 1) => x0 + (w0 * (1 - 0.3 * s) + A * g * Math.sin(Math.PI * s * 0.8) * (0.4 + s) + 20 * k * s * Math.sin(s * 7 - t * 1.4 - f * 3) + 10 * k * s * Math.sin(s * 13 - t * 2.2 + 1 + f * 5)) * f;
    const hemY = (u) => yb - 70 * k * g * u * u + 11 * k * u * Math.sin(u * 15 - t * 1.9) + 5 * k * Math.sin(u * 31 - t * 2.7);
    F(ctx, (c) => { c.moveTo(x0, y0); c.lineTo(x0 + w0, y0); for (let i = 1; i <= 30; i++) { const s = i / 30; c.lineTo(xe(s), lerp(y0, hemY(1), s)); } for (let i = 29; i >= 0; i--) { const u = i / 30; c.lineTo(lerp(x0, xe(1), u), hemY(u)); } c.closePath(); }, M.white);
    // folds: thin bands that follow the edge's wave, each a beat behind the last
    F(ctx, (c) => { for (const f of [0.22, 0.42, 0.61, 0.8]) { const Lp = [], Rp = []; for (let i = 0; i <= 20; i++) { const s = i / 20, x = xe(s, f), y = lerp(y0, hemY(f), s), ww = (2 + 7 * s) * k; Lp.push([x - ww, y]); Rp.push([x + ww * 0.3, y]); } poly(c, Lp.concat(Rp.reverse())); } }, M.shade);
    F(ctx, (c) => { for (let u = 0.1; u < 1; u += 0.1) c.rect(x0 + w0 * u - 2, y0, 4, 34 * k); }, M.shade);
    F(ctx, (c) => { pill(c, O.x - 44, y0 - 8, O.w + 88, 10); circle(c, O.x - 44, y0 - 3, 9); circle(c, R + 44, y0 - 3, 9); }, C.gold); }
}
const tallK = (G) => 0.6 * G.tall;
