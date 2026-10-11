// Deep Series No. 01: Kelp Forest. Kelp stalks stand on a rocky bottom and run off the top of the frame, in three
// depths: pale and small far away, dark and large up close. One surge moves all of them, each stalk a little late and
// the top of a stalk later than its foot, so the forest leans over together and comes back. Bands of water darken
// with depth and carry shafts of light; a school of gold fish threads between the middle and the near stalks.
// Extra width becomes more stalks, extra height taller ones.
import { mulberry, clamp, osc, sway, noise1, poly, circle, frac, TAU } from './geom.js?v=20261011-focus';
import { C, F } from './kit.js?v=20261011-focus';
import { hash } from './bits.js?v=20261011-focus';

export const title = 'KELP FOREST', no = 'No. 01', text = '#0f3a3a', dark = '#07201f';
const K = { w: ['#4ea892', '#35887c', '#256d69', '#185458'], light: '#c3d88c', far: '#5aa583', mid: '#4d7130', near: '#0f3326', rock1: '#1c5c57', rock2: '#12393c', ink: '#07201f' };
const nR = noise1(1103), nQ = noise1(1109);
// the surge: one slow push and pull for the whole scene, read a little later by whatever lags behind
const surge = (p, lag = 0) => { const q = p - lag / 30; return 0.6 * osc(q, 4) + 0.3 * osc(q, 7, 0.3) + 0.25 * osc(q, 1, 0.6); };

