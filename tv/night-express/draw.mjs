// Night Express: an original layered background for the Simple Home Android TV launcher.
// An electric night train crosses a stone viaduct below snowy peaks. The train holds its place on screen while the
// country scrolls past from right to left. Each scrolling strip is drawn three times, a strip width apart, so it
// tiles without a seam, transparent edges included.
//
// Writes one full-height RGBA PNG per layer, plus sprites and layout.json, into the directory given:
//   npm install --no-save @napi-rs/canvas
//   node tv/night-express/draw.mjs <out-dir>
// tv/package.py crops, encodes and blurs them; tv/verify.mjs checks the result.
import { createRequire } from 'module';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { mulberry, poly, circle, pill, star4, TAU } from '../../live/geom.js';

const require = createRequire(join(process.cwd(), 'noop.js'));
const { createCanvas } = require('@napi-rs/canvas');
const out = process.argv[2] ?? 'night-express-layers';
mkdirSync(out, { recursive: true });

const W = 1920, H = 1080, LOOP = 360, RAIL = 742;
const K = {
  sky: '#121a2f', ring1: '#151e36', ring2: '#19243f', ring3: '#1e2b49', moon: '#e3d9bd', maria: '#d3c8aa', crater: '#c9bd9c', star: '#d3d5dc', starWarm: '#e2d3b4', starCool: '#b9c6e2', milky: '#1a2440', dust: '#141b31',
  cloud1: '#18213b', cloud2: '#1d2843', cloud3: '#232f4c', rim: '#2e3b5c',
  back: '#3b4968', backShade: '#344160', backSnow: '#7e8aa5', backSnowShade: '#66728f',
  peak: '#33415e', peakShade: '#2b3652', snow: '#6f7c99', snowShade: '#56637f', streak: '#4d5a78', stipple: '#252f49',
  ridge: '#29344f', ridgeShade: '#253049', pine: '#222c46', pineSnow: '#3d4a6a', roofSnow: '#56627f', house: '#1d2640', window: '#d39d55', windowDim: '#8b6c4c', road: '#202a43', mist: '#2c3753', mistSoft: '#273250', valley: '#1c2439', ice: '#26314d',
  stone: '#161d32', stoneLight: '#1c2439', stoneDark: '#131a2d', joint: '#11172a', course: '#1a2136', deck: '#11172a', rail: '#3a4566', mast: '#0f1528', wire: '#2b3553', insulator: '#3c4767', ledgeSnow: '#46526f', icicle: '#3a4565', signalGreen: '#5fa58a',
  train: '#0e1323', trainLight: '#141a2d', roof: '#151b2e', roofKit: '#1b2236', frame: '#0a0e1b', glow: '#d6a65c', glowDeep: '#c08f4f', curtain: '#9a6f45', lampDot: '#f0cf8e', dim: '#6f5d47', cab: '#24324f', stripe: '#38435e', livery: '#6b3644', lamp: '#efd9a2', person: '#2a2018',
  bank: '#212b45', bankLight: '#27324f', drift: '#28334f', brush: '#131a2c', snowCap: '#3b4766', sparkle: '#3a4767',
};

const F = (c, build, fill) => { c.beginPath(); build(c); c.fillStyle = fill; c.fill(); };
const stroke = (c, build, ink, width) => { c.beginPath(); build(c); c.strokeStyle = ink; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(); };
const alpha = (c, a, draw) => { c.save(); c.globalAlpha = a; draw(); c.restore(); };
// smooth noise that repeats across a strip: whole numbers of waves across it
function ripple(seed, P, wavelength) {
  const r = mulberry(seed), terms = [[1, 1], [2.3, 0.5], [4.9, 0.22]].map(([k, a]) => ({ n: Math.max(1, Math.round((P * k) / wavelength)), a, ph: r() * TAU }));
  return (x) => terms.reduce((s, q) => s + q.a * Math.sin((TAU * q.n * x) / P + q.ph), 0) / 1.72;
}
function layer(width) { const canvas = createCanvas(width, H); return { canvas, c: canvas.getContext('2d') }; }
// draw a strip's content three times, a strip width apart, so whatever crosses an edge comes back on the other side
function wrapped(c, width, draw) { for (const dx of [-width, 0, width]) { c.save(); c.translate(dx, 0); draw(); c.restore(); } }
const save = (name, canvas) => writeFileSync(join(out, name + '.png'), canvas.toBuffer('image/png'));
const layout = { name: 'Night Express', design: { width: W, height: H }, loopSeconds: LOOP, layers: [], sprites: [] };
// a pine of stacked tiers, with snow resting on each tier's upper edge
function pine(c, x, y, h, w, ink, snow) {
  F(c, (q) => { for (let k = 0; k < 4; k++) { const f = k / 4, tw = w * (1 - f * 0.55), ty = y - h * f * 0.78; poly(q, [[x - tw / 2, ty], [x + tw / 2, ty], [x, ty - h * 0.42]]); } q.rect(x - 1.5, y - 2, 3, 7); }, ink);
  if (snow) F(c, (q) => { for (let k = 0; k < 4; k++) { const f = k / 4, tw = w * (1 - f * 0.55), ty = y - h * f * 0.78, top = ty - h * 0.42; poly(q, [[x - tw * 0.22, top + h * 0.18], [x, top], [x + tw * 0.12, top + h * 0.12], [x - tw * 0.05, top + h * 0.2]]); } }, snow);
}

