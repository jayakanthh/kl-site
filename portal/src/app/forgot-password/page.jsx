'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail]         = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');
  const [sent, setSent]           = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res  = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Request failed');
      setSent(true);
    } catch (err) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />

      <div className="login-card">
        <div className="login-logo-wrap">
          <img src="/logo-final.png" alt="KLH University" className="login-logo" />
        </div>
        <div className="login-divider" />

        <div className="login-heading">
          <h1>Reset Password</h1>
          <p>Enter your admin email to receive a reset code</p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📬</div>
            <p style={{ color: 'var(--secondary-color)', fontWeight: 700, marginBottom: 6 }}>
              Check your inbox
            </p>
            <p style={{ color: '#666', fontSize: '0.88rem', marginBottom: 20 }}>
              If that email is registered, a 6-digit code is on its way.
              It expires in 10 minutes.
            </p>
            <button
              className="portal-btn login-btn"
              onClick={() => router.push('/reset-password')}
            >
              Enter reset code →
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="login-form">
            <div className="float-field">
              <input
                id="fp-email"
                className="float-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder=" "
                autoComplete="email"
                required
              />
              <label htmlFor="fp-email" className="float-label">Admin email</label>
            </div>

            {error && (
              <div className="portal-error portal-toast" style={{ fontSize: '0.88rem' }}>{error}</div>
            )}

            <button
              className="portal-btn login-btn"
              type="submit"
              disabled={!email.trim() || submitting}
            >
              {submitting ? <><span className="login-spinner" /> Sending…</> : 'Send reset code'}
            </button>

            <button
              type="button"
              className="portal-btn portal-btn-secondary"
              style={{ marginTop: 8 }}
              onClick={() => router.push('/')}
            >
              ← Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
