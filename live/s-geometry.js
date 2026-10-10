// Original, silent geometric compositions. Shapes are constructed locally, not downloaded SVGs.
// Time is absolute and unwrapped: there is no 30-second reset or accumulating scene state.
export const name = 'Geometry';
const TAU = Math.PI * 2;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const smooth = x => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
const ink = (h, s, l) => `hsl(${h} ${s}% ${l}%)`;
const palette = (t, offset = 0) => offset + t * .45 + 14 * Math.sin(t * .012);
const make = (W, H) => ({ W, H, S: Math.min(W, H) });
function circle(c, x, y, r, fill) {
  c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = fill; c.fill();
}
function rounded(c, x, y, w, h, radius, fill) {
  c.beginPath(); c.roundRect(x, y, w, h, radius); c.fillStyle = fill; c.fill();
}
function polygon(c, points, fill) {
  c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
  c.closePath(); c.fillStyle = fill; c.fill();
}
function scene(title, no, dark, render) {
  return { title, no: 'No. ' + no, dark, text: '#f5ead8', audio: false, textless: true, make,
    paint(c, p, t, G) { c.save(); render(c, t, G); c.restore(); } };
}

// A bar lands every 2.8 seconds. Only the camera's downward drift changes speed.
// Integrating the drift analytically keeps spacing deterministic even after a resize or a long pause.
export function stackState(t, { H, S }) {
  const cadence = 2.8, height = S * .07, omega = TAU / 100;
  const amplitude = Math.min(H * .18, .72 * height / (cadence * omega));
  const born = Math.floor(t / cadence), phase = t / cadence - born;
  return { cadence, height, born,
    surface: H * .15 + amplitude * (1 + Math.cos(t * omega)) + phase * height,
    scrollSpeed: height / cadence - amplitude * omega * Math.sin(t * omega) };
}
const endlesslayers = scene('Endless Layers', '01', '#202c37', (c, t, G) => {
  const { W, H, S } = G, hue = palette(t, 20), st = stackState(t, G);
  c.fillStyle = ink(hue + 190, 24, 15); c.fillRect(0, 0, W, H);
  // Quiet pinstripes give the open space above the stack a sense of depth.
  c.strokeStyle = ink(hue + 190, 18, 20); c.lineWidth = S * .001;
  for (let i = 1; i < 9; i++) { c.beginPath(); c.moveTo(W * i / 9, 0); c.lineTo(W * i / 9, H); c.stroke(); }
  const count = Math.ceil(H / st.height) + 4;
  for (let i = count; i >= 0; i--) {
    const birth = st.born - i, age = t - birth * st.cadence;
    const side = birth % 2 === 0 ? -1 : 1, slide = side * (1 - smooth(age / 2.15)) * (W + S * .2);
    const y = st.surface + i * st.height, h = st.height;
    // Steady, alternating arrivals; old bars are already in place below the camera.
    const tones = [83, 68, 75, 57, 88, 71];
    const slot = ((birth % tones.length) + tones.length) % tones.length;
    const color = ink(hue + [0, 12, -14, 4, 22, -6][slot], 42, tones[slot]);
    rounded(c, -S * .04 + slide, y, W + S * .08, h * 1.01, h * .055, color);
    c.fillStyle = ink(hue + 8, 40, Math.min(94, tones[slot] + 9));
    c.fillRect(-S * .04 + slide, y + h * .04, W + S * .08, h * .07);
    c.fillStyle = ink(hue + 4, 35, Math.max(24, tones[slot] - 13));
    c.fillRect(-S * .04 + slide, y + h * .93, W + S * .08, h * .065);
    // A subtle cut at alternating ends gives every incoming layer a visible leading edge.
    const x = side < 0 ? W - S * .035 + slide : S * .012 + slide;
    c.fillStyle = ink(hue + 5, 34, tones[slot] - 8); c.fillRect(x, y + h * .15, S * .006, h * .65);
  }
});

