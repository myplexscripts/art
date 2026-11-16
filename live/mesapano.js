// Desert Mesa as an endless panorama for a television's home screen. The plain slides past from right to left,
// nearer layers faster, under a moon and stars that stay put. Each layer is a strip that repeats at its own width and
// moves a whole number of those widths in one LOOP; every other motion (wind pump, grass, dust, twinkle, the odd
// tumbleweed, meteor or pair of headlights) also comes round a whole number of times, so time LOOP is time 0 again
// and a recording of one loop repeats without a seam.
// Drawn in 1080-tall design units; any width is more plain, never a stretched one.
import { mulberry, clamp, poly, circle, pill, star4, TAU, frac } from './geom.js?v=20261019-after-hours-detail';

export const title = 'Desert Mesa Drift', LOOP = 360;
const D = { sky: '#1a1338', r1: '#2c1a4c', r2: '#55285a', r3: '#93405a', far: '#b55f4e', mid: '#4a2148', f1: '#7a3550', f2: '#5c284c', f3: '#3d1d42', ink: '#120b22', gold: '#f0bd4d', crater: '#e6ab42', cream: '#f2e5c3' };
const F = (c, build, fill) => { c.beginPath(); build(c); c.fillStyle = fill; c.fill(); };
const hash = (i, k = 0) => { let h = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(k + 1, 0xc2b2ae35); h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12; return (h >>> 0) / 4294967296; };
// n whole cycles per loop
const wave = (t, n, ph = 0) => Math.sin(TAU * (n * t / LOOP + ph));

// Each layer: [strip width, widths travelled per loop]. Speeds run from about 11 design units a second on the
// far tableland to 80 on the ground in front.
const LAYERS = { far: [3840, 1], cloud: [7680, 1], butte: [5760, 2], plain: [5760, 3], near: [7680, 3], ground: [9600, 3] };
const offset = (layer, t) => { const [P, laps] = LAYERS[layer]; return frac(laps * t / LOOP) * P; };
// Screen positions of an item at strip position x, once for each repeat that can be in view.
function* spots(x, o, P, Wd, reach) { for (let sx = ((x - o) % P + P) % P - P; sx < Wd + reach; sx += P) if (sx > -reach) yield sx; }
// Smooth noise that repeats across a strip: a few sines, each a whole number of waves across it.
function ripple(seed, P, wavelength) {
  const r = mulberry(seed), terms = [[1, 1], [2.3, 0.5], [4.7, 0.25]].map(([k, a]) => ({ n: Math.max(1, Math.round(P * k / wavelength)), a, ph: r() * TAU }));
  return (x) => terms.reduce((s, q) => s + q.a * Math.sin(TAU * q.n * x / P + q.ph), 0) / 1.75;
}

