// Window Series No. 03: Cabin Window. A small-paned window in a log wall, looking out on a snowed-in valley: a far
// mountain, pines heavy with snow, a frozen stream winding down to the glass, snow coming down. Frost creeps in the
// corners of every pane and icicles hang along the top, dripping now and then. Inside it is warm and brown: a candle,
// a kettle steaming, knitted curtains. The panes keep their size, so a wide screen gets a long row of them and a
// phone a tall stack; the valley floor is a share of the glass and the rest is sky and mountain.
import { mulberry, lerp, clamp, osc, noise1, poly, circle, pill, frac, TAU } from './geom.js';
import { C, F } from './kit.js';
import { hash, el, bez, bezT, pine } from './bits.js';

export const title = 'CABIN WINDOW', no = 'No. 03', text = '#2e1a10', dark = '#1c0f09';
const K = { sky: '#a9c9da', hill: '#7ea6bf', snow: '#edf3f1', shade: '#c5dae4', p1: '#3f6b86', p2: '#1f4059', log1: '#1c0f09', log2: '#3a2114', frame: '#6e4226' };
const nM = noise1(1301), nG = noise1(1307), nZ = noise1(1319), nF = noise1(1327);
const CLOUDS = [[0.1, 0.16, 460, 30, K.shade, 5], [0.2, 0.24, 260, 22, K.shade, 5], [0.62, 0.42, 380, 26, K.shade, 8]];

