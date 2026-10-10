// Daybreak Series No. 01: Rice Terraces. A hillside cut into steps of still water that mirror the morning sky, each
// step held by a darker bank. The sun comes up over far blue mountains; mist slides between the levels and egrets
// glide across now and then. The steps are stacked back to front, each one a rim, a bank and a sheet of water, all
// built once in make; paint only slides them, sways the young rice and moves the glints.
import { mulberry, clamp, lerp, osc, sway, noise1, poly, circle, pill, TAU } from './geom.js';
import { C, F } from './kit.js';
import { hash, bars } from './bits.js';

export const title = 'RICE TERRACES', no = 'No. 01', text = '#17403a', dark = '#0f2e2a';
const P = { sky: '#f3a98b', r1: '#f6ba8c', r2: '#f9cf96', r3: '#f4c25c', m1: '#a9bdd3', m2: '#7f9fbd', j0: '#a9d0a6', j1: '#6fae90', j2: '#3f8672', j3: '#235f52', ink: '#123832' };
const nT = noise1(1201), nM = noise1(1213), nG = noise1(1223);
const CLOUDS = [[0.08, 0.2, 420, 22, P.r1, 4], [0.16, 0.27, 240, 16, P.r1, 4], [0.62, 0.42, 380, 20, P.r2, 6], [0.7, 0.49, 200, 14, P.r2, 6], [0.4, 0.7, 300, 16, C.cream, 8]];
// mist between the levels: [x share, depth down the hillside 0..1, width, height, ink, speed]
const MIST = [[0.1, 0.12, 420, 20, C.cream, 7], [0.55, 0.26, 520, 26, C.cream, -9], [0.8, 0.42, 380, 24, P.r2, 11], [0.3, 0.58, 560, 30, C.cream, -13], [0.65, 0.76, 460, 30, C.cream, 15]];
const STEP = 12, X0 = -132;

