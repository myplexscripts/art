// Deep Series No. 02: Coral Garden. A shallow reef in bright water: a sand floor takes the lower part of the frame and
// the corals stand on it, small toward the back and large in front (brain domes, branching corals, sea fans, tube
// sponges, anemones and one giant clam). The surface's light lies on the sand as pale shapes that swell and slide.
// Four small schools wander, and a turtle crosses high up now and then. Extra width or height becomes more reef.
import { mulberry, clamp, osc, sway, noise1, poly, circle, TAU } from './geom.js?v=20261011-focus';
import { C, F } from './kit.js?v=20261011-focus';
import { hash, el } from './bits.js?v=20261011-focus';

export const title = 'CORAL GARDEN', no = 'No. 02', text = '#14506a', dark = '#0d3347';
const K = { w: ['#93ded3', '#63cbc9', '#3fb5c0', '#2c9fb3'], light: '#c9f1e2', reef1: '#1d8198', reef2: '#14607a', sand: '#e6d3a0', rip: '#cdb681', pink: '#e8718d', pinkD: '#c14f72', violet: '#7d55a8', violetD: '#4d3578' };
const nS = noise1(1201), nR = noise1(1207);
const surge = (p, lag = 0) => { const q = p - lag / 30; return 0.6 * osc(q, 4) + 0.3 * osc(q, 7, 0.3) + 0.25 * osc(q, 1, 0.6); };

// A fish as a pointed oval and a tail triangle, added to the current path. fx is its length along x, signed, so a fish
// that turns shortens and then points the other way; fy tips it; wag swings the tail.
function fish(c, x, y, s, fx, fy = 0, wag = 0) {
  const h = 0.34 * s * (fx < 0 ? -1 : 1), nx = x + fx * s, ny = y + fy * s, tx = x - fx * 0.7 * s, ty = y - fy * 0.7 * s, ex = x - fx * 1.3 * s, ey = y - fy * 1.3 * s + wag * s;
  c.moveTo(nx, ny); c.quadraticCurveTo(x, y - h * 1.5, tx, ty); c.quadraticCurveTo(x, y + h * 1.5, nx, ny); c.closePath();
  c.moveTo(x - fx * 0.5 * s, y - fy * 0.5 * s); c.lineTo(ex, ey - h * 1.1); c.lineTo(ex, ey + h * 1.1); c.closePath();
}
// A school wanders on slow unrelated sines; each fish follows the same track a little late, so they turn together.
function school(c, S, t) {
  const at = (tt) => [S.cx + S.rx * (0.62 * Math.sin(tt * S.f1 + S.a) + 0.38 * Math.sin(tt * S.f2 + S.b)), S.cy + S.ry * (0.6 * Math.sin(tt * S.f3 + S.b) + 0.4 * Math.sin(tt * S.f4 + S.a))];
  for (const f of S.fish) {
    const tt = t - f.lag, [x, y] = at(tt), [x1, y1] = at(tt + 0.5), vx = (x1 - x) * 2, vy = (y1 - y) * 2;
    fish(c, x + f.ox, y + f.oy + 3 * Math.sin(t * 1.3 + f.ph * 9), f.s, clamp(vx / S.v, -1, 1), clamp(vy / S.v, -0.5, 0.5) * 0.6, 0.12 * Math.sin(t * 6 + f.ph * 20));
  }
}
const makeSchool = (r, n, cx, cy, rx, ry, s, spread) => ({ cx, cy, rx, ry, v: rx * 0.012, f1: 0.05 + 0.02 * r(), f2: 0.021 + 0.01 * r(), f3: 0.043 + 0.02 * r(), f4: 0.017 + 0.01 * r(), a: r() * TAU, b: r() * TAU,
  fish: Array.from({ length: n }, () => ({ ox: (r() - 0.5) * spread * 2, oy: (r() - 0.5) * spread * 0.9, lag: r() * 2.2, s: s * (0.8 + 0.4 * r()), ph: r() })) });

