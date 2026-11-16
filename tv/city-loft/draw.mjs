// Loft Rooftops: an original layered background for the Simple Home Android TV launcher, after the City Loft poster.
// Instead of looking out through the loft's window, the view pans along a row of loft rooftops at blue hour:
// potted plants, string lights and a water tower in front, brick warehouses and an elevated road beyond, then
// mid-town towers, a hazy far skyline and two searchlights sweeping slowly behind it all.
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
  star: '#e2d9d0', moon: '#efe2c4', halo: '#2b2a5a',
  cloudHigh: '#2a2956', cloudLow: '#5a3c6b',
  far: '#4a4277', farShade: '#433b6e', farWin: '#6d6094', farLit: '#b98a68',
  mid: '#2e2b5a', midShade: '#28254f', midWin: '#3a3768', lit: '#dfa35e', cool: '#8c9cc8', stipple: '#24214a',
  near: '#211c43', nearShade: '#1c183b', brickLine: '#262049', nearWin: '#2d2856', road: '#141230', roadEdge: '#2b2651', head: '#e6d8c2', tail: '#b9505c',
  roof: '#141229', coping: '#1c1937', course: '#17152e', iron: '#0e0c20', pot: '#6b3d42', potRim: '#7e4a4c', leaf: '#2c5f5e', leafDark: '#22494b', bulb: '#dcaa66', skylight: '#3a3260', glow: '#b88a5e', beam: '#d9c8ea',
};
const F = (c, build, fill) => { c.beginPath(); build(c); c.fillStyle = fill; c.fill(); };
const stroke = (c, build, ink, width) => { c.beginPath(); build(c); c.strokeStyle = ink; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(); };
const hash = (i, k = 0) => { let h = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(k + 1, 0xc2b2ae35); h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12; return (h >>> 0) / 4294967296; };
function layer(width) { const canvas = createCanvas(width, H); return { canvas, c: canvas.getContext('2d') }; }
function wrapped(c, width, draw) { for (const dx of [-width, 0, width]) { c.save(); c.translate(dx, 0); draw(); c.restore(); } }
const save = (name, canvas) => writeFileSync(join(out, name + '.png'), canvas.toBuffer('image/png'));
const layout = { name: 'Loft Rooftops', design: { width: W, height: H }, loopSeconds: LOOP, layers: [], sprites: [] };

// A tower: body, a shaded east face, a crown, and a grid of windows of which a share are lit.
function tower(c, b, ink) {
  const { x, w, top, base, crown, cell, lit, seed } = b, sh = Math.max(6, w * 0.2);
  F(c, (q) => {
    q.rect(x, top, w, base - top);
    if (crown === 1) { q.rect(x + w * 0.15, top - w * 0.22, w * 0.7, w * 0.22 + 1); q.rect(x + w * 0.3, top - w * 0.4, w * 0.4, w * 0.18 + 1); }
    if (crown === 2) { q.rect(x + w / 2 - 2, top - 70, 4, 70); poly(q, [[x + w * 0.2, top], [x + w * 0.8, top], [x + w / 2, top - w * 0.45]]); }
    if (crown === 3) { q.rect(x + w * 0.2, top - 26, w * 0.32, 26); poly(q, [[x + w * 0.16, top - 26], [x + w * 0.56, top - 26], [x + w * 0.36, top - 40]]); q.rect(x + w * 0.25, top, 3, -4); }
    if (crown === 4) { q.rect(x + w * 0.7, top - 46, 3, 46); }
  }, ink.body);
  F(c, (q) => q.rect(x + w - sh, top, sh, base - top), ink.shade);
  if (ink.stipple) F(c, (q) => { const r = mulberry(seed + 9); for (let k = 0; k < (base - top) * 0.25; k++) circle(q, x + w - sh + r() * sh, top + r() * (base - top), 0.9); }, ink.stipple);
  const cols = Math.max(1, Math.floor((w - 14) / cell)), x0 = x + (w - cols * cell) / 2;
  for (const [fill, pick] of [[ink.win, (v) => v >= lit], [ink.lit, (v) => v < lit * 0.8], [ink.cool, (v) => v >= lit * 0.8 && v < lit]]) {
    if (!fill) continue;
    F(c, (q) => { for (let row = 0, y = top + cell * 0.8; y < base - cell; row++, y += cell * 1.15) for (let k = 0; k < cols; k++) if (pick(hash(seed * 131 + row * 17 + k, 3))) q.rect(x0 + k * cell + cell * 0.25, y, cell * 0.5, cell * 0.6); }, fill);
  }
}
function skyline(seed, P, w0, w1, t0, t1, gap, base, cell, lit) {
  const r = mulberry(seed), list = [];
  for (let x = 0; x < P;) { const w = w0 + r() * (w1 - w0); list.push({ x, w, top: t0 + r() * r() * (t1 - t0), base, crown: Math.floor(r() * 5), cell, lit: lit * (0.4 + r()), seed: Math.floor(r() * 1e6) }); x += w + gap * r(); }
  return list;
}

