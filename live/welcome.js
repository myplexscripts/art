// A once-only welcome with a fully illustrated iPhone installation guide.
import { lockPage } from './scroll-lock.js?v=20261011-focus-finish';
const KEY = 'scenes-welcome-v1';
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const standalone = () => navigator.standalone || matchMedia('(display-mode: standalone)').matches;
const share = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9H5v12h14V9h-3M12 15V2m-4 4 4-4 4 4"/></svg>';
const steps = [
  ['menu', 'Open the Safari menu', 'Open Scenes in Safari, then tap the page-menu button. If Share is already in your toolbar, tap it directly.', 3300],
  ['share', 'Tap Share', 'Choose Share—the square with the upward arrow.', 3300],
  ['homescreen', 'Add to Home Screen', 'Scroll down the share sheet and tap Add to Home Screen. If it is missing, find it under Edit Actions.', 4300],
  ['confirm', 'Keep Open as Web App on', 'Leave Open as Web App switched on, then tap Add in the top corner.', 4800],
  ['home', 'Your own little escape', 'Scenes is now on your Home Screen. Tap its icon to open it.', 3500],
  ['launch', 'Art, all the way to the edges', 'Open a scene, make yourself comfortable, and let it move.', 3500],
];
let current = null;

function showWelcome(skipSplash = false) {
  current?.close();
  const dialog = document.createElement('dialog'); dialog.className = 'scenes-welcome';
  dialog.setAttribute('aria-label', 'Welcome to Scenes');
  dialog.innerHTML = `<div class="welcome-shell">
    <div class="welcome-top"><span class="welcome-wordmark">Scenes</span><button class="welcome-skip" type="button">Skip</button></div>
    <div class="welcome-progress" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="welcome-content">
    <section class="welcome-splash" aria-labelledby="welcome-title"><div class="splash-posters" aria-hidden="true"><i class="splash-stacks"></i><i class="splash-bloom"></i><i class="splash-waves"></i></div><p class="welcome-kicker">A little room to breathe</p><h1 id="welcome-title">Scenes</h1><p>Find your quiet corner.</p><div class="splash-rule"></div></section>
    <section class="welcome-features" hidden aria-labelledby="features-title"><div class="welcome-copy"><p class="welcome-kicker">Made for slower moments</p><h2 id="features-title">Living art.<br>Your quiet corner.</h2><p>Pick a scene. Let the room soften.</p><ul class="welcome-feature-list"><li><b>40 living scenes</b><span>From moonlit shores to moving geometry.</span></li><li><b>Set the sound</b><span>Blend music and ambience, or enjoy the quiet.</span></li><li><b>Make the clock yours</b><span>Tap for colour. Pinch for size. Swipe for weight.</span></li><li><b>Put time in its place</b><span>Hold to move. Triple tap to float back to centre.</span></li></ul></div>
      <div class="welcome-demo"><div class="demo-art" aria-hidden="true"><canvas width="604" height="680"></canvas><span class="demo-clock">9:41</span><div class="demo-controls">AMBIENCE <i></i> MUSIC <i></i></div></div><div class="demo-caption"><b>Deep Waves</b><span>GEOMETRY · No. 03</span></div><p class="demo-gesture" aria-live="off">Tap for a scene colour</p></div>
    </section>
    <section class="welcome-install" hidden aria-labelledby="install-title"><div class="welcome-copy"><p class="welcome-kicker">A home for your scenes · iPhone</p><h2 id="install-title">One tap away.<br>Every day.</h2><p>Add Scenes to your Home Screen for a full-screen space of your own.</p><ol class="install-steps">${steps.map((s, i) => `<li><button type="button" data-step="${i}"><span>${i + 1}</span><b>${s[1]}</b></button></li>`).join('')}</ol><p class="install-detail" aria-live="polite"></p></div>
      <div class="install-animation" role="group" aria-label="iPhone installation demonstration"><div class="install-phone" role="img" aria-label="Animated demonstration of saving Scenes to the iPhone Home Screen" data-step="menu">
        <div class="phone-island"></div><div class="phone-status"><span>9:41</span><span>▮▮▮ ▰</span></div>
        <div class="phone-web"><div class="phone-gallery"><b>Scenes</b><p>Your quiet corner.</p><div class="phone-rule"></div><small>GEOMETRY</small><div class="phone-cards"><i class="splash-stacks"><span>Stacks<br><em>No. 01</em></span></i><i class="splash-bloom"><span>Blooms<br><em>No. 02</em></span></i></div></div><div class="phone-toolbar"><span>‹</span><span class="phone-address">Scenes · Safari</span><span class="phone-menu-icon">•••</span><span class="phone-share-icon">${share}</span></div></div>
        <div class="phone-page-menu"><span>Page options</span><div>${share}<b>Share</b></div></div>
        <div class="phone-share-sheet"><div class="sheet-grip"></div><div class="sheet-site"><img src="./favicon/apple-touch-icon.png?v=2" alt=""><b>Scenes</b></div><div class="sheet-scroll"><div class="sheet-options"><div>Copy <span>▢</span></div><div>Add to Reading List <span>☷</span></div><div>Add Bookmark <span>▱</span></div><div class="add-home">Add to Home Screen <span>⊞</span></div><div>Edit Actions <span>•••</span></div></div></div></div>
        <div class="phone-confirm"><div class="confirm-top"><span>Cancel</span><b>Add to Home Screen</b><span class="confirm-add">Add</span></div><img class="confirm-icon" src="./favicon/apple-touch-icon.png?v=2" alt=""><b class="confirm-name">Scenes</b><div class="confirm-field">Scenes</div><div class="confirm-toggle">Open as Web App <i></i></div><p>Open Scenes in its own window.</p></div>
        <div class="phone-home"><div class="home-icons"><i></i><i></i><i></i><i></i><i></i><div class="home-scenes"><img src="./favicon/apple-touch-icon.png?v=2" alt=""><span>Scenes</span></div><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="home-dock"><i></i><i></i><i></i><i></i></div></div>
        <div class="phone-launched"><svg viewBox="0 0 240 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="240" height="480" fill="#183340"/><g fill="none" stroke-width="44"><circle cx="120" cy="185" r="305" stroke="#25475b"/><circle cx="120" cy="185" r="247" stroke="#2e566d"/><circle cx="120" cy="185" r="189" stroke="#38657d"/><circle cx="120" cy="185" r="131" stroke="#42748b"/><circle cx="120" cy="185" r="73" stroke="#4b8298"/></g></svg><b>9:41</b></div><div class="phone-touch"></div><div class="phone-home-line"></div>
      </div><button class="install-play" type="button">Pause animation</button></div>
    </section>
    </div>
    <nav class="welcome-actions" aria-label="Welcome navigation"><button class="welcome-back" type="button" hidden>← Back</button><span class="welcome-note">A slower moment starts here.</span><button class="welcome-next" type="button">Next <span aria-hidden="true">→</span></button></nav>
  </div>`;
  document.body.append(dialog);
  const $ = s => dialog.querySelector(s), sections = ['splash', 'features', 'install'];
  let stage = 'splash', step = 0, timer = 0, raf = 0, playing = !reduced(), completed = false, ended = false, demoStarted = 0, remaining = 0, deadline = 0;
  const canvas = $('.demo-art canvas'), ctx = canvas.getContext('2d'); let demoScene = null;
  const previousFocus = document.activeElement;
  const page = document.querySelector('.page'), wasInert = page?.inert;
  const unlock = lockPage({ freeze: true });
  if (page) page.inert = true;
  const api = { close: finish }; current = api;
  dialog.showModal();
  if (!reduced()) dialog.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
  function finish() {
    if (ended) return; ended = true;
    clearTimeout(timer); cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', visibility);
    try { localStorage.setItem(KEY, '1'); } catch {}
    dialog.close(); dialog.remove(); if (page) page.inert = wasInert;
    unlock(); if (current === api) current = null;
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  }
  function changeStage(next) {
    clearTimeout(timer); stage = next; dialog.dataset.stage = next;
    sections.forEach(s => $('.welcome-' + s).hidden = s !== next);
    $('.welcome-content').scrollTop = 0;
    $('.welcome-back').hidden = next !== 'install'; $('.welcome-actions').hidden = next === 'splash';
    $('.welcome-note').textContent = next === 'features' && standalone() ? 'Already at home. Enjoy the full screen.' : next === 'install' ? 'Follow along, or choose any step.' : 'Your clock remembers its place in every scene.';
    if (next === 'features') {
      if (!demoScene) import('./s-geometry.js?v=20261011-focus-finish').then(({ scenes }) => { if (!ended) { demoScene = scenes.deepwaves; demoStarted = performance.now(); drawDemo(demoStarted); } });
      else drawDemo(performance.now());
    }
    if (next === 'install') { cancelAnimationFrame(raf); showStep(0); }
    if (next !== 'splash') $('.welcome-next').focus({ preventScroll: true });
  }
  function drawDemo(now) {
    if (ended || stage !== 'features' || !demoScene) return;
    const t = reduced() ? 90 : 90 + (now - demoStarted) / 1000;
    demoScene.paint(ctx, t / 30, t, demoScene.make(canvas.width, canvas.height));
    const phase = reduced() ? 0 : Math.floor((now - demoStarted) / 1800) % 5, clock = $('.demo-clock');
    clock.style.color = phase ? '#9ac1d5' : '#fff'; clock.style.fontWeight = phase === 2 ? '900' : '650';
    clock.style.left = phase === 3 ? '65%' : '50%'; clock.style.top = phase === 3 ? '68%' : '48%';
    clock.style.fontSize = phase === 1 ? '87px' : '63px';
    $('.demo-gesture').textContent = ['Tap for a scene colour', 'Pinch to change the size', 'Swipe to change the weight', 'Hold, then move it anywhere', 'Triple tap to float back to centre'][phase];
    if (!reduced()) raf = requestAnimationFrame(drawDemo);
  }
  function showStep(index) {
    clearTimeout(timer); step = index; completed = false;
    $('.install-phone').dataset.step = steps[index][0];
    // Restart the touch/scroll demonstration when a step is replayed.
    $('.install-phone').classList.remove('playing', 'paused'); void $('.install-phone').offsetWidth;
    if (playing && !reduced()) $('.install-phone').classList.add('playing');
    $('.install-detail').textContent = steps[index][1] + '. ' + steps[index][2];
    dialog.querySelectorAll('.install-steps button').forEach((b, i) => { b.setAttribute('aria-current', i === index ? 'step' : 'false'); });
    $('.install-phone').setAttribute('aria-label', 'Step ' + (index + 1) + ': ' + steps[index][1] + '. ' + steps[index][2]);
    $('.install-play').textContent = reduced() ? 'Next step →' : playing ? 'Pause animation' : 'Play animation';
    remaining = steps[index][3];
    if (playing && !document.hidden) scheduleStep();
  }
  function scheduleStep() {
    deadline = performance.now() + remaining;
    timer = setTimeout(() => { if (step < steps.length - 1) showStep(step + 1); else { playing = false; completed = true; $('.install-play').textContent = 'Replay animation ↺'; } }, remaining);
  }
  function visibility() {
    if (stage === 'splash') { clearTimeout(timer); if (!document.hidden) timer = setTimeout(() => changeStage('features'), 600); return; }
    if (stage !== 'install') return;
    if (document.hidden) { clearTimeout(timer); if (playing) remaining = Math.max(0, deadline - performance.now()); $('.install-phone').classList.add('paused'); }
    else if (playing && !completed) { $('.install-phone').classList.remove('paused'); scheduleStep(); }
  }
  document.addEventListener('visibilitychange', visibility);
  $('.welcome-skip').addEventListener('click', finish);
  $('.welcome-next').addEventListener('click', () => {
    if (stage === 'features' && !standalone()) changeStage('install');
    else if (stage === 'install' && step < steps.length - 1) showStep(step + 1);
    else finish();
  });
  $('.welcome-back').addEventListener('click', () => { if (step > 0) showStep(step - 1); else changeStage('features'); });
  dialog.addEventListener('cancel', e => { e.preventDefault(); finish(); });
  dialog.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(); } });
  dialog.querySelectorAll('.install-steps button').forEach(b => b.addEventListener('click', () => showStep(+b.dataset.step)));
  $('.install-play').addEventListener('click', () => {
    if (reduced()) { showStep((step + 1) % steps.length); return; }
    if (completed) { playing = true; showStep(0); }
    else if (playing) { remaining = Math.max(0, deadline - performance.now()); playing = false; clearTimeout(timer); $('.install-phone').classList.add('paused'); $('.install-play').textContent = 'Play animation'; }
    else { playing = true; if (!$('.install-phone').classList.contains('playing')) showStep(step); else { $('.install-phone').classList.remove('paused'); scheduleStep(); $('.install-play').textContent = 'Pause animation'; } }
  });
  if (skipSplash) changeStage('features');
  else { dialog.dataset.stage = 'splash'; $('.welcome-actions').hidden = true; timer = setTimeout(() => changeStage('features'), 1100); }
}

let seen = false; try { seen = localStorage.getItem(KEY) === '1'; } catch {}
if (!seen) showWelcome();
