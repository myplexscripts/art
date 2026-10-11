// Orbit Series No. 02: Ringed Giant. Seen from an icy moon: a tilted ringed planet in flat glow rings, its cloud bands
// sliding at their own speeds and a great oval storm going round. Everything about the planet is drawn in a frame
// turned to the ring plane, in order: moons behind, the back half of the rings, the disc, the front half, moons in front.
// In the foreground, jagged ice ridges and a geyser that vents in bursts.
import { mulberry, clamp, osc, sway, noise1, circle, star4, TAU } from './geom.js?v=20261011-dreamscapes-motion';
import { C, F } from './kit.js?v=20261011-dreamscapes-motion';
import { hash, el, makeStars, paintStars } from './bits.js?v=20261011-dreamscapes-motion';

export const title = 'RINGED GIANT', no = 'No. 02', text = '#161a44', dark = '#070920';
const A = { sky: '#0a0c26', r1: '#10153c', r2: '#192052', butter: '#e0a458', tan: '#c08a52', brown: '#96623e', night: '#1b1436', ringB: '#d9b98a', shadow: '#4a3348', i1: '#c6e4ec', i2: '#8fbdd2', i3: '#5a8cb0', i4: '#2c4f7c', ink: '#0c1430' };
const nG = noise1(1301), nI = noise1(1319);
const TILT = -0.32, FLAT = 0.3, SUN = 0.45;                     // the ring plane's lean and squash; which way shadows fall in it
// rings as [inner, outer, ink] in planet radii, with gaps between
const RINGS = [[1.24, 1.5, A.ringB], [1.55, 1.92, C.cream], [1.98, 2.1, C.gold], [2.15, 2.3, A.ringB]];
// cloud bands as [top, bottom, ink, units per second, wavelength] in shares of the radius
const BANDS = [[-1.1, -0.74, A.tan, 5, 150], [-0.6, -0.42, C.cream, -9, 210], [-0.3, -0.1, A.tan, 14, 180], [-0.1, 0.0, A.brown, 14, 180], [0.14, 0.42, C.cream, -7, 240], [0.52, 0.66, A.brown, 11, 160], [0.66, 0.8, A.tan, 11, 160], [0.9, 1.1, A.brown, -4, 130]];
// moons as [orbit in planet radii, seconds per turn, phase, size, ink]
const MOONS = [[2.75, 380, 0.08, 9, C.cream], [3.3, 640, 0.55, 14, A.i1], [4.1, 1100, 0.8, 7, C.gold]];

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall;
  const HY = Math.round(H * (0.72 - 0.05 * tall));
  const R = clamp(Math.min(W * (0.2 + 0.07 * tall), HY * 0.34), 170, 340);
  const P = { x: W * (0.6 - 0.08 * tall), y: Math.max(R * 1.5, HY * 0.46), R };
  const STARS = makeStars(72, clamp(Math.round((W * HY) / 5200), 150, 380), W, HY);
  // ice ridges: straight runs between points set by a hash, so they come out jagged
  const jag = (step, k) => (x) => { const i = Math.floor(x / step), f = x / step - i; return hash(i, k) * (1 - f) + hash(i + 1, k) * f; };
  const j1 = jag(34, 1), j2 = jag(52, 2), j3 = jag(70, 3), D = H - HY;
  const tops = [
    (x) => HY - H * 0.008 - H * 0.085 * j1(x) * (0.25 + 0.75 * Math.abs(nI(x / 300))),
    (x) => HY + D * 0.3 - D * 0.34 * j2(x) * (0.25 + 0.75 * Math.abs(nI(x / 380 + 7))),
    (x) => H - D * 0.06 - D * 0.2 * Math.pow(Math.abs((2 * x) / W - 1), 1.6) - D * 0.3 * j3(x) * (0.3 + 0.7 * Math.abs(nI(x / 260 + 19))),
  ];
  const gx = W * (0.2 + 0.06 * tall);
  const GEYSER = { x: gx, y: tops[1](gx) + 8, s: big };
  const r = mulberry(1307);
  const GLINTS = Array.from({ length: Math.round(W / 110) }, () => { const x = r() * W; return { x, y: HY + D * (0.04 + 0.5 * r()), c: [4, 5, 7][Math.floor(r() * 3)], ph: r() }; });
  return { W, H, HY, tall, big, P, STARS, tops, GEYSER, GLINTS };
}

