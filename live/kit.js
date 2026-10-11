// Shared by every poster in the series: the inks that recur, the frame margin, the title face, and the fill helper.
export const C = { ink: '#0a1530', navy: '#0e1c3a', deep: '#143258', teal: '#1d5a74', blue: '#2c7f97', cream: '#f2e5c3', orange: '#dd7f45', rust: '#b9653a', gold: '#f0bd4d' };
export const M = 44;
export { FONT } from './typography.js?v=20261011-clock-fix';
export const F = (ctx, build, fill) => { ctx.beginPath(); build(ctx); ctx.fillStyle = fill; ctx.fill(); };
