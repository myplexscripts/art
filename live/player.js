// The scene player: a full-screen poster drawn live every frame and recomposed to the screen's shape, with its controls
// and sound. The main page opens it over itself, growing out of the poster that was tapped, or at once for a scene's own address.
// For checking: ?debug shows a readout, ?res=3840 forces the long side, ?t=40 starts the clock 40 s in.
import './nozoom.js';
import { draw, makeLayout, styleFor, seriesLine, SCENES } from './poster.js';
import { M, FONT } from './kit.js';

const LOOP = 30, MAXPX = 3840, CREAM = '#f2e5c3', FLIGHT = 650, TURN = 700;
const FACE = '"Bahnschrift", "DIN Alternate", "Roboto Condensed", "Arial Narrow", system-ui, sans-serif';
const CSS = `
  .wz-player { position: fixed; inset: 0; z-index: 10; overflow: hidden; -webkit-user-select: none; user-select: none; }
  /* Drawing to the edges of a phone (see 'edge' on the page): the poster runs up under the clock, but stops short of the
     home bar and of a notch at its side, where its lettering and controls would be covered. What is left over there is
     filled with the frame's own colour, so it reads as a little more frame. */
  html.edge .wz-player { inset: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); }
  html.edge .wz-player.landed { box-shadow: 0 0 0 100vmax var(--wz-bg, #f2e5c3); }
  .wz-probe { position: fixed; visibility: hidden; pointer-events: none; padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); }
  .wz-player canvas, .wz-grain { position: absolute; inset: 0; width: 100%; height: 100%; display: block; touch-action: none; }
  .wz-grain { pointer-events: none; z-index: 2; }   /* over the controls too, so they are printed on the same paper */
  .wz-mark { position: absolute; z-index: 1; display: block; cursor: pointer; -webkit-tap-highlight-color: transparent; }   /* lies over the poster's own WAVZ */
  .wz-mark:focus-visible { outline: 3px solid #dd7f45; outline-offset: 4px; }
  /* The controls are lettering on the poster, not buttons floating over it. With a frame they are printed in the title
     band, in the frame's own ink, while the band's lettering steps aside; with no frame, a strip of the dark frame comes
     up from the bottom to carry them. */
  .wz-ui { position: absolute; bottom: 0; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; gap: 2px; color: var(--ink); transition: color .7s, transform .38s cubic-bezier(.2, .7, .2, 1) 0s; }
  .wz-ui.off, .wz-ui.swap { pointer-events: none; }
  /* Coming up: the poster's orange rule draws in to its middle, the lettering rises into place one piece after another,
     and each slider's rule is drawn out from its left. Going, the pieces drop away from the right and the rule grows
     back. With no frame, the strip itself slides up from under the bottom edge first and down again last. */
  .wz-ui[data-mode=strip].off, .wz-ui[data-mode=strip].swap { transform: translateY(101%); transition-delay: .1s; }
  .wz-it { transition: opacity .3s ease calc(var(--i) * 45ms + 110ms), transform .45s cubic-bezier(.2, .8, .2, 1) calc(var(--i) * 45ms + 110ms); }
  .wz-ui.off .wz-it, .wz-ui.swap .wz-it { opacity: 0; transform: translateY(12px); transition-duration: .18s; transition-delay: calc((4 - var(--i)) * 22ms); }
  .wz-ui input[type=range] { clip-path: inset(0 0 0 0); transition: opacity .25s, clip-path .55s cubic-bezier(.3, .7, .2, 1) calc(var(--i) * 45ms + 240ms); }
  .wz-ui.off input[type=range], .wz-ui.swap input[type=range] { clip-path: inset(0 100% 0 0); transition-delay: 0s; transition-duration: .2s; }
  @media (prefers-reduced-motion: reduce) { .wz-ui, .wz-ui .wz-it, .wz-ui input[type=range] { transition-duration: .01s !important; transition-delay: 0s !important; } }
  .wz-ui[data-mode=strip] { background: var(--paper); border-top: 2px solid ${CREAM}; padding: 8px 16px calc(8px + env(safe-area-inset-bottom)); }
  /* on a wide screen the strip also carries what the frame would have: the wordmark at its left, the title at its right */
  .wz-ui .wz-smark, .wz-ui .wz-stitle { display: none; position: absolute; top: 0; bottom: env(safe-area-inset-bottom); align-items: center; }
  .wz-ui.sides .wz-smark, .wz-ui.sides .wz-stitle { display: flex; }
  .wz-ui a.wz-smark { left: 22px; padding: 0; border: 0; font-size: 38px; letter-spacing: 0; line-height: 1; }
  .wz-ui .wz-stitle { right: 22px; flex-direction: column; justify-content: center; align-items: flex-end; gap: 5px; font: 700 17px/1 ${FACE}; text-transform: uppercase; letter-spacing: .02em; white-space: nowrap; }
  .wz-ui .wz-stitle em { font-size: 11px; letter-spacing: .08em; white-space: pre; }
  .wz-row { display: flex; align-items: center; justify-content: center; gap: 6px 22px; }
  .wz-ui:not(.two) { flex-direction: row; align-items: center; gap: 22px; }
  .wz-ui:not(.two) .wz-row { display: contents; }
  .wz-ui:not(.two) .wz-frame { order: 3; } .wz-ui:not(.two) .wz-full { order: 4; } .wz-ui:not(.two) label { order: 2; }
  .wz-ui.two .wz-r1 { justify-content: space-between; } .wz-ui.two .wz-r2 { gap: 14px; } .wz-ui.two label { flex: 1 1 0; }
  .wz-ui.tight { gap: 14px; } .wz-ui.tight .wz-word { display: none; }
  .wz-ui a, .wz-ui button { font: 700 15px/1 ${FACE}; letter-spacing: .1em; text-transform: uppercase; color: inherit; background: none; border: 0; padding: 11px 0 9px; border-bottom: 3px solid transparent; text-decoration: none; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 7px; }
  .wz-ui a:hover, .wz-ui button:not(:disabled):hover, .wz-ui a:focus-visible, .wz-ui button:focus-visible { border-bottom-color: #dd7f45; outline: none; }
  .wz-ui em { font-style: normal; color: var(--sub); }
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
  .wz-ui [hidden], .wz-ui .wz-row[hidden], .wz-mark[hidden], .wz-grain[hidden] { display: none; }
  .wz-ui label button { transition: opacity .25s; }
  .wz-ui button.wz-trk { width: 24px; height: 24px; padding: 1px 0 0; justify-content: center; border: 2px solid currentColor; border-radius: 50%; letter-spacing: 0; font-size: 12px; flex: none; }
  .wz-ui button.wz-trk:not(:disabled):hover, .wz-ui button.wz-trk:focus-visible { border-color: #dd7f45; }
  .wz-ui label.muted input, .wz-ui label.muted .wz-trk { opacity: .35; }
  .wz-ui label.muted .wz-trk { cursor: default; }
  .wz-ui label.muted .wz-mute { opacity: .5; text-decoration: line-through; }
  .wz-hud { position: absolute; left: 10px; top: 8px; font: 12px ui-monospace, monospace; color: #0e1c3a; background: rgba(242, 229, 195, .85); padding: 3px 7px; border-radius: 4px; white-space: pre-wrap; max-width: 92%; z-index: 3; pointer-events: none; }
`;
const HTML = `<canvas class="wz-scene"></canvas><div class="wz-grain"></div><a class="wz-mark" href="./" aria-label="WAVZ: back to all posters" title="All posters"></a>
  <nav class="wz-ui off"><a class="wz-smark wz-it" style="--i:0" href="./" aria-label="WAVZ: back to all posters" title="All posters">WAVZ</a><div class="wz-stitle wz-it" style="--i:4"><b></b><em></em></div><div class="wz-row wz-r1"><a class="wz-home wz-it" style="--i:0" href="./" aria-label="Back to all posters"><svg class="wz-arrow" viewBox="0 0 24 14"><path d="M0 7 9 0v4.6h15v4.8H9V14z"/></svg><span class="wz-word">Posters</span></a><button class="wz-frame wz-it" style="--i:3">Frame<em class="wz-word"></em></button><button class="wz-full wz-it" style="--i:4" aria-label="Fullscreen" title="Fullscreen"><svg viewBox="0 0 20 20"><path d="M2 7V2h5M13 2h5v5M18 13v5h-5M7 18H2v-5"/></svg></button></div>
  <div class="wz-row wz-r2"><label class="wz-it" style="--i:1"><button class="wz-mute" data-bus="amb" title="Mute or unmute">Ambience</button><input class="wz-amb" type="range" min="0" max="1" step="0.01" aria-label="Ambience volume"></label><label class="wz-it" style="--i:2"><button class="wz-mute" data-bus="mus" title="Mute or unmute">Music</button><input class="wz-mus" type="range" min="0" max="1" step="0.01" aria-label="Music volume"><button class="wz-trk" title="Next track">A</button></label></div></nav><div class="wz-hud" hidden></div>`;
