// Daybreak Series No. 02: Lavender Field. Rows of lavender run away to one point under the rising sun; a stone
// farmhouse and its cypresses stand on the meadow where the rows end, with a line of hills behind. The rows are flat
// wedges of two violets fanned from the vanishing point. Every boundary between two rows carries a line of round tufts
// that grow with nearness, placed once in make, and paint leans them in waves that travel over the field.
import { mulberry, clamp, osc, sway, noise1, poly, circle, TAU } from './geom.js';
import { C, F } from './kit.js';
import { hash, el, bars } from './bits.js';

export const title = 'LAVENDER FIELD', no = 'No. 02', text = '#33245f', dark = '#221942';
const P = { sky: '#f4ae84', r1: '#f7c08c', r2: '#f9d199', r3: '#fbe0ac', h1: '#b3c4a2', h2: '#86a78a', green: '#2f5c4c', v1: '#8266b8', v2: '#654a9e', vl: '#b29ade', ink: '#35266c', shade: '#dcc79c' };
const nH = noise1(1301), nB = noise1(1307), nF = noise1(1319);
const CLOUDS = [[0.05, 0.16, 520, 14, P.r1, 5], [0.14, 0.21, 300, 10, P.r1, 5], [0.55, 0.34, 460, 12, C.cream, 7], [0.63, 0.39, 240, 9, C.cream, 7], [0.3, 0.56, 380, 11, P.r2, 9], [0.8, 0.66, 300, 10, C.cream, 11]];

// a cypress: a tall pointed flame on a short trunk, added to the current path
function cypress(c, x, y, h, w, lean) {
  c.rect(x - w * 0.12, y - h * 0.2, w * 0.24, h * 0.2 + 3);
  c.moveTo(x - w / 2, y - h * 0.16); c.quadraticCurveTo(x - w * 0.62 + lean * 0.3, y - h * 0.62, x + lean, y - h); c.quadraticCurveTo(x + w * 0.62 + lean * 0.3, y - h * 0.62, x + w / 2, y - h * 0.16); c.quadraticCurveTo(x, y - h * 0.06, x - w / 2, y - h * 0.16); c.closePath();
}
// a swallow: swept wings and a forked tail, heading along (dx, dy)
function swallow(c, x, y, s, dx, dy, fl) {
  const nx = -dy, ny = dx, P2 = (a, b) => [x + dx * a * s + nx * b * s, y + dy * a * s + ny * b * s];
  poly(c, [P2(1, 0), P2(0.2, 0.22), P2(-0.9, 0.34), P2(-0.5, 0), P2(-0.9, -0.34), P2(0.2, -0.22)]);
  poly(c, [P2(0.5, 0), P2(-0.5, 1.5 * fl), P2(-0.05, 0)]); poly(c, [P2(0.5, 0), P2(-0.05, 0), P2(-0.5, -1.5 * fl)]);
}

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall, r = mulberry(1303);
  const HY = Math.round(H * (0.42 - 0.03 * tall));
  const VP = { x: W * (0.58 - 0.04 * tall), y: HY + 8 };
  const SUN = { x: VP.x + W * 0.03, y: HY - H * 0.05, r: 84 * big };
  // the hills dip where the sun comes up
  const gap = (x) => 0.2 + 0.8 * clamp(Math.abs(x - SUN.x) / (W * 0.2 + 120));
  const h1 = (x) => HY - H * 0.035 - H * 0.12 * gap(x) * (0.5 + 0.5 * nH(x / 420 + 2)) - 4 * nH(x / 50);
  const h2 = (x) => HY - H * 0.01 - H * 0.07 * gap(x * 1.03 + 40) * (0.5 + 0.5 * nH(x / 300 + 30)) - 3 * nH(x / 40 + 7);
  const fy = (x) => HY + H * 0.055 + 6 * nF(x / 260);          // where the meadow ends and the rows begin
  const D = H - VP.y, sp = clamp(W / 12, 120, 200), d0 = H * 0.04;
  const K = Math.ceil(((Math.max(VP.x, W - VP.x) + 160) * D) / (d0 * sp)) + 1;
  // tufts along the row boundaries, in two sets by row colour, and a paler tip on every other one
  const sets = [[], []], tips = [];
  for (let b = -K; b <= K; b++) {
    const m = (b * sp) / D, sin = 1 / Math.hypot(m, 1); if (sin < 0.1) continue;
    const odd = ((b % 2) + 2) % 2, set = sets[b > 0 ? odd : 1 - odd]; let n = 0;   // the tufts lean in toward the middle on both sides
    for (let d = d0; d < D + 60;) {
      const rr = (0.4 * sp * d * Math.max(sin, 0.4)) / D, x = VP.x + m * d;
      if (rr > 2.8 && x > -140 && x < W + 140) { const ph = b * 0.9 + Math.log(d) * 5; set.push(x, VP.y + d, rr, ph); if (rr > 6.5) tips.push(x, VP.y + d - rr * 0.8, rr * 0.17, ph); }
      d += Math.max(1.5, 1.2 * rr * sin); n++;
    }
  }
  const house = { x: W * (0.24 + 0.02 * tall), s: (0.85 + 0.1 * (H / 1000)) * big };
  const CYP = [[-0.075, 150, 0], [-0.045, 205, 1], [0.085, 175, 2], [0.11, 120, 0], [0.62, 90, 1], [0.66, 120, 2], [0.69, 80, 0]].map(([dx, h, k], i) => ({ x: dx < 0.3 ? house.x + dx * W * (1 + tall) : dx * W + W * 0.12, h: h * house.s, c: [3, 4, 5][k], ph: i * 0.19 }));
  const BEES = Array.from({ length: 9 }, (_, i) => ({ x: W * (0.08 + 0.84 * r()), y: H * (0.7 + 0.24 * r()), k: i * 13.7 }));
  const SPRIGS = Array.from({ length: Math.round(W / 22) }, () => { const x = r() * W, e = Math.pow(Math.abs(x / W - 0.5) * 2, 2); return { x, h: (50 + 60 * r() + 150 * e * (0.5 + 0.5 * r())) * big, lean: (r() - 0.5) * 0.3, c: [4, 5, 7][Math.floor(r() * 3)], ph: r() }; });
  return { W, H, HY, tall, big, VP, SUN, h1, h2, fy, D, sp, K, sets: sets.map((s) => Float32Array.from(s)), tips: Float32Array.from(tips), house, CYP, BEES, SPRIGS };
}