// Bars of cloud that cross the sky and come back in from the left: [x share, y, width, height, color, units per second].
// As bars() in bits.js, but what wraps is a share of the way across, so a change of size cannot throw them along.
function bars(ctx, list, W, t, yOf = (y) => y) {
  for (const [fx, y, w, h, col, v] of list) { const bw = Math.min(w, W * 0.42), span = W + bw + 160; F(ctx, (c) => pill(c, frac((fx * W + bw + 80) / span + (v * t) / 2300) * span - bw - 80, yOf(y), bw, h), col); }
}

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.35 * tall, r = mulberry(1303), rI = mulberry(1305);   // r for the glints, rI for the icicles
  const O = { x: 96, y: 78, w: W - 192, h: H - 78 - 172 * big }, B = O.y + O.h;
  const cols = Math.max(2, Math.round(O.w / (300 * big))), rows = Math.max(2, Math.round(O.h / (310 * big))), cw = O.w / cols, ch = O.h / rows;
  const GY = O.y + O.h * (0.5 + 0.04 * tall);                       // the far edge of the valley floor
  const mh = clamp((GY - O.y) * 0.72, 200, 900), mx = O.x + O.w * (0.63 - 0.1 * tall);
  // the mountain: a jagged outline, and the line where its lit face turns to shade
  const MTN = [[mx - mh * 1.7, GY + 6]], FACE = [[mx, GY - mh]];
  for (let i = 1; i < 9; i++) { const u = i / 9; MTN.push([mx - mh * 1.7 * (1 - u), GY - mh * Math.pow(u, 1.25) - mh * 0.05 * (i % 2)]); }
  MTN.push([mx, GY - mh]);
  for (let i = 1; i < 8; i++) { const u = i / 8; MTN.push([mx + mh * 1.4 * u, GY - mh * Math.pow(1 - u, 1.15) + mh * 0.04 * (i % 2)]); }
  MTN.push([mx + mh * 1.4, GY + 6]);
  for (let i = 1; i <= 6; i++) { const u = i / 6; FACE.push([mx + mh * (0.05 + 0.28 * u) * (i % 2 ? 1 : 0.1) - mh * 0.12 * u, GY - mh * (1 - u)]); }
  FACE.push([mx + mh * 1.4, GY + 6]); for (let i = 7; i >= 1; i--) { const u = i / 8; FACE.push([mx + mh * 1.4 * u, GY - mh * Math.pow(1 - u, 1.15) + mh * 0.04 * (i % 2)]); }
  const hillY = (x) => GY - O.h * 0.03 - O.h * 0.05 * (0.5 + 0.5 * nM(x / 300)) - 5 * nM(x / 40);
  // the stream: a curve from the far edge to the bottom of the glass, widening as it comes
  const A = [O.x + O.w * 0.52, GY + 4], Bc = [O.x + O.w * (0.86 + 0.1 * tall), lerp(GY, B, 0.42)], D = [O.x + O.w * (0.3 - 0.08 * tall), B + 30];
  const stream = (grow) => { const L = [], R = []; for (let i = 0; i <= 24; i++) { const s = i / 24, q = bez(A, Bc, D, s), n = bezT(A, Bc, D, s), w = (5 + 150 * big * Math.pow(s, 1.7)) * grow + (grow - 1) * 6; L.push([q[0] - w * 1.6, q[1] + n[0] * w * 0.2]); R.push([q[0] + w * 1.6, q[1] - n[0] * w * 0.2]); } return L.concat(R.reverse()); };
  const GLINT = Array.from({ length: 16 }, (_, i) => { const s = 0.2 + 0.8 * r(), q = bez(A, Bc, D, s); return { x: q[0], y: q[1], w: (20 + 90 * Math.pow(s, 1.5)) * big, j: r() - 0.5, c: 3 + (i % 4), ph: r() }; });
  const sx = (y) => { let best = A[0]; for (let i = 0; i <= 24; i++) { const q = bez(A, Bc, D, i / 24); if (q[1] <= y) best = q[0]; } return best; };
  // pines on the valley floor, kept off the ice, and big ones close at either side. Pine i takes its numbers from
  // hash(i, k), so it is the same pine at every size and a wider window only adds pines at the end of the list
  const PINES = []; for (let i = 0; i < Math.round(O.w / 70 + 6 * tall); i++) { const u = hash(i, 51), y = lerp(GY + 8, lerp(GY, B, 0.6), u * u), x = O.x + hash(i, 52) * O.w, h = lerp(70, 250, u * u) * big * (0.8 + 0.4 * hash(i, 53)); if (Math.abs(x - sx(y)) < 60 * big + h * 0.3 + 260 * big * u * u) continue; PINES.push({ x, y, h, c: 4 + (i % 3), ph: hash(i, 54) }); }
  PINES.sort((a, b) => a.y - b.y);
  const nh = Math.min(O.h * 0.86, 980 * big);
  const NEAR = [[0.0, 1], [0.1, 0.62], [0.93 + 0.05 * tall, 0.8], [1.03, 1.05]].map(([fx, fh], i) => ({ x: O.x + fx * O.w, h: nh * fh, c: 4 + i, ph: i * 0.23 }));
  // snow: each flake repeats on a grid of its own (px by py, fixed sizes) hung from the glass's top left corner, and
  // wraps inside one cell of it. Nothing about a flake depends on the size of the glass; a bigger pane shows more cells.
  const FLAKES = Array.from({ length: 150 }, (_, i) => ({ x: hash(i, 61), y: hash(i, 62), v: 30 + hash(i, 63) * 50, d: -8 - hash(i, 64) * 16, f: 0.2 + hash(i, 65) * 0.5, ph: hash(i, 66), r: 1.8 + hash(i, 67) * hash(i, 68) * 5, px: 1100 + 600 * hash(i, 69), py: 600 + 400 * hash(i, 70) }));
  const ICE = []; for (let x = O.x + 8; x < O.x + O.w - 8;) { const w = (12 + rI() * 16) * big; ICE.push({ x, w, l: (22 + rI() * rI() * 120) * big }); x += w + rI() * 10 * big; }
  return { W, H, tall, big, O, B, cols, rows, cw, ch, GY, MTN, FACE, hillY, stream, GLINT, PINES, NEAR, FLAKES, ICE };
}

