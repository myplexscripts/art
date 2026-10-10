// Weather Series No. 02: First Snow. A town square at dusk: a row of houses with lit windows along the back, a street
// lamp with a flat halo, a bench and two bare trees in front. The houses run shoulder to shoulder for as wide as the
// frame is; extra height becomes more sky and more snowy square. Snow falls in three depths (small and slow far off,
// big and fast up close), all leaning the same way with a wind that strengthens and slackens.
import { mulberry, clamp, frac, osc, sway, noise1, poly, circle, pill, TAU } from './geom.js';
import { C, F } from './kit.js';
import { hash, el, bars, crescent, pine } from './bits.js';

export const title = 'FIRST SNOW', no = 'No. 02', text = '#27255a', dark = '#151433';
const N = { sky: '#272657', s2: '#34316b', s3: '#453f80', s4: '#5d5192', hill: '#3a3572', w1: '#2a2553', w2: '#383168', w3: '#221e47', roof: '#191739', snow: '#cfe0ee', shade: '#9db6d6', near: '#f1f6fa', halo: '#8a5a72', ink: '#151433' };
const WALLS = [N.w1, N.w2, N.w3];
const nH = noise1(811), nS = noise1(823), nW = noise1(839);
const CLOUDS = [[0.1, 0.2, 460, 26, N.s2, 6], [0.6, 0.34, 380, 22, N.s2, 9], [0.3, 0.52, 420, 22, N.s3, 12], [0.8, 0.66, 300, 18, N.s4, 15]];

// which windows are lit changes slowly, each on its own timer
const lit = (id, t, share = 0.6) => hash(id, Math.floor(t / (40 + 60 * hash(id, 5)) + hash(id, 6))) < share;

// a bare tree as a list of branches [x0, y0, x1, y1, width, depth, lies flat enough to hold snow]
function tree(seed, h) {
  const r = mulberry(seed), segs = [];
  const grow = (x, y, a, len, w, d) => {
    const x1 = x + Math.sin(a) * len, y1 = y - Math.cos(a) * len; segs.push([x, y, x1, y1, w, d, Math.abs(Math.sin(a)) > 0.42]);
    if (d >= 4) return;
    const n = d === 0 ? 3 : 2;
    for (let k = 0; k < n; k++) grow(x1, y1, a * 0.6 + (k - (n - 1) / 2) * (0.95 - 0.08 * d) + (r() - 0.5) * 0.5, len * (0.62 + 0.18 * r()), Math.max(2, w * 0.6), d + 1);
  };
  grow(0, 0, (r() - 0.5) * 0.12, h * 0.36, h * 0.055, 0);
  return segs;
}

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.35 * tall;
  const GY = Math.round(H * (0.7 - 0.06 * tall));               // where the houses stand
  const hillY = (x) => GY - H * 0.1 - H * 0.07 * (0.5 + 0.5 * nH(x / 420)) - 110 * big * tall * 0.3;
  // each house takes its numbers from its own place in the row, and the church is slipped in between two of them, so a
  // change of width never reshuffles the row: at most the church changes places with one neighbour
  const HOUSES = []; let x = -90, n = 0; const churchAt = W * (0.3 - 0.06 * tall); let church = false;
  while (x < W + 90) {
    if (!church && x > churchAt) { church = true; HOUSES.push({ x, w: 96 * big, h: 250 * big, kind: 2, rh: 0, ch: 0, col: WALLS[(n + 1) % 3], id: 999 }); x += 96 * big; continue; }
    const w = (120 + hash(n, 11) * 80) * big;
    HOUSES.push({ x, w, h: (104 + hash(n, 12) * 96) * big, kind: hash(n, 13) < 0.55 ? 0 : 1, rh: (48 + hash(n, 14) * 30) * big, ch: 0.18 + hash(n, 15) * 0.6, col: WALLS[n % 3], id: n });
    x += w + (hash(n, 16) < 0.3 ? 14 * big : 0); n++;
  }
  const snowY = (x) => GY + (H - GY) * 0.2 + 12 * nS(x / 240) + 8 * nS(x / 70 + 9);
  const lamp = { x: W * (0.6 + 0.02 * tall), y: GY + (H - GY) * 0.62, h: 330 * big };
  const bench = { x: W * (0.6 + 0.02 * tall) + 190 * big, y: GY + (H - GY) * 0.6 };
  const TREES = [{ x: W * (0.12 + 0.03 * tall), y: GY + (H - GY) * 0.78, segs: tree(5, Math.min(H * 0.82, 760 * big)), c: 3, ph: 0.1 }, { x: W * (0.93 - 0.02 * tall), y: GY + (H - GY) * 0.45, segs: tree(9, Math.min(H * 0.6, 520 * big)), c: 4, ph: 0.6 }];
  const DRIFTS = Array.from({ length: Math.round(5 + W / 300) }, (_, i) => ({ x: hash(i, 21) * W, f: 0.3 + hash(i, 22) * 0.68, w: 120 + hash(i, 23) * 240 }));
  // flakes start at shares of the frame (u, v) and take their numbers by index, so a bigger frame only adds flakes
  const A = W * H, flakes = (k, n, r0, r1, vx, vy) => Array.from({ length: Math.round(n) }, (_, i) => { const h = (j) => hash(i, 40 + 10 * k + j); return { u: h(0), v: h(1), r: (r0 + h(2) * (r1 - r0)) * big, vx: vx * (0.7 + 0.6 * h(3)), vy: vy * (0.75 + 0.5 * h(4)), a: 8 + h(5) * 22, f: 0.05 + h(6) * 0.12, ph: h(7) }; });
  const SNOW = [flakes(0, A / 9000, 1.3, 2.4, 14, 26), flakes(1, A / 20000, 2.8, 4.2, 30, 52), flakes(2, A / 60000, 5, 8.5, 62, 104)];
  return { W, H, GY, tall, big, hillY, HOUSES, snowY, lamp, bench, TREES, DRIFTS, SNOW };
}

