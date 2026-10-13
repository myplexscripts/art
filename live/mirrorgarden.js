// Dreamscapes No. 05: a wind-tossed garden reflected in a suspended lake.
import { makeWorld, hash, frac, box, disc, oval, polygon, line, leaf, stars, clouds } from './dream-kit.js?v=20261013-after-hours';
export const title = 'Mirror Garden', no = 'No. 05', dark = '#253f43', text = '#253f43', audio = 'jungle', grain = true;
const K = { sky: '#3a575c', halo: '#4e7174', soft: '#6f8a86', moon: '#c8bd91', dark: '#233f40',
  tree: '#365c50', leaf: '#5c8165', light: '#869b75', bank: '#688573', edge: '#a6ae8b', water: '#477880', deepWater: '#37616b', gold: '#d4b37b' };
const FAR = [[.23,.25,13],[.40,.17,19],[.74,.24,23],[.89,.18,27]];
const FANS=new Map(),TREES=new Map();
function treePaths(seed) {
  if(TREES.has(seed))return TREES.get(seed);
  const trunk=new Path2D(),branches=new Path2D();
  for(const [i,[x,y]]of [[-.026,0],[-.015,-.52],[.008,-.92],[.027,-.45],[.047,0]].entries())i?trunk.lineTo(x,y):trunk.moveTo(x,y);
  trunk.closePath();
  for(let j=0;j<7;j++) {
    const side=j%2?1:-1,f=.25+j*.075,xx=side*(.12+hash(j,seed)*.15),yy=-f;
    branches.moveTo(.009,-(f-.13));branches.quadraticCurveTo(xx*.61,yy+.025,xx,yy-.08);
  }
  const paths={trunk,branches};TREES.set(seed,paths);return paths;
}
function fanPaths(seed,j,far) {
  const key=`${seed}:${j}:${far}`;
  if(FANS.has(key))return FANS.get(key);
  const primary=new Path2D(),light=new Path2D(),veins=new Path2D(),side=j%2?1:-1;
  for(let k=0;k<5;k++) {
    const angle=(k-2)*.55+side*.40,length=.17+hash(j*5+k,seed+1)*.075,width=length*.23;
    const ox=Math.sin(angle)*.023,oy=Math.cos(angle)*.008,cs=Math.cos(angle),sn=Math.sin(angle);
    const point=(x,y)=>[ox+x*cs-y*sn,oy+x*sn+y*cs],path=k%3?primary:light;
    path.moveTo(...point(0,0));
    path.bezierCurveTo(...point(-width,-length*.36),...point(-width*.45,-length*.85),...point(0,-length));
    path.bezierCurveTo(...point(width*.58,-length*.74),...point(width,-length*.33),...point(0,0));path.closePath();
    if(!far){veins.moveTo(...point(0,-length*.12));veins.quadraticCurveTo(...point(width*.04,-length*.52),...point(0,-length*.85));}
  }
  if(far)primary.addPath(light);
  const fan={primary,light,veins};FANS.set(key,fan);return fan;
}
function lakeGeometry(W,H,S) {
  const cy=H*.55, ry=Math.min(S*.29,H*.22), rx=W*.53;
  return { cy,ry,rx,upper:cy-ry*.83,lower:cy+ry*.79 };
}
export function make(W,H) {
  const G=makeWorld(W,H,111), L=lakeGeometry(W,H,G.S);
  // Allocate the reflection surface once per resize, including on iOS versions
  // without OffscreenCanvas. It contains the same sky and moving trees we show.
  const source=document.createElement('canvas');
  const sourceScale=Math.min(1,640/W);
  source.width=Math.ceil(W*sourceScale);source.height=Math.ceil((L.upper+2)*sourceScale);
  const sourceContext=source.getContext('2d');sourceContext.setTransform(sourceScale,0,0,sourceScale,0,0);
  return { ...G,...L,source,sourceContext,sourceScale };
}
function tree(c,x,y,size,t,seed,inverted=false,far=false) {
  c.save();c.translate(x,y);if(inverted)c.scale(1,-1);
  // The roots stay anchored: the trunk leans and the individual leaf fans
  // respond a little later, rather than sliding as one rigid object.
  const breeze=Math.sin(t*.48+seed*.31)*.035+Math.sin(t*.83+seed)*.012;
  c.rotate(breeze);
  const trunk=far?K.tree:K.dark,leaves=far?K.leaf:K.tree;
  const paths=treePaths(seed);
  c.save();c.scale(size,size);c.fillStyle=trunk;c.fill(paths.trunk);
  c.strokeStyle=trunk;c.lineWidth=.019;c.lineCap='round';c.lineJoin='round';c.stroke(paths.branches);c.restore();
  for(let j=0;j<7;j++) {
    const side=j%2?1:-1,f=.25+j*.075,xx=side*size*(.12+hash(j,seed)*.15),yy=-size*f;
    c.save();c.translate(xx,yy-size*.06);c.rotate(Math.sin(t*.71+seed+j*.34)*.095);
    // Unit paths are shared across sizes and cached once; only the fan's
    // transform changes with the wind, instead of rebuilding every leaf.
    const fan=fanPaths(seed,j,far);
    c.save();c.scale(size,size);c.fillStyle=leaves;c.fill(fan.primary);
    if(!far){c.fillStyle=K.leaf;c.fill(fan.light);c.strokeStyle=trunk;c.lineWidth=.005;c.stroke(fan.veins);}c.restore();
    if(!far&&j%3===0) {
      disc(c,side*size*.044,-size*.014,size*.012,K.moon);
      disc(c,side*size*.021,-size*.001,size*.009,K.gold);
    }
    c.restore();
  }
  leaf(c,size*.009,-size*.71,size*.25,size*.065,Math.sin(t*.69+seed)*.11,leaves,trunk);
  c.restore();
}
function sky(c,G,t) {
  const { W,H,S }=G,mx=W*.62,my=H*.22,mr=S*.13;
  box(c,0,0,W,H,K.sky);
  disc(c,mx,my,mr*2.2,K.halo);disc(c,mx,my,mr*1.54,K.soft);disc(c,mx,my,mr,K.moon);
  stars(c,G,t*2,K.edge,.98);
  // The original posters' drifting cloud language, with a visible breeze.
  clouds(c,G,t*8,K.halo,6,.79,143);
}
function upperGarden(c,G,t) {
  const { W,S,upper }=G;
  for(const [x,s,seed]of FAR)tree(c,W*x,upper-S*.009,S*s,t,seed,false,true);
  tree(c,W*.075,upper,S*.62,t,35);tree(c,W*.94,upper,S*.53,t,42);
}
function updateSource(c,G,t) {
  const { W,upper,source,sourceContext:ink }=G;
  // The viewer draws in a 1200-unit world even on a small phone. Match the
  // offscreen bitmap to the output resolution, with a bound for large screens.
  const sourceScale=Math.min(1,Math.abs(c.getTransform().a),720/W);
  if(Math.abs(sourceScale-G.sourceScale)>.0001) {
    source.width=Math.ceil(W*sourceScale);source.height=Math.ceil((upper+2)*sourceScale);
    ink.setTransform(sourceScale,0,0,sourceScale,0,0);G.sourceScale=sourceScale;
  }
  // Redraw once with the same time and wind as the visible garden.
  sky(ink,G,t);upperGarden(ink,G,t);
}
function reflection(c,G,t) {
  const { W,S,cy,ry,upper,source,sourceScale }=G;
  // Invert the actual source in shallow strips. Travelling ripples displace
  // each strip independently without repainting the foliage for every strip.
  const depth=cy+ry-upper,squeeze=depth/upper,stripe=Math.max(2,S*.008);
  c.save();c.globalAlpha=.9;
  for(let y=upper;y<cy+ry;y+=stripe) {
    const h=Math.min(stripe+.65,cy+ry-y),u=(y-upper)/depth;
    const sh=h/squeeze,sy=Math.max(0,upper-(y-upper)/squeeze-sh);
    const offset=S*(.003+.014*u)*Math.sin(t*1.05-u*24)+S*.003*Math.sin(t*.57+u*41);
    c.save();c.translate(offset,y+h);c.scale(1,-1);
    c.drawImage(source,0,sy*sourceScale,W*sourceScale,Math.min(sh*sourceScale,source.height-sy*sourceScale),0,0,W,h);c.restore();
  }
  c.restore();
  // Transparent water colour lets the moon and all four tree silhouettes read
  // clearly; opaque alternating bands used to paint those reflections away.
  c.save();c.globalAlpha=.13;box(c,-S,upper,W+S*2,depth,K.water);c.restore();
}
function water(c,G,t) {
  const { W,S,cy,ry,upper }=G;
  for(let j=0;j<11;j++) {
    const f=(j+.6)/11,yy=upper+(cy+ry-upper)*f;
    c.save();c.globalAlpha=.22+f*.14;
    c.setLineDash([S*(.038+f*.06),S*(.13+hash(j,94)*.15)]);
    c.lineDashOffset=(j%2?1:-1)*t*S*(.023+f*.008)+j*S*.057;
    line(c,q=>{for(let i=0;i<=40;i++) {
      const x=-S+i/40*(W+S*2),y=yy+Math.sin(x/S*11-t*.94+j*.63)*S*(.002+f*.004);
      i?q.lineTo(x,y):q.moveTo(x,y);
    }},j%3?K.soft:K.edge,S*(.0015+f*.001));c.restore();
  }
  // New rings continuously spread from three patches of water. Their fading
  // starts and ends hide the loop instead of making the whole lake pulsate.
  for(let j=0;j<3;j++)for(let k=0;k<3;k++) {
    const u=frac(t/6.6+k/3+j*.22),x=W*(.25+j*.23),y=cy+ry*(j%2?.31:-.1);
    const r=S*(.013+u*.17),fade=Math.sin(Math.PI*u);
    c.save();c.globalAlpha=fade*.56;
    c.beginPath();c.ellipse(x,y,r,r*.22,0,.12,Math.PI*1.92);
    c.strokeStyle=K.edge;c.lineWidth=S*.0018;c.stroke();c.restore();
  }
}
function bank(c,G,t,side) {
  const { W,S,upper,lower }=G,by=side<0?upper:lower;
  c.beginPath();c.moveTo(-S*.03,by);
  for(let i=0;i<=32;i++) {
    const f=i/32,xx=f*(W+S*.06)-S*.03,yy=by+side*S*(.024*Math.sin(f*7.1)+.008*Math.sin(f*19));c.lineTo(xx,yy);
  }
  c.lineTo(W+S*.03,by+side*S*.026);c.lineTo(-S*.03,by+side*S*.026);c.closePath();c.fillStyle=K.bank;c.fill();
  for(let i=0;i<20;i++) {
    const xx=W*i/19,yy=by+side*S*.024*Math.sin(i/19*7.1);
    leaf(c,xx,yy,S*.026,S*.008,(side<0?(i%2?.9:-.9):(i%2?2.2:-2.2))+Math.sin(t*.85+i*.6)*.18,i%3?K.leaf:K.light);
  }
}
export function paint(c,p,t,G) {
  const { W,S,cy,ry,rx,upper,lower }=G;
  c.save();sky(c,G,t);updateSource(c,G,t);
  c.drawImage(G.source,0,0,G.source.width/G.sourceScale,G.source.height/G.sourceScale);
  oval(c,W*.5,cy,rx+S*.016,ry+S*.027,K.bank);
  oval(c,W*.5,cy,rx,ry,K.water);
  const lake=new Path2D();lake.ellipse(W*.5,cy,rx,ry,0,0,Math.PI*2);
  c.save();c.clip(lake);reflection(c,G,t);water(c,G,t);
  const fishX=W*.5+Math.sin(t*.21)*S*.21,fishY=cy+Math.sin(t*.32)*ry*.29;
  c.save();c.translate(fishX,fishY);c.scale(Math.cos(t*.21)>=0?1:-1,1);
  oval(c,0,0,S*.024,S*.008,K.gold);
  const tail=Math.sin(t*2.4)*S*.003;
  polygon(c,[[-S*.018,0],[-S*.034,-S*.010+tail],[-S*.034,S*.010+tail]],K.gold);
  disc(c,S*.013,-S*.002,S*.0017,K.dark);c.restore();c.restore();
  c.depthLayer?.('lake-rim');
  c.beginPath();c.ellipse(W*.5,cy,rx+S*.004,ry+S*.007,0,0,Math.PI*2);c.strokeStyle=K.edge;c.lineWidth=S*.003;c.stroke();
  bank(c,G,t,-1);bank(c,G,t,1);
  c.depthLayer?.('upright-trees');
  tree(c,W*.075,upper,S*.62,t,35);tree(c,W*.94,upper,S*.53,t,42);
  c.depthLayer?.('inverted-trees');
  tree(c,W*.14,lower,S*.52,t,35,true);tree(c,W*.82,lower,S*.57,t,42,true);
  tree(c,W*.43,lower+S*.012,S*.24,t,61,true,true);
  c.restore();
}
