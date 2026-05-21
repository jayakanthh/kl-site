import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { Resend } from 'resend';
import { generateOtp, hashOtp } from '../../../../lib/portalAuth';
import { getDb, initDb } from '../../../../lib/db';

export const runtime = 'nodejs';

let dbReady = false;
async function ensureDb() {
  if (!dbReady) { await initDb(); dbReady = true; }
}

// Simple rate limit: max 3 OTP requests per email per 15 min
const _otpRl = new Map(); // email → { count, firstAt }
function checkOtpRateLimit(email) {
  const now   = Date.now();
  const entry = _otpRl.get(email) || { count: 0, firstAt: now };
  if (now - entry.firstAt > 15 * 60_000) {
    _otpRl.set(email, { count: 1, firstAt: now });
    return true;
  }
  if (entry.count >= 3) return false;
  _otpRl.set(email, { count: entry.count + 1, firstAt: entry.firstAt });
  return true;
}

export async function POST(req) {
  try {
    const body  = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    // Always respond with success to avoid revealing whether email is registered
    if (!adminEmail || email !== adminEmail) {
      await new Promise(r => setTimeout(r, 600)); // timing-safe
      return NextResponse.json({ ok: true });
    }

    if (!checkOtpRateLimit(email)) {
      return NextResponse.json(
        { error: 'Too many requests. Try again in 15 minutes.' },
        { status: 429 },
      );
    }

    const otp     = generateOtp();
    const otpHash = await hashOtp(otp);
    const id      = crypto.randomUUID();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await ensureDb();
    const sql = getDb();

    // Invalidate any previous unused OTPs for this email
    await sql`UPDATE password_reset_otps SET used = TRUE WHERE email = ${email} AND used = FALSE`;

    // Store the new OTP
    await sql`
      INSERT INTO password_reset_otps (id, email, otp_hash, expires_at)
      VALUES (${id}, ${email}, ${otpHash}, ${expires.toISOString()})
    `;

    // Send email
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const resend = new Resend(resendKey);
    const fromAddr = process.env.RESEND_FROM || 'noreply@klh.edu.in';

    await resend.emails.send({
      from: `KLH Portal <${fromAddr}>`,
      to:   email,
      subject: 'Your password reset code — KLH Faculty Portal',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
          <img src="https://klh.edu.in/wp-content/uploads/2022/04/KLH-New-Logo.png"
               alt="KL University" style="height:48px;margin-bottom:24px" />
          <h2 style="margin:0 0 8px;color:#2E3A59">Password Reset Code</h2>
          <p style="color:#666;margin:0 0 24px">
            Use the code below to reset your KLH Faculty Portal password.
            It expires in <strong>10 minutes</strong>.
          </p>
          <div style="background:#f5f5f5;border-radius:12px;padding:24px;text-align:center;
                      font-size:36px;font-weight:800;letter-spacing:10px;color:#2E3A59">
            ${otp}
          </div>
          <p style="color:#999;font-size:13px;margin:24px 0 0">
            If you didn't request this, ignore this email — your password won't change.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('forgot-password error:', e?.message);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
