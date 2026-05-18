import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifySession } from '../../../../lib/portalAuth';
import { clearFaculty, createFaculty, deleteFacultyById, getAdminFacultyList, updateFacultyById } from '../../../../lib/portalStore';

export const runtime = 'nodejs';

function getBearerToken(req) {
  const auth = req.headers.get('authorization') || '';
  if (auth.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim();
  return '';
}

function getAdminSession(req) {
  const token = cookies().get(ADMIN_COOKIE)?.value || getBearerToken(req);
  const payload = verifySession(token);
  if (!payload || payload.role !== 'admin') return null;
  return payload;
}

export async function GET(req) {
  const session = getAdminSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const faculty = await getAdminFacultyList();
  return NextResponse.json({ faculty });
}

export async function POST(req) {
  const session = getAdminSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const created = await createFaculty({
      email: body?.email,
      name: body?.name,
      department: body?.department,
      designation: body?.designation,
      password: body?.password,
    });
    return NextResponse.json({ faculty: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e?.message || 'Bad request') }, { status: 400 });
  }
}

export async function PUT(req) {
  const session = getAdminSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const id = body?.id;
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const updated = await updateFacultyById(id, { password: body?.password });
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

export async function DELETE(req) {
  const session = getAdminSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json().catch(() => null);
    if (body?.all) {
      await clearFaculty();
      return NextResponse.json({ ok: true });
    }
    const id = body?.id;
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const ok = await deleteFacultyById(id);
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
