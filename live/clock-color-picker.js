import { fromHex, hex } from './clock-palette.js';

export const COLOR_CSS = `
  .wz-color-editor { position: absolute; inset: 0; z-index: 5; pointer-events: none; color: #f2e5c3; font-family: var(--face, "Inter", system-ui, sans-serif); }
  .wz-color-editor[hidden], .wz-color-editor [hidden] { display: none; }
  .wz-color-panel { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); box-sizing: border-box; width: min(100%, 520px); max-height: 100%; overflow-y: auto; overscroll-behavior: contain; background: var(--paper); border-top: 2px solid #f2e5c3; padding: 20px max(20px, env(safe-area-inset-right, 0px)) calc(16px + env(safe-area-inset-bottom, 0px)) max(20px, env(safe-area-inset-left, 0px)); pointer-events: auto; }
  .wz-color-heading { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 16px; }
  .wz-color-heading strong { font-size: 20px; font-weight: 650; letter-spacing: -.035em; }
  .wz-color-scene { font-size: 10px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; text-align: right; }
  .wz-color-editor button { font: 600 12px/1.2 var(--face, "Inter", system-ui, sans-serif); color: inherit; cursor: pointer; background: none; }
  .wz-color-modes { display: flex; gap: 10px; margin-bottom: 18px; }
  .wz-color-mode { flex: 1; min-height: 40px; padding: 10px 12px; border: 1px solid #f2e5c366; border-radius: 8px; }
  .wz-color-mode[aria-pressed=true] { border-color: #dd7f45; color: #f0bd4d; }
  .wz-color-swatches { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
  .wz-color-option, .wz-color-custom { display: grid; gap: 9px; padding: 0; border: 0; text-align: center; min-width: 0; font-size: 11px; font-weight: 600; cursor: pointer; }
  .wz-color-chip { display: block; position: relative; height: 48px; border: 1px solid #f2e5c355; border-radius: 8px; background: var(--swatch, #fff); }
  .wz-color-option[aria-pressed=true] .wz-color-chip, .wz-color-custom[data-selected=true] .wz-color-chip { outline: 2px solid #dd7f45; outline-offset: 3px; }
  .wz-color-custom .wz-color-chip { background: conic-gradient(from 45deg, #c1a7c7, #dba2a7, #ddbc87, #a8c0a1, #9eb8d2, #c1a7c7); }
  .wz-color-custom[data-selected=true] .wz-color-chip { background: var(--swatch); }
  .wz-color-custom input[type=color] { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; padding: 0; border: 0; }
  .wz-color-editor button:focus-visible, .wz-color-hex:focus-visible, .wz-color-custom:focus-within { outline: 1px solid #f0bd4d; outline-offset: 5px; border-radius: 8px; }
  .wz-color-hex-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 16px; font-size: 12px; }
  .wz-color-hex { width: 104px; min-height: 36px; box-sizing: border-box; border: 1px solid #f2e5c366; border-radius: 6px; background: transparent; color: inherit; padding: 8px 10px; font: 500 13px/1 var(--face, "Inter", system-ui, sans-serif); }
  .wz-color-hex[aria-invalid=true] { border-color: #dd7f45; }
  .wz-color-footer { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 18px; }
  .wz-color-note { margin: 0; max-width: 300px; font-size: 11px; line-height: 1.5; }
  .wz-color-editor .wz-color-done { padding: 10px 0 8px; border: 0; border-bottom: 2px solid #dd7f45; letter-spacing: .06em; text-transform: uppercase; }
  .wz-color-option:disabled { opacity: .35; cursor: default; }
  @media (max-height: 480px) { .wz-color-panel { padding-top: 12px; padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px)); } .wz-color-heading { margin-bottom: 10px; } .wz-color-modes { margin-bottom: 12px; } .wz-color-chip { height: 40px; } .wz-color-option, .wz-color-custom { gap: 6px; } .wz-color-footer, .wz-color-hex-row { margin-top: 10px; } }
`;

