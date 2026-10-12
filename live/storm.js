// Weather Series No. 01: Summer Storm. An anvil cloud stacked from flat pills stands over a prairie farm; under its
// dark shelf a strip of clear evening sky still shows along the horizon. The wind blows left to right: rain is drawn
// as slanted dashed strokes whose dashes only run down the slope, the wheat rolls in rows of travelling waves, scud
// races under the shelf, and now and then a lighter pill swells and fades inside the tower (sheet lightning).
import { mulberry, clamp, frac, lerp, osc, sway, noise1, poly, circle, pill, TAU } from './geom.js?v=20261011-clock-controls';
import { C, F } from './kit.js?v=20261011-clock-controls';
import { hash, el, bars } from './bits.js?v=20261011-clock-controls';

export const title = 'SUMMER STORM', no = 'No. 01', text = '#23234a', dark = '#15152e';
const S = { sky: '#454277', sky2: '#524f8a', c1: '#b2b7dc', c2: '#7a81b5', c3: '#575d94', c4: '#2b2c52', scud: '#3b3b69', glow: '#d3d5ee', shaft: '#8a7397', far: '#5a4763', f1: '#a67d3b', f2: '#c9973a', f3: '#b5822f', stalk: '#5e3f22', ink: '#15152e' };
const TONES = [S.glow, S.c1, S.c2, S.c3, S.c4];
const nF = noise1(701), nB = noise1(709), nW = noise1(719);
// the anvil, top to bottom: [centre as a share of its width, top and height as shares of the cloud's height, width, tone, sway beats]
const ANVIL = [
  [0.07, 0, 1, 0.13, 1, 2], [0.24, 0.09, 0.66, 0.1, 1, 3], [-0.16, 0.1, 0.46, 0.09, 1, 2], [0.05, 0.17, 0.62, 0.12, 2, 3],
  [-0.04, 0.27, 0.44, 0.15, 2, 2], [0.05, 0.38, 0.38, 0.15, 2, 4], [-0.03, 0.49, 0.48, 0.15, 3, 3], [0.06, 0.6, 0.6, 0.15, 3, 2], [-0.04, 0.71, 0.82, 0.15, 3, 3],
];
const HIGH = [[0.05, 0.1, 380, 22, S.sky2, 7], [0.5, 0.2, 300, 18, S.sky2, 5], [0.8, 0.3, 340, 20, S.sky2, 9], [0.3, 0.45, 260, 18, S.sky2, 11]];
const SCUD = [[0.1, 0.83, 520, 34, S.c4, 24], [0.55, 0.8, 420, 30, S.c4, 31], [0.85, 0.86, 360, 26, S.c4, 19], [0.3, 0.99, 460, 30, S.c4, 38], [0.7, 1, 380, 26, S.c4, 27], [0, 1.01, 300, 22, S.c4, 45],
  [0.2, 0.66, 300, 20, S.scud, 52], [0.62, 0.74, 240, 16, S.scud, 64], [0.9, 0.56, 200, 14, S.scud, 44]];