// ---- sky: stationary and opaque. A pale moon in the upper left, the Milky Way, stars that thin out under the clock.
{
  const { canvas, c } = layer(W), r = mulberry(7), M = { x: 430, y: 250 };
  c.fillStyle = K.sky; c.fillRect(0, 0, W, H);
  F(c, (q) => circle(q, M.x, M.y, 640), K.ring1); F(c, (q) => circle(q, M.x, M.y, 420), K.ring2); F(c, (q) => circle(q, M.x, M.y, 230), K.ring3);
  // the Milky Way: a soft band from the lower left towards the top centre, a dust lane, and a dense haze of faint stars
  const band = (u) => [60 + u * 1150, 600 - u * 560];
  for (const [wid, a] of [[150, 0.28], [95, 0.32], [50, 0.35]]) alpha(c, a, () => stroke(c, (q) => { q.moveTo(...band(0)); for (let u = 0.05; u <= 1; u += 0.05) q.lineTo(band(u)[0] + 30 * Math.sin(u * 7), band(u)[1]); }, K.milky, wid));
  alpha(c, 0.5, () => stroke(c, (q) => { q.moveTo(...band(0.12)); for (let u = 0.14; u <= 0.86; u += 0.04) q.lineTo(band(u)[0] + 30 * Math.sin(u * 7) + 14 * Math.sin(u * 23), band(u)[1] + 8); }, K.dust, 14));
  for (let i = 0; i < 1300; i++) {
    const u = r(), g = (r() + r() + r() - 1.5) * 70, [bx, by] = band(u), x = bx + 30 * Math.sin(u * 7) + g * 0.6, y = by + g * 0.8;
    if (Math.hypot(x - M.x, y - M.y) < 110 || x > 1330) continue;
    alpha(c, 0.25 + 0.35 * r(), () => F(c, (q) => circle(q, x, y, 0.5 + 0.6 * r()), K.star));
  }
  for (let i = 0; i < 230; i++) {
    const x = r() * W, y = r() * 650, s = r(), tint = r();
    if (Math.hypot(x - M.x, y - M.y) < 120) continue;
    if (x > 1330 && y < 200 && r() < 0.8) continue;                       // keep the clock's corner quiet
    alpha(c, 0.45 + 0.5 * r() * (1 - y / 900), () => F(c, (q) => (s > 0.88 ? star4(q, x, y, 4 + 3 * r()) : circle(q, x, y, 0.8 + 1.1 * s)), tint < 0.15 ? K.starWarm : tint < 0.3 ? K.starCool : K.star));
  }
  // a faint glow low over the mountains
  alpha(c, 0.35, () => F(c, (q) => pill(q, -200, 520, W + 400, 220), K.ring2));
  F(c, (q) => circle(q, M.x, M.y, 62), K.moon);
  F(c, (q) => { circle(q, M.x - 20, M.y - 14, 13); circle(q, M.x + 18, M.y + 12, 18); circle(q, M.x + 26, M.y - 26, 7); circle(q, M.x - 16, M.y + 30, 8); }, K.maria);
  F(c, (q) => { for (const [dx, dy, rr] of [[-34, 8, 4], [6, -36, 3.5], [36, 6, 3], [-6, 18, 2.5], [-38, -22, 2.5], [14, 40, 3], [40, 30, 2]]) circle(q, M.x + dx, M.y + dy, rr); }, K.crater);
  save('sky', canvas);
  layout.layers.push({ id: 'sky', repeatWidth: W, repeats: 0 });
}

// ---- clouds: low banks, rimmed by moonlight on top, the slowest strip
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(17), banks = [];
  for (let x = 80; x < P - 300; x += 560 + r() * 560) banks.push({ x, y: 240 + r() * 230, w: 220 + r() * 300, seed: Math.floor(r() * 1e6) });
  wrapped(c, P, () => {
    for (const b of banks) {
      const q0 = mulberry(b.seed), col = b.y < 310 ? K.cloud1 : b.y < 400 ? K.cloud2 : K.cloud3, rows = [];
      for (let k = 0; k < 3; k++) rows.push([b.x + q0() * b.w * 0.3 + k * 16, b.y + k * 13, b.w * (1 - k * 0.25) * (0.7 + 0.3 * q0()), 15 - k * 2]);
      F(c, (q) => { for (const [x, y, w] of rows.slice(0, 1)) pill(q, x + 6, y - 3, w - 12, 6); }, K.rim);
      F(c, (q) => { for (const [x, y, w, h] of rows) pill(q, x, y, w, h); }, col);
      F(c, (q) => { for (let k = 0; k < 2; k++) pill(q, b.x + b.w * (0.6 + q0() * 0.5), b.y + 46 + k * 12, 60 + q0() * 90, 5); }, col);
    }
  });
  save('clouds', canvas);
  layout.layers.push({ id: 'clouds', repeatWidth: P, repeats: 1 });
}