// a branching coral, grown once: tapered limbs as four-cornered pieces, with the tips kept for their pale ends
function grow(r, s) {
  const limbs = [], tips = [];
  const go = (x, y, a, len, w, d) => {
    const x1 = x + Math.sin(a) * len, y1 = y - Math.cos(a) * len, w1 = w * 0.7, nx = Math.cos(a), ny = Math.sin(a);
    limbs.push([[x - nx * w, y - ny * w], [x + nx * w, y + ny * w], [x1 + nx * w1, y1 + ny * w1], [x1 - nx * w1, y1 - ny * w1]]);
    if (d === 0) { tips.push([x1, y1, w1 * 1.25]); return; }
    limbs.push([x1, y1, w1]);
    const n = d > 2 ? 3 : 2;
    for (let k = 0; k < n; k++) go(x1, y1, a + (k - (n - 1) / 2) * (0.75 + 0.3 * r()) + (r() - 0.5) * 0.3, len * (0.66 + 0.2 * r()), w1, d - 1);
  };
  go(0, 0, (r() - 0.5) * 0.2, 46 * s, 9 * s, 3);
  return { limbs, tips };
}

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall;
  // Item i of list L takes its numbers from hash, so it has the same ones at every size, and a bigger frame only
  // adds items at the end of a list. The shafts' count is not rounded, so their row stretches smoothly.
  const h = (L, i, k) => hash(L * 1000 + i, 700 + k);
  const SY = H * (0.66 - 0.06 * tall), depth = H - SY;
  const bandY = [-20, SY * 0.24, SY * 0.52, SY * 0.8];
  const ns = W / 300 + 2;
  const SHAFTS = Array.from({ length: Math.ceil(ns) }, (_, i) => ({ x: W * ((i + 0.2 + 0.6 * h(0, i, 0)) / ns) + W * 0.04, w: 30 + 60 * h(0, i, 1), len: SY * (0.6 + 0.5 * h(0, i, 2)), slant: -W * 0.04 - 60 * h(0, i, 3), c: 1 + (i % 3), ph: h(0, i, 4) }));
  const sandY = (x) => SY + 16 * nS(x / 330) + 6 * nS(x / 71 + 9);
  const reef1 = (x) => SY - H * 0.03 - H * 0.1 * Math.pow(Math.abs(nR(x / 260)), 0.8) - 10 * nR(x / 37);
  const reef2 = (x) => SY - H * 0.01 - H * 0.06 * Math.pow(Math.abs(nR(x / 190 + 30)), 0.8) - 8 * nR(x / 29 + 5);
  // the garden: kinds dealt out in turn so every kind shows, spread across the width, then sorted back to front
  const n = clamp(Math.round((W * depth) / 25000), 14, 30), KINDS = ['brain', 'branch', 'fan', 'sponge', 'anemone', 'brain', 'branch', 'anemone', 'fan'];
  const ITEMS = Array.from({ length: n }, (_, i) => {
    const r = mulberry(1211 + i * 7919), u =0.06 + 0.9 * Math.pow(r(), 0.85), s = big * (0.6 + 0.85 * u), kind = KINDS[i % KINDS.length], it = { kind, x: W * ((((i * 0.618 + 0.1) % 1) * 0.96) + 0.02), y: SY + depth * u, u, s, id: i, v: Math.floor(r() * 3), lag: r() * 2 };
    if (kind === 'branch') Object.assign(it, grow(r, s * 1.2));
    if (kind === 'sponge') it.tubes = Array.from({ length: 3 + Math.floor(r() * 3) }, (_, k) => [(k - 1.5) * 26 + 8 * r(), 50 + 70 * r(), 22 + 8 * r()]);
    return it;
  });
  const cx = W * (0.3 + 0.08 * tall);
  // keep the clam clear of its neighbours
  for (let i = ITEMS.length - 1; i >= 0; i--) if (Math.abs(ITEMS[i].x - cx) < 210 * big && ITEMS[i].u > 0.45) ITEMS.splice(i, 1);
  ITEMS.push({ kind: 'clam', x: cx, y: SY + depth * 0.82, u: 0.82, s: big * 1.15, id: 99, lag: 0 });
  ITEMS.sort((a, b) => a.y - b.y);
  const RIPPLES = Array.from({ length: Math.round((W * depth) / 14000) }, (_, i) => { const u = h(1, i, 0); return { x: h(1, i, 1) * W, y: SY + 20 + (depth - 20) * u, w: (30 + 60 * h(1, i, 2)) * (0.5 + u) * big, u }; });
  const LIGHT = Array.from({ length: Math.round((W * depth) / 30000) + 4 }, (_, i) => { const u = h(2, i, 0); return { x: h(2, i, 1) * W, y: SY + 26 + (depth - 26) * u, w: (50 + 80 * h(2, i, 2)) * (0.5 + 0.9 * u) * big, c: 3 + Math.floor(h(2, i, 3) * 5), ph: h(2, i, 4) }; });
  const SCHOOLS = [
    [makeSchool(mulberry(1213), 20, W * 0.5, SY * 0.42, W * 0.4, SY * 0.22, 9 * big, 80 * big), K.violetD],
    [makeSchool(mulberry(1217), 11, W * 0.45, SY * 0.7, W * 0.38, SY * 0.16, 12 * big, 70 * big), C.cream],
    [makeSchool(mulberry(1223), 16, W * 0.5, SY * 0.62 + depth * 0.2, W * 0.4, SY * 0.2, 16 * big, 100 * big), C.gold],
    [makeSchool(mulberry(1229), 10, W * 0.55, SY * 0.9 + depth * 0.3, W * 0.36, depth * 0.3, 20 * big, 90 * big), C.orange],
  ];
  // a bubble keeps a share of the way up (u) and a rate in trips a second (v, its old speed over a frame 900 high),
  // so the wrap never depends on the size
  const BUB = Array.from({ length: Math.round(10 + W / 110) }, (_, i) => ({ u: h(3, i, 0), v: (38 + h(3, i, 1) * 46) / 960, r: 2 + h(3, i, 2) * 4.5, ph: h(3, i, 3), f: 0.25 + h(3, i, 4) * 0.5 }));
  return { W, H, tall, big, SY, depth, bandY, SHAFTS, sandY, reef1, reef2, ITEMS, RIPPLES, LIGHT, SCHOOLS, BUB };
}

