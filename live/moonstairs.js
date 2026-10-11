// Dreamscapes No. 04: a winding, endlessly ascending stairway to the moon.
import { frac, makeWorld, box, disc, oval, polygon, line, stars, clouds, sprig } from './dream-kit.js?v=20261011-dreamscapes';
export const title = 'Moon Stairs', no = 'No. 04', dark = '#1f304b', text = '#1f304b', audio = 'aurora', grain = true;
export const make = (W, H) => makeWorld(W, H, 81);
const K = { sky: '#24344f', halo: '#344966', blue: '#465f78', dark: '#283c55', step: '#77949b', alternate: '#668590',
  riser: '#4c697e', edge: '#a7b3ac', moon: '#d8c397', crater: '#c3ac86', gold: '#dabb83', leaf: '#19343e' };
function stepAt(q, G) {
  const { W, H, S } = G, f = Math.max(0, 1 - q);
  return { x: W * .60 + Math.sin(q * 7.2 + .4) * S * .30 * f,
    y: H * .21 + H * .91 * f ** 1.72, width: S * (.48 * f ** .87 + .006) };
}
export function paint(c, p, t, G) {
  const { W, H, S } = G, count = 28, travel = t / 19, phase = frac(travel), birth = Math.floor(travel);
  c.save(); box(c, 0, 0, W, H, K.sky);
  const mx = W * .60, my = H * .21, mr = S * .23;
  disc(c, mx, my, mr * 1.86, K.halo); disc(c, mx, my, mr * 1.43, K.blue);
  stars(c, G, t, K.edge, .91);
  disc(c, mx, my, mr, K.moon);
  // Broad, quiet crater shapes are printed in a second ink, with little etched arcs.
  for (const [xx, yy, r] of [[-.34,-.31,.20],[.29,.29,.25],[.48,-.23,.13],[-.18,.41,.12]]) {
    oval(c, mx + xx * mr, my + yy * mr, mr * r, mr * r * .78, K.crater, .2);
    c.beginPath(); c.ellipse(mx + xx * mr, my + yy * mr, mr * r * .78, mr * r * .58, .2, .3, 2.7);
    c.strokeStyle = K.moon; c.lineWidth = S * .0018; c.stroke();
  }
  clouds(c, G, t, K.dark, 5, .61, 103);
  c.depthLayer?.('stairs');
  // A step advances continuously along the same curve, keeping its shade as
  // it travels. Entries and departures happen beyond the canvas or at the moon.
  for (let i = count - 1; i >= -3; i--) {
    const q = (i + phase) / count;
    if (q >= 1) continue;
    const here = stepAt(q, G), next = stepAt(Math.min(1, q + 1 / count), G);
    const gap = here.y - next.y, depth = gap * .64;
    const ink = (birth - i) % 2 ? K.step : K.alternate;
    polygon(c, [[here.x - here.width / 2, here.y], [here.x + here.width / 2, here.y],
      [here.x + here.width / 2, here.y + depth], [here.x - here.width / 2, here.y + depth]], K.riser);
    polygon(c, [[here.x - here.width / 2, here.y], [here.x + here.width / 2, here.y],
      [next.x + next.width / 2, here.y - gap * .43], [next.x - next.width / 2, here.y - gap * .43]], ink);
    line(c, z => { z.moveTo(here.x - here.width / 2, here.y); z.lineTo(here.x + here.width / 2, here.y); }, K.edge, S * (.0007 + Math.max(0, 1 - q) * .0018));
    if (q < .80) for (const offset of [-.28, .29]) line(c, z => {
      z.moveTo(here.x + here.width * offset, here.y + depth * .35);
      z.lineTo(here.x + here.width * offset + here.width * .08, here.y + depth * .35);
    }, K.dark, S * .0012 * Math.max(.1, 1 - q));
  }
  c.depthLayer?.('handrails');
  for (const side of [-1, 1]) {
    // Thin brass rails follow the changing path and scale away into the distance.
    line(c, z => {
      for (let j = 0; j <= 96; j++) {
        const q = j / 96 * .988, point = stepAt(q, G), x = point.x + side * point.width * .52, y = point.y - point.width * .24;
        j ? z.lineTo(x, y) : z.moveTo(x, y);
      }
    }, K.gold, S * .0019);
    for (let i = 0; i < count - 1; i++) {
      if ((birth - i) % 2) continue;
      const q = (i + phase) / count, point = stepAt(q, G), x = point.x + side * point.width * .52;
      line(c, z => { z.moveTo(x, point.y); z.lineTo(x, point.y - point.width * .24); }, K.gold, S * .0016 * Math.max(.25, 1 - q));
      disc(c, x, point.y - point.width * .24, S * .0015 * Math.max(.3, 1 - q), K.edge);
    }
  }
  // Wisps sit beneath the stairs; a slow reversal makes the atmosphere breathe.
  c.save(); c.globalAlpha = .35;
  for (let j = 0; j < 3; j++) {
    const yy = H * (.60 + j * .18) + Math.sin(t * .017 + j) * S * .025;
    oval(c, W * (.20 + j * .31), yy, S * .38, S * .018, K.blue);
  }
  c.restore();
  c.depthLayer?.('night-leaves');
  sprig(c, W * .04, H * 1.03, S * .29, t, '#355666', K.leaf, 43);
  sprig(c, W * .98, H * 1.05, S * .20, t, '#355666', K.leaf, 55);
  c.restore();
}
