import { NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '../../../../lib/portalAuth';

export const runtime = 'nodejs';

export async function POST(req) {
  const isHttps = req.nextUrl?.protocol === 'https:';
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: isHttps,
    path: '/',
    maxAge: 0,
  });
  return res;
}
