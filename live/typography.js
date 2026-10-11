// One fixed face for the interface, clocks and canvas lettering.
export const FONT = '"Barlow Condensed", system-ui, sans-serif';
export const MIN_FONT_SIZE = 12, TEXT_SCALE = 1.2;

// Load every weight before fitting the clock, so later weight gestures keep the same face.
export const fontReady = Promise.all(Array.from({ length: 9 }, (_, i) =>
  document.fonts.load(`${(i + 1) * 100} 32px ${FONT}`, 'Scenes 0123456789: AM PM')
)).catch(() => {});

// Canvas captions need a CSS-pixel minimum independent of canvas resolution or device scale.
export function scalePosterText(spec, { VW, VH, cssWidth = VW, margin }) {
  const scale = Math.max(TEXT_SCALE, MIN_FONT_SIZE * VW / Math.max(1, cssWidth) / spec.series.size);
  const bottom = VH - margin;
  const text = item => ({ ...item, size: item.size * scale, y: bottom + (item.y - bottom) * scale });
  return { ...spec, band: spec.band * scale, mark: text(spec.mark), title: text(spec.title),
    series: text(spec.series), rule: { ...spec.rule, y: bottom + (spec.rule.y - bottom) * scale } };
}
