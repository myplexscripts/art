# Night Express

This is an original layered, looping background for the **Simple Home** Android TV launcher. An electric night express crosses a stone viaduct below snowy peaks, under a pale moon. The view travels with the train, so the train holds its place while the country scrolls from right to left. The design size is 1920 × 1080, and the master loop runs for six minutes.

The upper-right corner is clear sky for the clock. The bottom fifth is a quiet, low-contrast snowbank for the app row. With the launcher UI hidden, the scene still reads as complete.

## Runtime files

| File | What it is |
| --- | --- |
| `scene.json` | Scene metadata: layers back to front, strip sizes, timing and sprites |
| `<layer>.webp` | Sharp artwork for each layer, cropped to its non-transparent rows |
| `<layer>-blur.webp` | The same layer at 1/8 scale, blurred, for the launcher's glass |
| `wheel.webp` | A rotating wheel sprite, drawn at 2× its design size |

Everything else (`preview.png`, `reference/`, `checks/`) is documentation.

## Layers (back to front)

| id | y range | strip width | repeats / loop | speed (design px/s) |
| --- | --- | --- | --- | --- |
| sky | 0–1080, opaque | 1920 | 0 (stationary) | 0 |
| clouds | 306–436 | 3840 | 1 | 10.67 |
| peaks | 381–750 | 3840 | 2 | 21.33 |
| ridge | 503–1080, opaque at the bottom | 3840 | 5 | 53.33 |
| viaduct | 548–1080 | 1920 | 30 | 160 |
| train | 602–757 | 1920 | 0 (stationary) | 0 |
| — wheel sprites | on the train | — | — | 833 turns / loop |
| snowbank | 811–1080, opaque at the bottom | 3840 | 20 | 213.33 |

`scene.json` is authoritative. The table only summarises it.

## Drawing a frame

One texture pixel equals one design pixel horizontally for every layer. A layer's texture spans `repeatWidth` × (`bottom` − `top`) design pixels and is placed at y = `top`.

For a layer with `repeatsPerLoop` = n, at time t seconds:

```
u      = (t mod loopDurationSeconds) / loopDurationSeconds
offset = frac(n · u) · repeatWidth          // design px the strip has moved left
x      = -offset, then every repeatWidth after it until past 1920
```

A layer with n = 0 is drawn once at x = 0. Every moving strip moves at a constant speed and travels a whole number of its widths per loop, so the frame at t = 360 s is the frame at t = 0.

To avoid a hairline between adjacent copies at fractional offsets, sample the texture with horizontal REPEAT wrapping (or a repeat-x pattern) instead of drawing separate quads. If you do draw separate quads, overlap them by one pixel. Compute u from t mod loop before multiplying, so floating-point precision does not drift over a long uptime.

## Blur layers

Each `-blur.webp` covers the same horizontal span as its sharp layer (the full `repeatWidth`) at 1/8 resolution. Vertically it covers `blurCovers.top` to `blurCovers.bottom`, which is 32 design pixels beyond the artwork above and below. Stretch it to `repeatWidth` × (`blurCovers.bottom` − `blurCovers.top`) and scroll it with exactly the same offset as its sharp layer.

Moving strips were blurred across their horizontal wrap, so the glass tiles without a seam. Opaque edges were extended into the padding, and transparent edges stay transparent. Colour was premultiplied throughout, so the edges have no dark halo. The glass composite is the blur layers drawn back to front with the same offsets. Sprites are left out, since they are too small to matter under the blur.

## Sprites

`wheel` belongs to the `train` layer. Draw each instance immediately after the train layer and before `snowbank`.

- **Size:** 26 × 26 design px (`sizeDesignPx`). The texture is 52 px (`textureScale` 2).
- **Pivot:** (0.5, 0.5), placed at each entry in `positions`.
- **Motion:** clockwise rotation with `turnsPerLoop` = 833 (about 2.31 turns/s). This matches the rail speed of 160 px/s for an 11 px radius, so the wheels roll without slipping. The angle is `360° · frac(turnsPerLoop · u)`, and it is 0 at the loop start.

## Checks done before hand-off

- **Seams:** two adjacent copies of every moving strip, sharp and blur, are in `checks/seams.png`. The colour step across each seam is within the strip's own column-to-column variation.
- **Loop:** the frame at 6:00 is identical to the frame at 0:00. Frame-to-frame change was sampled every 3 s across the full loop at 60 fps. It stays between 0.22 and 0.26, including at the wrap, so the scroll has no jumps, pauses or speed changes.
- **Wrap clip:** `checks/wrap.mp4` is 10 seconds at 60 fps running through the loop point.
- **Glass mock:** `checks/glass-mock.png` shows the dock and clock built from the blur layers.

`reference/player.js` is a 40-line renderer that follows these rules. `reference/index.html` plays the scene live when this folder is served over HTTP.

Size: about 135 KB for all runtime WebP files.
