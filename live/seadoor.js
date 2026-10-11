// Dreamscapes No. 01: a freestanding stone doorway contains an entire moonlit sea.
import { TAU, hash, makeWorld, box, disc, oval, polygon, line, archPath, archRing, archJoints, stars, clouds, grass } from './dream-kit.js?v=20261011-dreamscapes';
export const title = 'Sea Door', no = 'No. 01', dark = '#222c43', text = '#222c43', audio = 'beach', grain = true;
export const make = (W, H) => makeWorld(W, H, 41);
const K = { sky: '#313b53', mist: '#49536a', far: '#686470', sand: '#92786d', dune: '#b18b71', light: '#d5b18a',
  stone: '#bb8e78', joint: '#805953', edge: '#77565a', night: '#172c40', sea: '#244a59', water: '#387281', moon: '#e6c785', leaf: '#263b40' };
export function paint(c, p, t, G) {
  const { W, H, S } = G;
  c.save(); box(c, 0, 0, W, H, K.sky);
  disc(c, W * .22, H * .24, S * .32, K.mist);
  disc(c, W * .22, H * .24, S * .21, '#626679');
  disc(c, W * .22, H * .24, S * .115, K.light);
  stars(c, G, t, K.moon, .58); clouds(c, G, t, K.mist, 5, .34, 15);
  // Distant dunes have distinct edges, rather than a shaded or embossed surface.
  for (let j = 0; j < 3; j++) {
    c.beginPath(); c.moveTo(-S * .10, H);
    for (let i = 0; i <= 48; i++) {
      const f = i / 48, xx = f * (W + S * .20) - S * .10;
      const yy = H * (.58 + j * .08) + Math.sin(f * 5.5 + j * 1.8) * S * (.065 + j * .018);
      c.lineTo(xx, yy);
    }
    c.lineTo(W + S, H); c.closePath(); c.fillStyle = [K.far, K.sand, K.dune][j]; c.fill();
  }
  const dh = Math.min(H * .64, S * 1.34), dw = dh * .49, x = W * .51 - dw / 2, y = H * .79 - dh, jamb = dw * .105;
  c.depthLayer?.('door-shadow');
  const sweep = Math.sin(t * .024) * S * .07;
  polygon(c, [[x - jamb, y + dh], [x + dw + jamb, y + dh], [x + dw * .77 + sweep, H + S * .12], [x - dw * 1.06 + sweep, H + S * .12]], '#775e62');
  // A second flat plane and an inner reveal give the stonework a readable edge.
  const ox = x - jamb, oy = y - jamb, ow = dw + 2 * jamb, oh = dh + jamb;
  archRing(c, ox + jamb * .39, oy + jamb * .12, ow, oh, jamb * 1.08, K.edge);
  const aperture = archPath(x, y, dw, dh);
  c.save(); c.clip(aperture); box(c, x, y, dw, dh, K.night);
  const mx = x + dw * .63 + Math.sin(t * .02) * dw * .025, my = y + dh * .24;
  disc(c, mx, my, dw * .38, K.sea); disc(c, mx, my, dw * .25, K.water); disc(c, mx, my, dw * .105, K.moon);
  const horizon = y + dh * .51;
  polygon(c, [[x - 1, horizon], [x + dw * .12, horizon - dw * .07], [x + dw * .35, horizon - dw * .025],
    [x + dw * .55, horizon - dw * .10], [x + dw + 1, horizon - dw * .025], [x + dw + 1, y + dh], [x - 1, y + dh]], K.sea);
  // Ocean bands and fine broken wave crests remain inside the doorway.
  for (let j = 0; j < 13; j++) {
    const yy = horizon + (dh - (horizon - y)) * (j / 12) ** 1.2;
    c.beginPath(); c.moveTo(x - dw * .12, y + dh + 1);
    for (let i = 0; i <= 40; i++) {
      const f = i / 40, xx = x - dw * .12 + dw * 1.24 * f;
      c.lineTo(xx, yy + Math.sin(f * TAU * 1.7 - t * .15 + j * .64) * dw * (.006 + j * .0008));
    }
    c.lineTo(x + dw * 1.12, y + dh + 1); c.closePath(); c.fillStyle = j % 2 ? K.sea : K.water; c.fill();
    if (j > 1) {
      c.save(); c.setLineDash([dw * .055, dw * .095]); c.lineDashOffset = -t * dw * .007 - j * dw * .026;
      line(c, q => { for (let i = 0; i <= 40; i++) { const f = i / 40, xx = x - dw * .12 + dw * 1.24 * f;
        const py = yy + Math.sin(f * TAU * 1.7 - t * .15 + j * .64) * dw * (.006 + j * .0008); i ? q.lineTo(xx, py) : q.moveTo(xx, py); } }, '#98b4b0', S * .0012); c.restore();
    }
  }
  for (let i = 0; i < 16; i++) {
    const f = i / 16, xx = mx + Math.sin(i * 2.31 + t * .12) * dw * f * .13, yy = horizon + f * (y + dh - horizon);
    box(c, xx - dw * (.018 + f * .07), yy, dw * (.036 + f * .14), S * .0024, K.moon, S * .0012);
  }
  // A tiny skiff quietly gives scale to the impossible view.
  const bx = x + dw * (.35 + Math.sin(t * .022) * .13), by = horizon + dh * .033 + Math.sin(t * .15) * S * .0013;
  polygon(c, [[bx - dw * .046, by], [bx + dw * .046, by], [bx + dw * .027, by + dw * .012], [bx - dw * .029, by + dw * .012]], K.night);
  polygon(c, [[bx, by - dw * .087], [bx, by - dw * .005], [bx + dw * .041, by - dw * .005]], '#d9c7a4');
  c.restore();
  c.depthLayer?.('stone-door');
  archRing(c, ox, oy, ow, oh, jamb, K.stone); archJoints(c, ox, oy, ow, oh, jamb, K.joint, S);
  for (const xx of [ox, x + dw]) {
    box(c, xx - jamb * .15, y + ow * .45, jamb * 1.30, jamb * .19, K.light);
    box(c, xx - jamb * .20, y + dh - jamb * .28, jamb * 1.40, jamb * .28, K.edge);
  }
  // Worn threshold, three stone treads and a warm line of reflected moonlight.
  for (let i = 0; i < 3; i++) {
    const yy = y + dh + i * jamb * .28, ww = ow + i * jamb * .44;
    box(c, W * .51 - ww / 2, yy, ww, jamb * .32, i % 2 ? K.sand : K.light);
    box(c, W * .51 - ww / 2, yy + jamb * .22, ww, jamb * .14, K.edge);
    line(c, q => { q.moveTo(W * .51 - ww * .43, yy + jamb * .05); q.lineTo(W * .51 + ww * .44, yy + jamb * .05); }, K.stone, S * .0014);
  }
  // Fine sand contours bend around the threshold, with no added noise or grain.
  for (let j = 0; j < 8; j++) line(c, q => {
    const yy = H * .84 + j * S * .031;
    q.moveTo(-S * .05, yy); q.bezierCurveTo(W * .26, yy - S * .04, W * .54, yy + S * .08, W + S * .05, yy + S * .02);
  }, j % 2 ? K.sand : K.light, S * .0014);
  c.depthLayer?.('desert-grass');
  grass(c, W * .08, H * .97, S * .18, t, K.leaf, 13); grass(c, W * .91, H * .94, S * .12, t, K.leaf, 25);
  for (let i = 0; i < 9; i++) {
    const xx = W * (.07 + hash(i, 73) * .88), yy = H * (.82 + hash(i, 75) * .17);
    oval(c, xx, yy, S * (.007 + hash(i, 79) * .006), S * .0035, i % 2 ? K.sand : K.edge, -.12);
  }
  c.restore();
}
