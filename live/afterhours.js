// Dreamscapes No. 06: an empty city corner at night, cut through by one violet street lamp.
// The whole block is painted twice: once in its night inks, and once in lamp-lit inks inside the cone of light,
// so the beam reads as a flat, hand-painted shape. Walls catch the full cone; the ground only the oval pool.
import { hash, frac, clamp, makeWorld, box, disc, oval, polygon, line, cloud } from './dream-kit.js?v=20261019-after-hours-detail';

export const title = 'After Hours', no = 'No. 06', dark = '#191b37', text = '#191b37', audio = 'snowfall', grain = true;

// Everything is drawn on a 640 x 480 stage. make() scales it to the screen and extends the walls, sky and street
// past the stage edges, so wide, square and tall screens all show a complete corner.
export function make(W, H) {
  // Tall phone screens move in closer, keeping the corner and the lamp at a readable size.
  const tall = clamp((H / W - 1.4) / .6), span = 500 - 70 * tall, centre = 330 - 14 * tall;
  const G = makeWorld(W, H, 167), u = Math.min(W / span, H / 470);
  const ground = H * clamp(.68 - (H / W - 1.34) * .12, .56, .68), ox = W / 2 - centre * u, oy = ground - 320 * u;
  return { ...G, u, ox, oy, L: -ox / u - 2, R: (W - ox) / u + 2, T: -oy / u - 2, B: (H - oy) / u + 2 };
}

const ink = '#06041a';
const NIGHT = {
  sky: '#0b0730', cloud: '#150e3c', far: '#120c36', skyline: '#150f3f', skyWindow: '#2c2766', farLight: '#7a7340',
  wall: '#4b2160', wallTrim: '#5c2c72', wallShade: '#341545', shutter: '#0c1858', shutterLight: '#1a2a7a',
  small: '#0c1c4c', smallLight: '#2e427f',
  blue: '#26608f', blueTrim: '#3577a6', blueShade: '#1d4a72', garage: '#2a1f44', garageLine: '#3d3060',
  pink: '#2d1d66', pinkTrim: '#4d2c74', teal: '#0a2630', tealFace: '#0f3440', tealEdge: '#2a5560', curtain: '#0d1650',
  brick: '#2e2030', brickTrim: '#3a2a3c', stone: '#2c3247', stoneLine: '#1c2134', rail: '#151026', railLight: '#2e2850',
  glass: '#142763', glassLight: '#25408a', yellow: '#d8d35c', amber: '#d9a05a', tv: '#5f7fe0',
  road: '#030b1a', roadMark: '#081628', walk: '#0a1f5e', joint: '#06123e', curb: '#16307a', farWalk: '#0b1640',
  car: '#0b2276', carLight: '#1a3290', carGlass: '#2a4596', chrome: '#3c56a8',
  pole: '#34345a', poleLight: '#4a4a78', sign: '#08203a', signText: '#6f8fa8', plate: '#8a90aa', red: '#8a2f4a', hydrant: '#4a1a46', hydrantLight: '#6a2a5c',
  paper: '#7a82aa', paperShade: '#4a5280', puddle: '#16285e', steam: '#2a3466', moth: '#2d2a50'
};
const LIT = {
  sky: '#2e1d7a', cloud: '#3a2689', far: '#34228a', skyline: '#3a2890', skyWindow: '#5a4ab8', farLight: '#d8cf70',
  wall: '#8a62b0', wallTrim: '#a37ccc', wallShade: '#6a4690', shutter: '#2a3fa6', shutterLight: '#4a62cc',
  small: '#1f3f8a', smallLight: '#6f8ad8',
  blue: '#3f8cc0', blueTrim: '#5aa6d6', blueShade: '#2f6e9e', garage: '#4a3970', garageLine: '#67569a',
  pink: '#6a40ae', pinkTrim: '#c189dc', teal: '#1e5560', tealFace: '#2a6c76', tealEdge: '#5aa0a8', curtain: '#2a3cae',
  brick: '#5a4060', brickTrim: '#6e5276', stone: '#4a5470', stoneLine: '#2c3450', rail: '#2a2048', railLight: '#6a62a0',
  glass: '#5f80dc', glassLight: '#8aa6f0', yellow: '#ece776', amber: '#eab46a', tv: '#a6c0ff',
  road: '#1d4f5a', roadMark: '#174450', walk: '#2c5ac0', joint: '#1b3c94', curb: '#4d7ce0', farWalk: '#23408c',
  car: '#2140a8', carLight: '#3858c4', carGlass: '#7a98e8', chrome: '#9ab0f0',
  pole: '#7470a8', poleLight: '#9a96cc', sign: '#164260', signText: '#c8e0ee', plate: '#d8dcf0', red: '#c04a68', hydrant: '#b8405e', hydrantLight: '#e0708a',
  paper: '#e4e8f8', paperShade: '#a8b0d8', puddle: '#8a98dc', steam: '#a6b0e6', moth: '#ece6ff'
};

// The cone hangs from the lamp head to an oval pool on the ground.
const LAMP = [313, 18], POOL = [285, 410, 260, 58];
const poolPath = () => { const p = new Path2D(); p.ellipse(...POOL, 0, 0, Math.PI * 2); return p; };
const conePath = () => {
  const p = new Path2D(), [x, y, rx, ry] = POOL;
  p.moveTo(LAMP[0] - 10, LAMP[1] + 6); p.lineTo(LAMP[0] + 10, LAMP[1] + 6); p.lineTo(x + rx, y);
  p.ellipse(x, y, rx, ry, 0, 0, Math.PI); p.closePath(); return p;
};
// Upright surfaces only take light inside the beam's straight edges, not where the pool bulges past them.
const wedgePath = () => {
  const p = new Path2D(), [x, y] = LAMP, far = (a, b) => [a + (b[0] - a) * 4, y + 6 + (b[1] - y - 6) * 4];
  p.moveTo(x - 10, y + 6); p.lineTo(x + 10, y + 6); p.lineTo(...far(x + 10, [545, 410])); p.lineTo(...far(x - 10, [25, 410]));
  p.closePath(); return p;
};