// ---- snowy peaks: a hazy far range behind a nearer one, lit from the moon on the left, with gullies, snow streaks
// and a stippled shade
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(29), BASE = 690;
  const range = (seed, x0, step, hMin, hMax, wMin, wMax) => { const q = mulberry(seed), list = []; for (let x = x0; x < P - 100; x += step[0] + q() * step[1]) list.push({ x, h: hMin + q() * (hMax - hMin), wl: wMin + q() * (wMax - wMin), wr: wMin + q() * (wMax - wMin) * 1.1, seed: Math.floor(q() * 1e6) }); return list.sort((a, b) => b.h - a.h); };
  const backRange = range(23, 60, [300, 260], 230, 360, 260, 420), front = range(29, 120, [210, 280], 150, 300, 200, 360);
  const shape = (p) => {
    const q = mulberry(p.seed), top = BASE - p.h, L = [], R = [];
    for (let k = 1; k < 7; k++) { const f = k / 7; L.push([p.x - p.wl * f + (q() - 0.5) * 16, top + p.h * f + (q() - 0.5) * 14]); R.push([p.x + p.wr * f + (q() - 0.5) * 16, top + p.h * f + (q() - 0.5) * 14]); }
    const ridge = [[p.x, top], [p.x + 10 + q() * 20, top + p.h * 0.3], [p.x + 4 + q() * 30, top + p.h * 0.62], [p.x + 20 + q() * 40, BASE + 60]];
    return { top, L, R, ridge, snowline: top + p.h * (0.3 + q() * 0.12), q };
  };
  const paintPeak = (p, ink) => {
    const s = shape(p), outline = [[p.x - p.wl, BASE + 60], ...s.L.slice().reverse(), [p.x, s.top], ...s.R, [p.x + p.wr, BASE + 60]];
    const shade = [[p.x, s.top], ...s.R, [p.x + p.wr, BASE + 60], ...s.ridge.slice(1).reverse()];
    F(c, (q) => poly(q, outline), ink.body); F(c, (q) => poly(q, shade), ink.shade);
    c.save(); c.beginPath(); poly(c, outline); c.clip();
    const zig = []; for (let x = p.x - p.wl; x <= p.x + p.wr; x += 14) zig.push([x, s.snowline + Math.sin(x * 0.21 + p.seed) * 9 + (s.q() - 0.5) * 12 + Math.abs(x - p.x) * 0.2]);
    const cap = (q) => { q.moveTo(p.x - p.wl, s.top - 10); for (const z of zig) q.lineTo(z[0], z[1]); q.lineTo(p.x + p.wr, s.top - 10); q.closePath(); };
    F(c, cap, ink.snow);
    if (ink.detail) {
      // snow streaks run down the gullies below the snowline; dark rock ribs between them
      F(c, (q) => { for (let k = 0; k < 9; k++) { const x = p.x + (s.q() - 0.5) * (p.wl + p.wr) * 0.8, y = s.snowline + Math.abs(x - p.x) * 0.2 - 4, len = 30 + s.q() * p.h * 0.35, w = 3 + s.q() * 4; poly(q, [[x - w, y], [x + w, y], [x + w * 0.2 + len * 0.15, y + len], [x - w * 0.4 + len * 0.15, y + len * 0.9]]); } }, ink.streak);
    }
    c.beginPath(); poly(c, shade); c.clip();
    F(c, cap, ink.snowShade);
    F(c, (q) => { for (let k = 0; k < p.h * (ink.detail ? 2 : 0.8); k++) { const u = s.q(), x = p.x + s.q() * p.wr, y = s.snowline + (BASE - s.snowline) * Math.sqrt(u); circle(q, x, y, 0.9 + s.q() * 0.9); } }, ink.stipple);
    c.restore();
  };
  wrapped(c, P, () => {
    for (const p of backRange) paintPeak(p, { body: K.back, shade: K.backShade, snow: K.backSnow, snowShade: K.backSnowShade, stipple: K.backShade });
    alpha(c, 0.5, () => F(c, (q) => q.rect(-20, 600, P + 40, 200), K.ring2));     // haze between the ranges
    for (const p of front) paintPeak(p, { body: K.peak, shade: K.peakShade, snow: K.snow, snowShade: K.snowShade, stipple: K.stipple, streak: K.streak, detail: true });
  });
  c.globalCompositeOperation = 'destination-out'; c.fillRect(0, 760, P, H); c.globalCompositeOperation = 'source-over';
  save('peaks', canvas);
  layout.layers.push({ id: 'peaks', repeatWidth: P, repeats: 2 });
}

