// Orbit Series No. 01: Earthrise. The grey Moon in the foreground in five layers, lightest at the horizon and darkest
// near, with craters, boulders and a lander whose dish turns; a half-lit Earth hangs over it inside flat glow rings and
// turns under its night side. Earth's continents and clouds sit on endless strips of longitude, squeezed toward the
// limb, so the globe turns and never shows the same face twice.
import { mulberry, lerp, clamp, sway, noise1, poly, circle, pill, star4, TAU } from './geom.js?v=20261011-dreamscapes-motion';
import { C, F } from './kit.js?v=20261011-dreamscapes-motion';
import { hash, el, makeStars, paintStars } from './bits.js?v=20261011-dreamscapes-motion';

export const title = 'EARTHRISE', no = 'No. 01', text = '#141a33', dark = '#06081a';
const E = { sky: '#070a1e', r1: '#0c1330', r2: '#131d44', r3: '#1c2c5c', sea: C.blue, sea2: '#1f5f86', land: '#86a56c', night: '#0b1838', hi: '#d6dbe3', g1: '#b4bcc8', g2: '#8b94a6', g3: '#626c82', g4: '#3e465c', g5: '#252b40', ink: '#10142a' };
const nA = noise1(1201), nB = noise1(1213), nC = noise1(1229);
const SURF = [E.g1, E.g2, E.g3, E.g4], LIT = [E.hi, E.g1, E.g2, E.g3], SHADE = [E.g2, E.g3, E.g4, E.g5], DEPTH = [0.08, 0.18, 0.32, 0.55];

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall;
  const HY = Math.round(H * (0.64 - 0.04 * tall)), D = H - HY;
  const R = clamp(HY * 0.3, 150, 260);
  const EARTH = { x: W * (0.66 - 0.1 * tall), y: Math.max(R * 1.42, lerp(HY * 0.5, HY - R * 1.6, 0.6)), R };
  const STARS = makeStars(71, clamp(Math.round((W * HY) / 5200), 150, 380), W, HY);
  // the top edge of each layer of ground, far to near; the last is the dark rise at the bottom of the frame
  const tops = [
    (x) => HY - H * 0.012 - H * 0.055 * Math.pow(0.5 + 0.5 * nA(x / 330), 2) - 5 * nA(x / 55),
    (x) => HY + D * 0.14 + 16 * nB(x / 300),
    (x) => HY + D * 0.34 + 22 * nB(x / 260 + 9),
    (x) => HY + D * 0.58 + 28 * nB(x / 230 + 21),
    (x) => H - D * 0.09 - D * 0.14 * Math.pow(Math.abs((2 * x) / W - 1), 2) - 26 * Math.abs(nC(x / 90)),
  ];
  // crater and boulder i of layer j take their numbers from hash(i, ...) alone, so a change of size only slides them
  // and adds or drops the last of a layer
  const CRATERS = [0, 1, 2, 3].map((j) => Array.from({ length: Math.round(W / 300) + 2 }, (_, i) => {
    const x = hash(i, 100 + j) * W, rx = (26 + 70 * hash(i, 110 + j) * hash(i, 120 + j)) * (0.55 + 0.5 * j) * big, ry = rx * (0.16 + 0.05 * j);
    return { x, y: lerp(tops[j](x) + ry * 1.6 + 6, tops[j + 1](x) + ry, hash(i, 130 + j)), rx, ry };
  }));
  const ROCKS = [0, 1, 2, 3].map((j) => Array.from({ length: j ? Math.round(W / 420) + 1 : 0 }, (_, i) => {
    const x = hash(i, 140 + j) * W, w = (10 + 22 * hash(i, 150 + j)) * (0.5 + 0.5 * j) * big;
    return { x, y: lerp(tops[j](x) + 10, tops[j + 1](x), hash(i, 160 + j)), w, h: w * (0.6 + 0.5 * hash(i, 170 + j)) };
  }));
  const lx = W * (0.27 + 0.08 * tall);
  const LANDER = { x: lx, y: lerp(tops[1](lx), tops[2](lx), 0.5), s: 0.95 * big };
  return { W, H, HY, tall, big, EARTH, STARS, tops, CRATERS, ROCKS, LANDER };
}

// the unlit part of a disc: the half away from the sun, less (k > 0) or more (k < 0) by half an ellipse
const night = (c, R, k) => { c.moveTo(0, -R - 2); c.arc(0, 0, R + 2, -Math.PI / 2, Math.PI / 2); c.ellipse(0, 0, Math.abs(k) * R, R + 2, 0, Math.PI / 2, -Math.PI / 2, k > 0); c.closePath(); };

