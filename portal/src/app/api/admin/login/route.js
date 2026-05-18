import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, signSession, validateAdminCredentials } from '../../../../lib/portalAuth';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body?.email;
    const password = body?.password;
    const ok = validateAdminCredentials(email, password);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signSession({ role: 'admin', email: String(email || '').trim().toLowerCase() }, 60 * 60 * 8);
    const res = NextResponse.json({ ok: true, token });
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: req.nextUrl?.protocol === 'https:',
      path: '/',
      maxAge: 60 * 60 * 8,
    });
    return res;
  } catch (e) {
    const message = e?.message === 'ADMIN_EMAIL or ADMIN_PASSWORD is not set' ? e.message : 'Bad request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
