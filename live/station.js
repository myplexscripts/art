// Orbit Series No. 03: Space Station. A wheel station turns steadily above the curved limb of a blue planet. The planet
// is one huge circle whose centre is far below the frame; its cloud bands are arcs about that centre, placed along
// endless strips of angle, each strip sliding at its own speed. A sun rises and sets over the limb at the left inside
// flat rings and rays, a shuttle comes and goes in time slots, and small satellites drift across.
import { mulberry, lerp, clamp, osc, sway, noise1, poly, circle, pill, TAU } from './geom.js';
import { C, F } from './kit.js';
import { hash, el, makeStars, paintStars, meteor } from './bits.js';

export const title = 'SPACE STATION', no = 'No. 03', text = '#101a3c', dark = '#060a1c';
const S = { sky: '#070b20', s1: '#0d1436', s2: '#152050', s3: '#1f2f6c', air: '#7cc4d6', air2: '#2a4f8c', night: '#0a1634', shade: '#c5b48c', panel: '#2c5f9a', ink: '#0a1024' };
const nT = noise1(1401);
// cloud bands as [depth below the limb, thickness, ink, units per second on a planet of radius 1900, angle step]
const BANDS = [[46, 12, C.teal, 10, 0.05], [100, 22, C.cream, 16, 0.07], [165, 30, C.blue, 12, 0.09], [240, 26, C.cream, 21, 0.1], [330, 46, C.teal, 15, 0.12], [450, 40, C.blue, 26, 0.13], [570, 60, C.teal, 19, 0.15]];

export function make(W, H) {
  const tall = clamp((1500 - W) / 400), big = 1 + 0.3 * tall;
  const HY = Math.round(H * (0.73 + 0.03 * tall));              // the top of the planet's limb
  const RP = Math.max(W * 0.95, 1900);
  const PL = { x: W * 0.44, y: HY + RP, R: RP };
  const limbY = (x) => PL.y - Math.sqrt(RP * RP - (x - PL.x) ** 2);
  const RW = clamp(Math.min(W * 0.17, HY * 0.36), 150, 260);
  const ST = { x: W * (0.57 - 0.07 * tall), y: HY * (0.47 - 0.03 * tall), R: RW };
  const sx = W * (0.15 + 0.03 * tall);
  const SUN = { x: sx, y: limbY(sx), r: 44 * big };
  const STARS = makeStars(73, clamp(Math.round((W * HY) / 5200), 150, 380), W, HY + 60);
  return { W, H, HY, tall, big, PL, limbY, ST, SUN, STARS };
}

