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
  sky: '#121a2f', ring1: '#151e36', ring2: '#19243f', ring3: '#1e2b49', moon: '#e3d9bd', maria: '#d3c8aa', star: '#d3d5dc',
  cloud1: '#18213b', cloud2: '#1d2843', cloud3: '#232f4c',
  peak: '#34425f', peakShade: '#2c3753', snow: '#6f7c99', snowShade: '#56637f', stipple: '#252f49',
  ridge: '#29344f', pine: '#232d47', mist: '#2a3550', valley: '#1c2439', window: '#d39d55',
  stone: '#161d32', stoneLight: '#1c2439', course: '#1a2136', deck: '#11172a', rail: '#3a4566', mast: '#0f1528', wire: '#2b3553',
  train: '#0e1323', roof: '#151b2e', frame: '#0a0e1b', glow: '#d6a65c', dim: '#6f5d47', cab: '#24324f', stripe: '#38435e', lamp: '#efd9a2',
  bank: '#212b45', drift: '#28334f', brush: '#131a2c', sparkle: '#3a4767',
};

const F = (c, build, fill) => { c.beginPath(); build(c); c.fillStyle = fill; c.fill(); };
const stroke = (c, build, ink, width) => { c.beginPath(); build(c); c.strokeStyle = ink; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(); };
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

// ---- sky: stationary and opaque. A pale moon in the upper left, haloed; stars thin out under the clock.
{
  const { canvas, c } = layer(W), r = mulberry(7), M = { x: 430, y: 250 };
  c.fillStyle = K.sky; c.fillRect(0, 0, W, H);
  F(c, (q) => circle(q, M.x, M.y, 640), K.ring1); F(c, (q) => circle(q, M.x, M.y, 420), K.ring2); F(c, (q) => circle(q, M.x, M.y, 230), K.ring3);
  for (let i = 0; i < 170; i++) {
    const x = r() * W, y = r() * 650, s = r();
    if (Math.hypot(x - M.x, y - M.y) < 120) continue;
    if (x > 1330 && y < 200 && r() < 0.8) continue;                       // keep the clock's corner quiet
    c.globalAlpha = 0.45 + 0.5 * r() * (1 - y / 900);
    F(c, (q) => (s > 0.86 ? star4(q, x, y, 4 + 3 * r()) : circle(q, x, y, 0.9 + 1.1 * s)), K.star);
  }
  c.globalAlpha = 1;
  F(c, (q) => circle(q, M.x, M.y, 62), K.moon);
  F(c, (q) => { circle(q, M.x - 20, M.y - 14, 13); circle(q, M.x + 18, M.y + 12, 18); circle(q, M.x + 26, M.y - 26, 7); circle(q, M.x - 16, M.y + 30, 8); }, K.maria);
  save('sky', canvas);
  layout.layers.push({ id: 'sky', repeatWidth: W, repeats: 0 });
}

// ---- clouds: thin bars well below the clock, the slowest strip
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(17), bars = [];
  for (let x = 80; x < P - 200; x += 520 + r() * 520) {
    const y = 230 + r() * 240, w = 180 + r() * 300, col = y < 300 ? K.cloud1 : y < 400 ? K.cloud2 : K.cloud3;
    bars.push([x, y, w, 15 + r() * 8, col]);
    if (r() < 0.75) bars.push([x + w * (0.25 + r() * 0.4), y + 22 + r() * 10, w * (0.3 + r() * 0.35), 11 + r() * 5, col]);
  }
  wrapped(c, P, () => { for (const [x, y, w, h, col] of bars) F(c, (q) => pill(q, x, y, w, h), col); });
  save('clouds', canvas);
  layout.layers.push({ id: 'clouds', repeatWidth: P, repeats: 1 });
}