function earth(ctx, x, y, R, t) {
  ctx.save(); ctx.translate(x, y); ctx.beginPath(); circle(ctx, 0, 0, R); ctx.clip();
  ctx.fillStyle = E.sea; ctx.fillRect(-R, -R, 2 * R, 2 * R);
  ctx.save(); ctx.rotate(-0.32);                                  // the axis leans
  F(ctx, (c) => { c.rect(-R, -R * 0.36, 2 * R, R * 0.2); c.rect(-R, R * 0.3, 2 * R, R * 0.16); }, E.sea2);
  // everything on the globe sits at a longitude along an endless strip; only the half facing us is drawn
  const strip = (spin, step, fn) => { for (let i = Math.floor((spin - 1.9) / step); i <= Math.ceil((spin + 1.9) / step); i++) fn(i, i * step - spin); };
  F(ctx, (c) => strip(t * 0.021, 1.25, (i, lon) => {
    for (let k = 0; k < 5; k++) {
      const l = lon + (hash(i, k) - 0.5) * 0.8, lat = (hash(i, 9) - 0.5) * 1.3 + (hash(i, 10 + k) - 0.5) * 0.7, cl = Math.cos(l);
      if (cl > 0.08) el(c, R * Math.sin(l) * Math.cos(lat), -R * Math.sin(lat), R * (0.09 + 0.17 * hash(i, 20 + k)) * cl, R * (0.07 + 0.16 * hash(i, 30 + k)));
    }
  }), E.land);
  F(ctx, (c) => {
    el(c, 0, -R, R * 0.5, R * 0.1); el(c, 0, R, R * 0.56, R * 0.13);
    strip(t * 0.03 + 5, 0.5, (i, lon) => {
      const lat = (hash(i, 1) - 0.5) * 1.7, cl = Math.cos(lon), w = R * (0.28 + 0.4 * hash(i, 2)) * cl * Math.cos(lat), h = R * (0.04 + 0.03 * hash(i, 3));
      if (cl > 0.12 && w > h) pill(c, R * Math.sin(lon) * Math.cos(lat) - w / 2, -R * Math.sin(lat) - h / 2, w, h);
    });
  }, C.cream);
  ctx.restore();
  ctx.rotate(0.6); F(ctx, (c) => night(c, R, 0.12 + 0.1 * Math.sin(t / 190)), E.night);
  ctx.restore();
}

function lander(ctx, t, p, shade) {
  F(ctx, (c) => el(c, 78, 3, 130, 8), shade);                     // its hard shadow, thrown away from the sun
  ctx.strokeStyle = E.ink; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath();
  for (const sd of [-1, 1]) { ctx.moveTo(sd * 40, -58); ctx.lineTo(sd * 80, -2); ctx.moveTo(sd * 44, -30); ctx.lineTo(sd * 71, -14); }
  ctx.moveTo(0, -50); ctx.lineTo(0, -2); ctx.stroke();
  F(ctx, (c) => { for (const fx of [-80, 0, 80]) pill(c, fx - 13, -4, 26, 7); poly(c, [[-12, -50], [12, -50], [18, -28], [-18, -28]]); c.rect(24, -178, 3, 38); c.rect(-20, -156, 3, 16); }, E.ink);
  F(ctx, (c) => poly(c, [[-50, -50], [-58, -66], [-50, -92], [50, -92], [58, -66], [50, -50]]), C.gold);
  F(ctx, (c) => poly(c, [[8, -50], [8, -92], [50, -92], [58, -66], [50, -50]]), '#c9933a');
  F(ctx, (c) => c.rect(-57, -70, 114, 5), C.orange);
  F(ctx, (c) => poly(c, [[-34, -92], [-42, -114], [-28, -142], [28, -142], [42, -114], [34, -92]]), C.cream);
  F(ctx, (c) => poly(c, [[6, -92], [6, -142], [28, -142], [42, -114], [34, -92]]), '#c5b894');
  F(ctx, (c) => { poly(c, [[-30, -116], [-12, -116], [-16, -130], [-26, -130]]); c.rect(-8, -110, 14, 18); }, E.ink);
  // the dish turns about its post: wide when it faces us, a sliver edge on, darker from behind
  const a = t * 0.22, ca = Math.cos(a);
  F(ctx, (c) => el(c, -18, -170, 3 + 17 * Math.abs(ca), 20), ca > 0 ? C.cream : '#c5b894');
  if (ca > 0) F(ctx, (c) => circle(c, -18 + 13 * Math.sin(a), -170, 3.5), C.gold);
  // the beacon swells and dies every few seconds
  const on = Math.pow(Math.max(0, Math.sin(t * 1.9)), 6);
  F(ctx, (c) => circle(c, 25.5, -180, 4 + 5 * on), on > 0.3 ? C.gold : C.orange);
}