// The near left wall recedes towards a vanishing point at (170, 258), the right one towards (126, 258).
// h is a line's height at each wall's corner.
const lw = (x, h) => 258 + (h - 258) * (170 - x) / 33;
const lwx = (y, h) => 170 - (y - 258) * 33 / (h - 258);
const rw = (x, h) => 258 + (h - 258) * (x - 126) / 394;
// Equal steps along the left wall, from x 55 (near) to x 121 (far).
const along = s => 170 - 1 / ((1 - s) / 115 + s / 49);

const smooth = u => { u = clamp(u); return u * u * (3 - 2 * u); };
const mix = (a, b, u) => a + (b - a) * u;

function shape(c, points, fill, width = .9) {
  polygon(c, points, fill);
  c.strokeStyle = ink; c.lineWidth = width; c.lineJoin = 'round'; c.stroke();
}
function rect(c, x, y, w, h, fill, width = .9) {
  box(c, x, y, w, h, fill);
  c.strokeStyle = ink; c.lineWidth = width; c.strokeRect(x, y, w, h);
}
const stroke = (c, points, ink, width) => line(c, q => points.forEach(([x, y], i) => i ? q.lineTo(x, y) : q.moveTo(x, y)), ink, width);

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

// Rooms that change, or hold a flickering television, are repainted every frame over the baked block.
const TV = new Set([23, 64]), changing = id => id % 7 === 0 || TV.has(id);
let livePanes = null;

// A window: frame, glass or a lit room, and one of a few interiors; sill names the ink of its ledge so the block is not a grid of identical squares.
// still keeps a room fixed where the lamp post, sign or fire escape passes in front of it.
function pane(c, k, x, y, w, h, id, t, sill, still = false) {
  const moving = !still && changing(id);
  if (livePanes && k === NIGHT && moving) livePanes.push([x, y, w, h, id, sill]);
  rect(c, x, y, w, h, k.glass, .8);
  const on = moving ? roomLight(id, t) : hash(id, 41) > .69 ? 1 : 0;
  if (on < 1) {
    stroke(c, [[x + w * .2, y + h * .75], [x + w * .75, y + h * .2]], k.glassLight, Math.min(w, h) * .09);
  }
  if (on > 0) {
    c.save(); c.globalAlpha = on;
    const tv = TV.has(id);
    if (tv) {
      const flicker = .55 + .25 * Math.sin(t * 7.1 + id) + .2 * Math.sin(t * 13.7);
      box(c, x + .6, y + .6, w - 1.2, h - 1.2, k.glass);
      c.globalAlpha = on * clamp(flicker);
      box(c, x + .6, y + .6, w - 1.2, h - 1.2, k.tv);
    } else {
      box(c, x + .6, y + .6, w - 1.2, h - 1.2, id % 4 ? k.yellow : k.amber);
      const style = id % 5;
      if (style === 1) for (let j = 1; j < 5; j++) box(c, x + .6, y + h * j / 5, w - 1.2, h * .045, k.amber);
      if (style === 2) shape(c, [[x + .6, y + .6], [x + w * .38, y + .6], [x + w * .2, y + h - .6], [x + .6, y + h - .6]], k.amber, .5);
      if (style === 3) { disc(c, x + w * .7, y + h * .78, w * .16, ink); polygon(c, [[x + w * .55, y + h - .6], [x + w * .85, y + h - .6], [x + w * .8, y + h * .82], [x + w * .6, y + h * .82]], ink); }
    }
    c.restore();
    c.strokeStyle = ink; c.lineWidth = .8; c.strokeRect(x, y, w, h);
  }
  if (sill) box(c, x - 1, y + h + .4, w + 2, 1.3, k[sill]);
}

function chevrons(c, k, x, y, w, h, rows, light, dark) {
  rect(c, x, y, w, h, dark, 1);
  for (let i = 0; i < rows; i++) {
    const yy = y + h * (i + .7) / rows, dip = h / rows * .45;
    stroke(c, [[x + w * .1, yy - dip], [x + w * .5, yy], [x + w * .9, yy - dip]], light, Math.max(.8, h / rows * .16));
  }
  stroke(c, [[x + w * .5, y], [x + w * .5, y + h]], ink, .9);
}

function sky(c, k, t, G) {
  box(c, G.L, G.T, G.R - G.L, 330 - G.T, k.sky);
  // Two thin bands of cloud drift at different speeds above the roofs.
  const span = G.R - G.L + 200;
  for (let i = 0; i < 6; i++) {
    const w = 70 + hash(i, 51) * 110, speed = (1.1 + hash(i, 52) * 1.4) * (i % 2 ? 1 : .6);
    const x = G.L - 100 + frac(hash(i, 53) + t * speed / span) * span;
    const y = Math.max(G.T + 20, 20) + hash(i, 54) * Math.max(60, 120 - Math.max(G.T, 0));
    cloud(c, x, y, w, w * .11, i % 2 ? k.cloud : k.far);
  }
}

