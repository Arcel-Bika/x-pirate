import { z } from 'zod';

export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Le nom est requis'),
  xp: z.object({
    current: z.number().min(0),
    max: z.number().min(1)
  }),
  aarr: z.object({
    acq: z.number().min(0).max(100),
    act: z.number().min(0).max(100),
    ret: z.number().min(0).max(100),
    ref: z.number().min(0).max(100),
    rev: z.number().min(0).max(100)
  }),
  cohort: z.string().optional(),
  lastSeen: z.string().optional(),
  sessions7d: z.number().min(0).optional()
});

export const PlayersArraySchema = z.array(PlayerSchema);