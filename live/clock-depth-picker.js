// A live, full-screen clock editor with one mark for each authored scene boundary.
export const DEPTH_CSS = `
  .wz-depth-editor { position: absolute; inset: 0; z-index: 5; pointer-events: none; color: #f2e5c3; font-family: "Inter", system-ui, sans-serif; }
  .wz-depth-editor[hidden] { display: none; }
  .wz-depth-top { position: absolute; left: max(20px, env(safe-area-inset-left, 0px)); top: calc(22px + env(safe-area-inset-top, 0px)); display: grid; gap: 6px; background: var(--paper); padding: 10px 14px; border-radius: 12px; }
  .wz-depth-top strong { font-size: 20px; font-weight: 650; letter-spacing: -.035em; }
  .wz-depth-scene { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
  .wz-depth-rail { position: absolute; right: max(10px, env(safe-area-inset-right, 0px)); top: calc(50% - 52px); transform: translateY(-50%); display: grid; padding: 6px 3px; background: var(--paper); border: 1px solid #f2e5c344; border-radius: 28px; pointer-events: auto; }
  .wz-depth-mark { width: 56px; min-height: 48px; padding: 0; display: grid; place-items: center; background: none; border: 0; cursor: pointer; touch-action: manipulation; }
  .wz-depth-mark::before { content: ''; display: block; width: 24px; height: 2px; border-radius: 2px; background: #f2e5c3; transition: width .25s ease, background .25s ease; }
  .wz-depth-mark[aria-checked=true]::before { width: 42px; height: 3px; background: #dd7f45; }
  .wz-depth-mark:focus-visible { outline: 1px solid #dd7f45; outline-offset: -4px; border-radius: 22px; }
  .wz-depth-bottom { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px max(20px, env(safe-area-inset-right, 0px)) calc(18px + env(safe-area-inset-bottom, 0px)) max(20px, env(safe-area-inset-left, 0px)); border-top: 2px solid #f2e5c3; background: var(--paper); pointer-events: auto; }
  .wz-depth-description { margin: 0 0 12px; font-size: 12px; line-height: 1.5; }
  .wz-depth-description strong { display: block; font-size: 15px; font-weight: 650; margin-bottom: 5px; }
  .wz-depth-actions { display: flex; justify-content: space-between; gap: 20px; }
  .wz-depth-actions button { border: 0; border-bottom: 2px solid #dd7f45; background: none; color: inherit; padding: 10px 0 8px; font: 650 13px/1 "Inter", system-ui, sans-serif; letter-spacing: .06em; text-transform: uppercase; cursor: pointer; }
  .wz-depth-actions button:focus-visible { outline: 1px solid #dd7f45; outline-offset: 5px; }
  .wz-depth-bounds { position: absolute; box-sizing: border-box; border: 1px dashed #f2e5c399; border-radius: 12px; pointer-events: none; }
  @media (max-height: 480px) { .wz-depth-top { top: calc(14px + env(safe-area-inset-top, 0px)); } .wz-depth-bottom { padding-top: 10px; padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px)); } .wz-depth-description { margin-bottom: 3px; } .wz-depth-description strong { font-size: 13px; } .wz-depth-mark { min-height: 40px; } }
  @media (prefers-reduced-motion: reduce) { .wz-depth-mark::before { transition: none; } }
`;

export function makeDepthPicker({ root, face, button, title, options, selected, onSelect, onOpen, onClose }) {
  const editor = document.createElement('section'); editor.className = 'wz-depth-editor'; editor.hidden = true;
  editor.innerHTML = `<div class="wz-depth-top"><strong>Clock depth</strong><span class="wz-depth-scene"></span></div><div class="wz-depth-bounds" aria-hidden="true"></div><div class="wz-depth-rail" role="radiogroup" aria-label="Clock layer"></div><div class="wz-depth-bottom"><p class="wz-depth-description"><strong class="wz-depth-current" aria-live="polite"></strong>Tap a line to choose a layer. Hold the clock to move it.</p><div class="wz-depth-actions"><button class="wz-depth-reset" type="button">In front</button><button class="wz-depth-done" type="button">Done</button></div></div>`;
  editor.id = 'wz-depth-' + face.parentNode.id; root.append(editor);
  editor.querySelector('.wz-depth-scene').textContent = title;
  const rail = editor.querySelector('.wz-depth-rail'), current = editor.querySelector('.wz-depth-current'), bounds = editor.querySelector('.wz-depth-bounds');
  const reset = editor.querySelector('.wz-depth-reset'), done = editor.querySelector('.wz-depth-done');
  const marks = options.map(option => {
    const mark = document.createElement('button'); mark.className = 'wz-depth-mark'; mark.type = 'button'; mark.dataset.layer = option.id;
    const label = option.id === 'front' ? option.label : 'Behind ' + option.label.toLowerCase();
    mark.setAttribute('role', 'radio'); mark.setAttribute('aria-label', label); mark.title = label;
    mark.addEventListener('click', () => { select(option.id); mark.focus(); }); rail.append(mark); return mark;
  });
  let active = false;
  function select(id) { selected = id; onSelect(id); sync(); }
  function sync() {
    marks.forEach(mark => { const checked = mark.dataset.layer === selected; mark.setAttribute('aria-checked', String(checked)); mark.tabIndex = checked ? 0 : -1; });
    const option = options.find(o => o.id === selected);
    current.textContent = selected === 'front' ? 'Clock in front' : 'Behind ' + option.label.toLowerCase();
    button.setAttribute('aria-pressed', String(selected !== 'front'));
    button.querySelector('em').textContent = selected === 'front' ? 'off' : 'on';
  }
  function open() {
    if (active) return;
    active = true; onOpen(); editor.hidden = false; root.classList.add('depth-editing');
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'Clock depth: ' + title);
    button.setAttribute('aria-expanded', 'true'); updateBounds(); marks.find(m => m.dataset.layer === selected).focus();
  }
  function close(restoreFocus = true) {
    if (!active) return;
    active = false; editor.hidden = true; root.classList.remove('depth-editing');
    for (const attribute of ['role', 'aria-modal', 'aria-label']) root.removeAttribute(attribute);
    button.setAttribute('aria-expanded', 'false'); onClose(); if (restoreFocus) button.focus();
  }
  function updateBounds() {
    if (!active) return;
    const r = face.getBoundingClientRect(), p = root.getBoundingClientRect();
    Object.assign(bounds.style, { left: r.left - p.left + 'px', top: r.top - p.top + 'px', width: r.width + 'px', height: r.height + 'px' });
  }
  rail.addEventListener('keydown', e => {
    const index = options.findIndex(o => o.id === selected); let next;
    if (['ArrowDown', 'ArrowRight'].includes(e.key)) next = Math.min(options.length - 1, index + 1);
    else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) next = Math.max(0, index - 1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = options.length - 1;
    else return;
    e.preventDefault(); e.stopPropagation(); select(options[next].id); marks[next].focus();
  });
  root.addEventListener('keydown', e => {
    if (!active || e.key !== 'Tab') return;
    const targets = [face, marks.find(m => m.dataset.layer === selected), reset, done];
    const index = targets.indexOf(document.activeElement), next = (index + (e.shiftKey ? -1 : 1) + targets.length) % targets.length;
    e.preventDefault(); targets[next].focus();
  });
  button.setAttribute('aria-controls', editor.id); button.setAttribute('aria-haspopup', 'dialog'); button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', open); reset.addEventListener('click', () => select('front')); done.addEventListener('click', () => close()); sync();
  return { element: editor, open, close, updateBounds, get active() { return active; } };
}
