// One timer follows the user between scenes and the gallery. Deadlines, rather
// than decremented counters, stay accurate when a mobile browser suspends a tab.
const KEY = 'scenes-focus-v1', SOUND_KEY = 'scenes-focus-chime';
const CHIME = new URL('./audio/scenes-chime.mp3', import.meta.url);
const MAX_DURATION = 99 * 60000;
const COMPLETION_NOTICE_MS = 5000;
const listeners = new Set();
const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
const write = (key, value) => { try { value === null ? localStorage.removeItem(key) : localStorage.setItem(key, value); } catch {} };
let state = null, scheduled = 0, context = null, buffer = null, source = null, alerting = null;
let soundEnabled = read(SOUND_KEY) !== '0';
function restore(raw) {
  try {
    const saved = JSON.parse(raw);
    if (saved && typeof saved.id === 'string' && ['focus', 'break'].includes(saved.kind)
      && ['running', 'paused', 'completed'].includes(saved.status)
      && Number.isFinite(saved.duration) && saved.duration >= 60000 && saved.duration <= MAX_DURATION
      && Number.isFinite(saved.remaining) && saved.remaining >= 0 && saved.remaining <= saved.duration
      && (saved.status !== 'running' || Number.isFinite(saved.deadline))) return saved;
  } catch {}
  return null;
}
state = restore(read(KEY));

const remaining = () => !state || state.status === 'completed' ? 0
  : state.status === 'running' ? Math.max(0, Math.min(state.duration, state.deadline - Date.now())) : state.remaining;
const noticeRemaining = () => state?.status === 'completed' && Number.isFinite(state.completedAt)
  ? Math.max(0, state.completedAt + COMPLETION_NOTICE_MS - Date.now()) : 0;
const persist = () => write(KEY, state ? JSON.stringify(state) : null);
const snapshot = () => { const left = remaining(); return { ...(state ?? { status: 'idle', kind: 'focus', duration: 25 * 60000 }),
  active: Boolean(state), remaining: left, seconds: Math.ceil(left / 1000), soundEnabled, completionVisible: noticeRemaining() > 0 }; };
const emit = () => { const value = snapshot(); for (const fn of listeners) fn(value); };

function prepareChime() {
  const AudioContext = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContext) return null;
  try {
    context ??= new AudioContext();
    // Resume and start a silent buffer synchronously within the user's tap on iOS.
    context.resume().catch(() => {});
    const silent = context.createBufferSource();
    silent.buffer = context.createBuffer(1, 1, context.sampleRate);
    silent.connect(context.destination); silent.start();
    buffer ??= fetch(CHIME).then(response => {
      if (!response.ok) throw new Error('Chime unavailable');
      return response.arrayBuffer();
    }).then(bytes => context.decodeAudioData(bytes)).catch(() => { buffer = null; return null; });
    return buffer;
  } catch { return null; }
}

async function playChime(shouldPlay = () => true) {
  const ready = prepareChime();
  if (!ready) return false;
  const audio = await ready;
  if (!audio || !shouldPlay() || document.visibilityState !== 'visible') return false;
  try {
    await context.resume();
    if (context.state !== 'running' || !shouldPlay() || document.visibilityState !== 'visible') return false;
    source?.stop();
    const next = context.createBufferSource(); next.buffer = audio;
    next.connect(context.destination); source = next;
    next.onended = () => { next.disconnect(); if (source === next) source = null; };
    next.start(); return true;
  } catch { return false; }
}

function notify() {
  if (state?.status !== 'completed' || state.notified || document.visibilityState !== 'visible' || alerting === state.id) return;
  if (soundEnabled && !context) return;
  const id = state.id; alerting = id;
  state.notified = true; persist();
  const finish = () => { if (state?.id === id) { state.notified = true; persist(); } if (alerting === id) alerting = null; };
  if (!soundEnabled) finish();
  else playChime(() => state?.id === id && state.status === 'completed').then(finish, finish);
}

function tick() {
  clearTimeout(scheduled);
  const left = remaining();
  if (state?.status === 'running' && left <= 0) {
    state = { ...state, status: 'completed', remaining: 0, deadline: null, completedAt: Date.now(), notified: false };
    persist();
  }
  emit(); notify();
  if (state?.status === 'running') scheduled = setTimeout(tick, Math.max(40, left % 1000 || 1000) + 15);
  else if (noticeRemaining() > 0) scheduled = setTimeout(tick, noticeRemaining() + 15);
}

export const focusTimer = {
  snapshot,
  subscribe(fn) { listeners.add(fn); fn(snapshot()); return () => listeners.delete(fn); },
  start(minutes = 25, kind = 'focus') {
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 99 || !['focus', 'break'].includes(kind)) return false;
    if (soundEnabled) prepareChime();
    source?.stop(); source = null;
    const duration = minutes * 60000;
    state = { id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`, kind,
      status: 'running', duration, remaining: duration, deadline: Date.now() + duration, notified: false };
    persist(); tick(); return true;
  },
  pause() {
    if (state?.status !== 'running') return;
    const left = remaining();
    if (!left) { tick(); return; }
    state = { ...state, status: 'paused', remaining: left, deadline: null }; persist(); tick();
  },
  resume() {
    if (state?.status !== 'paused') return;
    if (soundEnabled) prepareChime();
    state = { ...state, status: 'running', deadline: Date.now() + state.remaining }; persist(); tick();
  },
  restart() { if (state) this.start(state.duration / 60000, state.kind); },
  stop() { source?.stop(); source = null; state = null; persist(); tick(); },
  setSound(enabled) {
    soundEnabled = Boolean(enabled); write(SOUND_KEY, soundEnabled ? '1' : '0');
    if (soundEnabled) prepareChime(); else { source?.stop(); source = null; }
    emit();
  },
  preview: playChime,
};

export const countdownText = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
export const countdownFormatter = {
  resolvedOptions: () => ({ locale: 'en', numberingSystem: 'latn' }),
  formatToParts(value) {
    const [minute, second] = countdownText(typeof value === 'number' ? value : 5999).split(':');
    return [{ type: 'minute', value: minute }, { type: 'literal', value: ':' }, { type: 'second', value: second }];
  },
};

// Storage changes keep multiple open app windows in agreement.
window.addEventListener('storage', event => {
  if (event.key === KEY) {
    state = restore(event.newValue);
    tick();
  } else if (event.key === SOUND_KEY) { soundEnabled = event.newValue !== '0'; emit(); }
});
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') tick(); });
document.addEventListener('pointerup', () => {
  if (soundEnabled && state?.status === 'completed' && !state.notified) { prepareChime(); notify(); }
});
window.addEventListener('pageshow', tick);
tick();
