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
  return { title, no: 'No. ' + no, dark, text: '#f5ead8', audio, textless: true, make,
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

// A unit bloom is cached as a vector path, making repeated scaling inexpensive on mobile Safari.
let bloomPath;
function bloom(c, radius) {
  if (!bloomPath) {
    bloomPath = new Path2D();
    for (let i = 0; i <= 128; i++) {
      const a = i / 128 * TAU, r = .79 + .21 * Math.cos(a * 4);
      const x = r * Math.cos(a), y = r * Math.sin(a);
      i ? bloomPath.lineTo(x, y) : bloomPath.moveTo(x, y);
    }
    bloomPath.closePath();
  }
  c.save(); c.scale(radius, radius); c.fill(bloomPath); c.restore();
}
export function bloomState(t, { W, H, S }) {
  const cadence = 5.8, growth = .066, unit = S * .045;
  const cover = Math.hypot(W, H) / (2 * .58) * 1.12;
  const life = Math.log1p(cover / unit) / growth;
  return { cadence, growth, unit, cover, life, born: Math.floor(t / cadence) };
}
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
    const depth = clamp(Math.log1p(radius / state.unit) / Math.log1p(state.cover / state.unit));
    c.save(); c.rotate(t * .015 + birth * .22 + Math.sin(age * .03) * .08);
    c.fillStyle = ink(hue, 51 - depth * 30); bloom(c, radius); c.restore();
  }
});

const sand = scene('Sand', '03', '#46392c', 'mesa', (c, t, { W, H, S }) => {
  const hue = hueAt(t, 30);
  c.fillStyle = ink(hue, 43); c.fillRect(0, 0, W, H);
  // Broad, flat dune ribbons drift sideways with long, unequal phases.
  for (let i = 0; i < 7; i++) {
    c.beginPath();
    const baseline = H * (.13 + i * .135), drift = t * (.016 + i * .0017);
    for (let j = 0; j <= 64; j++) {
      const x = W * j / 64;
      const y = baseline + Math.sin(x / W * Math.PI * 1.2 + drift + i * .56) * S * .095
        + Math.sin(x / W * Math.PI * 2.1 - t * .012 + i) * S * .027;
      j ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.lineTo(W, H); c.lineTo(0, H); c.closePath();
    c.fillStyle = ink(hue, 40 - i * 3.6); c.fill();
  }
});
export const scenes = { stacks, blooms, sand };
