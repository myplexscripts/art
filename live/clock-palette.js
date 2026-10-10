// Pick a hue from the art's edges, then choose a readable shade against the clock's background.
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const luminance = rgb => rgb.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
export const contrast = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
function hsl(rgb) {
  const [r, g, b] = rgb.map(v => v / 255), hi = Math.max(r, g, b), lo = Math.min(r, g, b), d = hi - lo, l = (hi + lo) / 2;
  if (!d) return [0, 0, l];
  const h = hi === r ? ((g - b) / d + (g < b ? 6 : 0)) : hi === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, d / (1 - Math.abs(2 * l - 1)), l];
}
function rgb(h, s, l) {
  const a = s * Math.min(l, 1 - l), f = n => { const k = (n + h / 30) % 12; return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))); };
  return [f(0), f(8), f(4)];
}
export function choosePaletteColor(edges, backgrounds) {
  let x = 0, y = 0, saturation = 0, weights = 0;
  for (const color of edges) {
    const [h, s, l] = hsl(color), weight = s * (.25 + l);
    x += Math.cos(h * Math.PI / 180) * weight; y += Math.sin(h * Math.PI / 180) * weight;
    saturation += s * weight; weights += weight;
  }
  const hue = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  const sat = clamp(weights ? saturation / weights : .36, .3, .58);
  const behind = backgrounds.map(luminance);
  let best, bestScore = 0;
  for (const light of [.82, .88, .94, .72, .6, .38, .24, .12, .05]) {
    const color = rgb(hue, sat, light), lum = luminance(color);
    const score = Math.min(...behind.map(v => contrast(lum, v)));
    if (score > bestScore) { best = color; bestScore = score; }
    if (score >= 4.5) break;
  }
  return { color: `rgb(${best.map(v => Math.round(v)).join(' ')})`, contrast: bestScore, hue };
}
export function makePaletteSampler(canvas, face) {
  const tiny = document.createElement('canvas'); tiny.width = tiny.height = 20;
  const c = tiny.getContext('2d', { willReadFrequently: true });
  return () => {
    c.drawImage(canvas, 0, 0, 20, 20);
    const data = c.getImageData(0, 0, 20, 20).data;
    const at = (x, y) => { const i = (clamp(Math.round(y), 0, 19) * 20 + clamp(Math.round(x), 0, 19)) * 4; return [data[i], data[i + 1], data[i + 2]]; };
    const art = canvas.getBoundingClientRect(), text = face.getBoundingClientRect();
    const x0 = (text.left + 20 - art.left) / art.width * 19, x1 = (text.right - 20 - art.left) / art.width * 19;
    const y0 = (text.top + 20 - art.top) / art.height * 19, y1 = (text.bottom - 20 - art.top) / art.height * 19;
    const behind = [];
    for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) behind.push(at(x0 + (x1 - x0) * i / 4, y0 + (y1 - y0) * j / 2));
    const edges = [[1, 1], [18, 1], [1, 18], [18, 18], [10, 1], [10, 18]].map(([x, y]) => at(x, y));
    return choosePaletteColor(edges, behind).color;
  };
}
