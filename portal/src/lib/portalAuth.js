import crypto from 'node:crypto';

// ─── Internal helpers ────────────────────────────────────────────────────────

function base64UrlEncode(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(input) {
  const padded = String(input).replace(/-/g, '+').replace(/_/g, '/');
  const padLen  = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + '='.repeat(padLen), 'base64').toString('utf8');
}

function hmac(input, secret) {
  return crypto.createHmac('sha256', secret).update(input).digest('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function timingSafeEqualString(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// ─── Brute-force rate limiter (in-memory, per-instance) ──────────────────────
// Tracks failed attempts per IP. Works well enough for a small admin portal.
// Each Vercel function instance has its own counter — that's acceptable here.

const MAX_ATTEMPTS  = 10;           // max failures before lockout
const WINDOW_MS     = 15 * 60_000;  // 15-minute sliding window
const LOCKOUT_MS    = 30 * 60_000;  // 30-minute lockout after max failures
const _attempts     = new Map();    // ip → { count, firstAt, lockedUntil }

export function checkRateLimit(ip) {
  const now  = Date.now();
  const key  = String(ip || 'unknown');
  const entry = _attempts.get(key) || { count: 0, firstAt: now, lockedUntil: 0 };

  if (entry.lockedUntil > now) {
    const retryAfter = Math.ceil((entry.lockedUntil - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Reset window if it's expired
  if (now - entry.firstAt > WINDOW_MS) {
    _attempts.set(key, { count: 0, firstAt: now, lockedUntil: 0 });
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedAttempt(ip) {
  const now   = Date.now();
  const key   = String(ip || 'unknown');
  const entry = _attempts.get(key) || { count: 0, firstAt: now, lockedUntil: 0 };

  if (now - entry.firstAt > WINDOW_MS) {
    _attempts.set(key, { count: 1, firstAt: now, lockedUntil: 0 });
    return;
  }

  const count = entry.count + 1;
  _attempts.set(key, {
    count,
    firstAt: entry.firstAt,
    lockedUntil: count >= MAX_ATTEMPTS ? now + LOCKOUT_MS : 0,
  });
}

export function clearAttempts(ip) {
  _attempts.delete(String(ip || 'unknown'));
}

// ─── Session cookie ──────────────────────────────────────────────────────────

export const ADMIN_COOKIE = 'klh_admin_session';

export function requireAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV !== 'production') {
      // Dev-only fallback — never reached in production (checked above)
      return 'dev-auth-secret-klh-change-in-env';
    }
    throw new Error('AUTH_SECRET env var is not set');
  }
  return secret;
}

export function signSession(payload, ttlSeconds) {
  const secret  = requireAuthSecret();
  const now     = Math.floor(Date.now() / 1000);
  const body    = JSON.stringify({ ...payload, exp: now + ttlSeconds });
  const encoded = base64UrlEncode(body);
  return `${encoded}.${hmac(encoded, secret)}`;
}

export function verifySession(token) {
  try {
    const secret  = requireAuthSecret();
    const [encoded, sig] = String(token || '').split('.');
    if (!encoded || !sig) return null;
    if (!timingSafeEqualString(sig, hmac(encoded, secret))) return null;
    const payload = JSON.parse(base64UrlDecode(encoded));
    if (!payload || typeof payload !== 'object') return null;
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== 'number' || payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

// ─── Credential validation ───────────────────────────────────────────────────
// Credentials come from env vars only — no hardcoded defaults in source.

export function validateAdminCredentials(email, password) {
  const envEmail    = String(process.env.ADMIN_EMAIL    || '').trim().toLowerCase();
  const envPassword = String(process.env.ADMIN_PASSWORD || '');

  if (!envEmail || !envPassword) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_EMAIL or ADMIN_PASSWORD env var is not set');
    }
    // In dev: require env vars to be explicitly set — don't fall back to hardcoded values
    return false;
  }

  const inEmail    = String(email    || '').trim().toLowerCase();
  const inPassword = String(password || '');

  const okEmail = inEmail === envEmail;
  // Pad both buffers to the same max length before timing-safe compare
  // to avoid leaking which field was wrong via timing
  const maxLen  = Math.max(envPassword.length, inPassword.length, 1);
  const bufEnv  = Buffer.alloc(maxLen); Buffer.from(envPassword).copy(bufEnv);
  const bufIn   = Buffer.alloc(maxLen); Buffer.from(inPassword).copy(bufIn);
  const okPass  = crypto.timingSafeEqual(bufEnv, bufIn);

  return okEmail && okPass;
}
