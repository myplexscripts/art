// Dreamscapes No. 03: floating orchards ride the wind above flowing cloud banks.
import { hash, frac, makeWorld, box, disc, oval, polygon, line, leaf, archRing, cloud, clouds } from './dream-kit.js?v=20261011-clock-controls';
export const title = 'Hanging Gardens', no = 'No. 03', dark = '#273f49', text = '#273f49', audio = 'lavender', grain = true;
export const make = (W, H) => makeWorld(W, H, 61);
const K = { sky: '#3e5661', distant: '#58727a', mist: '#798c8d', cloud: '#a0aaa0', rock: '#344d55', strata: '#526f6b',
  grass: '#71876d', rim: '#a4ac81', dark: '#254b43', leaf: '#527d63', light: '#8da075', fruit: '#ddb172', rose: '#b77a6d', pool: '#426a72' };
function tree(c, x, y, size, t, seed) {
  c.save(); c.translate(x, y);
  // The trunk leans from its root; its crown and individual leaves lag the breeze.
  const wind = .036 * Math.sin(t * .48 + seed) + .011 * Math.sin(t * .79 + seed * 1.7);
  c.rotate(wind);
  // Forked trunks, separate branches and a scalloped crown leave real gaps.
  polygon(c, [[-size * .027, 0], [-size * .023, -size * .51], [size * .012, -size * .64],
    [size * .029, -size * .47], [size * .045, 0]], K.dark);
  for (const side of [-1, 1]) line(c, q => { q.moveTo(size * .014, -size * .11);
    q.bezierCurveTo(side * size * .07, -size * .32, side * size * .20, -size * .36, side * size * .26, -size * .53); }, K.dark, size * .034);
  c.save(); c.translate(0, -size * .45); c.rotate(Math.sin(t * .48 + seed - .7) * .026);
  const crowns = [[-.24,-.04,.20],[.19,-.08,.23],[-.08,-.21,.22],[.05,.07,.23],[-.37,.04,.13],[.36,.02,.12]];
  for (let k = 0; k < crowns.length; k++) {
    const [xx, yy, r] = crowns[k], flutter = Math.sin(t * .63 + seed + k * .8) * size * .008;
    c.beginPath();
    for (let j = 0; j <= 48; j++) {
      const a = j / 48 * Math.PI * 2, rr = size * r * (1 + .05 * Math.sin(a * 7 + seed));
      const px = size * xx + flutter + Math.cos(a) * rr, py = size * yy + Math.sin(a) * rr * .82;
      j ? c.lineTo(px, py) : c.moveTo(px, py);
    }
    c.closePath(); c.fillStyle = xx < 0 ? K.leaf : K.light; c.fill();
  }
  for (let j = 0; j < 18; j++) {
    const xx = (hash(j, seed) - .5) * size * .64, yy = (hash(j, seed + 1) - .5) * size * .36;
    leaf(c, xx, yy, size * .073, size * .023, (hash(j, seed + 2) - .5) * 2.6 + .13 * Math.sin(t * .95 + seed + j * .8), j % 3 ? K.leaf : K.dark);
    if (j % 4 === 0) { disc(c, xx - size * .025, yy + size * .025, size * .017, K.fruit);
      line(c, q => { q.moveTo(xx - size * .025, yy + size * .009); q.lineTo(xx - size * .013, yy - size * .007); }, K.dark, size * .007); }
  }
  c.restore(); c.restore();
}
function vine(c, x, y, size, t, seed) {
  // The root stays attached while the hanging tip follows the wind with a delay.
  const at = f => [x - Math.sin(f * Math.PI) * size * .055 + size * f ** 1.45 *
    (.14 * Math.sin(t * .52 + seed - f * 1.2) + .035 * Math.sin(t * .91 + seed * 1.3 - f * 3)), y + size * f];
  line(c, q => { for (let i = 0; i <= 20; i++) { const [xx, yy] = at(i / 20); i ? q.lineTo(xx, yy) : q.moveTo(xx, yy); } }, K.dark, size * .017);
  for (let i = 0; i < 8; i++) {
    const f = .12 + i * .1, [xx, yy] = at(f), ahead = at(f + .01), sway = Math.atan2(ahead[0] - xx, ahead[1] - yy);
    leaf(c, xx, yy, size * .13, size * .035, (i % 2 ? 1 : -1) * 2.22 - sway + .11 * Math.sin(t * .87 + seed - f * 2.2), i % 3 ? K.leaf : K.rim);
  }
}
function pool(c, x, y, width, t) {
  oval(c, x, y + width * .003, width * .14, width * .044, K.rim);
  oval(c, x, y, width * .125, width * .035, K.pool);
  c.save(); c.beginPath(); c.ellipse(x, y, width * .124, width * .034, 0, 0, Math.PI * 2); c.clip();
  for (let j = 0; j < 5; j++) {
    const age = frac(t * .17 + j / 5);
    c.globalAlpha = .78 * Math.sin(Math.PI * age);
    c.beginPath(); c.ellipse(x - width * .027, y, width * (.018 + age * .16), width * (.005 + age * .040), 0, 0, Math.PI * 2);
    c.strokeStyle = K.cloud; c.lineWidth = width * .003; c.stroke();
  }
  c.restore();
}
function waterfall(c, width, t, seed) {
  const x = width * .11, y = width * .008, height = width * .65;
  const at = f => [x + width * .018 * f * f * Math.sin(t * .48 + seed - f * 1.5), y + height * f];
  const edges = [];
  for (let i = 0; i <= 20; i++) { const f = i / 20, [xx, yy] = at(f); edges.push([xx - width * (.010 - f * .003), yy]); }
  for (let i = 20; i >= 0; i--) { const f = i / 20, [xx, yy] = at(f); edges.push([xx + width * (.010 - f * .003), yy]); }
  polygon(c, edges, K.pool);
  // Printed pale streaks travel down the ribbon instead of flickering in place.
  for (let j = 0; j < 7; j++) {
    const age = frac(t * .47 + j / 7), a = at(age), b = at(Math.min(1, age + .06));
    line(c, q => { q.moveTo(a[0], a[1]); q.lineTo(b[0], b[1]); }, K.cloud, width * .0035);
  }
  for (let j = 0; j < 3; j++) {
    const age = frac(t * .43 + j / 3), [xx, yy] = at(1);
    oval(c, xx + Math.sin(t * .48 + seed) * width * age * .035, yy + age * width * .085, width * .003, width * .005, K.cloud);
  }
}
function island(c, x, y, width, t, seed, main = false) {
  const height = width * .30;
  c.save(); c.translate(x, y);
  // The floating earth is a cut-paper silhouette with exposed, irregular strata.
  polygon(c, [[-width * .50, 0], [-width * .36, height * .30], [-width * .31, height * .60],
    [-width * .16, height * .76], [-width * .07, height], [width * .04, height * .71],
    [width * .17, height * .87], [width * .27, height * .49], [width * .38, height * .32], [width * .50, 0]], K.rock);
  for (let j = 0; j < 3; j++) line(c, q => { const yy = height * (.17 + j * .14), ww = width * (.41 - j * .054);
    q.moveTo(-ww, yy); q.bezierCurveTo(-width * .20, yy + height * .10, width * .18, yy - height * .02, ww * .92, yy + height * .013); }, K.strata, width * .007);
  oval(c, 0, 0, width / 2, width * .105, K.rim);
  oval(c, 0, -width * .018, width * .47, width * .085, K.grass);
  for (let j = 0; j < 2; j++) {
    c.beginPath(); c.ellipse(0, -width * .02, width * (.43 - j * .07), width * (.073 - j * .016), 0, .1, Math.PI * .94);
    c.strokeStyle = K.rim; c.lineWidth = width * .004; c.stroke();
  }
  if (main) {
    // A tiny terraced sanctuary contains an open arch, a reflecting pool and flowers.
    const ax = width * .19, ay = -width * .31, aw = width * .19, ah = width * .30;
    archRing(c, ax, ay, aw, ah, aw * .14, K.rose);
    box(c, ax - aw * .08, ay + ah, aw * 1.16, width * .017, K.rim);
    for (let j = 0; j < 3; j++) box(c, ax - aw * (.14 + j * .04), ay + ah + j * width * .014, aw * (1.28 + j * .08), width * .016, j % 2 ? K.rose : K.rim);
    pool(c, width * .035, -width * .014, width, t);
    tree(c, -width * .23, -width * .035, width * .66, t, seed);
    for (let i = 0; i < 9; i++) {
      const xx = width * (.22 + hash(i, seed + 9) * .19), yy = width * (.015 + hash(i, seed + 8) * .045);
      const sway = width * .008 * Math.sin(t * .63 + i * .7);
      line(c, q => { q.moveTo(xx, yy); q.quadraticCurveTo(xx + sway * .3, yy - width * .025, xx + sway, yy - width * .045); }, K.dark, width * .003);
      for (let j = 0; j < 5; j++) { const a = j * Math.PI * .4; disc(c, xx + sway + Math.cos(a) * width * .009, yy - width * .045 + Math.sin(a) * width * .009, width * .0065, i % 3 ? K.fruit : K.rose); }
    }
  } else {
    tree(c, -width * .06, -width * .025, width * (.50 + hash(seed, 3) * .16), t, seed);
    for (const xx of [-width * .28, width * .26]) {
      const sway = width * .012 * Math.sin(t * .51 + seed + xx);
      line(c, q => { q.moveTo(xx, 0); q.quadraticCurveTo(xx + sway * .3, -width * .045, xx + sway, -width * .07); }, K.dark, width * .01);
      oval(c, xx + sway, -width * .09, width * .12, width * .055, K.leaf, sway / width);
    }
  }
  if (main) waterfall(c, width, t, seed);
  for (let j = 0; j < (main ? 4 : 2); j++) vine(c, width * (-.31 + j * .17), height * .14, width * (.29 + hash(j, seed) * .20), t, seed + j);
  c.restore();
}
export function paint(c, p, t, G) {
  const { W, H, S } = G;
  c.save(); box(c, 0, 0, W, H, K.sky);
  disc(c, W * .70, H * .20, S * .30, K.distant); disc(c, W * .70, H * .20, S * .17, K.mist); disc(c, W * .70, H * .20, S * .075, K.fruit);
  clouds(c, G, t * 7, K.distant, 6, .58, 71);
  for (let j = 0; j < 4; j++) {
    const yy = H * (.69 + j * .105), ink = [K.distant, K.mist, '#6a8484', '#526e76'][j];
    c.beginPath(); c.moveTo(-S, H + S);
    for (let i = 0; i <= 60; i++) { const f = i / 60; c.lineTo(f * (W + S * 2) - S, yy + Math.sin(f * 11 + j - t * (.11 + j * .024)) * S * .045); }
    c.lineTo(W + S, H + S); c.closePath(); c.fillStyle = ink; c.fill();
  }
  island(c, W * .19 + Math.sin(t * .23 + 1.2) * S * .026, H * .27 + Math.sin(t * .31) * S * .023, S * .30, t, 15);
  island(c, W * .83 + Math.sin(t * .19) * S * .031, H * .39 + Math.sin(t * .27 + 2) * S * .026, S * .39, t, 26);
  c.depthLayer?.('main-garden');
  island(c, W * .50 + Math.sin(t * .21) * S * .025, H * .64 + Math.sin(t * .29 + .5) * S * .030, S * .78, t, 33, true);
  c.depthLayer?.('near-garden');
  island(c, W * .16 + Math.sin(t * .27 + 1) * S * .030, H * .94 + Math.sin(t * .32 + 4) * S * .023, S * .32, t, 56);
  cloud(c, W * .74 + Math.sin(t * .11) * S * .15, H * .96, S * .71, S * .095, K.mist);
  c.restore();
}