// ---- snowy peaks: lit from the moon on the left, shadow faces stippled
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(29), BASE = 690, peaks = [];
  for (let x = 120; x < P - 120; x += 210 + r() * 280) peaks.push({ x, h: 170 + r() * 170, wl: 220 + r() * 160, wr: 200 + r() * 180, seed: Math.floor(r() * 1e6) });
  peaks.sort((a, b) => b.h - a.h);
  const shape = (p) => {
    const q = mulberry(p.seed), top = BASE - p.h, L = [], R = [];
    for (let k = 1; k < 5; k++) { const f = k / 5; L.push([p.x - p.wl * f + (q() - 0.5) * 18, top + p.h * f + (q() - 0.5) * 16]); R.push([p.x + p.wr * f + (q() - 0.5) * 18, top + p.h * f + (q() - 0.5) * 16]); }
    const ridge = [[p.x, top], [p.x + 14 + q() * 20, top + p.h * 0.35], [p.x + 4 + q() * 30, top + p.h * 0.7], [p.x + 20 + q() * 40, BASE]];
    const snowline = top + p.h * (0.26 + q() * 0.1);
    return { top, L, R, ridge, snowline, q };
  };
  wrapped(c, P, () => {
    for (const p of peaks) {
      const s = shape(p);
      const outline = [[p.x - p.wl, BASE + 60], ...s.L.slice().reverse(), [p.x, s.top], ...s.R, [p.x + p.wr, BASE + 60]];
      F(c, (q) => poly(q, outline), K.peak);
      const shade = [[p.x, s.top], ...s.R, [p.x + p.wr, BASE + 60], ...s.ridge.slice(1).reverse()];
      F(c, (q) => poly(q, shade), K.peakShade);
      // snowcap: everything above a jagged snowline, split by the ridge into lit and shaded halves
      c.save(); c.beginPath(); poly(c, outline); c.clip();
      const zig = []; for (let x = p.x - p.wl; x <= p.x + p.wr; x += 16) zig.push([x, s.snowline + (Math.sin(x * 0.21 + p.seed) * 9) + (s.q() - 0.5) * 12 + Math.abs(x - p.x) * 0.18]);
      F(c, (q) => { q.moveTo(p.x - p.wl, s.top - 10); for (const z of zig) q.lineTo(z[0], z[1]); q.lineTo(p.x + p.wr, s.top - 10); q.closePath(); }, K.snow);
      c.beginPath(); poly(c, shade); c.clip();
      F(c, (q) => { q.moveTo(p.x - p.wl, s.top - 10); for (const z of zig) q.lineTo(z[0], z[1]); q.lineTo(p.x + p.wr, s.top - 10); q.closePath(); }, K.snowShade);
      c.restore();
      // a light stipple on the shaded face, thickest low down
      c.save(); c.beginPath(); poly(c, shade); c.clip();
      F(c, (q) => { for (let k = 0; k < p.h * 1.4; k++) { const u = s.q(), x = p.x + s.q() * p.wr, y = s.snowline + (BASE - s.snowline) * Math.sqrt(u); circle(q, x, y, 0.9 + s.q() * 0.9); } }, K.stipple);
      c.restore();
    }
  });
  c.globalCompositeOperation = 'destination-out'; c.fillRect(0, 790, P, H); c.globalCompositeOperation = 'source-over';
  save('peaks', canvas);
  layout.layers.push({ id: 'peaks', repeatWidth: P, repeats: 2 });
}

