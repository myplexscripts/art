// Sound for a scene, on two buses with their own volumes: ambience and music.
// Ambience is generated field recordings (Stable Audio), a few minutes each, layered and looped.
// Music is generated tracks (ACE-Step), six minutes each, that play in turn and come round again.
// Everything is streamed, never decoded whole, so long files cost little memory on a phone.
// Audio is vendored beside this module so the clone works independently of the original CDN.
const STORE = new URL('./audio/', import.meta.url);
const LAYERS = {
  beach: [['amb_beach_surf.mp3', 1], ['amb_beach_wind.mp3', 0.55]],
  jungle: [['amb_jungle_fall.mp3', 0.8], ['amb_jungle_night.mp3', 0.9]],
  harbor: [['amb_harbor_water.mp3', 1], ['amb_harbor_rigging.mp3', 0.6]],
  campfire: [['amb_campfire_fire.mp3', 0.9], ['amb_campfire_night.mp3', 0.7]],
  train: [['amb_train_rails.mp3', 0.9], ['amb_train_plain.mp3', 0.6]],
  mesa: [['amb_mesa_wind.mp3', 0.9], ['amb_mesa_night.mp3', 0.7]],
  aurora: [['amb_aurora_wind.mp3', 0.9], ['amb_aurora_ice.mp3', 0.7]],
};
// a and b are six minutes; the first two scenes also keep their first, shorter takes as c and d
const tracksFor = (scene) => (scene === 'beach' || scene === 'jungle' ? ['a', 'b', 'c', 'd'] : ['a', 'b']);

export function makeSound(sceneName) {
  const TRACKS = tracksFor(sceneName);
  const ac = new (window.AudioContext || window.webkitAudioContext)();
  const gain = (v) => { const g = ac.createGain(); g.gain.value = v; return g; };
  // everything comes up gently from nothing when a scene starts, and goes down the same way when it stops
  const master = gain(0), amb = gain(0), music = gain(0); master.gain.setTargetAtTime(1, ac.currentTime, 0.55);
  let gone = false;
  // a limiter on the way out, so nothing clips with both volumes up
  const limit = ac.createDynamicsCompressor(); limit.threshold.value = -8; limit.knee.value = 6; limit.ratio.value = 12; limit.attack.value = 0.005; limit.release.value = 0.25;
  master.connect(limit); limit.connect(ac.destination); amb.connect(master); music.connect(master);
  const set = (param, v, tc = 0.12) => param.setTargetAtTime(v, ac.currentTime, tc);
  const base = STORE, streams = [];

  // One stream: a list of files played in turn through two players, each fading in over the last seconds of the one
  // before. A list of one loops into itself, so there is never a gap or a click at the join, whatever padding the file has.
  function stream(files, bus, vol, cross, onChange) {
    const players = [0, 1].map(() => { const a = new Audio(); a.crossOrigin = 'anonymous'; a.preload = 'auto'; const g = gain(0), out = gain(vol); ac.createMediaElementSource(a).connect(g); g.connect(out); out.connect(bus); return { a, g }; });
    let cur = 0, i = -1;
    // a track that has not been made yet is left out of the round: each file is asked after once, quietly
    const missing = new Set();
    if (files.length > 1) files.forEach((f, k) => fetch(new URL(f, base), { method: 'HEAD' }).then((r) => { if (!r.ok) missing.add(k); }).catch(() => {}));
    const play = (n) => {
      i = ((n % files.length) + files.length) % files.length;
      for (let k = 0; k < files.length && missing.has(i); k++) i = (i + 1) % files.length;
      const old = players[cur]; cur = 1 - cur; const now = players[cur];
      now.a.src = new URL(files[i], base); now.a.play().catch(() => {});
      // if the one asked for turns out not to be there, fall back to the first, which always is
      now.a.onerror = () => { if (players[cur] === now && i !== 0) { missing.add(i); play(0); } };
      for (const [q, v] of [[now, 1], [old, 0]]) { q.g.gain.cancelScheduledValues(ac.currentTime); q.g.gain.setTargetAtTime(v, ac.currentTime, cross / 3.5); }
      setTimeout(() => { if (players[cur] !== old) old.a.pause(); }, cross * 2000);
      onChange?.(i);
    };
    // the idle player is started and stopped once inside the tap that turned sound on, so phones let it play later
    players[1].a.src = new URL(files[0], base); players[1].a.play().then(() => { if (cur !== 1) players[1].a.pause(); }).catch(() => {});
    const timer = setInterval(() => { const a = players[cur].a; if (i >= 0 && a.duration && a.currentTime > a.duration - cross - 0.5) play(i + 1); }, 500);
    const s = { play, next: () => play(i + 1), stop: () => { clearInterval(timer); players.forEach((q) => q.a.pause()); } };
    streams.push(s);
    return s;
  }

  // the layers are different lengths, so together they never line up the same way twice
  // scenes without an entry above use amb_<scene>_1 and _2
  for (const [file, vol] of LAYERS[sceneName] ?? [[`amb_${sceneName}_1.mp3`, 0.9], [`amb_${sceneName}_2.mp3`, 0.7]]) stream([file], amb, vol, 5).play(0);

  let onTrack = () => {}, letter = '';
  const tracks = stream(TRACKS.map((t) => `music_${sceneName}_${t}.mp3`), music, 1, 7, (i) => { letter = TRACKS[i].toUpperCase(); localStorage.setItem('wavz-track-' + sceneName, i); onTrack(letter); });
  tracks.play((+localStorage.getItem('wavz-track-' + sceneName) || 0) % TRACKS.length);

  return {
    resume: () => ac.resume(),
    running: () => ac.state === 'running',
    // gentle: a slower change, for muting and unmuting; a slider being dragged wants the quick one
    ambience: (v, gentle) => set(amb.gain, v * v * 0.9, gentle ? 0.4 : 0.12),            // sits under the music: at equal slider positions the music leads
    music: (v, gentle) => set(music.gain, v * v * 1.7, gentle ? 0.4 : 0.12),
    mute: (on) => master.gain.setTargetAtTime(on ? 0 : 1, ac.currentTime, 0.25),
    nextTrack: () => tracks.next(),
    onTrack: (fn) => { onTrack = fn; if (letter) fn(letter); },
    // fades out over about a second and only then lets go of the files; one that never got going just goes
    stop: () => {
      if (gone) return; gone = true;
      const end = () => { streams.forEach((s) => s.stop()); ac.close(); };
      if (ac.state !== 'running') return end();
      master.gain.cancelScheduledValues(ac.currentTime); master.gain.setTargetAtTime(0, ac.currentTime, 0.22); setTimeout(end, 1100);
    },
  };
}