function skyline(c, k, G) {
  // A distant skyline fills the gaps between the roofs, with a few late windows.
  for (let x = Math.floor(G.L / 40) * 40 - 40, i = 0; x < G.R; i++) {
    const n = Math.floor(x / 40) + 400, w = 26 + hash(n, 61) * 34, top = 54 + hash(n, 62) * 80;
    polygon(c, [[x, top], [x + w, top], [x + w, 330], [x, 330]], k.skyline);
    if (hash(n, 63) > .6) box(c, x + w * .3, top - 9, w * .4, 9, k.skyline);
    if (hash(n, 64) > .75) line(c, q => { q.moveTo(x + w * .7, top); q.lineTo(x + w * .7, top - 16); }, k.skyline, 1);
    for (let row = 0; row < 7; row++) for (let col = 0; col < 3; col++) {
      const id = n * 31 + row * 3 + col;
      if (hash(id, 65) > .86) box(c, x + 4 + col * (w - 8) / 3, top + 8 + row * 11, 3, 4, hash(id, 66) > .5 ? k.skyWindow : k.farLight);
    }
    x += w + 2 + hash(n, 67) * 8;
  }
}

function backBlock(c, k, t) {
  // A water tower stands on the far roof.
  const tx = 470;
  for (const lx of [tx - 9, tx - 2, tx + 6]) stroke(c, [[lx, 104], [lx + (lx - tx) * .2, 124]], k.railLight, 1.2);
  stroke(c, [[tx - 10, 114], [tx + 8, 118]], k.railLight, .7);
  shape(c, [[tx - 12, 88], [tx + 10, 88], [tx + 10, 105], [tx - 12, 105]], k.far, .8);
  for (let j = 0; j < 3; j++) stroke(c, [[tx - 12, 92 + j * 5], [tx + 10, 92 + j * 5]], k.railLight, .5);
  shape(c, [[tx - 14, 88], [tx - 1, 79], [tx + 12, 88]], k.far, .8);

  // Teal building behind the pink one: a lit, angled side face and a darker front.
  shape(c, [[395, 152], [452, 122], [452, 322], [395, 322]], k.tealFace);
  shape(c, [[452, 122], [526, 127], [526, 322], [452, 322]], k.teal);
  box(c, 451, 122, 5, 200, k.tealEdge);
  stroke(c, [[452, 129], [526, 133]], k.tealEdge, 1);
  stroke(c, [[395, 266], [452, 258], [526, 262]], k.tealEdge, 1.6);
  for (const [i, y] of [[0, 150], [1, 202]]) {
    pane(c, k, 470, y, 11, 16, 91 + i * 5, t, 'tealEdge');
    pane(c, k, 498, y + 1, 11, 16, 94 + i * 5, t, 'tealEdge', true);
  }
  rect(c, 463, 270, 55, 38, k.curtain, 1);
  for (let j = 1; j < 9; j++) stroke(c, [[463 + j * 6.1, 271], [463 + j * 6.1 + Math.sin(j) * .8, 307]], k.tealFace, .7);
  shape(c, [[460, 266], [521, 266], [524, 271], [457, 271]], k.tealEdge, .7);

  // The small building tucked behind the near corner, with its awning and a lit balcony rail.
  shape(c, [[128, 168], [194, 168], [194, 323], [128, 323]], k.small);
  shape(c, [[126, 151], [194, 151], [194, 166], [126, 171]], ink, .6);
  stroke(c, [[126, 152], [194, 152]], k.smallLight, 1.1);
  pane(c, k, 154, 190, 16, 25, 33, t, 'smallLight');
  stroke(c, [[136, 276], [174, 276]], k.smallLight, 1.6);
  stroke(c, [[136, 309], [174, 309]], k.smallLight, 1.2);
  for (let j = 0; j < 9; j++) stroke(c, [[138 + j * 4.5, 277], [138 + j * 4.5, 309]], k.smallLight, .9);
  stroke(c, [[186, 170], [186, 322]], ink, 1.2);

  // The tall blue apartments: cornice, five columns of tall windows, a ledge and a roll-down garage.
  shape(c, [[213, 63], [240, 63], [240, 82], [213, 82]], k.blueShade, .8);
  stroke(c, [[226, 63], [226, 46]], k.railLight, .8);
  stroke(c, [[221, 52], [231, 52]], k.railLight, .8);
  shape(c, [[190, 92], [312, 92], [312, 322], [190, 322]], k.blue);
  box(c, 190.5, 92, 4, 230, k.blueTrim);
  box(c, 306, 92, 5.5, 230, k.blueShade);
  shape(c, [[185, 82], [317, 82], [317, 92], [185, 92]], k.blueTrim);
  stroke(c, [[187, 85.5], [315, 85.5]], k.blueShade, .7);
  for (let row = 0; row < 4; row++) for (let col = 0; col < 5; col++) {
    pane(c, k, 203 + col * 21, 104 + row * 33, 8, 21, 20 + row * 5 + col, t, 'blueTrim', col === 1 || row === 1);
  }
  shape(c, [[188, 250], [314, 250], [314, 256], [188, 256]], k.blueTrim);
  rect(c, 233, 262, 66, 6, k.blueTrim);
  rect(c, 237, 268, 58, 54, k.garage);
  for (let j = 1; j < 12; j++) stroke(c, [[237.5, 268 + j * 4.5], [294.5, 268 + j * 4.5]], k.garageLine, .8);
  box(c, 262, 314, 8, 2, k.garageLine);
  rect(c, 200, 280, 19, 42, k.blueShade);
  disc(c, 215, 302, 1, k.blueTrim);

  // The pink building in front of the teal one.
  shape(c, [[310, 174], [425, 174], [425, 322], [310, 322]], k.pink);
  shape(c, [[306, 165], [429, 165], [429, 174], [306, 174]], k.pinkTrim);
  shape(c, [[336, 165], [338, 158], [348, 158], [350, 165]], k.pinkTrim, .7);
  stroke(c, [[343, 158], [343, 152]], ink, 1.4);
  for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
    pane(c, k, 325 + col * 35, 185 + row * 25, 16, 17, 56 + row * 4 + col, t, 'pinkTrim');
  }
  shape(c, [[306, 266], [429, 266], [429, 272], [306, 272]], k.pinkTrim);
  chevrons(c, k, 319, 281, 30, 41, 6, k.shutterLight, k.shutter);
  rect(c, 316, 277, 36, 4, k.pinkTrim, .7);
  rect(c, 372, 287, 10, 7, k.pinkTrim, .6);
}

