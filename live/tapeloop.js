// Original Music Series No. 02: wound cassette tape, a receiver and an afternoon studio.
import { TAU, paper, makeRoom, box, disc, oval, stroke, polygon, word, hash, wood, screw, books, plant } from './music-kit.js?v=20261013-after-hours';
export const title = 'TAPE LOOP', no = 'No. 02', text = '#47303a', dark = '#2a2435', audio = false;
export const make = makeRoom;
const K = { wall: '#d98264', sun: '#edb975', rust: '#ac5148', ink: '#2a2435', blue: '#486e83', dim: '#658da0', tape: '#694352', mint: '#abc3b1' };
function reel(c, x, t) {
  const wound=67+(x<0?-1:1)*15*Math.sin(t*.012),speed=x<0?.26:.31;
  disc(c,x,0,96,K.ink);disc(c,x,0,wound,K.tape);
  for(let i=0;i<15;i++){c.beginPath();c.arc(x,0,34+(wound-34)*i/15,0,TAU);c.strokeStyle=i%3?K.ink:K.rust;c.lineWidth=.65;c.stroke();}
  disc(c,x,0,35,paper);disc(c,x,0,29,K.blue);
  c.save();c.translate(x,0);c.rotate(t*speed);
  for(let i=0;i<6;i++){const a=i*TAU/6;polygon(c,[[Math.cos(a)*18,Math.sin(a)*18],[Math.cos(a+.18)*34,Math.sin(a+.18)*34],[Math.cos(a+.42)*34,Math.sin(a+.42)*34],[Math.cos(a+.42)*18,Math.sin(a+.42)*18]],paper);}
  disc(c,0,0,12,K.ink);disc(c,0,0,5,K.sun);c.restore();
  c.save();c.globalAlpha=.16;oval(c,x-27,-37,14,46,paper,-.6);c.restore();
}
export function paint(c,p,t,{W,H,s}) {
  box(c,0,0,W,H,K.wall);disc(c,W*.18,H*.20,Math.min(W*.29,H*.25),K.sun);
  // A late-afternoon studio: slatted blinds, record shelves and a timber desk.
  box(c,W*.04,H*.05,W*.42,H*.28,K.ink,12*s);box(c,W*.055,H*.065,W*.39,H*.25,K.blue,5*s);
  disc(c,W*.19,H*.16,Math.min(W*.075,H*.08),K.sun);
  for(let i=0;i<11;i++){const xx=W*.055+i*W*.038,hh=H*(.015+hash(i,4)*.065);box(c,xx,H*.315-hh,W*.03,hh,K.ink);for(let j=0;j<3;j++)if(hash(i+j,5)>.4)box(c,xx+W*.006,H*.316-hh+j*13*s,W*.004,5*s,K.sun);}
  for(let i=0;i<7;i++){box(c,W*.047,H*(.077+i*.034),W*.405,7*s,K.sun);stroke(c,q=>{q.moveTo(W*.385,H*.066);q.lineTo(W*.385,H*.314);},K.rust,1*s);}
  for(let i=0;i<3;i++){const drift=((t*2+i*W*.07)%(W*.5));box(c,W*.045+drift,H*(.115+i*.048),W*.12,4*s,K.dim,2*s);}
  c.save();c.translate(W*.56,H*.22);c.scale(s,s);books(c,0,0,11,140,[K.rust,K.ink,K.blue,K.sun,paper],['MIX 01','RADIO','FIELD NOTES']);box(c,-12,0,318,10,K.ink,2);c.restore();
  box(c,0,H*.38,W,6*s,K.rust);
  wood(c,0,H*.73,W,H*.27,K.blue,K.ink);
  // Window light breaks into bars on the desk, behind the near objects.
  c.save();c.globalAlpha=.12;
  for(let i=0;i<6;i++)polygon(c,[[W*(.04+i*.054),H*.73],[W*(.075+i*.054),H*.73],[W*(.32+i*.10),H],[W*(.28+i*.10),H]],paper);
  c.restore();
  // Loose ribbon loops slowly change their curvature behind the deck.
  stroke(c,q=>{q.moveTo(W*.15,H*.85);q.bezierCurveTo(-W*.12,H*.55,W*.28,H*.19,W*.40,H*.35);q.bezierCurveTo(W*.48,H*.48,W*.02,H*.38,W*.12,H*.21);q.bezierCurveTo(W*.23,H*(.07+.02*Math.sin(t*.3)),W*.57,H*.13,W*.79,H*.32);q.bezierCurveTo(W*1.08,H*.55,W*.91,H*.90,W*.64,H*.84);},K.ink,9*s);
  c.depthLayer?.('tape');
  c.save();c.translate(W*.5,H*.53);c.scale(s,s);c.rotate(-.055);
  box(c,-439,-258,900,554,K.ink,32);box(c,-450,-280,900,554,paper,32);box(c,-430,-260,860,514,K.sun,22);
  // Injection-molded seams, ribs, corner screws and a handwritten label.
  for(let j=0;j<9;j++)box(c,-420,-104+j*20,27,2,K.rust,1);
  for(let j=0;j<9;j++)box(c,393,-104+j*20,27,2,K.rust,1);
  stroke(c,q=>{q.moveTo(-424,-235);q.lineTo(423,-235);q.moveTo(-425,180);q.lineTo(422,180);},paper,2);
  box(c,-378,-208,756,325,K.rust,19);box(c,-356,-191,712,50,paper,6);
  word(c,'LONG PLAY',-330,-157,24,K.ink);word(c,'C—90',329,-157,23,K.ink,'right');
  word(c,'LATE NIGHT / VOL. 02',-314,-120,12,paper);word(c,'NORMAL BIAS · TYPE I',312,-120,11,paper,'right');
  for(let i=0;i<4;i++)stroke(c,q=>{q.moveTo(-145+i*51,-170);q.lineTo(-125+i*51,-176);q.lineTo(-91+i*51,-167);},K.rust,1.5);
  box(c,-337,-111,674,197,K.ink,22);box(c,-319,-94,638,163,K.blue,15);
  c.save();c.translate(0,-14);reel(c,-175,t);reel(c,175,t);
  stroke(c,q=>{q.moveTo(-175,-77);q.lineTo(175,-77);q.moveTo(-245,8);q.lineTo(-270,76);q.lineTo(-240,97);q.lineTo(240,97);q.lineTo(270,76);q.lineTo(245,8);},K.tape,5);
  for(const xx of [-267,267]){disc(c,xx,75,12,paper);disc(c,xx,75,5,K.ink);}
  box(c,-67,-61,134,99,K.ink,8);
  for(let i=0;i<7;i++)box(c,-56+i*18,-34,1,45,K.dim);
  box(c,-62,5,124,9,K.sun);box(c,-23,-49,46,24,K.tape,3);
  c.restore();
  polygon(c,[[-220,112],[220,112],[251,170],[-251,170]],K.ink);
  for(const x of [-205,-105,105,205]){disc(c,x,141,13,K.blue);disc(c,x,141,5,paper);}
  for(const x of [-404,404])for(const y of [-237,227])screw(c,x,y,7,K.ink,paper);
  for(const xx of [-331,331]){box(c,xx-16,113,32,28,K.ink,3);disc(c,xx,127,5,K.sun);}
  // Glazing is clipped to the inspection window, leaving only narrow reflections.
  c.save();c.globalAlpha=.13;polygon(c,[[-330,-109],[-188,-109],[-277,75],[-336,75]],paper);polygon(c,[[174,-109],[204,-109],[117,75],[88,75]],paper);c.restore();
  // Mechanical counter, sliding meter and transport buttons stay on the enclosure.
  box(c,-340,195,122,39,K.ink,5);word(c,String(Math.floor(t*3)%1000).padStart(3,'0'),-278,224,26,paper,'center');
  for(let i=0;i<10;i++)box(c,-151+i*25,208,16,15,Math.sin(t*.9+i*.33)>.12?K.rust:K.blue,2);
  box(c,130,190,74,48,K.ink,6);polygon(c,[[157,200],[157,226],[184,213]],paper);
  box(c,219,190,74,48,K.ink,6);box(c,242,202,26,24,paper,2);c.restore();
  c.depthLayer?.('receiver');
  // A compact silver receiver supports the cassette; its two needles move smoothly.
  c.save();c.translate(W*.51,H*.82);c.scale(s,s);c.rotate(-.055);
  box(c,-405,-42,810,102,K.ink,9);box(c,-414,-52,810,101,paper,9);box(c,-400,-42,780,75,K.dim,4);
  for(let i=0;i<2;i++){
    const xx=-356+i*188;box(c,xx,-26,154,43,K.ink,4);box(c,xx+7,-21,140,31,K.sun,2);
    for(let k=0;k<11;k++){const a=-2.7+k*.23;stroke(c,q=>{q.moveTo(xx+77+Math.cos(a)*47,13+Math.sin(a)*34);q.lineTo(xx+77+Math.cos(a)*52,13+Math.sin(a)*39);},K.ink,1);}
    const a=-1.7+Math.sin(t*.48+i*.7)*.36;stroke(c,q=>{q.moveTo(xx+77,18);q.lineTo(xx+77+Math.cos(a)*53,18+Math.sin(a)*43);},K.rust,2);word(c,i?'R':'L',xx+14,6,8,K.ink);
  }
  for(let i=0;i<17;i++)box(c,80+i*8,-21,3,17,K.ink,1);
  for(const xx of [41,274,344]){disc(c,xx,-3,xx===274?27:17,K.ink);disc(c,xx,-3,xx===274?22:13,paper);stroke(c,q=>{q.moveTo(xx,-16);q.lineTo(xx,-9);},K.ink,2);}
  word(c,'STEREO / MONITOR',-349,29,8,K.ink);c.restore();
  c.depthLayer?.('case');
  // A pencil, open tape case and label sheet provide small foreground stories.
  c.save();c.translate(W*.15,H*.93);c.scale(s,s);c.rotate(.12);
  polygon(c,[[-54,-37],[94,-37],[113,28],[-37,28]],paper);polygon(c,[[-44,-31],[88,-31],[101,21],[-32,21]],K.dim);
  box(c,-32,-23,102,8,K.rust,1);word(c,'SIDE A',-20,7,10,K.ink);c.restore();
  c.save();c.translate(W*.72,H*.93);c.scale(s,s);c.rotate(-.24);box(c,-95,-4,182,9,K.sun,2);polygon(c,[[87,-4],[112,0],[87,5]],paper);polygon(c,[[108,-1],[116,0],[108,2]],K.ink);box(c,-105,-4,14,9,K.rust,2);c.restore();
  plant(c,W*.96,H*.73,s*.8,t,K.mint,K.blue,K.rust);
}
