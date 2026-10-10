// Nocturne Series No. 05: Night Train. The view travels with the train: it holds its place on the causeway while the
// country slides past behind it, far ridges slowly and the near bank fast, with a lake in front that carries its lights.
// The land is drawn from noise along an endless strip, so it never comes round again.
import { clamp, osc, noise1, poly, circle, pill, TAU } from './geom.js';
import { C, F } from './kit.js';
import { hash, makeStars, paintStars, meteor, bars, pine } from './bits.js';

export const title = 'NIGHT TRAIN', no = 'No. 05', text = C.navy, dark = C.ink;
const nF = noise1(101), nM = noise1(113), nN = noise1(127);
const V = 420;                                                // how fast the track goes by, in units per second
const CLOUDS = [[0.1, 0.3, 430, 28, C.deep, -5], [0.18, 0.37, 260, 22, C.deep, -5], [0.62, 0.14, 360, 26, C.deep, -3], [0.4, 0.58, 320, 22, C.teal, -8], [0.47, 0.64, 170, 16, C.teal, -8]];

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.45 * tall;
  const TY = Math.round(H * (0.7 - 0.07 * tall));              // top of the rail
  const WY = TY + 34;                                         // where the causeway meets the lake
  const MOON = { x: W * (0.3 - 0.05 * tall), y: TY * 0.3, r: 78 };
  const STARS = makeStars(21, 150, W, TY * 0.78, (s) => Math.hypot(s.x - MOON.x, s.y - MOON.y) > 150);
  const x0 = W * (0.76 + 0.16 * tall);                        // the engine's front buffer
  // the three strips of country: [speed, top edge at a place along the strip]
  const far = (X) => TY - H * 0.07 - H * 0.14 * (0.25 + 0.75 * Math.abs(nF(X / 430))) - 10 * nF(X / 47);
  const mid = (X) => TY - H * 0.035 - H * 0.06 * (0.5 + 0.5 * nM(X / 520)) - 5 * nM(X / 60);
  const near = (X) => TY - 20 - H * 0.04 * (0.5 + 0.5 * nN(X / 380));
  const POOL = clamp(Math.round((H - WY) / 50), 4, 10);
  const band = (j) => { const u = j / POOL; return { u, y0: WY + Math.pow(u, 1.3) * (H - WY) * 0.9, lam: 170 + 260 * u, amp: 2 + 6 * u }; };
  return { W, H, TY, WY, tall, big, MOON, STARS, x0, far, mid, near, POOL, band };
}

// everything that stands along a strip: fn(screen x, index) for each place in view
function along(s, W, step, pad, fn) { for (let i = Math.floor((s - pad) / step); i <= Math.ceil((s + W + pad) / step); i++) fn(i * step + hash(i, 1) * step * 0.6 - s, i); }
const ridge = (ctx, W, s, top, base) => { ctx.moveTo(-20, base); for (let x = -20; x <= W + 20; x += 8) ctx.lineTo(x, top(x + s)); ctx.lineTo(W + 20, base); ctx.closePath(); };

function wheel(ctx, x, y, r, a, spokes) {
  F(ctx, (c) => circle(c, x, y, r), C.ink);
  ctx.beginPath(); circle(ctx, x, y, r - 3.5); ctx.strokeStyle = C.rust; ctx.lineWidth = 3; ctx.stroke();
  if (!spokes) return;
  ctx.beginPath(); for (let k = 0; k < 2; k++) { const b = a + (k * Math.PI) / 2, cx = Math.cos(b) * (r - 5), cy = Math.sin(b) * (r - 5); ctx.moveTo(x - cx, y - cy); ctx.lineTo(x + cx, y + cy); }
  ctx.lineWidth = 2.5; ctx.stroke();
}