function ground(c, k, t, G) {
  const { L, R, B } = G;
  box(c, L, 322, R - L, B - 322, k.road);
  // Patched tar, cracks and a manhole cover in the road.
  shape(c, [[400, 385], [470, 381], [488, 398], [410, 402]], k.roadMark, .5);
  shape(c, [[300, 460], [380, 452], [398, 476], [318, 486]], k.roadMark, .5);
  stroke(c, [[455, 430], [470, 436], [478, 433], [492, 441]], ink, .8);
  stroke(c, [[530, 470], [548, 462], [566, 466]], ink, .8);
  stroke(c, [[355, 350], [372, 355], [383, 352]], ink, .6);
  oval(c, 425, 446, 17, 4.4, ink);
  oval(c, 425, 445.5, 15, 3.6, k.roadMark);
  for (let j = -2; j <= 2; j++) stroke(c, [[425 + j * 5 - 2, 443], [425 + j * 5 + 2, 448]], ink, .45);

  // Far walk along the apartments.
  shape(c, [[250, 322], [395, 322], [395, 327], [250, 327]], k.farWalk, .6);

  // The right-hand walk follows the near building, with a curb dropping towards the viewer.
  const curbR = x => 327 + (x - 395) * .28, baseR = x => rw(x, 345);
  shape(c, [[395, 322], [520, 322], [520, 345], [R, baseR(R)], [R, curbR(R)], [395, 327]], k.walk, .6);
  for (let x = 430; x < R; x += 22 + (x - 400) * .25) stroke(c, [[x, Math.max(322, x < 520 ? 322 : baseR(x))], [x + 6, curbR(x + 6)]], k.joint, .8);
  stroke(c, [[395, 327], [R, curbR(R)]], k.curb, 1.6);
  stroke(c, [[395, 329.5], [R, curbR(R) + 3.5]], ink, .8);
  // A storm drain sits in the gutter.
  shape(c, [[438, 357], [474, 366], [473, 372], [437, 363]], ink, .6);
  for (let j = 1; j < 7; j++) stroke(c, [[438 + j * 5.2, 358.2 + j * 1.3], [437.6 + j * 5.2, 364 + j * 1.3]], k.joint, .7);

  // The near corner walk. Its curb bends round the corner and its slabs widen as they come closer.
  const pts = []; for (let i = 0; i <= 24; i++) {
    const s = i / 24, x = (1 - s) ** 2 * 252 + 2 * s * (1 - s) * 318 + s * s * 338, y = (1 - s) ** 2 * 324 + 2 * s * (1 - s) * 360 + s * s * 420;
    pts.push([x, y]);
  }
  const curbX = y => {
    if (y >= 420) return 338 + (y - 420) * .32;
    for (let i = 1; i < pts.length; i++) if (pts[i][1] >= y) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return x0 + (x1 - x0) * (y - y0) / (y1 - y0 || 1);
    }
    return pts[0][0];
  };
  const bottom = [curbX(B), B], foot = [lwx(B, 338), B];
  shape(c, [[126, 322], ...pts, bottom, foot, [137, 338], [137, 322]], k.walk, .6);
  const rows = [334, 346, 360, 380, 410, 452, 510, 590, 700, 850];
  let previous = null;
  for (const yw of rows) {
    if (yw > B + 60) break;
    const a = [lwx(yw, 338), yw], yc = .97 * yw + 5, b = [curbX(yc), yc];
    if (yw > 338) stroke(c, [a, b], k.joint, .9);
    const mid = [mix(a[0], b[0], .48), mix(a[1], b[1], .48)];
    if (previous) stroke(c, [previous, mid], k.joint, .9);
    previous = mid;
  }
  // Curb top and gutter shadow.
  stroke(c, [...pts, bottom], k.curb, 2.2);
  stroke(c, [...pts.map(([x, y]) => [x + 2.4, y + .6]), [bottom[0] + 2.4, B]], ink, .9);

  // A puddle by the curb reflects the lamp and shivers now and then.
  const puddle = [[340, 414], [356, 409], [378, 411], [389, 418], [376, 425], [350, 426], [337, 421]];
  shape(c, puddle, k.puddle, .6);
}

function puddleShine(c, k, t) {
  const drip = frac(t / 5.3);
  c.save(); c.globalAlpha = .7 * (1 - drip);
  c.beginPath(); c.ellipse(362, 418, 3 + drip * 16, .8 + drip * 4, 0, 0, Math.PI * 2); c.strokeStyle = k.paper; c.lineWidth = .6; c.stroke();
  c.restore();
  oval(c, 357 + Math.sin(t * .9) * .8, 417, 5, 1.3, k.yellow);
}

