import { NextResponse } from 'next/server';
import path from 'node:path';
import { readFile } from 'node:fs/promises';

export const runtime = 'nodejs';

function mimeFromKey(key) {
  const lower = String(key).toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'application/octet-stream';
}

export async function GET(_req, { params }) {
  const key = String(params?.key || '');
  if (!key || key.includes('..') || key.includes('/') || key.includes('\\')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'uploads', key);
    const buf = await readFile(filePath);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'content-type': mimeFromKey(key),
        'cache-control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

