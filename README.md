# Scenes

Static recreations of the Essentials genre covers, with all text and Apple logos removed, are available in [`covers/essentials/`](covers/essentials/).

Scenes includes the 32 original living posters published at [WAVZ](https://wavz.us), five **Music Series** posters and three **Geometry** scenes: 40 scenes across eight series. Original WAVZ artwork, code and audio are by **Nick Saulino**. Source attribution is retained in this repository; the app has no credit footer.

The existing original **Lantern Cove** page is preserved at [`lantern-cove/index.html`](lantern-cove/index.html).

## Run

No build or dependencies are required. Serve this directory over HTTP so the browser can load JavaScript modules:

```sh
python3 serve.py 8000
```

Open `http://localhost:8000/`. The local server supports byte-range requests, which Safari needs for streamed audio; ordinary static hosting such as GitHub Pages supports them too. Open an individual poster using `?scene=beach`, for example. The page also works beneath a path such as `/art/`: navigation, icons and audio are relative to the site. `.nojekyll` supports static GitHub Pages hosting.

Opening a poster fills the entire viewport with artwork, including the safe areas beneath a phone's status bar, notch and home indicator. The bottom controls overlay the artwork and respect those safe areas; hiding them leaves no reserved strip. This applies to browser playback, native fullscreen and the standalone PWA. The gallery-to-player transition removes the thumbnail's frame. The clock stays invisible during expansion and fades in over 180 ms after the poster has landed, Barlow Condensed has loaded and adaptive ink has been assessed. Closing fades the clock out before the poster starts shrinking. Rapid navigation cancels outgoing viewers without leaving a second clock or restoring stale page styles. Reduced motion skips both transitions. Browsers with the DOM Fullscreen API can hide their browser chrome; iPhone Safari keeps its own browser bars, while the installed PWA fills the screen. The old iPhone video-player workaround is removed to avoid its letterboxing and preserve the app's controls.

The app adds no status-bar tint, blur, gradient or overlay. The page and manifest omit `theme-color`, and iOS uses `black-translucent` with `viewport-fit=cover` so the artwork can show beneath the status bar in the installed PWA. Any remaining blur or glass in Safari/iOS chrome is controlled by the operating system; websites have no API to remove it. Recent installed-PWA top-edge fade reports include [this iOS issue](https://github.com/stephanfo/club-o-clock/issues/112); the report describes failed CSS and metadata workarounds. Gallery and welcome content stay below the status-bar safe area, with extra space for headings and controls. The welcome fits the currently visible viewport as Safari’s bars expand or collapse. Full-screen artwork still extends beneath the status bar. The manifest URL and the complete local JavaScript/CSS module graph are versioned to prevent mixed cached releases.

The bottom bar's **Clock** button toggles a local-time clock. It is off by default, updates on the minute and refreshes when the app resumes. Barlow Condensed uses fixed character slots, with room reserved for two hour digits and the locale's day period. The colon and other characters stay in place through every time change, and the clock's fitted size remains constant. Only changed characters scroll upward: the previous character leaves above as its replacement enters from below. The default weight is 800. Text is fully opaque during playback, with no shadow, and sits beneath the print grain. Tap the clock to switch between white and the last selected colour; adaptive is the initial colour choice.

**Colour** opens a picker with **Adaptive**, **White**, the poster's three most prominent distinct colours and **Pick from scene**, the single custom colour tool. It samples a tapped pixel directly from the artwork canvas, so grain and clock overlays cannot affect the result; it also works on mobile browsers. A small swatch beside the tool shows the selected custom ink. Poster swatches and custom selections keep their exact RGB colour through movement, animation, reloads and hue cycling. Colour choices are remembered separately for each poster, including the last non-white choice for quick taps; earlier custom selections remain intact. Existing white/palette preferences remain the default for scenes without a saved selection. Opening the picker turns the clock on if needed. Tab stays within the editor and Escape cancels scene sampling or closes the editor.

Adaptive assesses the artwork once at the clock's placement. It looks for the closest complementary hue already in the poster with enough light/dark contrast for readable text. If none is suitable, it creates a complementary ink with saturation drawn from the poster and adjusts its lightness to reach readable contrast. Neutral backgrounds use the nearest readable opposite ink. The choice stays fixed as the artwork animates, the time changes or the app resumes. Releasing a drag, moving with the keyboard or returning to the centre reassesses the final placement; opening a poster or choosing Adaptive makes an initial assessment. In the colour-cycling Stacks and Blooms, only adaptive ink's hue follows the scene's slow colour cycle: its measured brightness and light/dark choice stay locked, with no further background sampling. White always stays solid white.

Hold the clock for 380 ms to drag it anywhere within the poster; a small compression and rebound confirms the hold. Placement, centring and adaptive colour assessment use the visible lettering, excluding blank hour cells, outer font bearings and invisible touch padding. Character slots still keep their fixed widths and the fitted size always reserves the longest time. The placement measurements stay fixed between gestures and changes in the hour field, so thin replacement minute digits do not shift the other characters. Dragging to the left or right edge pins that visible edge; it stays there through hour-length changes, resizing, rotation and reloads. Elsewhere, existing cells stay in place when an hour digit appears or disappears, with a placement correction only if the new digit would leave the poster. Placement is stored separately for each poster as normalized coordinates, with older saved edge attempts carried forward. Triple tap clears that poster's position and glides the visible clock back to the centre with a gentle overshoot. Single taps wait briefly so a triple tap does not change colour. Pinch to resize; at its largest size, up to 3% of the lettering can clip beyond each screen edge. An oversized clock stays centred on the filled axis. Saved zoom is reconciled with the visible size limit, and each pinch movement uses the previous distance, so shrinking responds immediately even after reaching that limit. Quick horizontal swipes adjust weight (100–900). Size and weight stay saved across scenes and reloads. Trackpad pinch also resizes it. Keyboard controls: Enter/Space for colour, +/− for size, left/right arrows for weight, Shift+arrows for placement, and Home to centre. Reduced motion removes the digit, hold and centring animations. [View the clock](docs/player-clock-preview.png).

On the first visit, a short welcome splash leads to the app's features and an animated iPhone installation guide. It demonstrates Safari's page menu, Share, scrolling to Add to Home Screen, keeping Open as Web App enabled, adding the icon and opening Scenes without browser bars. The steps follow [Apple's iPhone guide](https://support.apple.com/guide/iphone/turn-a-website-into-an-app-iph42ab2f3a7/ios). The top **Skip** button dismisses the welcome; the bottom **Next** button advances from features through each installation step and then returns to the gallery. **Back** returns to the previous step. The welcome occupies the visible viewport, keeps navigation visible and scrolls its own content while freezing the gallery; closing restores the exact gallery position. Its scroll lock also works when a first visit opens directly into a scene. Pause, replay, direct step selection and skipping are available; reduced motion uses static, manually advanced steps. Installed PWA launches show the features and skip installation instructions. Dismissing the welcome is remembered on that device. The gallery has no welcome or iPhone-setup button.

**Barlow Condensed** is the fixed global font for the interface, headings, poster lettering and clock; the preview selectors have been removed. Interface labels, onboarding copy, phone-guide labels and the clock colour editor have a 16px minimum, with larger headings retained. All 40 gallery cards use HTML captions beneath the artwork: 28px names and 16px series/number labels. Captions therefore keep their real text size independently of canvas resolution or thumbnail size. Other framed canvas layouts also use a 16 CSS-pixel caption minimum. Clock colour, weight, size and position preferences stay intact; earlier preview font choices are ignored. All nine static font weights (100–900) load before clock fitting. Google Fonts WOFF2 files are self-hosted under [`live/fonts/`](live/fonts/) with their SIL Open Font License and source URLs, so font loading needs no Google connection at runtime.

The gallery has light and dark appearances. On a fresh device it follows `prefers-color-scheme`, including system changes while the page is open. The **Dark mode** switch changes the gallery and welcome palette and remembers that explicit choice across visits. The artwork and clock palettes remain scene-specific.

Clock depth is temporarily inactive in the app, with no toolbar button or loaded depth editor. Its authored layer boundaries, renderer, picker module and saved selections remain intact for future use. The viewer's `DEPTH_ENABLED` switch disables foreground compositing without deleting those preferences.

The retained depth renderer uses a foreground coverage mask clipped to the clock's area, captured during the existing Canvas 2D drawing pass. The finished poster is shown through that mask so its colours and translucent details stay unchanged. All 40 active scenes have authored boundaries; gallery previews use the original rendering without depth. [`scene_depth.py`](scene_depth.py) maintains their labels and reapplies the original scene boundaries during an upstream refresh. Geometry and the archived Afterglow Arcade stage supply their own boundaries. No segmentation service, image downloads or WebGL are required. [Archived depth editor preview](docs/clock-depth-preview.png).

## Included posters

| Series | Posters |
| --- | --- |
| Nocturne | Moonpath, Hidden Falls, Lantern Harbor, Campfire Ridge, Night Train, Desert Mesa, Northern Lights |
| Weather | Summer Storm, First Snow, Fog Bank, Autumn Gale, After the Rain |
| Window | Rainy Cafe, Sleeper Car, Cabin Window, City Loft, Sea View |
| Daybreak | Rice Terraces, Lavender Field, Alpine Lake, Balloon Dawn, Savanna Sunrise |
| Deep | Kelp Forest, Coral Garden, The Wreck, Jellyfish Bloom, Open Blue |
| Orbit | Earthrise, Ringed Giant, Space Station, Red Planet, Comet Pass |
| Music | Needle Drop, Tape Loop, Blue Hour, Brass Midnight, Signal Bloom |
| Geometry | Stacks, Blooms, Deep Waves |

**Needle Drop** (`?scene=needledrop`) is an original animated listening-room scene: a detailed direct-drive turntable with vinyl grooves, strobe dots, a calibrated pitch fader and a cueing lever, flanked by cloth-front speakers. A shelf of records, rainy round window, pendant light, sleeve, plant and steaming mug establish the room. Its warm rose, plum and teal inks use the collection's shared poster frame. This poster is intentionally silent: it creates no audio context, requests no audio files and hides the player audio controls.

The rest of the Music Series is also original and silent:

- **Tape Loop** (`?scene=tapeloop`): wound tape, turning reel hubs, guides and an inspection window; a stereo receiver with analog meters, slatted afternoon light, record shelves, a pencil and an open tape case.
- **Blue Hour** (`?scene=bluehour`): an open-front upright piano with strings, dampers, hammer mechanisms, ivory keys, pedals and an upholstered bench. Marked scores, a working metronome and lamp sit beneath a rainy city window.
- **Brass Midnight** (`?scene=brassmidnight`): a tapered saxophone with pearl keys, rods, bow guards and an engraved bell, resting on a padded stand. Velvet curtains, a rhythm section, ribbon microphone, near tables and moving stage light complete the jazz room.
- **Signal Bloom** (`?scene=signalbloom`): a wood-sided analog synth with labeled modules, calibrated pots, patch-plug collars, faders and a phosphor-style scope. Test gear, circuit studies, a task lamp, headphones and a penciled patch sheet fill the workshop.

Silk Current, Orbital Drift, Tidal Bloom and Afterglow Arcade are no longer registered in the gallery. Their earlier [four-poster preview](docs/music-art-preview.png) and [`music-art-references.json`](music-art-references.json) remain archived in the repository.

The scenes use deterministic geometry for fine details and independent, slow clocks for environmental movement. Wood grain, metal fasteners, glass reflections and instrument mechanisms are drawn as vectors; there are no image or audio dependencies in the Music Series.

The **Geometry** collection contains only **Stacks**, **Blooms** and **Deep Waves**. The Essentials series and the other Geometry scenes are no longer registered in the gallery. Previously supplied static Essentials covers remain archived in `covers/essentials/`. Existing `?scene=sand` links open Deep Waves.

All three Geometry scenes use flat shapes and a muted, bedside-friendly palette. Gallery cards display the same name, series and number band as the original posters and rely on the page's global grain, with no grain baked into their artwork or an extra card overlay. The gallery and viewer retain the same grain strength. Full-screen playback fills every edge, with grain covering both the artwork and clock. Stacks and Blooms each complete a continuous hue cycle every 90 seconds; Deep Waves keeps a fixed blue hue with layered lighter and darker shades. Animations use standard Canvas 2D and cached vector paths for mobile Safari. Their clocks are independent of frame rate and remain consistent after a resize or a long pause.

| Scene | Motion | Reused ambience and music |
| --- | --- | --- |
| **Stacks** (`?scene=stacks`) | Flat bars are exactly five times the previous thickness. Left/right arrivals and camera drift independently change pace through smooth seeded randomness. Shades run from light at the top to dark at the bottom. Bounded drift always leaves background showing. | Open Blue: deep-water ambience and its two music tracks. |
| **Blooms** (`?scene=blooms`) | Contrasting shades alternate between expanding flowers. A new bloom starts at zero radius every 5.8 seconds. Four-, six-, three- and five-lobed shapes take turns about every three minutes, with enough time to fill the canvas. Existing blooms keep their shape as the next variation emerges from the center. | Lavender Field: field ambience and its two music tracks. |
| **Deep Waves** (`?scene=deepwaves`) | Concentric water ripples expand outward while the scene slowly scrolls vertically and drifts sideways. Gentle reversals keep the scroll continuous. Inner layers are lighter and outer layers darker, all in one fixed blue hue. | Open Blue: deep-water ambience and its two music tracks. |

The audio uses existing local files, streamed and crossfaded through the same Ambience, Music and Next Track controls as the original scenes. Track choices are saved separately for each new scene. On iOS, an initial tap can unlock playback when autoplay is blocked.

[View the Geometry scenes](docs/geometry-preview.png) or [watch ten seconds of their motion](docs/geometry-motion.mp4). These exported previews contain no grain. [`geometry-references.json`](geometry-references.json) records the authored motion and audio sources. No external SVGs or image assets are needed.

All **132 original WAVZ audio files** are included in `live/audio/` (about 553 MB), so playback does not depend on WAVZ's CDN. Audio starts after browser interaction when autoplay restrictions apply. Ambience and music have separate volume and mute controls; available music tracks cycle as in the original.

**Soft Arrival** is an original Scenes chime: three soft bell notes (D4, A4, D5) with a rounded attack and a warm reverberant tail. The 7.2-second [MP3](live/audio/scenes-chime.mp3) is ready for a future focus timer; the [WAV master](live/audio/scenes-chime.wav) is also included. It uses synthesized tones and room reflections, with no third-party samples. To regenerate it, install NumPy and SciPy, make ffmpeg available, and run `python3 make-chime.py`.

## Snapshot and refresh

`wavz-source.json` records the original asset URLs, retrieval time, sizes and SHA-256 hashes. `wavz-audio.json` records all audio URLs, sizes and hashes. Scene drawing code is copied as published. Hosting adaptations remove upstream Google Analytics, make URLs relative and use local audio.

To refresh the published snapshot, with Python 3.9+ and Node.js 22+ installed:

```sh
python3 import-wavz.py
python3 import-audio.py
```

The first script follows same-site browser dependencies, reapplies hosting adaptations and retains the Music and Geometry collections, Scenes branding, footer removal, reused audio sources, local player, movable clock with per-poster colours and retained depth logic, sequenced clock fades, fixed Barlow Condensed typography with a 16px interface minimum, readable HTML gallery captions, system-aware gallery themes, a full-screen welcome guide, versioned UI assets, Geometry grain and untinted browser chrome. [`live/player-local.js`](live/player-local.js) is the maintained viewer; `live/player.js` re-exports it after an upstream refresh. The second fetches all audio referenced by scenes that support audio, skips files already downloaded and records files unavailable at the source. Neither changes the preserved Lantern Cove page.
