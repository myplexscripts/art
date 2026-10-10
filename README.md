# Scenes

Static recreations of the Essentials genre covers, with all text and Apple logos removed, are available in [`covers/essentials/`](covers/essentials/).

Scenes includes the 32 original living posters published at [WAVZ](https://wavz.us), nine **Music Series** posters and three **Geometry** scenes: 44 scenes across eight series. Original WAVZ artwork, code and audio are by **Nick Saulino**. Source attribution is retained in this repository; the app has no credit footer.

The existing original **Lantern Cove** page is preserved at [`lantern-cove/index.html`](lantern-cove/index.html).

## Run

No build or dependencies are required. Serve this directory over HTTP so the browser can load JavaScript modules:

```sh
python3 serve.py 8000
```

Open `http://localhost:8000/`. The local server supports byte-range requests, which Safari needs for streamed audio; ordinary static hosting such as GitHub Pages supports them too. Open an individual poster using `?scene=beach`, for example. The page also works beneath a path such as `/art/`: navigation, icons and audio are relative to the site. `.nojekyll` supports static GitHub Pages hosting.

Opening a poster fills the entire viewport with artwork, including the safe areas beneath a phone's status bar, notch and home indicator. The bottom controls overlay the artwork and respect those safe areas; hiding them leaves no reserved strip. This applies to browser playback, native fullscreen and the standalone PWA. The gallery-to-player transition removes the thumbnail's frame. Browsers with the DOM Fullscreen API can hide their browser chrome; iPhone Safari keeps its own browser bars, while the installed PWA fills the screen. The old iPhone video-player workaround is removed to avoid its letterboxing and preserve the app's controls.

The app adds no status-bar tint, blur, gradient or overlay. The page and manifest omit `theme-color`, and iOS uses `black-translucent` with `viewport-fit=cover` so the artwork can show beneath the status bar in the installed PWA. Any remaining blur or glass in Safari/iOS chrome is controlled by the operating system; websites have no API to remove it. The manifest URL is versioned to refresh the name and old color settings.

The bottom bar's **Clock** button toggles a centered local-time clock. It is off by default, updates on the minute and refreshes when the app resumes. Inter shapes the whole time naturally, with tight kerning and a narrow colon; the default weight is 800. Text is fully opaque with no shadow and sits beneath the print grain. Tap the clock to switch between white and a solid palette color sampled from the art's edges; the shade is chosen for contrast against the art directly behind the time and follows the animation. Pinch to resize; swipe right for bolder text or left for lighter text (weights 100–900). Color mode, size and weight stay saved across scenes and reloads. Trackpad pinch also resizes it; with the clock focused, Enter/Space changes color, +/− changes size, and left/right arrows change weight. [View the clock](docs/player-clock-preview.png).

**Inter** (weights 100–900) is the global variable Google Font for the interface, headings, poster lettering and clock. Its WOFF2 file is self-hosted under [`live/fonts/`](live/fonts/) with its SIL Open Font License and source URL. Font loading needs no Google connection at runtime. The previously supplied Manrope asset remains available.

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
| Geometry | Stacks, Blooms, Deep Waves |

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

The scenes use deterministic geometry for fine details and independent, slow clocks for environmental movement. Wood grain, metal fasteners, glass reflections and instrument mechanisms are drawn as vectors; there are no image or audio dependencies in the Music Series.

The **Geometry** collection contains only **Stacks**, **Blooms** and **Deep Waves**. The Essentials series and the other Geometry scenes are no longer registered in the gallery. Previously supplied static Essentials covers remain archived in `covers/essentials/`. Existing `?scene=sand` links open Deep Waves.

All three Geometry scenes use flat shapes, print grain and a muted, bedside-friendly palette. The grain covers the gallery artwork and both the artwork and clock in the full-screen viewer. The entire canvas shares one hue at a time; only shade varies, and every element rotates through hue at the same slow rate. Animations use standard Canvas 2D and cached vector paths for mobile Safari. Their clocks are independent of frame rate and remain consistent after a resize or a long pause.

| Scene | Motion | Reused ambience and music |
| --- | --- | --- |
| **Stacks** (`?scene=stacks`) | Flat bars are exactly five times the previous thickness. Left/right arrivals and camera drift independently change pace through smooth seeded randomness. Shades run from light at the top to dark at the bottom. Bounded drift always leaves background showing. | Open Blue: deep-water ambience and its two music tracks. |
| **Blooms** (`?scene=blooms`) | Contrasting shades alternate between expanding flowers. A new bloom starts at zero radius every 5.8 seconds. Four-, six-, three- and five-lobed shapes take turns about every three minutes, with enough time to fill the canvas. Existing blooms keep their shape as the next variation emerges from the center. | Lavender Field: field ambience and its two music tracks. |
| **Deep Waves** (`?scene=deepwaves`) | Flat water ribbons and fine crest lines undulate with travelling swells, opposing ripples and a gentle rise and fall. | Open Blue: deep-water ambience and its two music tracks. |

The audio uses existing local files, streamed and crossfaded through the same Ambience, Music and Next Track controls as the original scenes. Track choices are saved separately for each new scene. On iOS, an initial tap can unlock playback when autoplay is blocked.

[View the Geometry scenes](docs/geometry-preview.png) or [watch ten seconds of their motion](docs/geometry-motion.mp4). [`geometry-references.json`](geometry-references.json) records the authored motion and audio sources. No external SVGs or image assets are needed.

All **132 audio files** are included in `live/audio/` (about 553 MB), so playback does not depend on WAVZ's CDN. Audio starts after browser interaction when autoplay restrictions apply. Ambience and music have separate volume and mute controls; available music tracks cycle as in the original.

## Snapshot and refresh

`wavz-source.json` records the original asset URLs, retrieval time, sizes and SHA-256 hashes. `wavz-audio.json` records all audio URLs, sizes and hashes. Scene drawing code is copied as published. Hosting adaptations remove upstream Google Analytics, make URLs relative and use local audio.

To refresh the published snapshot, with Python 3.9+ and Node.js 22+ installed:

```sh
python3 import-wavz.py
python3 import-audio.py
```

The first script follows same-site browser dependencies, reapplies hosting adaptations and retains the Music and Geometry collections, Scenes branding, footer removal, reused audio sources, local player, clock, variable Inter, Geometry grain and untinted browser chrome. [`live/player-local.js`](live/player-local.js) is the maintained viewer; `live/player.js` re-exports it after an upstream refresh. The second fetches all audio referenced by scenes that support audio, skips files already downloaded and records files unavailable at the source. Neither changes the preserved Lantern Cove page.
