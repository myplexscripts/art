// Dreamscapes No. 06: trees grow in both directions around a suspended lake.
import { makeWorld, hash, box, disc, oval, polygon, line, leaf, stars, clouds, ripples } from './dream-kit.js?v=20261011-dreamscapes';
export const title = 'Mirror Garden', no = 'No. 06', dark = '#253f43', text = '#253f43', audio = 'jungle', grain = true;
export const make = (W, H) => makeWorld(W, H, 111);
const K = { sky: '#3a575c', halo: '#4e7174', soft: '#6f8a86', moon: '#c8bd91', dark: '#233f40',
  tree: '#365c50', leaf: '#5c8165', light: '#869b75', bank: '#688573', edge: '#a6ae8b', water: '#477880', deepWater: '#37616b', gold: '#d4b37b' };
function tree(c, x, y, size, t, seed, inverted = false, far = false) {
  c.save(); c.translate(x, y); if (inverted) c.scale(1, -1);
  const trunk = far ? K.tree : K.dark, leaves = far ? K.leaf : K.tree;
  polygon(c, [[-size*.026,0],[-size*.015,-size*.52],[size*.008,-size*.92],[size*.027,-size*.45],[size*.047,0]], trunk);
  for (let j = 0; j < 7; j++) {
    const side = j % 2 ? 1 : -1, f = .25 + j * .075, xx = side * size * (.12 + hash(j,seed)*.15), yy = -size*f;
    line(c,q=>{q.moveTo(size*.009,-size*(f-.13));q.quadraticCurveTo(xx*.61,yy+size*.025,xx,yy-size*.08);},trunk,size*.019);
    c.save(); c.translate(xx, yy - size*.06);c.rotate(Math.sin(t*.07+seed+j)*.018);
    for (let k = 0; k < 5; k++) {
      const angle=(k-2)*.55+side*.40, length=size*(.17+hash(j*5+k,seed+1)*.075);
      leaf(c, Math.sin(angle)*size*.023,Math.cos(angle)*size*.008,length,length*.23,angle,
        k%3?leaves:K.leaf, far?null:trunk);
    }
    if (!far && j%3===0) { disc(c,xx+side*size*.044,yy-size*.074,size*.012,K.moon); disc(c,xx+side*size*.021,yy-size*.061,size*.009,K.gold); }
    c.restore();
  }
  leaf(c,size*.009,-size*.71,size*.25,size*.065,Math.sin(t*.06+seed)*.024,leaves,trunk);
  c.restore();
}
export function paint(c, p, t, G) {
  const { W,H,S }=G, cy=H*.55, ry=Math.min(S*.18,H*.19), rx=W*.53;
  const upper=cy-ry*.74, lower=cy+ry*.77;
  c.save();box(c,0,0,W,H,K.sky);
  const mx=W*.62,my=H*.22,mr=S*.13;
  disc(c,mx,my,mr*2.2,K.halo);disc(c,mx,my,mr*1.54,K.soft);disc(c,mx,my,mr,K.moon);
  stars(c,G,t,K.edge,.98);clouds(c,G,t,K.halo,6,.79,143);
  // Far trees provide small silhouettes behind the banks and ample central sky.
  for(const [x,s,seed]of [[.23,.25,13],[.40,.17,19],[.74,.24,23],[.89,.18,27]]) tree(c,W*x,upper-S*.009,S*s,t,seed,false,true);
  oval(c,W*.5,cy,rx+S*.016,ry+S*.027,K.bank);
  oval(c,W*.5,cy,rx,ry,K.water);
  // Actual reflected branches sit within the water; growing-downward trees
  // outside the lake make the impossible garden distinct from an ordinary pond.
  const lake=new Path2D();lake.ellipse(W*.5,cy,rx,ry,0,0,Math.PI*2);
  c.save();c.clip(lake);
  c.save();c.globalAlpha=.24;c.translate(Math.sin(t*.045)*S*.009,cy*2);c.scale(1,-1);
  for(const [x,s,seed]of [[.23,.25,13],[.40,.17,19],[.74,.24,23]])tree(c,W*x,upper-S*.009,S*s,t,seed,false,true);
  c.restore();
  for(let j=0;j<12;j++) {
    const yy=cy-ry+ry*2*(j/12);
    c.beginPath();c.moveTo(-S,cy+ry+S);
    for(let i=0;i<=48;i++){const f=i/48,xx=-S+f*(W+S*2),py=yy+Math.sin(f*14-t*.12+j*.67)*S*.005; c.lineTo(xx,py);}
    c.lineTo(W+S,cy+ry+S);c.closePath();c.globalAlpha=.36;c.fillStyle=j%2?K.deepWater:K.water;c.fill();c.globalAlpha=1;
    if(j%2===0){c.save();c.setLineDash([S*.025,S*.073]);c.lineDashOffset=-t*S*.002-j*S*.047;
      line(c,q=>{for(let i=0;i<=48;i++){const f=i/48,xx=-S+f*(W+S*2),py=yy+Math.sin(f*14-t*.12+j*.67)*S*.005;i?q.lineTo(xx,py):q.moveTo(xx,py);}},K.edge,S*.0011);c.restore();}
  }
  ripples(c,W*.57+Math.sin(t*.028)*S*.04,cy,Math.min(W*.32,S*.38),ry*.46,t,K.soft,S,7);
  // A warm leaf-fish follows a broad, unhurried path beneath the ripples.
  const fishX=W*.5+Math.sin(t*.033)*S*.21,fishY=cy+Math.sin(t*.071)*ry*.29;
  c.save();c.translate(fishX,fishY);const direction=Math.cos(t*.033)>=0?1:-1;c.scale(direction,1);
  oval(c,0,0,S*.024,S*.008,K.gold);polygon(c,[[-S*.018,0],[-S*.034,-S*.010],[-S*.034,S*.010]],K.gold);
  disc(c,S*.013,-S*.002,S*.0017,K.dark);c.restore();
  c.restore();
  c.depthLayer?.('lake-rim');
  c.beginPath();c.ellipse(W*.5,cy,rx+S*.004,ry+S*.007,0,0,Math.PI*2);c.strokeStyle=K.edge;c.lineWidth=S*.003;c.stroke();
  // Broken grassy banks and their reflected roots have matching, flat contours.
  for(const side of [-1,1]) {
    const by=side<0?upper:lower;
    c.beginPath();c.moveTo(-S*.03,by);
    for(let i=0;i<=32;i++){const f=i/32,xx=f*(W+S*.06)-S*.03,yy=by+side*S*(.024*Math.sin(f*7.1)+.008*Math.sin(f*19));c.lineTo(xx,yy);}
    c.lineTo(W+S*.03,by+side*S*.026);c.lineTo(-S*.03,by+side*S*.026);c.closePath();c.fillStyle=K.bank;c.fill();
    for(let i=0;i<20;i++){const xx=W*(i/19),yy=by+side*S*.024*Math.sin(i/19*7.1);
      leaf(c,xx,yy,S*.026,S*.008,side<0?(i%2?.9:-.9):(i%2?2.2:-2.2),i%3?K.leaf:K.light);}
  }
  c.depthLayer?.('upright-trees');
  tree(c,W*.075,upper,S*.62,t,35);tree(c,W*.94,upper,S*.53,t,42);
  c.depthLayer?.('inverted-trees');
  tree(c,W*.14,lower,S*.52,t,35,true);tree(c,W*.82,lower,S*.57,t,42,true);
  tree(c,W*.43,lower+S*.012,S*.24,t,61,true,true);
  c.restore();
}
