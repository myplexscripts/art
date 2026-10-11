import { focusTimer, countdownText } from './focus-timer.js?v=20261011-focus-finish';
import { lockPage } from './scroll-lock.js?v=20261011-focus-finish';

const FACE = 'var(--face, "Barlow Condensed", system-ui, sans-serif)';
export const FOCUS_CSS = `
  .wz-focus-editor { position: absolute; inset: 0; z-index: 6; color: var(--ink, #f2e5c3); background: transparent; font-family: ${FACE}; }
  .wz-focus-editor[hidden], .wz-focus-editor [hidden], .scenes-focus-dock[hidden] { display: none !important; }
  .wz-focus-panel { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); box-sizing: border-box; width: min(100%, 520px); max-height: 100%; overflow-y: auto; overscroll-behavior: contain; touch-action: pan-y; background: var(--paper, #0e1c3a); border-top: 2px solid currentColor; padding: 18px max(20px, env(safe-area-inset-right, 0px)) calc(18px + env(safe-area-inset-bottom, 0px)) max(20px, env(safe-area-inset-left, 0px)); }
  .wz-focus-heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
  .wz-focus-heading h2 { margin: 0; color: inherit; font: 650 28px/1.1 ${FACE}; letter-spacing: -.02em; text-transform: none; }
  .wz-focus-editor button, .wz-focus-editor input { font: 600 18px/1.2 ${FACE}; color: inherit; }
  .wz-focus-editor button { cursor: pointer; background: none; border: 1px solid #f2e5c366; border-radius: 8px; min-height: 44px; padding: 10px 14px; }
  .wz-focus-editor button:focus-visible, .wz-focus-editor input:focus-visible { outline: 2px solid #dd7f45; outline-offset: 3px; }
  .wz-focus-heading .wz-focus-close { width: 44px; border: 0; padding: 10px; font-size: 28px; }
  .wz-focus-intro { font-size: 18px; line-height: 1.4; margin: 12px 0 18px; }
  .wz-focus-presets { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
  .wz-focus-presets button { padding: 12px 4px; }
  .wz-focus-editor button[aria-pressed=true] { border-color: #dd7f45; color: var(--sub, #f0bd4d); }
  .wz-focus-custom { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 16px 0; font-size: 18px; }
  .wz-focus-custom input { box-sizing: border-box; width: 100px; min-height: 44px; border: 1px solid #f2e5c366; border-radius: 8px; background: none; padding: 10px 12px; }
  .wz-focus-error { font-size: 16px; margin: 0 0 12px; color: var(--sub, #f0bd4d); }
  .wz-focus-editor .wz-focus-primary { background: #dd7f45; color: #101d33; border-color: #dd7f45; font-weight: 700; width: 100%; }
  .wz-focus-panel-time { display: block; margin: 12px 0 4px; font: 700 76px/1.1 ${FACE}; font-variant-numeric: tabular-nums; letter-spacing: 0; text-align: center; }
  .wz-focus-status { text-align: center; font-size: 18px; margin: 6px 0 16px; }
  .wz-focus-progress { height: 3px; background: #f2e5c333; margin-bottom: 20px; overflow: hidden; }
  .wz-focus-progress span { display: block; height: 100%; background: #dd7f45; transform: scaleX(var(--progress, 0)); transform-origin: left; }
  .wz-focus-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .wz-focus-actions .wz-focus-primary { grid-column: 1 / -1; }
  .wz-focus-finished p { font-size: 20px; line-height: 1.4; margin: 18px 0; }
  .wz-focus-sound { display: flex; align-items: center; justify-content: space-between; gap: 12px; border-top: 1px solid #f2e5c344; margin-top: 20px; padding-top: 14px; }
  .wz-focus-sound button { font-size: 16px; }
  .wz-focus-sound button em { font-style: normal; color: var(--sub, #f0bd4d); margin-left: 8px; }
  .wz-focus-editor .wz-focus-preview { border: 0; text-decoration: underline; text-underline-offset: 5px; }
  .wz-focus-live { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  .scenes-focus-dock { position: fixed; z-index: 8; right: max(16px, env(safe-area-inset-right, 0px)); bottom: calc(16px + env(safe-area-inset-bottom, 0px)); max-width: calc(100% - 32px); display: flex; align-items: center; gap: 14px; border: 1px solid var(--gallery-accent, #dd7f45); border-radius: 10px; padding: 14px 18px; background: var(--gallery-paper, #f2e5c3); color: var(--gallery-ink, #0e1c3a); font: 600 18px/1.2 ${FACE}; cursor: pointer; }
  .scenes-focus-dock em { font-style: normal; font-variant-numeric: tabular-nums; }
  body:has(.wz-player) .scenes-focus-dock { display: none; }
  .wz-focus-gallery { position: fixed; z-index: 20; --paper: var(--gallery-paper, #f2e5c3); --ink: var(--gallery-ink, #0e1c3a); --sub: var(--gallery-accent, #8f4520); }
  .wz-focus-gallery button, .wz-focus-gallery input { border-color: color-mix(in srgb, currentColor 35%, transparent); }
  .wz-focus-gallery .wz-focus-sound { border-color: color-mix(in srgb, currentColor 20%, transparent); }
  @media (max-height: 480px) { .wz-focus-panel { padding-top: 10px; } .wz-focus-panel-time { font-size: 52px; margin-top: 4px; } .wz-focus-intro { margin: 6px 0 10px; } .wz-focus-sound { margin-top: 12px; padding-top: 8px; } }
`;