export function paint(ctx, p, t, G) {
  const { W, H, TY, WY, MOON, x0, big } = G, mx = MOON.x, my = MOON.y + 10 * Math.sin((TAU * t) / 360);
  ctx.fillStyle = C.navy; ctx.fillRect(0, 0, W, H);
  F(ctx, (c) => circle(c, mx, my, 700), C.deep); F(ctx, (c) => circle(c, mx, my, 470), C.teal); F(ctx, (c) => circle(c, mx, my, 255), C.blue);
  paintStars(ctx, G.STARS, p);
  meteor(ctx, t, W, TY * 0.8);
  F(ctx, (c) => circle(c, mx, my, MOON.r), C.gold);
  bars(ctx, CLOUDS, W, t, (y) => y * TY * 0.8);

  // far ridges, then rolling hills with woods, then the near bank with its pines and the odd lit farmhouse
  F(ctx, (c) => ridge(c, W, 7 * t, G.far, WY), '#3a94aa');
  { const s = 26 * t; F(ctx, (c) => { ridge(c, W, s, G.mid, WY); along(s, W, 46, 60, (x, i) => { if (hash(i, 2) < 0.6) circle(c, x, G.mid(x + s) + 4, 13 + 15 * hash(i, 3)); }); }, C.teal); }
  { const s = 90 * t;
    F(ctx, (c) => { ridge(c, W, s, G.near, WY); along(s, W, 74, 120, (x, i) => { if (hash(i, 2) < 0.62) pine(c, x, G.near(x + s) + 6, (60 + 75 * hash(i, 3)) * big, (40 + 22 * hash(i, 4)) * big, 4 * osc(p, 4, hash(i, 5))); }); }, C.deep);
    along(s, W, 1150, 200, (x, i) => {
      if (hash(i, 7) < 0.45) return;
      const y = G.near(x + s) + 6, w = 74, h = 40;
      F(ctx, (c) => { poly(c, [[x, y], [x + w, y], [x + w, y - h], [x, y - h]]); poly(c, [[x - 8, y - h], [x + w + 8, y - h], [x + w / 2, y - h - 30]]); poly(c, [[x + w - 22, y - h], [x + w - 10, y - h], [x + w - 10, y - h - 34], [x + w - 22, y - h - 34]]); }, C.navy);
      F(ctx, (c) => { c.rect(x + 12, y - 30, 15, 17); if (hash(i, 8) < 0.6) c.rect(x + 44, y - 30, 15, 17); }, C.gold);
    });
  }

  // telegraph poles on the far side of the line, with the wire sagging between them
  { const s = V * 0.86 * t, step = 560, py = TY - 150 * big, at = (i) => i * step - s;
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let i = Math.floor(s / step) - 1; i <= Math.ceil((s + W) / step); i++) for (const dy of [4, 22]) { ctx.moveTo(at(i), py + dy); ctx.quadraticCurveTo(at(i) + step / 2, py + dy + 46, at(i + 1), py + dy); }
    ctx.stroke();
    F(ctx, (c) => { for (let i = Math.floor(s / step) - 1; i <= Math.ceil((s + W) / step); i++) { const x = at(i); c.rect(x - 4, py - 10, 8, TY - py + 12); c.rect(x - 26, py, 52, 6); c.rect(x - 20, py + 18, 40, 6); } }, C.ink);
  }

  // smoke: a puff leaves the stack every fifth of a second and is carried back and up, swelling, then thins away
  { const sx = x0 - 78 * big, sy = TY - 128 * big, dt = 0.2, life = 6, n = Math.floor(t / dt), tones = [[2.6, life, C.teal], [0.8, 2.6, C.blue], [0, 0.8, C.cream]];
    for (const [a0, a1, fill] of tones) F(ctx, (c) => {
      for (let k = Math.ceil(life / dt); k >= 0; k--) {
        const id = n - k, a = t - id * dt; if (a < a0 || a >= a1) continue;
        const r = ((10 + 25 * Math.sqrt(a)) * (1 - Math.pow(a / life, 4)) + 7 * hash(id, 1)) * big;
        circle(c, sx - 235 * a + 40 * (1 - Math.exp(-a)), sy - 110 * (1 - Math.exp(-a * 0.7)) - 9 * a + 12 * Math.sin(id * 1.7 + a * 1.3), Math.max(0.5, r));
      }
    }, fill);
  }

  // the train, drawn about its front buffer and scaled a little on a tall screen
  ctx.save(); ctx.translate(x0, TY); ctx.scale(big, big);
  const rock = (i) => 1.3 * Math.sin(t * 7.3 + i * 2.1) + 0.8 * Math.sin(t * 11.7 + i);
  F(ctx, (c) => poly(c, [[-46, -80], [-46, -64], [Math.min(430, (W - x0) / big + 80), -44], [Math.min(430, (W - x0) / big + 80), -108]]), C.gold);
  const cars = Math.ceil((x0 / big - 430) / 346) + 1;
  for (let i = 0; i < cars; i++) {
    const cx = -436 - i * 346, dy = rock(i + 1);
    F(ctx, (c) => { c.rect(cx - 330, -94 + dy, 330, 70); pill(c, cx - 336, -104 + dy, 342, 20); c.rect(cx - 346, -40 + dy, 16, 8); c.rect(cx - 300, -26 + dy, 80, 12); c.rect(cx - 110, -26 + dy, 80, 12); }, C.ink);
    F(ctx, (c) => { for (let w = 0; w < 8; w++) if (hash(i, 20 + w) > 0.2) c.rect(cx - 316 + w * 38, -80 + dy, 24, 26); }, C.gold);
    F(ctx, (c) => c.rect(cx - 330, -44 + dy, 330, 4), C.cream);
    for (const wx of [-286, -236, -96, -46]) wheel(ctx, cx + wx, -13, 13);
  }
  { const dy = rock(0), a = (V * t) / 24;
    // tender, cab, boiler, stack, dome and cowcatcher
    F(ctx, (c) => {
      c.rect(-430, -86 + dy, 96, 62); c.rect(-334, -40 + dy, 12, 8);
      c.rect(-322, -116 + dy, 74, 92); pill(c, -334, -126 + dy, 98, 16);
      pill(c, -262, -92 + dy, 226, 62); c.rect(-250, -40 + dy, 200, 16);
      poly(c, [[-88, -90 + dy], [-68, -90 + dy], [-62, -128 + dy], [-94, -128 + dy]]); circle(c, -150, -92 + dy, 15); circle(c, -205, -92 + dy, 11);
      poly(c, [[-44, -34 + dy], [2, -2], [-44, -2]]); c.rect(-52, -86 + dy, 12, 14);
    }, C.ink);
    F(ctx, (c) => { c.rect(-308, -102 + dy, 22, 26); c.rect(-280, -102 + dy, 20, 26); circle(c, -42, -79 + dy, 8); }, C.gold);
    F(ctx, (c) => { c.rect(-430, -44 + dy, 96, 4); c.rect(-250, -62 + dy, 200, 3); }, C.cream);
    for (const wx of [-405, -360]) wheel(ctx, wx, -13, 13);
    wheel(ctx, -58, -12, 12);
    for (const wx of [-122, -177, -232]) wheel(ctx, wx, -24, 24, a, true);
    // the coupling rod rides round with the wheels, and the piston rod follows it
    const rx = Math.cos(a) * 13, ry = Math.sin(a) * 13;
    ctx.strokeStyle = C.cream; ctx.lineCap = 'round'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-232 + rx, -24 + ry); ctx.lineTo(-122 + rx, -24 + ry); ctx.stroke();
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-122 + rx, -24 + ry); ctx.lineTo(-74, -26); ctx.stroke();
    F(ctx, (c) => c.rect(-92, -34, 30, 16), C.ink);
  }
  ctx.restore();

  // causeway: the rail, the ballast and the stone edge down to the water
  F(ctx, (c) => c.rect(-20, TY - 3, W + 40, WY - TY + 12), C.ink);
  { const s = V * t; ctx.save(); ctx.strokeStyle = C.deep; ctx.lineWidth = 6; ctx.setLineDash([26, 30]); ctx.lineDashOffset = s; ctx.beginPath(); ctx.moveTo(-60, TY + 16); ctx.lineTo(W + 60, TY + 16); ctx.stroke(); ctx.restore(); }

  // lake: bands that slide back faster the nearer they are, the train's windows, the moon's path
  for (let j = 0; j < G.POOL; j++) {
    const b = G.band(j), s = -(V * (0.25 + 0.75 * b.u)) * t, e = [];
    for (let x = -20; x <= W + 20; x += 10) e.push([x, b.y0 - (j ? b.amp * Math.sin(((x - s) / b.lam) * TAU) + 2 * osc(p, 4 + (j % 3), j * 0.17) : 0)]);
    F(ctx, (c) => { c.moveTo(e[0][0], e[0][1]); for (const q of e) c.lineTo(q[0], q[1]); c.lineTo(W + 20, H + 60); c.lineTo(-20, H + 60); c.closePath(); }, j % 3 === 2 ? C.teal : j % 2 ? C.navy : C.deep);
    if (!j) continue;
    ctx.save(); ctx.beginPath(); ctx.moveTo(e[0][0], e[0][1] + 6); for (const q of e) ctx.lineTo(q[0], q[1] + 6 + 5 * b.u);
    ctx.strokeStyle = C.cream; ctx.lineWidth = 2 + 2.5 * b.u; ctx.lineCap = 'round'; ctx.setLineDash([b.lam * 0.2, b.lam * 0.8]); ctx.lineDashOffset = s + j * 97; ctx.stroke(); ctx.restore();
  }
  ctx.save(); ctx.strokeStyle = C.gold; ctx.lineCap = 'round';
  for (let k = 0; k < 4; k++) {
    const y = WY + 14 + k * (15 + k * 4), on = 24 - 5 * k, wob = 5 * Math.sin(t * 2.3 + k * 1.9) + 3 * Math.sin(t * 5.1 + k);
    ctx.lineWidth = 6 - k * 0.6; ctx.setLineDash([on * big, (38 - on) * big]); ctx.lineDashOffset = -(x0 - (436 + 316) * big) % (38 * big) - wob;
    ctx.beginPath(); ctx.moveTo(-30, y); ctx.lineTo(x0 - 450 * big, y); ctx.stroke();
  }
  ctx.restore();
  { const span = H - WY, r = (k) => hash(k, 9);
    for (let k = 0; k < 14; k++) { const y = WY + 22 + (k / 14) * span * 0.8, a = 0.5 + 0.5 * osc(p, 5 + (k % 5), r(k)), w = (22 + k * 9) * (0.5 + 0.8 * r(k + 40)) * (0.5 + 0.9 * a); F(ctx, (c) => pill(c, mx + (r(k + 80) - 0.5) * (10 + k * 5) + 4 * osc(p, 3, r(k)) - w / 2, y - 4, w, 8), C.gold); } }

  // reeds on the near shore whip past
  { const s = V * 1.6 * t;
    F(ctx, (c) => along(s, W, 120, 200, (x, i) => {
      if (hash(i, 2) < 0.35) return;
      const n = 3 + Math.floor(hash(i, 3) * 4);
      for (let k = 0; k < n; k++) { const h = (70 + 150 * hash(i, 10 + k)) * big, bx = x + k * 13, lean = (hash(i, 20 + k) - 0.75) * 0.5 * h + 6 * osc(p, 9, hash(i, 30 + k)); c.moveTo(bx - 5, H + 10); c.quadraticCurveTo(bx + lean * 0.2, H - h * 0.6, bx + lean, H + 10 - h); c.quadraticCurveTo(bx + 5 + lean * 0.2, H - h * 0.6, bx + 5, H + 10); c.closePath(); }
    }), C.ink);
  }
}
