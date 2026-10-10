// Deep Series No. 03: The Wreck. A steamer lies on the sea bed with her bow lifted, dark against lighter water and
// the shafts of light behind her. Her side is stove in amidships, so the ribs show and fish pass behind them; a broken
// mast trails weed, and the anchor lies out ahead on its chain. The ship is sized to the frame's width and sits at a
// fixed share of the height; extra height is more water above her, extra width more sea bed either side.
import { mulberry, clamp, osc, sway, noise1, poly, circle, frac, TAU } from './geom.js';
import { C, F } from './kit.js';
import { hash, el } from './bits.js';

export const title = 'THE WRECK', no = 'No. 03', text = '#0e2b4d', dark = '#07142b';
const K = { w: ['#5fa5c2', '#3a7ea6', '#255f8c', '#184670', '#103357'], light: '#a9d6dc', bed1: '#1d4d76', bed2: '#0f2c4f', hull: '#0a1c38', ink: '#07142b' };
const nS = noise1(1301), nR = noise1(1307);
const surge = (p, lag = 0) => { const q = p - lag / 30; return 0.6 * osc(q, 4) + 0.3 * osc(q, 7, 0.3) + 0.25 * osc(q, 1, 0.6); };
const TILT = -0.085;

// A fish as a pointed oval and a tail triangle, added to the current path. fx is its length along x, signed, so a fish
// that turns shortens and then points the other way; fy tips it; wag swings the tail.
function fish(c, x, y, s, fx, fy = 0, wag = 0) {
  const h = 0.34 * s * (fx < 0 ? -1 : 1), nx = x + fx * s, ny = y + fy * s, tx = x - fx * 0.7 * s, ty = y - fy * 0.7 * s, ex = x - fx * 1.3 * s, ey = y - fy * 1.3 * s + wag * s;
  c.moveTo(nx, ny); c.quadraticCurveTo(x, y - h * 1.5, tx, ty); c.quadraticCurveTo(x, y + h * 1.5, nx, ny); c.closePath();
  c.moveTo(x - fx * 0.5 * s, y - fy * 0.5 * s); c.lineTo(ex, ey - h * 1.1); c.lineTo(ex, ey + h * 1.1); c.closePath();
}
// A school wanders on slow unrelated sines; each fish follows the same track a little late, so they turn together.
function school(c, S, t) {
  const at = (tt) => [S.cx + S.rx * (0.62 * Math.sin(tt * S.f1 + S.a) + 0.38 * Math.sin(tt * S.f2 + S.b)), S.cy + S.ry * (0.6 * Math.sin(tt * S.f3 + S.b) + 0.4 * Math.sin(tt * S.f4 + S.a))];
  for (const f of S.fish) {
    const tt = t - f.lag, [x, y] = at(tt), [x1, y1] = at(tt + 0.5), vx = (x1 - x) * 2, vy = (y1 - y) * 2;
    fish(c, x + f.ox, y + f.oy + 3 * Math.sin(t * 1.3 + f.ph * 9), f.s, clamp(vx / S.v, -1, 1), clamp(vy / S.v, -0.5, 0.5) * 0.6, 0.12 * Math.sin(t * 6 + f.ph * 20));
  }
}
const makeSchool = (r, n, cx, cy, rx, ry, s, spread) => ({ cx, cy, rx, ry, v: rx * 0.012, f1: 0.05 + 0.02 * r(), f2: 0.021 + 0.01 * r(), f3: 0.043 + 0.02 * r(), f4: 0.017 + 0.01 * r(), a: r() * TAU, b: r() * TAU,
  fish: Array.from({ length: n }, () => ({ ox: (r() - 0.5) * spread * 2, oy: (r() - 0.5) * spread * 0.9, lag: r() * 2.2, s: s * (0.8 + 0.4 * r()), ph: r() })) });

