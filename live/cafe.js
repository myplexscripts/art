// Window Series No. 01: Rainy Cafe. The view from a cafe counter through its window onto a wet evening street:
// shopfronts with lit windows and a neon cup, a street lamp, umbrellas going by on both pavements and a tram now
// and then. The room (wall, frame, counter, cup, plant, pendant lamp, curtain) is the dark border; its thickness is
// in design units, so a wide screen gets a wide window of several panes and a phone a tall one with a transom.
// The street hangs off the bottom of the glass; extra height becomes taller houses and more sky.
import { mulberry, lerp, clamp, osc, noise1, poly, circle, pill, frac, TAU } from './geom.js';
import { C, F } from './kit.js';
import { hash, el } from './bits.js';

export const title = 'RAINY CAFE', no = 'No. 01', text = '#1c1430', dark = '#0d0916';
const P = { sky: '#2b2146', far: '#3a2d5c', b1: '#1f5560', b2: '#174551', b3: '#2a6a72', shade: '#102c3a', road: '#141c34', wet: '#22395a', neon: '#e0647f', dim: '#6a3358', rain: '#7fa3b0', wall: '#0d0916', wood: '#2a1a30', woodHi: '#40264a' };
const nN = noise1(1103), nS = noise1(1109);

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.35 * tall, r = mulberry(1101);   // r is for the shops alone
  // Everything else takes its numbers from hash(i, k), so item i is the same at every size and a bigger window only
  // adds items at the end of a list.
  const O = { x: 64, y: 58, w: W - 128, h: H - 58 - 150 * big };   // the glass
  const B = O.y + O.h, roadH = clamp(O.h * 0.3, 190, 430), SY = B - roadH;   // bottom of the glass, foot of the shops
  const n = clamp(Math.round(O.w / 640), 1, 4), BARS = [];
  for (let i = 1; i < n; i++) BARS.push(O.x + (O.w * i) / n);
  const transom = O.h > 900 ? O.y + O.h * 0.22 : 0;
  const gh = 180 * big, fh = 104 * big;                            // ground floor and upper floor heights
  const SHOPS = []; let x = O.x - 50 - r() * 80 * big;
  while (x < O.x + O.w + 40) { const w = (250 + r() * 130) * big; SHOPS.push({ x, w, st: 1 + Math.floor(r() * 2.6) + Math.round(2 * tall), col: [P.b1, P.b2, P.b3][SHOPS.length % 3], aw: [C.orange, P.neon, C.cream, C.gold][Math.floor(r() * 4)], roof: Math.floor(r() * 3), id: SHOPS.length }); x += w; }
  const nx = O.x + O.w * (0.34 + 0.1 * tall), SIGN = SHOPS.find((s) => nx >= s.x && nx < s.x + s.w) || SHOPS[0];
  SIGN.st = Math.max(SIGN.st, 2); SIGN.aw = P.neon;
  const lampX = O.x + O.w * (0.7 + 0.06 * tall);
  const farY = (x) => lerp(SY - 330 * big, O.y + (SY - O.y) * 0.12, Math.round(3 * (0.5 + 0.5 * nS(x / 170))) / 3);
  // far windows keep their place on the roofs: one to each 50 units from the left, so more width adds them at the right
  const FARLIT = Array.from({ length: Math.round(O.w / 50) }, (_, i) => ({ x: O.x + (i + hash(i, 71)) * 50, v: hash(i, 72) }));
  // rain: each drop repeats on a grid of its own (px by py, fixed sizes) hung from the glass's top left corner, and
  // wraps inside one cell of it. Nothing about a drop depends on the size of the glass; a bigger pane shows more cells.
  const DROPS = Array.from({ length: 170 }, (_, i) => ({ x: hash(i, 81), y: hash(i, 82), v: 760 + hash(i, 83) * 420, l: 26 + hash(i, 84) * 30, px: 1300 + 700 * hash(i, 85), py: 640 + 320 * hash(i, 86) }));
  const BEADS = Array.from({ length: Math.round((O.w * O.h) / 11000) }, (_, i) => ({ x: O.x + hash(i, 91) * O.w, y: O.y + hash(i, 92) * O.h, r: (1.2 + hash(i, 93) * hash(i, 94) * 3.4) * big }));
  const RUN = Array.from({ length: Math.round(8 + (O.w * O.h) / 110000) }, (_, i) => ({ T: 9 + hash(i, 95) * 13, ph: hash(i, 96) }));
  const lamp = { x: W * (0.36 + 0.08 * tall), len: clamp(O.h * 0.3, 170, 520) };
  return { W, H, tall, big, O, B, SY, roadH, BARS, transom, gh, fh, SHOPS, SIGN, lampX, farY, FARLIT, DROPS, BEADS, RUN, lamp };
}