function shafts(c, G, p) {
  for (const s of G.SHAFTS) { const a = s.x + 26 * osc(p, s.c, s.ph), b = a + s.slant + 46 * osc(p, s.c, s.ph + 0.15) + 30 * osc(p, 1, s.ph); poly(c, [[a - s.w * 0.5, -20], [a + s.w * 0.5, -20], [b + s.w * 1.4, s.len], [b - s.w * 1.4, s.len]]); }
}
// Water in flat bands, lightest at the top. Where a shaft crosses a band it takes the colour of the band above.
function water(ctx, G, p, t, cols, light) {
  const { W, H } = G;
  cols.forEach((col, j) => {
    const top = (c) => { c.moveTo(-20, H + 20); for (let x = -20; x <= W + 60; x += 60) c.lineTo(x, j ? G.bandY[j] + 12 * Math.sin(x / 260 + t * 0.21 + j * 2.1) + 7 * Math.sin(x / 97 - t * 0.17 + j) : -20); c.lineTo(W + 60, H + 20); c.closePath(); };
    F(ctx, top, col);
    ctx.save(); ctx.beginPath(); top(ctx); ctx.clip(); F(ctx, (c) => shafts(c, G, p), j ? cols[j - 1] : light); ctx.restore();
  });
}
const dome = (c, x, y, w, h) => { c.moveTo(x - w, y); c.bezierCurveTo(x - w, y - h * 1.33, x + w, y - h * 1.33, x + w, y); c.closePath(); };

