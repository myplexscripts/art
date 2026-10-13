// A flowing, pearlescent ribbon inspired by the archive's Ambient Chill cover.
import { make, setup, gradient, glow, disc } from './art-kit.js?v=20261013-after-hours';
export { make };
export const title='Silk Current', no='No. 06', text='#beeaff', dark='#061443', audio=false, textless=true;

function surface(c, path, t, front) {
  c.save(); c.clip(path);
  c.fillStyle=gradient(c,-.35,-.4,.9,.6,[[0,'#b1f8ff'],[.24,'#519edc'],[.44,'#6bd3ed'],[.61,'#7164d9'],[.78,'#3f8cda'],[1,'#98f1ef']]); c.fillRect(-1,-1,3,3);
  // Broad reflected colour travels across the satin rather than moving the whole object.
  c.globalCompositeOperation='screen';
  for(let i=0;i<7;i++) {
    const x=-.27+i*.21+Math.sin(t*.11+i)*.045, y=(front?.3:-.02)+Math.sin(i*.9+t*.09)*.12;
    c.save(); c.translate(x,y); c.rotate(-.55+i*.11); c.scale(1,.34);
    glow(c,0,0,.22,i%3===0?'#d0ffffb0':i%3===1?'#bc8dff95':'#2fdcff90'); c.restore();
  }
  c.globalCompositeOperation='multiply';
  glow(c,-.15,.15,.24,'#19376190'); glow(c,.45,front?.57:.18,.3,'#26479c75');
  c.restore();
  c.strokeStyle=front?'#b7f8ff85':'#a9f7ffb0'; c.lineWidth=.0015; c.stroke(path);
}
export function paint(c,p,t,G) {
  c.save(); setup(c,G,'#0b207c');
  glow(c,-.29,-.34,.6,'#73a7da50'); glow(c,.58,.38,.6,'#366acc50'); glow(c,-.53,.37,.33,'#508eb440');
  const breath=Math.sin(t*.13)*.018;
  c.translate(0,breath); c.rotate(Math.sin(t*.08)*.018);
  const rear=new Path2D();
  rear.moveTo(-.26,-.29); rear.bezierCurveTo(-.05,-.39,-.01,-.2,.19,-.15);
  rear.bezierCurveTo(.48,-.08,.86,-.17,1.2,-.19); rear.lineTo(1.2,.25);
  rear.bezierCurveTo(.72,.16,.26,.1,-.11,.13); rear.bezierCurveTo(-.39,.15,-.47,-.11,-.26,-.29); rear.closePath();
  c.depthLayer?.('rear');
  surface(c,rear,t,false);
  c.save(); c.globalCompositeOperation='screen';
  glow(c,-.23,-.08,.23,'#b0eaff50'); c.restore();
  c.depthLayer?.('orb');
  const orb=c.createRadialGradient(-.29,-.17,.014,-.22,-.07,.18);
  orb.addColorStop(0,'#e1ffff'); orb.addColorStop(.22,'#9cf0ff'); orb.addColorStop(.65,'#78c9ed'); orb.addColorStop(1,'#7195e590');
  disc(c,-.23,-.075,.178,orb);
  glow(c,-.16,-.06,.07,'#b5ffe985'); glow(c,-.3,.055,.09,'#b7afff90');
  const front=new Path2D();
  front.moveTo(-.28,-.29); front.bezierCurveTo(-.51,-.12,-.43,.09,-.28,.28);
  front.bezierCurveTo(-.03,.59,.28,.33,.71,.56); front.lineTo(1.2,.93); front.lineTo(1.2,.47);
  front.bezierCurveTo(.6,.26,.21,.47,-.04,.21); front.bezierCurveTo(-.19,.03,-.34,-.11,-.28,-.29); front.closePath();
  c.depthLayer?.('front-ribbon');
  surface(c,front,t,true);
  c.beginPath(); c.moveTo(-.28,-.29); c.bezierCurveTo(-.15,-.35,-.1,-.29,-.03,-.22);
  c.strokeStyle='#d4ffffb0'; c.lineWidth=.0028; c.stroke();
  c.restore();
}
