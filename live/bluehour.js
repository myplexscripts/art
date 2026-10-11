// Original Music Series No. 03: a quiet piano room beneath a rain-streaked arch.
import { paper, makeRoom, box, disc, oval, stroke, polygon, word, hash, screw, wood, plant, steam, books } from './music-kit.js?v=20261011-dreamscapes';
export const title = 'BLUE HOUR', no = 'No. 03', text = '#183a51', dark = '#102638', audio = false;
export const make = makeRoom;
const K={night:'#102638',wall:'#24475d',blue:'#416b85',mint:'#91b0b4',wood:'#16394c',gold:'#e8b768',dim:'#bc8350',key:'#f2e5c3'};
export function paint(c,p,t,{W,H,s}) {
  box(c,0,0,W,H,K.wall);
  // Plaster panels, a high picture rail and dark wainscoting establish the room.
  box(c,0,H*.08,W,5*s,K.blue);
  for(const xx of [W*.04,W*.96])stroke(c,q=>{q.moveTo(xx,H*.10);q.lineTo(xx,H*.76);},K.blue,3*s);
  box(c,0,H*.62,W,H*.17,K.wood);
  for(let i=0;i<Math.ceil(W/(95*s));i++)box(c,i*95*s,H*.64,3*s,H*.14,K.blue);
  box(c,0,H*.62,W,8*s,K.night);
  const wx=W*.50,wy=H*.12,ww=Math.min(W*.56,H*.65),wh=H*.47;
  box(c,wx-ww*.54,wy-ww*.02,ww*1.08,wh+ww*.02,K.night,[ww*.54,ww*.54,0,0]);
  box(c,wx-ww*.5,wy,ww,wh,K.mint,[ww*.5,ww*.5,0,0]);
  c.save();c.beginPath();c.roundRect(wx-ww*.47,wy+ww*.03,ww*.94,wh-ww*.03,[ww*.47,ww*.47,0,0]);c.clip();
  box(c,wx-ww*.5,wy,ww,wh,K.blue);disc(c,wx+ww*.20,wy+wh*.30,ww*.09,K.gold);
  // Three planes of rooftops: chimneys and tiny occupied rooms keep their places.
  for(let layer=0;layer<3;layer++)for(let i=0;i<14;i++){
    const bx=wx-ww*.53+i*ww*.085,bw=ww*.085,bh=wh*(.37+hash(i,40+layer)*.22),bottom=wy+wh+layer*wh*.035;
    box(c,bx,bottom-bh,bw,bh,[K.wall,K.wood,K.night][layer]);
    box(c,bx+bw*.60,bottom-bh-bw*.16,bw*.15,bw*.20,K.night);
    stroke(c,q=>{q.moveTo(bx,bottom-bh);q.lineTo(bx+bw,bottom-bh);},K.mint,1*s);
    for(let col=0;col<3;col++)for(let row=0;row<6;row++)if(hash(i*29+col*9+row,layer+8)>.50){
      const xx=bx+bw*(.13+col*.28),yy=bottom-bh+12*s+row*18*s;
      if(yy<bottom-12*s){box(c,xx,yy,bw*.13,9*s,hash(i+row,3)>.4?K.gold:K.mint);box(c,xx,yy+4*s,bw*.13,1*s,K.blue);}
    }
  }
  for(let i=0;i<56;i++){
    const x=wx-ww*.46+hash(i,21)*ww*.92,y=wy+((hash(i,22)+t*(.017+hash(i,23)*.027))%1)*wh;
    c.save();c.globalAlpha=.22+hash(i,24)*.30;stroke(c,q=>{q.moveTo(x,y);q.lineTo(x-ww*.005,y+ww*(.017+hash(i,25)*.020));},K.mint,(1+hash(i,26))*s);c.restore();
  }
  // Near beads creep down the pane and leave a fine run behind them.
  for(let i=0;i<14;i++){const xx=wx+(hash(i,31)-.5)*ww*.83,yy=wy+((hash(i,32)+t*.005)%1)*wh;stroke(c,q=>{q.moveTo(xx,yy-22*s);q.quadraticCurveTo(xx+3*s,yy-10*s,xx,yy);},K.blue,1.4*s);oval(c,xx,yy,1.8*s,3.3*s,K.mint);}
  c.restore();stroke(c,q=>{q.moveTo(wx,wy+ww*.07);q.lineTo(wx,wy+wh);q.moveTo(wx-ww*.50,wy+wh*.60);q.lineTo(wx+ww*.50,wy+wh*.60);},K.night,9*s);
  box(c,wx-ww*.54,wy+wh,ww*1.08,9*s,K.mint);box(c,wx-ww*.58,wy+wh+9*s,ww*1.16,12*s,K.night);
  // Gathered curtains show a darker edge and a stitched inner seam.
  for(const side of [-1,1]){
    const xx=wx+side*ww*.59;
    polygon(c,[[xx-side*25*s,wy],[xx+side*52*s,wy],[xx+side*35*s,wy+wh],[xx-side*6*s,wy+wh]],K.wood);
    for(let j=0;j<4;j++)stroke(c,q=>{q.moveTo(xx+side*j*9*s,wy);q.bezierCurveTo(xx+side*(j*9+7)*s,wy+wh*.25,xx+side*(j*9-4)*s,wy+wh*.6,xx+side*j*7*s,wy+wh);},j%2?K.blue:K.night,3*s);
  }
  box(c,0,H*.78,W,H*.22,K.night);
  for(let i=0;i<9;i++)stroke(c,q=>{q.moveTo(W*.5,H*.78);q.lineTo((i-1)*W*.16,H);},K.blue,2*s);
  for(let i=1;i<8;i++){const yy=H*.78+(H*.22)*(i/8)**1.7;stroke(c,q=>{q.moveTo(0,yy);q.lineTo(W,yy);},K.wood,2*s);}
  c.depthLayer?.('piano');
  c.save();c.translate(W*.5,H*.65);c.scale(s,s);
  oval(c,0,225,475,52,'#0c202e');
  box(c,-410,95,44,185,K.wood,8);box(c,366,95,44,185,K.wood,8);
  box(c,-440,-276,880,434,K.night,22);box(c,-411,-248,822,254,K.wood,11);
  wood(c,-432,-265,21,420,K.wood,K.blue,true);wood(c,411,-265,21,420,K.wood,K.blue,true);
  box(c,-434,-276,868,11,K.blue,3);box(c,-405,-238,810,5,K.dim);
  // Gold strings shimmer gently through the open upper cabinet.
  for(let i=0;i<44;i++){const x=-365+i*17;stroke(c,q=>{q.moveTo(x,-222);q.bezierCurveTo(x+Math.sin(t*.8+i)*2,-135,x,-35,x,-12);},i%4?K.dim:K.gold,i%4?2:4);}
  // Cast plate, tuning pins, dampers and the repeating hammer mechanism.
  for(let i=0;i<44;i++){
    const xx=-365+i*17,active=Math.max(0,Math.sin(t*.46-i*.82))**18;
    screw(c,xx,-229,2,K.night,K.dim);box(c,xx-3,-139,6,18,K.night,1);
    stroke(c,q=>{q.moveTo(xx,-65);q.lineTo(xx+active*4,-105-active*8);},K.dim,3);
    box(c,xx-5+active*4,-111-active*8,10,12,paper,2);
  }
  polygon(c,[[-385,-229],[-339,-229],[214,-8],[174,-8]],K.wood);
  stroke(c,q=>{q.moveTo(-359,-222);q.lineTo(194,-18);},K.dim,3);
  box(c,-390,-80,780,14,K.blue,3);box(c,-440,-14,880,45,K.wood,7);
  word(c,'B L U E  H O U R',0,-34,17,K.gold,'center');
  box(c,-452,25,904,135,K.night,9);
  const kw=800/28;
  for(let i=0;i<28;i++){const active=Math.max(0,Math.sin(t*.46-i*.82))**18;box(c,-400+i*kw,38+active*5,kw-2,95-active*5,i%7===3?paper:K.key,3);box(c,-400+i*kw,126,kw-2,8,K.mint,1);stroke(c,q=>{q.moveTo(-397+i*kw,47);q.lineTo(-397+i*kw,120);},'#dccfae',.6);}
  for(let i=0;i<27;i++)if(![2,6].includes(i%7)){const active=Math.max(0,Math.sin(t*.72-i*.82+.5))**16;box(c,-400+(i+1)*kw-kw*.30,38+active*5,kw*.60,58,K.night,3);box(c,-400+(i+1)*kw-kw*.24,42+active*5,kw*.48,43,K.blue,2);}
  box(c,-434,149,868,24,K.blue,4);
  // Molded lower cabinet, brass hinges and three pedals above the parquet.
  wood(c,-400,173,800,92,K.wood,K.blue);box(c,-400,181,800,5,K.night);
  for(const xx of [-345,345]){box(c,xx-19,192,38,52,K.night,4);box(c,xx-14,197,28,42,K.wood,3);}
  for(const xx of [-37,0,37]){stroke(c,q=>{q.moveTo(xx,242);q.lineTo(xx,280);},K.dim,5);oval(c,xx,283,13,7,K.gold,-.08);}
  for(const xx of [-395,395])screw(c,xx,14,4,K.night,K.gold);
  c.depthLayer?.('sheets');
  // A small music stand, two open pages, and a warm shaded lamp.
  polygon(c,[[-140,-287],[140,-287],[158,-163],[-158,-163]],K.night);
  polygon(c,[[-129,-277],[-5,-264],[-5,-176],[-137,-181]],paper);polygon(c,[[5,-264],[129,-277],[137,-181],[5,-176]],paper);
  for(const side of [-1,1]){
    for(let staff=0;staff<2;staff++)for(let j=0;j<5;j++)stroke(c,q=>{q.moveTo(side*22,-252+staff*38+j*4);q.lineTo(side*117,-258+staff*38+j*4);},K.blue,.75);
    for(let j=0;j<12;j++){
      const xx=side*(31+(j%6)*14),yy=-249+Math.floor(j/6)*38+(j%4)*3;
      oval(c,xx,yy,3.3,2,K.night,-.3);stroke(c,q=>{q.moveTo(xx+3,yy);q.lineTo(xx+3,yy-14);},K.night,1);
    }
  }
  stroke(c,q=>{q.moveTo(325,-277);q.lineTo(325,-355);q.lineTo(274,-382);},K.gold,8);
  polygon(c,[[248,-415],[302,-415],[320,-367],[230,-367]],K.gold);box(c,295,-280,59,7,K.gold,3);
  for(let i=0;i<7;i++)stroke(c,q=>{q.moveTo(250+i*7,-410);q.lineTo(234+i*13,-370);},K.dim,1.2);
  // A working metronome, a ceramic cup and stacked scores on the cabinet top.
  polygon(c,[[-344,-280],[-270,-280],[-287,-369],[-329,-369]],K.dim);
  polygon(c,[[-335,-287],[-279,-287],[-292,-358],[-323,-358]],K.night);
  for(let i=0;i<6;i++)box(c,-317,-352+i*8,18,1,K.gold);
  c.save();c.translate(-307,-292);c.rotate(Math.sin(t*1.3)*.27);stroke(c,q=>{q.moveTo(0,0);q.lineTo(0,-77);},paper,2.5);box(c,-5,-57,10,14,K.gold,2);c.restore();
  box(c,168,-289,47,9,paper,2);box(c,165,-280,52,5,K.dim,1);
  oval(c,195,-311,27,6,K.night);box(c,174,-332,40,22,K.mint,4);oval(c,194,-332,20,5,paper);oval(c,194,-331,16,3,K.wood);
  stroke(c,q=>{q.moveTo(214,-327);q.bezierCurveTo(231,-331,231,-311,214,-314);},K.mint,4);
  steam(c,194,-334,59,t);
  c.depthLayer?.('bench');
  // The upholstered bench has turned legs, piping and shallow tufting.
  box(c,-205,304,410,44,K.night,9);box(c,-198,304,396,19,K.blue,6);
  for(let i=0;i<8;i++)disc(c,-173+i*49,315,2.3,K.night);
  for(const xx of [-165,165]){box(c,xx-9,344,18,77,K.wood,4);disc(c,xx,375,12,K.wood);box(c,xx-12,413,24,7,K.night,2);}
  c.restore();
  plant(c,W*.08,H*.79,s*.74,t,K.mint,K.wood,K.dim);
  // Lamp light hangs in quiet translucent bands; no flicker or audio synchronization.
  c.save();c.globalAlpha=.09+.02*Math.sin(t*.22);polygon(c,[[W*.78,H*.39],[W*.94,H*.73],[W*.48,H*.73]],K.gold);c.restore();
}
