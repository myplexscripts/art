// Original Music Series No. 04: a golden saxophone on a stand in an intimate jazz room.
import { paper, makeRoom, box, disc, oval, stroke, polygon, hash, screw, wood, word } from './music-kit.js?v=20261011-clock-edge';
export const title = 'BRASS MIDNIGHT', no = 'No. 04', text = '#482738', dark = '#281e32', audio = false;
export const make = makeRoom;
const K={wall:'#482738',night:'#281e32',rose:'#9f5868',light:'#c77b72',gold:'#edba60',shade:'#c78245',teal:'#4d807e'};
export function paint(c,p,t,{W,H,s}) {
  box(c,0,0,W,H,K.wall);
  // Velvet folds taper and vary: deep creases, lit ridges and a scalloped valance.
  for(let i=0;i<20;i++){
    const xx=i*W/19,w=W*.047;
    polygon(c,[[xx,0],[xx+w,0],[xx+w*.8,H*.81],[xx-w*.1,H*.81]],i%3?K.wall:K.rose);
    stroke(c,q=>{q.moveTo(xx+w*.83,0);q.bezierCurveTo(xx+w*.63,H*.29,xx+w*.80,H*.62,xx+w*.72,H*.80);},K.night,W*.008);
    stroke(c,q=>{q.moveTo(xx+w*.17,H*.08);q.bezierCurveTo(xx+w*.28,H*.28,xx+w*.05,H*.66,xx+w*.20,H*.79);},K.light,W*.002);
  }
  for(let i=0;i<5;i++){c.beginPath();c.moveTo(i*W*.25-W*.05,0);c.quadraticCurveTo(i*W*.25+W*.075,H*.15,i*W*.25+W*.20,0);c.closePath();c.fillStyle=K.night;c.fill();}
  wood(c,0,H*.81,W,H*.19,K.night,K.rose);
  for(let i=1;i<7;i++)stroke(c,q=>{q.moveTo(0,H*(.81+i*.031));q.lineTo(W,H*(.81+i*.031));},K.wall,2*s);
  // Rhythm section stays behind the solo instrument: a double bass and a small kit.
  c.save();c.translate(W*.17,H*.59);c.scale(s*.72,s*.72);c.rotate(.10);
  c.beginPath();c.moveTo(-23,-160);c.bezierCurveTo(-105,-180,-130,-75,-62,-38);c.bezierCurveTo(-47,-8,-112,12,-109,82);c.bezierCurveTo(-99,166,102,166,111,79);c.bezierCurveTo(116,15,53,-9,60,-38);c.bezierCurveTo(129,-80,101,-177,22,-160);c.closePath();c.fillStyle=K.shade;c.fill();
  box(c,-13,-335,26,350,K.night,8);box(c,-22,-350,44,55,K.shade,6);
  for(const xx of [-21,21])for(let j=0;j<3;j++){stroke(c,q=>{q.moveTo(xx,-335+j*14);q.lineTo(xx+(xx<0?-9:9),-335+j*14);},paper,2);disc(c,xx+(xx<0?-12:12),-335+j*14,4,K.gold);}
  for(let i=0;i<4;i++)stroke(c,q=>{q.moveTo(-6+i*4,-322);q.lineTo(-6+i*4,109);},K.gold,.8);
  box(c,-30,39,60,8,K.gold,2);polygon(c,[[-15,76],[15,76],[8,119],[-8,119]],K.night);
  for(const side of [-1,1])stroke(c,q=>{q.moveTo(side*57,-50);q.bezierCurveTo(side*27,-25,side*86,23,side*48,38);},K.night,4);
  stroke(c,q=>{q.moveTo(0,127);q.lineTo(0,188);},K.gold,3);c.restore();
  c.save();c.translate(W*.84,H*.70);c.scale(s*.72,s*.72);
  disc(c,0,0,101,K.wall);disc(c,0,0,90,K.night);disc(c,0,0,84,K.rose);
  c.beginPath();c.arc(0,0,79,0,Math.PI*2);c.strokeStyle=K.light;c.lineWidth=2;c.stroke();disc(c,26,35,18,K.night);
  for(let i=0;i<10;i++){const a=i*Math.PI*.2;screw(c,Math.cos(a)*94,Math.sin(a)*94,3,K.night,paper);}
  for(const xx of [-68,68])stroke(c,q=>{q.moveTo(xx,66);q.lineTo(xx*1.35,112);},K.light,4);
  for(const [xx,yy]of [[-82,-163],[95,-122]]){
    stroke(c,q=>{q.moveTo(xx,87);q.lineTo(xx,yy);q.moveTo(xx,57);q.lineTo(xx-37,104);q.moveTo(xx,57);q.lineTo(xx+37,104);},K.light,3);
    oval(c,xx,yy,74,10,K.shade);oval(c,xx,yy-3,68,7,K.gold);disc(c,xx,yy-7,6,K.light);
    for(let j=0;j<4;j++){c.beginPath();c.ellipse(xx,yy-2,20+j*11,2+j*.7,0,0,Math.PI*2);c.strokeStyle=K.shade;c.lineWidth=1;c.stroke();}
  }
  c.restore();
  // Flat spotlight fans move slowly across the velvet curtains.
  for(const [x,phase] of [[W*.20,0],[W*.82,2]]){
    const center=W*(.5+.09*Math.sin(t*.07+phase));
    c.save();c.globalAlpha=.20;polygon(c,[[x,0],[center-W*.28,H*.83],[center+W*.28,H*.83]],K.light);c.restore();
    box(c,x-22*s,0,44*s,35*s,K.night,5*s);oval(c,x,34*s,24*s,8*s,K.gold);
  }
  c.depthLayer?.('saxophone');
  const cx=W*.49,cy=H*.51;
  c.save();c.translate(cx,cy);c.scale(s,s);c.rotate(-.18);
  oval(c,15,340,220,32,K.night);
  // A continuous J-shaped bore and its shaded side form the saxophone silhouette.
  c.beginPath();c.moveTo(-119,-333);c.bezierCurveTo(-69,-379,48,-376,48,-301);c.lineTo(23,-211);c.lineTo(-27,130);c.bezierCurveTo(-65,318,227,343,248,151);c.lineTo(251,65);c.lineTo(184,65);c.lineTo(176,154);c.bezierCurveTo(161,265,12,268,29,137);c.lineTo(73,-208);c.bezierCurveTo(119,-365,-30,-431,-133,-352);c.closePath();c.fillStyle=K.shade;c.fill();
  stroke(c,q=>{q.moveTo(-116,-344);q.bezierCurveTo(-47,-400,71,-354,39,-274);q.lineTo(-2,131);q.bezierCurveTo(-28,290,198,300,210,155);q.lineTo(217,77);},K.gold,30);
  stroke(c,q=>{q.moveTo(22,-223);q.lineTo(-18,133);q.bezierCurveTo(-31,264,122,307,177,248);},paper,4);
  // Bow guard, engraved seams and keywork follow the tapered body rather than float.
  stroke(c,q=>{q.moveTo(-36,206);q.bezierCurveTo(-23,311,171,332,224,226);},K.shade,8);
  for(const xx of [-26,83,204])screw(c,xx,xx===83?303:237,4,K.shade,K.gold);
  // Flared bell points upward with an elliptical opening and dark inner throat.
  polygon(c,[[171,136],[258,136],[307,-25],[125,-25]],K.shade);
  polygon(c,[[178,127],[234,127],[271,-25],[140,-25]],K.gold);
  oval(c,216,-25,104,37,K.gold,-.02);oval(c,216,-28,87,26,K.night,-.02);oval(c,216,-30,55,14,K.shade,-.02);
  c.beginPath();c.ellipse(216,-25,96,32,-.02,0,Math.PI*2);c.strokeStyle=paper;c.lineWidth=2;c.stroke();
  for(let i=0;i<5;i++)stroke(c,q=>{q.moveTo(181+i*15,5);q.quadraticCurveTo(192+i*7,62,199+i*5,111);},i%2?K.shade:K.gold,1.4);
  for(let i=0;i<6;i++){const xx=197+i*6,yy=45+Math.sin(i)*8;stroke(c,q=>{q.moveTo(xx,yy);q.quadraticCurveTo(xx-11,yy+13,xx+2,yy+23);},K.shade,1);}
  stroke(c,q=>{q.moveTo(141,-16);q.bezierCurveTo(148,49,174,106,180,122);},paper,7);
  // Mouthpiece, octave lever, key posts and alternating key cups.
  c.save();c.translate(-121,-333);c.rotate(-.64);box(c,-73,-20,83,33,K.night,7);box(c,-13,-22,20,39,K.gold,3);c.restore();
  stroke(c,q=>{q.moveTo(-91,-347);q.quadraticCurveTo(-37,-387,22,-336);},K.shade,3);
  for(const xx of [-122,-113]){box(c,xx,-359,5,27,K.shade,1);screw(c,xx+2,-356,2,K.night,K.gold);}
  stroke(c,q=>{q.moveTo(37,-231);q.lineTo(-20,140);},K.shade,11);
  for(let i=0;i<9;i++){
    const yy=-205+i*45,xx=24-i*5.9;
    stroke(c,q=>{q.moveTo(xx,yy);q.lineTo(xx+29,yy+7);},K.shade,4);
    disc(c,xx+26,yy+5,13,K.shade);disc(c,xx+25,yy+3,10,K.gold);disc(c,xx+23,yy+1,6,paper);
    oval(c,xx+10,yy+11,6,2,K.night,.17);screw(c,xx-2,yy-6,2,K.shade,paper);
    stroke(c,q=>{q.moveTo(xx+20,yy+18);q.quadraticCurveTo(xx+32,yy+22,xx+26,yy+33);},K.shade,1.5);
  }
  stroke(c,q=>{q.moveTo(101,233);q.lineTo(147,85);},K.shade,10);
  for(let i=0;i<3;i++){disc(c,133+i*9,193-i*40,19,K.shade);disc(c,130+i*9,189-i*40,13,K.gold);}
  // A narrow traveling highlight follows the body without flashing.
  const hy=-20+Math.sin(t*.18)*155;c.save();c.globalAlpha=.32;oval(c,4-hy*.12,hy,3,44,paper,-.15);c.restore();
  // The instrument rests on a padded stand on the stage.
  stroke(c,q=>{q.moveTo(80,291);q.lineTo(80,380);q.moveTo(80,362);q.lineTo(-27,401);q.moveTo(80,362);q.lineTo(176,399);q.moveTo(80,362);q.lineTo(113,419);},K.night,8);
  stroke(c,q=>{q.moveTo(33,267);q.quadraticCurveTo(79,320,135,268);},K.night,10);
  c.restore();
  c.depthLayer?.('tables');
  // A vintage ribbon microphone, a coiled lead and near cafe tables set the scale.
  c.save();c.translate(W*.27,H*.64);c.scale(s*.83,s*.83);
  stroke(c,q=>{q.moveTo(0,230);q.lineTo(0,-200);},K.night,7);oval(c,0,233,74,13,K.night);
  box(c,-26,-231,52,100,K.night,20);box(c,-21,-227,42,92,K.light,17);
  for(let i=0;i<11;i++)box(c,-16,-214+i*6,32,2,K.night,1);
  stroke(c,q=>{q.moveTo(-31,-196);q.lineTo(-31,-149);q.quadraticCurveTo(0,-123,31,-149);q.lineTo(31,-196);},K.gold,3);
  stroke(c,q=>{q.moveTo(0,-142);q.bezierCurveTo(-36,4,52,104,-10,220);},K.night,3);c.restore();
  for(const xx of [W*.03,W*.96]){
    oval(c,xx,H*.94,W*.17,H*.022,K.rose);oval(c,xx,H*.93,W*.17,H*.020,K.wall);
    box(c,xx-2*s,H*.94,4*s,H*.06,K.night);
    box(c,xx-14*s,H*.87,28*s,H*.058,K.light,4*s);oval(c,xx,H*.87,14*s,4*s,paper);
    box(c,xx+27*s,H*.90,26*s,30*s,K.night,3*s);word(c,'SET 02',xx+40*s,H*.914,7*s,paper,'center');
  }
  c.save();c.globalAlpha=.18;
  for(let i=0;i<28;i++){const xx=W*(.18+hash(i,81)*.66),yy=H*((hash(i,82)+t*.004)%1)*.81;disc(c,xx,yy,(.8+hash(i,83))*s,paper);}
  c.restore();
}
