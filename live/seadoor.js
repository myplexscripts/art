// Dreamscapes No. 01: a freestanding stone doorway contains an entire moonlit sea.
import { TAU, hash, makeWorld, box, disc, oval, polygon, line, archPath, archRing, archJoints, stars, clouds } from './dream-kit.js?v=20261013-after-hours';
import { frac, noise1 } from './geom.js?v=20261013-after-hours';
export const title = 'Sea Door', no = 'No. 01', dark = '#222c43', text = '#222c43', audio = 'beach', grain = true;
export const make = (W, H) => ({ ...makeWorld(W, H, 41), sand: Array.from({ length: 76 }, (_, i) => ({
  x: hash(i, 91), y: hash(i, 93), speed: .012 + hash(i, 97) * .013,
  length: .012 + hash(i, 101) * .027, phase: hash(i, 103) * TAU
})) });
const K = { sky: '#313b53', mist: '#49536a', far: '#686470', sand: '#92786d', dune: '#b18b71', light: '#d5b18a',
  stone: '#bb8e78', joint: '#805953', edge: '#77565a', night: '#172c40', sea: '#244a59', water: '#387281', moon: '#e6c785', leaf: '#263b40' };
const wind = noise1(741);

// Like Desert Mesa, wind carries flat ribbons and small trails over the ground.
// Their phase wraps only beyond the canvas; these are travelling sand, not grain.
function blowingSand(c, G, t, front = false) {
  const { W, H, S, sand } = G, pad = S * .10, span = W + 2 * pad;
  c.save();
  for (let i = front ? 40 : 0; i < (front ? sand.length : 40); i++) {
    const q = sand[i], u = frac(q.x + t * q.speed + Math.sin(t * .42 + q.phase) * .007);
    const x = u * span - pad, y = H * (front ? .85 + q.y * .13 : .68 + q.y * .13)
      - Math.sin(u * TAU * 1.2 + q.phase) * S * .012;
    const length = S * q.length * (1 + .32 * wind(t * .18 + q.phase));
    c.globalAlpha = front ? .64 : .49;
    line(c, p => { p.moveTo(x - length, y + S * .001); p.quadraticCurveTo(x - length * .4, y - S * .002, x, y); },
      i % 3 ? K.light : K.edge, S * (front ? .0017 : .0013));
  }
  // A few broader, low dust sheets move at different depths across the dunes.
  if (!front) for (let i = 0; i < 4; i++) {
    const w = S * (.21 + hash(i, 109) * .25), travel = W + w * 2;
    const x = frac(hash(i, 111) + t * (.008 + i * .0015)) * travel - w;
    const y = H * (.69 + i * .032) + Math.sin(t * .42 + i) * S * .004;
    c.globalAlpha = .29;
    box(c, x, y, w, S * .005, i % 2 ? K.light : K.sand, S * .0025);
  }
  c.restore();
}

// Rooted, curved blades bend together in the wind, with a travelling gust as in Gale.
function windGrass(c, x, y, size, t, seed) {
  c.beginPath();
  for (let i = 0; i < 18; i++) {
    const bx = x + (hash(i, seed) - .5) * size * .70;
    const height = size * (.30 + hash(i, seed + 1) * .55), width = size * (.012 + hash(i, seed + 4) * .009);
    const gust = .58 + .40 * wind(t * .18 + bx / size * .35);
    const lean = height * ((hash(i, seed + 2) - .36) * .52 + gust * .30
      + Math.sin(t * 1.1 - bx / size * 2.8) * .19 + Math.sin(t * 2.2 + i * .54) * .055);
    const ty = y - height * (1 - Math.min(.12, Math.abs(lean / height) * .16));
    c.moveTo(bx - width / 2, y);
    c.quadraticCurveTo(bx + lean * .18 - width / 2, y - height * .62, bx + lean, ty);
    c.quadraticCurveTo(bx + lean * .22 + width / 2, y - height * .59, bx + width / 2, y);
    c.closePath();
  }
  c.fillStyle = K.leaf; c.fill();
}

export function paint(c, p, t, G) {
  const { W, H, S } = G;
  c.save(); box(c, 0, 0, W, H, K.sky);
  disc(c, W * .22, H * .24, S * .32, K.mist);
  disc(c, W * .22, H * .24, S * .21, '#626679');
  disc(c, W * .22, H * .24, S * .115, K.light);
  stars(c, G, t, K.moon, .58);
  clouds(c, G, t * 5.5, K.mist, 4, .34, 15);
  clouds(c, G, t * 8.5, '#586278', 3, .27, 27);
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
  blowingSand(c, G, t);
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
    const waveY = f => yy + Math.sin(f * TAU * 1.7 - t * (.65 + j * .022) + j * .64) * dw * (.008 + j * .0016)
      + Math.sin(f * TAU * 3.3 + t * .32 + j * .83) * dw * .003
      + Math.sin(t * .72 + j * .49) * dw * .003;
    c.beginPath(); c.moveTo(x - dw * .12, y + dh + 1);
    for (let i = 0; i <= 40; i++) {
      const f = i / 40, xx = x - dw * .12 + dw * 1.24 * f;
      c.lineTo(xx, waveY(f));
    }
    c.lineTo(x + dw * 1.12, y + dh + 1); c.closePath(); c.fillStyle = j % 2 ? K.sea : K.water; c.fill();
    if (j > 1) {
      c.save(); c.setLineDash([dw * .055, dw * .095]); c.lineDashOffset = -t * dw * .035 - j * dw * .026;
      line(c, q => { for (let i = 0; i <= 40; i++) { const f = i / 40, xx = x - dw * .12 + dw * 1.24 * f;
        const py = waveY(f); i ? q.lineTo(xx, py) : q.moveTo(xx, py); } }, '#98b4b0', S * .0017); c.restore();
    }
  }
  for (let i = 0; i < 16; i++) {
    const f = i / 16, xx = mx + Math.sin(i * 2.31 + t * .56) * dw * f * .13;
    const yy = horizon + f * (y + dh - horizon) + Math.sin(t * .85 + i * .48) * dw * .008;
    const width = dw * (.036 + f * .14) * (.76 + .24 * Math.sin(t * (.68 + i * .012) + i));
    box(c, xx - width / 2, yy, width, S * .0024, K.moon, S * .0012);
  }
  // A tiny skiff quietly gives scale to the impossible view.
  const bx = x + dw * (frac(.35 + t / 115) * 1.30 - .15);
  const by = horizon + dh * .033 + Math.sin(t * .92) * dw * .005;
  c.save(); c.translate(bx, by); c.rotate(Math.sin(t * .74 + .5) * .055);
  polygon(c, [[-dw * .046, 0], [dw * .046, 0], [dw * .027, dw * .012], [-dw * .029, dw * .012]], K.night);
  polygon(c, [[0, -dw * .087], [0, -dw * .005], [dw * .041, -dw * .005]], '#d9c7a4');
  c.restore();
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
  blowingSand(c, G, t, true);
  windGrass(c, W * .08, H * .97, S * .18, t, 13); windGrass(c, W * .91, H * .94, S * .12, t, 25);
  for (let i = 0; i < 9; i++) {
    const xx = W * (.07 + hash(i, 73) * .88), yy = H * (.82 + hash(i, 75) * .17);
    oval(c, xx, yy, S * (.007 + hash(i, 79) * .006), S * .0035, i % 2 ? K.sand : K.edge, -.12);
  }
  c.restore();
}
