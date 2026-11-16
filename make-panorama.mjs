// Records one seamless loop of the Desert Mesa panorama (live/mesapano.js) as an MP4 for a TV home screen.
// Frames are drawn with @napi-rs/canvas and piped straight into ffmpeg; the last frame is one step before the loop
// point, so the file repeats without a seam.
//
//   npm install --no-save @napi-rs/canvas
//   node make-panorama.mjs [--width 1920] [--height 1080] [--fps 60] [--crf 20] [--out mesa-panorama.mp4]
//   node make-panorama.mjs --still mesa-panorama.png
import { createRequire } from 'module';
import { spawn } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

const require = createRequire(join(process.cwd(), 'noop.js'));
const { createCanvas } = require('@napi-rs/canvas');
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, all) => (v.startsWith('--') ? [...a, [v.slice(2), all[i + 1]]] : a), []));
const W = +(args.width ?? 1920), H = +(args.height ?? 1080), fps = +(args.fps ?? 60);
const { make, paint, LOOP } = await import(new URL('./live/mesapano.js', import.meta.url));
const canvas = createCanvas(W, H), ctx = canvas.getContext('2d'), G = make(W, H);

if (args.still) {
  paint(ctx, +(args.at ?? 30), G);
  writeFileSync(args.still, canvas.toBuffer('image/png'));
  process.exit(0);
}
const out = args.out ?? 'mesa-panorama.mp4', frames = Math.round(LOOP * fps);
const ffmpeg = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(fps), '-i', '-',
  '-c:v', 'libx264', '-preset', args.preset ?? 'slow', '-crf', String(args.crf ?? 20), '-pix_fmt', 'yuv420p', '-g', String(fps * 2), '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const write = (buf) => new Promise((ok) => (ffmpeg.stdin.write(buf) ? ok() : ffmpeg.stdin.once('drain', ok)));
const started = Date.now();
for (let i = 0; i < frames; i++) {
  paint(ctx, i / fps, G);
  await write(Buffer.from(ctx.getImageData(0, 0, W, H).data.buffer));
  if (i % (fps * 10) === 0) process.stdout.write(`\r${Math.round((100 * i) / frames)}%  ${Math.round((Date.now() - started) / 1000)} s`);
}
ffmpeg.stdin.end();
await new Promise((ok, fail) => ffmpeg.on('close', (code) => (code ? fail(new Error('ffmpeg exited ' + code)) : ok())));
console.log(`\r${out}: ${frames} frames, ${LOOP} s at ${fps} fps, ${W}x${H}`);