// The ship, in her own units: 1000 long, keel at y 0, bow to the right.
const HULL = [[-500, -178], [-486, -60], [-450, 0], [400, 0], [456, -50], [505, -200], [300, -172], [0, -160], [-300, -163]];
const HOLE = [[-80, -122], [-34, -140], [40, -128], [104, -143], [172, -126], [198, -82], [162, -36], [92, -50], [30, -30], [-44, -46], [-86, -82]];
const PORTS = [-430, -385, -340, -295, -250, -205, -160, 250, 295, 340, 385, 430];
const RUST = [[-330, -62, 52, 15], [-190, -30, 70, 12], [310, -58, 56, 17], [120, -8, 60, 7], [230, -18, 44, 9], [-390, -18, 40, 8]];
// where weed hangs from her: [x, y, length]
const TATTERS = [[250, -470, 90], [262, -430, 60], [292, -404, 110], [322, -380, 80], [250, -330, 50], [-330, -292, 70], [-300, -262, 46], [-64, -352, 60], [400, -190, 50], [120, -172, 44], [-420, -180, 56]];

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall;
  // Item i of list L takes its numbers from hash, so it has the same ones at every size, and a wider frame only
  // adds items at the end of a list. The shafts' count is not rounded, so their row stretches smoothly.
  const h = (L, i, k) => hash(L * 1000 + i, 700 + k);
  const SY = H * (0.76 - 0.03 * tall);                          // the sea bed at the ship
  const k = clamp(W * (0.74 + 0.4 * tall), 780, 1300) / 1000;                // ship's scale
  const ship = { x: W * (0.47 - 0.1 * tall), y: SY + 26 * k, k };
  const cs = Math.cos(TILT), sn = Math.sin(TILT);
  const out = (x, y) => [ship.x + k * (x * cs - y * sn), ship.y + k * (x * sn + y * cs)];   // ship units to the frame
  const bandY = [-20, H * 0.17, H * 0.36, H * 0.56, H * 0.74];
  const ns = W / 280 + 2;
  const SHAFTS = Array.from({ length: Math.ceil(ns) }, (_, i) => ({ x: W * ((i + 0.2 + 0.6 * h(0, i, 0)) / ns) + W * 0.06, w: 34 + 70 * h(0, i, 1), len: H * (0.6 + 0.4 * h(0, i, 2)), slant: -W * 0.07 - 80 * h(0, i, 3), c: 1 + (i % 3), ph: h(0, i, 4) }));
  const bed1 = (x) => SY - 20 * big - 34 * big * nS(x / 420) - 8 * nS(x / 83);
  const bed2 = (x) => SY + 34 * k + 22 * nS(x / 300 + 20) + 6 * nS(x / 61 + 4) + (H - SY) * 0.1 * Math.cos(clamp(x / W) * TAU);
  const bed3 = (x) => H - 20 * big - (H - SY) * 0.22 * Math.abs(nR(x / 310 + 3)) - 8 * nR(x / 41) - (H - SY) * 0.16 * Math.cos(clamp(x / W) * TAU);
  const WEED = Array.from({ length: Math.round(W / 34) }, (_, i) => ({ x: h(1, i, 0) * W, h: (40 + h(1, i, 1) * 120) * big, c: [4, 5, 7][Math.floor(h(1, i, 2) * 3)], lag: h(1, i, 3) * 2, n: 2 + Math.floor(h(1, i, 4) * 3), front: h(1, i, 5) < 0.6 }));
  const hole = out(60, -86);
  const SCHOOLS = [
    [makeSchool(mulberry(1311), 22, hole[0], hole[1] - 20 * k, W * 0.4, 70 * k, 13 * big, 90 * big), C.gold],
    [makeSchool(mulberry(1319), 14, W * 0.5, H * 0.3, W * 0.4, H * 0.14, 11 * big, 90 * big), C.cream],
    [makeSchool(mulberry(1321), 8, W * 0.5, SY - 60 * big, W * 0.42, 50 * big, 13 * big, 60 * big), C.orange],
  ];
  const anchor = { x: Math.min(W - 70 * big, out(505, 0)[0] + 150 * k), s: 0.85 * k };
  anchor.y = bed2(anchor.x) + 2;
  const VENTS = [out(-52, -350), out(120, -130), out(-380, -170), out(300, -176)];
  // a speck keeps a share of the way across and up (x, y) and rates in crossings a second (d, v: its old speeds over
  // a frame 1800 wide and 900 high), so the wrap never depends on the size
  const SPECK = Array.from({ length: Math.round(34 + W / 36) }, (_, i) => ({ x: h(2, i, 0), y: h(2, i, 1), d: (3 + h(2, i, 2) * 8) / 1800, v: (2 + h(2, i, 3) * 6) / 900, r: 1.2 + h(2, i, 4) * 2, lag: h(2, i, 5) * 3 }));
  return { W, H, tall, big, SY, ship, out, bandY, SHAFTS, bed1, bed2, bed3, WEED, SCHOOLS, anchor, VENTS, SPECK, hawse: out(452, -120) };
}

