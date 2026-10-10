// Scene geometry for the beach at night, laid out against whatever frame it is given.
// makeScene(W, H) composes the scene for a W x H window (in design units, about 1080 on the short side):
// the horizon sits at a fixed share of the height, the headland hangs off the left edge, the palm off the
// right, and extra height or width becomes more sky, sea and sand rather than empty bars.
// Motion is a function of p, time counted in 30 s units and never wrapped, built from sines at several unrelated
// speeds (see osc), so it reads as continuous and does not repeat.
export const TAU = Math.PI * 2;

export const mulberry = (a) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
// The fractional part, for wrapping. Things that cross the frame and come round again wrap a phase like
// frac(start + t / seconds) and scale it by the span, so a change of size never throws them across the picture.
export const frac = (x) => x - Math.floor(x);
// Every rhythm in a scene is osc(p, c, ...): c beats per 30 s. Each c is nudged off its whole number by its own small
// irrational amount, so the rhythms drift against one another and the scene as a whole never comes back to the same
// frame, while things that share a c (a frond and its leaflets, say) stay in step with each other.
const detune = (c) => 1 + 0.031 * Math.sin(c * 12.9898 + 4.1);
export const osc = (p, c = 1, ph = 0) => Math.sin(TAU * (p * c * detune(c) + ph));
export function noise1(seed) {
  const r = mulberry(seed), v = Array.from({ length: 256 }, () => r() * 2 - 1);
  return (x) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(v[i & 255], v[(i + 1) & 255], u); };
}
const nA = noise1(11), nB = noise1(23), nC = noise1(37);

// Camera drift: nearer layers (d -> 1) slide further, which is the parallax.
export const sway = (p, d) => d * (22 * osc(p) + 5 * osc(p, 3, 0.2));

export const shapes = {
  sine: (u) => Math.sin(TAU * u),
  scallop: (u) => 2 * Math.abs(Math.sin(Math.PI * u)) - 1,
  curl: (u) => Math.sin(TAU * u + 0.6 * Math.sin(TAU * u)),
};

export function poly(ctx, pts) {
  // one winding for every polygon, so overlapping shapes in a single path never punch holes in each other
  let a = 0;
  for (let i = 0; i < pts.length; i++) { const q = pts[(i + 1) % pts.length]; a += pts[i][0] * q[1] - q[0] * pts[i][1]; }
  if (a < 0) pts = pts.slice().reverse();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}
