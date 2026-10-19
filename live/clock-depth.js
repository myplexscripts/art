// Capture the coverage of real foreground objects while drawing the original art once.
import { DEPTH_LAYERS } from './depth-layers.js?v=20261019-after-hours-detail';
export const depthLayersFor = name => [{ id: 'front', label: 'In front' }, ...(DEPTH_LAYERS[name] ?? []).slice().reverse()];
const PAINT = new Set(['fill', 'stroke', 'fillRect', 'strokeRect', 'clearRect', 'drawImage', 'fillText', 'strokeText', 'putImageData']);
const STATE = ['globalAlpha', 'globalCompositeOperation', 'fillStyle', 'strokeStyle', 'lineWidth', 'lineCap', 'lineJoin', 'miterLimit', 'lineDashOffset', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'font', 'textAlign', 'textBaseline', 'direction', 'fontKerning', 'fontStretch', 'fontVariantCaps', 'letterSpacing', 'wordSpacing', 'filter', 'imageSmoothingEnabled', 'imageSmoothingQuality'];

export function makeDepthRenderer(base, foreground, background = '#000') {
  let selected = 'front', capturing = false;
  const methods = new Map();
  const print = document.createElement('canvas'), ink = print.getContext('2d');
  const context = new Proxy(base, {
    get(target, key) {
      if (key === 'depthSelection') return selected;
      if (key === 'depthLayer') return id => { if (id === selected) capturing = true; };
      // A scene with cached artwork can supply a matching cached foreground mask.
      if (key === 'depthMask') return (id, image, ...bounds) => {
        if (id === selected) { foreground.drawImage(image, ...bounds); capturing = true; }
      };
      const value = Reflect.get(target, key, target);
      if (typeof value !== 'function') return value;
      if (!methods.has(key)) methods.set(key, (...args) => {
        const result = value.apply(base, args);
        if (PAINT.has(key)) { if (capturing) foreground[key](...args); }
        else if (!/^(create|get|is|measure)/.test(key)) foreground[key](...args);
        return result;
      });
      return methods.get(key);
    },
    set(target, key, value) { Reflect.set(target, key, value, target); foreground[key] = value; return true; },
  });
  return (draw, layer, bounds) => {
    selected = layer; capturing = false;
    foreground.setTransform(1, 0, 0, 1, 0, 0);
    foreground.clearRect(0, 0, foreground.canvas.width, foreground.canvas.height);
    for (const key of STATE) if (base[key] !== undefined) foreground[key] = base[key];
    foreground.setLineDash(base.getLineDash());
    foreground.save(); foreground.beginPath();
    foreground.rect(bounds.x, bounds.y, bounds.width, bounds.height); foreground.clip();
    draw(context);
    foreground.restore();
    // Flatten only the clock-sized part of the print against its existing page ink.
    // Window scenes leave transparent pixels, which must not become more opaque
    // when the foreground is shown again above the clock.
    const x = Math.max(0, Math.floor(bounds.x)), y = Math.max(0, Math.floor(bounds.y));
    const width = Math.min(base.canvas.width, Math.ceil(bounds.x + bounds.width)) - x;
    const height = Math.min(base.canvas.height, Math.ceil(bounds.y + bounds.height)) - y;
    if (width <= 0 || height <= 0) return;
    if (print.width !== width || print.height !== height) { print.width = width; print.height = height; }
    ink.fillStyle = background; ink.fillRect(0, 0, width, height);
    ink.drawImage(base.canvas, x, y, width, height, 0, 0, width, height);
    // Keep the finished colours, including translucent and screen/multiply shading.
    foreground.save(); foreground.setTransform(1, 0, 0, 1, 0, 0);
    foreground.globalAlpha = 1; foreground.filter = 'none'; foreground.shadowBlur = 0; foreground.shadowColor = 'transparent';
    foreground.globalCompositeOperation = 'source-in';
    foreground.drawImage(print, x, y);
    foreground.restore();
  };
}
