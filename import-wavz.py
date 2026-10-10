#!/usr/bin/env python3
"""Snapshot WAVZ's public browser assets, following local dependencies."""
import hashlib
import json
import re
from collections import deque
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
from urllib.request import Request, urlopen

ORIGIN = 'https://wavz.us/'
ROOT = Path(__file__).resolve().parent

def references(text, suffix):
    if suffix == '.html':
        yield from re.findall(r'(?:src|href)=["\']([^"\']+)', text)
    if suffix in ('.html', '.js', '.css'):
        yield from re.findall(r'(?:from\s*|import\s*|import\s*\(\s*)["\']([^"\']+)', text)
        yield from re.findall(r'new\s+URL\(\s*["\']([^"\']+)', text)
        yield from re.findall(r'url\(\s*["\']?([^\s\)"\']+)', text)
        yield from re.findall(r'["\']((?:\./|\.\./|/)[^"\'\s]+\.(?:png|jpg|jpeg|svg|webp|woff2?|mp3|ogg|wav|js|css))(?:\?[^"\']*)?["\']', text)
    if suffix == '.webmanifest':
        for icon in json.loads(text).get('icons', []):
            yield icon['src']

def main():
    queue = deque([ORIGIN])
    seen = set()
    files = []
    while queue:
        url = queue.popleft()
        parts = urlsplit(url)
        if parts.netloc != 'wavz.us' or parts.path in seen:
            continue
        seen.add(parts.path)
        if parts.path != '/' and not Path(parts.path).suffix:
            continue
        relative = 'index.html' if parts.path == '/' else unquote(parts.path).lstrip('/')
        target = ROOT / relative
        if not target.resolve().is_relative_to(ROOT):
            raise ValueError('Unsafe path: ' + relative)
        with urlopen(Request(url, headers={'User-Agent': 'WAVZ-asset-snapshot/1.0'}), timeout=30) as response:
            data = response.read()
            if parts.path != '/' and 'text/html' in response.headers.get('content-type', ''):
                raise ValueError('Unexpected HTML for asset ' + url)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        files.append({'path': relative, 'url': url, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
        suffix = target.suffix
        if suffix in ('.html', '.js', '.css', '.webmanifest'):
            for ref in references(data.decode('utf-8'), suffix):
                if '${' not in ref:
                    queue.append(urljoin(url, ref))
        print(relative, len(data), flush=True)
    (ROOT / 'wavz-source.json').write_text(json.dumps({'source': ORIGIN, 'retrieved_at': datetime.now(timezone.utc).isoformat(), 'files': sorted(files, key=lambda f: f['path'])}, indent=2) + '\n')
    adapt_for_local_hosting()

def adapt_for_local_hosting():
    """Keep navigation/assets relative, omit upstream analytics, and use vendored audio."""
    path = ROOT / 'index.html'
    text = path.read_text()
    text = re.sub(r'<script async src="https://www.googletagmanager.com/gtag/js\?id=G-PKL1DBXEWK"></script>\s*<script>.*?</script>\s*', '', text, count=1, flags=re.S)
    text = text.replace('href="/favicon/', 'href="./favicon/').replace('href="/site.webmanifest', 'href="./site.webmanifest')
    text = re.sub(r'href="\./site\.webmanifest(?:\?[^\"]*)?"', 'href="./site.webmanifest?v=4"', text, count=1)
    text = text.replace("a.href = '/?scene=' + name", "a.href = '?scene=' + name")
    text = text.replace("history.replaceState(null, '', '/')", "history.replaceState(null, '', location.pathname)")
    path.write_text(text)
    path = ROOT / 'live/player.js'
    path.write_text(path.read_text().replace('href="/"', 'href="./"'))
    path = ROOT / 'live/sound.js'
    text = path.read_text().replace("const STORE = 'https://cdn.wavz.us/';", "const STORE = new URL('./audio/', import.meta.url);")
    text = text.replace("const base = ['localhost', '127.0.0.1'].includes(location.hostname) ? new URL('./audio/', import.meta.url) : STORE, streams = [];", "const base = STORE, streams = [];")
    text = text.replace('// The files are kept in a storage bucket, not with the site (audio/upload.py puts them there); a copy beside this\n// file is used when the site is run locally. The bucket allows other sites to read it, which the volume controls need.', '// Audio is vendored beside this module so the clone works independently of the original CDN.')
    path.write_text(text)
    path = ROOT / 'site.webmanifest'
    manifest = json.loads(path.read_text())
    manifest.update(start_url='./', scope='./', name='Scenes', short_name='Scenes')
    # Leave browser/OS chrome untinted; the iOS status bar overlays the artwork.
    manifest.pop('theme_color', None)
    for icon in manifest['icons']:
        icon['src'] = './' + icon['src'].lstrip('/')
    path.write_text(json.dumps(manifest, indent=2) + '\n')
    # Retain the locally authored series when refreshing the WAVZ snapshot.
    if (ROOT / 'live/s-music.js').exists():
        path = ROOT / 'index.html'
        path.write_text(path.read_text().replace('Made by <a href="https://nicksaulino.com" rel="author">Nick Saulino</a>', 'WAVZ originals by <a href="https://nicksaulino.com" rel="author">Nick Saulino</a> · Music and Essentials: original rooms and playlist-art interpretations'))
        text = path.read_text().replace('  .posters canvas { width: 100%; height: 100%; display: block; }', '  .posters canvas { width: 100%; height: 100%; display: block; }\n  .posters a.textless canvas { position: relative; z-index: 1; }')
        text = text.replace("    a.draggable = false;", "    a.classList.toggle('textless', scene.textless === true);\n    a.draggable = false;")
        path.write_text(text)
        path = ROOT / 'live/poster.js'
        text = path.read_text().replace("import * as orbit from './s-orbit.js';", "import * as orbit from './s-orbit.js';\nimport * as music from './s-music.js';")
        text = text.replace('[nocturne, weather, windows, daybreak, deep, orbit]', '[nocturne, weather, windows, daybreak, deep, orbit, music]')
        text = text.replace('  const VW = width(aspect), VH = VW / aspect, m = M * frame;', '  // Text-free artwork always fills its canvas, including gallery cards and frame transitions.\n  if (scene.textless) frame = 0;\n  const VW = width(aspect), VH = VW / aspect, m = M * frame;')
        path.write_text(text)
        path = ROOT / 'live/player.js'
        text = path.read_text().replace('.wz-ui [hidden], .wz-mark[hidden]', '.wz-ui [hidden], .wz-ui .wz-row[hidden], .wz-mark[hidden], .wz-grain[hidden]')
        text = text.replace("  let name = first, L, k = 1, look = localStorage.getItem('wavz-frame') ?? 'light',", "  const textless = SCENES[first].textless === true;\n  let name = first, L, k = 1, look = textless ? 'none' : localStorage.getItem('wavz-frame') ?? 'light',")
        text = text.replace("sides = mode === 'strip' && w >= 1100", "sides = !textless && mode === 'strip' && w >= 1100")
        text = text.replace("  const frame = $('wz-frame');", "  const frame = $('wz-frame');\n  frame.hidden = textless;")
        text = text.replace("grain.style.backgroundSize = 512 / devicePixelRatio + 'px';", "grain.style.backgroundSize = 512 / devicePixelRatio + 'px';\n  grain.hidden = textless;")
        text = text.replace('if (vfs && grainFill)', 'if (vfs && grainFill && !textless)')
        marker = "  const muted = { amb: localStorage.getItem('wavz-ambience-off')"
        text = text.replace(marker, "  const hasAudio = SCENES[name].audio !== false;\n  root.querySelector('.wz-r2').hidden = !hasAudio;\n" + marker)
        text = text.replace('  async function startSound() {', '  async function startSound() {\n    if (!hasAudio) return;')
        text = text.replace('  on = !(muted.amb && muted.mus); levels();', '  on = hasAudio && !(muted.amb && muted.mus); levels();')
        path.write_text(text)
    if (ROOT / 'live/s-geometry.js').exists():
        path = ROOT / 'live/poster.js'
        text = path.read_text()
        if "import * as geometry from './s-geometry.js';" not in text:
            text = text.replace("import { C, M, FONT }", "import * as geometry from './s-geometry.js';\nimport { C, M, FONT }")
            text = re.sub(r'(export const SERIES = \[[^\]]+)(\])', r'\1, geometry\2', text, count=1)
        path.write_text(text)
        path = ROOT / 'index.html'
        text = path.read_text().replace('Music and Essentials: original rooms and playlist-art interpretations', 'Music, Essentials and Geometry: original rooms, playlist studies and moving shapes')
        path.write_text(text)
    if (ROOT / 'live/player-local.js').exists():
        adapt_local_viewer()
        adapt_scenes()

def adapt_local_viewer():
    """Retain full-bleed playback, the clock and variable fonts during a source refresh."""
    (ROOT / 'live/player.js').write_text("// Local viewer overrides are retained when refreshing the upstream WAVZ snapshot.\nexport { openScene } from './player-local.js';\n")
    path = ROOT / 'live/kit.js'
    text = re.sub(r"export const FONT = '[^']*';", "export const FONT = '\"Inter\", system-ui, sans-serif';", path.read_text(), count=1)
    path.write_text(text)
    path = ROOT / 'index.html'
    text = path.read_text()
    text = re.sub(r'<meta name="theme-color"[^>]*>\s*', '', text, count=1)
    text = re.sub(r'(<meta name="viewport" content=")([^"]+)(">)', lambda m: m[1] + m[2] + ('' if 'viewport-fit=cover' in m[2] else ', viewport-fit=cover') + m[3], text, count=1)
    text = text.replace(" document.querySelector('meta[name=viewport]').content += ', viewport-fit=cover';", '')
    if 'href="./live/fonts.css"' not in text:
        text = text.replace('</head>', '<link rel="stylesheet" href="./live/fonts.css">\n</head>')
    text = re.sub(r'--face: [^;]+;', '--face: "Inter", system-ui, sans-serif;', text, count=1)
    if '--display:' not in text:
        text = text.replace('--face: "Inter", system-ui, sans-serif;', '--face: "Inter", system-ui, sans-serif; --display: "Inter", system-ui, sans-serif;')
    else:
        text = re.sub(r'--display: [^;]+;', '--display: "Inter", system-ui, sans-serif;', text, count=1)
    for tag in ['h1', 'h2']:
        if tag + ' { margin: 0; font-family: var(--display);' not in text:
            text = text.replace(tag + ' { margin: 0;', tag + ' { margin: 0; font-family: var(--display);')
    if 'document.fonts.ready.then(() => { for (const card of cards) card.paint(); });' not in text:
        text = text.replace(' }); size();', ' }); size();\n  document.fonts.ready.then(() => { for (const card of cards) card.paint(); });')
    old_kern = "        c.font = cs.fontWeight + ' 200px ' + cs.fontFamily; const w = (t) => c.measureText(t).width;\n        for (let i = 1; i < k.length; i++) k[i].style.marginLeft = (w(k[i - 1].textContent + k[i].textContent) - w(k[i - 1].textContent) - w(k[i].textContent)) / 200 + 'em'; })();"
    new_kern = "        const kern = () => { c.font = cs.fontWeight + ' 200px ' + cs.fontFamily; const w = (t) => c.measureText(t).width;\n          for (let i = 1; i < k.length; i++) k[i].style.marginLeft = (w(k[i - 1].textContent + k[i].textContent) - w(k[i - 1].textContent) - w(k[i].textContent)) / 200 + 'em'; };\n        kern(); document.fonts.ready.then(kern); })();"
    text = text.replace(old_kern, new_kern)
    path.write_text(text)

def adapt_scenes():
    """Keep the Scenes name, collection selection, footer removal and reused Geometry audio."""
    path = ROOT / 'index.html'
    text = path.read_text()
    text = re.sub(r'<title>[^<]*</title>', '<title>Scenes</title>', text, count=1)
    text = text.replace('content="WAVZ"', 'content="Scenes"')
    text = re.sub(r'<h1 aria-label="WAVZ">.*?</h1>', '<h1 aria-label="Scenes">' + ''.join(f'<span style="--i:{i}">{char}</span>' for i, char in enumerate('Scenes')) + '</h1>', text, count=1)
    text = re.sub(r'\s*<footer>.*?</footer>', '', text, flags=re.S)
    text = re.sub(r"^\s*\{ const foot = document.querySelector\('footer'\);[^\n]*\}\n", '', text, flags=re.M)
    text = text.replace('.series, .posters a, footer {', '.series, .posters a {').replace('header p, footer.in, .series.in', 'header p, .series.in')
    text = '\n'.join(line for line in text.splitlines() if not line.lstrip().startswith('footer')) + '\n'
    text = text.replace('Living posters for your screen. Open one, go fullscreen, and leave it running.', 'Calming scenes for your screen. Open one, go fullscreen, and unwind.')
    if '.posters a.grained::after' not in text:
        text = text.replace('  .posters a.textless canvas { position: relative; z-index: 1; }', '  .posters a.textless canvas { position: relative; z-index: 1; }\n  .posters a.grained { position: relative; }\n  .posters a.grained::after { content: ""; position: absolute; inset: 0; z-index: 2; background: var(--grain, none); background-size: var(--grain-size, 256px); pointer-events: none; }')
    if "a.classList.toggle('grained'" not in text:
        text = text.replace("    a.classList.toggle('textless', scene.textless === true);", "    a.classList.toggle('textless', scene.textless === true);\n    a.classList.toggle('grained', scene.grain === true);")
    text = text.replace('  function open(name, grow) {\n    player?.close();', "  const resolveSceneName = name => ({ endlesslayers: 'stacks', petalorbit: 'blooms', sand: 'deepwaves' }[name] ?? name);\n  function open(name, grow) {\n    name = resolveSceneName(name);\n    if (!cards.some(c => c.name === name)) { leave(); return; }\n    player?.close();")
    text = text.replace("petalorbit: 'blooms' }", "petalorbit: 'blooms', sand: 'deepwaves' }")
    text = text.replace("  const asked = new URLSearchParams(location.search).get('scene');", "  const asked = resolveSceneName(new URLSearchParams(location.search).get('scene'));")
    text = text.replace("    if (!history.state?.scene) history.replaceState({ scene: asked, cold: true }, '');", "    if (history.state?.scene !== asked) history.replaceState({ ...history.state, scene: asked, cold: history.state?.cold ?? true }, '');")
    path.write_text(text)
    path = ROOT / 'live/poster.js'
    text = path.read_text().replace("import * as essentials from './s-essentials.js';\n", '').replace(', essentials', '').replace("set('WAVZ', spec.mark", "set('SCENES', spec.mark")
    path.write_text(text)
    path = ROOT / 'live/sound.js'
    text = path.read_text().replace('export function makeSound(sceneName) {', 'export function makeSound(sceneName, sourceName = sceneName) {')
    text = text.replace('const TRACKS = tracksFor(sceneName);', 'const TRACKS = tracksFor(sourceName);')
    text = text.replace('LAYERS[sceneName]', 'LAYERS[sourceName]').replace('amb_${sceneName}', 'amb_${sourceName}').replace('music_${sceneName}', 'music_${sourceName}')
    if 'const resume = () =>' not in text:
        text = text.replace('    const s = { play, next:', "    const resume = () => {\n      players[cur].a.play().catch(() => {});\n      const spare = players[1 - cur];\n      if (!spare.a.src) spare.a.src = new URL(files[(i + 1) % files.length], base);\n      spare.a.play().then(() => { if (players[cur] !== spare) spare.a.pause(); }).catch(() => {});\n    };\n    const s = { play, resume, next:")
    text = text.replace('    resume: () => ac.resume(),', '    resume: () => { const pending = ac.resume(); streams.forEach((s) => s.resume()); return pending.catch(() => {}); },')
    path.write_text(text)

if __name__ == '__main__':
    main()
