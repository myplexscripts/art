#!/usr/bin/env python3
"""Download every published ambience layer and music track used by the posters."""
import hashlib
import json
import re
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
STORE = 'https://cdn.wavz.us/'
scene_names = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', "import { SCENES } from './live/poster.js'; console.log(JSON.stringify(Object.keys(SCENES).filter(name => SCENES[name].audio !== false)))"], cwd=ROOT))
sound = (ROOT / 'live/sound.js').read_text()
layers = {name: re.findall(r"'([^']+\.mp3)'", layer) for name, layer in re.findall(r'^  (\w+): (\[.*\]),$', sound, re.M)}
names = []
for scene in scene_names:
    names.extend(layers.get(scene, [f'amb_{scene}_1.mp3', f'amb_{scene}_2.mp3']))
    names.extend(f'music_{scene}_{letter}.mp3' for letter in ('abcd' if scene in ('beach', 'jungle') else 'ab'))
target = ROOT / 'live/audio'
target.mkdir(parents=True, exist_ok=True)

def download(name):
    path = target / name
    try:
        if not path.exists():
            for attempt in range(3):
                try:
                    with urlopen(Request(STORE + name, headers={'User-Agent': 'Mozilla/5.0'}), timeout=90) as response:
                        if 'audio' not in response.headers.get('content-type', ''):
                            raise ValueError('Unexpected content type for ' + name)
                        with path.with_suffix('.part').open('wb') as output:
                            while chunk := response.read(1024 * 1024):
                                output.write(chunk)
                    path.with_suffix('.part').replace(path)
                    break
                except HTTPError:
                    raise
                except Exception:
                    if attempt == 2:
                        raise
        data = path.read_bytes()
        return {'path': str(path.relative_to(ROOT)), 'url': STORE + name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
    except HTTPError as error:
        if error.code == 404:
            return {'url': STORE + name, 'status': 404}
        raise RuntimeError(f'Unable to download {STORE + name}: HTTP {error.code}') from error

files, missing = [], []
with ThreadPoolExecutor(max_workers=8) as pool:
    futures = {pool.submit(download, name): name for name in names}
    for future in as_completed(futures):
        result = future.result()
        (missing if result.get('status') == 404 else files).append(result)
        print(f"{len(files) + len(missing)}/{len(names)} {futures[future]} " + ('not published' if result.get('status') else str(result['bytes'])), flush=True)
(ROOT / 'wavz-audio.json').write_text(json.dumps({'source': STORE, 'files': sorted(files, key=lambda f: f['path']), 'not_published': sorted(missing, key=lambda f: f['url'])}, indent=2) + '\n')
print(f'Downloaded {len(files)} audio files, {sum(f["bytes"] for f in files):,} bytes; {len(missing)} unavailable at source.')
