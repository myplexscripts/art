// Ambient Essentials: ordered colour planes drift slowly, without a percussive clock.
import { make } from './genre-kit.js?v=20261011-dreamscapes-motion';
export { make };
export const title='Still Fields', no='No. 05', genre='Ambient', text='#c3f0df', dark='#005640', audio=false, textless=true;
export function paint(c,p,t,G) {
  const inks=['#c0eedc','#90e2c0','#51d3a0','#00b87b','#008e60','#005b43'];
  const edges=[0,.19,.37,.54,.72,.88,1].map((edge,i)=>i===0||i===6?edge:edge+Math.sin(t*(.048+i*.003)+i*.6)*.017);
  c.save();
  for(let i=0;i<6;i++) {
    c.fillStyle=inks[i];c.fillRect(0,edges[i]*G.H,G.W,(edges[i+1]-edges[i])*G.H+1);
  }
  // A pair of narrow tonal planes rises and settles over long, independent breaths.
  c.globalAlpha=.16;c.fillStyle='#d6f7e6';
  c.fillRect(0,(.39+Math.sin(t*.039)*.03)*G.H,G.W,(.018+Math.sin(t*.061)*.005)*G.H);
  c.globalAlpha=.12;c.fillStyle='#00694c';
  c.fillRect(0,(.76+Math.sin(t*.031+2)*.023)*G.H,G.W,.017*G.H);
  c.restore();
}
