// Checks a packaged scene the way a developer would use it, from its WebP files and scene.json:
//   node tv/night-express/verify.mjs <scene-dir> <checks-dir>
// - preview.png: the 1920 x 1080 frame at t = 0
// - seam-<layer>.png: two adjacent copies of every moving strip, sharp above and blur (scaled up) below,
//   and a measure of the step across each seam against the strip's own column-to-column changes
// - the loop: frame 0 against frame 360 s, and frame-to-frame change sampled every 3 s across the whole loop,
//   including the wrap, at 60 fps
// - wrap.mp4: ten seconds of 60 fps video running through the loop point
import { createRequire } from 'module';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { spawn } from 'child_process';
import { join } from 'path';
import { drawScene } from './player.js';

const require = createRequire(join(process.cwd(), 'noop.js'));
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const [dir, checks] = process.argv.slice(2);
mkdirSync(checks, { recursive: true });
const scene = JSON.parse(readFileSync(join(dir, 'scene.json'), 'utf8')), images = {};
for (const l of scene.layers) for (const f of [l.sharp, l.blur]) images[f] = await loadImage(readFileSync(join(dir, f)));
for (const s of scene.sprites) images[s.image] = await loadImage(readFileSync(join(dir, s.image)));
const { width: W, height: H } = scene.designSize, L = scene.loopDurationSeconds;
const frame = (t, opts) => { const cv = createCanvas(W, H), c = cv.getContext('2d'); drawScene(c, scene, images, t, opts); return cv; };
const pixels = (cv) => cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
const meanDiff = (a, b) => { let s = 0; for (let i = 0; i < a.length; i += 4) s += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]); return s / (a.length / 4) / 3; };

writeFileSync(join(checks, 'preview.png'), frame(0).toBuffer('image/png'));

// seams
for (const l of scene.layers.filter((l) => l.repeatsPerLoop)) {
  const sharp = images[l.sharp], blur = images[l.blur], h = l.bottom - l.top, bh = l.blurCovers.bottom - l.blurCovers.top;
  const cv = createCanvas(sharp.width * 2, h + bh + 12), c = cv.getContext('2d');
  c.fillStyle = '#ff00ff'; c.fillRect(0, 0, cv.width, cv.height);
  c.drawImage(sharp, 0, 0); c.drawImage(sharp, sharp.width, 0);
  c.imageSmoothingEnabled = true; c.drawImage(blur, 0, h + 12, sharp.width, bh); c.drawImage(blur, sharp.width, h + 12, sharp.width, bh);
  writeFileSync(join(checks, `seam-${l.id}.png`), cv.toBuffer('image/png'));
  // the step across the seam, against the 99.9th percentile of steps between neighbouring columns inside the strip
  const step = (img) => {
    const t = createCanvas(img.width * 2, img.height), q = t.getContext('2d'); q.drawImage(img, 0, 0); q.drawImage(img, img.width, 0);
    const d = q.getImageData(0, 0, t.width, t.height).data, w = t.width, col = (x) => { let s = 0; for (let y = 0; y < img.height; y++) { const i = (y * w + x) * 4, j = i + 4; s += Math.abs(d[i] - d[j]) + Math.abs(d[i + 1] - d[j + 1]) + Math.abs(d[i + 2] - d[j + 2]) + Math.abs(d[i + 3] - d[j + 3]); } return s / img.height; };
    const all = []; for (let x = 0; x < img.width - 1; x++) all.push(col(x)); all.sort((a, b) => a - b);
    return { seam: col(img.width - 1).toFixed(2), typical: all[Math.floor(all.length * 0.999)].toFixed(2) };
  };
  console.log(`seam ${l.id.padEnd(9)} sharp`, step(sharp), 'blur', step(blur));
}

// the whole loop
console.log('frame 0 vs frame at loop end, mean diff:', meanDiff(pixels(frame(0)), pixels(frame(L))).toFixed(4));
const steps = [];
for (let t = 0; t <= L; t += 3) steps.push([t, meanDiff(pixels(frame(t - 1 / 60)), pixels(frame(t)))]);
const vals = steps.map((s) => s[1]), mean = vals.reduce((a, b) => a + b) / vals.length;
console.log(`frame-to-frame change over ${steps.length} samples: min ${Math.min(...vals).toFixed(3)} mean ${mean.toFixed(3)} max ${Math.max(...vals).toFixed(3)}; at the wrap ${steps[0][1].toFixed(3)} and ${steps.at(-1)[1].toFixed(3)}`);

// ten seconds through the wrap
const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', '60', '-i', '-', '-c:v', 'libx264', '-crf', '22', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', join(checks, 'wrap.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
const put = (b) => new Promise((ok) => (ff.stdin.write(b) ? ok() : ff.stdin.once('drain', ok)));
for (let i = 0; i < 600; i++) await put(Buffer.from(pixels(frame(L - 5 + i / 60)).buffer));
ff.stdin.end(); await new Promise((ok) => ff.on('close', ok));
console.log('wrote preview.png, seam images and wrap.mp4 to', checks);
