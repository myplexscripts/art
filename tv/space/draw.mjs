// Ringed Horizon: an original layered background for the Simple Home Android TV launcher.
// The view glides across the night side of an alien moon: a colony of domes, habitats and solar arrays, crater
// ridges and pale far mountains, under a ringed gas giant, a nebula and a slowly turning wheel station.
// Each scrolling strip is drawn three times, a strip width apart, so it tiles without a seam, transparent edges
// included.
//
//   npm install --no-save @napi-rs/canvas
//   node tv/space/draw.mjs <out-dir>
// tv/package.py crops, encodes and blurs the layers; tv/verify.mjs checks the result.
import { createRequire } from 'module';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { mulberry, poly, circle, pill, star4, TAU } from '../../live/geom.js';

const require = createRequire(join(process.cwd(), 'noop.js'));
const { createCanvas } = require('@napi-rs/canvas');
const out = process.argv[2] ?? 'ringed-horizon-layers';
mkdirSync(out, { recursive: true });

const W = 1920, H = 1080, LOOP = 360, GROUND = 784, EDGE = 872;
const K = {
  star: '#dfe3ee', starWarm: '#f0d9b0', starCool: '#a9c7ee',
  giant: '#c99470', band1: '#e0b48a', band2: '#a9705a', band3: '#d8a77f', band4: '#8e5c50', storm: '#b5654e', night: '#2a1d36', ring: '#d9c6a3', ringDim: '#a8977c', ringShadow: '#1b1430', moonlet: '#9aa0b8', moonletShade: '#4c5068',
  rock: '#222640', rockLit: '#3d4268', rockRim: '#6a6f99',
  far: '#353f68', farLit: '#465282', farSnow: '#6a77a3',
  ridge: '#262f52', ridgeShade: '#1f2747', craterLip: '#333d64', craterBowl: '#1b2240', stipple: '#1a2140',
  ground: '#1a2140', groundLine: '#222a4c', hull: '#2c3660', hullLit: '#3d4a7a', hullDark: '#1c2342', glass: '#2f4a70', warm: '#efb766', warmDim: '#9b7656', teal: '#6fd3c7', tealDim: '#3f7f80', panel: '#253a6b', panelCell: '#3b5a94', red: '#c45a62', plant: '#4c9a7a', dust: '#20284a',
  regolith: '#141a32', regolithLit: '#1c2340', boulder: '#0f1428', boulderLit: '#262d4d', crystal: '#2f7f82', crystalLit: '#5fb3ac', track: '#10152a', speck: '#252d4e',
  station: '#b9c0d6', stationShade: '#8d95b0', stationDark: '#4b5272', stationPanel: '#35588a',
};
const F = (c, build, fill) => { c.beginPath(); build(c); c.fillStyle = fill; c.fill(); };
const stroke = (c, build, ink, width) => { c.beginPath(); build(c); c.strokeStyle = ink; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(); };
const alpha = (c, a, draw) => { c.save(); c.globalAlpha = a; draw(); c.restore(); };
function ripple(seed, P, wavelength) {
  const r = mulberry(seed), terms = [[1, 1], [2.3, 0.5], [4.9, 0.22]].map(([k, a]) => ({ n: Math.max(1, Math.round((P * k) / wavelength)), a, ph: r() * TAU }));
  return (x) => terms.reduce((s, q) => s + q.a * Math.sin((TAU * q.n * x) / P + q.ph), 0) / 1.72;
}
function layer(width) { const canvas = createCanvas(width, H); return { canvas, c: canvas.getContext('2d') }; }
function wrapped(c, width, draw) { for (const dx of [-width, 0, width]) { c.save(); c.translate(dx, 0); draw(); c.restore(); } }
const save = (name, canvas) => writeFileSync(join(out, name + '.png'), canvas.toBuffer('image/png'));
const layout = { name: 'Ringed Horizon', design: { width: W, height: H }, loopSeconds: LOOP, layers: [], sprites: [] };
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
// an irregular rock outline about (x, y)
const rockShape = (q, x, y, s, seed) => { const t = mulberry(seed), n = 7, pts = []; for (let k = 0; k < n; k++) { const a = (k / n) * TAU, rr = s * (0.65 + 0.35 * t()); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.8]); } poly(q, pts); };