// the snow lying on a pine's tiers: a cap on the upper part of each, matching pine() in bits.js
function caps(c, x, y, h, w, lean, tiers) {
  for (let i = 0; i < tiers; i++) {
    const a = i / tiers, b = (i + 1.55) / tiers, y0 = y - h * (0.14 + 0.86 * a), y1 = y - h * Math.min(1, 0.14 + 0.86 * b), hw = (w / 2) * (1 - a * 0.78), l0 = lean * a * a, l1 = lean * Math.min(1, b) ** 2, m = 0.42;
    poly(c, [[x + l1, y1], [x + lerp(l1, l0 + hw, 0.62), lerp(y1, y0, 0.62)], [x + lerp(l1, l0, m) + hw * 0.16, lerp(y1, y0, m) + 2], [x + lerp(l1, l0, m + 0.12) - hw * 0.1, lerp(y1, y0, m + 0.16)], [x + lerp(l1, l0 - hw, 0.5), lerp(y1, y0, 0.5)]]);
  }
}
function flame(c, x, y, w, h, t, k) {
  const lean = w * 0.5 * nF(t * 1.7 + k * 7.3), hh = h * (0.82 + 0.24 * nF(t * 2.3 + k * 3.1));
  c.moveTo(x - w / 2, y); c.bezierCurveTo(x - w * 0.8, y - hh * 0.35, x - w * 0.1 + lean * 0.3, y - hh * 0.55, x + lean, y - hh);
  c.bezierCurveTo(x + w * 0.25 + lean * 0.3, y - hh * 0.6, x + w * 0.85, y - hh * 0.3, x + w / 2, y); c.closePath();
}
function wisp(c, x, y, h, w, t, k) {
  const L = [], R = [];
  for (let i = 0; i <= 14; i++) { const s = i / 14, px = x + w * 2.2 * s * Math.sin(s * 5.2 - t * 1.1 + k) + w * 2.5 * s * s + w * 1.5 * s * nF(t * 0.2 + k), py = y - h * s, ww = w * Math.sin(Math.PI * Math.pow(s, 0.7)) * 0.5; L.push([px - ww, py]); R.push([px + ww, py]); }
  poly(c, L.concat(R.reverse()));
}

