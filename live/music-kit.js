// Small drawing primitives shared by the original Music Series.
import { FONT } from './kit.js?v=20261019-after-hours-detail';
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
  c.fillStyle = ink; c.font = `bold ${size}px ${FONT}`; c.textAlign = align; c.fillText(text, x, y);
}
export function knob(c, x, y, r, t, ink, lineInk = paper) {
  disc(c, x, y, r + 3, lineInk); disc(c, x, y, r, ink);
  const a = -.8 + Math.sin(t * .24 + x) * .5;
  stroke(c, p => { p.moveTo(x, y); p.lineTo(x + Math.sin(a) * r * .7, y - Math.cos(a) * r * .7); }, lineInk, 3);
}

export function hash(n, seed = 1) {
  const v = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

export function screw(c, x, y, radius, ink, highlight = paper) {
  disc(c, x + 1, y + 1, radius + 1, ink);
  disc(c, x, y, radius, highlight);
  stroke(c, p => { p.moveTo(x - radius * .52, y + radius * .4); p.lineTo(x + radius * .52, y - radius * .4); }, ink, Math.max(1, radius * .25));
}

export function wood(c, x, y, w, h, base, ink, vertical = false) {
  box(c, x, y, w, h, base);
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  c.globalAlpha *= .45;
  for (let i = 0; i < 30; i++) {
    const offset = (i + hash(i, 17) * .6) / 30;
    stroke(c, p => {
      for (let j = 0; j <= 25; j++) {
        const f = j / 25, ripple = Math.sin(f * 9 + i * .8) * .004 + Math.sin(f * 19 + i) * .0015;
        const px = x + w * (vertical ? offset + ripple : f), py = y + h * (vertical ? f : offset + ripple);
        j ? p.lineTo(px, py) : p.moveTo(px, py);
      }
    }, ink, i % 5 ? .8 : 1.7);
  }
  c.restore();
}

export function plant(c, x, y, size, t, ink = '#407570', shade = '#254e46', pot = '#b9653a') {
  c.save(); c.translate(x, y); c.scale(size, size);
  for (let j = 0; j < 7; j++) {
    const dx = (j - 3) * 17, height = 84 + hash(j, 12) * 95, sway = Math.sin(t * .21 + j) * 3;
    stroke(c, p => { p.moveTo(0, -20); p.quadraticCurveTo(dx * .3, -height * .7, dx + sway, -height); }, shade, 2);
    for (let k = 0; k < 4; k++) {
      const fy = -.28 - k * .16, px = dx * (-fy), py = height * fy;
      for (const side of [-1, 1]) {
        const length = 23 + hash(j * 9 + k, 15) * 20;
        c.beginPath(); c.moveTo(px, py);
        c.bezierCurveTo(px + side * length * .4, py - 22, px + side * length, py - 19, px + side * length, py - 6);
        c.quadraticCurveTo(px + side * length * .6, py + 9, px, py); c.fillStyle = k % 2 ? ink : shade; c.fill();
        stroke(c, p => { p.moveTo(px, py); p.lineTo(px + side * length * .8, py - 7); }, shade, 1);
      }
    }
  }
  oval(c, 0, -15, 44, 12, shade); polygon(c, [[-43,-15],[43,-15],[31,50],[-31,50]], pot);
  oval(c, 0, -15, 43, 9, pot); oval(c, 0, -17, 36, 6, shade);
  stroke(c, p => { p.moveTo(-31, 4); p.lineTo(-24, 38); }, paper, 2);
  c.restore();
}

export function steam(c, x, y, size, t, ink = paper) {
  c.save(); c.globalAlpha *= .20;
  for (let k = 0; k < 3; k++) {
    const left = [], right = [];
    for (let i = 0; i <= 18; i++) {
      const f = i / 18, xx = x + size * (Math.sin(f * 5 - t * .45 + k) * f * .18 + k * .12), yy = y - size * f;
      const w = size * .022 * Math.sin(Math.PI * f);
      left.push([xx - w, yy]); right.push([xx + w, yy]);
    }
    polygon(c, left.concat(right.reverse()), ink);
  }
  c.restore();
}

export function books(c, x, y, count, h, inks, labels = []) {
  let left = x;
  for (let i = 0; i < count; i++) {
    const w = 13 + hash(i, 2) * 20, hh = h * (.68 + hash(i, 3) * .32);
    box(c, left, y - hh, w - 2, hh, inks[i % inks.length], 1);
    box(c, left + 3, y - hh + 7, w - 8, 2, paper);
    box(c, left + 3, y - 9, w - 8, 1.5, paper);
    if (i % 3 === 0) {
      c.save(); c.translate(left + w * .64, y - 16); c.rotate(-Math.PI / 2);
      word(c, labels[i % labels.length] || 'STEREO', 0, 0, 7, paper); c.restore();
    }
    left += w;
  }
}
