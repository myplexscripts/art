// Window Series No. 04: City Loft. A wall of steel-framed panes in a brick loft, and beyond it the city at dusk:
// three depths of towers whose windows switch on and off, roof beacons, two searchlights, an airliner now and then,
// an elevated road carrying two streams of lights, a big moon and a water tower. Plants trail from the sill and from
// a hanging pot, and a bare bulb swings on its cord. The panes keep their size (more of them on a bigger window);
// towers are a share of the glass in height but keep their widths, so a wide screen simply sees more city.
import { mulberry, lerp, clamp, osc, noise1, poly, circle, pill, frac, TAU } from './geom.js?v=20261019-after-hours-detail';
import { C, F } from './kit.js?v=20261019-after-hours-detail';
import { hash, el, makeStars, paintStars } from './bits.js?v=20261019-after-hours-detail';

export const title = 'CITY LOFT', no = 'No. 04', text = '#1e1650', dark = '#0c0818';
const L = { s1: '#1e1650', s2: '#3a2074', s3: '#742e80', s4: '#b84a80', far: '#6a3a8c', mid: '#44266c', near: '#28174e', ink: '#0c0818', wall: '#1a102e', brick: '#2a1a42', leaf: '#2a7a6c' };
const nB = noise1(1401);
const CLOUDS = [[0.1, 0.3, 460, 26, L.s2, 4], [0.2, 0.37, 260, 20, L.s2, 4], [0.6, 0.6, 400, 24, L.s3, 6], [0.35, 0.78, 320, 20, L.s4, 8]];

// Bars of cloud that cross the sky and come back in from the left: [x share, y, width, height, color, units per second].
// As bars() in bits.js, but what wraps is a share of the way across, so a change of size cannot throw them along.
function bars(ctx, list, W, t, yOf = (y) => y) {
  for (const [fx, y, w, h, col, v] of list) { const bw = Math.min(w, W * 0.42), span = W + bw + 160; F(ctx, (c) => pill(c, frac((fx * W + bw + 80) / span + (v * t) / 2300) * span - bw - 80, yOf(y), bw, h), col); }
}

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.35 * tall;
  const O = { x: 70, y: 62, w: W - 140, h: H - 62 - 150 * big }, B = O.y + O.h;
  const cols = Math.max(3, Math.round(O.w / (215 * big))), rows = Math.max(2, Math.round(O.h / (250 * big))), cw = O.w / cols, ch = O.h / rows;
  const roadY = B - clamp(O.h * 0.2, 130, 300);
  const STARS = makeStars(141, 60, W, O.y + O.h * 0.4);
  // one depth of towers: [width range], [height range as a share of the glass], window cell. Each depth has its own
  // generator, so a wider window adds towers at the right of each and leaves all the others as they were
  const row = (w0, w1, h0, h1, cell, gapP, k0) => { const r = mulberry(1403 + k0), a = []; let x = O.x - 40 - r() * 60; while (x < O.x + O.w + 20) { const w = (w0 + r() * (w1 - w0)) * big, h = O.h * (h0 + r() * r() * (h1 - h0)); a.push({ x, w, h, top: Math.floor(r() * 4), cell: cell * big, id: k0 + a.length, cols: Math.max(1, Math.floor((w - cell * big * 0.6) / (cell * big))), rows: Math.max(1, Math.floor((h - 20) / (cell * big * 1.3))), ph: r() }); x += w + (r() < gapP ? r() * 60 * big : 0); } return a; };
  const FAR = row(60, 120, 0.3, 0.62, 17, 0.5, 0), MID = row(90, 170, 0.22, 0.48, 24, 0.3, 200), NEAR = row(120, 260, 0.05, 0.16, 30, 0.2, 400);
  // one far tower is the tall one, with a spire
  const hero = FAR[Math.floor(FAR.length * (0.58 - 0.1 * tall))]; hero.h = O.h * 0.8; hero.top = 3; hero.rows = Math.floor((hero.h - 20) / (hero.cell * 1.3));
  for (const b of NEAR) b.h = Math.min(b.h, B - roadY - 34 * big);
  const MOON = { x: O.x + O.w * (0.22 + 0.06 * tall), y: O.y + O.h * 0.27, r: 105 * big };
  const tank = { x: O.x + O.w * (0.82 - 0.1 * tall), y: B - (B - roadY) * 0.5 };
  const BEAMS = [{ x: O.x + O.w * 0.38, ph: 0.1, v: 0.09 }, { x: O.x + O.w * 0.7, ph: 2.3, v: 0.07 }];
  // vines: where each starts, how long, its own rhythm
  const pots = [0.12, 0.47 + 0.06 * tall, 0.86].map((f) => W * f);
  const r = mulberry(1409), VINES = []; pots.forEach((x, i) => { for (let k = 0; k < 5; k++) VINES.push({ x: x + (k - 2) * 20 * big, y: B - 18 * big, len: (90 + r() * 150) * big, a: (k - 2) * 0.5 + (r() - 0.5) * 0.3, up: k % 2 === 0, c: 3 + (k % 3), ph: r(), id: i * 10 + k }); });
  const hang = { x: W * (0.74 - 0.04 * tall), len: clamp(O.h * 0.22, 130, 380) };
  for (let k = 0; k < 6; k++) VINES.push({ x: hang.x + (k - 2.5) * 17 * big, y: hang.len + 46 * big, len: (150 + r() * 260) * big * (1 + 0.4 * tall), a: (k - 2.5) * 0.14, up: false, hang: true, c: 3 + (k % 3), ph: r(), id: 40 + k });
  const bulb = { x: W * (0.54 - 0.06 * tall), len: clamp(O.h * 0.34, 190, 600) };
  return { W, H, tall, big, O, B, cols, rows, cw, ch, roadY, STARS, FAR, MID, NEAR, MOON, tank, BEAMS, pots, VINES, hang, bulb };
}

