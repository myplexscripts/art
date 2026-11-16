#!/usr/bin/env python3
"""Turn draw.mjs's full-height PNG layers into Simple Home runtime assets.

    python3 tv/package.py <layers-dir> <out-dir>

For each layer: crop away fully transparent rows, encode a WebP (whichever of lossless or high-quality lossy is
smaller), and make a matching -blur.webp at 1/8 scale covering the same strip width and 32 design pixels above and
below the artwork. A scrolling strip is blurred across its horizontal wrap, so its glass tiles as cleanly as the
artwork does. Writes scene.json describing every layer and sprite.
"""
import io, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

PAD, SCALE, BLUR_RADIUS = 32, 8, 3.0


def webp(img, lossless_ok=True, quality=88, lossy_ok=True):
    best = None
    options = [dict(lossless=True, method=6, quality=100)] if lossless_ok else []
    if lossy_ok: options.append(dict(lossless=False, method=6, quality=quality, alpha_quality=90))
    for opt in options:
        buf = io.BytesIO(); img.save(buf, 'WEBP', **opt)
        if best is None or buf.tell() < len(best): best = buf.getvalue()
    return best


def gaussian(premultiplied, wrap):
    """Separable Gaussian blur of a premultiplied float image; wraps horizontally for a tiling strip."""
    r = int(np.ceil(BLUR_RADIUS * 3)); k = np.exp(-0.5 * (np.arange(-r, r + 1) / BLUR_RADIUS) ** 2); k /= k.sum()
    x = np.pad(premultiplied, ((0, 0), (r, r), (0, 0)), mode='wrap' if wrap else 'edge')
    x = sum(k[i] * x[:, i:i + premultiplied.shape[1]] for i in range(2 * r + 1))
    y = np.pad(x, ((r, r), (0, 0), (0, 0)), mode='edge')
    return sum(k[i] * y[i:i + premultiplied.shape[0]] for i in range(2 * r + 1))


def shrink_and_blur(tall, wrap):
    """1/8 scale, then blur, all on premultiplied colour so transparent pixels add no dark fringe."""
    a = tall.astype(np.float64) / 255
    pre = np.dstack([a[..., :3] * a[..., 3:4], a[..., 3:4]])
    h, w = pre.shape[:2]; bw, bh = round(w / SCALE), round(h / SCALE)
    small = np.dstack([np.asarray(Image.fromarray(pre[..., ch].astype(np.float32), 'F').resize((bw, bh), Image.BOX)) for ch in range(4)])
    res = gaussian(small, wrap)
    alpha = np.clip(res[..., 3:4], 0, 1)
    rgb = np.where(alpha > 1e-4, res[..., :3] / np.maximum(alpha, 1e-4), 0)
    return Image.fromarray(np.clip(np.dstack([rgb, alpha]) * 255 + 0.5, 0, 255).astype(np.uint8), 'RGBA')


def main(src, dst):
    src, dst = Path(src), Path(dst); dst.mkdir(parents=True, exist_ok=True)
    layout = json.loads((src / 'layout.json').read_text())
    W, H = layout['design']['width'], layout['design']['height']
    scene = {'name': layout['name'], 'designSize': {'width': W, 'height': H}, 'loopDurationSeconds': layout['loopSeconds'],
             'scrollDirection': 'rightToLeft', 'layers': [], 'sprites': []}
    sizes = {}
    for l in layout['layers']:
        img = Image.open(src / f"{l['id']}.png").convert('RGBA')
        alpha = np.asarray(img)[..., 3]
        rows = np.where(alpha.max(axis=1) > 0)[0]
        top, bottom = int(rows[0]), int(rows[-1]) + 1
        art = img.crop((0, top, img.width, bottom))
        sharp = f"{l['id']}.webp"; data = webp(art, lossy_ok=not l.get('lossless')); (dst / sharp).write_bytes(data); sizes[sharp] = len(data)

        # blur source: the artwork with 32 design px above and below; an opaque edge is extended, a transparent one stays clear
        a = np.asarray(art)
        tall = np.zeros((a.shape[0] + 2 * PAD, a.shape[1], 4), dtype=np.uint8); tall[PAD:PAD + a.shape[0]] = a
        if a[0, :, 3].min() == 255: tall[:PAD] = a[0]
        if a[-1, :, 3].min() == 255: tall[PAD + a.shape[0]:] = a[-1]
        blurred = shrink_and_blur(tall, wrap=l['repeats'] > 0)
        blur = f"{l['id']}-blur.webp"; data = webp(blurred, lossless_ok=False, quality=80); (dst / blur).write_bytes(data); sizes[blur] = len(data)

        entry = {'id': l['id'], 'sharp': sharp, 'blur': blur, 'repeatWidth': l['repeatWidth'], 'top': top, 'bottom': bottom,
                 'repeatsPerLoop': l['repeats'], 'opaque': bool(a[..., 3].min() == 255),
                 'blurCovers': {'top': top - PAD, 'bottom': bottom + PAD}}
        if l['repeats']: entry['speedDesignPxPerSecond'] = round(l['repeatWidth'] * l['repeats'] / layout['loopSeconds'], 4)
        scene['layers'].append(entry)

    for s in layout['sprites']:
        name = f"{s.get('image', s['id'])}.webp"
        if name not in sizes:
            img = Image.open(src / f"{s.get('image', s['id'])}.png").convert('RGBA')
            data = webp(img); (dst / name).write_bytes(data); sizes[name] = len(data)
        w, h = s['size'] if isinstance(s['size'], list) else (s['size'], s['size'])
        if 'motion' in s:
            motion = dict(s['motion'])
            if motion['type'] == 'swing': motion['secondsPerSwing'] = round(layout['loopSeconds'] / motion['cyclesPerLoop'], 6)
        else:
            motion = {'type': 'rotate', 'direction': s['direction'], 'turnsPerLoop': s['turnsPerLoop'],
                      'secondsPerTurn': round(layout['loopSeconds'] / s['turnsPerLoop'], 6), 'phaseAtLoopStartDegrees': 0}
        scene['sprites'].append({
            'id': s['id'], 'image': name, 'parentLayer': s['parent'], 'drawAfterParent': True,
            'sizeDesignPx': {'width': w, 'height': h}, 'textureScale': s['textureScale'],
            'pivot': {'x': s['pivot'][0], 'y': s['pivot'][1]},
            'positions': [{'x': x, 'y': y} for x, y in s['positions']],
            'motion': motion,
        })
    (dst / 'scene.json').write_text(json.dumps(scene, indent=2) + '\n')
    total = sum(sizes.values())
    for k, v in sizes.items(): print(f'{k:24s} {v / 1024:7.1f} KB')
    print(f"{'total':24s} {total / 1024:7.1f} KB")


if __name__ == '__main__':
    main(*sys.argv[1:3])