// a palm added to the current path: a bent trunk and seven drooping fronds, all wound the same way
function palm(c, x, y, h, lean, sw, k) {
  const tx = x + lean + sw * h * 0.03, ty = y - h, w = h * 0.03 + 3, len = h * 0.4;
  c.moveTo(x - w, y); c.quadraticCurveTo(x - w * 0.6 + lean * 0.15, y - h * 0.55, tx - w * 0.45, ty); c.lineTo(tx + w * 0.45, ty); c.quadraticCurveTo(x + w * 0.6 + lean * 0.15, y - h * 0.55, x + w, y); c.closePath();
  for (let i = 0; i < 7; i++) {
    const a = -2.95 + i * 0.46 + 0.05 * sw + 0.03 * Math.sin(k + i * 1.7 + sw), l = len * (0.8 + 0.2 * hash(i, k)), dx = Math.cos(a), dy = Math.sin(a);
    const ex = tx + dx * l, ey = ty + dy * l + l * 0.5, ux = tx + dx * l * 0.55, uy = ty + dy * l * 0.55 - l * 0.2, lx = ux, ly = uy + l * 0.26;
    c.moveTo(tx, ty);
    if (dx > 0) { c.quadraticCurveTo(ux, uy, ex, ey); c.quadraticCurveTo(lx, ly, tx, ty); } else { c.quadraticCurveTo(lx, ly, ex, ey); c.quadraticCurveTo(ux, uy, tx, ty); }
    c.closePath();
  }
  circle(c, tx, ty, w * 1.3);
}

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall;
  const HY = Math.round(H * (0.4 - 0.03 * tall));              // where the hillside begins
  const SUN = { x: W * (0.36 - 0.04 * tall), y: HY - H * 0.15, r: 70 * big };
  const m1 = (x) => HY - H * 0.05 - H * 0.14 * Math.pow(Math.abs(nM(x / 330 + 3)), 0.8) - 7 * nM(x / 40);
  const m2 = (x) => HY - H * 0.02 - H * 0.08 * Math.pow(Math.abs(nM(x / 250 + 40)), 0.9) - 5 * nM(x / 33 + 9);

  // the steps: N + 1 top edges, far to near. The hill stands up on the right, and each contour swings round it.
  const N = clamp(Math.round((H - HY) / 72), 8, 16), span = H - HY + 40;
  const hill = (x) => H * 0.1 * Math.pow(0.5 + 0.5 * Math.cos(clamp((x / W - 0.84) * 2.6, -Math.PI, Math.PI)), 2);
  const E = (j, x) => { const u = j / N; return HY - hill(x) * Math.pow(1 - u, 3) + span * Math.pow(u, 1.2) * (0.86 + 0.14 * Math.cos((x / W - 0.3 - 0.3 * u) * 3.4)) + (4 + 10 * u) * nT(x / 210 + j * 7.3); };
  const XS = []; for (let x = X0; x <= W + 132; x += STEP) XS.push(x);
  const at = (a, x) => { const f = clamp((x - X0) / STEP, 0, a.length - 1.001), i = Math.floor(f); return lerp(a[i], a[i + 1], f - i); };
  const LV = [];
  for (let j = 0; j <= N; j++) {
    const u = j / N, rim = XS.map((x) => E(j, x)), bank = rim.map((y) => y + 3 + 5 * u), water = XS.map((x, i) => bank[i] + (6 + 22 * u) * (0.75 + 0.35 * nT(x / 150 + j * 3.1)));
    LV.push({ u, rim, bank, water, tone: u < 0.3 ? 0 : u < 0.62 ? 1 : 2, tx: [], ty: [], th: [], d: 0.15 + 0.6 * u });
  }
  // young rice: rows of short strokes standing in each sheet of water. Each stroke takes its numbers from its own
  // column and row, so a change of size never hands them round.
  for (let j = 0; j < N; j++) {
    const L = LV[j], u = L.u, sp = Math.max(10 + 12 * u, W / 120);
    for (let x = X0 + 20, i = 0; x < W + 120; x += sp, i++) {
      const top = at(L.water, x) + 5, av = at(LV[j + 1].rim, x) - 2 - top, nr = clamp(Math.floor(av / (11 + 12 * u)), 0, 4);
      for (let k = 0; k < nr; k++) { L.tx.push(x + (k % 2) * sp * 0.5 + (hash(i * 4 + k, 2 * j) - 0.5) * 3); L.ty.push(top + (av * (k + 0.85)) / (nr + 0.35)); L.th.push((4 + 9 * u) * (0.8 + 0.4 * hash(i * 4 + k, 2 * j + 1))); }
    }
  }
  const jh = Math.round(N * 0.5), hut = { j: jh, x: W * (0.66 - 0.08 * tall), s: (0.75 + 0.35 * jh / N) * big };
  // small palms standing on the rims: [step, x share, height]
  const PALMS = [[0, 0.78, 70], [0, 0.84, 90], [0, 0.93, 60], [Math.round(N * 0.25), 0.14, 110], [Math.round(N * 0.25), 0.19, 80], [jh, hut.x / W - 0.09, 190], [jh, hut.x / W + 0.1, 150], [jh, hut.x / W + 0.14, 110]].map(([j, fx, h], i) => ({ j, x: fx * W, h: h * big, lean: (hash(i, 3) - 0.5) * 50, c: [3, 4, 5][i % 3], ph: hash(i, 5) }));
  const fgY = (x) => H - 26 - H * 0.07 * Math.pow(clamp(1 - x / (W * 0.42)), 1.5) - H * 0.05 * Math.pow(clamp((x - W * 0.7) / (W * 0.3)), 1.5) + 10 * nG(x / 160);
  const ph = Math.min(H * 0.5, 600 * big);
  const BIG = [[0.06, 1, 60], [0.165, 0.76, 110], [0.955, 0.66, -70]].map(([fx, s, lean], i) => ({ x: fx * W, h: ph * s, lean: lean * big, c: [3, 4, 5][i], ph: i * 0.31 }));
  const TUFTS = Array.from({ length: Math.round(W / 34) }, (_, i) => ({ x: hash(i, 61) * W, h: 24 + hash(i, 62) * 50, c: [5, 7, 9][Math.floor(hash(i, 63) * 3)], ph: hash(i, 64), n: 3 + Math.floor(hash(i, 65) * 3) }));
  return { W, H, HY, tall, big, SUN, m1, m2, N, span, XS, at, LV, hut, PALMS, fgY, BIG, TUFTS };
}

