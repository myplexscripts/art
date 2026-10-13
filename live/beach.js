// Nocturne Series No. 01: Moonpath. Geometry lives in geom.js; this paints it in the poster inks.
import { makeScene, circle, pill, star4, poly, edge, shapes, osc, sway, mulberry, frac, TAU } from './geom.js?v=20261013-after-hours';
import { C, F } from './kit.js?v=20261013-after-hours';

export const title = 'MOONPATH', no = 'No. 01', text = C.navy, dark = C.ink;
export const make = makeScene;

// cloud bars: [starting x as a share of the width, y as a share of the sky, width, height, color, drift in units per second]
const BARS = [[0.08, 0.34, 470, 30, C.deep, 9], [0.14, 0.4, 300, 24, C.deep, 9], [0.65, 0.15, 380, 28, C.deep, 6], [0.33, 0.62, 330, 24, C.blue, 13], [0.38, 0.67, 180, 18, C.blue, 13]];
const seaColor = (j) => (j % 2 ? C.deep : j && j % 4 === 0 ? C.blue : C.teal);

// A shooting star now and then: time is cut into 14 s slots and a little over half of them get one, placed by the slot's own seed.
function meteor(ctx, t, W, HY) {
  const n = Math.floor(t / 14), r = mulberry(n * 7919 + 3);
  if (r() > 0.55) return;
  const u = (t - (n * 14 + 1 + r() * 10)) / 0.9;
  const x0 = W * (0.1 + 0.8 * r()), y0 = HY * (0.05 + 0.35 * r()), a = 0.35 + 0.5 * r(), dx = Math.cos(a) * (r() < 0.5 ? -1 : 1), dy = Math.sin(a);
  if (u < 0 || u > 1) return;
  const head = u * 420, tail = Math.max(0, head - 170 * Math.sin(Math.PI * u));
  const hx = x0 + dx * head, hy = y0 + dy * head;
  F(ctx, (c) => { c.moveTo(x0 + dx * tail, y0 + dy * tail); c.lineTo(hx - dy * 3, hy + dx * 3); c.lineTo(hx + dy * 3, hy - dx * 3); c.closePath(); }, C.cream);
}

// A small sailboat that crosses the horizon left to right and comes round again.
function boat(ctx, x, y, tilt) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt);
  F(ctx, (c) => poly(c, [[-26, -2], [26, -2], [18, 9], [-18, 9]]), C.ink);
  F(ctx, (c) => { poly(c, [[1, -6], [1, -54], [27, -6]]); poly(c, [[-3, -8], [-3, -42], [-22, -8]]); }, C.cream);
  ctx.restore();
}

// p is time in 30 s units, unwrapped (waves, foam, palm, grass, stars); t is the same clock in seconds,
// for the things that never repeat on that cycle (clouds, lighthouse sweep, moon, boat, shooting stars).
export function paint(ctx, p, t, G) {
  const { W, H, HY, MOON } = G;
  const [mx, my] = G.moonPos(p, t);
  ctx.fillStyle = C.navy; ctx.fillRect(0, 0, W, H);
  F(ctx, (c) => circle(c, mx, my, 700), C.deep); F(ctx, (c) => circle(c, mx, my, 470), C.teal); F(ctx, (c) => circle(c, mx, my, 255), C.blue);
  for (let i = 0; i < G.STARS.length; i += 3) { const s = G.STARS[i]; F(ctx, (c) => star4(c, s.x, s.y, (3 + s.s * 2.2) * (0.7 + 0.3 * G.starA(s, p))), C.cream); }
  meteor(ctx, t, W, HY);
  F(ctx, (c) => circle(c, mx, my, MOON.r), C.gold);
  BARS.forEach(([fx, fy, w, h, col, v]) => {
    // clouds cross the sky and come back in from the left
    const bw = Math.min(w, W * 0.42), span = W + bw + 160, x = frac(fx + (v * t) / 1800) * span - bw - 80;
    F(ctx, (c) => pill(c, x + sway(p, 0.08), fy * HY, bw, h), col);
  });
  F(ctx, (c) => G.headland(c, p, G.HF), C.blue);
  const lh = G.lighthouse(p);
  // the lamp turns once every 13 s: seen side-on, the beam swings out one way, shortens as it points at us (a flash), and swings out the other
  const th = (TAU * t) / 13, cs = Math.cos(th), sn = Math.sin(th), acs = Math.abs(cs);
  F(ctx, (c) => { const [x, y] = lh.light, r = Math.min(560, W * 0.4) * cs, k = (10 + 26 * Math.abs(sn)) * Math.min(1, acs * 3); c.moveTo(x, y); c.lineTo(x + r, y - k); c.lineTo(x + r, y + k); c.closePath(); }, C.gold);
  if (sn > 0 && acs < 0.3) F(ctx, (c) => circle(c, lh.light[0], lh.light[1], 8 + 34 * (1 - acs / 0.3)), C.gold);
  F(ctx, (c) => poly(c, lh.tower), C.cream); F(ctx, (c) => poly(c, lh.lamp), C.gold); F(ctx, (c) => poly(c, lh.roof), C.orange);
  F(ctx, (c) => G.headland(c, p, G.HN), C.ink);
  ctx.depthLayer?.('water');
  for (let j = 0; j < G.BANDS; j++) {
    const e = G.seaEdge(p, j, shapes.sine), b = G.bandInfo(j);
    F(ctx, (c) => { edge(c, e); c.lineTo(W + 90, H + 60); c.lineTo(-90, H + 60); c.closePath(); }, seaColor(j));
    if (j === 1) { const span = W + 300; boat(ctx, frac(0.25 + t / 130) * span - 150 + sway(p, b.d), b.y0 + 2 + 2 * osc(p, 5), 0.05 * osc(p, 7)); }
    if (j < 2) continue;
    ctx.save(); ctx.beginPath(); edge(ctx, e, 5 + 6 * b.t); ctx.strokeStyle = C.cream; ctx.lineWidth = 2 + 3 * b.t; ctx.lineCap = 'round';
    ctx.setLineDash([b.lam * 0.3, b.lam * 0.7]); ctx.lineDashOffset = -G.bandShift(p, j) - b.lam * 0.1 + 90; ctx.stroke(); ctx.restore();
  }
  for (let k = 0; k < G.GLINTS.length; k += 2) { const q = G.glint(G.GLINTS[k], p, mx), w = q.w * (0.5 + 0.9 * q.a); F(ctx, (c) => pill(c, q.x - w / 2, q.y - 4, w, 8), C.gold); }
  ctx.depthLayer?.('shore');
  F(ctx, (c) => G.foam(c, p), C.cream); F(ctx, (c) => G.wet(c, p), C.rust); F(ctx, (c) => G.sand(c, p), C.orange);
  F(ctx, (c) => G.grass(c, p), C.ink);
  ctx.depthLayer?.('palm');
  const P = G.palm(p);
  F(ctx, (c) => { poly(c, P.trunk); G.palmFronds(c, P); }, C.ink);
}
