// Nocturne Series No. 02: Hidden Falls. A waterfall drops off a cliff on the left into a moonlit pool,
// framed by trunks, hanging vines and big leaves. Composed against the frame like the beach: the pool line
// sits at a fixed share of the height, the cliff hangs off the left edge, and extra room becomes sky, water and foliage.
import { mulberry, lerp, clamp, osc, sway, noise1, frac, poly, circle, pill, star4, TAU } from './geom.js?v=20261011-clock';
import { C, F } from './kit.js?v=20261011-clock';

export const title = 'HIDDEN FALLS', no = 'No. 02', text = '#0b2a26', dark = '#051411';
// greens run light to dark with nearness; the cream, gold and orange are the series' own
const J = { sky: '#0b2030', r1: '#103540', r2: '#16504f', r3: '#207066', far: '#1c5f4e', cliff: '#124238', mid: '#0d342e', lit: '#2a7d5a', dark: '#0a2a25', ink: '#051411', w1: '#12484f', w2: '#0d3840', w3: '#1c6a68' };

const bez = (A, B, D, t) => [(1 - t) ** 2 * A[0] + 2 * t * (1 - t) * B[0] + t * t * D[0], (1 - t) ** 2 * A[1] + 2 * t * (1 - t) * B[1] + t * t * D[1]];
const bezT = (A, B, D, t) => { const x = 2 * (1 - t) * (B[0] - A[0]) + 2 * t * (D[0] - B[0]), y = 2 * (1 - t) * (B[1] - A[1]) + 2 * t * (D[1] - B[1]), l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
const nR = noise1(51), nK = noise1(67), nG = noise1(83);

// an ellipse as its own subpath, so several can share one fill without stray joins
const el = (c, x, y, rx, ry, rot = 0) => { c.moveTo(x + rx * Math.cos(rot), y + rx * Math.sin(rot)); c.ellipse(x, y, rx, ry, rot, 0, TAU); };
// a pointed oval leaf from its stem end, pointing along angle a
function leafPath(ctx, bx, by, a, len, wid) {
  const c = Math.cos(a), s = Math.sin(a), tx = bx + c * len, ty = by + s * len, nx = -s * len * wid, ny = c * len * wid, mx = bx + c * len * 0.45, my = by + s * len * 0.45;
  ctx.moveTo(bx, by); ctx.quadraticCurveTo(mx + nx, my + ny, tx, ty); ctx.quadraticCurveTo(mx - nx, my - ny, bx, by); ctx.closePath();
}
function leaf(ctx, l, a, fill, vein) {
  F(ctx, (c) => leafPath(c, l.x, l.y, a, l.len, l.wid), fill);
  ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(l.x + Math.cos(a) * l.len * 0.9, l.y + Math.sin(a) * l.len * 0.9);
  ctx.strokeStyle = vein; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke();
}
// a fern frond: a spine that arcs over, with a leaflet either side all the way up
function frondPath(ctx, B, a, len, droop) {
  const c = Math.cos(a), s = Math.sin(a), P1 = [B[0] + 0.55 * len * c, B[1] + 0.55 * len * s], P2 = [B[0] + len * c, B[1] + len * s + droop * len], A = [], Bk = [];
  for (let k = 0; k <= 16; k++) {
    const t = k / 16, pt = bez(B, P1, P2, t), [tx, ty] = bezT(B, P1, P2, t), w = lerp(5, 1, t);
    A.push([pt[0] - ty * w, pt[1] + tx * w]); Bk.push([pt[0] + ty * w, pt[1] - tx * w]);
    if (k === 0 || k === 16) continue;
    const ll = len * 0.2 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.1)), 0.7) + 8;
    for (const side of [-1, 1]) {
      let vx = -ty * side * 0.8 + tx * 0.45, vy = tx * side * 0.8 + ty * 0.45; const l = Math.hypot(vx, vy); vx /= l; vy /= l;
      poly(ctx, [[pt[0] - tx * 7, pt[1] - ty * 7], [pt[0] + tx * 7, pt[1] + ty * 7], [pt[0] + vx * ll, pt[1] + vy * ll]]);
    }
  }
  poly(ctx, A.concat(Bk.reverse()));
}
function bat(ctx, x, y, s, flap) {
  F(ctx, (c) => poly(c, [[-17, flap], [-8, -4], [-3, -2], [0, -7], [3, -2], [8, -4], [17, flap], [8, 3], [0, 6], [-8, 3]].map(([u, v]) => [x + u * s, y + v * s])), J.ink);
}

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall;
  let r = mulberry(77);   // reseeded before each list below, so no list's numbers depend on another's length
  const WY = Math.round(H * 0.74);                       // the pool's far edge
  const MOON = { x: W * (0.62 - 0.06 * tall), y: H * 0.2, r: 78 };
  const moonPos = (p, t = 0) => { const a = (TAU * t) / 360; return [MOON.x + sway(p, 0.03) - 70 * (1 - 0.6 * tall) * Math.sin(a), MOON.y + H * 0.02 - H * 0.06 * (1 - Math.cos(a))]; };
  const STARS = Array.from({ length: 60 }, () => ({ x: r() * W, y: r() * H * 0.5, s: 0.8 + r() * r() * 2.2, c: [4, 5, 7, 9, 11][Math.floor(r() * 5)], ph: r() }));

  // far ridge: a rolling line of treetops
  const ridgeY = (x) => WY - H * 0.15 - H * 0.06 * nR(x / 340);
  r = mulberry(780); const RIDGE = []; for (let x = -160; x <= W + 160; x += 52) RIDGE.push({ x: x + r() * 20, r: 34 + r() * 32, c: 3 + Math.floor(r() * 4), ph: r() });

  // cliff, hung off the left edge, with the fall cut through it
  const xc = Math.min(W * 0.46, 800), cliffH = clamp(H * 0.36, 280, 640), cTop = (x) => WY - cliffH + 26 * nK(x / 170) + (x / xc) * 34;
  const cliff = (ctx) => {
    ctx.moveTo(-180, WY + 12);
    for (let x = -180; x <= xc; x += 10) ctx.lineTo(x, cTop(x));
    ctx.quadraticCurveTo(xc + 46, cTop(xc) + cliffH * 0.3, xc + 70, cTop(xc) + cliffH * 0.62); ctx.quadraticCurveTo(xc + 96, WY - 30, xc + 170, WY + 12); ctx.closePath();
  };
  const xw = xc * 0.58, ww = 84 * big;
  r = mulberry(781); const CANOPY = []; for (let x = -160; x <= xc - 10; x += 46) { const o = { x: x + r() * 18, r: 30 + r() * 30, c: 3 + Math.floor(r() * 4), ph: r() }; if (Math.abs(o.x - xw - 20) >= ww * 0.5 + 70) CANOPY.push(o); }
  r = mulberry(782); const BUSH = Array.from({ length: 7 }, (_, i) => ({ x: xc + 30 + i * 22 + r() * 10, y: cTop(xc) + cliffH * (0.2 + 0.12 * i), r: 22 + r() * 20, c: 3 + Math.floor(r() * 4), ph: r() }));

  // tall trees standing clear of the far ridge
  r = mulberry(783); const EMERG = [0.47, 0.56, 0.69, 0.8, 0.9].map((fx, i) => ({ x: fx * W + (r() - 0.5) * 40, h: (90 + r() * 90) * big, r: 30 + r() * 16, c: 3 + (i % 3), ph: r() }));
  // a wooded shore on the right, with two palms leaning out of it
  const shoreH = clamp(H * 0.15, 110, 240), xs = Math.max(W * 0.7, W - 620);
  const shoreY = (x) => WY - shoreH * Math.pow(clamp((x - xs) / 260), 0.6) * (0.8 + 0.2 * nR(x / 120 + 9));
  r = mulberry(784); const SHORE = []; for (let x = xs + 30; x <= W + 160; x += 44) SHORE.push({ x: x + r() * 16, r: 28 + r() * 26, c: 3 + Math.floor(r() * 4), ph: r() });
  r = mulberry(785); const PALMS = [xs + 140, xs + 330].map((x, i) => ({ x, h: (150 + r() * 70) * big, lean: (i ? 40 : -50) * big, c: 3 + i, ph: r() }));

  // pool
  const POOL = clamp(Math.round((H - WY) / 48), 5, 10);
  const band = (j) => { const t = j / POOL; return { t, y0: WY + Math.pow(t, 1.3) * (H - WY) * 0.85, lam: 180 + 260 * t, amp: 2 + 6 * t }; };
  const bandShift = (p, j) => 2 * p * band(j).lam + j * 71;
  const poolEdge = (p, j) => { const b = band(j), s = bandShift(p, j), pts = []; for (let x = -160; x <= W + 160; x += 8) pts.push([x, b.y0 - (j ? b.amp * Math.sin(((x - s) / b.lam) * TAU) : 0)]); return pts; };
  const GSTEP = ((H - WY) * 0.7) / 22;
  r = mulberry(786); const GLINTS = Array.from({ length: 22 }, (_, k) => ({ y: WY + 16 + k * GSTEP, w: (24 + k * 7) * (0.45 + r() * 0.8), j: (r() - 0.5) * (8 + k * 3), c: 5 + Math.floor(r() * 5), ph: r() }));

  // mist bars: [starting x share, y share of the pool line, width, height, color, drift, behind the cliff?]
  const MIST = [[0.5, 0.7, 520, 30, J.r2, 7, 1], [0.58, 0.745, 300, 22, J.r2, 7, 1], [0.1, 0.955, 420, 22, J.r3, 11, 0], [0.7, 0.93, 360, 20, J.r3, 5, 0]];

  // trunks either side, running off the top and bottom
  const trunk = (x0, x1, w0, w1) => { const L = [], R = [], B = [x0, H + 80], T = [x1, -80], Cn = [x0 + (x1 - x0) * 0.2 + 30, H * 0.5]; for (let i = 0; i <= 20; i++) { const t = i / 20, pt = bez(B, Cn, T, t), [tx, ty] = bezT(B, Cn, T, t), w = lerp(w0, w1, t) * (1 + 0.05 * Math.sin(i * 1.9)); L.push([pt[0] - ty * w, pt[1] + tx * w]); R.push([pt[0] + ty * w, pt[1] - tx * w]); } return L.concat(R.reverse()); };
  const TRUNKS = [trunk(W * 0.035, W * 0.035 + 46, 44 * big, 30 * big), trunk(W - 96 * big, W - 150 * big, 56 * big, 36 * big)];
  const perch = { x: W - 150 * big - 150 * big, y: H * 0.47, len: 190 * big };

  // foliage: [origin x, origin y, first angle, last angle, count, shortest, longest]
  const fan = (ox, oy, a0, a1, n, l0, l1, seed) => { const q = mulberry(seed); return Array.from({ length: n }, (_, i) => ({ x: ox + (q() - 0.5) * 60, y: oy + (q() - 0.5) * 30, a: lerp(a0, a1, (i + 0.15 + q() * 0.7) / n), len: lerp(l0, l1, q()) * big, wid: 0.2 + q() * 0.14, c: [3, 4, 5, 7][Math.floor(q() * 4)], ph: q(), tone: q() })); };
  const TOP = [...fan(W * 0.02, -50, 0.1, 1.7, 9, 280, 460, 1), ...fan(W * 0.22, -90, 0.9, 2.1, 4, 220, 330, 2), ...fan(W * 0.98, -50, Math.PI - 1.7, Math.PI - 0.1, 10, 280, 460, 3), ...fan(W * 0.8, -90, 1.0, 2.2, 4, 220, 330, 4)];
  TOP.push(...fan(W * 0.38, -100, 1.0, 2.0, 4, 130, 190, 9), ...fan(W * 0.52, -110, 1.1, 2.1, 3, 110, 150, 10), ...fan(W * 0.12, -70, 0.6, 1.9, 5, 240, 380, 13), ...fan(W * 0.9, -70, 1.2, 2.5, 5, 240, 380, 14));
  const LOW = [...fan(W * 0.06, H + 60, -2.25, -0.4, 8, 300, 540, 5), ...fan(W * 0.93, H + 60, -2.8, -0.95, 8, 300, 540, 6), ...fan(W * 0.28, H + 80, -2.0, -1.1, 4, 190, 290, 11), ...fan(W * 0.72, H + 80, -2.05, -1.15, 4, 190, 290, 12)];
  // a middle layer of leaves reaching in from both edges, behind the trunks
  const MID = [...fan(-30, H * 0.63, -1.25, 0.5, 7, 230, 370, 7), ...fan(W + 30, H * 0.6, Math.PI - 0.5, Math.PI + 1.25, 7, 230, 370, 8), ...fan(-30, H * 0.3, -0.5, 0.9, 5, 200, 320, 15), ...fan(W + 30, H * 0.32, Math.PI - 0.9, Math.PI + 0.5, 5, 200, 320, 16)].map((l) => ({ ...l, len: Math.min(l.len, W * 0.24) }));
  // a liana slung across the top between the trunks
  const LIANA = { x0: W * 0.04, y0: H * 0.05, x1: W * 0.9, y1: H * 0.02, sag: H * 0.07 };
  r = mulberry(787); const FLOWERS = [[0.1, 210], [0.17, 120], [0.04, 330], [0.9, 230], [0.83, 130], [0.96, 340]].map(([fx, up]) => ({ x: fx * W, y: H - up * big, c: 3 + Math.floor(r() * 4), ph: r() }));
  const FERNS = [[W * 0.2, -1.15, 330], [W * 0.27, -0.8, 260], [W * 0.31, -1.75, 250], [W * 0.74, -1.95, 340], [W * 0.68, -2.3, 260], [W * 0.8, -1.3, 240], [W * 0.12, -1.5, 300], [W * 0.4, -1.25, 200], [W * 0.6, -1.9, 200], [W * 0.88, -1.65, 300]].map(([x, a, len], i) => ({ x, a, len: len * big, c: [4, 5, 7][i % 3], ph: i * 0.17 }));
  r = mulberry(788); const VINES = [0.07, 0.13, 0.2, 0.29, 0.38, 0.5, 0.71, 0.79, 0.9, 0.96].map((fx) => ({ x: fx * W, len: H * (0.2 + 0.32 * r()) * (0.45 + 0.55 * Math.min(1, Math.abs(fx - 0.55) / 0.3)), c: [2, 3, 4][Math.floor(r() * 3)], ph: r(), amp: 24 + r() * 30 }));
  const groundY = (x) => H - 30 - 120 * big * Math.pow(Math.abs((2 * x) / W - 1), 1.6) + 10 * nG(x / 80);

  r = mulberry(789); const FLIES = Array.from({ length: Math.round(12 + W / 260 + 8 * tall) }, () => ({ x: r() * W, y: H * (0.36 + 0.58 * r()), ax: 30 + r() * 70, ay: 20 + r() * 45, ta: 9 + r() * 14, tb: 7 + r() * 12, tc: 2.4 + r() * 3, ph: r(), front: r() < 0.4 }));
  return { W, H, WY, tall, big, MOON, moonPos, STARS, ridgeY, RIDGE, cliff, cTop, CANOPY, BUSH, xw, ww, POOL, band, bandShift, poolEdge, GLINTS, MIST, TRUNKS, perch, TOP, LOW, MID, LIANA, FLOWERS, FERNS, VINES, groundY, FLIES, EMERG, xs, shoreY, SHORE, PALMS };
}

