// Window Series No. 02: Sleeper Car. A night compartment: round-cornered windows, a fold-down table with a lamp and a
// book, curtains on a brass rod, seat backs in the corners. The whole room rocks a little on its springs while the
// country slides by outside, drawn from noise along endless strips (far hills slow, trees and telegraph poles fast),
// with small towns and level crossings coming past and the moon holding still. A wide screen gets two windows side
// by side, a phone one tall one with a vent light across its top; the wall between and around them stays the same.
import { mulberry, lerp, clamp, osc, noise1, poly, circle, pill, frac, TAU } from './geom.js?v=20261011-clock-edge';
import { C, F } from './kit.js?v=20261011-clock-edge';
import { hash, el, makeStars, paintStars, meteor, pine } from './bits.js?v=20261011-clock-edge';

export const title = 'SLEEPER CAR', no = 'No. 02', text = '#14183a', dark = '#080b1a';
const S = { sky: '#0c1838', h1: '#122650', h2: '#1a3a6c', far: '#2d5f92', mid: '#1c4270', field: '#143258', near: '#0d2040', ink: '#080b1a', wall: '#1c1428', panel: '#2e1f38', wood: '#6b3f2b', fold: '#8f4a2c' };
const nF = noise1(1201), nM = noise1(1213), nN = noise1(1223), nR = noise1(1229);
const V = 420;
const CLOUDS = [[0.1, 0.22, 430, 26, S.h1, -4], [0.18, 0.3, 250, 20, S.h1, -4], [0.6, 0.5, 380, 24, S.h2, -7], [0.4, 0.72, 300, 20, S.h2, -10]];

// Bars of cloud that cross the sky and come back in from the left: [x share, y, width, height, color, units per second].
// As bars() in bits.js, but what wraps is a share of the way across, so a change of size cannot throw them along.
function bars(ctx, list, W, t, yOf = (y) => y) {
  for (const [fx, y, w, h, col, v] of list) { const bw = Math.min(w, W * 0.42), span = W + bw + 160; F(ctx, (c) => pill(c, frac((fx * W + bw + 80) / span + (v * t) / 2300) * span - bw - 80, yOf(y), bw, h), col); }
}

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.35 * tall;
  const O = { x: 84, y: 74, w: W - 168, h: H - 74 - 230 * big }, B = O.y + O.h;
  const n = clamp(Math.round(O.w / 900), 1, 3), gap = 46, ww = (O.w - gap * (n - 1)) / n;
  const WINS = Array.from({ length: n }, (_, i) => ({ x: O.x + i * (ww + gap), y: O.y, w: ww, h: O.h }));
  const vent = O.h > 900 ? O.y + O.h * 0.2 : 0;
  const HY = O.y + O.h * (0.7 - 0.04 * tall);                   // where the land meets the sky
  const MOON = { x: O.x + O.w * (0.7 - 0.08 * tall), y: O.y + (HY - O.y) * 0.34, r: 60 * big };
  const STARS = makeStars(121, Math.round(90 + O.h / 12), W, HY - 30, (s) => Math.hypot(s.x - MOON.x, s.y - MOON.y) > MOON.r + 40);
  const far = (X) => HY - O.h * 0.05 - O.h * 0.15 * (0.25 + 0.75 * Math.abs(nF(X / 430))) - 10 * nF(X / 47);
  const mid = (X) => HY - O.h * 0.02 - O.h * 0.06 * (0.5 + 0.5 * nM(X / 520)) - 5 * nM(X / 60);
  const near = (X) => B - 34 * big - 60 * big * (0.5 + 0.5 * nN(X / 380));
  const table = { x: W * (0.5 - 0.06 * tall), y: B + 84 * big };
  return { W, H, tall, big, O, B, WINS, vent, HY, MOON, STARS, far, mid, near, table, R: 50 * big };
}