function paper(c, k, t, G) {
  // Loose sheets and a leaf tumble across the corner on their own gusts.
  const span = G.R - G.L + 80;
  for (let i = 0; i < 4; i++) {
    const period = 15 + i * 4.5, phase = frac(t / period + [.54, .02, .29, .77][i]);
    const gust = phase + .04 * Math.sin(phase * 9 + i);
    const x = G.L - 40 + gust * span, ground = [372, 432, 398, 466][i];
    const hop = Math.abs(Math.sin(t * (1.2 + i * .17) + i * 2.3)) * (6 + i * 2);
    const y = ground - hop, size = [14, 18, 10, 20][i], twist = Math.sin(t * 1.6 + i * 1.9) * .5 + gust * 6;
    c.save(); c.globalAlpha = .45;
    oval(c, x + 2, ground + 2, size * .55, size * .13, ink);
    c.restore();
    c.save(); c.translate(x, y); c.rotate(twist);
    if (i === 2) {
      const leaf = new Path2D('M0 -8 C 5 -5 6 3 0 8 C -6 3 -5 -5 0 -8Z');
      c.fillStyle = k.amber; c.fill(leaf); c.strokeStyle = ink; c.lineWidth = .6; c.stroke(leaf);
    } else {
      const squash = .55 + .45 * Math.abs(Math.cos(t * 1.1 + i));
      c.scale(1, squash);
      shape(c, [[-size * .5, -size * .3], [size * .2, -size * .42], [size * .52, -size * .1], [size * .34, size * .32], [-size * .3, size * .26]], k.paper, .7);
      polygon(c, [[size * .2, -size * .42], [size * .52, -size * .1], [size * .12, -size * .06]], k.paperShade);
      for (let j = 0; j < 3; j++) stroke(c, [[-size * .3, -size * .1 + j * size * .12], [size * .2, -size * .16 + j * size * .12]], k.paperShade, .5);
    }
    c.restore();
  }
}

function streetLife(c, k, t) {
  // A parked sedan on the far side of the street.
  c.save(); c.globalAlpha = .7; oval(c, 414, 335, 52, 4, ink); c.restore();
  shape(c, [[367, 327], [367, 317], [372, 313], [392, 311], [401, 302], [440, 302], [450, 311], [462, 314], [463, 327]], k.car, 1.1);
  shape(c, [[404, 305], [418, 305], [418, 311], [398, 311]], k.carGlass, .7);
  shape(c, [[421, 305], [433, 305], [433, 311], [421, 311]], k.carGlass, .7);
  shape(c, [[436, 305], [440, 305], [447, 311], [436, 311]], k.carGlass, .7);
  stroke(c, [[369, 318.5], [461, 318.5]], k.chrome, 1);
  stroke(c, [[399, 312], [399, 326]], ink, .6);
  stroke(c, [[434, 312], [434, 326]], ink, .6);
  box(c, 367.5, 314.5, 4, 3, k.yellow);
  box(c, 459, 315, 3.4, 3, k.red);
  for (const x of [385, 446]) { disc(c, x, 327, 6.4, ink); disc(c, x, 327, 2.8, k.chrome); }
  stroke(c, [[377, 320], [393, 320]], k.carLight, .8);

  // A wire trash can by the apartments, and a fire hydrant on the corner.
  shape(c, [[296, 304], [306, 304], [304.5, 322], [297.5, 322]], k.blueShade, .8);
  for (let j = 0; j < 4; j++) stroke(c, [[296.6 + j * .4, 308 + j * 4], [305.4 - j * .4, 308 + j * 4]], ink, .5);
  shape(c, [[295, 302], [307, 302], [307, 305], [295, 305]], k.pole, .7);
  polygon(c, [[298, 302], [301, 297.5], [304.5, 302]], k.paper);
  const hx = 300, hy = 434;
  oval(c, hx, hy + 1, 11, 2.6, ink);
  shape(c, [[hx - 6, hy], [hx - 5, hy - 20], [hx + 5, hy - 20], [hx + 6, hy]], k.hydrant, .9);
  shape(c, [[hx - 8, hy - 1], [hx + 8, hy - 1], [hx + 8, hy + 1.5], [hx - 8, hy + 1.5]], k.hydrant, .8);
  shape(c, [[hx - 7.5, hy - 22], [hx + 7.5, hy - 22], [hx + 6.5, hy - 19], [hx - 6.5, hy - 19]], k.hydrant, .8);
  c.beginPath(); c.ellipse(hx, hy - 22, 5.5, 5, 0, Math.PI, 0); c.fillStyle = k.hydrant; c.fill(); c.strokeStyle = ink; c.lineWidth = .9; c.stroke();
  rect(c, hx - 10, hy - 14, 4, 5, k.hydrant, .8); rect(c, hx + 6, hy - 14, 4, 5, k.hydrant, .8);
  rect(c, hx - 2.5, hy - 13, 5, 5, k.hydrantLight, .7);
  stroke(c, [[hx - 3.6, hy - 18], [hx - 3.4, hy - 2]], k.hydrantLight, 1);

  // A no-parking sign by the curb.
  box(c, 494, 262, 2.6, 100, k.pole);
  stroke(c, [[494.4, 262], [494.4, 361]], k.poleLight, .6);
  rect(c, 487, 245, 17, 26, k.plate, .9);
  c.beginPath(); c.arc(495.5, 258, 6, 0, Math.PI * 2); c.strokeStyle = k.red; c.lineWidth = 1.4; c.stroke();
  c.font = '700 9px "Barlow Condensed", system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillStyle = ink; c.fillText('P', 495.5, 258.5);
  stroke(c, [[491.5, 262], [499.5, 254]], k.red, 1.3);

}

function steam(c, k, t) {
  // Steam lifts from the drain in slow puffs.
  c.save();
  for (let i = 0; i < 9; i++) {
    const age = frac(t / 8 + i / 9), rise = age * 80, swell = 3 + age * 13;
    c.globalAlpha = .15 * Math.sin(age * Math.PI);
    oval(c, 456 + Math.sin(t * .6 + i * 1.7) * 4 + age * 12, 362 - rise, swell * 1.5, swell * .6, k.steam);
  }
  c.restore();
}