const lit = (id, t, share) => hash(id, Math.floor(t / (70 + 170 * hash(id, 5)) + hash(id, 6))) < share;
// things spaced along an endless strip going by. s is how far it has gone, counted in steps (not units), so that a
// step that changes with the size stretches the strip in place instead of flinging it along
function along(s, x0, w, step, pad, fn) { for (let i = Math.floor(s - pad / step); i <= Math.ceil(s + (w + pad) / step); i++) fn(x0 + (i + hash(i, 1) * 0.5 - s) * step, i); }
function towers(ctx, list, B, big, fill) {
  F(ctx, (c) => { for (const b of list) { const y = B - b.h; c.rect(b.x, y, b.w, b.h + 2);
    if (b.top === 1) c.rect(b.x + b.w * 0.2, y - 16 * big, b.w * 0.6, 16 * big); else if (b.top === 2) { c.rect(b.x + b.w * 0.12, y - 12 * big, b.w * 0.3, 12 * big); c.rect(b.x + b.w * 0.7, y - 30 * big, 3 * big, 30 * big); }
    else if (b.top === 3) { c.rect(b.x + b.w * 0.18, y - 24 * big, b.w * 0.64, 24 * big); c.rect(b.x + b.w * 0.34, y - 46 * big, b.w * 0.32, 22 * big); c.rect(b.x + b.w / 2 - 2 * big, y - 110 * big, 4 * big, 66 * big); } } }, fill);
}
const panes = (ctx, list, B, t, share, fill, salt) => F(ctx, (c) => { for (const b of list) { const x0 = b.x + (b.w - b.cols * b.cell + b.cell * 0.45) / 2, y0 = B - b.h + 12; for (let i = 0; i < b.cols; i++) for (let j = 0; j < b.rows; j++) if (lit(b.id * 977 + i * 31 + j + salt, t, share)) c.rect(x0 + i * b.cell, y0 + j * b.cell * 1.3, b.cell * 0.55, b.cell * 0.7); } }, fill);
// where a vine is at s along its length; a hanging one swings more the lower it goes
const vineAt = (v, s, p, big) => { const sw = (v.hang ? 26 : 10) * big * s * s * (osc(p, v.c, v.ph) + 0.4 * osc(p, 7, v.ph * 3)); return v.up ? [v.x + Math.sin(v.a) * v.len * 0.7 * s + sw, v.y - v.len * 0.55 * s * (2 - s) * Math.cos(v.a * 0.6) + v.len * 0.5 * s * s * Math.abs(Math.sin(v.a))] : [v.x + v.len * 0.22 * v.a * Math.sqrt(s) + 9 * big * Math.sin(s * 5 + v.ph * 9) * s + sw, v.y + (v.hang ? 0 : 30 * big * Math.min(1, s * 5)) + v.len * s]; };

