// Weather Series No. 03: Fog Bank. A rust red suspension bridge crosses a grey bay, its two towers set at shares of
// the width and its cables hung between them. The fog is long flat pills in four pale tones: some banks are drawn
// before the bridge and some after it, each sliding at its own speed, so towers and deck come and go. A beacon
// pulses on each tower, a boat with a lamp crosses underneath now and then, and gulls glide through.
import { mulberry, clamp, frac, lerp, osc, sway, noise1, poly, circle, pill, TAU } from './geom.js';
import { C, F } from './kit.js';
import { hash, pine } from './bits.js';

export const title = 'FOG BANK', no = 'No. 03', text = '#1e3238', dark = '#14252a';
const K = { sky: '#9fb0b3', sky2: '#8ea2a6', ring: '#adbcbc', far: '#7e969b', head: '#5d7a80', w1: '#4f7379', w2: '#456870', w3: '#5a7f84', f1: '#dcdfd5', f2: '#cbd2cd', f3: '#b6c2c1', red: '#b5452d', red2: '#8c3322', pier: '#3c565c', ink: '#1e3238' };
const nH = noise1(907), nG = noise1(911), nS = noise1(919);
// fog banks: [x share, height between the tower tops (0) and the water (1), width, thickness, tone, units per second]
const BACK = [[0, 0.6, 900, 90, K.f3, 5], [0.5, 0.42, 700, 70, K.f3, 7], [0.3, 0.9, 1100, 110, K.f2, 4], [0.8, 0.74, 640, 64, K.f2, 9], [0.65, 0.12, 520, 50, K.f3, 6]];
const FRONT = [[0.15, 0.66, 1000, 116, C.cream, 12], [0.62, 0.36, 760, 84, K.f1, 17], [0.9, 0.86, 900, 100, K.f2, 10], [0.4, 1.03, 1200, 76, K.f1, 8], [0.05, 0.2, 600, 60, K.f2, 21], [0.72, 1.16, 700, 48, K.f2, 14], [0.33, 0.52, 560, 56, K.f1, 26]];

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.4 * tall, r = mulberry(909);
  const WY = Math.round(H * (0.72 - 0.05 * tall));               // waterline
  const deckY = WY - 105 * big, top = WY - clamp(H * 0.5, 380, 1000), tw = 42 * big;
  const x1 = W * (0.28 - 0.08 * tall), x2 = W * (0.72 + 0.1 * tall), xm = (x1 + x2) / 2, half = (x2 - x1) / 2, side = half * 0.95, low = deckY - 26 * big;
  // the main cable hangs in a parabola between the tower tops and runs down to the deck beyond them
  const cable = (x) => { const d = Math.abs(x - xm); if (d <= half) return low - (low - top) * (d / half) ** 2; const u = clamp((d - half) / side); return lerp(top, deckY, u) + (deckY - top) * 0.16 * 4 * u * (u - 1) * -1 * (1 - u); };
  const farY = (x) => WY - H * 0.05 - H * 0.1 * (0.5 + 0.5 * nH(x / 520 + 2)) - 6 * nH(x / 60);
  const headY = (x) => { const e = Math.min(x, W - x) / W; return WY + 8 - H * 0.16 * clamp(1 - e / (0.2 - 0.06 * tall)) ** 1.4 * (0.8 + 0.2 * nH(x / 90 + 30)); };
  const POOL = clamp(Math.round((H - WY) / 46), 4, 11);
  const band = (j) => { const u = j / POOL; return { u, y0: WY + Math.pow(u, 1.3) * (H - WY) * 0.92, lam: 190 + 300 * u, amp: 2 + 7 * u }; };
  const GULLS = Array.from({ length: 7 }, (_, i) => ({ x: r(), y: 0.12 + r() * 0.6, v: (16 + r() * 22) * (i % 3 ? 1 : -1), s: (9 + r() * 9) * big, f: 0.5 + r() * 0.5, ph: r() }));
  const shoreY = (x) => H * 0.97 - 20 * tall - H * 0.14 * clamp(1 - x / (W * (0.5 + 0.2 * tall))) ** 1.5 + 9 * nS(x / 120);
  const PINES = [[0.02, 0.4, 3], [0.1, 0.3, 4], [0.19, 0.2, 5]].map(([fx, fh, c], i) => ({ x: fx * W, h: fh * H * (0.75 + 0.25 * big) * (1 - 0.25 * tall), c, ph: i * 0.31 }));
  return { W, H, WY, tall, big, deckY, top, tw, x1, x2, cable, farY, headY, POOL, band, GULLS, shoreY, PINES };
}

// each bank is a long pill with a shorter one riding on its back; it slides across and comes round again out of sight
function fog(ctx, G, list, t, p, tone) {
  const { W, WY, top, big } = G;
  F(ctx, (c) => { list.forEach(([fx, s, w0, h0, col, v], i) => {
    if (col !== tone) return;
    const w = Math.min(w0 * (0.6 + 0.4 * big), W * 0.85), h = h0 * big, span = W + w + 200, x = frac(fx + (v * t) / (2000 + Math.min(w0, 1530))) * span - w - 100, y = lerp(top, WY, s) + 10 * osc(p, 2 + (i % 3), i * 0.23);
    pill(c, x, y, w, h); pill(c, x + w * (0.12 + 0.2 * hash(i, 4)), y - h * 0.5, w * 0.55, h * 0.8); pill(c, x + w * 0.5, y + h * 0.55, w * 0.6, h * 0.6);
  }); }, tone);
}