// each kind of coral, drawn about its foot at 0,0 in its own scale
const DRAW = {
  brain(ctx, it) {
    const [a, b] = it.v ? [K.pink, K.pinkD] : [C.orange, C.rust];
    F(ctx, (c) => dome(c, 0, 0, 62, 48), a);
    ctx.strokeStyle = b; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath();
    for (let k = 1; k < 4; k++) { const w = 62 * (1 - k * 0.24), h = 48 * (1 - k * 0.24); ctx.moveTo(-w, -5); ctx.bezierCurveTo(-w, -h * 1.33 - 2, w * 0.4, -h * 1.33 - 2, w * 0.75, -h * 0.7); }
    ctx.stroke();
  },
  branch(ctx, it, p) {
    // drawn at the scale it was grown in, so undo the item's
    ctx.scale(1 / it.s, 1 / it.s); ctx.rotate(0.02 * surge(p, it.lag));
    F(ctx, (c) => { for (const l of it.limbs) l.length === 4 ? poly(c, l) : circle(c, l[0], l[1], l[2]); }, [C.orange, K.violet, K.pink][it.v]);
    F(ctx, (c) => { for (const q of it.tips) circle(c, q[0], q[1], q[2]); }, it.v === 1 ? K.pink : C.cream);
  },
  fan(ctx, it, p) {
    // a sea fan leans over with the surge and comes back
    ctx.rotate(0.16 * surge(p, it.lag) + 0.04 * osc(p, 9, it.id * 0.3));
    const [a, b] = it.v === 1 ? [C.gold, C.orange] : [K.violet, K.violetD], R = 120;
    F(ctx, (c) => { c.moveTo(-5, 0); for (let k = 0; k <= 12; k++) { const an = -1.05 + (k / 12) * 2.1, rr = R * (0.9 + 0.1 * Math.cos(k * Math.PI)) * (1 - 0.12 * an * an); c.lineTo(Math.sin(an) * rr, -Math.cos(an) * rr); } c.lineTo(5, 0); c.closePath(); }, a);
    ctx.strokeStyle = b; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath();
    for (let k = 0; k < 7; k++) { const an = -0.9 + (k / 6) * 1.8, rr = R * 0.84 * (1 - 0.12 * an * an); ctx.moveTo(0, -4); ctx.lineTo(Math.sin(an) * rr, -Math.cos(an) * rr); for (const d of [-0.13, 0.13]) { ctx.moveTo(Math.sin(an) * rr * 0.55, -Math.cos(an) * rr * 0.55); ctx.lineTo(Math.sin(an + d) * rr * 0.9, -Math.cos(an + d) * rr * 0.9); } }
    ctx.stroke();
  },
  sponge(ctx, it, p) {
    const [a, b] = it.v === 1 ? [K.violet, K.violetD] : [C.gold, C.rust];
    F(ctx, (c) => { for (const [x, h, w] of it.tubes) { c.rect(x - w / 2, -h, w, h + 4); el(c, x, 2, w / 2, w * 0.2); } }, a);
    // the mouths breathe a little
    F(ctx, (c) => it.tubes.forEach(([x, h, w], k) => el(c, x, -h, w / 2, w * (0.2 + 0.03 * osc(p, 5, k * 0.2 + it.id * 0.1)))), b);
  },
  anemone(ctx, it, p) {
    const [a, b] = it.v === 1 ? [C.orange, C.cream] : [K.pink, C.cream], n = 11, tips = [];
    F(ctx, (c) => poly(c, [[-22, 4], [22, 4], [16, -30], [-16, -30]]), it.v === 1 ? C.rust : K.pinkD);
    // tentacles: each curls on its own time and all of them lean with the surge
    ctx.strokeStyle = a; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath();
    const g = surge(p, it.lag);
    for (let k = 0; k < n; k++) {
      const a0 = -1.25 + (k / (n - 1)) * 2.5, L = 62 + 20 * hash(it.id, k), a1 = a0 + 0.55 * osc(p, 5 + (k % 3), it.id * 0.1 + k * 0.13) + 0.45 * g;
      const mx = Math.sin(a0) * L * 0.6, my = -30 - Math.cos(a0) * L * 0.6, tx = mx + Math.sin(a1) * L * 0.5, ty = my - Math.cos(a1) * L * 0.5;
      ctx.moveTo((k - (n - 1) / 2) * 3, -28); ctx.quadraticCurveTo(mx, my, tx, ty); tips.push([tx, ty]);
    }
    ctx.stroke();
    F(ctx, (c) => { for (const q of tips) circle(c, q[0], q[1], 5.5); }, b);
  },
  clam(ctx, it, p) {
    // the giant clam opens and closes so slowly it is hard to catch it moving
    const gap = 8 + 9 * (0.5 + 0.5 * osc(p, 2, 0.3)), lip = (u) => -58 + 15 * Math.sin(u * Math.PI * 3.5);
    F(ctx, (c) => { el(c, 0, -52, 112, 62); }, K.violetD);
    F(ctx, (c) => { c.moveTo(-98, lip(-1)); for (let k = 0; k <= 40; k++) { const u = -1 + k / 20; c.lineTo(u * 98, lip(u) - (gap + 9) * Math.sqrt(Math.max(0, 1 - u * u))); } for (let k = 40; k >= 0; k--) { const u = -1 + k / 20; c.lineTo(u * 98, lip(u) + (gap + 9) * Math.sqrt(Math.max(0, 1 - u * u))); } c.closePath(); }, K.violet);
    F(ctx, (c) => { c.moveTo(-84, lip(-0.86)); for (let k = 0; k <= 40; k++) { const u = -0.86 + k * 0.043; c.lineTo(u * 98, lip(u) - gap * 0.45 * Math.sqrt(Math.max(0, 1 - (u / 0.86) ** 2))); } for (let k = 40; k >= 0; k--) { const u = -0.86 + k * 0.043; c.lineTo(u * 98, lip(u) + gap * 0.45 * Math.sqrt(Math.max(0, 1 - (u / 0.86) ** 2))); } c.closePath(); }, dark);
    F(ctx, (c) => { for (let k = 0; k < 9; k++) { const u = -0.8 + k * 0.2; circle(c, u * 98, lip(u) - (gap * 0.45 + 6) * Math.sqrt(1 - u * u) * (k % 2 ? 1 : -1), 3.6); } }, C.gold);
  },
};

