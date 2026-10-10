// Stops the page being zoomed: pinch, the iOS gesture events, ctrl + wheel, and ctrl + plus / minus / zero.
// The viewport meta tag asks for the same thing, but iOS Safari ignores it, so this does the work there.
const stop = (e) => e.preventDefault();
for (const type of ['gesturestart', 'gesturechange', 'gestureend']) document.addEventListener(type, stop, { passive: false });
document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
addEventListener('wheel', (e) => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].includes(e.key)) e.preventDefault(); });
