// The poster: a framed picture with a title, fitted to any screen shape. Each scene module supplies
// make(W, H) (its geometry for a W x H window), paint(ctx, p, t, G), and its title, number, text ink and dark frame ink.
import * as nocturne from './s-nocturne.js?v=20261011-focus';
import * as weather from './s-weather.js?v=20261011-focus';
import * as windows from './s-window.js?v=20261011-focus';
import * as daybreak from './s-daybreak.js?v=20261011-focus';
import * as deep from './s-deep.js?v=20261011-focus';
import * as orbit from './s-orbit.js?v=20261011-focus';
import * as music from './s-music.js?v=20261011-focus';
import * as geometry from './s-geometry.js?v=20261011-focus';
import { C, M, FONT } from './kit.js?v=20261011-focus';
import { scalePosterText } from './typography.js?v=20261011-focus';

// Each series lists its own scenes; a series with none yet is left out.
export const SERIES = [nocturne, weather, windows, daybreak, deep, orbit, music, geometry].filter((s) => Object.keys(s.scenes).length);
export const SCENES = Object.assign({}, ...SERIES.map((s) => s.scenes));
export const seriesLine = (scene) => `${LABEL.get(scene)}  ·  ${scene.no}`;   // "NOCTURNE SERIES  ·  No. 03", as printed under a title
const LABEL = new Map(SERIES.flatMap((s) => Object.values(s.scenes).map((scene) => [scene, s.name.toUpperCase()])));

// How the title is set. Narrow posters stack it under the picture; wide ones run it along the bottom.
// brand: false leaves the Scenes wordmark off, for posters shown small on a page that already carries it.
const width = (aspect) => Math.max(1200, 1080 * aspect);
export const styleFor = (aspect, brand = true) => ({ stacked: width(aspect) < 1500, brand });

// Where everything in the title band goes for one style, measured from the poster's edges. Each piece of lettering has an
// anchor x, a baseline y, a size, and ax: how far along its own width the anchor sits (0 left, 0.5 centre, 1 right).
// Written this way, two styles can be blended piece by piece, which is what lets the title glide when a poster changes shape.
function titleSpec({ stacked, brand }, VW, VH) {
  const b = VH - M, cx = VW / 2;
  if (!stacked) return { band: 120, mark: { x: M + 6, y: VH - 52, size: 104, ax: 0, a: 1 }, title: { x: VW - M - 6, y: VH - 82, size: 44, ax: 1 }, series: { x: VW - M - 6, y: VH - 46, size: 26, ax: 1 }, rule: { x: M + 300, y: VH - 96, w: VW - 2 * M - 760, a: 1 } };
  if (brand) return { band: 250, mark: { x: cx, y: b - 126, size: 124, ax: 0.5, a: 1 }, title: { x: cx, y: b - 38, size: 50, ax: 0.5 }, series: { x: cx, y: b + 4, size: 28, ax: 0.5 }, rule: { x: VW * 0.2, y: b - 102, w: VW * 0.6, a: 1 } };
  return { band: 130, mark: { x: cx, y: b - 100, size: 60, ax: 0.5, a: 0 }, title: { x: cx, y: b - 40, size: 50, ax: 0.5 }, series: { x: cx, y: b + 2, size: 28, ax: 0.5 }, rule: { x: VW * 0.35, y: b - 96, w: VW * 0.3, a: 0 } };
}
// A piece that is invisible in one style (the wordmark and rule on a page poster) takes its place from the other style
// and only fades, late, so it appears where it is going to sit instead of sliding across the title.
function blend(A, B, e) {
  if (A.a === 0 && B.a) return { ...B, a: B.a * e * e };
  if (B.a === 0 && A.a) return { ...A, a: A.a * (1 - e) * (1 - e) };
  const o = {};
  for (const key in A) o[key] = typeof A[key] === 'object' ? blend(A[key], B[key], e) : A[key] + (B[key] - A[key]) * e;
  return o;
}

