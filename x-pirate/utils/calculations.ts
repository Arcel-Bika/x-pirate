import { AARR, XP } from '../types/player';

export function percentXP(xp: XP): number {
  if (!xp?.max || xp.max === 0) return 0;
  return Math.round((xp.current / xp.max) * 100);
}

export function noteGlobale(aarr: AARR): number {
  const clamp = (v: number) => Math.min(100, Math.max(0, v ?? 0));
  const sum = clamp(aarr.acq) + clamp(aarr.act) + clamp(aarr.ret) + clamp(aarr.ref) + clamp(aarr.rev);
  return Math.round(sum / 10); // Max 50 points (5 métriques * 10 points chacune)
}

export function formatAARR(aarr: AARR): string {
  return `A:${aarr.acq} A:${aarr.act} R:${aarr.ret} R:${aarr.ref} R:${aarr.rev}`;
}