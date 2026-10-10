// Music Series No. 01: Needle Drop. Original geometric artwork and animation.
// A vinyl deck beneath a late-night listening-room window. Every motion is visual;
// the scene deliberately has no soundtrack or audio-dependent behaviour.
import { C } from './kit.js';

export const title = 'NEEDLE DROP', no = 'No. 01', text = '#31243a', dark = '#241d30';
export const audio = false;
const TAU = Math.PI * 2;
const K = { plum: '#31243a', ink: '#241d30', groove: '#494052', rose: '#dc947a', brick: '#ad513d', ochre: '#cf8145', teal: '#407570', mint: '#9bb6a0', sand: '#edcda0' };

export function make(W, H) {
  const r = Math.min(W * .29, H * .285);
  return { W, H, r, x: W * .5, y: H * .55 };
}

function disc(c, x, y, r, ink) {
  c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = ink; c.fill();
}
function round(c, x, y, w, h, r, ink) {
  c.beginPath(); c.roundRect(x, y, w, h, r); c.fillStyle = ink; c.fill();
}
function line(c, points, width, ink) {
  c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
  c.strokeStyle = ink; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
}

function speaker(c, x, y, w, h, t, phase) {
  round(c, x, y, w, h, w * .06, K.plum);
  round(c, x + w * .07, y + h * .03, w * .86, h * .94, w * .04, K.brick);
  for (let i = 0; i < 2; i++) {
    const cy = y + h * (.28 + i * .43), radius = w * (.29 + i * .06);
    const pulse = 1 + .025 * Math.sin(t * 1.7 + phase + i);
    disc(c, x + w / 2, cy, radius, K.ink);
    disc(c, x + w / 2, cy, radius * .78 * pulse, K.groove);
    disc(c, x + w / 2, cy, radius * .36 * pulse, K.ink);
    disc(c, x + w / 2, cy, radius * .11, C.gold);
  }
}

function record(c, r, t) {
  disc(c, 0, 0, r, K.ink);
  // Grooves stay circular; the label and four short glints turn with the vinyl.
  for (let i = 0; i < 19; i++) {
    const rr = r * (.39 + i * .030);
    c.beginPath(); c.arc(0, 0, rr, 0, TAU); c.strokeStyle = i % 3 ? K.groove : '#625361'; c.lineWidth = r * .004; c.stroke();
  }
  c.save(); c.rotate(t * .72);
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2;
    c.beginPath(); c.arc(0, 0, r * (.65 + i * .055), a, a + .34);
    c.strokeStyle = K.mint; c.lineWidth = r * .011; c.stroke();
  }
  disc(c, 0, 0, r * .32, C.orange);
  c.save(); c.beginPath(); c.arc(0, 0, r * .32, 0, TAU); c.clip();
  round(c, -r * .35, -r * .32, r * .7, r * .20, 0, C.gold);
  round(c, -r * .35, r * .09, r * .7, r * .06, 0, K.brick);
  c.restore();
  c.textAlign = 'center'; c.fillStyle = K.plum; c.font = `bold ${r * .13}px "Arial Narrow", Arial, sans-serif`;
  c.fillText('SIDE A', 0, -r * .045);
  c.font = `bold ${r * .047}px Arial, sans-serif`; c.fillText('33 ⅓  ·  STEREO', 0, r * .23);
  c.restore();
  disc(c, 0, 0, r * .055, C.cream); disc(c, 0, 0, r * .016, K.ink);
}

function deck(c, r, t) {
  const left = -1.39 * r, top = -1.17 * r, w = 2.78 * r, h = 2.34 * r;
  // A flat offset shadow, warm wood edge and cream enamel face.
  round(c, left + .06 * r, top + .12 * r, w, h, .11 * r, K.ink);
  round(c, left, top + .04 * r, w, h, .10 * r, K.brick);
  round(c, left, top, w, h - .12 * r, .10 * r, C.cream);
  round(c, left + .055 * r, top + .055 * r, w - .11 * r, h - .23 * r, .075 * r, K.sand);
  c.save(); c.translate(-r * .32, -r * .065);
  disc(c, 0, 0, r * .96, K.plum); disc(c, 0, 0, r * .925, C.cream);
  for (let i = 0; i < 56; i++) {
    const a = i * TAU / 56 + t * .72;
    disc(c, Math.cos(a) * r * .913, Math.sin(a) * r * .913, r * .009, K.plum);
  }
  record(c, r * .88, t); c.restore();
  // Counterweight, pivot, jointed tonearm and cartridge; the arm sways slightly.
  const ax = r * .99, ay = -r * .70, tilt = .025 * Math.sin(t * .24);
  disc(c, ax, ay, r * .155, K.brick); disc(c, ax, ay, r * .105, K.plum);
  c.save(); c.translate(ax, ay); c.rotate(tilt);
  round(c, -r * .067, -r * .30, r * .134, r * .30, r * .03, K.plum);
  line(c, [[0,0],[-r * .095,r * .70],[-r * .58,r * 1.19]], r * .055, K.plum);
  line(c, [[-r * .015,0],[-r * .11,r * .69],[-r * .59,r * 1.18]], r * .025, C.cream);
  c.translate(-r * .58, r * 1.19); c.rotate(.72);
  round(c, -r * .055, -r * .04, r * .11, r * .20, r * .018, K.teal);
  round(c, -r * .025, r * .14, r * .05, r * .075, 0, C.orange); c.restore();
  round(c, -r * 1.15, r * .92, r * .22, r * .08, r * .035, K.plum);
  disc(c, -r * 1.23, r * .96, r * .032, .5 + .5 * Math.sin(t * 2) > .5 ? C.orange : K.brick);
  disc(c, r * .96, r * .94, r * .067, K.plum);
  line(c, [[r * .96, r * .94],[r * .96 + Math.sin(t * .3) * r * .027, r * .90]], r * .009, C.cream);
  c.fillStyle = K.plum; c.font = `bold ${r * .054}px Arial, sans-serif`; c.textAlign = 'left';
  c.fillText('ND—01', -r * .75, r * .99);
  c.textAlign = 'right'; c.fillText('HI–FI', r * .73, r * .97);
}