// an upright bar with a rounded top
const post = (c, x, y, w, h) => { const r = w / 2; c.moveTo(x, y + r); c.arc(x + r, y + r, r, Math.PI, 0); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); };

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.4 * tall;
  const HY = Math.round(H * (0.66 - 0.02 * tall));             // horizon
  const yB = HY - H * 0.105, yT = H * 0.045, CH = yB - yT;    // cloud base, cloud top
  const aw = lerp(W * 0.74, W * 0.94, tall), cx = W * (0.42 - 0.02 * tall);
  const PARTS = ANVIL.map(([ox, top, w, h, tone, c], i) => ({ x: cx + ox * aw, y: yT + top * CH, w: w * aw, h: h * CH, tone, c, ph: hash(i, 3) }));
  const farY = (x) => HY - H * 0.01 - H * 0.022 * (0.5 + 0.5 * nF(x / 380));
  const ROWS = clamp(Math.round((H - HY) / 50), 5, 12);
  const row = (j) => { const u = j / (ROWS - 1); return { u, y0: HY + (H - HY) * (0.2 + 0.76 * Math.pow(u, 1.3)), amp: 4 + 20 * u, lam: 300 + 520 * u, v: 70 + 190 * u, tooth: 4 + 9 * u }; };
  const farm = { x: W * (0.68 - 0.12 * tall), y: HY + (H - HY) * 0.12, s: big };
  const STALKS = Array.from({ length: Math.round(W / 12) }, (_, i) => ({ x: -40 + (i + hash(i, 21)) * 12.6, h: (70 + hash(i, 22) * 150) * big, ph: hash(i, 23), w: 4 + hash(i, 24) * 3, back: hash(i, 25) < 0.45 }));   // numbers by index, so a wider frame only adds stalks at the end
  const SHAFTS = Array.from({ length: 5 }, (_, i) => ({ fx: (i + hash(i, 31) * 0.7) / 5, w: 50 + hash(i, 32) * 130, v: 5 + hash(i, 33) * 6 }));
  return { W, H, HY, yB, yT, CH, tall, big, PARTS, farY, ROWS, row, farm, STALKS, SHAFTS };
}

// One sheet of rain: parallel slanted strokes in a single dashed path. The dashes are pushed along the stroke, so they
// only ever travel down and downwind; each stroke starts at its own height, which puts the dashes out of step.
function rain(ctx, G, t, k, y0, sp, lw, on, gap, speed, fill) {
  const { W, H } = G, sl = 0.34 + 0.07 * nW(t * 0.11 + k * 5), run = (H + 30 - y0) * sl;
  ctx.save(); ctx.strokeStyle = fill; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.setLineDash([on, gap]); ctx.lineDashOffset = -((speed * t) % (on + gap));
  ctx.beginPath();
  for (let i = Math.floor(-run / sp) - 1; i * sp < W + 20; i++) { const x = (i + 0.8 * hash(i, k)) * sp, j = hash(i, k + 9) * (on + gap); ctx.moveTo(x - j * sl, y0 - j); ctx.lineTo(x + run, H + 30); }
  ctx.stroke(); ctx.restore();
}

