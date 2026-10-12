const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const hex = rgb => '#' + rgb.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
const distance = (a, b) => a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0);

// Rank actual inks by coverage. Nearby shades share a swatch; no averaged or
// complementary colours are invented, and a quiet palette is never padded.
export function dominantColors(palette, limit = 8) {
  const counts = new Map();
  for (const rgb of palette) {
    const key = hex(rgb), entry = counts.get(key);
    if (entry) entry.count++;
    else counts.set(key, { key, rgb: rgb.map(Math.round), count: 1 });
  }
  const inks = [];
  for (const { rgb } of [...counts.values()].sort((a, b) => b.count - a.count || a.key.localeCompare(b.key))) {
    if (inks.every(ink => distance(rgb, ink) >= 18 ** 2)) inks.push(rgb);
    if (inks.length >= clamp(limit, 1, 8)) break;
  }
  return inks;
}

// The scene canvas contains the clean art: the clock and grain live in separate
// DOM overlays. Read native pixels so shrinking the art cannot mix its inks.
export function makeSceneColorSampler(canvas, background = '#000') {
  const pixel = document.createElement('canvas'); pixel.width = pixel.height = 1;
  const context = pixel.getContext('2d', { willReadFrequently: true });
  const snapshot = document.createElement('canvas');
  const snapshotContext = snapshot.getContext('2d', { willReadFrequently: true });
  const sample = (clientX, clientY) => {
    const art = canvas.getBoundingClientRect();
    if (!art.width || !art.height || !canvas.width || !canvas.height) return null;
    const x = clamp(Math.floor((clientX - art.left) / art.width * canvas.width), 0, canvas.width - 1);
    const y = clamp(Math.floor((clientY - art.top) / art.height * canvas.height), 0, canvas.height - 1);
    context.fillStyle = background; context.fillRect(0, 0, 1, 1);
    context.drawImage(canvas, x, y, 1, 1, 0, 0, 1, 1);
    return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
  };
  sample.getPalette = (limit = 8) => {
    const W = canvas.width, H = canvas.height;
    if (!W || !H) return [];
    if (snapshot.width !== W || snapshot.height !== H) { snapshot.width = W; snapshot.height = H; }
    snapshotContext.fillStyle = background; snapshotContext.fillRect(0, 0, W, H);
    snapshotContext.drawImage(canvas, 0, 0);
    const data = snapshotContext.getImageData(0, 0, W, H).data, palette = [];
    const rgbAt = (x, y) => { const i = (y * W + x) * 4; return [data[i], data[i + 1], data[i + 2]]; };
    const cols = Math.min(W, 128), rows = Math.min(H, 128);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = Math.floor((i + .5) * W / cols), y = Math.floor((j + .5) * H / rows), rgb = rgbAt(x, y);
      // Discard edge pixels blended by antialiasing; prefer the flat inks inside
      // the shapes. This also keeps tiny partially transparent details out.
      const around = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
      if (around.every(([px, py]) => distance(rgb, rgbAt(clamp(px, 0, W - 1), clamp(py, 0, H - 1))) === 0)) palette.push(rgb);
    }
    return dominantColors(palette, limit);
  };
  return sample;
}
