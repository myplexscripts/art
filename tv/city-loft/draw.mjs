// Loft Rooftops: an original layered background for the Simple Home Android TV launcher, after the City Loft poster.
// Instead of looking out through the loft's window, the view pans along a row of loft rooftops at blue hour:
// a pergola, plants, laundry and a water tower in front, brick warehouses and an elevated road beyond, then
// mid-town towers, a hazy far skyline with a suspension bridge, and two searchlights sweeping slowly behind it all.
// Each scrolling strip is drawn three times, a strip width apart, so it tiles without a seam, transparent edges
// included.
//
//   npm install --no-save @napi-rs/canvas
//   node tv/city-loft/draw.mjs <out-dir>
// tv/package.py crops, encodes and blurs the layers; tv/verify.mjs checks the result.
import { createRequire } from 'module';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { mulberry, poly, circle, pill, star4, TAU } from '../../live/geom.js';

const require = createRequire(join(process.cwd(), 'noop.js'));
const { createCanvas } = require('@napi-rs/canvas');
const out = process.argv[2] ?? 'loft-rooftops-layers';
mkdirSync(out, { recursive: true });

const W = 1920, H = 1080, LOOP = 360, ROOF = 858;
const K = {
  star: '#e2d9d0', moon: '#efe2c4', earthshine: '#2e2d5c', halo: '#2b2a5a', wisp: '#6a4a72',
  cloudHigh: '#2a2956', cloudLow: '#4f3766', cloudRim: '#8e5a72',
  far: '#4a4277', farShade: '#433b6e', farWin: '#6d6094', farLit: '#b98a68', aviation: '#b94a55', bridge: '#3f3869', bridgeLight: '#d2a874',
  mid: '#2e2b5a', midShade: '#28254f', midRib: '#34316a', midWin: '#3a3768', lit: '#dfa35e', cool: '#8c9cc8', blind: '#b98450', stipple: '#24214a', neon: '#d4708f', neonDark: '#1b1838', board: '#3b3767',
  near: '#211c43', nearShade: '#1c183b', brickLine: '#262049', ghost: '#2a2450', nearWin: '#2d2856', cornice: '#2a2451', road: '#141230', roadEdge: '#2b2651', girder: '#1d1a3c', head: '#e6d8c2', tail: '#b9505c', streetLamp: '#e7c58a', greenhouse: '#365f5c',
  roof: '#141229', coping: '#1c1937', copingJoint: '#141229', course: '#17152e', iron: '#0e0c20', wood: '#2a1f33', pot: '#6b3d42', potRim: '#7e4a4c', leaf: '#2c5f5e', leafDark: '#22494b', ivy: '#1f4544', ivyDeep: '#183536', bulb: '#dcaa66', skylight: '#3a3260', glow: '#b88a5e', door: '#c79458', lantern: '#e5b56c', cloth1: '#5b6a8c', cloth2: '#8a5a62', cloth3: '#b9ab92', cat: '#0b0a1a',
};
const F = (c, build, fill) => { c.beginPath(); build(c); c.fillStyle = fill; c.fill(); };
const stroke = (c, build, ink, width) => { c.beginPath(); build(c); c.strokeStyle = ink; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(); };
const alpha = (c, a, draw) => { c.save(); c.globalAlpha = a; draw(); c.restore(); };
const hash = (i, k = 0) => { let h = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(k + 1, 0xc2b2ae35); h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12; return (h >>> 0) / 4294967296; };
function layer(width) { const canvas = createCanvas(width, H); return { canvas, c: canvas.getContext('2d') }; }
function wrapped(c, width, draw) { for (const dx of [-width, 0, width]) { c.save(); c.translate(dx, 0); draw(); c.restore(); } }
const save = (name, canvas) => writeFileSync(join(out, name + '.png'), canvas.toBuffer('image/png'));
const layout = { name: 'Loft Rooftops', design: { width: W, height: H }, loopSeconds: LOOP, layers: [], sprites: [] };
const leafy = (q, x, y, s, seed, n = 9, spread = 2.4) => { const t = mulberry(seed); for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + (t() - 0.5) * spread, len = s * (0.5 + 0.6 * t()); q.moveTo(x, y); q.ellipse(x + Math.cos(a) * len * 0.55, y + Math.sin(a) * len * 0.55, len * 0.5, len * 0.17, a, 0, TAU); } };

