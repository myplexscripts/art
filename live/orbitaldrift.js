// A slowly rotating cloud of points, inspired by Ambient Sleep.
import { make as geometry, setup, gradient, glow, hash, TAU } from './art-kit.js?v=20261019-after-hours-detail';
export const title='Orbital Drift', no='No. 07', text='#c3e3ef', dark='#10232e', audio=false, textless=true;
let shellSurfaces;
export function make(W,H) {
  if(shellSurfaces) return {...geometry(W,H), shells:shellSurfaces};
  const dots=Array.from({length:7200},(_,i)=>{
    const y=1-2*(i+.5)/7200, r=Math.sqrt(1-y*y), a=i*Math.PI*(3-Math.sqrt(5));
    const shell=.95+hash(i,4)*.05;
    return {x:Math.cos(a)*r*shell,y:y*shell,z:Math.sin(a)*r*shell,r:.00065+hash(i,8)*.001};
  });
  const shells=[new OffscreenCanvas(1200,1200),new OffscreenCanvas(1200,1200)];
  for(let layer=0;layer<2;layer++) {
    const c=shells[layer].getContext('2d'); c.scale(1200,1200); c.translate(.5,.5);
    const buckets=Array.from({length:16},()=>new Path2D());
    dots.forEach((d,i)=>{
      if((d.z>0?1:0)!==layer)return;
      const x=d.x*.345,y=d.y*.345,r=d.r*(.65+(d.z+1)*.4);
      const light=Math.min(15,Math.max(0,Math.floor((d.z+1)*2.3+(d.y+1)*3.4+(1-Math.abs(d.z))*3+hash(i,9)*2)));
      buckets[light].moveTo(x+r,y); buckets[light].arc(x,y,r,0,TAU);
    });
    buckets.forEach((path,i)=>{c.fillStyle=`rgba(${150+i*6},${199+i*3},255,${.17+i*.048})`; c.fill(path);});
  }
  shellSurfaces=shells;
  return {...geometry(W,H), shells};
}
export function paint(c,p,t,G) {
  c.save(); setup(c,G,'#172a35');
  c.fillStyle=gradient(c,0,-.7,0,.7,[[0,'#142630'],[.47,'#1d3a47'],[.75,'#94bfce'],[1,'#dbeff1']]); c.fillRect(-G.W/G.S,-G.H/G.S,G.W/G.S*2,G.H/G.S*2);
  glow(c,0,.34,.57,'#c3eaff55');
  const R=.345, cy=-.01+Math.sin(t*.13)*.012;
  glow(c,0,cy,R*1.2,'#508dac20');
  c.beginPath(); c.arc(0,cy,R*.976,0,TAU); c.strokeStyle='#a1d4e518'; c.lineWidth=.004; c.stroke();
  c.save(); c.translate(0,cy); c.scale(1,.13); glow(c,0,2.7,R*1.3,'#e2fcff60'); c.restore();
  c.depthLayer?.('shell');
  // Two independently turning layers retain depth without rebuilding 7,200 arcs.
  G.shells.forEach((shell,i)=>{
    if (i === 1) c.depthLayer?.('near-shell');
    c.save(); c.translate(0,cy); c.rotate(t*(i?.028:-.021));
    const ripple=1+Math.sin(t*.19+i)*.008; c.scale(ripple,ripple);
    c.drawImage(shell,-.5,-.5,1,1); c.restore();
  });
  c.depthLayer?.('meridians');
  // Fine, broken meridians give the shell depth without drawing a solid sphere.
  c.save(); c.translate(0,cy); c.rotate(.12*Math.sin(t*.09));
  for(let i=0;i<11;i++) {
    c.beginPath(); c.ellipse(0,0,R*(.07+i*.084),R,0,Math.PI*.12,Math.PI*.94);
    c.strokeStyle=`rgba(183,233,255,${.025+i*.003})`; c.lineWidth=.0008; c.stroke();
  }
  c.restore();
  c.save(); c.translate(0,cy+.25); c.scale(1,.3); glow(c,0,0,.29,'#f3fcff60'); c.restore();
  c.restore();
}
