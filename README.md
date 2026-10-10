# Living posters

A complete snapshot of the 32 living posters published at [WAVZ](https://wavz.us), plus five original **Music Series** posters: 37 posters across seven series. The original WAVZ artwork, code and audio are by **Nick Saulino**; the gallery retains his attribution. The Music Series is new artwork created for this repository.

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
| Music (original) | Needle Drop, Tape Loop, Blue Hour, Brass Midnight, Signal Bloom |

**Needle Drop** (`?scene=needledrop`) is an original animated vinyl scene: a spinning record with a rotating label, strobe dots and light glints, a gently swaying tonearm, breathing speaker cones, flowing wall bands and drifting clouds through a round window. Its warm rose, plum and teal inks use the collection's shared poster frame. This poster is intentionally silent: it creates no audio context, requests no audio files and hides the player audio controls.

The rest of the Music Series is also original and silent:

- **Tape Loop** (`?scene=tapeloop`): counter-rotating cassette reels, drifting tape ribbon, a rolling counter and animated meter.
- **Blue Hour** (`?scene=bluehour`): an upright piano with gently moving keys and shimmering strings beneath a rainy arched window.
- **Brass Midnight** (`?scene=brassmidnight`): a golden saxophone with a traveling highlight, slow spotlights and floating graphic accents.
- **Signal Bloom** (`?scene=signalbloom`): an analog synthesizer with a traveling scope waveform, moving faders, turning knobs and swaying patch cables.

All **132 audio files** are included in `live/audio/` (about 553 MB), so playback does not depend on WAVZ's CDN. Audio starts after browser interaction when autoplay restrictions apply. Ambience and music have separate volume and mute controls; available music tracks cycle as in the original.

## Snapshot and refresh

`wavz-source.json` records the original asset URLs, retrieval time, sizes and SHA-256 hashes. `wavz-audio.json` records all audio URLs, sizes and hashes. Scene drawing code is copied as published. Hosting adaptations remove upstream Google Analytics, make URLs relative and use local audio.

To refresh the published snapshot, with Python 3.9+ and Node.js 22+ installed:

```sh
python3 import-wavz.py
python3 import-audio.py
```

The first script follows same-site browser dependencies, reapplies hosting adaptations and retains the original Music Series. The second fetches all audio referenced by scenes that support audio, skips files already downloaded and records files unavailable at the source. Neither changes the preserved Lantern Cove page.
