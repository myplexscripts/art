// Original Music Series No. 03: a quiet piano room beneath a rain-streaked arch.
import { paper, makeRoom, box, disc, oval, stroke, polygon, word } from './music-kit.js';
export const title = 'BLUE HOUR', no = 'No. 03', text = '#183a51', dark = '#102638', audio = false;
export const make = makeRoom;
const K={night:'#102638',wall:'#24475d',blue:'#416b85',mint:'#91b0b4',wood:'#16394c',gold:'#e8b768',dim:'#bc8350',key:'#f2e5c3'};
export function paint(c,p,t,{W,H,s}) {
  box(c,0,0,W,H,K.wall);
  const wx=W*.50,wy=H*.12,ww=Math.min(W*.56,H*.65),wh=H*.47;
  box(c,wx-ww*.54,wy-ww*.02,ww*1.08,wh+ww*.02,K.night,[ww*.54,ww*.54,0,0]);
  box(c,wx-ww*.5,wy,ww,wh,K.mint,[ww*.5,ww*.5,0,0]);
  c.save();c.beginPath();c.roundRect(wx-ww*.47,wy+ww*.03,ww*.94,wh-ww*.03,[ww*.47,ww*.47,0,0]);c.clip();
  box(c,wx-ww*.5,wy,ww,wh,K.blue);disc(c,wx+ww*.20,wy+wh*.30,ww*.09,K.gold);
  for(let i=0;i<12;i++){const bx=wx-ww*.50+i*ww*.09,bh=wh*(.14+.17*(.5+.5*Math.sin(i*4.7)));box(c,bx,wy+wh-bh,ww*.07,bh,K.night);for(let j=0;j<4;j++)box(c,bx+ww*.02,wy+wh-bh+10+j*15,ww*.018,6,j%2?K.dim:K.gold);}
  for(let i=0;i<22;i++){const x=wx-ww*.45+(i*.071%1)*ww*.90,y=wy+((i*.17+t*.07)%1)*wh;stroke(c,q=>{q.moveTo(x,y);q.lineTo(x-ww*.015,y+ww*.045);},K.mint,2*s);}
  c.restore();stroke(c,q=>{q.moveTo(wx,wy+ww*.07);q.lineTo(wx,wy+wh);q.moveTo(wx-ww*.50,wy+wh*.60);q.lineTo(wx+ww*.50,wy+wh*.60);},K.night,9*s);
  box(c,0,H*.78,W,H*.22,K.night);
  for(let i=0;i<9;i++)stroke(c,q=>{q.moveTo(W*.5,H*.78);q.lineTo((i-1)*W*.16,H);},K.blue,2*s);
  c.save();c.translate(W*.5,H*.65);c.scale(s,s);
  oval(c,0,225,475,52,'#0c202e');
  box(c,-410,95,44,185,K.wood,8);box(c,366,95,44,185,K.wood,8);
  box(c,-440,-276,880,434,K.night,22);box(c,-411,-248,822,254,K.wood,11);
  // Gold strings shimmer gently through the open upper cabinet.
  for(let i=0;i<44;i++){const x=-365+i*17;stroke(c,q=>{q.moveTo(x,-222);q.bezierCurveTo(x+Math.sin(t*.8+i)*2,-135,x,-35,x,-12);},i%4?K.dim:K.gold,i%4?2:4);}
  box(c,-390,-80,780,14,K.blue,3);box(c,-440,-14,880,45,K.wood,7);
  word(c,'B L U E  H O U R',0,-34,17,K.gold,'center');
  box(c,-452,25,904,135,K.night,9);
  const kw=800/28;
  for(let i=0;i<28;i++){const active=Math.max(0,Math.sin(t*.72-i*.82))**16;box(c,-400+i*kw,38+active*8,kw-2,95-active*8,i%7===3?paper:K.key,3);box(c,-400+i*kw,126,kw-2,8,K.mint,1);}
  for(let i=0;i<27;i++)if(![2,6].includes(i%7)){const active=Math.max(0,Math.sin(t*.72-i*.82+.5))**16;box(c,-400+(i+1)*kw-kw*.30,38+active*5,kw*.60,58,K.night,3);box(c,-400+(i+1)*kw-kw*.24,42+active*5,kw*.48,43,K.blue,2);}
  box(c,-434,149,868,24,K.blue,4);
  // A small music stand, two open pages, and a warm shaded lamp.
  polygon(c,[[-140,-287],[140,-287],[158,-163],[-158,-163]],K.night);
  polygon(c,[[-129,-277],[-5,-264],[-5,-176],[-137,-181]],paper);polygon(c,[[5,-264],[129,-277],[137,-181],[5,-176]],paper);
  for(const side of [-1,1])for(let j=0;j<5;j++)stroke(c,q=>{q.moveTo(side*22,-250+j*12);q.lineTo(side*112,-256+j*12);},K.blue,2);
  stroke(c,q=>{q.moveTo(325,-277);q.lineTo(325,-355);q.lineTo(274,-382);},K.gold,8);
  polygon(c,[[248,-415],[302,-415],[320,-367],[230,-367]],K.gold);box(c,295,-280,59,7,K.gold,3);
  c.restore();
  // Lamp light hangs in quiet translucent bands; no flicker or audio synchronization.
  c.save();c.globalAlpha=.09+.02*Math.sin(t*.22);polygon(c,[[W*.78,H*.39],[W*.94,H*.73],[W*.48,H*.73]],K.gold);c.restore();
}