// A fish as a pointed oval and a tail triangle, added to the current path. fx is its length along x, signed, so a fish
// that turns shortens and then points the other way; fy tips it; wag swings the tail.
function fish(c, x, y, s, fx, fy = 0, wag = 0) {
  const h = 0.34 * s * (fx < 0 ? -1 : 1), nx = x + fx * s, ny = y + fy * s, tx = x - fx * 0.7 * s, ty = y - fy * 0.7 * s, ex = x - fx * 1.3 * s, ey = y - fy * 1.3 * s + wag * s;
  c.moveTo(nx, ny); c.quadraticCurveTo(x, y - h * 1.5, tx, ty); c.quadraticCurveTo(x, y + h * 1.5, nx, ny); c.closePath();
  c.moveTo(x - fx * 0.5 * s, y - fy * 0.5 * s); c.lineTo(ex, ey - h * 1.1); c.lineTo(ex, ey + h * 1.1); c.closePath();
}
// A school wanders on slow unrelated sines. Each fish keeps its own place and follows the same track a little late,
// so the school turns together, leaders first.
function school(c, S, t) {
  const at = (tt) => [S.cx + S.rx * (0.62 * Math.sin(tt * S.f1 + S.a) + 0.38 * Math.sin(tt * S.f2 + S.b)), S.cy + S.ry * (0.6 * Math.sin(tt * S.f3 + S.b) + 0.4 * Math.sin(tt * S.f4 + S.a))];
  for (const f of S.fish) {
    const tt = t - f.lag, [x, y] = at(tt), [x1, y1] = at(tt + 0.5), vx = (x1 - x) * 2, vy = (y1 - y) * 2;
    fish(c, x + f.ox, y + f.oy + 3 * Math.sin(t * 1.3 + f.ph * 9), f.s, clamp(vx / S.v, -1, 1), clamp(vy / S.v, -0.5, 0.5) * 0.6, 0.12 * Math.sin(t * 6 + f.ph * 20));
  }
}
const makeSchool = (r, n, cx, cy, rx, ry, s, spread) => ({ cx, cy, rx, ry, v: rx * 0.012, f1: 0.05 + 0.02 * r(), f2: 0.021 + 0.01 * r(), f3: 0.043 + 0.02 * r(), f4: 0.017 + 0.01 * r(), a: r() * TAU, b: r() * TAU,
  fish: Array.from({ length: n }, () => ({ ox: (r() - 0.5) * spread * 2, oy: (r() - 0.5) * spread * 0.9, lag: r() * 2.2, s: s * (0.8 + 0.4 * r()), ph: r() })) });

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall;
  // Item i of list L takes its numbers from hash, so it has the same ones at every size. A row's count n is not
  // rounded: the row stretches smoothly as the frame widens and new things come in at the right-hand end.
  const h = (L, i, k) => hash(L * 1000 + i, 700 + k);
  const FY = H * (0.9 - 0.03 * tall);                          // where the middle rocks stand
  const bandY = [-20, H * 0.22, H * 0.47, H * 0.7];
  const ns = W / 320 + 2;
  const SHAFTS = Array.from({ length: Math.ceil(ns) }, (_, i) => ({ x: W * ((i + 0.2 + 0.6 * h(0, i, 0)) / ns) + W * 0.05, w: 26 + 50 * h(0, i, 1), len: H * (0.5 + 0.42 * h(0, i, 2)), slant: -W * 0.05 - 70 * h(0, i, 3), c: 1 + (i % 3), ph: h(0, i, 4) }));
  // a stand of kelp: stalks spread along the width, each with its own lag behind the surge
  const stand = (L, n, s, y) => Array.from({ length: Math.ceil(n) }, (_, i) => ({ x: -60 + (W + 120) * ((i + 0.15 + 0.7 * h(L, i, 0)) / n), y: y + 30 * h(L, i, 1), s: s * (0.8 + 0.4 * h(L, i, 2)), lag: 0.4 + h(L, i, 3) * 2.6, ph: h(L, i, 4), id: L * 1000 + i }));
  const FAR = stand(1, W / 150 + 2, 0.55 * big, FY - 50 * big), MID = stand(2, W / 250 + 2, 0.9 * big, FY + 16), NEAR = stand(3, W / 520 + 2, 1.5 * big, H + 30);
  const farTop = (x) => FY - 46 * big - 60 * big * Math.abs(nR(x / 170)) - 12 * nR(x / 31);
  const midTop = (x) => FY - 8 * big - 56 * big * Math.pow(Math.abs(nQ(x / 210 + 7)), 0.7) - 8 * nQ(x / 27);
  const nearTop = (x) => H - 26 * big - H * 0.06 * Math.abs(nR(x / 260 + 40)) - 9 * nR(x / 37 + 3) - H * 0.04 * Math.cos(clamp(x / W) * TAU);
  const URCHINS = Array.from({ length: Math.ceil(W / 240) }, (_, i) => { const x = W * ((i + h(4, i, 0)) / (W / 240)); return { x, y: midTop(x) + 2, r: (11 + 9 * h(4, i, 1)) * big, ph: h(4, i, 2) }; });
  const STARS = Array.from({ length: Math.ceil(W / 420 + 1) }, (_, i) => { const x = W * ((i + 0.2 + 0.6 * h(5, i, 0)) / (W / 420 + 1)); return { x, y: midTop(x) + (22 + 20 * h(5, i, 1)) * big, r: (13 + 7 * h(5, i, 2)) * big, a: h(5, i, 3) * TAU, ph: h(5, i, 4) }; });
  const GOLD = makeSchool(mulberry(1101), 26, W * 0.5, H * 0.5, W * 0.4, H * 0.2, 19 * big, 130 * big), ORANGE = makeSchool(mulberry(1117), 9, W * 0.5, H * 0.3, W * 0.36, H * 0.14, 12 * big, 70 * big);
  // Bubbles and specks keep a share of the way across or up (u, x, y) and a rate in crossings a second (v, d), so
  // the wrap never depends on the size. The rates are the old speeds over a frame 1800 wide and 900 high.
  const BUB = Array.from({ length: Math.round(14 + W / 90) }, (_, i) => ({ u: h(6, i, 0), v: (34 + h(6, i, 1) * 46) / 960, r: 2 + h(6, i, 2) * 4.5, ph: h(6, i, 3), f: 0.25 + h(6, i, 4) * 0.5 }));
  const SPECK = Array.from({ length: Math.round(30 + W / 40) }, (_, i) => ({ x: h(7, i, 0), y: h(7, i, 1), d: (4 + h(7, i, 2) * 10) / 1800, v: (3 + h(7, i, 3) * 7) / 900, r: 1.2 + h(7, i, 4) * 2, lag: h(7, i, 5) * 3, ph: h(7, i, 6) }));
  return { W, H, tall, big, FY, bandY, SHAFTS, FAR, MID, NEAR, farTop, midTop, nearTop, URCHINS, STARS, GOLD, ORANGE, BUB, SPECK };
}

