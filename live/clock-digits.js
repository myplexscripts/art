// Fixed character slots keep the time still, including one/two-digit hour changes.
// Only a changed character rolls; sizing never depends on the currently displayed digits.
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const normalize = text => text.replace(/[\u00a0\u202f]/g, ' ');
const numeric = type => ['hour', 'minute', 'second'].includes(type);
export const CLOCK_LINE_HEIGHT = 1.12;

export function makeClockDigits(face, formatter) {
  const parts = date => formatter.formatToParts(date).map(part => ({ ...part, value: normalize(part.value) }));
  const samples = Array.from({ length: 24 }, (_, hour) => {
    const date = new Date(); date.setHours(hour, 37, 0, 0); return parts(date);
  });
  const schema = samples[0].map((part, index) => ({ type: part.type,
    length: Math.max(...samples.map(sample => [...sample[index].value].length)),
    letters: new Set(samples.flatMap(sample => [...sample[index].value])), slots: [] }));
  const options = formatter.resolvedOptions();
  const numbers = new Intl.NumberFormat(options.locale, { numberingSystem: options.numberingSystem, useGrouping: false });
  const digits = new Set(Array.from({ length: 10 }, (_, n) => numbers.format(n)));
  const run = document.createElement('span'); run.className = 'wz-clock-run'; run.setAttribute('aria-hidden', 'true');
  face.append(run);
  for (const part of schema) for (let i = 0; i < part.length; i++) {
    const element = document.createElement('span'); element.className = 'wz-clock-slot'; element.dataset.part = part.type;
    run.append(element); part.slots.push({ element, glyph: null, motions: [], char: null, widthEm: 0 });
  }
  const context = document.createElement('canvas').getContext('2d');
  let widthEm = 0, value = '', pulse = null, family = '', boundsCache = null;
  function measure() {
    family = getComputedStyle(face).fontFamily; boundsCache = null;
    const cache = new Map();
    const width = chars => {
      const key = [...chars].sort().join('');
      if (cache.has(key)) return cache.get(key);
      let widest = 0;
      // Reserve enough space for every loaded weight, so swiping weight cannot reflow slots either.
      for (let weight = 100; weight <= 900; weight += 100) {
        context.font = `${weight} 200px ${family}`;
        for (const char of chars) {
          const metric = context.measureText(char);
          widest = Math.max(widest, metric.width, (metric.actualBoundingBoxLeft ?? 0) + (metric.actualBoundingBoxRight ?? 0));
        }
      }
      const result = widest / 200 + .004;
      cache.set(key, result); return result;
    };
    widthEm = 0;
    for (const part of schema) for (const [index, slot] of part.slots.entries()) {
      const characters = numeric(part.type) ? digits : part.type === 'literal'
        ? new Set(samples.flatMap(sample => [...sample[schema.indexOf(part)].value][index] ?? ' ')) : part.letters;
      slot.widthEm = width(characters); widthEm += slot.widthEm; slot.element.style.width = slot.widthEm + 'em';
    }
    centerPulse();
  }
  function bounds(force = false) {
    let offset = 0, index = 0, first = null, last = null;
    for (const part of schema) for (const slot of part.slots) {
      if (slot.char?.trim()) { first ??= { slot, offset, index }; last = { slot, offset, index }; }
      offset += slot.widthEm; index++;
    }
    if (!first) return { left: 0, right: widthEm };
    const weight = face.style.fontWeight || getComputedStyle(face).fontWeight;
    const pixels = parseFloat(face.style.fontSize) || parseFloat(getComputedStyle(face).fontSize) || 200;
    const key = `${first.index}:${last.index}:${weight}:${pixels}`;
    if (!force && boundsCache?.key === key) return boundsCache.rect;
    context.font = `${weight} ${pixels}px ${family}`;
    const start = context.measureText(first.slot.char), end = context.measureText(last.slot.char);
    const rect = { left: first.offset + (first.slot.widthEm - start.width / pixels) / 2 - (start.actualBoundingBoxLeft ?? 0) / pixels,
      right: last.offset + (last.slot.widthEm - end.width / pixels) / 2 + (end.actualBoundingBoxRight ?? end.width) / pixels };
    // Freeze these placement measurements between gestures and hour-field changes.
    // A thin minute digit can replace a wide one without shifting every other cell.
    boundsCache = { key, rect }; return rect;
  }
  function centerPulse() {
    const { left, right } = bounds();
    run.style.transformOrigin = `${(left + right) / 2 / widthEm * 100}% 50%`;
  }
  function refreshBounds() { const rect = bounds(true); centerPulse(); return rect; }
  function cancelMotions(slot) {
    for (const animation of slot.motions) { animation.onfinish = null; animation.cancel(); }
    slot.motions = [];
  }
  function change(slot, char, animate) {
    if (slot.char === char) return;
    cancelMotions(slot);
    const old = slot.glyph, next = document.createElement('span'); next.className = 'wz-clock-glyph'; next.textContent = char;
    slot.char = char; slot.glyph = next; slot.element.dataset.char = char;
    slot.element.replaceChildren(...(old && animate && !reduced() ? [old, next] : [next]));
    if (!old || !animate || reduced()) return;
    const timing = { duration: 480, easing: 'cubic-bezier(.22,1,.36,1)' };
    const out = old.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], { ...timing, fill: 'forwards' });
    const incoming = next.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], timing);
    slot.motions = [out, incoming];
    incoming.onfinish = () => { if (slot.glyph === next) { old.remove(); out.cancel(); slot.motions = []; } };
  }
  function update(date, animate = true) {
    const current = parts(date); value = current.map(part => part.value).join(''); face.dataset.time = value;
    schema.forEach((part, index) => {
      const characters = [...current[index].value], padding = Array(part.length - characters.length).fill(' ');
      const fixed = numeric(part.type) ? [...padding, ...characters] : [...characters, ...padding];
      part.slots.forEach((slot, i) => change(slot, fixed[i], animate));
    });
    centerPulse();
    return value;
  }
  function cancelPulse() { pulse?.cancel(); pulse = null; }
  function held() {
    cancelPulse(); if (reduced()) return;
    pulse = run.animate([{ transform: 'scale(1)', easing: 'ease-out' },
      { transform: 'scale(.95)', offset: .28, easing: 'cubic-bezier(.22,1,.36,1)' },
      { transform: 'scale(1.025)', offset: .72, easing: 'ease-in-out' }, { transform: 'scale(1)' }],
    { duration: 460, easing: 'linear' });
  }
  measure();
  return { update, measure, held, cancelPulse, bounds, refreshBounds, get widthEm() { return widthEm; }, get value() { return value; },
    destroy() { cancelPulse(); schema.forEach(part => part.slots.forEach(cancelMotions)); } };
}
