// Welcome and playback can overlap on a first visit to a scene URL.
// Closing the welcome must not release an active player's document scroll lock.
const locks = new Set();
let saved, frozen;
export function lockPage({ freeze = false } = {}) {
  const token = { freeze }, root = document.documentElement, body = document.body;
  if (!locks.size) {
    saved = { overflow: root.style.overflow, gutter: root.style.scrollbarGutter };
    root.style.overflow = 'hidden'; root.style.scrollbarGutter = 'auto';
  }
  if (freeze && !frozen) {
    frozen = { x: scrollX, y: scrollY,
      body: Object.fromEntries(['position', 'top', 'left', 'width'].map(key => [key, body.style[key]])) };
    Object.assign(body.style, { position: 'fixed', top: -frozen.y + 'px', left: -frozen.x + 'px', width: '100%' });
  }
  locks.add(token);
  return () => {
    if (!locks.delete(token)) return;
    if (!locks.size) {
      root.style.overflow = saved.overflow; root.style.scrollbarGutter = saved.gutter; saved = null;
    }
    if (frozen && ![...locks].some(lock => lock.freeze)) {
      Object.assign(body.style, frozen.body);
      window.scrollTo({ left: frozen.x, top: frozen.y, behavior: 'instant' }); frozen = null;
    }
  };
}