const lit = (id, t, share = 0.5) => hash(id, Math.floor(t / (40 + 70 * hash(id, 5)) + hash(id, 6))) < share;
// things spaced along an endless strip going by. s is how far it has gone, counted in steps (not units), so that a
// step that changes with the size stretches the strip in place instead of flinging it along
function along(s, x0, w, step, pad, fn) { for (let i = Math.floor(s - pad / step); i <= Math.ceil(s + (w + pad) / step); i++) fn(x0 + (i + hash(i, 1) * 0.5 - s) * step, i); }
// a wavy band that tapers at both ends, for steam: added to the current path
function wisp(c, x, y, h, w, t, k) {
  const L = [], R = [];
  for (let i = 0; i <= 14; i++) { const s = i / 14, px = x + w * 2.2 * s * Math.sin(s * 5.2 - t * 1.1 + k) + w * 1.5 * s * nN(t * 0.2 + k), py = y - h * s, ww = w * Math.sin(Math.PI * Math.pow(s, 0.7)) * 0.5; L.push([px - ww, py]); R.push([px + ww, py]); }
  poly(c, L.concat(R.reverse()));
}
// someone under an umbrella: a canopy, its stick and a straight coat, nothing more
function walker(ctx, x, y, s, top, coat, t, id) {
  const yb = y - 3 * s * Math.abs(Math.sin(t * 3.1 + id * 1.7)), yc = yb - 104 * s, tip = 0.06 * Math.sin(t * 0.7 + id);
  F(ctx, (c) => { poly(c, [[x - 17 * s, yb], [x + 17 * s, yb], [x + 12 * s, yb - 74 * s], [x - 12 * s, yb - 74 * s]]); el(c, x, yb - 74 * s, 12 * s, 9 * s); c.rect(x - 1.5 * s, yc - 40 * s, 3 * s, 70 * s); }, coat);
  ctx.save(); ctx.translate(x, yc); ctx.rotate(tip);
  F(ctx, (c) => { c.moveTo(-50 * s, 0); c.bezierCurveTo(-48 * s, -52 * s, 48 * s, -52 * s, 50 * s, 0); for (let k = 3; k >= 0; k--) c.quadraticCurveTo((-50 + k * 25 + 12.5) * s, -9 * s, (-50 + k * 25) * s, 0); c.closePath(); }, top);
  ctx.restore();
}