function lampPost(c, k, t, G) {
  const x = 225, top = -40;
  // Pole, collar and base.
  shape(c, [[x - 2.6, top], [x + 2.6, top], [x + 3.4, 368], [x - 3.4, 368]], k.pole, 1);
  stroke(c, [[x - 1.4, top], [x - 1.9, 366]], k.poleLight, .9);
  shape(c, [[x - 6, 360], [x + 6, 360], [x + 8, 376], [x - 8, 376]], k.pole, 1);
  oval(c, x, 377, 10, 2.6, k.poleLight); c.strokeStyle = ink; c.lineWidth = .8; c.stroke();
  shape(c, [[x - 4, top + 2], [x - 1, top - 6], [x + 1, top - 6], [x + 4, top + 2]], k.pole, .9);
  rect(c, x - 4.5, 280, 9, 3, k.poleLight, .7);
  // A flyer taped to the pole.
  shape(c, [[x - 3.6, 292], [x + 4.2, 291], [x + 4.5, 303], [x - 3.2, 304]], k.paper, .6);
  for (let j = 0; j < 3; j++) stroke(c, [[x - 2.2, 295 + j * 2.6], [x + 3, 294.6 + j * 2.6]], k.paperShade, .5);
  // The arm curves out over the street to the lamp head; on short screens it runs past the top edge.
  line(c, q => { q.moveTo(x, -32); q.bezierCurveTo(x + 4, -54, LAMP[0] - 30, -40, LAMP[0] - 4, LAMP[1] - 6); }, ink, 5.2);
  line(c, q => { q.moveTo(x, -32); q.bezierCurveTo(x + 4, -54, LAMP[0] - 30, -40, LAMP[0] - 4, LAMP[1] - 6); }, k.pole, 3);
  shape(c, [[LAMP[0] - 17, LAMP[1] + 1], [LAMP[0] - 8, LAMP[1] - 8], [LAMP[0] + 9, LAMP[1] - 8], [LAMP[0] + 18, LAMP[1] + 1]], k.pole, 1);
  // The street sign.
  shape(c, [[x - 3, 155], [x + 3, 155], [x + 3, 161], [x - 3, 161]], k.pole, .8);
  c.beginPath(); c.arc(x + 32, 149, 5.5, Math.PI, 0); c.strokeStyle = k.pole; c.lineWidth = 2; c.stroke();
  rect(c, x + 3, 149, 66, 15, k.sign, 1);
  stroke(c, [[x + 5, 151], [x + 67, 151]], k.signText, .5);
  c.font = '600 12px "Barlow Condensed", system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillStyle = k.signText; c.fillText('156th', x + 36, 157);
}

// Moths circle under the lamp, and the lens itself glows above any flicker.
function lampGlow(c, t, level) {
  const [x, y] = LAMP;
  c.save();
  c.globalAlpha = .14 * level; oval(c, x, y + 1.5, 24, 6.4, '#efe0a0');
  c.globalAlpha = 1;
  oval(c, x, y, 16, 4.3, ink);
  c.globalAlpha = .45 + .55 * level; oval(c, x, y + .3, 14.4, 3.4, '#efe46a');
  c.globalAlpha = .7 * level; oval(c, x - 3, y - .3, 6, 1.2, '#fffbd6');
  c.restore();
  for (let i = 0; i < 3; i++) {
    const mx = x + Math.sin(t * (2.1 + i * .4) + i * 2) * (12 + i * 5) + Math.sin(t * 7.3 + i) * 2.5;
    const my = y + 18 + i * 7 + Math.cos(t * (1.7 + i * .3) + i * 1.7) * 8;
    c.save(); c.globalAlpha = .55 + .4 * level;
    oval(c, mx, my, 1.4, .8 + .5 * Math.abs(Math.sin(t * 30 + i)), '#ece6ff');
    c.restore();
  }
}