// ---- forested ridge: snow-tipped pines, a lit village and church, a road with one car, and the misty valley that
// shows through the arches
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(41), n = ripple(43, P, 900), top = (x) => 592 + 26 * n(x);
  const pines = [];
  for (let x = 0; x < P; x += 9 + r() * 20) { const clearing = Math.sin((x / P) * TAU * 7 + 1.3) > 0.72; if (!clearing || r() < 0.12) pines.push([x, 26 + r() * 58, r()]); }
  const villages = [[560, 5], [1760, 3], [2980, 6]], lamps = [];
  wrapped(c, P, () => {
    F(c, (q) => { q.moveTo(-20, H); for (let x = -20; x <= P + 20; x += 10) q.lineTo(x, top(x)); q.lineTo(P + 20, H); q.closePath(); }, K.ridge);
    // a road that climbs along the ridge, with one car's lights on it
    stroke(c, (q) => { q.moveTo(-20, top(-20) + 30); for (let x = -20; x <= P + 20; x += 20) q.lineTo(x, top(x) + 30 + 8 * Math.sin(x / 140)); }, K.road, 5);
    F(c, (q) => { const x = 2400, y = top(x) + 27 + 8 * Math.sin(x / 140); q.rect(x, y - 3, 18, 6); }, K.house);
    alpha(c, 0.5, () => F(c, (q) => { const x = 2418, y = top(x) + 27 + 8 * Math.sin(x / 140); poly(q, [[x, y - 1], [x + 70, y - 8], [x + 70, y + 7], [x, y + 2]]); }, K.window));
    F(c, (q) => { const x = 2418, y = top(x) + 27 + 8 * Math.sin(x / 140); circle(q, x, y, 2); }, K.lampDot ?? K.window);
    for (const [x, k, s] of pines) pine(c, x, top(x) + 6, k, k * (0.42 + 0.14 * s), K.pine, s < 0.7 ? K.pineSnow : null);
    // villages: snow-roofed houses with warm windows, a church, a few street lamps
    for (const [vx, count] of villages) {
      const q0 = mulberry(vx);
      for (let k = 0; k < count; k++) {
        const x = vx + k * 46 + q0() * 14, y = top(x) + 14, w = 30 + q0() * 18, h = 18 + q0() * 10;
        F(c, (q) => { q.rect(x - w / 2, y - h, w, h); q.rect(x + w * 0.2, y - h - 16, 6, 12); }, K.house);
        F(c, (q) => poly(q, [[x - w / 2 - 5, y - h], [x + w / 2 + 5, y - h], [x, y - h - 16]]), K.roofSnow);
        F(c, (q) => { q.rect(x - w * 0.32, y - h * 0.62, 6, 6); if (q0() < 0.7) q.rect(x + w * 0.1, y - h * 0.62, 6, 6); }, q0() < 0.75 ? K.window : K.windowDim);
        if (k === Math.floor(count / 2)) lamps.push([x + w * 0.8, y]);
      }
      if (count >= 5) { const x = vx + count * 46 + 20, y = top(x) + 14;
        F(c, (q) => { q.rect(x - 22, y - 34, 44, 34); q.rect(x - 9, y - 70, 18, 40); poly(q, [[x - 11, y - 70], [x + 11, y - 70], [x, y - 104]]); }, K.house);
        F(c, (q) => { poly(q, [[x - 26, y - 34], [x + 26, y - 34], [x, y - 50]]); poly(q, [[x - 11, y - 70], [x, y - 104], [x + 3, y - 92]]); }, K.roofSnow);
        F(c, (q) => { q.rect(x - 4, y - 60, 8, 12); q.rect(x - 14, y - 24, 6, 12); q.rect(x + 8, y - 24, 6, 12); }, K.window); }
    }
    for (const [x, y] of lamps) { alpha(c, 0.2, () => F(c, (q) => circle(q, x, y - 20, 10), K.window)); F(c, (q) => { q.rect(x - 1, y - 20, 2, 20); circle(q, x, y - 21, 2.2); }, K.house); F(c, (q) => circle(q, x, y - 21, 1.6), K.window); }
    // the valley floor: a frozen lake under two soft bands of mist
    F(c, (q) => q.rect(-20, 760, P + 40, H - 760), K.valley);
    F(c, (q) => q.rect(-20, 868, P + 40, H - 868), K.ice);
    stroke(c, (q) => { for (let x = 30; x < P; x += 210) { q.moveTo(x, 884 + (x % 50)); q.lineTo(x + 60 + (x % 70), 884 + (x % 50)); } }, K.mistSoft, 2);
    alpha(c, 0.7, () => F(c, (q) => pill(q, -40, 806, P + 80, 40), K.mistSoft));
    F(c, (q) => pill(q, -40, 816, P + 80, 22), K.mist);
    F(c, (q) => { for (let x = 60; x < P; x += 700) pill(q, x + 120 * Math.sin(x), 858, 380, 14); }, K.mist);
  });
  save('ridge', canvas);
  layout.layers.push({ id: 'ridge', repeatWidth: P, repeats: 5 });
}