function shafts(c, G, p) {
  for (const s of G.SHAFTS) { const a = s.x + 26 * osc(p, s.c, s.ph), b = a + s.slant + 46 * osc(p, s.c, s.ph + 0.15) + 30 * osc(p, 1, s.ph); poly(c, [[a - s.w * 0.5, -20], [a + s.w * 0.5, -20], [b + s.w * 1.5, s.len], [b - s.w * 1.5, s.len]]); }
}
// Water in flat bands, darker with depth. Where a shaft crosses a band it takes the colour of the band above.
function water(ctx, G, p, t, cols, light) {
  const { W, H } = G;
  cols.forEach((col, j) => {
    const top = (c) => { c.moveTo(-20, H + 20); for (let x = -20; x <= W + 60; x += 60) c.lineTo(x, j ? G.bandY[j] + 12 * Math.sin(x / 260 + t * 0.21 + j * 2.1) + 7 * Math.sin(x / 97 - t * 0.17 + j) : -20); c.lineTo(W + 60, H + 20); c.closePath(); };
    F(ctx, top, col);
    ctx.save(); ctx.beginPath(); top(ctx); ctx.clip(); F(ctx, (c) => shafts(c, G, p), j ? cols[j - 1] : light); ctx.restore();
  });
}

function shipBody(ctx, p) {
  F(ctx, (c) => {
    poly(c, HULL);
    poly(c, [[-150, -160], [70, -158], [70, -232], [-150, -236]]); poly(c, [[-120, -234], [30, -232], [30, -262], [-120, -266]]);   // deckhouse and bridge
    poly(c, [[-84, -262], [-22, -260], [-30, -338], [-52, -356], [-66, -330], [-80, -344]]);                                   // the funnel, its top torn off
    poly(c, [[244, -170], [258, -170], [255, -474], [247, -470]]); poly(c, [[246, -440], [252, -452], [336, -372], [330, -364]]); // fore mast, and its top hanging
    poly(c, [[-336, -162], [-322, -162], [-325, -296], [-333, -290]]); poly(c, [[-360, -252], [-296, -256], [-296, -250], [-360, -246]]);
    poly(c, [[-500, -178], [-486, -60], [-520, -40], [-524, -150]]);                                                           // rudder
    for (let x = -470; x < 500; x += 44) if (x < -150 || x > 80) c.rect(x, -196 - (x > 290 ? (x - 290) * 0.12 : 0), 5, 34);   // what is left of the rail
    c.rect(-480, -200, 330, 5); c.rect(80, -198, 210, 5);
  }, K.hull);
  ctx.strokeStyle = K.hull; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(252, -440); ctx.quadraticCurveTo(380, -300, 500, -200); ctx.moveTo(250, -400); ctx.quadraticCurveTo(160, -300, 70, -232); ctx.stroke();
}
function shipDetail(ctx, p) {
  // rust in patches and streaks, then the lights and the ribs across the hole
  ctx.save(); ctx.beginPath(); poly(ctx, HULL); ctx.clip();
  F(ctx, (c) => { for (const [x, y, w, h] of RUST) el(c, x, y, w, h); for (const x of PORTS) c.rect(x - 3, -108, 6, 30 + 30 * hash(x, 2)); poly(c, [[-82, -300], [-24, -298], [-25, -282], [-81, -284]]); }, C.rust);
  F(ctx, (c) => { for (const [x, y, w, h] of RUST) el(c, x + w * 0.25, y + 1, w * 0.3, h * 0.3); }, C.orange);
  ctx.restore();
  F(ctx, (c) => { for (const x of PORTS) circle(c, x, -120, 9); for (let x = -130; x < 60; x += 38) c.rect(x, -214, 20, 26); for (let x = -104; x < 20; x += 34) c.rect(x, -254, 18, 12); }, K.w[2]);
  ctx.strokeStyle = K.hull; ctx.lineCap = 'round'; ctx.lineWidth = 10; ctx.beginPath();
  for (let x = -40; x <= 170; x += 52) { ctx.moveTo(x - 6, -150); ctx.quadraticCurveTo(x + 10, -90, x - 4, -22); }
  ctx.moveTo(-90, -92); ctx.lineTo(200, -86); ctx.stroke();
}