const title = (scene) => 'WAVZ: ' + scene.title.toLowerCase().replace(/\b[a-z]+/g, (w, i) => (i && ['at', 'of', 'the', 'in'].includes(w) ? w : w[0].toUpperCase() + w.slice(1)));
// Print grain: one small tile of noise, made once and repeated over the scene, so it costs nothing per frame or per size.
let TILE, TILECAN;   // the tile as an address for CSS, and as the canvas it was made on
const tile = () => TILE ??= (() => {
  const n = 512, c = Object.assign(document.createElement('canvas'), { width: n, height: n }), g = c.getContext('2d'), im = g.createImageData(n, n), px = new Uint32Array(im.data.buffer);
  for (let i = 0; i < px.length; i++) { const v = (Math.random() + Math.random() + Math.random()) / 3 - 0.5; px[i] = ((Math.min(255, Math.abs(v) * 0.72 * 255) | 0) << 24) | (v > 0 ? 0xffffff : 0); }
  g.putImageData(im, 0, 0); TILECAN = c; return c.toDataURL();
})();
const ease = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

// from: the on-screen rectangle to grow out of (none: appear full screen at once). home: called for the back arrow
// instead of following its link, when the page that opened the player is still underneath. at: the scene's clock, in
// seconds, at the moment of opening, so a poster already moving on the page carries on without a jump.
export function openScene(first, { from = null, home = null, at = null } = {}) {
  if (!document.getElementById('wz-css')) document.head.append(Object.assign(document.createElement('style'), { id: 'wz-css', textContent: CSS }));
  const q = new URLSearchParams(location.search), force = +q.get('res') || 0, skip = at === null ? +q.get('t') || 0 : at - performance.now() / 1000, debug = q.has('debug');
  const root = Object.assign(document.createElement('div'), { className: 'wz-player', innerHTML: HTML }), $ = (c) => root.querySelector('.' + c);
  const scene = $('wz-scene'), grain = $('wz-grain'), mark = $('wz-mark'), ui = $('wz-ui'), hud = $('wz-hud'), ctx = scene.getContext('2d');
  const before = { title: document.title, bg: document.body.style.background, htmlBg: document.documentElement.style.background, overflow: document.documentElement.style.overflow, gutter: document.documentElement.style.scrollbarGutter, theme: document.querySelector('meta[name=theme-color]')?.content };
  const textless = SCENES[first].textless === true;
  let name = first, L, k = 1, look = textless ? 'none' : localStorage.getItem('wavz-frame') ?? 'light', tween = null, flight = null, closed = false, sound = null, on = false;
  document.body.append(root);
  document.documentElement.style.overflow = 'hidden'; document.documentElement.style.scrollbarGutter = 'auto';   // the scene takes the scrollbar's room too
  // the page behind changes colour with the frame, at the same pace
  for (const el of [document.documentElement, document.body]) el.style.transition = `background-color ${TURN}ms ease-in-out`;

  // ---- layout: the canvas takes the player's size; the poster is composed for that shape
  let vfs = false, lastRaf = 0, frame1 = null;   // vfs: the scene is being shown as a full-screen video, the iPhone's only kind of full screen
  let mix = null;   // set during a flight: the title is part-way between the page poster's style and the full-screen one
  // how much frame there is (f) and how dark it is (d) for each choice, and where the frame stands now; a change of
  // choice is eased from one to the other. With the frame off, what is left of it on the way out is dark.
  const goal = (lk) => ({ f: lk === 'none' ? 0 : 1, d: lk === 'light' ? 0 : 1 });
  let cur = goal(look);
  // In flight the canvas keeps the full screen's worth of pixels the whole way and the poster is drawn into the part of
  // it that shows, so nothing is allocated from frame to frame; the player's own box clips the rest.
  function fit(final = true) {
    const r = root.getBoundingClientRect(); let fw = final ? r.width : innerWidth, fh = final ? r.height : innerHeight;
    // Shown as a full-screen video (see below), the poster is composed for the screen, not for the browser's window.
    // The phone fits a video between its status bar and its home bar, keeping about 8% of the screen's length clear
    // at each end (measured on an iPhone 15 Pro: 67 of 852 points). A video the shape of the whole screen is shrunk to
    // fit that and gets black bars down its sides as well, so the poster is made the shape of the space it is given.
    if (vfs) { const a = Math.min(screen.width, screen.height), b = Math.max(screen.width, screen.height) * (1 - 2 * 0.079), land = matchMedia('(orientation: landscape)').matches; fw = land ? b : a; fh = land ? a : b; }
    const long = Math.max(fw, fh);
    if (!long || !r.width) return;
    const s = (force || Math.min(MAXPX, long * devicePixelRatio)) / long, bw = Math.round(fw * s), bh = Math.round(fh * s);
    if (bw !== scene.width || bh !== scene.height) { scene.width = bw; scene.height = bh; }
    scene.style.width = final ? '' : fw + 'px'; scene.style.height = final ? '' : fh + 'px';
    const w = final ? bw : r.width * s, h = final ? bh : r.height * s, st = final || !mix ? cur : mix;
    L = makeLayout(w / h, SCENES[name], { dark: st.d, frame: st.f, mix: final ? null : mix }); k = w / L.VW;
    if (final) dock(r.width);
  }
  // Where the controls go. On a wide framed poster they sit in the title band between the wordmark and the title, where
  // the orange rule is, and only the rule steps aside ('band'). Where that gap is too small, or the poster is narrow
  // and its lettering stacked, they take the whole band and all its lettering steps aside ('full'). With no frame they
  // ride on a strip along the bottom ('strip'). Narrow ones are set in two rows.
  // uiLook is the frame choice the controls are dressed for. It trails the real one when the frame is coming or going:
  // they fade out where they were, and come back in their new place and ink once the frame is most of the way there.
  let uiLook = look, swapping = [];
  function dock(w) {
    const u = w / L.VW, wide = L.spec.band === 120, gap = (L.VW - 2 * M - 760) * u, across = (L.VW - 2 * M) * u;
    // a strip 1100 or more across has room for the wordmark and the title at its ends, the controls between them
    const mode = uiLook === 'none' ? 'strip' : wide && gap >= 540 ? 'band' : 'full', sides = !textless && mode === 'strip' && w >= 1100, room = mode === 'band' ? gap : mode === 'full' ? across : sides ? w - 500 : w - 32;
    ui.classList.toggle('sides', sides);
    ui.dataset.mode = mode; ui.classList.toggle('two', room < 600); ui.classList.toggle('tight', room >= 600 && room < 740);
    Object.assign(ui.style, mode === 'strip' ? { left: '0', width: '100%', height: '' } : { left: (mode === 'band' ? M + 300 : M) * u + 'px', width: room + 'px', height: (L.spec.band + M * 0.6) * u + 'px' });
    ui.style.paddingBottom = mode === 'strip' ? '' : M * 0.4 * u + 'px';
    // the wordmark printed on the poster is a way back to the posters too: a link is laid over it wherever it stands
    const mk = L.spec.mark; mark.hidden = uiLook === 'none' || !mk.a;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.font = `bold ${mk.size}px ${FONT}`; const mw = ctx.measureText('WAVZ').width; ctx.restore();
    Object.assign(mark.style, { left: (mk.x - mk.ax * mw) * u + 'px', top: (mk.y - mk.size * 0.76) * u + 'px', width: mw * u + 'px', height: mk.size * 0.8 * u + 'px' });
  }
  grain.style.backgroundImage = `url(${tile()})`; grain.style.backgroundSize = 512 / devicePixelRatio + 'px';
  grain.hidden = textless;
  let pending;
  const refit = () => { clearTimeout(pending); pending = setTimeout(() => { if (!flight && !closed) fit(); }, 120); };
  const listen = [[window, 'resize'], [window, 'orientationchange'], [screen.orientation, 'change'], [window.visualViewport, 'resize']].filter(([t]) => t);
  for (const [t, type] of listen) t.addEventListener(type, refit);

  // ---- the frame can be printed light or dark, or left off so the picture fills the screen; the page behind it and
  // the browser's own chrome follow
  const frame = $('wz-frame');
  frame.hidden = textless;
  function paint() {
    const c = look === 'light' ? CREAM : SCENES[name].dark, meta = document.querySelector('meta[name=theme-color]');
    document.documentElement.style.background = document.body.style.background = c; if (meta) meta.content = c; root.style.setProperty('--wz-bg', c);
    frame.querySelector('em').textContent = { light: 'light', dark: 'dark', none: 'off' }[look]; frame.setAttribute('aria-label', 'Frame: ' + frame.querySelector('em').textContent);
    // the controls are printed in the frame's ink: the scene's own on a light frame, cream on a dark one or on the strip
    if (!ui.classList.contains('swap')) inks();
  }
  const inks = () => { root.style.setProperty('--ink', uiLook === 'light' ? SCENES[name].text : CREAM); root.style.setProperty('--sub', uiLook === 'light' ? '#b9653a' : '#f0bd4d'); root.style.setProperty('--paper', SCENES[name].dark); };
  frame.addEventListener('click', () => { look = { light: 'dark', dark: 'none', none: 'light' }[look]; localStorage.setItem('wavz-frame', look); tween = { t0: performance.now(), a: cur, b: goal(look) };
    swapping.forEach(clearTimeout);
    if (ui.classList.contains('swap') || (uiLook === 'none') !== (look === 'none')) {
      ui.classList.add('swap');
      swapping = [setTimeout(() => { uiLook = look; inks(); dock(root.getBoundingClientRect().width); }, 420), setTimeout(() => ui.classList.remove('swap'), 600)];
    } else uiLook = look;
    paint();
  });

  // ---- growing out of, and shrinking back into, a rectangle on the page. The poster is recomposed on every frame of
  // the flight, so it reflows into the screen's shape as it travels rather than being stretched.
  // landed: the scene has the screen (not in flight), which is when the space round it is filled in
  const place = (r) => { root.classList.toggle('landed', !r); Object.assign(root.style, r ? { inset: 'auto', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' } : { inset: '', left: '', top: '', width: '', height: '' }); };
  // the scene's place when it has the screen: all of it, less the home bar and a side notch where the page draws to the edges
  const probe = root.appendChild(Object.assign(document.createElement('div'), { className: 'wz-probe' })), edge = document.documentElement.classList.contains('edge');
  const full = () => { const cs = edge ? getComputedStyle(probe) : null, l = parseFloat(cs?.paddingLeft) || 0, r = parseFloat(cs?.paddingRight) || 0, b = parseFloat(cs?.paddingBottom) || 0; return { left: l, top: 0, width: innerWidth - l - r, height: innerHeight - b }; };
  // The grain is held still against the screen while the poster's window moves over it, so the texture is there the
  // whole way and does not shift when the poster lands.
  // small: which end of the flight is the poster on the page (it carries no wordmark), 'a' or 'b'
  // b may be a function giving the rectangle afresh on every frame, for a poster the page is still moving under us
  function fly(a, bIn, small, done) {
    const target = typeof bIn === 'function' ? bIn : () => bIn; let b = target();
    const style = (r, key) => styleFor(r.width / r.height, small !== key), from = style(a, 'a'), to = style(b, 'b');
    const t0 = performance.now(), W = innerWidth, H = innerHeight, long = Math.max(W, H), s = (force || Math.min(MAXPX, long * devicePixelRatio)) / long;
    ui.classList.add('off');
    // the poster on the page always has its frame, light or dark; the full-screen end is whatever is chosen
    tween = null; cur = goal(look);
    const page = { f: 1, d: look === 'dark' ? 1 : 0 }, A = small === 'a' ? page : cur, B = small === 'a' ? cur : page;
    flight = (now) => {
      b = target();
      const u = Math.min(1, (now - t0) / FLIGHT), e = ease(u), m = (key) => a[key] + (b[key] - a[key]) * e, r = { left: m('left'), top: m('top'), width: m('width'), height: m('height') };
      mix = { from, to, e, f: A.f + (B.f - A.f) * e, d: A.d + (B.d - A.d) * e }; place(r); fit(false);
      Object.assign(grain.style, { inset: 'auto', left: -r.left + 'px', top: -r.top + 'px', width: W + 'px', height: H + 'px' });
      if (u === 1) { flight = null; mix = null; Object.assign(grain.style, { inset: '', left: '', top: '', width: '', height: '' }); done(); }
    };
    flight(t0);
  }

  // ---- drawing
  const notes = [], note = (m) => { notes.push(((performance.now() / 1000) % 100).toFixed(1) + ' ' + m); if (notes.length > 14) notes.shift(); };   // shown with ?debug
  let last = performance.now(), fps = 60, ms = 0, n = 0, vis = 0, downAt = 0;   // vis: how far the controls have come up, 0 to 1
  // one frame of the scene; as a full-screen video the grain is printed into it, since the video shows only the canvas
  frame1 = (t) => { ctx.setTransform(k, 0, 0, k, 0, 0); draw(ctx, t / LOOP, L, t); if (vfs && grainFill && !textless) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = grainFill; ctx.fillRect(0, 0, scene.width, scene.height); } };
  let grainFill = null;
  function tick(now) {
    if (closed) return;
    flight?.(now);
    if (tween && !flight) { const u = Math.min(1, (now - tween.t0) / TURN), e = ease(u), { a, b } = tween; cur = { f: a.f + (b.f - a.f) * e, d: a.d + (b.d - a.d) * e }; if (u === 1) tween = null; fit(); }
    const t0 = performance.now(), t = now / 1000 + skip, md = ui.dataset.mode;
    const up = ui.classList.contains('off') || ui.classList.contains('swap') ? 0 : 1;   // the rule goes quickly and comes back after the lettering has dropped
    if (up) downAt = 0; else downAt ||= now;
    if (up || now - downAt > 210) vis += (up - vis) * (1 - Math.exp(-Math.max(1, now - last) / (up ? 90 : 130)));
    L.fade = { rule: md === 'strip' ? 0 : vis, text: md === 'full' ? vis : 0 };
    lastRaf = now; frame1(t);
    ms += (performance.now() - t0 - ms) * 0.05; fps += (1000 / Math.max(1, now - last) - fps) * 0.05; last = now;
    if (debug && ++n % 3 === 0) hud.textContent = `${scene.width} x ${scene.height}  ${fps.toFixed(0)} fps  draw ${ms.toFixed(1)} ms  t ${t.toFixed(0)} s` + (notes.length ? '\n' + notes.join('\n') : '');
    requestAnimationFrame(tick);
  }

  // ---- controls: they show on any movement and fade after a few seconds
  let hide;
  let prep = null;
  const show = () => { if (flight) return; prep?.(); ui.classList.remove('off'); clearTimeout(hide); hide = setTimeout(() => ui.classList.add('off'), 3500); };
  for (const type of ['pointermove', 'pointerdown']) root.addEventListener(type, show);
  addEventListener('keydown', show);
  // Full screen. Most browsers will show the page itself full screen. Safari on an iPhone will not: the only thing it
  // shows full screen is a video. So there the scene is fed to a video element as a live stream of its canvas, and that
  // video is sent full screen: the same picture, drawn live, with the phone's own video controls to leave by.
  const de = document.documentElement, enter = de.requestFullscreen ?? de.webkitRequestFullscreen, leaveFull = document.exitFullscreen ?? document.webkitExitFullscreen, isFull = () => document.fullscreenElement ?? document.webkitFullscreenElement;
  const canFull = !!enter, canVideo = !canFull && !navigator.standalone && !!scene.captureStream && 'webkitEnterFullscreen' in HTMLVideoElement.prototype;
  let vid = null, vtimer = 0;
  // The bare video is put in place when the controls first come up. On the press, all inside the press itself (Safari
  // allows it nowhere else): the canvas is recomposed to the shape of the whole screen, a fresh stream of it is given
  // to the video, and the video is sent full screen. A canvas already being streamed is never resized. While the video
  // is up the browser stops calling for frames, so a timer draws them.
  const stopStream = () => { vid?.srcObject?.getTracks().forEach((tr) => tr.stop()); if (vid) vid.srcObject = null; };
  if (canVideo) prep = () => {
    if (vid) return;
    vid = Object.assign(document.createElement('video'), { muted: true, playsInline: true }); vid.setAttribute('playsinline', ''); vid.setAttribute('muted', '');
    vid.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-1;pointer-events:none'; root.prepend(vid);
    for (const type of ['loadedmetadata', 'resize', 'playing', 'pause', 'stalled', 'error', 'webkitbeginfullscreen', 'webkitendfullscreen']) vid.addEventListener(type, () => note('video ' + type + ' ' + vid.videoWidth + 'x' + vid.videoHeight + ' ready ' + vid.readyState + (vid.error ? ' ' + vid.error.message : '')));
    vid.addEventListener('webkitendfullscreen', () => { vfs = false; clearInterval(vtimer); stopStream(); fit(); });
    vid.addEventListener('pause', () => { if (vfs && vid.webkitDisplayingFullscreen) vid.play().catch(() => {}); });
    // the pattern is taken from the tile's own canvas: one made from an image of it marks the scene's canvas as
    // tainted in Safari, and a tainted canvas cannot be streamed
    tile(); grainFill = ctx.createPattern(TILECAN, 'repeat');
  };
  function videoFull() {
    prep(); stopStream(); vfs = true; fit(); frame1(performance.now() / 1000 + skip);
    try { vid.srcObject = scene.captureStream(30); } catch (e) { note('captureStream failed: ' + e.name + ' ' + e.message); }
    note('pressed: canvas ' + scene.width + 'x' + scene.height + ' ready ' + vid.readyState + ' supports ' + vid.webkitSupportsFullscreen);
    let told = false, drawn = 0; clearInterval(vtimer);
    vtimer = setInterval(() => { const now = performance.now(); if (vfs && now - lastRaf > 80) { if (!told) { told = true; note('page frames stopped: drawing by timer'); } drawn++; frame1(now / 1000 + skip); } }, 33);
    let went = false;
    const go = (how) => {
      if (went || !vfs) return;
      try { vid.webkitEnterFullscreen(); went = true; note('entered (' + how + ')'); }
      catch (e) { note('enter failed (' + how + '): ' + e.name + ' ' + e.message); }
    };
    vid.play().then(() => { note('video play ok'); go('after play'); }, (e) => { note('video play refused: ' + e.name); go('play refused'); });
    go('at once'); vid.addEventListener('loadedmetadata', () => go('on metadata'), { once: true });
    setTimeout(() => { if (vfs && !vid.webkitDisplayingFullscreen) { note('not full screen after 2.5 s: gave up'); vfs = false; clearInterval(vtimer); stopStream(); fit(); } }, 2500);   // it would not: back to the page as it was
    setTimeout(() => note('4 s on: video t ' + vid.currentTime.toFixed(1) + ' ' + vid.videoWidth + 'x' + vid.videoHeight + ' paused ' + vid.paused + ' timer frames ' + drawn + ' vis ' + document.visibilityState), 4000);
  }
  const toggleFull = () => { if (canFull) isFull() ? leaveFull.call(document) : enter.call(de, { navigationUI: 'hide' }); else if (canVideo && !vfs) videoFull(); };
  $('wz-full').hidden = !canFull && !canVideo; $('wz-full').addEventListener('click', toggleFull);
  // the screen is kept awake while a scene is up, where the browser allows it: these are made to be left running
  let awake = null; const wake2 = () => { if (!closed && document.visibilityState === 'visible') navigator.wakeLock?.request('screen').then((w) => { awake = w; }, () => {}); };
  wake2(); document.addEventListener('visibilitychange', wake2);
  root.addEventListener('dblclick', (e) => { if (!ui.contains(e.target)) toggleFull(); });
  if (home) $('wz-home').addEventListener('click', (e) => { e.preventDefault(); home(); });
  // On a narrow poster the controls are printed where the wordmark was, so the wordmark only counts while it is the
  // thing showing: a press that began with the controls up is handed on to whichever of them lies under it.
  let onMark = true;
  mark.addEventListener('pointerdown', () => { onMark = ui.dataset.mode !== 'full' || ui.classList.contains('off') || ui.classList.contains('swap'); });
  mark.addEventListener('click', (e) => {
    e.preventDefault(); if (flight) return;
    if (onMark) return $('wz-home').click();
    mark.style.pointerEvents = 'none'; const under = document.elementFromPoint(e.clientX, e.clientY); mark.style.pointerEvents = '';
    if (under && ui.contains(under)) under.closest('a, button')?.click();
  });
  const esc = (e) => { if (e.key === 'Escape' && !isFull() && !flight) $('wz-home').click(); };
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
  async function startSound() {
    if (!hasAudio) return;
    const { makeSound } = await import('./sound.js');
    sound?.stop(); sound = makeSound(name);
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
  const wake = () => { removeEventListener('pointerup', wake); removeEventListener('keydown', wake); if (on && !closed) startSound(); };
  const arm = () => { addEventListener('pointerup', wake); addEventListener('keydown', wake); };
  on = hasAudio && !(muted.amb && muted.mus); levels();
  // It is always tried at once: a browser that will not hear of it leaves the sound suspended, and then the first tap
  // or key starts it. (Asking the browser first whether there has been a tap is no good: after a reload it says no,
  // yet lets sound play because the page before had one.)
  if (on) startSound().then(() => setTimeout(() => { if (on && !closed && !sound?.running()) arm(); }, 600));

  // ---- open
  hud.hidden = !debug; document.title = title(SCENES[name]);
  $('wz-stitle').firstChild.textContent = SCENES[name].title; $('wz-stitle').lastChild.textContent = seriesLine(SCENES[name]);
  $('wz-smark').addEventListener('click', (e) => { e.preventDefault(); if (!flight) $('wz-home').click(); });
  if (from) { place(from); paint(); fly(from, full(), 'a', () => { place(null); fit(); show(); }); }
  else { place(null); fit(); paint(); show(); }
  requestAnimationFrame(tick);

  function end() {
    closed = true; clearInterval(vtimer); stopStream(); awake?.release().catch(() => {}); document.removeEventListener('visibilitychange', wake2); sound?.stop(); clearTimeout(hide); clearTimeout(pending); swapping.forEach(clearTimeout);
    for (const [t, type] of listen) t.removeEventListener(type, refit);
    removeEventListener('keydown', show); removeEventListener('keydown', esc); root.remove();
  }
  return {
    get name() { return name; },
    get time() { return performance.now() / 1000 + skip; },
    // to: a rectangle to shrink back into before going; the page's own look is put back first so it shows through
    close({ to = null } = {}) {
      document.title = before.title; document.body.style.background = before.bg; document.documentElement.style.background = before.htmlBg; document.documentElement.style.overflow = before.overflow; document.documentElement.style.scrollbarGutter = before.gutter; document.documentElement.style.transition = document.body.style.transition = '';
      const meta = document.querySelector('meta[name=theme-color]'); if (meta && before.theme) meta.content = before.theme;
      if (isFull()) leaveFull.call(document);
      on = false; sound?.stop(); sound = null;   // the sound starts fading as the scene starts to leave
      if (to && !closed) fly(root.getBoundingClientRect(), to, 'b', end); else end();
    },
  };
}
