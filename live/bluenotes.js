// Jazz Piano Essentials: floating ivory/teal bars articulate a swung eighth-note phrase.
import { make as geometry,setup,swing,rectangle,circle } from './genre-kit.js?v=20261011-dreamscapes-motion';
export const title='Blue Notes', no='No. 03', genre='Jazz', text='#c9e8f3', dark='#082e40', audio=false, textless=true;
export function make(W,H) {
  return {...geometry(W,H),bars:[
    [-.31,-.30,.043,.24,-.48,0],[-.12,-.19,.048,.33,.04,0],
    [.15,-.31,.052,.24,.17,0],[.28,-.13,.04,.25,-.69,0],
    [-.32,.15,.042,.25,-.32,0],[.02,.20,.048,.34,.06,0],
    [.28,.32,.036,.19,.24,0],[-.25,.34,.29,.032,.17,1],
    [-.22,-.24,.048,.34,.33,1],[.25,-.24,.24,.043,.62,1],
    [-.09,.10,.043,.20,-.38,1],[.31,.16,.046,.32,.30,1]
  ]};
}
export function paint(c,p,t,G) {
  c.save();setup(c,G,'#082e40');
  const spread=Math.min(1.5,G.H/G.W),bpm=108;
  G.bars.forEach(([x,y,w,h,a,teal],i)=>{
    const phrase=swing(t,bpm,i*.41),motion=Math.sin(phrase*Math.PI);
    const accent=Math.max(0,motion)*.013;
    c.save();c.translate(x+Math.sin(t*.19+i)*.009,y*spread-accent);c.rotate(a+motion*.055);
    rectangle(c,-w/2,-h/2,w,h,teal?'#05aac6':'#c6e6f2');
    if(i===1||i===5)rectangle(c,-w/2,-h/2,w,.006,'#f0faf7');c.restore();
  });
  for(let i=0;i<3;i++) {
    const phase=swing(t,bpm,i/3);
    circle(c,-.32+i*.047,-.02*spread,.006+Math.max(0,Math.sin(phase*Math.PI))*.003,'#087c97');
  }
  c.restore();
}
