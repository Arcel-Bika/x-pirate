import { NextRequest, NextResponse } from 'next/server';
import { upsertPlayers, getPlayersCount } from '@/data/store';
import { PlayersArraySchema } from '../../../utils/validation';
import { z } from 'zod';

// Optionnel: accepter aussi un objet unique
const SingleOrArraySchema = z.union([PlayersArraySchema, PlayersArraySchema.element()]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = SingleOrArraySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid data format',
          details: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const asArray = Array.isArray(parsed.data) ? parsed.data : [parsed.data];
    // Upsert in-memory
    upsertPlayers(asArray);

    return NextResponse.json(
      {
        success: true,
        ingested: asArray.length,
        totalPlayers: getPlayersCount(),
      },
      { status: 200 }
    );
  } catch (err: any) {
    // JSON parse error
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    console.error('POST /api/ingest error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}