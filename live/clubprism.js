// EDM Essentials: striped triangular beams sweep like club spotlights, on a four-on-the-floor clock.
import { make,setup,beat,polygon,circle } from './genre-kit.js?v=20261011-clock-fix';
export { make };
export const title='Club Prism', no='No. 01', genre='Dance / EDM', text='#b3efdc', dark='#003b2d', audio=false, textless=true;
const BPM=124;
function beam(c,apex,end,width,ink,power) {
  const dx=end[0]-apex[0],dy=end[1]-apex[1],len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
  const points=[apex,[end[0]+nx*width,end[1]+ny*width],[end[0]-nx*width,end[1]-ny*width]];
  c.save();c.globalAlpha=.14;polygon(c,points,ink);c.globalAlpha=power;
  c.clip();
  // Parallel strips keep the reference's graphic rhythm inside each moving cone.
  c.strokeStyle=ink;c.lineWidth=.018;
  for(let i=-24;i<=24;i++) {
    const d=i*.043;c.beginPath();c.moveTo(apex[0]+nx*d,apex[1]+ny*d);c.lineTo(end[0]+nx*d,end[1]+ny*d);c.stroke();
  }
  c.restore();
}
export function paint(c,p,t,G) {
  c.save();setup(c,G,'#003b2d');
  const hx=G.W/G.S/2,hy=G.H/G.S/2,b=t*BPM/60;
  const sweep=Math.sin(b*Math.PI/16),pulse=beat(t,BPM);
  beam(c,[hx*.84,hy*1.05],[-hx*.72+sweep*.24,-hy*1.1],.43+pulse*.015,'#b8f0db',.83);
  beam(c,[-hx*.96,hy*.82],[hx*.7+Math.sin(b*Math.PI/12+.7)*.25,-hy*1.12],.35,'#00ba83',.72);
  // A narrow lime cone acts as the kick accent without flashing the whole poster.
  const x=hx*.76,y=hy*.98,aim=-hx*.18+Math.sin(b*Math.PI/8)*.17;
  polygon(c,[[x,y],[aim-.045-pulse*.012,-hy*1.05],[aim+.046+pulse*.012,-hy*1.05]],'#b5df2e');
  circle(c,x,y,.014,'#e0f7cd');
  c.restore();
}
