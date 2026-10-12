// The scenes of this series, in order. Each is a module with make, paint, title, no, text and dark.
import * as cafe from './cafe.js?v=20261011-clock-controls';
import * as sleeper from './sleeper.js?v=20261011-clock-controls';
import * as cabinwin from './cabinwin.js?v=20261011-clock-controls';
import * as loft from './loft.js?v=20261011-clock-controls';
import * as seaview from './seaview.js?v=20261011-clock-controls';

export const name = 'Window Series';
export const scenes = { cafe, sleeper, cabinwin, loft, seaview };
