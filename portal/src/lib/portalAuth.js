import crypto from 'node:crypto';

function base64UrlEncode(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(input) {
  const padded = String(input).replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (padded.length % 4)) % 4;
  const withPad = padded + '='.repeat(padLen);
  return Buffer.from(withPad, 'base64').toString('utf8');
}

function hmac(input, secret) {
  return crypto.createHmac('sha256', secret).update(input).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function timingSafeEqualString(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export const ADMIN_COOKIE = 'klh_admin_session';

export function requireAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV !== 'production') {
      return 'dev-auth-secret-change-me';
    }
    throw new Error('AUTH_SECRET is not set');
  }
  return secret;
}

export function signSession(payload, ttlSeconds) {
  const secret = requireAuthSecret();
  const now = Math.floor(Date.now() / 1000);
  const exp = now + ttlSeconds;
  const body = JSON.stringify({ ...payload, exp });
  const encoded = base64UrlEncode(body);
  const sig = hmac(encoded, secret);
  return `${encoded}.${sig}`;
}

export function verifySession(token) {
  try {
    const secret = requireAuthSecret();
    const [encoded, sig] = String(token || '').split('.');
    if (!encoded || !sig) return null;
    const expected = hmac(encoded, secret);
    if (!timingSafeEqualString(sig, expected)) return null;
    const payload = JSON.parse(base64UrlDecode(encoded));
    if (!payload || typeof payload !== 'object') return null;
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== 'number' || payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

export function validateAdminCredentials(email, password) {
  const envEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const envPassword = String(process.env.ADMIN_PASSWORD || '');
  const inEmail = String(email || '').trim().toLowerCase();
  const inPassword = String(password || '');

  const isDev = process.env.NODE_ENV !== 'production';
  const devEmail = 'admin@klh.edu.in';
  const devPassword = 'Admin@123';
  const okDevEmail = inEmail === devEmail;
  const okDevPass =
    devPassword.length === inPassword.length &&
    crypto.timingSafeEqual(Buffer.from(inPassword), Buffer.from(devPassword));
  if (isDev && okDevEmail && okDevPass) return true;

  if (!envEmail || !envPassword) {
    if (isDev) return false;
    throw new Error('ADMIN_EMAIL or ADMIN_PASSWORD is not set');
  }
  const okEmail = inEmail === envEmail;
  const okPass =
    envPassword.length === inPassword.length &&
    crypto.timingSafeEqual(Buffer.from(inPassword), Buffer.from(envPassword));
  return okEmail && okPass;
}