function petal(c, radius) {
  c.beginPath();
  for (let i = 0; i <= 160; i++) {
    const a = i / 160 * TAU, r = radius * (.79 + .21 * Math.cos(a * 4));
    const x = r * Math.cos(a), y = r * Math.sin(a);
    i ? c.lineTo(x, y) : c.moveTo(x, y);
  }
  c.closePath();
}
const petalorbit = scene('Petal Orbit', '02', '#5e2844', (c, t, { W, H, S }) => {
  const hue = palette(t, 340), bg = ink(hue + 28, 40, 91);
  c.fillStyle = bg; c.fillRect(0, 0, W, H);
  // Cropped corner discs echo the medallion without competing with its center.
  circle(c, 0, 0, S * .32, ink(hue + 20, 44, 85));
  circle(c, W, H, S * .4, ink(hue + 20, 44, 85));
  c.translate(W / 2, H / 2); c.rotate(t * .019);
  const light = [31, 72, 86, 50, 78, 91, 39, 72];
  for (let i = 0; i < 8; i++) {
    c.save(); c.rotate(i * .095 + Math.sin(t * .045 - i * .42) * .085);
    const r = S * (.61 - i * .068) * (1 + Math.sin(t * .051 - i * .33) * .022);
    petal(c, r); c.fillStyle = ink(hue + (i % 3) * 13, 43, light[i]); c.fill();
    c.restore();
  }
  circle(c, 0, 0, S * .048, ink(hue + 24, 42, 93));
  for (let i = 0; i < 4; i++) {
    const a = i * TAU / 4 + t * .011;
    circle(c, Math.cos(a) * S * .384, Math.sin(a) * S * .384, S * .009, ink(hue + 20, 44, 88));
  }
});

function arch(c, x, y, r, width, bottom, color) {
  c.beginPath(); c.moveTo(x - r, bottom); c.lineTo(x - r, y);
  c.arc(x, y, r, Math.PI, TAU); c.lineTo(x + r, bottom);
  c.lineTo(x + r - width, bottom); c.lineTo(x + r - width, y);
  c.arc(x, y, r - width, 0, Math.PI, true); c.lineTo(x - r + width, bottom);
  c.closePath(); c.fillStyle = color; c.fill();
}
const archcurrent = scene('Arch Current', '03', '#122e4b', (c, t, { W, H, S }) => {
  const hue = palette(t, 210);
  c.fillStyle = ink(hue, 48, 15); c.fillRect(0, 0, W, H);
  const base = H * .56, bands = [76, 37, 62, 89, 46, 72, 30, 57, 84];
  for (let i = 0; i < 9; i++) {
    const r = S * (.91 - i * .084), band = S * .065;
    const x = W / 2 + Math.sin(t * .043 - i * .17) * S * .038;
    const y = base + Math.sin(t * .032 - i * .21) * S * .046;
    arch(c, x, y, r, band, H + S, ink(hue + (i % 3 === 0 ? -18 : 8), 42, bands[i]));
    arch(c, x, y, r - band * .1, S * .002, H + S, ink(hue - 8, 38, Math.min(96, bands[i] + 9)));
  }
  const a = Math.PI + smooth((Math.sin(t * .027) + 1) / 2) * Math.PI;
  circle(c, W / 2 + Math.cos(a) * S * .16, base + Math.sin(a) * S * .16, S * .026, ink(hue + 160, 58, 78));
});

const quietweave = scene('Quiet Weave', '04', '#173f40', (c, t, { W, H, S }) => {
  const hue = palette(t, 168);
  c.fillStyle = ink(hue + 5, 28, 15); c.fillRect(0, 0, W, H);
  c.translate(W / 2, H / 2); c.rotate(-Math.PI / 4 + Math.sin(t * .025) * .07);
  const spacing = S * .255, width = S * .103, extent = Math.hypot(W, H) * .8;
  const count = Math.ceil(extent / spacing) + 1;
  c.translate(Math.sin(t * .021) * spacing * .36, Math.sin(t * .029 + 1) * spacing * .36);
  const vertical = i => ink(hue + 6 + (i % 2) * 10, 35, i % 2 ? 63 : 77);
  const horizontal = i => ink(hue + 210 + (i % 2) * 10, 44, i % 2 ? 73 : 85);
  for (let col = -count; col <= count; col++) {
    rounded(c, col * spacing - width / 2, -extent, width, extent * 2, width / 2, vertical(col));
    c.fillStyle = ink(hue, 35, 85); c.fillRect(col * spacing - width * .31, -extent, S * .003, extent * 2);
  }
  for (let row = -count; row <= count; row++) {
    rounded(c, -extent, row * spacing - width / 2, extent * 2, width, width / 2, horizontal(row));
    c.fillStyle = ink(hue + 210, 44, 91); c.fillRect(-extent, row * spacing - width * .31, extent * 2, S * .003);
  }
  // Alternate actual over/under crossings rather than merely overlapping translucent bars.
  for (let row = -count; row <= count; row++) for (let col = -count; col <= count; col++) {
    if ((row + col) % 2 !== 0) continue;
    const x = col * spacing - width / 2, y = row * spacing - width * .6;
    c.fillStyle = vertical(col); c.fillRect(x, y, width, width * 1.2);
    c.fillStyle = ink(hue, 35, 85); c.fillRect(col * spacing - width * .31, y, S * .003, width * 1.2);
    c.fillStyle = ink(hue + 4, 32, 42); c.fillRect(x + width * .94, y, width * .06, width * 1.2);
  }
});

