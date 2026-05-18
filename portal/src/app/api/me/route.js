import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { FACULTY_COOKIE, verifySession } from '../../../lib/portalAuth';
import { getFacultyById, updateFacultyById } from '../../../lib/portalStore';

export const runtime = 'nodejs';

function getBearerToken(req) {
  const auth = req.headers.get('authorization') || '';
  if (auth.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim();
  return '';
}

function getFacultySession(req) {
  const token = cookies().get(FACULTY_COOKIE)?.value || getBearerToken(req);
  const payload = verifySession(token);
  if (!payload || payload.role !== 'faculty' || !payload.facultyId) return null;
  return payload;
}

export async function GET(req) {
  const session = getFacultySession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const faculty = await getFacultyById(session.facultyId);
  if (!faculty) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ faculty });
}

export async function PUT(req) {
  const session = getFacultySession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const updated = await updateFacultyById(session.facultyId, {
      name: body?.name,
      department: body?.department,
      designation: body?.designation,
      photoUrl: body?.photoUrl,
      bio: body?.bio,
      researchInterests: body?.researchInterests,
      phone: body?.phone,
      office: body?.office,
      linkedin: body?.linkedin,
      googleScholar: body?.googleScholar,
      publications: body?.publications,
      password: body?.password,
    });
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ faculty: updated });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