// a butte: a flat cap on a waist of scree. Added to the current path.
function butte(c, x, base, w, h, skirt) {
  poly(c, [[x - w / 2 - skirt * 1.7, base], [x - w / 2 - skirt, base - h * 0.3], [x - w / 2 - skirt * 0.25, base - h * 0.42], [x - w / 2, base - h], [x + w / 2, base - h], [x + w / 2 + skirt * 0.25, base - h * 0.42], [x + w / 2 + skirt, base - h * 0.3], [x + w / 2 + skirt * 1.7, base]]);
}
// a rock fin with a window worn through it
function arch(c, x, base, w, h, fill) {
  c.beginPath();
  poly(c, [[x - w / 2 - 30, base], [x - w / 2 - 4, base - h * 0.8], [x - w / 2 + 18, base - h], [x + w / 2 - 14, base - h], [x + w / 2 + 2, base - h * 0.78], [x + w / 2 + 26, base]]);
  const hw = w * 0.28, top = base - h * 0.64;
  c.moveTo(x - hw, base); c.lineTo(x - hw, top + hw); c.arc(x, top + hw, hw, Math.PI, 0); c.lineTo(x + hw, base); c.closePath();
  c.fillStyle = fill; c.fill('evenodd');
}
const post = (c, x, y, w, h) => { const r = w / 2; c.moveTo(x, y + r); c.arc(x + r, y + r, r, Math.PI, 0); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); };
function saguaro(c, x, y, s, arms) {
  post(c, x - 15 * s, y - 210 * s, 30 * s, 240 * s);
  for (const [side, at, out, up] of arms) { const ax = x + side * out * s, ay = y - at * s; c.rect(Math.min(x, ax), ay - 11 * s, Math.abs(ax - x), 22 * s); post(c, ax - 11 * s, ay - up * s, 22 * s, up * s + 11 * s); }
}
function pricklyPear(c, x, y, s, seed) {
  const pads = [[0, -28, 30, 24, 0], [-30, -56, 22, 18, -0.5], [26, -60, 24, 19, 0.45], [-6, -88, 18, 15, 0.1], [44, -36, 20, 16, 0.9], [-44, -26, 18, 14, -1]];
  for (const [i, [dx, dy, rx, ry, a]] of pads.entries()) {
    if (i > 3 && hash(seed, i) < 0.4) continue;
    c.moveTo(x + dx * s + rx * s * Math.cos(a), y + dy * s + rx * s * Math.sin(a)); c.ellipse(x + dx * s, y + dy * s, rx * s, ry * s, a, 0, TAU);
  }
}
function yucca(c, x, y, s, bloom) {
  for (let k = 0; k < 15; k++) {
    const a = -Math.PI / 2 + (k - 7) * 0.19, len = (70 + 30 * hash(k, 7)) * s, ca = Math.cos(a), sa = Math.sin(a);
    poly(c, [[x - 5 * s * sa, y + 5 * s * ca], [x + ca * len, y + sa * len], [x + 5 * s * sa, y - 5 * s * ca]]);
  }
  if (bloom) { c.rect(x - 2.5 * s, y - 190 * s, 5 * s, 190 * s); for (let k = 0; k < 9; k++) { const yy = y - (120 + k * 8) * s; circle(c, x + (k % 2 ? 7 : -7) * s, yy, (5 - k * 0.3) * s); } }
}

export function make(W, H) {
  const s = H / 1080, Wd = W / s, HY = 734, r = mulberry(4040);
  const MOON = { x: Wd * 0.6, y: HY - 214, r: 112 };
  const STARS = [];
  for (let i = 0; i < 170 * Wd / 1920; i++) {
    const x = r() * Wd, y = r() * HY * 0.9;
    if (Math.hypot(x - MOON.x, y - MOON.y) > 230) STARS.push({ x, y, s: 0.8 + r() * r() * 2.2, n: [48, 60, 84, 108, 132][Math.floor(r() * 5)], ph: r() });
  }
  const CLOUDS = [];
  for (let x = 120; x < 7680 - 500; x += 700 + r() * 600) {
    const y = HY * (0.22 + r() * 0.5), w = 220 + r() * 300, col = y < HY * 0.4 ? D.r1 : y < HY * 0.6 ? D.r2 : D.r3;
    CLOUDS.push([x, y, w, 20 + r() * 9, col]);
    if (r() < 0.7) CLOUDS.push([x + w * (0.3 + r() * 0.4), y + 30 + r() * 12, w * (0.35 + r() * 0.3), 16 + r() * 6, col]);
  }
  const nFar = ripple(11, 3840, 620);
  const farY = (x) => HY - 38 - 54 * Math.round(2.4 * (0.5 + 0.5 * nFar(x))) / 2;
  const BUTTES = [];
  const ARCHES = [];
  for (let x = 160, i = 0; x < 5760 - 300; i++) {
    // every fifth landform is a stone arch, standing in its own gap
    if (i % 5 === 3) { const w = 130 + r() * 70; ARCHES.push({ x: x + 40, w, h: w * (0.75 + r() * 0.15) }); x += w + 300 + r() * 200; continue; }
    const tall = r() < 0.3, w = tall ? 44 + r() * 30 : 120 + r() * 230, h = tall ? 220 + r() * 90 : 130 + r() * 170;
    BUTTES.push({ x, w, h, sk: tall ? 22 + r() * 10 : 30 + r() * 34 });
    x += w + 180 + r() * 420;
  }
  const nPlain = ripple(21, 5760, 520), nNear = ripple(31, 7680, 560), nGround = ripple(41, 9600, 700);
  const plainY = (x) => HY + (1080 - HY) * 0.26 + 14 * nPlain(x), nearY = (x) => HY + (1080 - HY) * 0.5 + 18 * nNear(x);
  const groundY = (x) => 972 + 22 * nGround(x);
  const MESAS = [[600, 90, 70], [2300, 60, 46], [3900, 120, 82], [5150, 70, 54]];
  const POLES = Array.from({ length: 7680 / 320 }, (_, i) => i * 320 + 40);
  const SAGUAROS = [[200, 0.9], [900, 1.25], [2100, 0.6], [2650, 1.1], [4750, 0.75], [5300, 1.3], [7000, 0.55], [7600, 1.0], [8550, 0.8], [9250, 1.15]].map(([x, sc], i) => {
    const q = mulberry(700 + i), arms = [];
    for (let k = 0, n = 1 + Math.floor(q() * 3); k < n; k++) arms.push([k % 2 ? 1 : -1, 80 + q() * 70, 36 + q() * 16, 40 + q() * 40]);
    return { x, s: sc, arms };
  });
  const ROCKS = Array.from({ length: 16 }, () => ({ x: r() * 9600, w: 16 + r() * 34, h: 8 + r() * 14 }));
  const TUFTS = Array.from({ length: Math.round(9600 / 32) }, () => ({ x: r() * 9600, h: 20 + r() * 46, n: [60, 84, 108][Math.floor(r() * 3)], ph: r(), blades: 3 + Math.floor(r() * 3) }));
  return { W, H, s, Wd, HY, MOON, STARS, CLOUDS, farY, BUTTES, ARCHES, plainY, nearY, groundY, MESAS, POLES, SAGUAROS, ROCKS, TUFTS };
}

