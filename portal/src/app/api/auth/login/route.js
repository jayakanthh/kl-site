import { NextResponse } from 'next/server';
import { validateFacultyCredentials } from '../../../../lib/portalStore';
import { FACULTY_COOKIE, signSession } from '../../../../lib/portalAuth';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body?.email;
    const password = body?.password;
    const faculty = await validateFacultyCredentials(email, password);
    if (!faculty) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signSession({ role: 'faculty', facultyId: faculty.id, email: faculty.email }, 60 * 60 * 24 * 7);
    const res = NextResponse.json({ ok: true, token });
    res.cookies.set(FACULTY_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
