// The scenes of this series, in order. Each is a module with make, paint, title, no, text and dark.
import * as earthrise from './earthrise.js?v=20261011-focus-finish';
import * as giant from './giant.js?v=20261011-focus-finish';
import * as station from './station.js?v=20261011-focus-finish';
import * as mars from './mars.js?v=20261011-focus-finish';
import * as comet from './comet.js?v=20261011-focus-finish';

export const name = 'Orbit Series';
export const scenes = { earthrise, giant, station, mars, comet };