// an anchor lying over on the bed: shank, ring, stock, arms and flukes
function anchorAt(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-1.05);
  ctx.strokeStyle = K.hull; ctx.lineCap = 'round'; ctx.lineWidth = 11; ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(0, -118); ctx.moveTo(-34, -100); ctx.lineTo(34, -100); ctx.moveTo(50, -34); ctx.arc(0, -34, 50, 0, Math.PI); ctx.stroke();
  ctx.lineWidth = 6; ctx.beginPath(); circle(ctx, 0, -132, 11); ctx.stroke();
  F(ctx, (c) => { poly(c, [[36, -30], [66, -30], [50, -72]]); poly(c, [[-36, -30], [-66, -30], [-50, -72]]); }, K.hull);
  ctx.restore();
}
// a ray seen from above, nose first; the wing tips beat slowly and the tail trails
function ray(ctx, x, y, s, dir, t) {
  const f = Math.sin(t * 1.5), g = Math.sin(t * 1.5 - 0.8);
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
  F(ctx, (c) => { c.moveTo(52, 0); c.quadraticCurveTo(20, -16, -6 + 6 * g, -44 - 16 * f); c.quadraticCurveTo(-14, -12, -44, 0); c.quadraticCurveTo(-14, 8, -4 + 4 * g, 22 + 8 * f); c.quadraticCurveTo(20, 10, 52, 0); c.closePath(); poly(c, [[-40, -3], [-40, 3], [-150, 6 * g]]); }, K.ink);
  ctx.restore();
}

