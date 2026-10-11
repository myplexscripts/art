// Nocturne Series No. 07: Northern Lights. Curtains of light hang over a frozen lake and are doubled in it; a cabin
// with one lit window sits on the near bank between the pines. The curtains are built from upright rays whose
// heights come from noise that drifts, so they ripple and fold without ever repeating.
import { mulberry, clamp, osc, sway, noise1, frac, poly, circle, pill, TAU } from './geom.js?v=20261011-dreamscapes';
import { C, F } from './kit.js?v=20261011-dreamscapes';
import { hash, makeStars, paintStars, meteor, pine } from './bits.js?v=20261011-dreamscapes';

export const title = 'NORTHERN LIGHTS', no = 'No. 07', text = '#0c2038', dark = '#060d1c';
const A = { sky: '#0a1430', violet: '#3b3476', g1: '#17666a', g2: '#2aa585', g3: '#93e6b4', far: '#3d7c98', rock: '#1b3f66', rock2: '#122c4e', wood: '#0a1a33', lake: '#0d2140', snow: '#a8cdd6', shade: '#6fa5b9', ink: '#060d1c', smoke: '#31557a' };
const nR = noise1(211), nE = noise1(223), nM = noise1(239), nS = noise1(251);
// curtains, back to front: [bottom edge as a share of the sky, height as a share of the sky, seed]
const CURTAINS = [[0.34, 0.3, 1], [0.56, 0.36, 2], [0.8, 0.3, 3]];

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall, r = mulberry(91);
  const GY = Math.round(H * (0.68 - 0.04 * tall));            // the lake's far shore
  const STARS = makeStars(31, 190, W, GY * 0.95);
  const m1 = (x) => GY - H * 0.04 - H * 0.17 * Math.pow(Math.abs(nM(x / 330 + 3)), 0.8) - 8 * nM(x / 40);
  const m2 = (x) => GY - H * 0.015 - H * 0.09 * Math.pow(Math.abs(nM(x / 240 + 40)), 0.9) - 6 * nM(x / 33 + 9);
  const snowY = (x) => H * 0.9 - H * 0.075 * Math.sin(clamp(x / W) * Math.PI * 0.5) ** 2 + 12 * nS(x / 210) - 40 * tall;
  const cabin = { x: W * (0.7 - 0.12 * tall), s: big };
  const PINES = [[-0.01, 0.6, 5], [0.07, 0.44, 4], [0.14, 0.3, 4], [0.9, 0.36, 4], [0.985, 0.62, 5]].map(([fx, fh, c], i) => ({ x: fx * W, h: fh * H * (0.8 + 0.2 * big), c, ph: i * 0.23 }));
  const FLAKES = Array.from({ length: Math.round(46 + W / 40) }, () => ({ x: r() * W, y: r() * H, v: 24 + r() * 44, d: 6 + r() * 16, f: 0.2 + r() * 0.5, ph: r(), r: 1.6 + r() * 3 }));
  return { W, H, GY, tall, big, STARS, m1, m2, snowY, cabin, PINES, FLAKES };
}

// One curtain as four fills of upright rays, dimmest and tallest first. flip > 0 paints its double in the lake instead,
// squashed to that share of its height.
function curtain(ctx, G, t, [fy, fh, k], flip = 0) {
  const { W, GY } = G, step = 12, base = GY * fy, tallest = GY * fh;
  const rays = [];
  for (let x = -6; x <= W + 6; x += step) {
    const yb = base + GY * 0.07 * Math.sin(x / 310 + t * 0.05 + k * 2) + GY * 0.035 * Math.sin(x / 130 - t * 0.08 + k);
    const on = clamp((nE(x / 620 + t * 0.018 + k * 31) + 0.42) * 2.4), h = tallest * on * (0.4 + 0.6 * (0.5 + 0.5 * nR(x / 85 + t * 0.14 + k * 17))) * (0.85 + 0.15 * Math.sin(x / 23 + t * 0.9 + k));
    if (h > 4) rays.push([x, yb, h]);
  }
  const tones = flip ? [[1, A.g1], [0.5, A.g2]] : [[1.22, A.violet], [1, A.g1], [0.56, A.g2], [0.2, A.g3]];
  for (const [share, fill] of tones) F(ctx, (c) => { for (const [x, yb, h] of rays) { if (flip) c.rect(x, GY + (GY - yb) * flip, step - 3, h * share * flip); else c.rect(x, yb - h * share, step - 3, h * share); } }, fill);
}