// A tower: body, shaded east face, crown, facade style, and windows of which a share are lit.
// style 0: plain grid; 1: art-deco ribs; 2: glass curtain wall in floor bands.
function tower(c, b, ink) {
  const { x, w, top, base, crown, cell, lit, seed, style = 0 } = b, sh = Math.max(6, w * 0.2), r = mulberry(seed + 3);
  F(c, (q) => {
    q.rect(x, top, w, base - top);
    if (crown === 1) { q.rect(x + w * 0.15, top - w * 0.22, w * 0.7, w * 0.22 + 1); q.rect(x + w * 0.3, top - w * 0.4, w * 0.4, w * 0.18 + 1); }
    if (crown === 2) { q.rect(x + w / 2 - 2, top - 70, 4, 70); poly(q, [[x + w * 0.2, top], [x + w * 0.8, top], [x + w / 2, top - w * 0.45]]); }
    if (crown === 3) { q.rect(x + w * 0.2, top - 26, w * 0.32, 26); poly(q, [[x + w * 0.16, top - 26], [x + w * 0.56, top - 26], [x + w * 0.36, top - 40]]); for (const k of [0.25, 0.42]) q.rect(x + w * k, top - 30, 3, 30); }
    if (crown === 4) { q.rect(x + w * 0.7, top - 46, 3, 46); q.rect(x + w * 0.1, top - 12, w * 0.3, 12); }
  }, ink.body);
  F(c, (q) => q.rect(x + w - sh, top, sh, base - top), ink.shade);
  if (ink.stipple) F(c, (q) => { for (let k = 0; k < (base - top) * 0.25; k++) circle(q, x + w - sh + r() * sh, top + r() * (base - top), 0.9); }, ink.stipple);
  if (ink.aviation && (crown === 2 || crown === 4)) F(c, (q) => circle(q, crown === 2 ? x + w / 2 : x + w * 0.7 + 1.5, crown === 2 ? top - 72 : top - 48, 2.2), ink.aviation);
  const cols = Math.max(1, Math.floor((w - 14) / cell)), x0 = x + (w - cols * cell) / 2;
  if (style === 1 && ink.rib) F(c, (q) => { for (let k = 0; k <= cols; k++) q.rect(x0 + k * cell - 1.5, top + 6, 3, base - top - 6); }, ink.rib);
  if (style === 2 && ink.rib) {
    F(c, (q) => { for (let y = top + 10; y < base; y += cell * 0.9) q.rect(x + 4, y, w - 8, cell * 0.45); }, ink.win);
    alpha(c, 0.55, () => F(c, (q) => { for (let y = top + 10, row = 0; y < base; y += cell * 0.9, row++) if (hash(seed + row, 5) < lit * 1.6) { const a = x + 4 + hash(seed + row, 6) * (w - 30); q.rect(a, y, 16 + hash(seed + row, 7) * (w * 0.4), cell * 0.45); } }, ink.cool));
    return;
  }
  const cellsLit = [];
  for (const [fill, pick] of [[ink.win, (v) => v >= lit], [ink.lit, (v) => v < lit * 0.8], [ink.cool, (v) => v >= lit * 0.8 && v < lit]]) {
    if (!fill) continue;
    F(c, (q) => { for (let row = 0, y = top + cell * 0.8; y < base - cell; row++, y += cell * 1.15) for (let k = 0; k < cols; k++) { const v = hash(seed * 131 + row * 17 + k, 3); if (pick(v)) { q.rect(x0 + k * cell + cell * 0.25, y, cell * 0.5, cell * 0.6); if (fill === ink.lit) cellsLit.push([x0 + k * cell + cell * 0.25, y, v]); } } }, fill);
  }
  // inside some lit offices: drawn blinds or a deeper lamp-lit sill
  if (ink.blind) F(c, (q) => { for (const [wx, wy, v] of cellsLit) { const id = Math.floor(v * 1e6); if (hash(id, 1) < 0.3) for (let j = 1; j < 4; j++) q.rect(wx, wy + (cell * 0.6 * j) / 4, cell * 0.5, 1); else if (hash(id, 2) < 0.25) q.rect(wx, wy + cell * 0.35, cell * 0.5, cell * 0.25); } }, ink.blind);
}
function skyline(seed, P, w0, w1, t0, t1, gap, base, cell, lit, styles = false) {
  const r = mulberry(seed), list = [];
  for (let x = 0; x < P;) { const w = w0 + r() * (w1 - w0); list.push({ x, w, top: t0 + r() * r() * (t1 - t0), base, crown: Math.floor(r() * 5), cell, lit: lit * (0.4 + r()), seed: Math.floor(r() * 1e6), style: styles ? Math.floor(r() * 3) : 0 }); x += w + gap * r(); }
  return list;
}

// ---- sky: stationary and opaque. Blue hour, a dusty-rose horizon, a crescent moon with earthshine, high wisps, and
// stars that thin out under the clock.
{
  const { canvas, c } = layer(W), r = mulberry(5), M = { x: 560, y: 220 };
  // the gradient is computed in floating point and ordered-dithered, so it never bands on a TV panel and stays tiny
  // as a lossless WebP
  const stops = [[0, '#16183a'], [0.26, '#202250'], [0.4, '#2f2c5e'], [0.5, '#4a3768'], [0.58, '#6c4570'], [0.66, '#8f566f'], [1, '#a4676b']];
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const img = c.createImageData(W, H), d = img.data;
  for (let y = 0; y < H; y++) {
    const v = y / (H - 1), k = stops.findIndex(([at]) => at >= v), [a0, c0] = stops[Math.max(0, k - 1)], [a1, c1] = stops[k], u = a1 > a0 ? (v - a0) / (a1 - a0) : 0;
    const col = rgb(c0).map((x, i) => x + (rgb(c1)[i] - x) * u);
    for (let x = 0; x < W; x++) { const i = (y * W + x) * 4, e = BAYER[(y & 3) * 4 + (x & 3)] / 16 - 0.5; d[i] = Math.floor(col[0] + e + 0.5); d[i + 1] = Math.floor(col[1] + e + 0.5); d[i + 2] = Math.floor(col[2] + e + 0.5); d[i + 3] = 255; }
  }
  c.putImageData(img, 0, 0);
  alpha(c, 0.35, () => F(c, (q) => circle(q, M.x, M.y, 160), K.halo)); alpha(c, 0.5, () => F(c, (q) => circle(q, M.x, M.y, 95), K.halo));
  // high wisps low over the horizon, catching the last light
  alpha(c, 0.35, () => stroke(c, (q) => { for (let k = 0; k < 9; k++) { const x = 60 + k * 205 + r() * 60, y = 520 + r() * 70; q.moveTo(x, y); q.quadraticCurveTo(x + 80, y - 6, x + 150 + r() * 60, y + 2); } }, K.wisp, 2.2));
  for (let i = 0; i < 180; i++) {
    const x = r() * W, y = r() * 560, s = r();
    if (Math.hypot(x - M.x, y - M.y) < 110) continue;
    if (x > 1330 && y < 200 && r() < 0.85) continue;
    alpha(c, (0.35 + 0.55 * r()) * (1 - y / 700), () => F(c, (q) => (s > 0.9 ? star4(q, x, y, 4 + 2.5 * r()) : circle(q, x, y, 0.8 + 1.1 * s)), K.star));
  }
  F(c, (q) => circle(q, M.x, M.y, 48), K.earthshine);
  // the crescent: the moon's disc less a second disc set off towards the upper right
  c.save(); c.beginPath(); circle(c, M.x, M.y, 48); c.clip();
  c.beginPath(); c.rect(M.x - 60, M.y - 60, 120, 120); c.arc(M.x + 22, M.y - 14, 44, 0, TAU); c.fillStyle = K.moon; c.fill('evenodd'); c.restore();
  save('sky', canvas);
  layout.layers.push({ id: 'sky', repeatWidth: W, repeats: 0, lossless: true });
}

