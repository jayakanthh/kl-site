import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifySession } from '../../../../lib/portalAuth';
import { getDeptOrder, setDeptOrder } from '../../../../lib/portalStore';

export const runtime = 'nodejs';

function getAdminSession() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  const payload = verifySession(token);
  if (!payload || payload.role !== 'admin') return null;
  return payload;
}

export async function GET() {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const deptOrder = await getDeptOrder();
  return NextResponse.json({ deptOrder });
}

export async function PUT(req) {
  const session = getAdminSession();
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
