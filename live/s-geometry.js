// Three flat, bedside-friendly scenes. Every shade shares one continuously cycling hue.
// Seeded smooth noise gives motion an irregular pace without frame-dependent randomness.
export const name = 'Geometry';
const TAU = Math.PI * 2;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const hash = (n, seed) => { const x = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453; return x - Math.floor(x); };
const ink = (h, l) => `hsl(${h} 36% ${l}%)`;
const hueAt = (t, start) => start + t * .32;
const make = (W, H) => ({ W, H, S: Math.min(W, H) });
function noise(t, seed) {
  const n = Math.floor(t), u = t - n, a = hash(n, seed), b = hash(n + 1, seed);
  return { value: a + (b - a) * smooth(u), derivative: (b - a) * 6 * u * (1 - u) };
}
// The integral of a smoothly changing random rate. Prefixes are cached once, not accumulated per frame.
function randomClock(min, max, seconds, seed) {
  const prefix = [0], rate = n => min + (max - min) * hash(n, seed);
  return t => {
    t = Math.max(0, t);
    const n = Math.floor(t / seconds), u = t / seconds - n;
    while (prefix.length <= n) {
      const i = prefix.length - 1;
      prefix.push(prefix[i] + seconds * (rate(i) + rate(i + 1)) / 2);
    }
    const a = rate(n), b = rate(n + 1);
    return { phase: prefix[n] + seconds * (a * u + (b - a) * (u ** 3 - .5 * u ** 4)), rate: a + (b - a) * smooth(u) };
  };
}
const arrivalClock = randomClock(.10, .27, 19, 7);
const cameraClock = randomClock(.009, .028, 31, 23);
export function stackState(t, { H, S }) {
  const arrival = arrivalClock(t), camera = cameraClock(t), drift = noise(camera.phase, 47);
  const height = S * .35, range = Math.min(H * .34, height * 1.5);
  const born = Math.floor(arrival.phase), phase = arrival.phase - born;
  return { height, born, phase, arrivalRate: arrival.rate, cameraRate: camera.rate,
    surface: H * .08 + range * drift.value + phase * height,
    scrollSpeed: range * drift.derivative * camera.rate + height * arrival.rate };
}
function scene(title, no, dark, audio, render) {
  return { title, no: 'No. ' + no, dark, text: '#f5ead8', audio, textless: true, grain: true, make,
    paint(c, p, t, G) { c.save(); render(c, t, G); c.restore(); } };
}
const stacks = scene('Stacks', '01', '#1d2939', 'openblue', (c, t, G) => {
  const { W, H } = G, hue = hueAt(t, 218), state = stackState(t, G);
  c.fillStyle = ink(hue, 16); c.fillRect(0, 0, W, H);
  // Each rectangle is a single flat fill: no bevels, borders, shadows or end marks.
  for (let i = Math.ceil(H / state.height) + 2; i >= 0; i--) {
    const birth = state.born - i, side = birth % 2 === 0 ? -1 : 1;
    const slide = i === 0 ? side * (1 - smooth(state.phase / .82)) * W : 0;
    const y = state.surface + i * state.height;
    const depth = clamp((y + state.height / 2 - H * .08) / (H * .92));
    c.fillStyle = ink(hue, 51 - depth * 30);
    c.fillRect(slide, y, W, state.height + 1);
  }
});

// Each flower keeps the shape and shade it was born with as it expands across the canvas.
// Cached unit paths make repeated scaling inexpensive on mobile Safari.
const bloomShapes = [
  { lobes: 4, base: .79, petal: .21 },
  { lobes: 6, base: .84, petal: .16 },
  { lobes: 3, base: .80, petal: .20 },
  { lobes: 5, base: .82, petal: .18 },
];
const bloomPaths = [];
const bloomShades = [22, 57, 31, 66, 42];
const mod = (n, length) => (n % length + length) % length;
function bloom(c, radius, shape) {
  if (!bloomPaths[shape]) {
    const path = new Path2D(), { lobes, base, petal } = bloomShapes[shape];
    for (let i = 0; i <= 128; i++) {
      const a = i / 128 * TAU, r = base + petal * Math.cos(a * lobes);
      const x = r * Math.cos(a), y = r * Math.sin(a);
      i ? path.lineTo(x, y) : path.moveTo(x, y);
    }
    path.closePath(); bloomPaths[shape] = path;
  }
  c.save(); c.scale(radius, radius); c.fill(bloomPaths[shape]); c.restore();
}
export function bloomState(t, { W, H, S }) {
  const cadence = 5.8, growth = .066, unit = S * .045;
  const cover = Math.hypot(W, H) / (2 * .58) * 1.12;
  const life = Math.log1p(cover / unit) / growth;
  // About three minutes per shape, and longer on extreme aspect ratios if needed.
  // Even the last bloom can fill the viewport before the following shape takes over.
  const shapeBirths = Math.max(32, Math.ceil(life / cadence) + 2);
  return { cadence, growth, unit, cover, life, shapeBirths, born: Math.floor(t / cadence) };
}
export const bloomShape = (birth, state) => mod(Math.floor(birth / state.shapeBirths), bloomShapes.length);
const blooms = scene('Blooms', '02', '#482c43', 'lavender', (c, t, G) => {
  const { W, H } = G, hue = hueAt(t, 334), state = bloomState(t, G);
  c.fillStyle = ink(hue, 18); c.fillRect(0, 0, W, H);
  c.translate(W / 2, H / 2);
  const count = Math.ceil(state.life / state.cadence) + 1;
  // Old blooms cover the corners before leaving; a new bloom starts at exactly zero radius.
  for (let i = count; i >= 0; i--) {
    const birth = state.born - i, age = t - birth * state.cadence;
    const radius = state.unit * Math.expm1(age * state.growth);
    if (radius <= 0) continue;
    c.save(); c.rotate(t * .015 + birth * .22 + Math.sin(age * .03) * .08);
    c.fillStyle = ink(hue, bloomShades[mod(birth, bloomShades.length)]);
    bloom(c, radius, bloomShape(birth, state)); c.restore();
  }
});

const deepwaves = scene('Deep Waves', '03', '#183340', 'openblue', (c, t, { W, H, S }) => {
  const hue = hueAt(t, 205), bands = 10;
  c.fillStyle = ink(hue, 17); c.fillRect(0, 0, W, H);
  // Travelling swells and smaller, opposing ripples deform each flat water ribbon.
  // Neighbouring lines share the main swell so the surface moves as a body of water.
  for (let i = 0; i < bands; i++) {
    const baseline = H * (.07 + i * .105), phase = i * .38;
    const crest = x => baseline
      + Math.sin(x / W * TAU * 1.25 - t * .18 + phase) * S * .052
      + Math.sin(x / W * TAU * 2.4 + t * .12 + phase * 1.6) * S * .019
      + Math.sin(t * .065 + i * .55) * S * .012;
    c.beginPath();
    for (let j = 0; j <= 96; j++) {
      const x = W * j / 96, y = crest(x);
      j ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.lineTo(W, H); c.lineTo(0, H); c.closePath();
    c.fillStyle = ink(hue, (i % 2 === 0 ? 32 : 24) + i * .9); c.fill();
    c.beginPath();
    for (let j = 0; j <= 96; j++) {
      const x = W * j / 96, y = crest(x);
      j ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.strokeStyle = ink(hue, 49 + i * .7); c.lineWidth = Math.max(1, S * .0025); c.stroke();
  }
});
export const scenes = { stacks, blooms, deepwaves };
