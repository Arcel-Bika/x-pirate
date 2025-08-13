import { NextResponse } from 'next/server';
import { getAllPlayers } from '@/data/store';
import { percentXP, noteGlobale } from '@/utils/calculations';

export async function GET() {
  try {
    const players = getAllPlayers();

    if (players.length === 0) {
      return NextResponse.json(
        {
          totalPlayers: 0,
          avgNote: 0,
          avgXP: 0,
          topPlayer: null,
          cohorts: [],
          distribution: { low: 0, medium: 0, high: 0 },
        },
        { status: 200 }
      );
    }

    const enriched = players.map((p) => ({
      ...p,
      percentXP: percentXP(p.xp),
      noteGlobale: noteGlobale(p.aarr),
    }));

    const totalPlayers = enriched.length;
    const avgNote =
      enriched.reduce((s, p) => s + p.noteGlobale, 0) / totalPlayers;
    const avgXP = enriched.reduce((s, p) => s + p.percentXP, 0) / totalPlayers;

    const topPlayerObj = enriched.reduce((best, cur) =>
      cur.noteGlobale > best.noteGlobale ? cur : best
    );

    const cohorts = [...new Set(enriched.map((p) => p.cohort).filter(Boolean))] as string[];

    const distribution = enriched.reduce(
      (acc, p) => {
        if (p.percentXP < 33) acc.low += 1;
        else if (p.percentXP < 67) acc.medium += 1;
        else acc.high += 1;
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );

    return NextResponse.json(
      {
        totalPlayers,
        avgNote: Number(avgNote.toFixed(1)),
        avgXP: Number(avgXP.toFixed(1)),
        topPlayer: topPlayerObj.name, // string attendu côté UI
        cohorts,
        distribution,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('GET /api/summary error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}