// ---- sky: stationary and opaque. Blue hour, a dusty-rose horizon, a crescent moon, stars that thin out under the clock.
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
  c.globalAlpha = 0.35; F(c, (q) => circle(q, M.x, M.y, 160), K.halo); c.globalAlpha = 0.5; F(c, (q) => circle(q, M.x, M.y, 95), K.halo); c.globalAlpha = 1;
  for (let i = 0; i < 110; i++) {
    const x = r() * W, y = r() * 560, s = r();
    if (Math.hypot(x - M.x, y - M.y) < 110) continue;
    if (x > 1330 && y < 200 && r() < 0.85) continue;
    c.globalAlpha = (0.35 + 0.55 * r()) * (1 - y / 700);
    F(c, (q) => (s > 0.9 ? star4(q, x, y, 4 + 2.5 * r()) : circle(q, x, y, 0.8 + 1.1 * s)), K.star);
  }
  c.globalAlpha = 1;
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

// ---- clouds: long thin bars, rose-lit underneath near the horizon
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(13), bars = [];
  for (let x = 60; x < P - 200; x += 480 + r() * 520) {
    const y = 250 + r() * 300, w = 200 + r() * 340, col = y < 420 ? K.cloudHigh : K.cloudLow;
    bars.push([x, y, w, 14 + r() * 9, col]);
    if (r() < 0.7) bars.push([x + w * (0.2 + r() * 0.45), y + 20 + r() * 10, w * (0.3 + r() * 0.35), 10 + r() * 5, col]);
  }
  wrapped(c, P, () => { for (const [x, y, w, h, col] of bars) F(c, (q) => pill(q, x, y, w, h), col); });
  save('clouds', canvas);
  layout.layers.push({ id: 'clouds', repeatWidth: P, repeats: 1 });
}

// ---- far skyline: hazy, a few dim windows
{
  const P = 3840, { canvas, c } = layer(P), list = skyline(21, P, 44, 120, 600, 400, 26, 900, 13, 0.08);
  wrapped(c, P, () => { for (const b of list) tower(c, b, { body: K.far, shade: K.farShade, win: null, lit: K.farLit, cool: K.farWin }); });
  save('far', canvas);
  layout.layers.push({ id: 'far', repeatWidth: P, repeats: 2 });
}

// ---- mid-town towers: stepped crowns, spires, lit offices
{
  const P = 3840, { canvas, c } = layer(P), list = skyline(31, P, 70, 190, 700, 470, 70, 900, 19, 0.22);
  wrapped(c, P, () => { for (const b of list) tower(c, b, { body: K.mid, shade: K.midShade, win: K.midWin, lit: K.lit, cool: K.cool, stipple: K.stipple }); });
  save('mid', canvas);
  layout.layers.push({ id: 'mid', repeatWidth: P, repeats: 4 });
}

// ---- brick loft warehouses, fire escapes and water towers, and the elevated road carrying its light trails
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(41), blocks = [];
  for (let x = 0; x < P;) { const w = 220 + r() * 220; blocks.push({ x, w, top: 650 + r() * 100, seed: Math.floor(r() * 1e6), tank: r() < 0.35, escape: r() < 0.5 }); x += w + 6 + r() * 30; }
  const trails = []; for (let x = 0; x < P;) { const len = 40 + r() * 170; trails.push([x, len, r() < 0.5]); x += len + 20 + r() * 90; }
  const waterTower = (q, x, y, s) => { q.rect(x - 22 * s, y - 70 * s, 44 * s, 46 * s); poly(q, [[x - 26 * s, y - 70 * s], [x + 26 * s, y - 70 * s], [x, y - 92 * s]]); for (const k of [-18, -6, 6, 18]) q.rect(x + k * s - 1.5, y - 24 * s, 3, 24 * s); };
  wrapped(c, P, () => {
    for (const b of blocks) {
      const { x, w, top, seed } = b, q0 = mulberry(seed);
      F(c, (q) => { q.rect(x, top, w, 900 - top); q.rect(x - 4, top - 6, w + 8, 8); }, K.near);
      F(c, (q) => q.rect(x + w - 26, top, 26, 900 - top), K.nearShade);
      stroke(c, (q) => { for (let y = top + 14; y < 900; y += 12) { q.moveTo(x + 3, y); q.lineTo(x + w - 3, y); } }, K.brickLine, 1);
      // tall arched factory windows, a few lit
      const n = Math.floor((w - 30) / 46), x0 = x + (w - n * 46) / 2;
      for (let row = 0; row < 3; row++) for (let k = 0; k < n; k++) {
        const wx = x0 + k * 46 + 9, wy = top + 26 + row * 64, on = q0();
        if (wy + 46 > 900) continue;
        F(c, (q) => { q.moveTo(wx, wy + 46); q.lineTo(wx, wy + 14); q.arc(wx + 14, wy + 14, 14, Math.PI, 0); q.lineTo(wx + 28, wy + 46); q.closePath(); }, on < 0.22 ? K.lit : on < 0.3 ? K.glow : K.nearWin);
        stroke(c, (q) => { q.moveTo(wx + 14, wy); q.lineTo(wx + 14, wy + 46); q.moveTo(wx, wy + 28); q.lineTo(wx + 28, wy + 28); }, K.near, 2);
      }
      if (b.escape) stroke(c, (q) => { const ex = x + w * 0.3; for (let y = top + 70; y < 840; y += 64) { q.moveTo(ex - 40, y); q.lineTo(ex + 40, y); q.moveTo(ex - 40, y); q.lineTo(ex - 40, y - 16); q.moveTo(ex + 40, y); q.lineTo(ex + 40, y - 16); q.moveTo(ex - 40, y - 16); q.lineTo(ex + 40, y - 16); q.moveTo(ex - 32, y); q.lineTo(ex + 32, y + 64); } }, K.iron, 2.2);
      if (b.tank) F(c, (q) => waterTower(q, x + w * 0.7, top - 4, 1), K.iron);
    }
    // the elevated road
    F(c, (q) => { q.rect(-20, 786, P + 40, 22); for (let x = 60; x < P + 40; x += 240) q.rect(x, 808, 18, 92); }, K.road);
    F(c, (q) => q.rect(-20, 786, P + 40, 3), K.roadEdge);
    c.globalAlpha = 0.7;
    for (const [x, len, white] of trails) F(c, (q) => pill(q, x, white ? 794 : 800, len, 3.2), white ? K.head : K.tail);
    c.globalAlpha = 1;
  });
  save('lofts', canvas);
  layout.layers.push({ id: 'lofts', repeatWidth: P, repeats: 8 });
}