export function paint(ctx, p, t, G) {
  const { W, H, HY, big, EARTH, tops } = G, R = EARTH.R;
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  const ex = EARTH.x + sway(p, 0.03), ey = EARTH.y - R * 0.28 * Math.sin((TAU * t) / 540);
  ctx.fillStyle = E.sky; ctx.fillRect(0, 0, W, H);
  F(ctx, (c) => circle(c, ex, ey, R * 3.3), E.r1); F(ctx, (c) => circle(c, ex, ey, R * 2.3), E.r2); F(ctx, (c) => circle(c, ex, ey, R * 1.5), E.r3);
  paintStars(ctx, G.STARS, p);

  // an orbiter crosses now and then: a point of light on a shallow arc
  { const slot = 48, n = Math.floor(t / slot), q = mulberry(n * 6007 + 2), go = q() < 0.8, dir = q() < 0.5 ? -1 : 1, u = (t - n * slot - 2 - q() * 8) / 34, y0 = HY * (0.1 + 0.35 * q());
    if (go && u >= 0 && u <= 1) { const x = dir > 0 ? -30 + u * (W + 60) : W + 30 - u * (W + 60), y = y0 - HY * 0.07 * Math.sin(Math.PI * u); F(ctx, (c) => star4(c, x, y, 7 * big), C.gold); F(ctx, (c) => circle(c, x, y, 2.6 * big), C.cream); } }

  ctx.depthLayer?.('earth');
  earth(ctx, ex, ey, R, t);

  ctx.depthLayer?.('ground');
  // the ground, far to near: each layer carries its own craters and boulders
  const ground = (j, fill) => F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 10) c.lineTo(x, tops[j](x)); c.lineTo(W + 90, H + 60); c.closePath(); }, fill);
  for (let j = 0; j < 4; j++) layer(DEPTH[j], () => {
    if (j === 2) ctx.depthLayer?.('near');
    ground(j, SURF[j]);
    F(ctx, (c) => { for (const q of G.CRATERS[j]) el(c, q.x, q.y, q.rx, q.ry); }, LIT[j]);
    F(ctx, (c) => {
      for (const q of G.CRATERS[j]) el(c, q.x - q.rx * 0.05, q.y + q.ry * 0.14, q.rx * 0.86, q.ry * 0.7);
      for (const b of G.ROCKS[j]) { poly(c, [[b.x - b.w * 0.3, b.y + b.w * 0.02], [b.x + b.w * 0.55, b.y - b.w * 0.02], [b.x + b.w * 2.6, b.y + b.w * 0.12], [b.x + b.w * 2.1, b.y + b.w * 0.24], [b.x, b.y + b.w * 0.16]]); poly(c, [[b.x + b.w * 0.1, b.y + 2], [b.x + b.w * 0.02, b.y - b.h], [b.x + b.w * 0.42, b.y - b.h * 0.62], [b.x + b.w * 0.56, b.y + 2]]); }
    }, SHADE[j]);
    F(ctx, (c) => { for (const b of G.ROCKS[j]) poly(c, [[b.x - b.w * 0.5, b.y + 2], [b.x - b.w * 0.36, b.y - b.h * 0.6], [b.x + b.w * 0.02, b.y - b.h], [b.x + b.w * 0.1, b.y + 2]]); }, LIT[j]);
    if (j !== 1) return;
    ctx.depthLayer?.('lander');
    const { x, y, s } = G.LANDER;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    lander(ctx, t, p, SHADE[1]);
    // dust jumps up near the lander now and then and falls back in low arcs, with no air to hold it
    { const slot = 7, n = Math.floor(t / slot), q = mulberry(n * 4513 + 9), go = q() < 0.75, a = t - n * slot - q() * 2, ox = (q() - 0.5) * 300, dir = q() < 0.5 ? -1 : 1;
      if (go && a > 0 && a < 4.6) F(ctx, (c) => { for (let k = 0; k < 16; k++) { const v = 26 + 46 * hash(k, n), ang = 0.35 + 0.75 * hash(k, n + 7), dx = ox + dir * v * Math.cos(ang) * a, dy = v * Math.sin(ang) * a - 13 * a * a; if (dy > 0) circle(c, dx, -dy - 2, (2 + 3 * hash(k, 3)) * (1 - a / 9)); } }, E.hi); }
    ctx.restore();
  });
  layer(0.9, () => {
    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 9) c.lineTo(x, tops[4](x)); c.lineTo(W + 90, H + 60); c.closePath(); }, E.g5);
    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 9) c.lineTo(x, tops[4](x) + 7 + 16 * Math.abs(nC(x / 31 + 4))); c.lineTo(W + 90, H + 60); c.closePath(); }, E.ink);
  });
}