export function paint(ctx, p, t, G) {
  const { W, H, O, B, GY, big, cw, ch } = G;
  ctx.save(); ctx.beginPath(); ctx.rect(O.x, O.y, O.w, O.h); ctx.clip();
  ctx.fillStyle = K.sky; ctx.fillRect(O.x, O.y, O.w, O.h);
  bars(ctx, CLOUDS, W, t, (y) => O.y + y * (GY - O.y));
  F(ctx, (c) => poly(c, G.MTN), K.snow); F(ctx, (c) => poly(c, G.FACE), K.shade);
  bars(ctx, [[0.5, 0, 420, 24, K.snow, 4]], W, t, () => lerp(O.y, GY, 0.66));
  // wooded hills at the valley's far edge, then the floor with its drifts
  F(ctx, (c) => { c.moveTo(O.x, GY + 6); for (let x = O.x; x <= O.x + O.w + 8; x += 8) c.lineTo(x, G.hillY(x)); c.lineTo(O.x + O.w + 8, GY + 6); c.closePath(); for (let x = O.x; x <= O.x + O.w; x += 20) pine(c, x + 8 * hash(x, 1), G.hillY(x + 8 * hash(x, 1)) + 5, (22 + 30 * hash(x, 2)) * big, (16 + 8 * hash(x, 3)) * big, 0, 3); }, K.hill);
  F(ctx, (c) => c.rect(O.x, GY, O.w, B - GY), K.snow);
  for (const f of [0.22, 0.52, 0.8]) for (const [dy, fill] of [[0, K.shade], [9 + 16 * f, K.snow]]) F(ctx, (c) => { const y0 = lerp(GY, B, f) + dy; c.moveTo(O.x, B); for (let x = O.x; x <= O.x + O.w + 14; x += 14) c.lineTo(x, y0 + (20 + 30 * f) * nG(x / (300 + 300 * f) + f * 30) * big); c.lineTo(O.x + O.w + 14, B); c.closePath(); }, fill);

  // the frozen stream: shaded banks, ice, and pale streaks on it that come and go
  F(ctx, (c) => poly(c, G.stream(1.18)), K.shade); F(ctx, (c) => poly(c, G.stream(1)), K.hill);
  F(ctx, (c) => { for (const g of G.GLINT) { const a = 0.5 + 0.5 * osc(p, g.c, g.ph), w = g.w * (0.3 + 0.9 * a); pill(c, g.x + g.j * g.w * 1.6 + 6 * osc(p, 2, g.ph) - w / 2, g.y, w, 3 + g.w * 0.035); } }, K.sky);

  // pines, each tipping a little under its load
  const stand = (list, body, base) => {
    const lean = (q) => q.h * 0.02 * osc(p, q.c, q.ph) + q.h * 0.008 * osc(p, 9, q.ph);
    F(ctx, (c) => { for (const q of list) el(c, q.x, base(q) + 3, q.h * 0.24, q.h * 0.035); }, K.shade);
    F(ctx, (c) => { for (const q of list) pine(c, q.x, base(q), q.h, q.h * 0.42, lean(q), 5); }, body);
    F(ctx, (c) => { for (const q of list) caps(c, q.x, base(q), q.h, q.h * 0.42, lean(q), 5); }, K.snow);
  };
  stand(G.PINES, K.p1, (q) => q.y);
  stand(G.NEAR, K.p2, () => B + 40 * big);

  // snow coming down
  F(ctx, (c) => { const m = 10 * big; for (const f of G.FLAKES) { const x0 = O.x + frac(f.x + (f.d * t + 26 * Math.sin(TAU * (t * f.f * 0.2 + f.ph))) / f.px) * f.px - m, y0 = O.y + frac(f.y + (f.v * t) / f.py) * f.py - m; for (let x = x0; x < O.x + O.w + m; x += f.px) for (let y = y0; y < B + m; y += f.py) circle(c, x, y, f.r * big); } }, C.cream);

  // icicles under the eave, a drip now and then, and the snow banked on the ledge outside
  F(ctx, (c) => { for (const q of G.ICE) poly(c, [[q.x, O.y], [q.x + q.w, O.y], [q.x + q.w * 0.5, O.y + q.l]]); c.rect(O.x, O.y, O.w, 8 * big); }, K.shade);
  F(ctx, (c) => { for (const q of G.ICE) poly(c, [[q.x, O.y], [q.x + q.w * 0.45, O.y], [q.x + q.w * 0.5, O.y + q.l]]); }, K.snow);
  F(ctx, (c) => { for (let k = 0; k < 3; k++) { const slot = 3.1 + k * 1.3, n = Math.floor(t / slot), q = mulberry(n * 4409 + k * 17); if (q() > 0.7) continue; const tx = O.x + q() * O.w, ic = G.ICE.find((v) => v.x + v.w >= tx) || G.ICE[G.ICE.length - 1], u = t - n * slot - q() * 1.2, x = ic.x + ic.w * 0.5, y0 = O.y + ic.l;
    if (u < 0) { const g = clamp(1 + u / 0.9); el(c, x, y0 + 2 * g, 2.6 * big * g, 4 * big * g); } else { const y = y0 + 6 + 520 * u * u; if (y < B) el(c, x, y, 2.6 * big, (4 + 5 * Math.min(1, u * 2)) * big); } } }, K.hill);
  F(ctx, (c) => { c.moveTo(O.x, B + 4); for (let x = O.x; x <= O.x + O.w + 10; x += 10) c.lineTo(x, B - (14 + 12 * (0.5 + 0.5 * nG(x / 130 + 70)) + 5 * nG(x / 31)) * big); c.lineTo(O.x + O.w + 10, B + 4); c.closePath(); }, K.snow);

  // frost in the corners of each pane, growing and drawing back over minutes
  const frost = (scale, fill) => F(ctx, (c) => {
    for (let i = 0; i < G.cols; i++) for (let j = 0; j < G.rows; j++) for (let k = 0; k < 4; k++) {
      const id = i * 37 + j * 11 + k, sx = k & 1 ? -1 : 1, sy = k & 2 ? -1 : 1, cx = O.x + (i + (k & 1)) * cw, cy = O.y + (j + (k >> 1)) * ch;
      const g = Math.min(cw, ch) * (0.17 + 0.2 * hash(id, 1)) * (0.7 + 0.3 * nZ(t * 0.03 + id * 3.7)) * scale * (k & 2 ? 1.25 : 0.8);
      c.moveTo(cx, cy); c.lineTo(cx + sx * g * 1.15, cy);
      for (let m = 1; m <= 6; m++) { const a = (m / 7) * (Math.PI / 2), a2 = ((m - 0.5) / 7) * (Math.PI / 2), l = g * (0.62 + 0.5 * hash(id, 10 + m)); c.lineTo(cx + sx * Math.cos(a2) * g * 0.5, cy + sy * Math.sin(a2) * g * 0.5); c.lineTo(cx + sx * Math.cos(a) * l, cy + sy * Math.sin(a) * l); }
      c.lineTo(cx, cy + sy * g * 1.15); c.closePath();
    } }, fill);
  frost(1, K.shade); frost(0.62, K.snow);
  ctx.restore();

  ctx.depthLayer?.('window');
  // the log wall, the frame and its glazing bars, the sill
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.rect(O.x, O.y, O.w, O.h); ctx.fillStyle = K.log2; ctx.fill('evenodd');
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.rect(O.x, O.y, O.w, O.h); ctx.clip('evenodd');
  F(ctx, (c) => { for (let j = 0, y = 26; y < H; j++, y += 74 * big) { const yb = 26 + 74 * j; c.rect(0, y, W, 7); for (let x = (yb * 7) % 400 - 300; x < W; x += 520) pill(c, x, y + 24 * big, 110 + ((x + yb) % 90), 4); } }, K.log1);
  ctx.restore();
  F(ctx, (c) => { c.rect(O.x - 22, O.y - 22, O.w + 44, 22); c.rect(O.x - 22, O.y, 22, O.h); c.rect(O.x + O.w, O.y, 22, O.h); for (let i = 1; i < G.cols; i++) c.rect(O.x + i * cw - 6, O.y, 12, O.h); for (let j = 1; j < G.rows; j++) c.rect(O.x, O.y + j * ch - 6, O.w, 12); c.rect(O.x - 46, B, O.w + 92, 26 * big); }, K.frame);
  F(ctx, (c) => c.rect(O.x - 46, B + 26 * big, O.w + 92, 10 * big), K.log1);

  ctx.depthLayer?.('curtains');
  // knitted curtains tied back at either side, stirring in the draught
  for (const sd of [-1, 1]) {
    const x1 = sd < 0 ? O.x - 22 : O.x + O.w + 22, w = clamp(O.w * 0.09, 86, 190) * big * (sd < 0 ? 1 : 0.85), yt = B - O.h * (0.32 + 0.04 * sd), sw = 5 * osc(p, 3, 0.3 + sd * 0.2) * big, X = (v) => x1 - sd * v, y0 = O.y - 30, n = 5;
    const shape = (c) => { c.moveTo(X(-8), y0); c.lineTo(X(w), y0); c.bezierCurveTo(X(w + 10) + sw, lerp(y0, yt, 0.5), X(w * 0.6) + sw, yt - 60 * big, X(30 * big), yt); c.bezierCurveTo(X(w * 0.5), yt + 60 * big, X(w * 0.66) + sw, B - 60 * big, X(w * 0.62) + sw * 1.4, B + 8);
      for (let k = n - 1; k >= 0; k--) c.quadraticCurveTo(X((w * 0.62 * (k + 0.5)) / n) + sw, B + 22 * big, X((w * 0.62 * k) / n), B + 8); c.lineTo(X(-8), B + 8); c.closePath(); };
    F(ctx, shape, C.rust);
    ctx.save(); ctx.beginPath(); shape(ctx); ctx.clip();
    // rows of knit: a zigzag, then a row of dots
    ctx.strokeStyle = C.cream; ctx.lineWidth = 3.5 * big; ctx.lineJoin = 'miter'; ctx.beginPath();
    for (let y = y0 + 50 * big; y < B; y += 150 * big) for (let k = 0; k <= 14; k++) { const px = X(-10 + k * 16 * big * sd * sd), py = y + (k % 2 ? 16 : 0) * big; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.stroke();
    F(ctx, (c) => { for (let y = y0 + 110 * big; y < B; y += 150 * big) for (let k = 0; k < 12; k++) c.rect(X(k * 20 * big) - 4 * big, y, 8 * big, 8 * big); }, C.orange);
    ctx.restore();
    F(ctx, (c) => c.rect(Math.min(X(0), X(48 * big)), yt - 8 * big, 48 * big, 16 * big), C.cream);
  }
  F(ctx, (c) => pill(c, O.x - 60, O.y - 42, O.w + 120, 12), K.log1);

  ctx.depthLayer?.('candle');
  // candle in a brass dish; its light lies on the sill and shifts with the flame
  { const k = big, x = W * (0.3 + 0.02 * tallOf(G)), y = B + 14 * k, fl = 0.5 + 0.5 * nF(t * 3.1);
    F(ctx, (c) => el(c, x, B + 14 * k, (190 + 18 * fl) * k, (10 + 1.5 * fl) * k), C.orange);
    F(ctx, (c) => { el(c, x, y, 62 * k, 12 * k); c.rect(x - 62 * k, y - 8 * k, 124 * k, 8 * k); }, C.gold);
    ctx.strokeStyle = C.gold; ctx.lineWidth = 7 * k; ctx.beginPath(); ctx.arc(x + 70 * k, y - 10 * k, 15 * k, 0, TAU); ctx.stroke();
    F(ctx, (c) => { c.rect(x - 17 * k, y - 124 * k, 34 * k, 118 * k); el(c, x - 17 * k, y - 96 * k, 6 * k, 14 * k); el(c, x + 15 * k, y - 110 * k, 5 * k, 10 * k); }, C.cream);
    F(ctx, (c) => c.rect(x - 1.5 * k, y - 138 * k, 3 * k, 16 * k), K.log1);
    F(ctx, (c) => flame(c, x, y - 128 * k, 34 * k, 84 * k, t, 1), C.orange);
    F(ctx, (c) => flame(c, x, y - 128 * k, 21 * k, 54 * k, t, 1), C.gold);
    F(ctx, (c) => flame(c, x, y - 128 * k, 10 * k, 24 * k, t, 1), C.cream); }

  // kettle, steam curling from its spout
  { const k = big, x = W * (0.64 + 0.03 * tallOf(G)), y = B + 16 * k;
    F(ctx, (c) => { for (let i = 0; i < 3; i++) wisp(c, x + 104 * k, y - 122 * k, (170 + 50 * i) * k, (12 + 4 * i) * k, t, i * 2.1); }, C.cream);
    ctx.strokeStyle = K.log1; ctx.lineWidth = 9 * k; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y - 112 * k, 58 * k, Math.PI * 1.06, Math.PI * 1.94); ctx.stroke();
    F(ctx, (c) => { c.moveTo(x - 80 * k, y); c.bezierCurveTo(x - 92 * k, y - 60 * k, x - 60 * k, y - 112 * k, x, y - 112 * k); c.bezierCurveTo(x + 60 * k, y - 112 * k, x + 92 * k, y - 60 * k, x + 80 * k, y); c.closePath(); poly(c, [[x + 62 * k, y - 70 * k], [x + 100 * k, y - 126 * k], [x + 116 * k, y - 118 * k], [x + 84 * k, y - 40 * k]]); }, K.p2);
    F(ctx, (c) => { c.rect(x - 84 * k, y - 34 * k, 168 * k, 9 * k); circle(c, x, y - 120 * k, 9 * k); pill(c, x - 26 * k, y - 116 * k, 52 * k, 8 * k); }, C.gold); }
}
const tallOf = (G) => G.tall;