// p is time in 30 s units, unwrapped (leaves, vines, ferns, treetops, pool, stars); t is the same clock in seconds,
// for what never repeats on that cycle (the falling water, ripples, mist, moon, fireflies, bats).
export function paint(ctx, p, t, G) {
  const { W, H, WY, MOON, big } = G, [mx, my] = G.moonPos(p, t);
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  const tops = (list, yOf, fill) => F(ctx, (c) => { for (const o of list) circle(c, o.x + 3 * osc(p, o.c, o.ph), (yOf ? yOf(o.x) : o.y) + 6 + 2 * osc(p, o.c + 2, o.ph), o.r); }, fill);
  const mist = (behind) => G.MIST.forEach(([fx, fy, w, h, col, v, b]) => { if (!!b !== behind) return; const bw = Math.min(w, W * 0.5), span = W + bw + 160; F(ctx, (c) => pill(c, frac(fx + (v * t) / 1800) * span - bw - 80, fy * WY, bw, h), col); });
  const flies = (front) => { for (const f of G.FLIES) { if (f.front !== front) continue; const rr = 0.8 + 4.6 * Math.pow(Math.max(0, Math.sin(TAU * (t / f.tc + f.ph))), 1.5); F(ctx, (c) => circle(c, f.x + f.ax * Math.sin(TAU * (t / f.ta + f.ph)), f.y + f.ay * Math.sin(TAU * (t / f.tb + f.ph * 3)), rr), C.gold); } };

  // sky
  ctx.fillStyle = J.sky; ctx.fillRect(0, 0, W, H);
  F(ctx, (c) => circle(c, mx, my, 700), J.r1); F(ctx, (c) => circle(c, mx, my, 470), J.r2); F(ctx, (c) => circle(c, mx, my, 255), J.r3);
  for (const s of G.STARS) F(ctx, (c) => star4(c, s.x, s.y, (3 + s.s * 2.2) * (0.7 + 0.3 * osc(p, s.c, s.ph))), C.cream);
  F(ctx, (c) => circle(c, mx, my, MOON.r), C.gold);
  // bats cross the moon now and then: 19 s slots, most of them taken
  { const n = Math.floor(t / 19), q = mulberry(n * 104729 + 11);
    if (q() < 0.65) { const u = (t - (n * 19 + 1 + q() * 12)) / 5.5, dir = q() < 0.5 ? -1 : 1, off = -70 + 150 * q();
      if (u >= 0 && u <= 1) [[0, 0], [-58, 26], [-104, -20]].forEach(([ox, oy], i) => { const x = dir > 0 ? -80 + u * (W + 300) + ox : W + 80 - u * (W + 300) - ox; bat(ctx, x, my + off + oy - 46 * Math.sin(u * Math.PI), 1.25, -3 + 9 * Math.sin(t * 15 + i * 1.7)); }); } }

  ctx.depthLayer?.('falls');
  // far ridge, mist, then the cliff and its waterfall
  layer(0.15, () => mist(true));
  layer(0.2, () => {
    for (const e of G.EMERG) {
      const by = G.ridgeY(e.x) + 20, tx = e.x + 5 * osc(p, e.c, e.ph), ty = by - e.h;
      ctx.beginPath(); ctx.moveTo(e.x, by); ctx.lineTo(tx, ty); ctx.strokeStyle = J.far; ctx.lineWidth = 8; ctx.stroke();
      F(ctx, (c) => { circle(c, tx, ty, e.r); circle(c, tx - e.r * 0.85, ty + e.r * 0.35, e.r * 0.75); circle(c, tx + e.r * 0.85, ty + e.r * 0.3, e.r * 0.7); }, J.far);
    }
  });
  layer(0.2, () => { F(ctx, (c) => { c.moveTo(-180, WY + 12); for (let x = -180; x <= W + 180; x += 12) c.lineTo(x, G.ridgeY(x) + 12); c.lineTo(W + 180, WY + 12); c.closePath(); }, J.far); tops(G.RIDGE, G.ridgeY, J.far); });
  layer(0.35, () => {
    for (const q of G.PALMS) {
      const by = G.shoreY(q.x) + 16, top = [q.x + q.lean + 6 * osc(p, q.c, q.ph), by - q.h];
      ctx.beginPath(); ctx.moveTo(q.x, by); ctx.quadraticCurveTo(q.x + q.lean * 0.2, by - q.h * 0.6, top[0], top[1]); ctx.strokeStyle = J.cliff; ctx.lineWidth = 10 * big; ctx.lineCap = 'round'; ctx.stroke();
      F(ctx, (c) => { for (let k = 0; k < 7; k++) frondPath(c, top, -Math.PI * (0.03 + k * 0.157) + 0.05 * osc(p, q.c + k % 3, q.ph + k * 0.1), 118 * big, 0.5); }, J.cliff);
    }
    F(ctx, (c) => { c.moveTo(G.xs, WY + 12); for (let x = G.xs; x <= W + 180; x += 12) c.lineTo(x, G.shoreY(x) + 10); c.lineTo(W + 180, WY + 12); c.closePath(); }, J.cliff);
    tops(G.SHORE, G.shoreY, J.cliff);
    F(ctx, G.cliff, J.cliff); tops(G.CANOPY, G.cTop, J.cliff); tops(G.BUSH, null, J.cliff);
    const { xw, ww } = G, y0 = G.cTop(xw) - 4, y1 = WY + 10;
    // two streams of falling water; the streaks only ever travel down
    const fall = (x, w, top, n, speed) => {
      F(ctx, (c) => { c.moveTo(x - w / 2, top + 14); c.quadraticCurveTo(x - w / 2, top, x - w / 2 + 14, top); c.lineTo(x + w / 2 - 14, top); c.quadraticCurveTo(x + w / 2, top, x + w / 2, top + 14); c.lineTo(x + w / 2 + 6, y1); c.lineTo(x - w / 2 - 6, y1); c.closePath(); }, C.cream);
      ctx.save(); ctx.strokeStyle = J.r3; ctx.lineCap = 'round';
      for (let i = 0; i < n; i++) { const lx = x - w / 2 + (w * (i + 0.5)) / n, dash = 46 + 23 * ((i * 7) % 5); ctx.lineWidth = 3 + (i % 2) * 2; ctx.setLineDash([dash, dash * 1.3]); ctx.lineDashOffset = -t * (speed + 37 * ((i * 3) % 4)) + i * 61; ctx.beginPath(); ctx.moveTo(lx, top + 10); ctx.lineTo(lx, y1 - 6); ctx.stroke(); }
      ctx.restore();
    };
    fall(xw, ww, y0, 5, 250); fall(xw + ww * 0.5 + 42, 24 * big, y0 + 70, 2, 290);
    // treetops crowd the lip, so the water pours out of the canopy rather than standing clear of it
    F(ctx, (c) => { for (const [ox, oy, rr] of [[-ww * 0.5 - 26, 8, 42], [-ww * 0.5 + 6, -14, 30], [ww * 0.5 + 8, -8, 34], [ww * 0.5 + 44, 46, 34], [ww * 0.5 + 84, 40, 30]]) circle(c, xw + ox + 2 * osc(p, 4, ox * 0.01), y0 + oy + 2 * osc(p, 5, oy * 0.02), rr * big); }, J.cliff);
  });
  layer(0.4, () => mist(false));

  ctx.depthLayer?.('pool');
  // pool: slow bands, the moon's path, ripples spreading from the foot of the fall
  layer(0.5, () => {
    for (let j = 0; j < G.POOL; j++) {
      const e = G.poolEdge(p, j), b = G.band(j);
      F(ctx, (c) => { c.moveTo(e[0][0], e[0][1]); for (const q of e) c.lineTo(q[0], q[1]); c.lineTo(W + 160, H + 60); c.lineTo(-160, H + 60); c.closePath(); }, j % 3 === 2 ? J.w3 : j % 2 ? J.w2 : J.w1);
      if (!j) continue;
      ctx.save(); ctx.beginPath(); ctx.moveTo(e[0][0], e[0][1] + 6); for (const q of e) ctx.lineTo(q[0], q[1] + 6 + 5 * b.t);
      ctx.strokeStyle = C.cream; ctx.lineWidth = 2 + 2.5 * b.t; ctx.lineCap = 'round'; ctx.setLineDash([b.lam * 0.22, b.lam * 0.78]); ctx.lineDashOffset = -G.bandShift(p, j) + 160; ctx.stroke(); ctx.restore();
    }
    for (let k = 0; k < G.GLINTS.length; k += 2) { const g = G.GLINTS[k], a = 0.5 + 0.5 * osc(p, g.c, g.ph + 0.3), w = g.w * (0.75 + 0.25 * osc(p, g.c, g.ph)) * (0.5 + 0.9 * a); F(ctx, (c) => pill(c, mx + g.j + 4 * osc(p, 3, g.ph) - w / 2, g.y - 4, w, 8), C.gold); }
    const fx = G.xw + sway(p, 0.35) - sway(p, 0.5), fy = WY + 12;
    ctx.save(); ctx.beginPath(); ctx.rect(-200, WY + 2, W + 400, H); ctx.clip(); ctx.strokeStyle = C.cream;
    for (let i = 0; i < 3; i++) { const u = (t / 3.9 + i / 3) % 1, rx = G.ww * 0.7 + u * 300 * big; ctx.lineWidth = 0.6 + 6 * (1 - u); ctx.beginPath(); el(ctx, fx + G.ww * 0.2, fy, rx, rx * 0.17, 0); ctx.stroke(); }
    ctx.restore();
    F(ctx, (c) => { for (let i = 0; i < 7; i++) circle(c, fx - G.ww * 0.6 + i * G.ww * 0.3, fy - 2, (15 + 11 * (0.5 + 0.5 * osc(p, 6 + i, i * 0.31))) * big); }, C.cream);
  });

  flies(false);

  ctx.depthLayer?.('trees');
  // trunks, canopy and vines
  layer(0.7, () => { for (const l of G.MID) { const lit = l.tone < 0.22; leaf(ctx, l, l.a + 0.04 * osc(p, l.c, l.ph), lit ? J.lit : J.mid, J.cliff); } });
  layer(0.85, () => F(ctx, (c) => { for (const tr of G.TRUNKS) poly(c, tr); }, J.ink));
  const toucan = () => layer(0.85, () => {
    const q = G.perch, bob = 2 * osc(p, 6), turn = Math.sin(TAU * (t / 37)) > -0.3 ? -1 : 1;
    F(ctx, (c) => poly(c, [[q.x + q.len + 30, q.y + 10], [q.x + q.len + 30, q.y - 8], [q.x, q.y - 9], [q.x - 26, q.y - 16], [q.x - 30, q.y - 11], [q.x, q.y + 1]]), J.ink);
    const bx = q.x + 54, by = q.y - 40 + bob;
    ctx.save(); ctx.translate(bx, by);
    F(ctx, (c) => { el(c, 0, 0, 20, 31, 0.12); poly(c, [[-4, 22], [10, 22], [16, 62], [4, 62]]); }, J.ink);
    F(ctx, (c) => el(c, turn * 6, -8, 10, 15, 0), C.cream);
    ctx.save(); ctx.translate(turn * 8, -22); ctx.scale(turn, 1); ctx.rotate(0.1 * osc(p, 2, 0.3));
    F(ctx, (c) => { c.moveTo(0, -9); c.quadraticCurveTo(34, -15, 52, 3); c.quadraticCurveTo(30, 6, 0, 7); c.closePath(); }, C.orange);
    F(ctx, (c) => { c.moveTo(38, -7); c.quadraticCurveTo(47, -3, 52, 3); c.quadraticCurveTo(44, 3, 37, 1); c.closePath(); }, C.gold);
    ctx.restore();
    F(ctx, (c) => circle(c, turn * 3, -25, 3.2), C.gold);
    ctx.restore();
  });
  layer(1, () => {
    for (const l of G.TOP) leaf(ctx, l, l.a + 0.04 * osc(p, l.c, l.ph), l.tone < 0.5 ? J.dark : J.ink, l.tone < 0.5 ? J.cliff : J.dark);
    ctx.strokeStyle = J.ink; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    { const q = G.LIANA, pts = []; for (let i = 0; i <= 24; i++) { const s = i / 24, bow = Math.sin(Math.PI * s); pts.push([lerp(q.x0, q.x1, s) + 9 * osc(p, 2, 0.1) * bow, lerp(q.y0, q.y1, s) + q.sag * 4 * s * (1 - s) + 5 * osc(p, 3, 0.4) * bow]); }
      ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const u of pts) ctx.lineTo(u[0], u[1]); ctx.stroke(); ctx.lineWidth = 5;
      F(ctx, (c) => { for (let i = 1; i < 24; i += 2) leafPath(c, pts[i][0], pts[i][1], Math.PI / 2 + (i % 4 === 1 ? 0.5 : -0.5) + 0.12 * osc(p, 4, i * 0.07), 46 * big, 0.3); }, J.ink); }
    for (const v of G.VINES) {
      const pts = []; for (let i = 0; i <= 16; i++) { const s = i / 16; pts.push([v.x + v.amp * Math.pow(s, 1.6) * osc(p, v.c, v.ph) + 7 * Math.sin(s * 9 + v.ph * 7), -12 + s * v.len]); }
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const q of pts) ctx.lineTo(q[0], q[1]); ctx.stroke();
      F(ctx, (c) => { for (let i = 2; i <= 16; i += 2) leafPath(c, pts[i][0], pts[i][1], Math.PI / 2 + (i % 4 ? 0.95 : -0.95) + 0.1 * osc(p, v.c + 3, v.ph + i * 0.05), 42 * big, 0.3); }, J.ink);
    }
  });

  // the toucan on its perch sits in front of the canopy, so the leaves never hide it
  toucan();

  ctx.depthLayer?.('leaves');
  // foreground: big leaves, ferns and the bank
  layer(1, () => {
    for (const l of G.LOW) { const lit = l.tone > 0.74; leaf(ctx, l, l.a + 0.035 * osc(p, l.c, l.ph), lit ? J.lit : l.tone < 0.4 ? J.dark : J.ink, lit ? J.cliff : l.tone < 0.4 ? J.cliff : J.dark); }
    for (const f of G.FLOWERS) {
      const fx = f.x + 4 * osc(p, f.c, f.ph), fy = f.y + 3 * osc(p, f.c + 2, f.ph), rot = 0.2 * osc(p, f.c, f.ph + 0.3);
      F(ctx, (c) => { for (let k = 0; k < 5; k++) { const a = rot + (k * TAU) / 5; c.moveTo(fx, fy); el(c, fx + Math.cos(a) * 13 * big, fy + Math.sin(a) * 13 * big, 13 * big, 7.5 * big, a); } }, C.orange);
      F(ctx, (c) => circle(c, fx, fy, 6 * big), C.gold);
    }
    F(ctx, (c) => { for (const f of G.FERNS) frondPath(c, [f.x, H + 30], f.a + 0.05 * osc(p, f.c, f.ph), f.len, 0.45 + 0.04 * osc(p, f.c + 4, f.ph)); }, J.ink);
    F(ctx, (c) => { c.moveTo(-180, H + 80); for (let x = -180; x <= W + 180; x += 14) c.lineTo(x, G.groundY(clamp(x, 0, W))); c.lineTo(W + 180, H + 80); c.closePath(); }, J.ink);
  });
  flies(true);
}