// The poster is about 1080 design units on its short side, and as long as the screen needs on the other.
// dark: true prints the frame in the scene's darkest ink with cream lettering, and a thin cream line round the picture.
// It may also be a number from 0 to 1, for a frame part-way through changing from light to dark.
// mix: { from, to, e } sets the title part-way (e, 0 to 1) between two styles, for a poster in flight between two shapes.
// A layout may carry fade: { rule, text }, 0 to 1, set by the player while its controls are printed in the title band:
// the orange rule draws in to its middle and is gone, and on a narrow poster all the lettering fades with it.
// frame: 1 is the full poster; 0 is the picture alone, edge to edge, with no margin or title; between, the frame is part-way gone.
export function makeLayout(aspect, scene, { brand = true, dark = false, mix = null, frame = 1, cssWidth } = {}) {
  // Text-free artwork always fills its canvas, including gallery cards and frame transitions.
  if (scene.textless) frame = 0;
  const VW = width(aspect), VH = VW / aspect, m = M * frame;
  const base = mix ? blend(titleSpec(mix.from, VW, VH), titleSpec(mix.to, VW, VH), mix.e) : titleSpec(styleFor(aspect, brand), VW, VH);
  const spec = scalePosterText(base, { VW, VH, cssWidth, margin: M });
  return { VW, VH, spec, scene, dark: +dark, m, frame, G: scene.make(VW - 2 * m, VH - 2 * m - spec.band * frame) };
}

// p is time in 30 s units, never wrapped; t is the same clock in seconds.
export function draw(ctx, p, L, t = 0) {
  const { VW, VH, G, scene, spec, m, frame } = L, { W, H } = G;
  ctx.save();
  ctx.beginPath(); ctx.rect(m, m, W, H); ctx.clip();
  ctx.translate(m, m);
  scene.paint(ctx, p, t, G);
  ctx.restore();
  if (frame <= 0.001) return;

  // d is how dark the frame is. Part-way, the dark printing is laid over the light one at that strength.
  const d = L.dark;
  ctx.beginPath(); ctx.rect(0, 0, VW, VH); ctx.rect(m, m, W, H);
  if (d < 1) { ctx.fillStyle = C.cream; ctx.fill('evenodd'); }
  if (d > 0) { ctx.globalAlpha = d; ctx.fillStyle = scene.dark; ctx.fill('evenodd'); ctx.globalAlpha = d * frame; ctx.strokeStyle = C.cream; ctx.lineWidth = 3; ctx.strokeRect(m - 1.5, m - 1.5, W + 3, H + 3); ctx.globalAlpha = 1; }
  ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  const put = (text, s, fill, a) => { if (a <= 0.01) return; ctx.globalAlpha = a; ctx.font = `bold ${s.size}px ${FONT}`; ctx.fillStyle = fill; ctx.fillText(text, s.x - s.ax * ctx.measureText(text).width, s.y); ctx.globalAlpha = 1; };
  const set = (text, s, [light, dark], a = 1) => { a *= frame * frame; if (d < 1) put(text, s, light, a); if (d > 0) put(text, s, dark, a * d); };
  const ink = [scene.text, C.cream], small = [C.rust, C.gold], keep = 1 - (L.fade?.text ?? 0), shut = L.fade?.rule ?? 0, ruleA = shut > 0.995 ? 0 : spec.rule.a;
  set('SCENES', spec.mark, ink, spec.mark.a * keep);
  if (ruleA * frame > 0.01) { ctx.globalAlpha = ruleA * frame * frame; ctx.fillStyle = C.orange; ctx.fillRect(spec.rule.x + (spec.rule.w * shut) / 2, spec.rule.y, spec.rule.w * (1 - shut), 6); ctx.globalAlpha = 1; }
  set(scene.title, spec.title, ink, keep);
  set(seriesLine(scene), spec.series, small, keep);
}
