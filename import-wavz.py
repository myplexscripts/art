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
    manifest.update(start_url='./', scope='./')
    for icon in manifest['icons']:
        icon['src'] = './' + icon['src'].lstrip('/')
    path.write_text(json.dumps(manifest, indent=2) + '\n')
    # Retain the locally authored Music Series when refreshing the WAVZ snapshot.
    if (ROOT / 'live/s-music.js').exists():
        path = ROOT / 'index.html'
        path.write_text(path.read_text().replace('Made by <a href="https://nicksaulino.com" rel="author">Nick Saulino</a>', 'WAVZ originals by <a href="https://nicksaulino.com" rel="author">Nick Saulino</a> · Original Music Series made for this collection'))
        path = ROOT / 'live/poster.js'
        text = path.read_text().replace("import * as orbit from './s-orbit.js';", "import * as orbit from './s-orbit.js';\nimport * as music from './s-music.js';")
        text = text.replace('[nocturne, weather, windows, daybreak, deep, orbit]', '[nocturne, weather, windows, daybreak, deep, orbit, music]')
        path.write_text(text)
        path = ROOT / 'live/player.js'
        text = path.read_text().replace('.wz-ui [hidden], .wz-mark[hidden]', '.wz-ui [hidden], .wz-ui .wz-row[hidden], .wz-mark[hidden]')
        marker = "  const muted = { amb: localStorage.getItem('wavz-ambience-off')"
        text = text.replace(marker, "  const hasAudio = SCENES[name].audio !== false;\n  root.querySelector('.wz-r2').hidden = !hasAudio;\n" + marker)
        text = text.replace('  async function startSound() {', '  async function startSound() {\n    if (!hasAudio) return;')
        text = text.replace('  on = !(muted.amb && muted.mus); levels();', '  on = hasAudio && !(muted.amb && muted.mus); levels();')
        path.write_text(text)

if __name__ == '__main__':
    main()
