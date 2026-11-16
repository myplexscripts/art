// Reference renderer for a Simple Home layered scene (scene.json + WebP layers). Works in a browser or in Node with
// @napi-rs/canvas. drawScene(ctx, scene, images, t) paints the design-size frame at time t seconds.
//
// Each layer is drawn back to front. A strip with repeatsPerLoop n moves left by n strip widths per loop, so its
// offset is frac(n * t / loop) * repeatWidth; it is filled with a horizontally repeating pattern, which wraps
// without the hairline a pair of separately placed copies can leave at a fractional position. A layer with
// repeatsPerLoop 0 stays put. Sprites are drawn right after their parent layer, turned about their pivot.
const frac = (x) => x - Math.floor(x);

export function drawScene(ctx, scene, images, t, { blur = false } = {}) {
  const loop = scene.loopDurationSeconds, { width: W } = scene.designSize, u = frac(t / loop);
  for (const layer of scene.layers) {
    const img = images[blur ? layer.blur : layer.sharp], top = blur ? layer.blurCovers.top : layer.top;
    const h = (blur ? layer.blurCovers.bottom : layer.bottom) - top, sx = layer.repeatWidth / img.width;
    const offset = layer.repeatsPerLoop ? frac(layer.repeatsPerLoop * u) * layer.repeatWidth : 0;
    ctx.save();
    ctx.translate(-offset, top); ctx.scale(sx, h / img.height);
    if (layer.repeatsPerLoop) { ctx.fillStyle = ctx.createPattern(img, 'repeat-x'); ctx.fillRect(offset / sx, 0, W / sx, img.height); }
    else ctx.drawImage(img, 0, 0);
    ctx.restore();
    if (blur) continue;
    for (const sprite of scene.sprites) {
      if (sprite.parentLayer !== layer.id) continue;
      const img = images[sprite.image], { width: sw, height: sh } = sprite.sizeDesignPx, m = sprite.motion;
      // rotate: whole turns per loop. swing: back and forth about centreDegrees, whole swings per loop.
      const angle = m.type === 'swing'
        ? ((m.centerDegrees + m.amplitudeDegrees * Math.sin(2 * Math.PI * (m.cyclesPerLoop * u + m.phase))) * Math.PI) / 180
        : (m.direction === 'clockwise' ? 1 : -1) * 2 * Math.PI * frac(m.turnsPerLoop * u) + (m.phaseAtLoopStartDegrees * Math.PI) / 180;
      for (const p of sprite.positions) {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(angle);
        ctx.drawImage(img, -sprite.pivot.x * sw, -sprite.pivot.y * sh, sw, sh);
        ctx.restore();
      }
    }
  }
}
