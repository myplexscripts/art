// The gallery starts with the system appearance; an explicit switch is remembered.
const root = document.documentElement, system = matchMedia('(prefers-color-scheme: dark)');
let preference = null;
try { const saved = localStorage.getItem('scenes-theme'); if (['light', 'dark'].includes(saved)) preference = saved; } catch {}
export const galleryIsDark = () => (preference ?? (system.matches ? 'dark' : 'light')) === 'dark';
export function applyGalleryTheme() {
  const dark = galleryIsDark(); root.dataset.theme = dark ? 'dark' : 'light';
  const button = document.querySelector('.scenes-theme');
  button?.setAttribute('aria-checked', String(dark));
  if (button) button.querySelector('em').textContent = dark ? 'on' : 'off';
  dispatchEvent(new CustomEvent('scenes-theme-change', { detail: { dark } }));
}
applyGalleryTheme();
system.addEventListener('change', () => { if (!preference) applyGalleryTheme(); });
document.querySelector('.scenes-theme')?.addEventListener('click', () => {
  preference = galleryIsDark() ? 'light' : 'dark';
  try { localStorage.setItem('scenes-theme', preference); } catch {}
  applyGalleryTheme();
});