export function paint(ctx, p, t, G) {
  const { W, H, HY, SUN, big, N, XS, LV } = G, a = (TAU * t) / 420, mx = SUN.x + sway(p, 0.03) + 60 * Math.sin(a), my = SUN.y - HY * 0.1 * (1 - Math.cos(a));
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  const below = (e, fill) => F(ctx, (c) => { c.moveTo(XS[0], e[0]); for (let i = 1; i < XS.length; i++) c.lineTo(XS[i], e[i]); c.lineTo(XS[XS.length - 1], H + 60); c.lineTo(XS[0], H + 60); c.closePath(); }, fill);
  ctx.fillStyle = P.sky; ctx.fillRect(0, 0, W, H);
  F(ctx, (c) => circle(c, mx, my, 760), P.r1); F(ctx, (c) => circle(c, mx, my, 480), P.r2); F(ctx, (c) => circle(c, mx, my, 250), P.r3);
  F(ctx, (c) => circle(c, mx, my, SUN.r), C.cream);
  bars(ctx, CLOUDS, W, t, (y) => y * HY);

  const ridge = (top, fill) => F(ctx, (c) => { c.moveTo(-60, HY + 20); for (let x = -60; x <= W + 60; x += 8) c.lineTo(x, top(x)); c.lineTo(W + 60, HY + 20); c.closePath(); }, fill);
  layer(0.06, () => ridge(G.m1, P.m1));
  layer(0.1, () => ridge(G.m2, P.m2));

  ctx.depthLayer?.('fields');
  const WALL = [P.j1, P.j2, P.j3], RIM = [P.j0, P.j1, P.j2];
  for (let j = 0; j <= N; j++) {
    if (j === Math.floor(N / 2)) ctx.depthLayer?.('near-fields');
    const L = LV[j], u = L.u, dx = sway(p, L.d);
    ctx.save(); ctx.translate(dx, 0);
    below(L.rim, RIM[L.tone]); below(L.bank, WALL[L.tone]); below(L.water, j % 2 ? P.r1 : P.r2);
    // what stands on this rim
    F(ctx, (c) => { for (const q of G.PALMS) if (q.j === j) palm(c, q.x, G.at(L.rim, q.x) + 4, q.h, q.lean, osc(p, q.c, q.ph), q.c); }, WALL[L.tone]);
    if (G.hut.j === j) {
      const { x, s } = G.hut, y = G.at(L.rim, x) + 3;
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      F(ctx, (c) => { for (const sx of [-36, -13, 10, 33]) c.rect(sx, -44, 5, 50); c.rect(-48, -50, 96, 8); c.rect(-38, -96, 76, 48); poly(c, [[44, -44], [50, -44], [70, 4], [64, 4]]); for (let k = 0; k < 4; k++) c.rect(50 + k * 4.6, -36 + k * 11, 12, 3); }, P.ink);
      F(ctx, (c) => poly(c, [[-66, -90], [66, -90], [26, -158], [-26, -158]]), C.orange);
      F(ctx, (c) => { c.rect(-66, -94, 132, 7); c.rect(-30, -162, 60, 6); }, C.rust);
      F(ctx, (c) => c.rect(-8, -84, 18, 22), C.gold);
      ctx.restore();
    }
    if (j < N) {
      // the sun's glints lie in the water under it and wander slowly sideways
      const wy = G.at(L.water, mx - dx), ny = G.at(LV[j + 1].rim, mx - dx), av = ny - wy;
      if (av > 14) for (let k = 0; k < 2; k++) {
        const w = (60 + 150 * u) * (0.6 + 0.4 * osc(p, 5 + ((j + k) % 4), j * 0.37 + k * 0.5)), gx = mx - dx + W * 0.16 * nG(t * 0.021 + j * 5.1 + k * 9.7) + (k ? 1 : -1) * w * 0.4, hh = 5 + 5 * u;
        F(ctx, (c) => pill(c, gx - w / 2, wy + av * (0.3 + 0.36 * k) - hh / 2, w, hh), k ? C.cream : C.gold);
      }
      // the rice leans in waves that travel along the rows
      ctx.strokeStyle = WALL[L.tone]; ctx.lineWidth = 1.6 + 1.8 * u; ctx.lineCap = 'round'; ctx.beginPath();
      for (let i = 0; i < L.tx.length; i++) { const x = L.tx[i], y = L.ty[i], h = L.th[i], ln = h * (0.3 * Math.sin(x * 0.011 - t * 0.5 + j * 1.3) + 0.14 * Math.sin(x * 0.031 + t * 0.83)); ctx.moveTo(x, y); ctx.lineTo(x + ln, y - h); }
      ctx.stroke();
    }
    ctx.restore();
    for (const m of MIST) if (Math.round(m[1] * N) === j) bars(ctx, [m], W, t, (v) => HY + G.span * Math.pow(v, 1.2) * 0.9 - 30);
  }

  // egrets cross now and then, a few together, gliding with slow beats. The slots are a fixed length, so the size
  // never changes which slot the clock is in; on a very wide frame they fly a little faster to fit theirs.
  { const dur = Math.min((W + 200) / 70, 52), slot = 64, n = Math.floor(t / slot), q = mulberry(n * 7717 + 5), go = q() < 0.8, dir = q() < 0.5 ? -1 : 1, cnt = 1 + Math.floor(q() * 3), u = (t - n * slot - 2 - q() * (slot - dur - 4)) / dur, y0 = HY - H * 0.05 + G.span * 0.3 * q();
    if (go && u >= 0 && u <= 1) F(ctx, (c) => {
      for (let k = 0; k < cnt; k++) {
        const s = 15 * big, e = u * (W + 200) - 100 - k * 64 * big, x = dir > 0 ? e : W - e, y = y0 + k * 22 * big + 12 * Math.sin(t * 0.4 + k * 2) - 40 * Math.sin(u * Math.PI), fl = Math.sin(t * 2.4 + k * 1.3);
        pill(c, x - s, y - s * 0.13, s * 2, s * 0.26); poly(c, [[x - dir * s * 0.5, y], [x + dir * s * 0.35, y], [x - dir * s * 0.25, y - s * (0.2 + 0.9 * fl)]]);
        poly(c, [[x + dir * s * 0.8, y - s * 0.1], [x + dir * s * 1.5, y - s * 0.22], [x + dir * s * 0.8, y + s * 0.1]]);
      }
    }, C.cream);
  }

  ctx.depthLayer?.('palms');
  // foreground: a dark bank with tall palms at the edges and grass along it
  layer(1, () => {
    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 12) c.lineTo(x, G.fgY(x)); c.lineTo(W + 90, H + 60); c.closePath(); }, P.ink);
    F(ctx, (c) => { for (const q of G.BIG) palm(c, q.x, G.fgY(q.x) + 20, q.h, q.lean, osc(p, q.c, q.ph) + 0.4 * osc(p, 9, q.ph), q.c + 4); }, P.ink);
    F(ctx, (c) => { for (const q of G.TUFTS) { const gy = G.fgY(q.x) + 4; for (let k = 0; k < q.n; k++) { const bx = q.x + k * 7, h = q.h * (0.6 + 0.4 * hash(k, q.n)) * big, sw = h * (0.2 * osc(p, q.c, q.ph + k * 0.05) + (k - q.n / 2) * 0.16); c.moveTo(bx - 3, gy); c.quadraticCurveTo(bx + sw * 0.2, gy - h * 0.6, bx + sw, gy - h); c.quadraticCurveTo(bx + 3 + sw * 0.2, gy - h * 0.6, bx + 3, gy); c.closePath(); } } }, P.ink);
  });
}
