// Daybreak Series No. 03: Alpine Lake. Two jagged ranges stand over a still lake at dawn; the sun is coming up in the
// saddle between them and the first light has caught the tops, rose on the far range and gold on the near. The lake
// carries the peaks upside down, cut by slow ripples, with mist sliding over it. A jetty and a rowing boat sit under
// the pines on the near bank. Each range is a row of peaks built once in make as a skyline, with a second line below
// it where the light stops; the same two lines, flipped, make the reflection.
import { mulberry, clamp, osc, sway, noise1, poly, circle, pill, TAU } from './geom.js?v=20261011-clock';
import { C, F } from './kit.js?v=20261011-clock';
import { hash, el, bars, pine } from './bits.js?v=20261011-clock';

export const title = 'ALPINE LAKE', no = 'No. 03', text = '#143f3c', dark = '#0d2a29';
const P = { sky: '#eda594', r1: '#f2b79b', r2: '#f6c9a0', far: '#a48fb0', rose: '#fbd2ba', near: '#56708e', glow: '#f7d48a', green: '#1d4d46', lake: '#2f8f98', lake2: '#237a86', deep: '#195f6b', ink: '#0f2d2b' };
const nM = noise1(1401), nW = noise1(1409), nF = noise1(1423);
const CLOUDS = [[0.08, 0.14, 440, 16, P.r1, 4], [0.17, 0.2, 240, 12, P.r1, 4], [0.7, 0.3, 380, 14, P.r2, 6], [0.4, 0.44, 300, 12, C.cream, 8]];
const MIST = [[0.05, -0.02, 620, 22, C.cream, 6], [0.5, 0.0, 480, 18, P.r2, -5], [0.3, 0.12, 700, 26, C.cream, -8], [0.75, 0.2, 520, 22, C.cream, 10], [0.15, 0.34, 640, 26, P.r2, 13]];
const X0 = -96, STEP = 8, tri = (u) => Math.abs((((u % 1) + 1) % 1) * 2 - 1);

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall, r = mulberry(1403);
  const GY = Math.round(H * (0.56 - 0.04 * tall));            // the far shore
  const hs = Math.min(H * 0.33, 600 * big);                    // how high the far range stands
  const SUN = { x: W * (0.6 - 0.08 * tall), y: GY - hs * 0.34, r: 64 * big };
  const XS = []; for (let x = X0; x <= W + 96; x += STEP) XS.push(x);
  // a range: peaks with their own slopes, kept low around the sun; then the line below which it is still in shade.
  // The row runs on past the right edge far enough that a new peak never reaches into view the moment it is added.
  const range = (seed, scale, base, light) => {
    const q = mulberry(seed), pk = [];
    for (let x = -300; x < W + 300 + hs * scale; x += hs * scale * 0.62) { const px = x + q() * hs * scale * 0.4, g = 0.28 + 0.72 * clamp(Math.abs(px - SUN.x) / (W * 0.1 + hs * 0.5)); pk.push([px, hs * scale * (0.55 + 0.45 * q()) * g, 0.9 + 0.7 * q(), 0.9 + 0.7 * q()]); }
    const top = XS.map((x) => { let h = hs * base; for (const [px, ph, sl, sr] of pk) { const v = ph - (x < px ? (px - x) * sl : (x - px) * sr); if (v > h) h = v; } return GY - h - 5 * nM(x / 18 + seed) - 12 * nM(x / 70 + seed); });
    const shade = top.map((y, i) => Math.max(y, GY - hs * light + hs * 0.06 * tri(XS[i] / (hs * 0.12)) + hs * 0.05 * nM(XS[i] / 90 + seed)));
    return { top, shade };
  };
  const R1 = range(1411, 1, 0.12, 0.5), R2 = range(1417, 0.62, 0.07, 0.33);
  const lakeH = H - GY;
  const spit = { x0: W * (0.6 + 0.06 * tall), y: GY + lakeH * 0.2 };
  const SPINES = Array.from({ length: 9 }, (_, i) => ({ x: spit.x0 + 50 + (W + 60 - spit.x0) * ((i + r() * 0.7) / 9), h: (54 + 70 * r()) * big * (0.6 + 0.4 * (i / 8)), c: [3, 4, 5][i % 3], ph: r() }));
  const rise = Math.min(lakeH * 0.42, 270 * big);
  const fgY = (x) => H - 18 - rise * Math.pow(clamp(1 - x / (W * (0.5 + 0.2 * tall))), 1.4) + 8 * nF(x / 140);
  const jetty = { x0: W * 0.15, len: 330 * big }; jetty.y = fgY(jetty.x0) - 4;
  const PINES = [[-0.012, 0.64, 5, 0], [0.065, 0.46, 4, 0], [0.125, 0.3, 4, 0], [0.955, 0.4, 4, 1], [1.01, 0.66, 5, 1]].map(([fx, fh, c, side], i) => ({ x: fx * W, h: Math.min(fh * H, fh * 1500) * (0.8 + 0.2 * big), c, side, ph: i * 0.23 }));
  return { W, H, GY, tall, big, hs, SUN, XS, R1, R2, lakeH, spit, SPINES, fgY, jetty, PINES };
}