// a turtle, facing right: shell, head and flippers; the front flippers row
function turtle(ctx, x, y, s, dir, t, fill) {
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s); ctx.rotate(-0.08 + 0.04 * Math.sin(t * 0.7));
  const a = 2.1 + 0.75 * Math.sin(t * 1.5), b = 2.5 + 0.3 * Math.sin(t * 1.5 - 1);
  F(ctx, (c) => {
    el(c, 0, 0, 48, 29); el(c, 56, -3, 15, 10);
    poly(c, [[34, 2], [12, 6], [20 + Math.cos(a) * 74, 4 + Math.sin(a) * 74], [26 + Math.cos(a) * 40, 12 + Math.sin(a) * 40]]);
    poly(c, [[-30, 6], [-44, 2], [-40 + Math.cos(b) * 38, 8 + Math.sin(b) * 38]]);
    poly(c, [[-44, -4], [-44, 5], [-60, 2]]);
  }, fill);
  ctx.restore();
}

export function paint(ctx, p, t, G) {
  const { W, H, SY, depth, big } = G;
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  const ridge = (top) => (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 10) c.lineTo(x, top(x)); c.lineTo(W + 90, H + 60); c.closePath(); };
  water(ctx, G, p, t, K.w, K.light);
  layer(0.08, () => F(ctx, ridge(G.reef1), K.reef1));
  F(ctx, (c) => school(c, G.SCHOOLS[0][0], t), G.SCHOOLS[0][1]);
  // a turtle glides through high up in some of the slots
  { const slot = 75, n = Math.floor(t / slot), q = mulberry(n * 4513 + 6), go = q() < 0.7, dir = q() < 0.5 ? -1 : 1, u = (t - n * slot - 2 - q() * 12) / 55, y0 = SY * (0.14 + 0.25 * q());
    if (go && u >= 0 && u <= 1) { const x = dir > 0 ? -140 + u * (W + 280) : W + 140 - u * (W + 280); turtle(ctx, x, y0 + 22 * Math.sin(t * 0.31) - SY * 0.06 * u, 1.25 * big, dir, t, K.reef2); } }
  layer(0.16, () => F(ctx, ridge(G.reef2), K.reef2));
  F(ctx, (c) => school(c, G.SCHOOLS[1][0], t), G.SCHOOLS[1][1]);

  // the sand, its ripple marks, and the light from the surface sliding over it
  layer(0.3, () => {
    F(ctx, ridge(G.sandY), K.sand);
    F(ctx, (c) => { for (const l of G.LIGHT) { const w = l.w * (0.55 + 0.45 * osc(p, l.c, l.ph)); if (w > 8) el(c, l.x + 40 * osc(p, 2, l.ph) + 14 * osc(p, l.c + 2, l.ph * 3), l.y + 5 * osc(p, 3, l.ph * 2), w, w * 0.16, 0.12 * osc(p, 3, l.ph)); } }, C.cream);
    ctx.strokeStyle = K.rip; ctx.lineCap = 'round'; ctx.lineWidth = 3 * big; ctx.beginPath();
    for (const q of G.RIPPLES) { ctx.moveTo(q.x - q.w / 2, q.y); ctx.quadraticCurveTo(q.x, q.y - q.w * 0.09, q.x + q.w / 2, q.y); }
    ctx.stroke();
  });

  ctx.depthLayer?.('garden');
  for (const it of G.ITEMS) {
    if (it.u > .65) ctx.depthLayer?.('near');
    ctx.save(); ctx.translate(it.x + sway(p, 0.3 + 0.55 * it.u), it.y); ctx.scale(it.s, it.s);
    DRAW[it.kind](ctx, it, p, t); ctx.restore();
  }
  for (const k of [2, 3]) F(ctx, (c) => school(c, G.SCHOOLS[k][0], t), G.SCHOOLS[k][1]);

  ctx.depthLayer?.('bubbles');
  { const span = H + 60; ctx.strokeStyle = C.cream; ctx.lineWidth = 2.5; ctx.beginPath();
    G.BUB.forEach((b, i) => { const d = b.u + b.v * t, n = Math.floor(d); circle(ctx, hash(i, n) * W + 12 * Math.sin(TAU * (t * b.f + b.ph)), H + 30 - (d - n) * span, b.r * big); });
    ctx.stroke(); }
}
