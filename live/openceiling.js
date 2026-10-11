// Dreamscapes No. 05: an open courtyard beneath an impossibly large, low sun.
import { makeWorld, box, disc, oval, polygon, line, arch, archPath, clouds, leaf, ripples } from './dream-kit.js?v=20261011-dreamscapes';
export const title = 'Open Ceiling', no = 'No. 05', dark = '#354652', text = '#354652', audio = 'harbor', grain = true;
export const make = (W, H) => makeWorld(W, H, 91);
const K = { sky: '#526d7b', cloud: '#708795', halo: '#8c9b9e', sun: '#d6b984', wall: '#a67f73', plaster: '#b38d79',
  right: '#506b72', panel: '#688187', dark: '#354f57', floor: '#967f78', tile: '#b39b87', greenTile: '#85948b',
  grout: '#c7b49c', shadow: '#70646d', pot: '#b48170', rim: '#d0a184', leaf: '#5f8069', deepLeaf: '#3b6259', water: '#537d84' };
function potPlant(c, x, y, size, t) {
  oval(c, x, y + size * .05, size * .34, size * .06, K.shadow);
  polygon(c, [[x - size * .27, y - size * .34], [x + size * .27, y - size * .34],
    [x + size * .20, y], [x - size * .20, y]], K.pot);
  oval(c, x, y - size * .34, size * .27, size * .055, K.rim);
  oval(c, x, y - size * .35, size * .22, size * .032, K.deepLeaf);
  for (let j = 0; j < 3; j++) line(c, q => { q.moveTo(x - size * .20 + j * size * .10, y - size * .27);
    q.quadraticCurveTo(x - size * .18 + j * size * .09, y - size * .14, x - size * .15 + j * size * .08, y - size * .03); }, K.rim, size * .012);
  for (let stem = 0; stem < 5; stem++) {
    const dx = (stem - 2) * size * .23, height = size * (.62 + (stem % 3) * .20), sway = Math.sin(t * .08 + stem) * size * .012;
    line(c, q => { q.moveTo(x, y - size * .35); q.quadraticCurveTo(x + dx * .65, y - size * .63, x + dx + sway, y - size * .35 - height); }, K.deepLeaf, size * .018);
    for (let j = 0; j < 4; j++) {
      const f = .28 + j * .19, xx = x + dx * f, yy = y - size * .35 - height * f;
      for (const side of [-1, 1]) leaf(c, xx, yy, size * (.27 + j * .025), size * .085, side * (.76 - j * .05) + sway / size,
        (stem + j) % 3 ? K.leaf : K.deepLeaf, K.deepLeaf);
    }
  }
}
export function paint(c, p, t, G) {
  const { W, H, S } = G;
  c.save(); box(c, 0, 0, W, H, K.sky);
  const sunX = W * .56 + Math.sin(t * .014) * S * .13, sunY = H * .26 + Math.cos(t * .018) * S * .03;
  disc(c, sunX, sunY, S * .37, K.halo); disc(c, sunX, sunY, S * .245, K.sun);
  clouds(c, G, t, K.cloud, 4, .35, 131);
  // The back parapet is open to the sky; no roof or ceiling closes the room.
  box(c, W * .20, H * .61, W * .60, H * .06, K.dark);
  box(c, W * .19, H * .61, W * .62, S * .012, K.grout);
  for (let i = 0; i < 8; i++) box(c, W * (.23 + i * .076), H * .64, S * .003, H * .025, K.panel);
  c.depthLayer?.('courtyard-floor');
  box(c, 0, H * .64, W, H * .36 + S, K.floor);
  const columns = 9, rows = 10, vp = W * .54;
  const tx = (col, f) => vp + (col / columns - .5) * W * 1.90 * (.3 + f * .75);
  const ty = f => H * .64 + H * .42 * f ** 1.7;
  for (let row = 0; row < rows; row++) {
    const a = row / rows, b = (row + 1) / rows;
    for (let col = 0; col < columns; col++) {
      const points = [[tx(col, a), ty(a)], [tx(col + 1, a), ty(a)], [tx(col + 1, b), ty(b)], [tx(col, b), ty(b)]];
      polygon(c, points, (col + row) % 3 === 0 ? K.greenTile : (col + row) % 2 ? K.tile : K.floor);
      line(c, q => { points.forEach(([x, y], i) => i ? q.lineTo(x, y) : q.moveTo(x, y)); q.closePath(); }, K.grout, S * .0018);
      if (row > 5 && (col + row) % 3 === 0) {
        const cx = (tx(col, b) + tx(col + 1, b)) / 2, cy = (ty(a) + ty(b)) / 2, size = S * .006;
        polygon(c, [[cx,cy-size],[cx+size,cy],[cx,cy+size],[cx-size,cy]], K.grout);
      }
    }
  }
  const sweep = Math.sin(t * .016) * S * .12;
  polygon(c, [[W * .20,H * .65],[W * .28,H * .65],[W * .55 + sweep,H + S],[W * .37 + sweep,H + S]], K.shadow);
  polygon(c, [[W * .80,H * .65],[W * .86,H * .64],[W * .88 + sweep,H + S],[W * .74 + sweep,H + S]], K.shadow);
  c.depthLayer?.('courtyard-walls');
  const leftWall = [[-S, -S], [W * .22, H * .14], [W * .22, H * .65], [-S, H + S]];
  const rightWall = [[W + S, -S], [W * .80, H * .16], [W * .80, H * .65], [W + S, H + S]];
  polygon(c, leftWall, K.wall); polygon(c, rightWall, K.right);
  // Printed plaster panels, horizontal courses and broad patches of sunlight.
  polygon(c, [[0,H*.19],[W*.22,H*.28],[W*.22,H*.55],[0,H*.66]], K.plaster);
  polygon(c, [[W*.80,H*.28],[W,H*.17],[W,H*.56],[W*.80,H*.61]], K.panel);
  for (const side of [-1, 1]) {
    const a = side < 0 ? 0 : W, b = side < 0 ? W * .22 : W * .80;
    for (const [ay,by] of [[.18,.27],[.65,.55],[.76,.65]]) line(c, q => { q.moveTo(a,H*ay);q.lineTo(b,H*by); }, side < 0 ? K.rim : K.grout, S * .004);
    line(c, q => { q.moveTo(b,H*.15); q.lineTo(b,H*.65); }, K.grout, S * .009);
  }
  c.save(); c.beginPath(); rightWall.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y)); c.closePath();c.clip();
  polygon(c, [[W*.73,H*.31],[W*1.03,H*.20],[W*1.03,H*.40],[W*.73,H*.48]], '#899995');
  c.restore();
  // A shaded niche, a little urn and moulded ledge occupy the left wall.
  const nx = W * .035, ny = H * .33, nw = Math.min(S * .13, W * .14), nh = S * .39;
  arch(c, nx - S * .009, ny - S * .009, nw + S * .018, nh + S * .018, K.rim);
  arch(c, nx, ny, nw, nh, K.dark);
  oval(c, nx + nw * .52, ny + nh * .76, nw * .21, nw * .27, K.pot);
  box(c, nx + nw * .41, ny + nh * .61, nw * .22, nh * .13, K.pot);
  oval(c, nx + nw * .52, ny + nh * .61, nw * .16, nw * .03, K.rim);
  box(c, nx - nw * .12, ny + nh, nw * 1.24, S * .018, K.dark);
  box(c, nx - nw * .08, ny + nh - S * .005, nw * 1.16, S * .009, K.rim);
  // Courtyard fountain: a shallow ceramic bowl and a tiny, gently swaying stream.
  c.depthLayer?.('fountain');
  const fx = W * .46, fy = H * .84, fw = S * .24;
  oval(c, fx, fy + fw * .25, fw * .73, fw * .12, K.shadow);
  box(c, fx - fw * .12, fy - fw * .01, fw * .24, fw * .23, K.pot);
  oval(c, fx, fy + fw * .22, fw * .26, fw * .045, K.rim);
  c.beginPath();c.moveTo(fx-fw*.55,fy-fw*.14);c.bezierCurveTo(fx-fw*.43,fy+fw*.17,fx+fw*.43,fy+fw*.17,fx+fw*.55,fy-fw*.14);c.closePath();c.fillStyle=K.pot;c.fill();
  oval(c, fx, fy - fw * .14, fw * .56, fw * .14, K.rim);
  oval(c, fx, fy - fw * .16, fw * .49, fw * .10, K.water);
  ripples(c, fx, fy - fw * .16, fw * .42, fw * .084, t, K.grout, S, 4);
  line(c, q => { q.moveTo(fx,fy-fw*.15);q.bezierCurveTo(fx+Math.sin(t*.12)*fw*.017,fy-fw*.52,fx-fw*.06,fy-fw*.53,fx-fw*.07,fy-fw*.21); }, K.grout, S * .0022);
  c.depthLayer?.('courtyard-plants');
  potPlant(c, W * .88, H * .95, S * .22, t);
  // A small vine comes in over the wall rather than filling the central sky.
  for (let i=0;i<6;i++) { const x=W*.025+i*S*.021,y=H*.04+i*S*.013;
    line(c,q=>{q.moveTo(x,y);q.lineTo(x+S*.025,y+S*.015);},K.deepLeaf,S*.003);
    leaf(c,x,y,S*.060,S*.018,1.8+Math.sin(t*.07+i)*.018,i%2?K.leaf:K.deepLeaf,K.deepLeaf);
  }
  c.restore();
}