export function paint(ctx, p, t, G) {
  const { W, H, SY, ship, big } = G, k = ship.k;
  const layer = (d, fn) => { ctx.save(); ctx.translate(sway(p, d), 0); fn(); ctx.restore(); };
  const ridge = (top) => (c) => { c.moveTo(-90, H + 60); for (let x = -90; x <= W + 90; x += 10) c.lineTo(x, top(x)); c.lineTo(W + 90, H + 60); c.closePath(); };
  const into = () => { ctx.translate(ship.x, ship.y); ctx.rotate(TILT); ctx.scale(k, k); };
  water(ctx, G, p, t, K.w, K.light);
  F(ctx, (c) => school(c, G.SCHOOLS[1][0], t), G.SCHOOLS[1][1]);
  layer(0.15, () => F(ctx, ridge(G.bed1), K.bed1));

  layer(0.4, () => {
    // the gold school keeps to the ship: drawn once behind her, then again through the hole in her side
    F(ctx, (c) => school(c, G.SCHOOLS[0][0], t), C.gold);
    ctx.save(); into(); shipBody(ctx, p);
    F(ctx, (c) => poly(c, HOLE), K.w[3]);
    ctx.save(); ctx.beginPath(); poly(ctx, HOLE); ctx.clip();
    ctx.scale(1 / k, 1 / k); ctx.rotate(-TILT); ctx.translate(-ship.x, -ship.y);
    F(ctx, (c) => school(c, G.SCHOOLS[0][0], t), C.gold);
    ctx.restore();
    shipDetail(ctx, p);
    // weed hangs in tatters from the mast and the rail and follows the surge
    ctx.strokeStyle = K.hull; ctx.lineCap = 'round'; ctx.lineWidth = 6; ctx.beginPath();
    TATTERS.forEach(([x, y, l], i) => { const g = surge(p, i * 0.37), g2 = surge(p, i * 0.37 + 0.7); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + l * 0.3 * g, y + l * 0.55, x + l * 0.55 * g2 + 6 * osc(p, 9, i * 0.2), y + l * (1 - 0.1 * Math.abs(g2))); });
    ctx.stroke();
    ctx.restore();
    // the chain sags from the bow to the anchor
    const [hx, hy] = G.hawse, a = G.anchor, ax = a.x - 112 * a.s, ay = a.y - 66 * a.s;
    ctx.save(); ctx.strokeStyle = K.hull; ctx.lineWidth = 7 * k; ctx.setLineDash([11 * k, 6 * k]); ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo(hx + (ax - hx) * 0.25 + 8 * surge(p, 0.5), ay + 30 * k, ax, ay); ctx.stroke(); ctx.restore();
  });

  // bubbles leave the wreck in bursts: every few seconds one of her vents lets a handful go
  { const slot = 5.5; ctx.strokeStyle = C.cream; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let n = Math.floor(t / slot), j = 0; j < 7; j++, n--) {
      const q = mulberry(n * 7717 + 5); if (q() > 0.6) continue;
      const [vx, vy] = G.VENTS[Math.floor(q() * G.VENTS.length)];
      for (let i = 0; i < 9; i++) { const a = t - n * slot - q() * 1.8, v = 55 + 40 * q(), dx = (q() - 0.5) * 30, rr = 2.5 + 5 * q(), ph = q() * TAU; if (a < 0) continue; const y = vy - v * a - 0.4 * a * a; if (y < -20) continue; circle(ctx, vx + sway(p, 0.4) + dx * (1 + a * 0.25) + 9 * Math.sin(a * 1.7 + ph), y, rr * big * Math.min(1, 0.5 + a * 0.2)); }
    }
    ctx.stroke(); }

  layer(0.55, () => {
    F(ctx, ridge(G.bed2), K.bed2);
    anchorAt(ctx, G.anchor.x, G.anchor.y, G.anchor.s);
    weed(ctx, G, p, false, (x) => G.bed2(x), K.bed2);
  });
  F(ctx, (c) => school(c, G.SCHOOLS[2][0], t), G.SCHOOLS[2][1]);
  // a ray glides along over the sand in some of the slots
  { const slot = 48, n = Math.floor(t / slot), q = mulberry(n * 2161 + 3), go = q() < 0.7, dir = q() < 0.5 ? -1 : 1, u = (t - n * slot - 2 - q() * 8) / 34;
    if (go && u >= 0 && u <= 1) { const x = dir > 0 ? -200 + u * (W + 400) : W + 200 - u * (W + 400); ray(ctx, x, G.bed2(x) - (40 + 20 * q()) * big + 14 * Math.sin(t * 0.5), 1.5 * big, dir, t); } }
  layer(0.9, () => { F(ctx, ridge(G.bed3), K.ink); weed(ctx, G, p, true, (x) => G.bed3(x), K.ink); });
  F(ctx, (c) => { for (const f of G.SPECK) circle(c, frac(f.x + f.d * t + (26 * surge(p, f.lag)) / W) * W, frac(f.y - f.v * t) * H, f.r * big); }, C.cream);
}

// weed on the bottom, bending with the surge
function weed(ctx, G, p, front, top, fill) {
  F(ctx, (c) => { for (const q of G.WEED) { if (q.front !== front) continue; const gy = top(q.x) + 6, g = surge(p, q.lag);
    for (let i = 0; i < q.n; i++) { const bx = q.x + i * 9, h = q.h * (0.55 + 0.45 * hash(i, q.n)) * (front ? 1 : 0.6), sw = h * (0.3 * g + 0.06 * osc(p, q.c + 4, q.lag + i * 0.1) + (i - q.n / 2) * 0.1); c.moveTo(bx - 4, gy); c.quadraticCurveTo(bx + sw * 0.15, gy - h * 0.6, bx + sw, gy - h); c.quadraticCurveTo(bx + 4 + sw * 0.15, gy - h * 0.6, bx + 4, gy); c.closePath(); } } }, fill);
}
