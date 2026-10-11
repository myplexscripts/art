// Original Music Series No. 05: patch cables, analog oscillators and a little scope.
import { paper, makeRoom, box, disc, oval, stroke, polygon, word, knob, hash, wood, screw, plant, books } from './music-kit.js?v=20261011-clock-edge';
export const title = 'SIGNAL BLOOM', no = 'No. 05', text = '#254e46', dark = '#173c38', audio = false;
export const make = makeRoom;
const K={wall:'#a0b9a2',ink:'#173c38',green:'#507e66',mint:'#c2cdb0',orange:'#dd7f45',gold:'#e8b767',blue:'#427e91'};
export function paint(c,p,t,{W,H,s}) {
  box(c,0,0,W,H,K.wall);
  // An analog workshop: acoustic slats, patch notes and a rack of old test gear.
  wood(c,0,0,W,H*.77,K.wall,K.green,true);
  for(let i=0;i<Math.ceil(W/(62*s));i++)box(c,i*62*s,0,5*s,H*.77,K.mint);
  c.save();c.translate(W*.73,H*.17);c.scale(s*.82,s*.82);
  box(c,-143,-100,286,184,K.ink,8);box(c,-132,-90,264,160,K.mint,3);
  for(let row=0;row<3;row++){
    box(c,-125,-82+row*48,250,41,row%2?K.green:paper,2);
    for(let j=0;j<4;j++){disc(c,-108+j*21,-62+row*48,5,K.ink);disc(c,-107+j*21,-63+row*48,2,K.gold);}
    box(c,-14,-72+row*48,60,20,K.ink,3);for(let j=0;j<8;j++)box(c,-10+j*7,-68+row*48,3,9,K.gold,1);
    for(const xx of [71,100])knob(c,xx,-62+row*48,10,0,K.ink);
  }
  word(c,'FREQUENCY LAB',-116,66,8,K.ink);c.restore();
  // A pinned oscillator drawing and a lamp with a pivoted brass arm.
  c.save();c.translate(W*.21,H*.16);c.scale(s,s);c.rotate(-.04);
  box(c,-83,-104,166,177,paper,2);word(c,'OSCILLATOR STUDIES',-64,-82,10,K.ink);
  for(let j=0;j<3;j++){stroke(c,q=>{for(let i=0;i<32;i++){const xx=-63+i*4,yy=-44+j*40+Math.sin(i*.38)*9;i?q.lineTo(xx,yy):q.moveTo(xx,yy);}},K.green,1.3);word(c,['SINE','TRIANGLE','PULSE'][j],-62,-27+j*40,7,K.ink);}
  disc(c,-58,-94,3,K.orange);disc(c,59,-94,3,K.orange);c.restore();
  box(c,W*.05,H*.32,W*.9,7*s,K.ink);
  // A task lamp creates a warm counterpoint to the cool glass display.
  c.save();c.translate(W*.045,H*.78);c.scale(s,s);const reach=H*.56/s;
  oval(c,0,0,55,10,K.ink);stroke(c,q=>{q.moveTo(0,-4);q.lineTo(27,-reach*.52);q.lineTo(104,-reach);},K.ink,7);
  disc(c,27,-reach*.52,10,K.ink);disc(c,27,-reach*.52,4,K.gold);
  polygon(c,[[68,-reach-8],[121,-reach-17],[153,-reach+21],[60,-reach+39]],K.ink);oval(c,107,-reach+29,49,9,K.gold,-.2);
  c.save();c.globalAlpha=.07;polygon(c,[[66,-reach+32],[150,-reach+18],[289,78],[-101,78]],paper);c.restore();c.restore();
  wood(c,0,H*.78,W,H*.22,K.ink,K.green);
  c.depthLayer?.('synth');
  c.save();c.translate(W*.50,H*.54);c.scale(s,s);c.rotate(.045);
  box(c,-441,-292,900,630,K.ink,22);box(c,-458,-317,916,625,K.orange,20);box(c,-436,-317,872,601,paper,16);
  wood(c,-456,-298,20,592,K.orange,K.ink,true);wood(c,436,-299,20,592,K.orange,K.ink,true);
  box(c,-438,284,875,13,K.orange,3);stroke(c,q=>{q.moveTo(-428,293);q.lineTo(424,293);},K.gold,1);
  box(c,-415,-294,830,350,K.mint,8);
  // Separate modules have engraved borders, mounting screws and meaningful legends.
  for(const [xx,ww,label]of [[-401,336,'SCOPE / MONITOR'],[-56,151,'VCO'],[102,150,'FILTER'],[260,143,'ENVELOPE']]){
    stroke(c,q=>{q.rect(xx,-282,ww,312);},K.green,1);
    word(c,label,xx+8,-273,8,K.ink);
    for(const sx of [xx+5,xx+ww-5])for(const yy of [-286,35])screw(c,sx,yy,2.5,K.ink,paper);
  }
  // A gridded oscilloscope with independent traveling waves, never audio-driven.
  box(c,-391,-269,316,160,K.ink,10);box(c,-376,-254,286,130,'#254e46',6);
  for(let i=1;i<6;i++)stroke(c,q=>{q.moveTo(-376+i*47,-254);q.lineTo(-376+i*47,-124);},K.green,1);
  for(let j=1;j<4;j++)stroke(c,q=>{q.moveTo(-376,-254+j*32);q.lineTo(-90,-254+j*32);},K.green,1);
  for(let i=0;i<22;i++)stroke(c,q=>{q.moveTo(-372+i*13,-191);q.lineTo(-372+i*13,-187);},K.mint,.7);
  // Phosphor persistence is a few faint offset traces, not a glow bitmap.
  c.save();c.globalAlpha=.14;
  for(let k=1;k<4;k++)stroke(c,q=>{for(let i=0;i<=90;i++){const xx=-375+i*284/90,yy=-189+Math.sin(i*.19-t*.54-k*.025)*31+Math.sin(i*.38+t*.3)*7;i?q.lineTo(xx,yy):q.moveTo(xx,yy);}},K.gold,2+k);
  c.restore();
  stroke(c,q=>{for(let i=0;i<=90;i++){const x=-375+i*284/90,env=.85+.15*Math.sin(t*.16),y=-189+Math.sin(i*.19-t*.54)*31*env+Math.sin(i*.38+t*.3)*7;i?q.lineTo(x,y):q.moveTo(x,y);}},K.gold,2);
  word(c,'CH 1',-364,-237,8,K.mint);word(c,'2V / DIV',-101,-137,7,K.mint,'right');
  word(c,'OSC / 01',-389,-82,16,K.ink);word(c,'PATCH GARDEN',398,-269,19,K.ink,'right');
  for(let row=0;row<2;row++)for(let col=0;col<5;col++){
    const x=col*76+7,y=-226+row*80;
    for(let k=0;k<11;k++){const a=-2.3+k*.46;stroke(c,q=>{q.moveTo(x+Math.sin(a)*28,y-Math.cos(a)*28);q.lineTo(x+Math.sin(a)*31,y-Math.cos(a)*31);},K.green,1);}
    knob(c,x,y,19,t*.18+row*4,K.ink);
    for(let k=0;k<12;k++){const a=k*Math.PI/6;stroke(c,q=>{q.moveTo(x+Math.cos(a)*16,y+Math.sin(a)*16);q.lineTo(x+Math.cos(a)*19,y+Math.sin(a)*19);},K.green,.8);}
    word(c,[['TUNE','SHAPE','CUTOFF','RESONANCE','ATTACK'],['RANGE','WIDTH','DRIVE','MIX','RELEASE']][row][col],x,y+40,7.5,K.ink,'center');
  }
  // Source selectors and an engraved ADSR curve sit beneath the pot banks.
  for(let i=0;i<4;i++){box(c,10+i*89,-99,30,12,K.ink,3);box(c,13+i*89,-97,10,8,K.orange,2);word(c,['SAW','SQUARE','LOWPASS','SUSTAIN'][i],24+i*89,-80,7,K.ink,'center');}
  // Patch bay rings and multicolored leads arc above the controls.
  const leads=[[-354,-44,211,-48,K.orange],[-258,-44,354,-48,K.blue],[-166,-44,68,-48,K.ink],[-73,-44,284,-48,K.green]];
  for(const [x1,y1,x2,y2,ink] of leads){disc(c,x1,y1,13,K.ink);disc(c,x1,y1,8,paper);disc(c,x2,y2,13,K.ink);disc(c,x2,y2,8,paper);
    stroke(c,q=>{q.moveTo(x1,y1);q.bezierCurveTo(x1-45,-360+Math.sin(t*.3+x1)*8,x2+40,-385+Math.sin(t*.27+x2)*9,x2,y2);},K.ink,13);
    stroke(c,q=>{q.moveTo(x1,y1);q.bezierCurveTo(x1-45,-360+Math.sin(t*.3+x1)*8,x2+40,-385+Math.sin(t*.27+x2)*9,x2,y2);},ink,8);
    for(const [xx,yy]of [[x1,y1],[x2,y2]]){box(c,xx-6,yy-21,12,22,ink,3);box(c,xx-6,yy-4,12,4,paper,1);for(let k=0;k<3;k++)box(c,xx-5,yy-17+k*4,10,1.2,K.ink);}
  }
  for(let i=0;i<8;i++){const x=-365+i*96;box(c,x-4,0,8,43,K.ink,4);for(let j=0;j<6;j++)box(c,x+7,j*7,5,1,K.green);box(c,x-16,8+(1+Math.sin(t*.12+i)) * 9,32,10,i%2?K.orange:K.blue,3);word(c,['LEVEL','RATE','DEPTH','DETUNE','GATE','CV','DELAY','OUT'][i],x,55,7,K.ink,'center');}
  box(c,-414,73,828,177,K.ink,9);
  const kw=766/24;
  for(let i=0;i<24;i++){const press=Math.max(0,Math.sin(t*.38-i*1.1))**24;box(c,-383+i*kw,86+press*4,kw-2,149-press*4,paper,3);box(c,-383+i*kw,227,kw-2,8,K.mint,2);stroke(c,q=>{q.moveTo(-380+i*kw,96);q.lineTo(-380+i*kw,219);},'#d7cda8',.7);}
  for(let i=0;i<23;i++)if(![2,6].includes(i%7)){box(c,-383+(i+1)*kw-10,86,20,94,K.ink,3);box(c,-383+(i+1)*kw-7,90,14,76,K.green,2);}
  word(c,'S I G N A L   B L O O M',-390,274,15,K.ink);disc(c,388,269,7,K.orange);
  word(c,'ANALOG / 24',226,273,8,K.ink);for(let i=0;i<16;i++)box(c,-128+i*15,262,6,10,K.green,2);
  for(const xx of [-424,425])for(const yy of [-306,274])screw(c,xx,yy,4,K.ink,paper);
  c.restore();
  c.depthLayer?.('cable');
  // Coiled output cord rests on the desk with a subtle wave in the loose end.
  stroke(c,q=>{q.moveTo(W*.90,H*.70);q.bezierCurveTo(W*1.03,H*.84,W*.80,H*.96,W*.64,H*.91);q.bezierCurveTo(W*.54,H*.87,W*.58,H*.83,W*.67,H*.87);q.bezierCurveTo(W*.83,H*.94,W*.44,H*(.96+.006*Math.sin(t*.25)),W*.18,H*.94);},K.orange,8*s);
  c.depthLayer?.('headphones');
  // Over-ear headphones, a penciled patch sheet and a spare brass jack.
  c.save();c.translate(W*.14,H*.88);c.scale(s,s);c.rotate(-.18);
  stroke(c,q=>{q.moveTo(-62,20);q.bezierCurveTo(-87,-105,88,-105,61,20);},K.ink,13);
  stroke(c,q=>{q.moveTo(-61,-2);q.bezierCurveTo(-64,-83,64,-83,61,-2);},paper,4);
  for(const side of [-1,1]){box(c,side*61-17,-12,34,60,K.orange,14);box(c,side*61-12,-8,24,51,K.ink,10);for(let j=0;j<7;j++)box(c,side*61-8,j*5,16,1.5,K.green);}
  c.restore();
  c.save();c.translate(W*.76,H*.92);c.scale(s*.8,s*.8);c.rotate(.11);box(c,-118,-55,229,105,paper,2);word(c,'PATCH 07 — EVENING',-103,-38,10,K.ink);
  for(let i=0;i<5;i++){box(c,-97+i*43,-19,25,20,K.mint,2);word(c,['OSC','LFO','VCF','VCA','OUT'][i],-85+i*43,-6,6,K.ink,'center');}
  stroke(c,q=>{q.moveTo(-83,3);q.lineTo(-40,23);q.lineTo(44,23);q.lineTo(46,3);q.moveTo(-40,3);q.lineTo(-1,13);q.lineTo(88,13);},K.green,1.5);
  box(c,29,34,58,5,K.orange,2);box(c,75,33,18,7,K.gold,1);c.restore();
  plant(c,W*.97,H*.78,s*.73,t,K.green,K.ink,K.orange);
}
