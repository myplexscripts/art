// Weather Series No. 05: After the Rain. Rolling green hills with a rainbow of five flat bands standing behind them;
// the rain cloud has pulled back to the right edge and its last rain still falls far off, while the sun comes out with
// flat rays that turn slowly. In front a wet lane runs away over the nearest hill, and a branch hangs in from the top
// left corner: drops swell at three leaf tips, fall, and spread rings in the puddles right underneath. Birds come back
// in ones and in small flocks. The lane and branch hang off the left edge, the cloud off the right.
import { mulberry, clamp, frac, lerp, osc, sway, noise1, poly, circle, pill, TAU } from './geom.js?v=20261011-clock-fix';
import { C, F } from './kit.js?v=20261011-clock-fix';
import { hash, el, bez, bezT, bars } from './bits.js?v=20261011-clock-fix';

export const title = 'AFTER THE RAIN', no = 'No. 05', text = '#1d4034', dark = '#12281f';
const R = { sky: '#8fbfd3', ray: '#a6d0dd', in: '#b9dde4', c1: '#8797a8', c2: '#66778b', c3: '#4d5d73', rain: '#6f93ab', red: '#c65a44', green: '#6aa86c', blue: '#4f84a6', h0: '#a5cfa4', h1: '#84bd83', h2: '#62a865', h3: '#459053', h4: '#2f7645', lane: '#b09465', rim: '#8a7350', leaf: '#1f5236', ink: '#143024' };
const BOW = [R.red, C.orange, C.gold, R.green, R.blue];
const HILLS = [R.h0, R.h1, R.h2, R.h3, R.h4];
const nH = noise1(1103), nW = noise1(1109), nB = noise1(1117);
const PUFFS = [[0.1, 0.34, 300, 26, C.cream, 5], [0.16, 0.4, 170, 18, C.cream, 5], [0.45, 0.1, 260, 22, C.cream, 7], [0.3, 0.62, 220, 16, R.in, 9]];
// the rain cloud, back to front: [x from its left edge, y, width, height, tone] in shares of its own box
const CLOUD = [[0.1, 0, 0.9, 0.34, R.c1], [0.3, 0.22, 0.9, 0.3, R.c1], [-0.05, 0.3, 0.7, 0.3, R.c2], [0.22, 0.48, 1, 0.3, R.c2], [0, 0.66, 0.8, 0.28, R.c3], [0.36, 0.74, 0.9, 0.26, R.c3]];
const DRIP = [[0.5, 4.3, 0.06], [0.62, 5.9, 0.2], [0.86, 7.1, 0.34]];   // [place along the branch, seconds between drops, how far up the lane its puddle lies]

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.4 * tall;
  const HY = Math.round(H * (0.6 - 0.03 * tall));
  const sun = { x: W * (0.66 - 0.36 * tall), y: H * (0.11 + 0.13 * tall), r: 52 * big };
  // on a narrow frame the sun sits over the bow, so the bow is kept low enough to clear it
  const bowR = Math.min(lerp(W * 0.36, W * 0.62, tall), lerp(HY * 0.8, (HY - sun.y - 1.7 * sun.r) / 0.88, tall)), bow = { x: W * (0.5 - 0.02 * tall), y: HY + bowR * 0.12, r: bowR, w: bowR * 0.055 };
  const cloud = { x: W * (0.74 - 0.22 * tall), y: H * 0.04, w: W * (0.36 + 0.3 * tall), h: Math.min(H * 0.3, 330 * big) };
  // five ranges of hills, paler the further off; the last is the one the lane climbs
  const hill = (i, x) => HY + (H - HY) * [0, 0.07, 0.17, 0.3, 0.44][i] - H * [0.06, 0.07, 0.07, 0.06, 0.05][i] * (0.5 * Math.sin(x / (260 + 60 * i) + i * 2.3) + 0.5 * nH(x / (300 + 40 * i) + i * 17)) - 4 * nH(x / 50 + i * 5);
  const TREES = []; for (let i = 1; i < 4; i++) for (let k = 0; k < Math.round(W / 190); k++) { const id = i * 1000 + k, x = hash(id, 1) * W, n = 1 + Math.floor(hash(id, 2) * 3); for (let j = 0; j < n; j++) TREES.push({ i, x: x + j * (16 + 6 * i) * big, r: (7 + 5 * i + 5 * hash(id, 3 + j)) * big }); }   // each clump's numbers come from its range and place, so a wider frame only adds clumps
  const cot = { x: W * (0.82 - 0.14 * tall), i: 2, s: big * 0.8 };
  // the lane: wide at the bottom edge, closing to a thread where it tops the hill
  const yT = HY + (H - HY) * 0.46, lc = (f) => W * lerp(0.3, 0.5, Math.pow(f, 0.8)), lh = (f) => lerp(W * 0.2, 10 * big, Math.pow(f, 0.6));
  const LANE = []; for (let k = 0; k <= 20; k++) { const f = k / 20, y = lerp(H + 40, yT, f); LANE.push([lc(f) - lh(f), y]); } for (let k = 20; k >= 0; k--) { const f = k / 20, y = lerp(H + 40, yT, f); LANE.push([lc(f) + lh(f), y]); }
  // the branch, and under each dripping leaf the puddle its drops land in
  const BR = [[-60, H * 0.03], [W * 0.24, -H * 0.01], [W * (0.44 + 0.08 * tall), H * (0.2 - 0.03 * tall)]];
  const LEAVES = Array.from({ length: 30 }, (_, i) => ({ u: 0.08 + 0.9 * (i / 29), side: i % 2 ? 1 : -1, len: (54 + hash(i, 11) * 40) * big, a: (hash(i, 12) - 0.5) * 0.9, c: 3 + (i % 4), ph: hash(i, 13), dark: hash(i, 14) < 0.55 }));
  const DRIPS = DRIP.map(([u, T, f], k) => { const q = bez(...BR, u), len = 92 * big, y = lerp(H, yT, f); return { x: q[0], y0: q[1] + len, len, bx: q[0], by: q[1], T, ph: hash(k, 3), py: y, rx: Math.min((80 + 30 * hash(k, 4)) * big, lh(f) * 0.5), fall: 0.45 + (y - q[1]) / 2400 }; });
  const POOLS = [[0.5, 0.1, 60], [-0.35, 0.5, 40], [0.25, 0.68, 26]].map(([fx, f, rx]) => ({ x: lc(f) + fx * lh(f), y: lerp(H, yT, f), rx: Math.min(rx * big, lh(f) * 0.4) }));
  const BIRDS = Array.from({ length: 4 }, (_, i) => ({ x: hash(i, 21), y: 0.15 + hash(i, 22) * 0.5, v: (22 + hash(i, 23) * 20) * (i % 2 ? 1 : -1), s: (8 + hash(i, 24) * 6) * big, f: 0.6 + hash(i, 25) * 0.5, ph: hash(i, 26) }));
  const TUFTS = Array.from({ length: Math.round(W / 26) }, (_, i) => ({ x: hash(i, 31) * W, h: (26 + hash(i, 32) * 50) * big, c: [3, 4, 5][Math.floor(hash(i, 33) * 3)], ph: hash(i, 34), n: 3 + Math.floor(hash(i, 35) * 3) }));
  return { W, H, HY, tall, big, bow, sun, cloud, hill, TREES, cot, yT, lc, lh, LANE, BR, LEAVES, DRIPS, POOLS, BIRDS, TUFTS };
}