export function paint(ctx, p, t, G) {
  const { W, H, GY, big } = G;
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  ctx.fillStyle = A.sky; ctx.fillRect(0, 0, W, H);
  paintStars(ctx, G.STARS, p);
  meteor(ctx, t, W, GY * 0.6, 17, 5);
  for (const cu of CURTAINS) curtain(ctx, G, t, cu);

  // two ranges, each with a moonless rim of snow along its top
  const range = (top, rim, body, drop) => {
    F(ctx, (c) => { c.moveTo(-60, GY + 4); for (let x = -60; x <= W + 60; x += 8) c.lineTo(x, top(x)); c.lineTo(W + 60, GY + 4); c.closePath(); }, rim);
    F(ctx, (c) => { c.moveTo(-60, GY + 4); for (let x = -60; x <= W + 60; x += 8) c.lineTo(x, Math.min(GY + 4, top(x) + drop * (0.5 + Math.abs(nM(x / 26 + drop))))); c.lineTo(W + 60, GY + 4); c.closePath(); }, body);
  };
  layer(0.08, () => range(G.m1, A.far, A.rock, 20));
  layer(0.14, () => range(G.m2, A.shade, A.rock2, 14));
  layer(0.2, () => F(ctx, (c) => { for (let x = -60; x <= W + 60; x += 22) pine(c, x + 8 * hash(x, 1), GY + 3, 26 + 34 * hash(x, 2), 20 + 8 * hash(x, 3), 0, 3); c.rect(-60, GY - 3, W + 120, 8); }, A.wood));

  ctx.depthLayer?.('lake');
  // the lake: the curtains again, upside down and dimmer, cut through by the ice's dark seams
  ctx.fillStyle = A.lake; ctx.fillRect(0, GY + 3, W, H - GY);
  ctx.save(); ctx.beginPath(); ctx.rect(0, GY + 4, W, H - GY); ctx.clip();
  for (const cu of CURTAINS) curtain(ctx, G, t, cu, 0.5);
  ctx.strokeStyle = A.lake; ctx.lineCap = 'butt';
  for (let k = 0; k < 9; k++) { const y = GY + 14 + k * (12 + k * 5); ctx.lineWidth = 4 + k * 1.3; ctx.setLineDash([180 + 60 * hash(k, 1), 26 + 40 * hash(k, 2)]); ctx.lineDashOffset = k * 137 + (8 + 3 * k) * t * (k % 2 ? 1 : -1); ctx.beginPath(); ctx.moveTo(-40, y); ctx.lineTo(W + 40, y); ctx.stroke(); }
  ctx.restore();

  ctx.depthLayer?.('cabin');
  // near bank: lit snow over a band of shade, the cabin and its smoke
  layer(0.6, () => {
    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 12) c.lineTo(x, G.snowY(x) - 16 - 10 * nS(x / 90 + 5)); c.lineTo(W + 90, H + 60); c.closePath(); }, A.shade);
    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 12) c.lineTo(x, G.snowY(x)); c.lineTo(W + 90, H + 60); c.closePath(); }, A.snow);
    const { x, s } = G.cabin, y = G.snowY(x + 80 * s) + 10;
    { const sx = x + 128 * s, sy = y - 150 * s, dt = 0.8, life = 10, n = Math.floor(t / dt);
      F(ctx, (c) => { for (let k = Math.ceil(life / dt); k >= 0; k--) { const id = n - k, a = t - id * dt; if (a < 0 || a >= life) continue; circle(c, sx + (16 * a + 22 * Math.sin(a * 0.5 + id * 0.9)) * s, sy - (34 * a - a * a * 0.9) * s, Math.max(0.5, (7 + 7 * Math.sqrt(a) + 4 * hash(id, 1)) * (1 - Math.pow(a / life, 3)) * s)); } }, A.smoke); }
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    F(ctx, (c) => { c.rect(0, -84, 170, 90); poly(c, [[-18, -80], [188, -80], [85, -150]]); c.rect(116, -150, 24, 50); }, A.ink);
    F(ctx, (c) => { poly(c, [[-22, -78], [0, -78], [85, -136], [170, -78], [192, -78], [85, -154]]); pill(c, 112, -158, 32, 12); }, A.snow);
    const fl = 0.5 + 0.5 * Math.sin(t * 5.3) * Math.sin(t * 3.1);
    F(ctx, (c) => c.rect(26, -62, 44, 40), fl > 0.2 ? C.gold : C.orange);
    F(ctx, (c) => { c.rect(46, -62, 4, 40); c.rect(26, -44, 44, 4); c.rect(104, -58, 36, 64); }, A.ink);
    F(ctx, (c) => circle(c, 132, -24, 3), C.gold);
    // the window's light lies on the snow
    F(ctx, (c) => poly(c, [[20, 10], [78, 10], [112 + 6 * fl, 44], [-4 - 6 * fl, 44]]), C.gold);
    ctx.restore();
  });

  ctx.depthLayer?.('pines');
  // pines either side; they tip a little in the wind
  layer(1, () => F(ctx, (c) => { for (const q of G.PINES) pine(c, q.x, H + q.h * 0.15, q.h, q.h * 0.36, q.h * 0.035 * osc(p, q.c, q.ph) + q.h * 0.012 * osc(p, 9, q.ph), 6); }, A.ink));

  // snow drifts down across everything
  F(ctx, (c) => { for (const f of G.FLAKES) circle(c, frac((f.x + 26 * Math.sin(TAU * (t * f.f * 0.2 + f.ph))) / W + (f.d * t) / 1800) * W, frac(f.y / H + (f.v * t) / 1000) * H, f.r * big); }, C.cream);
}
