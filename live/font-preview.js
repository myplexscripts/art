// One shared preview choice for the gallery, canvas lettering, controls and clock.
export const PREVIEW_FONTS = ['Barlow Condensed', 'Oswald', 'Inter', 'Manrope'];
const stack = family => `"${family}", system-ui, sans-serif`;
let family = 'Inter', revision = 0;
try { const saved = localStorage.getItem('scenes-font-preview'); if (PREVIEW_FONTS.includes(saved)) family = saved; } catch {}
export let FONT = stack(family);
const apply = () => {
  document.documentElement.style.setProperty('--face', FONT);
  document.documentElement.style.setProperty('--display', FONT);
};
const notify = () => dispatchEvent(new CustomEvent('scenes-font-change', { detail: { family } }));
const load = name => Promise.all([400, 600, 700, 800].map(weight => document.fonts.load(`${weight} 32px ${stack(name)}`, 'Scenes 0123456789: AM PM')));
apply();
let ready = load(family).catch(() => {}).then(notify);
export const previewFontReady = () => ready;

export function previewFont(name) {
  if (!PREVIEW_FONTS.includes(name)) return ready;
  const request = ++revision;
  // Load first, so the clock never briefly measures a fallback face while switching.
  const choice = load(name).then(() => {
    if (request !== revision) return;
    family = name; FONT = stack(name); apply();
    try { localStorage.setItem('scenes-font-preview', name); } catch {}
    notify();
  });
  // A failed preview keeps the current face and must not block later clock openings.
  ready = choice.catch(() => {});
  return choice;
}

export function makeFontSwitcher({ compact = false } = {}) {
  const label = document.createElement('label'); label.className = 'font-preview' + (compact ? ' compact' : '');
  const caption = document.createElement('span'); caption.textContent = compact ? 'Aa' : 'Font'; caption.setAttribute('aria-hidden', 'true');
  const select = document.createElement('select');
  for (const name of PREVIEW_FONTS) { const option = new Option(name, name); option.style.fontFamily = stack(name); select.append(option); }
  const sync = () => { select.value = family; select.setAttribute('aria-label', 'Preview font: ' + family); label.title = 'Preview font: ' + family; };
  select.addEventListener('change', () => { previewFont(select.value).catch(sync); });
  addEventListener('scenes-font-change', sync); sync(); label.append(caption, select);
  return { element: label, destroy: () => removeEventListener('scenes-font-change', sync) };
}

for (const host of document.querySelectorAll('[data-font-preview]')) host.append(makeFontSwitcher().element);