export function paint(ctx, p, t, G) {
  const { W, H, HY, VP, SUN, D, sp, K, big } = G, a = (TAU * t) / 420, mx = SUN.x + sway(p, 0.03) + 50 * Math.sin(a), my = SUN.y - HY * 0.16 * (1 - Math.cos(a));
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  ctx.fillStyle = P.sky; ctx.fillRect(0, 0, W, H);
  F(ctx, (c) => circle(c, mx, my, 780), P.r1); F(ctx, (c) => circle(c, mx, my, 500), P.r2); F(ctx, (c) => circle(c, mx, my, 270), P.r3);
  F(ctx, (c) => circle(c, mx, my, SUN.r), C.gold);
  bars(ctx, CLOUDS, W, t, (y) => y * HY);
  const ridge = (top, fill) => F(ctx, (c) => { c.moveTo(-60, HY + 40); for (let x = -60; x <= W + 60; x += 8) c.lineTo(x, top(x)); c.lineTo(W + 60, HY + 40); c.closePath(); }, fill);
  layer(0.06, () => ridge(G.h1, P.h1));
  layer(0.1, () => ridge(G.h2, P.h2));

  ctx.depthLayer?.('field');
  // the field: wedges from the vanishing point, then the tufts on their edges
  layer(0.3, () => {
    ctx.fillStyle = P.v1; ctx.fillRect(-60, VP.y, W + 120, H - VP.y + 20);
    const f = (D + 80) / D;
    F(ctx, (c) => { for (let b = -K - (K % 2 ? 0 : 1); b <= K; b += 2) { c.moveTo(VP.x, VP.y); c.lineTo(VP.x + b * sp * f, VP.y + D + 80); c.lineTo(VP.x + (b + 1) * sp * f, VP.y + D + 80); c.closePath(); } }, P.v2);
    const dots = (s, fill) => F(ctx, (c) => { for (let i = 0; i < s.length; i += 4) { const rr = s[i + 2], ph = s[i + 3], x = s[i] + rr * (0.36 * Math.sin(ph - t * 0.9) + 0.14 * Math.sin(ph * 2.3 + t * 0.57)); c.moveTo(x + rr, s[i + 1]); c.arc(x, s[i + 1], rr, 0, TAU); } }, fill);
    dots(G.sets[1], P.v2); dots(G.sets[0], P.v1);
    // a paler flower spike stands on each of the nearer tufts (filled sixty at a time, which is far cheaper than one huge path)
    { const s = G.tips; ctx.fillStyle = P.vl;
      for (let j = 0; j < s.length; j += 240) { ctx.beginPath(); for (let i = j; i < Math.min(s.length, j + 240); i += 4) { const rr = s[i + 2], ph = s[i + 3], ln = 0.36 * Math.sin(ph - t * 0.9) + 0.14 * Math.sin(ph * 2.3 + t * 0.57), x = s[i] + rr * 9 * ln, y = s[i + 1], h = rr * 2.6, k = ln * h * 0.5; ctx.moveTo(x - k, y + h); ctx.lineTo(x + rr, y); ctx.lineTo(x + k, y - h); ctx.lineTo(x - rr, y); ctx.closePath(); } ctx.fill(); } }
  });

  ctx.depthLayer?.('farm');
  // the meadow closes the far end of the rows: a hedge, the farmhouse and its cypresses
  layer(0.16, () => {
    F(ctx, (c) => { c.moveTo(-60, HY); c.lineTo(W + 60, HY); for (let x = W + 60; x >= -60; x -= 12) c.lineTo(x, G.fy(x)); c.closePath(); }, P.h2);
    F(ctx, (c) => { for (let x = -60; x <= W + 60; x += 15) circle(c, x + 6 * hash(x, 1), G.fy(x) - 2, 7 + 6 * hash(x, 2)); }, P.green);
    const { x, s } = G.house, y = G.fy(x) - 6;
    F(ctx, (c) => { for (const q of G.CYP) cypress(c, q.x, G.fy(q.x) - 4, q.h, q.h * 0.2, q.h * (0.03 * osc(p, q.c, q.ph) + 0.012 * osc(p, 9, q.ph))); }, P.green);
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    F(ctx, (c) => { c.rect(-80, -72, 160, 74); c.rect(80, -44, 74, 46); }, C.cream);
    F(ctx, (c) => { c.rect(-80, -72, 44, 74); c.rect(80, -44, 16, 46); }, P.shade);
    F(ctx, (c) => { poly(c, [[-90, -70], [90, -70], [68, -112], [-68, -112]]); poly(c, [[76, -42], [162, -42], [146, -66], [80, -66]]); c.rect(30, -128, 16, 24); }, C.orange);
    F(ctx, (c) => { c.rect(-10, -34, 20, 36); c.rect(40, -52, 16, 20); c.rect(-64, -52, 14, 20); c.rect(108, -28, 16, 16); c.rect(-90, -72, 180, 4); }, P.ink);
    F(ctx, (c) => c.rect(-28, -52, 14, 18), C.gold);
    ctx.restore();
  });

  // bees wander over the near rows
  F(ctx, (c) => { for (const b of G.BEES) circle(c, b.x + 150 * nB(t * 0.11 + b.k) + 34 * nB(t * 0.9 + b.k * 3), b.y + 70 * nB(t * 0.13 + b.k + 50) + 20 * nB(t * 1.1 + b.k * 5), 3.6 * big); }, C.gold);

  // swallows swoop through now and then, in slots of a fixed length so the size never changes which one the clock is in
  { const dur = Math.min((W + 160) / 330, 8), slot = 20, n = Math.floor(t / slot), q = mulberry(n * 6007 + 9), go = q() < 0.7, dir = q() < 0.5 ? -1 : 1, cnt = 1 + Math.floor(q() * 2.4), yb = HY * (0.45 + 0.7 * q()), dip = H * (0.05 + 0.07 * q()), ph = q() * TAU, t0 = n * slot + 1 + q() * 10;
    if (go) F(ctx, (c) => {
      for (let k = 0; k < cnt; k++) {
        const u = (t - t0 - k * 0.45) / dur; if (u < 0 || u > 1) continue;
        const at = (v) => [dir > 0 ? -80 + v * (W + 160) : W + 80 - v * (W + 160), yb - k * 26 * big + dip * Math.sin(v * 9 + ph) + dip * 0.4 * Math.sin(v * 23 + ph * 2)];
        const A = at(u), B = at(u + 0.004), l = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1;
        swallow(c, A[0], A[1], 13 * big, (B[0] - A[0]) / l, (B[1] - A[1]) / l, 0.55 + 0.45 * Math.sin(t * 9 + k));
      }
    }, P.ink);
  }

  ctx.depthLayer?.('sprigs');
  // near sprigs along the bottom edge, nodding
  layer(1, () => {
    const tip = [];
    ctx.strokeStyle = P.ink; ctx.lineWidth = 3 * big; ctx.lineCap = 'round'; ctx.beginPath();
    for (const q of G.SPRIGS) { const ln = q.lean + 0.12 * osc(p, q.c, q.ph) + 0.05 * osc(p, 11, q.ph), tx = q.x + ln * q.h, ty = H + 10 - q.h; ctx.moveTo(q.x, H + 10); ctx.quadraticCurveTo(q.x + ln * q.h * 0.2, H - q.h * 0.6, tx, ty); tip.push(tx, ty, ln); }
    ctx.stroke();
    F(ctx, (c) => { for (let i = 0; i < tip.length; i += 3) el(c, tip[i], tip[i + 1], 6.5 * big, 24 * big, tip[i + 2] * 1.3); }, P.ink);
    F(ctx, (c) => { for (let i = 0; i < tip.length; i += 6) el(c, tip[i] + 2, tip[i + 1] - 9 * big, 3 * big, 9 * big, tip[i + 2] * 1.3); }, P.vl);
  });
}