// ---- searchlight beam: one texture, two sprites on the sky, sweeping slowly behind the skyline
{
  const bw = 240, bh = 900, canvas = createCanvas(bw, bh), c = canvas.getContext('2d'), g = c.createLinearGradient(0, bh, 0, 0);
  g.addColorStop(0, 'rgba(217,200,234,0.16)'); g.addColorStop(0.55, 'rgba(217,200,234,0.08)'); g.addColorStop(1, 'rgba(217,200,234,0)');
  c.fillStyle = g; c.beginPath(); c.moveTo(bw / 2 - 7, bh); c.lineTo(bw / 2 + 7, bh); c.lineTo(bw, 0); c.lineTo(0, 0); c.closePath(); c.fill();
  save('beam', canvas);
  const beam = (id, x, centerDegrees, amplitudeDegrees, cyclesPerLoop, phase) => layout.sprites.push({ id, image: 'beam', parent: 'sky', size: [bw, bh], textureScale: 1, pivot: [0.5, 1], positions: [[x, 800]], motion: { type: 'swing', centerDegrees, amplitudeDegrees, cyclesPerLoop, phase } });
  beam('beam-left', 690, -14, 12, 8, 0); beam('beam-right', 1180, -4, 10, 6, 0.35);
}

// ---- clouds: long thin bars, lit rose underneath near the horizon
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(13), bars = [];
  for (let x = 60; x < P - 200; x += 480 + r() * 520) {
    const y = 250 + r() * 300, w = 200 + r() * 340, low = y >= 420;
    bars.push([x, y, w, 14 + r() * 9, low]);
    if (r() < 0.7) bars.push([x + w * (0.2 + r() * 0.45), y + 20 + r() * 10, w * (0.3 + r() * 0.35), 10 + r() * 5, low]);
  }
  wrapped(c, P, () => {
    F(c, (q) => { for (const [x, y, w, h, low] of bars) if (low) pill(q, x + 8, y + h * 0.45, w - 16, h * 0.7); }, K.cloudRim);
    for (const [x, y, w, h, low] of bars) F(c, (q) => pill(q, x, y, w, h * 0.85), low ? K.cloudLow : K.cloudHigh);
  });
  save('clouds', canvas);
  layout.layers.push({ id: 'clouds', repeatWidth: P, repeats: 1 });
}

// ---- far skyline: hazy towers with aviation lights, and a suspension bridge strung with lights
{
  const P = 3840, { canvas, c } = layer(P), list = skyline(21, P, 44, 120, 600, 400, 26, 900, 13, 0.08);
  wrapped(c, P, () => {
    for (const b of list) tower(c, b, { body: K.far, shade: K.farShade, win: null, lit: K.farLit, cool: K.farWin, aviation: K.aviation });
    // the bridge: two towers, the main cable and its suspenders, a lit deck
    const t1 = 1500, t2 = 2300, deck = 735, tt = 560;
    const cable = (x) => (x < t1 ? deck - ((x - 1150) / (t1 - 1150)) * (deck - tt) : x > t2 ? tt + ((x - t2) / (2650 - t2)) * (deck - tt) : tt + 150 * (1 - ((x - (t1 + t2) / 2) / ((t2 - t1) / 2)) ** 2));
    F(c, (q) => { for (const tx of [t1, t2]) { q.rect(tx - 14, tt - 6, 7, 900 - tt); q.rect(tx + 7, tt - 6, 7, 900 - tt); q.rect(tx - 16, tt + 20, 32, 6); q.rect(tx - 16, tt + 90, 32, 6); } q.rect(1150, deck, 1500, 9); }, K.bridge);
    stroke(c, (q) => { q.moveTo(1150, deck); for (let x = 1150; x <= 2650; x += 10) q.lineTo(x, cable(x)); }, K.bridge, 2.4);
    stroke(c, (q) => { for (let x = 1162; x < 2650; x += 22) { if (Math.abs(x - t1) < 18 || Math.abs(x - t2) < 18) continue; q.moveTo(x, cable(x) + 1); q.lineTo(x, deck); } }, K.bridge, 0.9);
    alpha(c, 0.8, () => F(c, (q) => { for (let x = 1160; x < 2650; x += 26) circle(q, x, deck + 3, 1.6); for (let x = 1180; x < 2650; x += 70) circle(q, x, cable(x), 1.4); }, K.bridgeLight));
    F(c, (q) => { for (const tx of [t1, t2]) circle(q, tx, tt - 9, 2.2); }, K.aviation);
  });
  // atmospheric haze: the lower far city fades into the rose glow
  c.globalCompositeOperation = 'source-atop';
  const g = c.createLinearGradient(0, 600, 0, 900); g.addColorStop(0, 'rgba(143,86,111,0)'); g.addColorStop(1, 'rgba(143,86,111,0.45)');
  c.fillStyle = g; c.fillRect(0, 600, P, 300); c.globalCompositeOperation = 'source-over';
  save('far', canvas);
  layout.layers.push({ id: 'far', repeatWidth: P, repeats: 2 });
}