let id = 0;
export function makeFocusPanel({ root, button, onOpen = () => {}, onClose = () => {}, gallery = false }) {
  const editor = document.createElement('section'); editor.className = 'wz-focus-editor' + (gallery ? ' wz-focus-gallery' : '');
  editor.id = 'scenes-focus-panel-' + ++id; editor.hidden = true; editor.setAttribute('role', 'dialog'); editor.setAttribute('aria-modal', 'true');
  editor.innerHTML = `<div class="wz-focus-panel"><div class="wz-focus-heading"><h2 id="${editor.id}-title">Focus timer</h2><button type="button" class="wz-focus-close" aria-label="Close focus controls">×</button></div>
    <form class="wz-focus-settings"><p class="wz-focus-intro">One scene. A little space to concentrate.</p><div class="wz-focus-presets" role="group" aria-label="Focus duration">${[15, 25, 45, 60].map(minutes => `<button type="button" data-minutes="${minutes}" aria-pressed="${minutes === 25}">${minutes} min</button>`).join('')}</div><label class="wz-focus-custom">Choose your minutes<input type="number" min="1" max="99" step="1" value="25" required inputmode="numeric" aria-label="Focus duration in minutes" aria-describedby="${editor.id}-error"></label><p class="wz-focus-error" id="${editor.id}-error" role="alert" hidden>Choose a whole number from 1 to 99 minutes.</p><button class="wz-focus-primary" type="submit">Start focus</button></form>
    <div class="wz-focus-session" hidden><time class="wz-focus-panel-time">25:00</time><p class="wz-focus-status"></p><div class="wz-focus-progress" role="progressbar" aria-label="Session progress" aria-valuemin="0" aria-valuemax="100"><span></span></div><div class="wz-focus-actions"><button type="button" class="wz-focus-primary wz-focus-pause">Pause</button><button type="button" class="wz-focus-restart">Restart</button><button type="button" class="wz-focus-end">End timer</button></div></div>
    <div class="wz-focus-finished" hidden><p class="wz-focus-finish-copy"></p><div class="wz-focus-actions"><button type="button" class="wz-focus-primary wz-focus-next">Start a 5-minute break</button><button type="button" class="wz-focus-new">New focus</button><button type="button" class="wz-focus-done">Done</button></div></div>
    <div class="wz-focus-sound"><button type="button" class="wz-focus-chime" role="switch" aria-checked="true">Soft Arrival<em>on</em></button><button type="button" class="wz-focus-preview">Preview chime</button></div><p class="wz-focus-live" role="status"></p></div>`;
  editor.setAttribute('aria-labelledby', editor.id + '-title'); root.append(editor);
  const $ = cls => editor.querySelector('.' + cls), panel = $('wz-focus-panel'), input = editor.querySelector('input');
  const viewport = window.visualViewport, presets = [...editor.querySelectorAll('[data-minutes]')];
  let active = false, unlock = null;
  function fit() {
    const frame = root === document.body ? { bottom: innerHeight, height: innerHeight } : root.getBoundingClientRect();
    panel.style.bottom = Math.max(0, frame.bottom - (viewport ? viewport.offsetTop + viewport.height : frame.bottom)) + 'px';
    panel.style.maxHeight = `calc(${Math.max(1, Math.min(frame.height, viewport?.height ?? frame.height))}px - env(safe-area-inset-top, 0px) - 8px)`;
  }
  function open() {
    if (active) return;
    active = true; onOpen(); if (gallery) unlock = lockPage();
    editor.hidden = false; button.setAttribute('aria-expanded', 'true'); fit();
    viewport?.addEventListener('resize', fit); viewport?.addEventListener('scroll', fit); window.addEventListener('resize', fit);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) panel.animate([{ transform: 'translate(-50%, 18px)', opacity: 0 }, { transform: 'translate(-50%, 0)', opacity: 1 }], { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' });
    $('wz-focus-close').focus();
  }
  function close(restoreFocus = true) {
    if (!active) return;
    active = false; editor.hidden = true; button.setAttribute('aria-expanded', 'false');
    viewport?.removeEventListener('resize', fit); viewport?.removeEventListener('scroll', fit); window.removeEventListener('resize', fit);
    unlock?.(); unlock = null; onClose(); if (restoreFocus && button.isConnected) button.focus();
  }
  function render(state) {
    const done = state.status === 'completed', running = state.active && !done, paused = state.status === 'paused';
    $('wz-focus-settings').hidden = state.active; $('wz-focus-session').hidden = !running; $('wz-focus-finished').hidden = !done;
    editor.querySelector('h2').textContent = done ? (state.kind === 'focus' ? 'Nicely done.' : 'Break complete.') : running ? (state.kind === 'focus' ? 'Focusing' : 'Taking a break') : 'Focus timer';
    $('wz-focus-panel-time').textContent = countdownText(state.seconds);
    $('wz-focus-status').textContent = paused ? 'Paused. Take your time.' : `${Math.round(state.duration / 60000)} minutes · ${state.kind === 'focus' ? 'a little room to concentrate' : 'a moment to reset'}`;
    $('wz-focus-pause').textContent = paused ? 'Resume' : 'Pause';
    const progress = state.active ? Math.max(0, Math.min(1, 1 - state.remaining / state.duration)) : 0;
    $('wz-focus-progress').style.setProperty('--progress', progress); $('wz-focus-progress').setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    $('wz-focus-finish-copy').textContent = state.kind === 'focus' ? 'Your focus session is complete. A short break is waiting when you are.' : 'A little refreshed. Start again whenever you’re ready.';
    $('wz-focus-next').textContent = state.kind === 'focus' ? 'Start a 5-minute break' : 'Start another focus';
    $('wz-focus-chime').setAttribute('aria-checked', String(state.soundEnabled)); $('wz-focus-chime').querySelector('em').textContent = state.soundEnabled ? 'on' : 'off';
    if (state.status === 'completed' && !editor.dataset.completed) $('wz-focus-live').textContent = state.kind === 'focus' ? 'Focus complete.' : 'Break complete.';
    editor.dataset.completed = done ? '1' : '';
    if (active) fit();
  }
  const unsubscribe = focusTimer.subscribe(render);
  presets.forEach(preset => preset.addEventListener('click', () => {
    input.value = preset.dataset.minutes; input.dispatchEvent(new Event('input'));
  }));
  input.addEventListener('input', () => { presets.forEach(preset => preset.setAttribute('aria-pressed', String(Number(preset.dataset.minutes) === Number(input.value)))); $('wz-focus-error').hidden = true; input.removeAttribute('aria-invalid'); });
  $('wz-focus-settings').noValidate = true;
  $('wz-focus-settings').addEventListener('submit', event => {
    event.preventDefault();
    if (!focusTimer.start(Number(input.value))) { $('wz-focus-error').hidden = false; input.setAttribute('aria-invalid', 'true'); input.focus(); return; }
    input.removeAttribute('aria-invalid'); close();
  });
  $('wz-focus-pause').addEventListener('click', () => focusTimer.snapshot().status === 'paused' ? focusTimer.resume() : focusTimer.pause());
  $('wz-focus-restart').addEventListener('click', () => focusTimer.restart());
  $('wz-focus-end').addEventListener('click', () => { focusTimer.stop(); $('wz-focus-settings').querySelector('button[type=submit]').focus(); });
  $('wz-focus-done').addEventListener('click', () => { focusTimer.stop(); close(); });
  $('wz-focus-next').addEventListener('click', () => { const completed = focusTimer.snapshot(); focusTimer.start(completed.kind === 'focus' ? 5 : 25, completed.kind === 'focus' ? 'break' : 'focus'); close(); });
  $('wz-focus-new').addEventListener('click', () => { focusTimer.stop(); $('wz-focus-settings').querySelector('button[type=submit]').focus(); });
  $('wz-focus-chime').addEventListener('click', () => focusTimer.setSound(!focusTimer.snapshot().soundEnabled));
  $('wz-focus-preview').addEventListener('click', () => { focusTimer.preview().then(played => { $('wz-focus-live').textContent = played ? 'Playing Soft Arrival.' : 'Tap Preview chime to try again.'; }); });
  $('wz-focus-close').addEventListener('click', () => close());
  button.setAttribute('aria-controls', editor.id); button.setAttribute('aria-haspopup', 'dialog'); button.setAttribute('aria-expanded', 'false'); button.addEventListener('click', open);
  editor.addEventListener('pointerdown', event => { if (event.target === editor) close(); });
  editor.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
    if (event.key !== 'Tab') return;
    const targets = [...editor.querySelectorAll('button:not(:disabled), input:not(:disabled)')].filter(target => target.getClientRects().length);
    const index = targets.indexOf(document.activeElement), next = (index + (event.shiftKey ? -1 : 1) + targets.length) % targets.length;
    event.preventDefault(); targets[next].focus();
  });
  return { element: editor, open, close, get active() { return active; }, destroy() { close(false); unsubscribe(); button.removeEventListener('click', open); editor.remove(); } };
}