function along(s, W, step, pad, fn) { for (let i = Math.floor((s - pad) / step); i <= Math.ceil((s + W + pad) / step); i++) fn(i * step + hash(i, 1) * step * 0.6 - s, i); }
const ridge = (ctx, W, s, top, base) => { ctx.moveTo(-20, base); for (let x = -20; x <= W + 20; x += 8) ctx.lineTo(x, top(x + s)); ctx.lineTo(W + 20, base); ctx.closePath(); };
const rr = (c, x, y, w, h, r) => { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
// a hanging curtain: fixed along the rod, its hem swung sideways by sw; added in two fills (cloth, then folds)
function curtain(ctx, x, y0, y1, w, dir, sw, t) {
  const n = 4, hem = (u) => x + dir * w * (0.86 + 0.14 * u) * u + sw * (0.6 + 0.4 * u);
  F(ctx, (c) => { c.moveTo(x - dir * 6, y0); c.lineTo(x + dir * w * 0.9, y0); c.bezierCurveTo(x + dir * w * 0.9, lerp(y0, y1, 0.4), hem(1) + sw * 0.3, lerp(y0, y1, 0.7), hem(1), y1);
    for (let k = n - 1; k >= 0; k--) c.quadraticCurveTo(hem((k + 0.5) / n), y1 + 16 + 3 * Math.sin(t * 1.3 + k), hem(k / n), y1); c.lineTo(x - dir * 6, y1); c.closePath(); }, C.rust);
  F(ctx, (c) => { for (let k = 1; k < n; k++) { const xt = x + dir * w * 0.9 * (k / n), xb = hem(k / n); poly(c, [[xt - 2, y0], [xt + 3, y0], [lerp(xt, xb, 0.5) + 6 + sw * 0.4, lerp(y0, y1, 0.5)], [xb + 4, y1], [xb - 3, y1], [lerp(xt, xb, 0.5) - 4 + sw * 0.4, lerp(y0, y1, 0.5)]]); } }, S.fold);
}

export function paint(ctx, p, t, G) {
  const { W, H, O, B, HY, MOON, big } = G, bw = O.x + O.w;
  // ---- outside: drawn across the whole frame, the wall is laid over it afterwards
  ctx.fillStyle = S.sky; ctx.fillRect(0, 0, W, H);
  F(ctx, (c) => circle(c, MOON.x, MOON.y, MOON.r * 7), S.h1); F(ctx, (c) => circle(c, MOON.x, MOON.y, MOON.r * 3.6), S.h2);
  paintStars(ctx, G.STARS, p);
  meteor(ctx, t, W, HY * 0.7, 19, 7);
  F(ctx, (c) => circle(c, MOON.x, MOON.y, MOON.r), C.cream);
  F(ctx, (c) => { circle(c, MOON.x - MOON.r * 0.3, MOON.y - MOON.r * 0.2, MOON.r * 0.2); circle(c, MOON.x + MOON.r * 0.3, MOON.y + MOON.r * 0.25, MOON.r * 0.26); circle(c, MOON.x + MOON.r * 0.25, MOON.y - MOON.r * 0.45, MOON.r * 0.1); }, C.gold);
  bars(ctx, CLOUDS, W, t, (y) => O.y + y * (HY - O.y));

  F(ctx, (c) => ridge(c, W, 7 * t, G.far, B), S.far);
  { const s = 24 * t; F(ctx, (c) => { ridge(c, W, s, G.mid, B); along(s, W, 46, 60, (x, i) => { if (hash(i, 2) < 0.6) circle(c, x, G.mid(x + s) + 4, (11 + 13 * hash(i, 3)) * big); }); }, S.mid); }
  // the plain: a flat floor with hedges and furrows going by at their own speeds
  F(ctx, (c) => c.rect(0, HY + 6, W, B - HY), S.field);
  F(ctx, (c) => { for (let k = 0; k < 5; k++) { const u = k / 4, s = (50 + 150 * u) * t, y = lerp(HY + 26, B - 110 * big, u); along(s, W, 420 + 300 * u, 500, (x, i) => { if (hash(i, 30 + k) < 0.7) pill(c, x, y, (160 + 380 * hash(i, 40 + k)) * (0.6 + 0.6 * u), 5 + 5 * u); }); } }, S.mid);

  // small towns: a huddle of roofs and a steeple, their windows and street lamps strung along the plain
  { const s = 62 * t, y = HY + 26, k = big;
    along(s, W, 2300, 700, (x, i) => {
      if (hash(i, 7) < 0.3) return;
      const n = 6 + Math.floor(hash(i, 8) * 7);
      F(ctx, (c) => { for (let j = 0; j < n; j++) { const hx = x + j * 64 * k + 20 * hash(i, 50 + j), w = (40 + 30 * hash(i, 60 + j)) * k, h = (22 + 26 * hash(i, 70 + j)) * k; c.rect(hx, y - h, w, h + 4); poly(c, [[hx - 4, y - h], [hx + w + 4, y - h], [hx + w / 2, y - h - w * 0.4]]); } const sx = x + n * 26 * k; c.rect(sx, y - 70 * k, 22 * k, 70 * k); poly(c, [[sx - 3, y - 70 * k], [sx + 22 * k + 3, y - 70 * k], [sx + 11 * k, y - 124 * k]]); }, S.near);
      F(ctx, (c) => { for (let j = 0; j < n; j++) { const hx = x + j * 64 * k + 20 * hash(i, 50 + j); if (hash(i, 80 + j) < 0.75) c.rect(hx + 8 * k, y - 16 * k, 8 * k, 9 * k); if (hash(i, 90 + j) < 0.4) c.rect(hx + 24 * k, y - 16 * k, 8 * k, 9 * k); circle(c, hx + 50 * k, y + 16 * k, 3.5 * k); } c.rect(x + n * 26 * k + 7 * k, y - 60 * k, 8 * k, 12 * k); }, C.gold);
    });
    // a lone farm between them
    along(s * 1.5, W, 1500, 200, (x, i) => { if (hash(i, 17) < 0.5) return; const fy = HY + 70 * k; F(ctx, (c) => { c.rect(x, fy - 30 * k, 70 * k, 30 * k); poly(c, [[x - 6, fy - 30 * k], [x + 70 * k + 6, fy - 30 * k], [x + 35 * k, fy - 56 * k]]); }, S.near); F(ctx, (c) => c.rect(x + 12 * k, fy - 22 * k, 12 * k, 12 * k), C.orange); });
  }

  // the near bank and its trees
  { const s = 210 * t;
    F(ctx, (c) => { ridge(c, W, s, G.near, B + 10); along(s, W, 150, 260, (x, i) => { const h1 = hash(i, 2), y = G.near(x + s) + 8; if (h1 < 0.4) pine(c, x, y, (150 + 190 * hash(i, 3)) * big, (90 + 50 * hash(i, 4)) * big, 5 * osc(p, 4, hash(i, 5))); else if (h1 < 0.62) { const hh = (110 + 110 * hash(i, 3)) * big; c.rect(x - 5 * big, y - hh * 0.6, 10 * big, hh * 0.6); circle(c, x, y - hh * 0.75, hh * 0.3); circle(c, x - hh * 0.2, y - hh * 0.55, hh * 0.22); circle(c, x + hh * 0.22, y - hh * 0.58, hh * 0.24); } }); }, S.near);
  }

  // level crossings: gates, two lamps taking turns, a car waiting with its lights on
  { const s = V * 0.86 * t, k = big;
    along(s, W, 7300, 500, (x, i) => {
      if (hash(i, 27) < 0.25) return;
      const y = B - 14 * k, a = Math.sin(t * 2.6) > 0;
      F(ctx, (c) => poly(c, [[x + 150 * k, y], [x + 330 * k, y], [x + 290 * k, G.HY + 40], [x + 250 * k, G.HY + 40]]), S.mid);
      F(ctx, (c) => poly(c, [[x + 190 * k, y - 96 * k], [x + 80 * k, y - 60 * k], [x + 80 * k, y - 40 * k], [x + 190 * k, y - 76 * k]]), C.gold);
      F(ctx, (c) => { c.rect(x + 190 * k, y - 112 * k, 96 * k, 56 * k); pill(c, x + 204 * k, y - 138 * k, 68 * k, 54 * k); c.rect(x + 40 * k, y - 190 * k, 9 * k, 190 * k); c.rect(x + 14 * k, y - 196 * k, 60 * k, 9 * k); c.rect(x - 110 * k, y - 84 * k, 150 * k, 9 * k); }, S.ink);
      F(ctx, (c) => circle(c, x + 26 * k, y - 170 * k, 10 * k), a ? C.orange : S.near); F(ctx, (c) => circle(c, x + 62 * k, y - 170 * k, 10 * k), a ? S.near : C.orange);
    });
    // telegraph poles and their sagging wires
    const step = 640, ph = Math.min(O.h * 0.56, 400 * k), py = B - ph, at = (i) => i * step - s;
    ctx.strokeStyle = S.ink; ctx.lineWidth = 2.5 * k; ctx.beginPath();
    for (let i = Math.floor(s / step) - 1; i <= Math.ceil((s + W) / step); i++) for (const dy of [5 * k, 30 * k]) { ctx.moveTo(at(i), py + dy); ctx.quadraticCurveTo(at(i) + step / 2, py + dy + 60 * k, at(i + 1), py + dy); }
    ctx.stroke();
    F(ctx, (c) => { for (let i = Math.floor(s / step) - 1; i <= Math.ceil((s + W) / step); i++) { const x = at(i); c.rect(x - 5 * k, py - 14 * k, 10 * k, ph + 20); c.rect(x - 34 * k, py, 68 * k, 7 * k); c.rect(x - 26 * k, py + 25 * k, 52 * k, 7 * k); } c.rect(0, B - 16 * k, W, 40 * k); }, S.ink);
  }

  ctx.depthLayer?.('room');
  // ---- the compartment, rocking on its springs
  ctx.save();
  ctx.translate(W / 2 + 1.6 * Math.sin(t * 2.3) + 0.8 * Math.sin(t * 5.9), H + 2.4 * Math.sin(t * 2.9 + 1) + 1.2 * Math.sin(t * 4.7)); ctx.rotate(0.0035 * Math.sin(t * 1.7) + 0.0015 * Math.sin(t * 3.7 + 2)); ctx.translate(-W / 2, -H);
  ctx.beginPath(); ctx.rect(-60, -60, W + 120, H + 120); for (const w of G.WINS) rr(ctx, w.x, w.y, w.w, w.h, G.R); ctx.fillStyle = S.wall; ctx.fill('evenodd');
  // window surrounds, the vent light's bar, the panel below
  ctx.strokeStyle = S.wood; ctx.lineWidth = 12; ctx.beginPath(); for (const w of G.WINS) rr(ctx, w.x - 5, w.y - 5, w.w + 10, w.h + 10, G.R + 5); ctx.stroke();
  F(ctx, (c) => { if (G.vent) for (const w of G.WINS) c.rect(w.x, G.vent - 6, w.w, 12); c.rect(-60, B + 40 * big, W + 120, 8); }, S.wood);
  F(ctx, (c) => c.rect(-60, B + 48 * big, W + 120, H), S.panel);

  ctx.depthLayer?.('curtains');
  // curtains on a brass rod; their hems swing with the carriage, a beat behind it
  { const sw = (12 * Math.sin(t * 1.7 - 0.9) + 5 * Math.sin(t * 3.7 + 1.2) + 7 * nR(t * 0.4)) * big, cw = clamp(O.w * 0.09, 90, 150) * big, y0 = O.y - 30, y1 = B + 26 * big;
    curtain(ctx, O.x - 22, y0, y1, cw, 1, sw, t); curtain(ctx, bw + 22, y0, y1, cw * 0.8, -1, sw * 0.9, t + 3);
    F(ctx, (c) => { pill(c, O.x - 44, y0 - 8, O.w + 88, 10); circle(c, O.x - 44, y0 - 3, 9); circle(c, bw + 44, y0 - 3, 9); }, C.gold); }

  // seat backs in the corners with their head cloths
  { const k = big, sw = clamp(W * 0.13, 150, 260) * k, sy = B + 96 * k;
    F(ctx, (c) => { rr(c, -40, sy, sw + 40, H, 40 * k); rr(c, W - sw, sy, sw + 40, H, 40 * k); }, S.ink);
    F(ctx, (c) => { rr(c, 10, sy - 6, sw - 70 * k, 60 * k, 12 * k); rr(c, W - sw + 60 * k, sy - 6, sw - 70 * k, 60 * k, 12 * k); }, C.cream); }

  ctx.depthLayer?.('table');
  // the table: lamp, book, and a glass that shivers
  { const { x, y } = G.table, k = big, g = 0.5 + 0.5 * nR(t * 0.9 + 20);
    F(ctx, (c) => { poly(c, [[x - 30 * k, y + 16 * k], [x + 30 * k, y + 16 * k], [x + 12 * k, H + 20], [x - 12 * k, H + 20]]); }, S.ink);
    F(ctx, (c) => pill(c, x - 250 * k, y, 500 * k, 22 * k), S.wood);
    F(ctx, (c) => pill(c, x - 230 * k, y + 3 * k, (250 + 14 * g) * k, 7 * k), C.orange);
    // lamp
    const lx = x - 120 * k;
    F(ctx, (c) => { c.rect(lx - 5 * k, y - 120 * k, 10 * k, 120 * k); pill(c, lx - 38 * k, y - 12 * k, 76 * k, 14 * k); circle(c, lx, y - 60 * k, 13 * k); }, S.ink);
    F(ctx, (c) => poly(c, [[lx - 40 * k, y - 210 * k], [lx + 40 * k, y - 210 * k], [lx + 76 * k, y - 110 * k], [lx - 76 * k, y - 110 * k]]), C.gold);
    F(ctx, (c) => poly(c, [[lx - 66 * k, y - 138 * k], [lx + 66 * k, y - 138 * k], [lx + 76 * k, y - 110 * k], [lx - 76 * k, y - 110 * k]]), g > 0.25 ? C.cream : '#f6ecd2');
    F(ctx, (c) => c.rect(lx - 42 * k, y - 216 * k, 84 * k, 8 * k), C.orange);
    // book, open and face down, and the glass
    const bx = x + 100 * k;
    F(ctx, (c) => poly(c, [[bx - 84 * k, y], [bx, y - 30 * k], [bx + 84 * k, y], [bx + 84 * k, y - 8 * k], [bx, y - 40 * k], [bx - 84 * k, y - 8 * k]]), C.orange);
    F(ctx, (c) => poly(c, [[bx - 76 * k, y], [bx, y - 28 * k], [bx + 76 * k, y], [bx, y - 20 * k]]), C.cream);
    const gx = x + 10 * k + 0.8 * Math.sin(t * 13), gy = y;
    F(ctx, (c) => poly(c, [[gx - 20 * k, gy - 58 * k], [gx + 20 * k, gy - 58 * k], [gx + 15 * k, gy], [gx - 15 * k, gy]]), S.far);
    F(ctx, (c) => poly(c, [[gx - 18 * k, gy - 34 * k + 2 * Math.sin(t * 2.9)], [gx + 18 * k, gy - 34 * k - 2 * Math.sin(t * 2.9)], [gx + 15 * k, gy], [gx - 15 * k, gy]]), C.gold);
  }
  ctx.restore();
}
