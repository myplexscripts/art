// The scenes of this series, in order. Each is a module with make, paint, title, no, text and dark.
import * as storm from './storm.js';
import * as snowfall from './snowfall.js';
import * as fogbank from './fogbank.js';
import * as gale from './gale.js';
import * as rainbow from './rainbow.js';

export const name = 'Weather Series';
export const scenes = { storm, snowfall, fogbank, gale, rainbow };
