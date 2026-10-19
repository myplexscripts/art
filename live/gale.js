// Weather Series No. 04: Autumn Gale. One big tree on a hilltop, blown from the left. Its crown is a heap of round
// clumps that lean further the higher they sit and shudder each on its own; leaves tear off and cross the frame in
// curling paths, a new path every trip. Grass runs over the hill in toothed waves, clouds race, a kite tied to the
// fence tugs on a bowed string, and the gate swings on its post. The hill is a hump placed at a share of the width;
// extra height becomes more sky for the kite and the leaves.
import { mulberry, clamp, lerp, osc, sway, noise1, poly, circle, pill, TAU } from './geom.js?v=20261019-after-hours-detail';
import { C, F } from './kit.js?v=20261019-after-hours-detail';
import { hash, el, bez, bezT, bars } from './bits.js?v=20261019-after-hours-detail';

export const title = 'AUTUMN GALE', no = 'No. 04', text = '#2e2a3a', dark = '#231a1c';
const A = { sky: '#8399ac', sky2: '#9db0bf', sky3: '#b6c5cf', cloud: '#d3dde2', scud: '#71879b', far: '#6b8296', far2: '#566d82', hill: '#c79b39', h2: '#a87c2c', h3: '#8a6026', near: '#5c3d1f', red: '#8f3a22', ink: '#2c1a14' };
const LEAF = [A.red, C.rust, C.orange, C.gold];
const nW = noise1(1009), nB = noise1(1013), nH = noise1(1019);
const CLOUDS = [[0.05, 0.12, 520, 40, A.cloud, 34], [0.12, 0.18, 300, 30, A.cloud, 34], [0.55, 0.3, 460, 36, C.cream, 46], [0.6, 0.36, 250, 26, C.cream, 46], [0.85, 0.06, 380, 28, A.scud, 58], [0.3, 0.5, 420, 30, A.cloud, 27], [0.36, 0.555, 220, 22, A.cloud, 27], [0.7, 0.64, 340, 24, C.cream, 39], [0.15, 0.4, 260, 18, A.scud, 71], [0.9, 0.76, 300, 20, A.sky3, 22]];

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.4 * tall, r = mulberry(1001);
  const HB = H * (0.82 - 0.03 * tall), HA = H * (0.24 - 0.06 * tall), ts = Math.min(big * (1 + 0.15 * tall), ((HB - HA) * 0.9) / 530),   // the tree is as big as the sky above the hill allows
    hx = W * (0.4 - 0.02 * tall), hw = W * (0.4 + 0.25 * tall);
  const hillY = (x) => HB - HA * Math.exp(-(((x - hx) / hw) ** 2)) + 5 * nH(x / 150);
  const farY = (x) => H * (0.66 - 0.04 * tall) - H * 0.06 * nH(x / 360 + 7) - 5 * nH(x / 50);
  const far2Y = (x) => H * (0.72 - 0.04 * tall) - H * 0.05 * nH(x / 280 + 40);
  const tx = W * (0.34 - 0.02 * tall), ty = hillY(tx) + 12;
  // crown clumps: scattered through an oval, smaller towards its rim; s is how high the clump sits (0 bottom, 1 top)
  const RX = 215 * ts, RY = 150 * ts, CLUMPS = [];
  for (let i = 0; i < 56; i++) { const a = r() * TAU, d = Math.sqrt(r()), ox = Math.cos(a) * d * RX, oy = Math.sin(a) * d * RY; CLUMPS.push({ ox, oy, r: (58 - 26 * d + 14 * r()) * ts, s: (RY - oy) / (2 * RY), tone: oy > RY * 0.3 ? (r() < 0.55 ? 0 : 1) : [0, 1, 1, 1, 2, 2, 2, 2, 3, 3][Math.floor(r() * 10)], z: oy + r() * RY * 0.9, f: 3 + r() * 4, ph: r() * TAU }); }
  for (const [fx, fy, tone] of [[-0.45, 0.1, 0], [0, 0.2, 0], [0.45, 0.1, 1], [-0.2, -0.25, 1], [0.25, -0.25, 1]]) CLUMPS.push({ ox: fx * RX, oy: fy * RY, r: 84 * ts, s: (1 - fy) / 2, tone, z: 9999, f: 3 + r() * 2, ph: r() * TAU });   // big ones behind, so the sky never shows through
  CLUMPS.sort((u, v) => v.z - u.z);                            // low clumps at the back, with some shuffling
  const LEAVES = Array.from({ length: Math.round(54 + W / 60) }, (_, i) => ({ T: 6 + hash(i, 41) * 7, off: hash(i, 42) * 30, i }));   // leaves, blades and stalks take their numbers by index: a wider frame only adds some at the end
  // fence along the downwind shoulder of the hill; the gate hangs in one gap
  const POSTS = []; for (let x = tx + 300 * ts; x < W + 120; x += 100 * big) POSTS.push(x);
  const gate = Math.min(1, POSTS.length - 2), tie = 0;
  const L = Math.max(160, Math.min(H * 0.48, (W - 100 * big - POSTS[0]) / 0.55));          // length of the kite's string
  const BLADES = Array.from({ length: Math.round(W / 9) }, (_, i) => ({ x: -40 + (i + hash(i, 51)) * 9.6, h: (16 + hash(i, 52) * 30) * big, ph: hash(i, 53) }));
  const STALKS = Array.from({ length: Math.round(W / 14) }, (_, i) => ({ x: -40 + (i + hash(i, 61)) * 14.6, h: (60 + hash(i, 62) * 120) * big, w: 4 + hash(i, 63) * 3, ph: hash(i, 64) }));
  return { W, H, tall, big, ts, hillY, farY, far2Y, tx, ty, RX, RY, CLUMPS, LEAVES, POSTS, gate, tie, L, BLADES, STALKS };
}

