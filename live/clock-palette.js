// Choose an ink once from the art beneath the clock, then keep its brightness fixed.
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const luminance = rgb => rgb.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
export const contrast = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const css = rgb => `rgb(${rgb.map(v => Math.round(v)).join(' ')})`;
export const hex = rgb => '#' + rgb.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
export const fromHex = value => /^#[\da-f]{6}$/i.test(value) ? [1, 3, 5].map(i => parseInt(value.slice(i, i + 2), 16)) : null;
const distance = (a, b) => a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0);
const hueDistance = (a, b) => Math.abs((a - b + 540) % 360 - 180);
function rgbHsl(rgb) {
  const [r, g, b] = rgb.map(v => v / 255), hi = Math.max(r, g, b), lo = Math.min(r, g, b), delta = hi - lo;
  const light = (hi + lo) / 2;
  return { hue: delta ? (60 * (hi === r ? (g - b) / delta : hi === g ? (b - r) / delta + 2 : (r - g) / delta + 4) + 360) % 360 : 0,
    saturation: delta ? delta / (1 - Math.abs(2 * light - 1)) : 0, light, chroma: delta };
}

// Count distinct colour families rather than listing three nearly identical gradient pixels.
// Each representative is an actual sampled ink, not an average invented by clustering.
export function dominantColors(palette, limit = 3) {
  const bins = new Map();
  for (const rgb of palette) {
    const key = rgb.map(v => Math.floor(v / 24)).join(',');
    if (!bins.has(key)) bins.set(key, []);
    bins.get(key).push(rgb);
  }
  const clusters = [];
  for (const pixels of [...bins.values()].sort((a, b) => b.length - a.length)) {
    const center = [0, 1, 2].map(i => pixels.reduce((sum, p) => sum + p[i], 0) / pixels.length);
    const near = clusters.filter(c => distance(c.center, center) < 44 ** 2).sort((a, b) => distance(a.center, center) - distance(b.center, center))[0];
    if (near) {
      near.center = near.center.map((v, i) => (v * near.pixels.length + center[i] * pixels.length) / (near.pixels.length + pixels.length));
      near.pixels.push(...pixels);
    } else clusters.push({ center, pixels: [...pixels] });
  }
  const inks = clusters.sort((a, b) => b.pixels.length - a.pixels.length)
    .map(c => c.pixels.reduce((best, p) => distance(p, c.center) < distance(best, c.center) ? p : best, c.pixels[0]));
  // Very quiet scenes can have fewer large families; retain their next distinct actual shades.
  if (inks.length < limit) for (const rgb of palette) {
    if (inks.every(ink => distance(rgb, ink) >= 12 ** 2)) inks.push(rgb);
    if (inks.length >= limit) break;
  }
  return inks.slice(0, limit);
}

export function choosePaletteColor(palette, backgrounds, polarity = null, minimum = 3) {
  const background = median(backgrounds.map(luminance));
  polarity ??= background >= .18 ? 'dark' : 'light';
  const beneath = backgrounds.reduce((best, rgb) => Math.abs(luminance(rgb) - background) < Math.abs(luminance(best) - background) ? rgb : best, backgrounds[0]);
  const resting = rgbHsl(beneath), opposingHue = (resting.hue + 180) % 360;
  const target = beneath.map(v => 255 - v);
  const score = rgb => {
    const ink = rgbHsl(rgb);
    return resting.chroma < .035 ? distance(rgb, target) / (255 ** 2 * 3)
      : hueDistance(ink.hue, opposingHue) / 180 + Math.abs(ink.saturation - resting.saturation) * .12 + Math.abs(ink.light - (1 - resting.light)) * .12;
  };
  const suitable = palette.filter(rgb => {
    const ink = rgbHsl(rgb), light = luminance(rgb);
    const readable = contrast(light, background) >= minimum && (polarity === 'dark' ? light < background : light > background);
    return readable && (resting.chroma < .035 || ink.chroma >= .025 && hueDistance(ink.hue, opposingHue) <= 60);
  }).sort((a, b) => score(a) - score(b));
  if (suitable.length) {
    const rgb = suitable[0].map(Math.round);
    return { color: css(rgb), rgb, contrast: contrast(luminance(rgb), background), polarity, source: rgb, generated: false, background: beneath };
  }
  // A single-hue poster may contain no complementary ink. Match its saturation,
  // then adjust the opposite hue's lightness only until the text is readable.
  const chromatic = palette.map(rgbHsl).filter(ink => ink.chroma >= .025);
  const saturation = resting.chroma >= .035 && chromatic.length ? clamp(median(chromatic.map(ink => ink.saturation)), .12, .65) : 0;
  const light = 1 - resting.light, end = polarity === 'dark' ? 0 : 1;
  const source = hslRgb(opposingHue, saturation, light);
  let color = source.map(Math.round);
  for (let step = 1; contrast(luminance(color), background) < minimum && step <= 200; step++) {
    color = hslRgb(opposingHue, saturation, light + (end - light) * step / 200).map(Math.round);
  }
  return { color: css(color), rgb: color, contrast: contrast(luminance(color), background), polarity, source, generated: true, background: beneath };
}