export function makeColorPicker({ root, face, button, title, selected, getPalette, customColor, onSelect, onOpen, onClose }) {
  const editor = document.createElement('section'); editor.className = 'wz-color-editor'; editor.hidden = true;
  editor.id = 'wz-color-' + face.parentNode.id;
  editor.innerHTML = `<div class="wz-color-panel"><div class="wz-color-heading"><strong>Clock colour</strong><span class="wz-color-scene"></span></div><div class="wz-color-modes" role="group" aria-label="Clock colour mode"><button class="wz-color-mode" type="button" data-mode="adaptive">Adaptive</button><button class="wz-color-mode" type="button" data-mode="white">White</button></div><div class="wz-color-swatches" role="group" aria-label="Three poster colours and a custom colour"><label class="wz-color-custom"><span class="wz-color-chip"><input type="color" aria-label="Choose any clock colour"></span><span>Custom</span></label></div><label class="wz-color-hex-row" hidden>Hex colour<input class="wz-color-hex" type="text" inputmode="text" maxlength="7" spellcheck="false" autocomplete="off" aria-label="Custom clock hex colour"></label><div class="wz-color-footer"><p class="wz-color-note" aria-live="polite"></p><button class="wz-color-done" type="button">Done</button></div></div>`;
  root.append(editor); editor.querySelector('.wz-color-scene').textContent = title;
  const panel = editor.querySelector('.wz-color-panel'), viewport = window.visualViewport;
  const swatches = editor.querySelector('.wz-color-swatches'), custom = editor.querySelector('.wz-color-custom');
  const input = custom.querySelector('input'), text = editor.querySelector('.wz-color-hex'), hexRow = editor.querySelector('.wz-color-hex-row');
  const note = editor.querySelector('.wz-color-note'), done = editor.querySelector('.wz-color-done');
  const modes = [...editor.querySelectorAll('.wz-color-mode')];
  input.value = fromHex(customColor) ? customColor : '#b8c6d6';
  let active = false, colors = [];
  const presets = Array.from({ length: 3 }, (_, i) => {
    const preset = document.createElement('button'); preset.type = 'button'; preset.className = 'wz-color-option'; preset.dataset.colorIndex = i;
    preset.innerHTML = `<span class="wz-color-chip"></span><span>Colour ${i + 1}</span>`;
    preset.addEventListener('click', () => select({ mode: 'poster', rgb: [...colors[i]] })); swatches.insertBefore(preset, custom); return preset;
  });
  function select(value) { selected = value; onSelect(value); sync(); }
  function sync(value = selected) {
    selected = value;
    modes.forEach(mode => mode.setAttribute('aria-pressed', String(mode.dataset.mode === selected.mode)));
    presets.forEach((preset, i) => {
      preset.disabled = !colors[i];
      if (colors[i]) {
        preset.style.setProperty('--swatch', hex(colors[i]));
        preset.setAttribute('aria-label', `Poster colour ${i + 1}: ${hex(colors[i])}`);
      }
      preset.setAttribute('aria-pressed', String(selected.mode === 'poster' && colors[i] && hex(colors[i]) === hex(selected.rgb)));
    });
    const isCustom = selected.mode === 'custom'; custom.dataset.selected = String(isCustom); hexRow.hidden = !isCustom;
    if (isCustom) input.value = hex(selected.rgb);
    custom.style.setProperty('--swatch', input.value); text.value = input.value; text.removeAttribute('aria-invalid');
    note.textContent = selected.mode === 'adaptive' ? 'An opposing scene colour, settled at the clock’s position.' : selected.mode === 'white' ? 'Solid white. Tap the clock to restore your colour.' : 'Your chosen colour stays fixed. Saved for this scene.';
    const dot = button.querySelector('.wz-color-dot');
    dot.style.background = ['poster', 'custom'].includes(selected.mode) ? hex(selected.rgb) : selected.mode === 'white' ? '#fff' : 'linear-gradient(135deg, #f2e5c3 50%, #dd7f45 50%)';
  }
  function open() {
    if (active) return;
    active = true; onOpen(); colors = getPalette() ?? []; sync(); editor.hidden = false;
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'Clock colour: ' + title);
    button.setAttribute('aria-expanded', 'true');
    fitPanel(); viewport?.addEventListener('resize', fitPanel); viewport?.addEventListener('scroll', fitPanel); window.addEventListener('resize', fitPanel);
    (editor.querySelector('button[aria-pressed=true]') ?? (selected.mode === 'custom' ? input : modes[0])).focus();
  }
  function close(restoreFocus = true) {
    if (!active) return;
    active = false; editor.hidden = true;
    viewport?.removeEventListener('resize', fitPanel); viewport?.removeEventListener('scroll', fitPanel); window.removeEventListener('resize', fitPanel);
    for (const attr of ['role', 'aria-modal', 'aria-label']) root.removeAttribute(attr);
    button.setAttribute('aria-expanded', 'false'); onClose(); if (restoreFocus) button.focus();
  }
  function fitPanel() {
    if (!active) return;
    const frame = root.getBoundingClientRect();
    // Follow the visible viewport when a mobile keyboard covers the bottom of the art.
    panel.style.bottom = Math.max(0, frame.bottom - (viewport ? viewport.offsetTop + viewport.height : frame.bottom)) + 'px';
    panel.style.maxHeight = Math.min(frame.height, viewport?.height ?? frame.height) + 'px';
  }
  modes.forEach(mode => mode.addEventListener('click', () => select({ mode: mode.dataset.mode })));
  input.addEventListener('click', () => select({ mode: 'custom', rgb: fromHex(input.value) }));
  for (const event of ['input', 'change']) input.addEventListener(event, () => select({ mode: 'custom', rgb: fromHex(input.value) }));
  text.addEventListener('input', () => {
    const rgb = fromHex('#' + text.value.replace(/^#/, ''));
    text.setAttribute('aria-invalid', String(!rgb)); if (rgb) select({ mode: 'custom', rgb });
  });
  text.addEventListener('blur', () => { text.value = input.value; text.removeAttribute('aria-invalid'); });
  button.setAttribute('aria-controls', editor.id); button.setAttribute('aria-haspopup', 'dialog'); button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', open); done.addEventListener('click', () => close());
  root.addEventListener('pointerdown', e => { if (active && !e.defaultPrevented && !editor.contains(e.target) && !face.contains(e.target) && !button.contains(e.target)) close(false); });
  root.addEventListener('keydown', e => {
    if (!active || e.key !== 'Tab') return;
    const targets = [face, ...editor.querySelectorAll('button:not(:disabled), input')].filter(e => e.getClientRects().length);
    const index = targets.indexOf(document.activeElement), next = (index + (e.shiftKey ? -1 : 1) + targets.length) % targets.length;
    e.preventDefault(); targets[next].focus();
  });
  sync(); return { element: editor, open, close, sync, get active() { return active; } };
}