function station(ctx, R, t) {
  const a = t * 0.11;                                           // one turn in about a minute
  // the far end of the axle, behind the wheel, carries the solar panels
  F(ctx, (c) => { c.rect(-5, -R * 1.22, 10, R * 1.22); c.rect(-R * 0.84, -R * 1.03, R * 1.68, 6); }, S.shade);
  F(ctx, (c) => { for (const sd of [-1, 1]) c.rect(sd * R * 0.52 - R * 0.34, -R * 1.14, R * 0.68, R * 0.26); }, S.panel);
  F(ctx, (c) => { for (const sd of [-1, 1]) { for (let k = 1; k < 4; k++) c.rect(sd * R * 0.52 - R * 0.34 + k * R * 0.17 - 1.5, -R * 1.14, 3, R * 0.26); c.rect(sd * R * 0.52 - R * 0.34, -R * 1.14, R * 0.68, 3); c.rect(sd * R * 0.52 - R * 0.34, -R * 0.88 - 3, R * 0.68, 3); } }, C.gold);
  F(ctx, (c) => circle(c, 0, -R * 1.22, 7), C.orange);
  // the wheel, seen at a slant: drawn as a circle in a squashed frame so that everything on it goes round with it
  ctx.save(); ctx.scale(1, 0.62);
  ctx.beginPath(); circle(ctx, 0, R * 0.09, R * 0.91); ctx.strokeStyle = S.shade; ctx.lineWidth = R * 0.18; ctx.stroke();
  ctx.rotate(a);
  F(ctx, (c) => { for (let k = 0; k < 3; k++) { const b = (k * Math.PI) / 3, cx = Math.cos(b), cy = Math.sin(b), w = R * 0.035; poly(c, [[-cx * R * 0.84 - cy * w, -cy * R * 0.84 + cx * w], [cx * R * 0.84 - cy * w, cy * R * 0.84 + cx * w], [cx * R * 0.84 + cy * w, cy * R * 0.84 - cx * w], [-cx * R * 0.84 + cy * w, -cy * R * 0.84 - cx * w]]); } }, S.shade);
  ctx.beginPath(); circle(ctx, 0, 0, R * 0.91); ctx.strokeStyle = C.cream; ctx.lineWidth = R * 0.18; ctx.stroke();
  ctx.beginPath(); circle(ctx, 0, 0, R * 0.985); ctx.strokeStyle = C.orange; ctx.lineWidth = R * 0.03; ctx.stroke();
  ctx.beginPath(); circle(ctx, 0, 0, R * 0.83); ctx.strokeStyle = S.shade; ctx.lineWidth = R * 0.025; ctx.stroke();
  // windows round the rim: most are lit, and a few go dark and come back as the hours pass
  const lit = (k) => hash(k, Math.floor(t / 37 + hash(k, 5) * 9)) > 0.24;
  F(ctx, (c) => { for (let k = 0; k < 30; k++) if (k % 5 !== 4 && lit(k)) { const b = (k * TAU) / 30; circle(c, Math.cos(b) * R * 0.905, Math.sin(b) * R * 0.905, R * 0.03); } }, C.gold);
  F(ctx, (c) => { for (let k = 0; k < 30; k++) if (k % 5 === 4 || !lit(k)) { const b = (k * TAU) / 30; if (k % 5 === 4) poly(c, [[Math.cos(b - 0.02) * R * 0.83, Math.sin(b - 0.02) * R * 0.83], [Math.cos(b + 0.02) * R * 0.83, Math.sin(b + 0.02) * R * 0.83], [Math.cos(b + 0.02) * R, Math.sin(b + 0.02) * R], [Math.cos(b - 0.02) * R, Math.sin(b - 0.02) * R]]); else circle(c, Math.cos(b) * R * 0.905, Math.sin(b) * R * 0.905, R * 0.03); } }, S.ink);
  F(ctx, (c) => circle(c, 0, 0, R * 0.24), C.orange);
  F(ctx, (c) => circle(c, 0, 0, R * 0.16), C.cream);
  F(ctx, (c) => { for (let k = 0; k < 6; k++) { const b = (k * TAU) / 6 + 0.5; circle(c, Math.cos(b) * R * 0.2, Math.sin(b) * R * 0.2, R * 0.018); } }, S.ink);
  ctx.restore();
  // the near end of the axle: the dock, an antenna dish and a beacon
  F(ctx, (c) => { c.rect(-4, 0, 8, R * 0.46); c.rect(-R * 0.09, R * 0.2, R * 0.18, R * 0.1); }, C.cream);
  F(ctx, (c) => { c.rect(-4, R * 0.46, 8, R * 0.16); c.rect(0, R * 0.2, R * 0.09, R * 0.1); }, S.shade);
  F(ctx, (c) => el(c, 0, R * 0.63, R * 0.13, R * 0.045), C.gold);
  const on = Math.pow(Math.max(0, Math.sin(t * 1.6)), 6);
  F(ctx, (c) => circle(c, 0, R * 0.7, 3.5 + 4 * on), on > 0.3 ? C.gold : C.orange);
}

// a small craft with two panels, turning slowly as it drifts
function satellite(ctx, x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  F(ctx, (c) => { c.rect(-27, -5, 20, 10); c.rect(7, -5, 20, 10); }, S.panel);
  F(ctx, (c) => { c.rect(-6, -6, 12, 12); c.rect(-1, -15, 2, 9); }, C.gold);
  F(ctx, (c) => { c.rect(-18, -5, 2, 10); c.rect(16, -5, 2, 10); circle(c, 0, -16, 3); }, C.cream);
  ctx.restore();
}

