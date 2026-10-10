// Original Music Series No. 02: counter-rotating cassette reels and drifting tape.
import { TAU, paper, makeRoom, box, disc, oval, stroke, polygon, word } from './music-kit.js';
export const title = 'TAPE LOOP', no = 'No. 02', text = '#47303a', dark = '#2a2435', audio = false;
export const make = makeRoom;
const K = { wall: '#d98264', sun: '#edb975', rust: '#ac5148', ink: '#2a2435', blue: '#486e83', dim: '#658da0', tape: '#694352', mint: '#abc3b1' };
function reel(c, x, t, reverse) {
  disc(c,x,0,98,K.ink);disc(c,x,0,89,K.tape);disc(c,x,0,65,paper);
  c.save();c.translate(x,0);c.rotate(t*.68*reverse);
  for(let i=0;i<6;i++) { const a=i*TAU/6;oval(c,Math.cos(a)*42,Math.sin(a)*42,14,9,K.ink,a); }
  disc(c,0,0,23,K.blue);polygon(c,[[-10,-9],[10,-9],[10,9],[-10,9]],paper);c.restore();
}
export function paint(c,p,t,{W,H,s}) {
  box(c,0,0,W,H,K.wall);disc(c,W*.18,H*.20,Math.min(W*.29,H*.25),K.sun);
  for(let i=0;i<5;i++)box(c,0,H*(.43+i*.045),W,H*.022,i%2?K.rust:K.sun);
  box(c,0,H*.73,W,H*.27,K.blue);
  for(let i=0;i<6;i++)stroke(c,q=>{q.moveTo(0,H*(.77+i*.05));q.bezierCurveTo(W*.3,H*(.71+i*.05),W*.6,H*(.84+i*.05),W,H*(.76+i*.05));},i%2?K.dim:K.ink,5*s);
  // Loose ribbon loops slowly change their curvature behind the deck.
  stroke(c,q=>{q.moveTo(W*.15,H*.85);q.bezierCurveTo(-W*.12,H*.55,W*.28,H*.19,W*.40,H*.35);q.bezierCurveTo(W*.48,H*.48,W*.02,H*.38,W*.12,H*.21);q.bezierCurveTo(W*.23,H*(.07+.02*Math.sin(t*.3)),W*.57,H*.13,W*.79,H*.32);q.bezierCurveTo(W*1.08,H*.55,W*.91,H*.90,W*.64,H*.84);},K.ink,9*s);
  c.save();c.translate(W*.5,H*.53);c.scale(s,s);c.rotate(-.055);
  box(c,-439,-258,900,554,K.ink,32);box(c,-450,-280,900,554,paper,32);box(c,-430,-260,860,514,K.sun,22);
  box(c,-378,-208,756,325,K.rust,19);box(c,-356,-191,712,50,paper,6);
  word(c,'LONG PLAY',-330,-157,24,K.ink);word(c,'C—90',329,-157,23,K.ink,'right');
  box(c,-337,-111,674,197,K.ink,22);box(c,-319,-94,638,163,K.blue,15);
  c.save();c.translate(0,-14);reel(c,-175,t,1);reel(c,175,t,-1);
  stroke(c,q=>{q.moveTo(-175,-80);q.lineTo(175,-80);q.moveTo(-175,79);q.lineTo(175,79);},K.tape,13);
  c.restore();
  polygon(c,[[-220,112],[220,112],[251,170],[-251,170]],K.ink);
  for(const x of [-205,-105,105,205]){disc(c,x,141,13,K.blue);disc(c,x,141,5,paper);}
  for(const x of [-404,404])for(const y of [-237,227]){disc(c,x,y,8,K.ink);stroke(c,q=>{q.moveTo(x-4,y);q.lineTo(x+4,y);},paper,2);}
  // Mechanical counter, sliding meter and transport buttons stay on the enclosure.
  box(c,-340,195,122,39,K.ink,5);word(c,String(Math.floor(t*3)%1000).padStart(3,'0'),-278,224,26,paper,'center');
  for(let i=0;i<10;i++)box(c,-151+i*25,208,16,15,Math.sin(t*.9+i*.33)>.12?K.rust:K.blue,2);
  box(c,130,190,74,48,K.ink,6);polygon(c,[[157,200],[157,226],[184,213]],paper);
  box(c,219,190,74,48,K.ink,6);box(c,242,202,26,24,paper,2);c.restore();
  word(c,'KEEP THE GOOD PART',W*.5,H*.93,18*s,paper,'center');
}
