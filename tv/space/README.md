# Ringed Horizon

This is an original layered, looping background for the **Simple Home** Android TV launcher. The view glides from right to left across the night side of an alien moon. A small colony sits below crater ridges and pale mountains, under a ringed gas giant, a faint nebula and a slowly turning wheel station.

From front to back:
- **Regolith:** dark ground with boulders, softly glowing crystal clusters, small craters and rover tracks.
- **Colony:**
  - domes with lit windows and beacons
  - habitats with porthole windows
  - a greenhouse full of plants
  - solar arrays
  - a comms tower with a dish
  - a rocket on its launch gantry
  - a lander on its pad
  - a rover with its headlights on, and an astronaut beside it
  - cargo crates, walkway tubes and lamp posts
- **Crater ridge:** rolling ground with crater rims, stippled shade and layered mesas.
- **Far mountains:** pale, jagged peaks fading into the low glow.
- **Asteroid belt:** a loose drift of rocks across the sky, sometimes silhouetted against the planet.
- **Sky:**
  - the ringed gas giant with banded clouds, a storm, its night side and the ring's shadow
  - a small moon and a distant galaxy
  - a teal-and-violet nebula and stars

The design size is 1920 × 1080, and the master loop runs for six minutes. The upper-right corner is dark sky for the clock: the station turns well clear of it. The bottom fifth is quiet regolith for the app row. With the launcher UI hidden, the scene still reads as complete.

## Runtime files

| File | What it is |
| --- | --- |
| `scene.json` | Scene metadata: layers back to front, strip sizes, timing and sprites |
| `<layer>.webp` | Sharp artwork for each layer, cropped to its non-transparent rows |
| `<layer>-blur.webp` | The same layer at 1/8 scale, blurred, for the launcher's glass |
| `station.webp` | The wheel station sprite, drawn at 2× its design size |

Everything else (`preview.png`, `reference/`, `checks/`) is documentation.

## Layers (back to front)

| id | y range | strip width | repeats / loop | speed (design px/s) |
| --- | --- | --- | --- | --- |
| sky | 0–1080, opaque | 1920 | 0 (stationary) | 0 |
| — station | on the sky | — | — | 4 turns / loop |
| asteroids | 290–464 | 3840 | 1 | 10.67 |
| far | 534–820 | 3840 | 2 | 21.33 |
| ridge | 631–1080, opaque at the bottom | 3840 | 4 | 42.67 |
| colony | 509–1080, opaque at the bottom | 3840 | 8 | 85.33 |
| regolith | 817–1080, opaque at the bottom | 3840 | 12 | 128 |

`scene.json` is authoritative. The table only summarises it.

## Drawing a frame

One texture pixel equals one design pixel for every layer. A layer's texture spans `repeatWidth` × (`bottom` − `top`) design pixels and is placed at y = `top`.

For a layer with `repeatsPerLoop` = n, at time t seconds:

```
u      = (t mod loopDurationSeconds) / loopDurationSeconds
offset = frac(n · u) · repeatWidth          // design px the strip has moved left
x      = -offset, then every repeatWidth after it until past 1920
```

A layer with n = 0 is drawn once at x = 0. Every moving strip moves at a constant speed and travels a whole number of its widths per loop, so the frame at t = 360 s is the frame at t = 0.

To avoid a hairline between adjacent copies at fractional offsets, sample the texture with horizontal REPEAT wrapping (or a repeat-x pattern) instead of drawing separate quads. If you do draw separate quads, overlap them by one pixel. Compute u from t mod loop before multiplying, so floating-point precision does not drift over a long uptime.

The sky is a lossless WebP. Its gradient and nebula are ordered-dithered, so they never band on a TV panel.

## Blur layers

Each `-blur.webp` covers the same horizontal span as its sharp layer (the full `repeatWidth`) at 1/8 resolution. Vertically it covers `blurCovers.top` to `blurCovers.bottom`, which is 32 design pixels beyond the artwork above and below. Stretch it to `repeatWidth` × (`blurCovers.bottom` − `blurCovers.top`) and scroll it with exactly the same offset as its sharp layer.

Moving strips were blurred across their horizontal wrap, so the glass tiles without a seam. Opaque edges were extended into the padding, and transparent edges stay transparent. Colour was premultiplied throughout, so the edges have no dark halo. The station sits in the upper middle, away from both the dock and the clock, so it is left out of the glass.

## Sprites

`station` belongs to the `sky` layer. Draw it immediately after the sky and before `asteroids`.

- **Size:** 170 × 170 design px (`sizeDesignPx`). The texture is 340 px (`textureScale` 2).
- **Pivot:** (0.5, 0.5), placed at (1060, 180).
- **Motion:** counter-clockwise rotation with `turnsPerLoop` = 4, one turn every 90 s. The angle is `−360° · frac(4 · u)`, and it is 0 at the loop start.

## Checks done before hand-off

- **Seams:** two adjacent copies of every moving strip, sharp and blur, are in `checks/seams.png`. The colour step across each seam is within the strip's own column-to-column variation.
- **Loop:** the frame at 6:00 is identical to the frame at 0:00. Frame-to-frame change was sampled every 3 s across the full loop at 60 fps. It stays between 0.23 and 0.34, including at the wrap, so the scroll has no jumps, pauses or speed changes.
- **Wrap clip:** `checks/wrap.mp4` is 10 seconds at 60 fps running through the loop point.
- **Glass mock:** `checks/glass-mock.png` shows the dock and clock built from the blur layers.

`reference/player.js` is a short renderer that follows these rules. `reference/index.html` plays the scene live when this folder is served over HTTP.

Size: about 330 KB for all runtime WebP files. The dithered, star-filled sky accounts for about 183 KB of that.
