import { NextResponse } from 'next/server';
import { getPublicFacultyList } from '../../../lib/portalStore';

export const runtime = 'nodejs';

function toAbsoluteUrl(origin, url) {
  const u = String(url || '').trim();
  if (!u) return '';
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  if (!u.startsWith('/')) return u;
  return `${origin}${u}`;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req) {
  const origin = req?.nextUrl?.origin || '';
  const faculty = await getPublicFacultyList();
  const normalized = faculty.map((f) => ({
    ...f,
    photoUrl: toAbsoluteUrl(origin, f.photoUrl),
  }));
  return NextResponse.json({ faculty: normalized }, { headers: CORS_HEADERS });
}
