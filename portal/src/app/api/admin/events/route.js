import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifySession } from '../../../../lib/portalAuth';
import { getEventList, createEvent, updateEventById, deleteEventById } from '../../../../lib/portalStore';

export const runtime = 'nodejs';

function getBearerToken(req) {
  const auth = req.headers.get('authorization') || '';
  return auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
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
  const events = await getEventList();
  return NextResponse.json({ events });
}

export async function POST(req) {
  const session = getAdminSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    if (!body?.title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    const created = await createEvent({
      title:       body.title,
      description: body.description  || '',
      departments: Array.isArray(body.departments) ? body.departments : [],
      eventDate:   body.eventDate    || null,
      imageUrl:    body.imageUrl     || '',
      link:        body.link         || '',
    });
    return NextResponse.json({ event: created }, { status: 201 });
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
    const patch = {};
    for (const f of ['title', 'description', 'departments', 'eventDate', 'imageUrl', 'link']) {
      if (body[f] !== undefined) patch[f] = body[f];
    }
    const updated = await updateEventById(id, patch);
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
    const id = body?.id;
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const ok = await deleteEventById(id);
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
