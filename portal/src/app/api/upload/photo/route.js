import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import crypto from 'node:crypto';
import { FACULTY_COOKIE, verifySession } from '../../../../lib/portalAuth';

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

function extFromMime(mime) {
  if (mime === 'image/jpeg') return '.jpg';
  if (mime === 'image/png') return '.png';
  if (mime === 'image/webp') return '.webp';
  return '';
}

export async function POST(req) {
  const session = getFacultySession(req);
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
    const maxBytes = 2 * 1024 * 1024;
    if (buf.length > maxBytes) {
      return NextResponse.json({ error: 'Max file size is 2MB' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'data', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const key = `${session.facultyId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    const filePath = path.join(uploadsDir, key);
    await writeFile(filePath, buf);

    return NextResponse.json({ photoUrl: `/api/uploads/${encodeURIComponent(key)}` });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