export function paint(ctx, p, t, G) {
  const { W, H, WY, deckY, top, tw, x1, x2, big } = G;
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  ctx.fillStyle = K.sky2; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = K.sky; ctx.fillRect(0, WY * 0.34, W, H);
  // a pale sun behind the murk
  { const sx = W * 0.5 + sway(p, 0.03), sy = Math.max(top * 0.55, 110) + 10 * Math.sin((TAU * t) / 380); F(ctx, (c) => circle(c, sx, sy, 150 * big), K.sky); F(ctx, (c) => circle(c, sx, sy, 96 * big), K.ring); F(ctx, (c) => circle(c, sx, sy, 50 * big), C.cream); }

  layer(0.06, () => F(ctx, (c) => { c.moveTo(-90, WY + 6); for (let x = -90; x <= W + 90; x += 10) c.lineTo(x, G.farY(x)); c.lineTo(W + 90, WY + 6); c.closePath(); }, K.far));
  fog(ctx, G, BACK, t, p, K.f3);

  ctx.depthLayer?.('bay');
  // the bay: slow bands, with pale streaks sliding along them
  for (let j = 0; j < G.POOL; j++) {
    const b = G.band(j), s = 0.9 * p * b.lam + j * 71, e = [];
    for (let x = -20; x <= W + 20; x += 12) e.push([x, b.y0 - (j ? b.amp * Math.sin(((x - s) / b.lam) * TAU) + 2 * osc(p, 4 + (j % 3), j * 0.17) : 0)]);
    F(ctx, (c) => { c.moveTo(e[0][0], e[0][1]); for (const q of e) c.lineTo(q[0], q[1]); c.lineTo(W + 20, H + 60); c.lineTo(-20, H + 60); c.closePath(); }, j % 3 === 2 ? K.w3 : j % 2 ? K.w2 : K.w1);
    if (!j) continue;
    ctx.save(); ctx.beginPath(); ctx.moveTo(e[0][0], e[0][1] + 6); for (const q of e) ctx.lineTo(q[0], q[1] + 6 + 5 * b.u);
    ctx.strokeStyle = K.f3; ctx.lineWidth = 2 + 2.5 * b.u; ctx.lineCap = 'round'; ctx.setLineDash([b.lam * 0.22, b.lam * 0.78]); ctx.lineDashOffset = -s + j * 60; ctx.stroke(); ctx.restore();
  }
  layer(0.14, () => F(ctx, (c) => { c.moveTo(-90, WY + 10); for (let x = -90; x <= W + 90; x += 10) c.lineTo(x, Math.min(WY + 10, G.headY(x))); c.lineTo(W + 90, WY + 10); c.closePath(); }, K.head));
  fog(ctx, G, BACK, t, p, K.f2);

  ctx.depthLayer?.('bridge');
  // the bridge
  layer(0.22, () => {
    // each tower stands in the water as a broken column of red
    F(ctx, (c) => { for (const tx of [x1, x2]) for (let k = 0; k < 6; k++) { const w = tw * (1.1 - k * 0.12) * (0.6 + 0.4 * osc(p, 5 + (k % 3), k * 0.21 + tx)); pill(c, tx + 5 * osc(p, 4, k * 0.3) - w / 2, WY + (22 + k * (15 + 2 * k)) * big, w, 7 * big); } }, K.red2);
    ctx.strokeStyle = K.red; ctx.lineCap = 'butt';
    ctx.lineWidth = 2 * big; ctx.beginPath(); for (let x = Math.floor(-100 / (24 * big)) * 24 * big; x <= W + 100; x += 24 * big) { const y = G.cable(x); if (y < deckY - 6) { ctx.moveTo(x, y); ctx.lineTo(x, deckY); } } ctx.stroke();
    ctx.lineWidth = 6 * big; ctx.beginPath(); for (let x = -100; x <= W + 100; x += 10) { const y = G.cable(x); x === -100 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
    F(ctx, (c) => { c.rect(-100, deckY + 10 * big, W + 200, 16 * big); for (const tx of [x1, x2]) c.rect(tx - tw * 0.36, deckY, tw * 0.72, WY - deckY); }, K.red2);
    F(ctx, (c) => {
      c.rect(-100, deckY, W + 200, 11 * big);
      for (const tx of [x1, x2]) { const hh = deckY - top; c.rect(tx - tw * 0.5, top + hh * 0.66, tw, WY - top - hh * 0.66); c.rect(tx - tw * 0.43, top + hh * 0.3, tw * 0.86, hh * 0.4); c.rect(tx - tw * 0.36, top - 12 * big, tw * 0.72, hh * 0.34); c.rect(tx - tw * 0.5, top - 20 * big, tw, 10 * big); c.rect(tx - 2 * big, top - 44 * big, 4 * big, 26 * big); }
    }, K.red);
    // darker panels up each tower, and the truss under the deck
    F(ctx, (c) => { for (const tx of [x1, x2]) { const hh = deckY - top; for (let k = 0; k < 4; k++) { const y = top + hh * (0.06 + k * 0.22), w = tw * (0.34 + 0.06 * k); c.rect(tx - w / 2, y, w, hh * 0.13); } } }, K.red2);
    ctx.strokeStyle = K.red; ctx.lineWidth = 2 * big; ctx.beginPath(); for (let x = -96; x <= W + 100; x += 16 * big) { ctx.moveTo(x, deckY + 26 * big); ctx.lineTo(x + 8 * big, deckY + 11 * big); ctx.lineTo(x + 16 * big, deckY + 26 * big); } ctx.stroke();
    F(ctx, (c) => { for (const tx of [x1, x2]) { pill(c, tx - tw * 1.1, WY - 14 * big, tw * 2.2, 26 * big); } }, K.pier);
  });

  // a boat crosses under the bridge now and then, its lamp drawn out on the water
  { const slot = 110, n = Math.floor(t / slot), q = mulberry(n * 4409 + 6), go = q() < 0.85, dir = q() < 0.5 ? -1 : 1, u = (t - n * slot - 2 - q() * 14) / 86;
    if (go && u >= 0 && u <= 1) {
      const x = dir > 0 ? -140 + u * (W + 280) : W + 140 - u * (W + 280), y = WY + (H - WY) * 0.3 + 3 * osc(p, 6, 0.2), s = big;
      F(ctx, (c) => { for (let k = 0; k < 5; k++) { const w = (30 - k * 4) * s * (0.6 + 0.4 * osc(p, 6 + k, k * 0.2)); pill(c, x + 4 * osc(p, 5, k * 0.3) - w / 2, y + (14 + k * 13) * s, w, 6 * s); } }, C.gold);
      ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s); ctx.rotate(0.03 * osc(p, 5, 0.4));
      F(ctx, (c) => { for (let k = 0; k < 3; k++) pill(c, -150 - k * 70, 2 + k * 3, 70 - k * 14, 5); }, K.f2);
      F(ctx, (c) => { poly(c, [[-62, -12], [70, -12], [52, 8], [-54, 8]]); c.rect(-4, -70, 4, 40); }, K.ink);
      F(ctx, (c) => { c.rect(-34, -36, 50, 24); c.rect(-60, -12, 126, 5); }, C.cream);
      F(ctx, (c) => { c.rect(-26, -30, 12, 10); c.rect(-8, -30, 12, 10); }, K.ink);
      F(ctx, (c) => circle(c, -2, -74, 7), C.orange); F(ctx, (c) => circle(c, -2, -74, 4), C.gold);
      ctx.restore();
    } }

  for (const tone of [K.f2, K.f1, C.cream]) fog(ctx, G, FRONT, t, p, tone);

  // the beacons show through whatever fog is passing: a small lamp that swells and shrinks, never quite together
  layer(0.22, () => { [x1, x2].forEach((tx, i) => { const I = Math.pow(Math.max(0, osc(p, 7 + i, i * 0.37)), 2), y = top - 48 * big; F(ctx, (c) => circle(c, tx, y, (5 + 9 * I) * big), C.orange); F(ctx, (c) => circle(c, tx, y, (2 + 5 * I) * big), C.gold); }); });

  // gulls
  ctx.strokeStyle = K.ink; ctx.lineWidth = 3 * big; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  G.GULLS.forEach((g, i) => {
    const span = W + 240, x = frac(g.x + (g.v * t) / 2040) * span - 120, y = lerp(top * 0.5, WY, g.y) + 60 * nG(t * 0.04 + i * 13) + 14 * nG(t * 0.21 + i * 5), lift = 0.25 + 0.4 * Math.max(0, Math.sin(t * 2.2 * g.f + g.ph * 9)) * (0.5 + 0.5 * nG(t * 0.1 + i * 3));
    ctx.moveTo(x - g.s, y - g.s * lift); ctx.quadraticCurveTo(x - g.s * 0.4, y - g.s * lift * 1.3, x, y); ctx.quadraticCurveTo(x + g.s * 0.4, y - g.s * lift * 1.3, x + g.s, y - g.s * lift);
  });
  ctx.stroke(); ctx.lineJoin = 'miter';

  ctx.depthLayer?.('pines');
  // the near shore: a dark point with three pines
  layer(1, () => {
    F(ctx, (c) => { for (const q of G.PINES) pine(c, q.x, G.shoreY(q.x) + 10, q.h, q.h * 0.34, q.h * 0.03 * osc(p, q.c, q.ph) + q.h * 0.01 * osc(p, 9, q.ph), 6); c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 12) c.lineTo(x, G.shoreY(x)); c.lineTo(W + 90, H + 60); c.closePath(); }, K.ink);
  });
}
