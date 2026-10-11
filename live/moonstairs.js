// Dreamscapes No. 04: a winding, endlessly ascending stairway to the moon.
import { frac, makeWorld, box, disc, oval, polygon, line, stars, clouds, sprig } from './dream-kit.js?v=20261011-dreamscapes-motion';
export const title = 'Moon Stairs', no = 'No. 04', dark = '#1f304b', text = '#1f304b', audio = 'aurora', grain = true;
export const make = (W, H) => makeWorld(W, H, 81);
const K = { sky: '#24344f', halo: '#344966', blue: '#465f78', dark: '#283c55', step: '#77949b', alternate: '#668590',
  riser: '#4c697e', edge: '#a7b3ac', moon: '#d8c397', crater: '#c3ac86', gold: '#dabb83', leaf: '#19343e' };
function stepAt(q, G) {
  const { W, H, S } = G, f = Math.max(0, 1 - q);
  return { x: W * .60 + Math.sin(q * 6.2 + .1) * S * .26 * f ** 1.3,
    y: H * .21 + H * .90 * f ** 1.63, width: S * (.50 * f ** .83 + .005) };
}
function track(c, G) {
  const points = Array.from({ length: 99 }, (_, j) => stepAt(-.08 + j / 98 * 1.08, G));
  polygon(c, [...points.map(s => [s.x - s.width * .50, s.y]),
    ...points.slice().reverse().map(s => [s.x + s.width * .50, s.y])], K.dark);
  for (const side of [-1, 1]) {
    // Stationary stringers and rail posts give the moving treads a fixed frame
    // of reference. The stairway itself never sways with their movement.
    polygon(c, [...points.map(s => [s.x + side * s.width * .50, s.y]),
      ...points.slice().reverse().map(s => [s.x + side * s.width * .59, s.y + s.width * .08])], side < 0 ? K.riser : K.dark);
    line(c, q => { points.forEach((s, j) => j ? q.lineTo(s.x + side * s.width * .50, s.y) : q.moveTo(s.x + side * s.width * .50, s.y)); }, K.edge, G.S * .002);
  }
}
export function paint(c, p, t, G) {
  const { W, H, S } = G, count = 26, travel = t / 2.2, phase = frac(travel), birth = Math.floor(travel);
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
  clouds(c, G, t * 6, K.dark, 5, .61, 103);
  c.depthLayer?.('stairs');
  track(c, G);
  // One new tread enters every 2.2 seconds. Each travels steadily up the fixed
  // track and shrinks in perspective until it disappears into the moon.
  // Reindexing preserves its ink, so the endless belt never resets visibly.
  for (let i = count - 1; i >= -3; i--) {
    const q = (i + phase) / count;
    if (q >= 1) continue;
    const here = stepAt(q, G), next = stepAt(Math.min(1, q + 1 / count), G);
    const gap = here.y - next.y, depth = gap * .28;
    const ink = (birth - i) % 2 ? K.step : K.alternate;
    polygon(c, [[here.x - here.width / 2, here.y], [here.x + here.width / 2, here.y],
      [here.x + here.width / 2, here.y + depth], [here.x - here.width / 2, here.y + depth]], K.riser);
    polygon(c, [[here.x - here.width / 2, here.y], [here.x + here.width / 2, here.y],
      [next.x + next.width / 2, next.y + depth], [next.x - next.width / 2, next.y + depth]], ink);
    line(c, z => { z.moveTo(here.x - here.width / 2, here.y); z.lineTo(here.x + here.width / 2, here.y); }, K.edge, S * (.0007 + Math.max(0, 1 - q) * .0018));
    // Fine grooves travel with the tread, reinforcing the escalator direction.
    if (q < .78) for (const offset of [-.34, -.17, 0, .17, .34]) line(c, z => {
      z.moveTo(here.x + here.width * offset, here.y - gap * .08);
      z.lineTo(next.x + next.width * offset, next.y + depth + gap * .08);
    }, K.riser, S * .0011 * Math.max(.1, 1 - q));
  }
  c.depthLayer?.('handrails');
  for (const side of [-1, 1]) {
    // Rails and posts stay still while the treads pass underneath.
    line(c, z => {
      for (let j = 0; j <= 96; j++) {
        const q = j / 96 * .988, point = stepAt(q, G), x = point.x + side * point.width * .56, y = point.y - point.width * .24;
        j ? z.lineTo(x, y) : z.moveTo(x, y);
      }
    }, K.gold, S * .0019);
    for (let i = 0; i < 15; i++) {
      const q = i / 15, point = stepAt(q, G), x = point.x + side * point.width * .56;
      line(c, z => { z.moveTo(x, point.y); z.lineTo(x, point.y - point.width * .24); }, K.gold, S * .0016 * Math.max(.25, 1 - q));
      disc(c, x, point.y - point.width * .24, S * .0015 * Math.max(.3, 1 - q), K.edge);
    }
  }
  // Wisps cross below the stairs at different speeds, wrapping offscreen.
  c.save(); c.globalAlpha = .35;
  for (let j = 0; j < 3; j++) {
    const yy = H * (.60 + j * .18) + Math.sin(t * .14 + j) * S * .025;
    const xx = frac(.20 + j * .31 + t * (.008 + j * .002)) * (W + S * .9) - S * .45;
    oval(c, xx, yy, S * .38, S * .018, K.blue);
  }
  c.restore();
  c.depthLayer?.('night-leaves');
  sprig(c, W * .04, H * 1.03, S * .29, t * 6, '#355666', K.leaf, 43);
  sprig(c, W * .98, H * 1.05, S * .20, t * 6, '#355666', K.leaf, 55);
  c.restore();
}