export function paint(ctx, p, t, G) {
  const { W, H, HY, yB, yT, CH, big } = G;
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  ctx.fillStyle = S.sky; ctx.fillRect(0, 0, W, H);
  bars(ctx, HIGH, W, t, (y) => yT + y * CH);

  // the clear strip under the cloud base, and far rain shafts leaning across it
  { const d = HY - yB + 12;
    F(ctx, (c) => c.rect(0, yB - 12, W, d * 0.34), C.orange); F(ctx, (c) => c.rect(0, yB - 12 + d * 0.34, W, d * 0.3), C.gold); F(ctx, (c) => c.rect(0, yB - 12 + d * 0.64, W, d * 0.4), C.cream);
    F(ctx, (c) => { for (const s of G.SHAFTS) { const span = W + 500, x = frac(s.fx + (s.v * t) / 2300) * span - 300, dx = d * 0.5; poly(c, [[x, yB - 12], [x + s.w, yB - 12], [x + s.w * 0.8 + dx, HY + 4], [x + s.w * 0.2 + dx, HY + 4]]); } }, S.shaft); }

  ctx.depthLayer?.('clouds');
  // the anvil: each pill breathes sideways a little at its own pace
  layer(0.04, () => {
    for (const tone of [1, 2, 3]) F(ctx, (c) => { for (const q of G.PARTS) if (q.tone === tone) pill(c, q.x - q.w / 2 + 12 * osc(p, q.c, q.ph) + 5 * osc(p, 7, q.ph), q.y, q.w, q.h); }, TONES[tone]);
    // sheet lightning: in some time slots one pill of the tower lights from inside, swelling and shrinking over a second and a half
    { const slot = 9, n = Math.floor(t / slot), q = mulberry(n * 6151 + 17);
      if (q() < 0.62) {
        const u = (t - n * slot - 0.5 - q() * 6) / 1.5, P = G.PARTS[3 + Math.floor(q() * 6)], off = (q() - 0.5) * 0.25;
        if (u > 0 && u < 1) for (const [k, step] of [[1, 1], [0.55, 2]]) { const e = Math.sin(Math.PI * u), w = P.w * 0.62 * k * (0.5 + 0.5 * e), h = P.h * 0.56 * k * Math.min(1, e * 1.5); if (w > h && h > 2) F(ctx, (c) => pill(c, P.x + off * P.w - w / 2, P.y + P.h * 0.5 - h / 2, w, h), TONES[P.tone - step]); }
      } }
    F(ctx, (c) => c.rect(-60, yT + 0.86 * CH, W + 120, 0.14 * CH + 2), S.c4);
  });
  bars(ctx, SCUD, W, t, (y) => yT + y * CH - 14);

  // far rise, the first field and the farm
  layer(0.1, () => F(ctx, (c) => { c.moveTo(-90, HY + 8); for (let x = -90; x <= W + 90; x += 10) c.lineTo(x, G.farY(x)); c.lineTo(W + 90, HY + 8); c.closePath(); }, S.far));
  ctx.fillStyle = S.f1; ctx.fillRect(0, HY, W, H - HY);
  rain(ctx, G, t, 1, yB, 26, 2, 16, 30, 520, S.c3);
  layer(0.22, () => {
    const { x, y, s } = G.farm, spin = 2.1 * t + 3 * nW(t * 0.09), gust = 0.5 + 0.5 * nW(t * 0.3);
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    F(ctx, (c) => pill(c, -330, -8, 640, 18), S.far);
    // trees bent by the wind
    F(ctx, (c) => { for (const [tx, tr, th] of [[212, 34, 60], [262, 26, 44], [-306, 28, 50]]) { const lean = 9 + 7 * gust + 2 * osc(p, 9, tx); poly(c, [[tx - 4, 0], [tx + 4, 0], [tx + lean * 0.5 + 3, -th], [tx + lean * 0.5 - 3, -th]]); el(c, tx + lean, -th - tr * 0.5, tr * 1.15, tr * 0.85, -0.25); el(c, tx + lean * 1.6 + tr * 0.5, -th - tr * 0.2, tr * 0.7, tr * 0.5, -0.3); } }, S.c4);
    // windmill: the wheel faces the wind and its tail points downwind
    ctx.strokeStyle = S.ink; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath();
    for (const sd of [-1, 1]) { ctx.moveTo(-190 + sd * 26, 0); ctx.lineTo(-190 + sd * 5, -160); }
    for (let k = 0; k < 3; k++) { const w0 = 26 - 7 * k, w1 = 26 - 7 * (k + 1), y0 = (-160 * k) / 3, y1 = (-160 * (k + 1)) / 3; ctx.moveTo(-190 - w0, y0); ctx.lineTo(-190 + w1, y1); ctx.moveTo(-190 + w0, y0); ctx.lineTo(-190 - w1, y1); }
    ctx.stroke();
    ctx.save(); ctx.translate(-190, -164); ctx.rotate(0.06 * osc(p, 5, 0.3)); F(ctx, (c) => poly(c, [[0, -3], [46, -5], [70, -20], [70, 20], [46, 5], [0, 3]]), S.ink); ctx.restore();
    ctx.save(); ctx.translate(-196, -164); ctx.rotate(spin);
    F(ctx, (c) => { for (let k = 0; k < 10; k++) { const b = (k * TAU) / 10, c0 = Math.cos(b), s0 = Math.sin(b), c1 = Math.cos(b + 0.4), s1 = Math.sin(b + 0.4); poly(c, [[c0 * 8, s0 * 8], [c0 * 40, s0 * 40], [c1 * 40, s1 * 40], [c1 * 8, s1 * 8]]); } circle(c, 0, 0, 7); }, S.ink);
    ctx.restore();
    // barn and silo
    F(ctx, (c) => c.rect(-80, -72, 160, 72), C.rust);
    F(ctx, (c) => { poly(c, [[-92, -70], [-72, -106], [-32, -130], [32, -130], [72, -106], [92, -70]]); c.rect(-30, -56, 60, 56); c.rect(104, -112, 46, 5); c.rect(104, -62, 46, 5); }, S.ink);
    F(ctx, (c) => { c.rect(-24, -50, 48, 50); post(c, 106, -150, 42, 150); }, C.cream);
    F(ctx, (c) => { c.rect(-18, -44, 36, 44); }, C.rust);
    F(ctx, (c) => { c.rect(106, -112, 42, 5); c.rect(106, -62, 42, 5); c.rect(134, -128, 14, 128); c.moveTo(102, -128); c.arc(127, -128, 25, Math.PI, 0); c.closePath(); }, S.ink);
    F(ctx, (c) => c.rect(-11, -100, 22, 18), C.gold);
    ctx.strokeStyle = C.cream; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-18, -44); ctx.lineTo(18, 0); ctx.moveTo(18, -44); ctx.lineTo(-18, 0); ctx.stroke();
    ctx.restore();
  });

  ctx.depthLayer?.('wheat');
  // wheat: rows whose toothed top edges carry waves downwind, bigger and faster the nearer they are
  const fills = [S.f2, C.gold, S.f3];
  for (let j = 0; j < G.ROWS; j++) {
    const b = G.row(j), dx = sway(p, 0.3 + 0.5 * b.u);
    F(ctx, (c) => {
      c.moveTo(-30, H + 60);
      for (let x = -30, i = 0; x <= W + 30; x += 9, i++) {
        const X = x - dx, g = 0.55 + 0.45 * nB(X / 520 + j * 9 - t * 0.05);
        c.lineTo(x, b.y0 - b.amp * (Math.sin(((X - b.v * t) / b.lam) * TAU + j * 1.7) * g + 0.35 * Math.sin(((X - 1.6 * b.v * t) / (b.lam * 0.41)) * TAU + j)) - (i % 2 ? b.tooth : 0));
      }
      c.lineTo(W + 30, H + 60); c.closePath();
    }, fills[j % 3]);
    if (j === 1) rain(ctx, G, t, 2, yB, 44, 3, 26, 50, 760, S.c2);
  }

  ctx.depthLayer?.('stalks');
  // the nearest stalks, bowing as each gust passes along them
  layer(1, () => {
    for (const back of [true, false]) F(ctx, (c) => {
      for (const q of G.STALKS) {
        if (q.back !== back) continue;
        const by = H + 12, lean = q.h * (0.3 + 0.24 * Math.sin(q.x / 240 - t * 1.3) * (0.6 + 0.4 * nB(q.x / 600 + t * 0.07)) + 0.05 * osc(p, 11, q.ph)), tx = q.x + lean, ty = by - q.h * (1 - 0.12 * lean / q.h);
        c.moveTo(q.x - q.w / 2, by); c.quadraticCurveTo(q.x + lean * 0.15, by - q.h * 0.6, tx, ty); c.quadraticCurveTo(q.x + q.w / 2 + lean * 0.15, by - q.h * 0.6, q.x + q.w / 2, by); c.closePath();
        el(c, tx + 4, ty + 1, 15 * big, 4.5 * big, Math.atan2(-q.h * 0.4, lean * 0.85) + Math.PI);
      }
    }, back ? S.f3 : S.stalk);
  });
  rain(ctx, G, t, 3, yB + 0.3 * (H - yB), 90, 4, 40, 90, 1000, S.c1);
}