const prismtide = scene('Prism Tide', '05', '#163b44', (c, t, { W, H, S }) => {
  const hue = palette(t, 174), bg = ink(hue + 10, 30, 16);
  c.fillStyle = bg; c.fillRect(0, 0, W, H);
  const sx = S * .43, sy = S * .64, rows = Math.ceil(H / sy) + 3, cols = Math.ceil(W / sx) + 3;
  for (let col = -cols; col <= cols; col++) for (let row = -rows; row <= rows; row++) {
    const phase = col * .53 + row * .72;
    const x = W / 2 + col * sx + Math.sin(t * .04 + phase) * S * .025;
    const y = H / 2 + row * sy + (Math.abs(col) % 2) * sy / 2 + Math.cos(t * .034 + phase) * S * .039;
    if (x < -S || x > W + S || y < -S || y > H + S) continue;
    c.save(); c.translate(x, y); c.rotate(Math.sin(t * .024 + phase) * .055);
    const breath = 1 + Math.sin(t * .048 + phase) * .055, a = S * .167 * breath, b = S * .265 * breath;
    const warm = (row + col) % 4 === 0, h = hue + (warm ? 210 : 0);
    polygon(c, [[0, -b], [a, 0], [0, b], [-a, 0]], ink(h, 40, warm ? 75 : 67));
    polygon(c, [[0, -b], [a, 0], [0, b], [0, b * .58], [a * .58, 0], [0, -b * .58]], ink(h + 6, 35, warm ? 61 : 43));
    polygon(c, [[0, -b * .54], [a * .54, 0], [0, b * .54], [-a * .54, 0]], bg);
    polygon(c, [[-a, 0], [0, -b], [0, -b * .94], [-a * .94, 0]], ink(h, 34, 86));
    circle(c, 0, 0, S * .014, ink(h + 10, 40, 77));
    c.restore();
  }
});

const nestedpassage = scene('Nested Passage', '06', '#33234c', (c, t, { W, H, S }) => {
  const hue = palette(t, 266);
  c.fillStyle = ink(hue, 34, 16); c.fillRect(0, 0, W, H);
  c.translate(W / 2 + Math.sin(t * .027) * S * .025, H / 2 + Math.cos(t * .023) * S * .025);
  c.rotate(Math.sin(t * .021) * .1);
  // Rings are born invisibly at the center and leave beyond the corners before recycling.
  // Sort by radius so crossing the phase boundary never changes the visible paint order.
  const rings = Array.from({ length: 14 }, (_, i) => ({ i, phase: ((t / 38 + i / 14) % 1 + 1) % 1 })).sort((a, b) => b.phase - a.phase);
  const tones = [82, 54, 37, 71, 90, 47, 65];
  for (const { i, phase } of rings) {
    const scale = .023 * Math.pow(170, phase), w = W * scale, h = H * scale;
    const radius = Math.min(w, h) * .18, band = .15;
    c.globalAlpha = smooth(phase / .045);
    c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, radius);
    c.roundRect(-w * (1 - band) / 2, -h * (1 - band) / 2, w * (1 - band), h * (1 - band), radius * (1 - band));
    c.fillStyle = ink(hue + (i % 3) * 16, 40, tones[i % tones.length]); c.fill('evenodd');
    c.strokeStyle = ink(hue + 10, 30, Math.min(95, tones[i % tones.length] + 12));
    c.lineWidth = Math.max(S * .0007, Math.min(w, h) * .003);
    c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, radius); c.stroke();
  }
  c.globalAlpha = 1;
});

export const scenes = { endlesslayers, petalorbit, archcurrent, quietweave, prismtide, nestedpassage };