// ---- the viaduct: lattice masts and overhead line behind the train, the deck with its snowy cornice and corbels,
// coursed stone, and arches hung with icicles
{
  const P = 1920, { canvas, c } = layer(P), MASTS = 480, ARCH = 240, deck = RAIL + 2, cornice = 772, spring = 892, rad = 92, r = mulberry(71);
  const blocks = []; for (let row = 0, y = cornice + 12; y < H; row++, y += 24) for (let x = (row % 2) * 34; x < P; x += 52 + r() * 30) blocks.push([x, y, r()]);
  wrapped(c, P, () => {
    // lattice masts with cantilever arms, insulators and registration arms; a messenger wire sags between them
    for (let x = 100; x < P; x += MASTS) {
      F(c, (q) => { q.rect(x - 6, 552, 2.5, RAIL - 552); q.rect(x + 3.5, 552, 2.5, RAIL - 552); q.rect(x - 8, 546, 16, 6); q.rect(x - 9, RAIL - 12, 18, 12); }, K.mast);
      stroke(c, (q) => { for (let y = 560; y < RAIL - 14; y += 16) { q.moveTo(x - 5, y); q.lineTo(x + 5, y + 16); q.moveTo(x + 5, y); q.lineTo(x - 5, y + 16); } }, K.mast, 1.2);
      stroke(c, (q) => { q.moveTo(x, 572); q.lineTo(x + 92, 572); q.moveTo(x, 598); q.lineTo(x + 92, 572); q.moveTo(x + 88, 572); q.lineTo(x + 88, 604); q.moveTo(x + 60, 598); q.lineTo(x + 92, 604); }, K.mast, 3);
      F(c, (q) => { for (const [ix, iy] of [[x + 10, 572], [x + 10, 598], [x + 70, 600]]) for (let k = 0; k < 3; k++) circle(q, ix + k * 4, iy, 2.4); }, K.insulator);
      // a kilometre plate and, on every second mast, a dim green signal lamp
      F(c, (q) => q.rect(x - 7, 660, 14, 10), K.stripe ?? K.insulator);
      if ((x - 100) % (MASTS * 2) === 0) { F(c, (q) => { q.rect(x + 14, 680, 14, 26); q.rect(x + 18, 706, 6, 36); }, K.mast); F(c, (q) => circle(q, x + 21, 688, 3.4), K.signalGreen); }
    }
    stroke(c, (q) => { for (let x = 100; x < P + MASTS; x += MASTS) { q.moveTo(x + 88, 574); q.quadraticCurveTo(x + 88 + MASTS / 2, 600, x + 88 + MASTS, 574); } }, K.wire, 1.6);
    stroke(c, (q) => { q.moveTo(-10, 604); q.lineTo(P + 10, 604); }, K.wire, 1.6);
    stroke(c, (q) => { for (let x = 100; x < P + MASTS; x += MASTS) for (let k = 1; k < 8; k++) { const u = k / 8, xx = x + 88 + u * MASTS, yy = 574 + 26 * 4 * u * (1 - u) * 0.5; q.moveTo(xx, yy); q.lineTo(xx, 604); } }, K.wire, 1);
    // deck, rail and the stone body of the viaduct
    F(c, (q) => q.rect(-10, deck, P + 20, H - deck), K.stone);
    F(c, (q) => { for (const [x, y, v] of blocks) if (v < 0.22) q.rect(x + 1, y + 1, 40 + v * 60, 22); }, K.stoneLight);
    F(c, (q) => { for (const [x, y, v] of blocks) if (v > 0.84) q.rect(x + 1, y + 1, 36 + v * 20, 22); }, K.stoneDark);
    stroke(c, (q) => { for (let y = cornice + 12; y < H; y += 24) { q.moveTo(-10, y); q.lineTo(P + 10, y); } for (const [x, y] of blocks) { q.moveTo(x, y); q.lineTo(x, y + 24); } }, K.joint, 1.2);
    F(c, (q) => q.rect(-10, deck, P + 20, 6), K.stoneLight);
    F(c, (q) => { q.rect(-10, cornice - 4, P + 20, 10); for (let x = 0; x < P; x += 20) q.rect(x + 4, cornice + 6, 10, 7); }, K.stoneLight);
    // snow on the cornice ledge, and a fringe of icicles under it
    F(c, (q) => { q.rect(-10, cornice - 7, P + 20, 4); for (let x = 0; x < P; x += 34) pill(q, x + (x % 13), cornice - 9, 18 + (x % 11), 5); }, K.ledgeSnow);
    F(c, (q) => { for (let x = 3; x < P; x += 11 + ((x * 7) % 9)) { const len = 4 + ((x * 13) % 11); poly(q, [[x, cornice + 6], [x + 3, cornice + 6], [x + 1.5, cornice + 6 + len]]); } }, K.icicle);
    F(c, (q) => q.rect(-10, RAIL - 4, P + 20, 6), K.deck);
    F(c, (q) => q.rect(-10, RAIL - 4, P + 20, 2), K.rail);
    F(c, (q) => { for (let x = 0; x < P; x += 24) q.rect(x, deck + 7, 12, 3); }, K.deck);
    // arch rings of voussoirs with a keystone, impost bands on the piers
    for (let x = 0; x < P; x += ARCH) {
      const cx = x + ARCH / 2;
      F(c, (q) => { q.moveTo(cx - rad - 14, H); q.lineTo(cx - rad - 14, spring); q.arc(cx, spring, rad + 14, Math.PI, 0); q.lineTo(cx + rad + 14, H); q.closePath(); }, K.stoneLight);
      stroke(c, (q) => { for (let k = 1; k < 14; k++) { const a = Math.PI + (k * Math.PI) / 14; q.moveTo(cx + Math.cos(a) * rad, spring + Math.sin(a) * rad); q.lineTo(cx + Math.cos(a) * (rad + 14), spring + Math.sin(a) * (rad + 14)); } }, K.joint, 1.6);
      F(c, (q) => poly(q, [[cx - 8, spring - rad - 18], [cx + 8, spring - rad - 18], [cx + 6, spring - rad + 2], [cx - 6, spring - rad + 2]]), K.stoneLight);
      F(c, (q) => { q.rect(x - 4, spring - 4, 34, 8); q.rect(x + ARCH - 30, spring - 4, 34, 8); }, K.stoneLight);
    }
  });
  // cut the arch openings so the misty valley shows through, then hang icicles from each crown
  c.globalCompositeOperation = 'destination-out';
  for (let x = -ARCH; x < P + ARCH; x += ARCH) { const cx = x + ARCH / 2; F(c, (q) => { q.moveTo(cx - rad, H + 10); q.lineTo(cx - rad, spring); q.arc(cx, spring, rad, Math.PI, 0); q.lineTo(cx + rad, H + 10); q.closePath(); }, '#000'); }
  c.globalCompositeOperation = 'source-over';
  wrapped(c, P, () => F(c, (q) => { for (let x = 0; x < P; x += ARCH) { const cx = x + ARCH / 2; for (let k = -5; k <= 5; k++) { const a = -Math.PI / 2 + k * 0.13, ex = cx + Math.cos(a) * rad, ey = spring + Math.sin(a) * rad, len = 6 + ((k * k * 7 + x) % 13); poly(q, [[ex - 1.6, ey - 1], [ex + 1.6, ey - 1], [ex, ey + len]]); } } }, K.icicle));
  save('viaduct', canvas);
  layout.layers.push({ id: 'viaduct', repeatWidth: P, repeats: 30 });
}