function windPump(c, x, y, s, t, seed, tank) {
  const turn = TAU * 66 * t / LOOP + 2 * wave(t, 5, seed) + 1.2 * wave(t, 11, seed * 3), top = -300;
  c.save(); c.translate(x, y); c.scale(s, s);
  c.strokeStyle = D.ink; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath();
  for (const sd of [-1, 1]) { c.moveTo(sd * 62, 0); c.lineTo(sd * 10, top); }
  for (let k = 0; k < 4; k++) { const f0 = k / 4, f1 = (k + 1) / 4, w0 = 62 - 52 * f0, w1 = 62 - 52 * f1; c.moveTo(-w0, top * f0); c.lineTo(w1, top * f1); c.moveTo(w0, top * f0); c.lineTo(-w1, top * f1); c.moveTo(-w1, top * f1); c.lineTo(w1, top * f1); }
  c.stroke();
  // the vane swings a little to follow the wind; the wheel turns faster in the gusts
  c.save(); c.translate(0, top - 8); c.rotate(0.07 * wave(t, 36, 0.2 + seed));
  F(c, (q) => poly(q, [[0, -4], [-96, -8], [-140, -34], [-140, 34], [-96, 8], [0, 4]]), D.ink); c.restore();
  c.save(); c.translate(14, top - 8); c.rotate(turn);
  F(c, (q) => { for (let k = 0; k < 14; k++) { const b = (k * TAU) / 14, c0 = Math.cos(b), s0 = Math.sin(b), c1 = Math.cos(b + 0.3), s1 = Math.sin(b + 0.3); poly(q, [[c0 * 20, s0 * 20], [c0 * 78, s0 * 78], [c1 * 78, s1 * 78], [c1 * 20, s1 * 20]]); } circle(q, 0, 0, 12); }, D.ink);
  c.beginPath(); circle(c, 0, 0, 50); c.lineWidth = 4; c.stroke(); c.restore();
  if (tank) F(c, (q) => { q.rect(84, -52, 120, 52); q.rect(78, -58, 132, 8); }, D.ink);
  c.restore();
}