// ---- forested ridge with a few lit cabins, and the misty valley that shows through the arches
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(41), n = ripple(43, P, 900), top = (x) => 592 + 26 * n(x);
  const pines = [], cabins = [];
  for (let x = 0; x < P; x += 11 + r() * 22) { const clearing = Math.sin((x / P) * TAU * 7 + 1.3) > 0.72; if (!clearing || r() < 0.15) pines.push([x, 28 + r() * 52, r()]); }
  for (const x of [520, 1700, 2950]) cabins.push([x + r() * 160, r()]);
  const pine = (q, x, y, h, w) => { for (let k = 0; k < 3; k++) { const f = k / 3, tw = w * (1 - f * 0.45), ty = y - h * f * 0.72; poly(q, [[x - tw / 2, ty], [x + tw / 2, ty], [x, ty - h * 0.5]]); } q.rect(x - 1.5, y - 2, 3, 6); };
  wrapped(c, P, () => {
    F(c, (q) => { q.moveTo(-20, H); for (let x = -20; x <= P + 20; x += 10) q.lineTo(x, top(x)); q.lineTo(P + 20, H); q.closePath(); }, K.ridge);
    F(c, (q) => { for (const [x, h, k] of pines) pine(q, x, top(x) + 6, h, h * (0.45 + 0.15 * k)); }, K.pine);
    for (const [x, k] of cabins) {
      const y = top(x) + 8;
      F(c, (q) => { q.rect(x - 22, y - 22, 44, 22); poly(q, [[x - 28, y - 22], [x + 28, y - 22], [x, y - 40]]); q.rect(x + 10, y - 40, 7, 14); }, K.pine);
      F(c, (q) => { q.rect(x - 14, y - 15, 9, 8); if (k > 0.4) q.rect(x + 5, y - 15, 9, 8); }, K.window);
    }
    // the valley floor: a darker hollow with two bands of mist drifting through it
    F(c, (q) => q.rect(-20, 760, P + 40, H - 760), K.valley);
    F(c, (q) => { pill(q, -40, 812, P + 80, 34); }, K.mist);
    F(c, (q) => { for (let x = 60; x < P; x += 700) pill(q, x + 120 * Math.sin(x), 860, 380, 16); }, K.mist);
  });
  save('ridge', canvas);
  layout.layers.push({ id: 'ridge', repeatWidth: P, repeats: 5 });
}

// ---- the viaduct: overhead line masts behind the train, the deck and rail, and stone arches below
{
  const P = 1920, { canvas, c } = layer(P), MASTS = 480, ARCH = 240, deck = RAIL + 2, deckBottom = 772, spring = 892, rad = 92;
  wrapped(c, P, () => {
    // masts with cantilever arms; a messenger wire sags between them and the straight contact wire hangs from it
    for (let x = 100; x < P; x += MASTS) {
      F(c, (q) => { q.rect(x - 3.5, 552, 7, RAIL - 552); q.rect(x - 6, 548, 12, 6); }, K.mast);
      stroke(c, (q) => { q.moveTo(x, 572); q.lineTo(x + 92, 572); q.moveTo(x, 596); q.lineTo(x + 92, 572); q.moveTo(x + 88, 572); q.lineTo(x + 88, 604); }, K.mast, 3);
    }
    stroke(c, (q) => { for (let x = 100; x < P + MASTS; x += MASTS) { q.moveTo(x + 88, 574); q.quadraticCurveTo(x + 88 + MASTS / 2, 600, x + 88 + MASTS, 574); } }, K.wire, 1.6);
    stroke(c, (q) => { q.moveTo(-10, 604); q.lineTo(P + 10, 604); }, K.wire, 1.6);
    stroke(c, (q) => { for (let x = 100; x < P + MASTS; x += MASTS) for (let k = 1; k < 8; k++) { const u = k / 8, xx = x + 88 + u * MASTS, yy = 574 + 26 * 4 * u * (1 - u) * 0.5; q.moveTo(xx, yy); q.lineTo(xx, 604); } }, K.wire, 1);
    // deck, rail and the stone body of the viaduct
    F(c, (q) => q.rect(-10, deck, P + 20, H - deck), K.stone);
    F(c, (q) => q.rect(-10, deck, P + 20, 6), K.stoneLight);
    F(c, (q) => q.rect(-10, deckBottom, P + 20, 5), K.stoneLight);
    F(c, (q) => q.rect(-10, RAIL - 4, P + 20, 6), K.deck);
    F(c, (q) => q.rect(-10, RAIL - 4, P + 20, 2), K.rail);
    // sleepers glimpsed along the deck edge
    F(c, (q) => { for (let x = 0; x < P; x += 24) q.rect(x, deck + 7, 12, 3); }, K.deck);
    // stone courses on the piers and a ring of voussoirs round each arch
    stroke(c, (q) => { for (let y = deckBottom + 22; y < H; y += 24) { q.moveTo(-10, y); q.lineTo(P + 10, y); } }, K.course, 1.4);
    for (let x = 0; x < P; x += ARCH) {
      const cx = x + ARCH / 2;
      F(c, (q) => { q.moveTo(cx - rad - 12, H); q.lineTo(cx - rad - 12, spring); q.arc(cx, spring, rad + 12, Math.PI, 0); q.lineTo(cx + rad + 12, H); q.closePath(); }, K.stoneLight);
      stroke(c, (q) => { for (let k = 1; k < 12; k++) { const a = Math.PI + (k * Math.PI) / 12; q.moveTo(cx + Math.cos(a) * rad, spring + Math.sin(a) * rad); q.lineTo(cx + Math.cos(a) * (rad + 12), spring + Math.sin(a) * (rad + 12)); } }, K.stone, 1.6);
    }
  });
  // cut the arch openings so the misty valley shows through
  c.globalCompositeOperation = 'destination-out';
  for (let x = -ARCH; x < P + ARCH; x += ARCH) { const cx = x + ARCH / 2; F(c, (q) => { q.moveTo(cx - rad, H + 10); q.lineTo(cx - rad, spring); q.arc(cx, spring, rad, Math.PI, 0); q.lineTo(cx + rad, H + 10); q.closePath(); }, '#000'); }
  c.globalCompositeOperation = 'source-over';
  save('viaduct', canvas);
  layout.layers.push({ id: 'viaduct', repeatWidth: P, repeats: 30 });
}

