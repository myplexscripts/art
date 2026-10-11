// Local viewer: edge-to-edge artwork, safe-area controls, and a persistent optional clock.
// A full-screen poster is drawn live every frame and recomposed to the screen's shape, with its controls
// and sound. The main page opens it over itself, growing out of the poster that was tapped, or at once for a scene's own address.
// For checking: ?debug shows a readout, ?res=3840 forces the long side, ?t=40 starts the clock 40 s in.
import './nozoom.js?v=20261011-clock';
import { draw, makeLayout, styleFor, SCENES } from './poster.js?v=20261011-clock';
import { hex, makeClockColor, makePaletteSampler, makeSceneColorSampler } from './clock-palette.js?v=20261011-clock';
import { makeClockDigits, CLOCK_LINE_HEIGHT } from './clock-digits.js?v=20261011-clock';
import { depthLayersFor, makeDepthRenderer } from './clock-depth.js?v=20261011-clock';
import { COLOR_CSS, makeColorPicker } from './clock-color-picker.js?v=20261011-clock';
import { fontReady, MIN_FONT_SIZE, TEXT_SCALE } from './typography.js?v=20261011-clock';
import { lockPage } from './scroll-lock.js?v=20261011-clock';

const LOOP = 30, MAXPX = 3840, CREAM = '#f2e5c3', FLIGHT = 650, CLOCK_FADE = 180;
const MAX_CLOCK_SCALE = 8, CLOCK_BLEED = .03;
// Keep authored depth and saved choices intact while the feature is unavailable in the app.
const DEPTH_ENABLED = false;
const FACE = 'var(--face, "Barlow Condensed", system-ui, sans-serif)';
const colorSetting = saved => {
  if (saved && ['white', 'adaptive'].includes(saved.mode)) return { mode: saved.mode };
  if (saved && ['poster', 'custom'].includes(saved.mode) && Array.isArray(saved.rgb) && saved.rgb.length === 3 && saved.rgb.every(v => Number.isFinite(v) && v >= 0 && v <= 255)) return { mode: saved.mode, rgb: saved.rgb.map(Math.round) };
  return null;
};
let clockId = 0;
const CSS = `
  .wz-player { position: fixed; inset: 0; z-index: 10; overflow: hidden; -webkit-user-select: none; user-select: none; --wz-safe-left: env(safe-area-inset-left, 0px); --wz-safe-right: env(safe-area-inset-right, 0px); --wz-safe-bottom: env(safe-area-inset-bottom, 0px); }
  /* Artwork covers every edge, including the notch and home indicator. Only controls are inset. */
  .wz-player canvas, .wz-grain { position: absolute; inset: 0; width: 100%; height: 100%; display: block; touch-action: none; }
  .wz-foreground { pointer-events: none; z-index: 2; }
  .wz-foreground[hidden], .wz-ui[hidden] { display: none; }
  .wz-grain { pointer-events: none; z-index: 3; }
  /* A browser colour picker's screen eyedropper must see the untextured inks. */
  .wz-player.native-color .wz-grain { visibility: hidden; }
  .wz-player.picking-scene-color { cursor: crosshair; }
  .wz-player.picking-scene-color .wz-clock-face { pointer-events: none; }
  .wz-clock { position: absolute; inset: 0; display: grid; place-items: center; z-index: 1; pointer-events: none; margin: 0; color: #fff; opacity: 0; transition: opacity ${CLOCK_FADE}ms ease; font: 800 clamp(48px, 16.8vmin, 216px)/1 ${FACE}; letter-spacing: -.04em; white-space: nowrap; text-shadow: none; }
  .wz-clock.visible { opacity: 1; }
  .wz-clock:not(.visible) .wz-clock-face { pointer-events: none; }
  .wz-clock-face { position: absolute; left: 50%; top: 50%; width: max-content; transform: translate(-50%, -50%); pointer-events: auto; touch-action: none; -webkit-touch-callout: none; padding: 20px; cursor: ew-resize; display: inline-block; font-kerning: none; letter-spacing: 0; opacity: 1; }
  .wz-clock-run { display: flex; width: max-content; direction: ltr; }
  .wz-clock-slot { position: relative; display: block; flex: none; height: ${CLOCK_LINE_HEIGHT}em; overflow: hidden; }
  .wz-clock-glyph { position: absolute; inset: 0; display: grid; place-items: center; white-space: pre; }
  .wz-clock-face.dragging { cursor: grabbing; }
  .wz-clock-face:focus-visible { outline: 1px solid currentColor; outline-offset: -10px; border-radius: 12px; }
  .wz-clock[hidden] { display: none; }
  /* The bottom controls slide over the artwork and never reserve space in its canvas. */
  .wz-ui { position: absolute; bottom: 0; z-index: 4; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; gap: 2px; color: var(--ink); transition: color .7s, transform .38s cubic-bezier(.2, .7, .2, 1) 0s; }
  .wz-ui.off, .wz-ui.swap { pointer-events: none; }
  /* The strip and its controls slide out of sight to reveal the artwork underneath. */
  .wz-ui[data-mode=strip].off, .wz-ui[data-mode=strip].swap { transform: translateY(101%); transition-delay: .1s; }
  .wz-it { transition: opacity .3s ease calc(var(--i) * 45ms + 110ms), transform .45s cubic-bezier(.2, .8, .2, 1) calc(var(--i) * 45ms + 110ms); }
  .wz-ui.off .wz-it, .wz-ui.swap .wz-it { opacity: 0; transform: translateY(12px); transition-duration: .18s; transition-delay: calc((5 - var(--i)) * 22ms); }
  .wz-ui input[type=range] { clip-path: inset(0 0 0 0); transition: opacity .25s, clip-path .55s cubic-bezier(.3, .7, .2, 1) calc(var(--i) * 45ms + 240ms); }
  .wz-ui.off input[type=range], .wz-ui.swap input[type=range] { clip-path: inset(0 100% 0 0); transition-delay: 0s; transition-duration: .2s; }
  @media (prefers-reduced-motion: reduce) { .wz-clock { transition: none; } .wz-ui, .wz-ui .wz-it, .wz-ui input[type=range] { transition-duration: .01s !important; transition-delay: 0s !important; } }
  .wz-ui[data-mode=strip] { background: var(--paper); border-top: 2px solid ${CREAM}; padding: 8px max(16px, var(--wz-safe-right)) calc(8px + var(--wz-safe-bottom)) max(16px, var(--wz-safe-left)); }
  .wz-row { display: flex; align-items: center; justify-content: center; gap: 6px 22px; }
  .wz-ui:not(.two) { flex-direction: row; align-items: center; gap: 22px; }
  .wz-ui:not(.two) .wz-row { display: contents; }
  .wz-ui:not(.two) .wz-clock-toggle { order: 3; } .wz-ui:not(.two) .wz-color-toggle { order: 4; } .wz-ui:not(.two) .wz-full { order: 5; } .wz-ui:not(.two) label { order: 2; }
  .wz-ui.two .wz-r1 { justify-content: space-between; gap: 10px; } .wz-ui.two .wz-r2 { gap: 14px; } .wz-ui.two label { flex: 1 1 0; }
  .wz-ui.tight { gap: 14px; } .wz-ui.tight .wz-word { display: none; }
  .wz-ui a, .wz-ui button { font: 600 16px/1 ${FACE}; letter-spacing: .06em; text-transform: uppercase; color: inherit; background: none; border: 0; padding: 11px 0 9px; border-bottom: 3px solid transparent; text-decoration: none; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 7px; }
  .wz-ui a:hover, .wz-ui button:not(:disabled):hover, .wz-ui a:focus-visible, .wz-ui button:focus-visible { border-bottom-color: #dd7f45; outline: none; }
  .wz-ui em { font-style: normal; color: var(--sub); }
  .wz-ui .wz-color-toggle { min-width: 40px; min-height: 44px; justify-content: center; }
  .wz-color-dot { display: block; width: 14px; height: 14px; border: 1px solid #f2e5c388; border-radius: 50%; flex: none; }
  .wz-ui svg { width: 17px; height: 17px; display: block; fill: none; stroke: currentColor; stroke-width: 2.4; }
  .wz-ui svg.wz-arrow { width: 21px; height: 12px; fill: currentColor; stroke: none; margin-top: -1px; transition: transform .2s; }
  .wz-ui a:hover .wz-arrow { transform: translateX(-3px); }
  .wz-ui label { display: flex; align-items: center; gap: 9px; min-width: 0; }
  .wz-ui input[type=range] { color: inherit; -webkit-appearance: none; appearance: none; background: none; margin: 0; height: 30px; flex: 0 1 120px; width: 120px; min-width: 36px; cursor: pointer; }
  .wz-ui.two input[type=range] { flex-grow: 1; }
  .wz-ui.tight input[type=range] { flex-basis: 80px; }
  .wz-ui input[type=range]::-webkit-slider-runnable-track { height: 3px; background: linear-gradient(to right, #dd7f45 var(--v, 70%), color-mix(in srgb, currentColor 28%, transparent) var(--v, 70%)); }
  .wz-ui input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 13px; height: 13px; margin-top: -5px; border-radius: 50%; background: currentColor; }
  .wz-ui input[type=range]::-moz-range-track { height: 3px; background: color-mix(in srgb, currentColor 28%, transparent); }
  .wz-ui input[type=range]::-moz-range-progress { height: 3px; background: #dd7f45; }
  .wz-ui input[type=range]::-moz-range-thumb { width: 13px; height: 13px; border: 0; border-radius: 50%; background: currentColor; }
  .wz-ui [hidden], .wz-ui .wz-row[hidden], .wz-grain[hidden] { display: none; }
  .wz-ui label button { transition: opacity .25s; }
  .wz-ui button.wz-trk { width: 24px; height: 24px; padding: 1px 0 0; justify-content: center; border: 2px solid currentColor; border-radius: 50%; letter-spacing: 0; font-size: 16px; flex: none; }
  .wz-ui button.wz-trk:not(:disabled):hover, .wz-ui button.wz-trk:focus-visible { border-color: #dd7f45; }
  .wz-ui label.muted input, .wz-ui label.muted .wz-trk { opacity: .35; }
  .wz-ui label.muted .wz-trk { cursor: default; }
  .wz-ui label.muted .wz-mute { opacity: .5; text-decoration: line-through; }
  .wz-hud { position: absolute; left: 10px; top: 8px; font: 16px ${FACE}; color: #0e1c3a; background: rgba(242, 229, 195, .85); padding: 3px 7px; border-radius: 4px; white-space: pre-wrap; max-width: 92%; z-index: 4; pointer-events: none; }
` + COLOR_CSS;
const HTML = `<canvas class="wz-scene"></canvas><canvas class="wz-foreground" hidden aria-hidden="true"></canvas><div class="wz-grain"></div><time class="wz-clock" hidden><span class="wz-clock-face" role="button" tabindex="0" aria-pressed="false" title="Tap for white or your chosen colour. More colours in the toolbar. Hold to move. Triple tap to center. Pinch to resize. Swipe for weight. Keyboard: Enter for colour; Home to center; + / − for size; left / right arrows for weight."></span></time>
  <nav class="wz-ui off" aria-label="Scene controls"><div class="wz-row wz-r1"><a class="wz-home wz-it" style="--i:0" href="./" aria-label="Back to all scenes"><svg class="wz-arrow" viewBox="0 0 24 14"><path d="M0 7 9 0v4.6h15v4.8H9V14z"/></svg><span class="wz-word">Scenes</span></a><button class="wz-clock-toggle wz-it" style="--i:3" aria-pressed="false">Clock<em class="wz-word">off</em></button><button class="wz-color-toggle wz-it" style="--i:4" aria-label="Choose clock colour" title="Choose clock colour"><span class="wz-color-dot" aria-hidden="true"></span><span class="wz-word">Colour</span></button><button class="wz-full wz-it" style="--i:5" aria-label="Fullscreen" title="Fullscreen"><svg viewBox="0 0 20 20"><path d="M2 7V2h5M13 2h5v5M18 13v5h-5M7 18H2v-5"/></svg></button></div>
  <div class="wz-row wz-r2"><label class="wz-it" style="--i:1"><button class="wz-mute" data-bus="amb" title="Mute or unmute">Ambience</button><input class="wz-amb" type="range" min="0" max="1" step="0.01" aria-label="Ambience volume"></label><label class="wz-it" style="--i:2"><button class="wz-mute" data-bus="mus" title="Mute or unmute">Music</button><input class="wz-mus" type="range" min="0" max="1" step="0.01" aria-label="Music volume"><button class="wz-trk" title="Next track">A</button></label></div></nav><div class="wz-hud" hidden></div>`;