function hslRgb(hue, saturation, light) {
  const h = ((hue % 360) + 360) % 360 / 30, a = saturation * Math.min(light, 1 - light);
  return [0, 8, 4].map(n => {
    const k = (n + h) % 12;
    return 255 * (light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)));
  });
}

export function makeClockColor(rgb, sceneHue = null) {
  const fixed = css(rgb);
  if (sceneHue === null) return () => fixed;
  const [r, g, b] = rgb.map(v => v / 255), hi = Math.max(r, g, b), lo = Math.min(r, g, b), delta = hi - lo;
  if (!delta) return () => fixed;
  const light = (hi + lo) / 2, saturation = delta / (1 - Math.abs(2 * light - 1));
  const hue = 60 * (hi === r ? (g - b) / delta : hi === g ? (b - r) / delta + 2 : (r - g) / delta + 4);
  const brightness = luminance(rgb);
  return nextHue => {
    const shift = ((nextHue - sceneHue) % 360 + 360) % 360;
    if (shift < 1e-8 || shift > 360 - 1e-8) return fixed;
    // HSL lightness alone would make green look brighter than blue. Keep measured
    // luminance constant as hue follows the scene, without reading the art again.
    let low = 0, high = 1;
    for (let i = 0; i < 16; i++) {
      const mid = (low + high) / 2;
      if (luminance(hslRgb(hue + shift, saturation, mid)) < brightness) low = mid;
      else high = mid;
    }
    return css(hslRgb(hue + shift, saturation, (low + high) / 2));
  };
}

export function makePaletteSampler(canvas, face, background = '#000') {
  const tiny = document.createElement('canvas'); tiny.width = tiny.height = 32;
  const c = tiny.getContext('2d', { willReadFrequently: true });
  return () => {
    c.fillStyle = background; c.fillRect(0, 0, 32, 32);
    c.drawImage(canvas, 0, 0, 32, 32);
    const data = c.getImageData(0, 0, 32, 32).data, palette = [];
    const at = (x, y) => { const i = (clamp(Math.round(y), 0, 31) * 32 + clamp(Math.round(x), 0, 31)) * 4; return [data[i], data[i + 1], data[i + 2]]; };
    for (let i = 0; i < data.length; i += 4) if (data[i + 3] > 240) palette.push([data[i], data[i + 1], data[i + 2]]);
    if (!palette.length) return null;
    const art = canvas.getBoundingClientRect(), text = face.getBoundingClientRect();
    const x0 = (text.left + 20 - art.left) / art.width * 31, x1 = (text.right - 20 - art.left) / art.width * 31;
    const y0 = (text.top + 20 - art.top) / art.height * 31, y1 = (text.bottom - 20 - art.top) / art.height * 31;
    const behind = [];
    for (let i = 0; i < 9; i++) for (let j = 0; j < 5; j++) behind.push(at(x0 + (x1 - x0) * i / 8, y0 + (y1 - y0) * j / 4));
    const font = getComputedStyle(face), size = parseFloat(font.fontSize), weight = Number(font.fontWeight);
    const minimum = size >= 24 || (size >= 18.67 && weight >= 700) ? 3 : 4.5;
    return { ...choosePaletteColor(palette, behind, null, minimum), dominant: dominantColors(palette) };
  };
}

// Sample an authored pixel from the scene canvas, before the separate clock and grain overlays.
export function makeSceneColorSampler(canvas, background = '#000') {
  const pixel = document.createElement('canvas'); pixel.width = pixel.height = 1;
  const context = pixel.getContext('2d', { willReadFrequently: true });
  return (clientX, clientY) => {
    const art = canvas.getBoundingClientRect();
    if (!art.width || !art.height) return null;
    const x = clamp(Math.floor((clientX - art.left) / art.width * canvas.width), 0, canvas.width - 1);
    const y = clamp(Math.floor((clientY - art.top) / art.height * canvas.height), 0, canvas.height - 1);
    context.fillStyle = background; context.fillRect(0, 0, 1, 1);
    context.drawImage(canvas, x, y, 1, 1, 0, 0, 1, 1);
    return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
  };
}