export function paint(ctx, p, t, G) {
  const { W, H, O, B, big, cw, ch, roadY, MOON } = G;
  ctx.save(); ctx.beginPath(); ctx.rect(O.x, O.y, O.w, O.h); ctx.clip();
  // dusk in flat bands, the afterglow lowest
  ctx.fillStyle = L.s1; ctx.fillRect(O.x, O.y, O.w, O.h);
  paintStars(ctx, G.STARS, p);
  // searchlights sweep behind everything and are lost in the glow
  F(ctx, (c) => { for (const b of G.BEAMS) { const a = -Math.PI / 2 + 0.5 * Math.sin(t * b.v + b.ph) + 0.22 * nB(t * 0.03 + b.ph * 9), len = O.h * 1.6 + O.w * 0.3, y0 = B - O.h * 0.2; poly(c, [[b.x - 5 * big, y0], [b.x + 5 * big, y0], [b.x + Math.cos(a + 0.028) * len, y0 + Math.sin(a + 0.028) * len], [b.x + Math.cos(a - 0.028) * len, y0 + Math.sin(a - 0.028) * len]]); } }, L.s2);
  [[0.4, L.s2], [0.62, L.s3], [0.8, L.s4], [0.93, C.orange]].forEach(([f, fill], i) => F(ctx, (c) => { c.moveTo(O.x, B); for (let x = O.x; x <= O.x + O.w + 20; x += 20) c.lineTo(x, O.y + O.h * f + 10 * nB(x / 260 + i * 20 + t * 0.004)); c.lineTo(O.x + O.w + 20, B); c.closePath(); }, fill));
  bars(ctx, CLOUDS, W, t, (y) => O.y + y * O.h * 0.8);
  F(ctx, (c) => circle(c, MOON.x, MOON.y + 8 * Math.sin((TAU * t) / 420), MOON.r), C.cream);
  F(ctx, (c) => { const y = MOON.y + 8 * Math.sin((TAU * t) / 420), m = MOON.r; circle(c, MOON.x - m * 0.32, y - m * 0.22, m * 0.19); circle(c, MOON.x + m * 0.3, y + m * 0.24, m * 0.26); circle(c, MOON.x + m * 0.36, y - m * 0.42, m * 0.1); circle(c, MOON.x - m * 0.26, y + m * 0.46, m * 0.12); }, C.gold);
  // an airliner crosses high up now and then: a steady light and a slow blinking one
  { const slot = 58, n = Math.floor(t / slot), q = mulberry(n * 6007 + 3), go = q() < 0.75, dir = q() < 0.5 ? -1 : 1, u = (t - n * slot - 2 - q() * 12) / 36, y0 = O.y + O.h * (0.08 + 0.2 * q());
    if (go && u >= 0 && u <= 1) { const x = O.x + (dir > 0 ? -40 + u * (O.w + 80) : O.w + 40 - u * (O.w + 80)), y = y0 - u * O.h * 0.06;
      F(ctx, (c) => { pill(c, x - 15 * big, y - 3 * big, 30 * big, 6 * big); poly(c, [[x - dir * 13 * big, y], [x - dir * 20 * big, y - 9 * big], [x - dir * 14 * big, y - 9 * big], [x - dir * 6 * big, y]]); }, L.s3);
      F(ctx, (c) => circle(c, x + dir * 13 * big, y, 2.6 * big), C.cream); if (Math.sin(t * 3.3) > 0.2) F(ctx, (c) => circle(c, x - dir * 4 * big, y + 4 * big, 3 * big), C.orange); } }

  // the city, far to near
  towers(ctx, G.FAR, B, big, L.far); panes(ctx, G.FAR, B, t, 0.3, L.s4, 0); panes(ctx, G.FAR, B, t, 0.22, C.gold, 5000);
  towers(ctx, G.MID, B, big, L.mid); panes(ctx, G.MID, B, t, 0.3, C.gold, 0); panes(ctx, G.MID, B, t, 0.08, C.cream, 7000);
  // beacons on the taller roofs, each on its own slow beat
  F(ctx, (c) => { for (const b of G.FAR.concat(G.MID)) if (b.top >= 2 && Math.sin(t * (1.1 + 0.5 * b.ph) + b.ph * 30) > 0.25) circle(c, b.top === 3 ? b.x + b.w / 2 : b.x + b.w * 0.7 + 1.5 * big, B - b.h - (b.top === 3 ? 112 : 32) * big, 4.5 * big); }, C.orange);

  // the elevated road: piers, deck, and the traffic as two streams of lights
  F(ctx, (c) => { c.rect(O.x, roadY, O.w, 16 * big); c.rect(O.x, roadY - 12 * big, O.w, 3 * big); for (let x = O.x + 60 * big; x < O.x + O.w; x += 330 * big) { c.rect(x, roadY, 22 * big, B - roadY); c.rect(x - 16 * big, roadY + 14 * big, 54 * big, 10 * big); c.rect(x + 9 * big, roadY - 70 * big, 3 * big, 60 * big); c.rect(x + 9 * big, roadY - 70 * big, 26 * big, 3 * big); } }, L.near);
  F(ctx, (c) => { for (let x = O.x + 60 * big; x < O.x + O.w; x += 330 * big) circle(c, x + 34 * big, roadY - 66 * big, 4.5 * big); along((86 * t) / 52, O.x, O.w, 52 * big, 60, (x, i) => { if (hash(i, 2) < 0.5) pill(c, x, roadY - 9 * big, 13 * big, 5 * big); }); }, C.gold);
  F(ctx, (c) => along((-64 * t) / 60, O.x, O.w, 60 * big, 60, (x, i) => { if (hash(i, 12) < 0.5) pill(c, x, roadY - 20 * big, 11 * big, 5 * big); }), C.orange);
  F(ctx, (c) => along((-64 * t) / 60, O.x, O.w, 60 * big, 60, (x, i) => { if (hash(i, 12) < 0.5 && hash(i, 13) < 0.3) pill(c, x, roadY - 20 * big, 11 * big, 5 * big); }), C.cream);

  // the nearest roofs, with the water tower standing on one
  towers(ctx, G.NEAR, B, big, L.ink); panes(ctx, G.NEAR, B, t, 0.16, C.gold, 0);
  { const { x, y } = G.tank, k = big * 1.2;
    F(ctx, (c) => { c.rect(x - 90 * k, y, 180 * k, B - y); for (const dx of [-44, -15, 14, 42]) c.rect(x + dx * k, y - 100 * k, 4 * k, 100 * k); poly(c, [[x - 44 * k, y - 20 * k], [x - 40 * k, y - 20 * k], [x + 46 * k, y - 84 * k], [x + 42 * k, y - 84 * k]]); poly(c, [[x + 46 * k, y - 20 * k], [x + 42 * k, y - 20 * k], [x - 44 * k, y - 84 * k], [x - 40 * k, y - 84 * k]]);
      c.rect(x - 56 * k, y - 106 * k, 112 * k, 8 * k); c.rect(x - 50 * k, y - 220 * k, 100 * k, 116 * k); poly(c, [[x - 58 * k, y - 220 * k], [x + 58 * k, y - 220 * k], [x, y - 264 * k]]); c.rect(x + 60 * k, y - 190 * k, 3 * k, 190 * k); }, L.ink);
    F(ctx, (c) => { c.rect(x - 50 * k, y - 190 * k, 100 * k, 4 * k); c.rect(x - 50 * k, y - 140 * k, 100 * k, 4 * k); }, L.near); }
  ctx.restore();

  ctx.depthLayer?.('window');
  // the room: brick wall, steel frame and glazing bars, a concrete sill
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.rect(O.x, O.y, O.w, O.h); ctx.fillStyle = L.wall; ctx.fill('evenodd');
  F(ctx, (c) => { for (let y = B + 44 * big, j = 0; y < H; y += 26 * big, j++) for (let x = (j % 2) * 40 * big - 20 + 61 * hash(j, 3), n = 0; x < W; n++, x += 80 * big * (1 + 2 * Math.floor(hash(n, j + 20) * 3))) c.rect(x, y, 64 * big, 4); for (let y = 16, j = 0; y < H; y += 26 * big, j++) { if (hash(j, 8) < 0.5) c.rect(8, y, 44, 4); if (hash(j, 9) < 0.5) c.rect(W - 54, y, 44, 4); } }, L.brick);
  F(ctx, (c) => { c.rect(O.x - 14, O.y - 14, O.w + 28, 14); c.rect(O.x - 14, O.y, 14, O.h); c.rect(O.x + O.w, O.y, 14, O.h); for (let i = 1; i < G.cols; i++) c.rect(O.x + i * cw - (i % 2 ? 3 : 5), O.y, i % 2 ? 6 : 10, O.h); for (let j = 1; j < G.rows; j++) c.rect(O.x, O.y + j * ch - 3, O.w, 6); }, L.ink);
  F(ctx, (c) => c.rect(O.x - 40, B, O.w + 80, 22 * big), L.brick);
  F(ctx, (c) => c.rect(O.x - 40, B + 22 * big, O.w + 80, 8 * big), L.ink);

  ctx.depthLayer?.('plants');
  // plants: pots on the sill, one hanging; stems first, then leaves in two inks
  { const k = big, h = G.hang, ha = 0.02 * osc(p, 3, 0.2);
    F(ctx, (c) => { c.rect(h.x - 1.5, 0, 3, h.len); poly(c, [[h.x, h.len - 40 * k], [h.x + 52 * k, h.len + 6 * k], [h.x + 48 * k, h.len + 8 * k], [h.x, h.len - 34 * k], [h.x - 48 * k, h.len + 8 * k], [h.x - 52 * k, h.len + 6 * k]]); }, L.ink);
    ctx.strokeStyle = L.ink; ctx.lineWidth = 3 * k; ctx.lineCap = 'round'; ctx.beginPath();
    for (const v of G.VINES) for (let i = 0; i <= 12; i++) { const q = vineAt(v, i / 12, p, k); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
    ctx.stroke();
    for (const [odd, fill] of [[0, L.ink], [1, L.leaf]]) F(ctx, (c) => { for (const v of G.VINES) { const n = Math.round(v.len / (30 * k)); for (let i = 1; i <= n; i++) { if ((i + v.id) % 2 !== odd) continue; const s = i / n, q = vineAt(v, s, p, k), sd = i % 2 ? 1 : -1, a = sd * 0.7 + 0.16 * osc(p, 5 + (i % 3), v.ph + i * 0.13) + (v.up ? -1.2 * Math.sin(v.a) : 0), ll = (15 + 7 * hash(v.id, i)) * k * (v.up ? 1.5 : 1); el(c, q[0] + Math.cos(a) * ll * 0.8 * sd, q[1] + Math.abs(Math.sin(a)) * ll * 0.5, ll, ll * 0.5, a * sd); } } }, fill);
    F(ctx, (c) => { for (const x of G.pots) poly(c, [[x - 50 * k, B - 62 * k], [x + 50 * k, B - 62 * k], [x + 38 * k, B + 4 * k], [x - 38 * k, B + 4 * k]]); }, C.rust);
    F(ctx, (c) => { for (const x of G.pots) c.rect(x - 56 * k, B - 70 * k, 112 * k, 15 * k); poly(c, [[h.x - 54 * k, h.len], [h.x + 54 * k, h.len], [h.x + 36 * k, h.len + 54 * k], [h.x - 36 * k, h.len + 54 * k]]); }, C.orange);
    void ha; }

  ctx.depthLayer?.('bulb');
  // a bare bulb on its cord, swinging slowly
  { const { x, len } = G.bulb, k = big, a = 0.045 * osc(p, 3, 0.4) + 0.02 * osc(p, 7, 0.1), g = 0.5 + 0.5 * nB(t * 0.5 + 50);
    ctx.save(); ctx.translate(x, 0); ctx.rotate(a);
    F(ctx, (c) => { c.rect(-1.5, -20, 3, len + 20); c.rect(-9 * k, len - 4 * k, 18 * k, 24 * k); }, L.ink);
    F(ctx, (c) => { for (let i = 0; i < 8; i++) { const b = (i * TAU) / 8 + 0.39, r0 = (44 + 3 * g) * k, r1 = (58 + 7 * g) * k; poly(c, [[Math.cos(b - 0.05) * r0, len + 46 * k + Math.sin(b - 0.05) * r0], [Math.cos(b + 0.05) * r0, len + 46 * k + Math.sin(b + 0.05) * r0], [Math.cos(b) * r1, len + 46 * k + Math.sin(b) * r1]]); } }, C.orange);
    F(ctx, (c) => { circle(c, 0, len + 46 * k, 30 * k); c.rect(-12 * k, len + 14 * k, 24 * k, 14 * k); }, C.gold);
    F(ctx, (c) => circle(c, 0, len + 48 * k, 16 * k), C.cream);
    ctx.restore(); }
}