// ---- the train: stationary. The locomotive's nose sits right of centre; its cars run on past the left edge.
const WHEEL_R = 11, wheels = [];
{
  const { canvas, c } = layer(W), r = mulberry(53), top = 640, body = 716, CAR = 318;
  const bogie = (x, n) => {
    const w = 52 + (n - 2) * 26;
    F(c, (q) => { q.rect(x - w / 2, body - 2, w, 14); q.rect(x - w / 2 - 4, body + 4, 6, 6); q.rect(x + w / 2 - 2, body + 4, 6, 6); }, K.frame);
    stroke(c, (q) => { for (let k = 0; k < n - 1; k++) { const sx = x + (k - (n - 2) / 2) * 26; for (let j = 0; j < 4; j++) { q.moveTo(sx - 5, body + 1 + j * 3); q.lineTo(sx + 5, body + 2.5 + j * 3); } } }, K.stripe, 1);
    for (let k = 0; k < n; k++) wheels.push([x + (k - (n - 1) / 2) * 26, RAIL - WHEEL_R]);
  };
  // warm light from the windows falls on the viaduct's face below; it travels with the train, so it is part of it
  { const g = c.createLinearGradient(0, 750, 0, 806); g.addColorStop(0, 'rgba(214,166,92,0.10)'); g.addColorStop(1, 'rgba(214,166,92,0)');
    F(c, (q) => { for (let x0 = 1278 - CAR * 4; x0 < 1278; x0 += CAR) q.rect(x0 + 20, 750, CAR - 40, 56); }, g); }
  // coaches, back to front
  for (let x0 = 1278 - CAR * 4; x0 < 1278; x0 += CAR) {
    const x = x0 + 6, w = CAR - 12;
    F(c, (q) => q.roundRect(x, top, w, body - top, 8), K.train);
    F(c, (q) => q.roundRect(x + 4, top - 7, w - 8, 12, 6), K.roof);
    F(c, (q) => { for (let k = 0; k < 5; k++) q.roundRect(x + 30 + k * 56, top - 11, 22, 6, 2); }, K.roofKit);
    F(c, (q) => q.rect(x, 690, w, 3), K.stripe);
    F(c, (q) => q.rect(x, 696, w, 2), K.livery);
    for (let k = 0; k < 8; k++) {
      const wx = x + 26 + k * 32, v = r(), lit = v < 0.7, kind = r();
      F(c, (q) => q.roundRect(wx - 2, 653, 26, 26, 4), K.trainLight);
      F(c, (q) => q.roundRect(wx, 655, 22, 22, 3), lit ? K.glow : v < 0.86 ? K.dim : K.cab);
      if (!lit) continue;
      if (kind < 0.35) F(c, (q) => { circle(q, wx + 11, 668, 4.2); q.roundRect(wx + 4.5, 672, 13, 6, 3); }, K.person);           // a passenger
      else if (kind < 0.55) F(c, (q) => { q.rect(wx, 655, 7, 22); q.rect(wx + 15, 655, 7, 22); }, K.curtain);                    // curtains
      else if (kind < 0.7) F(c, (q) => circle(q, wx + 11, 659, 2.4), K.lampDot);                                                // a reading lamp
      else F(c, (q) => q.rect(wx, 671, 22, 6), K.glowDeep);
    }
    // doors with their own small windows and handrails, then the gangway bellows
    for (const dx of [6, w - 15]) { F(c, (q) => q.rect(x + dx, 650, 9, 56), K.frame); F(c, (q) => q.rect(x + dx + 2, 656, 5, 12), K.cab); stroke(c, (q) => { q.moveTo(x + dx - 2, 676); q.lineTo(x + dx - 2, 700); }, K.stripe, 1.2); }
    F(c, (q) => q.rect(x + w, 650, 12, 58), K.frame);
    stroke(c, (q) => { for (let k = 1; k < 4; k++) { q.moveTo(x + w + k * 3, 652); q.lineTo(x + w + k * 3, 706); } }, K.trainLight, 1);
    F(c, (q) => { q.rect(x + 78, body + 2, 150, 9); q.rect(x + 96, body + 11, 40, 6); q.rect(x + 170, body + 11, 30, 5); }, K.frame);
    bogie(x + 46, 2); bogie(x + w - 46, 2);
  }
  // the locomotive: a long nose, a raked windscreen with its driver, side grilles, roof insulators, two pantographs
  { const x = 1290, end = 1560;
    F(c, (q) => { q.moveTo(x, body); q.lineTo(x, top - 10); q.quadraticCurveTo(x, top - 14, x + 8, top - 14); q.lineTo(end - 40, top - 14); q.quadraticCurveTo(end + 10, top - 12, end + 40, 690); q.lineTo(end + 46, body); q.closePath(); }, K.train);
    F(c, (q) => { q.moveTo(end - 34, 648); q.lineTo(end - 2, 648); q.lineTo(end + 22, 676); q.lineTo(end - 34, 676); q.closePath(); }, K.cab);
    F(c, (q) => { circle(q, end - 14, 664, 5); q.roundRect(end - 21, 669, 15, 8, 3); }, K.frame);                                  // the driver
    stroke(c, (q) => { q.moveTo(end + 4, 674); q.lineTo(end + 14, 656); }, K.stripe, 1.4);                                       // wiper
    F(c, (q) => q.rect(x, 690, end + 33 - x, 3), K.stripe);
    F(c, (q) => q.rect(x, 696, end + 36 - x, 2), K.livery);
    stroke(c, (q) => { for (const gx of [x + 40, x + 150]) for (let k = 0; k < 9; k++) { q.moveTo(gx + k * 9, 652); q.lineTo(gx + k * 9, 680); } }, K.frame, 2.4);
    F(c, (q) => { q.rect(x + 262, 650, 20, 40); }, K.frame);
    F(c, (q) => q.roundRect(x + 265, 654, 14, 14, 2), K.dim);
    F(c, (q) => q.rect(x + 112, 700, 24, 9), K.stripe);
    F(c, (q) => { q.rect(x + 20, top - 18, 60, 6); q.rect(x + 190, top - 18, 50, 6); q.rect(x + 110, top - 22, 50, 10); }, K.roof);
    F(c, (q) => { for (const ix of [x + 100, x + 170]) for (let k = 0; k < 3; k++) circle(q, ix, top - 22 - k * 3, 3); }, K.insulator);
    stroke(c, (q) => { const px = x + 60, roof = top - 18; q.moveTo(px - 20, roof); q.lineTo(px + 8, roof - 18); q.lineTo(px - 14, 606); q.moveTo(px - 30, 605); q.lineTo(px + 4, 605); }, K.frame, 2.6);
    stroke(c, (q) => { const px = x + 210, roof = top - 18; q.moveTo(px - 18, roof); q.lineTo(px + 6, roof - 6); q.lineTo(px + 26, roof - 2); }, K.frame, 2.4);    // the rear pantograph, lowered
    F(c, (q) => q.rect(x - 12, 650, 12, 58), K.frame);
    F(c, (q) => { q.rect(x + 90, body + 2, 100, 10); q.rect(x + 104, body + 12, 36, 6); q.moveTo(end + 30, body); q.lineTo(end + 50, body + 16); q.lineTo(end + 20, body + 16); q.closePath(); }, K.frame);
    bogie(x + 56, 3); bogie(end - 34, 3);
    // the headlamps and a soft beam along the line ahead
    alpha(c, 0.1, () => F(c, (q) => poly(q, [[end + 40, 698], [W + 20, 666], [W + 20, 760], [end + 40, 708]]), K.lamp));
    alpha(c, 0.08, () => F(c, (q) => poly(q, [[end + 40, 700], [W + 20, 688], [W + 20, 738], [end + 40, 706]]), K.lamp));
    F(c, (q) => { q.ellipse(end + 39, 703, 4, 5, 0, 0, TAU); circle(q, end + 30, 708, 2.6); }, K.lamp);
    F(c, (q) => circle(q, end + 6, 643, 2.2), K.lampDot);
  }
  save('train', canvas);
  layout.layers.push({ id: 'train', repeatWidth: W, repeats: 0 });
}