// ---- sky: stationary and opaque. Deep space over a nebula glow, the ringed giant, a small moon and stars that
// thin out under the clock. Gradient and nebula are computed in floating point and ordered-dithered.
{
  const { canvas, c } = layer(W), r = mulberry(3);
  const stops = [[0, '#060915'], [0.35, '#0b1126'], [0.55, '#121838'], [0.68, '#1b1d44'], [0.76, '#24224c'], [1, '#2a2652']].map(([a, h]) => [a, rgb(h)]);
  const clouds = [[700, 520, 520, 170, rgb('#1f3d55'), 0.55], [1100, 470, 420, 120, rgb('#3a2352'), 0.5], [380, 600, 380, 140, rgb('#2b2554'), 0.5], [1500, 560, 420, 110, rgb('#1d3550'), 0.35], [900, 380, 300, 90, rgb('#352050'), 0.3]];
  const img = c.createImageData(W, H), d = img.data;
  for (let y = 0; y < H; y++) {
    const v = y / (H - 1), k = stops.findIndex(([at]) => at >= v), [a0, c0] = stops[Math.max(0, k - 1)], [a1, c1] = stops[k], u = a1 > a0 ? (v - a0) / (a1 - a0) : 0;
    const base = c0.map((x, i) => x + (c1[i] - x) * u);
    for (let x = 0; x < W; x++) {
      const col = base.slice();
      for (const [cx, cy, rx, ry, cc, s] of clouds) { const dd = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2; if (dd < 9) { const w = s * Math.exp(-dd) * (0.85 + 0.15 * Math.sin(x * 0.013 + y * 0.021)); for (let i = 0; i < 3; i++) col[i] += (cc[i] - col[i]) * w; } }
      const i = (y * W + x) * 4, e = BAYER[(y & 3) * 4 + (x & 3)] / 16 - 0.5;
      d[i] = Math.floor(col[0] + e + 0.5); d[i + 1] = Math.floor(col[1] + e + 0.5); d[i + 2] = Math.floor(col[2] + e + 0.5); d[i + 3] = 255;
    }
  }
  c.putImageData(img, 0, 0);
  // stars, a few with soft crosses; a dense faint scatter along the nebula
  for (let i = 0; i < 900; i++) {
    const x = r() * W, y = r() * 760, s = r(), tint = r();
    if (x > 1330 && y < 200 && r() < 0.85) continue;
    const big = s > 0.97, a = big ? 0.9 : 0.25 + 0.55 * r();
    alpha(c, a * (1 - y / 1300), () => F(c, (q) => (big ? star4(q, x, y, 5 + 3 * r()) : circle(q, x, y, 0.5 + 1.2 * s * s)), tint < 0.15 ? K.starWarm : tint < 0.35 ? K.starCool : K.star));
  }
  alpha(c, 0.6, () => F(c, (q) => q.ellipse(1240, 330, 16, 5, -0.4, 0, TAU), '#3b3a6a'));             // a far galaxy
  alpha(c, 0.8, () => F(c, (q) => q.ellipse(1240, 330, 5, 2, -0.4, 0, TAU), '#6d6a9a'));
  // the ringed giant: back half of the ring, banded disc with a storm, its night side and the ring's shadow, front ring
  const G = { x: 420, y: 380, r: 205 }, tilt = -0.2, ringR = [[300, 52], [330, 57], [356, 61], [400, 69], [420, 72]];
  const ring = () => {
    c.lineCap = 'butt';
    for (const [rx, ry, ink, width] of [[318, 55, K.ringDim, 30], [347, 60, K.ring, 22], [392, 68, K.ring, 40], [418, 72, K.ringDim, 10]]) { c.beginPath(); c.ellipse(G.x, G.y, rx, ry, tilt, 0, TAU); c.strokeStyle = ink; c.lineWidth = width; c.stroke(); }
    c.beginPath(); c.ellipse(G.x, G.y, 368, 64, tilt, 0, TAU); c.strokeStyle = K.ringShadow; c.lineWidth = 3; c.stroke();
  };
  ring();
  c.save(); c.beginPath(); circle(c, G.x, G.y, G.r); c.clip();
  c.fillStyle = K.giant; c.fillRect(G.x - G.r, G.y - G.r, G.r * 2, G.r * 2);
  c.translate(G.x, G.y); c.rotate(tilt);
  for (const [y, h, ink] of [[-190, 30, K.band1], [-140, 22, K.band2], [-96, 40, K.band3], [-40, 18, K.band4], [-10, 34, K.band1], [40, 26, K.band2], [80, 30, K.band3], [126, 22, K.band4], [160, 40, K.band1]]) F(c, (q) => { q.moveTo(-G.r, y); for (let x = -G.r; x <= G.r; x += 12) q.lineTo(x, y + 4 * Math.sin(x / 40 + y)); for (let x = G.r; x >= -G.r; x -= 12) q.lineTo(x, y + h + 4 * Math.sin(x / 34 + y)); q.closePath(); }, ink);
  F(c, (q) => q.ellipse(-60, 52, 34, 15, 0, 0, TAU), K.storm);
  F(c, (q) => q.ellipse(-60, 52, 18, 7, 0, 0, TAU), K.band2);
  c.rotate(-tilt); c.translate(-G.x, -G.y);
  // night side: the disc is lit from the upper left
  alpha(c, 0.82, () => F(c, (q) => { circle(q, G.x, G.y, G.r + 2); q.moveTo(G.x - 60 + G.r + 40, G.y - 70); q.arc(G.x - 60, G.y - 70, G.r + 40, 0, TAU, true); }, K.night));
  alpha(c, 0.55, () => F(c, (q) => { q.ellipse(G.x + 20, G.y + 60, 400, 26, tilt, 0, TAU); }, K.ringShadow));
  c.restore();
  // the near half of the ring passes in front of the disc: redraw it, clipped below the ring's long axis
  c.save(); c.translate(G.x, G.y); c.rotate(tilt); c.beginPath(); c.rect(-500, 0, 1000, 200); c.rotate(-tilt); c.translate(-G.x, -G.y); c.clip(); ring(); c.restore();
  // a small moon beside it
  F(c, (q) => circle(q, 800, 190, 20), K.moonlet);
  F(c, (q) => { circle(q, 800, 190, 20.5); q.moveTo(800 - 8 + 24, 184); q.arc(800 - 8, 184, 24, 0, TAU, true); }, K.moonletShade);
  save('sky', canvas);
  layout.layers.push({ id: 'sky', repeatWidth: W, repeats: 0, lossless: true });
}

