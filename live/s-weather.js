// The scenes of this series, in order. Each is a module with make, paint, title, no, text and dark.
import * as storm from './storm.js?v=20261011-dreamscapes';
import * as snowfall from './snowfall.js?v=20261011-dreamscapes';
import * as fogbank from './fogbank.js?v=20261011-dreamscapes';
import * as gale from './gale.js?v=20261011-dreamscapes';
import * as rainbow from './rainbow.js?v=20261011-dreamscapes';

export const name = 'Weather Series';
export const scenes = { storm, snowfall, fogbank, gale, rainbow };
