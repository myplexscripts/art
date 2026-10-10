// Funk Essentials: an orange/violet pinwheel turns and flexes on a syncopated groove.
import { make,setup,beat,TAU } from './genre-kit.js';
export { make };
export const title='Funk Spiral', no='No. 06', genre='Funk', text='#ff9d44', dark='#472398', audio=false, textless=true;
const inks=['#df4604','#ff8131','#ffaf64','#887cf0','#653de0','#502aaf'];
export function paint(c,p,t,G) {
  c.save();setup(c,G,'#6636c6');
  const radius=Math.hypot(G.W,G.H)/G.S*.64,bpm=104;
  const pocket=beat(t,bpm,.5)*.06-beat(t,bpm,.25)*.025;
  const twist=.72+pocket+Math.sin(t*.19)*.035;
  c.translate(Math.sin(t*.13)*.013,.035+Math.cos(t*.11)*.009);
  c.rotate(t*.12+Math.sin(t*bpm/60*TAU)*.012);
  const w=TAU/12;
  for(let i=0;i<12;i++) {
    const a=i*w, b=a+w;
    c.beginPath();c.moveTo(0,0);
    c.bezierCurveTo(Math.cos(a+twist)*radius*.28,Math.sin(a+twist)*radius*.28,
      Math.cos(a+twist*.5)*radius*.74,Math.sin(a+twist*.5)*radius*.74,Math.cos(a)*radius,Math.sin(a)*radius);
    c.arc(0,0,radius,a,b);
    c.bezierCurveTo(Math.cos(b+twist*.5)*radius*.74,Math.sin(b+twist*.5)*radius*.74,
      Math.cos(b+twist)*radius*.28,Math.sin(b+twist)*radius*.28,0,0);
    c.closePath();c.fillStyle=inks[i%inks.length];c.fill();
    // Matching hairline closes anti-alias seams between adjoining sectors.
    c.strokeStyle=inks[i%inks.length];c.lineWidth=.001;c.stroke();
  }
  c.restore();
}
