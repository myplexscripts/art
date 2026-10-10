# Living posters

A complete snapshot of the 32 living posters published at [WAVZ](https://wavz.us), plus nine **Music Series** posters: 41 posters across seven series. The original WAVZ artwork, code and audio are by **Nick Saulino**; the gallery retains his attribution. The Music Series contains five original music rooms and four newly coded interpretations of playlist artwork.

The existing original **Lantern Cove** page is preserved at [`lantern-cove/index.html`](lantern-cove/index.html).

## Run

No build or dependencies are required. Serve this directory over HTTP so the browser can load JavaScript modules:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Open an individual poster using `?scene=beach`, for example. The page also works beneath a path such as `/art/`: navigation, icons and audio are relative to the site. `.nojekyll` supports static GitHub Pages hosting.

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

All **132 audio files** are included in `live/audio/` (about 553 MB), so playback does not depend on WAVZ's CDN. Audio starts after browser interaction when autoplay restrictions apply. Ambience and music have separate volume and mute controls; available music tracks cycle as in the original.

## Snapshot and refresh

`wavz-source.json` records the original asset URLs, retrieval time, sizes and SHA-256 hashes. `wavz-audio.json` records all audio URLs, sizes and hashes. Scene drawing code is copied as published. Hosting adaptations remove upstream Google Analytics, make URLs relative and use local audio.

To refresh the published snapshot, with Python 3.9+ and Node.js 22+ installed:

```sh
python3 import-wavz.py
python3 import-audio.py
```

The first script follows same-site browser dependencies, reapplies hosting adaptations and retains the original Music Series. The second fetches all audio referenced by scenes that support audio, skips files already downloaded and records files unavailable at the source. Neither changes the preserved Lantern Cove page.