export function paint(ctx, p, t, G) {
  const { W, H, big, ts, tx, ty, RX, RY } = G;
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  const gust = 0.5 + 0.5 * nW(t * 0.22), top = G.hillY(G.W * 0.4) ;
  ctx.fillStyle = A.sky; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = A.sky2; ctx.fillRect(0, top * 0.42, W, H); ctx.fillStyle = A.sky3; ctx.fillRect(0, top * 0.8, W, H);
  bars(ctx, CLOUDS, W, t, (y) => y * top * 1.15);

  const ridge = (fn, fill) => F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 10) c.lineTo(x, fn(x)); c.lineTo(W + 90, H + 60); c.closePath(); }, fill);
  layer(0.06, () => ridge(G.farY, A.far)); layer(0.1, () => ridge(G.far2Y, A.far2));

  layer(0.4, () => {
    // long grass along the skyline, flattened as each gust runs over the hill
    F(ctx, (c) => { for (const q of G.BLADES) { const by = G.hillY(q.x) + 5, lean = q.h * (0.55 + 0.4 * Math.sin(q.x / 190 - t * 2.1) * (0.6 + 0.4 * nB(q.x / 500 + t * 0.08)) + 0.08 * osc(p, 11, q.ph)); c.moveTo(q.x - 3, by); c.quadraticCurveTo(q.x + lean * 0.2, by - q.h * 0.7, q.x + lean, by - q.h * (1 - 0.25 * lean / q.h)); c.quadraticCurveTo(q.x + 3 + lean * 0.2, by - q.h * 0.6, q.x + 4, by); c.closePath(); } }, A.hill);
    ridge(G.hillY, A.hill);

    ctx.depthLayer?.('tree');
    // the tree: trunk, a few boughs, then the crown from the back forward
    const B = [tx, ty], T = [tx + (46 + 16 * gust) * ts, ty - 250 * ts], M = [tx - 14 * ts, ty - 150 * ts], cx = T[0] + (36 + 30 * gust) * ts, cy = T[1] - 80 * ts;
    const at = (q) => { const sh = 0.4 + gust; return [cx + q.ox + ((30 + 70 * gust) * Math.pow(q.s, 1.3) + Math.max(0, q.ox) * 0.16 * gust) * ts + 4 * sh * Math.sin(t * q.f + q.ph) * ts, cy + q.oy + 3 * sh * Math.sin(t * q.f * 1.3 + q.ph * 2) * ts]; };
    { const Lp = [], Rp = []; for (let i = 0; i <= 14; i++) { const u = i / 14, [x, y] = bez(B, M, T, u), [dx, dy] = bezT(B, M, T, u), w = lerp(24, 9, u) * ts * (i ? 1 : 1.5); Lp.push([x - dy * w, y + dx * w]); Rp.push([x + dy * w, y - dx * w]); } F(ctx, (c) => poly(c, Lp.concat(Rp.reverse())), A.ink); }
    ctx.strokeStyle = A.ink; ctx.lineCap = 'round'; ctx.lineWidth = 9 * ts; ctx.beginPath();
    for (const k of [3, 11, 19, 27, 35]) { const [qx, qy] = at(G.CLUMPS[k]); ctx.moveTo(T[0], T[1] + 12 * ts); ctx.quadraticCurveTo(lerp(T[0], qx, 0.3), lerp(T[1], qy, 0.7), qx, qy); }
    ctx.stroke();
    for (const q of G.CLUMPS) { const [x, y] = at(q); F(ctx, (c) => circle(c, x, y, q.r * (q.tone === 3 ? 0.8 : 1)), LEAF[q.tone]); }

    // grass in bands down the hill, each a row of teeth carrying waves downwind
    const bands = [[0.1, A.h2], [0.28, A.hill], [0.44, A.h2], [0.62, A.h3]];
    bands.forEach(([f, fill], j) => F(ctx, (c) => {
      const d = (H - top) * f, amp = 5 + 5 * j, lam = 320 + 110 * j, v = 150 + 50 * j, tooth = 6 + 3 * j;
      c.moveTo(-90, H + 60);
      for (let x = -90, i = 0; x <= W + 90; x += 9, i++) c.lineTo(x, G.hillY(x) * (1 - f * 0.5) + (top + (H - top) * 0.3) * f * 0.5 + d - amp * (Math.sin(((x - v * t) / lam) * TAU + j * 2.1) * (0.55 + 0.45 * nB(x / 480 + j * 9 - t * 0.06)) + 0.35 * Math.sin(((x - 1.7 * v * t) / (lam * 0.39)) * TAU + j)) - (i % 2 ? tooth : 0));
      c.lineTo(W + 90, H + 60); c.closePath();
    }, fill));

    ctx.depthLayer?.('fence');
    // fence, the swinging gate, and the kite tied to a post
    const P = G.POSTS, ph = 64 * big, gy = (x) => G.hillY(x) + 6;
    if (P.length > 1) {
      ctx.strokeStyle = A.ink; ctx.lineWidth = 6 * big; ctx.lineCap = 'butt'; ctx.beginPath();
      for (let i = 0; i < P.length - 1; i++) { if (i === G.gate) continue; for (const f of [0.4, 0.78]) { ctx.moveTo(P[i], gy(P[i]) - ph * f); ctx.lineTo(P[i + 1], gy(P[i + 1]) - ph * f); } }
      ctx.stroke();
      F(ctx, (c) => { for (const x of P) c.rect(x - 5 * big, gy(x) - ph, 10 * big, ph + 8); }, A.ink);
      // the gate seen nearly end on when it blows open, full width when it bangs shut
      { const gx = P[G.gate], g0 = gy(gx), ang = 0.75 + 0.6 * nW(t * 0.45 + 30) + 0.1 * Math.sin(t * 2.3), gw = (P[G.gate + 1] - gx - 12 * big) * Math.max(0.12, Math.cos(ang)), gh = ph * 0.86, sl = (gy(gx + gw) - g0) * 0.6;
        ctx.lineWidth = 5 * big; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(gx, g0 - gh); ctx.lineTo(gx + gw, g0 - gh + sl); ctx.lineTo(gx + gw, g0 - 8 * big + sl); ctx.lineTo(gx, g0 - 8 * big); ctx.lineTo(gx + gw, g0 - gh + sl); ctx.moveTo(gx, g0 - gh * 0.5); ctx.lineTo(gx + gw, g0 - gh * 0.5 + sl); ctx.stroke(); ctx.lineJoin = 'miter'; }
      const ax = P[G.tie], ay = gy(ax) - ph, el0 = 0.92 + 0.16 * nW(t * 0.3 + 60) + 0.04 * Math.sin(t * 1.9) - 0.1 * Math.max(0, nW(t * 0.13 + 90)), kx = Math.min(ax + G.L * Math.cos(el0), W - 70 * big), ky = ay - G.L * Math.sin(el0);
      const bow = (0.16 + 0.07 * gust) * G.L, mx = (ax + kx) / 2 + bow * 0.7, my = (ay + ky) / 2 + bow * 0.7;
      ctx.lineWidth = 2 * big; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo(mx, my, kx, ky); ctx.stroke();
      // its tail streams downwind in a travelling wave, with two bows tied on
      const rot = Math.atan2(ky - my, kx - mx) + Math.PI / 2 + 0.12 * Math.sin(t * 2.7) + 0.2, ks = 46 * big, tail = (u) => [kx - Math.sin(rot) * -ks * 0.9 + u * 170 * big, ky + Math.cos(rot) * ks * 0.9 + u * 60 * big + 16 * big * u * Math.sin(u * 9 - t * 6)];
      ctx.strokeStyle = A.ink; ctx.beginPath(); for (let i = 0; i <= 16; i++) { const q = tail(i / 16); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke();
      F(ctx, (c) => { for (const u of [0.4, 0.75]) { const q = tail(u), a = 0.5 * Math.cos(u * 9 - t * 6); poly(c, [[q[0], q[1]], [q[0] - 12 * big, q[1] - 9 * big + a * 6], [q[0] - 12 * big, q[1] + 9 * big + a * 6]]); poly(c, [[q[0], q[1]], [q[0] + 12 * big, q[1] - 9 * big - a * 6], [q[0] + 12 * big, q[1] + 9 * big - a * 6]]); } }, C.gold);
      ctx.save(); ctx.translate(kx, ky); ctx.rotate(rot);
      F(ctx, (c) => poly(c, [[0, -ks], [ks * 0.62, -ks * 0.2], [0, ks * 0.9], [-ks * 0.62, -ks * 0.2]]), C.orange);
      F(ctx, (c) => { poly(c, [[0, -ks], [ks * 0.62, -ks * 0.2], [0, -ks * 0.2]]); poly(c, [[0, ks * 0.9], [-ks * 0.62, -ks * 0.2], [0, -ks * 0.2]]); }, C.cream);
      ctx.restore();
    }
  });

  // leaves torn from the crown (and some blown in from trees out of frame) cross on the wind, each trip on a new path
  { const cx = tx + 100 * ts + sway(p, 0.4), cy = ty - 330 * ts;
    for (let tone = 0; tone < 4; tone++) F(ctx, (c) => { for (const q of G.LEAVES) {
      if (q.i % 4 !== tone) continue;
      const cyc = (t + q.off) / q.T, n = Math.floor(cyc), u = cyc - n, h = (k) => hash(n * 131 + q.i, k), crown = h(1) < 0.72;
      const sx = crown ? cx + (h(2) - 0.3) * RX * 1.5 : -50, sy = crown ? cy + (h(3) - 0.5) * RY * 1.5 : H * (0.08 + 0.62 * h(3));
      const R = (18 + 50 * h(5)) * big, th = TAU * (1.2 + 2.6 * h(6)) * u + h(7) * TAU, e = Math.min(1, u * 7);
      const x = sx + (W + 90 - sx) * Math.pow(u, 0.85) + e * R * Math.cos(th), y = sy + (h(4) - 0.38) * H * 0.55 * u + e * R * 0.8 * Math.sin(th), sz = (6 + 7 * h(8)) * big * e;
      if (sz > 0.6) el(c, x, y, sz, sz * 0.45, th * 1.7);
    } }, LEAF[tone]);
  }

  ctx.depthLayer?.('grass');
  // the near slope and its long grass
  layer(1, () => {
    F(ctx, (c) => {
      c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 12) c.lineTo(x, H * 0.95 + 10 * nH(x / 200 + 80) - H * 0.03 * Math.cos((x / W) * TAU)); c.lineTo(W + 90, H + 60); c.closePath();
      for (const q of G.STALKS) { const by = H + 10, lean = q.h * (0.4 + 0.3 * Math.sin(q.x / 230 - t * 1.7) * (0.6 + 0.4 * nB(q.x / 600 + t * 0.07)) + 0.06 * osc(p, 11, q.ph)); c.moveTo(q.x - q.w / 2, by); c.quadraticCurveTo(q.x + lean * 0.15, by - q.h * 0.6, q.x + lean, by - q.h * (1 - 0.15 * lean / q.h)); c.quadraticCurveTo(q.x + q.w / 2 + lean * 0.15, by - q.h * 0.6, q.x + q.w / 2, by); c.closePath(); }
    }, A.near);
  });
}