// ---- mid-town towers: plain grids, art-deco ribs and glass curtain walls; a neon blade sign and a lit billboard
{
  const P = 3840, { canvas, c } = layer(P), list = skyline(31, P, 70, 190, 700, 470, 70, 900, 19, 0.22, true);
  const signAt = list[5], boardAt = list[11];
  wrapped(c, P, () => {
    for (const b of list) tower(c, b, { body: K.mid, shade: K.midShade, win: K.midWin, lit: K.lit, cool: K.cool, stipple: K.stipple, rib: K.midRib, blind: K.blind, aviation: K.aviation });
    // a vertical neon sign hung on the side of one tower, glowing softly
    { const x = signAt.x - 22, y = signAt.top + 60;
      alpha(c, 0.18, () => F(c, (q) => q.roundRect(x - 10, y - 10, 42, 170, 10), K.neon));
      F(c, (q) => { q.rect(x, y, 22, 150); q.rect(x + 22, y + 20, 6, 3); q.rect(x + 22, y + 120, 6, 3); }, K.neonDark);
      F(c, (q) => { for (let k = 0; k < 5; k++) { q.rect(x + 6, y + 10 + k * 28, 10, 3); q.rect(x + 6, y + 10 + k * 28, 3, 18); q.rect(x + 13, y + 10 + k * 28 + (k % 2) * 8, 3, 10); } }, K.neon); }
    // a billboard on a rooftop frame, lit by two lamps
    { const x = boardAt.x + boardAt.w * 0.15, y = boardAt.top - 70, w = 120, h = 50;
      F(c, (q) => { q.rect(x + 10, y + h, 4, 22); q.rect(x + w - 14, y + h, 4, 22); q.rect(x - 2, y - 2, w + 4, h + 4); }, K.neonDark);
      F(c, (q) => q.rect(x, y, w, h), K.board);
      F(c, (q) => { circle(q, x + 34, y + 25, 15); q.rect(x + 60, y + 14, 46, 6); q.rect(x + 60, y + 26, 34, 4); }, K.cloudRim);
      alpha(c, 0.22, () => F(c, (q) => { poly(q, [[x + 20, y - 6], [x + 4, y + 30], [x + 50, y + 30]]); poly(q, [[x + w - 20, y - 6], [x + w - 50, y + 30], [x + w - 4, y + 30]]); }, K.lit));
      F(c, (q) => { q.rect(x + 16, y - 8, 8, 4); q.rect(x + w - 24, y - 8, 8, 4); }, K.neonDark); }
  });
  save('mid', canvas);
  layout.layers.push({ id: 'mid', repeatWidth: P, repeats: 4 });
}

