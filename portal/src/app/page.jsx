'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');

  const canSubmit = useMemo(() => email.trim() && password.trim() && !submitting, [email, password, submitting]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST', credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const text = await res.text().catch(() => '');
      if (!res.ok) {
        const msg = (() => { try { return JSON.parse(text)?.error; } catch { return null; } })();
        throw new Error(msg || text || `Login failed (${res.status})`);
      }
      // Auth is handled by the httpOnly cookie set by the server — no token storage in JS
      router.push('/admin/faculty');
      router.refresh();
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-screen">
      {/* Decorative blobs */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo-wrap">
          <img src="/logo-final.png" alt="KLH University" className="login-logo" />
        </div>

        <div className="login-divider" />

        {/* Heading */}
        <div className="login-heading">
          <h1>Faculty Profiles Portal</h1>
          <p>KLH Bachupally</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="login-form">
          <div className="float-field">
            <input
              id="login-email"
              className="float-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder=" "
              autoComplete="username"
            />
            <label htmlFor="login-email" className="float-label">Email</label>
          </div>

          <div className="float-field">
            <input
              id="login-password"
              className="float-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder=" "
              autoComplete="current-password"
            />
            <label htmlFor="login-password" className="float-label">Password</label>
          </div>

          {error && (
            <div className="portal-error portal-toast" style={{ fontSize: '0.88rem' }}>{error}</div>
          )}

          <button className="portal-btn login-btn" type="submit" disabled={!canSubmit}>
            {submitting
              ? <><span className="login-spinner" /> Signing in…</>
              : 'Sign in'
            }
          </button>
        </form>
      </div>
    </div>
  );
}
