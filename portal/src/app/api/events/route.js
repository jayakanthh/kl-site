import { NextResponse } from 'next/server';
import { getEventList } from '../../../lib/portalStore';

export const runtime = 'nodejs';

export async function GET() {
  const events = await getEventList();
  return NextResponse.json({ events }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