// shafts of light as flat wedges from above; the foot of each wanders more than its head
function shafts(c, G, p) {
  for (const s of G.SHAFTS) { const a = s.x + 26 * osc(p, s.c, s.ph), b = a + s.slant + 46 * osc(p, s.c, s.ph + 0.15) + 30 * osc(p, 1, s.ph); poly(c, [[a - s.w * 0.5, -20], [a + s.w * 0.5, -20], [b + s.w * 1.4, s.len], [b - s.w * 1.4, s.len]]); }
}
// Water in flat bands, darker with depth, each with a slow wavy top. Where a shaft crosses a band it takes the colour
// of the band above, so the light dims as it goes down without any new ink.
function water(ctx, G, p, t, cols, light) {
  const { W, H } = G;
  cols.forEach((col, j) => {
    const top = (c) => { c.moveTo(-20, H + 20); for (let x = -20; x <= W + 60; x += 60) c.lineTo(x, j ? G.bandY[j] + 12 * Math.sin(x / 260 + t * 0.21 + j * 2.1) + 7 * Math.sin(x / 97 - t * 0.17 + j) : -20); c.lineTo(W + 60, H + 20); c.closePath(); };
    F(ctx, top, col);
    ctx.save(); ctx.beginPath(); top(ctx); ctx.clip(); F(ctx, (c) => shafts(c, G, p), j ? cols[j - 1] : light); ctx.restore();
  });
}

// One stand of kelp: stems as one stroke, blades as one fill, float bulbs as another.
function kelp(ctx, list, p, t, stem, blade, bulb) {
  const nodes = [];
  for (const k of list) {
    const seg = 74 * k.s, n = Math.ceil((k.y + 60) / seg) + 1, a = [];
    for (let i = 0; i <= n; i++) {
      const h = i * seg, g = surge(p, k.lag + h * 0.0016);
      a.push([k.x + 52 * k.s * Math.min(1.7, h / 420) * g + 7 * k.s * Math.min(1, h / 200) * Math.sin(h / (90 * k.s) + t * 0.5 + k.ph * 6), k.y - h, g]);
    }
    nodes.push(a);
  }
  ctx.strokeStyle = stem; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  list.forEach((k, j) => { ctx.lineWidth = 7 * k.s; ctx.beginPath(); const a = nodes[j]; ctx.moveTo(a[0][0], a[0][1]); for (let i = 1; i < a.length; i++) ctx.lineTo(a[i][0], a[i][1]); ctx.stroke(); });
  // blades leave the stem on alternate sides and stream the way the water is going
  F(ctx, (c) => list.forEach((k, j) => { const a = nodes[j];
    for (let i = 2; i < a.length; i++) {
      const [bx, by, g] = a[i], side = i % 2 ? 1 : -1, an = 0.5 + 0.35 * hash(k.id, i) + 0.12 * osc(p, 6, k.ph + i * 0.07);
      let dx = side * Math.cos(an) + 0.55 * g, dy = -Math.sin(an) * (0.7 + 0.3 * hash(k.id, i + 50)); const l = Math.hypot(dx, dy); dx /= l; dy /= l;
      const L = (74 + 56 * hash(k.id, i + 100)) * k.s, w = L * 0.3, mx = bx + dx * L * 0.5, my = by + dy * L * 0.5;
      c.moveTo(bx, by); c.quadraticCurveTo(mx + dy * w, my - dx * w, bx + dx * L, by + dy * L); c.quadraticCurveTo(mx - dy * w, my + dx * w, bx, by); c.closePath();
    } }), blade);
  F(ctx, (c) => list.forEach((k, j) => { const a = nodes[j]; for (let i = 2; i < a.length; i++) circle(c, a[i][0] + (i % 2 ? 1 : -1) * 5 * k.s, a[i][1] - 3 * k.s, 6.5 * k.s); }), bulb);
}
const ridge = (c, W, H, top) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 10) c.lineTo(x, top(x)); c.lineTo(W + 90, H + 60); c.closePath(); };