// ---- the near snowbank: low, quiet and fastest, so the bottom fifth stays calm for the app row
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(61), n = ripple(67, P, 1100), edge = (x) => 866 + 10 * n(x);
  const shrubs = [], posts = [], tufts = [], saplings = [], rocks = [];
  for (let x = 140; x < P - 140; x += 240 + r() * 420) shrubs.push([x, 22 + r() * 30, Math.floor(r() * 1e6)]);
  for (let x = 2200; x < 2900; x += 116) posts.push(x);
  for (let k = 0; k < 46; k++) tufts.push([r() * P, 12 + r() * 22, r()]);
  for (const x of [420, 1350, 3350]) saplings.push([x + r() * 80, 40 + r() * 30]);
  for (let k = 0; k < 9; k++) rocks.push([r() * P, 14 + r() * 16]);
  wrapped(c, P, () => {
    F(c, (q) => { q.moveTo(-20, H + 10); for (let x = -20; x <= P + 20; x += 12) q.lineTo(x, edge(x)); q.lineTo(P + 20, H + 10); q.closePath(); }, K.bank);
    F(c, (q) => { q.moveTo(-20, edge(-20) + 6); for (let x = -20; x <= P + 20; x += 12) q.lineTo(x, edge(x) + 6 + 3 * Math.sin(x / 50)); for (let x = P + 20; x >= -20; x -= 12) q.lineTo(x, edge(x) + 22 + 6 * Math.sin(x / 90)); q.closePath(); }, K.bankLight);
    F(c, (q) => { for (let k = 0; k < 9; k++) pill(q, (k * 431) % P, 930 + ((k * 53) % 110), 260 + (k % 3) * 90, 5); }, K.drift);
    F(c, (q) => { for (const [x, s] of rocks) { const y = edge(x) + 4; poly(q, [[x - s, y], [x - s * 0.6, y - s * 0.7], [x + s * 0.2, y - s * 0.8], [x + s, y]]); } }, K.brush);
    F(c, (q) => { for (const [x, s] of rocks) { const y = edge(x) + 4; pill(q, x - s * 0.6, y - s * 0.86, s * 1.1, 5); } }, K.snowCap);
    for (const [x, h] of saplings) pine(c, x, edge(x) + 4, h, h * 0.5, K.brush, K.snowCap);
    F(c, (q) => { for (const [x, s, seed] of shrubs) { const t = mulberry(seed); for (let k = 0; k < 5; k++) circle(q, x + (k - 2) * s * 0.42 + (t() - 0.5) * 8, edge(x) - s * (0.25 + 0.35 * t()), s * (0.32 + 0.18 * t())); } }, K.brush);
    F(c, (q) => { for (const [x, s, seed] of shrubs) { const t = mulberry(seed); for (let k = 0; k < 5; k++) { const cx = x + (k - 2) * s * 0.42 + (t() - 0.5) * 8, cy = edge(x) - s * (0.25 + 0.35 * t()), rr = s * (0.32 + 0.18 * t()); q.ellipse(cx - rr * 0.1, cy - rr * 0.75, rr * 0.7, rr * 0.28, 0, 0, TAU); } } }, K.snowCap);
    F(c, (q) => { for (const x of posts) q.rect(x - 3, edge(x) - 50, 6, 52); }, K.brush);
    F(c, (q) => { for (const x of posts) pill(q, x - 5, edge(x) - 54, 10, 6); }, K.snowCap);
    stroke(c, (q) => { for (let i = 1; i < posts.length; i++) for (const h of [42, 24]) { const a = posts[i - 1], b = posts[i]; q.moveTo(a, edge(a) - h); q.quadraticCurveTo((a + b) / 2, (edge(a) + edge(b)) / 2 - h + 6, b, edge(b) - h); } }, K.brush, 1.4);
    F(c, (q) => { for (const [x, h, k] of tufts) for (let b = 0; b < 4; b++) { const bx = x + b * 5, lean = (b - 1.5) * 4 + (k - 0.5) * 6; q.moveTo(bx - 2, edge(x) + 2); q.quadraticCurveTo(bx + lean * 0.3, edge(x) - h * 0.6, bx + lean, edge(x) - h); q.lineTo(bx + 2, edge(x) + 2); q.closePath(); } }, K.brush);
    F(c, (q) => { for (let k = 0; k < 260; k++) { const x = (k * 977.31) % P, y = edge(x) + 8 + ((k * 37) % 70); circle(q, x, y, 0.9); } }, K.sparkle);
  });
  save('snowbank', canvas);
  layout.layers.push({ id: 'snowbank', repeatWidth: P, repeats: 20 });
}