const bird = (ctx, x, y, s, lift) => { ctx.moveTo(x - s, y - s * lift); ctx.quadraticCurveTo(x - s * 0.4, y - s * lift * 1.3, x, y); ctx.quadraticCurveTo(x + s * 0.4, y - s * lift * 1.3, x + s, y - s * lift); };

export function paint(ctx, p, t, G) {
  const { W, H, HY, big, bow, sun, cloud } = G;
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  ctx.fillStyle = R.sky; ctx.fillRect(0, 0, W, H);

  // the sun: long and short rays in turn, turning slowly and breathing
  { const { x, y, r } = sun, a0 = t * 0.012, n = 14;
    F(ctx, (c) => { for (let k = 0; k < n; k++) { const a = a0 + (k * TAU) / n, len = Math.max(W, H) * (k % 2 ? 0.34 : 0.55) * (0.9 + 0.1 * osc(p, 3 + (k % 3), k * 0.13)), hw = 0.07; poly(c, [[x + Math.cos(a - hw) * r * 1.5, y + Math.sin(a - hw) * r * 1.5], [x + Math.cos(a - hw) * len, y + Math.sin(a - hw) * len], [x + Math.cos(a + hw) * len, y + Math.sin(a + hw) * len], [x + Math.cos(a + hw) * r * 1.5, y + Math.sin(a + hw) * r * 1.5]]); } }, R.ray);
    F(ctx, (c) => circle(c, x, y, r * (1.5 + 0.05 * osc(p, 4))), C.gold); F(ctx, (c) => circle(c, x, y, r), C.cream); }

  // the rainbow: five discs one inside the next, then the brighter sky inside the bow
  { const wob = 2 * osc(p, 2, 0.3); BOW.forEach((col, k) => F(ctx, (c) => circle(c, bow.x + sway(p, 0.02), bow.y, bow.r - k * bow.w + wob * (k % 2 ? 1 : -0.5)), col)); F(ctx, (c) => circle(c, bow.x + sway(p, 0.02), bow.y, bow.r - 5 * bow.w), R.in); }
  bars(ctx, PUFFS, W, t, (y) => y * HY);

  // the last rain, far off under the cloud, then the cloud itself easing about at the edge of the frame
  { const cx = cloud.x + 30 * nW(t * 0.02) + sway(p, 0.04), y0 = cloud.y + cloud.h * 0.8, sl = -0.22;
    ctx.save(); ctx.strokeStyle = R.rain; ctx.lineWidth = 2 * big; ctx.lineCap = 'round'; ctx.setLineDash([14 * big, 20 * big]); ctx.lineDashOffset = -frac((150 * t) / 34) * 34 * big; ctx.beginPath();
    for (let x = cx + cloud.w * 0.12, i = 0; x < W + 200; x += 17 * big, i++) { const j = hash(i, 2) * 34 * big; ctx.moveTo(x, y0 - j); ctx.lineTo(x + (HY + 80 - y0) * sl, HY + 80); }
    ctx.stroke(); ctx.restore();
    for (const tone of [R.c1, R.c2, R.c3]) F(ctx, (c) => CLOUD.forEach(([fx, fy, fw, fh, col], i) => { if (col === tone) pill(c, cx + fx * cloud.w + 10 * osc(p, 2 + (i % 3), i * 0.2), cloud.y + fy * cloud.h, fw * cloud.w + 300, fh * cloud.h); }), tone);
  }

  // birds: a few on their own, and now and then a small flock crossing together
  ctx.strokeStyle = R.ink; ctx.lineWidth = 3 * big; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  G.BIRDS.forEach((g, i) => { const span = W + 240, x = frac(g.x + (g.v * t) / 2040) * span - 120; bird(ctx, x, HY * g.y + 50 * nB(t * 0.04 + i * 13) + 12 * nB(t * 0.2 + i * 5), g.s, 0.2 + 0.5 * Math.max(0, Math.sin(t * 3 * g.f + g.ph * 9))); });
  { const slot = 38, n = Math.floor(t / slot), q = mulberry(n * 7717 + 3), go = q() < 0.8, dir = q() < 0.5 ? -1 : 1, u = (t - n * slot - 1 - q() * 5) / 30, y0 = HY * (0.2 + 0.45 * q()), k = 4 + Math.floor(q() * 4);
    if (go && u >= 0 && u <= 1) for (let i = 0; i < k; i++) { const back = Math.ceil(i / 2) * 44 * big, x = (dir > 0 ? -260 + u * (W + 520) : W + 260 - u * (W + 520)) - dir * back + 8 * nB(t * 0.5 + i * 7); bird(ctx, x, y0 - HY * 0.12 * u + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 22 * big + 10 * nB(t * 0.3 + i * 11), 9 * big, 0.2 + 0.5 * Math.max(0, Math.sin(t * 3.4 + i * 1.3))); } }
  ctx.stroke(); ctx.lineJoin = 'miter';

  ctx.depthLayer?.('hills');
  // the hills, with clumps of trees, and a cottage on the middle range
  for (let i = 0; i < 5; i++) layer(0.06 + 0.1 * i, () => {
    if (i === 3) { const { x, s } = G.cot, y = G.hill(2, x) + 6; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); F(ctx, (c) => c.rect(-40, -44, 80, 44), C.cream); F(ctx, (c) => { poly(c, [[-48, -42], [48, -42], [30, -74], [-30, -74]]); c.rect(14, -86, 12, 18); }, C.orange); F(ctx, (c) => { c.rect(-28, -30, 14, 14); c.rect(12, -30, 14, 14); c.rect(-7, -26, 12, 26); }, R.ink); ctx.restore(); }
    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 12) c.lineTo(x, G.hill(i, x)); c.lineTo(W + 90, H + 60); c.closePath(); for (const q of G.TREES) if (q.i === i) circle(c, q.x, G.hill(i, q.x) - q.r * 0.5, q.r); }, HILLS[i]);
  });

  // the lane and its puddles; rings spread where the drops come down
  layer(0.8, () => {
    F(ctx, (c) => poly(c, G.LANE), R.lane);
    const all = G.POOLS.concat(G.DRIPS.map((d) => ({ x: d.x, y: d.py, rx: d.rx })));
    F(ctx, (c) => { for (const q of all) el(c, q.x, q.y + 3 * big, q.rx * 1.06, q.rx * 0.24); }, R.rim);
    F(ctx, (c) => { for (const q of all) { el(c, q.x, q.y, q.rx, q.rx * 0.21); el(c, q.x + q.rx * 0.75, q.y + q.rx * 0.1, q.rx * 0.45, q.rx * 0.11); } }, R.in);
    ctx.strokeStyle = C.cream;
    for (const d of G.DRIPS) { const s = ((t / d.T + d.ph) % 1) * d.T; for (let i = 0; i < 3; i++) { const v = (s - i * 0.45) / 2.4; if (v <= 0 || v >= 1 || t < d.T) continue; ctx.lineWidth = Math.max(0.6, 5 * big * (1 - v)); ctx.beginPath(); el(ctx, d.x, d.py, (6 + v * 0.8 * d.rx), (6 + v * 0.8 * d.rx) * 0.21); ctx.stroke(); } }
  });

  ctx.depthLayer?.('grass');
  // verges of dark grass either side, stirring
  layer(0.9, () => F(ctx, (c) => {
    const vy = (x) => H * 1.01 - H * 0.12 * Math.pow(clamp((Math.abs(x - G.lc(0)) - G.lh(0) * 0.8) / (W * 0.45)), 1.2) + 6 * nH(x / 130 + 60);
    c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 12) c.lineTo(x, vy(x)); c.lineTo(W + 90, H + 60); c.closePath();
    for (const q of G.TUFTS) { const gy = vy(q.x) + 5; if (gy > H + 4) continue; for (let k = 0; k < q.n; k++) { const bx = q.x + k * 7, h = q.h * (0.6 + 0.4 * hash(k, q.n)), sw = h * (0.12 * osc(p, q.c, q.ph + k * 0.05) + (k - q.n / 2) * 0.14); c.moveTo(bx - 3, gy); c.quadraticCurveTo(bx + sw * 0.2, gy - h * 0.6, bx + sw, gy - h); c.quadraticCurveTo(bx + 3 + sw * 0.2, gy - h * 0.6, bx + 3, gy); c.closePath(); } }
  }, R.ink));

  ctx.depthLayer?.('branch');
  // the overhanging branch: wet leaves hang from it and stir; three of them drip
  layer(1, () => {
    const [A, B, D] = G.BR, Lp = [], Rp = [];
    for (let i = 0; i <= 16; i++) { const u = i / 16, [x, y] = bez(A, B, D, u), [dx, dy] = bezT(A, B, D, u), w = lerp(15, 3, u) * big; Lp.push([x - dy * w, y + dx * w]); Rp.push([x + dy * w, y - dx * w]); }
    for (const dark of [false, true]) F(ctx, (c) => { for (const q of G.LEAVES) { if (q.dark !== dark) continue; const [x, y] = bez(A, B, D, q.u), a = Math.PI / 2 + q.a + q.side * 0.3 + 0.1 * osc(p, q.c, q.ph) + 0.03 * osc(p, 11, q.ph); el(c, x + Math.cos(a) * q.len * 0.5, y + Math.sin(a) * q.len * 0.5, q.len * 0.5, q.len * 0.2, a); } }, dark ? R.ink : R.leaf);
    F(ctx, (c) => { poly(c, Lp.concat(Rp.reverse())); for (const d of G.DRIPS) { const sw = 3 * big * osc(p, 5, d.ph); c.moveTo(d.bx - 13 * big, d.by); c.quadraticCurveTo(d.bx - 20 * big + sw, d.by + d.len * 0.6, d.x + sw, d.y0); c.quadraticCurveTo(d.bx + 20 * big + sw, d.by + d.len * 0.6, d.bx + 13 * big, d.by); c.closePath(); } }, R.ink);
  });
  // each drop swells at its leaf tip, then lets go and falls faster and faster to its puddle
  layer(0.9, () => F(ctx, (c) => { for (const d of G.DRIPS) {
    const s = ((t / d.T + d.ph) % 1) * d.T, grow = d.T - d.fall;
    if (s < grow) { const g = s / grow; if (g > 0.25) el(c, d.x, d.y0 + 5 * big * g, 4.5 * big * g, 7 * big * g); }
    else { const f = (s - grow) / d.fall, y = lerp(d.y0 + 5 * big, d.py, f * f); el(c, d.x, y, 4 * big, (8 + 8 * f) * big); }
  } }, R.in));
}
