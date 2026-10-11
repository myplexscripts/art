// Classic Punk Essentials: a crown of sharp spikes and slashing shapes on a fast guitar backbeat.
import { make,setup,beat,polygon,circle } from './genre-kit.js?v=20261011-ui';
export { make };
export const title='Riff Cut', no='No. 04', genre='Punk rock', text='#ff7141', dark='#430f24', audio=false, textless=true;
const BPM=168;
export function paint(c,p,t,G) {
  c.save();setup(c,G,'#430f24');
  const hx=G.W/G.S/2,hy=G.H/G.S/2,kick=beat(t,BPM),snare=beat(t,BPM/2,.5);
  const points=[[-hx*1.13,hy*.12],[-hx*.83,-hy*.03],[-hx*.84,-hy*.54-kick*.022],[-hx*.43,-hy*.29],
    [-hx*.22,-hy*.91-snare*.028],[hx*.13,-hy*.37],[hx*.56,-hy*.75-kick*.025],
    [hx*.50,-hy*.24],[hx*1.04,-hy*.43-snare*.025],[hx*.80,hy*.18],[hx*1.1,hy*.4],[-hx*1.1,hy*.4]];
  polygon(c,points,'#f46b37');
  circle(c,0,hy*.64,.58,'#250f23');
  // The riff is a pair of diagonal cuts that jab on alternating accents.
  c.save();c.translate(hx*.37+snare*.014,hy*.34-kick*.009);c.rotate(.44);
  c.fillStyle='#bc272d';c.fillRect(-.031,-.145-snare*.012,.062,.12+snare*.012);c.restore();
  c.save();c.translate(-hx*.49,hy*.78);c.rotate(-.48-kick*.02);
  c.fillStyle='#f46b37';c.fillRect(-.17,-.015,.34,.028);c.restore();
  polygon(c,[[hx*.17,hy*1.07],[hx*.62,hy*.70],[hx*.69,hy*.82],[hx*.30,hy*1.10]],'#d43131');
  c.restore();
}
