// Original Music Series No. 04: a golden saxophone suspended in slow stage light.
import { paper, makeRoom, box, disc, oval, stroke, polygon } from './music-kit.js';
export const title = 'BRASS MIDNIGHT', no = 'No. 04', text = '#482738', dark = '#281e32', audio = false;
export const make = makeRoom;
const K={wall:'#482738',night:'#281e32',rose:'#9f5868',light:'#c77b72',gold:'#edba60',shade:'#c78245',teal:'#4d807e'};
export function paint(c,p,t,{W,H,s}) {
  box(c,0,0,W,H,K.wall);
  for(let i=0;i<8;i++){const xx=i*W/7;box(c,xx,0,W*.05,H*.82,i%2?K.night:K.rose);}
  box(c,0,H*.81,W,H*.19,K.night);
  for(let i=0;i<5;i++)oval(c,W*.5,H*(.84+i*.03),W*(.45-i*.045),H*.016,i%2?K.rose:K.wall);
  // Flat spotlight fans move slowly across the velvet curtains.
  for(const [x,phase] of [[W*.20,0],[W*.82,2]]){
    const center=W*(.5+.14*Math.sin(t*.12+phase));
    c.save();c.globalAlpha=.20;polygon(c,[[x,0],[center-W*.28,H*.83],[center+W*.28,H*.83]],K.light);c.restore();
    box(c,x-22*s,0,44*s,35*s,K.night,5*s);oval(c,x,34*s,24*s,8*s,K.gold);
  }
  const cx=W*.49,cy=H*.51;
  // Small traveling ribbon arcs surround the instrument without covering it.
  for(let j=0;j<4;j++)stroke(c,q=>{for(let i=0;i<=30;i++){const a=-1.7+i*.075,r=(225+j*39)*s,x=cx+Math.cos(a+t*.08)*r,y=cy+Math.sin(a+t*.08)*r*.8;i?q.lineTo(x,y):q.moveTo(x,y);}},j%2?K.teal:K.rose,7*s);
  c.save();c.translate(cx,cy);c.scale(s,s);c.rotate(-.18+Math.sin(t*.34)*.018);
  oval(c,15,340,220,32,K.night);
  // A continuous J-shaped bore and its shaded side form the saxophone silhouette.
  const tube=q=>{q.moveTo(-119,-333);q.bezierCurveTo(-56,-399,68,-323,12,-221);q.lineTo(-49,121);q.bezierCurveTo(-91,345,203,371,216,170);q.lineTo(218,65);};
  stroke(c,tube,K.shade,91);stroke(c,tube,K.gold,65);stroke(c,q=>{q.moveTo(-18,-212);q.lineTo(-72,126);q.bezierCurveTo(-96,268,77,358,158,244);},paper,9);
  // Flared bell points upward with an elliptical opening and dark inner throat.
  polygon(c,[[171,136],[258,136],[307,-25],[125,-25]],K.shade);
  polygon(c,[[178,127],[234,127],[271,-25],[140,-25]],K.gold);
  oval(c,216,-25,104,37,K.gold,-.02);oval(c,216,-28,87,26,K.night,-.02);oval(c,216,-30,55,14,K.shade,-.02);
  stroke(c,q=>{q.moveTo(141,-16);q.bezierCurveTo(148,49,174,106,180,122);},paper,7);
  // Mouthpiece, octave lever, key posts and alternating key cups.
  c.save();c.translate(-121,-333);c.rotate(-.64);box(c,-73,-20,83,33,K.night,7);box(c,-13,-22,20,39,K.gold,3);c.restore();
  stroke(c,q=>{q.moveTo(37,-231);q.lineTo(-20,140);},K.shade,11);
  for(let i=0;i<9;i++){const yy=-205+i*45,xx=2-i*6.5;stroke(c,q=>{q.moveTo(xx,yy);q.lineTo(xx+42,yy+7);},K.shade,8);disc(c,xx+36,yy+6,17,K.shade);disc(c,xx+34,yy+3,12,paper);disc(c,xx+31,yy,4,K.gold);}
  stroke(c,q=>{q.moveTo(101,233);q.lineTo(147,85);},K.shade,10);
  for(let i=0;i<3;i++){disc(c,133+i*9,193-i*40,19,K.shade);disc(c,130+i*9,189-i*40,13,K.gold);}
  // A narrow traveling highlight follows the body without flashing.
  const hy=-170+(t*24%310);c.save();c.globalAlpha=.65;oval(c,-14-hy*.12,hy,5,20,paper,-.15);c.restore();
  c.restore();
  // Decorative dots drift upward like the memory of a melody.
  for(let i=0;i<9;i++){const xx=W*(.13+.75*((i*.618)%1)),yy=H*(.78-((i*.137+t*.017)%1)*.64);disc(c,xx,yy,(3+i%3)*s,i%2?K.gold:K.teal);}
}
