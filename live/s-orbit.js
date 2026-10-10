// The scenes of this series, in order. Each is a module with make, paint, title, no, text and dark.
import * as earthrise from './earthrise.js';
import * as giant from './giant.js';
import * as station from './station.js';
import * as mars from './mars.js';
import * as comet from './comet.js';

export const name = 'Orbit Series';
export const scenes = { earthrise, giant, station, mars, comet };
