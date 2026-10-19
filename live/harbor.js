// Nocturne Series No. 03: Lantern Harbor. A waterfront town under a hill, boats at their moorings, a pier in the
// near corner and paper lanterns strung across the top. The waterline sits at a fixed share of the height; extra
// width becomes more town and more water, extra height more sky and more harbor.
import { mulberry, lerp, clamp, osc, sway, noise1, poly, circle, pill, TAU } from './geom.js?v=20261019-after-hours-detail';
import { C, F } from './kit.js?v=20261019-after-hours-detail';
import { hash, el, makeStars, paintStars, meteor, bars, crescent } from './bits.js?v=20261019-after-hours-detail';

export const title = 'LANTERN HARBOR', no = 'No. 03', text = C.navy, dark = C.ink;
const WALLS = [C.deep, '#1a4a70', '#10294d'], nH = noise1(301);
const CLOUDS = [[0.5, 0.2, 420, 28, C.deep, 6], [0.56, 0.27, 250, 20, C.deep, 6], [0.05, 0.42, 330, 24, C.teal, 9]];

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall;
  let r = mulberry(303);
  const WY = Math.round(H * (0.6 - 0.05 * tall));
  const MOON = { x: W * 0.2, y: WY * 0.26, r: 62 };
  const STARS = makeStars(41, 150, W, WY * 0.7, (s) => Math.hypot(s.x - MOON.x, s.y - MOON.y) > 110);
  const hillY = (x) => WY - H * 0.06 - H * 0.2 * Math.sin(clamp(x / W, 0, 1) * 2.0 + 0.25) ** 2 - 14 * nH(x / 130);
  // cottages scattered up the hill, a row of houses along the quay with a clock tower among them
  const HILL = []; for (let i = 0; i < Math.round(W / 46); i++) { const x = r() * W, fy = r(), w = 24 + r() * 18, h = 16 + r() * 14, lit = r() < 0.7, top = hillY(x) + 26, room = WY - 110 * big - top; if (room >= 10) HILL.push({ x, y: top + fy * room, w, h, lit, id: i }); }
  // the row is built the same from the left at every size; the clock tower is its own building standing in front of
  // it, so moving the tower with the frame never renumbers the houses or their windows
  r = mulberry(304); const ROW = []; let x = -70; const tx = W * (0.63 + 0.05 * tall);
  while (x < W + 70) { const w = (62 + r() * 66) * big, h = (86 + r() * 110) * big, roof = Math.floor(r() * 3); ROW.push({ x, w, h, roof, col: WALLS[ROW.length % 3], id: ROW.length }); x += w; }
  ROW.push({ x: tx - 31 * big, w: 62 * big, h: 250 * big, roof: 3, col: WALLS[1], id: 999 });
  const LAMPS = []; for (let lx = 110 * big; lx < W - 40; lx += 250 * big) LAMPS.push(lx);
  const depth = H - WY;
  const BOATS = [[0.2, 0.22, 1.05, 0], [0.56 - 0.06 * tall, 0.46, 1.45, 1], [0.84, 0.2, 0.95, 2]].map(([fx, fy, s, i]) => ({ x: fx * W, y: WY + fy * depth, s: s * big, i }));
  const POOL = clamp(Math.round(depth / 50), 5, 11);
  const band = (j) => { const u = j / POOL; return { u, y0: WY + 12 + Math.pow(u, 1.3) * depth * 0.9, lam: 170 + 260 * u, amp: 2 + 6 * u }; };
  // two strings of lanterns across the top: [x0, y0, x1, y1, sag, how many]
  const STRINGS = [[-40, H * 0.1, W * 0.56, -30, H * 0.09, Math.max(3, Math.round(W * 0.6 / (170 * big)))], [W * 0.44, -40, W + 40, H * 0.13, H * 0.1, Math.max(3, Math.round(W * 0.6 / (170 * big)))]];
  const pier = { x1: W * (0.46 + 0.1 * tall), y: H * 0.89 };
  return { W, H, WY, tall, big, MOON, STARS, hillY, HILL, ROW, LAMPS, BOATS, POOL, band, STRINGS, pier };
}

// which lit windows are on changes now and then, each on its own slow timer
const lit = (id, t, share = 0.45) => hash(id, Math.floor(t / (45 + 70 * hash(id, 5)) + hash(id, 6))) < share;

