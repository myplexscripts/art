// Overlapping translucent aqua loops, inspired by Pure Chill.
import { make, setup, gradient, TAU } from './art-kit.js?v=20261011-clock-edge';
export { make };
export const title='Tidal Bloom', no='No. 08', text='#068a8b', dark='#063f48', audio=false, textless=true;
function loop(path,r,t,phase,reverse=false) {
  const n=180;
  for(let j=0;j<=n;j++) {
    const a=(reverse?-1:1)*j/n*TAU;
    const rr=r*(1+.075*Math.sin(a*3+phase+t*.12)+.047*Math.sin(a*5-phase-t*.09)+.025*Math.cos(a*2+t*.1));
    const x=Math.cos(a)*rr, y=Math.sin(a)*rr;
    j?path.lineTo(x,y):path.moveTo(x,y);
  }
  path.closePath();
}
export function paint(c,p,t,G) {
  c.save(); setup(c,G,'#f5f3e4');
  const colors=['#00ded9','#00c6d6','#05ebda','#00b2cb','#18d4c0','#00e9e5'];
  c.depthLayer?.('loops');
  for(let i=0;i<6;i++) {
    if (i === 3) c.depthLayer?.('middle-loops');
    if (i === 5) c.depthLayer?.('near-loop');
    c.save(); c.rotate(i*.23+Math.sin(t*.075+i)*.09);
    c.translate(Math.cos(i*1.1+t*.09)*.017,Math.sin(i*1.1+t*.09)*.017);
    const path=new Path2D(); loop(path,.32+i*.006,t,i*.95); loop(path,.205+i*.003,t,i*.7,true);
    c.fillStyle=gradient(c,-.35,-.3,.32,.32,[[0,colors[i]],[.5,colors[(i+1)%6]],[1,colors[(i+3)%6]]]);
    c.globalAlpha=.42; c.fill(path,'evenodd');
    c.strokeStyle=colors[i]; c.globalAlpha=.17; c.lineWidth=.001; c.stroke(path);
    c.restore();
  }
  c.restore();
}