const title = (scene) => 'Scenes: ' + scene.title.toLowerCase().replace(/\b[a-z]+/g, (w, i) => (i && ['at', 'of', 'the', 'in'].includes(w) ? w : w[0].toUpperCase() + w.slice(1)));
// Print grain: one small tile of noise, made once and repeated over the scene, so it costs nothing per frame or per size.
let TILE;
const tile = () => TILE ??= (() => {
  const n = 512, c = Object.assign(document.createElement('canvas'), { width: n, height: n }), g = c.getContext('2d'), im = g.createImageData(n, n), px = new Uint32Array(im.data.buffer);
  for (let i = 0; i < px.length; i++) { const v = (Math.random() + Math.random() + Math.random()) / 3 - 0.5; px[i] = ((Math.min(255, Math.abs(v) * 0.72 * 255) | 0) << 24) | (v > 0 ? 0xffffff : 0); }
  g.putImageData(im, 0, 0); return c.toDataURL();
})();
const ease = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

// from: the on-screen rectangle to grow out of (none: appear full screen at once). home: called for the back arrow
// instead of following its link, when the page that opened the player is still underneath. at: the scene's clock, in
// seconds, at the moment of opening, so a poster already moving on the page carries on without a jump.
export function openScene(first, { from = null, home = null, at = null, thumbnailFrame = 1 } = {}) {
  if (!document.getElementById('wz-css')) document.head.append(Object.assign(document.createElement('style'), { id: 'wz-css', textContent: CSS }));
  const q = new URLSearchParams(location.search), force = +q.get('res') || 0, skip = at === null ? +q.get('t') || 0 : at - performance.now() / 1000, debug = q.has('debug');
  const root = Object.assign(document.createElement('div'), { className: 'wz-player', innerHTML: HTML }), $ = (c) => root.querySelector('.' + c);
  const scene = $('wz-scene'), grain = $('wz-grain'), ui = $('wz-ui'), hud = $('wz-hud'), ctx = scene.getContext('2d');
  const foreground = $('wz-foreground'), renderDepth = makeDepthRenderer(ctx, foreground.getContext('2d'), SCENES[first].dark);
  const depthOptions = depthLayersFor(first), depthKey = 'wavz-clock-depth-' + first;
  const savedDepth = localStorage.getItem(depthKey);
  const depthSelection = depthOptions.some(o => o.id === savedDepth) ? savedDepth : 'front';
  const before = { title: document.title, bg: document.body.style.background, htmlBg: document.documentElement.style.background };
  const textless = SCENES[first].textless === true;
  let name = first, L, k = 1, flight = null, closed = false, closing = false, closeTimer = 0, clockSettled = false, sound = null, on = false;
  document.body.append(root);
  const unlock = lockPage();   // the scene takes the scrollbar's room too

  // ---- layout: the canvas takes the player's size; the poster is composed for that shape
  let frame1 = null;
  let mix = null;   // set during a flight: the title is part-way between the page poster's style and the full-screen one
  // The gallery frame shrinks away during opening; playback always fills the viewport.
  const cur = { f: 0, d: 1 };
  // In flight the canvas keeps the full screen's worth of pixels the whole way and the poster is drawn into the part of
  // it that shows, so nothing is allocated from frame to frame; the player's own box clips the rest.
  function fit(final = true) {
    const r = root.getBoundingClientRect(); let fw = final ? r.width : innerWidth, fh = final ? r.height : innerHeight;
    const long = Math.max(fw, fh);
    if (!long || !r.width) return;
    const s = (force || Math.min(MAXPX, long * devicePixelRatio)) / long, bw = Math.round(fw * s), bh = Math.round(fh * s);
    if (bw !== scene.width || bh !== scene.height) { scene.width = bw; scene.height = bh; }
    if (DEPTH_ENABLED && (bw !== foreground.width || bh !== foreground.height)) { foreground.width = bw; foreground.height = bh; }
    scene.style.width = final ? '' : fw + 'px'; scene.style.height = final ? '' : fh + 'px';
    foreground.style.width = scene.style.width; foreground.style.height = scene.style.height;
    const w = final ? bw : r.width * s, h = final ? bh : r.height * s, st = final || !mix ? cur : mix;
    L = makeLayout(w / h, SCENES[name], { dark: st.d, frame: st.f, mix: final ? null : mix, cssWidth: r.width }); k = w / L.VW;
    if (final) { dock(r.width); fitClock(); }
  }
  // Controls overlay the art and alone respect the notch and home indicator.
  function dock(w) {
    ui.dataset.mode = 'strip';
    Object.assign(ui.style, { left: '0', width: '100%', height: '' });
    const css = getComputedStyle(ui), room = w - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight);
    ui.classList.toggle('two', room < 820); ui.classList.toggle('tight', room < 320 || room >= 820 && room < 940);
  }
  grain.style.backgroundImage = `url(${tile()})`; grain.style.backgroundSize = 512 / devicePixelRatio + 'px';
  grain.hidden = textless && SCENES[first].grain !== true;
  let pending;
  const refit = () => { if (!flight && !closed) fitClock(); clearTimeout(pending); pending = setTimeout(() => { if (!flight && !closed) fit(); }, 120); };
  const listen = [[window, 'resize'], [window, 'orientationchange'], [screen.orientation, 'change'], [window.visualViewport, 'resize'], [document, 'fullscreenchange'], [document, 'webkitfullscreenchange']].filter(([t]) => t);
  for (const [t, type] of listen) t.addEventListener(type, refit);

  function paint() {
    const c = SCENES[name].dark;
    document.documentElement.style.background = document.body.style.background = c;
    root.style.setProperty('--ink', CREAM); root.style.setProperty('--sub', '#f0bd4d'); root.style.setProperty('--paper', c);
  }

  // ---- clock: local time, off by default, remembered across posters and sessions.
  const clock = $('wz-clock'), clockFace = $('wz-clock-face'), clockToggle = $('wz-clock-toggle');
  clock.id = 'wz-clock-' + ++clockId; clockToggle.setAttribute('aria-controls', clock.id);
  const clockFormat = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
  const clockDigits = makeClockDigits(clockFace, clockFormat);
  let clockOn = localStorage.getItem('wavz-clock') === '1', clockTimer = 0;
  const colorKey = 'wavz-clock-ink-' + name;
  let clockColor = { mode: localStorage.getItem('wavz-clock-color') === 'palette' ? 'adaptive' : 'white' };
  let colouredChoice = { mode: 'adaptive' };
  try {
    const saved = JSON.parse(localStorage.getItem(colorKey));
    clockColor = colorSetting(saved) ?? clockColor;
    colouredChoice = colorSetting(saved?.choice) ?? colouredChoice;
    if (colouredChoice.mode === 'white') colouredChoice = { mode: 'adaptive' };
  } catch {}
  if (clockColor.mode !== 'white') colouredChoice = clockColor;
  let clockInk = null, clockFontsReady = false, paletteAt = -Infinity, colorPicker = null;
  const clockHue = SCENES[name].clockHue;
  const samplePalette = makePaletteSampler(scene, clockFace, SCENES[name].dark);
  function syncClockChoice() {
    clockFace.setAttribute('aria-pressed', String(clockColor.mode !== 'white'));
    if (clockColor.mode === 'white') clockFace.style.color = '#fff';
    else if (clockColor.rgb) clockFace.style.color = hex(clockColor.rgb);
    colorPicker?.sync(clockColor);
  }
  function updateClockColor(now, t) {
    if (clockColor.mode !== 'adaptive' || !clockOn || !clockFontsReady || !L || flight || closing || positionAnimation || gesture?.drag) return;
    if (!clockInk) {
      // Read only a freshly drawn, settled poster at the clock's final placement.
      const chosen = samplePalette();
      if (!chosen) return;
      clockInk = makeClockColor(chosen.rgb, clockHue?.(t) ?? null);
    } else if (!clockHue || now - paletteAt < 100) return;
    paletteAt = now; clockFace.style.color = clockInk(clockHue?.(t));
  }
  function selectClockColor(value) {
    clockColor = value; clockInk = null; paletteAt = -Infinity;
    if (value.mode !== 'white') colouredChoice = value;
    localStorage.setItem(colorKey, JSON.stringify({ ...value, choice: colouredChoice }));
    if (['adaptive', 'white'].includes(value.mode)) localStorage.setItem('wavz-clock-color', value.mode === 'adaptive' ? 'palette' : 'white');
    if (value.mode === 'custom') localStorage.setItem('wavz-clock-custom', hex(value.rgb));
    syncClockChoice();
  }
  const toggleClockColor = () => selectClockColor(clockColor.mode === 'white' ? colouredChoice : { mode: 'white' });
  syncClockChoice();
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const savedNumber = (key, fallback, min, max) => {
    const saved = localStorage.getItem(key), value = saved === null ? fallback : Number(saved);
    return clamp(Number.isFinite(value) ? value : fallback, min, max);
  };
  let clockScale = savedNumber('wavz-clock-scale', 1, .5, MAX_CLOCK_SCALE), clockWeight = savedNumber('wavz-clock-weight', 800, 100, 900);
  const positionKey = 'wavz-clock-position-' + name;
  let position = { x: .5, y: .5 }, positionAnimation = null;
  try {
    const saved = JSON.parse(localStorage.getItem(positionKey));
    if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) position = { x: clamp(saved.x, 0, 1), y: clamp(saved.y, 0, 1) };
  } catch {}
  const clockCenter = () => { const r = clockFace.getBoundingClientRect(), art = root.getBoundingClientRect(); return { x: r.x + r.width / 2 - art.x, y: r.y + r.height / 2 - art.y }; };
  // Keep the touch area inside the poster until that axis fills it. An enlarged
  // clock then stays centred on that axis, with at most 3% of its ink past either edge.
  const clockSize = () => { const r = clockFace.getBoundingClientRect(); return {
    halfW: Math.min(r.width / 2 + 1, root.clientWidth / 2), halfH: Math.min(r.height / 2 + 1, root.clientHeight / 2) }; };
  function placeClock() {
    const { halfW, halfH } = clockSize();
    clockFace.style.left = clamp(position.x * root.clientWidth, halfW, root.clientWidth - halfW) + 'px';
    clockFace.style.top = clamp(position.y * root.clientHeight, halfH, root.clientHeight - halfH) + 'px';
  }
  function cancelPositionAnimation(freeze = true) {
    if (!positionAnimation) return;
    const p = clockCenter(); positionAnimation.cancel(); positionAnimation = null;
    if (freeze) position = { x: p.x / root.clientWidth, y: p.y / root.clientHeight };
    placeClock();
  }
  const reassessPalette = () => { clockInk = null; paletteAt = -Infinity; };
  function centerClock() {
    cancelPositionAnimation();
    reassessPalette();
    const from = clockCenter(), x = root.clientWidth / 2, y = root.clientHeight / 2;
    const { halfW, halfH } = clockSize();
    position = { x: .5, y: .5 }; localStorage.removeItem(positionKey); placeClock();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) {
      positionAnimation = clockFace.animate([
        { left: from.x + 'px', top: from.y + 'px' },
        { left: clamp(x + (x - from.x) * .07, halfW, root.clientWidth - halfW) + 'px', top: clamp(y + (y - from.y) * .07, halfH, root.clientHeight - halfH) + 'px', offset: .78 },
        { left: x + 'px', top: y + 'px' },
      ], { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)' });
      const animation = positionAnimation;
      animation.onfinish = () => { if (positionAnimation === animation) positionAnimation = null; reassessPalette(); };
    } else reassessPalette();
  }
  function fitClock() {
    cancelPositionAnimation(false);
    clockDigits.cancelPulse();
    clockFace.style.fontWeight = String(clockWeight);
    if (!clockOn || closed) return;
    const size = Math.max(MIN_FONT_SIZE, clamp(Math.min(root.clientWidth, root.clientHeight) * .14, 40, 180) * TEXT_SCALE * clockScale);
    // Fit the reserved slots, never the current time's changing glyph widths.
    clockFace.style.fontSize = Math.max(MIN_FONT_SIZE, Math.min(size,
      root.clientWidth * (1 + CLOCK_BLEED * 2) / clockDigits.widthEm,
      root.clientHeight * (1 + CLOCK_BLEED * 2) / CLOCK_LINE_HEIGHT)) + 'px';
    placeClock();
  }
  const saveClockStyle = () => {
    localStorage.setItem('wavz-clock-scale', String(clockScale));
    localStorage.setItem('wavz-clock-weight', String(clockWeight));
  };
  function updateClock() {
    clearTimeout(clockTimer);
    const wasHidden = clock.hidden;
    clock.hidden = !clockOn || closing;
    if (!clockOn) clock.classList.remove('visible');
    clockToggle.setAttribute('aria-pressed', String(clockOn));
    clockToggle.querySelector('em').textContent = clockOn ? 'on' : 'off';
    clockToggle.setAttribute('aria-label', 'Clock: ' + (clockOn ? 'on' : 'off'));
    if (!clockOn || closed || closing) return;
    const now = new Date();
    const first = !clockDigits.value;
    const text = clockDigits.update(now, clock.classList.contains('visible') && !wasHidden);
    clockFace.setAttribute('aria-label', 'Current time: ' + text + '. Tap for color, hold to move, triple tap to center.');
    clock.dateTime = now.toISOString();
    clock.setAttribute('aria-label', 'Current time: ' + text);
    if (first || wasHidden) fitClock();
    clockTimer = setTimeout(updateClock, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 25);
  }
  // Capture gestures that start on the clock; a second finger may land beside it.
  const fingers = new Map();
  let gesture = null, pinched = false, tap = null, holdTimer = 0, tapTimer = 0, tapCount = 0, lastTap = 0, dragged = false;
  const clearHold = () => { clearTimeout(holdTimer); clockFace.classList.remove('dragging'); };
  const clearTaps = () => { clearTimeout(tapTimer); tapCount = 0; };
  const recordTap = () => {
    const now = performance.now();
    tapCount = now - lastTap < 350 ? tapCount + 1 : 1; lastTap = now;
    clearTimeout(tapTimer);
    if (tapCount === 3) { tapCount = 0; centerClock(); }
    else tapTimer = setTimeout(() => { if (tapCount === 1 && !closed && clockOn) toggleClockColor(); tapCount = 0; }, 350);
  };
  const distance = () => { const [a, b] = [...fingers.values()]; return Math.hypot(b.x - a.x, b.y - a.y); };
  const beginGesture = () => {
    clearHold();
    if (fingers.size >= 2) { pinched = true; gesture = { distance: Math.max(1, distance()), scale: clockScale }; }
    else if (fingers.size === 1 && !pinched) { const [p] = fingers.values(); gesture = { x: p.x, y: p.y, weight: clockWeight }; }
    else gesture = null;
  };
  const stopClockGesture = () => {
    clearHold(); clearTaps(); cancelPositionAnimation(false);
    clockDigits.cancelPulse();
    const ids = [...fingers.keys()]; fingers.clear(); gesture = null; pinched = false; tap = null;
    for (const id of ids) if (root.hasPointerCapture(id)) root.releasePointerCapture(id);
    saveClockStyle();
    if (dragged) { localStorage.setItem(positionKey, JSON.stringify(position)); dragged = false; reassessPalette(); }
  };
  root.addEventListener('pointerdown', (e) => {
    if (!clockOn || flight || closing || colorPicker?.sampling || e.button !== 0 || ui.contains(e.target) || colorPicker?.element.contains(e.target)) return;
    if (!clockFace.contains(e.target) && !fingers.size) return;
    if (fingers.size >= 2) return;
    if (!fingers.size) { cancelPositionAnimation(); clearTimeout(tapTimer); tap = { id: e.pointerId, x: e.clientX, y: e.clientY, time: performance.now() }; }
    else tap = null;
    e.preventDefault(); fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    root.setPointerCapture(e.pointerId); beginGesture();
    if (fingers.size === 1 && !pinched) holdTimer = setTimeout(() => {
      if (!tap || fingers.size !== 1 || !gesture || closed) return;
      const [p] = fingers.values();
      gesture = { x: p.x, y: p.y, anchor: clockCenter(), drag: true };
      tap = null; clearTaps(); clockFace.classList.add('dragging'); clockDigits.held(); ui.classList.add('off');
    }, 380);
  });
  root.addEventListener('pointermove', (e) => {
    if (!fingers.has(e.pointerId)) return;
    if (tap && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) > 8) { tap = null; clearHold(); clearTaps(); }
    e.preventDefault(); fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!gesture) return;
    if (fingers.size === 2) clockScale = clamp(gesture.scale * distance() / gesture.distance, .5, MAX_CLOCK_SCALE);
    else if (gesture.drag) {
      const box = root.getBoundingClientRect(), { halfW, halfH } = clockSize();
      const x = clamp(gesture.anchor.x + e.clientX - gesture.x, halfW, box.width - halfW);
      const y = clamp(gesture.anchor.y + e.clientY - gesture.y, halfH, box.height - halfH);
      position = { x: x / box.width, y: y / box.height }; placeClock(); dragged = true;
      return;
    } else {
      const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
      clockWeight = Math.round(clamp(gesture.weight + dx * 2, 100, 900));
    }
    fitClock();
  });
  const finishGesture = (e) => {
    const tapped = e.type === 'pointerup' && tap?.id === e.pointerId && !pinched && performance.now() - tap.time < 380;
    if (!fingers.delete(e.pointerId)) return;
    tap = null;
    if (root.hasPointerCapture(e.pointerId)) root.releasePointerCapture(e.pointerId);
    if (!fingers.size) {
      clearHold(); gesture = null; pinched = false; saveClockStyle();
      if (e.type !== 'pointerup') clearTaps();
      if (dragged) { localStorage.setItem(positionKey, JSON.stringify(position)); dragged = false; reassessPalette(); }
    }
    else beginGesture();
    if (tapped) recordTap();
  };
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) root.addEventListener(type, finishGesture);
  clockFace.addEventListener('contextmenu', e => e.preventDefault());
  // Screen readers activate a button with a synthetic click rather than pointer gestures.
  clockFace.addEventListener('click', e => { if (e.detail === 0 && clockOn && !closed) { clearTaps(); toggleClockColor(); } });
  clockFace.addEventListener('wheel', (e) => {
    if (!e.ctrlKey || !clockOn) return;
    e.preventDefault(); clockScale = clamp(clockScale * Math.exp(-e.deltaY * .01), .5, MAX_CLOCK_SCALE); fitClock(); saveClockStyle();
  }, { passive: false });
  clockFace.addEventListener('keydown', (e) => {
    if (e.key === 'Home') { e.preventDefault(); clearTaps(); centerClock(); return; }
    if (e.shiftKey && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault(); cancelPositionAnimation();
      const p = clockCenter(), { halfW, halfH } = clockSize();
      const x = clamp(p.x + (e.key === 'ArrowLeft' ? -16 : e.key === 'ArrowRight' ? 16 : 0), halfW, root.clientWidth - halfW);
      const y = clamp(p.y + (e.key === 'ArrowUp' ? -16 : e.key === 'ArrowDown' ? 16 : 0), halfH, root.clientHeight - halfH);
      position = { x: x / root.clientWidth, y: y / root.clientHeight }; placeClock(); localStorage.setItem(positionKey, JSON.stringify(position)); reassessPalette(); return;
    }
    if (['Enter', ' '].includes(e.key)) { e.preventDefault(); toggleClockColor(); return; }
    if (['ArrowLeft', 'ArrowRight'].includes(e.key)) clockWeight = clamp(clockWeight + (e.key === 'ArrowRight' ? 50 : -50), 100, 900);
    else if (['+', '=', '-', '−'].includes(e.key)) clockScale = clamp(clockScale * (['+', '='].includes(e.key) ? 1.1 : 1 / 1.1), .5, MAX_CLOCK_SCALE);
    else return;
    e.preventDefault(); fitClock(); saveClockStyle();
  });
  clockToggle.addEventListener('click', () => { stopClockGesture(); clockOn = !clockOn; localStorage.setItem('wavz-clock', clockOn ? '1' : '0'); updateClock(); });
  const resumeClock = () => { if (document.visibilityState === 'visible') updateClock(); };
  document.addEventListener('visibilitychange', resumeClock);
  updateClock();
  fontReady.then(() => { if (!closed) { clockDigits.measure(); fitClock(); clockFontsReady = true; } });

  // ---- colour: three prominent poster inks, any custom colour, white or adaptive ink.
  colorPicker = makeColorPicker({ root, face: clockFace, button: $('wz-color-toggle'), title: SCENES[name].title,
    selected: clockColor, getPalette: () => samplePalette()?.dominant, sampleColor: makeSceneColorSampler(scene, SCENES[name].dark),
    customColor: colouredChoice.mode === 'custom' ? hex(colouredChoice.rgb) : localStorage.getItem('wavz-clock-custom'),
    onSelect: selectClockColor,
    onOpen() {
      stopClockGesture(); clearTimeout(hide); ui.hidden = true;
      if (!clockOn) { clockOn = true; localStorage.setItem('wavz-clock', '1'); updateClock(); }
    },
    onClose() { ui.hidden = false; show(); },
  });

  // ---- growing out of, and shrinking back into, a rectangle on the page. The poster is recomposed on every frame of
  // the flight, so it reflows into the screen's shape as it travels rather than being stretched.
  // landed: the scene has the screen (not in flight), which is when the space round it is filled in
  const place = (r) => { root.classList.toggle('landed', !r); Object.assign(root.style, r ? { inset: 'auto', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' } : { inset: '', left: '', top: '', width: '', height: '' }); };
  const full = () => ({ left: 0, top: 0, width: innerWidth, height: innerHeight });
  // The grain is held still against the screen while the poster's window moves over it, so the texture is there the
  // whole way and does not shift when the poster lands.
  // small: which end of the flight is the poster on the page (it carries no wordmark), 'a' or 'b'
  // b may be a function giving the rectangle afresh on every frame, for a poster the page is still moving under us
  function fly(a, bIn, small, done) {
    const target = typeof bIn === 'function' ? bIn : () => bIn; let b = target();
    const style = (r, key) => styleFor(r.width / r.height, small !== key), from = style(a, 'a'), to = style(b, 'b');
    const t0 = performance.now(), duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : FLIGHT, W = innerWidth, H = innerHeight, long = Math.max(W, H), s = (force || Math.min(MAXPX, long * devicePixelRatio)) / long;
    ui.classList.add('off');
    // The thumbnail frame fades away into completely edge-to-edge playback.
    const page = { f: thumbnailFrame, d: document.documentElement.dataset.theme === 'dark' ? 1 : 0 }, A = small === 'a' ? page : cur, B = small === 'a' ? cur : page;
    flight = (now) => {
      b = target();
      const u = duration ? Math.min(1, (now - t0) / duration) : 1, e = ease(u), m = (key) => a[key] + (b[key] - a[key]) * e, r = { left: m('left'), top: m('top'), width: m('width'), height: m('height') };
      mix = { from, to, e, f: A.f + (B.f - A.f) * e, d: A.d + (B.d - A.d) * e }; place(r); fit(false);
      Object.assign(grain.style, { inset: 'auto', left: -r.left + 'px', top: -r.top + 'px', width: W + 'px', height: H + 'px' });
      if (u === 1) { flight = null; mix = null; Object.assign(grain.style, { inset: '', left: '', top: '', width: '', height: '' }); done(); }
    };
    flight(t0);
  }

  // ---- drawing
  const notes = [], note = (m) => { notes.push(((performance.now() / 1000) % 100).toFixed(1) + ' ' + m); if (notes.length > 14) notes.shift(); };   // shown with ?debug
  let last = performance.now(), fps = 60, ms = 0, n = 0;
  frame1 = (t) => {
    const paint = c => { c.setTransform(k, 0, 0, k, 0, 0); draw(c, t / LOOP, L, t); };
    const active = DEPTH_ENABLED && clockOn && depthSelection !== 'front' && !flight;
    foreground.hidden = !active;
    if (!active) { paint(ctx); return; }
    const art = scene.getBoundingClientRect(), text = clockFace.getBoundingClientRect();
    const x = scene.width / art.width, y = scene.height / art.height;
    renderDepth(paint, depthSelection, { x: (text.left - art.left - 2) * x, y: (text.top - art.top - 2) * y,
      width: (text.width + 4) * x, height: (text.height + 4) * y });
  };
  function tick(now) {
    if (closed) return;
    flight?.(now);
    const t0 = performance.now(), t = now / 1000 + skip;
    frame1(t);
    if (clockOn) updateClockColor(now, t);
    // The time appears only after the poster has landed, loaded its face and sampled its ink.
    if (clockOn && clockSettled && clockFontsReady && !closing && !flight) clock.classList.add('visible');
    ms += (performance.now() - t0 - ms) * 0.05; fps += (1000 / Math.max(1, now - last) - fps) * 0.05; last = now;
    if (debug && ++n % 3 === 0) hud.textContent = `${scene.width} x ${scene.height}  ${fps.toFixed(0)} fps  draw ${ms.toFixed(1)} ms  t ${t.toFixed(0)} s` + (notes.length ? '\n' + notes.join('\n') : '');
    requestAnimationFrame(tick);
  }

  // ---- controls: they show on any movement and fade after a few seconds
  let hide;
  const show = (e) => { if (flight || closing || colorPicker.active || (e && (clockFace.contains(e.target) || fingers.size))) return; ui.classList.remove('off'); clearTimeout(hide); hide = setTimeout(() => ui.classList.add('off'), 3500); };
  for (const type of ['pointermove', 'pointerdown']) root.addEventListener(type, show);
  addEventListener('keydown', show);
  // Use DOM fullscreen where supported. On iPhone, keep the full-bleed page/PWA
  // viewer so the OS video player cannot letterbox the art or replace its controls.
  const enter = root.requestFullscreen ?? root.webkitRequestFullscreen, leaveFull = document.exitFullscreen ?? document.webkitExitFullscreen, isFull = () => document.fullscreenElement ?? document.webkitFullscreenElement;
  const toggleFull = () => {
    if (enter) Promise.resolve(isFull() ? leaveFull.call(document) : enter.call(root, { navigationUI: 'hide' })).catch((e) => note('fullscreen: ' + e.name));
  };
  $('wz-full').hidden = !enter; $('wz-full').addEventListener('click', toggleFull);
  // the screen is kept awake while a scene is up, where the browser allows it: these are made to be left running
  let awake = null; const wake2 = () => { if (!closed && document.visibilityState === 'visible') navigator.wakeLock?.request('screen').then((w) => { awake = w; }, () => {}); };
  wake2(); document.addEventListener('visibilitychange', wake2);
  root.addEventListener('dblclick', (e) => { if (!colorPicker.active && !ui.contains(e.target) && !clockFace.contains(e.target)) toggleFull(); });
  if (home) $('wz-home').addEventListener('click', (e) => { e.preventDefault(); home(); });
  const esc = (e) => {
    if (e.key !== 'Escape' || e.defaultPrevented || closing) return;
    if (colorPicker.active) { e.preventDefault(); colorPicker.close(); }
    else if (!isFull() && !flight) $('wz-home').click();
  };
  addEventListener('keydown', esc);

  // ---- sound: on from the start. Ambience and music have their own volumes, and each is muted or brought back by
  // pressing its name; both are remembered. With both muted nothing is fetched at all.
  // Browsers only let sound start after a tap or a key: opened from the main page, the tap on the poster counts;
  // opened cold from a link, it starts with the first tap or key anywhere on the scene.
  const amb = $('wz-amb'), mus = $('wz-mus'), trk = $('wz-trk'), sliders = { amb, mus }, KEY = { amb: 'wavz-ambience', mus: 'wavz-music' };
  const hasAudio = SCENES[name].audio !== false;
  root.querySelector('.wz-r2').hidden = !hasAudio;
  const muted = { amb: localStorage.getItem('wavz-ambience-off') === '1', mus: localStorage.getItem('wavz-music-off') === '1' };
  amb.value = localStorage.getItem('wavz-ambience') ?? 0.7; mus.value = localStorage.getItem('wavz-music') ?? 0.7;
  const levels = (gentle = false) => {
    sound?.ambience(muted.amb ? 0 : +amb.value, gentle); sound?.music(muted.mus ? 0 : +mus.value, gentle);
    for (const b of root.querySelectorAll('.wz-mute')) { const m = muted[b.dataset.bus]; b.parentNode.classList.toggle('muted', m); b.setAttribute('aria-label', (m ? 'Unmute ' : 'Mute ') + b.textContent.toLowerCase()); }
    trk.disabled = muted.mus; for (const sl of [amb, mus]) sl.style.setProperty('--v', sl.value * 100 + '%');
  };
  let soundFactory;
  async function startSound() {
    if (!hasAudio) return;
    // Once loaded, make and resume audio synchronously during the next iOS tap.
    if (!soundFactory) soundFactory = (await import('./sound.js?v=20261011-clock')).makeSound;
    if (closed || !on) return;
    if (sound) { levels(); sound.resume(); return; }
    sound = soundFactory(name, typeof SCENES[name].audio === 'string' ? SCENES[name].audio : name);
    levels(); sound.onTrack((letter) => { trk.textContent = letter; trk.setAttribute('aria-label', 'Next track, now playing track ' + letter); });
    sound.resume();
  }
  const setMuted = (bus, m) => {
    muted[bus] = m; localStorage.setItem(KEY[bus] + '-off', m ? '1' : '0'); on = !(muted.amb && muted.mus); levels(true);
    if (!on) { sound?.stop(); sound = null; } else if (!sound?.running()) startSound();
  };
  for (const b of root.querySelectorAll('.wz-mute')) b.addEventListener('click', (e) => { e.preventDefault(); setMuted(b.dataset.bus, !muted[b.dataset.bus]); });
  // moving a muted slider brings its sound back
  for (const bus of ['amb', 'mus']) sliders[bus].addEventListener('input', () => { localStorage.setItem(KEY[bus], sliders[bus].value); if (muted[bus]) setMuted(bus, false); else levels(); show(); });
  // before any sound has started (a scene opened cold from a link) the button shows the track remembered for the scene,
  // and a press on it moves that on, so the sound this same press sets going begins on the next track
  trk.textContent = 'ABCD'[+localStorage.getItem('wavz-track-' + name) || 0] ?? 'A';
  trk.addEventListener('click', (e) => { e.preventDefault(); if (sound) sound.nextTrack(); else localStorage.setItem('wavz-track-' + name, (+localStorage.getItem('wavz-track-' + name) || 0) + 1); });
  // a press on the pill itself, between its parts, is not a press on the name
  for (const l of root.querySelectorAll('.wz-ui label')) l.addEventListener('click', (e) => { if (e.target === l) e.preventDefault(); });
  // the sound that was refused is made afresh on the tap, whatever it says of itself by then: the browser may have set
  // its clock running again without ever starting the files it turned away
  const wake = () => { removeEventListener('pointerup', wake); removeEventListener('keydown', wake); if (on && !closed) { if (sound) sound.resume(); else startSound(); } };
  const arm = () => { addEventListener('pointerup', wake); addEventListener('keydown', wake); };
  on = hasAudio && !(muted.amb && muted.mus); levels();
  // It is always tried at once: a browser that will not hear of it leaves the sound suspended, and then the first tap
  // or key starts it. (Asking the browser first whether there has been a tap is no good: after a reload it says no,
  // yet lets sound play because the page before had one.)
  if (on) startSound().then(() => setTimeout(() => { if (on && !closed && !sound?.running()) arm(); }, 600));

  // ---- open
  hud.hidden = !debug; document.title = title(SCENES[name]);
  if (from) { place(from); paint(); fly(from, full(), 'a', () => { place(null); fit(); clockSettled = true; show(); }); }
  else { place(null); fit(); paint(); clockSettled = true; show(); }
  requestAnimationFrame(tick);

  function end() {
    clearTimeout(closeTimer);
    colorPicker.close(false);
    stopClockGesture();
    clockDigits.destroy();
    closed = true; awake?.release().catch(() => {}); document.removeEventListener('visibilitychange', wake2); sound?.stop(); clearTimeout(hide); clearTimeout(pending); clearTimeout(clockTimer); document.removeEventListener('visibilitychange', resumeClock);
    for (const [t, type] of listen) t.removeEventListener(type, refit);
    removeEventListener('keydown', show); removeEventListener('keydown', esc); root.remove();
    removeEventListener('pointerup', wake); removeEventListener('keydown', wake);
  }
  return {
    get name() { return name; },
    get time() { return performance.now() / 1000 + skip; },
    // to: a rectangle to shrink back into before going; the page's own look is put back first so it shows through
    close({ to = null, immediate = false } = {}) {
      if (closed || closing && !immediate) return;
      const leave = () => {
        if (closed) return;
        clock.hidden = true;
        document.title = before.title; document.body.style.background = before.bg; document.documentElement.style.background = before.htmlBg; document.documentElement.style.transition = document.body.style.transition = '';
        unlock();
        if (isFull()) leaveFull.call(document);
        if (to && !immediate) fly(root.getBoundingClientRect(), to, 'b', end); else end();
      };
      clearTimeout(closeTimer); clearTimeout(clockTimer); closing = true; clockSettled = false;
      stopClockGesture(); colorPicker.close(false); root.inert = true; ui.classList.add('off');
      on = false; sound?.stop(); sound = null;
      const visible = !clock.hidden && Number(getComputedStyle(clock).opacity) > 0;
      clock.classList.remove('visible');
      // Finish fading the time while the artwork remains full size; then shrink the poster.
      if (!immediate && visible && !matchMedia('(prefers-reduced-motion: reduce)').matches) closeTimer = setTimeout(leave, CLOCK_FADE);
      else leave();
    },
  };
}