// A small gallery control keeps a running timer accessible after leaving a scene.
let galleryPanel;
export function installGalleryFocus() {
  if (galleryPanel) return;
  if (!document.getElementById('scenes-focus-css')) document.head.append(Object.assign(document.createElement('style'), { id: 'scenes-focus-css', textContent: FOCUS_CSS }));
  const dock = document.createElement('button'); dock.className = 'scenes-focus-dock'; dock.type = 'button'; dock.hidden = true;
  dock.innerHTML = '<span>Focus</span><em></em>'; document.body.append(dock);
  galleryPanel = makeFocusPanel({ root: document.body, button: dock, gallery: true });
  let previousStatus = null;
  const announce = document.createElement('p'); announce.className = 'wz-focus-live'; announce.setAttribute('role', 'status'); document.body.append(announce);
  focusTimer.subscribe(state => {
    dock.hidden = !state.active || (state.status === 'completed' && !state.completionVisible);
    dock.querySelector('span').textContent = state.kind === 'focus' ? 'Focus' : 'Break';
    dock.querySelector('em').textContent = state.status === 'completed' ? 'complete' : state.status === 'paused' ? 'paused · ' + countdownText(state.seconds) : countdownText(state.seconds);
    dock.setAttribute('aria-label', `${state.kind === 'focus' ? 'Focus' : 'Break'} timer: ${dock.querySelector('em').textContent}. Open controls.`);
    if (state.status === 'completed' && previousStatus !== 'completed') announce.textContent = state.kind === 'focus' ? 'Focus session complete.' : 'Break complete.';
    if (!state.completionVisible) announce.textContent = '';
    previousStatus = state.status;
  });
}

if (document.body) installGalleryFocus();
else document.addEventListener('DOMContentLoaded', installGalleryFocus, { once: true });