// ---- wheel sprite, drawn at twice its design size for a sharp picture on a 4K panel
{
  const S = 2, size = (WHEEL_R + 2) * 2, canvas = createCanvas(size * S, size * S), c = canvas.getContext('2d');
  c.scale(S, S); c.translate(size / 2, size / 2);
  F(c, (q) => circle(q, 0, 0, WHEEL_R), K.frame);
  stroke(c, (q) => circle(q, 0, 0, WHEEL_R - 2), K.stripe, 1.4);
  stroke(c, (q) => { for (let k = 0; k < 3; k++) { const a = (k * TAU) / 3; q.moveTo(0, 0); q.lineTo(Math.cos(a) * (WHEEL_R - 3), Math.sin(a) * (WHEEL_R - 3)); } }, K.stripe, 1.6);
  F(c, (q) => circle(q, 0, 0, 2.2), K.stripe);
  save('wheel', canvas);
  // rolling without slipping at the viaduct's speed, a whole number of turns per loop
  const speed = (1920 * 30) / LOOP, turns = Math.round((speed * LOOP) / (TAU * WHEEL_R));
  layout.sprites.push({ id: 'wheel', parent: 'train', size, textureScale: S, pivot: [0.5, 0.5], positions: wheels.map(([x, y]) => [Math.round(x * 10) / 10, y]), turnsPerLoop: turns, direction: 'clockwise' });
}
writeFileSync(join(out, 'layout.json'), JSON.stringify(layout, null, 1));
console.log('wrote', layout.layers.map((l) => l.id).join(', '), '+ wheel x', wheels.length);
