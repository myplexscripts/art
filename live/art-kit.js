// Geometry and light for the text-free playlist interpretations. No external assets.
export const TAU = Math.PI * 2;
export const hash = (n, seed = 1) => { const x = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453; return x - Math.floor(x); };
export function make(W, H) { return { W, H, S: Math.min(W, H) }; }
export function gradient(c, x0, y0, x1, y1, stops) {
  const g = c.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([at, ink]) => g.addColorStop(at, ink)); return g;
}
export function glow(c, x, y, r, ink, edge = 'transparent') {
  const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, ink); g.addColorStop(1, edge);
  c.fillStyle = g; c.fillRect(x-r, y-r, r*2, r*2);
}
export function disc(c, x, y, r, ink) { c.beginPath(); c.arc(x,y,r,0,TAU); c.fillStyle=ink; c.fill(); }
export function setup(c, G, ink) {
  c.fillStyle=ink; c.fillRect(0,0,G.W,G.H); c.translate(G.W/2,G.H/2); c.scale(G.S,G.S);
}
