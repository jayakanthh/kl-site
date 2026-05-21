import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE, signSession, validateAdminCredentials,
  checkRateLimit, recordFailedAttempt, clearAttempts,
} from '../../../../lib/portalAuth';

export const runtime = 'nodejs';

function getClientIp(req) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(req) {
  const ip = getClientIp(req);

  // ── Rate limit check ──────────────────────────────────────────────────────
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${Math.ceil(rl.retryAfter / 60)} minutes.` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  try {
    const body     = await req.json();
    const email    = body?.email;
    const password = body?.password;

    let ok = false;
    try {
      ok = await validateAdminCredentials(email, password);
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }

    if (!ok) {
      // Add artificial delay on failure (slows automated brute-force)
      await new Promise(r => setTimeout(r, 800 + Math.random() * 400));
      recordFailedAttempt(ip);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Success — clear any previous failures for this IP
    clearAttempts(ip);

    const isHttps = req.nextUrl?.protocol === 'https:';
    const token   = signSession(
      { role: 'admin', email: String(email || '').trim().toLowerCase() },
      60 * 60 * 8, // 8-hour session
    );

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,          // JS cannot read this cookie
      sameSite: 'strict',      // no cross-site requests at all
      secure: isHttps,         // HTTPS only in production
      path: '/',
      maxAge: 60 * 60 * 8,
    });
    return res;

  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
