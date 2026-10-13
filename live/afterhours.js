// Dreamscapes No. 06: an original, empty night street in violet, cobalt and amber.
// Architecture stays still; a loose page, passing cloud and a few rooms keep time.
import { hash, frac, makeWorld, box, disc, oval, polygon, line, clouds } from './dream-kit.js?v=20261013-after-hours';

export const title = 'After Hours', no = 'No. 06', dark = '#191b37', text = '#191b37', audio = 'snowfall', grain = true;
export const make = (W, H) => makeWorld(W, H, 167);

const K = {
  sky: '#11152c', cloud: '#20223e', far: '#1e2942', farBlue: '#263b58',
  cyan: '#39738b', cyanLight: '#548da4', teal: '#284d62', violet: '#654080',
  violetLight: '#8a538d', magenta: '#934e83', ink: '#12192e',
  road: '#132e3d', roadLight: '#22495b', curb: '#7196b0', pavement: '#425f9a',
  pavementLight: '#5983c4', window: '#153051', glass: '#2b5790',
  yellow: '#f2c667', amber: '#e7a969', peach: '#cb806e', paper: '#c4c7cf'
};
const smooth = u => { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); };

// Only selected rooms change. Their long, staggered holds keep the block quiet.
export function roomLight(id, t) {
  if (id % 7 !== 0) return hash(id, 41) > .69 ? 1 : 0;
  const period = 17 + (id % 3) * 4, u = (t + hash(id, 13) * period) / period;
  const epoch = Math.floor(u), blend = smooth(frac(u) * 8);
  const before = hash(epoch * 47 + id, 77) > .48 ? 1 : 0;
  const after = hash((epoch + 1) * 47 + id, 77) > .48 ? 1 : 0;
  return before + (after - before) * blend;
}

// Two short, gentle dips in a 23-second cycle suggest an ageing streetlamp.
export function lampLevel(t) {
  const phase = frac(t / 23) * 23;
  const dip = (at, width, depth) => depth * Math.exp(-(((phase - at) / width) ** 2));
  return .94 + .025 * Math.sin(t * .37) - dip(6.1, .13, .39) - dip(6.55, .2, .23);
}

function window(c, x, y, w, h, id, t, shutter = false) {
  box(c, x - w * .11, y - h * .11, w * 1.22, h * 1.27, K.ink);
  box(c, x, y, w, h, K.window);
  const light = roomLight(id, t);
  if (light > 0) {
    c.save(); c.globalAlpha = light;
    box(c, x + w * .06, y + h * .06, w * .88, h * .88, id % 3 ? K.yellow : K.peach);
    c.restore();
  } else box(c, x + w * .07, y + h * .07, w * .86, h * .86, K.glass);
  box(c, x + w * .48, y, w * .09, h, K.ink);
  box(c, x, y + h * .49, w, h * .075, K.ink);
  if (shutter) {
    polygon(c, [[x + w * .1, y + h * .12], [x + w * .9, y + h * .12],
      [x + w * .8, y + h * .69], [x + w * .1, y + h * .69]], K.violetLight);
    line(c, q => { q.moveTo(x + w * .12, y + h * .68); q.lineTo(x + w * .82, y + h * .68); }, K.ink, w * .04);
  }
  box(c, x - w * .16, y + h * 1.12, w * 1.32, h * .09, K.curb);
}