export function edge(ctx, pts, dy = 0) {
  ctx.moveTo(pts[0][0], pts[0][1] + dy);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1] + dy);
}
export const circle = (ctx, x, y, r) => { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); };
export function pill(ctx, x, y, w, h) {
  const r = h / 2;
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arc(x + w - r, y + r, r, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(x + r, y + h); ctx.arc(x + r, y + r, r, Math.PI / 2, -Math.PI / 2); ctx.closePath();
}
export function star4(ctx, x, y, r) {
  const k = r * 0.28;
  ctx.moveTo(x, y - r); ctx.lineTo(x + k, y - k); ctx.lineTo(x + r, y); ctx.lineTo(x + k, y + k);
  ctx.lineTo(x, y + r); ctx.lineTo(x - k, y + k); ctx.lineTo(x - r, y); ctx.lineTo(x - k, y - k); ctx.closePath();
}

const STAR0 = (() => { const r = mulberry(5), a = []; for (let i = 0; i < 160; i++) a.push({ u: r(), v: r(), s: 0.8 + r() * r() * 2.2, c: [4, 5, 7, 9, 11][Math.floor(r() * 5)], ph: r() }); return a; })();
const FR = [[-2.95, 320], [-2.45, 350], [-1.95, 310], [-1.2, 310], [-0.7, 350], [-0.2, 330], [0.45, 260], [2.7, 260]];
const bez = (A, B, C, t) => [(1 - t) ** 2 * A[0] + 2 * t * (1 - t) * B[0] + t * t * C[0], (1 - t) ** 2 * A[1] + 2 * t * (1 - t) * B[1] + t * t * C[1]];
const bezT = (A, B, C, t) => {
  const x = 2 * (1 - t) * (B[0] - A[0]) + 2 * t * (C[0] - B[0]), y = 2 * (1 - t) * (B[1] - A[1]) + 2 * t * (C[1] - B[1]), l = Math.hypot(x, y) || 1;
  return [x / l, y / l];
};

export function makeScene(W, H) {
  const tall = clamp((1500 - W) / 400);          // 0 on a wide screen, 1 on a portrait phone
  const HY = Math.round(H * 0.59);               // horizon
  const seaD = clamp((H - HY) * 0.6, 200, 520);  // depth of the sea, horizon to shore
  const sandBase = HY + seaD + 30;
  // On wide frames the moon follows the palm, so the palm always stands against the lit rings and never the dark sky.
  const MOON = { x: Math.max(W * (0.55 - 0.13 * tall), W - 880), y: HY * 0.31, r: 78 };
  // The moon rides a slow oval, six minutes around: it starts near its composed spot, climbs, and comes back down.
  const moonPos = (p, t = 0) => {
    const a = (TAU * t) / 360;
    return [MOON.x + sway(p, 0.03) - 80 * (1 - 0.6 * tall) * Math.sin(a), MOON.y + HY * 0.03 - HY * 0.09 * (1 - Math.cos(a))];
  };

  // ---- sky
  const STARS = STAR0.map((s) => ({ ...s, x: s.u * W, y: s.v * (HY - 70) })).filter((s) => Math.hypot(s.x - MOON.x, s.y - MOON.y) > 150);
  const starA = (s, p) => 0.55 + 0.45 * osc(p, s.c, s.ph);

  // ---- headlands and lighthouse, hung off the left edge
  const HF = { x1: Math.min(800, W * 0.6), peak: 150 * (1 + 0.5 * tall), d: 0.15, k: 0 };
  const HN = { x1: Math.min(430, W * 0.34), peak: 250 * (1 + 0.5 * tall), d: 0.25, k: 40 };
  const headH = (c, x) => {
    const t = 1 - (x + 120) / (c.x1 + 120);
    if (t <= 0) return 0;
    return Math.max(0, c.peak * Math.pow(t, 0.75) * (0.78 + 0.22 * nA(x / 90 + c.k)) + 5 * nA(x / 15 + c.k) * Math.min(1, t * 6));
  };
  const headland = (ctx, p, c) => {
    const dx = sway(p, c.d);
    ctx.moveTo(-130 + dx, HY + 6);
    for (let x = -120; x <= c.x1; x += 5) ctx.lineTo(x + dx, HY - headH(c, x));
    ctx.lineTo(c.x1 + dx, HY + 6); ctx.closePath();
  };
  const LX = HF.x1 * 0.82;
  const lighthouse = (p) => {
    const x = LX + sway(p, 0.15), g = HY - headH(HF, LX) + 4;
    return {
      tower: [[x - 12, g], [x + 12, g], [x + 7, g - 64], [x - 7, g - 64]],
      lamp: [[x - 9, g - 64], [x + 9, g - 64], [x + 9, g - 78], [x - 9, g - 78]],
      roof: [[x - 11, g - 78], [x + 11, g - 78], [x, g - 92]],
      light: [x, g - 71],
      I: Math.pow(Math.max(0, osc(p, 6, 0.1)), 3),
    };
  };

  // ---- sea: more bands when there is more sea to fill
  const BANDS = clamp(Math.round(seaD / 31), 7, 11);
  const bandInfo = (j) => { const t = j / (BANDS - 1); return { t, y0: HY + Math.pow(t, 1.5) * seaD, lam: 150 + 390 * t, amp: j === 0 ? 0 : 4 + 25.2 * t, d: 0.3 + 0.4 * t }; };
  // Each band slides three of its own wavelengths every 30 s, so nearer bands move faster.
  const bandShift = (p, j) => { const b = bandInfo(j); return sway(p, b.d) + 3 * p * b.lam + j * 53; };
  const bandY = (p, j, x, shape) => {
    const b = bandInfo(j), u = (x - bandShift(p, j)) / b.lam, bob = j ? 3 * osc(p, 4 + (j % 3), j * 0.17) : 0;
    return b.y0 + bob - b.amp * shape(u) * (0.7 + 0.3 * nB(x / 420 + j * 9));
  };
  const seaEdge = (p, j, shape = shapes.sine) => { const pts = []; for (let x = -90; x <= W + 90; x += 5) pts.push([x, bandY(p, j, x, shape)]); return pts; };
  const GSTEP = (seaD * 1.09) / 30, GW = Math.sqrt(GSTEP / 9.3);
  const GLINTS = (() => {
    const r = mulberry(8), a = [];
    for (let k = 0; k < 30; k++) a.push({ y: HY + 10 + k * GSTEP, w: (26 + k * 6.5) * (0.45 + r() * 0.8) * GW, j: (r() - 0.5) * (10 + k * 3.2) * GW, c: 5 + Math.floor(r() * 5), ph: r() });
    return a;
  })();
  const glint = (g, p, mx = MOON.x) => ({
    x: mx + sway(p, 0.42) + g.j + 4 * osc(p, 3, g.ph), y: g.y,
    w: g.w * (0.75 + 0.25 * osc(p, g.c, g.ph)), a: 0.4 + 0.6 * (0.5 + 0.5 * osc(p, g.c, g.ph + 0.3)),
  });

  // ---- shore
  const sandY = (x) => sandBase - 75 * Math.cos((x / W) * Math.PI) + 8 * nC(x / 260);
  const shoreEdge = (p, up) => { const dx = sway(p, 0.8), pts = []; for (let x = -90; x <= W + 90; x += 6) pts.push([x, sandY(x - dx) - up(x)]); return pts; };
  const shore = (ctx, p, up) => { edge(ctx, shoreEdge(p, up)); ctx.lineTo(W + 90, H + 60); ctx.lineTo(-90, H + 60); ctx.closePath(); };
  const foamUp = (p) => (x) => 26 + 15 * osc(p, 5) + 6 * osc(p, 2, 0.3) + 5 * Math.sin(x / 34 + TAU * 4 * p) + 3 * Math.sin(x / 13 - TAU * 7 * p);
  const sand = (ctx, p) => shore(ctx, p, () => 0);
  const wet = (ctx, p) => shore(ctx, p, () => 12);
  const foam = (ctx, p) => shore(ctx, p, foamUp(p));

  const GSPAN = Math.min(620, W * 0.52);
  const GRASS = (() => {
    const r = mulberry(13), a = [];
    for (let i = 0; i < 80; i++) { const x = -30 + r() * GSPAN; a.push({ x, h: (50 + r() * 125) * clamp(1 - x / (GSPAN * 1.25), 0.3, 1), lean: (r() - 0.35) * 0.7, ph: r(), w: 5 + r() * 4 }); }
    return a.sort((u, v) => u.h - v.h);
  })();
  const grass = (ctx, p) => {
    const dx = sway(p, 0.9);
    for (const g of GRASS) {
      const bx = g.x + dx, by = sandY(g.x) + 14, sw = (g.lean + 0.12 * osc(p, 5, g.ph * 0.3) + 0.04 * osc(p, 11, g.ph)) * g.h;
      const tx = bx + sw, ty = by - g.h;
      ctx.moveTo(bx - g.w / 2, by); ctx.quadraticCurveTo(bx - g.w / 2 + sw * 0.15, by - g.h * 0.6, tx, ty);
      ctx.quadraticCurveTo(bx + g.w / 2 + sw * 0.15, by - g.h * 0.6, bx + g.w / 2, by); ctx.closePath();
    }
  };

  // ---- palm, hung off the right edge; taller and fuller when the frame is tall
  const palm = (p) => {
    const dx = sway(p, 1), sw = osc(p, 4, 0.1), fat = 1 + 0.5 * tall, big = 1 + 0.2 * tall;
    const B = [W - 180 + dx, H + 60], T = [W - 420 + dx + 9 * sw, Math.max(HY - 282 - 200 * tall, MOON.y + 300) + 2 * sw], C = [W - 255 + dx, lerp(B[1], T[1], 0.51)];
    const L = [], R = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24, [x, y] = bez(B, C, T, t), [tx, ty] = bezT(B, C, T, t), w = lerp(36, 13, t) * fat * (1 + 0.06 * Math.sin(i * 2.1));
      L.push([x - ty * w, y + tx * w]); R.push([x + ty * w, y - tx * w]);
    }
    const fronds = FR.map(([a0, len0], i) => {
      const len = len0 * big, a = a0 + 0.045 * osc(p, 4, i * 0.13) + 0.02 * osc(p, 9, i * 0.31), c = Math.cos(a), s = Math.sin(a);
      const P1 = [T[0] + 0.55 * len * c, T[1] + 0.55 * len * s - 0.2 * len], P2 = [T[0] + len * c, T[1] + len * s + 0.55 * len];
      const spine = [], leaf = [];
      for (let k = 0; k <= 27; k++) {
        const t = k / 27, pt = bez(T, P1, P2, t), [tx, ty] = bezT(T, P1, P2, t);
        spine.push([pt, [tx, ty], lerp(4, 0.8, t)]);
        if (k === 0 || k === 27 || k % 2) continue;
        const ll = (14 + 66 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.05)), 0.6)) * (len / 300);
        for (const side of [-1, 1]) {
          const fl = 0.07 * osc(p, 13, i * 0.2 + k * 0.03);
          let vx = -ty * side * 0.7 + tx * 0.5 + fl, vy = tx * side * 0.7 + ty * 0.5 + 0.38;
          const l = Math.hypot(vx, vy); vx /= l; vy /= l;
          leaf.push([[pt[0] - tx * 8, pt[1] - ty * 8], [pt[0] + tx * 8, pt[1] + ty * 8], [pt[0] + vx * ll, pt[1] + vy * ll]]);
        }
      }
      return { spine, leaf };
    });
    return { trunk: L.concat(R.reverse()), fronds, top: T };
  };
  const palmFronds = (ctx, P) => {
    for (const f of P.fronds) {
      for (const t of f.leaf) poly(ctx, t);
      const a = f.spine.map(([q, [tx, ty], w]) => [q[0] - ty * w, q[1] + tx * w]);
      const b = f.spine.map(([q, [tx, ty], w]) => [q[0] + ty * w, q[1] - tx * w]).reverse();
      poly(ctx, a.concat(b));
    }
  };

  return { W, H, HY, tall, MOON, moonPos, STARS, starA, HF, HN, headland, lighthouse, BANDS, bandInfo, bandShift, seaEdge, GLINTS, glint, sand, wet, foam, grass, palm, palmFronds };
}