function lantern(ctx, x, y, s, a, kind, glow) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 16 * s); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.stroke();
  F(ctx, (c) => el(c, 0, 44 * s, 23 * s, 28 * s), kind ? C.orange : C.gold);
  F(ctx, (c) => el(c, 0, 44 * s, (11 + 3 * glow) * s, (18 + 3 * glow) * s), kind ? C.gold : C.cream);
  F(ctx, (c) => { c.rect(-10 * s, 13 * s, 20 * s, 7 * s); c.rect(-10 * s, 68 * s, 20 * s, 7 * s); c.rect(-1.5 * s, 75 * s, 3 * s, 16 * s); }, C.ink);
  ctx.restore();
}

function boat(ctx, b, p, t) {
  const bob = 4 * osc(p, 5 + b.i, b.i * 0.3), tilt = 0.045 * osc(p, 4 + b.i, b.i * 0.21);
  ctx.save(); ctx.translate(b.x, b.y + bob); ctx.scale(b.s, b.s);
  // its lantern in the water, before the hull
  for (let k = 0; k < 5; k++) { const w = (30 - k * 4) * (0.6 + 0.4 * osc(p, 6 + k, b.i * 0.4 + k * 0.2)); F(ctx, (c) => pill(c, 4 * osc(p, 5, k * 0.3) - w / 2 + 8, 26 + k * 15, w, 7), C.gold); }
  ctx.rotate(tilt);
  F(ctx, (c) => { poly(c, [[-76, -8], [86, -8], [62, 18], [-62, 18]]); c.rect(-3, -150, 6, 144); c.rect(-52, -52, 52, 5); }, C.ink);
  F(ctx, (c) => c.rect(-73, -8, 156, 8), C.cream); F(ctx, (c) => c.rect(-34, -38, 46, 30), C.rust);
  if (b.i === 1) F(ctx, (c) => poly(c, [[-50, -56], [-6, -56], [-6, -140]]), C.cream);
  F(ctx, (c) => c.rect(-24, -30, 14, 13), C.gold);
  // pennant
  F(ctx, (c) => { const f = Math.sin(t * 3 + b.i); c.moveTo(3, -150); c.quadraticCurveTo(16, -152 + 4 * f, 30, -143 - 3 * f); c.quadraticCurveTo(16, -140 + 3 * f, 3, -138); c.closePath(); }, C.orange);
  // the lantern swings from the boom
  const sw = 0.25 * osc(p, 7 + b.i, b.i * 0.5) - tilt * 2;
  ctx.translate(20, -112); ctx.rotate(sw);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 20); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke();
  F(ctx, (c) => circle(c, 0, 30, 12), C.orange); F(ctx, (c) => circle(c, 0, 30, 7), C.gold);
  ctx.restore();
}