function distantBuildings(c, G, t) {
  const { W, H, S } = G;
  // Separate rooflines make a small street, rather than one repeating facade.
  box(c, W * .13, H * .38, W * .23, H * .21, K.far);
  box(c, W * .19, H * .30, W * .13, H * .29, K.farBlue);
  box(c, W * .31, H * .17, W * .28, H * .42, K.cyan);
  polygon(c, [[W * .31, H * .17], [W * .59, H * .17], [W * .62, H * .19], [W * .33, H * .19]], K.teal);
  box(c, W * .30, H * .17, S * .008, H * .42, K.ink);
  box(c, W * .58, H * .18, S * .009, H * .42, K.ink);
  for (let row = 0; row < 5; row++) for (let col = 0; col < 3; col++) {
    const x = W * (.345 + col * .072), y = H * (.225 + row * .065);
    window(c, x, y, W * .028, H * .033, 20 + row * 3 + col, t);
  }
  for (let j = 0; j < 5; j++) box(c, W * .33, H * (.205 + j * .073), W * .24, S * .002, K.cyanLight);
  // An indigo garage recedes under the central apartments.
  box(c, W * .37, H * .49, W * .16, H * .09, K.ink);
  for (let j = 0; j < 7; j++) box(c, W * .381, H * (.502 + j * .0097), W * .139, S * .002, K.teal);
  box(c, W * .35, H * .59, W * .22, S * .009, K.ink);
  // Drainpipes, a stepped parapet, and an unlit stairwell break the grid.
  box(c, W * .557, H * .185, S * .006, H * .39, K.ink);
  box(c, W * .31, H * .165, W * .07, S * .01, K.ink);
  box(c, W * .38, H * .158, W * .05, S * .017, K.teal);
  box(c, W * .35, H * .465, W * .045, H * .075, K.teal);
  for (let j = 0; j < 3; j++) box(c, W * .355, H * (.477 + j * .017), W * .034, S * .003, K.cyanLight);

  box(c, W * .59, H * .29, W * .245, H * .30, K.violet);
  polygon(c, [[W * .59, H * .29], [W * .835, H * .29], [W * .85, H * .31], [W * .59, H * .31]], K.magenta);
  box(c, W * .605, H * .32, W * .22, S * .005, K.violetLight);
  for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
    window(c, W * (.615 + col * .071), H * (.36 + row * .069), W * .037, H * .039,
      60 + row * 3 + col, t, row === 1 && col === 0);
  }
  for (let j = 0; j < 4; j++) {
    box(c, W * .59, H * (.35 + j * .06), W * .02, S * .004, K.magenta);
    box(c, W * .806, H * (.35 + j * .06), W * .024, S * .004, K.violetLight);
  }
  box(c, W * .625, H * .55, W * .055, H * .045, K.ink);
  line(c, q => { q.moveTo(W * .654, H * .55); q.lineTo(W * .654, H * .59); }, K.cyanLight, S * .002);
  // A staggered right-hand warehouse and its awning.
  polygon(c, [[W * .83, H * .25], [W * 1.05, H * .23], [W * 1.05, H * .59], [W * .83, H * .59]], K.teal);
  polygon(c, [[W * .83, H * .25], [W * 1.06, H * .23], [W * 1.06, H * .245], [W * .83, H * .27]], K.ink);
  for (let j = 0; j < 3; j++) window(c, W * (.87 + j * .063), H * .36, W * .032, H * .055, 90 + j, t);
  box(c, W * .81, H * .46, W * .19, S * .014, K.ink);
  box(c, W * .88, H * .475, W * .13, H * .107, K.ink);
  for (let j = 0; j < 6; j++) box(c, W * .89, H * (.487 + j * .012), W * .11, S * .0018, K.cyanLight);
}

function street(c, G, t) {
  const { W, H, S } = G, horizon = H * .585;
  box(c, 0, horizon, W, H - horizon, K.road);
  polygon(c, [[W * .29, horizon], [W * .83, horizon], [W * 1.1, H], [-W * .14, H]], K.roadLight);
  polygon(c, [[0, horizon], [W * .29, horizon], [W * .39, H], [0, H]], K.pavement);
  polygon(c, [[W * .85, horizon], [W, horizon], [W, H], [W * .94, H]], K.pavement);
  line(c, q => { q.moveTo(W * .29, horizon); q.lineTo(W * .39, H); }, K.curb, S * .008);
  line(c, q => { q.moveTo(W * .85, horizon); q.lineTo(W * .94, H); }, K.curb, S * .006);
  for (let j = 1; j <= 6; j++) {
    const u = (j / 6) ** 1.7, y = horizon + (H - horizon) * u;
    line(c, q => { q.moveTo(0, y); q.lineTo(W * (.29 + .10 * u), y); }, K.ink, S * (.0018 + u * .002));
  }
  // Road patches and painted markings follow the vanishing point.
  polygon(c, [[W * .61, H * .76], [W * .75, H * .755], [W * .81, H * .805], [W * .63, H * .812]], K.road);
  for (let i = 0; i < 3; i++) {
    const y = H * (.70 + i * .095), x = W * (.58 + i * .035);
    polygon(c, [[x, y], [x + W * (.014 + i * .008), y - H * .002],
      [x + W * (.026 + i * .011), y + H * (.004 + i * .002)], [x + W * .003, y + H * .005]], K.curb);
  }
  line(c, q => { q.moveTo(W * .46, H * .74); q.lineTo(W * .50, H * .765); q.lineTo(W * .54, H * .761); }, K.ink, S * .0026);
  line(c, q => { q.moveTo(W * .76, H * .87); q.lineTo(W * .81, H * .855); q.lineTo(W * .85, H * .86); }, K.ink, S * .002);
  // The lamp's oval pool catches the small blue puddle and the moving paper.
  c.save(); c.globalAlpha = .27 * lampLevel(t);
  oval(c, W * .49, H * .67, W * .24, H * .043, K.pavementLight, -.07);
  c.restore();
  c.save(); c.globalAlpha = .18 + .07 * Math.sin(t * .8);
  polygon(c, [[W * .55, H * .78], [W * .79, H * .77], [W * .86, H * .80], [W * .61, H * .81]], K.cyanLight);
  c.restore();
}