function flakes(ctx, G, t, k, fill) {
  const { W, H } = G, gust = (60 + 70 * k) * nW(t * 0.035 + k);
  // the time-growing part of each path is wrapped as a share of a crossing (of a 1800 by 900 frame), then scaled to this one
  const sx = W + 80, sy = H + 80;
  F(ctx, (c) => { for (const f of G.SNOW[k]) circle(c, frac(f.u + (f.vx * t) / 1880 + (gust + f.a * Math.sin(TAU * (t * f.f + f.ph))) / sx) * sx - 40, frac(f.v + (f.vy * t) / 980) * sy - 40, f.r); }, fill);
}

export function paint(ctx, p, t, G) {
  const { W, H, GY, big } = G;
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  ctx.fillStyle = N.sky; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = N.s2; ctx.fillRect(0, GY * 0.34, W, GY); ctx.fillStyle = N.s3; ctx.fillRect(0, GY * 0.6, W, GY); ctx.fillStyle = N.s4; ctx.fillRect(0, GY * 0.8, W, GY);
  crescent(ctx, W * 0.82 + sway(p, 0.03), GY * 0.2 + 8 * Math.sin((TAU * t) / 400), 44 * big, C.cream, -0.5);
  bars(ctx, CLOUDS, W, t, (y) => y * GY);

  // wooded hill behind the town
  layer(0.08, () => F(ctx, (c) => { c.moveTo(-90, GY); for (let x = -90; x <= W + 90; x += 12) c.lineTo(x, G.hillY(x)); c.lineTo(W + 90, GY); c.closePath(); for (let x = -90; x <= W + 90; x += 30) pine(c, x + 12 * hash(x, 1), G.hillY(x) + 6, (30 + 40 * hash(x, 2)) * big, (22 + 10 * hash(x, 3)) * big, 0, 3); }, N.hill));
  flakes(ctx, G, t, 0, N.shade);

  layer(0.2, () => {
    // chimney smoke, carried off downwind
    F(ctx, (c) => { for (const b of G.HOUSES) { if (b.kind === 2 || b.id % 2) continue; const sx = b.x + b.w * b.ch + 9 * big, sy = GY - b.h - b.rh * 0.7 - 20 * big, dt = 0.9, life = 9, n = Math.floor(t / dt);
      for (let k = Math.ceil(life / dt); k >= 0; k--) { const id = n - k, a = t - id * dt; if (a < 0 || a >= life) continue; circle(c, sx + (20 * a + 1.6 * a * a + 14 * Math.sin(a * 0.6 + id * 0.9 + b.id)) * big, sy - (26 * a - a * a * 0.7) * big, Math.max(0.5, (6 + 7 * Math.sqrt(a) + 4 * hash(id, b.id)) * (1 - Math.pow(a / life, 3)) * big)); } } }, N.s3);
    // walls, then roofs, then the snow lying on them
    for (const col of WALLS) F(ctx, (c) => { for (const b of G.HOUSES) if (b.col === col) { c.rect(b.x, GY - b.h, b.w + 1, b.h + 30); if (b.kind === 0) poly(c, [[b.x, GY - b.h], [b.x + b.w, GY - b.h], [b.x + b.w / 2, GY - b.h - b.rh]]); } }, col);
    F(ctx, (c) => { for (const b of G.HOUSES) { const top = GY - b.h, { x, w, rh } = b;
      if (b.kind === 2) { poly(c, [[x - 6, top], [x + w + 6, top], [x + w / 2, top - 150 * big]]); c.rect(x + w / 2 - 2, top - 176 * big, 4, 30 * big); c.rect(x + w / 2 - 10, top - 166 * big, 20, 4); continue; }
      c.rect(x + w * b.ch, top - rh * 0.7 - 22 * big, 18 * big, rh * 0.7 + 22 * big);
      if (b.kind === 1) poly(c, [[x - 7, top + 2], [x + 12, top - rh * 0.7], [x + w - 12, top - rh * 0.7], [x + w + 7, top + 2]]);
      c.rect(x + w * 0.5 - 13 * big, GY - 46 * big, 26 * big, 46 * big);
    } }, N.roof);
    F(ctx, (c) => { for (const b of G.HOUSES) { const top = GY - b.h, { x, w, rh } = b, k = 13 * big;
      if (b.kind === 2) { poly(c, [[x - 8, top + 3], [x + w / 2, top - 150 * big], [x + w * 0.62, top - 112 * big], [x + w * 0.2, top - 20 * big]]); continue; }
      pill(c, x + w * b.ch - 4 * big, top - rh * 0.7 - 28 * big, 26 * big, 11 * big);
      if (b.kind === 0) poly(c, [[x - 9, top + 4], [x + w / 2, top - rh - 5], [x + w + 9, top + 4], [x + w + 9 - k * 1.4, top + 4], [x + w / 2, top - rh + k], [x - 9 + k * 1.4, top + 4]]);
      else { poly(c, [[x + 8, top - rh * 0.7 - 5], [x + w - 8, top - rh * 0.7 - 5], [x + w + 2, top - rh * 0.28], [x - 2, top - rh * 0.28]]); pill(c, x - 10, top - 4, w + 20, 10 * big); }
    } }, N.snow);
    // windows: dark panes, and over them the ones that are lit just now
    for (const pass of [0, 1, 2]) F(ctx, (c) => { for (const b of G.HOUSES) { const top = GY - b.h, u = 46 * big;
      if (b.kind === 2) { if (pass === 0 || (pass === 1 && lit(b.id * 64, t, 0.85))) { c.rect(b.x + b.w / 2 - 9 * big, top + 40 * big, 18 * big, 44 * big); c.moveTo(b.x + b.w / 2 + 9 * big, top + 40 * big); c.arc(b.x + b.w / 2, top + 40 * big, 9 * big, 0, Math.PI, true); } continue; }
      const cols = Math.max(1, Math.floor((b.w - 16 * big) / u)), rows = b.h > 150 * big ? 2 : 1, x0 = b.x + (b.w - cols * u + 22 * big) / 2;
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const id = b.id * 64 + i * 8 + j, wx = x0 + i * u, wy = top + (22 + j * 62) * big; if (j === rows - 1 && Math.abs(wx + 12 * big - (b.x + b.w / 2)) < 26 * big) continue;
        const on = lit(id, t), warm = hash(id, 9) < 0.25; if (pass === 0 || (on && (pass === 2) === warm)) c.rect(wx, wy, 24 * big, 32 * big); }
    } }, [N.ink, C.gold, C.orange][pass]);
  });

  // the square under snow: a band of shade along the back, pale snow in front with blue hollows
  layer(0.35, () => {
    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 14) c.lineTo(x, GY - 6 + 6 * nS(x / 60 + 40)); c.lineTo(W + 90, H + 60); c.closePath(); }, N.shade);
    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 14) c.lineTo(x, G.snowY(x)); c.lineTo(W + 90, H + 60); c.closePath(); }, N.snow);
    F(ctx, (c) => { for (const d of G.DRIFTS) { const y = GY + (H - GY) * d.f; pill(c, d.x - d.w / 2, y, d.w * big, (8 + 14 * d.f) * big); } }, N.shade);
  });

  // the lamp's glow: flat discs that breathe with the flame, and its light lying on the snow
  const fl = 0.5 + 0.5 * Math.sin(t * 4.7) * Math.sin(t * 2.9) + 0.25 * nW(t * 1.3 + 50);
  layer(0.7, () => {
    const { x, y, h } = G.lamp, hy = y - h - 26 * big;
    F(ctx, (c) => circle(c, x, hy, (104 + 7 * fl) * big), N.halo);
    F(ctx, (c) => circle(c, x, hy, (62 + 6 * fl) * big), C.orange);
    F(ctx, (c) => el(c, x, y + 4 * big, (150 + 10 * fl) * big, (24 + 2 * fl) * big), C.cream);
  });
  flakes(ctx, G, t, 1, N.snow);

  layer(0.7, () => {
    const { x, y, h } = G.lamp, s = big;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const hh = h / s;
    F(ctx, (c) => { c.rect(-5, -hh, 10, hh); poly(c, [[-13, 0], [13, 0], [8, -34], [-8, -34]]); c.rect(-10, -hh * 0.55, 20, 6); c.rect(-14, -hh - 4, 28, 6); poly(c, [[-30, -hh - 50], [30, -hh - 50], [8, -hh - 72], [-8, -hh - 72]]); c.rect(-3, -hh - 82, 6, 12); }, N.ink);
    F(ctx, (c) => poly(c, [[-14, -hh - 4], [14, -hh - 4], [24, -hh - 50], [-24, -hh - 50]]), C.gold);
    F(ctx, (c) => el(c, 0, -hh - 24, 6 + 2 * fl, 12 + 3 * fl), C.cream);
    F(ctx, (c) => { pill(c, -30, -hh - 58, 60, 11); pill(c, -15, -6, 30, 10); }, N.near);
    ctx.restore();
    // the bench, with snow on its seat and along its back
    const b = G.bench; ctx.save(); ctx.translate(b.x, b.y); ctx.scale(s, s);
    F(ctx, (c) => { c.rect(-80, -40, 160, 9); c.rect(-80, -86, 160, 9); c.rect(-80, -68, 160, 9); for (const lx of [-70, 62]) { c.rect(lx, -90, 8, 90); c.rect(lx - 14, -44, 8, 44); } }, N.ink);
    F(ctx, (c) => { pill(c, -84, -50, 168, 12); pill(c, -82, -95, 164, 11); }, N.near);
    ctx.restore();
  });

  // bare trees, rocking a little; the flatter branches carry a line of snow
  for (const q of G.TREES) layer(0.9, () => {
    ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(0.012 * osc(p, q.c, q.ph) + 0.005 * osc(p, 11, q.ph)); ctx.lineCap = 'round';
    ctx.strokeStyle = N.ink;
    for (let d = 0; d <= 4; d++) { ctx.beginPath(); let w = 2; for (const s of q.segs) if (s[5] === d) { ctx.moveTo(s[0], s[1] + (d ? 0 : 30)); ctx.lineTo(s[2], s[3]); w = s[4]; } ctx.lineWidth = w; ctx.stroke(); }
    ctx.strokeStyle = N.near; ctx.lineWidth = 3.5 * big; ctx.beginPath();
    for (const s of q.segs) if (s[6] && s[5] > 0) { const o = s[4] / 2 + 1; ctx.moveTo(s[0] * 0.8 + s[2] * 0.2, s[1] * 0.8 + s[3] * 0.2 - o); ctx.lineTo(s[2], s[3] - o); }
    ctx.stroke();
    F(ctx, (c) => pill(c, -44 * big, -6, 88 * big, 16), N.near);
    ctx.restore();
  });
  flakes(ctx, G, t, 2, N.near);
}
