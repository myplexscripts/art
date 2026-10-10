// Small drawing primitives shared by the original Music Series.
export const TAU = Math.PI * 2;
export const paper = '#f2e5c3';
export function makeRoom(W, H) { return { W, H, s: Math.min(W / 1000, H / 920) }; }
export function box(c, x, y, w, h, ink, r = 0) {
  c.beginPath(); c.roundRect(x, y, w, h, r); c.fillStyle = ink; c.fill();
}
export function disc(c, x, y, r, ink) {
  c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = ink; c.fill();
}
export function oval(c, x, y, rx, ry, ink, angle = 0) {
  c.beginPath(); c.ellipse(x, y, rx, ry, angle, 0, TAU); c.fillStyle = ink; c.fill();
}
export function stroke(c, draw, ink, width = 3) {
  c.beginPath(); draw(c); c.strokeStyle = ink; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
}
export function polygon(c, points, ink) {
  c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fillStyle = ink; c.fill();
}
export function word(c, text, x, y, size, ink, align = 'left') {
  c.fillStyle = ink; c.font = `bold ${size}px "Arial Narrow", Arial, sans-serif`; c.textAlign = align; c.fillText(text, x, y);
}
export function knob(c, x, y, r, t, ink, lineInk = paper) {
  disc(c, x, y, r + 3, lineInk); disc(c, x, y, r, ink);
  const a = -.8 + Math.sin(t * .24 + x) * .5;
  stroke(c, p => { p.moveTo(x, y); p.lineTo(x + Math.sin(a) * r * .7, y - Math.cos(a) * r * .7); }, lineInk, 3);
}