// ---- wheel station: one sprite on the sky, turning slowly. A thick, segmented torus with lit windows, three tube
// spokes, a ribbed hub and two solar wings
{
  const S = 2, size = 170, canvas = createCanvas(size * S, size * S), c = canvas.getContext('2d');
  c.scale(S, S); c.translate(size / 2, size / 2);
  F(c, (q) => { for (let k = 0; k < 2; k++) { const a = k * Math.PI + Math.PI / 6; c.save(); q.save(); q.translate(Math.cos(a) * 62, Math.sin(a) * 62); q.rotate(a); q.rect(6, -9, 22, 18); q.restore(); c.restore(); } }, K.stationPanel);
  stroke(c, (q) => { for (let k = 0; k < 2; k++) { const a = k * Math.PI + Math.PI / 6; for (let j = 0; j < 3; j++) { const d = 68 + j * 7; q.moveTo(Math.cos(a) * d - Math.sin(a) * 9, Math.sin(a) * d + Math.cos(a) * 9); q.lineTo(Math.cos(a) * d + Math.sin(a) * 9, Math.sin(a) * d - Math.cos(a) * 9); } } }, K.stationDark, 1);
  stroke(c, (q) => { for (let k = 0; k < 3; k++) { const a = (k * TAU) / 3 + Math.PI / 2; q.moveTo(Math.cos(a) * 18, Math.sin(a) * 18); q.lineTo(Math.cos(a) * 50, Math.sin(a) * 50); } }, K.stationDark, 7);
  stroke(c, (q) => { for (let k = 0; k < 3; k++) { const a = (k * TAU) / 3 + Math.PI / 2; q.moveTo(Math.cos(a) * 18, Math.sin(a) * 18); q.lineTo(Math.cos(a) * 50, Math.sin(a) * 50); } }, K.station, 3.5);
  stroke(c, (q) => circle(q, 0, 0, 58), K.stationDark, 20);
  stroke(c, (q) => circle(q, 0, 0, 58), K.station, 14);
  stroke(c, (q) => circle(q, 0, 0, 52), K.stationShade, 3);
  stroke(c, (q) => { for (let k = 0; k < 18; k++) { const a = (k * TAU) / 18; q.moveTo(Math.cos(a) * 51, Math.sin(a) * 51); q.lineTo(Math.cos(a) * 65, Math.sin(a) * 65); } }, K.stationDark, 1.4);
  F(c, (q) => { for (let k = 0; k < 36; k++) { if (k % 2) continue; const a = (k * TAU) / 36 + 0.08; circle(q, Math.cos(a) * 59, Math.sin(a) * 59, 1.6); } }, K.warm);
  F(c, (q) => circle(q, 0, 0, 20), K.stationDark);
  F(c, (q) => circle(q, 0, 0, 16), K.station);
  stroke(c, (q) => { circle(q, 0, 0, 11); }, K.stationShade, 2);
  F(c, (q) => circle(q, 0, 0, 5), K.stationDark);
  save('station', canvas);
  layout.sprites.push({ id: 'station', parent: 'sky', size, textureScale: S, pivot: [0.5, 0.5], positions: [[1060, 180]], turnsPerLoop: 4, direction: 'counterclockwise' });
}

