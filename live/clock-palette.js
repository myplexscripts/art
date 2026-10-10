// Actual scene inks, with a stable light/dark decision based on the art beneath the clock.
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const luminance = rgb => rgb.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
export const contrast = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

export function choosePaletteColor(palette, backgrounds, polarity = null, minimum = 3) {
  const background = median(backgrounds.map(luminance));
  polarity ??= background >= .18 ? 'dark' : 'light';
  const ranked = [...palette].sort((a, b) => luminance(a) - luminance(b));
  const source = polarity === 'dark' ? ranked[0] : ranked[ranked.length - 1];
  let color = [...source], score = contrast(luminance(color), background);
  // Start with an ink already in the scene. Change it only as much as readability needs.
  // Large type needs three-to-one contrast; smaller, light-weight settings need more.
  const end = polarity === 'dark' ? 0 : 255;
  for (let amount = .01; score < minimum && amount <= 1; amount += .01) {
    color = source.map(channel => channel + (end - channel) * amount);
    score = contrast(luminance(color), background);
  }
  return { color: `rgb(${color.map(v => Math.round(v)).join(' ')})`, contrast: score, polarity, source };
}

// A moving layer cannot reverse the clock's colour immediately. Opposite brightness
// must persist for twelve seconds, outside a generous dead band, before changing ink.
export function makeBrightnessAssessment() {
  let polarity = null, filtered = null, previous = null, pending = null, since = 0;
  const assess = (brightness, now) => {
    if (filtered === null) filtered = brightness;
    else filtered += (brightness - filtered) * (1 - Math.exp(-Math.max(0, Math.min(2000, now - previous)) / 3000));
    previous = now;
    if (!polarity) polarity = filtered >= .18 ? 'dark' : 'light';
    const opposite = polarity === 'light' ? filtered > .24 && brightness > .24 : filtered < .12 && brightness < .12;
    if (!opposite) pending = null;
    else if (pending !== polarity) { pending = polarity; since = now; }
    else if (now - since >= 12000) { polarity = polarity === 'light' ? 'dark' : 'light'; pending = null; }
    return polarity;
  };
  assess.reset = () => { polarity = filtered = previous = pending = null; };
  return assess;
}

export function makePaletteSampler(canvas, face) {
  const tiny = document.createElement('canvas'); tiny.width = tiny.height = 32;
  const c = tiny.getContext('2d', { willReadFrequently: true }), assess = makeBrightnessAssessment();
  const sample = (now = performance.now()) => {
    c.drawImage(canvas, 0, 0, 32, 32);
    const data = c.getImageData(0, 0, 32, 32).data, palette = [];
    const at = (x, y) => { const i = (clamp(Math.round(y), 0, 31) * 32 + clamp(Math.round(x), 0, 31)) * 4; return [data[i], data[i + 1], data[i + 2]]; };
    for (let i = 0; i < data.length; i += 4) if (data[i + 3] > 240) palette.push([data[i], data[i + 1], data[i + 2]]);
    if (!palette.length) return '#fff';
    const art = canvas.getBoundingClientRect(), text = face.getBoundingClientRect();
    const x0 = (text.left + 20 - art.left) / art.width * 31, x1 = (text.right - 20 - art.left) / art.width * 31;
    const y0 = (text.top + 20 - art.top) / art.height * 31, y1 = (text.bottom - 20 - art.top) / art.height * 31;
    const behind = [];
    for (let i = 0; i < 9; i++) for (let j = 0; j < 5; j++) behind.push(at(x0 + (x1 - x0) * i / 8, y0 + (y1 - y0) * j / 4));
    const font = getComputedStyle(face), size = parseFloat(font.fontSize), weight = Number(font.fontWeight);
    const minimum = size >= 24 || (size >= 18.67 && weight >= 700) ? 3 : 4.5;
    return choosePaletteColor(palette, behind, assess(median(behind.map(luminance)), now), minimum).color;
  };
  sample.reset = assess.reset;
  return sample;
}