// ---- brick loft warehouses: cornices with dentils, arched factory windows with life inside, fire escapes with
// ladders, water towers, a rooftop greenhouse, a ghost sign; and the elevated road on its girders with lamps and
// light trails
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(41), blocks = [];
  for (let x = 0; x < P;) { const w = 220 + r() * 220; blocks.push({ x, w, top: 650 + r() * 100, seed: Math.floor(r() * 1e6), tank: r() < 0.35, escape: r() < 0.5, ghost: r() < 0.25, greenhouse: r() < 0.15, chimney: r() < 0.5 }); x += w + 6 + r() * 30; }
  const trails = []; for (let x = 0; x < P;) { const len = 40 + r() * 170; trails.push([x, len, r() < 0.5]); x += len + 20 + r() * 90; }
  const waterTower = (q, x, y, s) => { q.rect(x - 22 * s, y - 70 * s, 44 * s, 46 * s); poly(q, [[x - 26 * s, y - 70 * s], [x + 26 * s, y - 70 * s], [x, y - 92 * s]]); for (const k of [-18, -6, 6, 18]) q.rect(x + k * s - 1.5, y - 24 * s, 3, 24 * s); };
  wrapped(c, P, () => {
    for (const b of blocks) {
      const { x, w, top, seed } = b, q0 = mulberry(seed);
      F(c, (q) => q.rect(x, top, w, 900 - top), K.near);
      F(c, (q) => q.rect(x + w - 26, top, 26, 900 - top), K.nearShade);
      // brick: courses and staggered joints, very low contrast
      stroke(c, (q) => { for (let y = top + 14, row = 0; y < 900; y += 12, row++) { q.moveTo(x + 3, y); q.lineTo(x + w - 3, y); for (let bx = x + 6 + (row % 2) * 12; bx < x + w - 4; bx += 24) { q.moveTo(bx, y); q.lineTo(bx, y + 12); } } }, K.brickLine, 1);
      // cornice and dentils
      F(c, (q) => { q.rect(x - 5, top - 8, w + 10, 9); for (let dx = x; dx < x + w - 4; dx += 9) q.rect(dx + 1, top + 1, 5, 5); }, K.cornice);
      if (b.ghost) { const gx = x + 20, gy = top + 20, gw = Math.min(150, w * 0.45); alpha(c, 0.6, () => { F(c, (q) => q.rect(gx, gy, gw, 34), K.ghost); F(c, (q) => { for (let k = 0; k < gw / 14 - 1; k++) q.rect(gx + 6 + k * 14, gy + 7, 8, 20 - (k % 3) * 4); }, K.brickLine); }); }
      // tall arched factory windows: dark, lit, or lit with a pendant lamp or a plant inside
      const n = Math.floor((w - 30) / 46), x0 = x + (w - n * 46) / 2;
      for (let row = 0; row < 3; row++) for (let k = 0; k < n; k++) {
        const wx = x0 + k * 46 + 9, wy = top + 26 + row * 64, on = q0(), what = q0();
        if (wy + 46 > 900 || (b.ghost && row === 0 && k < 3)) continue;
        const fill = on < 0.22 ? K.lit : on < 0.3 ? K.glow : K.nearWin;
        F(c, (q) => { q.moveTo(wx, wy + 46); q.lineTo(wx, wy + 14); q.arc(wx + 14, wy + 14, 14, Math.PI, 0); q.lineTo(wx + 28, wy + 46); q.closePath(); }, fill);
        if (on < 0.3 && what < 0.3) F(c, (q) => { q.rect(wx + 13.5, wy + 2, 1, 16); poly(q, [[wx + 8, wy + 24], [wx + 20, wy + 24], [wx + 14, wy + 17]]); }, K.near);
        else if (on < 0.3 && what < 0.55) F(c, (q) => leafy(q, wx + 7, wy + 46, 14, seed + k + row * 9, 6, 1.8), K.leafDark);
        stroke(c, (q) => { q.moveTo(wx + 14, wy); q.lineTo(wx + 14, wy + 46); q.moveTo(wx, wy + 28); q.lineTo(wx + 28, wy + 28); }, K.near, 2);
        F(c, (q) => q.rect(wx - 3, wy + 46, 34, 3), K.cornice);
      }
      if (b.escape) {
        const ex = x + w * 0.3;
        stroke(c, (q) => { for (let y = top + 70; y < 840; y += 64) { q.moveTo(ex - 40, y); q.lineTo(ex + 40, y); q.moveTo(ex - 40, y); q.lineTo(ex - 40, y - 16); q.moveTo(ex + 40, y); q.lineTo(ex + 40, y - 16); q.moveTo(ex - 40, y - 16); q.lineTo(ex + 40, y - 16); for (let k = -32; k < 40; k += 8) { q.moveTo(ex + k, y); q.lineTo(ex + k, y - 16); } } }, K.iron, 1.4);
        stroke(c, (q) => { for (let y = top + 70; y < 800; y += 64) { q.moveTo(ex - 30, y); q.lineTo(ex + 30, y + 64); for (let k = 1; k < 8; k++) { const u = k / 8; q.moveTo(ex - 30 + 60 * u - 4, y + 64 * u); q.lineTo(ex - 30 + 60 * u + 4, y + 64 * u); } } q.moveTo(ex + 44, top + 70); q.lineTo(ex + 44, 860); q.moveTo(ex + 52, top + 70); q.lineTo(ex + 52, 860); }, K.iron, 1.8);
      }
      if (b.tank) F(c, (q) => waterTower(q, x + w * 0.7, top - 8, 1), K.iron);
      if (b.chimney) F(c, (q) => { q.rect(x + w * 0.12, top - 34, 16, 30); q.rect(x + w * 0.12 - 3, top - 38, 22, 5); }, K.near);
      if (b.greenhouse) { const gx = x + w * 0.45; F(c, (q) => poly(q, [[gx - 40, top - 8], [gx - 40, top - 30], [gx, top - 50], [gx + 40, top - 30], [gx + 40, top - 8]]), K.greenhouse); stroke(c, (q) => { for (let k = -30; k <= 30; k += 15) { q.moveTo(gx + k, top - 8); q.lineTo(gx + k, top - 50 + Math.abs(k) * 0.5); } }, K.iron, 1.4); }
    }
    // the elevated road: girders with X-bracing, piers, lamps, and two streams of light trails
    F(c, (q) => { q.rect(-20, 786, P + 40, 22); for (let x = 60; x < P + 40; x += 240) q.rect(x, 808, 18, 92); }, K.road);
    stroke(c, (q) => { for (let x = 0; x < P; x += 30) { q.moveTo(x, 790); q.lineTo(x + 30, 806); q.moveTo(x + 30, 790); q.lineTo(x, 806); } }, K.girder, 1.2);
    F(c, (q) => q.rect(-20, 786, P + 40, 3), K.roadEdge);
    F(c, (q) => { for (let x = 40; x < P; x += 160) { q.rect(x, 758, 2, 28); q.rect(x, 758, 9, 2); } }, K.road);
    alpha(c, 0.25, () => F(c, (q) => { for (let x = 40; x < P; x += 160) circle(q, x + 8, 762, 7); }, K.streetLamp));
    F(c, (q) => { for (let x = 40; x < P; x += 160) circle(q, x + 8, 761, 1.8); }, K.streetLamp);
    alpha(c, 0.7, () => { for (const [x, len, white] of trails) F(c, (q) => pill(q, x, white ? 794 : 800, len, 3.2), white ? K.head : K.tail); });
  });
  save('lofts', canvas);
  layout.layers.push({ id: 'lofts', repeatWidth: P, repeats: 8 });
}