// ---- the rooftop in front: a quiet brick parapet below, plants, string lights, skylights and a water tower above
{
  const P = 3840, { canvas, c } = layer(P), r = mulberry(61);
  const plants = []; for (let x = 120; x < P - 60; x += 150 + r() * 330) plants.push([x, r(), Math.floor(r() * 1e6)]);
  const poles = []; for (let x = 300; x < P; x += 420) if (!(x > 1500 && x < 2300)) poles.push(x);
  const leafy = (q, x, y, s, seed) => { const t = mulberry(seed); for (let k = 0; k < 9; k++) { const a = -Math.PI / 2 + (t() - 0.5) * 2.4, len = s * (0.5 + 0.6 * t()); q.moveTo(x, y); q.ellipse(x + Math.cos(a) * len * 0.55, y + Math.sin(a) * len * 0.55, len * 0.5, len * 0.17, a, 0, TAU); } };
  wrapped(c, P, () => {
    // the big water tower and a tall vent stack, behind everything else on this roof
    F(c, (q) => {
      const x = 1900, y = ROOF; q.rect(x - 60, y - 250, 120, 92); poly(q, [[x - 66, y - 250], [x + 66, y - 250], [x, y - 296]]); q.rect(x - 64, y - 160, 128, 8);
      for (const k of [-48, -16, 16, 48]) q.rect(x + k - 3, y - 158, 6, 158);
      q.rect(3200, ROOF - 150, 18, 150); q.rect(3194, ROOF - 158, 30, 10);
    }, K.iron);
    stroke(c, (q) => { const x = 1900; q.moveTo(x - 48, ROOF - 120); q.lineTo(x + 16, ROOF - 40); q.moveTo(x + 48, ROOF - 120); q.lineTo(x - 16, ROOF - 40); q.moveTo(x - 50, ROOF - 120); q.lineTo(x + 50, ROOF - 120); }, K.iron, 3);
    // string lights between poles
    F(c, (q) => { for (const x of poles) q.rect(x - 2.5, ROOF - 120, 5, 120); }, K.iron);
    for (let i = 1; i < poles.length; i++) {
      const a = poles[i - 1], b = poles[i]; if (b - a > 430) continue;
      stroke(c, (q) => { q.moveTo(a, ROOF - 116); q.quadraticCurveTo((a + b) / 2, ROOF - 70, b, ROOF - 116); }, K.iron, 1.4);
      F(c, (q) => { for (let k = 1; k < 18; k++) { const u = k / 18, x = a + (b - a) * u, y = (1 - u) * (1 - u) * (ROOF - 116) + 2 * u * (1 - u) * (ROOF - 70) + u * u * (ROOF - 116); circle(q, x, y + 4, 2.6); } }, K.bulb);
    }
    // skylights, one glowing from the loft below
    for (const [x, lit] of [[700, true], [2650, false], [3500, true]]) {
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
    // parapet: coping, then plain brick down to the bottom of the screen
    F(c, (q) => q.rect(-20, ROOF, P + 40, H - ROOF), K.roof);
    F(c, (q) => q.rect(-20, ROOF - 4, P + 40, 12), K.coping);
    stroke(c, (q) => { for (let y = ROOF + 26; y < H; y += 20) { q.moveTo(-20, y); q.lineTo(P + 20, y); } }, K.course, 1);
  });
  save('rooftop', canvas);
  layout.layers.push({ id: 'rooftop', repeatWidth: P, repeats: 12 });
}

writeFileSync(join(out, 'layout.json'), JSON.stringify(layout, null, 1));
console.log('wrote', layout.layers.map((l) => l.id).join(', '), '+ sprites', layout.sprites.map((s) => s.id).join(', '));
