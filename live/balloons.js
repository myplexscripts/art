// Daybreak Series No. 04: Balloon Dawn. Six balloons ride the morning air over a valley of rock spires, the far ones
// small and pale, the near ones big and striped. Each drifts on its own wind, lifts and sinks over minutes, turns
// slowly so its stripes creep round, and fires its burner in short pulses. One that leaves the frame comes back in on
// the other side. The valley is three bands of spires, lighter far and darker near, with a river and mist between.
import { mulberry, clamp, lerp, frac, osc, sway, noise1, poly, circle, pill, TAU } from './geom.js';
import { C, F } from './kit.js';
import { hash, el, bars } from './bits.js';

export const title = 'BALLOON DAWN', no = 'No. 04', text = '#4a2340', dark = '#2c1528';
const P = { sky: '#ee9a82', r1: '#f3ae8a', r2: '#f7c492', r3: '#f5c868', t1: '#e3b196', t2: '#cf937e', t3: '#ad6f68', t4: '#7c4856', plum: '#55264a', ink: '#371a33' };
const nB = noise1(1501), nV = noise1(1511);
const CLOUDS = [[0.1, 0.12, 460, 16, P.r1, 4], [0.2, 0.18, 240, 12, P.r1, 4], [0.66, 0.3, 400, 14, P.r2, 6], [0.4, 0.5, 320, 12, C.cream, 8], [0.85, 0.62, 260, 10, P.r2, 9]];
const MIST = [[0.1, 0.3, 520, 20, C.cream, 6], [0.6, 0.34, 420, 16, P.r2, -5], [0.35, 0.62, 600, 24, C.cream, -9], [0.8, 0.66, 380, 20, P.t1, 11]];
// the balloons, far to near: [size, height in the sky, speed, where it starts, its inks in the order the stripes take, basket ink]
const FLEET = [[0.26, 0.76, 2.4, 0.62, [P.t1, C.cream], P.t3], [0.34, 0.6, 3, 0.92, [C.cream, P.t2], P.t3], [0.48, 0.4, 4, 0.2, [C.gold, C.cream, P.t3], P.t4], [0.66, 0.24, 5.5, 0.76, [C.cream, C.orange, C.gold], P.plum], [0.9, 0.5, 7, 0.46, [C.gold, P.plum], P.plum], [1.2, 0.34, 9, 0.06, [C.orange, C.cream, P.plum], P.plum]];
// the envelope's half width at 13 heights, crown to mouth: a dome that tapers in
const PROF = Array.from({ length: 13 }, (_, i) => { const v = i / 12; return v < 0.46 ? Math.sqrt(1 - (1 - v / 0.46) ** 2) : 0.2 + 0.8 * Math.pow(Math.cos(((v - 0.46) / 0.54) * Math.PI * 0.5), 0.9); });

// One balloon about the middle of its dome. rot turns it, so the stripes travel round; f is how hard the burner is on.
function balloon(ctx, x, y, R, inks, deep, rot, f) {
  const top = y - R, hh = 2.3 * R, ym = top + hh, by = ym + 0.44 * R, n = 8, k = inks.length, gore = Math.PI / n, phi = ((rot % (k * gore)) + k * gore) % (k * gore);
  ctx.strokeStyle = deep; ctx.lineWidth = Math.max(1, R * 0.012); ctx.beginPath(); for (const sd of [-1, 1]) { ctx.moveTo(x + sd * 0.17 * R, ym + 0.1 * R); ctx.lineTo(x + sd * 0.12 * R, by); ctx.moveTo(x + sd * 0.06 * R, ym + 0.1 * R); ctx.lineTo(x + sd * 0.04 * R, by); } ctx.stroke();
  if (f > 0) {
    F(ctx, (c) => { const ty = ym - 0.3 * R * f, b = by - 0.05 * R, w = 0.1 * R * (0.6 + 0.4 * f); c.moveTo(x, ty); c.quadraticCurveTo(x + w * 1.6, lerp(ty, b, 0.75), x, b); c.quadraticCurveTo(x - w * 1.6, lerp(ty, b, 0.75), x, ty); c.closePath(); }, C.gold);
    F(ctx, (c) => circle(c, x, by - 0.1 * R, 0.035 * R), C.cream);
  }
  const side = (c, a, back) => { const s = Math.sin(a) * R; if (back) for (let i = 12; i >= 0; i--) c.lineTo(x + s * PROF[i], top + (i / 12) * hh); else for (let i = 0; i <= 12; i++) c.lineTo(x + s * PROF[i], top + (i / 12) * hh); };
  F(ctx, (c) => { c.moveTo(x, top); side(c, -Math.PI / 2); side(c, Math.PI / 2, true); c.closePath(); }, inks[0]);
  for (let m = 1; m < k; m++) F(ctx, (c) => {
    for (let i = -k; i <= n; i++) {
      if ((((i % k) + k) % k) !== m) continue;
      const lo = Math.max(-Math.PI / 2, -Math.PI / 2 + phi + i * gore), hi = Math.min(Math.PI / 2, -Math.PI / 2 + phi + (i + 1) * gore);
      if (hi - lo < 0.01) continue;
      c.moveTo(x + Math.sin(lo) * R * PROF[0], top); side(c, lo); side(c, hi, true); c.closePath();
    }
  }, inks[m]);
  F(ctx, (c) => { poly(c, [[x - 0.2 * R, ym - 1], [x + 0.2 * R, ym - 1], [x + 0.17 * R, ym + 0.11 * R], [x - 0.17 * R, ym + 0.11 * R]]); c.rect(x - 0.14 * R, by, 0.28 * R, 0.2 * R); }, deep);
  F(ctx, (c) => c.rect(x - 0.15 * R, by, 0.3 * R, 0.035 * R), f > 0 ? C.gold : inks[0]);
}

