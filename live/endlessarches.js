// Dreamscapes No. 02: an endless arcade floats above a cloud sea.
import { frac, makeWorld, box, disc, polygon, line, archRing, archJoints, cloud } from './dream-kit.js?v=20261019-after-hours-detail';
export const title = 'Endless Arches', no = 'No. 02', dark = '#363146', text = '#363146', audio = 'mesa', grain = true;
export const make = (W, H) => makeWorld(W, H, 51);
const K = { sky: '#596578', horizon: '#7e8893', cloud: '#a9a79f', pale: '#cfbeb0', rose: '#a77272',
  terracotta: '#b78275', light: '#d0a18a', dark: '#654f5e', floor: '#7e626b', joint: '#76505a' };
export function paint(c, p, t, G) {
  const { W, H, S } = G, travel = t / 20, phase = frac(travel), born = Math.floor(travel);
  const cx = W * .5, vanishing = H * .53;
  c.save(); box(c, 0, 0, W, H, K.sky);
  disc(c, W * .64, H * .26, S * .22, K.horizon); disc(c, W * .64, H * .26, S * .13, K.pale);
  box(c, 0, vanishing, W, H - vanishing, K.horizon);
  for (let layer = 0; layer < 3; layer++) {
    const yy = vanishing + S * (.04 + layer * .075);
    c.beginPath(); c.moveTo(-S, H + S);
    for (let i = 0; i <= 64; i++) {
      const f = i / 64, xx = f * (W + S * 2) - S;
      c.lineTo(xx, yy + Math.sin(f * 13 + layer * .7 - t * .12) * S * .034 + Math.sin(f * 27 - t * .19) * S * .009);
    }
    c.lineTo(W + S, H + S); c.closePath(); c.fillStyle = [K.cloud, K.pale, '#bcb8ab'][layer]; c.fill();
  }
  // The narrow suspended walkway opens out as it approaches the viewer.
  polygon(c, [[cx - S * .04, vanishing], [cx + S * .04, vanishing], [cx + S * 1.28, H + S], [cx - S * 1.28, H + S]], K.floor);
  for (let i = 13; i >= -3; i--) {
    const z = Math.exp(-(i - phase) * .34), yy = vanishing + S * .78 * z, width = S * .85 * z;
    if (yy > H + S * .14) continue;
    box(c, cx - width, yy, width * 2, S * .008 * z, K.light);
    // Fine seams between the alternating diamond-cut floor tiles.
    for (let j = -3; j < 3; j++) {
      const xx = cx + width * j / 3, yy2 = vanishing + S * .78 * z * Math.exp(-.34);
      line(c, q => { q.moveTo(xx, yy); q.lineTo(cx + width * j / 3 * Math.exp(-.34), yy2); }, K.dark, S * .0018 * z);
    }
  }
  // Perspective is made entirely from flat, coloured outlines. Reindexing
  // equal arches at the edge of the camera makes the forward motion continuous.
  for (let i = 9; i >= -2; i--) {
    const z = Math.exp(-(i - phase) * .34), w = S * 1.35 * z, h = S * 1.66 * z;
    const bottom = vanishing + S * .86 * z, y = bottom - h, x = cx - w / 2, jamb = w * .105;
    const birth = born + i, ink = i > 6 ? K.horizon : birth % 2 ? K.rose : K.terracotta;
    if (i === 3) c.depthLayer?.('middle-arches');
    if (i === 0) c.depthLayer?.('near-arches');
    archRing(c, x - jamb * .12, y - jamb * .12, w + jamb * .24, h + jamb * .12, jamb * 1.15, K.dark);
    archRing(c, x, y, w, h, jamb, ink);
    if (i <= 6) {
      archJoints(c, x, y, w, h, jamb, K.joint, S * z);
      // Capitals, thin inset faces and worn plinths give every arch its own detail.
      const spring = y + w / 2;
      for (const xx of [x, x + w - jamb]) {
        box(c, xx + jamb * .23, spring + jamb * .28, jamb * .16, Math.max(0, h - w / 2 - jamb * .68), K.light);
        box(c, xx - jamb * .16, spring - jamb * .08, jamb * 1.32, jamb * .21, K.light);
        box(c, xx - jamb * .23, bottom - jamb * .23, jamb * 1.46, jamb * .23, K.dark);
        box(c, xx - jamb * .14, bottom - jamb * .27, jamb * 1.28, jamb * .12, K.light);
        for (let j = 0; j < 3; j++) line(c, q => { const yy = spring + jamb * (1.0 + j * 1.17);
          q.moveTo(xx + jamb * .56, yy); q.lineTo(xx + jamb * .78, yy); }, K.dark, S * .0014 * z);
      }
      // A small carved keystone interrupts the radiating masonry seams.
      polygon(c, [[cx - jamb * .28, y + jamb * .05], [cx + jamb * .28, y + jamb * .05],
        [cx + jamb * .18, y + jamb * .80], [cx - jamb * .18, y + jamb * .80]], K.light);
      line(c, q => { q.moveTo(cx, y + jamb * .17); q.lineTo(cx, y + jamb * .54); }, K.joint, S * .0015 * z);
    }
  }
  // Wisps move below the walkway at a separate speed from the advancing arches.
  for (const [side, offset] of [[-1, 0], [1, 1.8]]) {
    const x = cx + side * S * (.69 + Math.sin(t * .14 + offset) * .12);
    cloud(c, x, H * .86, S * .49, S * .10, K.pale);
  }
  c.restore();
}
