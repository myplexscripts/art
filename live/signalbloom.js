// Original Music Series No. 05: patch cables, analog oscillators and a little scope.
import { paper, makeRoom, box, disc, stroke, polygon, word, knob } from './music-kit.js';
export const title = 'SIGNAL BLOOM', no = 'No. 05', text = '#254e46', dark = '#173c38', audio = false;
export const make = makeRoom;
const K={wall:'#a0b9a2',ink:'#173c38',green:'#507e66',mint:'#c2cdb0',orange:'#dd7f45',gold:'#e8b767',blue:'#427e91'};
export function paint(c,p,t,{W,H,s}) {
  box(c,0,0,W,H,K.wall);
  // The wallpaper is a slow field of interleaving sine curves.
  for(let j=0;j<11;j++)stroke(c,q=>{for(let i=0;i<=70;i++){const x=i*W/70,y=H*(j*.11-.05)+Math.sin(i*.14+t*.22+j*.60)*H*.022;i?q.lineTo(x,y):q.moveTo(x,y);}},j%2?K.green:K.mint,4*s);
  disc(c,W*.80,H*.16,Math.min(W*.16,H*.14),K.gold);
  box(c,0,H*.78,W,H*.22,K.ink);
  for(let i=0;i<7;i++)box(c,0,H*(.81+i*.037),W,4*s,K.green);
  c.save();c.translate(W*.50,H*.54);c.scale(s,s);c.rotate(.045);
  box(c,-441,-292,900,630,K.ink,22);box(c,-458,-317,916,625,K.orange,20);box(c,-436,-317,872,601,paper,16);
  box(c,-415,-294,830,350,K.mint,8);
  // A gridded oscilloscope with independent traveling waves, never audio-driven.
  box(c,-391,-269,316,160,K.ink,10);box(c,-376,-254,286,130,'#254e46',6);
  for(let i=1;i<6;i++)stroke(c,q=>{q.moveTo(-376+i*47,-254);q.lineTo(-376+i*47,-124);},K.green,1);
  for(let j=1;j<4;j++)stroke(c,q=>{q.moveTo(-376,-254+j*32);q.lineTo(-90,-254+j*32);},K.green,1);
  stroke(c,q=>{for(let i=0;i<=90;i++){const x=-375+i*284/90,env=.75+.25*Math.sin(t*.26),y=-189+Math.sin(i*.19-t*.9)*36*env+Math.sin(i*.38+t*.5)*9;i?q.lineTo(x,y):q.moveTo(x,y);}},K.gold,4);
  word(c,'OSC / 01',-389,-82,16,K.ink);word(c,'PATCH GARDEN',398,-269,19,K.ink,'right');
  for(let row=0;row<2;row++)for(let col=0;col<5;col++){const x=col*76+7,y=-226+row*80;knob(c,x,y,22,t+row*4,K.ink);word(c,String(row*5+col+1).padStart(2,'0'),x,y+38,11,K.ink,'center');}
  // Patch bay rings and multicolored leads arc above the controls.
  const leads=[[-354,-44,211,-48,K.orange],[-258,-44,354,-48,K.blue],[-166,-44,68,-48,K.ink],[-73,-44,284,-48,K.green]];
  for(const [x1,y1,x2,y2,ink] of leads){disc(c,x1,y1,13,K.ink);disc(c,x1,y1,8,paper);disc(c,x2,y2,13,K.ink);disc(c,x2,y2,8,paper);
    stroke(c,q=>{q.moveTo(x1,y1);q.bezierCurveTo(x1-45,-360+Math.sin(t*.3+x1)*8,x2+40,-385+Math.sin(t*.27+x2)*9,x2,y2);},K.ink,13);
    stroke(c,q=>{q.moveTo(x1,y1);q.bezierCurveTo(x1-45,-360+Math.sin(t*.3+x1)*8,x2+40,-385+Math.sin(t*.27+x2)*9,x2,y2);},ink,8);
  }
  for(let i=0;i<8;i++){const x=-365+i*96;box(c,x-4,0,8,43,K.ink,4);box(c,x-16,8+(1+Math.sin(t*.36+i)) * 9,32,10,i%2?K.orange:K.blue,3);}
  box(c,-414,73,828,177,K.ink,9);
  const kw=766/24;
  for(let i=0;i<24;i++){const press=Math.max(0,Math.sin(t*.62-i*1.1))**20;box(c,-383+i*kw,86+press*7,kw-2,149-press*7,paper,3);box(c,-383+i*kw,227,kw-2,8,K.mint,2);}
  for(let i=0;i<23;i++)if(![2,6].includes(i%7)){box(c,-383+(i+1)*kw-10,86,20,94,K.ink,3);box(c,-383+(i+1)*kw-7,90,14,76,K.green,2);}
  word(c,'S I G N A L   B L O O M',-390,274,15,K.ink);disc(c,388,269,7,K.orange);
  c.restore();
  // Coiled output cord rests on the desk with a subtle wave in the loose end.
  stroke(c,q=>{q.moveTo(W*.90,H*.70);q.bezierCurveTo(W*1.03,H*.84,W*.80,H*.96,W*.64,H*.91);q.bezierCurveTo(W*.54,H*.87,W*.58,H*.83,W*.67,H*.87);q.bezierCurveTo(W*.83,H*.94,W*.44,H*(.96+.006*Math.sin(t*.25)),W*.18,H*.94);},K.orange,8*s);
}