const night = (c, R, k) => { c.moveTo(0, -R - 2); c.arc(0, 0, R + 2, -Math.PI / 2, Math.PI / 2); c.ellipse(0, 0, Math.abs(k) * R, R + 2, 0, Math.PI / 2, -Math.PI / 2, k > 0); c.closePath(); };

// half of every ring, behind the planet or in front, with the planet's shadow lying across it
function ringHalf(ctx, R, front) {
  const a0 = front ? 0 : Math.PI, a1 = a0 + Math.PI, half = (c, ri, ro) => { c.moveTo(ro * R * Math.cos(a0), 0); c.ellipse(0, 0, ro * R, ro * R * FLAT, 0, a0, a1); c.ellipse(0, 0, ri * R, ri * R * FLAT, 0, a1, a0, true); c.closePath(); };
  for (const [ri, ro, fill] of RINGS) F(ctx, (c) => half(c, ri, ro), fill);
  ctx.save(); ctx.beginPath(); for (const [ri, ro] of RINGS) half(ctx, ri, ro); ctx.clip();
  const ca = Math.cos(SUN), sa = Math.sin(SUN), L = 3 * R, pt = (u, v) => [u, -v * FLAT];
  const q = [pt(-R * sa, R * ca), pt(-R * sa + L * ca, R * ca + L * sa), pt(R * sa + L * ca, -R * ca + L * sa), pt(R * sa, -R * ca)];
  F(ctx, (c) => { c.moveTo(q[0][0], q[0][1]); for (const [x, y] of q) c.lineTo(x, y); c.closePath(); }, A.shadow);
  ctx.restore();
}

function disc(ctx, R, t) {
  ctx.save(); ctx.beginPath(); circle(ctx, 0, 0, R); ctx.clip();
  ctx.fillStyle = A.butter; ctx.fillRect(-R, -R, 2 * R, 2 * R);
  // each band's edges are waves that slide along it at the band's own speed
  BANDS.forEach(([y0, y1, fill, v, lam], k) => F(ctx, (c) => {
    const amp = R * 0.018, s = v * t;
    c.moveTo(-R - 4, y0 * R);
    for (let x = -R - 4; x <= R + 4; x += 14) c.lineTo(x, y0 * R + amp * Math.sin((x + s) / lam * TAU + k) + amp * 0.6 * Math.sin((x + s * 1.4) / (lam * 0.37) * TAU));
    for (let x = R + 4; x >= -R - 4; x -= 14) c.lineTo(x, y1 * R + amp * Math.sin((x + s * 0.8) / lam * TAU + k * 2.3) + amp * 0.6 * Math.sin((x + s * 1.2) / (lam * 0.43) * TAU));
    c.closePath();
  }, fill));
  // small pale ovals ride round in three of the belts, squeezed toward the limb
  F(ctx, (c) => { for (const [lat, w, k] of [[-0.5, 0.012, 1], [0.28, -0.016, 2], [0.73, 0.021, 3]]) { const spin = t * w; for (let i = Math.floor((spin - 1.6) / 0.7); i <= Math.ceil((spin + 1.6) / 0.7); i++) { const lon = i * 0.7 + 0.4 * hash(i, k) - spin, cl = Math.cos(lon); if (cl > 0.1 && hash(i, k + 9) < 0.7) el(c, R * Math.sin(lon) * Math.sqrt(1 - lat * lat), lat * R, R * (0.03 + 0.05 * hash(i, k + 5)) * cl, R * 0.018); } } }, A.butter);
  // the great storm: once round in about five minutes, out of sight behind for half of it
  { const lon = (t * TAU) / 310 + 0.5, cl = Math.cos(lon), x = R * Math.sin(lon) * 0.95, y = R * 0.28;
    if (cl > 0.06) { F(ctx, (c) => el(c, x, y, R * 0.25 * cl, R * 0.105), C.cream); F(ctx, (c) => el(c, x, y, R * 0.2 * cl, R * 0.078), C.orange); F(ctx, (c) => el(c, x + R * 0.02 * cl * Math.sin(t * 0.21), y, R * 0.1 * cl, R * 0.034), C.rust); } }
  ctx.rotate(0.14); F(ctx, (c) => night(c, R, 0.36), A.night);
  ctx.restore();
}

