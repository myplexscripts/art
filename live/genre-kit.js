// Shared geometry and musical clocks; all animation is silent and deterministic.
export { make, setup, TAU } from './art-kit.js?v=20261011-clock-edge';
export const ease = x => x*x*(3-2*x);
export const beat = (t, bpm, offset=0) => Math.pow(Math.max(0,Math.cos(Math.PI*2*(t*bpm/60-offset))),4);
// A jazz eighth-note pair takes 2/3 then 1/3 of a beat.
export function swing(t,bpm,offset=0) {
  const b=t*bpm/60-offset, f=b-Math.floor(b);
  return f<2/3 ? f*1.5 : 1+(f-2/3)*3;
}
export function polygon(c,points,ink) {
  c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=ink;c.fill();
}
export function rectangle(c,x,y,w,h,ink) { c.fillStyle=ink;c.fillRect(x,y,w,h); }
export function circle(c,x,y,r,ink) { c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=ink;c.fill(); }