// ---- asteroid belt: a loose drift of rocks across the sky, the slowest strip
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(11), rocks = [];
  for (let k = 0; k < 80; k++) { const x = r() * P, y = 300 + (r() + r()) * 80 + 30 * Math.sin((x / P) * TAU * 2), s = 3 + r() * r() * 10; rocks.push([x, y, s, Math.floor(r() * 1e6)]); }
  wrapped(c, P, () => {
    F(c, (q) => { for (const [x, y, s, seed] of rocks) rockShape(q, x, y, s, seed); }, K.rock);
    F(c, (q) => { for (const [x, y, s, seed] of rocks) rockShape(q, x - s * 0.22, y - s * 0.18, s * 0.6, seed + 1); }, K.rockLit);
    F(c, (q) => { for (const [x, y, s, seed] of rocks) if (s > 5) rockShape(q, x - s * 0.38, y - s * 0.32, s * 0.25, seed + 2); }, K.rockRim);
  });
  save('asteroids', canvas);
  layout.layers.push({ id: 'asteroids', repeatWidth: P, repeats: 1 });
}

// ---- far mountains: pale and jagged, fading into the low nebula glow
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(21), BASE = 780, peaks = [];
  for (let x = 40; x < P - 40; x += 120 + r() * 220) peaks.push({ x, h: 90 + r() * 170, wl: 120 + r() * 140, wr: 120 + r() * 140, seed: Math.floor(r() * 1e6) });
  peaks.sort((a, b) => b.h - a.h);
  wrapped(c, P, () => {
    for (const p of peaks) {
      const t = mulberry(p.seed), top = BASE - p.h, L = [], R = [];
      for (let k = 1; k < 6; k++) { const f = k / 6; L.push([p.x - p.wl * f + (t() - 0.5) * 18, top + p.h * f + (t() - 0.5) * 16]); R.push([p.x + p.wr * f + (t() - 0.5) * 18, top + p.h * f + (t() - 0.5) * 16]); }
      const outline = [[p.x - p.wl, BASE + 40], ...L.slice().reverse(), [p.x, top], ...R, [p.x + p.wr, BASE + 40]];
      F(c, (q) => poly(q, outline), K.far);
      F(c, (q) => poly(q, [[p.x - p.wl, BASE + 40], ...L.slice().reverse(), [p.x, top], [p.x - 6, top + p.h * 0.4], [p.x - 20, BASE + 40]]), K.farLit);
      F(c, (q) => poly(q, [[p.x, top], [p.x - p.wl * 0.18, top + p.h * 0.16], [p.x - 4, top + p.h * 0.12], [p.x + p.wr * 0.12, top + p.h * 0.14]]), K.farSnow);
    }
  });
  c.globalCompositeOperation = 'source-atop';
  const g = c.createLinearGradient(0, 620, 0, 800); g.addColorStop(0, 'rgba(36,34,76,0)'); g.addColorStop(1, 'rgba(36,34,76,0.6)');
  c.fillStyle = g; c.fillRect(0, 600, P, 220); c.globalCompositeOperation = 'source-over';
  c.globalCompositeOperation = 'destination-out'; c.fillRect(0, 820, P, H); c.globalCompositeOperation = 'source-over';
  save('far', canvas);
  layout.layers.push({ id: 'far', repeatWidth: P, repeats: 2 });
}