export function paint(ctx, p, t, G) {
  const { W, H, big } = G;
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  water(ctx, G, p, t, K.w, K.light);

  layer(0.12, () => { kelp(ctx, G.FAR, p, t, K.far, K.far, K.far); F(ctx, (c) => ridge(c, W, H, G.farTop), K.rock1); });
  F(ctx, (c) => school(c, G.ORANGE, t), C.orange);
  ctx.depthLayer?.('middle');
  layer(0.4, () => {
    kelp(ctx, G.MID, p, t, K.mid, K.mid, K.light);
    F(ctx, (c) => ridge(c, W, H, G.midTop), K.rock2);
    // urchins bristle on the rocks; sea stars creep round so slowly it hardly shows
    ctx.strokeStyle = K.ink; ctx.lineWidth = 2.5 * big; ctx.lineCap = 'round'; ctx.beginPath();
    for (const u of G.URCHINS) for (let k = 0; k < 13; k++) { const a = Math.PI + (k / 12) * Math.PI + 0.08 * osc(p, 5 + (k % 3), u.ph + k * 0.1), l = u.r * (1.7 + 0.5 * hash(k, 3)); ctx.moveTo(u.x, u.y); ctx.lineTo(u.x + Math.cos(a) * l, u.y + Math.sin(a) * l); }
    ctx.stroke();
    F(ctx, (c) => { for (const u of G.URCHINS) circle(c, u.x, u.y, u.r); }, K.ink);
    F(ctx, (c) => { for (const s of G.STARS) { const pts = [], a0 = s.a + 0.25 * osc(p, 1, s.ph); for (let k = 0; k < 10; k++) { const a = a0 + (k * TAU) / 10, rr = k % 2 ? s.r * 0.42 : s.r; pts.push([s.x + Math.cos(a) * rr, s.y + Math.sin(a) * rr]); } poly(c, pts); } }, C.orange);
  });
  ctx.depthLayer?.('fish');
  F(ctx, (c) => school(c, G.GOLD, t), C.gold);

  // bubbles climb in loose columns and come in again somewhere else
  { const span = H + 60; ctx.strokeStyle = C.cream; ctx.lineWidth = 2; ctx.beginPath();
    G.BUB.forEach((b, i) => { const d = b.u + b.v * t, n = Math.floor(d); circle(ctx, hash(i, n) * W + 12 * Math.sin(TAU * (t * b.f + b.ph)), H + 30 - (d - n) * span, b.r * big); });
    ctx.stroke(); }

  ctx.depthLayer?.('near');
  layer(0.9, () => { kelp(ctx, G.NEAR, p, t, K.near, K.near, K.mid); F(ctx, (c) => ridge(c, W, H, G.nearTop), K.ink); });
  // specks in the water ride the surge back and forth
  F(ctx, (c) => { for (const f of G.SPECK) circle(c, frac(f.x + f.d * t + (30 * surge(p, f.lag)) / W) * W, frac(f.y - f.v * t) * H, f.r * big); }, C.cream);
}
