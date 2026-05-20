import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifySession } from '../../../../lib/portalAuth';
import { getDeptOrder, setDeptOrder } from '../../../../lib/portalStore';

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
  const deptOrder = await getDeptOrder();
  return NextResponse.json({ deptOrder });
}

export async function PUT(req) {
  const session = getAdminSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    if (!Array.isArray(body?.deptOrder)) {
      return NextResponse.json({ error: 'deptOrder must be an array' }, { status: 400 });
    }
    const deptOrder = await setDeptOrder(body.deptOrder);
    return NextResponse.json({ deptOrder });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