// ---- the train: stationary. The locomotive's nose sits right of centre; its cars run on past the left edge.
const WHEEL_R = 11, wheels = [];
{
  const { canvas, c } = layer(W), r = mulberry(53), top = 640, body = 716, CAR = 318;
  const bogie = (x, n) => { F(c, (q) => { q.rect(x - 26 - (n - 2) * 13, body - 2, 52 + (n - 2) * 26, 16); }, K.frame); for (let k = 0; k < n; k++) wheels.push([x + (k - (n - 1) / 2) * 26, RAIL - WHEEL_R]); };
  // coaches, back to front
  for (let x0 = 1278 - CAR * 4; x0 < 1278; x0 += CAR) {
    const x = x0 + 6, w = CAR - 12;
    F(c, (q) => { q.roundRect(x, top, w, body - top, 8); }, K.train);
    F(c, (q) => { q.roundRect(x + 4, top - 7, w - 8, 12, 6); }, K.roof);
    F(c, (q) => q.rect(x, 693, w, 3), K.stripe);
    for (let k = 0; k < 8; k++) {
      const wx = x + 26 + k * 32, lit = r();
      F(c, (q) => q.roundRect(wx, 655, 22, 22, 3), lit < 0.68 ? K.glow : lit < 0.86 ? K.dim : K.cab);
    }
    F(c, (q) => { q.rect(x + 6, 652, 9, 50); q.rect(x + w - 15, 652, 9, 50); }, K.frame);
    F(c, (q) => q.rect(x + w, 650, 12, 58), K.frame);                     // gangway to the next car
    F(c, (q) => { q.rect(x + 78, body + 2, 150, 9); }, K.frame);
    bogie(x + 46, 2); bogie(x + w - 46, 2);
  }
  // the locomotive: a long nose, a raked windscreen, side grilles and a pantograph up to the contact wire
  { const x = 1290, end = 1560;
    F(c, (q) => { q.moveTo(x, body); q.lineTo(x, top - 10); q.quadraticCurveTo(x, top - 14, x + 8, top - 14); q.lineTo(end - 40, top - 14); q.quadraticCurveTo(end + 10, top - 12, end + 40, 690); q.lineTo(end + 46, body); q.closePath(); }, K.train);
    F(c, (q) => { q.moveTo(end - 34, 648); q.lineTo(end - 2, 648); q.lineTo(end + 22, 676); q.lineTo(end - 34, 676); q.closePath(); }, K.cab);
    F(c, (q) => q.rect(x, 693, end + 30 - x, 3), K.stripe);
    stroke(c, (q) => { for (let k = 0; k < 9; k++) { q.moveTo(x + 40 + k * 9, 652); q.lineTo(x + 40 + k * 9, 680); } for (let k = 0; k < 9; k++) { q.moveTo(x + 150 + k * 9, 652); q.lineTo(x + 150 + k * 9, 680); } }, K.frame, 2.4);
    F(c, (q) => q.roundRect(x + 262, 652, 18, 26, 3), K.dim);
    F(c, (q) => { q.rect(x + 20, top - 18, 60, 6); q.rect(x + 190, top - 18, 50, 6); }, K.roof);
    stroke(c, (q) => { const px = x + 60, roof = top - 18; q.moveTo(px - 20, roof); q.lineTo(px + 8, roof - 18); q.lineTo(px - 14, 606); q.moveTo(px - 30, 605); q.lineTo(px + 4, 605); }, K.frame, 2.6);
    F(c, (q) => q.rect(x - 12, 650, 12, 58), K.frame);
    F(c, (q) => { q.rect(x + 90, body + 2, 100, 10); q.moveTo(end + 30, body); q.lineTo(end + 50, body + 16); q.lineTo(end + 20, body + 16); q.closePath(); }, K.frame);
    bogie(x + 56, 3); bogie(end - 34, 3);
    // the headlamp and a soft beam along the line ahead
    c.save(); c.globalAlpha = 0.1; F(c, (q) => poly(q, [[end + 40, 698], [W + 20, 666], [W + 20, 760], [end + 40, 708]]), K.lamp);
    c.globalAlpha = 0.08; F(c, (q) => poly(q, [[end + 40, 700], [W + 20, 688], [W + 20, 738], [end + 40, 706]]), K.lamp); c.restore();
    F(c, (q) => { q.ellipse(end + 39, 703, 4, 5, 0, 0, TAU); }, K.lamp);
  }
  save('train', canvas);
  layout.layers.push({ id: 'train', repeatWidth: W, repeats: 0 });
}