export function paint(ctx, p, t, G) {
  const { W, H, WY, MOON, big } = G, mx = MOON.x + sway(p, 0.03), my = MOON.y + 8 * Math.sin((TAU * t) / 360);
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  ctx.fillStyle = C.navy; ctx.fillRect(0, 0, W, H);
  F(ctx, (c) => circle(c, mx, my, 560), C.deep); F(ctx, (c) => circle(c, mx, my, 330), C.teal);
  paintStars(ctx, G.STARS, p);
  meteor(ctx, t, W, WY * 0.7, 16, 9);
  crescent(ctx, mx, my, MOON.r, C.gold);
  bars(ctx, CLOUDS, W, t, (y) => y * WY);

  // the hill and its cottages
  layer(0.12, () => {
    F(ctx, (c) => { c.moveTo(-80, WY); for (let x = -80; x <= W + 80; x += 10) c.lineTo(x, G.hillY(x)); c.lineTo(W + 80, WY); c.closePath(); }, '#17506b');
    F(ctx, (c) => { for (const h of G.HILL) { c.rect(h.x, h.y - h.h, h.w, h.h); poly(c, [[h.x - 4, h.y - h.h], [h.x + h.w + 4, h.y - h.h], [h.x + h.w / 2, h.y - h.h - h.w * 0.4]]); } }, C.blue);
    F(ctx, (c) => { for (const h of G.HILL) if (h.lit && lit(h.id + 900, t, 0.7)) c.rect(h.x + h.w * 0.3, h.y - h.h * 0.7, 7, 8); }, C.gold);
  });

  ctx.depthLayer?.('quay');
  // the quay: houses shoulder to shoulder, the clock tower, lamps along the wall
  layer(0.25, () => {
    for (const b of G.ROW) {
      const { x, w, h } = b, y = WY, top = y - h;
      F(ctx, (c) => {
        c.rect(x, top, w + 1, h);
        if (b.roof === 0) poly(c, [[x - 5, top], [x + w + 5, top], [x + w / 2, top - w * 0.42]]);
        else if (b.roof === 1) { c.rect(x + w * 0.15, top - 14 * big, w * 0.7, 14 * big); c.rect(x + w * 0.33, top - 26 * big, w * 0.34, 12 * big); }
        else if (b.roof === 3) { poly(c, [[x - 6, top], [x + w + 6, top], [x + w / 2, top - 110 * big]]); c.rect(x + w / 2 - 2, top - 132 * big, 4, 24 * big); }
        else c.rect(x + w * 0.62, top - 22 * big, 14 * big, 22 * big);
      }, b.col);
      if (b.roof === 3) {
        const cx = x + w / 2, cy = top + 44 * big, rr = 19 * big, hand = (a, l, wd) => { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(a) * l, cy - Math.cos(a) * l); ctx.strokeStyle = C.ink; ctx.lineWidth = wd; ctx.lineCap = 'round'; ctx.stroke(); };
        F(ctx, (c) => circle(c, cx, cy, rr), C.cream); hand((TAU * t) / 3600 + 5.2, rr * 0.5, 4); hand((TAU * t) / 300, rr * 0.78, 3);
        F(ctx, (c) => { for (let k = 0; k < 3; k++) c.rect(cx - 5 * big, cy + (50 + k * 46) * big, 10 * big, 18 * big); }, lit(b.id * 64, t, 0.8) ? C.gold : C.navy);
        continue;
      }
      const cols = Math.max(1, Math.floor((w - 16 * big) / (28 * big))), rows = Math.max(1, Math.floor((h - 34 * big) / (36 * big))), x0 = x + (w - cols * 28 * big + 14 * big) / 2;
      for (const [share, fill] of [[1, C.navy], [0.45, C.gold]]) F(ctx, (c) => { for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const id = b.id * 64 + i * 8 + j; if (share === 1 || lit(id, t)) c.rect(x0 + i * 28 * big, top + (16 + j * 36) * big, 14 * big, 19 * big); } }, fill);
    }
    F(ctx, (c) => { c.rect(-80, WY - 8, W + 160, 24); for (const lx of G.LAMPS) { c.rect(lx - 2.5, WY - 78 * big, 5, 72 * big); c.rect(lx - 9, WY - 84 * big, 18, 5); } }, C.ink);
    F(ctx, (c) => { for (const lx of G.LAMPS) circle(c, lx, WY - 94 * big, 12 * big); }, C.orange);
    F(ctx, (c) => { for (const lx of G.LAMPS) circle(c, lx, WY - 94 * big, 7 * big); }, C.gold);
  });

  ctx.depthLayer?.('water');
  // the harbor: slow bands, each quay lamp drawn out down the water
  layer(0.4, () => {
    for (let j = 0; j < G.POOL; j++) {
      const b = G.band(j), s = 1.4 * p * b.lam + j * 71, e = [];
      for (let x = -160; x <= W + 160; x += 10) e.push([x, b.y0 - (j ? b.amp * Math.sin(((x - s) / b.lam) * TAU) + 2 * osc(p, 4 + (j % 3), j * 0.17) : 0)]);
      F(ctx, (c) => { c.moveTo(e[0][0], e[0][1]); for (const q of e) c.lineTo(q[0], q[1]); c.lineTo(W + 160, H + 60); c.lineTo(-160, H + 60); c.closePath(); }, j % 3 === 2 ? C.teal : j % 2 ? C.navy : C.deep);
      if (!j) continue;
      ctx.save(); ctx.beginPath(); ctx.moveTo(e[0][0], e[0][1] + 6); for (const q of e) ctx.lineTo(q[0], q[1] + 6 + 5 * b.u);
      ctx.strokeStyle = C.cream; ctx.lineWidth = 2 + 2.5 * b.u; ctx.lineCap = 'round'; ctx.setLineDash([b.lam * 0.2, b.lam * 0.8]); ctx.lineDashOffset = -s + 160; ctx.stroke(); ctx.restore();
    }
    F(ctx, (c) => { G.LAMPS.forEach((lx, i) => { for (let k = 0; k < 7; k++) { const w = (30 - k * 2.6) * big * (0.55 + 0.45 * osc(p, 5 + (k % 4), i * 0.37 + k * 0.21)); pill(c, lx - sway(p, 0.15) + 5 * osc(p, 4, k * 0.3 + i) - w / 2, WY + 26 + k * (17 + k * 2) * big, w, 7 * big); } }); }, C.gold);
    // a fish rises now and then and leaves rings
    { const n = Math.floor(t / 11), q = mulberry(n * 6151 + 2), go = q() < 0.7, u = (t - (n * 11 + 1 + q() * 5)) / 4.5, fx = W * (0.15 + 0.7 * q()), fy = WY + (H - WY) * (0.3 + 0.4 * q());
      if (go && u >= 0 && u <= 1) { ctx.strokeStyle = C.cream; for (let i = 0; i < 2; i++) { const v = u - i * 0.18; if (v <= 0) continue; ctx.lineWidth = Math.max(0.5, 5 * (1 - v)); ctx.beginPath(); el(ctx, fx, fy, 10 + v * 110 * big, (10 + v * 110 * big) * 0.2); ctx.stroke(); } } }
  });
  for (const b of G.BOATS) layer(0.45 + 0.1 * b.i, () => boat(ctx, b, p, t));

  ctx.depthLayer?.('pier');
  // the pier in the near corner, with a lantern on its tallest post
  layer(0.9, () => {
    const { x1, y } = G.pier, posts = [[0.08, 150], [0.42, 96], [0.74, 190], [0.97, 84]].map(([f, h]) => [lerp(-40, x1, f), lerp(y, y + 26, f), h * big]);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath();
    for (let i = 0; i < posts.length - 1; i++) { const [ax, ay, ah] = posts[i], [bx, by, bh] = posts[i + 1]; ctx.moveTo(ax, ay - ah + 16); ctx.quadraticCurveTo((ax + bx) / 2, Math.max(ay - ah, by - bh) + 80 * big + 5 * osc(p, 3, i * 0.3), bx, by - bh + 16); }
    ctx.stroke();
    F(ctx, (c) => { poly(c, [[-90, y - 6], [x1, y + 20], [x1 + 70 * big, H + 80], [-90, H + 80]]); for (const [px, py, ph] of posts) { c.rect(px - 11 * big, py - ph, 22 * big, ph + 20); } }, C.ink);
    F(ctx, (c) => { for (const [px, py, ph] of posts) pill(c, px - 14 * big, py - ph - 6, 28 * big, 12); }, C.deep);
    ctx.save(); ctx.strokeStyle = C.deep; ctx.lineWidth = 4; ctx.beginPath(); for (let k = 1; k < 6; k++) { const f = k / 6; ctx.moveTo(lerp(-90, x1, f) - 20, lerp(y, y + 20, f) + 16); ctx.lineTo(lerp(-90, x1 + 70 * big, f) + 10, H + 80); } ctx.stroke(); ctx.restore();
    const [px, py, ph] = posts[2];
    F(ctx, (c) => { c.rect(px, py - ph + 22, 54 * big, 6); }, C.ink);
    lantern(ctx, px + 50 * big, py - ph + 26, 1.25 * big, 0.14 * osc(p, 5, 0.2) + 0.05 * osc(p, 11, 0.6), 1, 0.5 + 0.5 * Math.sin(t * 4.1) * Math.sin(t * 2.3));
  });

  ctx.depthLayer?.('lanterns');
  // lanterns strung across the top; the strings lift and settle and every lantern swings on its own
  G.STRINGS.forEach(([ax, ay, bx, by, sag, n], si) => {
    const at = (u) => [lerp(ax, bx, u) + 8 * osc(p, 2, si * 0.4) * Math.sin(Math.PI * u), lerp(ay, by, u) + (sag + 7 * osc(p, 3, si * 0.3)) * 4 * u * (1 - u)];
    ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const q = at(i / 30); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke();
    for (let i = 0; i < n; i++) { const q = at((i + 0.5 + 0.2 * (si ? -1 : 1)) / n), id = si * 10 + i; lantern(ctx, q[0], q[1], (0.95 + 0.25 * hash(id, 1)) * big, 0.16 * osc(p, 4 + (id % 4), id * 0.17) + 0.05 * osc(p, 11, id * 0.4), id % 2, 0.5 + 0.5 * Math.sin(t * (3 + hash(id, 2) * 2) + id)); }
  });
}