export function paint(c, p, t, G) {
  const {W,H,r,x,y} = G;
  c.fillStyle = K.rose; c.fillRect(0,0,W,H);
  // Broad ink bands drift like slow sound waves across the wall.
  for (let i = 0; i < 5; i++) {
    c.beginPath(); c.moveTo(-20,H * (.15 + i * .09));
    for (let xx = -20; xx <= W + 20; xx += 20) {
      const yy = H * (.15 + i * .09) + Math.sin(xx / W * 5 + t * .20 + i * .8) * H * .035;
      c.lineTo(xx, yy);
    }
    c.lineTo(W+20,H); c.lineTo(-20,H); c.closePath();
    c.fillStyle = [K.ochre,C.orange,K.brick,K.plum,K.ink][i]; c.fill();
  }
  // A round teal window with a golden moon and slowly moving clouds.
  const wx = W * .77, wy = H * .18, wr = Math.min(W * .14,H * .16);
  disc(c,wx,wy,wr*1.08,K.plum); disc(c,wx,wy,wr,C.cream);
  c.save(); c.beginPath(); c.arc(wx,wy,wr*.92,0,TAU); c.clip();
  disc(c,wx,wy,wr*.93,K.teal); disc(c,wx+wr*.28,wy-wr*.15,wr*.30,C.gold);
  for(let i=0;i<3;i++) {
    const drift = ((t * (3+i) + i * wr * .9) % (wr*3)) - wr * 1.5;
    round(c,wx+drift,wy+wr*(-.50+i*.44),wr*.85,wr*.09,wr*.045,K.mint);
  }
  c.restore();
  // Two tall cabinets frame the deck; their cones breathe at a visual rhythm.
  const sw = Math.min(W*.17,r*.63), sh = Math.min(H*.43,r*1.9);
  speaker(c,W*.035,H*.31,sw,sh,t,0); speaker(c,W-sw-W*.035,H*.31,sw,sh,t,1.5);
  c.fillStyle = K.teal; c.fillRect(0,H*.76,W,H*.24);
  for(let i=0;i<7;i++) {
    c.beginPath(); c.moveTo(0,H*(.78+i*.045));
    c.bezierCurveTo(W*.35,H*(.77+i*.045)+Math.sin(t*.25+i)*10,W*.7,H*(.84+i*.045),W,H*(.80+i*.045));
    c.strokeStyle= i%2?K.mint:K.plum; c.lineWidth=H*.006; c.stroke();
  }
  // The cable has a gentle, independent sway along the tabletop.
  c.beginPath();c.moveTo(x+r*.95,y+r*.99);
  c.bezierCurveTo(W*.94,H*.90,W*.42,H*.92+Math.sin(t*.35)*7,W*.36,H);
  c.strokeStyle=K.ink;c.lineWidth=r*.035;c.lineCap='round';c.stroke();
  c.save(); c.translate(x,y); c.rotate(-.085); deck(c,r,t); c.restore();
  // A graphic record sleeve and sleeve sticker sit in the foreground.
  c.save(); c.translate(W*.14,H*.88); c.rotate(-.20);
  const size=r*.72; round(c,-size*.45,-size*.45,size,size,size*.015,C.cream);
  c.save();c.beginPath();c.rect(-size*.41,-size*.41,size*.92,size*.92);c.clip();
  disc(c,size*.16,-size*.04,size*.41,K.teal);disc(c,size*.16,-size*.04,size*.30,K.plum);disc(c,size*.16,-size*.04,size*.15,C.orange);
  for(let i=0;i<4;i++)round(c,-size*.45,size*(.15+i*.085),size*.95,size*.038,0,i%2?K.brick:C.gold);
  c.restore();c.restore();
  // A small bar motif pulses above the left speaker, explicitly without sound.
  const bx=W*.065,by=H*.19,bw=Math.min(W*.032,r*.11);
  for(let i=0;i<5;i++) {
    const h=H*(.027+.022*(.5+.5*Math.sin(t*1.3-i*.7)));
    round(c,bx+i*bw*1.6,by-h,bw,h,bw*.45,i%2?C.cream:K.plum);
  }
}
