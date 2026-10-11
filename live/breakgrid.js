// Alternative Hip-Hop Essentials: chopped blocks, a looping sample and an 88 BPM backbeat.
import { make,setup,beat,rectangle,circle,polygon,TAU } from './genre-kit.js?v=20261011-dreamscapes-motion';
export { make };
export const title='Break Grid', no='No. 02', genre='Hip-hop', text='#f8bb24', dark='#123e78', audio=false, textless=true;
const BPM=88;
export function paint(c,p,t,G) {
  c.save();setup(c,G,'#4478cc');
  const hx=G.W/G.S/2,hy=G.H/G.S/2,b=t*BPM/60;
  const kick=Math.max(beat(t,BPM/2),beat(t,BPM/4,.625)*.65),snare=beat(t,BPM/2,.5);
  rectangle(c,-hx,-hy,hx,hy,'#ffc124');rectangle(c,0,0,hx,hy,'#ffc124');
  rectangle(c,-hx,0,hx,hy,'#224c9c');rectangle(c,0,-hy,hx,hy,'#2455a7');
  // Quarter-circle samples are cut from the same four-colour grid as the cover.
  c.save();c.beginPath();c.rect(-hx,-hy,hx,hy);c.clip();
  circle(c,-hx*.06+kick*.025,-hy*.82,.34,'#264d96');
  rectangle(c,-hx,-hy*.54,hx*.84,hy*.54,'#c1e3f6');c.restore();
  c.save();c.beginPath();c.rect(0,-hy,hx,hy);c.clip();
  const shift=Math.sin(b*TAU/8)*.017;
  for(let i=0;i<4;i++)rectangle(c,.08+i*.075+shift,-hy*.74,.023,hy*.74,'#6591da');
  for(let j=0;j<4;j++)rectangle(c,.03,-hy*.56+j*.076+shift,hx,.021,'#6591da');
  c.restore();
  // Bars hop on the snare; the low circular shape expands on the kick.
  c.save();c.beginPath();c.rect(-hx,0,hx,hy);c.clip();
  circle(c,-hx*.42,hy*.36,.21+kick*.018,'#073d76');circle(c,-hx*.42,hy*.36,.115,'#457dcc');
  const loop=(b/16)%1;
  for(let i=-1;i<4;i++)rectangle(c,-hx-.08+(i+loop)*.12,hy*.78,.075,.035,'#699bdf');
  c.restore();
  c.save();c.beginPath();c.rect(0,0,hx,hy);c.clip();
  const drop=snare*.027;
  for(let i=0;i<3;i++)rectangle(c,.08,hy*.48+i*.069-drop,hx-.07,.027,'#264d96');
  rectangle(c,.25+kick*.018,0,.034,hy,'#2f6cb8');
  circle(c,.25,hy*.19,.078,'#c1e3f6');
  polygon(c,[[0,hy*.19],[.10,hy*.08],[.10,hy*.30]],'#ffd748');c.restore();
  c.restore();
}