function nearFacades(c, k, t, G) {
  const { L, R, T, B } = G;
  // Left: a tall purple wall seen almost edge on, receding towards the corner.
  const topAt = x => lw(x, 125), footAt = y => lwx(y, 338);
  shape(c, [[137, 125], [L, topAt(L)], [L, B], [footAt(B), B], [137, 338]], k.wall, 1.2);
  shape(c, [[137, 125], [L, topAt(L)], [L, lw(L, 136)], [137, 136]], k.wallTrim, .9);
  stroke(c, [[137, 131], [L, lw(L, 131)]], k.wallShade, .8);
  box(c, 132, 136, 5, 202, k.wallShade);
  stroke(c, [[137, 125], [137, 338]], ink, 1.2);
  // A recessed shopfront closed with blue folding shutters.
  const top = 195, foot = 338;
  shape(c, [[49, lw(49, top) - 4], [123, lw(123, top) - 2], [123, lw(123, foot)], [49, lw(49, foot)]], ink, 1);
  shape(c, [[116, lw(116, top)], [121, lw(121, top)], [121, lw(121, foot)], [116, lw(116, foot)]], k.wallShade, .6);
  for (let i = 0; i < 6; i++) {
    const a = along(i / 6) + .5, b = along((i + 1) / 6) - .6;
    shape(c, [[a, lw(a, top + 2)], [b, lw(b, top + 2)], [b, lw(b, foot)], [a, lw(a, foot)]], i % 2 ? k.shutter : k.shutterLight, .5);
    const m = (a + b) / 2;
    stroke(c, [[m, lw(m, top + 8)], [m, lw(m, foot - 10)]], i % 2 ? k.shutterLight : k.shutter, Math.max(.6, (b - a) * .12));
  }
  stroke(c, [[55, lw(55, foot - 30)], [121, lw(121, foot - 30)]], ink, .8);
  // Brick ghosts and a cracked patch of render.
  for (const [bx, by] of [[20, 152], [32, 160], [24, 168], [86, 96], [96, 104], [12, 330], [26, 342]]) {
    if (bx < L) continue;
    stroke(c, [[bx, by], [bx + 11, by + 2.4], [bx + 11, by + 7.4], [bx, by + 5]], ink, .8);
  }
  // A downpipe with its brackets.
  if (L < 34) {
    shape(c, [[26, T], [32, T], [32, lw(32, 338) - 6], [26, lw(26, 338) - 6]], k.wallShade, .9);
    stroke(c, [[27.6, T], [27.6, lw(27, 338) - 8]], k.wallTrim, .8);
    for (let y = 40; y < B; y += 90) box(c, 24, y, 10, 3, ink);
    shape(c, [[24, lw(24, 338) - 8], [36, lw(36, 338) - 8], [40, lw(40, 338)], [22, lw(22, 338)]], k.wallShade, .9);
  }
  stroke(c, [[footAt(B), B], [137, 338]], ink, 1.4);

  // Right: the near brick building with arched windows, a fire-escape landing and a herringbone door.
  shape(c, [[520, T], [R, T], [R, rw(R, 345)], [520, 345]], k.brick, 1.2);
  box(c, 520, T, 6, 345 - T, k.brickTrim);
  stroke(c, [[520, T], [520, 345]], ink, 1.2);
  shape(c, [[520, 318], [R, rw(R, 318)], [R, rw(R, 345)], [520, 345]], k.stone, 1);
  for (let j = 0; j < 3; j++) stroke(c, [[520, 327 + j * 6], [R, rw(R, 327 + j * 6)]], k.stoneLine, .7);
  for (let x = 530, n = 0; x < R; x += 14 + (x - 520) * .02, n++) {
    const h = 318 + (n % 3) * 9;
    stroke(c, [[x, rw(x, h)], [x, rw(x, h + 9)]], k.stoneLine, .7);
  }
  const arched = (x, h0, h1, id) => {
    const w = 27, path = new Path2D(), y0 = rw(x, h0), y1 = rw(x, h1), y0b = rw(x + w, h0), y1b = rw(x + w, h1);
    path.moveTo(x, y1); path.lineTo(x, y0 + w * .5); path.bezierCurveTo(x, y0 - w * .1, x + w, y0b - w * .1, x + w, y0b + w * .5);
    path.lineTo(x + w, y1b); path.closePath();
    c.fillStyle = ink; c.fill(path);
    c.save(); c.translate(x + w / 2, (y0 + y1) / 2); c.scale(.82, .9); c.translate(-x - w / 2, -(y0 + y1) / 2);
    c.fillStyle = k.glass; c.fill(path);
    c.restore();
    const on = hash(id, 41) > .62 ? 1 : 0;
    if (on > 0) { c.save(); c.globalAlpha = on * .9; c.translate(x + w / 2, (y0 + y1) / 2); c.scale(.82, .9); c.translate(-x - w / 2, -(y0 + y1) / 2); c.fillStyle = k.amber; c.fill(path); c.restore(); }
    stroke(c, [[x + w / 2, rw(x + w / 2, h0) + 2], [x + w / 2, rw(x + w / 2, h1)]], ink, 1.4);
    stroke(c, [[x + 2, rw(x, (h0 + h1) / 2 + 4)], [x + w - 2, rw(x + w, (h0 + h1) / 2 + 4)]], ink, 1.2);
    if (on < 1) stroke(c, [[x + 5, rw(x, h1 - 8)], [x + 11, rw(x, h1 - 22)]], k.glassLight, 1);
    box(c, x - 2, Math.max(y1, y1b) + .5, w + 4, 2.4, k.stone);
  };
  for (let x = 555, n = 0; x < R; x += 78 + n * 14, n++) {
    arched(x, 41, 106, 140 + n);
    arched(x, 133, 196, 150 + n);
  }
  // Herringbone door and a ground-floor window beyond it.
  const door = (x, w, h0) => {
    const y0 = rw(x, h0), y1 = rw(x, 345), y0b = rw(x + w, h0), y1b = rw(x + w, 345);
    shape(c, [[x - 3, y0 - 4], [x + w + 3, y0b - 4], [x + w + 3, y1b], [x - 3, y1]], ink, .8);
    shape(c, [[x, y0], [x + w, y0b], [x + w, y1b], [x, y1]], k.shutter, .8);
    for (let j = 0; j < 9; j++) for (const [a, b] of [[x + 3, x + w / 2 - 2], [x + w / 2 + 2, x + w - 3]]) {
      const ya = mix(y0, y1, (j + .6) / 9), yb = mix(y0b, y1b, (j + .6) / 9);
      stroke(c, [[a, mix(ya, yb, (a - x) / w) - 4], [(a + b) / 2, mix(ya, yb, ((a + b) / 2 - x) / w)], [b, mix(ya, yb, (b - x) / w) - 4]], k.shutterLight, 1.3);
    }
    stroke(c, [[x + w / 2, mix(y0, y0b, .5)], [x + w / 2, mix(y1, y1b, .5)]], ink, 1);
  };
  door(537, 72, 233);
  for (let x = 640; x < R; x += 110) {
    const y0 = rw(x, 252), y1 = rw(x, 300), w = 44;
    shape(c, [[x - 3, y0 - 3], [x + w + 3, rw(x + w + 3, 249)], [x + w + 3, rw(x + w + 3, 303)], [x - 3, y1 + 3]], k.brickTrim, 1);
    shape(c, [[x, y0], [x + w, rw(x + w, 252)], [x + w, rw(x + w, 300)], [x, y1]], k.glass, 1);
    stroke(c, [[x + w / 2, rw(x + w / 2, 252)], [x + w / 2, rw(x + w / 2, 300)]], ink, 1);
    stroke(c, [[x + 4, rw(x + 4, 292)], [x + 14, rw(x + 14, 262)]], k.glassLight, 1);
  }
  // The fire-escape landing juts over the walk.
  const rail = (h, width, ink2) => stroke(c, [[484, rw(484, h) + 1], [R, rw(R, h)]], ink2, width);
  shape(c, [[484, rw(484, 212) + 1], [R, rw(R, 212)], [R, rw(R, 220)], [484, rw(484, 220) + 1]], k.rail, .8);
  for (let x = 488; x < R; x += 7.5) stroke(c, [[x, rw(x, 158) + 1], [x, rw(x, 212) + 1]], k.rail, 1.1);
  rail(158, 2.4, k.rail); rail(157, .8, k.railLight); rail(182, 1.3, k.rail); rail(213, .8, k.railLight);
  stroke(c, [[484, rw(484, 158) + 1], [484, rw(484, 220) + 1]], k.rail, 2.2);
  for (const x of [498, 580, 670, 760]) if (x < R) stroke(c, [[x, rw(x, 220)], [x + 15, rw(x + 15, 238)], [x + 22, rw(x + 22, 238)]], k.rail, 1.5);
  // A pot of trailing leaves on the landing.
  shape(c, [[507, rw(507, 200)], [519, rw(519, 200)], [517, rw(517, 212)], [509, rw(509, 212)]], k.brickTrim, .6);
  for (let j = 0; j < 6; j++) {
    const a = j / 5 * Math.PI;
    oval(c, 513 + Math.cos(a) * 8, rw(513, 198) - Math.sin(a) * 6, 3.4, 1.6, k.small, a);
  }
}