function parkedCar(c, G) {
  const { W, H, S } = G, x = W * .76, y = H * .59, w = W * .25, h = H * .056;
  oval(c, x, y + h * .28, w * .58, h * .24, K.ink);
  polygon(c, [[x - w * .48, y - h * .33], [x - w * .28, y - h * .53], [x + w * .20, y - h * .55],
    [x + w * .41, y - h * .30], [x + w * .52, y], [x - w * .54, y]], K.far);
  polygon(c, [[x - w * .22, y - h * .45], [x + w * .17, y - h * .47],
    [x + w * .32, y - h * .25], [x - w * .36, y - h * .24]], K.glass);
  box(c, x - w * .43, y - h * .15, w * .82, h * .18, K.farBlue);
  line(c, q => { q.moveTo(x - w * .48, y - h * .28); q.lineTo(x + w * .40, y - h * .28); }, K.cyan, S * .0025);
  disc(c, x - w * .30, y + h * .02, S * .011, K.ink);
  disc(c, x + w * .34, y + h * .02, S * .011, K.ink);
  box(c, x - w * .51, y - h * .16, w * .065, h * .075, K.peach);
  box(c, x + w * .47, y - h * .15, w * .045, h * .065, K.yellow);
}

function lamp(c, G, t) {
  const { W, H, S } = G, x = W * .49, top = H * .107, ground = H * .625, level = lampLevel(t);
  // The light is a flat, translucent silhouette over the buildings and road.
  c.save(); c.globalAlpha = .14 * level;
  polygon(c, [[x - S * .014, top + S * .013], [x + S * .014, top + S * .013],
    [x + W * .31, H * .63], [x - W * .31, H * .63]], '#a78fe2');
  c.globalAlpha = .10 * level;
  polygon(c, [[x, top + S * .017], [x + W * .23, H * .62], [x - W * .23, H * .62]], '#f1c694');
  c.restore();
  // Lamp, cast base, and the hand-painted highlights on its two pole faces.
  polygon(c, [[x - S * .012, top + S * .016], [x + S * .012, top + S * .016],
    [x + S * .008, ground], [x - S * .008, ground]], K.ink);
  box(c, x - S * .007, top + S * .047, S * .003, ground - top - S * .048, K.cyan);
  oval(c, x, ground + S * .009, S * .040, S * .010, K.ink);
  box(c, x - S * .021, ground - S * .012, S * .042, S * .02, K.farBlue, S * .005);
  oval(c, x, top + S * .003, S * .036, S * .011, K.ink);
  c.save(); c.globalAlpha = level;
  oval(c, x, top + S * .005, S * .025, S * .007, K.yellow);
  c.restore();
  oval(c, x, top - S * .005, S * .040, S * .009, K.ink);
}

