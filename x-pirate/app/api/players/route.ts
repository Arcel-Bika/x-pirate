import { NextRequest, NextResponse } from 'next/server';
import { getAllPlayers } from '@/data/store';
import { percentXP, noteGlobale } from '../../../utils/calculations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Query params
    const sort = (searchParams.get('sort') || 'noteGlobale') as
      | 'noteGlobale'
      | 'percentXP'
      | 'name'
      | 'sessions7d'
      | 'lastSeen';
    const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc';
    const cohort = searchParams.get('cohort');
    const search = searchParams.get('search')?.toLowerCase() ?? '';

    const minXP = searchParams.get('minXP');
    const maxXP = searchParams.get('maxXP');

    let players = getAllPlayers();

    // Filters
    if (search) {
      players = players.filter((p) => p.name.toLowerCase().includes(search));
    }
    if (cohort) {
      players = players.filter((p) => p.cohort === cohort);
    }
    if (minXP !== null || maxXP !== null) {
      const min = minXP !== null ? Number(minXP) : 0;
      const max = maxXP !== null ? Number(maxXP) : 100;
      players = players.filter((p) => {
        const xpPct = percentXP(p.xp);
        return xpPct >= min && xpPct <= max;
      });
    }

    // Enrich with computed fields
    const enriched = players.map((p) => ({
      ...p,
      percentXP: percentXP(p.xp),
      noteGlobale: noteGlobale(p.aarr),
    }));

    // Sorting
    enriched.sort((a, b) => {
      let cmp = 0;
      switch (sort) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'percentXP':
          cmp = a.percentXP - b.percentXP;
          break;
        case 'sessions7d':
          cmp = (a.sessions7d ?? 0) - (b.sessions7d ?? 0);
          break;
        case 'lastSeen':
          // Most recent first if desc
          cmp =
            new Date(a.lastSeen ?? '1970-01-01').getTime() -
            new Date(b.lastSeen ?? '1970-01-01').getTime();
          break;
        case 'noteGlobale':
        default:
          cmp = a.noteGlobale - b.noteGlobale;
          break;
      }
      return order === 'desc' ? -cmp : cmp;
    });

    return NextResponse.json(enriched, { status: 200 });
  } catch (err) {
    console.error('GET /api/players error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}