export function paint(ctx, p, t, G) {
  const { W, H, HY, big, P, tops } = G, R = P.R, D = H - HY;
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  const px = P.x + sway(p, 0.03), py = P.y + R * 0.05 * Math.sin((TAU * t) / 480);
  ctx.fillStyle = A.sky; ctx.fillRect(0, 0, W, H);
  F(ctx, (c) => circle(c, px, py, R * 3.5), A.r1); F(ctx, (c) => circle(c, px, py, R * 2.55), A.r2);
  paintStars(ctx, G.STARS, p);

  ctx.depthLayer?.('planet');
  ctx.save(); ctx.translate(px, py); ctx.rotate(TILT);
  const moons = (front) => { for (const [d, T, ph, s, fill] of MOONS) { const th = TAU * (t / T + ph), sn = Math.sin(th); if ((sn < 0) !== front) continue; const mx = d * R * Math.cos(th), my = -d * R * FLAT * sn, ms = s * big; F(ctx, (c) => circle(c, mx, my, ms), fill); ctx.save(); ctx.translate(mx, my); ctx.rotate(0.14); F(ctx, (c) => night(c, ms, 0.3), A.night); ctx.restore(); } };
  moons(false); ringHalf(ctx, R, false); disc(ctx, R, t); ringHalf(ctx, R, true); moons(true);
  ctx.restore();

  // the ice: a pale jagged horizon, a plain, a nearer ridge with the vent on it, and dark shards along the bottom
  const ridge = (top, rim, body, drop, k) => {
    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 8) c.lineTo(x, top(x)); c.lineTo(W + 90, H + 60); c.closePath(); }, rim);
    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 8) c.lineTo(x, top(x) + drop * (0.35 + Math.abs(nI(x / 23 + k)))); c.lineTo(W + 90, H + 60); c.closePath(); }, body);
  };
  layer(0.08, () => ridge(tops[0], A.i1, A.i2, 12, 3));
  layer(0.2, () => {
    F(ctx, (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 30) c.lineTo(x, HY + D * 0.1 + 8 * nI(x / 200 + 40)); c.lineTo(W + 90, H + 60); c.closePath(); }, A.i3);
    // frost glints wink on the plain
    F(ctx, (c) => { for (const g of G.GLINTS) { const a = osc(p, g.c, g.ph); if (a > 0.2) star4(c, g.x, g.y, 9 * a * big); } }, C.cream);
  });
  ctx.depthLayer?.('geyser');
  layer(0.45, () => {
    // the geyser: a puff leaves the vent many times a second, rises, slows and falls back; how hard it blows follows
    // a slow noise, so it comes in bursts and sometimes stops
    const { x, y, s } = G.GEYSER, dt = 0.07, life = 7.2, n = Math.floor(t / dt), tones = [[3.4, life, A.i3], [1.3, 3.4, A.i2], [0, 1.3, C.cream]];
    for (const [a0, a1, fill] of tones) F(ctx, (c) => {
      for (let k = Math.ceil(life / dt); k >= 0; k--) {
        const id = n - k, a = t - id * dt; if (a < a0 || a >= a1) continue;
        const st = clamp(0.62 + 1.0 * nG(id * dt * 0.13)); if (st < 0.22) continue;
        const v = (150 + 70 * hash(id, 1)) * (0.45 + 0.55 * st), h = v * a - 30 * a * a; if (h < 0) continue;
        circle(c, x + ((hash(id, 2) - 0.5) * 44 * a + 9 * a) * s, y - h * s, (2 + 1.7 * a + 2.5 * hash(id, 3)) * s);
      }
    }, fill);
    ridge(tops[1], A.i2, A.i4, 16, 11);
  });
  ctx.depthLayer?.('ice');
  layer(0.9, () => ridge(tops[2], A.i4, A.ink, 14, 23));
}
