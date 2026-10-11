#!/usr/bin/env python3
"""Retain authored clock-depth boundaries when refreshing the upstream scenes."""
import json
import re
from pathlib import Path

# Paint order, back to front. Anchors are original source lines; labels appear in the picker.
LAYERS = {
    'beach': [('water', 'Water', '  for (let j = 0; j < G.BANDS; j++) {'), ('shore', 'Beach', '  F(ctx, (c) => G.foam(c, p)'), ('palm', 'Palm tree', '  const P = G.palm(p);')],
    'jungle': [('falls', 'Waterfall and cliffs', '  // far ridge, mist, then the cliff and its waterfall'), ('pool', 'Pool', '  // pool: slow bands'), ('trees', 'Trees and vines', '  // trunks, canopy and vines'), ('leaves', 'Foreground leaves', '  // foreground: big leaves')],
    'harbor': [('quay', 'Harbour buildings', '  // the quay: houses'), ('water', 'Harbour water', '  // the harbor: slow bands'), ('pier', 'Pier', '  // the pier in the near corner'), ('lanterns', 'Hanging lanterns', '  // lanterns strung across the top;')],
    'campfire': [('mountains', 'Mountains', '  // the ranges, far to near'), ('camp', 'Camp and ridge', "  // the ridge, the fire's light"), ('pines', 'Pine trees', '  // pines either side')],
    'train': [('train', 'Train', '  // the train, drawn about'), ('lake', 'Lake', '  // lake: bands'), ('reeds', 'Reeds', '  // reeds on the near shore')],
    'mesa': [('mesas', 'Mesas', '  // tableland on the horizon'), ('cacti', 'Windmill and cacti', '  // foreground: the wind pump')],
    'aurora': [('lake', 'Lake', '  // the lake: the curtains'), ('cabin', 'Cabin and snowbank', '  // near bank: lit snow'), ('pines', 'Pine trees', '  // pines either side;')],
    'storm': [('clouds', 'Storm clouds', '  // the anvil:'), ('wheat', 'Wheat fields', '  // wheat: rows'), ('stalks', 'Near stalks', '  // the nearest stalks')],
    'snowfall': [('town', 'Town', '  // wooded hill behind the town'), ('lamp', 'Street lamp', "  // the lamp's glow"), ('trees', 'Bare trees', '  // bare trees, rocking')],
    'fogbank': [('bay', 'Bay', '  // the bay: slow bands'), ('bridge', 'Bridge', '  // the bridge\n'), ('pines', 'Near shore and pines', '  // the near shore:')],
    'gale': [('tree', 'Tree', '    // the tree: trunk'), ('fence', 'Fence and kite', '    // fence, the swinging gate'), ('grass', 'Near grass', '  // the near slope and its long grass')],
    'rainbow': [('hills', 'Hills', '  // the hills, with clumps'), ('grass', 'Roadside grass', '  // verges of dark grass'), ('branch', 'Overhanging branch', '  // the overhanging branch:')],
    'cafe': [('window', 'Window and counter', '  // the room: wall, frame'), ('curtain', 'Curtain and lamp', '  // curtain tied back'), ('plant', 'Plant', '  // a plant in a pot')],
    'sleeper': [('room', 'Compartment', '  // ---- the compartment'), ('curtains', 'Curtains', '  // curtains on a brass rod'), ('table', 'Table and lamp', '  // the table: lamp')],
    'cabinwin': [('window', 'Window frame', '  // the log wall, the frame'), ('curtains', 'Curtains', '  // knitted curtains'), ('candle', 'Candle and kettle', '  // candle in a brass dish')],
    'loft': [('window', 'Window frame', '  // the room: brick wall'), ('plants', 'Plants', '  // plants: pots on the sill'), ('bulb', 'Hanging bulb', '  // a bare bulb on its cord')],
    'seaview': [('window', 'Window and shutters', '  // the room in shade:'), ('flowers', 'Geraniums', '  // geraniums:'), ('curtain', 'Sheer curtain', '  // the sheer curtain:')],
    'terraces': [('fields', 'Terraced fields', '  const WALL = [P.j1'), ('near-fields', 'Near terraces', '    const L = LV[j], u = L.u', 'if (j === Math.floor(N / 2)) '), ('palms', 'Foreground palms', '  // foreground: a dark bank')],
    'lavender': [('field', 'Lavender rows', '  // the field: wedges'), ('farm', 'Meadow and farmhouse', '  // the meadow closes'), ('sprigs', 'Near lavender', '  // near sprigs')],
    'alpine': [('water', 'Near water', '  // the near water is darker'), ('trees', 'Wooded spit', '  // a wooded spit'), ('jetty', 'Jetty and pines', '  // near bank: the jetty')],
    'balloons': [('valley', 'Valley', '  // far tableland, then'), ('balloon', 'Near balloons', '  fly(G.FLEET[3]);'), ('spires', 'Foreground spires', '  // foreground: dark spires')],
    'savanna': [('plain', 'Grassland', '  // the plain: each band'), ('acacias', 'Near acacias', '      const st = 9 + 5 * j', 'if (j === BANDS.length - 1) '), ('grass', 'Tall grass', '  // tall seed heads')],
    'kelp': [('middle', 'Middle kelp', '  layer(0.4, () => {'), ('fish', 'Golden fish', '  F(ctx, (c) => school(c, G.GOLD'), ('near', 'Near kelp', '  layer(0.9, () => { kelp')],
    'coral': [('garden', 'Coral garden', '  for (const it of G.ITEMS) {'), ('near', 'Near corals', '    ctx.save(); ctx.translate(it.x', 'if (it.u > .65) '), ('bubbles', 'Bubbles', '  { const span = H + 60; ctx.strokeStyle = C.cream')],
    'wreck': [('ship', 'Shipwreck', '  layer(0.4, () => {'), ('anchor', 'Anchor and seabed', '  layer(0.55, () => {'), ('weed', 'Near seaweed', '  layer(0.9, () => { F(ctx, ridge(G.bed3)')],
    'jellies': [('far', 'Far jellyfish', '  // far jellies share'), ('middle', 'Middle jellyfish', '  for (const j of G.MIDS)'), ('near', 'Near jellyfish', '  for (const j of G.NEARS)')],
    'openblue': [('fish', 'Fish', '  // the bait ball:'), ('whale', 'Whale', '  // the whale:'), ('bubbles', 'Bubbles', '  { const span = H + 60; ctx.strokeStyle = C.cream')],
    'earthrise': [('earth', 'Earth', '  earth(ctx, ex, ey, R, t);'), ('ground', 'Lunar ridges', '  // the ground, far to near:'), ('lander', 'Lunar lander', '    const { x, y, s } = G.LANDER;'), ('near', 'Near ridges', '    ground(j, SURF[j]);', 'if (j === 2) ')],
    'giant': [('planet', 'Planet and rings', '  ctx.save(); ctx.translate(px, py); ctx.rotate(TILT);'), ('geyser', 'Geyser', '  layer(0.45, () => {'), ('ice', 'Near ice', '  layer(0.9, () =>')],
    'station': [('planet', 'Planet', '  // the planet: two thin'), ('station', 'Space station', '  // the station\n'), ('shuttle', 'Shuttle', '  // the shuttle:')],
    'mars': [('volcano', 'Volcano', '  // the volcano, with a darker foot'), ('plain', 'Base and rover', '  // the plain in three bands'), ('dunes', 'Near dunes', '  // dunes: each a lit crest')],
    'comet': [('comet', 'Comet', '  // the tails, the coma'), ('ice', 'Ice plain', '  // the ice: a low broken'), ('shards', 'Near ice shards', '  layer(0.95, () =>')],
    'needledrop': [('turntable', 'Turntable', '  c.save(); c.translate(x,y); c.rotate(-.085); deck'), ('sleeve', 'Record sleeve', '  // A graphic record sleeve'), ('mug', 'Mug and plant', '  // Sleeve seams, a warm mug')],
    'tapeloop': [('tape', 'Cassette', '  c.save();c.translate(W*.5,H*.53);'), ('receiver', 'Receiver', '  // A compact silver receiver'), ('case', 'Tape case and pencil', '  // A pencil, open tape case')],
    'bluehour': [('piano', 'Piano', '  c.save();c.translate(W*.5,H*.65);'), ('sheets', 'Music and lamp', '  // A small music stand'), ('bench', 'Piano bench', '  // The upholstered bench')],
    'brassmidnight': [('saxophone', 'Saxophone', '  const cx=W*.49,cy=H*.51;'), ('tables', 'Microphone and tables', '  // A vintage ribbon microphone')],
    'signalbloom': [('synth', 'Synthesizer', '  c.save();c.translate(W*.50,H*.54);'), ('cable', 'Output cable', '  // Coiled output cord'), ('headphones', 'Headphones', '  // Over-ear headphones')],
    'silkcurrent': [('rear', 'Rear ribbon', '  surface(c,rear,t,false);'), ('orb', 'Orb', '  const orb=c.createRadialGradient'), ('front-ribbon', 'Front ribbon', '  surface(c,front,t,true);')],
    'orbitaldrift': [('shell', 'Point cloud', '  // Two independently turning layers'), ('near-shell', 'Near points', '    c.save(); c.translate(0,cy); c.rotate(t*(i?', 'if (i === 1) '), ('meridians', 'Meridians', '  // Fine, broken meridians')],
    'tidalbloom': [('loops', 'All loops', '  for(let i=0;i<6;i++) {'), ('middle-loops', 'Three near loops', '    c.save(); c.rotate(i*.23', 'if (i === 3) '), ('near-loop', 'Nearest loop', '    c.save(); c.rotate(i*.23', 'if (i === 5) ')],
    'afterglowarcade': [('near-arches', 'Near arches', None), ('front-arch', 'Front arch', None), ('sculptures', 'Tree and porcelain orb', None)],
    'stacks': [('three-bars', 'Three newest bars', None), ('two-bars', 'Two newest bars', None), ('newest-bar', 'Newest bar', None)],
    'blooms': [('outer-petals', 'Outer petals', None), ('middle-petals', 'Middle petals', None), ('newest-bloom', 'Newest bloom', None)],
    'deepwaves': [('near-ripples', 'Near ripples', None), ('inner-ripples', 'Inner ripples', None), ('centre-ripple', 'Centre ripple', None)],
    'seadoor': [('door-shadow', 'Doorway and its shadow', None), ('stone-door', 'Stone doorway', None), ('desert-grass', 'Desert grass', None)],
    'endlessarches': [('middle-arches', 'Middle arches', None), ('near-arches', 'Near arches', None)],
    'hanginggardens': [('main-garden', 'Main floating garden', None), ('near-garden', 'Near floating garden', None)],
    'moonstairs': [('stairs', 'Stairway', None), ('handrails', 'Handrails', None), ('night-leaves', 'Night leaves', None)],
    'mirrorgarden': [('lake-rim', 'Lake banks', None), ('upright-trees', 'Upright trees', None), ('inverted-trees', 'Inverted trees', None)],
}