// a rock spire: a leaning cone with a rounded top, added to the current path
const spire = (c, x, b, h, w, ln) => { c.moveTo(x - w, b + 4); c.quadraticCurveTo(x - w * 0.42 + ln * 0.4, b - h * 0.5, x - w * 0.22 + ln, b - h * 0.88); c.quadraticCurveTo(x + ln, b - h * 1.06, x + w * 0.22 + ln, b - h * 0.88); c.quadraticCurveTo(x + w * 0.42 + ln * 0.4, b - h * 0.5, x + w, b + 4); c.closePath(); };

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall;
  const HY = Math.round(H * (0.7 - 0.02 * tall)), gh = H - HY, hsc = clamp(gh / 300, 0.85, 1.7);
  const SUN = { x: W * (0.3 - 0.02 * tall), y: HY - H * 0.13, r: 66 * big };
  const farY = (x) => HY - H * 0.025 - H * 0.06 * (0.5 + 0.5 * nV(x / 420 + 5)) - 5 * nV(x / 60);
  const gY = [(x) => HY + 5 * nV(x / 200 + 10), (x) => HY + gh * 0.36 + 9 * nV(x / 230 + 20), (x) => HY + gh * 0.66 + 12 * nV(x / 260 + 30)];
  // the spires of each band stand in loose groups; each takes its numbers from its own place in the row
  const stand = (j, step, h0, h1) => { const a = []; for (let x = -80, i = 0; x < W + 80; x += step, i++) { const px = x + hash(i, 10 * j + 1) * step * 0.8, on = Math.abs(nV(px / (240 + 80 * j) + j * 13)); if (on < 0.16) continue; const h = lerp(h0, h1, hash(i, 10 * j + 2) * Math.min(1, on * 1.8)) * hsc; a.push({ x: px, b: gY[j](px), h, w: h * (0.2 + 0.12 * hash(i, 10 * j + 3)) + 7, ln: (hash(i, 10 * j + 4) - 0.5) * h * 0.08, cap: hash(i, 10 * j + 5) < 0.45 }); } return a; };
  const SP = [stand(0, 34, 26, 84), stand(1, 64, 54, 150), stand(2, 104, 80, 210)];
  const fgY = (x) => H - 22 - H * 0.05 * Math.pow(Math.abs(x / W - 0.5) * 2, 2) + 10 * nV(x / 180 + 40);
  const FG = [[0.02, 0.44, 0.09], [0.085, 0.27, 0.06], [0.14, 0.15, 0.04], [0.91, 0.2, 0.05], [0.985, 0.4, 0.085]].map(([fx, fh, fw]) => ({ x: fx * W, h: Math.min(fh * H, fh * 1500), w: Math.min(fw * H, fw * 1500) + 10, ln: (0.5 - fx) * 30 }));
  const TUFTS = Array.from({ length: Math.round(W / 40) }, (_, i) => ({ x: hash(i, 61) * W, h: 18 + hash(i, 62) * 40, c: [5, 7, 9][Math.floor(hash(i, 63) * 3)], ph: hash(i, 64), n: 3 + Math.floor(hash(i, 65) * 3) }));
  // cross is the seconds one trip round takes: the balloon's old speed over a frame 1800 wide
  const FLEETG = FLEET.map(([s, yf, v, x0, inks, deep], k) => ({ R: 120 * s * big, yf, cross: (1900 + 288 * s) / v, x0, inks, deep, k, slot: 6 + 3.5 * hash(k, 1) }));
  return { W, H, HY, gh, tall, big, SUN, farY, gY, SP, fgY, FG, TUFTS, FLEET: FLEETG };
}

