import { NextResponse } from 'next/server';
import { verifyOtp, hashPassword } from '../../../../lib/portalAuth';
import { getDb, initDb } from '../../../../lib/db';

export const runtime = 'nodejs';

let dbReady = false;
async function ensureDb() {
  if (!dbReady) { await initDb(); dbReady = true; }
}

export async function POST(req) {
  try {
    const body     = await req.json();
    const email    = String(body?.email    || '').trim().toLowerCase();
    const otp      = String(body?.otp      || '').trim();
    const password = String(body?.password || '');

    if (!email || !otp || !password) {
      return NextResponse.json({ error: 'email, otp and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    await ensureDb();
    const sql = getDb();

    // Find a valid, unused OTP for this email
    const rows = await sql`
      SELECT id, otp_hash, expires_at
      FROM password_reset_otps
      WHERE email = ${email}
        AND used  = FALSE
        AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (!rows[0]) {
      await new Promise(r => setTimeout(r, 500)); // timing-safe
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    const { id, otp_hash } = rows[0];
    const valid = await verifyOtp(otp, otp_hash);

    if (!valid) {
      await new Promise(r => setTimeout(r, 500));
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    // Mark OTP used
    await sql`UPDATE password_reset_otps SET used = TRUE WHERE id = ${id}`;

    // Hash and store the new password
    const hash = await hashPassword(password);
    await sql`
      INSERT INTO admin_credentials (email, password_hash, updated_at)
      VALUES (${email}, ${hash}, NOW())
      ON CONFLICT (email) DO UPDATE
        SET password_hash = ${hash}, updated_at = NOW()
    `;

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('reset-password error:', e?.message);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