function nearFacades(c, G, t) {
  const { W, H, S } = G;
  // Left corner and its recessed, blue shop shutters.
  polygon(c, [[0, 0], [W * .16, 0], [W * .285, H * .53], [W * .17, H], [0, H]], K.violet);
  polygon(c, [[W * .16, 0], [W * .215, 0], [W * .30, H * .56], [W * .285, H * .53]], K.magenta);
  polygon(c, [[0, H * .21], [W * .10, H * .22], [W * .17, H * .78], [0, H * .85]], K.ink);
  polygon(c, [[W * .025, H * .25], [W * .095, H * .255], [W * .146, H * .73], [W * .025, H * .77]], K.glass);
  polygon(c, [[W * .018, H * .052], [W * .069, H * .057], [W * .103, H * .19], [W * .018, H * .178]], K.ink);
  polygon(c, [[W * .028, H * .068], [W * .061, H * .072], [W * .087, H * .174], [W * .028, H * .165]], K.glass);
  line(c, q => { q.moveTo(W * .025, H * .12); q.lineTo(W * .074, H * .13); }, K.cyanLight, S * .003);
  for (let j = 0; j < 7; j++) {
    const yy = H * (.30 + j * .064);
    line(c, q => { q.moveTo(W * .03, yy); q.lineTo(W * (.10 + j * .007), yy + H * .014); }, K.ink, S * .004);
  }
  line(c, q => { q.moveTo(W * .12, H * .22); q.lineTo(W * .18, H * .77); }, K.ink, S * .008);
  for (let j = 0; j < 5; j++) {
    const yy = H * (.20 + j * .11);
    line(c, q => { q.moveTo(W * .20, yy); q.lineTo(W * .245, yy + H * .016); }, K.ink, S * .002);
  }
  // Angular brick ghosts and one small cable stay beneath the global grain.
  for (let j = 0; j < 5; j++) {
    const x = W * (.06 + (j % 2) * .08), y = H * (.21 + j * .105);
    line(c, q => { q.moveTo(x, y); q.lineTo(x + W * .023, y + H * .006); q.lineTo(x + W * .023, y + H * .021); }, K.ink, S * .002);
  }
  // A narrow right-hand wall and fire stair frame the road without closing it in.
  polygon(c, [[W * .94, 0], [W, 0], [W, H], [W * .90, H * .77]], K.far);
  box(c, W * .954, H * .17, W * .046, H * .23, K.ink);
  box(c, W * .965, H * .19, W * .035, H * .18, K.glass);
  for (let j = 0; j < 4; j++) {
    const yy = H * (.28 + j * .09);
    line(c, q => { q.moveTo(W * .91, yy); q.lineTo(W, yy - H * .009); }, K.ink, S * .005);
  }
  line(c, q => { q.moveTo(W * .94, H * .05); q.lineTo(W * .955, H * .47); }, K.ink, S * .003);
  // A wavering sliver of reflected lamp light travels along the near curb.
  c.save(); c.globalAlpha = .35 + .10 * Math.sin(t * .7);
  line(c, q => { q.moveTo(W * .29, H * .68); q.lineTo(W * .35, H * .87); }, K.pavementLight, S * .003);
  c.restore();
}

function blowingPaper(c, G, t) {
  const { W, H, S } = G;
  for (let i = 0; i < 4; i++) {
    const phase = frac(t / (16 + i * 3) + [.54, .02, .29, .77][i]);
    const x = W * (-.18 + phase * 1.36), y = H * (.70 + i * .068)
      + Math.sin(t * (1.1 + i * .12) + i * 2.3) * S * (.016 + i * .004);
    const size = S * (.038 + (i % 2) * .017), twist = Math.sin(t * 1.3 + i * 1.9) * .22;
    c.save(); c.translate(x, y); c.rotate(twist);
    c.globalAlpha = .5;
    oval(c, size * .22, size * .38, size * .61, size * .13, K.ink);
    c.globalAlpha = 1;
    polygon(c, [[-size * .50, -size * .29], [size * .22, -size * .43],
      [size * .53, -size * .12], [size * .34, size * .31], [-size * .29, size * .25]],
      i === 2 ? K.peach : K.paper);
    polygon(c, [[size * .22, -size * .43], [size * .53, -size * .12], [size * .14, -size * .07]],
      i === 2 ? K.magenta : K.curb);
    c.restore();
  }
}

export function paint(c, p, t, G) {
  const { W, H, S } = G;
  c.save();
  box(c, 0, 0, W, H, K.sky);
  // Cloud bands drift on independent clocks behind the rooftops.
  clouds(c, G, t * 18, K.cloud, 5, .28, 121);
  clouds(c, G, t * 10, K.far, 3, .30, 135);
  box(c, W * .06, H * .47, W * .23, H * .13, K.far);
  distantBuildings(c, G, t);
  c.depthLayer?.('night-block');
  street(c, G, t);
  parkedCar(c, G);
  c.depthLayer?.('streetlight');
  lamp(c, G, t);
  // A hanging street sign and small pole details sit in the lit middle distance.
  box(c, W * .36, H * .45, S * .006, H * .13, K.ink);
  box(c, W * .33, H * .445, W * .077, S * .018, K.ink, S * .003);
  for (let i = 0; i < 3; i++) box(c, W * (.339 + i * .018), H * .45, W * .009, S * .003, K.cyanLight);
  c.depthLayer?.('near-facades');
  nearFacades(c, G, t);
  blowingPaper(c, G, t);
  // Just a few scattered stones, separate from the app's global print grain.
  for (let i = 0; i < 12; i++) {
    const x = hash(i, 213) * W, y = H * (.63 + hash(i, 217) * .34), r = S * (.001 + hash(i, 219) * .002);
    polygon(c, [[x - r, y], [x + r, y - r * .5], [x + r * .6, y + r]], i % 3 ? K.ink : K.curb);
  }
  c.restore();
}