export function paint(ctx, p, t, G) {
  const { W, H, HY, gh, SUN, big } = G, a = (TAU * t) / 420, mx = SUN.x + sway(p, 0.03) + 60 * Math.sin(a), my = SUN.y - HY * 0.09 * (1 - Math.cos(a));
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  const ground = (top, fill) => F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 12) c.lineTo(x, top(x)); c.lineTo(W + 90, H + 60); c.closePath(); }, fill);
  // where a balloon is now: it crosses, wraps round, and rides up and down on slow noise. What wraps is its share of
  // the way across, which does not depend on the size.
  const fly = (b) => {
    const pad = b.R * 1.2 + 50, span = W + 2 * pad, x = frac(b.x0 + t / b.cross + (60 * nB(t * 0.013 + b.k * 7)) / span) * span - pad, y = HY * b.yf + HY * 0.13 * nB(t / 80 + b.k * 11.3) + 5 * big * osc(p, 3 + (b.k % 3), b.k * 0.2);
    const tt = t + b.k * 3.3, n = Math.floor(tt / b.slot), q = mulberry(n * 311 + b.k * 17), on = q() < 0.72, st = q() * (b.slot - 3.2), len = 1.2 + q() * 1.8, u = (tt - n * b.slot - st) / len;
    const f = on && u > 0 && u < 1 ? Math.min(1, 6 * u, 6 * (1 - u)) * (0.86 + 0.14 * Math.sin(t * 13 + b.k)) : 0;
    balloon(ctx, x, y, b.R, b.inks, b.deep, t * 0.021 * (b.k % 2 ? 1 : -1) + b.k * 1.7, f);
  };
  ctx.fillStyle = P.sky; ctx.fillRect(0, 0, W, H);
  F(ctx, (c) => circle(c, mx, my, 780), P.r1); F(ctx, (c) => circle(c, mx, my, 500), P.r2); F(ctx, (c) => circle(c, mx, my, 250), P.r3);
  F(ctx, (c) => circle(c, mx, my, SUN.r), C.cream);
  bars(ctx, CLOUDS, W, t, (y) => y * HY);
  fly(G.FLEET[0]); fly(G.FLEET[1]);

  // birds cross high up now and then, in a loose line. The slots are a fixed length, so the size never changes which
  // one the clock is in; on a very wide frame the birds fly a little faster to fit theirs.
  { const dur = Math.min((W + 300) / 60, 46), slot = 72, n = Math.floor(t / slot), q = mulberry(n * 5521 + 2), go = q() < 0.75, dir = q() < 0.5 ? -1 : 1, cnt = 4 + Math.floor(q() * 4), u = (t - n * slot - 2 - q() * 24) / dur, y0 = HY * (0.12 + 0.4 * q());
    if (go && u >= 0 && u <= 1) { ctx.strokeStyle = P.plum; ctx.lineWidth = 2.4 * big; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
      for (let k = 0; k < cnt; k++) { const s = 9 * big, e = u * (W + 300) - 60 - k * 34 * big + 12 * nB(t * 0.3 + k * 5), x = dir > 0 ? e : W - e, y = y0 + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 15 * big + 8 * nB(t * 0.25 + k * 9), fl = s * 0.7 * Math.sin(t * 5 + k * 1.9); ctx.moveTo(x - s, y - fl); ctx.lineTo(x, y); ctx.lineTo(x + s, y - fl); }
      ctx.stroke(); } }

  ctx.depthLayer?.('valley');
  // far tableland, then the three bands of the valley
  layer(0.06, () => F(ctx, (c) => { c.moveTo(-90, HY + 30); for (let x = -90; x <= W + 90; x += 10) c.lineTo(x, G.farY(x)); c.lineTo(W + 90, HY + 30); c.closePath(); }, P.t1));
  const INK = [P.t2, P.t3, P.t4], LIT = [P.t1, P.t2, P.t3];
  for (let j = 0; j < 3; j++) {
    layer(0.14 + 0.2 * j, () => {
      ground(G.gY[j], INK[j]);
      F(ctx, (c) => { for (const s of G.SP[j]) spire(c, s.x, s.b, s.h, s.w, s.ln); }, INK[j]);
      // the sunward flank of each spire is one ink lighter, and some wear a darker cap
      F(ctx, (c) => { for (const s of G.SP[j]) { const sd = s.x > mx ? -1 : 1; c.moveTo(s.x + s.ln + sd * s.w * 0.16, s.b - s.h * 0.94); c.quadraticCurveTo(s.x + sd * s.w * 0.44 + s.ln * 0.4, s.b - s.h * 0.5, s.x + sd * s.w, s.b + 4); c.lineTo(s.x + sd * s.w * 0.55, s.b + 4); c.quadraticCurveTo(s.x + sd * s.w * 0.2 + s.ln * 0.4, s.b - s.h * 0.5, s.x + s.ln + sd * s.w * 0.16, s.b - s.h * 0.94); c.closePath(); } }, LIT[j]);
      if (j) F(ctx, (c) => { for (const s of G.SP[j]) if (s.cap) el(c, s.x + s.ln, s.b - s.h * 0.93, s.w * 0.34, s.h * 0.075); }, j === 1 ? P.t4 : P.plum);
      if (j === 0) {
        // the river winds across the far floor and carries the sun in short strokes
        const ry = (x) => HY + gh * (0.19 + 0.085 * Math.sin((x / W) * 5.2 + 1) + 0.03 * Math.sin((x / W) * 13)), rw = (x) => gh * (0.05 + 0.025 * Math.sin((x / W) * 7 + 2));
        F(ctx, (c) => { c.moveTo(-90, ry(-90)); for (let x = -90; x <= W + 90; x += 14) c.lineTo(x, ry(x) - rw(x)); for (let x = W + 90; x >= -90; x -= 14) c.lineTo(x, ry(x) + rw(x)); c.closePath(); }, P.r2);
        F(ctx, (c) => { for (let k = 0; k < 9; k++) { const gx = ((((k * 0.137 + 0.004 * t * (1 + 0.3 * hash(k, 2))) % 1) + 1) % 1) * (W + 200) - 100, w = (26 + 30 * hash(k, 3)) * (0.6 + 0.4 * osc(p, 5 + (k % 4), k * 0.3)) * big; pill(c, gx - w / 2, ry(gx) - 2.5 + (hash(k, 5) - 0.5) * rw(gx), w, 5); } }, C.gold);
      }
    });
    if (j === 0) { bars(ctx, MIST.slice(0, 2), W, t, (y) => HY + y * gh); fly(G.FLEET[2]); }
    if (j === 1) bars(ctx, MIST.slice(2), W, t, (y) => HY + y * gh);
  }
  ctx.depthLayer?.('balloon');
  fly(G.FLEET[3]);

  ctx.depthLayer?.('spires');
  // foreground: dark spires at the edges and dry grass along the rim
  layer(1, () => {
    ground(G.fgY, P.ink);
    F(ctx, (c) => { for (const s of G.FG) spire(c, s.x, H + 30, s.h, s.w, s.ln); }, P.ink);
    F(ctx, (c) => { for (const q of G.TUFTS) { const gy = G.fgY(q.x) + 4; for (let k = 0; k < q.n; k++) { const bx = q.x + k * 7, h = q.h * (0.6 + 0.4 * hash(k, q.n)) * big, sw = h * (0.2 * osc(p, q.c, q.ph + k * 0.05) + (k - q.n / 2) * 0.16); c.moveTo(bx - 3, gy); c.quadraticCurveTo(bx + sw * 0.2, gy - h * 0.6, bx + sw, gy - h); c.quadraticCurveTo(bx + 3 + sw * 0.2, gy - h * 0.6, bx + 3, gy); c.closePath(); } } }, P.ink);
  });
  fly(G.FLEET[4]); fly(G.FLEET[5]);
}
