import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';
import crypto from 'node:crypto';
import { ADMIN_COOKIE, verifySession } from '../../../../lib/portalAuth';

export const runtime = 'nodejs';

function getAdminSession() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  const payload = verifySession(token);
  if (!payload || payload.role !== 'admin') return null;
  return payload;
}

function extFromMime(mime) {
  if (mime === 'image/jpeg') return '.jpg';
  if (mime === 'image/png') return '.png';
  if (mime === 'image/webp') return '.webp';
  return '';
}

export async function POST(req) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get('file');

    if (!file || typeof file !== 'object' || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }

    const mime = String(file.type || '');
    const ext = extFromMime(mime);
    if (!ext) {
      return NextResponse.json({ error: 'Only JPG, PNG, WEBP allowed' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    if (buf.length > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'Max file size is 2MB' }, { status: 400 });
    }

    const key = `faculty-photos/${crypto.randomUUID()}-${Date.now()}${ext}`;
    const blob = await put(key, buf, { access: 'public', contentType: mime });

    return NextResponse.json({ url: blob.url });
  } catch (e) {
    const msg = e?.message || String(e) || 'Upload failed';
    console.error('Upload error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