export function paint(ctx, p, t, G) {
  const { W, H, O, B, SY, roadH, big, gh, fh } = G;
  ctx.save(); ctx.beginPath(); ctx.rect(O.x, O.y, O.w, O.h); ctx.clip();
  ctx.fillStyle = P.sky; ctx.fillRect(O.x, O.y, O.w, O.h);
  // roofs of the town behind, a few windows awake
  F(ctx, (c) => { c.moveTo(O.x, SY); for (let x = O.x; x <= O.x + O.w + 10; x += 10) c.lineTo(x, G.farY(x)); c.lineTo(O.x + O.w + 10, SY); c.closePath(); }, P.far);
  F(ctx, (c) => { G.FARLIT.forEach((q, i) => { if (lit(i + 700, t, 0.6)) c.rect(q.x, lerp(G.farY(q.x) + 14, SY - 200 * big, q.v), 6 * big, 8 * big); }); }, C.gold);

  // the shops across the street
  for (const s of G.SHOPS) {
    const top = SY - gh - s.st * fh - 22 * big, cols = Math.max(1, Math.floor((s.w - 30 * big) / (58 * big))), cx0 = s.x + (s.w - cols * 58 * big + 24 * big) / 2;
    F(ctx, (c) => { c.rect(s.x, top, s.w + 1, SY - top); if (s.roof === 0) poly(c, [[s.x, top], [s.x + s.w, top], [s.x + s.w / 2, top - s.w * 0.22]]); else if (s.roof === 1) c.rect(s.x + s.w * 0.64, top - 36 * big, 26 * big, 36 * big); }, s.col);
    F(ctx, (c) => { c.rect(s.x - 4, top, s.w + 8, 8 * big); c.rect(s.x, SY - gh - 6 * big, s.w, 6 * big); for (let i = 0; i < cols; i++) for (let j = 0; j < s.st; j++) c.rect(cx0 + i * 58 * big, SY - gh - (j + 1) * fh + 20 * big, 34 * big, 56 * big); c.rect(s.x + s.w - 74 * big, SY - 118 * big, 50 * big, 118 * big); }, P.shade);
    F(ctx, (c) => { for (let i = 0; i < cols; i++) for (let j = 0; j < s.st; j++) if (lit(s.id * 64 + i * 8 + j, t)) c.rect(cx0 + i * 58 * big, SY - gh - (j + 1) * fh + 20 * big, 34 * big, 56 * big); c.rect(s.x + 22 * big, SY - 124 * big, s.w - 118 * big, 92 * big); c.rect(s.x + s.w - 64 * big, SY - 108 * big, 30 * big, 44 * big); }, C.gold);
    // things in the shop window, and the bars across the lit panes
    F(ctx, (c) => { const ww = s.w - 118 * big; c.rect(s.x + 22 * big + ww / 2 - 2, SY - 124 * big, 4, 92 * big); for (let k = 0; k < 5; k++) { const hh = (18 + 34 * hash(s.id, 40 + k)) * big; c.rect(s.x + 34 * big + (k / 5) * (ww - 20 * big), SY - 32 * big - hh, ww / 9, hh); } for (let i = 0; i < cols; i++) for (let j = 0; j < s.st; j++) c.rect(cx0 + i * 58 * big, SY - gh - (j + 1) * fh + 45 * big, 34 * big, 3); }, s.col);
    F(ctx, (c) => { const y = SY - 138 * big, x0 = s.x + 12 * big, w = s.w - 24 * big, n = Math.max(3, Math.round(w / (34 * big))); c.moveTo(x0 + 14 * big, y - 30 * big); c.lineTo(x0 + w - 14 * big, y - 30 * big); c.lineTo(x0 + w, y); for (let k = n - 1; k >= 0; k--) c.quadraticCurveTo(x0 + ((k + 0.5) * w) / n, y + 14 * big, x0 + (k * w) / n, y); c.closePath(); }, s.aw);
  }
  // the neon cup over one of them; the steam tube is tired and drops out now and then
  { const s = G.SIGN, x = s.x + s.w / 2, y = SY - gh - fh * 0.5, k = big, on = nN(t * 0.45) > -0.35 || nN(t * 0.45 + 60) > 0.2;
    F(ctx, (c) => c.rect(x - 62 * k, y - 62 * k, 124 * k, 108 * k), P.shade);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 6 * k;
    ctx.strokeStyle = P.neon; ctx.beginPath(); ctx.moveTo(-34 * k + x, y - 6 * k); ctx.lineTo(x + 22 * k, y - 6 * k); ctx.lineTo(x + 16 * k, y + 24 * k); ctx.lineTo(x - 28 * k, y + 24 * k); ctx.closePath(); ctx.moveTo(x + 22 * k, y); ctx.quadraticCurveTo(x + 44 * k, y + 6 * k, x + 18 * k, y + 16 * k); ctx.moveTo(x - 44 * k, y + 34 * k); ctx.lineTo(x + 34 * k, y + 34 * k); ctx.stroke();
    ctx.strokeStyle = on ? C.gold : P.dim; ctx.beginPath(); for (const dx of [-16, 4]) { ctx.moveTo(x + dx * k, y - 18 * k); ctx.bezierCurveTo(x + (dx - 12) * k, y - 30 * k, x + (dx + 12) * k, y - 38 * k, x + dx * k, y - 50 * k); } ctx.stroke(); }

  // street lamp with its halo in the wet air
  { const x = G.lampX, y = SY - 250 * big, g = 0.5 + 0.5 * nN(t * 0.8 + 9);
    F(ctx, (c) => circle(c, x + 30 * big, y + 8 * big, (70 + 5 * g) * big), P.b3);
    F(ctx, (c) => { c.rect(x - 4 * big, y, 8 * big, 262 * big); c.rect(x - 4 * big, y, 40 * big, 6 * big); poly(c, [[x + 16 * big, y - 4 * big], [x + 44 * big, y - 4 * big], [x + 38 * big, y - 14 * big], [x + 22 * big, y - 14 * big]]); c.rect(x - 8 * big, SY - 30 * big, 16 * big, 42 * big); }, P.wall);
    F(ctx, (c) => circle(c, x + 30 * big, y + 10 * big, 15 * big), C.gold); F(ctx, (c) => circle(c, x + 30 * big, y + 10 * big, 8 * big), C.cream); }

  // pavement, then the road with every light drawn out down it
  F(ctx, (c) => c.rect(O.x, SY, O.w, 34 * big), P.far);
  F(ctx, (c) => c.rect(O.x, SY + 28 * big, O.w, roadH), P.road);
  F(ctx, (c) => { for (let k = 0; k < 9; k++) { const y = SY + 44 * big + (k / 9) * (roadH - 40 * big), w = (160 + 240 * hash(k, 3)) * big; for (let x = O.x - w * 3.6 + hash(k, 4) * w * 2.6 + 8 * osc(p, 3 + (k % 3), k * 0.2); x < O.x + O.w; x += w * 2.6) pill(c, x, y, w, (4 + k * 0.7) * big); } }, P.wet);
  const smear = (c, x, w0, n, id) => { for (let k = 0; k < n; k++) { const w = w0 * (1 - k / (n + 3)) * (0.5 + 0.5 * (0.5 + 0.5 * osc(p, 5 + (k % 4), id * 0.37 + k * 0.21))); pill(c, x + 6 * big * osc(p, 4, k * 0.3 + id) - w / 2, SY + 44 * big + k * (15 + k * 2.2) * big, w, 6 * big); } };
  F(ctx, (c) => { for (const s of G.SHOPS) smear(c, s.x + s.w / 2 - 36 * big, s.w * 0.42, 7, s.id); smear(c, G.lampX + 30 * big, 40 * big, 9, 77); }, C.gold);
  F(ctx, (c) => smear(c, G.SIGN.x + G.SIGN.w / 2, 46 * big, 6, 31), P.neon);

  // umbrellas on the far pavement
  { const s = (34 * t) / 330, cols = [C.orange, C.cream, P.neon, C.gold, P.b3];
    along(s, O.x, O.w, 330 * big, 120, (x, i) => { if (hash(i, 2) < 0.6) walker(ctx, x, SY + 20 * big, big, cols[Math.floor(hash(i, 3) * 5)], P.wall, t, i); });
    along((-27 * t) / 470, O.x, O.w, 470 * big, 120, (x, i) => { if (hash(i, 12) < 0.55) walker(ctx, x, SY + 30 * big, big * 1.08, cols[Math.floor(hash(i, 13) * 5)], P.shade, t, i + 50); }); }

  // a tram goes through now and then, its windows running along the wet road under it
  { const slot = 47, n = Math.floor(t / slot), q = mulberry(n * 5231 + 6), go = q() < 0.8, dir = q() < 0.5 ? -1 : 1, u = (t - n * slot - 2 - q() * 10) / 19, k = big * 1.25, L = 560 * k;
    if (go && u >= 0 && u <= 1) {
      const x = O.x + (dir > 0 ? -L + u * (O.w + L) : O.w - u * (O.w + L)), y = SY + roadH * 0.42 + 2 * Math.sin(t * 6.1);
      F(ctx, (c) => { for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) { const w = 40 * k * (0.5 + 0.5 * Math.abs(Math.sin(t * 2.1 + i + j * 1.7))); pill(c, x + (40 + i * 56) * k + 20 * k - w / 2, y + (18 + j * 17) * k, w, 6 * k); } }, C.gold);
      F(ctx, (c) => { pill(c, x - 4 * k, y - 150 * k, L + 8 * k, 26 * k); c.rect(x + 8 * k, y - 12 * k, L - 16 * k, 14 * k); c.rect(x + L / 2 - 3 * k, y - 196 * k, 6 * k, 50 * k); c.rect(x + L / 2 - 46 * k, y - 198 * k, 92 * k, 5 * k); }, P.wall);
      F(ctx, (c) => c.rect(x, y - 138 * k, L, 128 * k), C.orange);
      F(ctx, (c) => c.rect(x, y - 138 * k, L, 76 * k), C.cream);
      F(ctx, (c) => { for (let i = 0; i < 9; i++) c.rect(x + (40 + i * 56) * k, y - 126 * k, 42 * k, 54 * k); circle(c, dir > 0 ? x + L - 12 * k : x + 12 * k, y - 36 * k, 9 * k); }, C.gold);
    } }
  // the wire it runs under
  F(ctx, (c) => c.rect(O.x, SY + roadH * 0.42 - 248 * big, O.w, 2.5), P.wall);

  // people close by, on this side of the street
  along((-58 * t) / 900, O.x, O.w, 900 * big, 300, (x, i) => { if (hash(i, 22) < 0.6) walker(ctx, x, B + 150 * big, big * 2.5, hash(i, 23) < 0.4 ? C.rust : P.dim, P.wall, t * 0.8, i + 90); });

  // rain in the street
  ctx.strokeStyle = P.rain; ctx.lineWidth = 2; ctx.lineCap = 'butt'; ctx.beginPath();
  for (const d of G.DROPS) { const y0 = O.y + frac(d.y + (d.v * t) / d.py) * d.py - 60, x0 = O.x + frac(d.x - (0.16 * d.v * t) / d.px) * d.px - 20; for (let x = x0; x < O.x + O.w + 20; x += d.px) for (let y = y0; y < B; y += d.py) { ctx.moveTo(x, y); ctx.lineTo(x - d.l * 0.16, y + d.l); } }
  ctx.stroke();

  // on the glass: beads that sit, and drops that gather, let go and run down a short crooked track
  { const run = [];
    F(ctx, (c) => {
      for (const b of G.BEADS) circle(c, b.x, b.y, b.r);
      G.RUN.forEach((d, i) => {
        const n = Math.floor(t / d.T + d.ph), u = t / d.T + d.ph - n, q = mulberry(n * 7919 + i * 131 + 5);
        const x0 = O.x + q() * O.w, y0 = O.y + q() * O.h * 0.8, L = (150 + 300 * q()) * big, k = q() * 9, v = clamp((u - 0.4) / 0.55), e = v * v * (3 - 2 * v) + 0.04 * Math.sin(v * 19) * v * (1 - v);
        const wx = (yy) => x0 + 7 * big * Math.sin(yy / 31 + k) + 4 * big * Math.sin(yy / 13 + k * 2), y = y0 + L * e, rad = (1.5 + 5 * clamp(u / 0.4)) * big * clamp((1 - u) / 0.06);
        el(c, wx(y), y, rad, rad * 1.25);
        if (v > 0) run.push([wx, Math.max(y0, y - 110 * big * clamp((1 - u) / 0.2)), y]);
      });
    }, P.rain);
    ctx.lineWidth = 3 * big; ctx.lineCap = 'round'; ctx.beginPath();
    for (const [wx, a, b] of run) { ctx.moveTo(wx(a), a); for (let yy = a + 8; yy < b; yy += 8) ctx.lineTo(wx(yy), yy); ctx.lineTo(wx(b), b); }
    ctx.stroke(); }
  ctx.restore();

  // the room: wall, frame and bars, sill and counter
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.rect(O.x, O.y, O.w, O.h); ctx.fillStyle = P.wall; ctx.fill('evenodd');
  F(ctx, (c) => { c.rect(O.x - 16, O.y - 16, O.w + 32, 16); c.rect(O.x - 16, O.y, 16, O.h); c.rect(O.x + O.w, O.y, 16, O.h); for (const x of G.BARS) c.rect(x - 7, O.y, 14, O.h); if (G.transom) c.rect(O.x, G.transom - 6, O.w, 12); c.rect(0, B + 20 * big, W, H); }, P.wood);
  F(ctx, (c) => c.rect(O.x - 34, B, O.w + 68, 20 * big), P.woodHi);

  // curtain tied back at the right
  { const x1 = O.x + O.w + 16, w = clamp(O.w * 0.12, 110, 190) * big, yt = B - O.h * 0.34, sw = 6 * osc(p, 3, 0.3), n = 5;
    F(ctx, (c) => { c.moveTo(x1, O.y - 16); c.lineTo(x1 - w, O.y - 16); c.bezierCurveTo(x1 - w - 10 + sw, lerp(O.y, yt, 0.5), x1 - w * 0.6 + sw, yt - 60 * big, x1 - 26 * big, yt); c.bezierCurveTo(x1 - w * 0.5, yt + 60 * big, x1 - w * 0.62 + sw, B - 60 * big, x1 - w * 0.6 + sw * 1.4, B + 6);
      for (let k = n - 1; k >= 0; k--) c.quadraticCurveTo(x1 - (w * 0.6 * (k + 0.5)) / n + sw, B + 20 * big, x1 - (w * 0.6 * k) / n, B + 6); c.closePath(); }, P.dim);
    F(ctx, (c) => { for (let k = 1; k < 4; k++) poly(c, [[x1 - (w * k) / 4, O.y - 16], [x1 - (w * k) / 4 + 5, O.y - 16], [x1 - 30 * big + sw * 0.3, yt - 4]]); c.rect(x1 - 44 * big, yt - 7 * big, 44 * big, 14 * big); }, P.wood); }

  // pendant lamp on its cord, swinging a little, and the pool it throws on the counter
  { const { x, len } = G.lamp, k = big, a = 0.035 * osc(p, 4, 0.1) + 0.015 * osc(p, 9, 0.4), g = 0.5 + 0.5 * nN(t * 0.6 + 30), cy = B + 62 * k;
    F(ctx, (c) => el(c, x + 50 * k, cy, (300 + 8 * g) * k, (30 + 2 * g) * k), P.woodHi);
    ctx.save(); ctx.translate(x, 0); ctx.rotate(a);
    F(ctx, (c) => { c.rect(-2, -20, 4, len + 20); c.rect(-10 * k, len - 12 * k, 20 * k, 14 * k); }, P.wood);
    F(ctx, (c) => { c.moveTo(-18 * k, len); c.lineTo(18 * k, len); c.bezierCurveTo(40 * k, len + 20 * k, 78 * k, len + 46 * k, 84 * k, len + 76 * k); c.lineTo(-84 * k, len + 76 * k); c.bezierCurveTo(-78 * k, len + 46 * k, -40 * k, len + 20 * k, -18 * k, len); c.closePath(); }, C.orange);
    F(ctx, (c) => el(c, 0, len + 76 * k, 84 * k, 11 * k), C.gold); F(ctx, (c) => el(c, 0, len + 80 * k, 30 * k, 12 * k), C.cream);
    ctx.restore();

    // cup and saucer with steam curling off it
    const ux = x + 80 * k, uy = cy - 6 * k;
    F(ctx, (c) => { for (let i = 0; i < 3; i++) wisp(c, ux + (i - 1) * 16 * k, uy - 62 * k, (150 + 40 * i) * k, (12 + 3 * i) * k, t, i * 2.3); }, C.cream);
    F(ctx, (c) => el(c, ux, uy + 2 * k, 62 * k, 11 * k), C.cream);
    ctx.lineWidth = 9 * k; ctx.strokeStyle = C.cream; ctx.beginPath(); ctx.arc(ux + 40 * k, uy - 34 * k, 16 * k, -1.3, 1.5); ctx.stroke();
    F(ctx, (c) => { c.moveTo(ux - 40 * k, uy - 62 * k); c.lineTo(ux + 40 * k, uy - 62 * k); c.bezierCurveTo(ux + 40 * k, uy - 10 * k, ux + 22 * k, uy - 2 * k, ux, uy - 2 * k); c.bezierCurveTo(ux - 22 * k, uy - 2 * k, ux - 40 * k, uy - 10 * k, ux - 40 * k, uy - 62 * k); c.closePath(); }, C.cream);
    F(ctx, (c) => el(c, ux, uy - 62 * k, 40 * k, 8 * k), C.rust); F(ctx, (c) => c.rect(ux - 40 * k, uy - 36 * k, 80 * k, 7 * k), C.orange); }

  // a plant in a pot at the left
  { const x = O.x + 110 * big, y = B + 70 * big, k = big;
    F(ctx, (c) => { for (let i = 0; i < 9; i++) { const a = -2.75 + i * 0.3 + 0.05 * osc(p, 4 + (i % 3), i * 0.17), l = (130 + 70 * hash(i, 61)) * k, tx = x + Math.cos(a) * l, ty = y - 70 * k + Math.sin(a) * l * 1.15, nx = -Math.sin(a) * 20 * k, ny = Math.cos(a) * 20 * k; c.moveTo(x, y - 70 * k); c.quadraticCurveTo((x + tx) / 2 + nx, (y - 70 * k + ty) / 2 + ny - 16 * k, tx, ty); c.quadraticCurveTo((x + tx) / 2 - nx, (y - 70 * k + ty) / 2 - ny - 16 * k, x, y - 70 * k); c.closePath(); } }, P.wall);
    F(ctx, (c) => poly(c, [[x - 44 * k, y - 74 * k], [x + 44 * k, y - 74 * k], [x + 32 * k, y], [x - 32 * k, y]]), C.rust);
    F(ctx, (c) => c.rect(x - 50 * k, y - 84 * k, 100 * k, 16 * k), C.orange); }
}
