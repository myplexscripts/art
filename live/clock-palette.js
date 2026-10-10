// Choose an ink once from the art beneath the clock, then keep its brightness fixed.
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const luminance = rgb => rgb.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
export const contrast = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const css = rgb => `rgb(${rgb.map(v => Math.round(v)).join(' ')})`;

export function choosePaletteColor(palette, backgrounds, polarity = null, minimum = 3) {
  const background = median(backgrounds.map(luminance));
  polarity ??= background >= .18 ? 'dark' : 'light';
  const ranked = [...palette].sort((a, b) => luminance(a) - luminance(b));
  const source = polarity === 'dark' ? ranked[0] : ranked[ranked.length - 1];
  let color = source.map(v => Math.round(v)), score = contrast(luminance(color), background);
  // Start with an ink already in the scene. Change it only as much as readability needs.
  // Large type needs three-to-one contrast; smaller, light-weight settings need more.
  const end = polarity === 'dark' ? 0 : 255;
  for (let step = 1; score < minimum && step <= 100; step++) {
    color = source.map(channel => Math.round(channel + (end - channel) * step / 100));
    score = contrast(luminance(color), background);
  }
  return { color: css(color), rgb: color, contrast: score, polarity, source };
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

export function makePaletteSampler(canvas, face) {
  const tiny = document.createElement('canvas'); tiny.width = tiny.height = 32;
  const c = tiny.getContext('2d', { willReadFrequently: true });
  return () => {
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
    return choosePaletteColor(palette, behind, null, minimum);
  };
}