// ---- the rooftop in front: a quiet brick parapet below; above it a pergola with vines and lights, a café table
// with a lantern, a lounger, planters, a bicycle, a lit stair door, laundry, a telescope, a cat, and a water tower
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(61);
  const plants = []; for (let x = 120; x < P - 60; x += 170 + r() * 330) if (!(x > 880 && x < 1340) && !(x > 2500 && x < 2760)) plants.push([x, r(), Math.floor(r() * 1e6)]);
  const poles = []; for (let x = 300; x < P; x += 420) if (!(x > 1500 && x < 2300) && !(x > 850 && x < 1400)) poles.push(x);
  wrapped(c, P, () => {
    // the big water tower, with its staves, hoops and ladder, and a tall vent stack
    F(c, (q) => {
      const x = 1900, y = ROOF; q.rect(x - 60, y - 250, 120, 92); poly(q, [[x - 66, y - 250], [x + 66, y - 250], [x, y - 296]]); q.rect(x - 64, y - 160, 128, 8);
      for (const k of [-48, -16, 16, 48]) q.rect(x + k - 3, y - 158, 6, 158);
      q.rect(3200, ROOF - 150, 18, 150); q.rect(3194, ROOF - 158, 30, 10);
    }, K.iron);
    stroke(c, (q) => { const x = 1900; for (const yy of [-228, -200, -174]) { q.moveTo(x - 60, ROOF + yy); q.lineTo(x + 60, ROOF + yy); } }, K.wood, 2);
    stroke(c, (q) => { const x = 1900; q.moveTo(x - 48, ROOF - 120); q.lineTo(x + 16, ROOF - 40); q.moveTo(x + 48, ROOF - 120); q.lineTo(x - 16, ROOF - 40); q.moveTo(x - 50, ROOF - 120); q.lineTo(x + 50, ROOF - 120); for (let y = ROOF - 150; y < ROOF; y += 10) { q.moveTo(x + 56, y); q.lineTo(x + 64, y); } q.moveTo(x + 56, ROOF - 158); q.lineTo(x + 56, ROOF); q.moveTo(x + 64, ROOF - 158); q.lineTo(x + 64, ROOF); }, K.iron, 2.2);
    // a pergola strung with lights and climbing vines, a café table and chairs, a lantern
    { const x0 = 900, x1 = 1330, y = ROOF - 120;
      F(c, (q) => { for (const px of [x0, x0 + 145, x0 + 290, x1]) q.rect(px - 4, y, 8, 120); q.rect(x0 - 14, y - 8, x1 - x0 + 28, 9); for (let bx = x0 - 6; bx < x1 + 10; bx += 26) q.rect(bx, y - 14, 5, 7); }, K.wood);
      F(c, (q) => { for (let k = 0; k < 7; k++) leafy(q, x0 + 30 + k * 60, y + 2, 24, 900 + k, 10, 3.6); for (const px of [x0, x1]) for (let k = 0; k < 4; k++) leafy(q, px + 6, y + 30 + k * 22, 14, 950 + k + px, 5, 2); }, K.ivy);
      F(c, (q) => { for (let k = 0; k < 6; k++) leafy(q, x0 + 60 + k * 55, y, 16, 960 + k, 6, 3); }, K.leaf);
      F(c, (q) => { for (let bx = x0 + 10; bx < x1; bx += 24) circle(q, bx, y + 14 + 6 * Math.sin((bx - x0) / 35), 2.4); }, K.bulb);
      const tx = 1110;
      F(c, (q) => { q.rect(tx - 34, ROOF - 44, 68, 5); q.rect(tx - 2, ROOF - 40, 4, 40); q.rect(tx - 16, ROOF - 3, 32, 3); for (const sx of [-64, 64]) { q.rect(tx + sx - 12, ROOF - 30, 24, 4); q.rect(tx + sx + (sx < 0 ? -12 : 9), ROOF - 62, 3, 62); q.rect(tx + sx - 10, ROOF - 30, 2, 30); q.rect(tx + sx + 8, ROOF - 30, 2, 30); } }, K.iron);
      alpha(c, 0.25, () => F(c, (q) => circle(q, tx + 6, ROOF - 58, 16), K.lantern));
      F(c, (q) => { q.rect(tx, ROOF - 62, 12, 18); poly(q, [[tx - 1, ROOF - 62], [tx + 13, ROOF - 62], [tx + 6, ROOF - 70]]); }, K.iron);
      F(c, (q) => q.rect(tx + 2.5, ROOF - 59, 7, 12), K.lantern); }
    // the stair bulkhead with its door open on a lit stairwell
    { const x = 2560;
      F(c, (q) => { q.rect(x, ROOF - 110, 120, 110); q.rect(x - 6, ROOF - 116, 132, 8); }, K.iron);
      F(c, (q) => q.rect(x + 20, ROOF - 82, 40, 82), K.door);
      F(c, (q) => { poly(q, [[x + 60, ROOF - 82], [x + 74, ROOF - 86], [x + 74, ROOF + 2], [x + 60, ROOF]]); q.rect(x + 28, ROOF - 70, 2, 70); }, K.wood);
      F(c, (q) => q.rect(x + 34, ROOF - 98, 12, 8), K.lantern);
      F(c, (q) => { q.rect(x + 82, ROOF - 70, 26, 22); q.rect(x + 86, ROOF - 76, 18, 6); }, K.wood); }
    // a laundry line with shirts and towels
    { const a = 2780, b = 3060, y = ROOF - 96, sag = (x) => y + 18 * Math.sin((Math.PI * (x - a)) / (b - a));
      F(c, (q) => { q.rect(a - 3, y, 5, 96); q.rect(b - 2, y, 5, 96); }, K.iron);
      stroke(c, (q) => { q.moveTo(a, y); for (let x = a; x <= b; x += 10) q.lineTo(x, sag(x)); }, K.iron, 1.2);
      for (const [x, w, h, ink, shirt] of [[2810, 34, 40, K.cloth1, true], [2858, 24, 46, K.cloth3, false], [2900, 34, 38, K.cloth2, true], [2950, 40, 30, K.cloth3, false], [3004, 22, 36, K.cloth1, false]]) {
        const y0 = sag(x + w / 2);
        F(c, (q) => { if (shirt) poly(q, [[x, y0], [x + w, y0], [x + w + 8, y0 + 12], [x + w - 2, y0 + 16], [x + w - 4, y0 + h], [x + 4, y0 + h], [x + 2, y0 + 16], [x - 8, y0 + 12]]); else q.rect(x, y0, w, h); }, ink);
        F(c, (q) => { q.rect(x + 3, y0 - 3, 3, 6); q.rect(x + w - 6, y0 - 3, 3, 6); }, K.wood);
      } }
    // a telescope on its tripod, a lounger, planters with stakes, a bicycle against the parapet, and the cat
    stroke(c, (q) => { const x = 3420, y = ROOF; q.moveTo(x, y - 54); q.lineTo(x - 18, y); q.moveTo(x, y - 54); q.lineTo(x + 16, y); q.moveTo(x, y - 54); q.lineTo(x + 2, y); }, K.iron, 2.4);
    F(c, (q) => { const x = 3420, y = ROOF - 56; poly(q, [[x - 30, y + 10], [x + 28, y - 18], [x + 32, y - 10], [x - 26, y + 18]]); }, K.iron);
    F(c, (q) => { const x = 360; poly(q, [[x, ROOF - 18], [x + 90, ROOF - 18], [x + 120, ROOF - 44], [x + 126, ROOF - 40], [x + 96, ROOF - 12], [x, ROOF - 12]]); q.rect(x + 6, ROOF - 12, 4, 12); q.rect(x + 86, ROOF - 12, 4, 12); }, K.wood);
    for (const x of [1460, 3600]) {
      F(c, (q) => q.rect(x, ROOF - 30, 120, 30), K.wood);
      F(c, (q) => { for (let k = 0; k < 5; k++) leafy(q, x + 14 + k * 23, ROOF - 30, 26 + (k % 2) * 10, x + k, 7, 1.6); }, K.leaf);
      stroke(c, (q) => { for (let k = 0; k < 4; k++) { q.moveTo(x + 24 + k * 26, ROOF - 30); q.lineTo(x + 24 + k * 26, ROOF - 78); } }, K.wood, 2);
      F(c, (q) => { for (let k = 0; k < 7; k++) circle(q, x + 20 + k * 14, ROOF - 50 - (k % 3) * 6, 2.6); }, K.cloth2);
    }
    stroke(c, (q) => { const x = 2200, y = ROOF - 14; q.moveTo(x + 14, y); q.arc(x, y, 14, 0, TAU); q.moveTo(x + 64, y); q.arc(x + 50, y, 14, 0, TAU); q.moveTo(x, y); q.lineTo(x + 20, y - 26); q.lineTo(x + 44, y - 26); q.lineTo(x + 50, y); q.moveTo(x + 20, y - 26); q.lineTo(x + 26, y); q.lineTo(x + 50, y); q.moveTo(x + 26, y); q.lineTo(x + 18, y - 32); q.moveTo(x + 12, y - 32); q.lineTo(x + 24, y - 32); q.moveTo(x + 44, y - 26); q.lineTo(x + 46, y - 36); q.lineTo(x + 54, y - 38); }, K.iron, 2.2);
    F(c, (q) => { const x = 760, y = ROOF - 4; q.ellipse(x, y - 12, 11, 12, 0, 0, TAU); circle(q, x + 2, y - 30, 7); poly(q, [[x - 4, y - 35], [x - 2, y - 43], [x + 2, y - 36]]); poly(q, [[x + 4, y - 36], [x + 8, y - 43], [x + 9, y - 34]]); q.moveTo(x - 8, y); q.quadraticCurveTo(x - 30, y - 2, x - 26, y - 20); q.lineTo(x - 23, y - 19); q.quadraticCurveTo(x - 26, y - 4, x - 6, y - 3); q.closePath(); }, K.cat);
    // string lights between poles, AC units and turbine vents
    F(c, (q) => { for (const x of poles) q.rect(x - 2.5, ROOF - 120, 5, 120); }, K.iron);
    for (let i = 1; i < poles.length; i++) {
      const a = poles[i - 1], b = poles[i]; if (b - a > 430) continue;
      stroke(c, (q) => { q.moveTo(a, ROOF - 116); q.quadraticCurveTo((a + b) / 2, ROOF - 70, b, ROOF - 116); }, K.iron, 1.4);
      F(c, (q) => { for (let k = 1; k < 18; k++) { const u = k / 18, x = a + (b - a) * u, y = (1 - u) * (1 - u) * (ROOF - 116) + 2 * u * (1 - u) * (ROOF - 70) + u * u * (ROOF - 116); circle(q, x, y + 4, 2.6); } }, K.bulb);
    }
    F(c, (q) => { for (const x of [3300, 470]) q.rect(x, ROOF - 34, 54, 34); for (const x of [3360, 3140]) { q.rect(x - 2, ROOF - 22, 4, 22); q.ellipse(x, ROOF - 30, 11, 10, 0, 0, TAU); } }, K.iron);
    stroke(c, (q) => { for (const x of [3300, 470]) for (let k = 1; k < 6; k++) { q.moveTo(x + k * 9, ROOF - 30); q.lineTo(x + k * 9, ROOF - 6); } for (const x of [3360, 3140]) for (let k = -2; k <= 2; k++) { q.moveTo(x + k * 4, ROOF - 39); q.lineTo(x + k * 4, ROOF - 21); } }, K.wood, 1.4);
    // skylights, two glowing from the loft below
    for (const [x, lit] of [[700, true], [3500, true], [150, false]]) {
      F(c, (q) => poly(q, [[x - 60, ROOF], [x - 48, ROOF - 34], [x + 48, ROOF - 34], [x + 60, ROOF]]), K.iron);
      F(c, (q) => poly(q, [[x - 50, ROOF - 4], [x - 42, ROOF - 30], [x + 42, ROOF - 30], [x + 50, ROOF - 4]]), lit ? K.glow : K.skylight);
      stroke(c, (q) => { for (const k of [-16, 16]) { q.moveTo(x + k, ROOF - 30); q.lineTo(x + k * 1.2, ROOF - 4); } }, K.iron, 2);
    }
    // potted plants
    for (const [x, k, seed] of plants) {
      const s = 34 + k * 46, pw = 18 + k * 18, ph = 16 + k * 16;
      F(c, (q) => leafy(q, x, ROOF - ph, s, seed), K.leafDark);
      F(c, (q) => leafy(q, x + 3, ROOF - ph - 2, s * 0.8, seed + 1), K.leaf);
      F(c, (q) => poly(q, [[x - pw / 2, ROOF - ph], [x + pw / 2, ROOF - ph], [x + pw * 0.38, ROOF], [x - pw * 0.38, ROOF]]), K.pot);
      F(c, (q) => q.rect(x - pw / 2 - 2, ROOF - ph - 4, pw + 4, 5), K.potRim);
    }
    // parapet: coping stones, then a quiet brick wall to the bottom of the screen, with ivy spilling over in places
    F(c, (q) => q.rect(-20, ROOF, P + 40, H - ROOF), K.roof);
    F(c, (q) => q.rect(-20, ROOF - 4, P + 40, 12), K.coping);
    stroke(c, (q) => { for (let x = 0; x < P; x += 64) { q.moveTo(x, ROOF - 4); q.lineTo(x, ROOF + 8); } }, K.copingJoint, 1.4);
    stroke(c, (q) => { for (let y = ROOF + 26, row = 0; y < H; y += 20, row++) { q.moveTo(-20, y); q.lineTo(P + 20, y); for (let x = (row % 2) * 24; x < P; x += 48) { q.moveTo(x, y); q.lineTo(x, y + 20); } } }, K.course, 1);
    F(c, (q) => { for (const x of [600, 1700, 2900]) q.rect(x, ROOF + 10, 26, 8); }, K.iron);
    // ivy hangs over the coping in a few short strands, dark and quiet
    for (const x0 of [280, 1520, 3100]) {
      const t = mulberry(x0), strands = Array.from({ length: 7 }, (_, k) => [x0 + k * 22 + t() * 10, 18 + t() * 30, (t() - 0.5) * 10]);
      stroke(c, (q) => { for (const [x, len, sway] of strands) { q.moveTo(x, ROOF + 4); q.quadraticCurveTo(x + sway, ROOF + len * 0.6, x + sway * 0.6, ROOF + len); } }, K.ivyDeep, 1.2);
      F(c, (q) => { for (const [x, len, sway] of strands) for (let u = 0.15; u <= 1; u += 0.22) { const lx = x + sway * u, ly = ROOF + 4 + len * u, a = (u * 7) % 2 > 1 ? 0.6 : -0.6; q.moveTo(lx + 5 * Math.cos(a), ly + 5 * Math.sin(a)); q.ellipse(lx, ly, 5, 2.8, a, 0, TAU); } }, K.ivyDeep);
      F(c, (q) => { for (let k = 0; k < 12; k++) { const x = x0 - 6 + k * 14, a = (k % 2 ? 0.5 : -0.5); q.moveTo(x + 6, ROOF); q.ellipse(x, ROOF, 6, 3.2, a, 0, TAU); } }, K.ivy);
    }
  });
  save('rooftop', canvas);
  layout.layers.push({ id: 'rooftop', repeatWidth: P, repeats: 12 });
}

writeFileSync(join(out, 'layout.json'), JSON.stringify(layout, null, 1));
console.log('wrote', layout.layers.map((l) => l.id).join(', '), '+ sprites', layout.sprites.map((s) => s.id).join(', '));