// ---- crater ridge: rolling ground with crater rims, a mesa or two, and a stippled shade
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(31), n = ripple(33, P, 700), top = (x) => 700 + 22 * n(x);
  const craters = []; for (let x = 100; x < P; x += 180 + r() * 380) craters.push([x, 40 + r() * 90, r()]);
  const mesas = [[700, 220, 70], [2400, 160, 52], [3300, 120, 40]];
  wrapped(c, P, () => {
    F(c, (q) => { for (const [x, w, h] of mesas) poly(q, [[x - w / 2 - 40, top(x) + 10], [x - w / 2, top(x) - h], [x + w / 2, top(x) - h], [x + w / 2 + 40, top(x) + 10]]); }, K.ridge);
    F(c, (q) => { for (const [x, w, h] of mesas) poly(q, [[x + w / 2 - 30, top(x) - h], [x + w / 2, top(x) - h], [x + w / 2 + 40, top(x) + 10], [x + w / 2 - 10, top(x) + 10]]); }, K.ridgeShade);
    F(c, (q) => { for (const [x, w, h] of mesas) poly(q, [[x - w / 2 - 40, top(x) + 10], [x - w / 2, top(x) - h], [x - w / 2 + 26, top(x) - h], [x - w / 2 - 6, top(x) + 10]]); }, K.craterLip);
    stroke(c, (q) => { for (const [x, w, h] of mesas) for (let k = 1; k < 4; k++) { const y = top(x) - h + (h * k) / 4; q.moveTo(x - w / 2 - 6 - 10 * (k / 4), y); q.lineTo(x + w / 2 - 20, y + 2); } }, K.ridgeShade, 1.6);
    F(c, (q) => { q.moveTo(-20, H); for (let x = -20; x <= P + 20; x += 10) q.lineTo(x, top(x)); q.lineTo(P + 20, H); q.closePath(); }, K.ridge);
    // craters on the slope: a raised lip catching light, a shadowed bowl
    for (const [x, w, k] of craters) {
      const y = top(x) + 18 + k * 40;
      F(c, (q) => q.ellipse(x, y, w * 0.55, w * 0.13, 0, 0, TAU), K.craterLip);
      F(c, (q) => q.ellipse(x + w * 0.04, y + w * 0.02, w * 0.46, w * 0.09, 0, 0, TAU), K.craterBowl);
    }
    F(c, (q) => { for (let k = 0; k < 2600; k++) { const x = r() * P, y = top(x) + 6 + r() * r() * 90; circle(q, x, y, 0.9); } }, K.stipple);
  });
  save('ridge', canvas);
  layout.layers.push({ id: 'ridge', repeatWidth: P, repeats: 4 });
}