// ---- the near snowbank: low, quiet and fastest, so the bottom fifth stays calm for the app row
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(61), n = ripple(67, P, 1100), edge = (x) => 866 + 10 * n(x);
  const shrubs = [], posts = [], tufts = [];
  for (let x = 140; x < P - 140; x += 260 + r() * 420) shrubs.push([x, 22 + r() * 30, Math.floor(r() * 1e6)]);
  for (let x = 2200; x < 2900; x += 116) posts.push(x);
  for (let k = 0; k < 40; k++) tufts.push([r() * P, 12 + r() * 22, r()]);
  wrapped(c, P, () => {
    F(c, (q) => { q.moveTo(-20, H + 10); for (let x = -20; x <= P + 20; x += 12) q.lineTo(x, edge(x)); q.lineTo(P + 20, H + 10); q.closePath(); }, K.bank);
    F(c, (q) => { for (let k = 0; k < 9; k++) pill(q, (k * 431) % P, 930 + ((k * 53) % 110), 260 + (k % 3) * 90, 5); }, K.drift);
    F(c, (q) => { for (const [x, s, seed] of shrubs) { const t = mulberry(seed); for (let k = 0; k < 5; k++) circle(q, x + (k - 2) * s * 0.42 + (t() - 0.5) * 8, edge(x) - s * (0.25 + 0.35 * t()), s * (0.32 + 0.18 * t())); } }, K.brush);
    F(c, (q) => { for (const x of posts) { q.rect(x - 3, edge(x) - 50, 6, 52); } }, K.brush);
    stroke(c, (q) => { for (let i = 1; i < posts.length; i++) for (const h of [42, 24]) { const a = posts[i - 1], b = posts[i]; q.moveTo(a, edge(a) - h); q.quadraticCurveTo((a + b) / 2, (edge(a) + edge(b)) / 2 - h + 6, b, edge(b) - h); } }, K.brush, 1.4);
    F(c, (q) => { for (const [x, h, k] of tufts) for (let b = 0; b < 4; b++) { const bx = x + b * 5, lean = (b - 1.5) * 4 + (k - 0.5) * 6; q.moveTo(bx - 2, edge(x) + 2); q.quadraticCurveTo(bx + lean * 0.3, edge(x) - h * 0.6, bx + lean, edge(x) - h); q.lineTo(bx + 2, edge(x) + 2); q.closePath(); } }, K.brush);
    F(c, (q) => { for (let k = 0; k < 160; k++) { const x = (k * 977.31) % P, y = edge(x) + 8 + ((k * 37) % 60); circle(q, x, y, 0.9); } }, K.sparkle);
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