export function paint(ctx, t, G) {
  t = ((t % LOOP) + LOOP) % LOOP;
  const { s, Wd, HY, MOON } = G, H = 1080;
  ctx.save(); ctx.scale(s, s);

  // ---- the sky stays put: halo, stars, the odd meteor, the moon
  ctx.fillStyle = D.sky; ctx.fillRect(0, 0, Wd, H);
  F(ctx, (c) => circle(c, MOON.x, MOON.y, 760), D.r1); F(ctx, (c) => circle(c, MOON.x, MOON.y, 500), D.r2); F(ctx, (c) => circle(c, MOON.x, MOON.y, 290), D.r3);
  F(ctx, (c) => { for (const q of G.STARS) star4(c, q.x, q.y, (3 + q.s * 2.2) * (0.7 + 0.3 * wave(t, q.n, q.ph))); }, D.cream);
  { const n = Math.floor(t / 15), q = mulberry(n * 7919 + 21);
    if (q() < 0.45) {
      const u = (t - (n * 15 + 1 + q() * 11)) / 0.9, x0 = Wd * (0.1 + 0.8 * q()), y0 = HY * 0.7 * (0.05 + 0.35 * q()), a = 0.35 + 0.5 * q(), dx = Math.cos(a) * (q() < 0.5 ? -1 : 1), dy = Math.sin(a);
      if (u >= 0 && u <= 1) { const head = u * 420, tail = Math.max(0, head - 170 * Math.sin(Math.PI * u)), hx = x0 + dx * head, hy = y0 + dy * head;
        F(ctx, (c) => { c.moveTo(x0 + dx * tail, y0 + dy * tail); c.lineTo(hx - dy * 3, hy + dx * 3); c.lineTo(hx + dy * 3, hy - dx * 3); c.closePath(); }, D.cream); }
    } }
  F(ctx, (c) => circle(c, MOON.x, MOON.y, MOON.r), D.gold);
  F(ctx, (c) => { const { x, y } = MOON; circle(c, x - 34, y - 26, 20); circle(c, x + 30, y + 22, 28); circle(c, x + 40, y - 44, 11); circle(c, x - 28, y + 48, 13); }, D.crater);

  // ---- clouds and the far tableland, slowest of all
  { const o = offset('cloud', t);
    for (const [x, y, w, h, col] of G.CLOUDS) for (const sx of spots(x, o, 7680, Wd, w + 20)) F(ctx, (c) => pill(c, sx, y, w, h), col); }
  { const o = offset('far', t);
    F(ctx, (c) => { c.moveTo(-20, HY + 6); let last = G.farY(o - 20); c.lineTo(-20, last); for (let x = -20; x <= Wd + 20; x += 6) { const y = G.farY(x + o); if (y !== last) { c.lineTo(x - 5, last); c.lineTo(x + 5, y); last = y; } } c.lineTo(Wd + 20, last); c.lineTo(Wd + 20, HY + 6); c.closePath(); }, D.far); }
  { const o = offset('butte', t);
    F(ctx, (c) => { for (const b of G.BUTTES) for (const sx of spots(b.x, o, 5760, Wd, b.w + b.sk * 2 + 20)) butte(c, sx, HY + 6, b.w, b.h, b.sk); }, D.mid);
    for (const a of G.ARCHES) for (const sx of spots(a.x, o, 5760, Wd, a.w + 60)) arch(ctx, sx, HY + 6, a.w, a.h, D.mid); }

  // ---- the plain in three bands, with dust blowing low across it
  ctx.fillStyle = D.f1; ctx.fillRect(-20, HY, Wd + 40, H - HY);
  // headlights far out on the plain, now and then
  { const n = Math.floor(t / 72), q = mulberry(n * 9973 + 4), go = q() < 0.8, dir = q() < 0.5 ? -1 : 1, u = (t - n * 72 - 4 - q() * 12) / 44;
    if (go && u >= 0 && u <= 1) { const x = dir > 0 ? -60 + u * (Wd + 120) : Wd + 60 - u * (Wd + 120), y = HY + (H - HY) * 0.1;
      F(ctx, (c) => poly(c, [[x, y - 3], [x + dir * 90, y - 10], [x + dir * 90, y + 6], [x, y + 3]]), D.gold); F(ctx, (c) => c.rect(x - dir * 26 - 13, y - 9, 26, 13), D.ink); } }
  const dust = (fx, y, w, h, col, n) => { const bw = Math.min(w, Wd * 0.42), span = Wd + bw + 160; F(ctx, (c) => pill(c, frac(fx + n * t / LOOP) * span - bw - 80, HY + (H - HY) * y * 0.6, bw, h), col); };
  dust(0.2, 0.3, 380, 14, D.f1, 4);
  const band = (fn, o, fill) => F(ctx, (c) => { c.moveTo(-20, H + 60); for (let x = -20; x <= Wd + 34; x += 14) c.lineTo(x, fn(x + o)); c.lineTo(Wd + 34, H + 60); c.closePath(); }, fill);
  { const o = offset('plain', t);
    band(G.plainY, o, D.f2);
    F(ctx, (c) => { for (const [x, w, h] of G.MESAS) for (const sx of spots(x, o, 5760, Wd, w + 60)) butte(c, sx, G.plainY(x) + 10, w, h, w * 0.22); }, D.f3); }
  dust(0.7, 0.55, 300, 12, D.f2, 5);
  { const o = offset('near', t);
    band(G.nearY, o, D.f3);
    // a line of telephone poles beside a road nobody uses
    const tops = [];
    F(ctx, (c) => { for (const x of G.POLES) for (const sx of spots(x, o, 7680, Wd, 360)) { const y = G.nearY(x) + 4; c.rect(sx - 2.5, y - 86, 5, 86); c.rect(sx - 17, y - 80, 34, 4); tops.push([sx, y - 78]); } }, D.f3);
    tops.sort((a, b) => a[0] - b[0]);
    ctx.strokeStyle = D.f3; ctx.lineWidth = 1.6; ctx.beginPath();
    for (let i = 1; i < tops.length; i++) { const [x0, y0] = tops[i - 1], [x1, y1] = tops[i]; if (x1 - x0 > 330) continue; for (const k of [-14, 14]) { ctx.moveTo(x0 + k, y0); ctx.quadraticCurveTo((x0 + x1) / 2 + k, (y0 + y1) / 2 + 14, x1 + k, y1); } }
    ctx.stroke(); }
  dust(0.45, 0.8, 420, 14, D.f2, 3);

  // ---- the ground in front: pumps, cacti, a fence, rocks and dry grass on a dark rise
  { const o = offset('ground', t), P = 9600, gY = (sx) => G.groundY(sx + o);
    for (const [x, sc, tank, seed] of [[1300, 1, true, 0.1], [6100, 0.82, false, 0.6]]) for (const sx of spots(x, o, P, Wd, 260)) windPump(ctx, sx, gY(sx) + 10, sc, t, seed, tank);
    F(ctx, (c) => { c.moveTo(-20, H + 60); for (let x = -20; x <= Wd + 32; x += 12) c.lineTo(x, gY(x)); c.lineTo(Wd + 32, H + 60); c.closePath(); }, D.ink);
    F(ctx, (c) => { for (const q of G.SAGUAROS) for (const sx of spots(q.x, o, P, Wd, 140)) saguaro(c, sx, gY(sx) + 14, q.s, q.arms); }, D.ink);
    F(ctx, (c) => { for (const [i, [x, sc]] of [[600, 1], [1900, 0.8], [3600, 1.1], [5600, 0.9], [8100, 1]].entries()) for (const sx of spots(x, o, P, Wd, 90)) pricklyPear(c, sx, gY(sx) + 8, sc, i); }, D.ink);
    F(ctx, (c) => { for (const [i, x] of [350, 3300, 5900, 8300].entries()) for (const sx of spots(x, o, P, Wd, 120)) yucca(c, sx, gY(sx) + 6, 0.9 + 0.2 * (i % 2), i % 2 === 0); }, D.ink);
    // ocotillo: a fan of long whips that lean together in the gusts
    ctx.strokeStyle = D.ink; ctx.lineCap = 'round'; ctx.lineWidth = 4; ctx.beginPath();
    for (const [i, x] of [1650, 4450, 6900, 8900].entries()) for (const sx of spots(x, o, P, Wd, 140)) {
      const y = gY(sx) + 6, lean = 0.05 * wave(t, 48, i * 0.3);
      for (let k = 0; k < 9; k++) { const a = -Math.PI / 2 + (k - 4) * 0.16 + lean, len = 150 + 60 * hash(k, i + 3), ex = sx + Math.cos(a) * len, ey = y + Math.sin(a) * len;
        ctx.moveTo(sx + (k - 4) * 2, y); ctx.quadraticCurveTo(sx + Math.cos(a) * len * 0.5 - lean * 30, y + Math.sin(a) * len * 0.55, ex, ey); }
    }
    ctx.stroke();
    // a stretch of ranch fence, its wire sagging between the posts
    ctx.lineWidth = 2; ctx.beginPath();
    const fence = [];
    for (let x = 3000; x <= 4300; x += 130) for (const sx of spots(x, o, P, Wd, 150)) fence.push([sx, gY(sx) + 4]);
    fence.sort((a, b) => a[0] - b[0]);
    F(ctx, (c) => { for (const [x, y] of fence) { c.rect(x - 4, y - 66, 8, 66); c.rect(x - 6, y - 70, 12, 6); } }, D.ink);
    for (let i = 1; i < fence.length; i++) { const [x0, y0] = fence[i - 1], [x1, y1] = fence[i]; if (x1 - x0 > 140) continue; for (const h of [56, 36]) { ctx.moveTo(x0, y0 - h); ctx.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 - h + 7, x1, y1 - h); } }
    ctx.stroke();
    F(ctx, (c) => { for (const q of G.ROCKS) for (const sx of spots(q.x, o, P, Wd, 60)) { const y = gY(sx) + 6; poly(c, [[sx - q.w / 2, y], [sx - q.w * 0.35, y - q.h * 0.8], [sx - q.w * 0.05, y - q.h], [sx + q.w * 0.4, y - q.h * 0.6], [sx + q.w / 2, y]]); } }, D.ink);
    F(ctx, (c) => { for (const q of G.TUFTS) for (const sx of spots(q.x, o, P, Wd, 80)) { const gy = gY(sx) + 4; for (let k = 0; k < q.blades; k++) { const bx = sx + k * 7, h = q.h * (0.6 + 0.4 * hash(k, q.blades)), sw = h * (0.22 * wave(t, q.n, q.ph + k * 0.05) + (k - q.blades / 2) * 0.16); c.moveTo(bx - 3, gy); c.quadraticCurveTo(bx + sw * 0.2, gy - h * 0.6, bx + sw, gy - h); c.quadraticCurveTo(bx + 3 + sw * 0.2, gy - h * 0.6, bx + 3, gy); c.closePath(); } } }, D.ink);
    // a tumbleweed bowls across the rise now and then
    { const n = Math.floor(t / 24), q = mulberry(n * 3301 + 8), go = q() < 0.75, u = (t - n * 24 - 1 - q() * 6) / 13;
      if (go && u >= 0 && u <= 1) { const tx = -80 + u * (Wd + 160), rr = 24, hop = Math.abs(Math.sin(u * 17 + q() * 6)) * 34, ty = gY(tx) - rr * 0.6 - hop;
        ctx.save(); ctx.translate(tx, ty); ctx.rotate(u * (Wd + 160) / rr); ctx.strokeStyle = D.ink; ctx.lineWidth = 3.5; ctx.beginPath();
        for (let k = 0; k < 5; k++) { const x = 3 * Math.cos(k * 2.1), y = 3 * Math.sin(k * 2.1), rx = rr * (0.55 + 0.45 * hash(k, 3)), ry = rr * (0.95 - 0.1 * k), rot = k * 0.63; ctx.moveTo(x + rx * Math.cos(rot), y + rx * Math.sin(rot)); ctx.ellipse(x, y, rx, ry, rot, 0, TAU); }
        ctx.stroke(); ctx.restore(); } }
  }
  ctx.restore();
}
