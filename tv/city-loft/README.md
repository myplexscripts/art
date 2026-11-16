# Loft Rooftops

This is an original layered, looping background for the **Simple Home** Android TV launcher, inspired by the City Loft poster. Instead of looking out through the loft's window, the view pans slowly along a row of loft rooftops at blue hour.

From front to back:
- **Rooftop:** a vine-covered pergola with lights, a café table with a lantern, a lounger, planters, a bicycle, a lit stair door, a laundry line, a telescope, a cat, skylights, a water tower, and ivy hanging over the parapet.
- **Lofts:** brick warehouses with cornices and dentils, arched windows with lamps and plants inside, fire escapes with stairs and ladders, a ghost sign, a rooftop greenhouse, and an elevated road on girders with lamps and light trails.
- **Mid-town:** art-deco, glass and plain towers, with a neon blade sign, a lit billboard and aviation lights.
- **Far skyline:** a hazy skyline with a suspension bridge strung with lights.
- **Sky:** a dusty-rose horizon under a crescent moon with earthshine, with two searchlights sweeping slowly behind the skyline.

The design size is 1920 × 1080, and the master loop runs for six minutes. The upper-right corner is clear sky for the clock: the searchlights never reach it. The bottom fifth is a plain brick parapet for the app row. With the launcher UI hidden, the scene still reads as complete.

## Runtime files

| File | What it is |
| --- | --- |
| `scene.json` | Scene metadata: layers back to front, strip sizes, timing and sprites |
| `<layer>.webp` | Sharp artwork for each layer, cropped to its non-transparent rows |
| `<layer>-blur.webp` | The same layer at 1/8 scale, blurred, for the launcher's glass |
| `beam.webp` | A searchlight beam sprite, used twice |

Everything else (`preview.png`, `reference/`, `checks/`) is documentation.

## Layers (back to front)

| id | y range | strip width | repeats / loop | speed (design px/s) |
| --- | --- | --- | --- | --- |
| sky | 0–1080, opaque | 1920 | 0 (stationary) | 0 |
| — beam-left, beam-right | on the sky | — | — | slow swing |
| clouds | 286–552 | 3840 | 1 | 10.67 |
| far | 388–900 | 3840 | 2 | 21.33 |
| mid | 456–915 | 3840 | 4 | 42.67 |
| lofts | 573–912 | 3840 | 8 | 85.33 |
| rooftop | 562–1080, opaque at the bottom | 3840 | 12 | 128 |

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

The sky is a lossless WebP with a fine ordered dither, so its long gradient never bands on a TV panel. Scale it with ordinary bilinear filtering.

## Blur layers

Each `-blur.webp` covers the same horizontal span as its sharp layer (the full `repeatWidth`) at 1/8 resolution. Vertically it covers `blurCovers.top` to `blurCovers.bottom`, which is 32 design pixels beyond the artwork above and below. Stretch it to `repeatWidth` × (`blurCovers.bottom` − `blurCovers.top`) and scroll it with exactly the same offset as its sharp layer.

Moving strips were blurred across their horizontal wrap, so the glass tiles without a seam. Opaque edges were extended into the padding, and transparent edges stay transparent. Colour was premultiplied throughout, so the edges have no dark halo. The beams are faint and stay in the upper left, so they are left out of the glass.

## Sprites

Both beams use `beam.webp`, a 240 × 900 soft wedge, and belong to the `sky` layer. Draw them immediately after the sky and before `clouds`, so the skyline hides their bases.

- **Pivot:** (0.5, 1.0), the bottom centre, placed at each sprite's position (y 800, behind the skyline).
- **Motion:** `swing`. The angle in degrees is `centerDegrees + amplitudeDegrees · sin(2π · (cyclesPerLoop · u + phase))`. Positive angles turn clockwise, which leans the beam to the right.
  - `beam-left` at x 690: −14° ± 12°, 8 swings per loop (45 s each).
  - `beam-right` at x 1180: −4° ± 10°, 6 swings per loop (60 s each).
- The beams peak at about 16% opacity at their base and fade to nothing at the top, so nothing flashes.

## Checks done before hand-off

- **Seams:** two adjacent copies of every moving strip, sharp and blur, are in `checks/seams.png`. The colour step across each seam is within the strip's own column-to-column variation.
- **Loop:** the frame at 6:00 is identical to the frame at 0:00. Frame-to-frame change was sampled every 3 s across the full loop at 60 fps. It stays between 0.70 and 0.90, including at the wrap, so the scroll has no jumps, pauses or speed changes.
- **Wrap clip:** `checks/wrap.mp4` is 10 seconds at 60 fps running through the loop point.
- **Glass mock:** `checks/glass-mock.png` shows the dock and clock built from the blur layers.

`reference/player.js` is a short renderer that follows these rules. `reference/index.html` plays the scene live when this folder is served over HTTP.

Size: about 204 KB for all runtime WebP files.