def apply_depth(root):
    """Idempotently annotate existing scenes and rebuild the browser's layer labels."""
    changes = {}
    for name, layers in LAYERS.items():
        path = root / 'live' / (name + '.js')
        if not any(layer[2] for layer in layers) or not path.exists():
            continue
        text = path.read_text()
        paint = re.search(r'export function paint\((\w+)', text)
        context = paint[1]
        for layer in layers:
            key, _, anchor = layer[:3]
            if not anchor or f".depthLayer?.('{key}')" in text:
                continue
            index = text.index(anchor, paint.start())
            line_start = text.rfind('\n', 0, index) + 1
            indent = re.match(r' *', text[line_start:])[0]
            condition = layer[3] if len(layer) > 3 else ''
            marker = f"{indent}{condition}{context}.depthLayer?.('{key}');\n"
            # Several boundaries can share one loop anchor; preserve their authored order.
            text = text[:line_start] + marker + text[line_start:]
        if text != path.read_text():
            changes[path] = text
    for path, text in changes.items():
        path.write_text(text)
    labels = {name: [{'id': key, 'label': label} for key, label, *_ in layers] for name, layers in LAYERS.items()}
    rows = ',\n'.join('  ' + json.dumps(name) + ': ' + json.dumps(layers) for name, layers in labels.items())
    (root / 'live/depth-layers.js').write_text('// Authored paint boundaries, back to front. Maintained by scene_depth.py.\nexport const DEPTH_LAYERS = {\n' + rows + '\n};\n')
    return len(changes)


if __name__ == '__main__':
    print(f'Depth boundaries updated in {apply_depth(Path(__file__).resolve().parent)} scenes.')
