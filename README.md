# Living posters

Static recreations of the Essentials genre covers, with all text and Apple logos removed, are available in [`covers/essentials/`](covers/essentials/).

A complete snapshot of the 32 living posters published at [WAVZ](https://wavz.us), plus nine **Music Series** posters, six **Essentials Series** genre studies and six **Geometry** posters: 53 posters across nine series. The original WAVZ artwork, code and audio are by **Nick Saulino**; the gallery retains his attribution. The additions contain original music rooms, interpretations of playlist artwork and original geometric compositions.

The existing original **Lantern Cove** page is preserved at [`lantern-cove/index.html`](lantern-cove/index.html).

## Run

No build or dependencies are required. Serve this directory over HTTP so the browser can load JavaScript modules:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Open an individual poster using `?scene=beach`, for example. The page also works beneath a path such as `/art/`: navigation, icons and audio are relative to the site. `.nojekyll` supports static GitHub Pages hosting.

Opening a poster fills the entire viewport with artwork, including the safe areas beneath a phone's status bar, notch and home indicator. The bottom controls overlay the artwork and respect those safe areas; hiding them leaves no reserved strip. This applies to browser playback, native fullscreen and the standalone PWA. The gallery-to-player transition removes the thumbnail's frame. Browsers with the DOM Fullscreen API can hide their browser chrome; iPhone Safari keeps its own browser bars, while the installed PWA fills the screen. The old iPhone video-player workaround is removed to avoid its letterboxing and preserve the app's controls.

The app adds no status-bar tint, blur, gradient or overlay. The page and manifest omit `theme-color`, and iOS uses `black-translucent` with `viewport-fit=cover` so the artwork can show beneath the status bar in the installed PWA. Any remaining blur or glass in Safari/iOS chrome is controlled by the operating system; websites have no API to remove it. The manifest URL is versioned to refresh the old color settings.

The bottom bar's **Clock** button toggles a local-time clock centered over the artwork. It is off by default, remembers the setting across posters and reloads, updates on the minute and refreshes when the app resumes. The text has no shadow. Pinch on the clock to resize it; swipe right to make it bolder or left to make it lighter, using Manrope's full 200–800 variable weight range. Size and weight stay saved across posters and reloads. Trackpad pinch also resizes it; with the clock focused, use +/− for size and left/right arrows for weight. The frame chooser has been replaced by the clock toggle so playback always stays edge to edge. [View the clock and edge-to-edge artwork](docs/player-clock-preview.png).

**Inter** (weights 100–900) and **Manrope** (weights 200–800) are variable Google Fonts. The Latin WOFF2 files are self-hosted under [`live/fonts/`](live/fonts/) with their SIL Open Font Licenses and source URLs. Inter supplies interface text; Manrope supplies headings, gallery poster titles and the clock. Font loading requires no Google connection at runtime.

## Included posters

| Series | Posters |
| --- | --- |
| Nocturne | Moonpath, Hidden Falls, Lantern Harbor, Campfire Ridge, Night Train, Desert Mesa, Northern Lights |
| Weather | Summer Storm, First Snow, Fog Bank, Autumn Gale, After the Rain |
| Window | Rainy Cafe, Sleeper Car, Cabin Window, City Loft, Sea View |
| Daybreak | Rice Terraces, Lavender Field, Alpine Lake, Balloon Dawn, Savanna Sunrise |
| Deep | Kelp Forest, Coral Garden, The Wreck, Jellyfish Bloom, Open Blue |
| Orbit | Earthrise, Ringed Giant, Space Station, Red Planet, Comet Pass |
| Music | Needle Drop, Tape Loop, Blue Hour, Brass Midnight, Signal Bloom, Silk Current, Orbital Drift, Tidal Bloom, Afterglow Arcade |
| Essentials | Club Prism, Break Grid, Blue Notes, Riff Cut, Still Fields, Funk Spiral |
| Geometry | Endless Layers, Petal Orbit, Arch Current, Quiet Weave, Prism Tide, Nested Passage |

**Needle Drop** (`?scene=needledrop`) is an original animated listening-room scene: a detailed direct-drive turntable with vinyl grooves, strobe dots, a calibrated pitch fader and a cueing lever, flanked by cloth-front speakers. A shelf of records, rainy round window, pendant light, sleeve, plant and steaming mug establish the room. Its warm rose, plum and teal inks use the collection's shared poster frame. This poster is intentionally silent: it creates no audio context, requests no audio files and hides the player audio controls.

The rest of the Music Series is also original and silent:

- **Tape Loop** (`?scene=tapeloop`): wound tape, turning reel hubs, guides and an inspection window; a stereo receiver with analog meters, slatted afternoon light, record shelves, a pencil and an open tape case.
- **Blue Hour** (`?scene=bluehour`): an open-front upright piano with strings, dampers, hammer mechanisms, ivory keys, pedals and an upholstered bench. Marked scores, a working metronome and lamp sit beneath a rainy city window.
- **Brass Midnight** (`?scene=brassmidnight`): a tapered saxophone with pearl keys, rods, bow guards and an engraved bell, resting on a padded stand. Velvet curtains, a rhythm section, ribbon microphone, near tables and moving stage light complete the jazz room.
- **Signal Bloom** (`?scene=signalbloom`): a wood-sided analog synth with labeled modules, calibrated pots, patch-plug collars, faders and a phosphor-style scope. Test gear, circuit studies, a task lamp, headphones and a penciled patch sheet fill the workshop.

Four additional silent animations take their visual direction from [The Art of Apple Music](https://artofapplemusic.com/). They fill the canvas without a title band, lettering or logos; transient navigation controls appear on interaction. The references remain Apple playlist artwork, and these are procedural interpretations rather than copies of their images or videos:

| Poster | Archive reference | Animation |
| --- | --- | --- |
| **Silk Current** (`?scene=silkcurrent`) | Ambient Chill | A pearlescent blue ribbon curls around a luminous orb; cyan and lavender reflections drift across its surface. |
| **Orbital Drift** (`?scene=orbitaldrift`) | Ambient Sleep | A shell of 7,200 independently shaded points rotates over a pale pool of light, with fine meridians and gentle ripples. |
| **Tidal Bloom** (`?scene=tidalbloom`) | Pure Chill | Six translucent, irregular aqua loops rotate and breathe on warm ivory. |
| **Afterglow Arcade** (`?scene=afterglowarcade`) | Chilltronics | Twelve polished indigo arches recede toward a glowing horizon, surrounded by moving clouds, stars, a miniature tree and a porcelain orb. |

[View the four-poster preview](docs/music-art-preview.png). [`music-art-references.json`](music-art-references.json) records the selected playlist and cover URLs. No archive assets are bundled or requested at runtime.

The **Essentials Series** uses geometric references exclusively from the archive's **Essentials** collection. Each poster represents a different genre, with its own musical timing or slow atmospheric movement. These are silent visual clocks, not audio-reactive effects. Like the four playlist interpretations above, their canvases have no lettering, logos, title bands or paper-grain overlays:

| Poster | Genre / Essentials reference | Motion |
| --- | --- | --- |
| **Club Prism** (`?scene=clubprism`) | Dance — EDM Essentials | Mint, green and lime striped triangular spotlights sweep across one another; a narrow cone expands on a 124 BPM four-on-the-floor pulse. |
| **Break Grid** (`?scene=breakgrid`) | Hip-hop — Alternative Hip-Hop Essentials | Blue and gold blocks chop and hop over an 88 BPM kick/snare pattern; a rolling strip suggests a looping sample. |
| **Blue Notes** (`?scene=bluenotes`) | Jazz — Jazz Piano Essentials | Floating ivory and teal bars tilt and bounce with a 108 BPM phrase and a 2:1 swung eighth-note pair. |
| **Riff Cut** (`?scene=riffcut`) | Punk rock — Classic Punk Essentials | Orange spikes jab and red diagonal cuts slash on alternating accents of a 168 BPM guitar backbeat. |
| **Still Fields** (`?scene=stillfields`) | Ambient — Ambient Essentials | Horizontal mint-to-forest colour planes move over long, independent breaths, without a percussive beat. |
| **Funk Spiral** (`?scene=funkspiral`) | Funk — Funk Essentials | Twelve curved orange and violet sectors rotate and flex to a syncopated 104 BPM groove. |

[View the six-poster preview](docs/essentials-preview.png) or [watch six seconds of their motion](docs/essentials-motion.mp4). [`essentials-art-references.json`](essentials-art-references.json) records each genre, clock, reference and original playlist URL, including the verified `Essentials` collection membership. All geometry is drawn locally; no archive images, video or audio are loaded.

The scenes use deterministic geometry for fine details and independent, slow clocks for environmental movement. Wood grain, metal fasteners, glass reflections and instrument mechanisms are drawn as vectors; there are no image or audio dependencies in the Music Series.

The **Geometry** series consists of six original, silent, text-free compositions with gradual, continuous color rotation. It draws its vocabulary from the bars, petals, arches, interlaced rectangles and diamonds in [SVG Backgrounds' geometric shapes](https://www.svgbackgrounds.com/elements/svg-shapes-geometric/). All paths are constructed locally; no downloaded SVGs, images or audio are used.

| Poster | Motion |
| --- | --- |
| **Endless Layers** (`?scene=endlesslayers`) | Wide, beveled bars slide in alternately from left and right every 2.8 seconds. The camera's downward scroll smoothly speeds up and slows down over 100 seconds, letting the stack climb toward the top and then recede. A bounded surface always leaves open space; the screen never becomes completely covered. Arrival cadence stays constant throughout. |
| **Petal Orbit** (`?scene=petalorbit`) | Eight nested four-lobed medallions rotate and breathe with slightly different phases; four small satellites follow the outer petals. |
| **Arch Current** (`?scene=archcurrent`) | Nine parallel arch ribbons flow in a slow, staggered wave around a small orbiting disc. |
| **Quiet Weave** (`?scene=quietweave`) | Two families of ribbon-like bars keep alternating over/under crossings as the woven plane glides and gently turns. |
| **Prism Tide** (`?scene=prismtide`) | Hollow diamond prisms rise and settle in staggered currents, with a soft swell and small changes in tilt. |
| **Nested Passage** (`?scene=nestedpassage`) | Rounded rectangular rings emerge at the center and expand beyond the screen's corners. New rings fade in while recycled rings stay outside the visible canvas. |

[View all six Geometry posters](docs/geometry-preview.png) or [watch ten seconds of their motion](docs/geometry-motion.mp4). The analytic animation clocks stay continuous through frame skips, screen rotations and long sessions. [`geometry-references.json`](geometry-references.json) records the shape vocabulary and authored motion.

All **132 audio files** are included in `live/audio/` (about 553 MB), so playback does not depend on WAVZ's CDN. Audio starts after browser interaction when autoplay restrictions apply. Ambience and music have separate volume and mute controls; available music tracks cycle as in the original.

## Snapshot and refresh

`wavz-source.json` records the original asset URLs, retrieval time, sizes and SHA-256 hashes. `wavz-audio.json` records all audio URLs, sizes and hashes. Scene drawing code is copied as published. Hosting adaptations remove upstream Google Analytics, make URLs relative and use local audio.

To refresh the published snapshot, with Python 3.9+ and Node.js 22+ installed:

```sh
python3 import-wavz.py
python3 import-audio.py
```

The first script follows same-site browser dependencies, reapplies hosting adaptations and retains the Music, Essentials and Geometry series, local player, clock, variable fonts and untinted browser chrome. [`live/player-local.js`](live/player-local.js) is the maintained viewer; `live/player.js` re-exports it after an upstream refresh. The second fetches all audio referenced by scenes that support audio, skips files already downloaded and records files unavailable at the source. Neither changes the preserved Lantern Cove page.