export function paint(ctx, p, t, G) {
  const { W, H, HY, big, PL, ST, SUN } = G, RP = PL.R;
  ctx.fillStyle = S.sky; ctx.fillRect(0, 0, W, H);

  // the sun climbs clear of the limb and sinks back behind it, about twelve minutes there and back
  const up = 0.5 - 0.5 * Math.cos((TAU * (t + 150)) / 720), sx = SUN.x, sy = SUN.y + SUN.r * 1.3 - SUN.r * 3.6 * up, sr = SUN.r;
  F(ctx, (c) => circle(c, sx, sy, sr * 9), S.s1);
  F(ctx, (c) => { for (let k = 0; k < 14; k++) { const b = (k * TAU) / 14 + t * 0.008, w = 0.055, L = sr * (13 + 4 * (k % 2)); c.moveTo(sx, sy); c.lineTo(sx + Math.cos(b - w) * L, sy + Math.sin(b - w) * L); c.lineTo(sx + Math.cos(b + w) * L, sy + Math.sin(b + w) * L); c.closePath(); } circle(c, sx, sy, sr * 5.6); }, S.s2);
  F(ctx, (c) => circle(c, sx, sy, sr * 3), S.s3);
  paintStars(ctx, G.STARS, p);
  meteor(ctx, t, W, HY * 0.7, 31, 12);
  F(ctx, (c) => circle(c, sx, sy, sr * 1.5), C.orange); F(ctx, (c) => circle(c, sx, sy, sr), C.gold); F(ctx, (c) => circle(c, sx, sy, sr * 0.62), C.cream);

  // satellites drift by, high and far
  for (const [slot, seed, dur] of [[61, 3, 46], [97, 8, 70]]) {
    const n = Math.floor(t / slot), q = mulberry(n * 7723 + seed), go = q() < 0.8, dir = q() < 0.5 ? -1 : 1, u = (t - n * slot - 1 - q() * (slot - dur - 2)) / dur, y0 = HY * (0.08 + 0.3 * q());
    if (go && u >= 0 && u <= 1) satellite(ctx, dir > 0 ? -50 + u * (W + 100) : W + 50 - u * (W + 100), y0 + HY * 0.06 * u, (0.8 + 0.5 * q()) * big, t * 0.07 * dir + seed);
  }

  // the planet: two thin lines of air, the globe, its bands, then the night side as one flat shape
  const px = PL.x + sway(p, 0.1), py = PL.y + 5 * osc(p, 2, 0.3);
  F(ctx, (c) => circle(c, px, py, RP + 20), S.air2); F(ctx, (c) => circle(c, px, py, RP + 8), S.air); F(ctx, (c) => circle(c, px, py, RP), C.deep);
  ctx.save(); ctx.beginPath(); circle(ctx, px, py, RP); ctx.clip();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const half = Math.asin(Math.min(1, (W * 0.62) / RP)) + 0.12;
  for (let j = 0; j < BANDS.length; j++) {
    const [d, th, fill, v, step] = BANDS[j], r = RP - d - th / 2, s = (v * t) / 1900 + j * 2.7;   // the turn must not depend on the size: RP grows with a wide window, and t / RP would then jump
    ctx.beginPath();
    for (let i = Math.floor((s - half) / step) - 1; i <= Math.ceil((s + half) / step); i++) {
      if (hash(i, j) < 0.3) continue;
      const a0 = -Math.PI / 2 + i * step - s + step * 0.3 * hash(i, j + 20), len = step * (0.3 + 0.55 * hash(i, j + 40));
      for (let k = 0; k <= 6; k++) { const b = a0 + (len * k) / 6, x = px + r * Math.cos(b), y = py + r * Math.sin(b); if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y); }   // short straight runs: a stroked arc this large loses its round ends
    }
    ctx.strokeStyle = fill; ctx.lineWidth = th; ctx.stroke();
  }
  F(ctx, (c) => circle(c, px + RP * (0.62 + 0.05 * Math.sin((TAU * t) / 720)), py + RP * 0.12, RP), S.night);
  ctx.restore();

  // the station
  const stx = ST.x + sway(p, 0.35), sty = ST.y + 6 * osc(p, 1, 0.2);
  ctx.save(); ctx.translate(stx, sty); ctx.rotate(-0.3 + 0.012 * osc(p, 2, 0.6)); station(ctx, ST.R, t); ctx.restore();

  // the shuttle: in one slot it arrives from the right and holds off the dock, in the next it leaves to the left
  { const slot = 80, n = Math.floor(t / slot), u = clamp((t - n * slot - 8) / 52), e = u * u * (3 - 2 * u), arriving = n % 2 === 0, s = 0.9 * big;
    const dock = [stx + ST.R * 0.45, sty + ST.R * 0.95], far = arriving ? [W + 120, dock[1] - HY * 0.2] : [-140, dock[1] + HY * 0.08];
    const x = arriving ? lerp(far[0], dock[0], e) : lerp(dock[0], far[0], e * e), y = (arriving ? lerp(far[1], dock[1], e) : lerp(dock[1], far[1], e * e)) + 3 * osc(p, 3, 0.4);
    ctx.save(); ctx.translate(x, y); ctx.rotate(arriving ? -0.12 * (1 - e) : 0.08 * e); ctx.scale(s, s);
    // a puff at the nose to brake on the way in, at the tail to push off on the way out
    const burn = arriving ? clamp((u - 0.45) * 5) * clamp((0.97 - u) * 12) : clamp(u * 8) * clamp((0.5 - u) * 4);
    if (burn > 0.05) { const at = arriving ? -50 : 52, dir = arriving ? -1 : 1;
      F(ctx, (c) => { for (let k = 0; k < 4; k++) circle(c, at + dir * (k * 9 + 5 * nT(t * 5 + k * 3)), -3 + 5 * nT(t * 4 + k * 7), burn * (8 - k * 1.2 + 2.5 * nT(t * 7 + k))); }, C.cream);
      F(ctx, (c) => circle(c, at + dir * 2, -3, burn * 5), C.gold); }
    F(ctx, (c) => poly(c, [[-44, -2], [-26, -11], [28, -11], [36, -26], [46, -26], [42, 0], [34, 7], [-28, 7]]), C.cream);
    F(ctx, (c) => { poly(c, [[-8, 3], [26, 3], [38, 17], [10, 17]]); poly(c, [[-28, 7], [34, 7], [42, 0], [-40, 0]]); }, S.shade);
    F(ctx, (c) => { poly(c, [[-34, -3], [-24, -8], [-16, -8], [-16, -3]]); c.rect(42, -8, 6, 12); }, S.ink);
    F(ctx, (c) => { c.rect(-8, -6, 30, 3); poly(c, [[37, -26], [46, -26], [45, -20], [35, -20]]); }, C.orange);
    ctx.restore(); }
}