// Each layer is printed in its night inks, then again in lamp-lit inks inside the beam.
function layer(c, draw, clips) {
  draw(NIGHT); c.save();
  for (const clip of clips) c.clip(clip);
  draw(LIT); c.restore();
}
function onStage(c, G, draw) { c.save(); c.translate(G.ox, G.oy); c.scale(G.u, G.u); draw(); c.restore(); }
const beams = () => { const cone = conePath(); return { cone, upright: [cone, wedgePath()], pool: [poolPath()] }; };

// When the ageing lamp dips, the whole beam darkens with it; the lens still shows over the top.
function finish(c, t, G, cone) {
  const level = lampLevel(t), dim = clamp((.93 - level) * 2.2, 0, .85);
  if (dim > .002) { c.save(); c.clip(cone); c.globalAlpha = dim; box(c, G.L, G.T, G.R - G.L, G.B - G.T, NIGHT.sky); c.restore(); }
  lampGlow(c, t, level);
}

// The still parts of the street are baked into two images per screen size: the block and ground behind the paper,
// and the street furniture, lamp and near walls in front of it. Only moving things are drawn every frame. A poster in
// flight changes size every frame and is drawn directly, as is any depth capture, which needs the separate layers.
function bake(G, scale, t) {
  const make = (draw) => {
    const image = document.createElement('canvas'), c = image.getContext('2d');
    image.width = Math.ceil(G.W * scale); image.height = Math.ceil(G.H * scale);
    c.scale(scale, scale); onStage(c, G, draw.bind(null, c)); return image;
  };
  const B = beams(), panes = [];
  livePanes = panes;
  try {
    const back = make(c => {
      layer(c, k => { skyline(c, k, G); backBlock(c, k, t); }, B.upright);
      layer(c, k => ground(c, k, t, G), B.pool);
    });
    livePanes = null;
    const front = make(c => {
      layer(c, k => streetLife(c, k, t), B.upright);
      layer(c, k => lampPost(c, k, t, G), B.upright);
      layer(c, k => nearFacades(c, k, t, G), B.upright);
    });
    return { scale, back, front, panes };
  } finally { livePanes = null; }
}

export function paint(c, p, t, G) {
  const B = beams(), m = c.getTransform(), scale = Math.hypot(m.a, m.b);
  G.paints = (G.paints ?? 0) + 1;
  if (!c.depthLayer && G.paints > 2 && Math.abs((G.baked?.scale ?? 0) - scale) > scale * .01) G.baked = bake(G, scale, t);
  const baked = !c.depthLayer && G.baked && Math.abs(G.baked.scale - scale) <= scale * .01 ? G.baked : null;
  if (!baked) {
    onStage(c, G, () => {
      layer(c, k => { sky(c, k, t, G); skyline(c, k, G); backBlock(c, k, t); }, B.upright);
      c.depthLayer?.('night-block');
      layer(c, k => { ground(c, k, t, G); puddleShine(c, k, t); }, B.pool);
      layer(c, k => paper(c, k, t, G), B.pool);
      layer(c, k => { streetLife(c, k, t); steam(c, k, t); }, B.upright);
      c.depthLayer?.('streetlight');
      layer(c, k => lampPost(c, k, t, G), B.upright);
      c.depthLayer?.('near-facades');
      layer(c, k => nearFacades(c, k, t, G), B.upright);
      finish(c, t, G, B.cone);
    });
    return;
  }
  const { back, front, panes } = baked;
  onStage(c, G, () => layer(c, k => sky(c, k, t, G), B.upright));
  c.drawImage(back, 0, 0, back.width / scale, back.height / scale);
  onStage(c, G, () => {
    layer(c, k => { for (const [x, y, w, h, id, sill] of panes) pane(c, k, x, y, w, h, id, t, sill); }, B.upright);
    layer(c, k => { puddleShine(c, k, t); paper(c, k, t, G); }, B.pool);
  });
  c.drawImage(front, 0, 0, front.width / scale, front.height / scale);
  onStage(c, G, () => { layer(c, k => steam(c, k, t), B.upright); finish(c, t, G, B.cone); });
}