export function paint(ctx, p, t, G) {
  const { W, H, GY, SUN, XS, big, lakeH, hs } = G, a = (TAU * t) / 420, mx = SUN.x + sway(p, 0.03) + 40 * Math.sin(a), my = SUN.y - hs * 0.32 * (1 - Math.cos(a));
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  // a skyline filled down to the shore, or, with k, its double hanging below the shore at that share of its height
  const fill = (e, ink, k = 0) => F(ctx, (c) => { c.moveTo(XS[0], GY + 4); for (let i = 0; i < XS.length; i++) c.lineTo(XS[i], k ? GY + (GY - e[i]) * k : e[i]); c.lineTo(XS[XS.length - 1], GY + 4); c.closePath(); }, ink);
  ctx.fillStyle = P.sky; ctx.fillRect(0, 0, W, H);
  F(ctx, (c) => circle(c, mx, my, 760), P.r1); F(ctx, (c) => circle(c, mx, my, 470), P.r2); F(ctx, (c) => circle(c, mx, my, 230), P.glow);
  F(ctx, (c) => circle(c, mx, my, SUN.r), C.gold);
  bars(ctx, CLOUDS, W, t, (y) => y * GY);

  // a bird of prey turns slowly high up
  { const th = t * 0.11 + 0.8 * nW(t * 0.02), cx = W * (0.26 + 0.05 * nW(t * 0.008 + 9)), cy = GY * (0.3 + 0.05 * nW(t * 0.011 + 3)), x = cx + 170 * big * Math.cos(th), y = cy + 50 * big * Math.sin(th), s = 20 * big, w = s * (1.1 + 0.7 * Math.abs(Math.sin(th))), dir = Math.sin(th) > 0 ? -1 : 1, up = s * (0.28 + 0.1 * osc(p, 5));
    F(ctx, (c) => { poly(c, [[x - w, y - up], [x - w * 0.45, y - up * 0.2], [x, y - 2], [x + w * 0.45, y - up * 0.2], [x + w, y - up], [x + w * 0.5, y + s * 0.2], [x, y + s * 0.22], [x - w * 0.5, y + s * 0.2]]); poly(c, [[x - s * 0.16, y], [x + s * 0.16, y], [x + dir * s * 0.1 + s * 0.22, y + s * 0.55], [x + dir * s * 0.1 - s * 0.22, y + s * 0.55]]); }, P.ink); }

  layer(0.06, () => { fill(G.R1.top, P.rose); fill(G.R1.shade, P.far); });
  layer(0.11, () => { fill(G.R2.top, P.glow); fill(G.R2.shade, P.near); });
  const woods = (c) => { for (let x = -60; x <= W + 60; x += 22) pine(c, x + 8 * hash(x, 1), GY + 3, (22 + 30 * hash(x, 2)) * big, 18 + 8 * hash(x, 3), 0, 3); c.rect(-60, GY - 3, W + 120, 8); };
  layer(0.18, () => F(ctx, woods, P.green));

  // the lake: the ranges again, upside down, then ripples of open water drawn across them
  ctx.fillStyle = P.lake; ctx.fillRect(0, GY + 3, W, H - GY);
  ctx.save(); ctx.beginPath(); ctx.rect(0, GY + 4, W, H - GY); ctx.clip();
  layer(0.06, () => { fill(G.R1.shade, P.lake2, 0.8); F(ctx, (c) => { c.moveTo(XS[0], GY + (GY - G.R1.top[0]) * 0.8); for (let i = 0; i < XS.length; i++) c.lineTo(XS[i], GY + (GY - G.R1.top[i]) * 0.8); for (let i = XS.length - 1; i >= 0; i--) c.lineTo(XS[i], GY + (GY - G.R1.shade[i]) * 0.8); c.closePath(); }, P.rose); });
  layer(0.11, () => { fill(G.R2.shade, P.deep, 0.8); F(ctx, (c) => { c.moveTo(XS[0], GY + (GY - G.R2.top[0]) * 0.8); for (let i = 0; i < XS.length; i++) c.lineTo(XS[i], GY + (GY - G.R2.top[i]) * 0.8); for (let i = XS.length - 1; i >= 0; i--) c.lineTo(XS[i], GY + (GY - G.R2.shade[i]) * 0.8); c.closePath(); }, P.glow); });
  F(ctx, (c) => c.rect(0, GY, W, 16 * big), P.green);
  ctx.strokeStyle = P.lake; ctx.lineCap = 'butt';
  const rows = clamp(Math.round(lakeH / 34), 9, 22);
  for (let k = 0; k < rows; k++) { const u = k / rows, y = GY + 12 + lakeH * 0.92 * Math.pow(u, 1.25); ctx.lineWidth = 3 + 9 * u; ctx.setLineDash([150 + 90 * hash(k, 1), 30 + 60 * hash(k, 2)]); ctx.lineDashOffset = k * 137 + (5 + 5 * u) * t * (k % 2 ? 1 : -1) + 30 * Math.sin(t * 0.21 + k); ctx.beginPath(); ctx.moveTo(-40, y); ctx.lineTo(W + 40, y); ctx.stroke(); }
  ctx.depthLayer?.('water');
  // the near water is darker, and carries a few pale ripples and the sun's path
  F(ctx, (c) => { const y0 = GY + lakeH * 0.66; c.moveTo(-20, H + 20); for (let x = -20; x <= W + 20; x += 16) c.lineTo(x, y0 + 7 * Math.sin(x / 130 + t * 0.25) + 5 * nW(x / 200 + t * 0.03)); c.lineTo(W + 20, H + 20); c.closePath(); }, P.lake2);
  ctx.strokeStyle = C.cream; ctx.lineCap = 'round';
  for (let k = 0; k < 6; k++) { const u = (k + 0.5) / 6, y = GY + lakeH * (0.3 + 0.66 * u); ctx.lineWidth = 2 + 2.5 * u; ctx.setLineDash([30 + 50 * u, 260 + 300 * hash(k, 4)]); ctx.lineDashOffset = k * 211 + (7 + 8 * u) * t * (k % 2 ? -1 : 1); ctx.beginPath(); ctx.moveTo(-40, y); ctx.lineTo(W + 40, y); ctx.stroke(); }
  ctx.setLineDash([]);
  F(ctx, (c) => { for (let k = 0; k < 12; k++) { const y = GY + 26 + (k / 12) * lakeH * 0.86, on = 0.5 + 0.5 * osc(p, 5 + (k % 5), hash(k, 9)), w = (24 + k * 9) * big * (0.4 + 0.8 * hash(k, 40)) * (0.5 + 0.9 * on); pill(c, mx + (hash(k, 80) - 0.5) * (12 + k * 6) + 4 * osc(p, 3, hash(k, 9)) - w / 2, y - 3 - k * 0.25, w, 6 + k * 0.5); } }, C.gold);
  ctx.restore();

  bars(ctx, MIST.slice(0, 3), W, t, (y) => GY + y * lakeH - 8);

  ctx.depthLayer?.('trees');
  // a wooded spit runs in from the right, with its shadow on the water
  layer(0.3, () => {
    const { x0, y } = G.spit;
    F(ctx, (c) => pill(c, x0 - 20 + 6 * osc(p, 4), y + 5, W + 200 - x0, 12 * big), P.deep);
    F(ctx, (c) => { poly(c, [[x0, y + 4], [x0 + 120, y - 6 * big], [W + 120, y - 16 * big], [W + 120, y + 8], [x0 + 40, y + 8]]); for (const q of G.SPINES) pine(c, q.x, y - 4 * big, q.h, q.h * 0.42, q.h * 0.03 * osc(p, q.c, q.ph), 4); }, P.green);
  });
  bars(ctx, MIST.slice(3), W, t, (y) => GY + y * lakeH - 8);

  // a fish rises now and then and leaves rings
  { const slot = 16, n = Math.floor(t / slot), q = mulberry(n * 4409 + 3), go = q() < 0.7, u = (t - n * slot - 1 - q() * 8) / 5.5, x = W * (0.3 + 0.55 * q()), y = GY + lakeH * (0.42 + 0.4 * q());
    if (go && u > 0 && u < 1) { ctx.strokeStyle = C.cream; for (let k = 0; k < 2; k++) { const v = u - k * 0.22; if (v <= 0) continue; ctx.lineWidth = Math.max(0.3, 3.4 * big * (1 - v) * (1 - v)); ctx.beginPath(); el(ctx, x, y, (10 + 90 * v) * big, (3 + 22 * v) * big); ctx.stroke(); } } }

  ctx.depthLayer?.('jetty');
  // near bank: the jetty, the boat on its painter, and the pines
  layer(0.9, () => {
    const J = G.jetty, jy = J.y, x1 = J.x0 + J.len, wl = jy + 46 * big, bx = x1 + 96 * big, bob = 3 * osc(p, 7) + 1.5 * osc(p, 11, 0.3), rock = 0.035 * osc(p, 5, 0.2) + 0.02 * osc(p, 11, 0.6);
    F(ctx, (c) => { for (let x = J.x0 + 40 * big; x <= x1; x += 92 * big) { const w = (26 + 8 * osc(p, 6, x * 0.01)) * big; pill(c, x + 4 * big - w / 2, wl - 3 * big, w, 6 * big); } const w = (210 + 14 * osc(p, 7)) * big; pill(c, bx - w / 2, wl + 4 * big, w, 9 * big); }, P.deep);
    F(ctx, (c) => { c.rect(J.x0 - 40, jy, J.len + 40 + 10 * big, 9 * big); for (let x = J.x0 + 40 * big; x <= x1; x += 92 * big) c.rect(x, jy - 12 * big, 8 * big, wl - jy + 12 * big); }, P.ink);
    ctx.strokeStyle = P.ink; ctx.lineWidth = 2.5 * big; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(x1 + 4 * big, jy - 8 * big); ctx.quadraticCurveTo(x1 + 12 * big, wl - 6 * big, bx - 82 * big, wl - 20 * big + bob); ctx.stroke();
    ctx.save(); ctx.translate(bx, wl + bob); ctx.rotate(rock); ctx.scale(big, big);
    F(ctx, (c) => { c.moveTo(-88, -24); c.lineTo(88, -24); c.quadraticCurveTo(74, 6, 44, 6); c.lineTo(-44, 6); c.quadraticCurveTo(-74, 6, -88, -24); c.closePath(); }, C.orange);
    F(ctx, (c) => c.rect(-88, -27, 176, 6), C.cream);
    F(ctx, (c) => { c.rect(-30, -32, 8, 6); c.rect(22, -32, 8, 6); poly(c, [[-70, -40], [-66, -43], [52, -30], [50, -26]]); poly(c, [[50, -32], [84, -30], [84, -24], [50, -25]]); }, P.ink);
    ctx.restore();
    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 12) c.lineTo(x, G.fgY(x)); c.lineTo(W + 90, H + 60); c.closePath(); }, P.ink);
  });
  layer(1, () => F(ctx, (c) => { for (const q of G.PINES) pine(c, q.x, q.side ? H + q.h * 0.12 : Math.min(H + q.h * 0.12, G.fgY(q.x) + q.h * 0.2), q.h, q.h * 0.36, q.h * 0.03 * osc(p, q.c, q.ph) + q.h * 0.01 * osc(p, 9, q.ph), 6); }, P.ink));
}