// ---- the colony: domes, habitats, a greenhouse, solar arrays, a comms tower, a lander on its pad, a rover,
// cargo and the walkway tubes between them
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(41);
  const dome = (x, w, h, glow) => {
    F(c, (q) => { q.ellipse(x, GROUND, w / 2, h, 0, Math.PI, TAU); q.closePath(); }, K.hull);
    alpha(c, 0.9, () => F(c, (q) => { q.ellipse(x - w * 0.08, GROUND - 2, w * 0.36, h * 0.8, 0, Math.PI * 1.08, Math.PI * 1.6); q.lineTo(x - w * 0.08, GROUND - 2); q.closePath(); }, K.hullLit));
    stroke(c, (q) => { for (let k = 1; k < 5; k++) { q.moveTo(x - w / 2 + (w * k) / 5, GROUND); q.quadraticCurveTo(x - w / 2 + (w * k) / 5 + (k - 2.5) * 6, GROUND - h * 0.95, x, GROUND - h); } for (const f of [0.35, 0.68]) { q.moveTo(x - (w / 2) * Math.sqrt(1 - f * f), GROUND - h * f); q.ellipse(x, GROUND, (w / 2) * Math.sqrt(1 - f * f), 0.001, 0, Math.PI, TAU); } }, K.hullDark, 1.4);
    F(c, (q) => { for (let k = 0; k < Math.floor(w / 26); k++) q.roundRect(x - w * 0.38 + k * 26, GROUND - 20, 14, 9, 3); }, glow);
    F(c, (q) => q.rect(x - 9, GROUND - 26, 18, 26), K.hullDark);
  };
  const habitat = (x, w) => {
    F(c, (q) => { q.roundRect(x, GROUND - 46, w, 40, 20); q.rect(x + 10, GROUND - 6, 6, 6); q.rect(x + w - 16, GROUND - 6, 6, 6); }, K.hull);
    F(c, (q) => q.rect(x + 10, GROUND - 40, w - 20, 5), K.hullLit);
    F(c, (q) => { for (let k = 0; k < Math.floor((w - 40) / 22); k++) circle(q, x + 28 + k * 22, GROUND - 26, 5); }, r() < 0.7 ? K.warm : K.teal);
    stroke(c, (q) => { for (let k = 1; k < 4; k++) { q.moveTo(x + (w * k) / 4, GROUND - 46); q.lineTo(x + (w * k) / 4, GROUND - 6); } }, K.hullDark, 1.2);
  };
  const greenhouse = (x, w) => {
    F(c, (q) => { q.moveTo(x, GROUND); q.lineTo(x, GROUND - 40); q.quadraticCurveTo(x + w / 2, GROUND - 90, x + w, GROUND - 40); q.lineTo(x + w, GROUND); q.closePath(); }, K.tealDim);
    F(c, (q) => { for (let k = 0; k < w / 14; k++) circle(q, x + 8 + k * 14, GROUND - 14 - (k % 3) * 6, 6 + (k % 2) * 3); }, K.plant);
    stroke(c, (q) => { for (let k = 1; k < w / 24; k++) { q.moveTo(x + k * 24, GROUND); q.lineTo(x + k * 24, GROUND - 40 - 50 * Math.sin((Math.PI * k * 24) / w)); } q.moveTo(x, GROUND - 40); q.quadraticCurveTo(x + w / 2, GROUND - 90, x + w, GROUND - 40); }, K.hullDark, 1.6);
  };
  const solar = (x, n) => {
    for (let k = 0; k < n; k++) {
      const px = x + k * 70;
      F(c, (q) => { q.rect(px + 30, GROUND - 40, 5, 40); q.rect(px + 22, GROUND - 4, 21, 4); }, K.hullDark);
      F(c, (q) => poly(q, [[px, GROUND - 38], [px + 62, GROUND - 62], [px + 66, GROUND - 46], [px + 4, GROUND - 22]]), K.panel);
      stroke(c, (q) => { for (let j = 1; j < 6; j++) { const u = j / 6; q.moveTo(px + 62 * u, GROUND - 38 - 24 * u); q.lineTo(px + 4 + 62 * u, GROUND - 22 - 24 * u); } q.moveTo(px + 2, GROUND - 30); q.lineTo(px + 64, GROUND - 54); }, K.panelCell, 1.4);
      stroke(c, (q) => { q.moveTo(px, GROUND - 38); q.lineTo(px + 62, GROUND - 62); }, K.hullLit, 1.4);
    }
  };
  const tower = (x) => {
    F(c, (q) => { q.rect(x - 3, GROUND - 170, 6, 170); q.rect(x - 14, GROUND - 6, 28, 6); }, K.hullDark);
    stroke(c, (q) => { for (let y = GROUND - 160; y < GROUND - 10; y += 18) { q.moveTo(x - 10, y); q.lineTo(x + 10, y + 18); q.moveTo(x + 10, y); q.lineTo(x - 10, y + 18); } q.moveTo(x - 10, GROUND - 160); q.lineTo(x - 10, GROUND - 6); q.moveTo(x + 10, GROUND - 160); q.lineTo(x + 10, GROUND - 6); }, K.hullDark, 1.6);
    F(c, (q) => { q.ellipse(x + 18, GROUND - 150, 26, 10, -0.6, 0, TAU); }, K.hull);
    stroke(c, (q) => { q.moveTo(x + 18, GROUND - 150); q.lineTo(x + 34, GROUND - 172); }, K.hullDark, 2);
    F(c, (q) => circle(q, x, GROUND - 174, 3), K.red);
    alpha(c, 0.2, () => F(c, (q) => circle(q, x, GROUND - 174, 9), K.red));
  };
  const lander = (x) => {
    F(c, (q) => { q.rect(x - 70, GROUND - 4, 140, 4); }, K.groundLine);
    stroke(c, (q) => { q.moveTo(x - 50, GROUND - 2); q.lineTo(x - 26, GROUND - 40); q.moveTo(x + 50, GROUND - 2); q.lineTo(x + 26, GROUND - 40); q.moveTo(x - 58, GROUND - 2); q.lineTo(x - 42, GROUND - 2); q.moveTo(x + 42, GROUND - 2); q.lineTo(x + 58, GROUND - 2); }, K.hullDark, 3);
    F(c, (q) => { poly(q, [[x - 34, GROUND - 40], [x + 34, GROUND - 40], [x + 24, GROUND - 82], [x - 24, GROUND - 82]]); poly(q, [[x - 18, GROUND - 82], [x + 18, GROUND - 82], [x + 10, GROUND - 104], [x - 10, GROUND - 104]]); }, K.hull);
    F(c, (q) => { poly(q, [[x - 34, GROUND - 40], [x - 10, GROUND - 40], [x - 6, GROUND - 82], [x - 24, GROUND - 82]]); }, K.hullLit);
    F(c, (q) => q.roundRect(x - 8, GROUND - 98, 16, 8, 3), K.warm);
    F(c, (q) => { circle(q, x - 60, GROUND - 3, 2); circle(q, x + 60, GROUND - 3, 2); }, K.teal);
  };
  const rover = (x) => {
    F(c, (q) => { q.roundRect(x - 34, GROUND - 32, 68, 20, 6); q.rect(x - 10, GROUND - 44, 20, 12); q.rect(x + 12, GROUND - 52, 3, 20); }, K.hull);
    F(c, (q) => { for (const wx of [-24, 0, 24]) circle(q, x + wx, GROUND - 8, 8); }, K.hullDark);
    F(c, (q) => q.rect(x - 6, GROUND - 41, 12, 6), K.warm);
    alpha(c, 0.12, () => F(c, (q) => poly(q, [[x + 34, GROUND - 26], [x + 160, GROUND - 40], [x + 160, GROUND - 4], [x + 34, GROUND - 20]]), K.warm));
  };
  const rocket = (x) => {
    F(c, (q) => { q.rect(x - 70, GROUND - 6, 140, 6); q.rect(x + 26, GROUND - 260, 10, 254); q.rect(x + 46, GROUND - 260, 10, 254); for (const y of [GROUND - 230, GROUND - 160, GROUND - 90]) q.rect(x + 6, y, 52, 5); }, K.hullDark);
    stroke(c, (q) => { for (let y = GROUND - 250; y < GROUND - 10; y += 22) { q.moveTo(x + 30, y); q.lineTo(x + 52, y + 22); q.moveTo(x + 52, y); q.lineTo(x + 30, y + 22); } }, K.hullDark, 1.6);
    F(c, (q) => { q.rect(x - 14, GROUND - 200, 28, 194); poly(q, [[x - 14, GROUND - 200], [x + 14, GROUND - 200], [x + 7, GROUND - 238], [x, GROUND - 252], [x - 7, GROUND - 238]]); poly(q, [[x - 14, GROUND - 40], [x - 30, GROUND - 6], [x - 14, GROUND - 14]]); poly(q, [[x + 14, GROUND - 40], [x + 30, GROUND - 6], [x + 14, GROUND - 14]]); }, K.hull);
    F(c, (q) => { q.rect(x - 14, GROUND - 200, 9, 194); }, K.hullLit);
    F(c, (q) => { q.rect(x - 14, GROUND - 150, 28, 4); q.rect(x - 14, GROUND - 80, 28, 4); }, K.hullDark);
    F(c, (q) => { circle(q, x, GROUND - 180, 4); }, K.warm);
    F(c, (q) => circle(q, x + 41, GROUND - 266, 3), K.red);
    alpha(c, 0.2, () => F(c, (q) => circle(q, x + 41, GROUND - 266, 9), K.red));
  };
  const lamp = (x, ink) => { F(c, (q) => { q.rect(x - 1.5, GROUND - 46, 3, 46); q.rect(x - 1.5, GROUND - 46, 9, 3); }, K.hullDark); alpha(c, 0.18, () => F(c, (q) => circle(q, x + 7, GROUND - 42, 12), ink)); F(c, (q) => circle(q, x + 7, GROUND - 42, 2.4), ink); };
  const astronaut = (x) => F(c, (q) => { circle(q, x, GROUND - 30, 6); q.roundRect(x - 7, GROUND - 25, 14, 14, 4); q.rect(x - 11, GROUND - 23, 5, 10); q.rect(x - 6, GROUND - 12, 5, 12); q.rect(x + 1, GROUND - 12, 5, 12); q.rect(x + 7, GROUND - 22, 4, 10); }, K.station);
  const crate = (x, n) => {
    const boxes = []; for (let k = 0; k < n; k++) boxes.push([x + k * 30, GROUND - 22]); for (let k = 0; k < n - 2; k++) boxes.push([x + 15 + k * 30, GROUND - 44]);
    F(c, (q) => { for (const [bx, by] of boxes) q.rect(bx, by, 28, 22); }, K.hull);
    F(c, (q) => { for (const [bx, by] of boxes) { q.rect(bx, by, 28, 3); q.rect(bx, by, 3, 22); } }, K.hullLit);
    stroke(c, (q) => { for (const [bx, by] of boxes) { q.moveTo(bx + 4, by + 6); q.lineTo(bx + 24, by + 18); q.moveTo(bx + 24, by + 6); q.lineTo(bx + 4, by + 18); } }, K.hullDark, 1.2);
  };
  wrapped(c, P, () => {
    // ground and its lit seam
    F(c, (q) => q.rect(-20, GROUND, P + 40, H - GROUND), K.ground);
    F(c, (q) => q.rect(-20, GROUND, P + 40, 3), K.groundLine);
    F(c, (q) => { for (let k = 0; k < 1500; k++) { const x = r() * P, y = GROUND + 6 + r() * 120; circle(q, x, y, 0.9); } }, K.dust);
    // walkway tubes between the modules
    F(c, (q) => { for (const [a, b] of [[260, 460], [620, 700], [1140, 1260], [2050, 2230], [2700, 2860]]) q.roundRect(a, GROUND - 20, b - a, 14, 7); }, K.hullDark);
    dome(200, 150, 90, K.warm); habitat(460, 160); greenhouse(700, 130); dome(940, 210, 120, K.warm); tower(1180);
    solar(1300, 5); lander(1800); habitat(2230, 190); dome(2560, 150, 84, K.teal); crate(2880, 4); rover(3150); solar(3320, 4);
    tower(3700); rocket(1630);
    astronaut(3220);
    F(c, (q) => { circle(q, 3220 + 2, GROUND - 31, 3); }, K.glass);
    for (const [x, ink] of [[120, K.warm], [390, K.teal], [620, K.warm], [1100, K.teal], [1480, K.warm], [2040, K.warm], [2420, K.teal], [2800, K.warm], [3060, K.teal], [3600, K.warm]]) lamp(x, ink);
    // beacons on the dome tops
    F(c, (q) => { for (const [x, h] of [[200, 90], [940, 120], [2560, 84]]) circle(q, x, GROUND - h - 4, 2.6); }, K.red);
  });
  save('colony', canvas);
  layout.layers.push({ id: 'colony', repeatWidth: P, repeats: 8 });
}

