// A perspective procession of iridescent arches, inspired by Chilltronics.
import { make as geometry, setup, gradient, glow, disc, hash, TAU } from './art-kit.js?v=20261019-after-hours-detail';
export const title='Afterglow Arcade', no='No. 09', text='#d7d2fc', dark='#18102d', audio=false, textless=true;
let archSurface, stageSurface;
const depthMasks = new Map();
function depthMaskFor(id, G) {
  if (!['near-arches', 'front-arch', 'sculptures'].includes(id)) return null;
  if (!depthMasks.has(id)) {
    const canvas = new OffscreenCanvas(1200, 1200), c = canvas.getContext('2d');
    c.scale(1200, 1200); c.translate(.5, .5); stage(c, 0, G, id);
    depthMasks.set(id, canvas);
  }
  return depthMasks.get(id);
}
function polishedArch() {
  if(archSurface) return archSurface;
  archSurface=new OffscreenCanvas(720,1064);
  const c=archSurface.getContext('2d'); c.scale(1600,1600); c.translate(.225,.33);
  arch(c,.006,-.12,.18,.32,'#0b1325',.043*1.14);
  for(let j=0;j<24;j++) {
    const f=j/23, shade=Math.sin(f*Math.PI);
    arch(c,0,-.125,.18+.043*(f-.5),.32,`hsl(${232+Math.sin(f*3)*28} ${40+shade*35}% ${12+shade*26}%)`,.043/22);
  }
  arch(c,0,-.126,.18+.043*.39,.32,'#bb79ff80',.001);
  return archSurface;
}
export function make(W,H) {
  const G = {...geometry(W,H), surface:polishedArch(), stars:Array.from({length:180},(_,i)=>[hash(i,6),hash(i,7),hash(i,8)]), leaves:Array.from({length:260},(_,i)=>{const a=i*2.39996,r=Math.sqrt(hash(i,29));return [Math.cos(a)*r,Math.sin(a)*r,hash(i,31)];})};
  if(!stageSurface) {
    stageSurface=new OffscreenCanvas(1200,1200);
    const c=stageSurface.getContext('2d'); c.scale(1200,1200); c.translate(.5,.5);
    stage(c,0,G);
  }
  return {...G, stage:stageSurface};
}
function arch(c,x,y,r,bottom,ink,width) {
  c.beginPath(); c.moveTo(x-r,bottom); c.lineTo(x-r,y); c.arc(x,y,r,Math.PI,TAU); c.lineTo(x+r,bottom);
  c.strokeStyle=ink; c.lineWidth=width; c.lineCap='butt'; c.stroke();
}
export function paint(c,p,t,G) {
  c.save(); setup(c,G,'#99d9d9');
  c.fillStyle=gradient(c,0,-.7,0,.65,[[0,'#80d7d6'],[.44,'#d2e6d5'],[.66,'#eacacb'],[1,'#5c76a3']]); c.fillRect(-G.W/G.S,-G.H/G.S,G.W/G.S*2,G.H/G.S*2);
  // Slow cloud banks surround a cutout of the night sky.
  for(let i=0;i<13;i++) {
    const x=(hash(i,13)-.5)*1.7+Math.sin(t*.025+i)*.035, y=-.59+hash(i,14)*.85;
    c.save(); c.translate(x,y); c.scale(1,.55); glow(c,0,0,.16+hash(i,15)*.13,'#fff1daaa'); c.restore();
  }
  c.drawImage(G.stage,-.5,-.5,1,1);
  if (c.depthSelection) {
    const mask = depthMaskFor(c.depthSelection, G);
    if (mask) c.depthMask(c.depthSelection, mask, -.5, -.5, 1, 1);
  }
  // A moving highlight glides over the nearest arch while its geometry stays still.
  arch(c,-.02,-.073,.19,.372,`hsla(${180+Math.sin(t*.15)*30} 90% 70% / ${.22+.15*Math.sin(t*.22)})`,.0016);
  c.restore();
}

function stage(c,t,G,from=null) {
  let visible = from === null;
  if (visible) {
    c.fillStyle='#060d20'; c.fillRect(-.36,-.4,.72,.82);
    for(const [x,y,r] of G.stars)disc(c,(x-.5)*.7,y*.52-.39,.0005+r*.0007,`rgba(164,225,255,${.3+r*.45+.12*Math.sin(t*.4+x*20)})`);
    c.fillStyle=gradient(c,0,.03,0,.42,[[0,'#f2bcb6'],[.25,'#c299bc'],[1,'#8982b4']]); c.fillRect(-.36,.03,.72,.39);
  }
  // The vanishing point is shared by every arch and its floor shadow.
  const vx=-.02+Math.sin(t*.07)*.007, horizon=.052;
  if (visible) glow(c,vx,horizon-.02,.09,'#ecedf8a0');
  for(let i=11;i>=0;i--) {
    if (from === 'near-arches' && i === 2 || from === 'front-arch' && i === 0) visible = true;
    if (!visible) continue;
    const s=Math.pow(.79,i), x=vx, y=horizon-.125*s, r=.18*s, bottom=horizon+.32*s, thick=.043*s;
    c.save(); c.translate(x,bottom); c.scale(1,.18); glow(c,0,0,r*1.5,'#32224c55'); c.restore();
    // Bake the 24 polished bands once; only reflected light changes each frame.
    c.drawImage(G.surface,x-.225*s,horizon-.33*s,.45*s,.665*s);
    arch(c,x,y,r+thick*.24,bottom,`hsla(${180+Math.sin(t*.15+i*.4)*30} 90% 70% / ${.55*s})`,.0018*s);
    c.fillStyle=gradient(c,0,bottom-.02*s,0,bottom+.007*s,[[0,'#25244700'],[1,'#111d3990']]);
    c.fillRect(x-r-thick/2,bottom-.02*s,thick,.023*s); c.fillRect(x+r-thick/2,bottom-.02*s,thick,.023*s);
  }
  // Tiny sculptural tree and porcelain orb keep the scale readable.
  if (from === 'sculptures') visible = true;
  if (!visible) return;
  c.save(); c.translate(.286,.08); c.rotate(Math.sin(t*.17)*.018);
  c.beginPath(); c.moveTo(-.005,.085); c.bezierCurveTo(.009,.045,-.006,.026,0,-.014); c.strokeStyle='#977130'; c.lineWidth=.007; c.stroke();
  for(let j=0;j<4;j++){c.beginPath();c.moveTo(0,.035);c.lineTo((j-1.5)*.013,-.012);c.strokeStyle='#b69742';c.lineWidth=.002;c.stroke();}
  disc(c,0,-.025,.034,'#507a69');
  for(const [x,y,r] of G.leaves)disc(c,x*.033,y*.033-.025,.0015+r*.0009,`hsl(${104+r*55} 27% ${38+r*23}%)`);
  c.restore();
  c.save(); c.translate(-.302,.283); c.scale(1,.23); glow(c,0,0,.024,'#41476a85'); c.restore();
  const ball=c.createRadialGradient(-.309,.257,.001,-.3,.272,.017); ball.addColorStop(0,'#fffafa'); ball.addColorStop(.35,'#dfeef8'); ball.addColorStop(1,'#8598c4'); disc(c,-.3,.27,.015,ball);
}
