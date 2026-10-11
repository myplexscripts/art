// Shared drawing language for Dreamscapes: flat inks and small, authored details.
// Grain belongs to the gallery/viewer overlays, never to these paintings.
export const TAU = Math.PI * 2;
export const frac = n => n - Math.floor(n);
export const hash = (n, seed = 1) => frac(Math.sin(n * 127.1 + seed * 311.7) * 43758.5453);
export const clamp = (n, low = 0, high = 1) => Math.min(high, Math.max(low, n));
export function makeWorld(W, H, seed = 1) {
  const S = Math.min(W, H);
  return { W, H, S, stars: Array.from({ length: 38 }, (_, i) => ({ x: hash(i, seed) * W,
    y: hash(i, seed + 2) * H, r: S * (.001 + hash(i, seed + 3) * .0014), phase: hash(i, seed + 4) * TAU })) };
}
export function box(c, x, y, w, h, ink, radius = 0) {
  c.fillStyle = ink;
  if (!radius) { c.fillRect(x, y, w, h); return; }
  c.beginPath(); c.roundRect(x, y, w, h, radius); c.fill();
}
export function disc(c, x, y, r, ink) {
  c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = ink; c.fill();
}
export function oval(c, x, y, rx, ry, ink, angle = 0) {
  c.beginPath(); c.ellipse(x, y, rx, ry, angle, 0, TAU); c.fillStyle = ink; c.fill();
}
export function polygon(c, points, ink) {
  c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
  c.closePath(); c.fillStyle = ink; c.fill();
}
export function line(c, build, ink, width = 1) {
  c.beginPath(); build(c); c.strokeStyle = ink; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
}
export function archPath(x, y, w, h) {
  const path = new Path2D(), r = Math.min(w / 2, h);
  path.moveTo(x, y + h); path.lineTo(x, y + r);
  path.bezierCurveTo(x, y + r * .43, x + w * .22, y, x + w / 2, y);
  path.bezierCurveTo(x + w * .78, y, x + w, y + r * .43, x + w, y + r);
  path.lineTo(x + w, y + h); path.closePath(); return path;
}
export function arch(c, x, y, w, h, ink) { c.fillStyle = ink; c.fill(archPath(x, y, w, h)); }
export function archRing(c, x, y, w, h, thickness, ink) {
  const path = archPath(x, y, w, h);
  path.addPath(archPath(x + thickness, y + thickness, w - 2 * thickness, h - thickness + 1));
  c.fillStyle = ink; c.fill(path, 'evenodd');
}
export function archJoints(c, x, y, w, h, thickness, ink, S) {
  const r = w / 2, cy = y + r;
  for (let i = 1; i < 12; i++) {
    const a = Math.PI + i * Math.PI / 12;
    line(c, q => { q.moveTo(x + r + Math.cos(a) * (r - thickness), cy + Math.sin(a) * (r - thickness));
    q.lineTo(x + r + Math.cos(a) * r, cy + Math.sin(a) * r); }, ink, S * .003);
  }
  const rows = Math.max(2, Math.floor((h - r) / (w * .13)));
  for (let i = 0; i <= rows; i++) {
    const yy = cy + (h - r) * i / rows;
    for (const xx of [x, x + w - thickness]) line(c, q => { q.moveTo(xx, yy); q.lineTo(xx + thickness, yy); }, ink, S * .003);
  }
}
export function stars(c, G, t, ink, top = 1) {
  c.save();
  for (const s of G.stars) {
    if (s.y > G.H * top) continue;
    c.globalAlpha = .38 + .22 * Math.sin(t * .06 + s.phase);
    const r = s.r;
    polygon(c, [[s.x - r, s.y], [s.x - r * .22, s.y - r * .22], [s.x, s.y - r],
      [s.x + r * .22, s.y - r * .22], [s.x + r, s.y], [s.x + r * .22, s.y + r * .22],
      [s.x, s.y + r], [s.x - r * .22, s.y + r * .22]], ink);
  }
  c.restore();
}
export function cloud(c, x, y, w, h, ink) {
  c.beginPath(); c.moveTo(x - w / 2, y);
  c.bezierCurveTo(x - w * .48, y - h * .44, x - w * .28, y - h * .23, x - w * .23, y - h * .52);
  c.bezierCurveTo(x - w * .13, y - h, x + w * .10, y - h * .85, x + w * .15, y - h * .37);
  c.bezierCurveTo(x + w * .28, y - h * .58, x + w * .45, y - h * .29, x + w / 2, y);
  c.closePath(); c.fillStyle = ink; c.fill();
}
export function clouds(c, G, t, ink, count = 5, top = .6, seed = 2) {
  const { W, H, S } = G;
  for (let i = 0; i < count; i++) {
    const w = S * (.20 + hash(i, seed) * .50), span = W + 2 * w;
    const x = frac(hash(i, seed + 1) + t * (.0008 + hash(i, seed + 2) * .0005)) * span - w;
    cloud(c, x, H * (.08 + hash(i, seed + 3) * top), w, w * .10, ink);
  }
}
export function leaf(c, x, y, length, width, angle, ink, vein) {
  c.save(); c.translate(x, y); c.rotate(angle);
  c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-width, -length * .36, -width * .45, -length * .85, 0, -length);
  c.bezierCurveTo(width * .58, -length * .74, width, -length * .33, 0, 0); c.fillStyle = ink; c.fill();
  if (vein) line(c, q => { q.moveTo(0, -length * .12); q.quadraticCurveTo(width * .04, -length * .52, 0, -length * .85); }, vein, length * .025);
  c.restore();
}
export function sprig(c, x, y, size, t, ink, shade, seed = 2) {
  c.save(); c.translate(x, y); c.rotate(Math.sin(t * .10 + seed) * .026);
  for (let stem = 0; stem < 5; stem++) {
    const dx = (stem - 2) * size * .17, height = size * (.65 + hash(stem, seed) * .55);
    line(c, q => { q.moveTo(0, 0); q.quadraticCurveTo(dx * .44, -height * .52, dx, -height); }, shade, size * .019);
    for (let i = 0; i < 5; i++) {
      const f = .22 + i * .14, xx = dx * f, yy = -height * f;
      for (const side of [-1, 1]) leaf(c, xx, yy, size * (.20 + hash(i + stem * 7, seed + 1) * .15), size * .055,
        side * (.62 + i * .035), i % 2 ? ink : shade, shade);
    }
  }
  c.restore();
}
export function grass(c, x, y, size, t, ink, seed = 5) {
  for (let i = 0; i < 14; i++) {
    const xx = x + (hash(i, seed) - .5) * size * .70, height = size * (.3 + hash(i, seed + 1) * .55);
    const sway = Math.sin(t * .11 + i * .7) * size * .025;
    polygon(c, [[xx - size * .009, y], [xx + (hash(i, seed + 2) - .5) * size * .3 + sway, y - height], [xx + size * .016, y]], ink);
  }
}
export function ripples(c, x, y, width, height, t, ink, S, count = 7) {
  for (let i = 0; i < count; i++) {
    const f = (i + 1) / (count + 1), a = .5 + .5 * Math.sin(t * .17 - i * .7);
    const rx = width * f * (.90 + a * .025), ry = height * f;
    c.beginPath(); c.ellipse(x + Math.sin(t * .09 + i) * S * .003, y, rx, ry, 0, .12, Math.PI * 1.90);
    c.strokeStyle = ink; c.lineWidth = S * .0015; c.stroke();
  }
}