// ---- foreground regolith: boulders, glowing crystal clusters, small craters and rover tracks; the bottom fifth is
// quiet ground
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(61), n = ripple(67, P, 1100), edge = (x) => EDGE + 10 * n(x);
  const boulders = []; for (let x = 100; x < P - 60; x += 160 + r() * 420) boulders.push([x, 14 + r() * r() * 50, Math.floor(r() * 1e6)]);
  const crystals = [[560, 1], [1720, 0.8], [2620, 1.1], [3480, 0.9]];
  wrapped(c, P, () => {
    F(c, (q) => { q.moveTo(-20, H + 10); for (let x = -20; x <= P + 20; x += 12) q.lineTo(x, edge(x)); q.lineTo(P + 20, H + 10); q.closePath(); }, K.regolith);
    F(c, (q) => { q.moveTo(-20, edge(-20)); for (let x = -20; x <= P + 20; x += 12) q.lineTo(x, edge(x)); for (let x = P + 20; x >= -20; x -= 12) q.lineTo(x, edge(x) + 10 + 4 * Math.sin(x / 70)); q.closePath(); }, K.regolithLit);
    // rover tracks running the whole strip, and a few small craters
    stroke(c, (q) => { for (const y of [942, 956]) { q.moveTo(-20, y); for (let x = -20; x <= P + 20; x += 40) q.lineTo(x, y + 6 * Math.sin((x / P) * TAU * 3)); } }, K.track, 3);
    for (const [x, w] of [[300, 90], [1300, 60], [2200, 120], [3100, 70]]) { F(c, (q) => q.ellipse(x, edge(x) + 34, w * 0.5, w * 0.1, 0, 0, TAU), K.regolithLit); F(c, (q) => q.ellipse(x + 3, edge(x) + 35, w * 0.42, w * 0.07, 0, 0, TAU), K.track); }
    for (const [x, s, seed] of boulders) {
      F(c, (q) => rockShape(q, x, edge(x) - s * 0.35, s, seed), K.boulder);
      F(c, (q) => rockShape(q, x - s * 0.3, edge(x) - s * 0.55, s * 0.45, seed + 1), K.boulderLit);
    }
    // crystal clusters, softly glowing
    for (const [x, s] of crystals) {
      const y = edge(x) + 2;
      alpha(c, 0.16, () => F(c, (q) => q.ellipse(x, y - 14 * s, 46 * s, 26 * s, 0, 0, TAU), K.crystalLit));
      F(c, (q) => { for (const [dx, h, lean] of [[-14, 30, -0.35], [-4, 52, -0.08], [8, 40, 0.22], [18, 24, 0.5], [-24, 18, -0.6]]) { const bx = x + dx * s, tx = bx + Math.sin(lean) * h * s, ty = y - h * s; poly(q, [[bx - 5 * s, y], [bx + 5 * s, y], [tx + 2 * s, ty + 6 * s], [tx, ty], [tx - 3 * s, ty + 6 * s]]); } }, K.crystal);
      F(c, (q) => { for (const [dx, h, lean] of [[-4, 52, -0.08], [8, 40, 0.22]]) { const bx = x + dx * s, tx = bx + Math.sin(lean) * h * s, ty = y - h * s; poly(q, [[bx - 1 * s, y - 4], [bx + 3 * s, y - 4], [tx + 1, ty + 6 * s], [tx, ty]]); } }, K.crystalLit);
    }
    F(c, (q) => { for (let k = 0; k < 500; k++) { const x = (k * 977.31) % P, y = edge(x) + 14 + ((k * 37) % 150); circle(q, x, y, 0.9); } }, K.speck);
  });
  save('regolith', canvas);
  layout.layers.push({ id: 'regolith', repeatWidth: P, repeats: 12 });
}

writeFileSync(join(out, 'layout.json'), JSON.stringify(layout, null, 1));
console.log('wrote', layout.layers.map((l) => l.id).join(', '), '+ sprites', layout.sprites.map((s) => s.id).join(', '));
